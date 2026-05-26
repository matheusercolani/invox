export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/whatsapp";
import {
  findWaConnectionByPhoneNumberId,
  upsertWaConversation,
  insertWaMessage,
  updateWaMessageStatus,
} from "@/lib/db-whatsapp";

// GET — Meta webhook challenge verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mode      = searchParams.get("hub.mode");
  const token     = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.WA_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge ?? "", { status: 200 });
  }
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

// POST — Receive messages from Meta
export async function POST(request: NextRequest) {
  const rawBody   = await request.text();
  const signature = request.headers.get("x-hub-signature-256") ?? "";

  if (!(await verifyWebhookSignature(rawBody, signature))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Always respond 200 quickly — process async
  processWebhook(payload).catch(console.error);
  return NextResponse.json({ ok: true });
}

async function processWebhook(payload: Record<string, unknown>) {
  const entries = (payload.entry as unknown[]) ?? [];

  for (const entry of entries) {
    const changes = ((entry as Record<string, unknown>).changes as unknown[]) ?? [];

    for (const change of changes) {
      const ch = change as Record<string, unknown>;
      if (ch.field !== "messages") continue;

      const value = ch.value as Record<string, unknown>;
      const metadata = value.metadata as Record<string, string>;
      const phoneNumberId = metadata?.phone_number_id;

      const connection = await findWaConnectionByPhoneNumberId(phoneNumberId);
      if (!connection) continue;

      const now = Math.floor(Date.now() / 1000);

      // Handle incoming messages
      const messages = (value.messages as unknown[]) ?? [];
      const contacts = (value.contacts as unknown[]) ?? [];

      for (const raw of messages) {
        const msg = raw as Record<string, unknown>;
        const contact = (contacts as Record<string, unknown>[]).find(
          (c) => c.wa_id === msg.from
        );
        const profile = (contact?.profile as Record<string, string>) ?? {};
        const body =
          msg.type === "text"
            ? ((msg.text as Record<string, string>)?.body ?? null)
            : `[${msg.type}]`;

        const conversationId = await upsertWaConversation({
          userId: connection.user_id,
          contactWaId: msg.from as string,
          contactName: profile.name ?? null,
          contactPhone: msg.from as string,
          lastMessageText: body,
          lastMessageAt: parseInt(msg.timestamp as string) || now,
        });

        await insertWaMessage({
          id: msg.id as string,
          conversation_id: conversationId,
          user_id: connection.user_id,
          direction: "inbound",
          type: (msg.type as string) ?? "text",
          body,
          status: "received",
          wa_timestamp: parseInt(msg.timestamp as string) || now,
          created_at: now,
        });
      }

      // Handle status updates (sent/delivered/read)
      const statuses = (value.statuses as unknown[]) ?? [];
      for (const raw of statuses) {
        const s = raw as Record<string, string>;
        await updateWaMessageStatus(s.id, s.status);
      }
    }
  }
}

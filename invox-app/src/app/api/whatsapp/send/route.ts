export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";
import { decryptToken, sendTextMessage } from "@/lib/whatsapp";
import { findWaConnectionByUserId, insertWaMessage, upsertWaConversation } from "@/lib/db-whatsapp";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { conversation_id, contact_wa_id, contact_phone, text } =
    await request.json() as {
      conversation_id: string;
      contact_wa_id: string;
      contact_phone: string;
      text: string;
    };

  if (!text?.trim() || !contact_wa_id) {
    return NextResponse.json({ error: "text e contact_wa_id são obrigatórios" }, { status: 400 });
  }

  const conn = await findWaConnectionByUserId(payload.sub!);
  if (!conn) {
    return NextResponse.json({ error: "WhatsApp não conectado" }, { status: 400 });
  }

  const accessToken = await decryptToken(conn.access_token_enc);
  const result = await sendTextMessage(conn.phone_number_id, accessToken, contact_wa_id, text.trim());

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  const now = Math.floor(Date.now() / 1000);

  const convId = conversation_id || await upsertWaConversation({
    userId: payload.sub!,
    contactWaId: contact_wa_id,
    contactPhone: contact_phone,
    lastMessageText: text.trim(),
    lastMessageAt: now,
  });

  await insertWaMessage({
    id: result.message_id ?? crypto.randomUUID(),
    conversation_id: convId,
    user_id: payload.sub!,
    direction: "outbound",
    type: "text",
    body: text.trim(),
    status: "sent",
    wa_timestamp: now,
    created_at: now,
  });

  return NextResponse.json({ ok: true, message_id: result.message_id });
}

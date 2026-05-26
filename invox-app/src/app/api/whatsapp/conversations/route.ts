export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";
import { getWaConversations, markConversationRead } from "@/lib/db-whatsapp";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const conversations = await getWaConversations(payload.sub!);
  return NextResponse.json({ conversations });
}

// PATCH — mark conversation as read
export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const { conversation_id } = await request.json() as { conversation_id: string };
  if (!conversation_id) return NextResponse.json({ error: "conversation_id obrigatório" }, { status: 400 });

  await markConversationRead(conversation_id, payload.sub!);
  return NextResponse.json({ ok: true });
}

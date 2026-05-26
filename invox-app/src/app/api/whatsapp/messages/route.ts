export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";
import { getWaMessages } from "@/lib/db-whatsapp";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const conversationId = new URL(request.url).searchParams.get("conversation_id");
  if (!conversationId) return NextResponse.json({ error: "conversation_id obrigatório" }, { status: 400 });

  const messages = await getWaMessages(conversationId, payload.sub!);
  return NextResponse.json({ messages });
}

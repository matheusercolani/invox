export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, COOKIE_NAME } from "@/lib/auth";
import { encryptToken } from "@/lib/whatsapp";
import { createWaConnection, findWaConnectionByUserId } from "@/lib/db-whatsapp";

// POST — Connect a WhatsApp number to the authenticated user
// Body: { phone_number_id, access_token, display_phone_number?, business_account_id? }
// If env vars are present and body is empty, uses them (initial owner setup)
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  let body: Record<string, string> = {};
  try { body = await request.json(); } catch { /* empty body — use env fallback */ }

  const phoneNumberId    = body.phone_number_id    ?? process.env.WA_PHONE_NUMBER_ID    ?? "";
  const accessToken      = body.access_token        ?? process.env.WA_ACCESS_TOKEN        ?? "";
  const displayPhone     = body.display_phone_number ?? null;
  const businessAcctId   = body.business_account_id  ?? process.env.WA_BUSINESS_ACCOUNT_ID ?? null;

  if (!phoneNumberId || !accessToken) {
    return NextResponse.json({ error: "phone_number_id e access_token são obrigatórios" }, { status: 400 });
  }

  const accessTokenEnc = await encryptToken(accessToken);

  await createWaConnection({
    id: crypto.randomUUID(),
    user_id: payload.sub!,
    phone_number_id: phoneNumberId,
    display_phone_number: displayPhone,
    business_account_id: businessAcctId,
    access_token_enc: accessTokenEnc,
    status: "active",
    connected_at: Math.floor(Date.now() / 1000),
  });

  return NextResponse.json({ ok: true, phone_number_id: phoneNumberId });
}

// GET — Check if current user has a WA connection
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ connected: false });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ connected: false });

  const conn = await findWaConnectionByUserId(payload.sub!);
  return NextResponse.json({
    connected: !!conn,
    phone: conn?.display_phone_number ?? null,
  });
}

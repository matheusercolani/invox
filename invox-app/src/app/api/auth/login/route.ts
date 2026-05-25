export const runtime = "edge";

import { NextResponse } from "next/server";
import { verifyPassword, signJWT, buildCookieHeader } from "@/lib/auth";
import { findUserByEmail } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email?.trim() || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();
    const user = await findUserByEmail(emailLower);

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos." },
        { status: 401 }
      );
    }

    const token = await signJWT({
      sub: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
    });

    return NextResponse.json(
      { user: { id: user.id, name: user.name, email: user.email, plan: user.plan } },
      { headers: { "Set-Cookie": buildCookieHeader(token) } }
    );
  } catch (err) {
    console.error("[login]", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}

export const runtime = "edge";

import { NextResponse } from "next/server";
import { hashPassword, signJWT, buildCookieHeader } from "@/lib/auth";
import { createUser, emailExists } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name?.trim() || !email?.trim() || !password) {
      return NextResponse.json(
        { error: "Nome, e-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(emailLower)) {
      return NextResponse.json({ error: "E-mail inválido." }, { status: 400 });
    }

    if (await emailExists(emailLower)) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    const id = crypto.randomUUID();
    const now = Math.floor(Date.now() / 1000);

    await createUser({
      id,
      name: name.trim(),
      email: emailLower,
      password_hash: await hashPassword(password),
      plan: "free",
      created_at: now,
    });

    const token = await signJWT({
      sub: id,
      name: name.trim(),
      email: emailLower,
      plan: "free",
    });

    return NextResponse.json(
      { user: { id, name: name.trim(), email: emailLower, plan: "free" } },
      {
        status: 201,
        headers: { "Set-Cookie": buildCookieHeader(token) },
      }
    );
  } catch (err) {
    console.error("[register]", err);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}

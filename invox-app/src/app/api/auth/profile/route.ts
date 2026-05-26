export const runtime = "edge";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyJWT, hashPassword, verifyPassword, signJWT, buildCookieHeader, COOKIE_NAME } from "@/lib/auth";
import { findUserById, updateUser, emailExists } from "@/lib/db";

export async function PATCH(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const payload = await verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "Token inválido" }, { status: 401 });

  const body = await request.json() as {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  };

  const user = await findUserById(payload.sub!);
  if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });

  const updates: { name?: string; email?: string; password_hash?: string } = {};

  if (body.name?.trim()) {
    updates.name = body.name.trim();
  }

  if (body.email?.trim() && body.email.trim().toLowerCase() !== user.email) {
    const exists = await emailExists(body.email.trim().toLowerCase());
    if (exists) return NextResponse.json({ error: "E-mail já está em uso" }, { status: 409 });
    updates.email = body.email.trim().toLowerCase();
  }

  if (body.newPassword) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: "Senha atual é obrigatória" }, { status: 400 });
    }
    const valid = await verifyPassword(body.currentPassword, user.password_hash);
    if (!valid) return NextResponse.json({ error: "Senha atual incorreta" }, { status: 400 });
    if (body.newPassword.length < 6) {
      return NextResponse.json({ error: "Nova senha deve ter pelo menos 6 caracteres" }, { status: 400 });
    }
    updates.password_hash = await hashPassword(body.newPassword);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nenhuma alteração enviada" }, { status: 400 });
  }

  await updateUser(payload.sub!, updates);

  const newName  = updates.name  ?? user.name;
  const newEmail = updates.email ?? user.email;

  const newToken = await signJWT({ sub: payload.sub!, name: newName, email: newEmail, plan: user.plan });

  return NextResponse.json(
    { user: { id: user.id, name: newName, email: newEmail, plan: user.plan } },
    { headers: { "Set-Cookie": buildCookieHeader(newToken) } }
  );
}

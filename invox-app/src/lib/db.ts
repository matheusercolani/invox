/**
 * Database adapter.
 *
 * Development  → in-memory Map (persists within the process, resets on restart)
 * Production   → Cloudflare D1 (uncomment the D1 blocks and set wrangler.toml)
 */

import type { DBUser } from "@/types/auth";

// ── In-memory store (development) ─────────────────────────────────────────
// Uses globalThis so data survives hot-module reloads in Next.js dev server.

declare global {
  var __invoxDevUsers: Map<string, DBUser> | undefined;
}

const devStore: Map<string, DBUser> = globalThis.__invoxDevUsers ?? new Map();
globalThis.__invoxDevUsers = devStore;

// ── D1 helper (Cloudflare production) ──────────────────────────────────────
// getRequestContext() throws outside Cloudflare — caught below.
import { getRequestContext } from "@cloudflare/next-on-pages";

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
}
interface D1Db {
  prepare(query: string): D1PreparedStatement;
}

function getD1(): D1Db | null {
  try {
    const { env } = getRequestContext();
    return (env as { DB?: D1Db }).DB ?? null;
  } catch {
    return null;
  }
}

// ── Public API ─────────────────────────────────────────────────────────────

export async function findUserByEmail(email: string): Promise<DBUser | null> {
  const d1 = getD1();

  if (d1) {
    const row = await d1
      .prepare("SELECT * FROM users WHERE email = ?")
      .bind(email)
      .first<DBUser>();
    return row ?? null;
  }

  // Development fallback
  for (const user of devStore.values()) {
    if (user.email === email) return user;
  }
  return null;
}

export async function findUserById(id: string): Promise<DBUser | null> {
  const d1 = getD1();

  if (d1) {
    const row = await d1
      .prepare("SELECT * FROM users WHERE id = ?")
      .bind(id)
      .first<DBUser>();
    return row ?? null;
  }

  return devStore.get(id) ?? null;
}

export async function createUser(user: DBUser): Promise<void> {
  const d1 = getD1();

  if (d1) {
    await d1
      .prepare(
        "INSERT INTO users (id, name, email, password_hash, plan, created_at) VALUES (?, ?, ?, ?, ?, ?)"
      )
      .bind(
        user.id,
        user.name,
        user.email,
        user.password_hash,
        user.plan,
        user.created_at
      )
      .run();
    return;
  }

  devStore.set(user.id, user);
}

export async function emailExists(email: string): Promise<boolean> {
  const user = await findUserByEmail(email);
  return user !== null;
}

export async function updateUser(
  id: string,
  fields: { name?: string; email?: string; password_hash?: string }
): Promise<void> {
  const d1 = getD1();
  const sets: string[] = [];
  const values: unknown[] = [];

  if (fields.name !== undefined)          { sets.push("name = ?");          values.push(fields.name); }
  if (fields.email !== undefined)         { sets.push("email = ?");         values.push(fields.email); }
  if (fields.password_hash !== undefined) { sets.push("password_hash = ?"); values.push(fields.password_hash); }

  if (sets.length === 0) return;
  values.push(id);

  if (d1) {
    await d1.prepare(`UPDATE users SET ${sets.join(", ")} WHERE id = ?`).bind(...values).run();
    return;
  }

  // Development fallback
  const user = devStore.get(id);
  if (user) devStore.set(id, { ...user, ...fields });
}

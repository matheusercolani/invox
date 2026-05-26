import type { WaConnection, WaConversation, WaMessage } from "@/types/whatsapp";
import { getRequestContext } from "@cloudflare/next-on-pages";

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  run(): Promise<unknown>;
  all<T = unknown>(): Promise<{ results: T[] }>;
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

// ── Connections ────────────────────────────────────────────────────────────

export async function createWaConnection(conn: WaConnection): Promise<void> {
  const d1 = getD1();
  if (!d1) throw new Error("D1 not available");
  await d1
    .prepare(
      `INSERT INTO wa_connections (id, user_id, phone_number_id, display_phone_number,
       business_account_id, access_token_enc, status, connected_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(user_id) DO UPDATE SET
         phone_number_id = excluded.phone_number_id,
         display_phone_number = excluded.display_phone_number,
         business_account_id = excluded.business_account_id,
         access_token_enc = excluded.access_token_enc,
         status = excluded.status,
         connected_at = excluded.connected_at`
    )
    .bind(
      conn.id, conn.user_id, conn.phone_number_id,
      conn.display_phone_number, conn.business_account_id,
      conn.access_token_enc, conn.status, conn.connected_at
    )
    .run();
}

export async function findWaConnectionByUserId(userId: string): Promise<WaConnection | null> {
  const d1 = getD1();
  if (!d1) return null;
  return d1
    .prepare("SELECT * FROM wa_connections WHERE user_id = ? AND status = 'active'")
    .bind(userId)
    .first<WaConnection>();
}

export async function findWaConnectionByPhoneNumberId(phoneNumberId: string): Promise<WaConnection | null> {
  const d1 = getD1();
  if (!d1) return null;
  return d1
    .prepare("SELECT * FROM wa_connections WHERE phone_number_id = ? AND status = 'active'")
    .bind(phoneNumberId)
    .first<WaConnection>();
}

// ── Conversations ──────────────────────────────────────────────────────────

export async function upsertWaConversation(data: {
  userId: string;
  contactWaId: string;
  contactName?: string | null;
  contactPhone: string;
  lastMessageText?: string | null;
  lastMessageAt?: number;
}): Promise<string> {
  const d1 = getD1();
  if (!d1) throw new Error("D1 not available");

  const now = Math.floor(Date.now() / 1000);
  const existing = await d1
    .prepare("SELECT id FROM wa_conversations WHERE user_id = ? AND contact_wa_id = ?")
    .bind(data.userId, data.contactWaId)
    .first<{ id: string }>();

  if (existing) {
    await d1
      .prepare(
        `UPDATE wa_conversations SET
           contact_name = COALESCE(?, contact_name),
           last_message_text = COALESCE(?, last_message_text),
           last_message_at = COALESCE(?, last_message_at),
           unread_count = unread_count + 1
         WHERE id = ?`
      )
      .bind(data.contactName, data.lastMessageText, data.lastMessageAt, existing.id)
      .run();
    return existing.id;
  }

  const id = crypto.randomUUID();
  await d1
    .prepare(
      `INSERT INTO wa_conversations
         (id, user_id, contact_wa_id, contact_name, contact_phone,
          last_message_text, last_message_at, unread_count, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)`
    )
    .bind(
      id, data.userId, data.contactWaId, data.contactName ?? null,
      data.contactPhone, data.lastMessageText ?? null,
      data.lastMessageAt ?? now, now
    )
    .run();
  return id;
}

export async function getWaConversations(userId: string): Promise<WaConversation[]> {
  const d1 = getD1();
  if (!d1) return [];
  const res = await d1
    .prepare(
      "SELECT * FROM wa_conversations WHERE user_id = ? ORDER BY last_message_at DESC LIMIT 50"
    )
    .bind(userId)
    .all<WaConversation>();
  return res.results;
}

export async function markConversationRead(conversationId: string, userId: string): Promise<void> {
  const d1 = getD1();
  if (!d1) return;
  await d1
    .prepare("UPDATE wa_conversations SET unread_count = 0 WHERE id = ? AND user_id = ?")
    .bind(conversationId, userId)
    .run();
}

// ── Messages ───────────────────────────────────────────────────────────────

export async function insertWaMessage(msg: WaMessage): Promise<void> {
  const d1 = getD1();
  if (!d1) throw new Error("D1 not available");
  await d1
    .prepare(
      `INSERT OR IGNORE INTO wa_messages
         (id, conversation_id, user_id, direction, type, body, status, wa_timestamp, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      msg.id, msg.conversation_id, msg.user_id,
      msg.direction, msg.type, msg.body,
      msg.status, msg.wa_timestamp, msg.created_at
    )
    .run();
}

export async function getWaMessages(
  conversationId: string,
  userId: string
): Promise<WaMessage[]> {
  const d1 = getD1();
  if (!d1) return [];
  const res = await d1
    .prepare(
      `SELECT * FROM wa_messages
       WHERE conversation_id = ? AND user_id = ?
       ORDER BY wa_timestamp ASC LIMIT 100`
    )
    .bind(conversationId, userId)
    .all<WaMessage>();
  return res.results;
}

export async function updateWaConversationLastMessage(
  conversationId: string,
  userId: string,
  lastMessageText: string,
  lastMessageAt: number
): Promise<void> {
  const d1 = getD1();
  if (!d1) return;
  await d1
    .prepare(
      "UPDATE wa_conversations SET last_message_text = ?, last_message_at = ? WHERE id = ? AND user_id = ?"
    )
    .bind(lastMessageText, lastMessageAt, conversationId, userId)
    .run();
}

export async function updateWaMessageStatus(messageId: string, status: string, userId: string): Promise<void> {
  const d1 = getD1();
  if (!d1) return;
  await d1
    .prepare("UPDATE wa_messages SET status = ? WHERE id = ? AND user_id = ?")
    .bind(status, messageId, userId)
    .run();
}

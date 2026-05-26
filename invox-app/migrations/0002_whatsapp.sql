-- WhatsApp Business integration tables

CREATE TABLE IF NOT EXISTS wa_connections (
  id                   TEXT PRIMARY KEY,
  user_id              TEXT NOT NULL UNIQUE REFERENCES users(id),
  phone_number_id      TEXT NOT NULL,
  display_phone_number TEXT,
  business_account_id  TEXT,
  access_token_enc     TEXT NOT NULL,
  status               TEXT NOT NULL DEFAULT 'active',
  connected_at         INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS wa_conversations (
  id                TEXT PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES users(id),
  contact_wa_id     TEXT NOT NULL,
  contact_name      TEXT,
  contact_phone     TEXT NOT NULL,
  last_message_text TEXT,
  last_message_at   INTEGER,
  unread_count      INTEGER NOT NULL DEFAULT 0,
  created_at        INTEGER NOT NULL,
  UNIQUE(user_id, contact_wa_id)
);

CREATE TABLE IF NOT EXISTS wa_messages (
  id              TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES wa_conversations(id),
  user_id         TEXT NOT NULL REFERENCES users(id),
  direction       TEXT NOT NULL CHECK(direction IN ('inbound','outbound')),
  type            TEXT NOT NULL DEFAULT 'text',
  body            TEXT,
  status          TEXT NOT NULL DEFAULT 'sent',
  wa_timestamp    INTEGER NOT NULL,
  created_at      INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_wa_conv_user_time ON wa_conversations(user_id, last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_wa_msg_conv_time  ON wa_messages(conversation_id, wa_timestamp ASC);
CREATE INDEX IF NOT EXISTS idx_wa_conn_phone     ON wa_connections(phone_number_id);

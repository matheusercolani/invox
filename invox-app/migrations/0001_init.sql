-- Invox · Cloudflare D1 — initial schema

CREATE TABLE IF NOT EXISTS users (
  id           TEXT    PRIMARY KEY,
  name         TEXT    NOT NULL,
  email        TEXT    UNIQUE NOT NULL,
  password_hash TEXT   NOT NULL,
  plan         TEXT    NOT NULL DEFAULT 'free',  -- free | pro | business
  created_at   INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Future tables (uncomment as features are built):

-- CREATE TABLE IF NOT EXISTS channels (
--   id         TEXT    PRIMARY KEY,
--   user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   type       TEXT    NOT NULL,  -- instagram | whatsapp
--   handle     TEXT,
--   token      TEXT,
--   connected  INTEGER NOT NULL DEFAULT 1,
--   created_at INTEGER NOT NULL DEFAULT (unixepoch())
-- );

-- CREATE TABLE IF NOT EXISTS contacts (
--   id         TEXT    PRIMARY KEY,
--   user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   name       TEXT,
--   handle     TEXT,
--   channel    TEXT    NOT NULL,
--   status     TEXT    NOT NULL DEFAULT 'novo',
--   created_at INTEGER NOT NULL DEFAULT (unixepoch())
-- );

-- CREATE TABLE IF NOT EXISTS flows (
--   id          TEXT    PRIMARY KEY,
--   user_id     TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   name        TEXT    NOT NULL,
--   trigger     TEXT    NOT NULL,
--   channel     TEXT    NOT NULL,
--   active      INTEGER NOT NULL DEFAULT 1,
--   created_at  INTEGER NOT NULL DEFAULT (unixepoch())
-- );

-- CREATE TABLE IF NOT EXISTS conversations (
--   id         TEXT    PRIMARY KEY,
--   user_id    TEXT    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   contact_id TEXT    REFERENCES contacts(id),
--   channel    TEXT    NOT NULL,
--   last_msg   TEXT,
--   unread     INTEGER NOT NULL DEFAULT 0,
--   updated_at INTEGER NOT NULL DEFAULT (unixepoch())
-- );

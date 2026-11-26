-- JobFlow core database (private user data). Timestamps are Unix epoch milliseconds (UTC).
PRAGMA foreign_keys = ON;

CREATE TABLE users (
  id             TEXT PRIMARY KEY,
  email          TEXT NOT NULL COLLATE NOCASE UNIQUE,
  email_verified INTEGER NOT NULL DEFAULT 0 CHECK (email_verified IN (0, 1)),
  name           TEXT,
  avatar_url     TEXT,
  role           TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  country        TEXT,            -- ISO 3166-1 alpha-2, e.g. 'IN'
  timezone       TEXT,            -- IANA, e.g. 'Asia/Kolkata'
  created_at     INTEGER NOT NULL,
  updated_at     INTEGER NOT NULL
);

-- External identities (Google today; others later). Never stores tokens.
CREATE TABLE oauth_accounts (
  id               TEXT PRIMARY KEY,
  user_id          TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider         TEXT NOT NULL CHECK (provider IN ('google')),
  provider_user_id TEXT NOT NULL,
  email            TEXT,
  created_at       INTEGER NOT NULL,
  updated_at       INTEGER NOT NULL,
  UNIQUE (provider, provider_user_id)
);
CREATE INDEX idx_oauth_accounts_user ON oauth_accounts(user_id);

-- Sessions: id is SHA-256(hex) of the random session token. The raw token only lives in the cookie.
CREATE TABLE sessions (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   INTEGER NOT NULL,
  expires_at   INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  user_agent   TEXT,
  country      TEXT
);
CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- Gmail connection (Phase 6). Refresh token is envelope-encrypted: AES-256-GCM with a per-user
-- data key, which is itself wrapped by TOKEN_ENCRYPTION_KEY (Cloudflare Secret). Ciphertext only.
CREATE TABLE google_connections (
  user_id                  TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  scopes                   TEXT NOT NULL,
  refresh_token_ciphertext TEXT NOT NULL,
  wrapped_data_key         TEXT NOT NULL,
  key_version              INTEGER NOT NULL DEFAULT 1,
  history_id               TEXT,
  connected_at             INTEGER NOT NULL,
  revoked_at               INTEGER
);

CREATE TABLE files (
  id           TEXT PRIMARY KEY,
  user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  kind         TEXT NOT NULL CHECK (kind IN ('resume')),
  r2_key       TEXT NOT NULL UNIQUE,
  filename     TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes   INTEGER NOT NULL CHECK (size_bytes > 0),
  sha256       TEXT NOT NULL,
  created_at   INTEGER NOT NULL
);
CREATE INDEX idx_files_user ON files(user_id, created_at DESC);

-- User-controlled automation guard rails. daily_cap can never exceed the platform maximum of 20.
CREATE TABLE automation_settings (
  user_id           TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  paused            INTEGER NOT NULL DEFAULT 0 CHECK (paused IN (0, 1)),
  followups_enabled INTEGER NOT NULL DEFAULT 1 CHECK (followups_enabled IN (0, 1)),
  daily_cap         INTEGER NOT NULL DEFAULT 20 CHECK (daily_cap BETWEEN 0 AND 20),
  updated_at        INTEGER NOT NULL
);

-- Security-relevant actions. Rows survive account deletion with user_id set to NULL.
CREATE TABLE audit_log (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES users(id) ON DELETE SET NULL,
  action     TEXT NOT NULL,
  target     TEXT,
  metadata   TEXT,            -- JSON, never contains secrets or message bodies
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at DESC);

-- First-party product analytics + user-visible activity feed.
CREATE TABLE events (
  id         TEXT PRIMARY KEY,
  user_id    TEXT REFERENCES users(id) ON DELETE CASCADE,
  name       TEXT NOT NULL,
  props      TEXT,            -- JSON
  created_at INTEGER NOT NULL
);
CREATE INDEX idx_events_user ON events(user_id, created_at DESC);
CREATE INDEX idx_events_name ON events(name, created_at);

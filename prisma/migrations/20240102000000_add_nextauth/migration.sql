-- =============================================================
--  Migration: add_nextauth
--  Adds NextAuth-required tables: accounts, sessions,
--  verification_tokens. Also updates users table to include
--  password, emailVerified fields.
-- =============================================================

-- ── 1. Add new columns to existing users table ───────────────
ALTER TABLE "users"
  ADD COLUMN IF NOT EXISTS "emailVerified" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "password"      TEXT;

-- ── 2. accounts ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "accounts" (
  "id"                TEXT         NOT NULL,
  "userId"            TEXT         NOT NULL,
  "type"              TEXT         NOT NULL,
  "provider"          TEXT         NOT NULL,
  "providerAccountId" TEXT         NOT NULL,
  "refresh_token"     TEXT,
  "access_token"      TEXT,
  "expires_at"        INTEGER,
  "token_type"        TEXT,
  "scope"             TEXT,
  "id_token"          TEXT,
  "session_state"     TEXT,

  CONSTRAINT "accounts_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "accounts_provider_providerAccountId_key"
    UNIQUE ("provider", "providerAccountId"),
  CONSTRAINT "accounts_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "accounts_userId_idx" ON "accounts"("userId");

-- ── 3. sessions ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "sessions" (
  "id"           TEXT         NOT NULL,
  "sessionToken" TEXT         NOT NULL,
  "userId"       TEXT         NOT NULL,
  "expires"      TIMESTAMP(3) NOT NULL,

  CONSTRAINT "sessions_pkey"         PRIMARY KEY ("id"),
  CONSTRAINT "sessions_sessionToken_key" UNIQUE ("sessionToken"),
  CONSTRAINT "sessions_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "users"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "sessions_userId_idx" ON "sessions"("userId");

-- ── 4. verification_tokens ───────────────────────────────────
CREATE TABLE IF NOT EXISTS "verification_tokens" (
  "identifier" TEXT         NOT NULL,
  "token"      TEXT         NOT NULL,
  "expires"    TIMESTAMP(3) NOT NULL,

  CONSTRAINT "verification_tokens_token_key"           UNIQUE ("token"),
  CONSTRAINT "verification_tokens_identifier_token_key" UNIQUE ("identifier", "token")
);

-- ── 5. Extra indexes on questions ────────────────────────────
CREATE INDEX IF NOT EXISTS "questions_votes_idx" ON "questions"("votes");

-- Auth.js D1 adapter tables (verbatim from @auth/d1-adapter migrations) ----------
-- Kept inline so a single migration is deterministic instead of relying on the
-- adapter's runtime up() call.

CREATE TABLE IF NOT EXISTS "accounts" (
    "id" text NOT NULL,
    "userId" text NOT NULL DEFAULT NULL,
    "type" text NOT NULL DEFAULT NULL,
    "provider" text NOT NULL DEFAULT NULL,
    "providerAccountId" text NOT NULL DEFAULT NULL,
    "refresh_token" text DEFAULT NULL,
    "access_token" text DEFAULT NULL,
    "expires_at" number DEFAULT NULL,
    "token_type" text DEFAULT NULL,
    "scope" text DEFAULT NULL,
    "id_token" text DEFAULT NULL,
    "session_state" text DEFAULT NULL,
    "oauth_token_secret" text DEFAULT NULL,
    "oauth_token" text DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "sessions" (
    "id" text NOT NULL,
    "sessionToken" text NOT NULL,
    "userId" text NOT NULL DEFAULT NULL,
    "expires" datetime NOT NULL DEFAULT NULL,
    PRIMARY KEY (sessionToken)
);

CREATE TABLE IF NOT EXISTS "users" (
    "id" text NOT NULL DEFAULT '',
    "name" text DEFAULT NULL,
    "email" text DEFAULT NULL,
    "emailVerified" datetime DEFAULT NULL,
    "image" text DEFAULT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS "verification_tokens" (
    "identifier" text NOT NULL,
    "token" text NOT NULL DEFAULT NULL,
    "expires" datetime NOT NULL DEFAULT NULL,
    PRIMARY KEY (token)
);

-- Application tables -------------------------------------------------------------

-- One row per issued API key. Only the SHA-256 hash is stored; the plaintext key
-- is shown to the user exactly once at creation time.
CREATE TABLE IF NOT EXISTS "api_keys" (
    "id" text PRIMARY KEY NOT NULL,
    "user_id" text NOT NULL,
    "name" text NOT NULL DEFAULT 'default',
    "prefix" text NOT NULL,            -- first chars of the key, safe to display
    "key_hash" text NOT NULL,         -- SHA-256 hex of the full key
    "monthly_quota" integer NOT NULL DEFAULT 1000,
    "created_at" integer NOT NULL,    -- epoch ms
    "last_used_at" integer,
    "revoked_at" integer
);
CREATE UNIQUE INDEX IF NOT EXISTS "api_keys_key_hash_idx" ON "api_keys" ("key_hash");
CREATE INDEX IF NOT EXISTS "api_keys_user_id_idx" ON "api_keys" ("user_id");

-- Monthly usage counter per key. period is YYYY-MM (UTC). Cheap quota tracking.
CREATE TABLE IF NOT EXISTS "usage_counters" (
    "key_id" text NOT NULL,
    "period" text NOT NULL,           -- YYYY-MM
    "count" integer NOT NULL DEFAULT 0,
    PRIMARY KEY ("key_id", "period")
);

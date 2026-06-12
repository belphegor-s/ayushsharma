// D1 helpers for API key management.

import { generateKey, hashKey, keyPrefix, newId } from './keys';
import { currentPeriod, readUsage } from './ratelimit';

export type ApiKeyRow = {
  id: string;
  user_id: string;
  name: string;
  prefix: string;
  monthly_quota: number;
  created_at: number;
  last_used_at: number | null;
  revoked_at: number | null;
};

export type ApiKeyView = ApiKeyRow & { used: number };

const DEFAULT_QUOTA = 1000;

/** Look up a single active key by id + owner. */
export async function getKey(db: D1Database, userId: string, id: string): Promise<ApiKeyRow | null> {
  return db
    .prepare(
      `SELECT id, user_id, name, prefix, monthly_quota, created_at, last_used_at, revoked_at
       FROM api_keys WHERE id = ? AND user_id = ? AND revoked_at IS NULL`,
    )
    .bind(id, userId)
    .first<ApiKeyRow>();
}

/** Active (non-revoked) keys for a user, with current-period usage attached. */
export async function listKeys(db: D1Database, userId: string): Promise<ApiKeyView[]> {
  const { results } = await db
    .prepare(
      `SELECT id, user_id, name, prefix, monthly_quota, created_at, last_used_at, revoked_at
       FROM api_keys WHERE user_id = ? AND revoked_at IS NULL ORDER BY created_at DESC`,
    )
    .bind(userId)
    .all<ApiKeyRow>();
  const period = currentPeriod();
  const views: ApiKeyView[] = [];
  for (const row of results ?? []) {
    views.push({ ...row, used: await readUsage(db, row.id, period) });
  }
  return views;
}

/** Create a new key. Returns the plaintext exactly once. */
export async function createKey(
  db: D1Database,
  userId: string,
  name = 'default',
): Promise<{ plaintext: string; id: string }> {
  const plaintext = generateKey();
  const id = newId();
  await db
    .prepare(
      `INSERT INTO api_keys (id, user_id, name, prefix, key_hash, monthly_quota, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, userId, name.slice(0, 40) || 'default', keyPrefix(plaintext), await hashKey(plaintext), DEFAULT_QUOTA, Date.now())
    .run();
  return { plaintext, id };
}

/** Revoke a key the user owns. Returns true if a row was affected. */
export async function revokeKey(db: D1Database, userId: string, id: string): Promise<boolean> {
  const res = await db
    .prepare(`UPDATE api_keys SET revoked_at = ? WHERE id = ? AND user_id = ? AND revoked_at IS NULL`)
    .bind(Date.now(), id, userId)
    .run();
  return (res.meta.changes ?? 0) > 0;
}

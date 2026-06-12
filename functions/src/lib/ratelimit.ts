// Monthly quota tracking backed by the usage_counters D1 table.

/** Current UTC period key, e.g. "2026-06". */
export function currentPeriod(now = new Date()): string {
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

/** Epoch seconds at the start of next month (when the quota resets). */
export function periodResetEpochSec(now = new Date()): number {
  const reset = Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0);
  return Math.floor(reset / 1000);
}

/**
 * Atomically increment this key's counter for the current period and return the
 * new count. The caller compares against the quota.
 */
export async function incrementUsage(
  db: D1Database,
  keyId: string,
  period: string,
): Promise<number> {
  const row = await db
    .prepare(
      `INSERT INTO usage_counters (key_id, period, count) VALUES (?, ?, 1)
       ON CONFLICT(key_id, period) DO UPDATE SET count = count + 1
       RETURNING count`,
    )
    .bind(keyId, period)
    .first<{ count: number }>();
  return row?.count ?? 1;
}

/** Refund one request from the current period (used when the server errors). */
export async function decrementUsage(
  db: D1Database,
  keyId: string,
  period: string,
): Promise<void> {
  await db
    .prepare(
      `UPDATE usage_counters SET count = MAX(0, count - 1) WHERE key_id = ? AND period = ?`,
    )
    .bind(keyId, period)
    .run();
}

/** Read the current count without incrementing (for the console usage bar). */
export async function readUsage(
  db: D1Database,
  keyId: string,
  period: string,
): Promise<number> {
  const row = await db
    .prepare(`SELECT count FROM usage_counters WHERE key_id = ? AND period = ?`)
    .bind(keyId, period)
    .first<{ count: number }>();
  return row?.count ?? 0;
}

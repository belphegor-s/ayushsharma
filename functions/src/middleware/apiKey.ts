import type { MiddlewareHandler } from 'hono';
import type { Env } from '../env';
import { hashKey, KEY_PREFIX } from '../lib/keys';
import { currentPeriod, periodResetEpochSec, incrementUsage } from '../lib/ratelimit';
import { fail, setRateLimitHeaders } from '../lib/respond';

type KeyRow = {
  id: string;
  user_id: string;
  monthly_quota: number;
  revoked_at: number | null;
};

/**
 * Guards /v1/* routes. Expects `Authorization: Bearer ak_live_...`.
 * Validates the key, enforces the monthly quota, records usage, and exposes the
 * resolved key on c.var.apiKey.
 */
export const apiKeyGuard: MiddlewareHandler<Env> = async (c, next) => {
  const auth = c.req.header('Authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7).trim() : '';

  if (!token || !token.startsWith(KEY_PREFIX)) {
    return fail(
      c,
      'unauthorized',
      'Missing or malformed API key. Send "Authorization: Bearer ak_live_...".',
      401,
    );
  }

  const hash = await hashKey(token);
  const row = await c.env.DB.prepare(
    `SELECT id, user_id, monthly_quota, revoked_at FROM api_keys WHERE key_hash = ?`,
  )
    .bind(hash)
    .first<KeyRow>();

  if (!row || row.revoked_at) {
    return fail(c, 'unauthorized', 'Invalid or revoked API key.', 401);
  }

  const period = currentPeriod();
  const reset = periodResetEpochSec();
  const used = await incrementUsage(c.env.DB, row.id, period);
  const remaining = row.monthly_quota - used;

  setRateLimitHeaders(c, row.monthly_quota, remaining, reset);

  if (used > row.monthly_quota) {
    c.header('Retry-After', String(reset - Math.floor(Date.now() / 1000)));
    return fail(
      c,
      'rate_limited',
      `Monthly quota of ${row.monthly_quota} requests exceeded. Resets ${period} rollover.`,
      429,
    );
  }

  // Best-effort last-used timestamp; don't block the request on it.
  c.executionCtx.waitUntil(
    c.env.DB.prepare(`UPDATE api_keys SET last_used_at = ? WHERE id = ?`)
      .bind(Date.now(), row.id)
      .run()
      .then(() => {}),
  );

  c.set('apiKey', {
    id: row.id,
    userId: row.user_id,
    quota: row.monthly_quota,
    used,
    period,
  });

  await next();
};

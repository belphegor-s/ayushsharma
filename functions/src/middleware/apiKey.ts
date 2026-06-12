import type { MiddlewareHandler } from 'hono';
import type { Env } from '../env';
import { hashKey, KEY_PREFIX } from '../lib/keys';
import { currentPeriod, periodResetEpochSec, incrementUsage, decrementUsage } from '../lib/ratelimit';
import { fail, setRateLimitHeaders } from '../lib/respond';

type KeyRow = {
  id: string;
  user_id: string;
  monthly_quota: number;
  revoked_at: number | null;
};

// Burst-guard windows (must match the periods declared in wrangler.jsonc).
const IP_WINDOW_SECONDS = 60;
const KEY_WINDOW_SECONDS = 10;

/**
 * Guards /v1/* routes. Expects `Authorization: Bearer ak_live_...`.
 *
 * Layered limits, cheapest first:
 *   1. Per-IP sliding window  — blocks floods before any DB work.
 *   2. API key validation.
 *   3. Per-key sliding window — short-term burst cap.
 *   4. Monthly quota          — long-term fair-use cap (refunded on 5xx).
 */
export const apiKeyGuard: MiddlewareHandler<Env> = async (c, next) => {
  // 1) Per-IP burst guard — runs before the DB lookup so bad keys can't flood it.
  const ip = c.req.header('CF-Connecting-IP') ?? 'unknown';
  if (c.env.RL_IP) {
    const { success } = await c.env.RL_IP.limit({ key: ip });
    if (!success) {
      c.header('Retry-After', String(IP_WINDOW_SECONDS));
      return fail(c, 'rate_limited', 'Too many requests from your IP address. Slow down.', 429);
    }
  }

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

  // 3) Per-key burst guard.
  if (c.env.RL_KEY) {
    const { success } = await c.env.RL_KEY.limit({ key: row.id });
    if (!success) {
      c.header('Retry-After', String(KEY_WINDOW_SECONDS));
      return fail(
        c,
        'rate_limited',
        `Too many requests. This key is limited to short bursts; retry in ${KEY_WINDOW_SECONDS}s.`,
        429,
      );
    }
  }

  // 4) Monthly quota — atomic increment, then compare.
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

  // Refund the quota slot if the failure was ours (5xx), not the caller's.
  if (c.res.status >= 500) {
    c.executionCtx.waitUntil(decrementUsage(c.env.DB, row.id, period));
  }
};

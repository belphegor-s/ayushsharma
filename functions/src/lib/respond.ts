import type { Context } from 'hono';

/** Uniform success envelope. */
export function ok<T>(c: Context, data: T, status = 200) {
  return c.json({ ok: true, data }, status as any);
}

/** Uniform error envelope. */
export function fail(c: Context, code: string, message: string, status = 400) {
  return c.json({ ok: false, error: { code, message } }, status as any);
}

/** Attach standard rate-limit headers to a response context. */
export function setRateLimitHeaders(
  c: Context,
  limit: number,
  remaining: number,
  resetEpochSec: number,
) {
  c.header('X-RateLimit-Limit', String(limit));
  c.header('X-RateLimit-Remaining', String(Math.max(0, remaining)));
  c.header('X-RateLimit-Reset', String(resetEpochSec));
}

import { Hono } from 'hono';
import type { Context } from 'hono';
import type { Env } from '../../env';
import { ok, fail } from '../../lib/respond';
import { decodeJwt, hashText, parseCron, nextRuns, describeCron, DevError } from '../../lib/dev';

export const dev = new Hono<Env>();

const MAX_BYTES = 100_000;

/** Read + size-cap a JSON body. */
async function readJson(c: Context): Promise<any | Response> {
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_BYTES) return fail(c, 'payload_too_large', `Body exceeds ${MAX_BYTES} bytes.`, 413);
  try {
    return await c.req.json();
  } catch {
    return fail(c, 'bad_request', 'Body must be valid JSON.');
  }
}

// POST /v1/jwt/decode  { token }
dev.post('/jwt/decode', async (c) => {
  const body = await readJson(c);
  if (body instanceof Response) return body;
  if (typeof body?.token !== 'string' || body.token.trim() === '') {
    return fail(c, 'bad_request', 'Provide a non-empty "token" string.');
  }
  try {
    return ok(c, decodeJwt(body.token));
  } catch (e) {
    if (e instanceof DevError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

// POST /v1/hash  { text, algo? }
dev.post('/hash', async (c) => {
  const body = await readJson(c);
  if (body instanceof Response) return body;
  if (typeof body?.text !== 'string') return fail(c, 'bad_request', 'Provide a "text" string.');
  if (body.text.length > MAX_BYTES) return fail(c, 'payload_too_large', `"text" exceeds ${MAX_BYTES} characters.`, 413);
  try {
    return ok(c, await hashText(body.text, typeof body.algo === 'string' ? body.algo : 'sha256'));
  } catch (e) {
    if (e instanceof DevError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

// GET /v1/uuid?n=<1..100>
dev.get('/uuid', (c) => {
  const n = Math.min(100, Math.max(1, Math.floor(Number(c.req.query('n') ?? '1')) || 1));
  const uuids = Array.from({ length: n }, () => crypto.randomUUID());
  return ok(c, { version: 4, count: uuids.length, uuids });
});

// GET /v1/cron?expr=<expr>&n=<1..20>
dev.get('/cron', (c) => {
  const expr = c.req.query('expr');
  const n = Math.min(20, Math.max(1, Math.floor(Number(c.req.query('n') ?? '5')) || 5));
  if (!expr) return fail(c, 'bad_request', 'Provide a cron "expr".');
  try {
    const parsed = parseCron(expr);
    return ok(c, {
      expression: expr,
      description: describeCron(parsed),
      timezone: 'UTC',
      next: nextRuns(parsed, n),
    });
  } catch (e) {
    if (e instanceof DevError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

import { Hono } from 'hono';
import type { Context } from 'hono';
import type { Env } from '../../env';
import { ok, fail } from '../../lib/respond';
import { stats, slugify, excerpt, keywords } from '../../lib/text';

export const text = new Hono<Env>();

const MAX_BYTES = 100_000; // 100 KB body cap

/** Read JSON body, enforce size cap, and require a non-empty string `text`. */
async function readText(c: Context): Promise<{ text: string; body: any } | Response> {
  const len = Number(c.req.header('Content-Length') ?? '0');
  if (len > MAX_BYTES) return fail(c, 'payload_too_large', `Body exceeds ${MAX_BYTES} bytes.`, 413);
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return fail(c, 'bad_request', 'Body must be valid JSON.');
  }
  if (typeof body?.text !== 'string' || body.text.trim() === '') {
    return fail(c, 'bad_request', 'Provide a non-empty "text" string.');
  }
  if (body.text.length > MAX_BYTES) {
    return fail(c, 'payload_too_large', `"text" exceeds ${MAX_BYTES} characters.`, 413);
  }
  return { text: body.text, body };
}

// POST /v1/text/stats  { text }
text.post('/stats', async (c) => {
  const r = await readText(c);
  if (r instanceof Response) return r;
  return ok(c, stats(r.text));
});

// POST /v1/text/slug  { text }
text.post('/slug', async (c) => {
  const r = await readText(c);
  if (r instanceof Response) return r;
  return ok(c, { slug: slugify(r.text) });
});

// POST /v1/text/excerpt  { text, maxChars? }
text.post('/excerpt', async (c) => {
  const r = await readText(c);
  if (r instanceof Response) return r;
  const maxChars = Number(r.body.maxChars);
  return ok(c, { excerpt: excerpt(r.text, Number.isFinite(maxChars) ? maxChars : 160) });
});

// POST /v1/text/keywords  { text, top? }
text.post('/keywords', async (c) => {
  const r = await readText(c);
  if (r instanceof Response) return r;
  const top = Number(r.body.top);
  return ok(c, { keywords: keywords(r.text, Number.isFinite(top) ? top : 10) });
});

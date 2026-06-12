import { Hono } from 'hono';
import type { Context } from 'hono';
import type { Env } from '../env';
import { getUser } from '../lib/session';
import { listKeys, createKey, revokeKey } from '../lib/db';
import { fail } from '../lib/respond';

export const consoleApi = new Hono<Env>();

/** Get current session or null. */
consoleApi.get('/session', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json(null);
  return c.json({ id: user.id, name: user.name, email: user.email, image: user.image });
});

/** List active API keys for the signed-in user. */
consoleApi.get('/keys', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: { code: 'unauthorized', message: 'Sign in required' } }, 401);
  const keys = await listKeys(c.env.DB, user.id);
  return c.json(keys);
});

/** Create a new API key. */
consoleApi.post('/keys', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: { code: 'unauthorized', message: 'Sign in required' } }, 401);
  const { plaintext, id } = await createKey(c.env.DB, user.id);
  return c.json({ plaintext, id });
});

/** Revoke a key the user owns. */
consoleApi.post('/keys/:id/revoke', async (c) => {
  const user = await getUser(c);
  if (!user) return c.json({ error: { code: 'unauthorized', message: 'Sign in required' } }, 401);
  const ok = await revokeKey(c.env.DB, user.id, c.req.param('id'));
  if (!ok) return fail(c, 'not_found', 'Key not found or already revoked.', 404);
  return c.json({ ok: true });
});

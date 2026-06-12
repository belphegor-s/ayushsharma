import { Hono } from 'hono';
import type { Env } from '../env';
import { getUser } from '../lib/session';
import { listKeys, createKey, revokeKey } from '../lib/db';
import { ConsoleSignedOut, ConsoleSignedIn, KeyCreated } from '../ui/console';

export const console_ = new Hono<Env>();

// Dashboard.
console_.get('/console', async (c) => {
  const user = await getUser(c);
  if (!user) return c.html(<ConsoleSignedOut />);
  const keys = await listKeys(c.env.DB, user.id);
  return c.html(<ConsoleSignedIn name={user.name} email={user.email} image={user.image} keys={keys} />);
});

// Create a key, reveal plaintext once.
console_.post('/console/keys', async (c) => {
  const user = await getUser(c);
  if (!user) return c.redirect('/api/auth/signin?callbackUrl=%2Fconsole');
  const { plaintext } = await createKey(c.env.DB, user.id);
  return c.html(<KeyCreated plaintext={plaintext} />);
});

// Revoke a key the user owns.
console_.post('/console/keys/:id/revoke', async (c) => {
  const user = await getUser(c);
  if (!user) return c.redirect('/api/auth/signin?callbackUrl=%2Fconsole');
  await revokeKey(c.env.DB, user.id, c.req.param('id'));
  return c.redirect('/console');
});

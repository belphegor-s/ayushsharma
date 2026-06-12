import { Hono } from 'hono';
import type { Context } from 'hono';
import type { Env } from '../env';
import { getUser } from '../lib/session';
import { listKeys, createKey, revokeKey } from '../lib/db';
import { ConsoleSignedOut, ConsoleSignedIn, KeyCreated } from '../ui/console';

export const console_ = new Hono<Env>();

/**
 * Fetch an Auth.js CSRF token and forward its Set-Cookie to the browser so the
 * token and cookie match. Lets us render our own branded sign-in / sign-out
 * forms that POST straight to Auth.js (no default sign-in page).
 */
async function getCsrf(c: Context<Env>): Promise<string> {
  const res = await fetch(new URL('/api/auth/csrf', c.req.url), {
    headers: { cookie: c.req.header('cookie') ?? '' },
  });
  const setCookie = res.headers.get('set-cookie');
  if (setCookie) c.header('set-cookie', setCookie, { append: true });
  const data = (await res.json()) as { csrfToken: string };
  return data.csrfToken;
}

// Dashboard.
console_.get('/console', async (c) => {
  const user = await getUser(c);
  const csrfToken = await getCsrf(c);
  if (!user) return c.html(<ConsoleSignedOut csrfToken={csrfToken} />);
  const keys = await listKeys(c.env.DB, user.id);
  return c.html(
    <ConsoleSignedIn name={user.name} email={user.email} image={user.image} keys={keys} csrfToken={csrfToken} />,
  );
});

// Create a key, reveal plaintext once.
console_.post('/console/keys', async (c) => {
  const user = await getUser(c);
  if (!user) return c.redirect('/console');
  const { plaintext } = await createKey(c.env.DB, user.id);
  return c.html(<KeyCreated plaintext={plaintext} />);
});

// Revoke a key the user owns.
console_.post('/console/keys/:id/revoke', async (c) => {
  const user = await getUser(c);
  if (!user) return c.redirect('/console');
  await revokeKey(c.env.DB, user.id, c.req.param('id'));
  return c.redirect('/console');
});

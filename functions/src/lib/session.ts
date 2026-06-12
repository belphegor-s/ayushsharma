import { getAuthUser } from '@hono/auth-js';
import type { Context } from 'hono';

export type SessionUser = { id: string; name: string; email: string; image?: string };

/** Resolve the signed-in user (database session) or null. */
export async function getUser(c: Context): Promise<SessionUser | null> {
  const au = await getAuthUser(c);
  const u = au?.user;
  if (!u?.id) return null;
  return { id: u.id, name: u.name ?? '', email: u.email ?? '', image: u.image ?? undefined };
}

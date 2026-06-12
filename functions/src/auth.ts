import { initAuthConfig, type AuthConfig } from '@hono/auth-js';
import Google from '@auth/core/providers/google';
import { D1Adapter } from '@auth/d1-adapter';
import type { Context } from 'hono';
import type { Env } from './env';

/**
 * Auth.js configuration for the Worker.
 *
 * - D1 adapter => database session strategy (sessions table).
 * - Minimal Google scopes (openid email profile) so OAuth verification stays light.
 * - basePath matches the route the authHandler is mounted on (/api/auth).
 */
export const authConfig = initAuthConfig((c: Context<Env>): AuthConfig => ({
  secret: c.env.AUTH_SECRET,
  basePath: '/api/auth',
  trustHost: true,
  adapter: D1Adapter(c.env.DB),
  session: { strategy: 'database' },
  providers: [
    Google({
      clientId: c.env.AUTH_GOOGLE_ID,
      clientSecret: c.env.AUTH_GOOGLE_SECRET,
      authorization: { params: { scope: 'openid email profile' } },
    }),
  ],
}));

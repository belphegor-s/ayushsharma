import type { AuthUser } from '@hono/auth-js';

/** Cloudflare Rate Limiting binding (sliding window, per-colo). */
export interface RateLimiter {
  limit(options: { key: string }): Promise<{ success: boolean }>;
}

/** Cloudflare bindings + secrets available on the Worker. */
export type Bindings = {
  DB: D1Database;
  ASSETS: Fetcher;
  // Sliding-window burst guards. Optional so local dev / missing config no-ops.
  RL_KEY?: RateLimiter;
  RL_IP?: RateLimiter;
  AUTH_SECRET: string;
  AUTH_GOOGLE_ID: string;
  AUTH_GOOGLE_SECRET: string;
  AUTH_URL?: string;
};

/** Per-request Hono context variables we set ourselves. */
export type Variables = {
  authUser: AuthUser;
  // Set by the API-key middleware after a valid Bearer key is resolved.
  apiKey: {
    id: string;
    userId: string;
    quota: number;
    used: number;
    period: string;
  };
};

export type Env = { Bindings: Bindings; Variables: Variables };

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authHandler } from '@hono/auth-js';
import type { Env } from './env';
import { authConfig } from './auth';
import { apiKeyGuard } from './middleware/apiKey';
import { design } from './routes/v1/design';
import { text } from './routes/v1/text';
import { console_ } from './routes/console';
import { Docs } from './ui/docs';
import { Home } from './ui/home';
import { fail } from './lib/respond';

const app = new Hono<Env>();

// Security headers for the server-rendered pages (harmless on JSON responses).
app.use('*', async (c, next) => {
  await next();
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      // Cloudflare's zone auto-injects its Web Analytics beacon (an inline loader
      // + an external script) into HTML on this subdomain. These pages ship no
      // first-party JS and all dynamic data is escaped text, so allowing inline
      // script here has no practical XSS surface. To drop 'unsafe-inline'
      // instead, disable Web Analytics automatic injection in the Cloudflare
      // dashboard for the ayushsharma.me zone.
      "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src https://fonts.gstatic.com",
      // Google avatars + the portfolio favicon.
      "img-src 'self' data: https://*.googleusercontent.com https://ayushsharma.me",
      // 'self' for our APIs; cloudflareinsights.com for the beacon's data POST.
      "connect-src 'self' https://cloudflareinsights.com https://static.cloudflareinsights.com",
      "base-uri 'self'",
      // Our sign-in form posts to self; Auth.js then redirects to Google.
      "form-action 'self' https://accounts.google.com",
      "frame-ancestors 'none'",
    ].join('; '),
  );
});

// Auth.js config + handler.
app.use('*', authConfig);
app.use('/api/auth/*', authHandler());

// Public API: open CORS (key travels in the header, no cookies), key-guarded.
app.use('/v1/*', cors({ origin: '*', allowHeaders: ['Authorization', 'Content-Type'], maxAge: 86400 }));
app.use('/v1/*', apiKeyGuard);
app.route('/v1', design);
app.route('/v1/text', text);

// Console (auth-gated inside) + docs.
app.route('/', console_);
app.get('/docs', (c) => c.html(<Docs />));
app.get('/', (c) => c.html(<Home />));

app.notFound((c) => {
  if (c.req.path.startsWith('/v1')) return fail(c, 'not_found', 'No such endpoint.', 404);
  return c.redirect('/');
});

app.onError((err, c) => {
  console.error(err);
  return fail(c, 'internal', 'Something went wrong.', 500);
});

export default app;

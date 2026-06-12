import { Layout } from './layout';
import type { ApiKeyView } from '../lib/db';

/** Signed-out landing: explain the product + branded Google sign-in. */
export function ConsoleSignedOut(props: { csrfToken: string }) {
  return (
    <Layout title="Developer Console · Ayush Sharma API" active="console">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>developer console
        </span>
        <h1 class="title">Developer API</h1>
        <p class="lead">
          A small, fast, free API by Ayush Sharma. Sign in with Google to get a personal API key with a monthly quota. Your Google name, email, and avatar are used only to identify your account and
          issue your key.
        </p>

        <form method="post" action="/api/auth/signin/google">
          <input type="hidden" name="csrfToken" value={props.csrfToken} />
          <input type="hidden" name="callbackUrl" value="/console" />
          <button class="btn google" type="submit">
            <GoogleMark /> Sign in with Google
          </button>
        </form>

        <div class="scopes">
          <span class="chip">openid</span>
          <span class="chip">email</span>
          <span class="chip">profile</span>
          <span class="chip">no password access</span>
        </div>

        <div class="toolkit-grid">
          <div class="card">
            <span class="plus tl" />
            <h3 style="margin-top:0;">Design Toolkit</h3>
            <p class="muted" style="margin:0;">
              WCAG contrast, color palettes, and hex / rgb / hsl / oklch conversion.
            </p>
          </div>
          <div class="card">
            <span class="plus tl" />
            <h3 style="margin-top:0;">Text Intelligence</h3>
            <p class="muted" style="margin:0;">
              Readability stats, slugs, smart excerpts, and keyword extraction.
            </p>
          </div>
        </div>

        <p class="muted" style="font-size:0.85rem;">
          New here? Read the <a href="/docs">API docs</a> first.
        </p>
      </div>
    </Layout>
  );
}

/** Signed-in dashboard: profile, keys, usage, quick start. */
export function ConsoleSignedIn(props: { name: string; email: string; image?: string; keys: ApiKeyView[]; csrfToken: string }) {
  const { name, email, image, keys, csrfToken } = props;
  return (
    <Layout title="Developer Console · Ayush Sharma API" active="console">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>developer console
        </span>
        <div style="display:flex; align-items:center; gap:12px; margin-top:14px;">
          {image ? <img src={image} alt="" width="42" height="42" style="border-radius:50%; border:1px solid var(--line);" referrerpolicy="no-referrer" /> : null}
          <div>
            <div style="font-weight:600;">{name || 'Signed in'}</div>
            <div class="muted" style="font-size:0.85rem;">
              {email}
            </div>
          </div>
          <form class="inline" method="post" action="/api/auth/signout" style="margin-left:auto;">
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/console" />
            <button class="btn" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <div class="rule">
        <span class="plus tl" />
      </div>

      <div class="section">
        <h2 style="margin-top:0;">API keys</h2>
        {keys.length === 0 ? (
          <p class="muted">No keys yet. Create one to start calling the API.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Key</th>
                <th>Usage (this month)</th>
                <th>Created</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k, i) => (
                <tr key={`key-${i}`}>
                  <td>
                    <code>{k.prefix}…</code>
                  </td>
                  <td>
                    <div>
                      {k.used} / {k.monthly_quota}
                    </div>
                    <div class="meter">
                      <span style={`width:${Math.min(100, (k.used / k.monthly_quota) * 100)}%`} />
                    </div>
                  </td>
                  <td class="muted">{new Date(k.created_at).toISOString().slice(0, 10)}</td>
                  <td>
                    <form class="inline" method="post" action={`/console/keys/${k.id}/revoke`}>
                      <input type="hidden" name="csrfToken" value={csrfToken} />
                      <button class="btn danger" type="submit">
                        Revoke
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <form method="post" action="/console/keys" style="margin-top:18px;">
          <input type="hidden" name="csrfToken" value={csrfToken} />
          <button class="btn primary" type="submit">
            + Create API key
          </button>
        </form>
      </div>

      <div class="rule">
        <span class="plus tl" />
      </div>

      <div class="section">
        <h2 style="margin-top:0;">Quick start</h2>
        <p class="muted">Base URL</p>
        <span class="codeblock">
          <span class="dot" />
          https://api.ayushsharma.me
        </span>
        <p class="muted" style="margin-top:16px;">
          Send your key as a Bearer token:
        </p>
        <pre class="key" style="color:var(--text);">{`curl -H "Authorization: Bearer ak_live_..." \\
  "https://api.ayushsharma.me/v1/contrast?fg=%23ffffff&bg=%230c0d10"`}</pre>
        <p class="muted" style="margin-top:12px;">
          Full reference in the <a href="/docs">docs</a>.
        </p>
      </div>
    </Layout>
  );
}

/** One-time reveal of a freshly created key. */
export function KeyCreated(props: { plaintext: string }) {
  return (
    <Layout title="API key created · Ayush Sharma API" active="console">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>new api key
        </span>
        <h2 style="margin-top:14px;">Copy your key now</h2>
        <div class="banner warn">This is the only time the full key is shown. Store it somewhere safe. If you lose it, revoke it and create a new one.</div>
        <div class="key">{props.plaintext}</div>
        <p style="margin-top:18px;">
          <a class="btn primary" href="/console">
            Back to console
          </a>
        </p>
      </div>
    </Layout>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.4 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.1-3.8 6.4-9.4 6.4-16.9z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6l-7.9-6.2C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.9-6.2z" />
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.1-5.5c-2 1.4-4.6 2.2-8.1 2.2-6.3 0-11.6-3.9-13.5-9.4l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

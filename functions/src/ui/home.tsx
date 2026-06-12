import { Layout, Rule } from './layout';

/**
 * Root landing for app.ayushsharma.me - the developer console home.
 *
 * Server-rendered on purpose: Google's OAuth verification review reads this page
 * to confirm the app clearly states what it does and why it uses Google sign-in.
 * Signed-in users are redirected to /console (the dashboard) by the route handler.
 */
export function Home() {
  return (
    <Layout title="Developer Console · Ayush Sharma API" active="console">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>developer console
        </span>
        <h1 class="title">Developer API</h1>

        <p class="lead">
          <strong>app.ayushsharma.me</strong> is a free developer API and console built by Ayush Sharma. It gives developers simple, fast HTTP endpoints for two toolkits - a
          <strong> Design Toolkit</strong> and a <strong>Text &amp; Developer Toolkit</strong> - plus a console to create and manage the API keys that authenticate your requests.
        </p>

        <p class="muted" style="margin-top:-6px;">
          <strong style="color:var(--text);">What you can do here:</strong> sign in with Google to create a personal API key, see your monthly usage, and call any endpoint with that key. Google
          sign-in is used <strong>only</strong> to identify your account and issue your key - nothing is posted on your behalf and your Google password is never seen.
        </p>

        <div style="display:flex; gap:10px; margin-top:22px; flex-wrap:wrap;">
          <a class="btn google" href="/console">
            <GoogleMark /> Sign in with Google
          </a>
          <a class="btn" href="/docs">
            Read the docs
          </a>
        </div>

        <div class="scopes">
          <span class="chip">openid</span>
          <span class="chip">email</span>
          <span class="chip">profile</span>
          <span class="chip">no password access</span>
        </div>
      </div>

      <Rule />

      <div class="section">
        <h2 style="margin-top:0;">What the API does</h2>
        <div class="toolkit-grid">
          <div class="card">
            <span class="plus tl" />
            <span class="plus tr" />
            <span class="plus bl" />
            <span class="plus br" />
            <h3 style="margin-top:0;">Design Toolkit</h3>
            <p class="muted" style="margin:0;">
              WCAG contrast checking, tint/shade palettes, color-wheel harmonies, color blending, and hex / rgb / hsl / oklch conversion.
            </p>
          </div>
          <div class="card">
            <span class="plus tl" />
            <span class="plus tr" />
            <span class="plus bl" />
            <span class="plus br" />
            <h3 style="margin-top:0;">Text &amp; Developer Toolkit</h3>
            <p class="muted" style="margin:0;">
              Readability stats, slugs, case conversion, keyword extraction, JWT decoding, SHA hashing, UUID generation, and cron parsing.
            </p>
          </div>
        </div>
        <p class="muted" style="font-size:0.85rem;">
          Every <code>/v1</code> endpoint needs an API key. New here? Read the <a href="/docs">API docs</a> first.
        </p>
      </div>

      <Rule />

      <div class="section">
        <h2 style="margin-top:0;">Why sign in with Google</h2>
        <p class="muted">
          To use the API you sign in with Google. We use your Google account for one purpose only: to verify who you are and issue you a personal API key with a monthly request quota. During sign-in
          we receive your basic profile (name and avatar) and email address. We never receive your Google password. We do not use this data for advertising, and we never sell or share it. You can
          delete your account and keys at any time by emailing
          <a href="mailto:hello@ayushsharma.me"> hello@ayushsharma.me</a>.
        </p>
        <p class="muted">
          Read how your data is handled in the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Use</a>. This API is operated by Ayush Sharma, author of{' '}
          <a href="https://ayushsharma.me">ayushsharma.me</a>.
        </p>
      </div>
    </Layout>
  );
}

function GoogleMark() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" style="margin-right:2px;">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.4 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.1-3.8 6.4-9.4 6.4-16.9z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6l-7.9-6.2C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.9-6.2z" />
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.1-5.5c-2 1.4-4.6 2.2-8.1 2.2-6.3 0-11.6-3.9-13.5-9.4l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

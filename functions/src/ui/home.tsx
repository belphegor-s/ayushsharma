import { Layout, Rule, BaseUrl } from './layout';

/**
 * Public landing for app.ayushsharma.me. Written to satisfy Google OAuth
 * branding review: it names the app, states exactly what it does, explains how
 * it uses Google user data, and links to the privacy policy and terms.
 */
export function Home() {
  return (
    <Layout title="Ayush Sharma Developer API">
      <div class="section">
        <span class="label"><span class="slash">/</span>ayush sharma developer api</span>
        <h1 class="title">Developer API</h1>
        <p class="lead">
          <strong>app.ayushsharma.me</strong> is a free developer API built by Ayush Sharma. It gives
          developers two HTTP toolkits: a <strong>Design Toolkit</strong> (WCAG contrast checking,
          color palette generation, and hex / rgb / hsl / oklch conversion) and a
          <strong> Text Intelligence</strong> toolkit (readability scoring, slug generation, smart
          excerpts, and keyword extraction).
        </p>

        <p class="muted" style="margin-bottom:6px;">Base URL</p>
        <BaseUrl />

        <div style="display:flex; gap:10px; margin-top:22px; flex-wrap:wrap;">
          <a class="btn primary" href="/console">Sign in with Google</a>
          <a class="btn" href="/docs">Read the docs</a>
        </div>
      </div>

      <Rule />

      <div class="section">
        <h2 style="margin-top:0;">Why sign in with Google</h2>
        <p class="muted">
          To use the API you sign in with Google. We use your Google account for one purpose only: to
          verify who you are and issue you a personal API key with a monthly request quota. During
          sign-in we receive your basic profile (name and avatar) and email address. We never receive
          your Google password. We do not use this data for advertising, and we never sell or share
          it. You can delete your account and keys at any time by emailing
          <a href="mailto:hello@ayushsharma.me"> hello@ayushsharma.me</a>.
        </p>
        <div class="scopes">
          <span class="chip">openid</span>
          <span class="chip">email</span>
          <span class="chip">profile</span>
        </div>
      </div>

      <Rule />

      <div class="section">
        <h2 style="margin-top:0;">Legal</h2>
        <p class="muted">
          Read how your data is handled in the{' '}
          <a href="/privacy">Privacy Policy</a> and{' '}
          <a href="/terms">Terms of Use</a>. This API is operated by Ayush
          Sharma, the author of <a href="https://ayushsharma.me">ayushsharma.me</a>.
        </p>
      </div>
    </Layout>
  );
}

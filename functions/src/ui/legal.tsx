import { Layout } from './layout';

const UPDATED = 'June 12, 2026';
const EMAIL = 'hello@ayushsharma.me';

function Section(props: { heading: string; children: any }) {
  return (
    <div class="section legal-section">
      <h2 style="margin-top:0;">{props.heading}</h2>
      {props.children}
    </div>
  );
}

export function Privacy() {
  return (
    <Layout title="Privacy Policy · Ayush Sharma API">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>privacy
        </span>
        <h1 class="title">Privacy Policy</h1>
        <p class="muted" style="margin:0;">
          Last updated {UPDATED}
        </p>
        <p class="lead" style="margin-top:14px;">
          <strong>app.ayushsharma.me</strong> is a free developer API built by Ayush Sharma. This page explains exactly what data the API touches, why, and how Google sign-in data is used.
        </p>
      </div>

      <div class="rule">
        <span class="plus tl" />
        <span class="plus tr" />
      </div>

      <Section heading="What I collect">
        <ul class="legal-list">
          <li>
            <strong>Google sign-in.</strong> When you sign in to get an API key, Google shares your name, email address, and profile picture so I can create your account and show who is signed in. I
            never receive your Google password.
          </li>
          <li>
            <strong>API keys & usage.</strong> I store your API key as a hash (never the plaintext) and a monthly request count to enforce fair-use limits.
          </li>
          <li>
            <strong>Analytics.</strong> Privacy-friendly, aggregate request metrics only (no invasive tracking, no ad networks).
          </li>
        </ul>
      </Section>

      <Section heading="Signing in with Google">
        <p class="muted">
          The API uses Google sign-in <strong>only</strong> to identify your account and issue API keys. I request the minimum scopes - <code>openid</code>, <code>email</code>,<code>profile</code>.
          This data is never used for advertising, never sold, and never shared. It is used solely to operate the API.
        </p>
      </Section>

      <Section heading="What I don't do">
        <p class="muted">I don't sell or rent your data. I don't run third-party ad trackers. I don't build a profile on you.</p>
      </Section>

      <Section heading="Third parties">
        <p class="muted">A few trusted services process data on my behalf: Google (sign-in) and Cloudflare (API hosting and database). Each handles data under its own privacy terms.</p>
      </Section>

      <Section heading="Deleting your data">
        <p class="muted">
          Want your account and keys deleted? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and it is done.
        </p>
      </Section>

      <Section heading="Changes">
        <p class="muted">If this policy changes, the date at the top updates with it.</p>
      </Section>
    </Layout>
  );
}

export function Terms() {
  return (
    <Layout title="Terms of Use · Ayush Sharma API">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>terms
        </span>
        <h1 class="title">Terms of Use</h1>
        <p class="muted" style="margin:0;">
          Last updated {UPDATED}
        </p>
        <p class="lead" style="margin-top:14px;">
          By using the <strong>app.ayushsharma.me</strong> developer API you agree to the terms below. They're short and reasonable - it's a free, personal project.
        </p>
      </div>

      <div class="rule">
        <span class="plus tl" />
        <span class="plus tr" />
      </div>

      <Section heading="Using the API">
        <p class="muted">
          The API requires signing in with Google and using a personal API key. Keep your key secret, stay within the published rate limits, and don't use the API to build anything unlawful, abusive,
          or that tries to overload the service.
        </p>
      </Section>

      <Section heading="Keys & fair use">
        <p class="muted">
          Keys are free and offered as-is. I may revoke a key or change limits at any time to protect the service. Each key has a monthly request quota; exceeding it returns
          <code> 429</code> until the next period.
        </p>
      </Section>

      <Section heading="Ownership">
        <p class="muted">The API, its design, and code are mine unless stated otherwise. Reusing substantial parts without permission isn't allowed.</p>
      </Section>

      <Section heading="No warranty">
        <p class="muted">The API is provided "as is." I do my best to keep it accurate and online, but make no guarantees about availability or that everything is error-free.</p>
      </Section>

      <Section heading="Liability">
        <p class="muted">I'm not liable for any loss or damage arising from your use of the API, to the extent the law allows.</p>
      </Section>

      <Section heading="Contact">
        <p class="muted">
          Questions about these terms? Reach me at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </Section>
    </Layout>
  );
}

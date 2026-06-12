import { Layout, Rule, Corners, BaseUrl, CopyBtn } from './layout';
import { highlight } from './shiki';

/** Async component: Shiki-highlighted code block with a copy button. */
async function Code(props: { code: string; lang: 'bash' | 'json' }) {
  const html = await highlight(props.code, props.lang);
  return (
    <div class="codewrap">
      <CopyBtn text={props.code} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

function Param(props: { name: string; req?: boolean; desc: string }) {
  return (
    <tr>
      <td>
        <code>{props.name}</code>
        {props.req ? <span style="color:#ef8a8a"> *</span> : null}
      </td>
      <td class="muted">{props.desc}</td>
    </tr>
  );
}

function ParamTable(props: { children: any }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Param</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{props.children}</tbody>
    </table>
  );
}

function Endpoint(props: { method: 'get' | 'post'; path: string; children: any }) {
  return (
    <div class="card endpoint">
      <Corners />
      <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px;">
        <span class={`method ${props.method}`}>{props.method.toUpperCase()}</span>
        <code>{props.path}</code>
      </div>
      {props.children}
    </div>
  );
}

export function Docs() {
  return (
    <Layout title="API Docs · Ayush Sharma API" active="docs">
      <div class="section">
        <span class="label">
          <span class="slash">/</span>reference
        </span>
        <h1 class="title">API Docs</h1>
        <p class="lead">
          A small, fast, free API by Ayush Sharma. All <code>/v1</code> endpoints require an API key. Get one from the <a href="/console">console</a>.
        </p>
        <p class="muted" style="margin-bottom:6px;">
          Base URL
        </p>
        <BaseUrl />

        <h2>Authentication</h2>
        <p class="muted">Send your key as a Bearer token on every request:</p>
        <Code
          lang="bash"
          code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/convert?c=%233b82f6"`}
        />
        <p class="muted">Responses use a uniform envelope:</p>
        <Code
          lang="json"
          code={`{ "ok": true, "data": { /* ... */ } }
{ "ok": false, "error": { "code": "bad_request", "message": "..." } }`}
        />
        <p class="muted">
          Rate limit headers (<code>X-RateLimit-Limit</code>, <code>-Remaining</code>,<code>-Reset</code>) are returned on every call. Default quota is 1000 requests/month; exceeding it returns{' '}
          <code>429</code>.
        </p>
      </div>

      <Rule />

      <div class="section">
        <h2>Design Toolkit</h2>

        <Endpoint method="get" path="/v1/contrast">
          <p class="muted">WCAG 2.1 contrast ratio between two colors, with AA/AAA pass flags.</p>
          <ParamTable>
            <Param name="fg" req desc="Foreground color (hex, rgb(), hsl() or oklch())" />
            <Param name="bg" req desc="Background color" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/contrast?fg=%23ffffff&bg=%230c0d10"`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "fg": "#ffffff", "bg": "#0c0d10",
    "ratio": 18.45,
    "normal": { "AA": true, "AAA": true },
    "large":  { "AA": true, "AAA": true }
  }
}`}
          />
        </Endpoint>

        <Endpoint method="get" path="/v1/palette">
          <p class="muted">Generate a tint/shade scale around a base color.</p>
          <ParamTable>
            <Param name="base" req desc="Base color in any supported format" />
            <Param name="n" desc="Number of steps, 2–12 (default 9)" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/palette?base=%233b82f6&n=5"`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "base": "#3b82f6", "count": 5,
    "colors": ["#b1ccfb", "#75a4f8", "#3b82f6", "#27569f", "#132b4f"]
  }
}`}
          />
        </Endpoint>

        <Endpoint method="get" path="/v1/convert">
          <p class="muted">Convert one color into hex, rgb, hsl and oklch.</p>
          <ParamTable>
            <Param name="c" req desc="Color in hex, rgb(), hsl() or oklch()" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/convert?c=%233b82f6"`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "hex": "#3b82f6",
    "rgb": "rgb(59, 130, 246)",
    "hsl": "hsl(217, 91%, 60%)",
    "oklch": "oklch(0.6231 0.188 259.81)"
  }
}`}
          />
        </Endpoint>

        <Endpoint method="get" path="/v1/harmony">
          <p class="muted">Color-wheel harmony schemes generated from a base hue.</p>
          <ParamTable>
            <Param name="base" req desc="Base color in any supported format" />
            <Param name="type" desc="complementary (default), analogous, triadic, tetradic, split-complementary" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/harmony?base=%233b82f6&type=triadic"`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "base": "#3b82f6", "type": "triadic",
    "colors": ["#3c83f6", "#f63c83", "#83f63c"]
  }
}`}
          />
        </Endpoint>

        <Endpoint method="get" path="/v1/blend">
          <p class="muted">Mix two colors in sRGB space at a given ratio.</p>
          <ParamTable>
            <Param name="a" req desc="First color" />
            <Param name="b" req desc="Second color" />
            <Param name="t" desc="Mix ratio 0–1 (default 0.5); 0 = a, 1 = b" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/blend?a=%23ff0000&b=%230000ff&t=0.5"`}
          />
          <Code lang="json" code={`{ "ok": true, "data": { "a": "#ff0000", "b": "#0000ff", "t": 0.5, "result": "#800080" } }`} />
        </Endpoint>
      </div>

      <Rule />

      <div class="section">
        <h2>Text Intelligence</h2>
        <p class="muted">
          All endpoints take a JSON body with a <code>text</code> string (max 100 KB).
        </p>

        <Endpoint method="post" path="/v1/text/stats">
          <p class="muted">Word/character counts, reading time, and Flesch readability.</p>
          <Code
            lang="bash"
            code={`curl -X POST -H "Authorization: Bearer ak_live_yourkey" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"The quick brown fox jumps over the lazy dog."}' \\
  https://app.ayushsharma.me/v1/text/stats`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "characters": 44, "words": 9, "sentences": 1,
    "readingTime": "1 min read",
    "fleschReadingEase": 96.2,
    "fleschKincaidGrade": 1.3,
    "gradeLabel": "Very easy (5th grade)"
  }
}`}
          />
        </Endpoint>

        <Endpoint method="post" path="/v1/text/slug">
          <p class="muted">URL-safe slug from any string.</p>
          <Code
            lang="json"
            code={`// request:  { "text": "Hello, World! Café" }
{ "ok": true, "data": { "slug": "hello-world-cafe" } }`}
          />
        </Endpoint>

        <Endpoint method="post" path="/v1/text/case">
          <p class="muted">Convert any string into every common programming and display case.</p>
          <Code
            lang="bash"
            code={`curl -X POST -H "Authorization: Bearer ak_live_yourkey" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"user profile settings"}' \\
  https://app.ayushsharma.me/v1/text/case`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "camel": "userProfileSettings",
    "pascal": "UserProfileSettings",
    "snake": "user_profile_settings",
    "kebab": "user-profile-settings",
    "constant": "USER_PROFILE_SETTINGS",
    "dot": "user.profile.settings",
    "path": "user/profile/settings",
    "title": "User Profile Settings",
    "sentence": "User profile settings"
  }
}`}
          />
        </Endpoint>

        <Endpoint method="post" path="/v1/text/excerpt">
          <p class="muted">Sentence-boundary-aware excerpt.</p>
          <ParamTable>
            <Param name="text" req desc="Source text" />
            <Param name="maxChars" desc="Maximum length (default 160)" />
          </ParamTable>
          <Code lang="json" code={`{ "ok": true, "data": { "excerpt": "First sentence here." } }`} />
        </Endpoint>

        <Endpoint method="post" path="/v1/text/keywords">
          <p class="muted">Frequency-based keywords with stopwords removed.</p>
          <ParamTable>
            <Param name="text" req desc="Source text" />
            <Param name="top" desc="How many keywords to return (default 10)" />
          </ParamTable>
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": { "keywords": [ { "word": "design", "count": 4 }, { "word": "color", "count": 3 } ] }
}`}
          />
        </Endpoint>
      </div>

      <Rule />

      <div class="section">
        <h2>Developer Utilities</h2>
        <p class="muted">Everyday building blocks: decode tokens, hash payloads, mint IDs, and reason about schedules.</p>

        <Endpoint method="post" path="/v1/jwt/decode">
          <p class="muted">
            Decode a JWT's header and payload and surface its timing claims. The signature is returned untouched and <strong>never verified</strong> - this is a debugging aid, not auth.
          </p>
          <Code
            lang="bash"
            code={`curl -X POST -H "Authorization: Bearer ak_live_yourkey" \\
  -H "Content-Type: application/json" \\
  -d '{"token":"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJleHAiOjE3MzU2ODk2MDB9.sig"}' \\
  https://app.ayushsharma.me/v1/jwt/decode`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "header": { "alg": "HS256" },
    "payload": { "sub": "123", "exp": 1735689600 },
    "algorithm": "HS256",
    "verified": false,
    "expiresAt": "2025-01-01T00:00:00.000Z",
    "isExpired": true,
    "expiresIn": -12345
  }
}`}
          />
        </Endpoint>

        <Endpoint method="post" path="/v1/hash">
          <p class="muted">SHA digest of any string, returned as hex and base64.</p>
          <ParamTable>
            <Param name="text" req desc="String to hash" />
            <Param name="algo" desc="sha1, sha256 (default), sha384, sha512" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -X POST -H "Authorization: Bearer ak_live_yourkey" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"hello","algo":"sha256"}' \\
  https://app.ayushsharma.me/v1/hash`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "algorithm": "SHA-256",
    "hex": "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824",
    "base64": "LPJNul+wow4m6Dsqxbni... ",
    "bits": 256
  }
}`}
          />
        </Endpoint>

        <Endpoint method="get" path="/v1/uuid">
          <p class="muted">Generate one or more RFC 4122 v4 UUIDs.</p>
          <ParamTable>
            <Param name="n" desc="How many to generate, 1–100 (default 1)" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/uuid?n=3"`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "version": 4, "count": 3,
    "uuids": [
      "3f0c4b1e-...","b91d2a77-...","7c5e8f02-..."
    ]
  }
}`}
          />
        </Endpoint>

        <Endpoint method="get" path="/v1/cron">
          <p class="muted">
            Parse a 5-field cron expression (or an <code>@daily</code>-style alias), describe it in plain English, and compute the next run times in UTC.
          </p>
          <ParamTable>
            <Param name="expr" req desc="Cron expression, e.g. */15 9-17 * * 1-5" />
            <Param name="n" desc="Number of upcoming runs to return, 1–20 (default 5)" />
          </ParamTable>
          <Code
            lang="bash"
            code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://app.ayushsharma.me/v1/cron?expr=0%209%20*%20*%201-5&n=3"`}
          />
          <Code
            lang="json"
            code={`{
  "ok": true,
  "data": {
    "expression": "0 9 * * 1-5",
    "description": "At minute 0 of hour 9, on mon, tue, wed, thu, fri (UTC).",
    "timezone": "UTC",
    "next": [
      "2026-06-12T09:00:00.000Z",
      "2026-06-15T09:00:00.000Z",
      "2026-06-16T09:00:00.000Z"
    ]
  }
}`}
          />
        </Endpoint>
      </div>
    </Layout>
  );
}

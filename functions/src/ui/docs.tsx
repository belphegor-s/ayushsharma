import { Layout } from './layout';
import { highlight } from './shiki';

/** Async component: renders a Shiki-highlighted code block. */
async function Code(props: { code: string; lang: 'bash' | 'json' }) {
  const html = await highlight(props.code, props.lang);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Param(props: { name: string; req?: boolean; desc: string }) {
  return (
    <tr>
      <td><code>{props.name}</code>{props.req ? <span style="color:#ef8a8a"> *</span> : null}</td>
      <td class="muted">{props.desc}</td>
    </tr>
  );
}

function ParamTable(props: { children: any }) {
  return (
    <table>
      <thead><tr><th>Param</th><th>Description</th></tr></thead>
      <tbody>{props.children}</tbody>
    </table>
  );
}

function Endpoint(props: { method: 'get' | 'post'; path: string; children: any }) {
  return (
    <div class="card endpoint">
      <span class="plus tl" />
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
        <span class="label"><span class="slash">/</span>reference</span>
        <h1 class="title">API Docs</h1>
        <p class="lead">
          Base URL <code>https://api.ayushsharma.me</code>. All <code>/v1</code> endpoints require an
          API key. Get one from the <a href="/console">console</a>.
        </p>

        <h2>Authentication</h2>
        <p class="muted">Send your key as a Bearer token on every request:</p>
        <Code lang="bash" code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://api.ayushsharma.me/v1/convert?c=%233b82f6"`} />
        <p class="muted">Responses use a uniform envelope:</p>
        <Code lang="json" code={`{ "ok": true, "data": { /* ... */ } }
{ "ok": false, "error": { "code": "bad_request", "message": "..." } }`} />
        <p class="muted">
          Rate limit headers (<code>X-RateLimit-Limit</code>, <code>-Remaining</code>,
          <code>-Reset</code>) are returned on every call. Default quota is 1000 requests/month;
          exceeding it returns <code>429</code>.
        </p>
      </div>

      <div class="rule"><span class="plus tl" /></div>

      <div class="section">
        <h2>Design Toolkit</h2>

        <Endpoint method="get" path="/v1/contrast">
          <p class="muted">WCAG 2.1 contrast ratio between two colors, with AA/AAA pass flags.</p>
          <ParamTable>
            <Param name="fg" req desc="Foreground color (hex, rgb(), hsl() or oklch())" />
            <Param name="bg" req desc="Background color" />
          </ParamTable>
          <Code lang="bash" code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://api.ayushsharma.me/v1/contrast?fg=%23ffffff&bg=%230c0d10"`} />
          <Code lang="json" code={`{
  "ok": true,
  "data": {
    "fg": "#ffffff", "bg": "#0c0d10",
    "ratio": 18.45,
    "normal": { "AA": true, "AAA": true },
    "large":  { "AA": true, "AAA": true }
  }
}`} />
        </Endpoint>

        <Endpoint method="get" path="/v1/palette">
          <p class="muted">Generate a tint/shade scale around a base color.</p>
          <ParamTable>
            <Param name="base" req desc="Base color in any supported format" />
            <Param name="n" desc="Number of steps, 2–12 (default 9)" />
          </ParamTable>
          <Code lang="bash" code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://api.ayushsharma.me/v1/palette?base=%233b82f6&n=5"`} />
          <Code lang="json" code={`{
  "ok": true,
  "data": {
    "base": "#3b82f6", "count": 5,
    "colors": ["#b1ccfb", "#75a4f8", "#3b82f6", "#27569f", "#132b4f"]
  }
}`} />
        </Endpoint>

        <Endpoint method="get" path="/v1/convert">
          <p class="muted">Convert one color into hex, rgb, hsl and oklch.</p>
          <ParamTable>
            <Param name="c" req desc="Color in hex, rgb(), hsl() or oklch()" />
          </ParamTable>
          <Code lang="bash" code={`curl -H "Authorization: Bearer ak_live_yourkey" \\
  "https://api.ayushsharma.me/v1/convert?c=%233b82f6"`} />
          <Code lang="json" code={`{
  "ok": true,
  "data": {
    "hex": "#3b82f6",
    "rgb": "rgb(59, 130, 246)",
    "hsl": "hsl(217, 91%, 60%)",
    "oklch": "oklch(0.6231 0.188 259.81)"
  }
}`} />
        </Endpoint>
      </div>

      <div class="rule"><span class="plus tl" /></div>

      <div class="section">
        <h2>Text Intelligence</h2>
        <p class="muted">All endpoints take a JSON body with a <code>text</code> string (max 100 KB).</p>

        <Endpoint method="post" path="/v1/text/stats">
          <p class="muted">Word/character counts, reading time, and Flesch readability.</p>
          <Code lang="bash" code={`curl -X POST -H "Authorization: Bearer ak_live_yourkey" \\
  -H "Content-Type: application/json" \\
  -d '{"text":"The quick brown fox jumps over the lazy dog."}' \\
  https://api.ayushsharma.me/v1/text/stats`} />
          <Code lang="json" code={`{
  "ok": true,
  "data": {
    "characters": 44, "words": 9, "sentences": 1,
    "readingTime": "1 min read",
    "fleschReadingEase": 96.2,
    "fleschKincaidGrade": 1.3,
    "gradeLabel": "Very easy (5th grade)"
  }
}`} />
        </Endpoint>

        <Endpoint method="post" path="/v1/text/slug">
          <p class="muted">URL-safe slug from any string.</p>
          <Code lang="json" code={`// request:  { "text": "Hello, World! Café" }
{ "ok": true, "data": { "slug": "hello-world-cafe" } }`} />
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
          <Code lang="json" code={`{
  "ok": true,
  "data": { "keywords": [ { "word": "design", "count": 4 }, { "word": "color", "count": 3 } ] }
}`} />
        </Endpoint>
      </div>
    </Layout>
  );
}

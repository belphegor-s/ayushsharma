import type { Child } from 'hono/jsx';
import { CSS, COPY_JS, FONTS_HREF } from './theme';

type NavKey = 'console' | 'docs';

/** Four hairline corner markers - drop inside any `position:relative` box. */
export function Corners() {
  return (
    <>
      <span class="plus tl" />
      <span class="plus tr" />
      <span class="plus bl" />
      <span class="plus br" />
    </>
  );
}

/** Section divider with a corner marker at each end of the line. */
export function Rule() {
  return (
    <div class="rule">
      <span class="plus tl" />
      <span class="plus tr" />
    </div>
  );
}

/** Copy-to-clipboard button. `inblock` for the compact in-pill variant. */
export function CopyBtn(props: { text: string; inblock?: boolean }) {
  return (
    <button type="button" class={`copy${props.inblock ? ' inblock' : ''}`} data-copy={props.text} aria-label="Copy to clipboard" title="Copy">
      <svg class="i-copy" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
      <svg class="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </button>
  );
}

/** The base-URL pill with a live dot and an inline copy button. */
export function BaseUrl() {
  return (
    <span class="codeblock">
      <span class="dot" />
      https://app.ayushsharma.me
      <CopyBtn text="https://app.ayushsharma.me" inblock />
    </span>
  );
}

export function Layout(props: { title: string; active?: NavKey; children: Child }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <meta name="description" content="Developer API by Ayush Sharma. Design Toolkit and Text Intelligence endpoints. Sign in with Google to get an API key." />
        <link rel="icon" href="https://ayushsharma.me/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
        <link rel="stylesheet" href={FONTS_HREF} />
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
      </head>
      <body>
        <div class="wrap">
          <div class="frame">
            <span class="plus tl" />
            <span class="plus tr" />
            <span class="plus bl" />
            <span class="plus br" />
            <div class="bar">
              <span class="label">
                <span class="slash">/</span>app.ayushsharma.me
              </span>
              <nav class="nav">
                <a href="/docs" class={props.active === 'docs' ? 'active' : ''}>
                  docs
                </a>
                <a href="/console" class={props.active === 'console' ? 'active' : ''}>
                  console
                </a>
              </nav>
            </div>
            <div class="content">{props.children}</div>
            <footer class="foot">
              <span class="label">
                <a href="/privacy">privacy</a>
              </span>
              <span class="foot-sep">·</span>
              <span class="label">
                <a href="/terms">terms</a>
              </span>
              <span class="foot-sep">·</span>
              <span class="label">
                <a href="https://ayushsharma.me">ayushsharma.me</a>
              </span>
            </footer>
          </div>
        </div>
        <script dangerouslySetInnerHTML={{ __html: COPY_JS }} />
      </body>
    </html>
  );
}

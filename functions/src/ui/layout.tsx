import type { Child } from 'hono/jsx';
import { CSS, FONTS_HREF } from './theme';

type NavKey = 'console' | 'docs';

export function Layout(props: { title: string; active?: NavKey; children: Child }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{props.title}</title>
        <meta name="description" content="Developer API by Ayush Sharma. Design Toolkit and Text Intelligence endpoints. Sign in with Google to get an API key." />
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
            <div class="bar">
              <span class="label">
                <span class="slash">/</span>api.ayushsharma.me
              </span>
              <nav class="nav">
                <a href="/docs" class={props.active === 'docs' ? 'active' : ''}>docs</a>
                <a href="/console" class={props.active === 'console' ? 'active' : ''}>console</a>
              </nav>
            </div>
            {props.children}
            <footer class="foot">
              <span class="label">
                <a href="https://ayushsharma.me">ayushsharma.me</a>
              </span>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}

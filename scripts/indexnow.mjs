#!/usr/bin/env node
/**
 * IndexNow submitter.
 *
 * Pings IndexNow (https://www.indexnow.org) so participating search
 * engines (Bing, Yandex, Seznam, Naver, and Google via passthrough)
 * pick up new or updated URLs within minutes instead of days.
 *
 * Usage:
 *   node scripts/indexnow.mjs                # submit all URLs from sitemap
 *   node scripts/indexnow.mjs <url> [<url>]  # submit specific URLs
 *
 * Env (optional):
 *   INDEXNOW_KEY        override key (defaults to the constant below)
 *   INDEXNOW_HOST       override host (defaults to ayushsharma.me)
 */
import { XMLParser } from 'fast-xml-parser';

const KEY = process.env.INDEXNOW_KEY || 'c09b11e7b9014e01ae9b129cd2aab43c';
const HOST = process.env.INDEXNOW_HOST || 'ayushsharma.me';
const SITE = `https://${HOST}`;
const KEY_LOCATION = `${SITE}/${KEY}.txt`;
const SITEMAP_URL = `${SITE}/sitemap.xml`;

async function loadUrlsFromSitemap() {
  const res = await fetch(SITEMAP_URL);
  if (!res.ok) {
    throw new Error(`failed to fetch sitemap (${res.status} ${res.statusText})`);
  }
  const xml = await res.text();
  let urls = [];
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    const doc = parser.parse(xml);
    const items = doc?.urlset?.url;
    const arr = Array.isArray(items) ? items : items ? [items] : [];
    urls = arr.map((it) => it?.loc).filter(Boolean);
  } catch {
    urls = Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((m) => m[1]);
  }
  return urls;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function submit(urlList) {
  const payload = { host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });
  return { status: res.status, ok: res.ok, body: await res.text().catch(() => '') };
}

async function main() {
  const cliArgs = process.argv.slice(2);
  let urls;

  if (cliArgs.length > 0) {
    urls = cliArgs;
  } else {
    console.log(`fetching sitemap: ${SITEMAP_URL}`);
    urls = await loadUrlsFromSitemap();
  }

  urls = [...new Set(urls)].filter((u) => {
    try {
      const parsed = new URL(u);
      return parsed.host === HOST;
    } catch {
      return false;
    }
  });

  if (urls.length === 0) {
    console.error('no URLs to submit');
    process.exit(1);
  }

  console.log(`submitting ${urls.length} URL(s) for ${HOST}`);
  const batches = chunk(urls, 10000);
  let failed = 0;

  for (const [i, batch] of batches.entries()) {
    const { status, ok, body } = await submit(batch);
    const tag = batches.length > 1 ? ` [batch ${i + 1}/${batches.length}]` : '';
    if (ok || status === 202) {
      console.log(`✓ ${status}${tag} | ${batch.length} URL(s) accepted`);
    } else {
      failed += 1;
      console.error(`✗ ${status}${tag} | ${body || '(no body)'}`);
    }
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('indexnow: fatal:', err.message);
  process.exit(1);
});

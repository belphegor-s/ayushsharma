import { getAllPosts } from '@/lib/blog/posts';
import { siteConfig, absoluteUrl } from '@/lib/site';

function escapeXml(s = '') {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const dynamic = 'force-static';

export function GET() {
  const posts = getAllPosts();
  const updated = posts[0]?.updated || new Date().toISOString();

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      const cover = p.cover ? absoluteUrl(p.cover) : absoluteUrl(`/blog/${p.slug}/opengraph-image`);
      const ogImage = absoluteUrl(`/blog/${p.slug}/opengraph-image`);
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.description)}</description>
      <enclosure url="${ogImage}" type="image/png" length="0" />
      <media:content url="${ogImage}" medium="image" type="image/png" />
      <media:thumbnail url="${cover}" />
      ${p.tags.map((t) => `<category>${escapeXml(t)}</category>`).join('\n      ')}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${escapeXml(siteConfig.name)} · Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/blog/rss.xml')}" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

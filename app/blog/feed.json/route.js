import { getAllPosts } from '@/lib/blog/posts';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const posts = getAllPosts();
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: `${siteConfig.name} — Blog`,
    home_page_url: absoluteUrl('/blog'),
    feed_url: absoluteUrl('/blog/feed.json'),
    description: siteConfig.description,
    language: 'en-us',
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    items: posts.map((p) => ({
      id: absoluteUrl(`/blog/${p.slug}`),
      url: absoluteUrl(`/blog/${p.slug}`),
      title: p.title,
      summary: p.description,
      content_text: p.description,
      date_published: new Date(p.date).toISOString(),
      date_modified: new Date(p.updated).toISOString(),
      tags: p.tags,
      image: p.cover ? absoluteUrl(p.cover) : undefined,
    })),
  };

  return Response.json(feed, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

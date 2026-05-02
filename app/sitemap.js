import { getAllPosts, getAllTags } from '@/lib/blog/posts';
import { siteConfig } from '@/lib/site';

export default function sitemap() {
  const base = siteConfig.url;
  const now = new Date();

  const staticEntries = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/blog/tags`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const posts = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.updated || p.date),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const tags = getAllTags().map(({ name }) => ({
    url: `${base}/blog/tag/${encodeURIComponent(name)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticEntries, ...posts, ...tags];
}

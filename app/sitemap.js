import { siteConfig } from '@/lib/site';

export default function sitemap() {
  const base = siteConfig.url;
  const now = new Date();

  const staticEntries = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  return [...staticEntries];
}

import Link from 'next/link';
import { getAllTags } from '@/lib/blog/posts';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata = {
  title: 'All tags',
  description: 'Browse posts by topic.',
  alternates: { canonical: '/blog/tags' },
  openGraph: {
    type: 'website',
    title: 'All tags — Blog',
    description: 'Browse posts by topic.',
    url: absoluteUrl('/blog/tags'),
    siteName: siteConfig.name,
  },
};

export default function TagsIndexPage() {
  const tags = getAllTags();

  return (
    <>
      <header className="mb-10">
        <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">
          ← All posts
        </Link>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">Tags</h1>
        <p className="mt-2 text-gray-400">
          {tags.length} topic{tags.length === 1 ? '' : 's'}.
        </p>
      </header>

      {tags.length === 0 ? (
        <p className="text-gray-500">No tags yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {tags.map(({ name, count }) => (
            <li key={name}>
              <Link
                href={`/blog/tag/${encodeURIComponent(name)}`}
                className="group inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/40 px-4 py-2 text-sm transition-colors hover:border-blue-500/50 hover:bg-neutral-900/70"
              >
                <span className="text-blue-300 group-hover:text-blue-200">#{name}</span>
                <span className="text-xs text-gray-500 group-hover:text-gray-400">{count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

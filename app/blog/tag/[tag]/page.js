import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getAllTags, getPostsByTag } from '@/lib/blog/posts';
import PostCard from '@/components/blog/PostCard';
import { siteConfig, absoluteUrl } from '@/lib/site';

export function generateStaticParams() {
  return getAllTags().map(({ name }) => ({ tag: name }));
}

export async function generateMetadata({ params }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  return {
    title: `#${decoded} — Blog`,
    description: `Posts tagged #${decoded}.`,
    alternates: { canonical: `/blog/tag/${decoded}` },
    openGraph: {
      title: `#${decoded} — Blog`,
      description: `Posts tagged #${decoded}.`,
      url: absoluteUrl(`/blog/tag/${decoded}`),
      siteName: siteConfig.name,
      type: 'website',
    },
  };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const posts = getPostsByTag(decoded).map(({ content, ...rest }) => rest);
  if (!posts.length) notFound();

  return (
    <>
      <header className="mb-10">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> All posts
        </Link>
        <h1 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-white">
          <span className="text-blue-400">#</span>
          {decoded}
        </h1>
        <p className="mt-2 text-gray-400">
          {posts.length} post{posts.length === 1 ? '' : 's'}
        </p>
      </header>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {posts.map((p, i) => (
          <PostCard key={p.slug} post={p} priority={i < 2} />
        ))}
      </div>
    </>
  );
}

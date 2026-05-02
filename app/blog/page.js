import { getAllPosts, getAllTags } from '@/lib/blog/posts';
import BlogListing from '@/components/blog/BlogListing';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata = {
  title: 'Writing',
  description:
    'Essays on software, AI, agents, and the craft of building. Notes from the workshop.',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/blog/rss.xml' },
  },
  openGraph: {
    type: 'website',
    title: 'Writing',
    description: 'Essays on software, AI, agents, and the craft of building.',
    url: absoluteUrl('/blog'),
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Writing',
    description: 'Essays on software, AI, agents, and the craft of building.',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  const serializable = posts.map(({ content, ...rest }) => rest);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Writing — Ayush Sharma',
    url: absoluteUrl('/blog'),
    description: 'Essays on software, AI, agents, and the craft of building.',
    blogPost: posts.slice(0, 20).map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: absoluteUrl(`/blog/${p.slug}`),
      datePublished: p.date,
      dateModified: p.updated,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10 md:mb-14">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">Writing</h1>
        <p className="mt-3 max-w-2xl text-gray-400 leading-relaxed">
          {"Essays on software, AI, and the craft of building. Long-form notes that don't fit on Twitter and shouldn't."}
        </p>
      </header>
      <BlogListing posts={serializable} tags={tags} />
    </>
  );
}

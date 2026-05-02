import { getAllPosts, getAllTags } from '@/lib/blog/posts';
import BlogListing from '@/components/blog/BlogListing';
import { siteConfig, absoluteUrl } from '@/lib/site';

export const metadata = {
  title: 'Blog',
  description:
    'Where I work things out in public. Software, AI, agents, and the occasional rant.',
  alternates: {
    canonical: '/blog',
    types: { 'application/rss+xml': '/blog/rss.xml' },
  },
  openGraph: {
    type: 'website',
    title: 'Blog',
    description: 'Where I work things out in public. Software, AI, agents, and the occasional rant.',
    url: absoluteUrl('/blog'),
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog',
    description: 'Where I work things out in public. Software, AI, agents, and the occasional rant.',
  },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  const serializable = posts.map(({ content, ...rest }) => rest);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${siteConfig.name} — Blog`,
    url: absoluteUrl('/blog'),
    description: 'Where I work things out in public. Software, AI, agents, and the occasional rant.',
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
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white">Blog</h1>
        <p className="mt-3 max-w-2xl text-gray-400 leading-relaxed">
          Where I work things out in public — software, AI, and the occasional rant.
        </p>
      </header>
      <BlogListing posts={serializable} tags={tags} />
    </>
  );
}

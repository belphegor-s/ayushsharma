import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPost, getPostNeighbors, formatDate } from '@/lib/blog/posts';
import { remarkPlugins, rehypePlugins } from '@/lib/blog/rehype-config';
import { mdxComponents } from '@/lib/blog/mdx';
import { siteConfig, absoluteUrl } from '@/lib/site';
import Prose from '@/components/blog/Prose';
import PostMeta from '@/components/blog/PostMeta';
import TagPill from '@/components/blog/TagPill';
import PrevNext from '@/components/blog/PrevNext';
import TableOfContents from '@/components/blog/TableOfContents';

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  const url = absoluteUrl(`/blog/${post.slug}`);
  const ogImage = absoluteUrl(`/blog/${post.slug}/opengraph-image`);

  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: siteConfig.name,
      publishedTime: post.date,
      modifiedTime: post.updated,
      authors: [siteConfig.author.name],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [ogImage],
      creator: siteConfig.author.twitter,
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { prev, next } = getPostNeighbors(slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.cover ? absoluteUrl(post.cover) : absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    datePublished: post.date,
    dateModified: post.updated,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(`/blog/${post.slug}`) },
    keywords: post.tags.join(', '),
    wordCount: post.wordCount,
    articleSection: post.tags[0] || 'Essays',
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/blog"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={14} /> All posts
      </Link>

      <header className="mb-10">
        {post.tags?.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
          </div>
        )}
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15]">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-4 max-w-2xl text-lg text-gray-400 leading-relaxed">{post.description}</p>
        )}
        <div className="mt-5">
          <PostMeta date={post.date} readingTime={post.readingTime} />
        </div>
      </header>

      {post.cover && (
        <div className="relative mb-12 aspect-[16/8] w-full overflow-hidden rounded-xl border border-neutral-800/70">
          <Image
            src={post.cover}
            alt={post.coverAlt || post.title}
            fill
            sizes="(min-width: 1024px) 960px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_220px]">
        <Prose>
          <MDXRemote
            source={post.content}
            components={mdxComponents}
            options={{
              mdxOptions: { remarkPlugins, rehypePlugins },
              parseFrontmatter: false,
            }}
          />
        </Prose>
        <TableOfContents content={post.content} />
      </div>

      <footer className="mt-16 border-t border-neutral-800/70 pt-8">
        <p className="text-sm text-gray-400">
          Found this useful? Share it, or{' '}
          <a
            href={`mailto:${siteConfig.author.email}?subject=${encodeURIComponent(post.title)}`}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            send a note
          </a>
          .
        </p>
        <PrevNext prev={prev} next={next} />
      </footer>
    </article>
  );
}

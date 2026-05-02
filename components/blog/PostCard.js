'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import PostMeta from './PostMeta';

export default function PostCard({ post, priority = false }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800/70 bg-neutral-900/40 backdrop-blur-sm hover:border-blue-500/40 hover:bg-neutral-900/60 transition-colors"
    >
      <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10" aria-label={post.title} />
      {post.cover ? (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
          <Image
            src={post.cover}
            alt={post.coverAlt || post.title}
            fill
            sizes="(min-width: 1024px) 480px, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            priority={priority}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/70 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="aspect-[16/9] w-full bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900" />
      )}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <PostMeta date={post.date} readingTime={post.readingTime} />
        <h2 className="text-lg md:text-xl font-semibold text-white leading-snug tracking-tight line-clamp-2 group-hover:text-blue-300 transition-colors">
          {post.title}
        </h2>
        {post.description && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{post.description}</p>
        )}
        {post.tags?.length > 0 && (
          <div className="relative z-20 mt-auto flex flex-wrap gap-1.5 pt-2">
            {post.tags.slice(0, 4).map((tag) => (
              <Link
                key={tag}
                href={`/blog/tag/${encodeURIComponent(tag)}`}
                className="text-[11px] text-blue-300/80 font-medium hover:text-blue-200 hover:underline underline-offset-2"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

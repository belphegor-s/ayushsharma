'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Rss } from 'lucide-react';

export default function BlogHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-30 w-full border-b border-neutral-800/60 bg-neutral-900/70 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>ayush</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/blog/rss.xml"
            className="text-gray-400 hover:text-blue-300 transition-colors"
            aria-label="RSS feed"
            title="RSS feed"
          >
            <Rss size={16} />
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}

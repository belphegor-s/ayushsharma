'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-container">
      <motion.div
        className="relative z-10 text-center bg-neutral-700/50 backdrop-blur-sm p-8 px-4 md:p-12 rounded-xl shadow-lg border border-neutral-800/50 max-w-2xl w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <p className="font-mono text-sm text-blue-400 mb-2">404</p>
        <h1 className="text-3xl md:text-4xl font-semibold text-white mb-3">Page not found</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {"This page doesn't exist, was moved, or never made it past the cutting room floor."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 text-sm transition-colors shadow-lg"
          >
            ← Home
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-lg border border-blue-400 text-blue-300 hover:text-white hover:border-white px-4 py-2 text-sm font-medium transition-colors"
          >
            Read the blog
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

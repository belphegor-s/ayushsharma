'use client';
import { useEffect } from 'react';
import Link from 'next/link';

export default function BlogError({ error, reset }) {
  useEffect(() => {
    console.error('blog route error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <p className="mb-2 text-sm font-mono text-red-400">error</p>
      <h1 className="mb-3 text-3xl font-semibold text-white">Something broke here</h1>
      <p className="mb-6 max-w-md text-gray-400">
        {"This page hit an error while rendering. The issue has been logged. Try again or head back to the index."}
      </p>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-blue-500/40 px-4 py-2 text-sm text-blue-300 hover:border-blue-500 hover:text-white transition-colors cursor-pointer"
        >
          Try again
        </button>
        <Link
          href="/blog"
          className="rounded-lg border border-neutral-700 px-4 py-2 text-sm text-gray-300 hover:border-neutral-500 hover:text-white transition-colors"
        >
          All posts
        </Link>
      </div>
    </div>
  );
}

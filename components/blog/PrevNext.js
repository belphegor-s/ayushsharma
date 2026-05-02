import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function PrevNext({ prev, next }) {
  if (!prev && !next) return null;
  return (
    <nav className="mt-16 grid grid-cols-1 gap-3 md:grid-cols-2" aria-label="Post navigation">
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="group flex flex-col gap-1 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-4 hover:border-blue-500/40 hover:bg-neutral-900/60 transition-colors"
        >
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            <ArrowLeft size={12} /> Previous
          </span>
          <span className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex flex-col items-end gap-1 rounded-xl border border-neutral-800/70 bg-neutral-900/40 p-4 text-right hover:border-blue-500/40 hover:bg-neutral-900/60 transition-colors"
        >
          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
            Next <ArrowRight size={12} />
          </span>
          <span className="text-sm font-medium text-gray-200 group-hover:text-white line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}

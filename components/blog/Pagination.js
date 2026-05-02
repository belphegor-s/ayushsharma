import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function buildHref(basePath, page) {
  if (page <= 1) return basePath;
  const sep = basePath.includes('?') ? '&' : '?';
  return `${basePath}${sep}page=${page}`;
}

export default function Pagination({ basePath, currentPage, totalPages }) {
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  const linkCls = 'inline-flex items-center justify-center min-w-[36px] h-9 px-3 rounded-md text-sm border border-neutral-800 text-gray-300 hover:text-white hover:border-blue-500/50 transition-colors';
  const activeCls = 'border-blue-500 text-white bg-blue-600/20';
  const disabledCls = 'opacity-40 pointer-events-none';

  return (
    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
      <Link
        href={buildHref(basePath, currentPage - 1)}
        className={`${linkCls} ${currentPage === 1 ? disabledCls : ''}`}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </Link>
      {pages.map((p) => (
        <Link
          key={p}
          href={buildHref(basePath, p)}
          className={`${linkCls} ${p === currentPage ? activeCls : ''}`}
          aria-current={p === currentPage ? 'page' : undefined}
        >
          {p}
        </Link>
      ))}
      <Link
        href={buildHref(basePath, currentPage + 1)}
        className={`${linkCls} ${currentPage === totalPages ? disabledCls : ''}`}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}

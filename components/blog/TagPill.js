import Link from 'next/link';

export default function TagPill({ tag, active = false, asLink = true, count = null, onClick }) {
  const base =
    'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 select-none';
  const styles = active
    ? 'bg-blue-600/90 text-white border border-blue-500'
    : 'bg-neutral-800/60 text-blue-200 border border-neutral-700 hover:border-blue-500/60 hover:text-white';

  const content = (
    <>
      <span>#{tag}</span>
      {count != null && <span className="text-[10px] opacity-60">{count}</span>}
    </>
  );

  if (!asLink) {
    return (
      <button type="button" onClick={onClick} className={`${base} ${styles} cursor-pointer`}>
        {content}
      </button>
    );
  }

  return (
    <Link href={`/blog/tag/${encodeURIComponent(tag)}`} className={`${base} ${styles}`}>
      {content}
    </Link>
  );
}

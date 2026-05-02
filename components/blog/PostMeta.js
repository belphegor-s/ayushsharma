import { formatDate } from '@/lib/blog/format';

export default function PostMeta({ date, readingTime, className = '' }) {
  return (
    <div className={`flex items-center gap-2 text-xs text-gray-400 ${className}`}>
      <time dateTime={date}>{formatDate(date)}</time>
      {readingTime && (
        <>
          <span aria-hidden="true">·</span>
          <span>{readingTime}</span>
        </>
      )}
    </div>
  );
}

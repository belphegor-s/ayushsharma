'use client';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import PostCard from './PostCard';
import SearchBar from './SearchBar';
import TagFilter from './TagFilter';
import { POSTS_PER_PAGE_CLIENT } from './constants';

export default function BlogListing({ posts, tags }) {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [page, setPage] = useState(1);

  const toggleTag = (tag) => {
    setPage(1);
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (selectedTags.length && !selectedTags.every((t) => p.tags.includes(t))) return false;
      if (!q) return true;
      if (p.title.toLowerCase().includes(q)) return true;
      if (p.description.toLowerCase().includes(q)) return true;
      if (p.tags.some((t) => t.toLowerCase().includes(q))) return true;
      return false;
    });
  }, [posts, query, selectedTags]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE_CLIENT));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * POSTS_PER_PAGE_CLIENT;
  const visible = filtered.slice(start, start + POSTS_PER_PAGE_CLIENT);

  const onSearchChange = (v) => {
    setPage(1);
    setQuery(v);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <SearchBar value={query} onChange={onSearchChange} />
        <TagFilter tags={tags} selected={selectedTags} onToggle={toggleTag} />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-800 py-16 text-center text-gray-400">
          <p className="text-base">No posts match your filters.</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedTags([]);
            }}
            className="mt-3 text-sm text-blue-400 hover:text-blue-300 underline underline-offset-2"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <motion.div
          key={`${query}-${selectedTags.join(',')}-${safePage}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
        >
          {visible.map((p, i) => (
            <PostCard key={p.slug} post={p} priority={i < 2} />
          ))}
        </motion.div>
      )}

      {totalPages > 1 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:border-blue-500/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Prev
          </button>
          <span className="text-xs text-gray-500">
            Page {safePage} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="rounded-md border border-neutral-800 px-3 py-1.5 text-sm text-gray-300 hover:text-white hover:border-blue-500/50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

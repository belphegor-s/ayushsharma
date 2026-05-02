'use client';
import { Loader2, Search, X } from 'lucide-react';

export default function SearchBar({
  value,
  onChange,
  loading = false,
  placeholder = 'Search posts…',
}) {
  return (
    <div className="relative w-full">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
      />
      <input
        type="text"
        inputMode="search"
        enterKeyHint="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search posts"
        autoComplete="off"
        spellCheck={false}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900/60 py-2 pl-9 pr-16 text-sm text-white placeholder-gray-500 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-colors"
      />
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
        {loading && (
          <Loader2
            size={14}
            className="animate-spin text-gray-500"
            aria-label="Searching"
          />
        )}
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="pointer-events-auto rounded p-1 text-gray-500 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

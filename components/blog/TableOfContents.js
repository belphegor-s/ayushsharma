'use client';
import { useEffect, useState } from 'react';

function extractHeadings(content) {
  const headings = [];
  const lines = content.split('\n');
  let inFence = false;
  for (const line of lines) {
    if (/^```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const level = match[1].length;
    const text = match[2].replace(/[#*_`]/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }
  return headings;
}

export default function TableOfContents({ content }) {
  const headings = extractHeadings(content);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-72px 0px -70% 0px', threshold: 0 }
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-auto pr-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          On this page
        </p>
        <ul className="space-y-2 text-sm">
          {headings.map((h) => (
            <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
              <a
                href={`#${h.id}`}
                className={`block border-l-2 pl-3 py-0.5 transition-colors ${
                  activeId === h.id
                    ? 'border-blue-500 text-blue-300'
                    : 'border-neutral-800 text-gray-400 hover:text-white hover:border-neutral-600'
                }`}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

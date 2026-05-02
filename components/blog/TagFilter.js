'use client';
import TagPill from './TagPill';

export default function TagFilter({ tags, selected, onToggle }) {
  if (!tags?.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map(({ name, count }) => (
        <TagPill
          key={name}
          tag={name}
          count={count}
          active={selected.includes(name)}
          asLink={false}
          onClick={() => onToggle(name)}
        />
      ))}
    </div>
  );
}

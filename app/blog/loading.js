export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="mb-10 h-10 w-64 rounded bg-neutral-800/60" />
      <div className="mb-6 h-9 w-full rounded bg-neutral-800/40" />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-neutral-800/70">
            <div className="aspect-[16/9] bg-neutral-800/40" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-24 rounded bg-neutral-800/60" />
              <div className="h-5 w-3/4 rounded bg-neutral-800/60" />
              <div className="h-4 w-full rounded bg-neutral-800/40" />
              <div className="h-4 w-2/3 rounded bg-neutral-800/40" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

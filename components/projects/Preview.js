import { Lock } from 'lucide-react';
import LiveSite from '@/components/projects/LiveSite';

export function LiveBadge({ pulse = false }) {
  return (
    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
      <span aria-hidden className="relative flex size-1.5">
        {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />}
        <span className="relative size-1.5 rounded-full bg-emerald-500" />
      </span>
      Live
    </span>
  );
}

/* A quiet browser window: traffic lights, the address, and whatever status sits
   on the right. Drawn in the site's own tokens so it follows the theme. */
export function BrowserFrame({ domain, status, className = '', children }) {
  return (
    <figure className={`overflow-hidden rounded-lg border border-line-strong bg-surface ${className}`}>
      <figcaption className="flex h-7 items-center gap-3 border-b border-line px-2.5">
        <span aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
        </span>
        <span className="mx-auto flex h-[18px] min-w-0 max-w-[70%] items-center gap-1 rounded-[5px] bg-bg px-2 font-mono text-[10px] text-subtle ring-1 ring-line">
          <Lock size={9} strokeWidth={2} aria-hidden className="shrink-0" />
          <span className="truncate">{domain}</span>
        </span>
        {status}
      </figcaption>
      <div className="relative overflow-hidden">{children}</div>
    </figure>
  );
}

/* The project's real site running in a browser window. In a card it is passive,
   so the card stays one button; the dialog renders it interactive. The live dot
   pulses only where one preview has the stage, never across a grid. */
export default function Preview({ project, interactive = false, pulse = false, status, className = '' }) {
  return (
    <BrowserFrame domain={project.domain} status={status ?? <LiveBadge pulse={pulse} />} className={className}>
      <LiveSite project={project} interactive={interactive} />
    </BrowserFrame>
  );
}

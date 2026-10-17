'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, LoaderCircle } from 'lucide-react';

// Desktop layout the site is rendered at, then scaled to fit the frame.
const WIDTH = 1280;
const HEIGHT = 800;
// Below this frame width an interactive preview renders the tablet layout
// instead, so text stays large enough to use.
const NARROW = 560;
const NARROW_WIDTH = 900;
// After this long without a load event the frame offers the real site instead.
const TIMEOUT = 15000;

/* The project's real site, running, in an iframe. A card's frame waits until the
   page is idle and the card is nearly in view, and is torn down again once it is
   well off screen, so only the couple of sites in view are ever running. Passive
   previews are inert: no pointer, no focus, hidden from assistive tech, so the
   card around them stays one button. The framed site picks its own theme from
   the visitor's system setting, exactly as it would in its own tab. */
export default function LiveSite({ project, interactive = false }) {
  const box = useRef(null);
  const [width, setWidth] = useState(0);
  const [near, setNear] = useState(false);
  const [idle, setIdle] = useState(interactive);
  const [loaded, setLoaded] = useState(false);
  const [stalled, setStalled] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => setSaveData(Boolean(navigator.connection?.saveData) && !interactive), [interactive]);

  // Cards never compete with this page's own first load.
  useEffect(() => {
    if (interactive) return;
    const start = () => setIdle(true);
    if (!('requestIdleCallback' in window)) {
      const timer = setTimeout(start, 1500);
      return () => clearTimeout(timer);
    }
    const handle = requestIdleCallback(start, { timeout: 3000 });
    return () => cancelIdleCallback(handle);
  }, [interactive]);

  useEffect(() => {
    const el = box.current;
    const size = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    size.observe(el);
    if (interactive) {
      setNear(true);
      return () => size.disconnect();
    }
    // Two bands so a frame near the edge does not flap: it mounts once within a
    // quarter screen of the viewport and unmounts only past a screen and a half.
    const enter = new IntersectionObserver(([entry]) => entry.isIntersecting && setNear(true), { rootMargin: '25% 0px' });
    const leave = new IntersectionObserver(([entry]) => !entry.isIntersecting && setNear(false), { rootMargin: '150% 0px' });
    enter.observe(el);
    leave.observe(el);
    return () => {
      size.disconnect();
      enter.disconnect();
      leave.disconnect();
    };
  }, [interactive]);

  const mounted = near && idle && !saveData;

  useEffect(() => {
    if (mounted) return;
    setLoaded(false);
    setStalled(false);
  }, [mounted]);

  useEffect(() => {
    if (!mounted || loaded) return;
    const timer = setTimeout(() => setStalled(true), TIMEOUT);
    return () => clearTimeout(timer);
  }, [mounted, loaded]);

  const layout = interactive && width > 0 && width < NARROW ? NARROW_WIDTH : WIDTH;
  const scale = width / layout;

  return (
    <div ref={box} inert={!interactive} className="relative aspect-[8/5] w-full overflow-hidden bg-bg">
      {mounted && width > 0 && (
        <iframe
          src={project.url}
          title={interactive ? `${project.name}, running live` : undefined}
          aria-hidden={!interactive || undefined}
          tabIndex={interactive ? undefined : -1}
          width={layout}
          height={layout * (HEIGHT / WIDTH)}
          sandbox={interactive ? 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox' : 'allow-scripts allow-same-origin'}
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setLoaded(true)}
          style={{ transform: `scale(${scale})` }}
          className={`absolute left-0 top-0 origin-top-left border-0 bg-bg transition-opacity duration-500 ${interactive ? '' : 'pointer-events-none'} ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      )}
      {!loaded && <Placeholder project={project} stalled={stalled || saveData} interactive={interactive} />}
    </div>
  );
}

/* Holds the frame's space while the site boots: a faint wireframe of a landing
   page under a shimmer, with the address being reached. */
function Placeholder({ project, stalled, interactive }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-surface">
      <div aria-hidden className="absolute inset-0 flex flex-col gap-[6%] p-[6%] opacity-70">
        <div className="flex items-center justify-between">
          <span className="h-[5%] min-h-1.5 w-[14%] rounded-sm bg-line-strong" />
          <span className="flex w-[30%] gap-[8%]">
            <span className="h-1.5 flex-1 rounded-sm bg-line" />
            <span className="h-1.5 flex-1 rounded-sm bg-line" />
            <span className="h-1.5 flex-1 rounded-sm bg-line" />
          </span>
        </div>
        <div className="mt-[4%] flex w-[55%] flex-col gap-2">
          <span className="h-3 w-full rounded-sm bg-line-strong sm:h-4" />
          <span className="h-3 w-4/5 rounded-sm bg-line-strong sm:h-4" />
          <span className="mt-1 h-1.5 w-11/12 rounded-sm bg-line" />
          <span className="h-1.5 w-3/4 rounded-sm bg-line" />
          <span className="mt-2 h-4 w-1/4 rounded-sm bg-line-strong" />
        </div>
      </div>
      <div aria-hidden className="live-shimmer absolute inset-0" />
      <div className="absolute inset-0 grid place-items-center">
        {stalled && interactive ? (
          <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-fg px-2.5 py-1.5 text-xs font-medium text-bg shadow-lg">
            Open {project.domain}
            <ArrowUpRight size={13} strokeWidth={2} aria-hidden />
          </a>
        ) : stalled ? null : (
          <span
            role={interactive ? 'status' : undefined}
            className="inline-flex items-center gap-1.5 rounded-md border border-line bg-bg/80 px-2 py-1 font-mono text-[10px] text-subtle backdrop-blur-sm"
          >
            <LoaderCircle size={11} strokeWidth={2} className="animate-spin motion-reduce:animate-none" aria-hidden />
            {project.domain}
          </span>
        )}
      </div>
    </div>
  );
}

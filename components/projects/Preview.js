import Image from 'next/image';
import { Lock } from 'lucide-react';
import previews from '@/lib/previews.json';

/* Screenshots of each live site, captured by `npm run previews` (most of these
   sites refuse to be framed, so a real iframe is not an option). Both themes are
   rendered and CSS shows one; the hidden image is lazy and display:none, so the
   browser never fetches it. */
export function hasPreview(slug) {
  return Boolean(previews[slug]);
}

export function Shot({ slug, alt, sizes, priority = false, className = '' }) {
  const shot = previews[slug];
  if (!shot) return null;
  const variants = shot.dark
    ? [
        [shot.light, 'dark:hidden'],
        [shot.dark, 'hidden dark:block'],
      ]
    : [[shot.light, '']];

  return variants.map(([image, visibility]) => (
    <Image
      key={image.src}
      src={image.src}
      width={image.width}
      height={image.height}
      alt={alt}
      sizes={sizes}
      quality={85}
      priority={priority}
      placeholder="blur"
      blurDataURL={image.blur}
      draggable={false}
      className={`${visibility} block h-auto w-full select-none ${className}`}
    />
  ));
}

/* A quiet browser window around the screenshot: traffic lights, the address, and
   a live dot (pulsing only where one preview has the stage, never across a grid).
   The frame is drawn in the site's own tokens so it follows the theme. */
export default function Preview({ project, sizes, priority = false, pulse = false, className = '', imageClassName = '' }) {
  if (!hasPreview(project.slug)) return null;
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
          <span className="truncate">{project.domain}</span>
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle">
          <span aria-hidden className="relative flex size-1.5">
            {pulse && <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60 motion-reduce:hidden" />}
            <span className="relative size-1.5 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </figcaption>
      <div className="relative overflow-hidden">
        <Shot slug={project.slug} alt={`${project.name} homepage at ${project.domain}`} sizes={sizes} priority={priority} className={imageClassName} />
      </div>
    </figure>
  );
}

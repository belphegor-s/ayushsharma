import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

/* Crisp plus marker built from two 1px lines so it centers exactly on a point. */
const PLUS_POS = {
  tl: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
  tr: 'right-0 top-0 translate-x-1/2 -translate-y-1/2',
  bl: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
  br: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
  l: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
  r: 'right-0 top-0 translate-x-1/2 -translate-y-1/2',
};

const Plus = ({ at = 'tl' }) => (
  <span aria-hidden className={`pointer-events-none absolute z-20 block h-[9px] w-[9px] ${PLUS_POS[at]}`}>
    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/25" />
    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/25" />
  </span>
);

const Label = ({ children, accent }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
    {accent && <span className="font-bold text-blue-400">/</span>}
    {children}
  </span>
);

export default function LegalPage({ slug, title, updated, children }) {
  return (
    <div className="bg-container relative flex min-h-screen w-full flex-col text-white">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 sm:px-0">
        <div className="content-frame relative flex flex-1 flex-col border-x border-white/10">
          <Plus at="tl" />
          <Plus at="tr" />

          {/* Top meta bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <Label accent>{slug}</Label>
            <Link href="/" className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-blue-400">
              <ArrowLeft size={12} /> home
            </Link>
          </div>

          {/* Content */}
          <article className="flex-1 px-6 py-12 sm:px-8 sm:py-16">
            <header className="mb-10">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
              <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/30">Last updated · {updated}</p>
            </header>

            <div className="legal-prose space-y-8 text-sm leading-relaxed text-white/65">{children}</div>
          </article>

          <Plus at="bl" />
          <Plus at="br" />
        </div>
      </div>
    </div>
  );
}

export function Section({ heading, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base font-semibold tracking-tight text-white/90">{heading}</h2>
      {children}
    </section>
  );
}

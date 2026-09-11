/* Layout primitives for the grid system: full-bleed hairlines, a framed center
   column with side rails, and plus markers where rails cross lines. */

/* Offsets are exact: a 11px marker whose 1px arms sit at 5px lands its center
   on the border pixel of a bordered box (padding edge -6px). */
const PLUS_POS = {
  tl: '-left-1.5 -top-1.5',
  tr: '-right-1.5 -top-1.5',
  bl: '-left-1.5 -bottom-1.5',
  br: '-right-1.5 -bottom-1.5',
};

export function Plus({ at = 'tl' }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute z-10 block size-[11px] ${PLUS_POS[at]}`}>
      <span className="absolute left-[5px] top-0 h-full w-px bg-cross" />
      <span className="absolute left-0 top-[5px] h-px w-full bg-cross" />
    </span>
  );
}

/* One horizontal band of the page. The outer element carries the full-bleed
   line, the inner one the rails. Plus markers pin to the bottom corners. */
export function Row({ as: Tag = 'div', last = false, className = '', frameClassName = '', children, ...props }) {
  return (
    <Tag className={`px-4 sm:px-6 ${last ? '' : 'border-b border-line'} ${className}`} {...props}>
      <div className={`relative mx-auto max-w-4xl border-x border-line ${frameClassName}`}>
        {children}
        {!last && (
          <>
            <Plus at="bl" />
            <Plus at="br" />
          </>
        )}
      </div>
    </Tag>
  );
}

/* Empty hatched band that gives sections room to breathe. */
export function Spacer() {
  return <Row aria-hidden frameClassName="hatch h-8 sm:h-10" />;
}

export function Label({ as: Tag = 'span', className = '', children, ...props }) {
  return (
    <Tag className={`font-mono text-[11px] uppercase tracking-[0.14em] text-subtle ${className}`} {...props}>
      {children}
    </Tag>
  );
}

const BUTTON_BASE =
  'inline-flex h-8 shrink-0 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[13px] font-medium transition-colors disabled:pointer-events-none disabled:opacity-50';

export const buttonClass = {
  primary: `${BUTTON_BASE} bg-fg text-bg hover:bg-fg/85`,
  secondary: `${BUTTON_BASE} border border-line-strong bg-bg text-fg hover:bg-surface-2`,
};

/* Text links everywhere: dashed underline that lights up to full contrast on hover. */
export const textLinkClass = 'underline decoration-subtle/60 decoration-dashed decoration-1 underline-offset-4 transition-colors hover:text-fg hover:decoration-fg';

export const navItemClass = 'inline-flex h-7 cursor-pointer items-center rounded-md px-2 text-[13px] text-muted transition-colors hover:bg-surface-2 hover:text-fg';

export const iconButtonClass = 'grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-subtle transition-colors hover:bg-surface-2 hover:text-fg';

'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { Plus, iconButtonClass } from '@/components/ui/frame';
import { play } from '@/lib/sound';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
const EASE = [0.22, 1, 0.36, 1];

/* Accessible dialog: portal, focus trap, Escape and backdrop to close, scroll
   lock, and focus returned to the trigger on close. `sound` is what plays as it opens. */
export default function Modal({ open, onClose, labelledBy, sound = 'open', className = '', children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Sound follows the open state itself, so every way in or out (button, Escape, backdrop) is heard.
  const wasOpen = useRef(false);
  useEffect(() => {
    if (open === wasOpen.current) return;
    wasOpen.current = open;
    play(open ? sound : 'close');
  }, [open, sound]);

  if (!mounted) return null;

  return createPortal(
    /* Honours "reduce motion" for every dialog animation. This used to wrap the whole
       page; it lives here now so framer-motion loads with the dialogs, not with the page. */
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <Dialog key="dialog" onClose={onClose} labelledBy={labelledBy} className={className}>
            {children}
          </Dialog>
        )}
      </AnimatePresence>
    </MotionConfig>,
    document.body
  );
}

function Dialog({ onClose, labelledBy, className, children }) {
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const panel = panelRef.current;
    const previous = document.activeElement;
    const root = document.documentElement;
    const overflow = root.style.overflow;
    root.style.overflow = 'hidden';
    // Jump into the first field only with a mouse or trackpad; on touch that
    // would pop the keyboard over the dialog before it is even read.
    const autofocus = window.matchMedia('(pointer: fine)').matches && panel.querySelector('[data-autofocus]');
    (autofocus || panel).focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCloseRef.current();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = Array.from(panel.querySelectorAll(FOCUSABLE)).filter((el) => el.getClientRects().length > 0);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && (active === first || active === panel)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      root.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus({ preventScroll: true });
    };
  }, []);

  return (
    <motion.div className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
      <div aria-hidden className="absolute inset-0 bg-black/35 backdrop-blur-[2px] dark:bg-black/70" onClick={onClose} />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`relative flex max-h-[calc(100dvh-1.5rem)] w-full flex-col border border-line-strong bg-bg shadow-[0_24px_64px_-16px_rgba(0,0,0,0.28)] outline-none sm:max-h-[min(88vh,56rem)] ${className}`}
        initial={{ opacity: 0, y: 12, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.985, transition: { duration: 0.15 } }}
        transition={{ duration: 0.24, ease: EASE }}
      >
        <Plus at="tl" />
        <Plus at="tr" />
        <Plus at="bl" />
        <Plus at="br" />
        {children}
      </motion.div>
    </motion.div>
  );
}

export function ModalHeader({ onClose, actions, children }) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-4 border-b border-line pl-5 pr-2 sm:pl-6">
      <div className="min-w-0 truncate">{children}</div>
      <div className="flex items-center gap-0.5">
        {actions}
        <button type="button" data-sound="none" onClick={onClose} aria-label="Close" className={iconButtonClass}>
          <X size={16} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  );
}

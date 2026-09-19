'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import posthog, { initPostHog } from '@/lib/posthog';

/* Every dialog on the home page, and the framer-motion and sonner code they lean on,
   lives behind these imports. None of it is in the page bundle: a chunk is fetched the
   first time a visitor is about to need it, and the dialog stays mounted afterwards so
   it keeps its open/close animation. */
const load = {
  contact: () => import('@/components/ContactDialog'),
  resume: () => import('@/components/home/ResumeDialog'),
  boss: () => import('@/components/home/BossDialog'),
};

const DIALOGS = {
  contact: dynamic(load.contact),
  resume: dynamic(load.resume),
  boss: dynamic(load.boss),
};

const EVENTS = { contact: 'opened_contact_form', resume: 'clicked_resume', boss: 'opened_boss' };

const DialogContext = createContext(null);

export function useDialogs() {
  const value = useContext(DialogContext);
  if (!value) throw new Error('useDialogs must be used inside <DialogHost>');
  return value;
}

export default function DialogHost({ children }) {
  const [open, setOpen] = useState(null);
  // Which dialogs have been opened at least once, and so stay mounted.
  const [mounted, setMounted] = useState([]);
  const prefetched = useRef(false);

  const show = useCallback((name) => {
    setMounted((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setOpen(name);
    posthog.capture(EVENTS[name]);
  }, []);

  const close = useCallback(() => setOpen(null), []);

  /* Warm the dialog chunks the moment a visitor shows any sign of life, so the first
     click opens instantly. Nothing here runs during a cold, untouched page load. */
  const prefetch = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    Object.values(load).forEach((importer) => importer());
  }, []);

  useEffect(() => {
    if (!window.origin.includes('localhost')) initPostHog();

    const types = ['pointerdown', 'keydown', 'touchstart', 'pointermove'];
    const options = { once: true, passive: true, capture: true };
    types.forEach((type) => window.addEventListener(type, prefetch, options));
    return () => types.forEach((type) => window.removeEventListener(type, prefetch, options));
  }, [prefetch]);

  const value = useMemo(() => ({ show, prefetch }), [show, prefetch]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      {mounted.map((name) => {
        const Dialog = DIALOGS[name];
        return <Dialog key={name} open={open === name} onClose={close} />;
      })}
    </DialogContext.Provider>
  );
}

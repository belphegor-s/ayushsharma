'use client';
import { useEffect } from 'react';
import { play } from '@/lib/sound';

/* One delegated listener gives every button and link on the site its click sound, so the
   markup stays server-rendered and nothing needs wiring up per element.
     data-sound="name"  plays that sound on click instead of the default tap
     data-sound="none"  stays silent (the element makes its own sound elsewhere) */
const CLICKABLE = 'a[href], button, [role="button"], [data-sound]';

export default function SoundLayer() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target instanceof Element && e.target.closest(CLICKABLE);
      if (!el || el.matches(':disabled, [aria-disabled="true"]')) return;
      const name = el.dataset.sound || 'tap';
      if (name !== 'none') play(name);
    };

    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}

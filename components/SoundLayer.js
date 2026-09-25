'use client';
import { useEffect } from 'react';
import { play } from '@/lib/sound';

/* One pair of delegated listeners gives every button and link on the site its sound,
   so the markup stays server-rendered and nothing needs wiring up per element.
     data-sound="name"        plays that sound on click instead of the default tap
     data-sound="none"        stays silent (the element makes its own sound elsewhere)
     data-sound-hover="name"  also plays a sound when a mouse arrives on it */
const CLICKABLE = 'a[href], button, [role="button"], [data-sound]';

export default function SoundLayer() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target instanceof Element && e.target.closest(CLICKABLE);
      if (!el || el.matches(':disabled, [aria-disabled="true"]')) return;
      const name = el.dataset.sound || 'tap';
      if (name !== 'none') play(name);
    };

    const onOver = (e) => {
      // Touch "hover" is just the start of a tap; it would double up with the click.
      if (e.pointerType !== 'mouse') return;
      const el = e.target instanceof Element && e.target.closest('[data-sound-hover]');
      // pointerover bubbles from every child; only react to actually entering the element.
      if (!el || (e.relatedTarget instanceof Node && el.contains(e.relatedTarget))) return;
      play(el.dataset.soundHover);
    };

    document.addEventListener('click', onClick, { capture: true, passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    return () => {
      document.removeEventListener('click', onClick, { capture: true });
      document.removeEventListener('pointerover', onOver);
    };
  }, []);

  return null;
}

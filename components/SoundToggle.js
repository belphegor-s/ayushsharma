'use client';
import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isMuted, onMutedChange, play, setMuted } from '@/lib/sound';

/* Mute switch for the interface sounds, styled to sit beside the theme toggle. */
export default function SoundToggle({ className = '' }) {
  const [muted, setState] = useState(null);

  useEffect(() => {
    setState(isMuted());
    return onMutedChange(setState);
  }, []);

  const toggle = () => {
    const next = !muted;
    // Sound off clicks before it goes quiet; sound on clicks once it is back.
    if (next) play('switchOff');
    setMuted(next);
    if (!next) play('switchOn');
  };

  const label = muted ? 'Turn sound on' : 'Turn sound off';

  return (
    <div className={`inline-flex items-center rounded-full border border-line p-[3px] ${className}`}>
      <button
        type="button"
        data-sound="none"
        aria-pressed={muted === null ? undefined : !muted}
        aria-label="Interface sounds"
        title={label}
        onClick={toggle}
        className="grid size-6 cursor-pointer place-items-center rounded-full text-subtle transition-colors hover:text-fg aria-pressed:text-fg"
      >
        {muted ? <VolumeX size={13} strokeWidth={1.75} /> : <Volume2 size={13} strokeWidth={1.75} />}
      </button>
    </div>
  );
}

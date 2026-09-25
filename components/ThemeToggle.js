'use client';
import { useEffect, useRef, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { play } from '@/lib/sound';

const STORAGE_KEY = 'theme';
const OPTIONS = [
  { value: 'system', label: 'System', icon: Monitor },
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
];

const prefersDark = () => window.matchMedia('(prefers-color-scheme: dark)').matches;

function applyTheme(pref) {
  const dark = pref === 'dark' || (pref === 'system' && prefersDark());
  const root = document.documentElement;
  root.classList.add('theme-switching');
  root.dataset.theme = dark ? 'dark' : 'light';
  root.style.colorScheme = dark ? 'dark' : 'light';
  // Flush styles so the swap lands with transitions off, then turn them back on.
  window.getComputedStyle(root).getPropertyValue('color');
  requestAnimationFrame(() => root.classList.remove('theme-switching'));
}

function readPref() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'system';
  } catch {
    return 'system';
  }
}

export default function ThemeToggle({ className = '' }) {
  const [pref, setPref] = useState(null);
  // The knob only animates once it has been placed, so it never slides in on page load.
  const [ready, setReady] = useState(false);
  const buttonsRef = useRef([]);

  useEffect(() => {
    setPref(readPref());
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setReady(true)));
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue || 'system';
      setPref(next);
      applyTheme(next);
    };
    window.addEventListener('storage', onStorage);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  useEffect(() => {
    if (pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const choose = (value) => {
    if (value === pref) return;
    const index = (v) => Math.max(0, OPTIONS.findIndex((o) => o.value === v));
    play('themeSlide', index(pref), index(value));
    setPref(value);
    try {
      if (value === 'system') localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, value);
    } catch {}
    applyTheme(value);
  };

  const onKeyDown = (e, i) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (i + step + OPTIONS.length) % OPTIONS.length;
    choose(OPTIONS[next].value);
    buttonsRef.current[next]?.focus();
  };

  const activeIndex = Math.max(
    0,
    OPTIONS.findIndex((o) => o.value === pref)
  );

  return (
    <div role="radiogroup" aria-label="Theme" className={`relative inline-flex items-center gap-0.5 rounded-full border border-line p-[3px] ${className}`}>
      {/* One knob that slides between the options like a physical switch, with a slight
          overshoot as it lands. Each step is a button's width plus the 2px gap. */}
      <span
        aria-hidden
        className={`theme-knob absolute left-[3px] top-[3px] size-6 rounded-full bg-surface-2 shadow-[inset_0_0_0_1px_var(--line-strong),0_1px_2px_rgba(0,0,0,0.08)] ${ready ? 'transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:transition-none' : ''} ${pref === null ? 'opacity-0' : ''}`}
        style={{ transform: `translateX(calc(${activeIndex} * (100% + 2px)))` }}
      />
      {OPTIONS.map(({ value, label, icon: Icon }, i) => {
        const active = pref === value;
        return (
          <button
            key={value}
            ref={(el) => (buttonsRef.current[i] = el)}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${label} theme`}
            title={label}
            tabIndex={i === activeIndex ? 0 : -1}
            data-sound="none"
            onClick={() => choose(value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative grid size-6 cursor-pointer place-items-center rounded-full transition-colors ${active ? 'text-fg' : 'text-subtle hover:text-fg'}`}
          >
            <Icon size={13} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

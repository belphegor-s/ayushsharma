'use client';
import { useEffect, useRef, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

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
  const buttonsRef = useRef([]);

  useEffect(() => {
    setPref(readPref());
    const onStorage = (e) => {
      if (e.key !== STORAGE_KEY) return;
      const next = e.newValue || 'system';
      setPref(next);
      applyTheme(next);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (pref !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const choose = (value) => {
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
    <div role="radiogroup" aria-label="Theme" className={`inline-flex items-center gap-0.5 rounded-full border border-line p-[3px] ${className}`}>
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
            onClick={() => choose(value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`grid size-6 cursor-pointer place-items-center rounded-full transition-colors ${active ? 'bg-surface-2 text-fg shadow-[inset_0_0_0_1px_var(--line-strong)]' : 'text-subtle hover:text-fg'}`}
          >
            <Icon size={13} strokeWidth={1.75} />
          </button>
        );
      })}
    </div>
  );
}

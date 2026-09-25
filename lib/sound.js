/* Interface sounds, synthesised on the fly with the Web Audio API.
   Almost every sound is a few oscillators and a shared noise buffer shaped by envelopes,
   so the kit costs about a kilobyte. The AudioContext is created on the first sound after
   the visitor has interacted with the page (browsers refuse audio before that anyway), and it
   is suspended again once things go quiet so it is not holding the audio thread awake. */

const STORAGE_KEY = 'sound';
const MASTER_GAIN = 1.6;
const IDLE_SUSPEND = 4000;

let ctx = null;
let master = null;
let noise = null;
let idleTimer = 0;
let muted = null;
const listeners = new Set();
const lastPlayed = {};

/* ---------- preference ---------- */

export function isMuted() {
  if (muted === null) {
    try {
      muted = localStorage.getItem(STORAGE_KEY) === 'off';
    } catch {
      muted = false;
    }
  }
  return muted;
}

export function setMuted(value) {
  muted = value;
  try {
    if (value) localStorage.setItem(STORAGE_KEY, 'off');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {}
  listeners.forEach((fn) => fn(value));
}

export function onMutedChange(fn) {
  listeners.add(fn);
  const onStorage = (e) => {
    if (e.key !== STORAGE_KEY) return;
    muted = e.newValue === 'off';
    fn(muted);
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener('storage', onStorage);
  };
}

/* ---------- engine ---------- */

function context() {
  if (ctx) return ctx;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  ctx = new Ctx({ latencyHint: 'interactive' });

  // A gentle compressor keeps overlapping sounds from ever getting harsh or clipping.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -6;
  limiter.knee.value = 12;
  limiter.ratio.value = 4;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.12;
  limiter.connect(ctx.destination);

  master = ctx.createGain();
  master.gain.value = MASTER_GAIN;
  master.connect(limiter);

  noise = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return ctx;
}

function scheduleSuspend() {
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => ctx?.state === 'running' && ctx.suspend(), IDLE_SUSPEND);
}

/* An attack/exponential-decay envelope, the shape almost every sound here uses. */
function envelope(t, peak, attack, decay) {
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return g;
}

function tone(t, { freq, to, type = 'sine', gain = 0.1, attack = 0.004, decay = 0.1, glide = decay, out = master }) {
  const osc = ctx.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (to) osc.frequency.exponentialRampToValueAtTime(to, t + glide);
  const env = envelope(t, gain, attack, decay);
  osc.connect(env).connect(out);
  osc.start(t);
  osc.stop(t + attack + decay + 0.02);
}

function burst(t, { freq, q = 1, gain = 0.05, attack = 0.001, decay = 0.02, type = 'bandpass', out = master }) {
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const filter = ctx.createBiquadFilter();
  filter.type = type;
  filter.frequency.value = freq;
  filter.Q.value = q;
  const env = envelope(t, gain, attack, decay);
  src.connect(filter).connect(env).connect(out);
  src.start(t, Math.random() * 0.3);
  src.stop(t + attack + decay + 0.02);
}

/* A soft bell: a sine with a quiet, slightly detuned overtone and a long tail. */
function bell(t, freq, gain, decay = 0.45) {
  tone(t, { freq, gain, attack: 0.006, decay });
  tone(t, { freq: freq * 2.001, gain: gain * 0.22, attack: 0.004, decay: decay * 0.5 });
}

// Slight random detune so a run of identical clicks never sounds mechanical.
const vary = (n, amount = 0.04) => n * (1 + (Math.random() * 2 - 1) * amount);

/* ---------- the kit ---------- */

const SOUNDS = {
  // Soft wooden tap for buttons and links.
  tap(t) {
    tone(t, { freq: vary(1500), to: 700, gain: 0.09, decay: 0.05, glide: 0.03 });
    burst(t, { freq: 3200, q: 1.2, gain: 0.03, decay: 0.012 });
  },
  // Two-stage mechanical switch: a click down, then a brighter (on) or duller (off) click up.
  switchOn(t) {
    burst(t, { freq: 2200, q: 3, gain: 0.07, decay: 0.018 });
    tone(t, { freq: 420, to: 300, gain: 0.05, decay: 0.04 });
    burst(t + 0.05, { freq: 4200, q: 4, gain: 0.05, decay: 0.014 });
    tone(t + 0.05, { freq: 1320, gain: 0.03, decay: 0.12 });
  },
  switchOff(t) {
    burst(t, { freq: 3000, q: 3, gain: 0.06, decay: 0.016 });
    burst(t + 0.05, { freq: 1500, q: 3, gain: 0.07, decay: 0.02 });
    tone(t + 0.05, { freq: 360, to: 240, gain: 0.05, decay: 0.05 });
    tone(t + 0.05, { freq: 660, gain: 0.025, decay: 0.12 });
  },
  /* The theme knob sliding along its track: a soft swish that rises or falls with the
     direction of travel, then a light clack as it lands, pitched to the option it lands on
     (dark sits lowest, light highest). */
  themeSlide(t, from = 0, to = 1) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = 2.5;
    const [lo, hi] = [900, 900 * 2 ** Math.min(2, Math.abs(to - from))];
    filter.frequency.setValueAtTime(to > from ? lo : hi, t);
    filter.frequency.exponentialRampToValueAtTime(to > from ? hi : lo, t + 0.12);
    const env = envelope(t, 0.05, 0.04, 0.09);
    src.connect(filter).connect(env).connect(master);
    src.start(t, Math.random() * 0.3);
    src.stop(t + 0.16);

    const land = t + 0.12;
    burst(land, { freq: 3400, q: 4, gain: 0.05, decay: 0.012 });
    tone(land, { freq: [783.99, 987.77, 587.33][to] ?? 783.99, gain: 0.045, attack: 0.003, decay: 0.16 });
  },
  // A dialog blooming open: a rising fifth, softly struck.
  open(t) {
    bell(t, 659.25, 0.05, 0.35);
    bell(t + 0.055, 987.77, 0.045, 0.5);
  },
  // And settling back down.
  close(t) {
    tone(t, { freq: 880, to: 520, gain: 0.04, decay: 0.14, glide: 0.1 });
  },
  success(t) {
    [1046.5, 1318.5, 1568].forEach((f, i) => bell(t + i * 0.075, f, 0.045, 0.6));
  },
  /* Leo's photo opening: a small cascade of glassy chimes (a rising A major add-9, loosely
     timed like wind through a chime) that drifts off into a soft, darkening echo. */
  chime(t) {
    const echo = ctx.createDelay(1);
    echo.delayTime.value = 0.19;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.32;
    const damp = ctx.createBiquadFilter();
    damp.type = 'lowpass';
    damp.frequency.value = 2600;
    const wet = ctx.createGain();
    wet.gain.value = 0.3;
    const bus = ctx.createGain();
    bus.connect(master);
    bus.connect(echo).connect(damp).connect(feedback).connect(echo);
    damp.connect(wet).connect(master);

    let at = t;
    [880, 1108.73, 1318.51, 1975.53, 1760].forEach((freq, i) => {
      const f = vary(freq, 0.003);
      const level = 0.034 * (1 - i * 0.1);
      tone(at, { freq: f, gain: level, attack: 0.005, decay: 1.1, out: bus });
      // A faint inharmonic partial gives it the glassy shimmer of a struck chime rather than a beep.
      tone(at, { freq: f * 2.76, gain: level * 0.18, attack: 0.002, decay: 0.28, out: bus });
      tone(at, { freq: f * 1.002, gain: level * 0.4, attack: 0.02, decay: 0.9, out: bus });
      at += vary(0.075, 0.25);
    });
    // Leave the echo tail running, then let go of the loop.
    setTimeout(() => bus.disconnect(), 3500);
  },
  error(t) {
    tone(t, { freq: 330, type: 'triangle', gain: 0.06, decay: 0.12 });
    tone(t + 0.11, { freq: 262, type: 'triangle', gain: 0.06, decay: 0.2 });
  },
};

// Minimum gap between repeats, so a fast sweep across the page does not rattle.
const COOLDOWN = { tap: 30 };

export function play(name, ...args) {
  if (typeof window === 'undefined' || isMuted() || !SOUNDS[name]) return;
  // Without a prior gesture the browser would block the context and log a warning.
  if (!ctx && navigator.userActivation && !navigator.userActivation.hasBeenActive) return;

  const now = performance.now();
  if (now - (lastPlayed[name] || 0) < (COOLDOWN[name] || 0)) return;
  lastPlayed[name] = now;

  if (!context()) return;
  const render = () => {
    SOUNDS[name](ctx.currentTime + 0.005, ...args);
    scheduleSuspend();
  };
  if (ctx.state === 'running') render();
  else ctx.resume().then(render, () => {});
}

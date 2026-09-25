/* Interface sounds, synthesised on the fly with the Web Audio API.
   There are no audio files: every sound is a few oscillators and a shared noise buffer
   shaped by envelopes, so the whole kit costs about a kilobyte and never touches the
   network. The AudioContext is created on the first sound after the visitor has
   interacted with the page (browsers refuse audio before that anyway), and it is
   suspended again once things go quiet so it is not holding the audio thread awake. */

const STORAGE_KEY = 'sound';
const MASTER_GAIN = 0.55;
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
  limiter.threshold.value = -14;
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

/* One bark: a buzzy, falling voice pushed through two moving formants (the "wo" opening
   into "of"), with a breath of noise on the attack. Deep and round, like a lab, not a terrier. */
function bark(t, pitch, level) {
  const voice = ctx.createGain();
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(level, t + 0.018);
  env.gain.setValueAtTime(level, t + 0.05);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);

  const osc = ctx.createOscillator();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(pitch * 0.85, t);
  osc.frequency.exponentialRampToValueAtTime(pitch, t + 0.03);
  osc.frequency.exponentialRampToValueAtTime(pitch * 0.55, t + 0.2);
  osc.connect(voice);

  const breath = ctx.createBufferSource();
  breath.buffer = noise;
  const breathGain = envelope(t, 0.35, 0.005, 0.09);
  breath.connect(breathGain).connect(voice);

  const formants = [
    [320, 700, 480, 5, 1],
    [750, 1250, 950, 6, 0.55],
  ];
  formants.forEach(([from, peak, end, q, amount]) => {
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = q;
    f.frequency.setValueAtTime(from, t);
    f.frequency.exponentialRampToValueAtTime(peak, t + 0.045);
    f.frequency.exponentialRampToValueAtTime(end, t + 0.2);
    const g = ctx.createGain();
    g.gain.value = amount;
    voice.connect(f).connect(g).connect(env);
  });

  const warmth = ctx.createBiquadFilter();
  warmth.type = 'lowpass';
  warmth.frequency.value = 2200;
  env.connect(warmth).connect(master);

  osc.start(t);
  breath.start(t, Math.random() * 0.3);
  osc.stop(t + 0.25);
  breath.stop(t + 0.12);
}

/* ---------- the kit ---------- */

const SOUNDS = {
  // Soft wooden tap for buttons and links.
  tap(t) {
    tone(t, { freq: vary(1500), to: 700, gain: 0.09, decay: 0.05, glide: 0.03 });
    burst(t, { freq: 3200, q: 1.2, gain: 0.03, decay: 0.012 });
  },
  // A barely-there tick when the pointer settles on something clickable.
  hover(t) {
    tone(t, { freq: vary(2600, 0.03), gain: 0.018, attack: 0.002, decay: 0.03 });
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
  error(t) {
    tone(t, { freq: 330, type: 'triangle', gain: 0.06, decay: 0.12 });
    tone(t + 0.11, { freq: 262, type: 'triangle', gain: 0.06, decay: 0.2 });
  },
  woof(t) {
    const pitch = vary(250, 0.05);
    bark(t, pitch, 0.9);
    bark(t + 0.27, pitch * 0.93, 0.75);
  },
};

// Minimum gap between repeats, so a fast sweep across the page does not rattle.
const COOLDOWN = { hover: 60, tap: 30, woof: 1500 };

export function play(name) {
  if (typeof window === 'undefined' || isMuted() || !SOUNDS[name]) return;
  // Without a prior gesture the browser would block the context and log a warning.
  if (!ctx && navigator.userActivation && !navigator.userActivation.hasBeenActive) return;

  const now = performance.now();
  if (now - (lastPlayed[name] || 0) < (COOLDOWN[name] || 0)) return;
  lastPlayed[name] = now;

  if (!context()) return;
  const render = () => {
    SOUNDS[name](ctx.currentTime + 0.005);
    scheduleSuspend();
  };
  if (ctx.state === 'running') render();
  else ctx.resume().then(render, () => {});
}

// Color math: parsing, WCAG contrast, palette generation, and conversions
// between hex / rgb / hsl / oklch. Pure functions, no dependencies.

export type RGB = { r: number; g: number; b: number };

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
const round = (n: number) => Math.round(n);

// --- Parsing -------------------------------------------------------------------

export class ColorError extends Error {}

/** Parse hex / rgb() / hsl() / oklch() into 0-255 RGB. Throws ColorError. */
export function parseColor(input: string): RGB {
  const s = input.trim().toLowerCase();

  if (s.startsWith('#')) return hexToRgb(s);
  if (s.startsWith('rgb')) {
    const [r, g, b] = numbers(s, 3);
    return { r: clamp(round(r), 0, 255), g: clamp(round(g), 0, 255), b: clamp(round(b), 0, 255) };
  }
  if (s.startsWith('hsl')) {
    const [h, sat, l] = numbers(s, 3);
    return hslToRgb(h, sat, l);
  }
  if (s.startsWith('oklch')) {
    const parts = numbers(s, 3);
    // L may be given as 0-1 or as a percentage.
    const L = parts[0] > 1 ? parts[0] / 100 : parts[0];
    return oklchToRgb(L, parts[1], parts[2]);
  }
  throw new ColorError(`Unrecognized color: "${input}". Use hex, rgb(), hsl() or oklch().`);
}

function numbers(s: string, expected: number): number[] {
  const matches = s.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  if (matches.length < expected) {
    throw new ColorError(`Expected ${expected} components in "${s}".`);
  }
  return matches;
}

function hexToRgb(hex: string): RGB {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6 || /[^0-9a-f]/.test(h)) throw new ColorError(`Invalid hex: "${hex}".`);
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

// --- Conversions ---------------------------------------------------------------

export function rgbToHex({ r, g, b }: RGB): string {
  return '#' + [r, g, b].map((n) => clamp(round(n), 0, 255).toString(16).padStart(2, '0')).join('');
}

export function rgbToHsl({ r, g, b }: RGB): { h: number; s: number; l: number } {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rn) h = ((gn - bn) / d) % 6;
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: round(h), s: round(s * 100), l: round(l * 100) };
}

export function hslToRgb(h: number, s: number, l: number): RGB {
  h = ((h % 360) + 360) % 360;
  s = clamp(s, 0, 100) / 100;
  l = clamp(l, 0, 100) / 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: round((r + m) * 255), g: round((g + m) * 255), b: round((b + m) * 255) };
}

const srgbToLinear = (c: number) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const linearToSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function rgbToOklch({ r, g, b }: RGB): { l: number; c: number; h: number } {
  const lr = srgbToLinear(r / 255), lg = srgbToLinear(g / 255), lb = srgbToLinear(b / 255);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(a * a + bb * bb);
  let H = (Math.atan2(bb, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: +L.toFixed(4), c: +C.toFixed(4), h: +H.toFixed(2) };
}

export function oklchToRgb(L: number, C: number, H: number): RGB {
  const hr = (H * Math.PI) / 180;
  const a = C * Math.cos(hr), bb = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * bb;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * bb;
  const s_ = L - 0.0894841775 * a - 1.291485548 * bb;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return {
    r: clamp(round(linearToSrgb(lr) * 255), 0, 255),
    g: clamp(round(linearToSrgb(lg) * 255), 0, 255),
    b: clamp(round(linearToSrgb(lb) * 255), 0, 255),
  };
}

/** All representations of a color, for the /convert endpoint. */
export function describe(rgb: RGB) {
  const { h, s, l } = rgbToHsl(rgb);
  const ok = rgbToOklch(rgb);
  return {
    hex: rgbToHex(rgb),
    rgb: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
    hsl: `hsl(${h}, ${s}%, ${l}%)`,
    oklch: `oklch(${ok.l} ${ok.c} ${ok.h})`,
    values: { rgb, hsl: { h, s, l }, oklch: ok },
  };
}

// --- WCAG contrast -------------------------------------------------------------

function relativeLuminance({ r, g, b }: RGB): number {
  const [lr, lg, lb] = [r, g, b].map((c) => srgbToLinear(c / 255));
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

export function contrast(fg: RGB, bg: RGB) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  const r = +ratio.toFixed(2);
  return {
    ratio: r,
    normal: { AA: r >= 4.5, AAA: r >= 7 },
    large: { AA: r >= 3, AAA: r >= 4.5 },
  };
}

// --- Palette -------------------------------------------------------------------

/** Linear mix of two colors in sRGB space. t=0 -> a, t=1 -> b. */
export function blend(a: RGB, b: RGB, t: number): RGB {
  const k = clamp(t, 0, 1);
  return {
    r: round(a.r + (b.r - a.r) * k),
    g: round(a.g + (b.g - a.g) * k),
    b: round(a.b + (b.b - a.b) * k),
  };
}

// --- Harmony -------------------------------------------------------------------

const HARMONIES: Record<string, number[]> = {
  complementary: [0, 180],
  analogous: [-30, 0, 30],
  triadic: [0, 120, 240],
  tetradic: [0, 90, 180, 270],
  'split-complementary': [0, 150, 210],
};

export const HARMONY_TYPES = Object.keys(HARMONIES);

/** Color-wheel harmony: returns hex colors rotated around the base hue. */
export function harmony(base: RGB, type: string): string[] {
  const offsets = HARMONIES[type];
  if (!offsets) throw new ColorError(`Unknown harmony "${type}". Use one of: ${HARMONY_TYPES.join(', ')}.`);
  const { h, s, l } = rgbToHsl(base);
  return offsets.map((d) => rgbToHex(hslToRgb(h + d, s, l)));
}

/** Generate an n-step tint/shade scale around a base color (light -> dark). */
export function palette(base: RGB, n: number): string[] {
  const steps = clamp(round(n), 2, 12);
  const white: RGB = { r: 255, g: 255, b: 255 };
  const black: RGB = { r: 0, g: 0, b: 0 };
  const mix = (a: RGB, b: RGB, t: number): RGB => ({
    r: round(a.r + (b.r - a.r) * t),
    g: round(a.g + (b.g - a.g) * t),
    b: round(a.b + (b.b - a.b) * t),
  });
  const out: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1); // 0 -> 1 across the scale
    // First half mixes base toward white, second half toward black.
    const color = t < 0.5 ? mix(white, base, t * 2) : mix(base, black, (t - 0.5) * 2);
    out.push(rgbToHex(color));
  }
  return out;
}

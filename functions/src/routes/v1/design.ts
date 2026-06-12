import { Hono } from 'hono';
import type { Env } from '../../env';
import { ok, fail } from '../../lib/respond';
import { parseColor, contrast, palette, describe, blend, harmony, rgbToHex, ColorError } from '../../lib/color';

export const design = new Hono<Env>();

// GET /v1/contrast?fg=<color>&bg=<color>
design.get('/contrast', (c) => {
  const fg = c.req.query('fg');
  const bg = c.req.query('bg');
  if (!fg || !bg) return fail(c, 'bad_request', 'Provide both "fg" and "bg" colors.');
  try {
    const result = contrast(parseColor(fg), parseColor(bg));
    return ok(c, { fg, bg, ...result });
  } catch (e) {
    if (e instanceof ColorError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

// GET /v1/palette?base=<color>&n=<2..12>
design.get('/palette', (c) => {
  const base = c.req.query('base');
  const n = Number(c.req.query('n') ?? '9');
  if (!base) return fail(c, 'bad_request', 'Provide a "base" color.');
  try {
    const colors = palette(parseColor(base), Number.isFinite(n) ? n : 9);
    return ok(c, { base, count: colors.length, colors });
  } catch (e) {
    if (e instanceof ColorError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

// GET /v1/convert?c=<color>
design.get('/convert', (c) => {
  const input = c.req.query('c');
  if (!input) return fail(c, 'bad_request', 'Provide a color via "c".');
  try {
    return ok(c, describe(parseColor(input)));
  } catch (e) {
    if (e instanceof ColorError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

// GET /v1/harmony?base=<color>&type=<scheme>
design.get('/harmony', (c) => {
  const base = c.req.query('base');
  const type = (c.req.query('type') ?? 'complementary').toLowerCase();
  if (!base) return fail(c, 'bad_request', 'Provide a "base" color.');
  try {
    const colors = harmony(parseColor(base), type);
    return ok(c, { base, type, colors });
  } catch (e) {
    if (e instanceof ColorError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

// GET /v1/blend?a=<color>&b=<color>&t=<0..1>
design.get('/blend', (c) => {
  const a = c.req.query('a');
  const b = c.req.query('b');
  const t = Number(c.req.query('t') ?? '0.5');
  if (!a || !b) return fail(c, 'bad_request', 'Provide both "a" and "b" colors.');
  try {
    const mixed = blend(parseColor(a), parseColor(b), Number.isFinite(t) ? t : 0.5);
    return ok(c, { a, b, t: Number.isFinite(t) ? t : 0.5, result: rgbToHex(mixed) });
  } catch (e) {
    if (e instanceof ColorError) return fail(c, 'bad_request', e.message);
    throw e;
  }
});

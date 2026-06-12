// Developer utilities: JWT decoding, cryptographic hashing, and cron parsing
// with next-run computation. Pure / Web-standard APIs only (atob, TextDecoder,
// crypto.subtle, crypto.randomUUID) so everything runs on Workers.

export class DevError extends Error {}

// --- Base64URL -----------------------------------------------------------------

/** Decode a base64url segment into a UTF-8 string. */
function b64urlToString(seg: string): string {
  let s = seg.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  let bin: string;
  try {
    bin = atob(s);
  } catch {
    throw new DevError('Segment is not valid base64url.');
  }
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// --- JWT -----------------------------------------------------------------------

const iso = (sec: unknown) => (typeof sec === 'number' && Number.isFinite(sec) ? new Date(sec * 1000).toISOString() : null);

/**
 * Decode (NOT verify) a JWT. The signature is returned untouched and never
 * checked - this is a debugging aid, not an auth primitive.
 */
export function decodeJwt(token: string) {
  const parts = token.trim().split('.');
  if (parts.length !== 3) {
    throw new DevError('A JWT must have exactly three dot-separated segments.');
  }
  let header: any, payload: any;
  try {
    header = JSON.parse(b64urlToString(parts[0]));
  } catch (e) {
    throw e instanceof DevError ? e : new DevError('Header is not valid JSON.');
  }
  try {
    payload = JSON.parse(b64urlToString(parts[1]));
  } catch (e) {
    throw e instanceof DevError ? e : new DevError('Payload is not valid JSON.');
  }

  const now = Math.floor(Date.now() / 1000);
  const exp = typeof payload?.exp === 'number' ? payload.exp : null;
  const nbf = typeof payload?.nbf === 'number' ? payload.nbf : null;

  return {
    header,
    payload,
    signature: parts[2],
    verified: false,
    algorithm: header?.alg ?? null,
    type: header?.typ ?? null,
    issuedAt: iso(payload?.iat),
    notBefore: iso(nbf),
    expiresAt: iso(exp),
    isExpired: exp === null ? null : now >= exp,
    notYetValid: nbf === null ? null : now < nbf,
    expiresIn: exp === null ? null : exp - now,
  };
}

// --- Hashing -------------------------------------------------------------------

const ALGOS: Record<string, string> = {
  'sha-1': 'SHA-1',
  sha1: 'SHA-1',
  'sha-256': 'SHA-256',
  sha256: 'SHA-256',
  'sha-384': 'SHA-384',
  sha384: 'SHA-384',
  'sha-512': 'SHA-512',
  sha512: 'SHA-512',
};

export const HASH_ALGOS = ['sha1', 'sha256', 'sha384', 'sha512'];

/** Hash text with a SHA family algorithm, returning hex + base64 digests. */
export async function hashText(text: string, algo: string) {
  const name = ALGOS[algo.toLowerCase()];
  if (!name) throw new DevError(`Unsupported algorithm "${algo}". Use one of: ${HASH_ALGOS.join(', ')}.`);
  const buf = await crypto.subtle.digest(name, new TextEncoder().encode(text));
  const bytes = new Uint8Array(buf);
  const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
  const base64 = btoa(String.fromCharCode(...bytes));
  return { algorithm: name, hex, base64, bits: bytes.length * 8 };
}

// --- Cron ----------------------------------------------------------------------

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DOW = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

const ALIASES: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

type Field = { values: Set<number>; raw: string };

function parseField(raw: string, min: number, max: number, names?: string[]): Field {
  const values = new Set<number>();
  const nameToNum = (tok: string): number => {
    const n = names?.indexOf(tok.toLowerCase());
    if (n !== undefined && n >= 0) return n + (names === MONTHS ? 1 : 0);
    const num = Number(tok);
    if (!Number.isInteger(num)) throw new DevError(`Invalid cron token "${tok}".`);
    return num;
  };

  for (const part of raw.split(',')) {
    const [rangePart, stepPart] = part.split('/');
    let step = 1;
    if (stepPart !== undefined) {
      step = Number(stepPart);
      if (!Number.isInteger(step) || step < 1) throw new DevError(`Invalid step "/${stepPart}".`);
    }
    let lo: number, hi: number;
    if (rangePart === '*' || rangePart === '') {
      lo = min;
      hi = max;
    } else if (rangePart.includes('-')) {
      const [a, b] = rangePart.split('-');
      lo = nameToNum(a);
      hi = nameToNum(b);
    } else {
      lo = hi = nameToNum(rangePart);
    }
    for (let v = lo; v <= hi; v += step) {
      let nv = v;
      if (names === DOW && nv === 7) nv = 0; // both 0 and 7 mean Sunday
      if (nv < min || nv > max) throw new DevError(`Value ${nv} out of range ${min}-${max}.`);
      values.add(nv);
    }
  }
  return { values, raw };
}

/** Parse a standard 5-field cron expression (or @alias). */
export function parseCron(expr: string) {
  const normalized = ALIASES[expr.trim().toLowerCase()] ?? expr.trim();
  const f = normalized.split(/\s+/);
  if (f.length !== 5) {
    throw new DevError('Expected 5 cron fields: minute hour day-of-month month day-of-week.');
  }
  return {
    minute: parseField(f[0], 0, 59),
    hour: parseField(f[1], 0, 23),
    dom: parseField(f[2], 1, 31),
    month: parseField(f[3], 1, 12, MONTHS),
    dow: parseField(f[4], 0, 6, DOW),
    domRestricted: f[2] !== '*',
    dowRestricted: f[4] !== '*',
  };
}

type Cron = ReturnType<typeof parseCron>;

function matches(c: Cron, d: Date): boolean {
  if (!c.minute.values.has(d.getUTCMinutes())) return false;
  if (!c.hour.values.has(d.getUTCHours())) return false;
  if (!c.month.values.has(d.getUTCMonth() + 1)) return false;
  const domOk = c.dom.values.has(d.getUTCDate());
  const dowOk = c.dow.values.has(d.getUTCDay());
  // Cron quirk: when both DOM and DOW are restricted, a match in EITHER counts.
  if (c.domRestricted && c.dowRestricted) return domOk || dowOk;
  return domOk && dowOk;
}

/** Compute the next `n` UTC run times after `from`. */
export function nextRuns(c: Cron, n: number, from = new Date()): string[] {
  const out: string[] = [];
  const d = new Date(from);
  d.setUTCSeconds(0, 0);
  d.setUTCMinutes(d.getUTCMinutes() + 1);
  // Cap the search at ~4 years of minutes so impossible expressions terminate.
  for (let i = 0; i < 60 * 24 * 366 * 4 && out.length < n; i++) {
    if (matches(c, d)) out.push(d.toISOString());
    d.setUTCMinutes(d.getUTCMinutes() + 1);
  }
  return out;
}

const listField = (f: Field, full: number): string => (f.values.size === full ? 'every' : [...f.values].sort((a, b) => a - b).join(', '));

/** Best-effort human description of a cron expression. */
export function describeCron(c: Cron): string {
  const min = c.minute.values.size === 60 ? 'every minute' : `minute ${listField(c.minute, 60)}`;
  const hour = c.hour.values.size === 24 ? 'every hour' : `hour ${listField(c.hour, 24)}`;
  const parts = [`At ${min} of ${hour}`];
  if (c.domRestricted) parts.push(`on day-of-month ${listField(c.dom, 31)}`);
  if (c.month.values.size !== 12) {
    parts.push(
      `in month ${[...c.month.values]
        .sort((a, b) => a - b)
        .map((m) => MONTHS[m - 1])
        .join(', ')}`,
    );
  }
  if (c.dowRestricted) {
    parts.push(
      `on ${[...c.dow.values]
        .sort((a, b) => a - b)
        .map((d) => DOW[d])
        .join(', ')}`,
    );
  }
  return parts.join(', ') + ' (UTC).';
}

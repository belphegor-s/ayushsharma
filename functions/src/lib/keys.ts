// API key generation + hashing. Keys are stored only as SHA-256 hex; the
// plaintext is shown to the user exactly once at creation.

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const KEY_PREFIX = 'ak_live_';

/** base62-encode random bytes. */
function base62(bytes: Uint8Array): string {
  let out = '';
  for (const b of bytes) out += ALPHABET[b % ALPHABET.length];
  return out;
}

/** Generate a fresh plaintext key, e.g. ak_live_<32 base62 chars>. */
export function generateKey(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return KEY_PREFIX + base62(bytes);
}

/** SHA-256 hex of the full key. */
export async function hashKey(key: string): Promise<string> {
  const data = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** Short, safe-to-display prefix for listing keys (e.g. ak_live_Ab12…). */
export function keyPrefix(key: string): string {
  return key.slice(0, KEY_PREFIX.length + 4);
}

/** A random id for table rows. */
export function newId(): string {
  return crypto.randomUUID();
}

export { KEY_PREFIX };

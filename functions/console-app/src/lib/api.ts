const BASE = '/console/api';

export async function fetchJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, init);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: { message: 'Request failed' } }));
    throw new Error(body.error?.message ?? `HTTP ${res.status}`);
  }
  return res.json();
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface ApiKeyView {
  id: string;
  prefix: string;
  monthly_quota: number;
  used: number;
  created_at: number;
}

export async function getSession(): Promise<SessionUser | null> {
  return fetchJSON<SessionUser | null>('/session');
}

export async function getCsrfToken(): Promise<string> {
  const res = await fetch('/api/auth/csrf');
  if (!res.ok) return '';
  const data = await res.json();
  return data.csrfToken ?? '';
}

export async function listKeys(): Promise<ApiKeyView[]> {
  return fetchJSON<ApiKeyView[]>('/keys');
}

export async function createKey(): Promise<{ plaintext: string }> {
  return fetchJSON<{ plaintext: string }>('/keys', { method: 'POST' });
}

export async function revokeKey(id: string): Promise<void> {
  await fetchJSON('/keys/' + id + '/revoke', { method: 'POST' });
}

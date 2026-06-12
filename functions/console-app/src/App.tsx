import { useSession, useKeys, useCreateKey, useRevokeKey } from './lib/useApi';
import { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

/** Animate a modal out before unmounting, and close on Escape (unless blocked). */
function useModalClose(onClose: () => void, blocked = false) {
  const [closing, setClosing] = useState(false);
  const requestClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200); // matches .closing animation duration
  }, [onClose]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !blocked) requestClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [requestClose, blocked]);
  return { closing, requestClose };
}

export function App() {
  const { session, csrf, isLoading } = useSession();
  if (isLoading) return <LoadingScreen />;
  if (!session) return <SignIn csrf={csrf} />;
  return <Dashboard session={session} csrf={csrf} />;
}

/** Full-page skeleton shown while the session resolves. */
function LoadingScreen() {
  return (
    <Frame>
      <div className="skeleton h-3 w-44 mb-5" />
      <div className="skeleton h-11 w-60 mb-4" />
      <div className="skeleton h-4 w-full max-w-prose mb-2.5" />
      <div className="skeleton h-4 w-4/5 max-w-prose mb-7" />
      <div className="skeleton h-10 w-52 rounded-md mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="skeleton h-24 rounded" />
        <div className="skeleton h-24 rounded" />
      </div>
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[880px] mx-auto px-4">
      <div className="relative flex flex-col border-x border-white/10 bg-[#0c0d10]/60 backdrop-blur min-h-screen">
        <span className="plus" /> <span className="plus top-left" />
        <span className="plus top-right" />
        <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 sm:px-5 py-3">
          <span className="font-mono text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.2em] text-white/45 truncate min-w-0">
            <span className="text-[#3b82f6] font-bold mr-1.5">/</span>app.ayushsharma.me
          </span>
          <nav className="font-mono text-[0.62rem] sm:text-[0.7rem] uppercase tracking-[0.18em] text-white/25 shrink-0">
            <a href="/" className="ml-4 text-[#93b4ff]">
              console
            </a>
            <a href="/docs" className="ml-4 hover:text-white/45">
              docs
            </a>
          </nav>
        </header>
        <main className="flex-1 px-4 sm:px-5 py-7">{children}</main>
        <footer className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 px-5 py-4 border-t border-white/10 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/25">
          <a href="/privacy" className="hover:text-white/45">
            privacy
          </a>
          <span aria-hidden="true">·</span>
          <a href="/terms" className="hover:text-white/45">
            terms
          </a>
          <span aria-hidden="true">·</span>
          <a href="https://ayushsharma.me" className="hover:text-white/45">
            ayushsharma.me
          </a>
        </footer>
      </div>
    </div>
  );
}

function SignIn({ csrf }: { csrf: string }) {
  return (
    <Frame>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
        <span className="text-[#3b82f6] font-bold mr-1.5">/</span>developer console
      </span>
      <h1 className="font-cursive font-bold text-[2rem] sm:text-[2.6rem] mb-1.5 mt-0 text-shadow-blue">Developer API</h1>
      <p className="text-white/45 mb-3 max-w-prose">
        <span className="text-white/85">app.ayushsharma.me</span> is a free developer API and console by Ayush Sharma. It provides HTTP endpoints for design utilities (contrast, palettes, color
        conversion) and text &amp; developer utilities (readability, slugs, JWT decode, hashing, UUIDs, cron).
      </p>
      <p className="text-white/45 mb-4 max-w-prose">Sign in with Google to create a personal API key and track your monthly usage.</p>

      {csrf ? (
        <form method="post" action="/api/auth/signin/google" className="mb-4">
          <input type="hidden" name="csrfToken" value={csrf} />
          <input type="hidden" name="callbackUrl" value="/console" />
          <button type="submit" className="btn bg-white text-[#1f1f1f] border-white font-semibold">
            <GoogleIcon /> Sign in with Google
          </button>
        </form>
      ) : (
        <a href="/api/auth/signin/google" className="btn bg-white text-[#1f1f1f] border-white font-semibold mb-4 inline-flex">
          <GoogleIcon /> Sign in with Google
        </a>
      )}

      <div className="flex flex-wrap gap-2 mb-6">
        <Chip>openid</Chip>
        <Chip>email</Chip>
        <Chip>profile</Chip>
        <Chip>no password access</Chip>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="card">
          <span className="plus" /> <span className="plus top-left" />
          <h3 className="mt-0 text-base font-semibold">Design Toolkit</h3>
          <p className="text-white/45 m-0 text-sm">WCAG contrast, color palettes, and hex/rgb/hsl/oklch conversion.</p>
        </div>
        <div className="card">
          <span className="plus" /> <span className="plus top-left" />
          <h3 className="mt-0 text-base font-semibold">Text Intelligence</h3>
          <p className="text-white/45 m-0 text-sm">Readability stats, slugs, smart excerpts, and keyword extraction.</p>
        </div>
      </div>

      <p className="text-white/45 text-xs mt-4">
        New here? Read the{' '}
        <a href="/docs" className="text-[#93b4ff] hover:text-white">
          API docs
        </a>{' '}
        first.
      </p>
    </Frame>
  );
}

function Dashboard({ session, csrf }: { session: { name: string; email: string; image?: string }; csrf: string }) {
  const { data: keys, isLoading: keysLoading, isError: keysError, refetch } = useKeys(session.email);
  const createKey = useCreateKey();
  const revokeKey = useRevokeKey();
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [createdPlaintext, setCreatedPlaintext] = useState<string | null>(null);
  const { toasts, push } = useToasts();

  return (
    <Frame>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
        <span className="text-[#3b82f6] font-bold mr-1.5">/</span>developer console
      </span>
      <div className="flex items-center gap-3 mt-3.5">
        {session.image && <img src={session.image} alt="" className="w-[42px] h-[42px] rounded-full border border-white/10 shrink-0" referrerPolicy="no-referrer" />}
        <div className="min-w-0">
          <div className="font-semibold truncate">{session.name || 'Signed in'}</div>
          <div className="text-white/45 text-sm truncate">{session.email}</div>
        </div>
        {csrf ? (
          <form method="post" action="/api/auth/signout" className="ml-auto inline m-0 shrink-0">
            <input type="hidden" name="csrfToken" value={csrf} />
            <input type="hidden" name="callbackUrl" value="/" />
            <button type="submit" className="btn">
              Sign out
            </button>
          </form>
        ) : (
          <a href="/api/auth/signout" className="btn ml-auto inline-flex shrink-0">
            Sign out
          </a>
        )}
      </div>

      <div className="border-t border-white/10 mt-7" />

      <h2 className="text-[1.05rem] mt-7 mb-2.5">API keys</h2>
      {keysLoading ? (
        <KeysSkeleton />
      ) : keysError ? (
        <div className="card flex items-center justify-between gap-4">
          <span className="plus" /> <span className="plus top-left" />
          <p className="text-white/60 text-sm m-0">Couldn&apos;t load your keys.</p>
          <button className="btn flex-shrink-0" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : !keys || keys.length === 0 ? (
        <EmptyKeys />
      ) : (
        <div className="-mx-1 overflow-x-auto">
        <table className="w-full min-w-[460px] text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b border-white/[0.06] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/25 font-medium">Key</th>
              <th className="text-left p-2 border-b border-white/[0.06] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/25 font-medium">Usage (this month)</th>
              <th className="text-left p-2 border-b border-white/[0.06] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/25 font-medium">Created</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td className="p-2 border-b border-white/[0.06] font-mono text-sm">{k.prefix}…</td>
                <td className="p-2 border-b border-white/[0.06]">
                  <div className="text-xs">
                    {k.used} / {k.monthly_quota}
                  </div>
                  <div className="meter mt-1.5">
                    <span style={{ width: Math.min(100, (k.used / k.monthly_quota) * 100) + '%' }} />
                  </div>
                </td>
                <td className="p-2 border-b border-white/[0.06] text-white/45 text-xs">{new Date(k.created_at).toISOString().slice(0, 10)}</td>
                <td className="p-2 border-b border-white/[0.06]">
                  <button className="btn danger" onClick={() => setRevokeId(k.id)} disabled={revokeKey.isPending && revokeId === k.id}>
                    {revokeKey.isPending && revokeId === k.id ? (
                      <>
                        <span className="spinner" /> Revoking…
                      </>
                    ) : (
                      'Revoke'
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
      <button
        className="btn primary mt-4"
        onClick={() => {
          createKey.mutate(undefined, {
            onSuccess: (data) => {
              setCreatedPlaintext(data.plaintext);
              push('API key created', 'success');
            },
            onError: (e) => push((e as Error).message, 'error'),
          });
        }}
        disabled={createKey.isPending}
      >
        {createKey.isPending ? (
          <>
            <span className="spinner" /> Creating…
          </>
        ) : (
          '+ Create API key'
        )}
      </button>

      <div className="border-t border-white/10 mt-7" />

      <h2 className="text-[1.05rem] mt-7 mb-2.5">Quick start</h2>
      <p className="text-white/45 text-sm">Base URL</p>
      <span className="codeblock max-w-full overflow-x-auto">
        <span className="dot" />
        https://app.ayushsharma.me
        <CopyButton text="https://app.ayushsharma.me" label="Copy base URL" inblock />
      </span>
      <p className="text-white/45 text-sm mt-4">Send your key as a Bearer token:</p>
      <CurlBlock />
      <p className="text-white/45 text-xs mt-3">
        Full reference in the{' '}
        <a href="/docs" className="text-[#93b4ff] hover:text-white">
          docs
        </a>
        .
      </p>

      {revokeId && (
        <RevokeModal
          pending={revokeKey.isPending}
          error={revokeKey.error ? (revokeKey.error as Error).message : undefined}
          onClose={() => {
            setRevokeId(null);
            revokeKey.reset();
          }}
          onConfirm={() => {
            revokeKey.mutate(revokeId, {
              onSuccess: () => {
                setRevokeId(null);
                revokeKey.reset();
                push('API key revoked', 'success');
              },
              onError: (e) => push((e as Error).message, 'error'),
            });
          }}
        />
      )}

      {createdPlaintext && <KeyModal plaintext={createdPlaintext} onClose={() => setCreatedPlaintext(null)} />}

      <Toasts items={toasts} />
    </Frame>
  );
}

type Toast = { id: number; msg: string; type: 'success' | 'error' };

/** Transient toast notifications, auto-dismissed. */
function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3400);
  }, []);
  return { toasts, push };
}

function Toasts({ items }: { items: Toast[] }) {
  if (items.length === 0) return null;
  return (
    <div className="toast-wrap">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.type}`} role="status">
          <span className="ico" />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

/** Skeleton rows while the key list loads. */
function KeysSkeleton() {
  return (
    <div className="mt-1">
      {[0, 1, 2].map((i) => (
        <div key={i} className="flex items-center gap-4 py-2.5 border-b border-white/[0.06]">
          <div className="skeleton h-3.5 w-28" />
          <div className="skeleton h-3.5 w-24" />
          <div className="skeleton h-3.5 w-16 ml-auto" />
          <div className="skeleton h-7 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
}

/** Empty-state card with a clear next step. */
function EmptyKeys() {
  return (
    <div className="card text-center py-7">
      <span className="plus" /> <span className="plus top-left" />
      <span className="plus top-right" />
      <span className="plus bottom-left" />
      <span className="plus bottom-right" />
      <p className="text-white/60 text-sm m-0 mb-1">No API keys yet.</p>
      <p className="text-white/35 text-xs m-0">Create your first key below to start calling the API.</p>
    </div>
  );
}

function RevokeModal({ onClose, onConfirm, pending, error }: { onClose: () => void; onConfirm: () => void; pending?: boolean; error?: string }) {
  const { closing, requestClose } = useModalClose(onClose, pending);
  // Don't let the user dismiss mid-request.
  const safeClose = () => {
    if (!pending) requestClose();
  };
  return (
    <div className={`modal-overlay ${closing ? 'closing' : ''} fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4`} onClick={safeClose}>
      <div
        className={`modal-panel ${closing ? 'closing' : ''} card max-w-[420px] w-full`}
        style={{ backgroundColor: '#0e0f13' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="plus top-left" />
        <span className="plus top-right" />
        <span className="plus bottom-left" />
        <span className="plus bottom-right" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
          <span className="text-[#3b82f6] font-bold mr-1.5">/</span>confirm revoke
        </span>
        <p className="mt-4 mb-2">Permanently revoke this key?</p>
        <p className="text-white/45 text-sm mb-4">All requests using this key will be rejected immediately. This cannot be undone.</p>
        {error && <div className="banner mb-4 border-[rgba(239,68,68,0.4)] bg-[rgba(239,68,68,0.08)] text-[#ff9a9a]">{error}</div>}
        <div className="flex items-center gap-2.5">
          <button className="btn danger flex items-center" onClick={onConfirm} disabled={pending}>
            {pending ? (
              <>
                <span className="spinner" /> Revoking…
              </>
            ) : (
              'Yes, revoke'
            )}
          </button>
          <button className="btn" onClick={requestClose} disabled={pending}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function KeyModal({ plaintext, onClose }: { plaintext: string; onClose: () => void }) {
  const { closing, requestClose } = useModalClose(onClose);
  return (
    <div className={`modal-overlay ${closing ? 'closing' : ''} fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4`} onClick={requestClose}>
      <div
        className={`modal-panel ${closing ? 'closing' : ''} card max-w-[460px] w-full`}
        style={{ backgroundColor: '#0e0f13' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="plus top-left" />
        <span className="plus top-right" />
        <span className="plus bottom-left" />
        <span className="plus bottom-right" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
          <span className="text-[#3b82f6] font-bold mr-1.5">/</span>new api key
        </span>
        <div className="banner warn mt-4">This is the only time the full key is shown. Store it somewhere safe.</div>
        <div className="keywrap mt-3">
          <CopyButton text={plaintext} label="Copy key" />
          <div className="key whitespace-normal pr-12">{plaintext}</div>
        </div>
        <div className="flex items-center gap-2.5 mt-4">
          <button className="btn" onClick={requestClose}>
            Back to console
          </button>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return <span className="font-mono text-[0.68rem] tracking-[0.06em] border border-white/10 rounded-full px-2.5 py-1 text-white/45">{children}</span>;
}

/** Reusable copy-to-clipboard button: copy icon swaps to a green check. */
function CopyButton({ text, label = 'Copy', inblock = false }: { text: string; label?: string; inblock?: boolean }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className={`copy-btn ${inblock ? 'inblock' : ''} ${copied ? 'copied' : ''}`}
      aria-label={label}
      title={label}
      onClick={() => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
}

/** Syntax-highlighted, copyable curl example for the Quick start section. */
function CurlBlock() {
  const code = `curl -H "Authorization: Bearer ak_live_..." \\
  "https://app.ayushsharma.me/v1/contrast?fg=%23ffffff&bg=%230c0d10"`;
  return (
    <div className="keywrap">
      <CopyButton text={code} label="Copy command" />
      <pre className="codeblock-pre">
        <span className="tok-cmd">curl</span> <span className="tok-flag">-H</span> <span className="tok-str">"Authorization: Bearer ak_live_..."</span> <span className="tok-punc">\</span>
        {'\n  '}
        <span className="tok-str">"https://app.ayushsharma.me/v1/contrast?fg=%23ffffff&amp;bg=%230c0d10"</span>
      </pre>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true" className="mr-2">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.4 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.4c-.5 2.9-2.1 5.3-4.6 6.9l7.1 5.5c4.1-3.8 6.4-9.4 6.4-16.9z" />
      <path fill="#FBBC05" d="M10.5 28.6c-.5-1.4-.7-2.9-.7-4.6s.3-3.2.7-4.6l-7.9-6.2C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.9-6.2z" />
      <path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.1-5.5c-2 1.4-4.6 2.2-8.1 2.2-6.3 0-11.6-3.9-13.5-9.4l-7.9 6.2C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

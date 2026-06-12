import { useSession, useKeys, useCreateKey, useRevokeKey } from './lib/useApi';
import { useState } from 'react';
import type { ReactNode } from 'react';

export function App() {
  const { session, csrf, isLoading } = useSession();
  if (isLoading) return <div className="flex items-center justify-center min-h-screen text-white/40">Loading…</div>;
  if (!session) return <SignIn csrf={csrf} />;
  return <Dashboard session={session} csrf={csrf} />;
}

function Frame({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[880px] mx-auto px-4">
      <div className="relative flex flex-col border-x border-white/10 bg-[#0c0d10]/60 backdrop-blur min-h-screen">
        <span className="plus" /> <span className="plus top-left" />
        <span className="plus top-right" />
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-3">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
            <span className="text-[#3b82f6] font-bold mr-1.5">/</span>app.ayushsharma.me
          </span>
          <nav className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/25">
            <a href="/docs" className="ml-4 hover:text-white/45">docs</a>
            <a href="/console" className="ml-4 text-[#93b4ff]">console</a>
          </nav>
        </header>
        <main className="flex-1 px-5 py-7">{children}</main>
        <footer className="flex justify-center gap-3.5 px-5 py-4 border-t border-white/10 font-mono text-[0.7rem] uppercase tracking-[0.2em]">
          <a href="https://ayushsharma.me" className="text-white/25 hover:text-white/45">ayushsharma.me</a>
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
      <h1 className="font-cursive font-bold text-[2.6rem] mb-1.5 mt-0 text-shadow-blue">Developer API</h1>
      <p className="text-white/45 mb-4 max-w-prose">
        A small, fast, free API by Ayush Sharma. Sign in with Google to get a personal API key with a monthly quota.
      </p>

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
        New here? Read the <a href="/docs" className="text-[#93b4ff] hover:text-white">API docs</a> first.
      </p>
    </Frame>
  );
}

function Dashboard({ session, csrf }: { session: { name: string; email: string; image?: string }; csrf: string }) {
  const { data: keys } = useKeys(session.email);
  const createKey = useCreateKey();
  const revokeKey = useRevokeKey();
  const [keyModal, setKeyModal] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [createdPlaintext, setCreatedPlaintext] = useState<string | null>(null);

  return (
    <Frame>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
        <span className="text-[#3b82f6] font-bold mr-1.5">/</span>developer console
      </span>
      <div className="flex items-center gap-3 mt-3.5">
        {session.image && (
          <img src={session.image} alt="" className="w-[42px] h-[42px] rounded-full border border-white/10" referrerPolicy="no-referrer" />
        )}
        <div>
          <div className="font-semibold">{session.name || 'Signed in'}</div>
          <div className="text-white/45 text-sm">{session.email}</div>
        </div>
        {csrf ? (
          <form method="post" action="/api/auth/signout" className="ml-auto inline m-0">
            <input type="hidden" name="csrfToken" value={csrf} />
            <input type="hidden" name="callbackUrl" value="/console" />
            <button type="submit" className="btn">Sign out</button>
          </form>
        ) : (
          <a href="/api/auth/signout" className="btn ml-auto inline-flex">Sign out</a>
        )}
      </div>

      <div className="border-t border-white/10 mt-7" />

      <h2 className="text-[1.05rem] mt-7 mb-2.5">API keys</h2>
      {(!keys || keys.length === 0) ? (
        <p className="text-white/45 text-sm">No keys yet. Create one to start calling the API.</p>
      ) : (
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 border-b border-white/[0.06] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/25 font-medium">
                Key
              </th>
              <th className="text-left p-2 border-b border-white/[0.06] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/25 font-medium">
                Usage (this month)
              </th>
              <th className="text-left p-2 border-b border-white/[0.06] font-mono text-[0.68rem] uppercase tracking-[0.14em] text-white/25 font-medium">
                Created
              </th>
              <th />
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td className="p-2 border-b border-white/[0.06] font-mono text-sm">{k.prefix}…</td>
                <td className="p-2 border-b border-white/[0.06]">
                  <div className="text-xs">{k.used} / {k.monthly_quota}</div>
                  <div className="meter mt-1.5">
                    <span style={{ width: Math.min(100, (k.used / k.monthly_quota) * 100) + '%' }} />
                  </div>
                </td>
                <td className="p-2 border-b border-white/[0.06] text-white/45 text-xs">{new Date(k.created_at).toISOString().slice(0, 10)}</td>
                <td className="p-2 border-b border-white/[0.06]">
                  <button className="btn danger" onClick={() => setRevokeId(k.id)}>Revoke</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button
        className="btn primary mt-4"
        onClick={() => {
          createKey.mutate(undefined, {
            onSuccess: (data) => setCreatedPlaintext(data.plaintext),
          });
        }}
        disabled={createKey.isPending}
      >
        + Create API key
      </button>

      <div className="border-t border-white/10 mt-7" />

      <h2 className="text-[1.05rem] mt-7 mb-2.5">Quick start</h2>
      <p className="text-white/45 text-sm">Base URL</p>
      <span className="codeblock">
        <span className="dot" />
        https://app.ayushsharma.me
      </span>
      <p className="text-white/45 text-sm mt-4">Send your key as a Bearer token:</p>
      <pre className="key">{`curl -H "Authorization: Bearer ak_live_..." \\
  "https://app.ayushsharma.me/v1/contrast?fg=%23ffffff&bg=%230c0d10"`}</pre>
      <p className="text-white/45 text-xs mt-3">
        Full reference in the <a href="/docs" className="text-[#93b4ff] hover:text-white">docs</a>.
      </p>

      {revokeId && (
        <RevokeModal
          onClose={() => setRevokeId(null)}
          onConfirm={() => {
            revokeKey.mutate(revokeId, {
              onSuccess: () => setRevokeId(null),
            });
          }}
        />
      )}

      {createdPlaintext && (
        <KeyModal plaintext={createdPlaintext} onClose={() => setCreatedPlaintext(null)} />
      )}
    </Frame>
  );
}

function RevokeModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card max-w-[420px] w-full" onClick={(e) => e.stopPropagation()}>
        <span className="plus" /> <span className="plus top-left" />
        <span className="plus top-right" />
        <span className="plus bottom-left" />
        <span className="plus bottom-right" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
          <span className="text-[#3b82f6] font-bold mr-1.5">/</span>confirm revoke
        </span>
        <p className="mt-4 mb-2">
          Permanently revoke this key?
        </p>
        <p className="text-white/45 text-sm mb-4">
          All requests using this key will be rejected immediately. This cannot be undone.
        </p>
        <div className="flex items-center gap-2.5">
          <button className="btn danger flex items-center" onClick={onConfirm}>Yes, revoke</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function KeyModal({ plaintext, onClose }: { plaintext: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="card max-w-[460px] w-full" onClick={(e) => e.stopPropagation()}>
        <span className="plus" /> <span className="plus top-left" />
        <span className="plus top-right" />
        <span className="plus bottom-left" />
        <span className="plus bottom-right" />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
          <span className="text-[#3b82f6] font-bold mr-1.5">/</span>new api key
        </span>
        <div className="banner warn mt-4">
          This is the only time the full key is shown. Store it somewhere safe.
        </div>
        <div className="key whitespace-normal mt-3">{plaintext}</div>
        <div className="flex items-center gap-2.5 mt-4">
          <button
            className="btn primary flex items-center"
            onClick={() => {
              navigator.clipboard.writeText(plaintext);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? 'Copied!' : 'Copy key'}
          </button>
          <button className="btn" onClick={onClose}>Back to console</button>
        </div>
      </div>
    </div>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="font-mono text-[0.68rem] tracking-[0.06em] border border-white/10 rounded-full px-2.5 py-1 text-white/45">
      {children}
    </span>
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

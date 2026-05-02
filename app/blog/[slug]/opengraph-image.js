import { ImageResponse } from 'next/og';
import { getPost, formatDate } from '@/lib/blog/posts';

export const alt = 'Post cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const PALETTES = {
  blue: {
    eyebrow: '#93c5fd',
    accent: '#3b82f6',
    accentBar: 'linear-gradient(180deg, #1d4ed8, #3b82f6, #60a5fa)',
    bg: 'linear-gradient(135deg, #0b0f17 0%, #111827 40%, #1e293b 100%)',
    glow: 'radial-gradient(60% 60% at 80% 0%, rgba(59,130,246,0.32), transparent 60%)',
    tag: '#60a5fa',
    byline: '#94a3b8',
  },
  red: {
    eyebrow: '#fca5a5',
    accent: '#ef4444',
    accentBar: 'linear-gradient(180deg, #7f1d1d, #ef4444, #fca5a5)',
    bg: 'linear-gradient(135deg, #0d0a08 0%, #1a0f0c 40%, #2a1410 100%)',
    glow: 'radial-gradient(60% 60% at 80% 0%, rgba(239,68,68,0.34), transparent 60%)',
    tag: '#f87171',
    byline: '#fca5a5cc',
  },
  green: {
    eyebrow: '#86efac',
    accent: '#10b981',
    accentBar: 'linear-gradient(180deg, #065f46, #10b981, #6ee7b7)',
    bg: 'linear-gradient(135deg, #07120e 0%, #0c1f17 40%, #103024 100%)',
    glow: 'radial-gradient(60% 60% at 80% 0%, rgba(16,185,129,0.32), transparent 60%)',
    tag: '#34d399',
    byline: '#86efac',
  },
  purple: {
    eyebrow: '#d8b4fe',
    accent: '#a855f7',
    accentBar: 'linear-gradient(180deg, #6b21a8, #a855f7, #d8b4fe)',
    bg: 'linear-gradient(135deg, #0c0815 0%, #160d24 40%, #2a1845 100%)',
    glow: 'radial-gradient(60% 60% at 80% 0%, rgba(168,85,247,0.32), transparent 60%)',
    tag: '#c084fc',
    byline: '#c4b5fd',
  },
  amber: {
    eyebrow: '#fcd34d',
    accent: '#f59e0b',
    accentBar: 'linear-gradient(180deg, #78350f, #f59e0b, #fcd34d)',
    bg: 'linear-gradient(135deg, #100a03 0%, #1f1407 40%, #2e1d0a 100%)',
    glow: 'radial-gradient(60% 60% at 80% 0%, rgba(245,158,11,0.32), transparent 60%)',
    tag: '#fbbf24',
    byline: '#fcd34d',
  },
};

const TAG_ACCENT = {
  security: 'red',
  vulnerability: 'red',
  cve: 'red',
  ai: 'blue',
  claude: 'blue',
  agents: 'blue',
  software: 'blue',
  tools: 'blue',
  essay: 'purple',
  github: 'red',
};

function pickAccent(post) {
  if (post?.accent && PALETTES[post.accent]) return post.accent;
  for (const tag of post?.tags || []) {
    const lower = String(tag).toLowerCase();
    if (TAG_ACCENT[lower]) return TAG_ACCENT[lower];
  }
  return 'blue';
}

export default async function OgImage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title || 'ayushsharma.me';
  const date = post?.date ? formatDate(post.date) : '';
  const tags = post?.tags?.slice(0, 3) || [];
  const palette = PALETTES[pickAccent(post)];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px',
          background: palette.bg,
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: palette.glow,
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '8px',
            height: '100%',
            background: palette.accentBar,
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: palette.eyebrow,
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '0.05em',
            zIndex: 1,
          }}
        >
          ayushsharma.me · writing
        </div>
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: title.length > 60 ? '56px' : '72px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              color: '#ffffff',
              maxWidth: '1000px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              fontSize: '22px',
              color: '#94a3b8',
            }}
          >
            <span>{date}</span>
            {tags.length > 0 && <span style={{ color: '#475569' }}>·</span>}
            <div style={{ display: 'flex', gap: '12px' }}>
              {tags.map((t) => (
                <span key={t} style={{ color: palette.tag }}>#{t}</span>
              ))}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginTop: '8px',
              fontSize: '20px',
              color: palette.byline,
            }}
          >
            <span style={{ color: palette.accent, fontWeight: 700 }}>·</span>
            <span>Ayush Sharma</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

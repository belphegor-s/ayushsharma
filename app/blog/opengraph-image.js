import { ImageResponse } from 'next/og';
import { getAllPosts } from '@/lib/blog/posts';

export const alt = 'Blog · Ayush Sharma';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const count = getAllPosts().length;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 72,
          background:
            'radial-gradient(60% 50% at 80% -10%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(135deg, #0b0f17 0%, #111827 50%, #1e293b 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 8,
            height: '100%',
            background: 'linear-gradient(180deg, #1d4ed8, #3b82f6, #60a5fa)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#93c5fd',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          ayushsharma.me
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
          }}
        >
          <div
            style={{
              fontSize: 144,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Blog
          </div>
          <div
            style={{
              fontSize: 36,
              color: '#cbd5e1',
              maxWidth: 900,
              lineHeight: 1.3,
              display: 'flex',
            }}
          >
            Where I work things out in public. Software, AI, and the occasional rant.
          </div>
          <div
            style={{
              marginTop: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 22,
              color: '#94a3b8',
            }}
          >
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>·</span>
            <span>Ayush Sharma</span>
            <span style={{ color: '#475569' }}>·</span>
            <span>{count} {count === 1 ? 'post' : 'posts'}</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

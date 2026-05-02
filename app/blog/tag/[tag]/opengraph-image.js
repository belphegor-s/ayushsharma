import { ImageResponse } from 'next/og';
import { getPostsByTag } from '@/lib/blog/posts';

export const alt = 'Tag · Blog · Ayush Sharma';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const { tag } = await params;
  const decoded = decodeURIComponent(tag);
  const count = getPostsByTag(decoded).length;
  const display = `#${decoded}`;
  const fontSize = display.length > 18 ? 120 : display.length > 12 ? 152 : 184;

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
            'radial-gradient(60% 60% at 80% 0%, rgba(59,130,246,0.18), transparent 60%), linear-gradient(135deg, #0b0f17 0%, #111827 50%, #1e293b 100%)',
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
          ayushsharma.me / blog / tag
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            <span style={{ color: '#3b82f6' }}>#</span>
            <span>{decoded}</span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              fontSize: 26,
              color: '#94a3b8',
            }}
          >
            <span>{count} {count === 1 ? 'post' : 'posts'}</span>
            <span style={{ color: '#475569' }}>·</span>
            <span>Ayush Sharma</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

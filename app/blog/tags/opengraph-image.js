import { ImageResponse } from 'next/og';
import { getAllTags } from '@/lib/blog/posts';

export const alt = 'All tags · Blog · Ayush Sharma';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  const tags = getAllTags().slice(0, 8);

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
            'radial-gradient(60% 50% at 20% -10%, rgba(99,102,241,0.18), transparent 60%), linear-gradient(135deg, #0b0f17 0%, #111827 50%, #1e293b 100%)',
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
            background: 'linear-gradient(180deg, #6366f1, #818cf8, #a5b4fc)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            color: '#a5b4fc',
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: '0.05em',
          }}
        >
          ayushsharma.me / blog / topics
        </div>

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 700,
              letterSpacing: '-0.04em',
              color: '#ffffff',
              lineHeight: 1,
              display: 'flex',
            }}
          >
            Topics
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 14,
              maxWidth: 1000,
            }}
          >
            {tags.map(({ name, count }) => (
              <div
                key={name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 999,
                  border: '1px solid rgba(99,102,241,0.35)',
                  background: 'rgba(30,41,59,0.5)',
                  fontSize: 24,
                  color: '#c7d2fe',
                }}
              >
                <span>#{name}</span>
                <span style={{ color: '#64748b', fontSize: 18 }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

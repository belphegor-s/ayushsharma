import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const alt = `${siteConfig.name} · Developer / Tinkerer / Stoic`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '72px',
          background:
            'radial-gradient(60% 60% at 80% 0%, rgba(59,130,246,0.18), transparent 60%), radial-gradient(50% 50% at 0% 100%, rgba(99,102,241,0.12), transparent 60%), linear-gradient(135deg, #0b0f17 0%, #111827 50%, #1e293b 100%)',
          color: '#f8fafc',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
            display: 'flex',
          }}
        />

        <div
          style={{
            position: 'absolute',
            top: 56,
            left: 72,
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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 28,
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: '50%',
              padding: 6,
              background:
                'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #0f172a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(59,130,246,0.35)',
            }}
          >
            <div
              style={{
                width: 188,
                height: 188,
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 96,
                fontWeight: 700,
                color: '#93c5fd',
                letterSpacing: '-0.04em',
              }}
            >
              AS
            </div>
          </div>

          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              textShadow: '0 0 30px rgba(99,102,241,0.35)',
              display: 'flex',
            }}
          >
            Ayush Sharma
          </div>

          <div
            style={{
              fontSize: 32,
              fontWeight: 500,
              color: '#93c5fd',
              letterSpacing: '0.02em',
              display: 'flex',
            }}
          >
            Developer / Tinkerer / Stoic
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 22,
              color: '#94a3b8',
              maxWidth: 800,
              textAlign: 'center',
              display: 'flex',
            }}
          >
            Essays on software, AI, and the craft of building.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 56,
            right: 72,
            fontSize: 20,
            color: '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span style={{ color: '#3b82f6', fontWeight: 700 }}>·</span> ayushsharma.me
        </div>
      </div>
    ),
    { ...size }
  );
}

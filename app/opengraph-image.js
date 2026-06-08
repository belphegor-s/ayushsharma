import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const alt = `${siteConfig.name} · Developer / Tinkerer / Stoic`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Pull a static TTF straight from the Google Fonts CSS endpoint so satori
   (next/og) can embed the same faces the site uses: Dancing Script for the
   wordmark, Geist Mono for the rails. `text` trims the font to used glyphs. */
async function loadGoogleFont(family, weight, text) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
  if (!src) throw new Error(`font load failed: ${family}`);
  return (await fetch(src[1])).arrayBuffer();
}

export default async function OgImage() {
  const NAME = 'Ayush Sharma';
  const MONO = 'ayushsharma.me//20Devlopr/Tinker,Sto·cEsayonftwAI& hgubld.';

  const [dancing, mono, monoBold] = await Promise.all([
    loadGoogleFont('Dancing Script', 700, NAME),
    loadGoogleFont('Geist Mono', 400, MONO),
    loadGoogleFont('Geist Mono', 600, MONO),
  ]).catch(() => [null, null, null]);

  const fonts = [];
  if (dancing) fonts.push({ name: 'Dancing Script', data: dancing, weight: 700, style: 'normal' });
  if (mono) fonts.push({ name: 'Geist Mono', data: mono, weight: 400, style: 'normal' });
  if (monoBold) fonts.push({ name: 'Geist Mono', data: monoBold, weight: 600, style: 'normal' });

  const mark = '#3b82f6';
  const border = 'rgba(255,255,255,0.10)';
  const muted = 'rgba(255,255,255,0.30)';

  // Crisp plus marker pinned to a frame corner, mirroring the site's <Plus />.
  const Plus = (pos) => (
    <div style={{ position: 'absolute', width: 14, height: 14, display: 'flex', ...pos }}>
      <div style={{ position: 'absolute', left: 6, top: 0, width: 2, height: 14, background: 'rgba(255,255,255,0.25)' }} />
      <div style={{ position: 'absolute', left: 0, top: 6, width: 14, height: 2, background: 'rgba(255,255,255,0.25)' }} />
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          backgroundColor: '#0c0d10',
          backgroundImage:
            'radial-gradient(60% 60% at 80% 0%, rgba(59,130,246,0.16), transparent 60%), radial-gradient(50% 50% at 0% 100%, rgba(99,102,241,0.10), transparent 60%)',
          fontFamily: 'Geist Mono',
        }}
      >
        {/* Faint grid, matching the site's textured backdrop */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />

        {/* Framed central column with side rails + plus corners (the hero frame) */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            width: 760,
            height: '100%',
            borderLeft: `1px solid ${border}`,
            borderRight: `1px solid ${border}`,
          }}
        >
          {Plus({ left: -7, top: -7 })}
          {Plus({ right: -7, top: -7 })}
          {Plus({ left: -7, bottom: -7 })}
          {Plus({ right: -7, bottom: -7 })}

          {/* Top meta bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '22px 28px',
              borderBottom: `1px solid ${border}`,
              fontSize: 17,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            <span style={{ display: 'flex' }}>ayushsharma.me</span>
            <span style={{ display: 'flex', color: muted }}>{'// 2026'}</span>
          </div>

          {/* Hero */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                width: 168,
                height: 168,
                borderRadius: '50%',
                padding: 4,
                background: `linear-gradient(135deg, ${mark} 0%, #6366f1 50%, #0f172a 100%)`,
                boxShadow: '0 0 50px rgba(59,130,246,0.30)',
              }}
            >
              <img
                src={`${siteConfig.url}/assets/ayush.png`}
                alt=""
                width={160}
                height={160}
                style={{ width: 160, height: 160, borderRadius: '50%', objectFit: 'cover' }}
              />
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 30,
                fontFamily: 'Dancing Script',
                fontWeight: 700,
                fontSize: 96,
                color: '#ffffff',
                letterSpacing: '0.01em',
                textShadow: '0 0 24px rgba(99,102,241,0.35)',
              }}
            >
              {NAME}
            </div>

            {/* Blue hairline divider, like the hero underline */}
            <div
              style={{
                display: 'flex',
                width: 340,
                height: 1,
                marginTop: 18,
                background: `linear-gradient(90deg, transparent, ${mark}, transparent)`,
              }}
            />

            <div
              style={{
                display: 'flex',
                marginTop: 22,
                fontSize: 24,
                fontWeight: 600,
                letterSpacing: '0.06em',
                color: '#93c5fd',
              }}
            >
              Developer / Tinkerer / Stoic
            </div>

            <div
              style={{
                display: 'flex',
                marginTop: 14,
                fontSize: 17,
                color: 'rgba(255,255,255,0.40)',
              }}
            >
              Essays on software, AI &amp; the craft of building.
            </div>
          </div>

          {/* Footer rail */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '20px 28px',
              borderTop: `1px solid ${border}`,
              fontSize: 15,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: muted,
            }}
          >
            <span style={{ display: 'flex' }}>© 2026</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#94a3b8' }}>
              <span style={{ display: 'flex', color: mark, fontWeight: 600 }}>·</span>
              say hi
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}

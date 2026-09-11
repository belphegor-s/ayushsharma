import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { LOGO_PATH } from '@/components/Logo';
import { siteConfig } from '@/lib/site';

export const alt = `${siteConfig.name} · ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/* Pull a static TTF straight from the Google Fonts CSS endpoint so satori
   (next/og) can embed the same faces the site uses. `text` trims the font to
   the glyphs actually drawn. Returns null on failure so the image still renders. */
async function loadGoogleFont(family, weight, text) {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/);
    if (!src) return null;
    return (await fetch(src[1])).arrayBuffer();
  } catch {
    return null;
  }
}

async function loadPhoto() {
  try {
    const file = await readFile(path.join(process.cwd(), 'public', 'assets', 'ayush.png'));
    return `data:image/png;base64,${file.toString('base64')}`;
  } catch {
    return null;
  }
}

// Frame geometry: rails and band lines, mirroring the site hero.
const W = 1200;
const H = 630;
const RAIL_L = 72;
const RAIL_R = 1128;
const LINE_T = 96;
const LINE_B = 534;
const GRID_X = 640;

/* Light palette, the site's default theme. Values mirror the :root tokens in
   app/globals.css; keep the two in sync (dark tokens live there too). */
const BG = '#ffffff';
const FG = '#0a0a0a';
const MUTED = '#5c5c5c';
const SUBTLE = '#737373';
const LINE = '#ebebeb';
const CROSS = '#a3a3a3';
const GRID = LINE;
const RED = '#ef4444';

// #rrggbb -> rgba() so fades and dashes follow the palette above.
const rgba = (hex, a) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};

const NAME = 'Ayush Sharma';
const LEAD = siteConfig.bio;
const EYEBROW = 'DEVELOPER · TINKERER · STOIC';
const DOMAIN = 'AYUSHSHARMA.ME';
const FOOT_L = 'TRANSCODER / HUDDLE';
const FOOT_R = 'PROJECTS · RESUME · CONTACT';

const hLine = (top) => <div style={{ position: 'absolute', left: 0, top, width: W, height: 1, background: LINE }} />;
const vLine = (left, top = 0, height = H) => <div style={{ position: 'absolute', left, top, width: 1, height, background: LINE }} />;

const plus = (x, y) => (
  <div style={{ position: 'absolute', left: x - 7, top: y - 7, width: 15, height: 15, display: 'flex' }}>
    <div style={{ position: 'absolute', left: 7, top: 0, width: 1, height: 15, background: CROSS }} />
    <div style={{ position: 'absolute', left: 0, top: 7, width: 15, height: 1, background: CROSS }} />
  </div>
);

const mono = { fontFamily: 'Geist Mono', fontSize: 17, letterSpacing: 2.4 };

export default async function OgImage() {
  const [regular, medium, script, monoFont, photo] = await Promise.all([
    loadGoogleFont('Geist', 400, LEAD),
    loadGoogleFont('Geist', 500, NAME),
    loadGoogleFont('Dancing Script', 700, NAME),
    loadGoogleFont('Geist Mono', 400, EYEBROW + DOMAIN + FOOT_L + FOOT_R),
    loadPhoto(),
  ]);

  const fonts = [];
  if (regular) fonts.push({ name: 'Geist', data: regular, weight: 400, style: 'normal' });
  if (medium) fonts.push({ name: 'Geist', data: medium, weight: 500, style: 'normal' });
  if (script) fonts.push({ name: 'Dancing Script', data: script, weight: 700, style: 'normal' });
  if (monoFont) fonts.push({ name: 'Geist Mono', data: monoFont, weight: 400, style: 'normal' });

  return new ImageResponse(
    (
      <div style={{ width: W, height: H, display: 'flex', position: 'relative', background: BG, color: FG, fontFamily: 'Geist' }}>
        {/* Faint grid in the empty right half, faded toward the text like the site hero */}
        <div
          style={{
            position: 'absolute',
            left: GRID_X,
            top: LINE_T + 1,
            width: RAIL_R - GRID_X,
            height: LINE_B - LINE_T - 1,
            display: 'flex',
            backgroundImage: `linear-gradient(to right, ${GRID} 1px, transparent 1px), linear-gradient(to bottom, ${GRID} 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: GRID_X,
            top: LINE_T + 1,
            width: RAIL_R - GRID_X,
            height: LINE_B - LINE_T - 1,
            display: 'flex',
            backgroundImage: `linear-gradient(to right, ${BG} 0%, ${rgba(BG, 0)} 55%), linear-gradient(to top, ${BG} 0%, ${rgba(BG, 0)} 60%)`,
          }}
        />

        {vLine(RAIL_L)}
        {vLine(RAIL_R)}
        {hLine(LINE_T)}
        {hLine(LINE_B)}
        {plus(RAIL_L, LINE_T)}
        {plus(RAIL_R, LINE_T)}
        {plus(RAIL_L, LINE_B)}
        {plus(RAIL_R, LINE_B)}

        {/* Framed round portrait, centered in the right half like the site hero */}
        {photo && (
          <div style={{ position: 'absolute', left: 812, top: 203, width: 224, height: 224, display: 'flex', padding: 7, borderRadius: 112, border: `1px solid ${LINE}`, background: BG }}>
            {/* eslint-disable-next-line @next/next/no-img-element -- satori renders raw <img>, next/image does not apply here */}
            <img src={photo} alt="" width={208} height={208} style={{ width: 208, height: 208, borderRadius: 104, objectFit: 'cover' }} />
          </div>
        )}

        {/* Top band: mark and domain */}
        <div
          style={{
            position: 'absolute',
            left: RAIL_L + 1,
            top: 0,
            width: RAIL_R - RAIL_L - 1,
            height: LINE_T,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <svg width="36" height="36" viewBox="0 0 32 32">
              <rect width="32" height="32" rx="7" fill={FG} />
              <path d={LOGO_PATH} fill={BG} />
            </svg>
            <div style={{ display: 'flex', marginLeft: 16, fontSize: 24, fontWeight: 500, letterSpacing: -0.3 }}>{NAME}</div>
          </div>
          <div style={{ display: 'flex', ...mono, color: SUBTLE }}>{DOMAIN}</div>
        </div>

        {/* Main cell */}
        <div
          style={{
            position: 'absolute',
            left: RAIL_L + 1,
            top: LINE_T + 1,
            width: RAIL_R - RAIL_L - 1,
            height: LINE_B - LINE_T - 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 56px',
          }}
        >
          <div style={{ display: 'flex', ...mono, fontSize: 18, color: SUBTLE }}>{EYEBROW}</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', marginTop: 14, fontFamily: 'Dancing Script', fontSize: 104, fontWeight: 700, lineHeight: 1.15 }}>
            {NAME}
            <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 5, background: RED, marginLeft: 6, marginBottom: 30 }} />
          </div>
          {/* Dashed hairline fading right, drawn as discrete dashes (satori has no repeating gradients). */}
          <div style={{ display: 'flex', marginTop: 12 }}>
            {Array.from({ length: 36 }, (_, i) => (
              <div key={i} style={{ display: 'flex', width: 6, height: 1, marginRight: 4, background: rgba(FG, (0.55 * (1 - i / 36)).toFixed(3)) }} />
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 26, maxWidth: 620, fontSize: 29, lineHeight: 1.4, color: MUTED }}>{LEAD}</div>
        </div>

        {/* Bottom band */}
        <div
          style={{
            position: 'absolute',
            left: RAIL_L + 1,
            top: LINE_B + 1,
            width: RAIL_R - RAIL_L - 1,
            height: H - LINE_B - 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            ...mono,
            color: SUBTLE,
          }}
        >
          <div style={{ display: 'flex' }}>{FOOT_L}</div>
          <div style={{ display: 'flex' }}>{FOOT_R}</div>
        </div>
      </div>
    ),
    { ...size, fonts }
  );
}

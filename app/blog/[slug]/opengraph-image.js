import { ImageResponse } from 'next/og';
import { getPost, formatDate } from '@/lib/blog/posts';

export const alt = 'Post cover';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OgImage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  const title = post?.title || 'ayushsharma.me';
  const date = post?.date ? formatDate(post.date) : '';
  const tags = post?.tags?.slice(0, 3) || [];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '72px',
          background:
            'linear-gradient(135deg, #0b0f17 0%, #111827 40%, #1e293b 100%)',
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
            width: '8px',
            height: '100%',
            background: 'linear-gradient(180deg, #1d4ed8, #3b82f6, #60a5fa)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#93c5fd',
            fontSize: '22px',
            fontWeight: 500,
            letterSpacing: '0.05em',
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
                <span key={t} style={{ color: '#60a5fa' }}>#{t}</span>
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
              color: '#cbd5e1',
            }}
          >
            <span style={{ color: '#3b82f6', fontWeight: 700 }}>—</span>
            <span>Ayush Sharma</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}

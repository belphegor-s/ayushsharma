import { projects } from './lib/projects.js';

// Every project runs live in an iframe on its card and in its dialog. Each of
// those sites must in turn list this one in its own frame-ancestors.
const projectOrigins = projects.map((p) => new URL(p.url).origin);

const securityHeaders = [
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // unsafe-inline needed for Next.js hydration scripts and the no-flash theme script
      "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://us-assets.i.posthog.com https://static.cloudflareinsights.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://storage.procd.cc",
      "connect-src 'self' https://us.i.posthog.com https://us-assets.i.posthog.com https://vitals.vercel-insights.com https://cloudflareinsights.com",
      ["frame-src 'self' https://storage.procd.cc", ...projectOrigins].join(' '),
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: 'storage.procd.cc', pathname: '/**' }],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

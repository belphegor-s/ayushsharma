export const siteConfig = {
  name: 'Ayush Sharma',
  shortName: 'Ayush',
  title: 'Ayush Sharma · Software Developer',
  tagline: 'Developer · Tinkerer · Stoic',
  description: 'Software developer building things with code and AI.',
  bio: 'Software developer building things with code and AI.',
  url: 'https://ayushsharma.me',
  locale: 'en_US',
  resume: 'https://storage.procd.cc/ayush_resume.pdf',
  author: {
    name: 'Ayush Sharma',
    email: 'hello@ayushsharma.me',
    twitter: '@sharma_0502',
    github: 'belphegor-s',
  },
  social: {
    github: 'https://short.procd.cc/github',
    linkedin: 'https://short.procd.cc/linkedin',
    twitter: 'https://short.procd.cc/x',
  },
  profiles: {
    github: 'https://github.com/belphegor-s',
    twitter: 'https://x.com/sharma_0502',
  },
  ogImage: '/opengraph-image',
};

export function absoluteUrl(p = '') {
  if (!p) return siteConfig.url;
  return `${siteConfig.url}${p.startsWith('/') ? p : `/${p}`}`;
}

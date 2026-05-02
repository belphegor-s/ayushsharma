export const siteConfig = {
  name: 'Ayush Sharma',
  shortName: 'ayush',
  title: 'Ayush Sharma · Developer · Tinkerer · Stoic',
  tagline: 'Developer / Tinkerer / Stoic',
  description:
    'Personal site of Ayush Sharma. Software developer, tinkerer, and writer. Essays on software, AI, and the craft of building.',
  url: 'https://ayushsharma.me',
  locale: 'en_US',
  author: {
    name: 'Ayush Sharma',
    email: 'hello@ayushsharma.me',
    twitter: '@ayushsharma',
  },
  social: {
    github: 'https://short.pixly.sh/github',
    linkedin: 'https://short.pixly.sh/linkedin',
    twitter: 'https://short.pixly.sh/x',
  },
  ogImage: '/opengraph-image',
};

export function absoluteUrl(p = '') {
  if (!p) return siteConfig.url;
  return `${siteConfig.url}${p.startsWith('/') ? p : `/${p}`}`;
}

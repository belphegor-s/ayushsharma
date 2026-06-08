export const siteConfig = {
  name: 'Ayush Sharma',
  shortName: 'ayush',
  title: 'Ayush Sharma · Developer · Tinkerer · Stoic',
  tagline: 'Developer / Tinkerer / Stoic',
  description: 'Personal site of Ayush Sharma - software developer, tinkerer, and stoic. Building things with code and AI.',
  url: 'https://ayushsharma.me',
  locale: 'en_US',
  author: {
    name: 'Ayush Sharma',
    email: 'hello@ayushsharma.me',
    twitter: '@sharma_0502',
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

import { Geist, Geist_Mono } from 'next/font/google';
import NextTopLoader from 'nextjs-toploader';
import { SpeedInsights } from '@vercel/speed-insights/next';
import './globals.css';
import { absoluteUrl, siteConfig } from '@/lib/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

/* Only the small mono labels use this face, so it stays out of the initial
   preload burst and lets the body font and the signature have the bandwidth. */
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
});

/* Resolves the theme before first paint (stored choice, else the system) so
   there is never a flash of the wrong palette. Mirrors components/ThemeToggle. */
const themeScript = `(function(){try{var p=localStorage.getItem('theme');var d=p==='dark'||(p!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light'}catch(e){}})()`;

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s · Ayush Sharma',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  keywords: ['Ayush Sharma', 'software developer', 'full stack developer', 'portfolio', 'Transcoder', 'huddle', 'open source', 'AI'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    site: siteConfig.author.twitter,
    creator: siteConfig.author.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'light dark',
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteConfig.url}/#person`,
        name: siteConfig.author.name,
        url: siteConfig.url,
        email: `mailto:${siteConfig.author.email}`,
        image: absoluteUrl('/assets/ayush.png'),
        jobTitle: 'Software Developer',
        sameAs: [siteConfig.profiles.github, siteConfig.profiles.twitter, siteConfig.social.linkedin],
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.url}/#website`,
        url: siteConfig.url,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { '@id': `${siteConfig.url}/#person` },
      },
    ],
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh bg-bg font-sans text-fg antialiased">
        <NextTopLoader color="var(--fg)" height={2} showSpinner={false} shadow={false} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}

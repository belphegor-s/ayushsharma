import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/site';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: '%s — Ayush Sharma',
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  keywords: ['Ayush Sharma', 'software developer', 'portfolio', 'blog', 'AI', 'agents', 'Claude'],
  alternates: {
    canonical: '/',
    types: { 'application/rss+xml': '/blog/rss.xml' },
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
    creator: siteConfig.author.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  icons: { icon: '/favicon.ico' },
};

export const viewport = {
  themeColor: '#171717',
  colorScheme: 'dark',
};

export default function RootLayout({ children }) {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.author.email}`,
    jobTitle: 'Software Developer',
    sameAs: [siteConfig.social.github, siteConfig.social.linkedin, siteConfig.social.twitter],
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <div className="min-h-screen bg-neutral-800 text-gray-100 font-sans relative overflow-hidden bg-container">{children}</div>
      </body>
    </html>
  );
}

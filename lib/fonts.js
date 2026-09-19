import localFont from 'next/font/local';

/* The one expressive face on the site: the name, wordmark and monogram read like a signature.
   Self-hosted as a Google Fonts subset cut to the glyphs of "Ayush Sharma" (the only string
   that ever uses it), which is ~2 kB instead of the ~25 kB full latin face. Keeping it small
   matters because that heading is the page's LCP element. */
export const signature = localFont({
  src: './fonts/dancing-script-700-subset.woff2',
  weight: '700',
  style: 'normal',
  display: 'swap',
  variable: '--font-signature',
});

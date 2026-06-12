import LegalPage, { Section } from '@/components/LegalPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Terms of Use',
  description: 'Terms for using ayushsharma.me.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

const UPDATED = 'June 12, 2026';

export default function TermsPage() {
  return (
    <LegalPage slug="terms" title="Terms of Use" updated={UPDATED}>
      <p>Welcome to {siteConfig.url.replace('https://', '')}. By using this site you agree to the terms below. They’re short and reasonable - it’s a personal portfolio, not a product.</p>

      <Section heading="Use of the site">
        <p>Browse, read, and get in touch. Don’t try to break, overload, or misuse the site, and don’t use it for anything unlawful.</p>
      </Section>

      <Section heading="Developer API">
        <p>
          The optional developer API at api.ayushsharma.me requires signing in with Google and using a personal API key. Keep your key secret, stay within the published rate limits, and don’t use the
          API to build anything unlawful, abusive, or that tries to overload the service. Keys are free and offered as-is; I may revoke a key or change limits at any time to protect the service.
        </p>
      </Section>

      <Section heading="Content & ownership">
        <p>
          The content, design, and code here are mine unless stated otherwise. You’re welcome to read and link to it. Reusing substantial parts - copy, design, or code - without credit or permission
          isn’t allowed.
        </p>
      </Section>

      <Section heading="No warranty">
        <p>The site is provided “as is.” I do my best to keep it accurate and online, but I make no guarantees about availability or that everything is error-free.</p>
      </Section>

      <Section heading="External links">
        <p>This site links to other places (projects, socials, my resume). I’m not responsible for the content or practices of sites I don’t control.</p>
      </Section>

      <Section heading="Liability">
        <p>I’m not liable for any loss or damage arising from your use of the site, to the extent the law allows.</p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms? Reach me at{' '}
          <a href={`mailto:${siteConfig.author.email}`} className="text-blue-400 underline-offset-2 transition-colors hover:text-blue-300 hover:underline">
            {siteConfig.author.email}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}

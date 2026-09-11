import LegalPage, { Section, legalLinkClass } from '@/components/LegalPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Terms of Use',
  description: 'Terms for using ayushsharma.me.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: true },
};

const UPDATED = 'September 11, 2026';

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated={UPDATED}
      intro={`Welcome to ${siteConfig.url.replace('https://', '')}. By using this site you agree to the terms below. They are short and reasonable, because this is a personal portfolio, not a product.`}
    >
      <Section heading="Use of the site">
        <p>Browse, read, and get in touch. Don’t try to break, overload, or misuse the site, and don’t use it for anything unlawful.</p>
      </Section>

      <Section heading="Content and ownership">
        <p>
          The content, design, and code here are mine unless stated otherwise. You’re welcome to read and link to it. Reusing substantial parts of the copy, design, or code without credit or permission
          isn’t allowed.
        </p>
      </Section>

      <Section heading="No warranty">
        <p>The site is provided “as is.” I do my best to keep it accurate and online, but I make no guarantees about availability or that everything is error free.</p>
      </Section>

      <Section heading="External links">
        <p>This site links to other places (projects, repositories, socials, my resume). I’m not responsible for the content or practices of sites I don’t control.</p>
      </Section>

      <Section heading="Liability">
        <p>I’m not liable for any loss or damage arising from your use of the site, to the extent the law allows.</p>
      </Section>

      <Section heading="Contact">
        <p>
          Questions about these terms? Reach me at{' '}
          <a href={`mailto:${siteConfig.author.email}`} className={legalLinkClass}>
            {siteConfig.author.email}
          </a>
          .
        </p>
      </Section>
    </LegalPage>
  );
}

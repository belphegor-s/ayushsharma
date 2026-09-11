import LegalPage, { Section, Strong, legalLinkClass } from '@/components/LegalPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How ayushsharma.me handles your data.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const UPDATED = 'September 11, 2026';

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated={UPDATED}
      intro={`This is the personal site of ${siteConfig.author.name}. It is a portfolio with a contact form, and there is nothing to sell. This page explains the data the site touches and why.`}
    >
      <Section heading="What I collect">
        <ul className="list-disc space-y-2 pl-5 marker:text-line-strong">
          <li>
            <Strong>Contact form.</Strong> When you message me, the name, email, and message you type are sent to my inbox so I can reply. Nothing else.
          </li>
          <li>
            <Strong>Analytics.</Strong> Privacy friendly, aggregate usage data (pages viewed, rough region, device type) via PostHog and Vercel Speed Insights. No invasive tracking, no ad networks.
          </li>
          <li>
            <Strong>Theme preference.</Strong> If you pick light or dark mode, the choice is saved in your browser’s local storage. It never leaves your device.
          </li>
        </ul>
      </Section>

      <Section heading="What I don’t do">
        <p>I don’t sell or rent your data. I don’t run third party ad trackers. I don’t build a profile on you.</p>
      </Section>

      <Section heading="Third parties">
        <p>
          A few trusted services process data on my behalf: Resend (delivers contact emails), PostHog (analytics), and Vercel (hosting and performance metrics). Each handles data under its own privacy
          terms.
        </p>
      </Section>

      <Section heading="Your choices">
        <p>
          Want your contact message deleted, or have a question about your data? Email me at{' '}
          <a href={`mailto:${siteConfig.author.email}`} className={legalLinkClass}>
            {siteConfig.author.email}
          </a>{' '}
          and I’ll sort it out.
        </p>
      </Section>

      <Section heading="Changes">
        <p>If this policy changes, the date at the top updates with it.</p>
      </Section>
    </LegalPage>
  );
}

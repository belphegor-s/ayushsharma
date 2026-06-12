import LegalPage, { Section } from '@/components/LegalPage';
import { siteConfig } from '@/lib/site';

export const metadata = {
  title: 'Privacy Policy',
  description: 'How ayushsharma.me handles your data.',
  alternates: { canonical: '/privacy' },
  robots: { index: true, follow: true },
};

const UPDATED = 'June 12, 2026';

export default function PrivacyPage() {
  return (
    <LegalPage slug="privacy" title="Privacy Policy" updated={UPDATED}>
      <p>
        This is the personal site of {siteConfig.author.name}. It is a portfolio - there are no accounts, no logins, and nothing to sell. This page explains the little data the site does touch and
        why.
      </p>

      <Section heading="What I collect">
        <ul className="list-disc space-y-2 pl-5 marker:text-white/30">
          <li>
            <span className="text-white/85">Contact form.</span> When you message me, the name, email, and message you type are sent to my inbox so I can reply. Nothing else.
          </li>
          <li>
            <span className="text-white/85">Analytics.</span> Privacy-friendly, aggregate usage data (pages viewed, rough region, device type) via PostHog and Vercel Speed Insights. No invasive
            tracking, no ad networks.
          </li>
        </ul>
      </Section>

      <Section heading="What I don't do">
        <p>I don’t sell or rent your data. I don’t run third-party ad trackers. I don’t build a profile on you.</p>
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
          <a href={`mailto:${siteConfig.author.email}`} className="text-blue-400 underline-offset-2 transition-colors hover:text-blue-300 hover:underline">
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

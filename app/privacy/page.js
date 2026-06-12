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
        This is the personal site of {siteConfig.author.name}. It is a portfolio, plus an optional developer API you can use after signing in with Google. There is nothing to sell. This page explains
        the data the site touches and why.
      </p>

      <Section heading="What I collect">
        <ul className="list-disc space-y-2 pl-5 marker:text-white/30">
          <li>
            <span className="text-white/85">Contact form.</span> When you message me, the name, email, and message you type are sent to my inbox so I can reply. Nothing else.
          </li>
          <li>
            <span className="text-white/85">Google sign-in.</span> Only if you choose to use the developer API. Google shares your name, email address, and profile picture so I can create your account
            and show who is signed in. I never receive your Google password.
          </li>
          <li>
            <span className="text-white/85">API usage.</span> For accounts that create an API key, I store the key (hashed) and a monthly request count to enforce fair-use limits.
          </li>
          <li>
            <span className="text-white/85">Analytics.</span> Privacy-friendly, aggregate usage data (pages viewed, rough region, device type) via PostHog and Vercel Speed Insights. No invasive
            tracking, no ad networks.
          </li>
        </ul>
      </Section>

      <Section heading="Signing in with Google">
        <p>
          The developer API at <span className="text-white/85">app.ayushsharma.me</span> uses Google sign-in only to identify your account and issue API keys. I request the minimum scopes
          (your basic profile and email). This data is not used for advertising, is never sold or shared, and is used solely to operate the API. Want your account and keys deleted? Email me and it is
          done.
        </p>
      </Section>

      <Section heading="What I don't do">
        <p>I don’t sell or rent your data. I don’t run third-party ad trackers. I don’t build a profile on you.</p>
      </Section>

      <Section heading="Third parties">
        <p>
          A few trusted services process data on my behalf: Resend (delivers contact emails), PostHog (analytics), Vercel (hosting and performance metrics), Google (sign-in for the developer API), and
          Cloudflare (API hosting and database). Each handles data under its own privacy terms.
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

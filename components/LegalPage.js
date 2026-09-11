import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Label, Row, Spacer, navItemClass, textLinkClass } from '@/components/ui/frame';

export const legalLinkClass = `text-fg ${textLinkClass}`;

export default function LegalPage({ title, updated, intro, children }) {
  return (
    <>
      <SiteHeader>
        <Link href="/" className={`${navItemClass} gap-1.5`}>
          <ArrowLeft size={14} strokeWidth={1.75} aria-hidden />
          Home
        </Link>
      </SiteHeader>

      <main>
        <Row>
          <div className="px-5 pb-8 pt-10 sm:px-6 sm:pb-10 sm:pt-14">
            <Label as="p">Legal · Updated {updated}</Label>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-4xl">{title}</h1>
            {intro && <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted sm:text-base">{intro}</p>}
          </div>
        </Row>
        <Row>
          <div className="divide-y divide-line">{children}</div>
        </Row>
        <Spacer />
      </main>

      <SiteFooter />
    </>
  );
}

export function Section({ heading, children }) {
  return (
    <section className="grid gap-2.5 px-5 py-6 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-8 sm:px-6 sm:py-8">
      <h2 className="text-[13px] font-medium text-fg">{heading}</h2>
      <div className="max-w-xl space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export function Strong({ children }) {
  return <span className="font-medium text-fg">{children}</span>;
}

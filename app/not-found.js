import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { Label, Row, Spacer, buttonClass } from '@/components/ui/frame';

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main>
        <Row>
          <div className="relative flex min-h-[50vh] flex-col justify-center px-5 py-16 sm:px-6">
            <div aria-hidden className="grid-texture pointer-events-none absolute inset-0" />
            <div className="relative">
              <Label as="p">Error 404</Label>
              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-fg sm:text-5xl">Page not found</h1>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-muted sm:text-base">This page does not exist, was moved, or never made it past the cutting room floor.</p>
              <Link href="/" className={`${buttonClass.primary} mt-6`}>
                <ArrowLeft size={15} strokeWidth={1.75} aria-hidden />
                Back home
              </Link>
            </div>
          </div>
        </Row>
        <Spacer />
      </main>
      <SiteFooter />
    </>
  );
}

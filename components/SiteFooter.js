import Link from 'next/link';
import { ArrowUpRight, Coffee } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import { Label, Row, textLinkClass } from '@/components/ui/frame';
import { siteConfig } from '@/lib/site';

const linkClass = `rounded-sm text-[13px] text-muted ${textLinkClass}`;

export default function SiteFooter() {
  return (
    <footer>
      <Row>
        <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1.5">
            <p className="flex items-center gap-2 text-[13px] text-fg">
              Made with questionable decisions and coffee
              <Coffee size={14} strokeWidth={1.75} className="text-subtle" aria-hidden />
            </p>
            <Label as="p">
              © {new Date().getFullYear()} {siteConfig.author.name}
            </Label>
          </div>
          <ThemeToggle className="self-start sm:self-auto" />
        </div>
      </Row>
      <Row last>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3.5 sm:px-6">
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link href="/privacy" className={linkClass}>
              Privacy
            </Link>
            <Link href="/terms" className={linkClass}>
              Terms
            </Link>
          </nav>
          <a href={`mailto:${siteConfig.author.email}`} className={`group inline-flex items-center gap-1 ${linkClass}`}>
            {siteConfig.author.email}
            <ArrowUpRight size={14} strokeWidth={1.75} className="transition-transform group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden />
          </a>
        </div>
      </Row>
    </footer>
  );
}

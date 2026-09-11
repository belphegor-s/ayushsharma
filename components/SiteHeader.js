import Link from 'next/link';
import Logo from '@/components/Logo';
import { Row } from '@/components/ui/frame';

export default function SiteHeader({ children }) {
  return (
    <Row as="header" className="sticky top-0 z-40 bg-bg/80 backdrop-blur-md">
      <div className="flex h-12 items-center justify-between gap-4 pl-5 pr-3 sm:pl-6 sm:pr-4">
        <Link href="/" className="-m-1 flex items-center gap-2.5 rounded-md p-1 text-sm font-medium tracking-[-0.01em] text-fg">
          <Logo className="size-5" />
          Ayush Sharma
        </Link>
        {children && (
          <nav aria-label="Primary" className="flex items-center gap-0.5">
            {children}
          </nav>
        )}
      </div>
    </Row>
  );
}

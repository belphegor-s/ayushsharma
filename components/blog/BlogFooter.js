import Link from 'next/link';
import { Rss } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

const SOCIAL = [
  { href: siteConfig.social.github, icon: FiGithub, label: 'GitHub' },
  { href: siteConfig.social.linkedin, icon: FiLinkedin, label: 'LinkedIn' },
  { href: siteConfig.social.twitter, icon: FaXTwitter, label: 'Twitter' },
  { href: '/blog/rss.xml', icon: Rss, label: 'RSS', internal: true },
];

export default function BlogFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-neutral-800/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-gray-500 md:flex-row">
        <p>
          © {year} <span className="text-gray-300">Ayush Sharma</span>. Built with care.
        </p>
        <div className="flex items-center gap-5">
          {SOCIAL.map(({ href, icon: Icon, label, internal }) =>
            internal ? (
              <Link key={label} href={href} aria-label={label} title={label} className="text-gray-500 hover:text-blue-300 transition-colors">
                <Icon size={16} />
              </Link>
            ) : (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="text-gray-500 hover:text-white transition-colors">
                <Icon size={16} />
              </a>
            ),
          )}
        </div>
      </div>
    </footer>
  );
}

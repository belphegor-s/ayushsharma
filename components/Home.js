'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MotionConfig } from 'framer-motion';
import { ArrowUpRight, ChevronRight, ExternalLink, FileText, Mail } from 'lucide-react';
import { RiGithubFill, RiLinkedinBoxFill, RiMailFill, RiTwitterXFill } from 'react-icons/ri';
import { Toaster } from 'sonner';
import posthog, { initPostHog } from '@/lib/posthog';
import { siteConfig } from '@/lib/site';
import { signature } from '@/lib/fonts';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import Projects from '@/components/Projects';
import ContactDialog from '@/components/ContactDialog';
import Modal, { ModalHeader } from '@/components/ui/Modal';
import { Label, Row, Spacer, buttonClass, iconButtonClass, navItemClass } from '@/components/ui/frame';


const BOSS_URL = 'https://storage.procd.cc/leo.jpg';
const BOSS_BLUR =
  'data:image/jpeg;base64,/9j/2wBDAA0JCgsKCA0LCgsODg0PEyAVExISEyccHhcgLikxMC4pLSwzOko+MzZGNywtQFdBRkxOUlNSMj5aYVpQYEpRUk//2wBDAQ4ODhMREyYVFSZPNS01T09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0//wAARCAAKAAgDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAMG/8QAIRAAAQMDBAMAAAAAAAAAAAAAAQACAwUREgQTIVExNEH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAQACAwAAAAAAAAAAAAAAAAEAEQIDMf/aAAwDAQACEQMRAD8AtqJ9imRtlbE90tn5cXDSfBPY6RZyoe8wfMEUhqMgY9X2f//Z';
const AVATAR_BLUR =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAT0lEQVR4nAFEALv/AOft6/+kpqb/qq2t/+ft7P8A5ejn//f7/P/7////5erp/wDJzMz/i42M/5qcnP/Fx8f/AIKDg/8BAQH/DQ0N/1ZXVv8Tdy+WmlzRbwAAAABJRU5ErkJggg==';

const LINKS = [
  { label: 'GitHub', value: siteConfig.author.github, href: siteConfig.social.github, icon: RiGithubFill },
  { label: 'LinkedIn', value: siteConfig.author.name, href: siteConfig.social.linkedin, icon: RiLinkedinBoxFill },
  { label: 'X', value: siteConfig.author.twitter, href: siteConfig.social.twitter, icon: RiTwitterXFill },
  { label: 'Email', value: siteConfig.author.email, href: `mailto:${siteConfig.author.email}`, icon: RiMailFill },
];

const TOAST_OPTIONS = {
  style: {
    '--normal-bg': 'var(--bg)',
    '--normal-text': 'var(--fg)',
    '--normal-border': 'var(--line-strong)',
    '--normal-bg-hover': 'var(--surface)',
    '--success-bg': 'var(--bg)',
    '--success-text': 'var(--fg)',
    '--success-border': 'var(--line-strong)',
    '--error-bg': 'var(--bg)',
    '--error-text': '#ef4444',
    '--error-border': 'color-mix(in oklab, #ef4444 40%, var(--line-strong))',
    '--border-radius': '8px',
    fontFamily: 'var(--font-sans)',
    fontSize: '14px',
    boxShadow: '0 12px 32px -12px rgba(0, 0, 0, 0.25)',
  },
};

export default function Home({ projects }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [bossOpen, setBossOpen] = useState(false);

  useEffect(() => {
    if (!window.origin.includes('localhost')) initPostHog();
  }, []);

  const openContact = () => {
    setContactOpen(true);
    posthog.capture('opened_contact_form');
  };
  const openResume = () => {
    setResumeOpen(true);
    posthog.capture('clicked_resume');
  };
  const openBoss = () => {
    setBossOpen(true);
    posthog.capture('opened_boss');
  };

  return (
    <MotionConfig reducedMotion="user">
      <Toaster position="top-center" toastOptions={TOAST_OPTIONS} />

      <SiteHeader>
        <a href="#work" className={`${navItemClass} max-sm:hidden`}>
          Work
        </a>
        <button type="button" onClick={openResume} className={navItemClass}>
          Resume
        </button>
        <button type="button" onClick={openContact} className={navItemClass}>
          Contact
        </button>
      </SiteHeader>

      <main>
        <Hero onContact={openContact} onResume={openResume} onBoss={openBoss} />
        <Links />
        <Spacer />

        <Row id="work">
          <div className="flex items-end justify-between gap-6 px-5 py-8 sm:px-6 sm:py-10">
            <div>
              <Label as="p">Selected work</Label>
              <h2 className="mt-2.5 text-xl font-semibold tracking-tight text-fg sm:text-2xl">A couple of things I have shipped.</h2>
            </div>
            <Label className="tabular-nums">{String(projects.length).padStart(2, '0')}</Label>
          </div>
        </Row>
        <Row>
          <Projects projects={projects} />
        </Row>
        <Spacer />
      </main>

      <SiteFooter />

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ResumeDialog open={resumeOpen} onClose={() => setResumeOpen(false)} />
      <BossDialog open={bossOpen} onClose={() => setBossOpen(false)} />
    </MotionConfig>
  );
}

function Hero({ onContact, onResume, onBoss }) {
  return (
    <Row>
      <div className="relative grid items-center gap-7 px-5 pb-10 pt-8 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10 sm:px-6 sm:pb-12 sm:pt-14 lg:pt-16">
        <div aria-hidden className="grid-texture pointer-events-none absolute inset-0 max-sm:hidden" />
        <Portrait />
        <div className="relative">
          <Label as="p" className="reveal">
            {siteConfig.tagline}
          </Label>
          <h1 className={`${signature.className} sign mt-3 text-[2.6rem] font-bold leading-[1.15] text-fg sm:text-6xl lg:text-[4.25rem]`}>
            Ayush Sharma
            {/* Dot caps the exit stroke of the final "a" (Dancing Script Bold: tip ≈ 0.034em past the advance,
                0.164em above baseline, rising up-right), nudged along the stroke with a small gap from the tip,
                like an "i" dot sits off its stem. */}
            <a href="/matrix" aria-hidden tabIndex={-1} className="relative bottom-[0.21em] ml-[0.03em] inline-block size-[0.085em] rounded-full bg-red-500 transition-transform duration-300 hover:scale-150" />
          </h1>
          <span aria-hidden className="draw-line dash-line mt-2 block h-px w-full max-w-xs" />
          <p className="reveal mt-5 max-w-md text-[15px] leading-relaxed text-muted sm:text-base" style={{ '--delay': '120ms' }}>
            {siteConfig.bio}
          </p>
          <div className="reveal mt-6 flex flex-wrap items-center gap-2" style={{ '--delay': '180ms' }}>
            <button type="button" onClick={onContact} className={buttonClass.primary}>
              <Mail size={15} strokeWidth={1.75} aria-hidden />
              Get in touch
            </button>
            <button type="button" onClick={onResume} className={buttonClass.secondary}>
              <FileText size={15} strokeWidth={1.75} aria-hidden />
              Resume
            </button>
            {/* Playful pill, deliberately unlike the two buttons: at rest just Leo's face in a circle.
                On hover/focus the face rolls a full turn while the label unrolls beside it (it opens in place).
                The label animates 0fr -> 1fr grid columns so it can expand to its natural width; its padding
                lives on an inner span because padding on the collapsing item would stop the track reaching 0. */}
            <button
              type="button"
              onClick={onBoss}
              aria-haspopup="dialog"
              className="group inline-flex h-8 cursor-pointer items-center rounded-full border border-line-strong bg-surface p-[3px] text-[13px] text-muted shadow-[0_0_14px_-1px_color-mix(in_oklab,var(--fg)_30%,transparent)] transition-[color,border-color,box-shadow] duration-300 hover:text-fg hover:shadow-[0_0_20px_0_color-mix(in_oklab,var(--fg)_42%,transparent)] focus-visible:shadow-[0_0_20px_0_color-mix(in_oklab,var(--fg)_42%,transparent)] sm:ml-1"
            >
              <span className="relative size-6 shrink-0 overflow-hidden rounded-full bg-surface-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-360 group-focus-visible:rotate-360 motion-reduce:transition-none">
                <Image
                  src={BOSS_URL}
                  alt=""
                  fill
                  sizes="48px"
                  className="origin-[45%_25%] scale-[1.9] object-cover object-[50%_30%]"
                  draggable={false}
                />
              </span>
              <span className="grid grid-cols-[0fr] transition-[grid-template-columns] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:grid-cols-[1fr] group-focus-visible:grid-cols-[1fr] motion-reduce:transition-none">
                <span className="min-w-0 overflow-hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex items-center gap-1.5 whitespace-nowrap pl-2 pr-1.5">
                    Meet the boss
                    <ChevronRight size={14} strokeWidth={1.75} className="shrink-0 text-subtle transition group-hover:translate-x-0.5 group-hover:text-fg" aria-hidden />
                  </span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </Row>
  );
}

function Portrait() {
  return (
    <div className="reveal relative justify-self-start sm:order-last sm:mr-2 lg:mr-8" style={{ '--delay': '120ms' }}>
      <div className="rounded-full border border-line bg-bg p-1">
        <div className="relative size-20 overflow-hidden rounded-full bg-surface-2 sm:size-32 lg:size-36">
          <Image
            src="/assets/ayush.png"
            alt="Portrait of Ayush Sharma"
            fill
            priority
            sizes="(min-width: 1024px) 144px, (min-width: 640px) 128px, 80px"
            placeholder="blur"
            blurDataURL={AVATAR_BLUR}
            className="select-none object-cover"
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}

function Links() {
  return (
    <Row>
      <ul className="grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {LINKS.map(({ label, value, href, icon: Icon }) => {
          const external = !href.startsWith('mailto:');
          return (
            <li key={label} className="bg-bg">
              <a
                href={href}
                {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
                className="group flex h-full flex-col justify-between gap-6 p-4 transition-colors hover:bg-surface focus-visible:-outline-offset-2 sm:px-6 sm:py-5"
              >
                <span className="flex items-center justify-between">
                  <Icon aria-hidden className="size-4 text-fg" />
                  <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden className="text-subtle transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
                </span>
                <span className="block min-w-0">
                  <span className="block text-[13px] font-medium text-fg">{label}</span>
                  <span className="mt-0.5 block truncate text-xs text-muted">{value}</span>
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </Row>
  );
}

function ResumeDialog({ open, onClose }) {
  return (
    // Definite panel height so the iframe can flex to fill it (an iframe has no useful intrinsic height).
    <Modal open={open} onClose={onClose} labelledBy="resume-title" className="h-[calc(100dvh-1.5rem)] max-w-4xl sm:h-[min(88vh,56rem)]">
      <ModalHeader
        onClose={onClose}
        actions={
          <a href={siteConfig.resume} target="_blank" rel="noopener noreferrer" aria-label="Open resume in a new tab" title="Open in new tab" className={iconButtonClass}>
            <ExternalLink size={15} strokeWidth={1.75} />
          </a>
        }
      >
        <Label id="resume-title">Resume</Label>
      </ModalHeader>
      <iframe src={siteConfig.resume} title="Ayush Sharma resume" className="min-h-0 w-full flex-1 bg-surface" />
    </Modal>
  );
}

function BossDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="boss-title" className="max-w-sm">
      <ModalHeader
        onClose={onClose}
        actions={
          <a href={BOSS_URL} target="_blank" rel="noopener noreferrer" aria-label="Open original photo in a new tab" title="Open original" className={iconButtonClass}>
            <ExternalLink size={15} strokeWidth={1.75} />
          </a>
        }
      >
        <Label id="boss-title">Meet the boss</Label>
      </ModalHeader>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="relative aspect-[4/5] max-h-[62vh] w-full overflow-hidden bg-surface-2">
          <Image
            src={BOSS_URL}
            alt="Leo, the boss, eyeing a white daisy"
            fill
            sizes="(min-width: 640px) 384px, 100vw"
            placeholder="blur"
            blurDataURL={BOSS_BLUR}
            className="select-none object-cover object-[50%_35%]"
            draggable={false}
          />
        </div>
        <p className="border-t border-line px-4 py-3.5 text-sm font-medium text-fg sm:px-5">Leo</p>
      </div>
    </Modal>
  );
}

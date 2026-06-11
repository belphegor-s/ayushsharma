'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Send, FileText, ExternalLink, Coffee, ChevronDown, ArrowUpRight } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { initPostHog } from '@/lib/posthog';
import posthog from '@/lib/posthog';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub, FiLinkedin } from 'react-icons/fi';
import Projects from '@/components/Projects';

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const RESUME_URL = 'https://storage.pixly.sh/ayush_resume.pdf';

const socials = [
  { href: 'https://short.pixly.sh/github', icon: FiGithub, label: 'GitHub Profile' },
  { href: 'https://short.pixly.sh/linkedin', icon: FiLinkedin, label: 'LinkedIn Profile' },
  { href: 'https://short.pixly.sh/x', icon: FaXTwitter, label: 'Twitter Profile' },
];

/* Crisp plus marker built from two 1px lines so it centers exactly on a point.
   `at` picks which corner/rail-end it pins to (translate direction follows the side). */
const PLUS_POS = {
  tl: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
  tr: 'right-0 top-0 translate-x-1/2 -translate-y-1/2',
  bl: 'left-0 bottom-0 -translate-x-1/2 translate-y-1/2',
  br: 'right-0 bottom-0 translate-x-1/2 translate-y-1/2',
  l: 'left-0 top-0 -translate-x-1/2 -translate-y-1/2',
  r: 'right-0 top-0 translate-x-1/2 -translate-y-1/2',
};
const Plus = ({ at = 'tl' }) => (
  <span aria-hidden className={`pointer-events-none absolute z-20 block h-[9px] w-[9px] ${PLUS_POS[at]}`}>
    <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/25" />
    <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/25" />
  </span>
);

/* Horizontal hairline with a plus marker pinned to each rail end. */
const Rule = () => (
  <div className="relative border-t border-white/10">
    <Plus at="l" />
    <Plus at="r" />
  </div>
);

const Label = ({ children, accent }) => (
  <span className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
    {accent && <span className="font-bold text-blue-400">/</span>}
    {children}
  </span>
);

const ContactForm = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading('Sending message...');

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Message sent successfully!', { id: loadingToast });
        setFormData({ name: '', email: '', message: '' });
        posthog.capture('contact_form_submitted', { name: formData.name, email: formData.email, message: formData.message });
        setTimeout(onClose, 1000);
      } else {
        throw new Error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.', { id: loadingToast });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const inputCls =
    'w-full bg-white/[0.03] border border-white/10 rounded-md px-3 py-2.5 text-sm text-white placeholder-white/30 transition-colors focus:outline-none focus:border-blue-500/60 focus:bg-white/[0.05]';

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.2 } }}
      className="relative w-full max-w-md border border-white/10 bg-[#0c0d10] shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    >
      <Plus at="tl" />
      <Plus at="tr" />
      <Plus at="bl" />
      <Plus at="br" />

      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <Label accent>contact</Label>
        <button onClick={onClose} aria-label="Close contact form" className="cursor-pointer text-white/40 transition-colors hover:text-white">
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 p-5">
        <div>
          <label htmlFor="name" className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
            Name
          </label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
            Email
          </label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="message" className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-white/40">
            Message
          </label>
          <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={4} className={`${inputCls} resize-none`} placeholder="Say something..." />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Sending...' : 'Send message'} <Send size={16} />
        </button>
      </form>
    </motion.div>
  );
};

const ResumeModal = ({ onClose }) => (
  <motion.div
    className="relative flex w-full max-w-4xl max-h-[90vh] flex-col border border-white/10 bg-[#0c0d10] shadow-2xl"
    initial={{ opacity: 0, y: 24, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 24, scale: 0.97, transition: { duration: 0.2 } }}
    onClick={(e) => e.stopPropagation()}
  >
    <Plus at="tl" />
    <Plus at="tr" />
    <Plus at="bl" />
    <Plus at="br" />
    <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
      <Label accent>resume</Label>
      <div className="flex items-center gap-3">
        <button onClick={() => open(RESUME_URL, '_blank', 'noreferrer noopener')} aria-label="Open resume in new tab" className="cursor-pointer text-white/40 transition-colors hover:text-white">
          <ExternalLink size={18} />
        </button>
        <button onClick={onClose} aria-label="Close resume" className="cursor-pointer text-white/40 transition-colors hover:text-white">
          <X size={18} />
        </button>
      </div>
    </div>
    <div className="flex-1 overflow-auto">
      <iframe src={RESUME_URL} title="Ayush Sharma Resume" className="w-full" style={{ minHeight: '70vh', height: '100%' }} />
    </div>
  </motion.div>
);

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    if (!window.origin.includes('localhost')) initPostHog();
  }, []);

  return (
    <div className="bg-container relative min-h-screen w-full text-white">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: { background: '#16171b', color: '#fff', border: '1px solid #2a2b30' },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />

      {/* Framed central column with side rails + plus corners */}
      <div className="relative z-10 mx-auto w-full max-w-3xl px-4 sm:px-0">
        <div className="content-frame relative border-x border-white/10">
          <Plus at="tl" />
          <Plus at="tr" />

          {/* Top meta bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <Label>ayushsharma.me</Label>
            <Link href="/matrix" className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/30 transition-colors hover:text-blue-400">
              {'// ' + new Date().getFullYear()}
            </Link>
          </div>

          {/* Hero */}
          <section className="relative flex min-h-[80vh] flex-col items-center justify-center px-5 pt-16 pb-28 text-center sm:pt-16">
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: 'easeOut' }}>
              <div className="profile-image">
                <Image
                  src="/assets/ayush.png"
                  alt="Profile Headshot"
                  width={170}
                  height={170}
                  style={{ borderRadius: '50%' }}
                  priority
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAT0lEQVR4nAFEALv/AOft6/+kpqb/qq2t/+ft7P8A5ejn//f7/P/7////5erp/wDJzMz/i42M/5qcnP/Fx8f/AIKDg/8BAQH/DQ0N/1ZXVv8Tdy+WmlzRbwAAAABJRU5ErkJggg=="
                />
              </div>
            </motion.div>

            <div className="relative mt-7">
              <motion.h1
                className={`relative inline-block text-5xl font-bold tracking-tight text-white antialiased md:text-6xl ${dancing.className}`}
                style={{ textShadow: '0 0 15px rgba(99, 102, 241, 0.3)' }}
              >
                {Array.from('Ayush Sharma').map((letter, index, arr) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.04, ease: 'easeOut' }}
                    className={letter === ' ' ? 'mx-2' : 'relative inline-block'}
                  >
                    {letter}
                    {arr.length - 1 === index && <Link href={'/matrix'} className="absolute bottom-0 right-0 -mr-[.15em] mb-[.45em] h-[.05em] w-[.05em] cursor-pointer rounded-full bg-red-500" />}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.div
                className="mx-auto h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '100%', opacity: 1 }}
                transition={{ duration: 0.8, delay: 1, ease: 'easeInOut' }}
                style={{ maxWidth: '360px' }}
              />
            </div>

            <motion.p className="shimmer-text mt-4 text-base font-semibold tracking-wide md:text-xl" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}>
              Developer / Tinkerer / Stoic
            </motion.p>

            <motion.a
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-white"
              href="https://storage.pixly.sh/leo.jpg"
              target="_blank"
              rel="noreferrer noopener"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <ExternalLink size={13} />
              Meet the boss
            </motion.a>

            {/* Segmented socials */}
            <motion.div
              className="mt-8 inline-flex divide-x divide-white/10 overflow-hidden rounded-md border border-white/10 bg-white/[0.02]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {socials.map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="px-5 py-3 text-white/70 transition-colors hover:bg-white/5 hover:text-white"
                  whileTap={{ scale: 0.92 }}
                >
                  <Icon size={20} />
                </motion.a>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div className="mt-5 flex items-center justify-center gap-3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
              <button
                onClick={() => {
                  setShowResume(true);
                  posthog.capture('clicked_resume');
                }}
                className="inline-flex w-32 cursor-pointer items-center justify-center gap-2 rounded-md border border-blue-400/60 px-4 py-2 text-sm font-medium text-blue-300 transition-colors hover:border-white hover:text-white sm:w-36"
              >
                <FileText size={15} /> Resume
              </button>
              <button
                onClick={() => {
                  setIsContactOpen(true);
                  posthog.capture('opened_contact_form');
                }}
                className="inline-flex w-32 cursor-pointer items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 sm:w-36"
              >
                <Mail size={15} /> Contact
              </button>
            </motion.div>

            <motion.a
              href="#projects"
              aria-label="Scroll to projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1 text-white/35 transition-colors hover:text-white/70"
            >
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em]">Work</span>
              <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}>
                <ChevronDown size={16} />
              </motion.span>
            </motion.a>
          </section>

          <Rule />

          <Projects />

          <Rule />

          {/* Footer */}
          <footer className="flex items-center justify-center gap-4 px-5 py-5 sm:justify-between">
            <span className="hidden font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/30 sm:inline">© {new Date().getFullYear()}</span>
            <span className="flex items-center gap-2 text-center text-xs font-medium text-white/45">
              Made with questionable decisions and coffee <Coffee size={13} />
            </span>
            <a
              href={`mailto:hello@ayushsharma.me`}
              className="hidden items-center gap-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-white/30 transition-colors hover:text-blue-400 sm:inline-flex"
            >
              say hi <ArrowUpRight size={12} />
            </a>
          </footer>

          <Plus at="bl" />
          <Plus at="br" />
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            key="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setIsContactOpen(false)}
          >
            <ContactForm onClose={() => setIsContactOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResume && (
          <motion.div
            key="resume-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onClick={() => setShowResume(false)}
          >
            <ResumeModal onClose={() => setShowResume(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

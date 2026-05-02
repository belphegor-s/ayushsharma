'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, BookOpen, Send, FileText, ExternalLink, Coffee } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { initPostHog } from '@/lib/posthog';
import posthog from '@/lib/posthog';
import Image from 'next/image';
import { Dancing_Script } from 'next/font/google';
import Link from 'next/link';
import { FaXTwitter } from 'react-icons/fa6';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

const dancing = Dancing_Script({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export const Button = ({ children, onClick, className = '', ...props }) => {
  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
      className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const SocialLink = ({ href, icon: Icon, label, internal = false }) => {
  const isInternal = internal || href.startsWith('/');
  if (isInternal) {
    return (
      <Link href={href} aria-label={label} className="text-white/80 hover:text-white transition-colors duration-200">
        <motion.span whileHover={{ y: -2 }} whileTap={{ scale: 0.9 }} className="inline-flex">
          <Icon size={24} />
        </motion.span>
      </Link>
    );
  }
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-white/80 hover:text-white transition-colors duration-200"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.9 }}
    >
      <Icon size={24} />
    </motion.a>
  );
};

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
        headers: {
          'Content-Type': 'application/json',
        },
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
      if (formRef.current && !formRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <motion.div
      ref={formRef}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
      className="relative bg-neutral-700 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-neutral-900"
      onClick={(e) => e.stopPropagation()}
    >
      <Button onClick={onClose} className="absolute top-4 right-4 text-neutral-300 hover:text-white !p-1 cursor-pointer" aria-label="Close contact form" title="Close contact form">
        <X size={20} />
      </Button>
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">Get In Touch</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-neutral-600 border border-neutral-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your Name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-neutral-600 border border-neutral-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 bg-neutral-600 border border-neutral-800 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Your message here..."
          ></textarea>
        </div>
        <div className="text-center pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const ResumeModal = ({ onClose }) => (
  <motion.div
    className="bg-neutral-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
    initial={{ opacity: 0, y: 50, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 50, scale: 0.9, transition: { duration: 0.2 } }}
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-end items-center gap-2 p-2 bg-neutral-800 border-b border-gray-700">
      <Button
        onClick={() => open('https://storage.pixly.sh/ayush_resume.pdf', '_blank', 'noreferrer noopener')}
        className="text-neutral-300 hover:text-white !p-1 cursor-pointer"
        aria-label="Open resume in new tab"
        title="Open resume in new tab"
      >
        <ExternalLink size={20} />
      </Button>
      <Button onClick={onClose} className="text-neutral-300 hover:text-white !p-1 cursor-pointer" aria-label="Close resume" title="Close resume">
        <X size={20} />
      </Button>
    </div>
    <div className="flex-1 overflow-auto">
      <iframe src="https://storage.pixly.sh/ayush_resume.pdf" title="Ayush Sharma Resume" className="w-full h-full" style={{ minHeight: '70vh' }} />
    </div>
  </motion.div>
);

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  useEffect(() => {
    if (!window.origin.includes('localhost')) {
      initPostHog();
    }
  }, []);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-container">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            background: '#333',
            color: '#fff',
            border: '1px solid #555',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center bg-neutral-700/50 backdrop-blur-sm p-8 px-2 md:p-12 rounded-xl shadow-lg border border-neutral-800/50 max-w-2xl w-full"
      >
        <motion.div className="relative mb-6 flex justify-center w-max mx-auto bg-" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
          <div className={'profile-image'}>
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
        <motion.div className="mb-2 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <motion.h1
            className={`text-5xl md:text-6xl font-bold text-white tracking-tight relative inline-block ${dancing.className} antialiased`}
            style={{ textShadow: '0 0 15px rgba(99, 102, 241, 0.3)' }}
          >
            {Array.from('Ayush Sharma').map((letter, index, arr) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.3 + index * 0.04,
                  ease: 'easeOut',
                }}
                className={letter === ' ' ? 'mx-2' : 'inline-block relative'}
              >
                {letter}
                {arr.length - 1 === index && <Link href={'/matrix'} className="w-[.05em] h-[.05em] bg-red-500 absolute bottom-0 right-0 -mr-[.15em] mb-[.45em] rounded-full cursor-pointer"></Link>}
              </motion.span>
            ))}
          </motion.h1>
          <motion.div
            className="h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: '100%', opacity: 1 }}
            transition={{ duration: 0.8, delay: 1, ease: 'easeInOut' }}
            style={{ maxWidth: '360px' }}
          />
        </motion.div>
        <motion.p
          className="text-md md:text-xl text-blue-300 mb-6 font-semibold tracking-wide mt-4 shimmer-text"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Developer / Tinkerer / Stoic
        </motion.p>
        <motion.a
          className="text-white mb-6 font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 hover:underline underline-offset-4"
          href="https://storage.pixly.sh/leo.jpg"
          target="_blank"
          rel="noreferrer noopener"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ExternalLink size={14} />
          Meet the Boss
        </motion.a>
        <motion.div className="flex justify-center space-x-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6, staggerChildren: 0.1 }}>
          <SocialLink href="https://short.pixly.sh/github" icon={FiGithub} label="GitHub Profile" />
          <SocialLink href="https://short.pixly.sh/linkedin" icon={FiLinkedin} label="LinkedIn Profile" />
          <SocialLink href="https://short.pixly.sh/x" icon={FaXTwitter} label="Twitter Profile" />
        </motion.div>
        <motion.div className="flex items-center justify-center gap-3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75 }}>
          <Link href="/blog" onClick={() => posthog.capture('clicked_blog_cta')} className="w-32 sm:w-36">
            <motion.span
              whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.96 }}
              className="w-full px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 ease-in-out border border-blue-400/80 text-blue-300 hover:text-white hover:border-white bg-transparent font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen size={16} /> Blog
            </motion.span>
          </Link>

          <motion.button
            type="button"
            onClick={() => {
              setIsContactOpen(true);
              posthog.capture('opened_contact_form');
            }}
            whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.96 }}
            className="w-32 sm:w-36 px-3 py-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500 transition-all duration-200 ease-in-out bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Mail size={16} /> Contact Me
          </motion.button>
        </motion.div>
        <motion.button
          type="button"
          onClick={() => {
            setShowResume(true);
            posthog.capture('clicked_resume');
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="mt-5 mx-auto flex w-fit items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors hover:underline underline-offset-4 cursor-pointer focus:outline-none focus:text-white"
        >
          <FileText size={14} /> View Résumé
        </motion.button>
      </motion.main>
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            key="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowResume(false)}
          >
            <ResumeModal isOpen={showResume} onClose={() => setShowResume(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.footer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }} className="absolute bottom-4 w-full z-10 flex justify-center">
        <div className="px-4 py-1 rounded-lg bg-neutral-800 backdrop-blur-sm text-center text-white/90 font-medium text-[.9em] flex items-center gap-2 shadow-lg shadow-neutral-900/40">
          Made with questionable decisions and coffee <Coffee size={14} />
        </div>
      </motion.footer>
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgb(229 231 235);
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

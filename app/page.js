'use client';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, X, Github, Linkedin, Twitter, BookOpen, Send, FileText } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { initPostHog } from '@/lib/posthog';
import posthog from '@/lib/posthog';

const Button = ({ children, onClick, className = '', ...props }) => {
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
      className={`px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-200 ease-in-out ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const SocialLink = ({ href, icon: Icon, label }) => (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-gray-400 hover:text-white transition-colors duration-200"
    whileHover={{ y: -2 }}
    whileTap={{ scale: 0.9 }}
  >
    <Icon size={24} />
  </motion.a>
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
      className="relative bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md mx-auto border border-gray-700"
      onClick={(e) => e.stopPropagation()}
    >
      <Button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white !p-1 cursor-pointer" aria-label="Close contact form">
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            placeholder="Your message here..."
          ></textarea>
        </div>
        <div className="text-center pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'} <Send size={18} />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

const ResumeModal = ({ onClose }) => (
  <motion.div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    <motion.div
      className="bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className="flex justify-end p-2 bg-gray-800 border-b border-gray-700">
        <Button onClick={onClose} className="text-gray-500 hover:text-white !p-1 cursor-pointer" aria-label="Close contact form">
          <X size={20} />
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <iframe src="https://resume-worker.ayush2162002.workers.dev/" title="Ayush Sharma Resume" className="w-full h-full" style={{ minHeight: '70vh' }} />
      </div>
    </motion.div>
  </motion.div>
);

export default function Home() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showResume, setShowResume] = useState(false);

  const openContactPopup = () => {
    setIsContactOpen(true);
    posthog.capture('opened_contact_form');
  };

  const closeContactPopup = () => {
    setIsContactOpen(false);
  };

  useEffect(() => {
    initPostHog();
  }, []);

  useEffect(() => {
    document.body.classList.add('bg-gradient-animation');
    return () => {
      document.body.classList.remove('bg-gradient-animation');
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
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

      <div className="absolute inset-0 z-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center bg-gray-800/50 backdrop-blur-sm p-8 md:p-12 rounded-xl shadow-lg border border-gray-700/50 max-w-2xl w-full"
      >
        {/* <motion.h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-tight" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          Ayush Sharma
        </motion.h1> */}
        <motion.div className="mb-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <svg viewBox="0 0 400 50" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-lg mx-auto h-auto" aria-label="Ayush Sharma">
            <text x="50%" y="50%" dy=".30em" textAnchor="middle" className="animated-text-name">
              Ayush Sharma
            </text>
          </svg>
        </motion.div>

        <motion.p
          className="text-lg md:text-xl text-indigo-300 mb-6 font-light tracking-wide"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Developer / Tinkerer / Stoic
        </motion.p>

        {/* Social Links */}
        <motion.div className="flex justify-center space-x-6 mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.6, staggerChildren: 0.1 }}>
          <SocialLink href="https://github.com/belphegor-s/" icon={Github} label="GitHub Profile" />
          <SocialLink href="https://www.linkedin.com/in/ayush-sharma-2802/" icon={Linkedin} label="LinkedIn Profile" />
          <SocialLink href="https://x.com/sharma_0502" icon={Twitter} label="Twitter Profile" />
          <SocialLink href="https://blog.ayushsharma.me/" icon={BookOpen} label="Blog" />
        </motion.div>

        <motion.div className="mb-6 flex justify-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.75 }}>
          <button
            onClick={() => setShowResume(true)}
            aria-label="View Résumé"
            className="px-4 py-2 border border-indigo-400 text-indigo-300 hover:text-white hover:border-white rounded-md transition-colors duration-300 text-sm font-medium cursor-pointer"
          >
            View Résumé
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.8, type: 'spring', stiffness: 150 }}>
          <Button onClick={openContactPopup} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center justify-center gap-2 mx-auto shadow-lg cursor-pointer">
            <Mail size={18} /> Contact Me
          </Button>
        </motion.div>
      </motion.main>

      {/* Contact Popup */}
      <AnimatePresence>
        {isContactOpen && (
          <motion.div
            key="contact-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeContactPopup}
          >
            <ContactForm onClose={closeContactPopup} />
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
            onClick={closeContactPopup}
          >
            <ResumeModal isOpen={showResume} onClose={() => setShowResume(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimalist Footer */}
      <footer className="absolute bottom-4 text-center w-full text-gray-500 text-xs z-10">© {new Date().getFullYear()} Ayush Sharma. All rights reserved.</footer>

      <style jsx global>{`
        body.bg-gradient-animation {
          background: linear-gradient(-45deg, #111827, #1f2937, #374151, #111827); /* Dark gradient */
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }

        @keyframes gradientBG {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Improve scrollbar for aesthetics (optional) */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-thumb {
          background: rgb(229 231 235);
          border-radius: 4px;
        }

        /* === SVG Text Animation Styles === */
        .animated-text-name {
          font-family: 'Inter', sans-serif; /* Match font */
          font-size: 3rem; /* Adjust size as needed, relative to viewBox */
          font-weight: bold;
          fill: none; /* Start with no fill */
          fill-opacity: 0;
          stroke: #ffffff; /* White stroke */
          stroke-width: 0.5; /* Adjust stroke width */
          stroke-dasharray: 500; /* Estimate length, adjust if needed */
          stroke-dashoffset: 500; /* Start fully dashed (invisible) */
          animation:
            drawName 2s ease-in-out forwards 0.5s,
            fillName 1s ease-in-out forwards 2.5s; /* Draw animation starts after 0.5s delay, fill starts after draw */
          animation-iteration-count: 1, 1; /* One time for both animations */
          animation-fill-mode: forwards, forwards; /* Keep final state */
        }

        @keyframes drawName {
          to {
            stroke-dashoffset: 0; /* Animate stroke to reveal text */
          }
        }

        @keyframes fillName {
          to {
            fill: #ffffff; /* Fill text with white */
            fill-opacity: 1;
            stroke-width: 0; /* Optionally remove stroke after fill */
          }
        }
      `}</style>
    </div>
  );
}

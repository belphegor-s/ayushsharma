'use client';
import { useState } from 'react';
import { Toaster, toast } from 'sonner';
import { ArrowRight } from 'lucide-react';
import posthog from '@/lib/posthog';
import { siteConfig } from '@/lib/site';
import Modal, { ModalHeader } from '@/components/ui/Modal';
import { Label, buttonClass, textLinkClass } from '@/components/ui/frame';

const EMPTY = { name: '', email: '', message: '' };

/* The toaster travels with this dialog: the contact form is the only thing on the site
   that raises a toast, so sonner loads with it rather than with the page. */
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
const fieldClass =
  'w-full rounded-md border border-line-strong bg-bg px-3 text-sm text-fg placeholder:text-subtle transition-[border-color,box-shadow] hover:border-subtle/60 focus:border-fg focus:ring-4 focus:ring-fg/10 focus:outline-none focus-visible:outline-none';

export default function ContactDialog({ open, onClose }) {
  return (
    <>
      <Toaster position="top-center" toastOptions={TOAST_OPTIONS} />
      <Modal open={open} onClose={onClose} labelledBy="contact-title" className="max-w-md">
        <ModalHeader onClose={onClose}>
          <Label>Contact</Label>
        </ModalHeader>
        <ContactForm onSent={onClose} />
      </Modal>
    </>
  );
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-medium text-fg">
        {label}
      </label>
      {children}
    </div>
  );
}

function ContactForm({ onSent }) {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (sending) return;

    setSending(true);
    const toastId = toast.loading('Sending message...');

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Could not send your message. Please try again.');

      toast.success('Message sent. Talk soon.', { id: toastId });
      posthog.capture('contact_form_submitted', { name: form.name, email: form.email, message: form.message });
      setForm(EMPTY);
      setTimeout(onSent, 800);
    } catch (error) {
      toast.error(error.message || 'Something went wrong.', { id: toastId });
      console.error('Form submission error:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-5 pt-6 sm:px-6">
          <h2 id="contact-title" className="text-xl font-semibold tracking-tight text-fg">
            Get in touch
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">
            Send a note and I will get back to you soon. Prefer email? Write to{' '}
            <a href={`mailto:${siteConfig.author.email}`} className={`text-fg ${textLinkClass}`}>
              {siteConfig.author.email}
            </a>
            .
          </p>
        </div>

        <div className="space-y-4 px-5 py-6 sm:px-6">
          <Field id="name" label="Name">
            <input id="name" name="name" type="text" required autoComplete="name" value={form.name} onChange={onChange} placeholder="Your name" className={`${fieldClass} h-10`} data-autofocus />
          </Field>
          <Field id="email" label="Email">
            <input id="email" name="email" type="email" required autoComplete="email" value={form.email} onChange={onChange} placeholder="you@example.com" className={`${fieldClass} h-10`} />
          </Field>
          <Field id="message" label="Message">
            <textarea id="message" name="message" required rows={5} value={form.message} onChange={onChange} placeholder="What are you working on?" className={`${fieldClass} resize-none py-2.5`} />
          </Field>
        </div>
      </div>

      <div className="flex shrink-0 justify-end border-t border-line p-3">
        <button type="submit" disabled={sending} className={`${buttonClass.primary} max-sm:w-full`}>
          {sending ? 'Sending...' : 'Send message'}
          <ArrowRight size={15} strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </form>
  );
}

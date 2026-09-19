'use client';
import { ExternalLink } from 'lucide-react';
import { siteConfig } from '@/lib/site';
import Modal, { ModalHeader } from '@/components/ui/Modal';
import { Label, iconButtonClass } from '@/components/ui/frame';

export default function ResumeDialog({ open, onClose }) {
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

'use client';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { BOSS_BLUR, BOSS_URL } from '@/components/home/boss';
import Modal, { ModalHeader } from '@/components/ui/Modal';
import { Label, iconButtonClass } from '@/components/ui/frame';

export default function BossDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="boss-title" sound="woof" className="max-w-sm">
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

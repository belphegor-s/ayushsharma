'use client';
import { useDialogs } from '@/components/home/DialogHost';

/* A button that opens one of the host's dialogs. Its contents are rendered on the
   server and handed down as children, so only the click handler ships to the browser. */
export default function DialogTrigger({ dialog, children, ...props }) {
  const { show, prefetch } = useDialogs();
  return (
    <button type="button" onClick={() => show(dialog)} onPointerEnter={prefetch} onFocus={prefetch} {...props}>
      {children}
    </button>
  );
}

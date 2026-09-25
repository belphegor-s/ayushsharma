'use client';
import { useProjects } from '@/components/projects/ProjectsHost';

/* Opens a project's detail dialog. The card around it, and this button's label,
   are server-rendered; only the handler ships. */
export default function ProjectTrigger({ slug, children, ...props }) {
  const { show, prefetch } = useProjects();
  return (
    <button type="button" data-sound="none" onClick={() => show(slug)} onPointerEnter={prefetch} onFocus={prefetch} {...props}>
      {children}
    </button>
  );
}

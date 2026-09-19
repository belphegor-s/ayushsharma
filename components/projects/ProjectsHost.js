'use client';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import posthog from '@/lib/posthog';

/* The project detail dialog, and the framer-motion it animates with, load the first
   time a card is about to be opened. Until then the grid is plain server-rendered HTML. */
const loadDialog = () => import('@/components/projects/ProjectDialog');
const ProjectDialog = dynamic(loadDialog);

const ProjectsContext = createContext(null);

export function useProjects() {
  const value = useContext(ProjectsContext);
  if (!value) throw new Error('useProjects must be used inside <ProjectsHost>');
  return value;
}

export default function ProjectsHost({ projects, children }) {
  // `selected` outlives `open` so the dialog keeps its content while animating out.
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const prefetched = useRef(false);

  const prefetch = useCallback(() => {
    if (prefetched.current) return;
    prefetched.current = true;
    loadDialog();
  }, []);

  const show = useCallback(
    (slug) => {
      const project = projects.find((p) => p.slug === slug);
      if (!project) return;
      setSelected(project);
      setOpen(true);
      posthog.capture('opened_project', { project: project.name });
    },
    [projects]
  );

  const value = useMemo(() => ({ show, prefetch }), [show, prefetch]);

  return (
    <ProjectsContext.Provider value={value}>
      {children}
      {selected && <ProjectDialog project={selected} open={open} onClose={() => setOpen(false)} />}
    </ProjectsContext.Provider>
  );
}

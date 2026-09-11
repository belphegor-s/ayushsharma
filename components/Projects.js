'use client';
import { useState } from 'react';
import { ArrowRight, ArrowUpRight, Box, Check, Clapperboard, MessagesSquare } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import posthog from '@/lib/posthog';
import Modal, { ModalHeader } from '@/components/ui/Modal';
import { Label, buttonClass, textLinkClass } from '@/components/ui/frame';

const ICONS = { transcoder: Clapperboard, huddle: MessagesSquare };

const chipClass = 'rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted';

export default function Projects({ projects }) {
  // `selected` outlives `open` so the dialog keeps its content while animating out.
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const show = (project) => {
    setSelected(project);
    setOpen(true);
    posthog.capture('opened_project', { project: project.name });
  };

  return (
    <>
      <ul className="grid gap-px bg-line sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="bg-bg">
            <ProjectCard project={project} onOpen={() => show(project)} />
          </li>
        ))}
        {projects.length % 2 === 1 && <li aria-hidden className="hatch bg-bg max-sm:hidden" />}
      </ul>

      <Modal open={open} onClose={() => setOpen(false)} labelledBy="project-title" className="max-w-xl">
        {selected && <ProjectDetail project={selected} onClose={() => setOpen(false)} />}
      </Modal>
    </>
  );
}

/* Whole card is clickable through the title button's stretched ::after, which
   keeps the markup valid (no block content inside a button). */
function ProjectCard({ project, onOpen }) {
  const Icon = ICONS[project.slug] || Box;
  return (
    <article className="group relative flex h-full flex-col p-5 transition-colors hover:bg-surface has-[button:focus-visible]:bg-surface sm:p-6">
      <div className="flex items-start justify-between">
        <span className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-fg transition-colors duration-300 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
          <Icon size={16} strokeWidth={1.5} aria-hidden />
        </span>
        <Label className="tabular-nums">{project.index}</Label>
      </div>

      <div className="mt-8">
        <Label as="p">{project.category}</Label>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-fg">
          <button
            type="button"
            onClick={onOpen}
            aria-haspopup="dialog"
            className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-fg"
          >
            {project.name}
          </button>
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{project.summary}</p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <li key={tag} className={chipClass}>
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6">
        <div className="flex items-center justify-between gap-4 border-t border-line pt-4">
          <span className="truncate font-mono text-xs text-subtle">{project.domain}</span>
          <span className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-muted transition-colors group-hover:text-fg">
            Details
            <ArrowRight size={14} strokeWidth={1.75} className="transition-transform group-hover:translate-x-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </article>
  );
}

function ProjectDetail({ project, onClose }) {
  const Icon = ICONS[project.slug] || Box;
  const { stats } = project;
  const github = `https://github.com/${project.repo}`;

  const facts = [
    { label: 'Live', value: project.domain, href: project.url },
    { label: 'Source', value: project.repo.split('/')[1], href: github },
  ];
  if (stats?.language && stats?.updated) {
    facts.push({ label: 'Language', value: stats.language }, { label: 'Updated', value: stats.updated });
  }
  const repoMeta = [stats?.license && `${stats.license} license`, stats?.stars > 0 && `${stats.stars} ${stats.stars === 1 ? 'star' : 'stars'}`].filter(Boolean);

  return (
    <>
      <ModalHeader onClose={onClose}>
        <Label>Project {project.index}</Label>
      </ModalHeader>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface text-fg">
              <Icon size={18} strokeWidth={1.5} aria-hidden />
            </span>
            <div className="min-w-0">
              <h2 id="project-title" className="text-lg font-semibold tracking-tight text-fg">
                {project.name}
              </h2>
              <p className="text-[13px] text-muted">{project.category}</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted">{project.description}</p>
        </div>

        <dl className="grid grid-cols-2 gap-px border-y border-line bg-line">
          {facts.map(({ label, value, href }) => (
            <div key={label} className="min-w-0 bg-bg px-5 py-3.5 sm:px-6">
              <Label as="dt">{label}</Label>
              <dd className="mt-1.5 truncate text-sm text-fg">
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className={textLinkClass}>
                    {value}
                  </a>
                ) : (
                  value
                )}
              </dd>
            </div>
          ))}
        </dl>

        <div className="px-5 py-5 sm:px-6">
          <Label as="h3">Highlights</Label>
          <ul className="mt-3.5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {project.highlights.map((item) => (
              <li key={item} className="flex gap-2.5 text-[13px] leading-snug text-fg">
                <Check size={15} strokeWidth={2} className="mt-px shrink-0 text-subtle" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-line px-5 py-5 sm:px-6">
          <Label as="h3">Stack</Label>
          <ul className="mt-3.5 flex flex-wrap gap-1.5">
            {project.stack.map((item) => (
              <li key={item} className={chipClass}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex shrink-0 flex-col gap-3 border-t border-line p-3 sm:flex-row sm:items-center sm:justify-between sm:pl-6">
        {repoMeta.length > 0 ? <Label className="max-sm:hidden">{repoMeta.join(' · ')}</Label> : <span className="max-sm:hidden" />}
        <div className="flex gap-2">
          <a href={github} target="_blank" rel="noopener noreferrer" className={`${buttonClass.secondary} max-sm:flex-1`}>
            <RiGithubFill size={16} aria-hidden />
            Source
          </a>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => posthog.capture('clicked_project', { project: project.name })}
            className={`${buttonClass.primary} max-sm:flex-1`}
          >
            Visit site
            <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
          </a>
        </div>
      </div>
    </>
  );
}

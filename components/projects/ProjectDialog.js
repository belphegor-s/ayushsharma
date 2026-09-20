'use client';
import { ArrowUpRight, Box, Check, Clapperboard, Code2, Globe, Link2, MessagesSquare } from 'lucide-react';
import { RiGithubFill } from 'react-icons/ri';
import posthog from '@/lib/posthog';
import Modal, { ModalHeader } from '@/components/ui/Modal';
import { Label, buttonClass, textLinkClass } from '@/components/ui/frame';
import { chipClass } from '@/components/projects/styles';

const ICONS = { transcoder: Clapperboard, pluck: Globe, huddle: MessagesSquare, knox: Code2, shrt: Link2 };

export default function ProjectDialog({ project, open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} labelledBy="project-title" className="max-w-xl">
      <ProjectDetail project={project} onClose={onClose} />
    </Modal>
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

import { ArrowRight, Box, Clapperboard, Code2, Globe, Link2, MessagesSquare } from 'lucide-react';
import { Label } from '@/components/ui/frame';
import ProjectsHost from '@/components/projects/ProjectsHost';
import ProjectTrigger from '@/components/projects/ProjectTrigger';
import { chipClass } from '@/components/projects/styles';

const ICONS = { transcoder: Clapperboard, pluck: Globe, huddle: MessagesSquare, knox: Code2, shrt: Link2 };

/* Projects are split into two tiers, each with its own grid. The gap between the
   grids does the separating, so nothing here has to span columns. */
const TIERS = [
  { label: 'Cool projects', cool: true },
  { label: 'Not so cool projects', cool: false },
];

/* The grids are server-rendered; the host around them is the only client code, and
   the detail dialog it owns is fetched on demand. */
export default function Projects({ projects }) {
  const tiers = TIERS.map((tier) => ({
    ...tier,
    projects: projects.filter((project) => Boolean(project.cool) === tier.cool),
  })).filter((tier) => tier.projects.length > 0);

  return (
    <ProjectsHost projects={projects}>
      <div className="flex flex-col gap-8 sm:gap-10">
        {tiers.map((tier) => (
          <ProjectTier key={tier.label} label={tier.label} projects={tier.projects} />
        ))}
      </div>
    </ProjectsHost>
  );
}

function ProjectTier({ label, projects }) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3 sm:px-6">
        <Label as="p">{label}</Label>
        <Label className="tabular-nums">{String(projects.length).padStart(2, '0')}</Label>
      </div>
      <ul className="grid gap-px bg-line sm:grid-cols-2">
        {projects.map((project) => (
          <li key={project.slug} className="bg-bg">
            <ProjectCard project={project} />
          </li>
        ))}
        {projects.length % 2 === 1 && <li aria-hidden className="hatch bg-bg max-sm:hidden" />}
      </ul>
    </section>
  );
}

/* Whole card is clickable through the title button's stretched ::after, which
   keeps the markup valid (no block content inside a button). */
function ProjectCard({ project }) {
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
          <ProjectTrigger
            slug={project.slug}
            aria-haspopup="dialog"
            className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-fg"
          >
            {project.name}
          </ProjectTrigger>
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

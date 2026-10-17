import { ArrowRight, Asterisk, Box, Clapperboard, Code2, Globe, Link2, MessagesSquare, Webhook } from 'lucide-react';
import { Label } from '@/components/ui/frame';
import ProjectsHost from '@/components/projects/ProjectsHost';
import ProjectTrigger from '@/components/projects/ProjectTrigger';
import Preview, { Shot, hasPreview } from '@/components/projects/Preview';
import { chipClass } from '@/components/projects/styles';

const ICONS = { transcoder: Clapperboard, pluck: Globe, huddle: MessagesSquare, knox: Code2, shrt: Link2, webhooks: Webhook };

/* Projects are split into two tiers. Cool ones get full cards; the rest collapse
   into a quieter list, with a hatched band between the two doing the separating. */
const TIERS = [
  { label: 'Cool projects', note: 'Worth your time.', cool: true },
  { label: 'Not so cool projects', note: 'Side quests and quick builds.', cool: false },
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
      {tiers.map((tier, i) => (
        <section key={tier.label}>
          {i > 0 && <div aria-hidden className="hatch h-8 border-b border-line sm:h-10" />}
          <TierHeader tier={tier} />
          {tier.cool ? <CoolGrid projects={tier.projects} /> : <PlainList projects={tier.projects} />}
        </section>
      ))}
    </ProjectsHost>
  );
}

function TierHeader({ tier }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b border-line px-5 py-4 sm:px-6">
      <div>
        <h3 className={`flex items-center gap-1 text-sm font-semibold tracking-tight sm:text-base ${tier.cool ? 'text-fg' : 'text-muted'}`}>
          <Asterisk size={16} strokeWidth={tier.cool ? 2.5 : 2} aria-hidden className={tier.cool ? 'text-fg' : 'text-subtle'} />
          {tier.label}
        </h3>
        <p className="mt-1 pl-5 text-xs text-subtle">{tier.note}</p>
      </div>
      <Label className="tabular-nums">{String(tier.projects.length).padStart(2, '0')}</Label>
    </div>
  );
}

/* With an odd count the first card spans both columns as the lead, so the grid
   closes flush instead of leaving a hole. */
function CoolGrid({ projects }) {
  const lead = projects.length % 2 === 1;
  return (
    <ul className="grid gap-px bg-line sm:grid-cols-2">
      {projects.map((project, i) => (
        <li key={project.slug} className={`bg-bg ${lead && i === 0 ? 'sm:col-span-2' : ''}`}>
          <ProjectCard project={project} lead={lead && i === 0} />
        </li>
      ))}
    </ul>
  );
}

/* Compact rows: icon, name, one line of summary, domain. Same stretched-button
   trick as the cards, so the whole row opens the dialog. From sm up the icon
   gives way to a thumbnail of the live site. */
function PlainList({ projects }) {
  return (
    <ul className="divide-y divide-line">
      {projects.map((project) => {
        const Icon = ICONS[project.slug] || Box;
        return (
          <li key={project.slug} className="group relative flex items-center gap-4 px-5 py-4 transition-colors hover:bg-surface has-[button:focus-visible]:bg-surface sm:px-6">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-md border border-line text-subtle transition-colors group-hover:border-line-strong group-hover:text-fg ${hasPreview(project.slug) ? 'sm:hidden' : ''}`}
            >
              <Icon size={14} strokeWidth={1.5} aria-hidden />
            </span>
            {hasPreview(project.slug) && (
              <span className="relative w-[72px] shrink-0 overflow-hidden rounded-[5px] border border-line bg-surface transition-colors group-hover:border-line-strong max-sm:hidden">
                <Shot slug={project.slug} alt="" sizes="72px" className="origin-top transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-2.5">
                <h4 className="text-sm font-medium tracking-tight text-fg/85 group-hover:text-fg">
                  <ProjectTrigger
                    slug={project.slug}
                    aria-haspopup="dialog"
                    className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-fg"
                  >
                    {project.name}
                  </ProjectTrigger>
                </h4>
                <Label className="truncate max-sm:hidden">{project.category}</Label>
              </div>
              <p className="mt-0.5 truncate text-[13px] text-muted">{project.summary}</p>
            </div>
            <span className="shrink-0 font-mono text-xs text-subtle max-md:hidden">{project.domain}</span>
            <ArrowRight size={14} strokeWidth={1.75} aria-hidden className="shrink-0 text-subtle transition-[color,transform] group-hover:translate-x-0.5 group-hover:text-fg" />
          </li>
        );
      })}
    </ul>
  );
}

/* Whole card is clickable through the title button's stretched ::after, which
   keeps the markup valid (no block content inside a button). The lead card puts
   its preview beside the text from sm up; every other card, and the lead on a
   phone, stacks it between the tags and the footer. */
function ProjectCard({ project, lead = false }) {
  const Icon = ICONS[project.slug] || Box;
  return (
    <article
      className={`group relative flex h-full flex-col p-5 transition-colors hover:bg-surface has-[button:focus-visible]:bg-surface sm:p-6 ${
        lead ? "sm:grid sm:grid-cols-2 sm:grid-rows-[auto_1fr_auto] sm:gap-x-8 sm:[grid-template-areas:'head_shot'_'body_shot'_'foot_shot']" : ''
      }`}
    >
      <div className="flex items-start justify-between sm:[grid-area:head]">
        <span className="grid size-9 place-items-center rounded-lg border border-line bg-surface text-fg transition-colors duration-300 group-hover:border-fg group-hover:bg-fg group-hover:text-bg">
          <Icon size={16} strokeWidth={1.5} aria-hidden />
        </span>
        <Label className="tabular-nums">{project.index}</Label>
      </div>

      <div className={lead ? 'mt-10 sm:[grid-area:body]' : 'mt-8'}>
        <Label as="p">{project.category}</Label>
        <h3 className={`mt-1.5 font-semibold tracking-tight text-fg ${lead ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
          <ProjectTrigger
            slug={project.slug}
            aria-haspopup="dialog"
            className="cursor-pointer text-left after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-fg"
          >
            {project.name}
          </ProjectTrigger>
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{project.summary}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li key={tag} className={chipClass}>
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <Preview
        project={project}
        sizes="(min-width: 896px) 400px, (min-width: 640px) 45vw, calc(100vw - 72px)"
        className={`mt-6 transition-[border-color,box-shadow] duration-500 group-hover:border-fg/20 group-hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.35)] ${lead ? 'sm:mt-0 sm:self-center sm:[grid-area:shot]' : ''}`}
        imageClassName="origin-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] motion-reduce:transition-none"
      />

      <div className={`mt-auto pt-6 ${lead ? 'sm:[grid-area:foot]' : ''}`}>
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

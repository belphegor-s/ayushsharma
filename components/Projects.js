'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ExternalLink } from 'lucide-react';
import posthog from '@/lib/posthog';

const projects = [
  {
    index: '01',
    name: 'Transcoder',
    domain: 'transcode.pixly.sh',
    url: 'https://transcode.pixly.sh/',
    meta: 'Video infra',
    blurb: 'Upload a video, get back adaptive HLS from 144p to 4K with AI captions in two languages. No ffmpeg, no infra to babysit, scalable to infinity (∞).',
    stack: ['HLS', 'AI captions', 'Serverless', 'CDN'],
    accent: '#22d3ee',
  },
  {
    index: '02',
    name: 'Kudoso',
    domain: 'kudoso.io',
    url: 'https://kudoso.io/',
    meta: 'SaaS',
    blurb: 'One link collects text and video testimonials. Approve the good ones, drop them on any site with a single snippet.',
    stack: ['Testimonials', 'Video', 'Embed', 'Analytics'],
    accent: '#a78bfa',
  },
];

const rowVariant = {
  hidden: { opacity: 0, y: 18 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const ProjectRow = ({ project, i }) => {
  const { accent } = project;
  return (
    <motion.a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => posthog.capture('clicked_project', { project: project.name })}
      custom={i}
      variants={rowVariant}
      className="group relative -mx-4 block rounded-lg px-4 transition-colors duration-300 hover:bg-white/[0.025]"
    >
      {/* accent rule that draws down the card edge on hover */}
      <span aria-hidden className="absolute left-0 top-1/2 hidden h-0 w-px -translate-y-1/2 transition-all duration-300 ease-out group-hover:h-[68%] sm:block" style={{ background: accent }} />

      <div className={`grid grid-cols-1 gap-y-3 py-8 sm:grid-cols-12 sm:gap-x-6 ${i > 0 ? 'border-t border-white/10' : ''}`}>
        <div className="hidden sm:col-span-1 sm:block">
          <span className="font-mono text-sm text-white/30 transition-colors duration-300 group-hover:text-white/60">{project.index}</span>
        </div>

        <div className="sm:col-span-7">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-xs text-white/30 sm:hidden">{project.index}</span>
            <h3
              className="text-2xl font-semibold tracking-tight transition-colors duration-300 sm:text-[1.8rem]"
              style={{ color: accent }}
            >
              {project.name}
              <ExternalLink
                size={16}
                strokeWidth={2.25}
                className="ml-1.5 inline align-baseline opacity-70 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </h3>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/55">{project.blurb}</p>
        </div>

        <div className="sm:col-span-4 sm:text-right">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-white/40">{project.meta}</p>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-white/45">{project.stack.join('  ·  ')}</p>
          <p className="mt-3 font-mono text-xs text-white/30 transition-colors duration-300 group-hover:text-white/55">{project.domain}</p>
        </div>
      </div>
    </motion.a>
  );
};

const Projects = () => {
  return (
    <section id="projects" className="relative px-5 py-14">
      <motion.div initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-80px' }} transition={{ duration: 0.5, ease: 'easeOut' }} className="mb-2">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-white/45">
          <span className="font-bold text-blue-400">/</span> work
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-2xl">A couple of things I have shipped.</h2>
      </motion.div>

      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}>
        {projects.map((project, i) => (
          <ProjectRow key={project.name} project={project} i={i} />
        ))}
      </motion.div>
    </section>
  );
};

export default Projects;

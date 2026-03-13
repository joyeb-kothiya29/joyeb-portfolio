'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import { projects } from '@/config/Projects';
import SectionHeading from '@/components/common/SectionHeading';
import ArrowUpRight from '@/components/svgs/ArrowUpRight';

const CARD_IMAGE_WIDTH = 220;
const CARD_HEIGHT = 150;

export default function MasonryProjects() {
  return (
    <section id="projects" className="py-20">
      {/* Header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Featured</p>
          <SectionHeading subHeading="" heading="Projects" />
        </div>
        <span className="text-sm text-muted-foreground">
          {projects.length} projects
        </span>
      </div>

      {/* Single column list */}
      <div className="flex flex-col gap-3">
        {projects.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            index={index}
          />
        ))}
      </div>

      <div className="flex justify-center mt-16">
        <Link
          href="/contact"
          className="flex items-center gap-2 px-8 py-3 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all duration-200 group"
        >
          Let's work together
          <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
        </Link>
      </div>
    </section>
  );
}

interface CardProps {
  project: (typeof projects)[0];
  index: number;
}

function ProjectCard({ project, index }: CardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: true,
    margin: '-30px',
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={
        isInView
          ? { opacity: 1, y: 0 }
          : { opacity: 0, y: 16 }
      }
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className="group flex flex-row w-full overflow-hidden rounded-xl border border-border bg-card hover:border-border/60 transition-all duration-200"
      style={{ height: `${CARD_HEIGHT}px` }}
    >
      {/* Left: Screenshot image */}
      <div
        className="relative flex-shrink-0 overflow-hidden bg-muted border-r border-border"
        style={{ width: `${CARD_IMAGE_WIDTH}px` }}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const t = e.currentTarget as HTMLImageElement;
              t.style.display = 'none';
            }}
          />
        )}
      </div>

      {/* Right: Content */}
      <div className="flex flex-col justify-between flex-1 min-w-0 p-4">
        {/* Top: index + title + description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground leading-snug">
              {project.title}
            </h3>
            <span className="text-xs font-mono text-muted-foreground/50 flex-shrink-0 ml-2">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Bottom: tech icons + live link */}
        <div className="flex items-center justify-between border-t border-border pt-3">
          {/* Tech icons */}
          <div className="flex items-center gap-1.5">
            {project.technologies?.slice(0, 3).map((tech, i) => (
              <div
                key={i}
                title={tech.name}
                className="flex items-center justify-center w-6 h-6 rounded-md bg-muted border border-border flex-shrink-0 [&>svg]:w-3.5 [&>svg]:h-3.5 [&>img]:w-3.5 [&>img]:h-3.5"
              >
                {tech.icon}
              </div>
            ))}
          </div>

          {/* Live site link */}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150 flex-shrink-0 group/link"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
              Live Site
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover/link:translate-x-px group-hover/link:-translate-y-px transition-transform duration-150"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

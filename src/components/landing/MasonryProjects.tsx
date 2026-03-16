'use client';

import { projects } from '@/config/Projects';
import GithubIcon from '@/components/svgs/Github';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const featuredProjects = [projects[0], projects[1]].filter(
  (project): project is (typeof projects)[number] => Boolean(project),
);

export function ProjectsVerticalFeed({ mode }: { mode: 'homepage' | 'page' }) {
  const visibleProjects =
    mode === 'homepage' ? featuredProjects : projects.filter(Boolean);

  return (
    <section
      id={mode === 'homepage' ? 'projects' : undefined}
      className="flex w-full flex-col items-center py-16 md:py-24"
    >
      <div className="w-full">
        <div className="mb-10 flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm">Featured</p>
          <h2 className="text-3xl font-bold md:text-4xl">My Work</h2>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-4 md:gap-6">
          {(mode === 'homepage'
            ? visibleProjects.slice(0, 2)
            : visibleProjects
          ).map((project, index) => {
            const cardBgColor = index === 0 ? '#1a2018' : '#1a1824';
            const transition =
              index === 0 ? { duration: 0.5 } : { duration: 0.5, delay: 0.15 };

            return (
              <motion.article
                key={project.title}
                className="border-border/40 flex w-full flex-col overflow-hidden rounded-2xl border"
                style={{ backgroundColor: cardBgColor }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={transition}
                viewport={{ once: true, amount: 0.2 }}
              >
                <div className="relative h-44 w-full overflow-hidden md:h-56">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="object-cover"
                  />
                  <div
                    className="absolute bottom-0 left-0 h-10 w-full"
                    style={{
                      backgroundImage: `linear-gradient(to bottom, transparent, ${cardBgColor})`,
                    }}
                  />
                </div>

                <div className="flex w-full flex-col justify-between gap-4 p-4 md:p-5">
                  <div>
                    <p className="font-mono text-[10px] tracking-widest text-white/30">
                      {String(index + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-1 text-base font-semibold text-white md:text-lg">
                      {project.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/50 md:text-sm">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-col gap-2">
                    <div className="flex w-full items-center justify-between">
                      <div>
                        {project.link ? (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] text-white/50 transition-colors hover:text-white/80"
                          >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400/70" />
                            <span>Live Demo</span>
                            <ArrowUpRight className="h-3 w-3 text-white/50" />
                          </a>
                        ) : null}
                      </div>

                      <div>
                        {project.github ? (
                          <a
                            href={project.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] text-white/50 transition-colors hover:text-white/80"
                          >
                            <GithubIcon className="h-3.5 w-3.5 text-white/50" />
                            <span>Source Code</span>
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-1 flex items-center gap-1.5">
                      {project.technologies?.map((technology, iconIndex) => (
                        <span
                          key={`${project.title}-${technology.name}-${iconIndex}`}
                          title={technology.name}
                          className="flex h-5 w-5 items-center justify-center rounded-md bg-white/10 object-contain p-0.5 [&_img]:h-full [&_img]:w-full [&_svg]:h-full [&_svg]:w-full"
                        >
                          {technology.icon}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/projects"
            className="text-muted-foreground flex items-center gap-1 text-sm transition-colors hover:text-white"
          >
            View All Projects
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function MasonryProjects() {
  return <ProjectsVerticalFeed mode="homepage" />;
}

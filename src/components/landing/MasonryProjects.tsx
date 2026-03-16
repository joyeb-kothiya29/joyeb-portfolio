'use client';

import { projects } from '@/config/Projects';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';

const featuredProjects = [projects[0], projects[1]].filter(
  (project): project is (typeof projects)[number] => Boolean(project),
);

function getCategory(project: (typeof projects)[number]): string {
  return project.technologies.length > 1
    ? `${project.technologies[0]?.name} / ${project.technologies[1]?.name}`
    : (project.technologies[0]?.name ?? 'Web Project');
}

export function ProjectsVerticalFeed() {
  return (
    <section
      id="projects"
      className="flex w-full flex-col items-center px-4 py-16 md:py-24"
    >
      <div className="flex w-full max-w-5xl flex-col items-center rounded-3xl px-4 py-6 sm:px-6 md:py-8">
        <div className="mb-10 flex flex-col items-center gap-1 text-center">
          <p className="text-muted-foreground text-sm">Featured</p>
          <h2 className="text-3xl font-bold md:text-4xl">My Work</h2>
        </div>

        <div className="mx-auto flex w-full max-w-md flex-col gap-5">
          {featuredProjects.map((project, index) => {
            const category = getCategory(project);
            return (
              <motion.div
                key={project.title}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)] dark:bg-[#0D0D0D]"
                whileHover={{
                  y: -4,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={
                  index === 0
                    ? { duration: 0.4, delay: 0.3 }
                    : { duration: 0.4, delay: 0.4 }
                }
              >
                {/* Project number badge */}
                <div className="absolute top-3 left-3 z-10 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                  <span className="font-mono text-xs text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Image area */}
                <div className="relative h-45 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="100vw"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 p-4">
                  {/* Category tag */}
                  <div className="inline-flex w-fit items-center rounded-full bg-[#4ADE80]/10 px-3 py-1">
                    <span className="text-xs font-medium text-[#4ADE80]">
                      {category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-[#111111] dark:text-white">
                    {project.title}
                  </h3>

                  {/* Description */}
                  <p className="line-clamp-2 text-xs leading-relaxed text-black/60 dark:text-white/50">
                    {project.description}
                  </p>

                  {/* Footer Buttons */}
                  <div className="flex gap-2 pt-1">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/5 px-3 py-2.5 text-xs font-medium text-black/70 transition-all duration-200 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Site</span>
                      </a>
                    )}
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/5 px-3 py-2.5 text-xs font-medium text-black/70 transition-all duration-200 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-4 flex justify-center">
          <Link
            href="/projects"
            className="text-muted-foreground flex items-center gap-1 text-sm transition-colors hover:text-black dark:hover:text-white"
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
  return <ProjectsVerticalFeed />;
}

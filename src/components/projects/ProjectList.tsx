'use client';

import { projects } from '@/config/Projects';
import { ExternalLink, Github } from 'lucide-react';
import { motion } from 'motion/react';
import Image from 'next/image';

function getCategory(project: (typeof projects)[number]): string {
  return project.technologies.length > 1
    ? `${project.technologies[0]?.name} / ${project.technologies[1]?.name}`
    : (project.technologies[0]?.name ?? 'Web Project');
}

const projectColumns = [0, 1, 2].map((columnIndex) =>
  projects
    .map((project, index) => ({ project, index }))
    .filter(({ index }) => index % 3 === columnIndex),
);

export default function ProjectList() {
  return (
    <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
      {projectColumns.map((column, columnIndex) => (
        <div
          key={`project-column-${columnIndex + 1}`}
          className="flex h-fit w-full flex-col gap-6 rounded-3xl border border-white/10 p-4"
        >
          {column.map(({ project, index }) => {
            const category = getCategory(project);

            return (
              <motion.article
                key={project.title}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0D0D0D] transition-all duration-300 hover:-translate-y-1 hover:border-[#4ADE80]/50 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)]"
                whileHover={{
                  y: -4,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <div className="absolute top-3 left-3 z-10 rounded-md bg-black/60 px-2 py-1 backdrop-blur-sm">
                  <span className="font-mono text-xs text-white">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <div className="relative h-45 w-full overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="space-y-3 p-4">
                  <div className="inline-flex w-fit items-center rounded-full border border-[#4ADE80]/30 bg-[#4ADE80]/10 px-3 py-1">
                    <span className="text-xs font-medium text-[#4ADE80]">
                      {category}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {project.title}
                  </h3>

                  <p className="line-clamp-2 text-xs leading-relaxed text-white/50">
                    {project.description}
                  </p>

                  <div className="flex gap-2 pt-1">
                    {project.link ? (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-white/30 hover:bg-white/5 hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Site</span>
                      </a>
                    ) : null}

                    {project.github ? (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-medium text-white/70 transition-all duration-200 hover:border-white/30 hover:bg-white/5 hover:text-white"
                      >
                        <Github className="h-4 w-4" />
                        <span>GitHub</span>
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      ))}
    </div>
  );
}

'use client';

import { projects } from '@/config/Projects';
import { ExternalLink, Github } from 'lucide-react';
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

function ProjectCard({
  project,
  index,
}: {
  project: (typeof projects)[number];
  index: number;
}) {
  const category = getCategory(project);
  return (
    <article className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(74,222,128,0.1)] dark:bg-[#0D0D0D]">
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
        <div className="inline-flex w-fit items-center rounded-full bg-[#4ADE80]/10 px-3 py-1">
          <span className="text-xs font-medium text-[#4ADE80]">{category}</span>
        </div>

        <h3 className="text-base font-bold text-[#111111] dark:text-white">
          {project.title}
        </h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-black/60 dark:text-white/50">
          {project.description}
        </p>

        <div className="flex gap-2 pt-1">
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/5 px-3 py-2.5 text-xs font-medium text-black/70 transition-all duration-200 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
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
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black/5 px-3 py-2.5 text-xs font-medium text-black/70 transition-all duration-200 hover:bg-black/10 hover:text-black dark:bg-white/5 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default function ProjectList() {
  return (
    <>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:hidden">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>

      <div className="mx-auto hidden w-full max-w-6xl grid-cols-3 gap-6 px-4 md:grid">
        {projectColumns.map((column, columnIndex) => {
          // Column 1 (middle): reversed order + scrolls downward
          // Columns 0 & 2: normal order + scrolls upward
          const isMiddle = columnIndex === 1;
          const orderedColumn = isMiddle ? [...column].reverse() : column;
          const trackClass = isMiddle ? 'col-scroll-down' : 'col-scroll-up';

          return (
            <div
              key={`project-column-${columnIndex + 1}`}
              className="scroll-col relative h-[calc(100vh-9rem)] overflow-hidden rounded-3xl p-4"
            >
              <div className={`${trackClass} flex flex-col gap-6`}>
                {/* First set */}
                {orderedColumn.map(({ project, index }) => (
                  <ProjectCard
                    key={project.title}
                    project={project}
                    index={index}
                  />
                ))}
                {/* Duplicate for seamless infinite loop */}
                {orderedColumn.map(({ project, index }) => (
                  <ProjectCard
                    key={`${project.title}-dup`}
                    project={project}
                    index={index}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

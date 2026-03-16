import ProjectList from '@/components/projects/ProjectList';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects — Joyeb Kothiya',
};

export default function ProjectsPage() {
  return (
    <main className="bg-background text-foreground relative min-h-screen py-6 transition-colors">
      <ProjectList />
    </main>
  );
}

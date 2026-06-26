import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Project } from '../types';

interface ProjectsProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, isLoading, error }) => {
  return (
    <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-16">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-semibold md:text-5xl font-display"
      >
        Selected <span className="text-gradient">work</span>
      </motion.h2>

      {error && (
        <div className="mt-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400">
          Failed to load projects: {error}
        </div>
      )}

      {isLoading ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass rounded-3xl p-8 h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <motion.a
              key={project.id}
              href={project.githubUrl || project.liveUrl || '#'}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="glass group relative overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1 block"
            >
              <div className="flex items-start justify-between">
                <span className="text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400">
                  {project.technologies?.slice(0, 2).join(' · ') || 'Fullstack'}
                </span>
                <ArrowUpRight className="h-5 w-5 text-neutral-500 transition group-hover:text-slate-900 dark:group-hover:text-white" />
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-slate-900 dark:text-white">{project.title}</h3>
              <p className="mt-3 text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {project.description}
              </p>
            </motion.a>
          ))}
        </div>
      )}
    </section>
  );
};

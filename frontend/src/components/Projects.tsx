import React from 'react';
import type { Project } from '../types';
import { ExternalLink, Folder } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

interface ProjectsProps {
  projects: Project[];
  isLoading: boolean;
  error: string | null;
}

export const Projects: React.FC<ProjectsProps> = ({ projects, isLoading, error }) => {
  return (
    <section id="projects" className="py-24 border-t border-slate-800/60 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Featured Projects
          </h2>
          <div className="w-12 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-slate-400">
            A showcase of my recent work, highlighting frontend design, backend architecture, and full-stack integration.
          </p>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-slate-455">Loading projects...</p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center max-w-md mx-auto">
            Could not retrieve project data. Please verify backend connection.
          </div>
        )}

        {!isLoading && !error && projects.length === 0 && (
          <div className="text-sm text-slate-455 italic text-center py-6">
            No projects seeded in the database.
          </div>
        )}

        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="group flex flex-col bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden shadow-xl hover:border-slate-700 hover:shadow-2xl transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative aspect-video overflow-hidden bg-slate-850">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                      <Folder size={48} />
                    </div>
                  )}
                  {/* Subtle hover overlay */}
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  </div>

                  <div className="space-y-6 pt-6">
                    {/* Tech Tags */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded text-[11px] font-medium border border-slate-750"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Links */}
                    <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                      {project.githubUrl && (
                        <a 
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                        >
                          <GithubIcon />
                          <span>Code</span>
                        </a>
                      )}
                      {project.liveUrl && (
                        <a 
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors ml-auto"
                        >
                          <ExternalLink size={16} />
                          <span>Live Demo</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

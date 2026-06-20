import React from 'react';
import type { Experience } from '../types';
import { Briefcase, Calendar } from 'lucide-react';

interface ExperienceProps {
  experiences: Experience[];
  isLoading: boolean;
  error: string | null;
}

export const ExperienceComponent: React.FC<ExperienceProps> = ({ experiences, isLoading, error }) => {
  
  const formatDate = (dateVal: any) => {
    if (!dateVal) return 'Present';
    
    if (Array.isArray(dateVal)) {
      const [year, month, day] = dateVal;
      const date = new Date(Date.UTC(year, month - 1, day || 1));
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
    }

    if (typeof dateVal === 'string') {
      const date = new Date(dateVal);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });
      }
      return dateVal;
    }

    return 'Unknown';
  };

  // Sort experiences by start date descending
  const sortedExperiences = [...experiences].sort((a, b) => {
    const getYear = (val: any) => {
      if (Array.isArray(val)) return val[0];
      if (typeof val === 'string') return new Date(val).getFullYear();
      return 0;
    };
    const getMonth = (val: any) => {
      if (Array.isArray(val)) return val[1];
      if (typeof val === 'string') return new Date(val).getMonth() + 1;
      return 0;
    };
    const yearA = getYear(a.startDate);
    const yearB = getYear(b.startDate);
    if (yearA !== yearB) return yearB - yearA;
    return getMonth(b.startDate) - getMonth(a.startDate);
  });

  return (
    <section id="experience" className="py-24 border-t border-slate-800/60 bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Work Experience
          </h2>
          <div className="w-12 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-slate-400">
            A history of my professional career, milestones, and contributions.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-450">Loading experiences...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm text-center">
              Could not retrieve experience data. Please verify backend connection.
            </div>
          )}

          {!isLoading && !error && sortedExperiences.length === 0 && (
            <div className="text-sm text-slate-450 italic text-center py-6">
              No experiences seeded in the database.
            </div>
          )}

          {!isLoading && !error && sortedExperiences.length > 0 && (
            <div className="relative border-l border-slate-800 ml-4 md:ml-6 space-y-12">
              {sortedExperiences.map((exp, index) => (
                <div key={exp.id || index} className="relative pl-8 md:pl-10 group">
                  {/* Timeline Dot Icon */}
                  <div className="absolute -left-[17px] top-1.5 p-1 bg-slate-900 border-2 border-indigo-500 text-indigo-400 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Briefcase size={16} />
                  </div>

                  {/* Main Card */}
                  <div className="p-6 bg-slate-900/40 border border-slate-800 hover:border-slate-700/80 rounded-xl transition-all shadow-lg backdrop-blur-sm">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">
                          {exp.role}
                        </h3>
                        <span className="text-sm font-semibold text-slate-400">
                          {exp.company}
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 text-slate-355 rounded-full text-xs border border-slate-750 max-w-fit">
                        <Calendar size={12} />
                        <span>
                          {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

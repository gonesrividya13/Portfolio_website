import React from 'react';
import type { Skill } from '../types';
import { Layers, Cpu, Database, Wrench, Sparkles } from 'lucide-react';

interface AboutProps {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

export const About: React.FC<AboutProps> = ({ skills, isLoading, error }) => {
  // Group skills by category
  const categories = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'frontend':
        return <Layers className="text-cyan-400" size={20} />;
      case 'backend':
        return <Cpu className="text-indigo-400" size={20} />;
      case 'database':
        return <Database className="text-purple-400" size={20} />;
      case 'tool':
      case 'tools':
        return <Wrench className="text-amber-400" size={20} />;
      default:
        return <Sparkles className="text-pink-400" size={20} />;
    }
  };

  const getProficiencyStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'advanced':
      case 'expert':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      case 'intermediate':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-750';
    }
  };

  return (
    <section id="about" className="py-24 border-t border-slate-800/60 bg-slate-900/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About & Skills
          </h2>
          <div className="w-12 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
          <p className="mt-4 text-slate-400">
            A developer who loves crafting robust architecture, clean code, and delightful user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Bio on the Left */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              My Journey
            </h3>
            <p className="text-slate-300 leading-relaxed">
              I am a software engineer with experience building both frontend layouts and backend APIs. My focus lies in designing systems that are scalable, maintainable, and user-centric. 
            </p>
            <p className="text-slate-350 leading-relaxed text-sm">
              I enjoy solving complex problems and collaborating with teams to build digital products. From database performance tuning to crafting accessible React components, I aim to bridge the gap between design and implementation.
            </p>
            <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-lg">
              <span className="text-xs text-indigo-400 font-mono block mb-1">Philosophy</span>
              <p className="text-xs text-slate-400 italic">
                "Simplicity is the soul of efficiency. The best systems are those that solve problems with minimal friction."
              </p>
            </div>
          </div>

          {/* Skills on the Right */}
          <div className="lg:col-span-7 space-y-8">
            <h3 className="text-xl font-bold text-white">
              Technical Stack
            </h3>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-slate-450">Loading skills data...</p>
              </div>
            )}

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-sm">
                Could not retrieve skills data. Please verify backend connection.
              </div>
            )}

            {!isLoading && !error && Object.keys(categories).length === 0 && (
              <div className="text-sm text-slate-450 italic py-6">
                No skills seeded in the database.
              </div>
            )}

            {!isLoading && !error && Object.keys(categories).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(categories).map(([category, skillList]) => (
                  <div 
                    key={category} 
                    className="p-5 bg-slate-900/50 border border-slate-800/80 rounded-xl hover:border-slate-700/80 transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-800/60">
                      {getCategoryIcon(category)}
                      <span className="font-bold text-white text-base tracking-wide">
                        {category}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {skillList.map((skill) => (
                        <div 
                          key={skill.id}
                          className={`flex items-center gap-1.5 px-3 py-1 border rounded-full text-xs font-medium transition-all hover:scale-102 cursor-default ${
                            getProficiencyStyle(skill.proficiencyLevel)
                          }`}
                        >
                          <span>{skill.name}</span>
                          <span className="text-[10px] opacity-75 font-normal">
                            ({skill.proficiencyLevel})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

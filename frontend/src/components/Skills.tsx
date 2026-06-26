import React from 'react';
import { motion } from 'framer-motion';
import type { Skill } from '../types';

interface SkillsProps {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
}

export const Skills: React.FC<SkillsProps> = ({ skills, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-48 items-center justify-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <div className="w-full">
      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-semibold md:text-5xl font-display mb-12"
      >
        My <span className="text-gradient">Skills</span>
      </motion.h2>

      <div className="space-y-12">
        {categories.map((category, catIdx) => (
          <motion.div 
            key={category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: catIdx * 0.1 }}
          >
            <h3 className="mb-6 text-xl font-medium text-slate-900 dark:text-white border-b border-black/10 dark:border-white/10 pb-2">
              {category}
            </h3>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {skills
                .filter(s => s.category === category)
                .map((skill, idx) => (
                  <motion.div
                    key={skill._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: (catIdx * 0.1) + (idx * 0.05) }}
                    className="group flex items-center space-x-3 rounded-xl bg-white/40 dark:bg-black/40 p-4 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-xl text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      {skill.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">{skill.name}</h4>
                      <p className="text-sm text-neutral-500 dark:text-neutral-400">{skill.proficiency}</p>
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

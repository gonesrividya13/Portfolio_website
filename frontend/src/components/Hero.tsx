import React from 'react';
import { motion } from 'framer-motion';

export const Hero: React.FC = () => {
  const handleScrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offsetTop = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section id="home" className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center px-6">
      <div className="max-w-2xl">
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-neutral-600 dark:text-neutral-400"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Available for work
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl font-display"
        >
          I build <span className="text-gradient">immersive</span><br/> digital experiences.
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-6 max-w-lg text-lg text-neutral-600 dark:text-neutral-400"
        >
          Creative developer & AI engineer crafting the intersection of 3D, motion, and intelligent interfaces. Curious about me? Just ask my AI twin.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <button
            onClick={() => handleScrollTo('#interview')}
            className="glow rounded-full bg-slate-900 dark:bg-white px-7 py-3 font-medium text-white dark:text-black transition hover:opacity-90 cursor-pointer"
          >
            Start live interview
          </button>
          <button
            onClick={() => handleScrollTo('#projects')}
            className="rounded-full border border-black/10 dark:border-white/10 px-7 py-3 font-medium transition hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
          >
            View my work
          </button>
        </motion.div>
      </div>
    </section>
  );
};

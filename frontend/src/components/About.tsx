import React from 'react';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
      <div className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-24">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative h-[400px] overflow-hidden rounded-4xl md:h-auto glass p-2"
        >
          {/* Placeholder for the user's image */}
          <div className="w-full h-full rounded-[30px] overflow-hidden bg-white/10 dark:bg-black/20 backdrop-blur-md border border-black/5 dark:border-white/10 relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent dark:from-black/10 opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop" 
              alt="Portrait" 
              className="w-full h-full object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700 hover:scale-105"
            />
          </div>
        </motion.div>
        
        <div className="flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold md:text-5xl font-display"
          >
            The <span className="text-gradient">person</span> behind the code
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 space-y-6 text-lg text-neutral-600 dark:text-neutral-400"
          >
            <p>
              I'm a passionate developer focused on crafting immersive digital experiences. With a background in both creative design and software engineering, I bridge the gap between aesthetics and performance.
            </p>
            <p>
              My approach combines cutting-edge web technologies like WebGL and React with minimalist design principles to create interfaces that feel alive.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3"
          >
            <div>
              <p className="text-4xl font-semibold text-slate-900 dark:text-white">5+</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Years experience</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-slate-900 dark:text-white">50+</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Projects shipped</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-slate-900 dark:text-white">100%</p>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">Client satisfaction</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

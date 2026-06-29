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
              src="/srividya-portrait.jpg" 
              alt="Portrait of Srividya" 
              className="w-full h-full object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700 hover:scale-105"
            />
          </div>
        </motion.div>
        
        <div className="flex flex-col justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-semibold md:text-5xl font-display text-black dark:text-white"
          >
            The <span className="text-gradient">person</span> behind the code
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-8 space-y-6 text-lg text-black dark:text-white"
          >
            <p>
              I'm a Software Developer with around 4 years of experience building distributed backend systems. I specialize in Java, Spring Boot, and architecting scalable event-driven platforms.
            </p>
            <p>
              My expertise spans across mobility, finance, and healthcare platforms, delivering stable, production-ready systems that efficiently handle high-volume, real-time workloads.
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
              <p className="text-4xl font-semibold text-black dark:text-white">4</p>
              <p className="mt-2 text-sm text-black dark:text-white">Years experience</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-black dark:text-white">400K+</p>
              <p className="mt-2 text-sm text-black dark:text-white">Daily events processed</p>
            </div>
            <div>
              <p className="text-4xl font-semibold text-black dark:text-white">100K+</p>
              <p className="mt-2 text-sm text-black dark:text-white">Daily API requests</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

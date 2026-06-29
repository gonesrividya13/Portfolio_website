import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLiveGuide } from '../context/LiveGuideContext';

export const Hero: React.FC = () => {
  const { connect, isConnected, sendMessage } = useLiveGuide();
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["scalable", "event-driven", "high-volume", "large-scale", "reliable"];

  const heroRef = useRef<HTMLElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const parent = heroRef.current?.closest('.overflow-y-auto');
    const handleScroll = (e: Event) => {
      setScrollY((e.target as HTMLElement).scrollTop);
    };
    if (parent) {
      parent.addEventListener('scroll', handleScroll);
      return () => parent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words.length]);

  const scale = Math.max(0.6, 1 - scrollY / 400);
  const opacity = Math.max(0, 1 - scrollY / 300);

  const handleStartInterview = async () => {
    if (!isConnected) {
      try {
        await connect();
      } catch (e) {
        console.error("Failed to connect", e);
        return;
      }
    }
    sendMessage("[SYSTEM EVENT: The user has pressed 'Start live interview'. Start acting as Vidya in an interview setting, and enthusiastically ask the user what they would like to know about your background, experience, or skills!]");
  };

  return (
    <section ref={heroRef} id="home" className="sticky top-0 z-0 mx-auto flex min-h-[85vh] max-w-6xl items-center px-6">
      <motion.div 
        className="max-w-2xl w-full"
        style={{ scale, opacity, transformOrigin: 'left center' }}
      >
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8 }}
          className="inline-flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 px-4 py-1.5 text-xs uppercase tracking-widest text-black dark:text-white"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Available for work
        </motion.span>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="mt-6 text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl font-display text-black dark:text-white"
        >
          I build <br className="md:hidden" />
          <div className="inline-grid relative whitespace-nowrap">
            {/* Invisible placeholder of the longest word to hold width and prevent layout shift */}
            <span className="invisible col-start-1 row-start-1">event-driven</span>
            <AnimatePresence>
              <motion.span
                key={words[wordIndex]}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-gradient col-start-1 row-start-1 text-left"
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
          <br/> systems.
        </motion.h1>
        

        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <button
            onClick={handleStartInterview}
            className="glow rounded-full bg-slate-900 dark:bg-white px-7 py-3 font-medium text-white dark:text-black transition hover:opacity-90 cursor-pointer"
          >
            Start live interview
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
};

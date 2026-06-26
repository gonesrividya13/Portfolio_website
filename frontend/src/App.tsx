import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Hero } from './components/Hero';
import { AgentInterview } from './components/AgentInterview';
import { About } from './components/About';
import { ExperienceComponent } from './components/Experience';
import { Projects } from './components/Projects';
import { getProjects, getSkills, getExperiences } from './services/api';
import type { Project, Skill, Experience } from './types';
import { Scroll3DCanvas } from './components/Scroll3DCanvas';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

import { ScrollCard } from './components/ScrollCard';
import { Skills } from './components/Skills';

function App() {
  const distance = useInfiniteScroll();
  
  // Recreate the Day/Night color cycle
  const motionDistance = useMotionValue(0);
  const backgroundColor = useTransform(
    motionDistance,
    [0, 0.25, 0.5, 0.75, 1],
    ['#e0f2fe', '#fecdd3', '#1e1b4b', '#020617', '#e0f2fe'] // Day -> Sunset -> Night -> Sunrise -> Day
  );

  useEffect(() => {
    // 1.0 is a full cycle (syncs with CutePlanet.tsx)
    const cycle = (distance * 0.5) % 1.0;
    const normalizedCycle = cycle < 0 ? 1.0 + cycle : cycle;
    motionDistance.set(normalizedCycle);

    // Toggle Tailwind dark mode based on time of day
    if (normalizedCycle > 0.20 && normalizedCycle < 0.80) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [distance, motionDistance]);

  // Total length of the scrolling timeline before it loops back to the Intro
  const LOOP_LENGTH = 10.0;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState({ projects: true, skills: true, experiences: true });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projData, skillData, expData] = await Promise.all([
          getProjects(), getSkills(), getExperiences()
        ]);
        setProjects(projData);
        setSkills(skillData);
        setExperiences(expData);
      } catch (err) {
        console.error('API Error:', err);
      } finally {
        setLoading({ projects: false, skills: false, experiences: false });
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div 
      style={{ backgroundColor }}
      className="fixed inset-0 overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-indigo-600/30 dark:selection:bg-white/20 selection:text-indigo-900 dark:selection:text-white"
    >
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Scroll3DCanvas />
      </div>

      {/* Foreground Continuous Scrolling Track */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        
        {/* Card 1: Intro (Left) */}
        <ScrollCard distance={distance} centerDistance={0} loopLength={LOOP_LENGTH} align="left">
          <Hero />
          <div className="mt-8">
            <About />
          </div>
        </ScrollCard>

        {/* Card 2: Experience (Right) */}
        <ScrollCard distance={distance} centerDistance={2} loopLength={LOOP_LENGTH} align="right">
          <ExperienceComponent experiences={experiences} isLoading={loading.experiences} error={null} />
        </ScrollCard>

        {/* Card 3: Projects (Left) */}
        <ScrollCard distance={distance} centerDistance={4} loopLength={LOOP_LENGTH} align="left">
          <Projects projects={projects} isLoading={loading.projects} error={null} />
        </ScrollCard>

        {/* Card 4: Skills (Right) */}
        <ScrollCard distance={distance} centerDistance={6} loopLength={LOOP_LENGTH} align="right">
          <Skills skills={skills} isLoading={loading.skills} error={null} />
        </ScrollCard>

        {/* Card 5: AI Agent Interview (Center) */}
        <ScrollCard distance={distance} centerDistance={8} loopLength={LOOP_LENGTH} align="center">
          <AgentInterview />
        </ScrollCard>

      </div>
    </motion.div>
  );
}

export default App;

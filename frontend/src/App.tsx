import { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Hero } from './components/Hero';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { ExperienceComponent } from './components/Experience';
import { Projects } from './components/Projects';
import { getProjects, getSkills, getExperiences } from './services/api';
import type { Project, Skill, Experience } from './types';
import { Scroll3DCanvas } from './components/Scroll3DCanvas';
import { useInfiniteScroll } from './hooks/useInfiniteScroll';

import { ScrollCard } from './components/ScrollCard';
import { Skills } from './components/Skills';
import { useLiveGuide } from './context/LiveGuideContext';
import { LiveTourButton } from './components/LiveTourButton';
import { useRef } from 'react';

function App() {
  const { sendMessage, connect, hasSpokenOnce, isUserSpeaking } = useLiveGuide();
  const [isPlayClicked, setIsPlayClicked] = useState(false);
  const [isUIHidden, setIsUIHidden] = useState(false);
  
  const [isStartedWithoutAudio, setIsStartedWithoutAudio] = useState(false);
  
  // The actual scroll distance and UI cards freeze until the AI has spoken its first message
  const hasStarted = hasSpokenOnce || isStartedWithoutAudio;
  const distance = useInfiniteScroll(hasStarted);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetIdleTimer = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      sendMessage("[SYSTEM EVENT: The user has been lingering at this part of the tour for a while without scrolling to the next area. Gently nudge them to continue scrolling when they are ready.]");
    }, 30000); // 30 seconds
  };

  const startJourney = async () => {
    setIsPlayClicked(true);
    try {
      await connect();
    } catch (e) {
      console.error("Failed to connect to agent", e);
      setIsPlayClicked(false);
    }
    resetIdleTimer();
  };
  
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

  const lastTelemetryRef = useRef<number>(-1);
  const prevUserSpeakingRef = useRef<boolean>(false);

  useEffect(() => {
    if (!hasStarted) return;
    
    const round = Math.floor(distance / 10) + 1;
    const telemetryInterval = Math.floor(distance);
    
    let shouldSendTelemetry = false;

    if (round < 3) {
      // Round 1 & 2: Send telemetry every 1.0 distance
      if (telemetryInterval !== lastTelemetryRef.current) {
        lastTelemetryRef.current = telemetryInterval;
        shouldSendTelemetry = true;
      }
    } else {
      // Round 3+: Send telemetry only when the user STOPS speaking
      if (!isUserSpeaking && prevUserSpeakingRef.current) {
        shouldSendTelemetry = true;
      }
    }

    prevUserSpeakingRef.current = isUserSpeaking;

    if (shouldSendTelemetry) {
      // Calculate active Portfolio Section
      const normalizedDistance = ((distance % LOOP_LENGTH) + LOOP_LENGTH) % LOOP_LENGTH;
      let sectionIndex = Math.round(normalizedDistance / 2) % 5;
      if (sectionIndex === 5) sectionIndex = 0;
      const sectionNames = ["Intro", "Experience", "Projects", "Skills", "Reach Me Out"];
      const currentSection = sectionNames[sectionIndex];

      // Calculate Globe Angle (0.0 to 1.0)
      const cycle = (distance * 0.5) % 1.0;
      const fracDist = cycle < 0 ? 1.0 + cycle : cycle;
      
      // Calculate Globe Rotation (1 to 5 per Round)
      const rotation = Math.floor((distance % LOOP_LENGTH) / 2) + 1;

      const message = `[TELEMETRY] Round: ${round} | Globe Rotation: ${rotation} | Round Distance: ${normalizedDistance.toFixed(2)} | Portfolio Section: ${currentSection} | Globe Angle: ${fracDist.toFixed(2)}`;
      
      const isPassive = round >= 3;
      sendMessage(message, !isPassive);
      resetIdleTimer();
    }
  }, [distance, isUserSpeaking, sendMessage, hasStarted]);
  
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
      <LiveTourButton />

      {/* Toggle UI Button */}
      {hasStarted && (
        <button
          onClick={() => setIsUIHidden(!isUIHidden)}
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center p-3 bg-white/10 dark:bg-black/40 backdrop-blur-md rounded-full shadow-lg border border-white/20 hover:bg-white/20 transition-all group"
          title={isUIHidden ? "Show Portfolio Cards" : "Hide Portfolio Cards"}
        >
          {isUIHidden ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
              <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
              <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
              <line x1="2" x2="22" y1="2" y2="22" />
            </svg>
          )}
        </button>
      )}

      {/* Welcome Overlay */}
      {!hasStarted && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/10 dark:bg-black/20 backdrop-blur-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-10 rounded-3xl bg-white/5 dark:bg-black/40 border border-white/10 shadow-2xl max-w-xl text-center"
          >
            <h1 className="text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              Welcome to My World
            </h1>
            <p className="text-lg mb-8 text-slate-700 dark:text-slate-200">
              For the best experience, interact with my live persona along the journey. Turn on your microphone to chat with me!
            </p>
            {!isPlayClicked ? (
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={startJourney}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30 cursor-pointer"
                >
                  Start With Audio
                </button>
                <button
                  onClick={() => setIsStartedWithoutAudio(true)}
                  className="px-8 py-4 bg-slate-700/50 hover:bg-slate-600/50 text-white rounded-full font-bold text-lg transition-transform hover:scale-105 active:scale-95 shadow-lg shadow-slate-900/30 cursor-pointer border border-white/10"
                >
                  Start Without Audio
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-indigo-400 font-medium">Waking up Vidya... Please wait</p>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Scroll3DCanvas />
      </div>

      {/* Foreground Continuous Scrolling Track */}
      <div className={`absolute inset-0 pointer-events-none z-10 overflow-hidden transition-opacity duration-500 ${isUIHidden ? 'opacity-0' : 'opacity-100'}`}>
        
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

        {/* Card 5: Reach Me Out (Center) */}
        <ScrollCard distance={distance} centerDistance={8} loopLength={LOOP_LENGTH} align="center">
          <Contact />
        </ScrollCard>

      </div>
    </motion.div>
  );
}

export default App;

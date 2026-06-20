import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ChatRoom } from './components/ChatRoom';
import { About } from './components/About';
import { ExperienceComponent } from './components/Experience';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { getProjects, getSkills, getExperiences } from './services/api';
import type { Project, Skill, Experience } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);

  const [loading, setLoading] = useState({ projects: true, skills: true, experiences: true });
  const [errors, setErrors] = useState<{ projects: string | null; skills: string | null; experiences: string | null }>({
    projects: null,
    skills: null,
    experiences: null,
  });

  // Fetch all backend data
  useEffect(() => {
    const fetchData = async () => {
      // Fetch projects
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setErrors((prev) => ({ ...prev, projects: err.message || 'Error fetching projects' }));
      } finally {
        setLoading((prev) => ({ ...prev, projects: false }));
      }

      // Fetch skills
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (err: any) {
        console.error('Error fetching skills:', err);
        setErrors((prev) => ({ ...prev, skills: err.message || 'Error fetching skills' }));
      } finally {
        setLoading((prev) => ({ ...prev, skills: false }));
      }

      // Fetch experiences
      try {
        const data = await getExperiences();
        setExperiences(data);
      } catch (err: any) {
        console.error('Error fetching experiences:', err);
        setErrors((prev) => ({ ...prev, experiences: err.message || 'Error fetching experiences' }));
      } finally {
        setLoading((prev) => ({ ...prev, experiences: false }));
      }
    };

    fetchData();
  }, []);

  // IntersectionObserver to set active section
  useEffect(() => {
    const sections = ['home', 'ai-room', 'about', 'experience', 'projects', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -50% 0px', // Trigger when section occupies the middle of the viewport
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-600/30 selection:text-indigo-200 antialiased scroll-smooth">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none"></div>

      <Navbar activeSection={activeSection} />
      
      <main className="relative">
        <Hero />
        <ChatRoom />
        
        <About 
          skills={skills} 
          isLoading={loading.skills} 
          error={errors.skills} 
        />
        
        <ExperienceComponent 
          experiences={experiences} 
          isLoading={loading.experiences} 
          error={errors.experiences} 
        />
        
        <Projects 
          projects={projects} 
          isLoading={loading.projects} 
          error={errors.projects} 
        />
        
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;

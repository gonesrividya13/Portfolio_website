import React from 'react';
import { Mail, ArrowRight, Terminal } from 'lucide-react';

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

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
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main text container */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-sm font-medium w-fit">
              <Terminal size={16} />
              <span>Available for Hire</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              Building Robust <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Full-Stack Applications
              </span>
            </h1>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              Hi, I'm a passionate Software Engineer specializing in crafting performant backend APIs with Spring Boot and designing sleek, user-friendly frontends in React.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => handleScrollTo('#projects')}
                className="group flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
              >
                View My Work
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleScrollTo('#contact')}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium rounded-lg border border-slate-700 transition-all cursor-pointer"
              >
                Get In Touch
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-5 pt-6 border-t border-slate-800/80 w-fit">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 border border-slate-700 rounded-lg transition-all"
                aria-label="GitHub Profile"
              >
                <GithubIcon />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="p-2.5 bg-slate-800 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 border border-slate-700 rounded-lg transition-all"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon />
              </a>
              <a
                href="mailto:developer@example.com"
                className="p-2.5 bg-slate-800 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 border border-slate-700 rounded-lg transition-all"
                aria-label="Email Me"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Interactive terminal decoration on the right */}
          <div className="lg:col-span-5 relative">
            <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl shadow-2xl overflow-hidden backdrop-blur-sm">
              {/* Header / Window Controls */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/60">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                </div>
                <span className="text-xs text-slate-500 font-mono select-none">bash</span>
                <div className="w-8"></div>
              </div>
              {/* Terminal Body */}
              <div className="p-6 font-mono text-sm space-y-4 text-slate-300">
                <div>
                  <span className="text-emerald-400">guest@portfolio:~$</span> <span className="text-slate-100">cat developer.json</span>
                </div>
                <div className="text-indigo-400 pl-4">
                  {`{`}
                  <div className="pl-4 text-slate-300">
                    <span className="text-cyan-400">"name"</span>: <span className="text-amber-300">"Developer"</span>,
                    <br />
                    <span className="text-cyan-400">"role"</span>: <span className="text-amber-300">"Full Stack Engineer"</span>,
                    <br />
                    <span className="text-cyan-400">"location"</span>: <span className="text-amber-300">"San Francisco, CA"</span>,
                    <br />
                    <span className="text-cyan-400">"skills"</span>: <span className="text-amber-300">["Java", "Spring Boot", "React", "Docker"]</span>
                  </div>
                  {`}`}
                </div>
                <div>
                  <span className="text-emerald-400">guest@portfolio:~$</span> <span className="text-slate-100">npm start</span>
                </div>
                <div className="text-slate-400 pl-4 text-xs">
                  &gt; dev-portfolio@1.0.0 start
                  <br />
                  &gt; vite
                  <br />
                  <span className="text-emerald-400">✓ App ready at http://localhost:5173</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">guest@portfolio:~$</span>
                  <span className="w-2.5 h-4 bg-slate-400 animate-pulse inline-block"></span>
                </div>
              </div>
            </div>
            {/* Absolute positioning element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

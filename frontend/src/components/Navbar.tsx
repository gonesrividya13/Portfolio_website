import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { scrollStore } from '../store';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [distance, setDistance] = useState(scrollStore.getDistance());

  useEffect(() => {
    const unsubscribe = scrollStore.subscribe(setDistance);
    return () => { unsubscribe(); };
  }, []);

  const navLinks = [
    { name: 'Home', targetDistance: 0 },
    { name: 'Experience', targetDistance: 2 },
    { name: 'Projects', targetDistance: 4 },
    { name: 'Skills', targetDistance: 6 },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetDistance: number) => {
    e.preventDefault();
    setIsOpen(false);
    scrollStore.scrollToDistance(targetDistance);
  };

  // Determine active section based on current distance
  let currentMod = distance % 10;
  if (currentMod < 0) currentMod += 10;
  
  // Find closest link
  let activeDistance = 0;
  let minDiff = 100;
  
  const allLinks = [...navLinks, { name: 'Contact', targetDistance: 8 }];
  for (const link of allLinks) {
    let diff = Math.abs(link.targetDistance - currentMod);
    if (diff > 5) diff = 10 - diff; // handle wrap around
    if (diff < minDiff) {
      minDiff = diff;
      activeDistance = link.targetDistance;
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 glass shadow-lg border-b-0 border-black/10 dark:border-white/10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => handleLinkClick(e as any, 0)}>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white font-display">
              V<span className="text-neutral-500">.</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeDistance === link.targetDistance;
              return (
                <a
                  key={link.name}
                  href={`#${link.name.toLowerCase()}`}
                  onClick={(e) => handleLinkClick(e, link.targetDistance)}
                  className={`text-sm font-medium transition-colors hover:text-slate-900 dark:hover:text-white ${
                    isActive ? 'text-slate-900 dark:text-white border-b-2 border-indigo-500 pb-1' : 'text-neutral-600 dark:text-neutral-400'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <a
              href="#contact"
              onClick={(e) => handleLinkClick(e, 8)}
              className={`px-4 py-1.5 rounded-full border ${activeDistance === 8 ? 'border-indigo-500 text-indigo-500' : 'border-black/10 dark:border-white/10 text-slate-900 dark:text-white'} font-medium text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
            >
              Contact
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={`md:hidden absolute top-[100%] left-0 right-0 glass transition-all duration-300 ease-in-out border-t border-black/10 dark:border-white/10 ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible pointer-events-none'
      }`}>
        <div className="px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const isActive = activeDistance === link.targetDistance;
            return (
              <a
                key={link.name}
                href={`#${link.name.toLowerCase()}`}
                onClick={(e) => handleLinkClick(e, link.targetDistance)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                  isActive 
                    ? 'bg-black/10 dark:bg-white/10 text-slate-900 dark:text-white border-l-2 border-indigo-500' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            );
          })}
          <a
            href="#contact"
            onClick={(e) => handleLinkClick(e, 8)}
            className={`block text-center px-4 py-3 border ${activeDistance === 8 ? 'border-indigo-500 text-indigo-500' : 'border-black/10 dark:border-white/10 text-slate-900 dark:text-white'} rounded-full font-medium text-base hover:bg-black/5 dark:hover:bg-white/5 transition-colors`}
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

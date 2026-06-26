import React from 'react';
import { Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand/Logo */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-600 dark:text-indigo-400 rounded-md">
              <Code2 size={16} />
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300 tracking-wider text-sm">
              DEVPORTFOLIO
            </span>
          </div>

          {/* Copyright / Tech Info */}
          <div className="text-center md:text-right space-y-1">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              &copy; {currentYear} Developer Portfolio. All rights reserved.
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-600 font-mono">
              Powered by Spring Boot, React, TypeScript, and Tailwind CSS.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

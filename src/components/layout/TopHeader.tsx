'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon, GraduationCap } from 'lucide-react';

export function TopHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-700 flex items-center justify-center text-white shadow-xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 dark:text-white tracking-tight">
              Nursing Study AI
            </span>
          </div>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="تبديل الوضع الليلي"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>
      </div>
    </header>
  );
}

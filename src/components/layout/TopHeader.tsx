'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Sun, Moon, GraduationCap, Sparkles, BookOpen } from 'lucide-react';

export function TopHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-700 to-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                Nursing Study AI
              </span>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5" />
                طبي
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              المنصة الذكية لطلاب التمريض في مصر
            </p>
          </div>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Quick study CTA for desktop */}
          <Link
            href="/lectures/lecture_shock_001"
            className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-sky-50 text-sky-800 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 dark:hover:bg-sky-900/50 border border-sky-200 dark:border-sky-800 transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span>محاضرة تجريبية: الصدمات</span>
          </Link>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="تبديل الوضع الليلي"
            className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-all"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
    </header>
  );
}

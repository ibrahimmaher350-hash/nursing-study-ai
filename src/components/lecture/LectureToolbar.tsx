'use client';

import React from 'react';
import { Search, ZoomIn, ZoomOut, BookOpen, Printer, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LectureToolbarProps {
  fontSizeDelta: number;
  onIncreaseFontSize: () => void;
  onDecreaseFontSize: () => void;
  isReadingMode: boolean;
  onToggleReadingMode: () => void;
  onOpenSearch: () => void;
  className?: string;
}

export function LectureToolbar({
  fontSizeDelta,
  onIncreaseFontSize,
  onDecreaseFontSize,
  isReadingMode,
  onToggleReadingMode,
  onOpenSearch,
  className,
}: LectureToolbarProps) {
  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className={cn(
        'print:hidden flex items-center justify-between gap-2 p-2 px-3 rounded-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-xs text-xs select-none',
        className
      )}
    >
      {/* Left / Search & Font Size */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
          title="بحث داخل المحاضرة"
        >
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">بحث</span>
        </button>

        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

        {/* Font Size A- / A+ */}
        <div className="flex items-center gap-0.5 bg-slate-50 dark:bg-slate-800/60 p-0.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={onDecreaseFontSize}
            disabled={fontSizeDelta <= -2}
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="تصغير حجم الخط (A-)"
          >
            A-
          </button>
          <span className="text-[11px] font-mono px-1 font-semibold text-slate-400">
            {fontSizeDelta > 0 ? `+${fontSizeDelta}` : fontSizeDelta}
          </span>
          <button
            onClick={onIncreaseFontSize}
            disabled={fontSizeDelta >= 4}
            className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="تكبير حجم الخط (A+)"
          >
            A+
          </button>
        </div>
      </div>

      {/* Right / Reading Mode & Print */}
      <div className="flex items-center gap-1.5">
        {/* Reading Mode Button (Rule 21) */}
        <button
          onClick={onToggleReadingMode}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all',
            isReadingMode
              ? 'bg-sky-700 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
          )}
          title="وضع القراءة الهادئ (تكبير مساحة المستند)"
        >
          {isReadingMode ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>إنهاء القراءة</span>
            </>
          ) : (
            <>
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>وضع القراءة</span>
            </>
          )}
        </button>

        {/* Print / PDF Button (Rule 40) */}
        <button
          onClick={handlePrint}
          className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold"
          title="طباعة أو تصدير كملف PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>طباعة / PDF</span>
        </button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { ChevronRight, ChevronLeft, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SlideProgressBarProps {
  currentSlide: number;
  totalSlides: number;
  onSelectSlide: (slideNumber: number) => void;
}

export function SlideProgressBar({
  currentSlide,
  totalSlides,
  onSelectSlide,
}: SlideProgressBarProps) {
  const progressPercent = Math.round((currentSlide / totalSlides) * 100);

  return (
    <div className="sticky bottom-16 md:bottom-4 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-lg flex items-center justify-between gap-3">
      {/* Previous Button */}
      <button
        onClick={() => onSelectSlide(Math.max(1, currentSlide - 1))}
        disabled={currentSlide <= 1}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all',
          currentSlide <= 1
            ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
            : 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60'
        )}
      >
        <ChevronRight className="w-4 h-4" />
        <span>السابق</span>
      </button>

      {/* Slide Navigator Center */}
      <div className="flex flex-col items-center flex-1 max-w-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-inter">
            الشريحة {currentSlide} من {totalSlides} ({progressPercent}%)
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-sky-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={() => onSelectSlide(Math.min(totalSlides, currentSlide + 1))}
        disabled={currentSlide >= totalSlides}
        className={cn(
          'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all',
          currentSlide >= totalSlides
            ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
            : 'bg-sky-700 text-white hover:bg-sky-800 shadow-sm'
        )}
      >
        <span>التالي</span>
        <ChevronLeft className="w-4 h-4" />
      </button>
    </div>
  );
}

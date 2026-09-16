'use client';

import React from 'react';
import { Slide } from '@/types';
import { cn } from '@/lib/utils';
import { List, CheckCircle2 } from 'lucide-react';

interface DesktopSlideSidebarProps {
  slides: Slide[];
  activeSlideNumber: number;
  onSelectSlide: (slideNumber: number) => void;
  className?: string;
}

export function DesktopSlideSidebar({
  slides,
  activeSlideNumber,
  onSelectSlide,
  className,
}: DesktopSlideSidebarProps) {
  return (
    <aside
      className={cn(
        'print:hidden hidden lg:block w-56 xl:w-64 shrink-0 select-none text-right',
        className
      )}
    >
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto space-y-3 p-3 rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <List className="w-3.5 h-3.5 text-sky-600" />
            <span>فهرس المحاضرة</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {slides.length} شرائح
          </span>
        </div>

        <nav className="space-y-1">
          {slides.map((slide) => {
            const isActive = slide.slideNumber === activeSlideNumber;

            return (
              <button
                key={slide.id || slide.slideNumber}
                onClick={() => onSelectSlide(slide.slideNumber)}
                className={cn(
                  'w-full text-right p-2.5 rounded-2xl text-xs transition-all flex items-start gap-2 group',
                  isActive
                    ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold border border-sky-200/80 dark:border-sky-900/60 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <span
                  className={cn(
                    'font-mono text-[10px] px-1.5 py-0.5 rounded-md shrink-0 mt-0.5',
                    isActive
                      ? 'bg-sky-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-200'
                  )}
                >
                  {slide.slideNumber}
                </span>

                <span className="line-clamp-2 leading-relaxed flex-1">
                  {slide.title}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

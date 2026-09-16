'use client';

import React, { useState, useMemo } from 'react';
import { Slide } from '@/types';
import { Search, X, ChevronLeft, BookOpen } from 'lucide-react';

interface LectureSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  onSelectSlide: (slideNumber: number) => void;
}

export function LectureSearchModal({
  isOpen,
  onClose,
  slides,
  onSelectSlide,
}: LectureSearchModalProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const matches: {
      slideNumber: number;
      slideTitle: string;
      matchType: string;
      snippet: string;
    }[] = [];

    for (const slide of slides) {
      let matched = false;

      // Check title
      if (slide.title.toLowerCase().includes(q)) {
        matches.push({
          slideNumber: slide.slideNumber,
          slideTitle: slide.title,
          matchType: 'عنوان الشريحة',
          snippet: slide.title,
        });
        matched = true;
      }

      // Check original English
      if (slide.originalEnglish.toLowerCase().includes(q)) {
        matches.push({
          slideNumber: slide.slideNumber,
          slideTitle: slide.title,
          matchType: 'النص الإنجليزي الأصلي',
          snippet: slide.originalEnglish.slice(0, 140) + '...',
        });
        matched = true;
      }

      // Check Arabic translation
      if (slide.arabicTranslation.toLowerCase().includes(q)) {
        matches.push({
          slideNumber: slide.slideNumber,
          slideTitle: slide.title,
          matchType: 'الترجمة الطبية',
          snippet: slide.arabicTranslation.slice(0, 140) + '...',
        });
        matched = true;
      }

      // Check terms
      if (!matched && slide.terms) {
        for (const term of slide.terms) {
          if (
            term.english.toLowerCase().includes(q) ||
            term.arabic.toLowerCase().includes(q)
          ) {
            matches.push({
              slideNumber: slide.slideNumber,
              slideTitle: slide.title,
              matchType: `مصطلح طبي (${term.english} - ${term.arabic})`,
              snippet: term.definitionAr || term.definitionEn,
            });
            break;
          }
        }
      }
    }

    return matches;
  }, [query, slides]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في الإنجليزي، الترجمة، أو المصطلحات..."
            className="flex-1 text-sm bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden text-right font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="p-4 overflow-y-auto space-y-2 flex-1 text-right">
          {!query.trim() ? (
            <div className="p-8 text-center text-xs text-slate-400 space-y-1">
              <BookOpen className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
              <p>اكتب أي كلمة للبحث في محتوى المحاضرة والترجمة</p>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              لم نعثر على نتائج مطابقة لـ &ldquo;{query}&rdquo;
            </div>
          ) : (
            results.map((res, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onSelectSlide(res.slideNumber);
                  onClose();
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 hover:bg-sky-50 dark:hover:bg-sky-950/40 border border-slate-200/60 dark:border-slate-800 transition-all text-right group flex items-start justify-between gap-3"
              >
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-600 text-white font-mono">
                      شريحة {res.slideNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold truncate">
                      {res.matchType}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">
                    {res.slideTitle}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {res.snippet}
                  </p>
                </div>

                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-sky-600 shrink-0 mt-1" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

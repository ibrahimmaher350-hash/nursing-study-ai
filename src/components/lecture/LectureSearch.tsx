'use client';

import React, { useState, useMemo } from 'react';
import { Lecture, SearchResultItem } from '@/types';
import { Search, X, BookOpen, Bookmark, HelpCircle, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LectureSearchProps {
  lecture: Lecture;
  onSelectSlide: (slideNumber: number) => void;
  onOpenQuestionsTab?: () => void;
}

export function LectureSearch({
  lecture,
  onSelectSlide,
  onOpenQuestionsTab,
}: LectureSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const items: SearchResultItem[] = [];

    // Search in slides
    lecture.slides.forEach((slide) => {
      const enMatch = slide.originalEnglish.toLowerCase().includes(q);
      const arMatch = slide.arabicTranslation.toLowerCase().includes(q);
      const titleMatch = slide.title.toLowerCase().includes(q);

      if (enMatch || arMatch || titleMatch) {
        items.push({
          type: 'slide',
          id: slide.id,
          slideNumber: slide.slideNumber,
          title: `شريحة ${slide.slideNumber}: ${slide.title}`,
          matchSnippet: enMatch
            ? slide.originalEnglish.slice(0, 120) + '...'
            : slide.arabicTranslation.slice(0, 120) + '...',
        });
      }
    });

    // Search in terms
    lecture.terms?.forEach((term) => {
      const termMatch =
        term.english.toLowerCase().includes(q) ||
        term.arabic.toLowerCase().includes(q) ||
        term.definitionEn.toLowerCase().includes(q) ||
        term.definitionAr.toLowerCase().includes(q);

      if (termMatch) {
        items.push({
          type: 'term',
          id: term.id,
          slideNumber: term.sourceSlideNumber,
          title: `مصطلح: ${term.english} (${term.arabic})`,
          matchSnippet: term.definitionAr || term.definitionEn,
        });
      }
    });

    // Search in questions
    lecture.questions?.forEach((question) => {
      const qMatch =
        question.questionEn.toLowerCase().includes(q) ||
        (question.questionAr && question.questionAr.toLowerCase().includes(q));

      if (qMatch) {
        items.push({
          type: 'question',
          id: question.id,
          slideNumber: question.sourceSlideNumber,
          title: `سؤال: ${question.questionEn.slice(0, 50)}...`,
          matchSnippet: question.explanationAr || question.explanationEn,
        });
      }
    });

    return items;
  }, [query, lecture]);

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="ابحث في المحاضرة: مثلاً hypovolemic، صدمة، كانيولا..."
          className="w-full py-2 pr-10 pl-9 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 pointer-events-none" />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute left-2 rounded-full"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && query.trim().length >= 2 && (
        <div className="absolute top-full mt-2 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 max-h-80 overflow-y-auto p-2 space-y-1">
          <div className="px-3 py-1 text-[11px] font-bold text-slate-400 border-b border-slate-100 dark:border-slate-800 flex justify-between">
            <span>نتائج البحث ({results.length})</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              إغلاق
            </button>
          </div>

          {results.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-500">
              لم يتم العثور على نتائج مطابقة لـ &quot;{query}&quot;
            </div>
          ) : (
            results.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (item.slideNumber) {
                    onSelectSlide(item.slideNumber);
                  }
                  if (item.type === 'question' && onOpenQuestionsTab) {
                    onOpenQuestionsTab();
                  }
                  setIsOpen(false);
                }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-sky-50 dark:hover:bg-slate-800 transition-colors flex items-start gap-2.5 group"
              >
                <div className="w-6 h-6 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center shrink-0 mt-0.5">
                  {item.type === 'slide' && <BookOpen className="w-3.5 h-3.5" />}
                  {item.type === 'term' && <Bookmark className="w-3.5 h-3.5 text-purple-600" />}
                  {item.type === 'question' && <HelpCircle className="w-3.5 h-3.5 text-amber-600" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-700 dark:group-hover:text-sky-300 truncate">
                    {item.title}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                    {item.matchSnippet}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { MedicalTerm } from '@/types';
import { AudioPronounce } from '@/components/lecture/AudioPronounce';
import {
  BookMarked,
  Search,
  Bookmark,
  Sparkles,
  Volume2,
  BookOpen,
  Filter,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DictionaryPage() {
  const [terms, setTerms] = useState<MedicalTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'saved'>('all');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const all = LectureRepository.getAllTerms();
    setTerms(all);

    const map: Record<string, boolean> = {};
    all.forEach((t) => {
      map[t.id] = !!t.isBookmarked;
    });
    setBookmarkedMap(map);
  }, []);

  const handleToggleBookmark = (termId: string) => {
    const newState = LectureRepository.toggleBookmarkTerm(termId);
    setBookmarkedMap((prev) => ({ ...prev, [termId]: newState }));
  };

  const filteredTerms = useMemo(() => {
    let result = terms;

    if (filterMode === 'saved') {
      result = result.filter((t) => bookmarkedMap[t.id]);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.english.toLowerCase().includes(q) ||
          t.arabic.toLowerCase().includes(q) ||
          t.definitionEn.toLowerCase().includes(q) ||
          (t.definitionAr && t.definitionAr.toLowerCase().includes(q))
      );
    }

    return result;
  }, [terms, searchQuery, filterMode, bookmarkedMap]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookMarked className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              قاموس المصطلحات الطبية والتمريضية
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            استمع للنطق الإنجليزي الصحي بالسرعات المختلفة، وتعرف على المعنى الأكاديمي والتعريف
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
          <button
            onClick={() => setFilterMode('all')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl transition-all',
              filterMode === 'all'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            جميع المصطلحات ({terms.length})
          </button>
          <button
            onClick={() => setFilterMode('saved')}
            className={cn(
              'px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5',
              filterMode === 'saved'
                ? 'bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 shadow-xs'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <Bookmark className="w-3 h-3" />
            <span>المحفوظة</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن مصطلح طبي بالإنجليزي أو العربي (مثال: Hypoxia, Oliguria, صدمة)..."
          className="w-full py-3.5 pr-11 pl-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-xs"
        />
        <Search className="w-5 h-5 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Terms Grid */}
      {filteredTerms.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <BookMarked className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
            {filterMode === 'saved'
              ? 'لم تقم بحفظ أي مصطلحات بعد. اضغط على أيقونة الإشارة المرجعية لحفظ المصطلح هنا.'
              : 'لم نجد أي مصطلحات تطابق بحثك.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTerms.map((term) => {
            const isSaved = bookmarkedMap[term.id];

            return (
              <div
                key={term.id}
                className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-3 hover:border-purple-300 dark:hover:border-purple-800 transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="medical-en text-base font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                        {term.english}
                      </h3>
                      {term.ipa && (
                        <span className="medical-en text-[11px] text-purple-600 dark:text-purple-400 font-inter">
                          {term.ipa}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => handleToggleBookmark(term.id)}
                      aria-label="حفظ المصطلح"
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
                        isSaved
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                          : 'text-slate-300 hover:text-purple-600 dark:text-slate-600 dark:hover:text-purple-400'
                      )}
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  <p className="text-sm font-bold text-purple-900 dark:text-purple-300">
                    {term.arabic}
                  </p>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                    {term.definitionAr || term.definitionEn}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <AudioPronounce text={term.english} size="sm" showSpeedSelector={false} />

                  {term.sourceSlideNumber && (
                    <Link
                      href={`/lectures/${term.lectureId}`}
                      className="text-[11px] font-semibold text-slate-400 hover:text-sky-600 transition-colors flex items-center gap-1"
                    >
                      <span>شريحة {term.sourceSlideNumber}</span>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { LectureRepository } from '@/lib/storage/repository';
import { MedicalTerm } from '@/types';
import { MedicalSpeechService } from '@/lib/audio/speech';
import { Search, Volume2, Bookmark, BookmarkCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DictionaryPage() {
  const [terms, setTerms] = useState<MedicalTerm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all');
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

    if (activeTab === 'saved') {
      result = result.filter((t) => bookmarkedMap[t.id]);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.english.toLowerCase().includes(q) ||
          t.arabic.toLowerCase().includes(q) ||
          t.definitionEn.toLowerCase().includes(q)
      );
    }

    return result;
  }, [terms, searchQuery, activeTab, bookmarkedMap]);

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      {/* Search Input (Rule 23) */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن مصطلح طبي (مثال: Hypoxia, Oliguria)..."
          className="w-full p-3.5 pr-11 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs"
        />
        <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Tabs: الكل | المحفوظة */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors',
            activeTab === 'all'
              ? 'bg-sky-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
          )}
        >
          الكل ({terms.length})
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={cn(
            'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1',
            activeTab === 'saved'
              ? 'bg-purple-700 text-white shadow-xs'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800'
          )}
        >
          <Bookmark className="w-3 h-3" />
          <span>المحفوظة</span>
        </button>
      </div>

      {/* Terms List (Rule 23) */}
      {filteredTerms.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
          لم يتم العثور على مصطلحات.
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTerms.map((term) => {
            const isSaved = bookmarkedMap[term.id];

            return (
              <div
                key={term.id}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="medical-en text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {term.english}
                    </h3>
                    <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mt-0.5">
                      {term.arabic}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Pronunciation button */}
                    <button
                      onClick={() => MedicalSpeechService.speak(term.english)}
                      className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-300 flex items-center justify-center hover:bg-sky-100 transition-colors"
                      aria-label="نطق المصطلح"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Bookmark */}
                    <button
                      onClick={() => handleToggleBookmark(term.id)}
                      className={cn(
                        'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
                        isSaved
                          ? 'text-purple-600 bg-purple-50 dark:bg-purple-950'
                          : 'text-slate-300 hover:text-slate-500'
                      )}
                      aria-label="حفظ"
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {term.definitionAr || term.definitionEn}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

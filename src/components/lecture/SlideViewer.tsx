'use client';

import React, { useState } from 'react';
import { Slide, MedicalTerm } from '@/types';
import { AudioPronounce } from '@/components/lecture/AudioPronounce';
import { ExplainModal } from '@/components/lecture/ExplainModal';
import {
  Sparkles,
  AlertTriangle,
  Bookmark,
  Target,
  BookOpen,
  HelpCircle,
  Stethoscope,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LectureRepository } from '@/lib/storage/repository';

interface SlideViewerProps {
  slide: Slide;
  totalSlides: number;
}

export function SlideViewer({ slide, totalSlides }: SlideViewerProps) {
  const [showExplainModal, setShowExplainModal] = useState(false);
  const [bookmarkedTerms, setBookmarkedTerms] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    slide.terms?.forEach((t) => {
      map[t.id] = !!t.isBookmarked;
    });
    return map;
  });

  const toggleBookmark = (termId: string) => {
    const newState = LectureRepository.toggleBookmarkTerm(termId);
    setBookmarkedTerms((prev) => ({ ...prev, [termId]: newState }));
  };

  return (
    <div className="space-y-6">
      {/* Slide Header Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold text-xs font-inter">
            Slide {slide.slideNumber} / {totalSlides}
          </div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {slide.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Explain button */}
          <button
            onClick={() => setShowExplainModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 transition-colors shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>شرح الشريحة (Explain)</span>
          </button>
        </div>
      </div>

      {/* Verification Warning Alert (Rule 3) */}
      {slide.verification?.requiresVerification && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
            <span className="font-bold">تنبيه تدقيق: محتوى يتطلب التحقق الأكاديمي</span>
            <p className="text-amber-800 dark:text-amber-300 text-[11px]">
              {slide.verification.reason ||
                'تم حفظ النص الأصلي بدقة، ولكن توجد صياغة قد تكون تحتمل اللبس العلمي ويُنصح بمراجعة المحاضر.'}
            </p>
          </div>
        </div>
      )}

      {/* Core Bilingual Study Card (Rule 4 & 6) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        {/* Section 1: Original English Content */}
        <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-inter">
                Original English Lecture Content
              </span>
            </div>
            {/* Audio Pronunciation for full slide text */}
            <AudioPronounce text={slide.originalEnglish} size="sm" />
          </div>

          <div className="medical-en text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-medium">
            {slide.originalEnglish}
          </div>
        </div>

        {/* Section 2: Accurate Arabic Medical Translation */}
        <div className="p-5 sm:p-6 space-y-3 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
              الترجمة الطبية الأكاديمية المعتمدة
            </span>
          </div>

          <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-loose font-normal">
            {slide.arabicTranslation}
          </p>
        </div>

        {/* Section 3: Structured Bullet Points (if available) */}
        {slide.bullets && slide.bullets.length > 0 && (
          <div className="p-5 sm:p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              النقاط التفصيلية والمقارنات (Key Points)
            </h4>

            <div className="space-y-3">
              {slide.bullets.map((bullet, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-1.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="medical-en text-sm font-semibold text-slate-900 dark:text-slate-100">
                      • {bullet.en}
                    </p>
                    <AudioPronounce text={bullet.en} size="sm" showSpeedSelector={false} />
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pr-3 border-r-2 border-emerald-500 leading-relaxed">
                    {bullet.ar}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Medical Terminology Section (Rule 15) */}
      {slide.terms && slide.terms.length > 0 && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-purple-600" />
              <span>المصطلحات الطبية في الشريحة (Medical Terminology)</span>
            </h3>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold font-inter">
              {slide.terms.length} Terms
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {slide.terms.map((term) => {
              const isSaved = bookmarkedTerms[term.id];

              return (
                <div
                  key={term.id}
                  className="p-4 rounded-2xl bg-purple-50/40 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex flex-col justify-between space-y-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <h4 className="medical-en text-sm font-bold text-purple-900 dark:text-purple-200">
                          {term.english}
                        </h4>
                        {term.ipa && (
                          <span className="medical-en text-[11px] text-purple-600 dark:text-purple-400 font-inter">
                            {term.ipa}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <AudioPronounce text={term.english} size="sm" showSpeedSelector={false} />
                        <button
                          onClick={() => toggleBookmark(term.id)}
                          aria-label="حفظ المصطلح"
                          className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                            isSaved
                              ? 'bg-purple-600 text-white'
                              : 'text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
                          )}
                        >
                          <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                      {term.arabic}
                    </p>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {term.definitionAr || term.definitionEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Exam Focus Badges (Rule 18) */}
      {slide.examFocus && slide.examFocus.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-amber-950/20 border border-amber-200 dark:border-amber-900/40 p-5 sm:p-6 space-y-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-600" />
            <h3 className="text-sm font-bold text-amber-950 dark:text-amber-200">
              التركيز الامتحاني والإكلينيكي (Exam Focus)
            </h3>
            <span className="text-[10px] bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full font-bold">
              نقاط لا يخرج عنها الامتحان
            </span>
          </div>

          <div className="space-y-2.5">
            {slide.examFocus.map((focus, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                  {focus.categoryLabelAr}:
                </span>
                <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-2">
                  {focus.pointsAr.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explanation Modal */}
      <ExplainModal
        isOpen={showExplainModal}
        onClose={() => setShowExplainModal(false)}
        slideTitle={slide.title}
        slideNumber={slide.slideNumber}
        explanation={slide.explanation}
      />
    </div>
  );
}

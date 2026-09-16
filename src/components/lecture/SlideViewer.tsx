'use client';

import React, { useState } from 'react';
import { Slide, MedicalTerm } from '@/types';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AudioPronounce } from '@/components/lecture/AudioPronounce';
import { MedicalSpeechService } from '@/lib/audio/speech';
import {
  Volume2,
  Sparkles,
  Bookmark,
  Target,
  AlertTriangle,
  BookMarked,
  Check,
  MoreHorizontal,
} from 'lucide-react';
import { LectureRepository } from '@/lib/storage/repository';
import { cn } from '@/lib/utils';

interface SlideViewerProps {
  slide: Slide;
  totalSlides: number;
}

export function SlideViewer({ slide, totalSlides }: SlideViewerProps) {
  // Bottom Sheet States (Rule 14 & 16)
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const [showExplainSheet, setShowExplainSheet] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  // Term bookmark local state
  const [bookmarkedTerms, setBookmarkedTerms] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    slide.terms?.forEach((t) => {
      map[t.id] = !!t.isBookmarked;
    });
    return map;
  });

  const handleToggleTermBookmark = (termId: string) => {
    const newState = LectureRepository.toggleBookmarkTerm(termId);
    setBookmarkedTerms((prev) => ({ ...prev, [termId]: newState }));
  };

  const handleCopyText = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(`${slide.originalEnglish}\n\n${slide.arabicTranslation}`);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      setShowMoreActions(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in">
      {/* Slide Title Indicator */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
        <span className="text-xs font-bold text-slate-400 font-inter">
          Slide {slide.slideNumber} / {totalSlides}
        </span>
        <h2 className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate max-w-xs">
          {slide.title}
        </h2>
      </div>

      {/* Verification Warning Alert (Rule 3) */}
      {slide.verification?.requiresVerification && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px]">
            {slide.verification.reason || 'محتوى يتطلب التحقق الأكاديمي.'}
          </p>
        </div>
      )}

      {/* DIGITAL TEXTBOOK READING EXPERIENCE (Rule 9 & 13) */}
      <article className="space-y-5">
        {/* Original English Text */}
        <div className="space-y-2">
          <div className="medical-en text-slate-900 dark:text-slate-100 text-base sm:text-lg leading-relaxed font-normal select-text">
            {slide.originalEnglish}
          </div>
        </div>

        {/* Subtle separator */}
        <div className="w-12 h-0.5 bg-slate-200 dark:bg-slate-700 rounded-full" />

        {/* Medical Arabic Translation */}
        <div className="space-y-2">
          <p className="text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-[1.85] font-normal select-text">
            {slide.arabicTranslation}
          </p>
        </div>

        {/* Bullet points (if any) */}
        {slide.bullets && slide.bullets.length > 0 && (
          <div className="pt-2 space-y-3">
            {slide.bullets.map((b, idx) => (
              <div
                key={idx}
                className="pr-3 border-r-2 border-slate-200 dark:border-slate-700 space-y-1"
              >
                <p className="medical-en text-sm font-medium text-slate-900 dark:text-slate-100">
                  {b.en}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {b.ar}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions Bar: Only 2 Primary Actions (Rule 10) */}
        <div className="pt-3 flex items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            {/* Primary: Listen */}
            <AudioPronounce text={slide.originalEnglish} size="md" />

            {/* Secondary: Explain */}
            <button
              onClick={() => setShowExplainSheet(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>شرح مبسط</span>
            </button>
          </div>

          {/* More options button (...) */}
          <div className="relative">
            <button
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="خيارات إضافية"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>

            {showMoreActions && (
              <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1.5 min-w-[140px] z-20 space-y-0.5 text-xs">
                <button
                  onClick={handleCopyText}
                  className="w-full text-right px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {copiedText ? 'تم النسخ!' : 'نسخ النص'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Medical Terms Subtle Pills (Rule 14) */}
        {slide.terms && slide.terms.length > 0 && (
          <div className="pt-2 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              المصطلحات (اضغط للترجمة والنطق):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {slide.terms.map((term) => (
                <button
                  key={term.id}
                  onClick={() => setSelectedTerm(term)}
                  className="px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 text-purple-900 dark:text-purple-300 border border-purple-200/80 dark:border-purple-900/60 text-xs font-semibold medical-en transition-all active:scale-95"
                >
                  {term.english}
                </button>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* BOTTOM SHEET 1: MEDICAL TERM (Rule 14) */}
      <BottomSheet
        isOpen={!!selectedTerm}
        onClose={() => setSelectedTerm(null)}
        title="المصطلح الطبي"
      >
        {selectedTerm && (
          <div className="space-y-4 text-right">
            <div>
              <h3 className="medical-en text-xl font-bold text-slate-900 dark:text-white">
                {selectedTerm.english}
              </h3>
              {selectedTerm.ipa && (
                <span className="medical-en text-xs text-purple-600 dark:text-purple-400 font-inter">
                  {selectedTerm.ipa}
                </span>
              )}
            </div>

            <p className="text-base font-bold text-purple-900 dark:text-purple-300">
              {selectedTerm.arabic}
            </p>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {selectedTerm.definitionAr || selectedTerm.definitionEn}
            </p>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => MedicalSpeechService.speak(selectedTerm.english)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs"
              >
                <Volume2 className="w-4 h-4" />
                <span>اسمع النطق</span>
              </button>

              <button
                onClick={() => handleToggleTermBookmark(selectedTerm.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors',
                  bookmarkedTerms[selectedTerm.id]
                    ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 text-purple-700 dark:text-purple-300'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                )}
              >
                <Bookmark className="w-3.5 h-3.5" fill={bookmarkedTerms[selectedTerm.id] ? 'currentColor' : 'none'} />
                <span>{bookmarkedTerms[selectedTerm.id] ? 'محفوظ' : 'إضافة للقاموس'}</span>
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* BOTTOM SHEET 2: EXPLAIN THIS SLIDE (Rule 16) */}
      <BottomSheet
        isOpen={showExplainSheet}
        onClose={() => setShowExplainSheet(false)}
        title="شرح الشريحة"
      >
        <div className="space-y-5 text-right">
          {/* Explanation in Egyptian Arabic */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400">
              شرح مبسط (بالمصري):
            </h4>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-purple-50/50 dark:bg-purple-950/30 p-3.5 rounded-2xl border border-purple-100 dark:border-purple-900/40 font-medium">
              {slide.explanation?.egyptianArabic ||
                slide.explanation?.arabic ||
                'بمعنى مبسط يا زمايلنا، أهم نقطة في الشريحة دي هي فهم تسلسل التدخلات التمريضية ومتابعة العلامات الحيوية.'}
            </p>
          </div>

          {/* Exam Focus Bullet Points (Rule 16) */}
          {slide.examFocus && slide.examFocus.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-amber-600" />
                <span>ركز في الامتحان:</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                {slide.examFocus.flatMap((f) => f.pointsAr).map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100/60 dark:border-amber-900/30">
                    <span className="text-amber-600 font-bold">•</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Close button */}
          <button
            onClick={() => setShowExplainSheet(false)}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            رجوع للمحاضرة
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

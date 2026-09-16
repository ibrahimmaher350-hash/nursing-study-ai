'use client';

import React, { useState } from 'react';
import { Lecture, Slide, MedicalTerm } from '@/types';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { AudioPronounce } from '@/components/lecture/AudioPronounce';
import { MedicalSpeechService } from '@/lib/audio/speech';
import { LectureRepository } from '@/lib/storage/repository';
import {
  Volume2,
  Sparkles,
  Bookmark,
  Target,
  AlertTriangle,
  BookMarked,
  Check,
  ExternalLink,
  ChevronLeft,
  X,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LectureDocumentProps {
  lecture: Lecture;
  fontSizeDelta: number;
  activeSlideNumber: number;
}

export function LectureDocument({
  lecture,
  fontSizeDelta,
  activeSlideNumber,
}: LectureDocumentProps) {
  // Modal states
  const [selectedTerm, setSelectedTerm] = useState<MedicalTerm | null>(null);
  const [explainSlide, setExplainSlide] = useState<Slide | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  // Bookmark tracking
  const [bookmarkedSlides, setBookmarkedSlides] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    lecture.slides.forEach((s) => {
      map[s.slideNumber] = !!s.isBookmarked;
    });
    return map;
  });

  const [bookmarkedTerms, setBookmarkedTerms] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    lecture.terms?.forEach((t) => {
      map[t.id] = !!t.isBookmarked;
    });
    return map;
  });

  const handleToggleSlideBookmark = (slideNumber: number) => {
    setBookmarkedSlides((prev) => ({
      ...prev,
      [slideNumber]: !prev[slideNumber],
    }));
  };

  const handleToggleTermBookmark = (termId: string) => {
    const newState = LectureRepository.toggleBookmarkTerm(termId);
    setBookmarkedTerms((prev) => ({ ...prev, [termId]: newState }));
  };

  // Dynamic typography font sizes based on fontSizeDelta
  const enBodySize = `${18 + fontSizeDelta}px`;
  const arBodySize = `${19 + fontSizeDelta}px`;
  const bulletSize = `${16 + fontSizeDelta}px`;

  return (
    <article
      className="w-full max-w-[880px] mx-auto bg-white dark:bg-[#111827] shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl md:rounded-4xl px-5 py-8 sm:px-12 sm:py-14 md:px-16 md:py-18 transition-all selection:bg-sky-100 dark:selection:bg-sky-950 selection:text-sky-900 dark:selection:text-sky-100"
      style={{
        boxShadow: '0 10px 40px -10px rgba(0,0,0,0.06), 0 2px 10px -2px rgba(0,0,0,0.04)',
      }}
    >
      {/* 1. DOCUMENT COVER / TITLE SECTION (Rule 27 & 28) */}
      <header className="pb-8 mb-10 border-b-2 border-slate-100 dark:border-slate-800/80 text-right space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1 rounded-xl">
            {lecture.subject}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {lecture.slideCount} شرائح دراسية
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
          {lecture.title}
        </h1>

        <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
          <FileText className="w-3.5 h-3.5 text-slate-400" />
          <span>مذكرة دراسية ثنائية اللغة (English + الترجمة الطبية الأكاديمية)</span>
        </div>
      </header>

      {/* 2. CONTINUOUS DOCUMENT SLIDES (Rule 25) */}
      <div className="space-y-16">
        {lecture.slides.map((slide, slideIndex) => {
          const isCurrentActive = slide.slideNumber === activeSlideNumber;
          const isSlideBookmarked = !!bookmarkedSlides[slide.slideNumber];

          return (
            <section
              key={slide.id || slide.slideNumber}
              id={`slide-${slide.slideNumber}`}
              data-slide-number={slide.slideNumber}
              className={cn(
                'scroll-mt-24 space-y-6 transition-all relative',
                slideIndex < lecture.slides.length - 1 &&
                  'pb-14 border-b border-slate-100 dark:border-slate-800/80'
              )}
            >
              {/* SLIDE SECTION HEADER (Rule 6) */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-right">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold tracking-widest px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    SLIDE {String(slide.slideNumber).padStart(2, '0')}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {slide.title}
                  </h2>
                </div>

                {/* Slide Quick Action Buttons (Rule 17, 18, 34) */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto print:hidden">
                  {/* Listen to slide title */}
                  <button
                    onClick={() => MedicalSpeechService.speak(slide.title)}
                    className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
                    title="نطق عنوان الشريحة"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Egyptian Arabic Explanation */}
                  <button
                    onClick={() => setExplainSlide(slide)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold transition-colors"
                    title="شرح الشريحة بالعامية المصرية"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    <span>شرح مبسط</span>
                  </button>

                  {/* Bookmark Slide */}
                  <button
                    onClick={() => handleToggleSlideBookmark(slide.slideNumber)}
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
                      isSlideBookmarked
                        ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-600 border border-amber-200 dark:border-amber-900/60'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-400 hover:text-slate-600'
                    )}
                    title={isSlideBookmarked ? 'محفوظة في الإشارات' : 'حفظ الشريحة'}
                  >
                    <Bookmark
                      className="w-3.5 h-3.5"
                      fill={isSlideBookmarked ? 'currentColor' : 'none'}
                    />
                  </button>
                </div>
              </div>

              {/* Verification alert if needed */}
              {slide.verification?.requiresVerification && (
                <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200 text-right">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {slide.verification.reason || 'محتوى طبي يتطلب التحقق الأكاديمي.'}
                  </p>
                </div>
              )}

              {/* Slide Image if present (Rule 14 & 15) */}
              {slide.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    onClick={() => setPreviewImageUrl(slide.imageUrl || null)}
                    className="w-full max-h-96 object-contain bg-slate-50 dark:bg-slate-900 cursor-pointer hover:opacity-95 transition-opacity"
                  />
                </div>
              )}

              {/* BILINGUAL CONTENT AREA (Rule 7, 8, 9) */}
              <div className="space-y-6 text-left">
                {/* ORIGINAL ENGLISH BLOCK (Rule 7) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 select-none pb-1">
                    <span className="font-sans tracking-wide">Original English</span>
                    <AudioPronounce text={slide.originalEnglish} size="sm" />
                  </div>

                  <div
                    className="font-sans text-slate-900 dark:text-slate-100 leading-[1.65] select-text whitespace-pre-line"
                    style={{ fontSize: enBodySize }}
                  >
                    {slide.originalEnglish}
                  </div>
                </div>

                {/* ARABIC TRANSLATION BLOCK (Rule 8) */}
                <div className="space-y-2 text-right pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <div className="text-xs font-bold text-sky-800 dark:text-sky-400 select-none pb-1">
                    الترجمة الطبية
                  </div>

                  <div
                    className="font-cairo text-slate-800 dark:text-slate-200 leading-[1.85] select-text whitespace-pre-line"
                    style={{ fontSize: arBodySize }}
                  >
                    {slide.arabicTranslation}
                  </div>
                </div>

                {/* BILINGUAL BULLETS (Rule 11) */}
                {slide.bullets && slide.bullets.length > 0 && (
                  <div className="pt-3 space-y-3">
                    {slide.bullets.map((bullet, bIdx) => (
                      <div
                        key={bIdx}
                        className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2"
                      >
                        {/* English Bullet */}
                        <div className="flex items-start gap-2 text-left">
                          <span className="text-sky-600 dark:text-sky-400 font-bold leading-none mt-1">
                            •
                          </span>
                          <p
                            className="font-sans text-slate-900 dark:text-slate-100 leading-[1.6]"
                            style={{ fontSize: bulletSize }}
                          >
                            {bullet.en}
                          </p>
                        </div>

                        {/* Arabic Mapped Bullet */}
                        <div className="flex items-start gap-2 text-right pt-1.5 border-t border-slate-200/50 dark:border-slate-700/50">
                          <span className="text-sky-600 dark:text-sky-400 font-bold leading-none mt-1">
                            •
                          </span>
                          <p
                            className="font-cairo text-slate-700 dark:text-slate-300 leading-[1.8] flex-1"
                            style={{ fontSize: bulletSize }}
                          >
                            {bullet.ar}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TABLES (Rule 13) */}
                {slide.tables && slide.tables.length > 0 && (
                  <div className="pt-3 space-y-4">
                    {slide.tables.map((table, tIdx) => (
                      <div
                        key={tIdx}
                        className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800"
                      >
                        <table className="w-full text-xs sm:text-sm text-right border-collapse">
                          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold">
                            <tr>
                              {table.headers.map((header, hIdx) => (
                                <th
                                  key={hIdx}
                                  className="p-3 border-b border-slate-200 dark:border-slate-700"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {table.rows.map((row, rIdx) => (
                              <tr
                                key={rIdx}
                                className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                              >
                                {row.cells.map((cell, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed"
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                )}

                {/* MEDICAL TERMS PILLS (Rule 16) */}
                {slide.terms && slide.terms.length > 0 && (
                  <div className="pt-3 text-right space-y-2 print:hidden">
                    <span className="text-[11px] font-bold text-slate-400 tracking-wide uppercase block">
                      مصطلحات الشريحة (اضغط للاستماع والترجمة):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {slide.terms.map((term) => (
                        <button
                          key={term.id}
                          onClick={() => setSelectedTerm(term)}
                          className="px-3 py-1.5 rounded-xl bg-purple-50/80 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/50 text-purple-900 dark:text-purple-300 border border-purple-200/70 dark:border-purple-900/50 text-xs font-semibold font-sans transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <span>{term.english}</span>
                          <span className="text-[10px] text-purple-500 font-cairo">
                            ({term.arabic})
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* 3. MEDICAL TERM BOTTOM SHEET (Rule 16) */}
      <BottomSheet
        isOpen={!!selectedTerm}
        onClose={() => setSelectedTerm(null)}
        title="المصطلح الطبي"
      >
        {selectedTerm && (
          <div className="space-y-4 text-right">
            <div>
              <h3 className="font-sans text-xl font-bold text-slate-900 dark:text-white">
                {selectedTerm.english}
              </h3>
              {selectedTerm.ipa && (
                <span className="font-mono text-xs text-purple-600 dark:text-purple-400 font-medium">
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
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs transition-colors"
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
                <Bookmark
                  className="w-3.5 h-3.5"
                  fill={bookmarkedTerms[selectedTerm.id] ? 'currentColor' : 'none'}
                />
                <span>
                  {bookmarkedTerms[selectedTerm.id] ? 'محفوظ' : 'حفظ في القاموس'}
                </span>
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* 4. EGYPTIAN EXPLANATION BOTTOM SHEET (Rule 18) */}
      <BottomSheet
        isOpen={!!explainSlide}
        onClose={() => setExplainSlide(null)}
        title={explainSlide ? `شرح مبسط: ${explainSlide.title}` : 'شرح الشريحة'}
      >
        {explainSlide && (
          <div className="space-y-5 text-right">
            {/* Explanation in Egyptian Arabic */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>شرح مبسط (بالمصري):</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line bg-purple-50/50 dark:bg-purple-950/30 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/40 font-medium">
                {explainSlide.explanation?.egyptianArabic ||
                  explainSlide.explanation?.arabic ||
                  'ركز في هذه الشريحة على فهم الأولويات السريرية ومتابعة العلامات الحيوية.'}
              </p>
            </div>

            {/* Exam Focus Bullet Points */}
            {explainSlide.examFocus && explainSlide.examFocus.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-amber-600" />
                  <span>ركز في الامتحان:</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {explainSlide.examFocus.flatMap((f) => f.pointsAr).map((point, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 bg-amber-50/40 dark:bg-amber-950/20 p-2.5 rounded-xl border border-amber-100/60 dark:border-amber-900/30"
                    >
                      <span className="text-amber-600 font-bold">•</span>
                      <span className="leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => setExplainSlide(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              العودة إلى نفس موضع القراءة
            </button>
          </div>
        )}
      </BottomSheet>

      {/* 5. IMAGE PREVIEW MODAL */}
      {previewImageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs animate-fade-in"
          onClick={() => setPreviewImageUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute -top-10 left-0 text-white hover:text-slate-300"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={previewImageUrl}
              alt="Slide Preview"
              className="max-h-[85vh] max-w-full rounded-2xl shadow-2xl object-contain"
            />
          </div>
        </div>
      )}
    </article>
  );
}

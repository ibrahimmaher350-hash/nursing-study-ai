'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture } from '@/types';
import { LectureDocument } from '@/components/lecture/LectureDocument';
import { SummaryView } from '@/components/lecture/SummaryView';
import { QuestionView } from '@/components/lecture/QuestionView';
import { LectureToolbar } from '@/components/lecture/LectureToolbar';
import { DesktopSlideSidebar } from '@/components/lecture/DesktopSlideSidebar';
import { LectureSearchModal } from '@/components/lecture/LectureSearchModal';
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Award,
  ChevronLeft,
  ChevronRight,
  List,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LectureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tab State: 'document' | 'summary' | 'questions' (Rule 30, 31, 32)
  const [activeTab, setActiveTab] = useState<'document' | 'summary' | 'questions'>('document');

  // Active slide number for scroll spy & progress
  const [activeSlideNumber, setActiveSlideNumber] = useState(1);

  // Typography font size scaling delta (-2 to +4)
  const [fontSizeDelta, setFontSizeDelta] = useState(0);

  // Reading Mode State (Rule 21)
  const [isReadingMode, setIsReadingMode] = useState(false);

  // Modals state
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showMobileSlideSheet, setShowMobileSlideSheet] = useState(false);

  // Load font size preference from localStorage
  useEffect(() => {
    try {
      const savedDelta = localStorage.getItem('nursing_lecture_font_delta');
      if (savedDelta !== null) {
        setFontSizeDelta(parseInt(savedDelta, 10) || 0);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleUpdateFontSize = (newDelta: number) => {
    const clamped = Math.max(-2, Math.min(4, newDelta));
    setFontSizeDelta(clamped);
    try {
      localStorage.setItem('nursing_lecture_font_delta', clamped.toString());
    } catch (e) {
      console.error(e);
    }
  };

  // Load Lecture Data
  useEffect(() => {
    if (lectureId) {
      setIsLoading(true);
      const data = LectureRepository.getLectureById(lectureId);
      if (data) {
        setLecture(data);
        LectureRepository.touchLecture(lectureId);
      }
      setIsLoading(false);
    }
  }, [lectureId]);

  // Scroll Spy: Track which slide is currently in view
  useEffect(() => {
    if (activeTab !== 'document' || !lecture) return;

    const handleScroll = () => {
      const slideElements = document.querySelectorAll('[data-slide-number]');
      const scrollPosition = window.scrollY + 200;

      for (let i = slideElements.length - 1; i >= 0; i--) {
        const el = slideElements[i] as HTMLElement;
        if (el.offsetTop <= scrollPosition) {
          const num = parseInt(el.getAttribute('data-slide-number') || '1', 10);
          setActiveSlideNumber(num);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab, lecture]);

  // Smooth scroll to slide
  const handleScrollToSlide = (slideNumber: number) => {
    if (activeTab !== 'document') {
      setActiveTab('document');
      setTimeout(() => {
        const el = document.getElementById(`slide-${slideNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const el = document.getElementById(`slide-${slideNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setActiveSlideNumber(slideNumber);
  };

  const totalSlides = lecture?.slides.length || 0;
  const progressPercent = totalSlides > 0 ? Math.round((activeSlideNumber / totalSlides) * 100) : 0;

  // 1. CLEAN DOCUMENT SKELETON LOADING STATE (Rule 46)
  if (isLoading) {
    return (
      <div className="max-w-[880px] mx-auto py-12 px-6 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-xl" />
        <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
            <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
            <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
          </div>
          <div className="h-20 w-full bg-slate-50 dark:bg-slate-800/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  // 2. ERROR STATE (Rule 48)
  if (!lecture) {
    return (
      <div className="max-w-md mx-auto py-20 px-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-600 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            تعذر فتح المحاضرة
          </h2>
          <p className="text-xs text-slate-400">
            المحاضرة المطلوبة غير موجودة أو تم حذفها.
          </p>
        </div>
        <Link
          href="/lectures"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-all shadow-xs"
        >
          <span>العودة إلى مكتبتي الدراسية</span>
          <ChevronLeft className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 space-y-6">
      {/* 1. TOP APP BAR & CONTEXTUAL NAVIGATION (Rule 3 & 32) */}
      {!isReadingMode && (
        <header className="print:hidden sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 py-2.5 px-3 sm:px-6 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            {/* Back to library / folder */}
            <div className="flex items-center gap-2.5 min-w-0">
              <Link
                href={lecture.folderId ? `/lectures?folder=${lecture.folderId}` : '/lectures'}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0 transition-colors"
                title="العودة للمكتبة"
              >
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="min-w-0 pr-1">
                <span className="text-[10px] text-slate-400 font-semibold block truncate">
                  {lecture.subject}
                </span>
                <h1 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                  {lecture.title}
                </h1>
              </div>
            </div>

            {/* Contextual Navigation Tabs: [المحاضرة | الملخص | الأسئلة] (Rule 32) */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => setActiveTab('document')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  activeTab === 'document'
                    ? 'bg-white dark:bg-slate-900 text-sky-800 dark:text-sky-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>المحاضرة</span>
              </button>

              <button
                onClick={() => setActiveTab('summary')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  activeTab === 'summary'
                    ? 'bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>الملخص</span>
              </button>

              <button
                onClick={() => setActiveTab('questions')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  activeTab === 'questions'
                    ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-300 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <Award className="w-3.5 h-3.5" />
                <span>الأسئلة ({lecture.questions?.length || 0})</span>
              </button>
            </div>
          </div>

          {/* Thin Slide Progress Bar (Rule 26) */}
          {activeTab === 'document' && (
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 mt-2.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 dark:bg-sky-500 h-full rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </header>
      )}

      {/* Floating Exit Reading Mode Bar (Rule 21) */}
      {isReadingMode && (
        <div className="print:hidden fixed top-3 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 text-white px-4 py-2 rounded-full shadow-2xl flex items-center gap-3 backdrop-blur-md text-xs font-semibold animate-fade-in">
          <span>وضع القراءة الهادئ</span>
          <button
            onClick={() => setIsReadingMode(false)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-colors"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span>إنهاء</span>
          </button>
        </div>
      )}

      {/* 2. DOCUMENT TOOLBAR (Rule 19, 20) */}
      <div className="max-w-[880px] mx-auto px-4 sm:px-0">
        <LectureToolbar
          fontSizeDelta={fontSizeDelta}
          onIncreaseFontSize={() => handleUpdateFontSize(fontSizeDelta + 1)}
          onDecreaseFontSize={() => handleUpdateFontSize(fontSizeDelta - 1)}
          isReadingMode={isReadingMode}
          onToggleReadingMode={() => setIsReadingMode(!isReadingMode)}
          onOpenSearch={() => setShowSearchModal(true)}
        />
      </div>

      {/* 3. MAIN CONTENT: SIDEBAR + CENTRAL DOCUMENT CANVAS */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-start justify-center gap-6">
        {/* Desktop Sidebar (Desktop only) (Rule 23) */}
        {!isReadingMode && activeTab === 'document' && (
          <DesktopSlideSidebar
            slides={lecture.slides}
            activeSlideNumber={activeSlideNumber}
            onSelectSlide={handleScrollToSlide}
          />
        )}

        {/* Central Canvas Container */}
        <main className="flex-1 max-w-[880px] min-w-0">
          {activeTab === 'document' && (
            <LectureDocument
              lecture={lecture}
              fontSizeDelta={fontSizeDelta}
              activeSlideNumber={activeSlideNumber}
            />
          )}

          {activeTab === 'summary' && <SummaryView lecture={lecture} />}

          {activeTab === 'questions' && <QuestionView lecture={lecture} />}
        </main>
      </div>

      {/* 4. FLOATING MOBILE SLIDE NAVIGATION BAR (Rule 22, 24, 36) */}
      {activeTab === 'document' && (
        <footer className="print:hidden fixed bottom-16 md:bottom-5 left-0 right-0 z-30 px-4 pointer-events-none">
          <div className="max-w-sm mx-auto p-2 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-2 pointer-events-auto select-none">
            {/* Prev Slide */}
            <button
              onClick={() => handleScrollToSlide(Math.max(1, activeSlideNumber - 1))}
              disabled={activeSlideNumber <= 1}
              className={cn(
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1',
                activeSlideNumber <= 1
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
              )}
            >
              <ChevronRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {/* Slide Index Trigger */}
            <button
              onClick={() => setShowMobileSlideSheet(true)}
              className="flex-1 py-1 text-center font-mono text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-600 transition-colors flex items-center justify-center gap-1.5"
            >
              <List className="w-3.5 h-3.5 text-slate-400" />
              <span>
                الشريحة {activeSlideNumber} من {totalSlides}
              </span>
            </button>

            {/* Next Slide */}
            <button
              onClick={() => handleScrollToSlide(Math.min(totalSlides, activeSlideNumber + 1))}
              disabled={activeSlideNumber >= totalSlides}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1',
                activeSlideNumber >= totalSlides
                  ? 'opacity-30 cursor-not-allowed text-slate-400'
                  : 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
              )}
            >
              <span>التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </footer>
      )}

      {/* 5. MOBILE SLIDE LIST BOTTOM SHEET (Rule 24) */}
      <BottomSheet
        isOpen={showMobileSlideSheet}
        onClose={() => setShowMobileSlideSheet(false)}
        title="فهرس شرائح المحاضرة"
      >
        <div className="space-y-1.5 text-right max-h-96 overflow-y-auto">
          {lecture.slides.map((s) => {
            const isCurrent = s.slideNumber === activeSlideNumber;

            return (
              <button
                key={s.id || s.slideNumber}
                onClick={() => {
                  handleScrollToSlide(s.slideNumber);
                  setShowMobileSlideSheet(false);
                }}
                className={cn(
                  'w-full p-3 rounded-2xl text-xs font-semibold flex items-center justify-between transition-colors text-right',
                  isCurrent
                    ? 'bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-900'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-1">
                  <span className="font-mono text-[11px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 shrink-0">
                    #{s.slideNumber}
                  </span>
                  <span className="truncate">{s.title}</span>
                </div>
                {isCurrent && (
                  <span className="text-[10px] text-sky-600 font-bold shrink-0">الحالية</span>
                )}
              </button>
            );
          })}
        </div>
      </BottomSheet>

      {/* 6. SEARCH MODAL (Rule 33) */}
      <LectureSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        slides={lecture.slides}
        onSelectSlide={handleScrollToSlide}
      />
    </div>
  );
}

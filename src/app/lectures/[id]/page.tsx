'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture } from '@/types';
import { SlideViewer } from '@/components/lecture/SlideViewer';
import { BottomSheet } from '@/components/ui/BottomSheet';
import {
  ArrowRight,
  Menu,
  ChevronRight,
  ChevronLeft,
  List,
  Layers,
  Award,
  Youtube,
  Search,
  BookOpen,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LectureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Bottom Sheet Menus (Rule 12, 17, 21, 31, 32)
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showSlideListSheet, setShowSlideListSheet] = useState(false);
  const [showSummarySheet, setShowSummarySheet] = useState(false);
  const [showYouTubeSheet, setShowYouTubeSheet] = useState(false);
  const [showSearchSheet, setShowSearchSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile Touch Swipe Gesture Support (Rule 11)
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (lectureId) {
      const data = LectureRepository.getLectureById(lectureId);
      if (data) {
        setLecture(data);
        LectureRepository.touchLecture(lectureId);
      }
    }
  }, [lectureId]);

  if (!lecture) {
    return (
      <div className="p-8 text-center text-slate-500">
        جاري تحميل المحاضرة...
      </div>
    );
  }

  const totalSlides = lecture.slides.length;
  const currentSlide = lecture.slides[currentSlideIndex] || lecture.slides[0];
  const progressPercent = Math.round(((currentSlideIndex + 1) / totalSlides) * 100);

  const handleNextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Swipe Gestures (Rule 11)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    // Swipe left (in RTL: next slide)
    if (diff > 60) {
      handleNextSlide();
    }
    // Swipe right (in RTL: prev slide)
    else if (diff < -60) {
      handlePrevSlide();
    }
  };

  // Search matches
  const searchResults = searchQuery.trim()
    ? lecture.slides.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.originalEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.arabicTranslation.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div
      className="max-w-3xl mx-auto pb-24 space-y-6"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 1. TOP BAR: [← رجوع] | اسم المحاضرة | الشريحة 1 / 42 | [☰ القائمة] */}
      <header className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 min-w-0">
          <Link
            href={lecture.folderId ? `/lectures?folder=${lecture.folderId}` : '/lectures'}
            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 shrink-0"
            aria-label="العودة"
          >
            <ArrowRight className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
              {lecture.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate">
              {lecture.subject}
            </p>
          </div>
        </div>

        {/* Action Buttons: [الشرائح] + [اختبر نفسك] + [☰] */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setShowSlideListSheet(true)}
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300"
          >
            <List className="w-3.5 h-3.5" />
            <span>الشرائح</span>
          </button>

          <Link
            href={`/lectures/${lecture.id}/exam`}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900/40 text-xs font-bold transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>اختبر نفسك</span>
          </Link>

          <button
            onClick={() => setShowMenuSheet(true)}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200"
            aria-label="القائمة"
          >
            <Menu className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. SLIDE CONTENT */}
      <main>
        <SlideViewer slide={currentSlide} totalSlides={totalSlides} />
      </main>

      {/* 3. STICKY BOTTOM SLIDE NAVIGATION (Rule 11) */}
      <footer className="fixed bottom-16 md:bottom-4 left-0 right-0 z-30 px-4 pointer-events-none">
        <div className="max-w-md mx-auto p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur border border-slate-200/80 dark:border-slate-800 shadow-xl flex items-center justify-between gap-3 pointer-events-auto">
          {/* Previous */}
          <button
            onClick={handlePrevSlide}
            disabled={currentSlideIndex === 0}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1',
              currentSlideIndex === 0
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            )}
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          {/* Indicator & Progress Bar */}
          <div
            onClick={() => setShowSlideListSheet(true)}
            className="flex-1 cursor-pointer text-center space-y-1"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-inter">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-full rounded-full transition-all duration-200"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Next */}
          <button
            onClick={handleNextSlide}
            disabled={currentSlideIndex === totalSlides - 1}
            className={cn(
              'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1',
              currentSlideIndex === totalSlides - 1
                ? 'opacity-30 cursor-not-allowed text-slate-400'
                : 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
            )}
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* BOTTOM SHEET: QUICK ACTIONS MENU (Rule 12) */}
      <BottomSheet
        isOpen={showMenuSheet}
        onClose={() => setShowMenuSheet(false)}
        title="خيارات المحاضرة"
      >
        <div className="space-y-2 text-right">
          <button
            onClick={() => {
              setShowMenuSheet(false);
              setShowSlideListSheet(true);
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <List className="w-4 h-4 text-sky-600" />
              <span>فهرس الشرائح ({totalSlides})</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              setShowMenuSheet(false);
              setShowSummarySheet(true);
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>ملخص المحاضرة</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <Link
            href={`/lectures/${lecture.id}/exam`}
            onClick={() => setShowMenuSheet(false)}
            className="w-full p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/40 hover:bg-amber-100 flex items-center justify-between text-xs font-bold text-amber-900 dark:text-amber-200"
          >
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-amber-600" />
              <span>اختبر نفسك ({lecture.questions?.length || 0} أسئلة)</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-amber-500" />
          </Link>

          <button
            onClick={() => {
              setShowMenuSheet(false);
              setShowYouTubeSheet(true);
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Youtube className="w-4 h-4 text-rose-600" />
              <span>شرح خارجي من YouTube</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => {
              setShowMenuSheet(false);
              setShowSearchSheet(true);
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-slate-600" />
              <span>بحث داخل المحاضرة</span>
            </div>
            <ChevronLeft className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </BottomSheet>

      {/* BOTTOM SHEET: SLIDE LIST (Rule 31) */}
      <BottomSheet
        isOpen={showSlideListSheet}
        onClose={() => setShowSlideListSheet(false)}
        title="فهرس الشرائح"
      >
        <div className="space-y-1.5 text-right max-h-96">
          {lecture.slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setCurrentSlideIndex(idx);
                setShowSlideListSheet(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                'w-full p-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors',
                idx === currentSlideIndex
                  ? 'bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              )}
            >
              <div className="flex items-center gap-2 min-w-0 pr-1">
                <span className="font-inter text-slate-400 text-[11px] shrink-0">
                  #{s.slideNumber}
                </span>
                <span className="truncate">{s.title}</span>
              </div>
              {idx === currentSlideIndex && (
                <span className="text-[10px] text-sky-600 font-bold shrink-0">الحالية</span>
              )}
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* BOTTOM SHEET: SUMMARY (Rule 17) */}
      <BottomSheet
        isOpen={showSummarySheet}
        onClose={() => setShowSummarySheet(false)}
        title="ملخص المحاضرة"
      >
        <div className="space-y-4 text-right">
          {/* Quick Review */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              أهم النقاط والمراجعة السريعة:
            </h4>
            <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {lecture.summary.quickReview.points.map((p, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30">
                  <p className="font-medium text-slate-800 dark:text-slate-200">{p.ar}</p>
                  <p className="medical-en text-[11px] text-slate-400 mt-0.5">{p.en}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Pearls */}
          {lecture.summary.detailedReview.nursingPearls.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-sky-800 dark:text-sky-300">
                ركز على (درر تمريضية إكلينيكية):
              </h4>
              <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                {lecture.summary.detailedReview.nursingPearls.map((pearl, idx) => (
                  <li key={idx} className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    • {pearl.ar}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </BottomSheet>

      {/* BOTTOM SHEET: YOUTUBE (Rule 21) */}
      <BottomSheet
        isOpen={showYouTubeSheet}
        onClose={() => setShowYouTubeSheet(false)}
        title="شرح خارجي من YouTube"
      >
        <div className="space-y-3 text-right">
          <p className="text-[11px] text-slate-400">
            فيديوهات تعليمية تكميلية موثوقة مرتبطة بموضوع المحاضرة:
          </p>

          <div className="space-y-2.5">
            {lecture.youtubeResources?.map((video) => (
              <a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <span className="text-[10px] font-bold text-rose-600 block">
                    {video.channelTitle}
                  </span>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                    {video.title}
                  </h5>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* BOTTOM SHEET: SEARCH (Rule 32) */}
      <BottomSheet
        isOpen={showSearchSheet}
        onClose={() => setShowSearchSheet(false)}
        title="بحث داخل المحاضرة"
      >
        <div className="space-y-3 text-right">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كلمة، مصطلح، أو موضوع..."
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />

          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {searchResults.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentSlideIndex(s.slideNumber - 1);
                  setShowSearchSheet(false);
                }}
                className="w-full text-right p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-xs block truncate"
              >
                <span className="font-bold text-sky-700 dark:text-sky-300">
                  شريحة {s.slideNumber}:
                </span>{' '}
                <span className="text-slate-600 dark:text-slate-300">{s.title}</span>
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}

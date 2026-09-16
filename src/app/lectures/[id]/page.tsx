'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture } from '@/types';
import { SlideViewer } from '@/components/lecture/SlideViewer';
import { SlideProgressBar } from '@/components/lecture/SlideProgressBar';
import { LectureSearch } from '@/components/lecture/LectureSearch';
import {
  ArrowRight,
  BookOpen,
  HelpCircle,
  Layers,
  Youtube,
  Award,
  Bookmark,
  Share2,
  AlertCircle,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LectureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'slides' | 'summary' | 'questions' | 'youtube'>('slides');
  const [copiedShare, setCopiedShare] = useState(false);

  useEffect(() => {
    if (lectureId) {
      const data = LectureRepository.getLectureById(lectureId);
      if (data) {
        setLecture(data);
      }
    }
  }, [lectureId]);

  if (!lecture) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-500">جاري تحميل المحاضرة أو المحاضرة غير موجودة...</p>
        <Link
          href="/lectures"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للمحاضرات</span>
        </Link>
      </div>
    );
  }

  const currentSlide = lecture.slides[currentSlideIndex] || lecture.slides[0];

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/lectures/${lecture.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const handleToggleBookmark = () => {
    LectureRepository.toggleBookmarkLecture(lecture.id);
    const updated = LectureRepository.getLectureById(lecture.id);
    if (updated) setLecture({ ...updated });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Top Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/lectures"
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
            aria-label="العودة لمكتبة المحاضرات"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>

          <div>
            <span className="text-[11px] font-bold text-sky-700 dark:text-sky-400">
              {lecture.subject}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
              {lecture.title}
            </h1>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <LectureSearch
            lecture={lecture}
            onSelectSlide={(slideNum) => {
              setCurrentSlideIndex(slideNum - 1);
              setActiveTab('slides');
            }}
            onOpenQuestionsTab={() => setActiveTab('questions')}
          />

          <button
            onClick={handleToggleBookmark}
            aria-label="حفظ المحاضرة"
            className={cn(
              'w-10 h-10 rounded-2xl flex items-center justify-center border transition-colors shrink-0',
              lecture.isBookmarked
                ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-300 text-purple-600'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:text-purple-600'
            )}
          >
            <Bookmark className="w-4 h-4" fill={lecture.isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleShare}
            aria-label="مشاركة رابط المحاضرة"
            className="relative w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 hover:text-sky-600 transition-colors shrink-0"
          >
            <Share2 className="w-4 h-4" />
            {copiedShare && (
              <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded-md shadow whitespace-nowrap z-50">
                تم نسخ الرابط!
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('slides')}
          className={cn(
            'flex items-center gap-2 py-2 px-4 rounded-xl transition-all whitespace-nowrap',
            activeTab === 'slides'
              ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <BookOpen className="w-4 h-4" />
          <span>الشرائح والترجمة ({lecture.slides.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('summary')}
          className={cn(
            'flex items-center gap-2 py-2 px-4 rounded-xl transition-all whitespace-nowrap',
            activeTab === 'summary'
              ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Layers className="w-4 h-4" />
          <span>الملخص الأكاديمي</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={cn(
            'flex items-center gap-2 py-2 px-4 rounded-xl transition-all whitespace-nowrap',
            activeTab === 'questions'
              ? 'bg-white dark:bg-slate-800 text-amber-700 dark:text-amber-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <HelpCircle className="w-4 h-4" />
          <span>الأسئلة المتوقعة ({lecture.questions?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('youtube')}
          className={cn(
            'flex items-center gap-2 py-2 px-4 rounded-xl transition-all whitespace-nowrap',
            activeTab === 'youtube'
              ? 'bg-white dark:bg-slate-800 text-rose-700 dark:text-rose-300 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          )}
        >
          <Youtube className="w-4 h-4" />
          <span>مصادر الشرح الخارجية ({lecture.youtubeResources?.length || 0})</span>
        </button>

        <Link
          href={`/lectures/${lecture.id}/exam`}
          className="mr-auto flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold transition-all shadow-sm whitespace-nowrap"
        >
          <Award className="w-4 h-4" />
          <span>بدء الامتحان</span>
        </Link>
      </div>

      {/* TAB 1: SLIDE VIEWER */}
      {activeTab === 'slides' && (
        <div className="space-y-6">
          <SlideViewer slide={currentSlide} totalSlides={lecture.slides.length} />

          <SlideProgressBar
            currentSlide={currentSlideIndex + 1}
            totalSlides={lecture.slides.length}
            onSelectSlide={(slideNum) => setCurrentSlideIndex(slideNum - 1)}
          />
        </div>
      )}

      {/* TAB 2: LECTURE SUMMARY */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Quick 5-minute review */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {lecture.summary.quickReview.titleAr}
              </h3>
              <span className="text-xs text-slate-400 font-inter">
                ({lecture.summary.quickReview.titleEn})
              </span>
            </div>

            <div className="space-y-3">
              {lecture.summary.quickReview.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1"
                >
                  <p className="medical-en text-xs font-semibold text-slate-800 dark:text-slate-200">
                    • {pt.en}
                  </p>
                  <p className="text-xs text-emerald-900 dark:text-emerald-200 pr-3 border-r-2 border-emerald-500">
                    {pt.ar}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Standard Academic Summary */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-sky-600" />
              <span>الملخص الأكاديمي القياسي (Standard Summary)</span>
            </h3>

            <div className="space-y-6 divide-y divide-slate-100 dark:divide-slate-800">
              {lecture.summary.standardSummary.sections.map((sec, idx) => (
                <div key={idx} className={cn('space-y-2', idx > 0 && 'pt-6')}>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-sky-900 dark:text-sky-300">
                      {sec.headingAr}
                    </h4>
                    <span className="text-xs text-slate-400 font-inter">
                      ({sec.headingEn})
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sec.contentAr}
                  </p>
                  <p className="medical-en text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    {sec.contentEn}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Clinical Pearls & Emergency Alerts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-blue-50/60 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>درر تمريضية إكلينيكية (Nursing Pearls)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {lecture.summary.detailedReview.nursingPearls.map((pearl, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs leading-relaxed">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{pearl.ar}</p>
                    <p className="medical-en text-[11px] text-slate-400 mt-0.5">{pearl.en}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-3xl bg-rose-50/60 dark:bg-slate-900 border border-rose-100 dark:border-slate-800 space-y-3">
              <h4 className="text-xs font-bold text-rose-900 dark:text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>إنذارات الطوارئ (Emergency Alerts)</span>
              </h4>
              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                {lecture.summary.detailedReview.emergencyAlerts.map((alert, idx) => (
                  <li key={idx} className="p-2.5 rounded-xl bg-white dark:bg-slate-800/80 shadow-xs leading-relaxed">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">{alert.ar}</p>
                    <p className="medical-en text-[11px] text-slate-400 mt-0.5">{alert.en}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPECTED QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Important AI Prediction Disclaimer (Rule 11) */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 dark:text-amber-200 space-y-0.5">
              <span className="font-bold">تنبيه أكاديمي هام:</span>
              <p className="text-[11px] text-amber-800 dark:text-amber-300">
                الأسئلة المعروضة هي توقعات تعليمية مولّدة بالذكاء الاصطناعي بناءً على محتوى الشرائح للمساعدة في المذاكرة الذاتية، وليست أسئلة مؤكدة لامتحانات كليتك الرسمية.
              </p>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {lecture.questions?.map((q, idx) => (
              <div
                key={q.id}
                className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
              >
                {/* Question Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center font-inter">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 uppercase">
                      {q.type}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentSlideIndex(q.sourceSlideNumber - 1);
                      setActiveTab('slides');
                    }}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    <span>المصدر: شريحة {q.sourceSlideNumber}</span>
                  </button>
                </div>

                {/* English Question */}
                <div className="medical-en text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                  {q.questionEn}
                </div>

                {/* Arabic Translation for understanding */}
                {q.questionAr && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.questionAr}
                  </p>
                )}

                {/* Options for MCQ */}
                {q.type === 'mcq' && q.options && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={cn(
                          'p-3 rounded-xl border text-xs font-medium flex items-start gap-2',
                          opt.id === q.correctAnswer
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 font-bold'
                            : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        )}
                      >
                        <span className="font-bold uppercase font-inter shrink-0">{opt.id}.</span>
                        <div className="space-y-0.5">
                          <p className="medical-en">{opt.textEn}</p>
                          {opt.textAr && <p className="text-slate-500 dark:text-slate-400">{opt.textAr}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Model answer for essay */}
                {q.type === 'essay' && q.modelAnswerEn && (
                  <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/30 space-y-2 text-xs">
                    <span className="font-bold text-sky-800 dark:text-sky-300">
                      الإجابة النموذجية (Model Answer):
                    </span>
                    <p className="medical-en text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                      {q.modelAnswerEn}
                    </p>
                    {q.modelAnswerAr && (
                      <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line leading-relaxed pt-2 border-t border-sky-100 dark:border-sky-900/40">
                        {q.modelAnswerAr}
                      </p>
                    )}
                  </div>
                )}

                {/* Rationale & Source Quote */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      <span className="font-bold text-slate-700 dark:text-slate-300">التعليل: </span>
                      {q.explanationAr || q.explanationEn}
                    </p>
                  </div>
                  {q.validationSourceQuote && (
                    <p className="medical-en text-[11px] text-slate-400 dark:text-slate-500 italic pr-5">
                      &ldquo;{q.validationSourceQuote}&rdquo;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: YOUTUBE EXTERNAL RESOURCES (Rule 20) */}
      {activeTab === 'youtube' && (
        <div className="space-y-6">
          {/* Label clearly as external resources */}
          <div className="p-4 rounded-2xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 text-xs text-rose-900 dark:text-rose-200 flex items-start gap-2.5">
            <Youtube className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">مصادر تعليمية خارجية تكميلية (External Learning Resources):</span>
              <p className="text-[11px] text-rose-800 dark:text-rose-300">
                هذه الفيديوهات من قنوات تمريضية وطبية موثوقة (مثل RegisteredNurseRN و Osmosis و Ninja Nerd) تم ربطها تلقائياً بالموضوع للمساعدة على الفهم المرئي، وليست جزءاً من المحاضرة الرسمية.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lecture.youtubeResources?.map((video) => (
              <a
                key={video.id}
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-rose-300 dark:hover:border-rose-800 transition-all flex flex-col group"
              >
                <div className="relative aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {video.duration && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-bold font-inter flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {video.duration}
                    </span>
                  )}
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400">
                      {video.channelTitle}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mt-1">
                      {video.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{video.relevanceTopic}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

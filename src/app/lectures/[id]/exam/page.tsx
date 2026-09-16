'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture, Question, ExamAttempt } from '@/types';
import {
  Award,
  ArrowRight,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);

  // Active Exam State (Starts directly with 10 questions, Rule 18)
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [showEssayModelAnswer, setShowEssayModelAnswer] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (lectureId) {
      const data = LectureRepository.getLectureById(lectureId);
      if (data) {
        setLecture(data);
        // Default: Starts immediately with 10 questions (Rule 18)
        const pool = [...(data.questions || [])];
        pool.sort(() => Math.random() - 0.5);
        setActiveQuestions(pool.slice(0, 10));
      }
    }
  }, [lectureId]);

  if (!lecture || activeQuestions.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500">
        جاري تحميل الأسئلة...
      </div>
    );
  }

  const currentQ = activeQuestions[currentIndex];
  const isLastQuestion = currentIndex === activeQuestions.length - 1;

  // Handle Option Select (Instant feedback, Rule 19)
  const handleSelectOption = (optId: string) => {
    if (isAnswerRevealed) return;

    setSelectedOption(optId);
    setIsAnswerRevealed(true);
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: optId }));

    const isCorrect =
      currentQ.correctAnswer &&
      optId.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      // Save exam attempt
      const attempt: ExamAttempt = {
        id: `attempt_${Date.now()}`,
        lectureId: lecture.id,
        date: new Date().toISOString(),
        totalQuestions: activeQuestions.length,
        score,
        percentage: Math.round((score / activeQuestions.length) * 100),
        timeSpentSeconds: 0,
        userAnswers,
        mistakeTopics: [],
        reviewQuestionIds: [],
      };
      LectureRepository.saveExamAttempt(attempt);
      setIsCompleted(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    }
  };

  const handleRestart = () => {
    const pool = [...(lecture.questions || [])];
    pool.sort(() => Math.random() - 0.5);
    setActiveQuestions(pool.slice(0, 10));
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setScore(0);
    setUserAnswers({});
    setIsCompleted(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <Link
          href={`/lectures/${lecture.id}`}
          className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع للمحاضرة</span>
        </Link>

        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 font-inter">
          {currentIndex + 1} / {activeQuestions.length}
        </span>
      </div>

      {/* COMPLETED RESULTS SCREEN (Rule 18) */}
      {isCompleted ? (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-5 animate-fade-in">
          <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Award className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              نتيجتك: {score} من {activeQuestions.length}
            </h2>
            <p className="text-sm text-slate-400 font-inter">
              {Math.round((score / activeQuestions.length) * 100)}%
            </p>
          </div>

          <div className="pt-3 flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>اختبار جديد</span>
            </button>

            <Link
              href={`/lectures/${lecture.id}`}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold"
            >
              <BookOpen className="w-4 h-4" />
              <span>العودة للمحاضرة</span>
            </Link>
          </div>
        </div>
      ) : (
        /* ONE QUESTION PER SCREEN (Rule 19) */
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-fade-in">
          {/* Question Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-bold uppercase font-inter">{currentQ.type}</span>
              <span>شريحة المصدر: {currentQ.sourceSlideNumber}</span>
            </div>

            <h3 className="medical-en text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
              {currentQ.questionEn}
            </h3>

            {currentQ.questionAr && (
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {currentQ.questionAr}
              </p>
            )}
          </div>

          {/* MCQ Options */}
          {currentQ.type === 'mcq' && currentQ.options && (
            <div className="space-y-2">
              {currentQ.options.map((opt) => {
                const isSelected = selectedOption === opt.id;
                const isCorrect =
                  currentQ.correctAnswer &&
                  opt.id.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

                let style =
                  'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100';

                if (isAnswerRevealed) {
                  if (isCorrect) {
                    style =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    style =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    disabled={isAnswerRevealed}
                    className={cn(
                      'w-full text-right p-3.5 rounded-2xl border text-xs sm:text-sm transition-all flex items-start gap-2.5',
                      style
                    )}
                  >
                    <span className="w-5 h-5 rounded-md bg-white/60 dark:bg-slate-700 flex items-center justify-center font-bold text-[11px] font-inter shrink-0 mt-0.5">
                      {opt.id}
                    </span>
                    <div className="space-y-0.5">
                      <p className="medical-en">{opt.textEn}</p>
                      {opt.textAr && <p className="text-slate-400 text-[11px]">{opt.textAr}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* True / False Options */}
          {currentQ.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-2.5">
              {['True', 'False'].map((val) => {
                const isSelected = selectedOption === val;
                const isCorrect =
                  currentQ.correctAnswer &&
                  val.trim().toLowerCase() === currentQ.correctAnswer.trim().toLowerCase();

                let style =
                  'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

                if (isAnswerRevealed) {
                  if (isCorrect) {
                    style =
                      'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                  } else if (isSelected) {
                    style =
                      'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                  }
                }

                return (
                  <button
                    key={val}
                    onClick={() => handleSelectOption(val)}
                    disabled={isAnswerRevealed}
                    className={cn(
                      'py-3.5 rounded-2xl border font-bold text-xs sm:text-sm transition-all',
                      style
                    )}
                  >
                    {val === 'True' ? 'صحيح (True)' : 'خطأ (False)'}
                  </button>
                );
              })}
            </div>
          )}

          {/* Essay Questions View (Rule 20) */}
          {currentQ.type === 'essay' && (
            <div className="space-y-3">
              <button
                onClick={() =>
                  setShowEssayModelAnswer((prev) => ({
                    ...prev,
                    [currentQ.id]: !prev[currentQ.id],
                  }))
                }
                className="w-full py-2.5 px-4 rounded-xl bg-sky-50 dark:bg-sky-950 text-sky-800 dark:text-sky-300 text-xs font-bold hover:bg-sky-100 transition-colors"
              >
                {showEssayModelAnswer[currentQ.id] ? 'إخفاء الإجابة' : 'عرض الإجابة النموذجية'}
              </button>

              {showEssayModelAnswer[currentQ.id] && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 text-xs space-y-2 animate-fade-in">
                  <p className="medical-en font-medium text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                    {currentQ.modelAnswerEn}
                  </p>
                  {currentQ.modelAnswerAr && (
                    <p className="text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-200 dark:border-slate-700 leading-relaxed">
                      {currentQ.modelAnswerAr}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Explanation revealed after answering (Rule 19) */}
          {isAnswerRevealed && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs space-y-1 animate-fade-in">
              <span className="font-bold text-slate-700 dark:text-slate-300">التعليل:</span>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentQ.explanationAr || currentQ.explanationEn}
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              disabled={!isAnswerRevealed && currentQ.type !== 'essay'}
              className={cn(
                'px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5',
                isAnswerRevealed || currentQ.type === 'essay'
                  ? 'bg-sky-700 hover:bg-sky-800 text-white shadow-xs'
                  : 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
              )}
            >
              <span>{isLastQuestion ? 'إنهاء الاختبار' : 'السؤال التالي'}</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

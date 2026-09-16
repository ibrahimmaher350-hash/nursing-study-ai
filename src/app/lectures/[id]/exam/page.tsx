'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture, Question, QuestionType, QuestionDifficulty, ExamAttempt } from '@/types';
import {
  Award,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  BookOpen,
  Flag,
  Sparkles,
  HelpCircle,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const lectureId = params?.id as string;

  const [lecture, setLecture] = useState<Lecture | null>(null);

  // Exam Setup State
  const [examState, setExamState] = useState<'setup' | 'active' | 'results'>('setup');
  const [selectedCount, setSelectedCount] = useState<number>(10);
  const [selectedType, setSelectedType] = useState<'all' | 'mcq' | 'true_false' | 'essay'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'mixed' | 'easy' | 'medium' | 'hard'>('mixed');

  // Active Exam State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Results State
  const [attemptResult, setAttemptResult] = useState<ExamAttempt | null>(null);

  useEffect(() => {
    if (lectureId) {
      const data = LectureRepository.getLectureById(lectureId);
      if (data) setLecture(data);
    }
  }, [lectureId]);

  // Timer effect during active exam
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (examState === 'active') {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [examState]);

  if (!lecture) {
    return (
      <div className="p-8 text-center text-slate-500">
        جاري تحميل بيانات الاختبار...
      </div>
    );
  }

  // Filter & Start Exam
  const handleStartExam = () => {
    let pool = [...(lecture.questions || [])];

    if (selectedType !== 'all') {
      pool = pool.filter((q) => q.type === selectedType);
    }

    if (selectedDifficulty !== 'mixed') {
      pool = pool.filter((q) => q.difficulty === selectedDifficulty);
    }

    // Shuffle pool
    pool.sort(() => Math.random() - 0.5);

    // Limit count
    const finalQuestions = pool.slice(0, Math.min(selectedCount, pool.length));

    if (finalQuestions.length === 0) {
      alert('لا توجد أسئلة كافية تطابق هذه المعايير. يرجى اختيار نوع أو صعوبة أخرى.');
      return;
    }

    setActiveQuestions(finalQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setFlaggedQuestions({});
    setTimerSeconds(0);
    setExamState('active');
  };

  // Submit Exam & Grade
  const handleSubmitExam = () => {
    let score = 0;
    const mistakeTopics: string[] = [];
    const reviewIds: string[] = [];

    activeQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      const isCorrect =
        !!userAns &&
        !!q.correctAnswer &&
        userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

      if (isCorrect) {
        score++;
      } else {
        mistakeTopics.push(`شريحة ${q.sourceSlideNumber}`);
        reviewIds.push(q.id);
      }
    });

    const percentage = Math.round((score / activeQuestions.length) * 100);

    const attempt: ExamAttempt = {
      id: `attempt_${Date.now()}`,
      lectureId: lecture.id,
      date: new Date().toISOString(),
      totalQuestions: activeQuestions.length,
      score,
      percentage,
      timeSpentSeconds: timerSeconds,
      userAnswers,
      mistakeTopics: Array.from(new Set(mistakeTopics)),
      reviewQuestionIds: reviewIds,
    };

    LectureRepository.saveExamAttempt(attempt);
    setAttemptResult(attempt);
    setExamState('results');
  };

  const currentQ = activeQuestions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* STEP 1: EXAM SETUP (Rule 14) */}
      {examState === 'setup' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/lectures/${lecture.id}`}
              className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-600 hover:text-slate-900 dark:text-slate-300"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                وضع المحاكاة والامتحانات
              </span>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                اختبار: {lecture.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
            {/* Question Count Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>1. عدد الأسئلة (Number of Questions):</span>
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[10, 20, 30, 50].map((num) => (
                  <button
                    key={num}
                    onClick={() => setSelectedCount(num)}
                    className={cn(
                      'py-3 rounded-2xl font-bold text-sm font-inter transition-all',
                      selectedCount === num
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    )}
                  >
                    {num} أسئلة
                  </button>
                ))}
              </div>
            </div>

            {/* Question Type Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                2. نوع الأسئلة (Question Types):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'all', label: 'شامل ومختلط' },
                  { id: 'mcq', label: 'MCQ اختيارات' },
                  { id: 'true_false', label: 'صواب / خطأ' },
                  { id: 'essay', label: 'مقالي متوقع' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id as unknown as typeof selectedType)}
                    className={cn(
                      'py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all',
                      selectedType === t.id
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-900 dark:text-white">
                3. مستوى الصعوبة (Difficulty):
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { id: 'mixed', label: 'مختلط' },
                  { id: 'easy', label: 'سهل' },
                  { id: 'medium', label: 'متوسط' },
                  { id: 'hard', label: 'صعب / كليات' },
                ].map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDifficulty(d.id as unknown as typeof selectedDifficulty)}
                    className={cn(
                      'py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all',
                      selectedDifficulty === d.id
                        ? 'bg-sky-600 text-white shadow-md'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                    )}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartExam}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-base shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <Award className="w-5 h-5" />
              <span>بدء الاختبار الآن</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ACTIVE EXAM (Rule 14 — Answers never exposed before submission) */}
      {examState === 'active' && currentQ && (
        <div className="space-y-6">
          {/* Header Bar: Timer & Progress */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 font-inter">
                Question {currentIndex + 1} of {activeQuestions.length}
              </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold text-xs font-inter border border-amber-200 dark:border-amber-800">
              <Clock className="w-4 h-4" />
              <span>{formatTime(timerSeconds)}</span>
            </div>

            <button
              onClick={() => {
                setFlaggedQuestions((prev) => ({
                  ...prev,
                  [currentQ.id]: !prev[currentQ.id],
                }));
              }}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors',
                flaggedQuestions[currentQ.id]
                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              )}
            >
              <Flag className="w-3.5 h-3.5" fill={flaggedQuestions[currentQ.id] ? 'currentColor' : 'none'} />
              <span>{flaggedQuestions[currentQ.id] ? 'مُعلم للمراجعة' : 'تعليم'}</span>
            </button>
          </div>

          {/* Question Navigator Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {activeQuestions.map((q, idx) => {
              const isAnswered = !!userAnswers[q.id];
              const isFlagged = !!flaggedQuestions[q.id];
              const isCurrent = idx === currentIndex;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    'w-8 h-8 rounded-xl text-xs font-bold font-inter shrink-0 transition-all',
                    isCurrent
                      ? 'ring-2 ring-sky-500 bg-sky-600 text-white'
                      : isFlagged
                      ? 'bg-rose-500 text-white'
                      : isAnswered
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  )}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-inter">
                <span className="uppercase font-bold text-sky-600">{currentQ.type}</span>
                <span>Source: Slide {currentQ.sourceSlideNumber}</span>
              </div>

              <h2 className="medical-en text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                {currentQ.questionEn}
              </h2>

              {currentQ.questionAr && (
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {currentQ.questionAr}
                </p>
              )}
            </div>

            {/* MCQ Options */}
            {currentQ.type === 'mcq' && currentQ.options && (
              <div className="space-y-2.5">
                {currentQ.options.map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt.id;

                  return (
                    <button
                      key={opt.id}
                      onClick={() =>
                        setUserAnswers((prev) => ({ ...prev, [currentQ.id]: opt.id }))
                      }
                      className={cn(
                        'w-full text-right p-4 rounded-2xl border text-sm font-medium transition-all flex items-start gap-3',
                        isSelected
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-sm ring-1 ring-sky-500'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      )}
                    >
                      <span
                        className={cn(
                          'w-6 h-6 rounded-lg font-inter font-bold text-xs flex items-center justify-center shrink-0 mt-0.5',
                          isSelected
                            ? 'bg-sky-600 text-white'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        )}
                      >
                        {opt.id}
                      </span>
                      <div className="flex-1 space-y-0.5">
                        <p className="medical-en font-semibold">{opt.textEn}</p>
                        {opt.textAr && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                            {opt.textAr}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* True / False Options */}
            {currentQ.type === 'true_false' && (
              <div className="grid grid-cols-2 gap-3">
                {['True', 'False'].map((opt) => {
                  const isSelected = userAnswers[currentQ.id] === opt;

                  return (
                    <button
                      key={opt}
                      onClick={() =>
                        setUserAnswers((prev) => ({ ...prev, [currentQ.id]: opt }))
                      }
                      className={cn(
                        'py-4 rounded-2xl border font-bold text-sm transition-all',
                        isSelected
                          ? 'border-sky-600 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 ring-1 ring-sky-500 shadow-sm'
                          : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      )}
                    >
                      {opt === 'True' ? 'صحيح (True)' : 'خطأ (False)'}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Essay Input */}
            {currentQ.type === 'essay' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500">
                  اكتب النقاط الأساسية لإجابتك (للمقارنة مع الإجابة النموذجية بعد التسليم):
                </label>
                <textarea
                  rows={4}
                  value={userAnswers[currentQ.id] || ''}
                  onChange={(e) =>
                    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: e.target.value }))
                  }
                  placeholder="اكتب إجابتك هنا..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all',
                  currentIndex === 0
                    ? 'opacity-40 cursor-not-allowed text-slate-400'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                )}
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </button>

              {currentIndex === activeQuestions.length - 1 ? (
                <button
                  onClick={handleSubmitExam}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>تسليم الاختبار وإنهاء</span>
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentIndex(Math.min(activeQuestions.length - 1, currentIndex + 1))
                  }
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <span>التالي</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULTS & MISTAKE ANALYSIS (Rule 14) */}
      {examState === 'results' && attemptResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Score Header */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-white/10 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
              <Award className="w-9 h-9" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold">
              نتيجة الاختبار: {attemptResult.score} من {attemptResult.totalQuestions}
            </h2>

            <div className="inline-block px-4 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 font-bold text-sm font-inter">
              نسبة التحصيل: {attemptResult.percentage}%
            </div>

            <p className="text-xs text-slate-300">
              الوقت المستغرق: {formatTime(attemptResult.timeSpentSeconds)}
            </p>

            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => setExamState('setup')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة الاختبار</span>
              </button>

              <Link
                href={`/lectures/${lecture.id}`}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>العودة للمحاضرة</span>
              </Link>
            </div>
          </div>

          {/* Mistakes & Topic Analysis (Rule 14) */}
          {attemptResult.mistakeTopics.length > 0 && (
            <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                  مواضيع تحتاج مراجعتها (Topics Requiring Review):
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {attemptResult.mistakeTopics.map((topic, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 shadow-xs"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question Review List */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              مراجعة وتصحيح الأسئلة مع الشرائح المصدرية
            </h3>

            {activeQuestions.map((q, idx) => {
              const userAns = userAnswers[q.id];
              const isCorrect =
                !!userAns &&
                !!q.correctAnswer &&
                userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();

              return (
                <div
                  key={q.id}
                  className={cn(
                    'p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-sm space-y-4',
                    isCorrect
                      ? 'border-emerald-200 dark:border-emerald-900/60'
                      : 'border-rose-200 dark:border-rose-900/60'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold flex items-center justify-center font-inter">
                        {idx + 1}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>إجابة صحيحة</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-bold text-rose-600">
                          <XCircle className="w-4 h-4" />
                          <span>إجابة خاطئة</span>
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/lectures/${lecture.id}`}
                      className="text-xs font-bold text-sky-600 hover:underline flex items-center gap-1"
                    >
                      <span>شريحة المصدر {q.sourceSlideNumber}</span>
                    </Link>
                  </div>

                  <div className="medical-en text-sm font-bold text-slate-900 dark:text-white">
                    {q.questionEn}
                  </div>

                  <div className="text-xs space-y-1 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl">
                    <p className="text-slate-600 dark:text-slate-300">
                      <span className="font-bold">إجابتك: </span>
                      {userAns || 'لم تتم الإجابة'}
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-300 font-bold">
                      <span>الإجابة الصحيحة: </span>
                      {q.correctAnswer}
                    </p>
                  </div>

                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p>
                      <span className="font-bold text-slate-700 dark:text-slate-200">التعليل: </span>
                      {q.explanationAr || q.explanationEn}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

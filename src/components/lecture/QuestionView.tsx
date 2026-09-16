'use client';

import React, { useState } from 'react';
import { Lecture, Question } from '@/types';
import { Award, CheckCircle2, XCircle, HelpCircle, RotateCcw, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionViewProps {
  lecture: Lecture;
}

export function QuestionView({ lecture }: QuestionViewProps) {
  const questions = lecture.questions || [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});
  const [filterType, setFilterType] = useState<'all' | 'mcq' | 'true_false'>('all');

  const filteredQuestions = questions.filter((q) => {
    if (filterType === 'all') return true;
    return q.type === filterType;
  });

  const handleSelectAnswer = (questionId: string, answerId: string) => {
    if (revealedAnswers[questionId]) return; // already answered
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answerId }));
    setRevealedAnswers((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setRevealedAnswers({});
  };

  if (questions.length === 0) {
    return (
      <div className="max-w-[880px] mx-auto p-12 text-center text-slate-400 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800">
        لا توجد أسئلة مجهزة لهذه المحاضرة حتى الآن.
      </div>
    );
  }

  // Calculate score
  const answeredCount = Object.keys(revealedAnswers).length;
  const correctCount = questions.filter(
    (q) => selectedAnswers[q.id] === q.correctAnswer
  ).length;

  return (
    <div className="w-full max-w-[880px] mx-auto bg-white dark:bg-[#111827] shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl md:rounded-4xl px-5 py-8 sm:px-12 sm:py-14 text-right space-y-8 animate-fade-in">
      {/* Header */}
      <header className="pb-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Award className="w-4 h-4" />
            <span>بنك أسئلة وتدريب المحاضرة</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            اختبر فهمك للمحاضرة
          </h2>
          <p className="text-xs text-slate-400">
            {questions.length} أسئلة تدريبية مع تصحيح فوري وشرح إكلينيكي
          </p>
        </div>

        {answeredCount > 0 && (
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-center">
              <span className="text-xs text-slate-500 block">النتيجة:</span>
              <span className="text-base font-bold text-amber-900 dark:text-amber-200 font-mono">
                {correctCount} / {answeredCount}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title="إعادة المحاولة"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        )}
      </header>

      {/* Questions List */}
      <div className="space-y-6">
        {filteredQuestions.map((q, idx) => {
          const isAnswered = !!revealedAnswers[q.id];
          const chosenAnswer = selectedAnswers[q.id];
          const isCorrect = chosenAnswer === q.correctAnswer;

          return (
            <div
              key={q.id || idx}
              className="p-5 sm:p-6 rounded-3xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-4 text-right"
            >
              {/* Question Header */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  السؤال {idx + 1}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  {q.type === 'mcq' ? 'اختيار من متعدد' : 'صح أو خطأ'}
                </span>
              </div>

              {/* Question Text in English & Arabic */}
              <div className="space-y-1.5">
                <p className="font-sans text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 text-left leading-relaxed">
                  {q.questionEn}
                </p>
                {q.questionAr && (
                  <p className="font-cairo text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {q.questionAr}
                  </p>
                )}
              </div>

              {/* MCQ Options */}
              {q.options && q.options.length > 0 && (
                <div className="space-y-2 pt-2">
                  {q.options.map((opt) => {
                    const isSelected = chosenAnswer === opt.id;
                    const isRightOption = q.correctAnswer === opt.id;

                    return (
                      <button
                        key={opt.id}
                        disabled={isAnswered}
                        onClick={() => handleSelectAnswer(q.id, opt.id)}
                        className={cn(
                          'w-full p-3.5 rounded-2xl border text-xs sm:text-sm font-semibold transition-all flex items-start justify-between gap-3 text-right',
                          !isAnswered
                            ? 'border-slate-200 dark:border-slate-700 hover:border-sky-400 dark:hover:border-sky-600 hover:bg-sky-50/40 dark:hover:bg-sky-950/30 text-slate-700 dark:text-slate-200'
                            : isRightOption
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200'
                            : isSelected
                            ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-900 dark:text-rose-200'
                            : 'opacity-40 border-slate-200 dark:border-slate-800 text-slate-400'
                        )}
                      >
                        <div className="flex items-start gap-2.5">
                          <span
                            className={cn(
                              'font-mono text-xs font-bold px-2 py-0.5 rounded-md mt-0.5',
                              isSelected
                                ? isRightOption
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-rose-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            )}
                          >
                            {opt.id}
                          </span>
                          <div className="space-y-0.5">
                            <span className="font-sans block text-left">{opt.textEn}</span>
                            {opt.textAr && (
                              <span className="font-cairo text-xs text-slate-500 dark:text-slate-400 block text-right">
                                {opt.textAr}
                              </span>
                            )}
                          </div>
                        </div>

                        {isAnswered && (
                          <div className="shrink-0 mt-0.5">
                            {isRightOption ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : isSelected ? (
                              <XCircle className="w-4 h-4 text-rose-600" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation (Shown when answered) */}
              {isAnswered && (
                <div
                  className={cn(
                    'p-4 rounded-2xl border text-xs space-y-1.5 animate-fade-in',
                    isCorrect
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200'
                      : 'bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200'
                  )}
                >
                  <div className="flex items-center gap-1.5 font-bold">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>إجابة صحيحة وممتازة!</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>إجابة غير صحيحة. الإجابة الصحيحة هي ({q.correctAnswer})</span>
                      </>
                    )}
                  </div>
                  <p className="font-sans text-left leading-relaxed">{q.explanationEn}</p>
                  {q.explanationAr && (
                    <p className="font-cairo text-right leading-relaxed pt-1 border-t border-slate-200/50 dark:border-slate-700/50">
                      {q.explanationAr}
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { Lecture } from '@/types';
import { Sparkles, AlertOctagon, HeartPulse, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface SummaryViewProps {
  lecture: Lecture;
}

export function SummaryView({ lecture }: SummaryViewProps) {
  const summary = lecture.summary;

  if (!summary) {
    return (
      <div className="max-w-[880px] mx-auto p-12 text-center text-slate-400 bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800">
        الملخص لم يتم تجهيزه بعد لهذه المحاضرة.
      </div>
    );
  }

  return (
    <div className="w-full max-w-[880px] mx-auto bg-white dark:bg-[#111827] shadow-xl border border-slate-200/80 dark:border-slate-800 rounded-3xl md:rounded-4xl px-5 py-8 sm:px-12 sm:py-14 text-right space-y-10 animate-fade-in">
      {/* Header */}
      <header className="pb-6 border-b border-slate-100 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Sparkles className="w-4 h-4" />
          <span>الملخص الأكاديمي الإكلينيكي</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          ملخص {lecture.title}
        </h2>
        <p className="text-xs text-slate-400">
          مراجعة مركزة لأهم المفاهيم، والنقاط الإكلينيكية، وتنبيهات الطوارئ
        </p>
      </header>

      {/* 1. Quick Review */}
      {summary.quickReview && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <h3>{summary.quickReview.titleAr || 'المراجعة السريعة'}</h3>
          </div>

          <div className="space-y-2.5">
            {summary.quickReview.points.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 space-y-1"
              >
                <p className="font-sans text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 text-left">
                  {pt.en}
                </p>
                <p className="font-cairo text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {pt.ar}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Standard Summary Sections */}
      {summary.standardSummary && summary.standardSummary.sections?.length > 0 && (
        <section className="space-y-5">
          {summary.standardSummary.sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-200/50 dark:border-slate-700 pb-2">
                <h4 className="font-cairo text-sm font-bold text-slate-900 dark:text-white">
                  {sec.headingAr}
                </h4>
                <span className="font-sans text-xs font-semibold text-slate-500">
                  {sec.headingEn}
                </span>
              </div>

              <div className="space-y-2">
                <p className="font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed text-left">
                  {sec.contentEn}
                </p>
                <p className="font-cairo text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {sec.contentAr}
                </p>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* 3. Emergency & Resuscitation Alerts */}
      {summary.detailedReview?.emergencyAlerts?.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400">
            <ShieldAlert className="w-4 h-4" />
            <h3>تنبيهات الطوارئ والسلامة (Emergency Alerts)</h3>
          </div>

          <div className="space-y-2.5">
            {summary.detailedReview.emergencyAlerts.map((alert, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/40 space-y-1"
              >
                <p className="font-sans text-xs sm:text-sm font-semibold text-rose-900 dark:text-rose-200 text-left">
                  {alert.en}
                </p>
                <p className="font-cairo text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
                  {alert.ar}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Clinical Key Points & Pearls */}
      {summary.detailedReview?.clinicalKeyPoints?.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400">
            <HeartPulse className="w-4 h-4" />
            <h3>النقاط التمريضية الإكلينيكية الذهبية (Clinical Pearls)</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {summary.detailedReview.clinicalKeyPoints.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30 space-y-1"
              >
                <p className="font-sans text-xs font-semibold text-slate-800 dark:text-slate-200 text-left">
                  {pt.en}
                </p>
                <p className="font-cairo text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {pt.ar}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

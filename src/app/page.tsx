'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Upload,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Volume2,
  Sparkles,
  FileCheck2,
  HelpCircle,
  Award,
  ShieldAlert,
  GraduationCap,
  Layers,
  ChevronRight,
  Bookmark,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture } from '@/types';

export default function HomePage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  useEffect(() => {
    setLectures(LectureRepository.getLectures());
  }, []);

  const workflowSteps = [
    {
      num: '01',
      titleEn: 'Upload Lecture',
      titleAr: 'رفع المحاضرة',
      desc: 'دعم ملفات PDF و PPT و PPTX مع استخراج دقيق للشرائح والجداول والقوائم.',
      icon: Upload,
      color: 'from-blue-600 to-sky-600',
    },
    {
      num: '02',
      titleEn: 'Medical Translation',
      titleAr: 'الترجمة الطبية',
      desc: 'ترجمة أكاديمية للمصطلحات التمريضية مع حفظ النص الإنجليزي الأصلي جنباً إلى جنب.',
      icon: FileCheck2,
      color: 'from-sky-600 to-teal-600',
    },
    {
      num: '03',
      titleEn: 'Pronunciation',
      titleAr: 'النطق الصوتي',
      desc: 'استماع للنطق الطبي الدقيق بالسرعات المناسبة (0.75x و 1x و 1.25x) مع الرموز الصوتية IPA.',
      icon: Volume2,
      color: 'from-teal-600 to-emerald-600',
    },
    {
      num: '04',
      titleEn: 'Summary',
      titleAr: 'الملخص الأكاديمي',
      desc: 'مراجعة سريعة قبل الامتحان في 5 دقائق، وملخص معياري، وملاحظات إكلينيكية هامة.',
      icon: Layers,
      color: 'from-emerald-600 to-amber-600',
    },
    {
      num: '05',
      titleEn: 'Exam Questions',
      titleAr: 'أسئلة مدققة',
      desc: 'توليد أسئلة اختيار من متعدد وصواب/خطأ ومقالي مع توثيق رقم الشريحة المصدرية.',
      icon: HelpCircle,
      color: 'from-amber-600 to-rose-600',
    },
    {
      num: '06',
      titleEn: 'Practice',
      titleAr: 'الممارسة والامتحان',
      desc: 'وضع اختبار تفاعلي بوقت محدد، وحساب النتيجة الفورية، وتشخيص نقاط الضعف.',
      icon: Award,
      color: 'from-rose-600 to-indigo-600',
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-sky-900/50">
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-semibold border border-sky-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>المنصة الأولى المخصصة لطلاب التمريض بالجامعات المصرية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Nursing Study AI
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            حوّل محاضرات التمريض الإنجليزية إلى مذكرة عربية ذكية تساعدك على الفهم، والترجمة، والنطق، والمراجعة، والاستعداد للامتحان.
          </p>

          {/* Action Buttons */}
          <div className="pt-3 flex flex-wrap items-center gap-3">
            <Link
              href="/lectures"
              className="px-6 py-3.5 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <BookOpen className="w-4 h-4" />
              <span>ابدأ بمحاضرتك</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="px-5 py-3.5 rounded-xl text-sm font-bold bg-white/10 hover:bg-white/20 text-slate-200 border border-white/15 flex items-center gap-2 transition-all"
            >
              <HelpCircle className="w-4 h-4" />
              <span>كيف يعمل؟</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle medical emblem */}
        <div className="absolute left-[-20px] bottom-[-20px] opacity-10 pointer-events-none hidden sm:block">
          <GraduationCap className="w-72 h-72 text-sky-400" />
        </div>
      </section>

      {/* Visual Workflow Section (Always or Toggleable) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-sky-600" />
              <span>مسار المذاكرة الذكي (Study Workflow)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              خطوات علمية مدروسة لتحويل المحاضرة إلى مادة مفهومة ومحفورة في الذاكرة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold text-slate-400 dark:text-slate-500 font-inter">
                    {step.num}
                  </span>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white shadow-sm`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      {step.titleAr}
                    </h3>
                    <span className="text-[11px] font-inter text-slate-400 dark:text-slate-500">
                      ({step.titleEn})
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick Dashboard & Recent Lectures Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-6 rounded bg-emerald-600" />
              <span>محاضراتي والمتابعة الدراسية</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              تابع مذاكرتك وافتح المحاضرات والملخصات والاختبارات التفاعلية
            </p>
          </div>

          <Link
            href="/lectures"
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            <span>كل المحاضرات ({lectures.length})</span>
            <ChevronRight className="w-4 h-4 rotate-180" />
          </Link>
        </div>

        {/* Featured Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300">
                    {lecture.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>مكتملة ومجهزة</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600">
                    {lecture.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {lecture.slideCount} شرائح دراسية • {lecture.terms?.length || 0} مصطلحات طبية • {lecture.questions?.length || 0} أسئلة اختبار
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/lectures/${lecture.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>فتح المذاكرة</span>
                </Link>

                <Link
                  href={`/lectures/${lecture.id}/exam`}
                  className="py-2 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>بدء الاختبار</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Action Badges */}
      <section className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <Link
            href="/lectures"
            className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-all"
          >
            <Upload className="w-5 h-5 mx-auto text-sky-600 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">رفع محاضرة</div>
            <div className="text-[10px] text-slate-400">PDF / PPTX</div>
          </Link>

          <Link
            href="/dictionary"
            className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-all"
          >
            <Bookmark className="w-5 h-5 mx-auto text-purple-600 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">قاموس المصطلحات</div>
            <div className="text-[10px] text-slate-400">نطق وترجمة طبية</div>
          </Link>

          <Link
            href="/lectures/lecture_shock_001/exam"
            className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-all"
          >
            <Award className="w-5 h-5 mx-auto text-amber-600 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">وضع الامتحان</div>
            <div className="text-[10px] text-slate-400">MCQ وصواب وخطأ</div>
          </Link>

          <Link
            href="/lectures/lecture_shock_001"
            className="p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm hover:shadow transition-all"
          >
            <Sparkles className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">شرح بالمصري</div>
            <div className="text-[10px] text-slate-400">تبسيط المحاضرة</div>
          </Link>
        </div>
      </section>

      {/* Medical Ethics & Scientific Integrity Card */}
      <section className="p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
          <p className="font-bold">
            ميثاق الأمانة العلمية والدقة الطبية لطلاب التمريض:
          </p>
          <p className="text-amber-800 dark:text-amber-300/90 text-[11px]">
            تلتزم المنصة بعدم تحريف أو استبدال أي محتوى علمي أو دوائي من محاضراتك الرسمية. النص الإنجليزي يُعرض دائماً كما ورد من المحاضر، وتُفصل الترجمات والشروحات والأسئلة المولدة بصرياً، ولا تُعد الأسئلة المتوقعة بديلاً عن امتحانات كليتك أو قرارات التدريب الإكلينيكي.
          </p>
        </div>
      </section>
    </div>
  );
}

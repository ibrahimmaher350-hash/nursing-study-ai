'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { LectureRepository } from '@/lib/storage/repository';
import {
  User,
  GraduationCap,
  Moon,
  Sun,
  ShieldCheck,
  RotateCcw,
  Key,
  Database,
  CheckCircle2,
  BookOpen,
  Award,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();

  const [studentName, setStudentName] = useState('طالب تمريض مصري');
  const [university, setUniversity] = useState('كلية التمريض — جامعة القاهرة / دمياط');
  const [academicYear, setAcademicYear] = useState('الفرقة الثالثة (حالات حرجة وطوارئ)');
  const [isSaved, setIsSaved] = useState(false);

  const [examAttemptsCount, setExamAttemptsCount] = useState(0);
  const [bookmarkedCount, setBookmarkedCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('nursing_student_name');
      const savedUni = localStorage.getItem('nursing_student_uni');
      const savedYear = localStorage.getItem('nursing_student_year');
      if (savedName) setStudentName(savedName);
      if (savedUni) setUniversity(savedUni);
      if (savedYear) setAcademicYear(savedYear);

      const attempts = LectureRepository.getExamAttempts();
      setExamAttemptsCount(attempts.length);

      const terms = LectureRepository.getAllTerms();
      setBookmarkedCount(terms.filter((t) => t.isBookmarked).length);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('nursing_student_name', studentName);
      localStorage.setItem('nursing_student_uni', university);
      localStorage.setItem('nursing_student_year', academicYear);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        'هل تريد استعادة البيانات الافتراضية للمنصة ومحاضرة الصدمات النموذجية؟'
      )
    ) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nursing_study_ai_lectures_v1');
        localStorage.removeItem('nursing_study_ai_attempts_v1');
        window.location.reload();
      }
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-6 h-6 text-sky-600" />
          <span>الملف الدراسي والإعدادات</span>
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تخصيص بيانات دراستك الجامعية، إعدادات المظهر، ومفاتيح الذكاء الاصطناعي
        </p>
      </div>

      {/* Quick Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1">
          <Award className="w-5 h-5 mx-auto text-amber-500" />
          <div className="text-lg font-bold font-inter text-slate-900 dark:text-white">
            {examAttemptsCount}
          </div>
          <div className="text-[11px] text-slate-400">اختبارات منجزة</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1">
          <BookOpen className="w-5 h-5 mx-auto text-purple-500" />
          <div className="text-lg font-bold font-inter text-slate-900 dark:text-white">
            {bookmarkedCount}
          </div>
          <div className="text-[11px] text-slate-400">مصطلحات محفوظة</div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs text-center space-y-1 col-span-2 sm:col-span-1">
          <GraduationCap className="w-5 h-5 mx-auto text-sky-500" />
          <div className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {academicYear.split(' ')[0]} {academicYear.split(' ')[1]}
          </div>
          <div className="text-[11px] text-slate-400">المستوى الدراسي</div>
        </div>
      </div>

      {/* Student Profile Form */}
      <form
        onSubmit={handleSaveProfile}
        className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5"
      >
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-sky-600" />
          <span>البيانات الأكاديمية للطالب</span>
        </h2>

        <div className="space-y-4 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              اسم الطالب / الممرض:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              الجامعة / المعهد:
            </label>
            <input
              type="text"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 dark:text-slate-300">
              الفرقة الدراسية:
            </label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="الفرقة الأولى (أساسيات التمريض)">الفرقة الأولى (أساسيات التمريض Fundamentals)</option>
              <option value="الفرقة الثانية (تمريض باطني وجراحي)">الفرقة الثانية (تمريض باطني وجراحي Medical-Surgical)</option>
              <option value="الفرقة الثالثة (حالات حرجة وطوارئ)">الفرقة الثالثة (حالات حرجة وطوارئ Critical Care)</option>
              <option value="الفرقة الرابعة (إدارة وتمريض أطفال ونسا)">الفرقة الرابعة (إدارة تمريضية، أطفال، ونسا)</option>
              <option value="سنة الامتياز (Internship)">سنة الامتياز والتدريب الإكلينيكي (Internship)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-sm transition-all"
          >
            حفظ التغييرات
          </button>

          {isSaved && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ البيانات بنجاح</span>
            </span>
          )}
        </div>
      </form>

      {/* Theme & Display Options */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-5 h-5 text-amber-400" /> : <Sun className="w-5 h-5 text-sky-600" />}
          <span>مظهر التطبيق والوضع الليلي (Dark Mode)</span>
        </h2>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
              الوضع الليلي المريح للعين
            </span>
            <p className="text-[11px] text-slate-400">
              تصميم مريح للقراءة والمذاكرة الطويلة في المستشفيات وأثناء النبطشيات
            </p>
          </div>

          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
          >
            {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
          </button>
        </div>
      </div>

      {/* API Key Instructions & Security (Rule 27) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-600" />
          <span>حماية وتأمين مفاتيح الذكاء الاصطناعي (API Security)</span>
        </h2>

        <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 space-y-2 text-xs text-purple-950 dark:text-purple-200 leading-relaxed">
          <p className="font-bold">
            مبدأ الأمان التام: مفاتيحك الخاصة لا تُكشف أبداً للمتصفح.
          </p>
          <p className="text-slate-600 dark:text-slate-400 text-[11px]">
            لإجراء تحليلات مباشرة مع Gemini، يتم حفظ المفتاح في ملف البيئة السري <code className="bg-purple-100 dark:bg-purple-900/50 px-1 py-0.5 rounded font-inter">.env.local</code> باسم <code className="font-inter">GEMINI_API_KEY</code> ويتم استدعاؤه من خلال خادم آمن، لحماية رصيدك المجاني من أي استهلاك غير مصرح به.
          </p>
        </div>
      </div>

      {/* Storage Reset Action */}
      <div className="p-6 rounded-3xl bg-slate-100/60 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
            استعادة بيانات المنصة النموذجية
          </span>
          <p className="text-[11px] text-slate-400">
            إعادة تحميل محاضرة الصدمات النموذجية والاختبارات المصاحبة
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-200 dark:border-rose-900/40 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>استعادة</span>
        </button>
      </div>
    </div>
  );
}

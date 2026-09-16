'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { Moon, Sun, RotateCcw, Check, User } from 'lucide-react';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();

  const [studentName, setStudentName] = useState('طالب تمريض');
  const [academicYear, setAcademicYear] = useState('الفرقة الثالثة (حالات حرجة)');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('nursing_student_name');
      const savedYear = localStorage.getItem('nursing_student_year');
      if (savedName) setStudentName(savedName);
      if (savedYear) setAcademicYear(savedYear);
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('nursing_student_name', studentName);
      localStorage.setItem('nursing_student_year', academicYear);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleResetData = () => {
    if (confirm('هل تريد استعادة البيانات الافتراضية للمنصة؟')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nursing_study_ai_lectures_v1');
        localStorage.removeItem('nursing_study_ai_attempts_v1');
        window.location.reload();
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        حسابي والإعدادات
      </h1>

      {/* Theme Switch */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div className="space-y-0.5">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
            الوضع الليلي (Dark Mode)
          </span>
          <p className="text-xs text-slate-400">
            قراءة مريحة للعين في النبطشيات والمستشفيات
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          {theme === 'dark' ? 'الوضع النهاري' : 'الوضع الليلي'}
        </button>
      </div>

      {/* Student Form */}
      <form
        onSubmit={handleSave}
        className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
      >
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            الاسم:
          </label>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
            الفرقة الدراسية:
          </label>
          <input
            type="text"
            value={academicYear}
            onChange={(e) => setAcademicYear(e.target.value)}
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs shadow-xs"
          >
            حفظ
          </button>

          {isSaved && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>تم الحفظ</span>
            </span>
          )}
        </div>
      </form>

      {/* Reset data */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          استعادة المحاضرات الافتراضية
        </span>
        <button
          onClick={handleResetData}
          className="text-xs text-rose-600 hover:underline font-semibold"
        >
          استعادة
        </button>
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  BookOpen,
  BookMarked,
  Award,
  User,
  ShieldCheck,
  Zap,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'الرئيسية', href: '/', icon: Home, badge: null },
    { label: 'مكتبة المحاضرات', href: '/lectures', icon: BookOpen, badge: 'جاهز' },
    { label: 'قاموس المصطلحات', href: '/dictionary', icon: BookMarked, badge: 'نطق' },
    { label: 'وضع الامتحان', href: '/lectures/lecture_shock_001/exam', icon: Award, badge: 'مصحح' },
    { label: 'ملف الطالب والإعدادات', href: '/profile', icon: User, badge: null },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 min-h-[calc(100vh-4rem)] select-none">
      {/* Navigation Items */}
      <div className="space-y-1">
        <p className="px-3 py-2 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          التنقل الدراسي
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group',
                isActive
                  ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform group-hover:scale-110',
                    isActive
                      ? 'text-sky-700 dark:text-sky-400 stroke-[2.2]'
                      : 'text-slate-400 dark:text-slate-500'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Featured Nursing Lecture Card */}
      <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-sky-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300">
            محاضرة قياسية جاهزة
          </span>
        </div>
        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">
          Types of Shock (أنواع الصدمات وتدابير التمريض)
        </h4>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          6 شرائح كاملة، نطق صوتي، مصطلحات، وأسئلة امتحانات معتمدة.
        </p>
        <Link
          href="/lectures/lecture_shock_001"
          className="mt-3 flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-lg text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-sm transition-all"
        >
          <span>فتح المحاضرة</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Medical Integrity Badge */}
      <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              مبدأ الأمانة العلمية:
            </span>{' '}
            النص الأصلي محفوظ حرفياً، وتفصل الترجمة والشرح والأسئلة بوضوح تام.
          </p>
        </div>
      </div>
    </aside>
  );
}

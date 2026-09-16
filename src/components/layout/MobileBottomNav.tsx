'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BookMarked, Award, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: 'الرئيسية', href: '/', icon: Home },
    { label: 'محاضراتي', href: '/lectures', icon: BookOpen },
    { label: 'القاموس', href: '/dictionary', icon: BookMarked },
    { label: 'الاختبارات', href: '/lectures/lecture_shock_001/exam', icon: Award },
    { label: 'ملفي', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 safe-area-pb shadow-lg">
      <div className="flex items-center justify-around max-w-md mx-auto">
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
                'flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all min-w-[56px]',
                isActive
                  ? 'text-sky-700 dark:text-sky-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              )}
            >
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center transition-all',
                  isActive && 'bg-sky-100 dark:bg-sky-950/80 shadow-sm'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

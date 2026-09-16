'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BookMarked, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DesktopSidebar() {
  const pathname = usePathname();

  // Clean 4-item desktop navigation (Rule 25)
  const navItems = [
    { label: 'الرئيسية', href: '/', icon: Home },
    { label: 'مكتبتي الدراسية', href: '/lectures', icon: BookOpen },
    { label: 'القاموس الطبي', href: '/dictionary', icon: BookMarked },
    { label: 'حسابي', href: '/profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col w-60 border-l border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 min-h-[calc(100vh-4rem)] select-none">
      <div className="space-y-1">
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
                'flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-semibold transition-all',
                isActive
                  ? 'bg-sky-50 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon
                className={cn(
                  'w-5 h-5',
                  isActive
                    ? 'text-sky-700 dark:text-sky-400 stroke-[2.2]'
                    : 'text-slate-400'
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}

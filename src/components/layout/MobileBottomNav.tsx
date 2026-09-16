'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BookMarked, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileBottomNav() {
  const pathname = usePathname();

  // Clean 4-tab mobile navigation (Rule 24)
  const navItems = [
    { label: 'الرئيسية', href: '/', icon: Home },
    { label: 'مكتبتي', href: '/lectures', icon: BookOpen },
    { label: 'القاموس', href: '/dictionary', icon: BookMarked },
    { label: 'حسابي', href: '/profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/80 dark:border-slate-800 px-3 py-1.5 shadow-lg">
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
                'flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all min-w-[64px]',
                isActive
                  ? 'text-sky-700 dark:text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              )}
            >
              <div
                className={cn(
                  'w-9 h-8 rounded-xl flex items-center justify-center transition-all',
                  isActive && 'bg-sky-50 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400'
                )}
              >
                <Icon className={cn('w-5 h-5', isActive ? 'stroke-[2.5]' : 'stroke-[1.8]')} />
              </div>
              <span className="text-[11px] tracking-tight mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

'use client';

import React, { useState } from 'react';
import { SlideExplanation } from '@/types';
import { X, Sparkles, Globe, HeartHandshake, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExplainModalProps {
  isOpen: boolean;
  onClose: () => void;
  slideTitle: string;
  slideNumber: number;
  explanation?: SlideExplanation;
}

export function ExplainModal({
  isOpen,
  onClose,
  slideTitle,
  slideNumber,
  explanation,
}: ExplainModalProps) {
  const [activeTab, setActiveTab] = useState<'egyptian' | 'arabic' | 'english'>('egyptian');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-sky-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                شرح توضيحي للشريحة #{slideNumber}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">
                {slideTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Disclaimer Alert */}
        <div className="px-5 py-2.5 bg-purple-50 dark:bg-purple-950/40 border-b border-purple-100 dark:border-purple-900/40 text-[11px] text-purple-800 dark:text-purple-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>
            هذا الشرح مولّد بالذكاء الاصطناعي لتبسيط الفهم، ولا يغير أو يستبدل نص المحاضرة الأصلي.
          </span>
        </div>

        {/* Mode Tabs */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('egyptian')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              activeTab === 'egyptian'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            )}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>شرح بالمصري</span>
          </button>

          <button
            onClick={() => setActiveTab('arabic')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              activeTab === 'arabic'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>عربي أكاديمي</span>
          </button>

          <button
            onClick={() => setActiveTab('english')}
            className={cn(
              'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              activeTab === 'english'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            )}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Simple English</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'egyptian' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                <p className="text-slate-800 dark:text-purple-100 font-medium whitespace-pre-line leading-loose">
                  {explanation?.egyptianArabic ||
                    'جاري تجهيز الشرح التوضيحي باللهجة المصرية لزملائنا التمريض...'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'arabic' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30">
                <p className="text-slate-800 dark:text-sky-100 font-medium whitespace-pre-line leading-loose">
                  {explanation?.arabic ||
                    'شرح أكاديمي مبسط لمفاهيم الشريحة التمريضية.'}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'english' && (
            <div className="space-y-3 medical-en">
              <div className="p-4 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <p className="text-slate-800 dark:text-emerald-100 font-medium whitespace-pre-line leading-loose">
                  {explanation?.simpleEnglish ||
                    'Simple plain English breakdown of the clinical concepts.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}

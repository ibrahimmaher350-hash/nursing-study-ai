'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';

interface RenameLectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRename: (newTitle: string) => void;
  currentTitle: string;
}

export const RenameLectureModal: React.FC<RenameLectureModalProps> = ({
  isOpen,
  onClose,
  onRename,
  currentTitle,
}) => {
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    if (isOpen) {
      setTitle(currentTitle);
    }
  }, [isOpen, currentTitle]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onRename(title.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-sky-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              إعادة تسمية المحاضرة
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-right">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              عنوان المحاضرة:
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="اكتب اسم المحاضرة..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all text-right font-medium"
            />
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="submit"
              disabled={!title.trim() || title === currentTitle}
              className="flex-1 py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
            >
              حفظ
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

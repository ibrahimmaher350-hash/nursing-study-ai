'use client';

import React from 'react';
import { AlertTriangle, X, Trash2, Folder, BookOpen } from 'lucide-react';

interface DeleteSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  folderName: string;
  folderType: 'folder' | 'subject';
  subfolderCount: number;
  lectureCount: number;
}

export const DeleteSafetyModal: React.FC<DeleteSafetyModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  folderName,
  folderType,
  subfolderCount,
  lectureCount,
}) => {
  if (!isOpen) return null;

  const hasContents = subfolderCount > 0 || lectureCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-rose-200 dark:border-rose-950/60 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-rose-600">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              حذف {folderType === 'subject' ? 'المادة' : 'الفولدر'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 text-right">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            هل أنت متأكد من حذف &ldquo;{folderName}&rdquo;؟
          </p>

          {hasContents ? (
            <div className="p-4 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 space-y-2">
              <p className="text-xs font-semibold text-rose-800 dark:text-rose-300">
                هذا {folderType === 'subject' ? 'المحتوى' : 'الفولدر'} يحتوي على:
              </p>
              <div className="space-y-1 text-xs text-rose-700 dark:text-rose-400 pr-2">
                {lectureCount > 0 && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{lectureCount} {lectureCount === 1 ? 'محاضرة' : 'محاضرات'}</span>
                  </div>
                )}
                {subfolderCount > 0 && (
                  <div className="flex items-center gap-2">
                    <Folder className="w-3.5 h-3.5" />
                    <span>{subfolderCount} {subfolderCount === 1 ? 'فولدر فرعي' : 'فولدرات فرعية ومواد'}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-rose-600 dark:text-rose-400/80 pt-1 font-medium">
                سيتم حذف الفولدر وجميع المحاضرات والمواد الموجودة بداخله نهائياً!
              </p>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              هذا {folderType === 'subject' ? 'المادة فارغة' : 'الفولدر فارغ'}، ولا توجد به أي محاضرات.
            </p>
          )}

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>{hasContents ? 'حذف الكل' : 'تأكيد الحذف'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

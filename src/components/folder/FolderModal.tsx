'use client';

import React, { useState, useEffect } from 'react';
import { Folder, BookMarked, X, Check } from 'lucide-react';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: 'folder' | 'subject', color: string) => void;
  mode?: 'create' | 'edit';
  initialName?: string;
  initialType?: 'folder' | 'subject';
  initialColor?: string;
  parentFolderName?: string | null;
}

const COLOR_OPTIONS = [
  { id: 'sky', bg: 'bg-sky-500', label: 'أزرق سماوي' },
  { id: 'purple', bg: 'bg-purple-500', label: 'بنفسجي' },
  { id: 'emerald', bg: 'bg-emerald-500', label: 'أخضر زمردي' },
  { id: 'amber', bg: 'bg-amber-500', label: 'عنبري' },
  { id: 'rose', bg: 'bg-rose-500', label: 'وردي' },
  { id: 'indigo', bg: 'bg-indigo-500', label: 'نيلي' },
];

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  mode = 'create',
  initialName = '',
  initialType = 'folder',
  initialColor = 'sky',
  parentFolderName = null,
}) => {
  const [name, setName] = useState(initialName);
  const [type, setType] = useState<'folder' | 'subject'>(initialType);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setType(initialType);
      setColor(initialColor);
    }
  }, [isOpen, initialName, initialType, initialColor]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim(), type, color);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {mode === 'edit'
                ? 'تعديل ' + (type === 'subject' ? 'المادة' : 'الفولدر')
                : 'إنشاء ' + (type === 'subject' ? 'مادة دراسية' : 'فولدر جديد')}
            </h3>
            {parentFolderName && (
              <p className="text-xs text-slate-400 mt-0.5">
                داخل: <span className="font-semibold text-slate-600 dark:text-slate-300">{parentFolderName}</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-right">
          {/* Type Switcher (only in create mode) */}
          {mode === 'create' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                نوع العنصر:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('folder')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'folder'
                      ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Folder className="w-4 h-4" />
                  <span>فولدر (لتنظيم السنوات/الترم)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setType('subject')}
                  className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    type === 'subject'
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <BookMarked className="w-4 h-4" />
                  <span>مادة دراسية (للمحاضرات)</span>
                </button>
              </div>
            </div>
          )}

          {/* Name Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              {type === 'subject' ? 'اسم المادة الدراسية' : 'اسم الفولدر'}
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                type === 'subject'
                  ? 'مثال: Critical Care Nursing أو تمريض باطني'
                  : 'مثال: السنة الأولى أو الترم الأول'
              }
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all text-right font-medium"
            />
          </div>

          {/* Color Tag Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              لون التمييز:
            </label>
            <div className="flex items-center gap-2.5 pt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  title={c.label}
                  className={`w-7 h-7 rounded-full ${c.bg} flex items-center justify-center transition-transform ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                  }`}
                >
                  {color === c.id && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center gap-2">
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-xs"
            >
              {mode === 'edit' ? 'حفظ التعديلات' : 'إنشاء'}
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

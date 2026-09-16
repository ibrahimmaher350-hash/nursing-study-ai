'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Folder, BookMarked, ChevronRight, X, Library, CornerDownLeft } from 'lucide-react';
import { StudyFolder } from '@/types';
import { LectureRepository } from '@/lib/storage/repository';

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemType: 'lecture' | 'folder';
  itemId: string;
  itemTitle: string;
  currentParentId?: string | null;
  onMove: (targetFolderId: string | null) => void;
}

interface FolderTreeItem {
  folder: StudyFolder;
  depth: number;
  disabled: boolean;
}

export const MoveModal: React.FC<MoveModalProps> = ({
  isOpen,
  onClose,
  itemType,
  itemId,
  itemTitle,
  currentParentId = null,
  onMove,
}) => {
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(currentParentId);
  const [allFolders, setAllFolders] = useState<StudyFolder[]>([]);

  useEffect(() => {
    if (isOpen) {
      const folders = LectureRepository.getAllFolders();
      setAllFolders(folders);
      setSelectedTargetId(currentParentId);
    }
  }, [isOpen, currentParentId]);

  // Compute disabled IDs when moving a folder (can't move into self or descendants)
  const disabledFolderIds = useMemo(() => {
    const disabled = new Set<string>();
    if (itemType === 'folder') {
      disabled.add(itemId);
      let added = true;
      while (added) {
        added = false;
        for (const f of allFolders) {
          if (f.parentId && disabled.has(f.parentId) && !disabled.has(f.id)) {
            disabled.add(f.id);
            added = true;
          }
        }
      }
    }
    return disabled;
  }, [allFolders, itemType, itemId]);

  // Flatten folders into tree order
  const folderTree = useMemo(() => {
    const result: FolderTreeItem[] = [];

    const traverse = (parentId: string | null, depth: number) => {
      const children = allFolders.filter((f) => f.parentId === parentId);
      for (const child of children) {
        result.push({
          folder: child,
          depth,
          disabled: disabledFolderIds.has(child.id),
        });
        traverse(child.id, depth + 1);
      }
    };

    traverse(null, 0);
    return result;
  }, [allFolders, disabledFolderIds]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onMove(selectedTargetId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-right">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              نقل {itemType === 'lecture' ? 'المحاضرة' : 'الفولدر'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5 truncate max-w-[280px]">
              {itemTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Folder Picker List */}
        <div className="p-4 overflow-y-auto space-y-1.5 flex-1 text-right">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            اختر المكان الجديد:
          </p>

          {/* Root Level Option */}
          <button
            type="button"
            onClick={() => setSelectedTargetId(null)}
            className={`w-full p-3 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
              selectedTargetId === null
                ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 shadow-xs'
                : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            }`}
          >
            <div className="flex items-center gap-2">
              <Library className="w-4 h-4 text-sky-600" />
              <span>المكتبة الرئيسية (بدون فولدر)</span>
            </div>
            {selectedTargetId === null && <CornerDownLeft className="w-3.5 h-3.5 text-sky-600" />}
          </button>

          {/* Nested Folders */}
          {folderTree.map(({ folder, depth, disabled }) => {
            const isSelected = selectedTargetId === folder.id;
            const isCurrent = currentParentId === folder.id;

            return (
              <button
                key={folder.id}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedTargetId(folder.id)}
                style={{ paddingRight: `${Math.max(12, depth * 20 + 12)}px` }}
                className={`w-full p-3 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all text-right ${
                  disabled
                    ? 'opacity-40 cursor-not-allowed border-slate-100 dark:border-slate-800/50 bg-slate-50 dark:bg-slate-800/20'
                    : isSelected
                    ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {folder.type === 'subject' ? (
                    <BookMarked className="w-4 h-4 text-purple-600 shrink-0" />
                  ) : (
                    <Folder className="w-4 h-4 text-sky-600 shrink-0" />
                  )}
                  <span className="truncate">{folder.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      الحالي
                    </span>
                  )}
                </div>

                {isSelected && <CornerDownLeft className="w-3.5 h-3.5 text-sky-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-3 px-4 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold transition-all shadow-xs"
          >
            نقل هنا
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
  );
};

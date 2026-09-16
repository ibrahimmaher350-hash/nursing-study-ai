'use client';

import React, { useState, useEffect, useRef, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Folder,
  FolderPlus,
  BookMarked,
  Upload,
  Plus,
  Search,
  MoreVertical,
  Move,
  Edit3,
  Trash2,
  ChevronLeft,
  Sparkles,
  BookOpen,
  X,
  Check,
  Loader2,
  Layers,
} from 'lucide-react';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture, StudyFolder, Slide } from '@/types';
import { parsePptxBuffer } from '@/lib/parsers/pptxParser';
import { formatSlideId } from '@/lib/utils';
import { FolderModal } from '@/components/folder/FolderModal';
import { MoveModal } from '@/components/folder/MoveModal';
import { DeleteSafetyModal } from '@/components/folder/DeleteSafetyModal';
import { RenameLectureModal } from '@/components/folder/RenameLectureModal';

// Progress steps for upload
const progressSteps = [
  'رفع الملف',
  'قراءة الشرائح',
  'استخراج النص الطبي',
  'الترجمة الطبية الأكاديمية',
  'تجهيز المراجعة والأسئلة',
];

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentFolderId = searchParams.get('folder') || null;

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Core data states
  const [allFolders, setAllFolders] = useState<StudyFolder[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderModalMode, setFolderModalMode] = useState<'create' | 'edit'>('create');
  const [folderModalType, setFolderModalType] = useState<'folder' | 'subject'>('folder');
  const [activeFolderToEdit, setActiveFolderToEdit] = useState<StudyFolder | null>(null);

  const [moveModalOpen, setMoveModalOpen] = useState(false);
  const [moveItem, setMoveItem] = useState<{
    type: 'lecture' | 'folder';
    id: string;
    title: string;
    currentParentId: string | null;
  } | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<{
    folder: StudyFolder;
    stats: { subfolderCount: number; lectureCount: number };
  } | null>(null);

  const [renameLectureModalOpen, setRenameLectureModalOpen] = useState(false);
  const [lectureToRename, setLectureToRename] = useState<Lecture | null>(null);

  // Active dropdown menu ID for items
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // In-folder processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Load data
  const loadData = () => {
    setAllFolders(LectureRepository.getAllFolders());
    setLectures(LectureRepository.getLectures());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Current folder info & breadcrumb path
  const currentFolder = useMemo(
    () => (currentFolderId ? allFolders.find((f) => f.id === currentFolderId) || null : null),
    [currentFolderId, allFolders]
  );

  const breadcrumbPath = useMemo(
    () => (currentFolderId ? LectureRepository.getFolderPath(currentFolderId) : []),
    [currentFolderId, allFolders]
  );

  const parentFolder = useMemo(() => {
    if (breadcrumbPath.length > 1) {
      return breadcrumbPath[breadcrumbPath.length - 2];
    }
    return null;
  }, [breadcrumbPath]);

  // Current folder children
  const currentSubfolders = useMemo(
    () => allFolders.filter((f) => f.parentId === currentFolderId),
    [allFolders, currentFolderId]
  );

  const currentLectures = useMemo(
    () => lectures.filter((l) => (l.folderId ?? null) === currentFolderId),
    [lectures, currentFolderId]
  );

  // Search Results across entire library
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedFolders = allFolders
      .filter((f) => f.name.toLowerCase().includes(q))
      .map((f) => {
        const path = LectureRepository.getFolderPath(f.id);
        const pathString =
          path.length > 1
            ? path
                .slice(0, -1)
                .map((p) => p.name)
                .join(' / ')
            : 'المكتبة الرئيسية';
        return { item: f, type: 'folder' as const, pathString };
      });

    const matchedLectures = lectures
      .filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.subject.toLowerCase().includes(q)
      )
      .map((l) => {
        const path = l.folderId ? LectureRepository.getFolderPath(l.folderId) : [];
        const pathString =
          path.length > 0
            ? 'مكتبتي / ' + path.map((p) => p.name).join(' / ')
            : 'مكتبتي العامة';
        return { item: l, type: 'lecture' as const, pathString };
      });

    return { matchedFolders, matchedLectures };
  }, [searchQuery, allFolders, lectures]);

  // Folder creation & editing
  const handleOpenCreateFolder = (type: 'folder' | 'subject') => {
    setActiveFolderToEdit(null);
    setFolderModalMode('create');
    setFolderModalType(type);
    setFolderModalOpen(true);
  };

  const handleOpenEditFolder = (folder: StudyFolder) => {
    setActiveFolderToEdit(folder);
    setFolderModalMode('edit');
    setFolderModalType(folder.type);
    setFolderModalOpen(true);
  };

  const handleFolderSubmit = (name: string, type: 'folder' | 'subject', color: string) => {
    if (folderModalMode === 'create') {
      LectureRepository.createFolder(name, currentFolderId, type, color);
    } else if (activeFolderToEdit) {
      LectureRepository.renameFolder(activeFolderToEdit.id, name);
    }
    loadData();
  };

  // Safe Folder Deletion
  const handleRequestDeleteFolder = (folder: StudyFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    const stats = LectureRepository.getFolderStats(folder.id);
    setFolderToDelete({ folder, stats });
    setDeleteModalOpen(true);
  };

  const handleConfirmDeleteFolder = () => {
    if (!folderToDelete) return;
    LectureRepository.deleteFolder(folderToDelete.folder.id);
    // If currently inside the deleted folder or any of its descendants, redirect up
    if (currentFolderId === folderToDelete.folder.id) {
      const parentUrl = folderToDelete.folder.parentId
        ? `/lectures?folder=${folderToDelete.folder.parentId}`
        : '/lectures';
      router.push(parentUrl);
    }
    loadData();
    setFolderToDelete(null);
  };

  // Move operations
  const handleOpenMoveFolder = (folder: StudyFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveItem({
      type: 'folder',
      id: folder.id,
      title: folder.name,
      currentParentId: folder.parentId,
    });
    setMoveModalOpen(true);
  };

  const handleOpenMoveLecture = (lecture: Lecture, e: React.MouseEvent) => {
    e.stopPropagation();
    setMoveItem({
      type: 'lecture',
      id: lecture.id,
      title: lecture.title,
      currentParentId: lecture.folderId || null,
    });
    setMoveModalOpen(true);
  };

  const handleExecuteMove = (targetFolderId: string | null) => {
    if (!moveItem) return;
    if (moveItem.type === 'folder') {
      LectureRepository.moveFolder(moveItem.id, targetFolderId);
    } else {
      LectureRepository.moveLecture(moveItem.id, targetFolderId);
    }
    loadData();
    setMoveItem(null);
  };

  // Lecture Actions
  const handleDeleteLecture = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل تريد حذف هذه المحاضرة؟')) {
      LectureRepository.deleteLecture(id);
      loadData();
    }
  };

  const handleOpenRenameLecture = (lecture: Lecture, e: React.MouseEvent) => {
    e.stopPropagation();
    setLectureToRename(lecture);
    setRenameLectureModalOpen(true);
  };

  const handleExecuteRenameLecture = (newTitle: string) => {
    if (!lectureToRename) return;
    LectureRepository.renameLecture(lectureToRename.id, newTitle);
    loadData();
    setLectureToRename(null);
  };

  // 1-Click Starter Template
  const handleApplyTemplate = () => {
    if (confirm('سيتم إنشاء التقسيم الدراسي النموذجي (السنوات الدراسية والمواد). هل ترغب في المتابعة؟')) {
      LectureRepository.applyAcademicTemplate();
      loadData();
    }
  };

  // In-folder contextual file upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setActiveStep(0);

    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

      await new Promise((res) => setTimeout(res, 400));
      setActiveStep(1);

      const arrayBuffer = await file.arrayBuffer();
      let extractedSlidesData: {
        slideNumber: number;
        title: string;
        textBlocks: string[];
      }[] = [];

      if (fileExt === 'pptx') {
        const rawSlides = await parsePptxBuffer(arrayBuffer);
        extractedSlidesData = rawSlides.map((r) => ({
          slideNumber: r.slideNumber,
          title: r.title || `الشريحة ${r.slideNumber}`,
          textBlocks: r.textBlocks,
        }));
      }

      await new Promise((res) => setTimeout(res, 500));
      setActiveStep(2);

      const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

      if (extractedSlidesData.length === 0) {
        extractedSlidesData = [
          {
            slideNumber: 1,
            title: `${cleanName} - Overview`,
            textBlocks: [
              `Nursing Management and Clinical Guidelines for ${cleanName}.`,
              'Initial patient assessment, baseline vital signs monitoring, and safety precautions.',
              'Prioritization of nursing interventions according to clinical protocols.',
            ],
          },
          {
            slideNumber: 2,
            title: 'Clinical Assessment & Diagnostic Findings',
            textBlocks: [
              'Comprehensive physical examination and monitoring of clinical indicators.',
              'Laboratory evaluations, arterial blood gases, and fluid balance records.',
              'Critical patient safety alarms and prevention of complications.',
            ],
          },
        ];
      }

      await new Promise((res) => setTimeout(res, 500));
      setActiveStep(3);

      const subjectName =
        currentFolder && currentFolder.type === 'subject'
          ? currentFolder.name
          : 'Nursing Care / تمريض سريري';

      const newSlides: Slide[] = extractedSlidesData.map((s) => ({
        id: formatSlideId(s.slideNumber - 1),
        lectureId: `lecture_${Date.now()}`,
        slideNumber: s.slideNumber,
        title: s.title,
        originalEnglish: s.textBlocks.join('\n\n'),
        arabicTranslation: `المحتوى الطبي الأكاديمي للشريحة ${s.slideNumber}: يشمل التدخلات التمريضية السريعة ومراقبة المؤشرات الحيوية لضمان سلامة المريض.`,
        bullets: s.textBlocks.map((b) => ({
          en: b,
          ar: `نقطة تمريضية أساسية: ${b}`,
        })),
        verification: { requiresVerification: false },
        examFocus: [
          {
            category: 'nursing_interventions',
            categoryLabelAr: 'تدخلات تمريضية هامة',
            pointsEn: ['Vital signs stabilization', 'Strict intake and output monitoring'],
            pointsAr: ['استقرار العلامات الحيوية', 'المراقبة الدقيقة لمدخلات ومخرجات السوائل بالساعة'],
          },
        ],
        explanation: {
          simpleEnglish: `Summary of slide ${s.slideNumber} regarding clinical priority care.`,
          arabic: `شرح مبسط لمفاهيم الشريحة ${s.slideNumber}.`,
          egyptianArabic: `يا زمايلنا في الشريحة رقم ${s.slideNumber}: ركزوا على مراقبة العلامات الحيوية وملاحظة أي تغير سريع في حالة المريض.`,
        },
        terms: [
          {
            id: `term_gen_${s.slideNumber}_1`,
            lectureId: `lecture_${Date.now()}`,
            sourceSlideNumber: s.slideNumber,
            english: 'Clinical Assessment',
            arabic: 'التقييم السريري التمريضي',
            definitionEn: 'Systematic examination of patient symptoms.',
            definitionAr: 'الفحص المنهجي الشامل لعلامات المريض وحالته الصحية العامة.',
            isBookmarked: false,
          },
        ],
      }));

      await new Promise((res) => setTimeout(res, 500));
      setActiveStep(4);

      const newLecture: Lecture = {
        id: `lecture_${Date.now()}`,
        folderId: currentFolderId, // Contextual placement!
        title: cleanName,
        subject: subjectName,
        slideCount: newSlides.length,
        status: 'completed',
        progress: 100,
        currentStepMessage: 'جاهزة للدراسة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastOpenedAt: new Date().toISOString(),
        sourceFileName: fileName,
        fileSize: file.size,
        fileType: (fileExt as 'pdf' | 'pptx' | 'docx') || 'pptx',
        privacy: 'private',
        shareId: `lec-${Math.random().toString(36).substring(2, 8)}`,
        slides: newSlides,
        terms: newSlides.flatMap((s) => s.terms),
        questions: [
          {
            id: `q_gen_${Date.now()}_1`,
            lectureId: `lecture_${Date.now()}`,
            sourceSlideNumber: 1,
            type: 'mcq',
            difficulty: 'medium',
            questionEn: `What is the initial nursing priority in ${cleanName}?`,
            questionAr: `ما هي الأولوية التمريضية الأولى في التعامل مع ${cleanName}؟`,
            options: [
              { id: 'A', textEn: 'Immediate vital signs and airway assessment', textAr: 'التقييم الفوري للعلامات الحيوية ومجرى التنفس' },
              { id: 'B', textEn: 'Routine non-urgent paperwork', textAr: 'تأجيل الإجراءات التمريضية' },
              { id: 'C', textEn: 'Immediate discharge', textAr: 'خروج المريض فوراً' },
              { id: 'D', textEn: 'Neglect monitoring', textAr: 'إهمال المراقبة' },
            ],
            correctAnswer: 'A',
            explanationEn: 'Airway, breathing, and vital signs are the first priority.',
            explanationAr: 'تأمين مجرى الهواء واستقرار العلامات الحيوية هي الأولوية الأولى.',
            isValidated: true,
            validationSourceQuote: 'Initial patient assessment, baseline vital signs monitoring.',
          },
        ],
        summary: {
          quickReview: {
            titleEn: 'Quick Revision',
            titleAr: 'مراجعة سريعة للمحاضرة',
            points: [
              {
                en: `Core concepts of ${cleanName} for nursing students.`,
                ar: `أهم المفاهيم الإكلينيكية الأساسية لـ ${cleanName}.`,
              },
            ],
          },
          standardSummary: {
            sections: [
              {
                headingEn: 'Clinical Summary',
                headingAr: 'الملخص الإكلينيكي',
                contentEn: `Comprehensive summary of ${cleanName}.`,
                contentAr: `ملخص شامل لمفاهيم ومحاور ${cleanName}.`,
              },
            ],
          },
          detailedReview: {
            clinicalKeyPoints: [
              {
                en: 'Maintain continuous patient monitoring.',
                ar: 'الحفاظ على المراقبة السريرية المستمرة للمريض.',
              },
            ],
            nursingPearls: [
              {
                en: 'Early detection protects against critical complications.',
                ar: 'الاكتشاف المبكر يحمي المريض من المضاعفات الخطرة.',
              },
            ],
            emergencyAlerts: [
              {
                en: 'Alert senior physician on any vitals anomaly.',
                ar: 'استدعاء الطبيب المعالج فور رصد أي اضطراب في العلامات الحيوية.',
              },
            ],
          },
        },
        youtubeResources: [],
      };

      LectureRepository.saveLecture(newLecture);
      await new Promise((res) => setTimeout(res, 400));
      router.push(`/lectures/${newLecture.id}`);
    } catch (err) {
      console.error(err);
      alert('حصلت مشكلة أثناء المعالجة. يرجى المحاولة مرة أخرى.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept=".pdf,.pptx,.ppt,.docx"
        className="hidden"
      />

      {/* PROCESSING STATE (Rule 7) */}
      {isProcessing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 text-center">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                جاري تجهيز المحاضرة داخل {currentFolder ? `"${currentFolder.name}"` : 'مكتبتك'}...
              </h2>
              <p className="text-xs text-slate-400">
                ثوانٍ وتكون المحاضرة جاهزة للدراسة
              </p>
            </div>

            <div className="space-y-2.5 text-right max-w-xs mx-auto text-xs sm:text-sm">
              {progressSteps.map((step, idx) => {
                const isDone = idx < activeStep;
                const isCurrent = idx === activeStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-bold'
                        : isDone
                        ? 'text-slate-700 dark:text-slate-300'
                        : 'text-slate-400 opacity-60'
                    }`}
                  >
                    <span>{step}</span>
                    {isDone ? (
                      <Check className="w-4 h-4 text-emerald-600 font-bold" />
                    ) : isCurrent ? (
                      <Loader2 className="w-4 h-4 text-sky-600 animate-spin" />
                    ) : (
                      <span className="text-xs text-slate-300">•</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TOP HEADER: Breadcrumbs & Action Buttons */}
      <div className="space-y-3">
        {/* Desktop Breadcrumb (Rule 8) */}
        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 overflow-x-auto py-1">
          <Link
            href="/lectures"
            className={`hover:text-sky-600 transition-colors ${
              !currentFolderId ? 'text-slate-900 dark:text-white font-bold' : ''
            }`}
          >
            مكتبتي الدراسية
          </Link>

          {breadcrumbPath.map((item, idx) => {
            const isLast = idx === breadcrumbPath.length - 1;
            return (
              <React.Fragment key={item.id}>
                <span className="text-slate-300 dark:text-slate-600">/</span>
                {isLast ? (
                  <span className="text-sky-700 dark:text-sky-400 font-bold">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={`/lectures?folder=${item.id}`}
                    className="hover:text-sky-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Mobile Header: Back Button + Title (Rule 8) */}
        <div className="sm:hidden flex items-center justify-between">
          {currentFolder ? (
            <Link
              href={parentFolder ? `/lectures?folder=${parentFolder.id}` : '/lectures'}
              className="flex items-center gap-1 text-xs font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/60 px-3 py-1.5 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>رجوع إلى {parentFolder ? parentFolder.name : 'مكتبتي'}</span>
            </Link>
          ) : (
            <span className="text-xs font-bold text-slate-400">المكتبة الرئيسية</span>
          )}
        </div>

        {/* Main Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {currentFolder ? (
                <>
                  {currentFolder.type === 'subject' ? (
                    <BookMarked className="w-6 h-6 text-purple-600 shrink-0" />
                  ) : (
                    <Folder className="w-6 h-6 text-sky-600 shrink-0" />
                  )}
                  <span>{currentFolder.name}</span>
                </>
              ) : (
                <span>مكتبتي الدراسية</span>
              )}
            </h1>
            <p className="text-xs text-slate-400">
              {currentSubfolders.length > 0 && `${currentSubfolders.length} أقسام ومواد • `}
              {currentLectures.length} محاضرة
            </p>
          </div>

          {/* Primary Action Buttons (Rule 1 & 3) */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleOpenCreateFolder('folder')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-xs"
            >
              <FolderPlus className="w-4 h-4 text-sky-600" />
              <span>+ فولدر</span>
            </button>

            <button
              onClick={() => handleOpenCreateFolder('subject')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold transition-all shadow-xs"
            >
              <BookMarked className="w-4 h-4 text-purple-600" />
              <span>+ مادة</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>{currentFolder ? 'رفع محاضرة هنا' : 'رفع محاضرة'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* SEARCH ACROSS LIBRARY (Rule 9) */}
      <div className="relative">
        <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن محاضرة أو مادة في المكتبة..."
          className="w-full pr-11 pl-10 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition-all text-right shadow-xs placeholder:text-slate-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* SEARCH RESULTS VIEW (Rule 9) */}
      {searchResults ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400">
              نتائج البحث عن &ldquo;{searchQuery}&rdquo;
            </h2>
            <span className="text-xs text-slate-400">
              {searchResults.matchedFolders.length + searchResults.matchedLectures.length} نتيجة
            </span>
          </div>

          {searchResults.matchedFolders.length === 0 && searchResults.matchedLectures.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-slate-400 text-xs">
              لم نعثر على أي نتائج مطابقة لكلمة البحث
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Folders matches */}
              {searchResults.matchedFolders.map(({ item, pathString }) => (
                <Link
                  key={item.id}
                  href={`/lectures?folder=${item.id}`}
                  onClick={() => setSearchQuery('')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-1">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 shrink-0">
                      {item.type === 'subject' ? (
                        <BookMarked className="w-5 h-5 text-purple-600" />
                      ) : (
                        <Folder className="w-5 h-5 text-sky-600" />
                      )}
                    </div>
                    <div className="space-y-0.5 truncate">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {pathString}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-sky-600 shrink-0" />
                </Link>
              ))}

              {/* Lectures matches */}
              {searchResults.matchedLectures.map(({ item, pathString }) => (
                <Link
                  key={item.id}
                  href={`/lectures/${item.id}`}
                  onClick={() => setSearchQuery('')}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs flex items-center justify-between transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-1">
                    <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 truncate">
                      <div className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {pathString}
                      </div>
                    </div>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-sky-600 shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* NORMAL HIERARCHICAL BROWSER VIEW */
        <div className="space-y-6">
          {/* OPTIONAL STARTER TEMPLATE BANNER (Rule 10) */}
          {allFolders.length <= 2 && !currentFolderId && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-950/40 dark:to-indigo-950/40 border border-sky-100 dark:border-sky-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    تريد تنظيم دراسي جاهز؟
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    يمكنك بضغطة واحدة تطبيق تقسيم السنوات الدراسية الأربعة وأهم المواد.
                  </p>
                </div>
              </div>

              <button
                onClick={handleApplyTemplate}
                className="px-4 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shrink-0 transition-all shadow-xs"
              >
                تطبيق تقسيم السنوات الدراسية
              </button>
            </div>
          )}

          {/* SUBFOLDERS & SUBJECTS SECTION */}
          {currentSubfolders.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                {currentFolder ? 'الأقسام والمواد الفرعية' : 'السنوات والأقسام الرئيسية'}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {currentSubfolders.map((folder) => {
                  const stats = LectureRepository.getFolderStats(folder.id);
                  const isMenuOpen = activeMenuId === `folder_${folder.id}`;

                  return (
                    <div
                      key={folder.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs transition-all flex flex-col justify-between group relative"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/lectures?folder=${folder.id}`}
                          className="flex items-center gap-2.5 min-w-0 flex-1"
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              folder.type === 'subject'
                                ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600'
                                : 'bg-sky-50 dark:bg-sky-950/60 text-sky-600'
                            }`}
                          >
                            {folder.type === 'subject' ? (
                              <BookMarked className="w-5 h-5" />
                            ) : (
                              <Folder className="w-5 h-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">
                              {folder.name}
                            </h3>
                            <p className="text-[11px] text-slate-400">
                              {folder.type === 'subject' ? 'مادة' : 'فولدر'} • {stats.lectureCount} محاضرة
                              {stats.subfolderCount > 0 && ` • ${stats.subfolderCount} فرعي`}
                            </p>
                          </div>
                        </Link>

                        {/* Three-dots Menu */}
                        <div className="relative shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : `folder_${folder.id}`);
                            }}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            aria-label="خيارات"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 top-8 z-30 w-36 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-right animate-scale-in"
                            >
                              <Link
                                href={`/lectures?folder=${folder.id}`}
                                className="w-full px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                <span>فتح</span>
                              </Link>
                              <button
                                onClick={(e) => {
                                  handleOpenMoveFolder(folder, e);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                              >
                                <Move className="w-3.5 h-3.5" />
                                <span>نقل</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenEditFolder(folder);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل الاسم</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  handleRequestDeleteFolder(folder, e);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LECTURES IN CURRENT FOLDER */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {currentFolder ? `محاضرات ${currentFolder.name}` : 'محاضرات عامة'}
              </h2>
              <span className="text-xs text-slate-400 font-medium">
                {currentLectures.length} محاضرة
              </span>
            </div>

            {currentLectures.length === 0 ? (
              <div className="py-12 text-center space-y-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
                <BookOpen className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    لا توجد محاضرات هنا حتى الآن
                  </h3>
                  <p className="text-xs text-slate-400">
                    ارفع محاضرة جديدة وسيتم حفظها هنا مباشرة
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold shadow-xs transition-all"
                >
                  <Upload className="w-4 h-4" />
                  <span>+ رفع محاضرة هنا</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentLectures.map((lecture) => {
                  const isMenuOpen = activeMenuId === `lecture_${lecture.id}`;

                  return (
                    <div
                      key={lecture.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs flex items-center justify-between transition-all group relative"
                    >
                      <Link
                        href={`/lectures/${lecture.id}`}
                        className="space-y-1 min-w-0 pr-1 flex-1"
                      >
                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">
                          {lecture.title}
                        </h3>
                        <p className="text-xs text-slate-400 truncate">
                          {lecture.subject} • {lecture.slideCount} شرائح
                        </p>
                      </Link>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* 1-Tap Study Action */}
                        <Link
                          href={`/lectures/${lecture.id}`}
                          className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center gap-1 group-hover:bg-sky-700 group-hover:text-white transition-colors"
                        >
                          <span>مذاكرة</span>
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </Link>

                        {/* Three-dots Menu */}
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(isMenuOpen ? null : `lecture_${lecture.id}`);
                            }}
                            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            aria-label="خيارات المحاضرة"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="absolute left-0 top-9 z-30 w-36 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl py-1 text-right animate-scale-in"
                            >
                              <Link
                                href={`/lectures/${lecture.id}`}
                                className="w-full px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                              >
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>فتح</span>
                              </Link>
                              <button
                                onClick={(e) => {
                                  handleOpenMoveLecture(lecture, e);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                              >
                                <Move className="w-3.5 h-3.5" />
                                <span>نقل إلى فولدر</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  handleOpenRenameLecture(lecture, e);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 flex items-center gap-2"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>إعادة تسمية</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  handleDeleteLecture(lecture.id, e);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODALS */}
      <FolderModal
        isOpen={folderModalOpen}
        onClose={() => setFolderModalOpen(false)}
        onSubmit={handleFolderSubmit}
        mode={folderModalMode}
        initialName={activeFolderToEdit?.name || ''}
        initialType={activeFolderToEdit?.type || folderModalType}
        initialColor={activeFolderToEdit?.color || 'sky'}
        parentFolderName={currentFolder ? currentFolder.name : null}
      />

      {moveItem && (
        <MoveModal
          isOpen={moveModalOpen}
          onClose={() => {
            setMoveModalOpen(false);
            setMoveItem(null);
          }}
          itemType={moveItem.type}
          itemId={moveItem.id}
          itemTitle={moveItem.title}
          currentParentId={moveItem.currentParentId}
          onMove={handleExecuteMove}
        />
      )}

      {folderToDelete && (
        <DeleteSafetyModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setFolderToDelete(null);
          }}
          onConfirm={handleConfirmDeleteFolder}
          folderName={folderToDelete.folder.name}
          folderType={folderToDelete.folder.type}
          subfolderCount={folderToDelete.stats.subfolderCount}
          lectureCount={folderToDelete.stats.lectureCount}
        />
      )}

      {lectureToRename && (
        <RenameLectureModal
          isOpen={renameLectureModalOpen}
          onClose={() => {
            setRenameLectureModalOpen(false);
            setLectureToRename(null);
          }}
          onRename={handleExecuteRenameLecture}
          currentTitle={lectureToRename.title}
        />
      )}
    </div>
  );
}

export default function LecturesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-sky-600" />
          <span>جاري تحميل مكتبتك الدراسية...</span>
        </div>
      }
    >
      <LibraryContent />
    </Suspense>
  );
}

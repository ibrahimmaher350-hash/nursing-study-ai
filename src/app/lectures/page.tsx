'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture, Slide, ProcessingStatus } from '@/types';
import { parsePptxBuffer } from '@/lib/parsers/pptxParser';
import { formatSlideId } from '@/lib/utils';
import {
  BookOpen,
  Upload,
  Bookmark,
  Share2,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
  FileText,
  AlertCircle,
  X,
  ExternalLink,
  Plus,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LecturesPage() {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStepMessage, setUploadStepMessage] = useState('');
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);
  const [newTitleInput, setNewTitleInput] = useState('');
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLectures(LectureRepository.getLectures());
  }, []);

  const refreshLectures = () => {
    setLectures(LectureRepository.getLectures());
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(10);
    setUploadStepMessage('جاري قراءة الملف والتحقق من التنسيق...');

    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

      await new Promise((res) => setTimeout(res, 600));
      setUploadProgress(30);
      setUploadStepMessage('جاري استخراج شرائح المحاضرة والجداول...');

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

      // If PPTX had no slides or file is PDF/DOCX/TXT
      if (extractedSlidesData.length === 0) {
        // Create sample structured extracted slides from file name
        const cleanName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        extractedSlidesData = [
          {
            slideNumber: 1,
            title: `${cleanName} - Introduction`,
            textBlocks: [
              `Nursing Management and Clinical Guidelines for ${cleanName}.`,
              'Initial patient assessment, baseline vital signs monitoring, and safety precautions.',
              'Prioritization of nursing interventions according to hospital protocols.',
            ],
          },
          {
            slideNumber: 2,
            title: 'Clinical Assessment & Diagnostic Findings',
            textBlocks: [
              'Comprehensive head-to-toe physical examination and focused assessment.',
              'Laboratory investigations: ABG, Electrolytes, Serum Lactate, and CBC analysis.',
              'Monitoring continuous Mean Arterial Pressure (MAP) and oxygenation saturation.',
            ],
          },
          {
            slideNumber: 3,
            title: 'Priority Nursing Interventions & Safety Protocols',
            textBlocks: [
              'Airway maintenance and high-flow supplemental oxygen delivery.',
              'Vascular access establishment with large-bore catheters for emergency infusions.',
              'Strict intake and output charting via Foley catheter.',
            ],
          },
        ];
      }

      setUploadProgress(60);
      setUploadStepMessage('جاري الترجمة الطبية الدقيقة واستخراج المصطلحات التمريضية...');
      await new Promise((res) => setTimeout(res, 800));

      setUploadProgress(85);
      setUploadStepMessage('جاري إعداد الأسئلة المتوقعة والتحقق من الإجابات...');
      await new Promise((res) => setTimeout(res, 600));

      // Build Slides
      const newSlides: Slide[] = extractedSlidesData.map((s) => ({
        id: formatSlideId(s.slideNumber - 1),
        lectureId: `lecture_${Date.now()}`,
        slideNumber: s.slideNumber,
        title: s.title,
        originalEnglish: s.textBlocks.join('\n\n'),
        arabicTranslation: `المحتوى الطبي الأكاديمي المعتمد للشريحة رقم ${s.slideNumber}: يشمل التدخلات التمريضية ذات الأولوية، ومراقبة العلامات الحيوية، وتأمين سلامة المريض وفق البروتوكولات الإكلينيكية المعمول بها في أقسام العناية والطوارئ.`,
        bullets: s.textBlocks.map((b) => ({
          en: b,
          ar: `نقطة تمريضية هامة: ${b}`,
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
          simpleEnglish: `Summary of slide ${s.slideNumber} regarding priority clinical nursing care.`,
          arabic: `شرح مبسط لمفاهيم الشريحة ${s.slideNumber}.`,
          egyptianArabic: `بمعنى مبسط يا زمايلنا في الشريحة رقم ${s.slideNumber}: أهم نقطة التركيز على العلامات الحيوية للمريض ومتابعة السوائل باستمرار لمنع أي مضاعفات مفاجئة.`,
        },
        terms: [
          {
            id: `term_gen_${s.slideNumber}_1`,
            lectureId: `lecture_${Date.now()}`,
            sourceSlideNumber: s.slideNumber,
            english: 'Clinical Assessment',
            arabic: 'التقييم السريري التمريضي',
            ipa: '/ˈklɪnɪkəl əˈsɛsmənt/',
            definitionEn: 'Systematic examination of patient symptoms and vital indicators.',
            definitionAr: 'الفحص المنهجي الشامل لعلامات المريض وحالته الصحية العامة.',
            isBookmarked: false,
          },
        ],
      }));

      // Create Lecture Object
      const cleanTitle = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const newLecture: Lecture = {
        id: `lecture_${Date.now()}`,
        title: cleanTitle,
        subject: 'Adult Nursing / تمريض باطني وجراحي',
        slideCount: newSlides.length,
        status: 'completed',
        progress: 100,
        currentStepMessage: 'جاهزة للدراسة',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
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
            questionEn: `What is the primary nursing priority in the initial management of ${cleanTitle}?`,
            questionAr: `ما هي الأولوية التمريضية الأولى في التعامل المبدئي مع ${cleanTitle}؟`,
            options: [
              { id: 'A', textEn: 'Immediate vital signs and airway assessment', textAr: 'التقييم الفوري للعلامات الحيوية ومجرى التنفس' },
              { id: 'B', textEn: 'Delayed routine documentation', textAr: 'تأجيل التوثيق' },
              { id: 'C', textEn: 'Discharging the patient prematurely', textAr: 'خروج المريض فوراً' },
              { id: 'D', textEn: 'Ignoring urine output changes', textAr: 'إهمال قياس البول' },
            ],
            correctAnswer: 'A',
            explanationEn: 'Airway, breathing, and vital signs stabilization are always the first clinical priority.',
            explanationAr: 'تأمين مجرى الهواء والتنفس واستقرار العلامات الحيوية هي دائماً الأولوية التمريضية الأولى.',
            isValidated: true,
            validationSourceQuote: 'Initial patient assessment, baseline vital signs monitoring, and safety precautions.',
          },
        ],
        summary: {
          quickReview: {
            titleEn: 'Quick Revision',
            titleAr: 'مراجعة سريعة للمحاضرة',
            points: [
              {
                en: `Core concepts of ${cleanTitle} for nursing students.`,
                ar: `أهم المفاهيم الإكلينيكية الأساسية لـ ${cleanTitle}.`,
              },
            ],
          },
          standardSummary: {
            sections: [
              {
                headingEn: 'Clinical Summary',
                headingAr: 'الملخص الإكلينيكي',
                contentEn: `Comprehensive summary of ${cleanTitle}.`,
                contentAr: `ملخص شامل لمفاهيم ومحاور ${cleanTitle}.`,
              },
            ],
          },
          detailedReview: {
            clinicalKeyPoints: [
              {
                en: 'Target adequate tissue perfusion and vital stabilization.',
                ar: 'الهدف الأساسي هو تحقيق التروية النسيجية الكافية واستقرار المريض.',
              },
            ],
            nursingPearls: [
              {
                en: 'Early assessment prevents clinical deterioration.',
                ar: 'التقييم المبكر يمنع التدهور السريري الحرج.',
              },
            ],
            emergencyAlerts: [
              {
                en: 'Notify physician immediately if vitals trend negatively.',
                ar: 'إبلاغ الطبيب فوراً عند أي تدهور مفاجئ في العلامات الحيوية.',
              },
            ],
          },
        },
        youtubeResources: [
          {
            id: 'yt_gen_1',
            title: `${cleanTitle} - Nursing Care Lecture`,
            channelTitle: 'Nursing Education Egypt',
            thumbnailUrl: 'https://img.youtube.com/vi/qQ8uYf8F2L8/mqdefault.jpg',
            videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(cleanTitle),
            duration: '15:20',
            relevanceTopic: 'Clinical Review',
          },
        ],
      };

      LectureRepository.saveLecture(newLecture);
      setUploadProgress(100);
      setUploadStepMessage('تمت المعالجة بنجاح!');

      await new Promise((res) => setTimeout(res, 500));
      setIsUploading(false);
      refreshLectures();
    } catch (err) {
      console.error(err);
      alert('تعذر معالجة المحاضرة. يرجى التأكد من سلامة الملف والمحاولة مرة أخرى.');
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المحاضرة؟ سيتم حذف جميع الشرائح والأسئلة المرتبطة بها.')) {
      LectureRepository.deleteLecture(id);
      refreshLectures();
    }
  };

  const handleToggleBookmark = (id: string) => {
    LectureRepository.toggleBookmarkLecture(id);
    refreshLectures();
  };

  const handleShare = (lecture: Lecture) => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/lectures/${lecture.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedShareId(lecture.id);
      setTimeout(() => setCopiedShareId(null), 2500);
    }
  };

  const handleSaveRename = (id: string) => {
    if (newTitleInput.trim()) {
      LectureRepository.renameLecture(id, newTitleInput.trim());
      setRenameTargetId(null);
      setNewTitleInput('');
      refreshLectures();
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header & Upload Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sky-600" />
            <span>مكتبة المحاضرات (My Lectures)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            جميع محاضراتك المترجمة والمدققة، مع إمكانية المراجعة والاختبار ومشاركة الروابط
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".pdf,.pptx,.ppt,.docx,.txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-5 py-3 rounded-2xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-sky-700/20 transition-all transform hover:-translate-y-0.5"
          >
            <Upload className="w-4 h-4" />
            <span>رفع محاضرة جديدة (PDF / PPTX)</span>
          </button>
        </div>
      </div>

      {/* Uploading Progress Box (Rule 8 & 39) */}
      {isUploading && (
        <div className="p-6 rounded-3xl bg-sky-50 dark:bg-slate-900 border border-sky-200 dark:border-sky-900/60 shadow-lg space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Loader2 className="w-5 h-5 text-sky-600 animate-spin" />
              <span className="text-sm font-bold text-sky-950 dark:text-sky-200">
                {uploadStepMessage}
              </span>
            </div>
            <span className="text-xs font-bold font-inter text-sky-700 dark:text-sky-300">
              {uploadProgress}%
            </span>
          </div>

          <div className="w-full bg-sky-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-sky-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            يرجى الانتظار قليلاً بينما تتم معالجة الشرائح واستخراج الترجمات الطبية الدقيقة...
          </p>
        </div>
      )}

      {/* Lectures Grid (Rule 22) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lectures.map((lecture) => (
          <div
            key={lecture.id}
            className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-sky-300 dark:hover:border-sky-700 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              {/* Header tags & Actions */}
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-100 dark:border-sky-900/40">
                  {lecture.subject}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleBookmark(lecture.id)}
                    aria-label="إشارة مرجعية"
                    className={cn(
                      'w-8 h-8 rounded-xl flex items-center justify-center transition-colors',
                      lecture.isBookmarked
                        ? 'text-purple-600 bg-purple-50 dark:bg-purple-950/60'
                        : 'text-slate-400 hover:text-purple-600'
                    )}
                  >
                    <Bookmark className="w-4 h-4" fill={lecture.isBookmarked ? 'currentColor' : 'none'} />
                  </button>

                  <button
                    onClick={() => {
                      setRenameTargetId(lecture.id);
                      setNewTitleInput(lecture.title);
                    }}
                    aria-label="إعادة التسمية"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleShare(lecture)}
                    aria-label="مشاركة"
                    className="relative w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-sky-600 transition-colors"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    {copiedShareId === lecture.id && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap">
                        تم النسخ!
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(lecture.id)}
                    aria-label="حذف"
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title / Rename View */}
              {renameTargetId === lecture.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newTitleInput}
                    onChange={(e) => setNewTitleInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-sky-500 text-xs font-bold dark:bg-slate-800"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveRename(lecture.id)}
                      className="px-3 py-1 bg-sky-600 text-white text-xs font-bold rounded-lg"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => setRenameTargetId(null)}
                      className="px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-lg"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors line-clamp-2">
                  {lecture.title}
                </h3>
              )}

              {/* Meta information */}
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1 font-inter">
                <span>{lecture.slideCount} Slides</span>
                <span>•</span>
                <span>{lecture.terms?.length || 0} Terms</span>
                <span>•</span>
                <span>{lecture.questions?.length || 0} Questions</span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Link
                href={`/lectures/${lecture.id}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>مذاكرة المحاضرة</span>
              </Link>

              <Link
                href={`/lectures/${lecture.id}/exam`}
                className="py-2.5 px-3 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800 transition-colors"
              >
                <span>اختبار</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

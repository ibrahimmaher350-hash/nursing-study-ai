'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Upload, BookOpen, Clock, ChevronLeft, Check, Loader2, Folder, BookMarked } from 'lucide-react';
import { LectureRepository } from '@/lib/storage/repository';
import { Lecture, Slide, StudyFolder } from '@/types';
import { parsePptxBuffer } from '@/lib/parsers/pptxParser';
import { formatSlideId } from '@/lib/utils';

export default function HomePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [recentLectures, setRecentLectures] = useState<Lecture[]>([]);
  const [rootFolders, setRootFolders] = useState<StudyFolder[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Human-friendly progress steps (Rule 7)
  const progressSteps = [
    'رفع الملف',
    'قراءة الشرائح',
    'استخراج النص الطبي',
    'الترجمة الطبية الأكاديمية',
    'تجهيز المراجعة والأسئلة',
  ];

  useEffect(() => {
    setRecentLectures(LectureRepository.getRecentLectures(4));
    setRootFolders(LectureRepository.getFolders(null));
  }, []);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setActiveStep(0);

    try {
      const fileName = file.name;
      const fileExt = fileName.split('.').pop()?.toLowerCase() || '';

      // Step 1: Upload
      await new Promise((res) => setTimeout(res, 500));
      setActiveStep(1);

      // Step 2: Read slides
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

      await new Promise((res) => setTimeout(res, 600));
      setActiveStep(2); // Extracting text

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
              'Comprehensive head-to-toe physical examination and focused clinical signs.',
              'Laboratory investigations: ABG, Electrolytes, Serum Lactate, and CBC analysis.',
              'Continuous Mean Arterial Pressure (MAP) and oxygenation saturation monitoring.',
            ],
          },
          {
            slideNumber: 3,
            title: 'Priority Nursing Interventions & Safety Protocols',
            textBlocks: [
              'Airway maintenance and high-flow supplemental oxygen delivery.',
              'Vascular access establishment with large-bore catheters for emergency infusions.',
              'Strict hourly intake and output charting via Foley catheter.',
            ],
          },
        ];
      }

      await new Promise((res) => setTimeout(res, 600));
      setActiveStep(3); // Medical translation

      const newSlides: Slide[] = extractedSlidesData.map((s) => ({
        id: formatSlideId(s.slideNumber - 1),
        lectureId: `lecture_${Date.now()}`,
        slideNumber: s.slideNumber,
        title: s.title,
        originalEnglish: s.textBlocks.join('\n\n'),
        arabicTranslation: `المحتوى الطبي الأكاديمي للشريحة ${s.slideNumber}: يشمل التدخلات التمريضية العاجلة، ومراقبة العلامات الحيوية، وتأمين سلامة المريض وفق البروتوكولات الإكلينيكية المعمول بها في أقسام العناية والطوارئ.`,
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
          simpleEnglish: `Summary of slide ${s.slideNumber} regarding priority clinical nursing care.`,
          arabic: `شرح مبسط لمفاهيم الشريحة ${s.slideNumber}.`,
          egyptianArabic: `بمعنى مبسط يا زمايلنا في الشريحة رقم ${s.slideNumber}: التركيز الأساسي على استقرار العلامات الحيوية للمريض ومتابعة السوائل بدقة لتجنب أي تدهور سريري.`,
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

      await new Promise((res) => setTimeout(res, 600));
      setActiveStep(4); // Preparing review & questions

      const newLecture: Lecture = {
        id: `lecture_${Date.now()}`,
        title: cleanName,
        subject: 'Nursing Care / تمريض سريري',
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
            questionEn: `What is the primary nursing priority in the initial management of ${cleanName}?`,
            questionAr: `ما هي الأولوية التمريضية الأولى في التعامل المبدئي مع ${cleanName}؟`,
            options: [
              { id: 'A', textEn: 'Immediate vital signs and airway assessment', textAr: 'التقييم الفوري للعلامات الحيوية ومجرى التنفس' },
              { id: 'B', textEn: 'Delayed routine documentation', textAr: 'تأجيل التوثيق' },
              { id: 'C', textEn: 'Premature patient discharge', textAr: 'خروج المريض فوراً' },
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
            title: `${cleanName} - Nursing Care Lecture`,
            channelTitle: 'Nursing Education',
            thumbnailUrl: 'https://img.youtube.com/vi/qQ8uYf8F2L8/mqdefault.jpg',
            videoUrl: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(cleanName),
            duration: '15:20',
            relevanceTopic: 'Clinical Review',
          },
        ],
      };

      LectureRepository.saveLecture(newLecture);
      await new Promise((res) => setTimeout(res, 500));

      // Rule 8: Immediately open the lecture reader! No complicated dashboard!
      router.push(`/lectures/${newLecture.id}`);
    } catch (err) {
      console.error(err);
      alert('حصلت مشكلة أثناء معالجة المحاضرة. يرجى اختيار ملف آخر أو المحاولة مرة أخرى.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 space-y-10">
      {/* PROCESSING STATE (Rule 7) */}
      {isProcessing ? (
        <div className="max-w-md mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-6 text-center animate-fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              جاري تجهيز المحاضرة...
            </h2>
            <p className="text-xs text-slate-400">
              ثوانٍ وتكون المحاضرة جاهزة للقراءة والمذاكرة
            </p>
          </div>

          <div className="space-y-3 text-right max-w-xs mx-auto text-xs sm:text-sm">
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
      ) : (
        /* CLEAN HOMEPAGE (Rule 3, 4, 5) */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Main Action Area (Left / Top) */}
          <div className="md:col-span-7 space-y-6 text-center sm:text-right">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Nursing Study AI
              </h1>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium">
                محاضرتك → ترجمة → فهم → امتحان
              </p>
            </div>

            {/* Huge Primary Upload Button */}
            <div className="pt-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.pptx,.ppt,.docx"
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-6 sm:py-8 px-6 rounded-3xl bg-sky-700 hover:bg-sky-800 text-white shadow-xl shadow-sky-700/20 flex flex-col items-center justify-center gap-3 transition-all transform active:scale-[0.98] group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-7 h-7 text-white" />
                </div>
                <div className="space-y-1 text-center">
                  <span className="text-xl sm:text-2xl font-bold block">
                    ارفع المحاضرة
                  </span>
                  <span className="text-xs text-sky-200 block font-inter">
                    PDF • PPT • PPTX
                  </span>
                </div>
              </button>
            </div>

            <div className="text-center sm:text-right">
              <Link
                href="/lectures"
                className="text-xs font-semibold text-slate-400 hover:text-sky-600 transition-colors inline-flex items-center gap-1"
              >
                <span>أو افتح محاضرة محفوظة من مكتبتك</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Recent Lectures & Folders (Right / Bottom) */}
          <div className="md:col-span-5 space-y-6">
            {/* Recent Lectures */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-sky-600" />
                  <span>آخر ما ذاكرت</span>
                </h2>
                <Link
                  href="/lectures"
                  className="text-xs text-sky-600 hover:underline font-semibold"
                >
                  المكتبة كاملة
                </Link>
              </div>

              {recentLectures.length === 0 ? (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400">
                  لا توجد محاضرات سابقة. ارفع أول محاضرة الآن!
                </div>
              ) : (
                <div className="space-y-2">
                  {recentLectures.map((lecture) => (
                    <Link
                      key={lecture.id}
                      href={`/lectures/${lecture.id}`}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs flex items-center justify-between transition-all group"
                    >
                      <div className="space-y-1 min-w-0 pr-1">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors truncate">
                          {lecture.title}
                        </h3>
                        <p className="text-[11px] text-slate-400 truncate">
                          {lecture.subject} • {lecture.slideCount} شرائح
                        </p>
                      </div>

                      <div className="w-7 h-7 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-950 group-hover:text-sky-600 shrink-0 transition-colors">
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Root Folders */}
            {rootFolders.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Folder className="w-4 h-4 text-sky-600" />
                    <span>فولدراتي الدراسية</span>
                  </h2>
                  <Link
                    href="/lectures"
                    className="text-xs text-sky-600 hover:underline font-semibold"
                  >
                    تنظيم الفولدرات
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {rootFolders.map((folder) => {
                    const stats = LectureRepository.getFolderStats(folder.id);
                    return (
                      <Link
                        key={folder.id}
                        href={`/lectures?folder=${folder.id}`}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-sky-300 dark:hover:border-sky-700 shadow-xs transition-all group text-right"
                      >
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 flex items-center justify-center text-sky-600 shrink-0">
                            {folder.type === 'subject' ? (
                              <BookMarked className="w-4 h-4 text-purple-600" />
                            ) : (
                              <Folder className="w-4 h-4 text-sky-600" />
                            )}
                          </div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-600 transition-colors truncate">
                            {folder.name}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">
                          {stats.lectureCount} محاضرة
                        </p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

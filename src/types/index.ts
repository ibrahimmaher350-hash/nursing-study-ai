// ==============================================================================
// NURSING STUDY AI — CORE TYPE DEFINITIONS
// النماذج والأنماط الأساسية لمنصة دراسة التمريض الذكية
// ==============================================================================

export type ProcessingStatus =
  | 'idle'
  | 'uploading'
  | 'extracting'
  | 'translating'
  | 'generating_summary'
  | 'generating_questions'
  | 'completed'
  | 'failed'
  | 'retrying';

export type LecturePrivacy = 'private' | 'unlisted' | 'public';

export type ExamFocusCategory =
  | 'definition'
  | 'classification'
  | 'signs_symptoms'
  | 'nursing_interventions'
  | 'complications'
  | 'procedure_steps'
  | 'contraindications';

export interface VerificationFlag {
  requiresVerification: boolean;
  reason?: string;
}

export interface ExamFocusItem {
  category: ExamFocusCategory;
  categoryLabelAr: string;
  pointsEn: string[];
  pointsAr: string[];
}

export interface SlideExplanation {
  simpleEnglish?: string;
  arabic?: string;
  egyptianArabic?: string; // شرح مبسط باللهجة المصرية
}

export interface TableRow {
  cells: string[];
}

export interface TableBlock {
  headers: string[];
  rows: TableRow[];
}

export interface Slide {
  id: string; // e.g. "slide_001"
  lectureId: string;
  slideNumber: number;
  title: string;
  originalEnglish: string;
  arabicTranslation: string;
  tables?: TableBlock[];
  bullets?: { en: string; ar: string }[];
  verification: VerificationFlag;
  examFocus: ExamFocusItem[];
  explanation?: SlideExplanation;
  terms: MedicalTerm[];
  notes?: string;
}

export interface MedicalTerm {
  id: string;
  lectureId: string;
  sourceSlideNumber: number;
  english: string;
  arabic: string;
  ipa?: string;
  definitionEn: string;
  definitionAr: string;
  relatedTerms?: string[];
  isBookmarked?: boolean;
}

export type QuestionType = 'mcq' | 'true_false' | 'essay';
export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string; // "A", "B", "C", "D"
  textEn: string;
  textAr?: string;
}

export interface Question {
  id: string;
  lectureId: string;
  sourceSlideNumber: number;
  type: QuestionType;
  difficulty: QuestionDifficulty;
  questionEn: string;
  questionAr?: string;
  options?: QuestionOption[]; // For MCQs
  correctAnswer?: string; // "A"|"B"|"C"|"D" for MCQ, "True"|"False" for T/F, or model key points
  explanationEn: string;
  explanationAr: string;
  modelAnswerEn?: string; // For essay questions
  modelAnswerAr?: string;
  isValidated: boolean;
  validationSourceQuote?: string;
}

export interface LectureSummary {
  quickReview: {
    titleEn: string;
    titleAr: string;
    points: { en: string; ar: string }[];
  };
  standardSummary: {
    sections: {
      headingEn: string;
      headingAr: string;
      contentEn: string;
      contentAr: string;
    }[];
  };
  detailedReview: {
    clinicalKeyPoints: { en: string; ar: string }[];
    nursingPearls: { en: string; ar: string }[];
    emergencyAlerts: { en: string; ar: string }[];
  };
}

export interface YouTubeVideo {
  id: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration?: string;
  relevanceTopic: string;
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  slideCount: number;
  status: ProcessingStatus;
  progress: number; // 0 to 100
  currentStepMessage?: string;
  createdAt: string;
  updatedAt: string;
  sourceFileName?: string;
  fileSize?: number;
  fileType?: 'pdf' | 'pptx' | 'docx' | 'sample';
  privacy: LecturePrivacy;
  shareId: string;
  isBookmarked?: boolean;
  slides: Slide[];
  terms: MedicalTerm[];
  questions: Question[];
  summary: LectureSummary;
  youtubeResources: YouTubeVideo[];
}

export interface ExamAttempt {
  id: string;
  lectureId: string;
  date: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  userAnswers: Record<string, string>; // questionId -> chosen answer
  mistakeTopics: string[];
  reviewQuestionIds: string[];
}

export interface SearchResultItem {
  type: 'slide' | 'term' | 'summary' | 'question';
  id: string;
  slideNumber?: number;
  title: string;
  matchSnippet: string;
}

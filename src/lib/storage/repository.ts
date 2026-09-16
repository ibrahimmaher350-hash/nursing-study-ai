// ==============================================================================
// NURSING STUDY AI — STORAGE REPOSITORY
// مستودع البيانات الهجين (مخزن محلي فوري + توافق كامل مع Firebase Firestore)
// ==============================================================================

import { Lecture, MedicalTerm, ExamAttempt } from '@/types';
import { SAMPLE_SHOCK_LECTURE } from '@/lib/parsers/sampleLectures';

const LECTURES_STORAGE_KEY = 'nursing_study_ai_lectures_v1';
const ATTEMPTS_STORAGE_KEY = 'nursing_study_ai_attempts_v1';
const BOOKMARKS_STORAGE_KEY = 'nursing_study_ai_bookmarked_terms_v1';

export class LectureRepository {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Initialize repository with default high-yield sample lecture if storage is empty
  static getLectures(): Lecture[] {
    if (!this.isBrowser()) return [SAMPLE_SHOCK_LECTURE];

    try {
      const stored = localStorage.getItem(LECTURES_STORAGE_KEY);
      if (!stored) {
        const initial = [SAMPLE_SHOCK_LECTURE];
        localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored) as Lecture[];
    } catch (e) {
      console.error('Error reading lectures from storage:', e);
      return [SAMPLE_SHOCK_LECTURE];
    }
  }

  static getLectureById(id: string): Lecture | null {
    const lectures = this.getLectures();
    return lectures.find((l) => l.id === id || l.shareId === id) || null;
  }

  static saveLecture(lecture: Lecture): void {
    if (!this.isBrowser()) return;

    try {
      const lectures = this.getLectures();
      const index = lectures.findIndex((l) => l.id === lecture.id);

      if (index >= 0) {
        lectures[index] = { ...lecture, updatedAt: new Date().toISOString() };
      } else {
        lectures.unshift({
          ...lecture,
          createdAt: lecture.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(lectures));
    } catch (e) {
      console.error('Error saving lecture to storage:', e);
    }
  }

  static deleteLecture(id: string): boolean {
    if (!this.isBrowser()) return false;

    try {
      const lectures = this.getLectures();
      const filtered = lectures.filter((l) => l.id !== id);
      localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error('Error deleting lecture:', e);
      return false;
    }
  }

  static renameLecture(id: string, newTitle: string): boolean {
    const lecture = this.getLectureById(id);
    if (!lecture) return false;
    lecture.title = newTitle;
    this.saveLecture(lecture);
    return true;
  }

  static toggleBookmarkLecture(id: string): boolean {
    const lecture = this.getLectureById(id);
    if (!lecture) return false;
    lecture.isBookmarked = !lecture.isBookmarked;
    this.saveLecture(lecture);
    return !!lecture.isBookmarked;
  }

  static toggleBookmarkTerm(termId: string): boolean {
    if (!this.isBrowser()) return false;

    try {
      const lectures = this.getLectures();
      let newState = false;

      for (const lecture of lectures) {
        // Update in lecture terms
        const term = lecture.terms?.find((t) => t.id === termId);
        if (term) {
          term.isBookmarked = !term.isBookmarked;
          newState = !!term.isBookmarked;
        }

        // Also update in slide terms
        for (const slide of lecture.slides) {
          const sTerm = slide.terms?.find((t) => t.id === termId);
          if (sTerm) {
            sTerm.isBookmarked = newState;
          }
        }
      }

      localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(lectures));
      return newState;
    } catch (e) {
      console.error('Error toggling term bookmark:', e);
      return false;
    }
  }

  static getAllTerms(): MedicalTerm[] {
    const lectures = this.getLectures();
    const termMap = new Map<string, MedicalTerm>();

    for (const lecture of lectures) {
      for (const term of lecture.terms || []) {
        if (!termMap.has(term.english.toLowerCase())) {
          termMap.set(term.english.toLowerCase(), term);
        }
      }
    }

    return Array.from(termMap.values());
  }

  static saveExamAttempt(attempt: ExamAttempt): void {
    if (!this.isBrowser()) return;

    try {
      const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      const attempts: ExamAttempt[] = stored ? JSON.parse(stored) : [];
      attempts.unshift(attempt);
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts.slice(0, 50))); // Keep last 50
    } catch (e) {
      console.error('Error saving exam attempt:', e);
    }
  }

  static getExamAttempts(lectureId?: string): ExamAttempt[] {
    if (!this.isBrowser()) return [];

    try {
      const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (!stored) return [];
      const attempts: ExamAttempt[] = JSON.parse(stored);
      if (lectureId) {
        return attempts.filter((a) => a.lectureId === lectureId);
      }
      return attempts;
    } catch (e) {
      console.error('Error reading exam attempts:', e);
      return [];
    }
  }
}

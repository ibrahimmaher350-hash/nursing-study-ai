// ==============================================================================
// NURSING STUDY AI — STORAGE REPOSITORY (WITH HIERARCHICAL FOLDERS & SUBJECTS)
// مستودع البيانات الهجين المتكامل: مجلدات متداخلة، مواد، محاضرات، ومصطلحات
// ==============================================================================

import { Lecture, MedicalTerm, ExamAttempt, StudyFolder } from '@/types';
import { SAMPLE_SHOCK_LECTURE } from '@/lib/parsers/sampleLectures';

const LECTURES_STORAGE_KEY = 'nursing_study_ai_lectures_v1';
const FOLDERS_STORAGE_KEY = 'nursing_study_ai_folders_v1';
const ATTEMPTS_STORAGE_KEY = 'nursing_study_ai_attempts_v1';

// Initial sample folder structure for Egyptian nursing curriculum
export const INITIAL_SAMPLE_FOLDERS: StudyFolder[] = [
  {
    id: 'folder_year_3',
    name: 'السنة الثالثة',
    parentId: null,
    type: 'folder',
    color: 'sky',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'folder_term_1',
    name: 'الترم الأول',
    parentId: 'folder_year_3',
    type: 'folder',
    color: 'emerald',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'subject_critical_care',
    name: 'Critical Care Nursing (حالات حرجة)',
    parentId: 'folder_term_1',
    type: 'subject',
    color: 'purple',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export class LectureRepository {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // ============================================================================
  // FOLDERS & SUBJECTS MANAGEMENT
  // ============================================================================

  static getAllFolders(): StudyFolder[] {
    if (!this.isBrowser()) return INITIAL_SAMPLE_FOLDERS;

    try {
      const stored = localStorage.getItem(FOLDERS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_FOLDERS));
        return INITIAL_SAMPLE_FOLDERS;
      }
      return JSON.parse(stored) as StudyFolder[];
    } catch (e) {
      console.error('Error reading folders:', e);
      return INITIAL_SAMPLE_FOLDERS;
    }
  }

  static getFolders(parentId: string | null = null): StudyFolder[] {
    const all = this.getAllFolders();
    return all.filter((f) => f.parentId === parentId);
  }

  static getFolderById(id: string): StudyFolder | null {
    const all = this.getAllFolders();
    return all.find((f) => f.id === id) || null;
  }

  // Get ordered breadcrumb path from Root -> Leaf
  static getFolderPath(folderId: string | null): StudyFolder[] {
    if (!folderId) return [];
    const all = this.getAllFolders();
    const path: StudyFolder[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = all.find((f) => f.id === currentId);
      if (folder) {
        path.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
    }

    return path;
  }

  static createFolder(
    name: string,
    parentId: string | null = null,
    type: 'folder' | 'subject' = 'folder',
    color: string = 'sky'
  ): StudyFolder {
    const newFolder: StudyFolder = {
      id: `folder_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      parentId,
      type,
      color,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.isBrowser()) {
      const all = this.getAllFolders();
      all.push(newFolder);
      localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(all));
    }

    return newFolder;
  }

  static renameFolder(id: string, newName: string): boolean {
    if (!this.isBrowser() || !newName.trim()) return false;
    const all = this.getAllFolders();
    const folder = all.find((f) => f.id === id);
    if (!folder) return false;

    folder.name = newName.trim();
    folder.updatedAt = new Date().toISOString();
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(all));
    return true;
  }

  static moveFolder(id: string, targetParentId: string | null): boolean {
    if (!this.isBrowser()) return false;
    if (id === targetParentId) return false; // Cannot move into self

    const all = this.getAllFolders();
    const folder = all.find((f) => f.id === id);
    if (!folder) return false;

    // Check circular dependency: target cannot be a descendant of id
    let checkId = targetParentId;
    while (checkId) {
      if (checkId === id) return false; // Loop detected
      const parent = all.find((f) => f.id === checkId);
      checkId = parent ? parent.parentId : null;
    }

    folder.parentId = targetParentId;
    folder.updatedAt = new Date().toISOString();
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(all));
    return true;
  }

  // Recursive count of subfolders and lectures inside a folder
  static getFolderStats(folderId: string): { subfolderCount: number; lectureCount: number } {
    const allFolders = this.getAllFolders();
    const allLectures = this.getLectures();

    const descendantFolderIds = new Set<string>([folderId]);
    let added = true;

    while (added) {
      added = false;
      for (const f of allFolders) {
        if (f.parentId && descendantFolderIds.has(f.parentId) && !descendantFolderIds.has(f.id)) {
          descendantFolderIds.add(f.id);
          added = true;
        }
      }
    }

    const subfolderCount = descendantFolderIds.size - 1; // Exclude self
    const lectureCount = allLectures.filter(
      (l) => l.folderId && descendantFolderIds.has(l.folderId)
    ).length;

    return { subfolderCount, lectureCount };
  }

  // Safe deletion: removes folder and all nested descendants
  static deleteFolder(id: string): {
    success: boolean;
    deletedFoldersCount: number;
    deletedLecturesCount: number;
  } {
    if (!this.isBrowser()) {
      return { success: false, deletedFoldersCount: 0, deletedLecturesCount: 0 };
    }

    const allFolders = this.getAllFolders();
    const allLectures = this.getLectures();

    // Find all descendant IDs recursively
    const folderIdsToDelete = new Set<string>([id]);
    let added = true;

    while (added) {
      added = false;
      for (const f of allFolders) {
        if (f.parentId && folderIdsToDelete.has(f.parentId) && !folderIdsToDelete.has(f.id)) {
          folderIdsToDelete.add(f.id);
          added = true;
        }
      }
    }

    const remainingFolders = allFolders.filter((f) => !folderIdsToDelete.has(f.id));
    const lecturesToDelete = allLectures.filter(
      (l) => l.folderId && folderIdsToDelete.has(l.folderId)
    );
    const remainingLectures = allLectures.filter(
      (l) => !l.folderId || !folderIdsToDelete.has(l.folderId)
    );

    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(remainingFolders));
    localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(remainingLectures));

    return {
      success: true,
      deletedFoldersCount: folderIdsToDelete.size,
      deletedLecturesCount: lecturesToDelete.length,
    };
  }

  // 1-Click Academic Organization Starter Template (Rule 5 & 30)
  static applyAcademicTemplate(): void {
    if (!this.isBrowser()) return;

    const templateFolders: StudyFolder[] = [
      // Year 1
      { id: 'f_y1', name: 'السنة الأولى', parentId: null, type: 'folder', color: 'sky', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'f_y1_t1', name: 'الترم الأول', parentId: 'f_y1', type: 'folder', color: 'sky', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's_fund', name: 'Fundamentals of Nursing (أساسيات التمريض)', parentId: 'f_y1_t1', type: 'subject', color: 'purple', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's_anat', name: 'Anatomy (التشريح)', parentId: 'f_y1_t1', type: 'subject', color: 'emerald', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's_phys', name: 'Physiology (علم وظائف الأعضاء)', parentId: 'f_y1_t1', type: 'subject', color: 'amber', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'f_y1_t2', name: 'الترم الثاني', parentId: 'f_y1', type: 'folder', color: 'sky', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Year 2
      { id: 'f_y2', name: 'السنة الثانية', parentId: null, type: 'folder', color: 'emerald', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'f_y2_t1', name: 'الترم الأول', parentId: 'f_y2', type: 'folder', color: 'emerald', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's_medsurg', name: 'Medical Surgical Nursing (تمريض باطني وجراحي)', parentId: 'f_y2_t1', type: 'subject', color: 'purple', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 's_pharm', name: 'Pharmacology (علم الأدوية)', parentId: 'f_y2_t1', type: 'subject', color: 'rose', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Year 3
      { id: 'f_y3', name: 'السنة الثالثة', parentId: null, type: 'folder', color: 'purple', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'f_y3_t1', name: 'الترم الأول', parentId: 'f_y3', type: 'folder', color: 'purple', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
      { id: 'subject_critical_care', name: 'Critical Care Nursing (تمريض الحالات الحرجة)', parentId: 'f_y3_t1', type: 'subject', color: 'purple', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },

      // Year 4
      { id: 'f_y4', name: 'السنة الرابعة', parentId: null, type: 'folder', color: 'amber', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ];

    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(templateFolders));

    // Also link sample shock lecture to critical care
    const lectures = this.getLectures();
    const shock = lectures.find((l) => l.id === SAMPLE_SHOCK_LECTURE.id);
    if (shock) {
      shock.folderId = 'subject_critical_care';
      localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(lectures));
    }
  }

  // ============================================================================
  // LECTURES MANAGEMENT
  // ============================================================================

  static getLectures(): Lecture[] {
    if (!this.isBrowser()) {
      return [{ ...SAMPLE_SHOCK_LECTURE, folderId: 'subject_critical_care' }];
    }

    try {
      const stored = localStorage.getItem(LECTURES_STORAGE_KEY);
      if (!stored) {
        const initial = [{ ...SAMPLE_SHOCK_LECTURE, folderId: 'subject_critical_care' }];
        localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(stored) as Lecture[];
    } catch (e) {
      console.error('Error reading lectures:', e);
      return [{ ...SAMPLE_SHOCK_LECTURE, folderId: 'subject_critical_care' }];
    }
  }

  static getLecturesByFolder(folderId: string | null): Lecture[] {
    const all = this.getLectures();
    return all.filter((l) => (l.folderId ?? null) === folderId);
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
          lastOpenedAt: new Date().toISOString(),
        });
      }

      localStorage.setItem(LECTURES_STORAGE_KEY, JSON.stringify(lectures));
    } catch (e) {
      console.error('Error saving lecture:', e);
    }
  }

  static moveLecture(lectureId: string, targetFolderId: string | null): boolean {
    const lecture = this.getLectureById(lectureId);
    if (!lecture) return false;
    lecture.folderId = targetFolderId;
    this.saveLecture(lecture);
    return true;
  }

  static touchLecture(id: string): void {
    const lecture = this.getLectureById(id);
    if (lecture) {
      lecture.lastOpenedAt = new Date().toISOString();
      this.saveLecture(lecture);
    }
  }

  static getRecentLectures(limit: number = 4): Lecture[] {
    const all = this.getLectures();
    return all
      .slice()
      .sort((a, b) => {
        const timeA = new Date(a.lastOpenedAt || a.updatedAt || a.createdAt).getTime();
        const timeB = new Date(b.lastOpenedAt || b.updatedAt || b.createdAt).getTime();
        return timeB - timeA;
      })
      .slice(0, limit);
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
    if (!lecture || !newTitle.trim()) return false;
    lecture.title = newTitle.trim();
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
        const term = lecture.terms?.find((t) => t.id === termId);
        if (term) {
          term.isBookmarked = !term.isBookmarked;
          newState = !!term.isBookmarked;
        }

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
      localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts.slice(0, 50)));
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

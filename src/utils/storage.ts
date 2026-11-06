import type { UserProgress, RowMastery, SpeedChallengeRecord } from '../types/practice';
import type { UserSettings } from '../types/settings';

const SETTINGS_KEY = 'flick_lab_settings_v1';
const PROGRESS_KEY = 'flick_lab_progress_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  flickSensitivity: 'medium', // 28px
  soundEnabled: true,
  soundVolume: 0.6,
  soundTheme: 'click',
  showRomaji: true,
  showFlickHints: true,
  languageMeaning: 'vi',
  theme: 'dark', // Default to pure dark theme as requested
};

export function createDefaultProgress(): UserProgress {
  return {
    totalSessions: 0,
    totalCharsTyped: 0,
    correctCharsTyped: 0,
    overallAccuracy: 100,
    bestCPM: 0,
    currentStreakDays: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10),
    rowMastery: {},
    completedWordIds: [],
    completedLessonIds: [],
    challengeHistory: [],
  };
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed, theme: 'dark' }; // Always enforce pure dark theme
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ ...settings, theme: 'dark' }));
  } catch {}
}

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return createDefaultProgress();
    const parsed = JSON.parse(raw);
    const data: UserProgress = {
      ...createDefaultProgress(),
      ...parsed,
      rowMastery: { ...parsed.rowMastery },
      completedWordIds: [...(parsed.completedWordIds || [])],
      completedLessonIds: [...(parsed.completedLessonIds || [])],
      challengeHistory: [...(parsed.challengeHistory || [])],
    };

    // Update streak check
    const today = new Date().toISOString().slice(0, 10);
    const lastDate = data.lastActiveDate;

    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === yesterday) {
        data.currentStreakDays += 1;
      } else if (new Date(today).getTime() - new Date(lastDate).getTime() > 86400000 * 2) {
        data.currentStreakDays = 1;
      }
      data.lastActiveDate = today;
      saveProgress(data);
    }

    return data;
  } catch {
    return createDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}

export function recordKanaPractice(
  rowId: string,
  isCorrect: boolean,
  timeMs: number
): void {
  const p = loadProgress();
  p.totalCharsTyped += 1;
  if (isCorrect) p.correctCharsTyped += 1;
  p.overallAccuracy = Math.round((p.correctCharsTyped / Math.max(1, p.totalCharsTyped)) * 100);

  const curMastery: RowMastery = p.rowMastery[rowId] || {
    rowId: rowId as any,
    attempts: 0,
    correct: 0,
    accuracy: 0,
    avgTimeMs: timeMs,
  };

  curMastery.attempts += 1;
  if (isCorrect) curMastery.correct += 1;
  curMastery.accuracy = Math.round((curMastery.correct / curMastery.attempts) * 100);
  curMastery.avgTimeMs = Math.round((curMastery.avgTimeMs * (curMastery.attempts - 1) + timeMs) / curMastery.attempts);

  p.rowMastery[rowId] = curMastery;
  saveProgress(p);
}

export function recordCompletedWord(wordId: string): void {
  const p = loadProgress();
  if (!p.completedWordIds.includes(wordId)) {
    p.completedWordIds.push(wordId);
    saveProgress(p);
  }
}

export function recordCompletedLesson(lessonId: string): void {
  const p = loadProgress();
  if (!p.completedLessonIds.includes(lessonId)) {
    p.completedLessonIds.push(lessonId);
    saveProgress(p);
  }
}

export function recordSpeedChallenge(record: SpeedChallengeRecord): void {
  const p = loadProgress();
  p.totalSessions += 1;
  p.challengeHistory.unshift(record);
  if (p.challengeHistory.length > 20) {
    p.challengeHistory.pop();
  }
  if (record.cpm > p.bestCPM) {
    p.bestCPM = record.cpm;
  }
  saveProgress(p);
}

export function resetAllData(): void {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch {}
}

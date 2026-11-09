import type { UserProgress, RowMastery, SpeedChallengeRecord } from '../types/practice';
import type { UserSettings } from '../types/settings';
import {
  getItem,
  setItem,
  clear,
  getCachedItem,
  setCachedItem,
  migrateFromLocalStorage,
} from '../lib/db';

export const SETTINGS_KEY = 'flick_lab_settings_v1';
export const PROGRESS_KEY = 'flick_lab_progress_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  flickSensitivity: 'medium', // 28px
  soundEnabled: true,
  soundVolume: 0.6,
  soundTheme: 'click',
  showRomaji: true,
  showFlickHints: true,
  blindMode: false,
  languageMeaning: 'vi',
  theme: 'dark', // Pure dark sumi theme
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
    minigameHighScore: 0,
    minigameMaxCombo: 0,
    minigameGamesPlayed: 0,
  };
}

/**
 * Validates and updates user streak based on current date.
 */
function updateStreak(data: UserProgress): UserProgress {
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
  }
  return data;
}

/**
 * Initializes storage:
 * 1. Automatically migrates legacy localStorage data to IndexedDB if present.
 * 2. Hydrates settings and progress from IndexedDB into the in-memory cache.
 */
export async function initStorage(): Promise<{ settings: UserSettings; progress: UserProgress }> {
  try {
    await migrateFromLocalStorage();
  } catch (err) {
    console.warn('[Storage] Migration check failed:', err);
  }

  const [settings, progress] = await Promise.all([
    loadSettingsAsync(),
    loadProgressAsync(),
  ]);

  return { settings, progress };
}

/**
 * Asynchronously loads settings from IndexedDB (or memory cache).
 */
export async function loadSettingsAsync(): Promise<UserSettings> {
  const cached = getCachedItem<UserSettings>(SETTINGS_KEY);
  if (cached) {
    return { ...DEFAULT_SETTINGS, ...cached, theme: 'dark' };
  }

  try {
    const stored = await getItem<UserSettings>(SETTINGS_KEY);
    if (!stored) {
      setCachedItem(SETTINGS_KEY, DEFAULT_SETTINGS);
      return { ...DEFAULT_SETTINGS };
    }
    const finalSettings: UserSettings = { ...DEFAULT_SETTINGS, ...stored, theme: 'dark' };
    setCachedItem(SETTINGS_KEY, finalSettings);
    return finalSettings;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Asynchronously saves settings to IndexedDB and memory cache.
 */
export async function saveSettingsAsync(settings: UserSettings): Promise<void> {
  const payload = { ...settings, theme: 'dark' as const };
  setCachedItem(SETTINGS_KEY, payload);
  await setItem(SETTINGS_KEY, payload);
}

/**
 * Asynchronously loads progress from IndexedDB (or memory cache).
 */
export async function loadProgressAsync(): Promise<UserProgress> {
  const cached = getCachedItem<UserProgress>(PROGRESS_KEY);
  if (cached) {
    const updated = updateStreak({ ...cached });
    setCachedItem(PROGRESS_KEY, updated);
    return updated;
  }

  try {
    const stored = await getItem<UserProgress>(PROGRESS_KEY);
    if (!stored) {
      const def = createDefaultProgress();
      setCachedItem(PROGRESS_KEY, def);
      return def;
    }

    const data: UserProgress = {
      ...createDefaultProgress(),
      ...stored,
      rowMastery: { ...stored.rowMastery },
      completedWordIds: [...(stored.completedWordIds || [])],
      completedLessonIds: [...(stored.completedLessonIds || [])],
      challengeHistory: [...(stored.challengeHistory || [])],
    };

    const withStreak = updateStreak(data);
    setCachedItem(PROGRESS_KEY, withStreak);
    return withStreak;
  } catch {
    return createDefaultProgress();
  }
}

/**
 * Asynchronously saves progress to IndexedDB and memory cache.
 */
export async function saveProgressAsync(progress: UserProgress): Promise<void> {
  setCachedItem(PROGRESS_KEY, progress);
  await setItem(PROGRESS_KEY, progress);
}

// =======================================================================
// Synchronous Fast-Path APIs (Write-Through Cache)
// Used throughout UI components for zero-latency keystroke responsiveness.
// =======================================================================

export function loadSettings(): UserSettings {
  const cached = getCachedItem<UserSettings>(SETTINGS_KEY);
  if (cached) {
    return { ...DEFAULT_SETTINGS, ...cached, theme: 'dark' };
  }
  return { ...DEFAULT_SETTINGS };
}

export function saveSettings(settings: UserSettings): void {
  const payload = { ...settings, theme: 'dark' as const };
  setCachedItem(SETTINGS_KEY, payload);
  setItem(SETTINGS_KEY, payload).catch((err) => {
    console.warn('[Storage] Error persisting settings to IndexedDB:', err);
  });
}

export function loadProgress(): UserProgress {
  const cached = getCachedItem<UserProgress>(PROGRESS_KEY);
  if (cached) {
    const updated = updateStreak({ ...cached });
    setCachedItem(PROGRESS_KEY, updated);
    return updated;
  }
  const def = createDefaultProgress();
  setCachedItem(PROGRESS_KEY, def);
  return def;
}

export function saveProgress(progress: UserProgress): void {
  setCachedItem(PROGRESS_KEY, progress);
  setItem(PROGRESS_KEY, progress).catch((err) => {
    console.warn('[Storage] Error persisting progress to IndexedDB:', err);
  });
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

export function recordMinigameScore(score: number, maxCombo: number): { isNewHighScore: boolean; highScore: number } {
  const p = loadProgress();
  p.totalSessions += 1;
  p.minigameGamesPlayed = (p.minigameGamesPlayed || 0) + 1;
  p.minigameMaxCombo = Math.max(p.minigameMaxCombo || 0, maxCombo);

  const prevHigh = p.minigameHighScore || 0;
  const isNewHighScore = score > prevHigh;
  if (isNewHighScore) {
    p.minigameHighScore = score;
  }
  saveProgress(p);
  return { isNewHighScore, highScore: p.minigameHighScore || score };
}

export function resetAllData(): void {
  clear().catch((err) => {
    console.warn('[Storage] Error clearing IndexedDB:', err);
  });
  setCachedItem(SETTINGS_KEY, DEFAULT_SETTINGS);
  setCachedItem(PROGRESS_KEY, createDefaultProgress());
}

import type { FlickDirection } from './keyboard';

export type PracticeMode = 
  | 'dashboard'
  | 'curriculum'
  | 'tutorial'
  | 'flick'
  | 'word'
  | 'challenge'
  | 'minigame'
  | 'free'
  | 'progress';

export type KanaRowId = 
  | 'a' 
  | 'ka' 
  | 'sa' 
  | 'ta' 
  | 'na' 
  | 'ha' 
  | 'ma' 
  | 'ya' 
  | 'ra' 
  | 'wa' 
  | 'dakuten' 
  | 'small' 
  | 'punctuation';

export interface KanaTarget {
  char: string;
  keyId: string;
  direction: FlickDirection;
  rowId: KanaRowId;
  romaji: string;
  needsModifier?: boolean;
  baseChar?: string;
  modifierType?: 'dakuten' | 'handakuten' | 'small';
}

export type WordCategory = 'basics' | 'food' | 'nature' | 'daily' | 'culture';
export type WordDifficulty = 'easy' | 'medium' | 'hard';

export interface WordItem {
  id: string;
  kanji?: string;
  kana: string;
  romaji: string;
  meaningVi: string;
  meaningEn: string;
  category: WordCategory;
  difficulty: WordDifficulty;
}

export interface RowMastery {
  rowId: KanaRowId;
  attempts: number;
  correct: number;
  accuracy: number;
  avgTimeMs: number;
}

export interface SpeedChallengeRecord {
  date: string;
  durationSeconds: 30 | 60;
  mode: 'kana' | 'word';
  cpm: number;
  accuracy: number;
  totalChars: number;
  score: number;
  rank: 'S' | 'A' | 'B' | 'C' | 'D';
}

export interface UserProgress {
  totalSessions: number;
  totalCharsTyped: number;
  correctCharsTyped: number;
  overallAccuracy: number;
  bestCPM: number;
  currentStreakDays: number;
  lastActiveDate: string; // ISO string or YYYY-MM-DD
  rowMastery: Record<string, RowMastery>;
  completedWordIds: string[];
  completedLessonIds: string[];
  challengeHistory: SpeedChallengeRecord[];
  minigameHighScore?: number;
  minigameMaxCombo?: number;
  minigameGamesPlayed?: number;
}

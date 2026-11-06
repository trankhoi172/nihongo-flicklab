// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadSettings,
  loadProgress,
  recordKanaPractice,
  recordCompletedWord,
  recordSpeedChallenge,
  resetAllData,
  DEFAULT_SETTINGS,
} from '../utils/storage';
import type { FlickDirection } from '../types/keyboard';

function calculateDirection(dx: number, dy: number, threshold = 28): FlickDirection {
  const dist = Math.hypot(dx, dy);
  if (dist < threshold) {
    return 'center';
  }

  const deg = (Math.atan2(dy, dx) * 180) / Math.PI;

  if (deg >= -45 && deg < 45) {
    return 'right';
  } else if (deg >= 45 && deg < 135) {
    return 'down';
  } else if (deg >= -135 && deg < -45) {
    return 'up';
  } else {
    return 'left';
  }
}

describe('Pointer Gesture Recognition Logic', () => {
  it('should identify short movements as TAP (center)', () => {
    expect(calculateDirection(0, 0, 28)).toBe('center');
    expect(calculateDirection(10, 5, 28)).toBe('center');
    expect(calculateDirection(-15, -10, 28)).toBe('center');
    expect(calculateDirection(20, 0, 28)).toBe('center');
  });

  it('should correctly classify LEFT flick (dx < -threshold)', () => {
    expect(calculateDirection(-35, 0, 28)).toBe('left');
    expect(calculateDirection(-40, 5, 28)).toBe('left');
    expect(calculateDirection(-50, -5, 28)).toBe('left');
  });

  it('should correctly classify RIGHT flick (dx > threshold)', () => {
    expect(calculateDirection(35, 0, 28)).toBe('right');
    expect(calculateDirection(40, -5, 28)).toBe('right');
    expect(calculateDirection(50, 10, 28)).toBe('right');
  });

  it('should correctly classify UP flick (dy < -threshold)', () => {
    expect(calculateDirection(0, -35, 28)).toBe('up');
    expect(calculateDirection(5, -45, 28)).toBe('up');
    expect(calculateDirection(-5, -50, 28)).toBe('up');
  });

  it('should correctly classify DOWN flick (dy > threshold)', () => {
    expect(calculateDirection(0, 35, 28)).toBe('down');
    expect(calculateDirection(5, 45, 28)).toBe('down');
    expect(calculateDirection(-8, 50, 28)).toBe('down');
  });
});

describe('LocalStorage & Progress Tracking', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should load default settings and progress when empty', () => {
    const s = loadSettings();
    expect(s.flickSensitivity).toBe(DEFAULT_SETTINGS.flickSensitivity);
    expect(s.languageMeaning).toBe('vi');

    const p = loadProgress();
    expect(p.totalCharsTyped).toBe(0);
    expect(p.bestCPM).toBe(0);
  });

  it('should record kana practice and update accuracy & row mastery', () => {
    recordKanaPractice('ka', true, 350);
    recordKanaPractice('ka', true, 400);
    recordKanaPractice('ka', false, 800);

    const p = loadProgress();
    expect(p.totalCharsTyped).toBe(3);
    expect(p.correctCharsTyped).toBe(2);
    expect(p.overallAccuracy).toBe(67);

    const kaMastery = p.rowMastery['ka'];
    expect(kaMastery).toBeDefined();
    expect(kaMastery.attempts).toBe(3);
    expect(kaMastery.correct).toBe(2);
    expect(kaMastery.accuracy).toBe(67);
  });

  it('should record completed word and prevent duplicates', () => {
    recordCompletedWord('w1');
    recordCompletedWord('w1');
    recordCompletedWord('w2');

    const p = loadProgress();
    expect(p.completedWordIds).toEqual(['w1', 'w2']);
  });

  it('should record speed challenge and update best CPM', () => {
    recordSpeedChallenge({
      date: new Date().toISOString(),
      durationSeconds: 30,
      mode: 'kana',
      cpm: 120,
      accuracy: 98,
      totalChars: 60,
      score: 150,
      rank: 'A',
    });

    const p = loadProgress();
    expect(p.bestCPM).toBe(120);
    expect(p.challengeHistory).toHaveLength(1);
    expect(p.challengeHistory[0].rank).toBe('A');

    // Beat record
    recordSpeedChallenge({
      date: new Date().toISOString(),
      durationSeconds: 30,
      mode: 'kana',
      cpm: 165,
      accuracy: 100,
      totalChars: 82,
      score: 220,
      rank: 'S',
    });

    const p2 = loadProgress();
    expect(p2.bestCPM).toBe(165);
    expect(p2.challengeHistory).toHaveLength(2);
  });

  it('should reset all data on resetAllData() call', () => {
    recordCompletedWord('w1');
    resetAllData();
    const p = loadProgress();
    expect(p.completedWordIds).toEqual([]);
    expect(p.totalCharsTyped).toBe(0);
  });
});

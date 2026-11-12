// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from 'vitest';
import {
  getItem,
  setItem,
  removeItem,
  clear,
  setMany,
  getCachedItem,
  migrateFromLocalStorage,
  clearMemoryCache,
  populateMemoryCacheFromLocalStorage,
} from '../lib/db';
import {
  loadProgress,
  saveProgress,
  loadSettings,
  saveSettings,
  initStorage,
  createDefaultProgress,
  DEFAULT_SETTINGS,
} from '../utils/storage';

describe('IndexedDB & Memory Storage Module', () => {
  beforeEach(async () => {
    await clear();
    localStorage.clear();
  });

  it('correctly sets, gets, and removes values', async () => {
    await setItem('user_theme', 'sumi_dark');
    const val = await getItem<string>('user_theme');
    expect(val).toBe('sumi_dark');

    // Should be available in fast-path in-memory cache
    expect(getCachedItem('user_theme')).toBe('sumi_dark');

    await removeItem('user_theme');
    const removedVal = await getItem<string>('user_theme');
    expect(removedVal).toBeNull();
    expect(getCachedItem('user_theme')).toBeUndefined();
  });

  it('stores objects and arrays natively without manual JSON.stringify', async () => {
    const complexData = {
      score: 1500,
      history: ['a', 'ka', 'sa'],
      meta: { streak: 5 },
    };

    await setItem('complex_test', complexData);
    const retrieved = await getItem<typeof complexData>('complex_test');
    expect(retrieved).toEqual(complexData);
  });

  it('supports batch writing via setMany', async () => {
    await setMany([
      ['k1', 'v1'],
      ['k2', 42],
      ['k3', { active: true }],
    ]);

    expect(await getItem('k1')).toBe('v1');
    expect(await getItem('k2')).toBe(42);
    expect(await getItem('k3')).toEqual({ active: true });
  });

  it('automatically migrates legacy localStorage keys to IndexedDB', async () => {
    // Simulate legacy localStorage data from previous version
    const legacySettings = {
      flickSensitivity: 'high',
      soundEnabled: true,
      soundVolume: 0.9,
    };
    const legacyProgress = {
      totalCharsTyped: 520,
      bestCPM: 120,
      currentStreakDays: 3,
    };

    localStorage.setItem('flick_lab_settings_v1', JSON.stringify(legacySettings));
    localStorage.setItem('flick_lab_progress_v1', JSON.stringify(legacyProgress));

    const migrated = await migrateFromLocalStorage();
    expect(migrated).toBe(true);

    // Verify migrated data in new storage
    const newSettings = await getItem('flick_lab_settings_v1');
    const newProgress = await getItem('flick_lab_progress_v1');
    expect(newSettings).toEqual(legacySettings);
    expect(newProgress).toEqual(legacyProgress);

    // Migration flag set and backup maintained for instant F5 boot
    expect(localStorage.getItem('tdk_migration_completed')).toBe('true');
    expect(localStorage.getItem('flick_lab_settings_v1')).not.toBeNull();
    expect(localStorage.getItem('flick_lab_progress_v1')).not.toBeNull();

    // Second call should return false (already migrated)
    const secondMigration = await migrateFromLocalStorage();
    expect(secondMigration).toBe(false);
  });

  it('persists data across simulated page refresh (F5) without data loss', async () => {
    // 1. User practices and earns progress
    saveProgress({
      ...createDefaultProgress(),
      totalCharsTyped: 890,
      correctCharsTyped: 880,
      bestCPM: 154,
      currentStreakDays: 5,
    });
    saveSettings({
      ...DEFAULT_SETTINGS,
      soundVolume: 0.8,
      blindMode: true,
    });

    // 2. Simulate browser refresh (F5):
    // In-memory cache is wiped out (new JS context)
    clearMemoryCache();

    // 3. Page starts up: synchronous read (0ms render)
    populateMemoryCacheFromLocalStorage();
    const freshProgress = loadProgress();
    const freshSettings = loadSettings();

    expect(freshProgress.totalCharsTyped).toBe(890);
    expect(freshProgress.bestCPM).toBe(154);
    expect(freshProgress.currentStreakDays).toBe(5);
    expect(freshSettings.soundVolume).toBe(0.8);
    expect(freshSettings.blindMode).toBe(true);

    // 4. Async IndexedDB hydration completes
    const asyncInit = await initStorage();
    expect(asyncInit.progress.totalCharsTyped).toBe(890);
    expect(asyncInit.settings.soundVolume).toBe(0.8);
  });
});

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
} from '../lib/db';

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

    // Verify old localStorage keys were cleaned up
    expect(localStorage.getItem('flick_lab_settings_v1')).toBeNull();
    expect(localStorage.getItem('flick_lab_progress_v1')).toBeNull();
    expect(localStorage.getItem('tdk_migration_completed')).toBe('true');

    // Second call should return false (already migrated)
    const secondMigration = await migrateFromLocalStorage();
    expect(secondMigration).toBe(false);
  });
});

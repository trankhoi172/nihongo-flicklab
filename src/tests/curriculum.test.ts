import { describe, it, expect } from 'vitest';
import { CURRICULUM_MODULES } from '../constants/curriculum';
import { KEYBOARD_LAYOUT } from '../constants/keyboardLayout';
import { getKanaInfo } from '../utils/kanaHelper';

describe('Curriculum Structure & Content Integrity', () => {
  it('should have exactly 8 modules covering complete Kana Flick curriculum', () => {
    expect(CURRICULUM_MODULES).toHaveLength(8);
    const moduleIds = CURRICULUM_MODULES.map((m) => m.id);
    expect(moduleIds).toEqual([
      'mod-1',
      'mod-2',
      'mod-3',
      'mod-4',
      'mod-5',
      'mod-6',
      'mod-7',
      'mod-8',
    ]);
  });

  it('should have 27 total lessons across all modules', () => {
    const allLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons);
    expect(allLessons.length).toBe(27);
  });

  it('every lesson must have valid metadata, non-empty practice targets, and steps', () => {
    const validKeyIds = new Set(KEYBOARD_LAYOUT.map((k) => k.id));
    const validDirections = new Set(['center', 'left', 'up', 'right', 'down']);

    CURRICULUM_MODULES.forEach((mod) => {
      expect(mod.title).toBeTruthy();
      expect(mod.japaneseTitle).toBeTruthy();
      expect(mod.description).toBeTruthy();
      expect(mod.lessons.length).toBeGreaterThan(0);

      mod.lessons.forEach((lesson) => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(lesson.japaneseTitle).toBeTruthy();
        expect(lesson.description).toBeTruthy();
        expect(lesson.rules.length).toBeGreaterThan(0);
        expect(lesson.practiceTargets.length).toBeGreaterThan(0);
        expect(lesson.steps.length).toBeGreaterThan(0);

        // Verify each step points to a valid key and direction
        lesson.steps.forEach((step) => {
          expect(step.char).toBeTruthy();
          expect(validKeyIds.has(step.keyId)).toBe(true);
          expect(validDirections.has(step.direction)).toBe(true);
          expect(step.explanation).toBeTruthy();
        });
      });
    });
  });

  it('verifies Module 1 covers 5 basic vowels (あ い う え お) correctly with standard flick directions', () => {
    const modVowels = CURRICULUM_MODULES.find((m) => m.id === 'mod-1');
    expect(modVowels).toBeDefined();

    const lessonA = modVowels?.lessons[0];
    expect(lessonA?.practiceTargets).toContain('あ');
    expect(lessonA?.practiceTargets).toContain('い');
    expect(lessonA?.practiceTargets).toContain('う');
    expect(lessonA?.practiceTargets).toContain('え');
    expect(lessonA?.practiceTargets).toContain('お');

    const stepMap = new Map(lessonA?.steps.map((s) => [s.char, s.direction]));
    expect(stepMap.get('あ')).toBe('center');
    expect(stepMap.get('い')).toBe('left');
    expect(stepMap.get('う')).toBe('up');
    expect(stepMap.get('え')).toBe('right');
    expect(stepMap.get('お')).toBe('down');
  });

  it('verifies all 10 standard rows are present in the curriculum', () => {
    const allLessonTitles = CURRICULUM_MODULES.flatMap((m) => m.lessons.map((l) => l.title));
    const expectedRows = ['あ行', 'か行', 'さ行', 'た行', 'な行', 'は行', 'ま行', 'や行', 'ら行', 'わ行'];

    expectedRows.forEach((row) => {
      const found = allLessonTitles.some((title) => title.includes(row));
      expect(found).toBe(true);
    });
  });

  it('verifies dakuten and handakuten rules in Module 3 use the modifier key', () => {
    const modDakuten = CURRICULUM_MODULES.find((m) => m.id === 'mod-3');
    expect(modDakuten).toBeDefined();

    const dakuSteps = modDakuten?.lessons.flatMap((l) => l.steps) || [];
    const usesModifier = dakuSteps.some((step) => step.needsModifier === true);
    expect(usesModifier).toBe(true);
  });

  it('verifies yōon lessons in Module 5 cover small kana (ゃ, ゅ, ょ) and compound words', () => {
    const modYoon = CURRICULUM_MODULES.find((m) => m.id === 'mod-5');
    expect(modYoon).toBeDefined();

    const allYoonTargets = modYoon?.lessons.flatMap((l) => l.practiceTargets) || [];
    expect(allYoonTargets).toContain('ゃ');
    expect(allYoonTargets).toContain('ゅ');
    expect(allYoonTargets).toContain('ょ');
    expect(allYoonTargets).toContain('おちゃ');
    expect(allYoonTargets).toContain('しゃしん');
  });

  it('verifies punctuation and symbols in Module 6 cover 、 。 ？ ！', () => {
    const modSpecial = CURRICULUM_MODULES.find((m) => m.id === 'mod-6');
    expect(modSpecial).toBeDefined();

    const allTargets = modSpecial?.lessons.flatMap((l) => l.practiceTargets) || [];
    expect(allTargets).toContain('、');
    expect(allTargets).toContain('。');
    expect(allTargets).toContain('？');
    expect(allTargets).toContain('！');
  });

  it('every individual kana character in targets has valid info or is recognized', () => {
    CURRICULUM_MODULES.forEach((mod) => {
      mod.lessons.forEach((lesson) => {
        lesson.practiceTargets.forEach((target) => {
          for (const char of target) {
            const info = getKanaInfo(char);
            const isRecognized = info !== null || '？！…ー、。0123456789'.includes(char);
            expect(isRecognized).toBe(true);
          }
        });
      });
    });
  });
});

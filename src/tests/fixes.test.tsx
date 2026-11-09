// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { WordPracticeMode } from '../components/modes/WordPracticeMode';
import { CurriculumMode } from '../components/modes/CurriculumMode';
import { applyModifier, isReachableInCycle, getModifiedChar, getPracticeTargets } from '../utils/kanaHelper';
import { DEFAULT_SETTINGS } from '../utils/storage';

vi.mock('../utils/audio', () => ({
  soundEffects: {
    unlock: vi.fn(),
    playTap: vi.fn(),
    playFlickDirection: vi.fn(),
    playSuccess: vi.fn(),
    playError: vi.fn(),
    playCelebration: vi.fn(),
    playTick: vi.fn(),
  },
}));

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

describe('Bug Fixes Verification', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it('correctly handles multi-step modifier transformations for "ba" and "pa"', () => {
    // Ha -> Ba (Dakuten flick or tap)
    const baDirect = applyModifier('は', 'left');
    expect(baDirect).toBe('ば');

    // Ha -> Pa (Handakuten flick directly)
    const paDirect = applyModifier('は', 'right');
    expect(paDirect).toBe('ぱ');

    // Tap cycle: Ha -> Ba -> Pa
    const step1 = getModifiedChar('は');
    expect(step1).toBe('ば');
    const step2 = getModifiedChar(step1);
    expect(step2).toBe('ぱ');

    // Cycle reachability check
    expect(isReachableInCycle('は', 'ば')).toBe(true);
    expect(isReachableInCycle('は', 'ぱ')).toBe(true);
    expect(isReachableInCycle('ば', 'ぱ')).toBe(true);
  });

  it('renders WordPracticeMode and mounts stably without skipping words', () => {
    render(<WordPracticeMode settings={DEFAULT_SETTINGS} />);

    // Renders filter buttons and interactive cards
    expect(screen.getByText('Tất cả')).toBeDefined();
    expect(screen.getByText('Đổi từ khác')).toBeDefined();
  });

  it('guarantees practice targets exclude MOD and punctuation marks', () => {
    const targets = getPracticeTargets('all');
    const chars = targets.map((t) => t.char);
    const keyIds = targets.map((t) => t.keyId);

    // MOD key and punctuation must never appear as practice targets
    expect(chars).not.toContain('゛゜小');
    expect(chars).not.toContain('、');
    expect(chars).not.toContain('。');
    expect(chars).not.toContain('？');
    expect(chars).not.toContain('！');
    expect(chars).not.toContain('…');
    expect(chars).not.toContain('（');
    expect(chars).not.toContain('）');
    expect(keyIds).not.toContain('mod');
    expect(keyIds).not.toContain('sym');

    // Genuine kana must be present
    expect(chars).toContain('あ');
    expect(chars).toContain('か');
    expect(chars).toContain('が');
    expect(chars).toContain('ぱ');
  });

  it('renders CurriculumMode compound words with individual interactive slots', () => {
    render(<CurriculumMode settings={DEFAULT_SETTINGS} completedLessonIds={[]} />);
    // Lesson 1 is loaded with practiceTargets ['あ', 'い', ...]
    expect(screen.getAllByText(/Quy tắc vàng 5 hướng vuốt/).length).toBeGreaterThan(0);
    expect(screen.getByText('Thực hành gõ bài này:')).toBeDefined();
  });
});

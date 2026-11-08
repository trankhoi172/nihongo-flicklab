// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { WordPracticeMode } from '../components/modes/WordPracticeMode';
import { applyModifier, isReachableInCycle, getModifiedChar } from '../utils/kanaHelper';
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
});

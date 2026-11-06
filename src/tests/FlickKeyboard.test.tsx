// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import { FlickKeyboard } from '../components/keyboard/FlickKeyboard';
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

afterEach(() => {
  cleanup();
});

describe('FlickKeyboard Component & Gesture Interaction', () => {
  it('renders all 12 kana keys and utility buttons', () => {
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={vi.fn()}
        onModifier={vi.fn()}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    expect(screen.getByText('あ')).toBeDefined();
    expect(screen.getByText('か')).toBeDefined();
    expect(screen.getByText('さ')).toBeDefined();
    expect(screen.getByText('た')).toBeDefined();
    expect(screen.getByText('な')).toBeDefined();
    expect(screen.getByText('は')).toBeDefined();
    expect(screen.getByText('ま')).toBeDefined();
    expect(screen.getByText('や')).toBeDefined();
    expect(screen.getByText('ら')).toBeDefined();
    expect(screen.getByText('わ')).toBeDefined();
    expect(screen.getByText('、')).toBeDefined();
    expect(screen.getByText('゛゜小')).toBeDefined();

    expect(screen.getByText('空白')).toBeDefined();
    expect(screen.getByText('確定')).toBeDefined();
  });

  it('triggers onCharInput with "あ" when tapping the "a" key (no movement)', () => {
    const handleCharInput = vi.fn();
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={handleCharInput}
        onModifier={vi.fn()}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    const aKey = screen.getByLabelText('あ行 key');

    fireEvent.pointerDown(aKey, {
      clientX: 100,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerUp(aKey, {
      clientX: 100,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    expect(handleCharInput).toHaveBeenCalledWith('あ');
  });

  it('triggers onCharInput with "い" when flicking LEFT on the "a" key', () => {
    const handleCharInput = vi.fn();
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={handleCharInput}
        onModifier={vi.fn()}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    const aKey = screen.getByLabelText('あ行 key');

    fireEvent.pointerDown(aKey, {
      clientX: 100,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerMove(aKey, {
      clientX: 60,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerUp(aKey, {
      clientX: 60,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    expect(handleCharInput).toHaveBeenCalledWith('い');
  });

  it('triggers onCharInput with "う" when flicking UP on the "a" key', () => {
    const handleCharInput = vi.fn();
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={handleCharInput}
        onModifier={vi.fn()}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    const aKey = screen.getByLabelText('あ行 key');

    fireEvent.pointerDown(aKey, {
      clientX: 100,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerMove(aKey, {
      clientX: 100,
      clientY: 60,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerUp(aKey, {
      clientX: 100,
      clientY: 60,
      button: 0,
      pointerId: 1,
    });

    expect(handleCharInput).toHaveBeenCalledWith('う');
  });

  it('triggers onCharInput with "え" when flicking RIGHT on the "a" key', () => {
    const handleCharInput = vi.fn();
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={handleCharInput}
        onModifier={vi.fn()}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    const aKey = screen.getByLabelText('あ行 key');

    fireEvent.pointerDown(aKey, {
      clientX: 100,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerMove(aKey, {
      clientX: 140,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerUp(aKey, {
      clientX: 140,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    expect(handleCharInput).toHaveBeenCalledWith('え');
  });

  it('triggers onCharInput with "お" when flicking DOWN on the "a" key', () => {
    const handleCharInput = vi.fn();
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={handleCharInput}
        onModifier={vi.fn()}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    const aKey = screen.getByLabelText('あ行 key');

    fireEvent.pointerDown(aKey, {
      clientX: 100,
      clientY: 100,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerMove(aKey, {
      clientX: 100,
      clientY: 140,
      button: 0,
      pointerId: 1,
    });

    fireEvent.pointerUp(aKey, {
      clientX: 100,
      clientY: 140,
      button: 0,
      pointerId: 1,
    });

    expect(handleCharInput).toHaveBeenCalledWith('お');
  });

  it('calls onModifier when tapping the modifier key', () => {
    const handleModifier = vi.fn();
    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={vi.fn()}
        onModifier={handleModifier}
        onBackspace={vi.fn()}
        onSpace={vi.fn()}
        onEnter={vi.fn()}
      />
    );

    const modKey = screen.getByLabelText('゛゜小 key');
    fireEvent.pointerDown(modKey, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });
    fireEvent.pointerUp(modKey, { clientX: 100, clientY: 100, button: 0, pointerId: 1 });

    expect(handleModifier).toHaveBeenCalled();
  });

  it('calls onBackspace, onSpace, and onEnter when tapping respective action buttons', () => {
    const handleBackspace = vi.fn();
    const handleSpace = vi.fn();
    const handleEnter = vi.fn();

    render(
      <FlickKeyboard
        settings={DEFAULT_SETTINGS}
        onCharInput={vi.fn()}
        onModifier={vi.fn()}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
        onEnter={handleEnter}
      />
    );

    fireEvent.click(screen.getByTitle('Backspace'));
    expect(handleBackspace).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle('Space'));
    expect(handleSpace).toHaveBeenCalled();

    fireEvent.click(screen.getByTitle('Enter / Confirm'));
    expect(handleEnter).toHaveBeenCalled();
  });
});

import React, { useState } from 'react';
import { KEYBOARD_LAYOUT } from '../../constants/keyboardLayout';
import type { FlickDirection, KeyboardEventPayload } from '../../types/keyboard';
import type { UserSettings } from '../../types/settings';
import { KeyButton } from './KeyButton';
import { Delete, CornerDownLeft, Sparkles } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface FlickKeyboardProps {
  settings: UserSettings;
  targetKeyId?: string;
  targetDirection?: FlickDirection;
  onCharInput: (char: string) => void;
  onModifier: () => void;
  onBackspace: () => void;
  onSpace: () => void;
  onEnter: () => void;
  isKatakana?: boolean;
  onToggleKana?: (isKatakana: boolean) => void;
  className?: string;
}

export const FlickKeyboard: React.FC<FlickKeyboardProps> = ({
  settings,
  targetKeyId,
  targetDirection,
  onCharInput,
  onModifier,
  onBackspace,
  onSpace,
  onEnter,
  isKatakana: externalIsKatakana,
  onToggleKana: externalOnToggleKana,
  className = '',
}) => {
  const [internalIsKatakana, setInternalIsKatakana] = useState(false);
  const isKatakana = externalIsKatakana !== undefined ? externalIsKatakana : internalIsKatakana;

  const handleToggleKatakana = () => {
    const next = !isKatakana;
    if (externalOnToggleKana) {
      externalOnToggleKana(next);
    } else {
      setInternalIsKatakana(next);
    }
    if (settings.soundEnabled) {
      soundEffects.playTap(settings.soundTheme, settings.soundVolume);
    }
  };

  const handleKeyCommit = (payload: KeyboardEventPayload) => {
    if (payload.isModifier) {
      onModifier();
    } else {
      onCharInput(payload.char);
    }
  };

  const handleBackspace = () => {
    if (settings.soundEnabled) {
      soundEffects.playTap(settings.soundTheme, settings.soundVolume);
    }
    onBackspace();
  };

  const handleSpace = () => {
    if (settings.soundEnabled) {
      soundEffects.playTap(settings.soundTheme, settings.soundVolume);
    }
    onSpace();
  };

  const handleEnter = () => {
    if (settings.soundEnabled) {
      soundEffects.playTap(settings.soundTheme, settings.soundVolume);
    }
    onEnter();
  };

  return (
    <div
      className={`w-full max-w-sm sm:max-w-md mx-auto p-3 sm:p-4 rounded-3xl bg-stone-100/95 dark:bg-stone-900/95 border border-stone-200/80 dark:border-stone-800 shadow-xl backdrop-blur-md transition-colors select-none ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 4x3 Grid of 12 Kana Keys */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {KEYBOARD_LAYOUT.map((keyDef) => {
          const isHighlighted = targetKeyId === keyDef.id;

          return (
            <KeyButton
              key={keyDef.id}
              keyDef={keyDef}
              isKatakana={isKatakana}
              sensitivity={settings.flickSensitivity}
              soundEnabled={settings.soundEnabled}
              soundVolume={settings.soundVolume}
              soundTheme={settings.soundTheme}
              showRomaji={settings.showRomaji}
              showHints={settings.showFlickHints}
              isHighlighted={isHighlighted}
              targetDirection={isHighlighted ? targetDirection : undefined}
              onKeyCommit={handleKeyCommit}
            />
          );
        })}
      </div>

      {/* Bottom Utility Row */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-2.5">
        <button
          type="button"
          onClick={handleToggleKatakana}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 shadow-[0_2px_0_rgba(0,0,0,0.06)] active:translate-y-[1px] active:shadow-none transition-all"
          title="Hiragana / Katakana toggle"
        >
          <span className="text-xs sm:text-sm font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-red-500" />
            {isKatakana ? 'カナ' : 'かな'}
          </span>
          <span className="text-[9px] text-stone-400 font-mono uppercase mt-0.5">
            {isKatakana ? 'Kata' : 'Hira'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleSpace}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 shadow-[0_2px_0_rgba(0,0,0,0.06)] active:translate-y-[1px] active:shadow-none transition-all"
          title="Space"
        >
          <span className="text-xs sm:text-sm font-semibold">空白</span>
          <span className="text-[9px] text-stone-400 font-mono uppercase mt-0.5">Space</span>
        </button>

        <button
          type="button"
          onClick={handleBackspace}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700/60 shadow-[0_2px_0_rgba(0,0,0,0.06)] active:translate-y-[1px] active:shadow-none transition-all text-red-500/90 dark:text-red-400"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
          <span className="text-[9px] text-stone-400 font-mono uppercase mt-0.5">BS</span>
        </button>

        <button
          type="button"
          onClick={handleEnter}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-xl bg-stone-800 dark:bg-red-600 text-white shadow-[0_2px_0_rgba(0,0,0,0.2)] active:translate-y-[1px] active:shadow-none transition-all hover:bg-stone-900 dark:hover:bg-red-500"
          title="Enter / Confirm"
        >
          <CornerDownLeft className="w-4 h-4" />
          <span className="text-[9px] text-stone-300 dark:text-red-100 font-mono uppercase mt-0.5">
            確定
          </span>
        </button>
      </div>
    </div>
  );
};

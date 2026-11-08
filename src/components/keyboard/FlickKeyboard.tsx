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
  onModifier: (direction?: FlickDirection) => void;
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
      onModifier(payload.direction);
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
      className={`w-full max-w-sm sm:max-w-md mx-auto p-3 sm:p-4 rounded-3xl bg-[#18191f]/85 backdrop-blur-2xl border border-white/[0.08] shadow-2xl transition-all select-none overflow-visible relative z-20 ${className}`}
      style={{ touchAction: 'none' }}
    >
      {/* 4x3 Grid of 12 Kana Keys (overflow-visible so active key petals float freely) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 overflow-visible relative">
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
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5 mt-2.5 relative z-10">
        <button
          type="button"
          onClick={handleToggleKatakana}
          className="flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 border border-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.25)] active:scale-95 transition-all"
          title="Hiragana / Katakana toggle"
        >
          <span className="text-xs sm:text-sm font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-neutral-400" />
            {isKatakana ? 'カナ' : 'かな'}
          </span>
          <span className="text-[9px] text-neutral-400 font-mono uppercase mt-0.5">
            {isKatakana ? 'Kata' : 'Hira'}
          </span>
        </button>

        <button
          type="button"
          onClick={handleSpace}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 border border-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.25)] active:scale-95 transition-all"
          title="Space"
        >
          <span className="text-xs sm:text-sm font-semibold">空白</span>
          <span className="text-[9px] text-neutral-400 font-mono uppercase mt-0.5">Space</span>
        </button>

        <button
          type="button"
          onClick={handleBackspace}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 border border-white/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.25)] active:scale-95 transition-all"
          title="Backspace"
        >
          <Delete className="w-4 h-4" />
          <span className="text-[9px] text-neutral-400 font-mono uppercase mt-0.5">BS</span>
        </button>

        <button
          type="button"
          onClick={handleEnter}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-2xl bg-white text-black hover:bg-neutral-200 border border-white/20 shadow-sm font-bold active:scale-95 transition-all"
          title="Enter / Confirm"
        >
          <CornerDownLeft className="w-4 h-4" />
          <span className="text-[9px] font-mono uppercase mt-0.5 font-bold">
            確定
          </span>
        </button>
      </div>
    </div>
  );
};

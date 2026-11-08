import React from 'react';
import type { KeyDefinition, FlickDirection, KeyboardEventPayload } from '../../types/keyboard';
import type { FlickSensitivity, SoundTheme } from '../../types/settings';
import { usePointerFlick } from '../../hooks/usePointerFlick';
import { FlickFlower } from './FlickFlower';
import { soundEffects } from '../../utils/audio';

interface KeyButtonProps {
  keyDef: KeyDefinition;
  isKatakana: boolean;
  sensitivity: FlickSensitivity;
  soundEnabled: boolean;
  soundVolume: number;
  soundTheme: SoundTheme;
  showRomaji: boolean;
  showHints: boolean;
  isHighlighted?: boolean;
  targetDirection?: FlickDirection;
  onKeyCommit: (payload: KeyboardEventPayload) => void;
}

export const KeyButton: React.FC<KeyButtonProps> = ({
  keyDef,
  isKatakana,
  sensitivity,
  soundEnabled,
  soundVolume,
  soundTheme,
  showRomaji,
  showHints,
  isHighlighted = false,
  targetDirection,
  onKeyCommit,
}) => {
  const map = isKatakana ? keyDef.katakana : keyDef.hiragana;

  const handleFlickCommit = (direction: FlickDirection) => {
    const char = map[direction] || map.center;

    if (soundEnabled) {
      soundEffects.playTap(soundTheme, soundVolume);
    }

    onKeyCommit({
      keyId: keyDef.id,
      direction,
      char,
      isModifier: keyDef.isModifier,
    });
  };

  const { isPressing, currentDirection, handlers } = usePointerFlick({
    sensitivity,
    soundEnabled,
    soundVolume,
    onFlickCommit: handleFlickCommit,
  });

  const isModifier = !!keyDef.isModifier;
  const isPunctuation = !!keyDef.isPunctuation;

  return (
    <div
      {...handlers}
      className={`relative select-none touch-none cursor-pointer flex flex-col items-center justify-center rounded-2xl transition-all duration-75 min-h-[64px] sm:min-h-[72px] md:min-h-[78px] ${
        isPressing
          ? 'z-50 bg-white/[0.2] shadow-inner scale-[0.98]'
          : isModifier || isPunctuation
          ? 'z-10 bg-white/[0.05] hover:bg-white/[0.08] text-neutral-300 shadow-[0_1px_2px_rgba(0,0,0,0.25)] border border-white/[0.06] backdrop-blur-md'
          : 'z-10 bg-white/[0.09] hover:bg-white/[0.13] text-white shadow-[0_1px_3px_rgba(0,0,0,0.3)] border border-white/[0.08] backdrop-blur-md'
      } ${
        isHighlighted
          ? 'ring-2 ring-white/80 ring-offset-2 ring-offset-[#0B0C0E]'
          : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label={`${keyDef.rowName} key`}
    >
      {/* 5-way Satellite Hints on the Key Face (Hidden while pressing to prevent ghosting) */}
      {showHints && !isModifier && !isPunctuation && (
        <div className={`transition-opacity duration-75 ${isPressing ? 'opacity-0' : 'opacity-100'}`}>
          {/* Top (U-vowel) */}
          <span
            className={`absolute top-1 left-1/2 -translate-x-1/2 text-[11px] font-normal leading-none ${
              targetDirection === 'up' && isHighlighted
                ? 'text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            {map.up}
          </span>

          {/* Left (I-vowel) */}
          <span
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-normal leading-none ${
              targetDirection === 'left' && isHighlighted
                ? 'text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            {map.left}
          </span>

          {/* Right (E-vowel) */}
          <span
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-normal leading-none ${
              targetDirection === 'right' && isHighlighted
                ? 'text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            {map.right}
          </span>

          {/* Bottom (O-vowel) */}
          <span
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 text-[11px] font-normal leading-none ${
              targetDirection === 'down' && isHighlighted
                ? 'text-white font-bold'
                : 'text-neutral-400'
            }`}
          >
            {map.down}
          </span>
        </div>
      )}

      {/* Target Direction Arrow Indicator */}
      {isHighlighted && targetDirection && targetDirection !== 'center' && !isPressing && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg">
            {targetDirection === 'left' && '←'}
            {targetDirection === 'up' && '↑'}
            {targetDirection === 'right' && '→'}
            {targetDirection === 'down' && '↓'}
          </div>
        </div>
      )}

      {/* Center Kana Character (Hidden while pressing so FlickFlower center petal takes over) */}
      <div className={`flex flex-col items-center justify-center transition-opacity duration-75 ${isPressing ? 'opacity-0' : 'opacity-100'}`}>
        <span
          className={`font-medium tracking-tight leading-none ${
            isModifier
              ? 'text-sm sm:text-base font-medium text-neutral-300'
              : isPunctuation
              ? 'text-xl sm:text-2xl font-medium text-neutral-200'
              : 'text-2xl sm:text-3xl font-medium text-white'
          } ${
            isHighlighted && targetDirection === 'center'
              ? 'text-white font-bold underline decoration-white decoration-2'
              : ''
          }`}
        >
          {map.center}
        </span>

        {/* Subtitle / Romaji */}
        {showRomaji && !isModifier && !isPunctuation && (
          <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-mono mt-0.5 leading-none">
            {keyDef.romaji.center}
          </span>
        )}
      </div>

      {/* Floating 5-way blossom during touch/mouse drag */}
      {isPressing && (
        <FlickFlower
          keyDef={keyDef}
          isKatakana={isKatakana}
          activeDirection={currentDirection}
          showRomaji={showRomaji}
        />
      )}
    </div>
  );
};

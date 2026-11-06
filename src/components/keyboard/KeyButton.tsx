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
          ? 'bg-stone-200 dark:bg-stone-700 scale-[0.97] shadow-inner'
          : isModifier || isPunctuation
          ? 'bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200/70 dark:hover:bg-stone-700/80 text-stone-700 dark:text-stone-300 shadow-[0_2px_0_rgba(0,0,0,0.08)] border border-stone-200 dark:border-stone-700/60'
          : 'bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-100 shadow-[0_3px_0_rgba(0,0,0,0.09)] border border-stone-200/90 dark:border-stone-700/70'
      } ${
        isHighlighted
          ? 'ring-2 ring-red-500/80 dark:ring-red-400 ring-offset-2 dark:ring-offset-stone-900 animate-pulse'
          : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label={`${keyDef.rowName} key`}
    >
      {/* 5-way Satellite Hints on the Key Face */}
      {showHints && !isModifier && !isPunctuation && (
        <>
          <span
            className={`absolute top-1 text-[11px] font-medium leading-none ${
              targetDirection === 'up' && isHighlighted
                ? 'text-red-600 font-bold'
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            {map.up}
          </span>

          <span
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 text-[11px] font-medium leading-none ${
              targetDirection === 'left' && isHighlighted
                ? 'text-red-600 font-bold'
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            {map.left}
          </span>

          <span
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-medium leading-none ${
              targetDirection === 'right' && isHighlighted
                ? 'text-red-600 font-bold'
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            {map.right}
          </span>

          <span
            className={`absolute bottom-1 text-[11px] font-medium leading-none ${
              targetDirection === 'down' && isHighlighted
                ? 'text-red-600 font-bold'
                : 'text-stone-400 dark:text-stone-500'
            }`}
          >
            {map.down}
          </span>
        </>
      )}

      {/* Target Flick Direction Arrow Overlay */}
      {isHighlighted && targetDirection && targetDirection !== 'center' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 rounded-full bg-red-500/15 dark:bg-red-400/20 flex items-center justify-center text-red-600 dark:text-red-400 font-bold text-lg animate-bounce">
            {targetDirection === 'left' && '←'}
            {targetDirection === 'up' && '↑'}
            {targetDirection === 'right' && '→'}
            {targetDirection === 'down' && '↓'}
          </div>
        </div>
      )}

      {/* Center Kana Character */}
      <span
        className={`font-semibold tracking-tight leading-none ${
          isModifier
            ? 'text-sm sm:text-base font-bold'
            : isPunctuation
            ? 'text-xl sm:text-2xl font-bold'
            : 'text-2xl sm:text-3xl font-bold'
        } ${
          isHighlighted && targetDirection === 'center'
            ? 'text-red-600 dark:text-red-400'
            : ''
        }`}
      >
        {map.center}
      </span>

      {/* Subtitle / Romaji */}
      {showRomaji && !isModifier && !isPunctuation && (
        <span className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-mono mt-0.5 leading-none">
          {keyDef.romaji.center}
        </span>
      )}

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

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { KanaRowId, KanaTarget } from '../../types/practice';
import type { UserSettings } from '../../types/settings';
import type { FlickDirection } from '../../types/keyboard';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getPracticeTargets, applyModifier, isReachableInCycle } from '../../utils/kanaHelper';
import { recordKanaPractice } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlickPracticeModeProps {
  settings: UserSettings;
}

const ROW_FILTERS: Array<{ id: KanaRowId | 'all'; label: string }> = [
  { id: 'all', label: 'Tất cả' },
  { id: 'a', label: 'あ行' },
  { id: 'ka', label: 'か行' },
  { id: 'sa', label: 'さ行' },
  { id: 'ta', label: 'た行' },
  { id: 'na', label: 'な行' },
  { id: 'ha', label: 'は行' },
  { id: 'ma', label: 'ま行' },
  { id: 'ya', label: 'や行' },
  { id: 'ra', label: 'ら行' },
  { id: 'wa', label: 'わ行' },
  { id: 'dakuten', label: 'Biến âm (が/ざ/ば)' },
  { id: 'small', label: 'Âm ngắt/ghép (っ/ゃ)' },
];

export const FlickPracticeMode: React.FC<FlickPracticeModeProps> = ({ settings }) => {
  const [selectedFilter, setSelectedFilter] = useState<KanaRowId | 'all'>('all');
  const [currentTarget, setCurrentTarget] = useState<KanaTarget | null>(null);
  const [showHint, setShowHint] = useState(true);

  const [typedBuffer, setTypedBuffer] = useState<string>('');

  const [reactionTimeMs, setReactionTimeMs] = useState<number | null>(null);
  const [comboStreak, setComboStreak] = useState(0);
  const [totalAttempted, setTotalAttempted] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const questionStartTimeRef = useRef<number>(Date.now());

  const pickNewTarget = useCallback(() => {
    const list = getPracticeTargets(selectedFilter);
    if (list.length === 0) return;
    const randomIndex = Math.floor(Math.random() * list.length);
    const next = list[randomIndex];
    setCurrentTarget(next);
    setTypedBuffer('');
    setFeedbackState('idle');
    questionStartTimeRef.current = Date.now();
  }, [selectedFilter]);

  useEffect(() => {
    pickNewTarget();
    setComboStreak(0);
    setTotalAttempted(0);
    setTotalCorrect(0);
  }, [selectedFilter, pickNewTarget]);

  const handleCorrect = () => {
    const elapsed = Date.now() - questionStartTimeRef.current;
    setReactionTimeMs(elapsed);
    setFeedbackState('correct');
    setTotalAttempted((prev) => prev + 1);
    setTotalCorrect((prev) => prev + 1);
    setComboStreak((prev) => {
      const next = prev + 1;
      if (next % 10 === 0) {
        confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
      }
      return next;
    });

    if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);

    if (currentTarget) {
      recordKanaPractice(currentTarget.rowId, true, elapsed);
    }

    setTimeout(() => {
      pickNewTarget();
    }, 450);
  };

  const handleWrong = () => {
    setFeedbackState('wrong');
    setTotalAttempted((prev) => prev + 1);
    setComboStreak(0);

    if (settings.soundEnabled) soundEffects.playError(settings.soundVolume);

    if (currentTarget) {
      recordKanaPractice(currentTarget.rowId, false, 2000);
    }

    setTypedBuffer('');
    setTimeout(() => {
      setFeedbackState('idle');
    }, 450);
  };

  const handleCharInput = (char: string) => {
    if (!currentTarget) return;

    if (!currentTarget.needsModifier) {
      if (char === currentTarget.char) {
        handleCorrect();
      } else {
        handleWrong();
      }
    } else {
      if (char === currentTarget.baseChar) {
        setTypedBuffer(char);
        if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
      } else {
        handleWrong();
      }
    }
  };

  const handleModifier = (direction?: FlickDirection) => {
    if (!currentTarget || !typedBuffer) {
      return;
    }

    const modified = applyModifier(typedBuffer, direction);
    if (modified === currentTarget.char) {
      setTypedBuffer(modified);
      handleCorrect();
    } else if (isReachableInCycle(modified, currentTarget.char)) {
      setTypedBuffer(modified);
      if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
    } else {
      handleWrong();
    }
  };

  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-2 space-y-3 animate-in fade-in duration-150">
      {/* Row Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {ROW_FILTERS.map((f) => {
          const isSelected = selectedFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors border cursor-pointer ${
                isSelected
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-transparent text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Target Display & Stats */}
      <div className="p-5 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-4">
        {/* Top bar with stats & hint toggle */}
        <div className="flex items-center justify-between text-xs font-medium text-neutral-400 border-b border-neutral-850 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-mono text-white">
              <span>Combo:</span>
              <strong className="text-white">{comboStreak}</strong>
            </div>
            <div className="font-mono text-neutral-400">
              <span>Chính xác: </span>
              <strong className="text-white">{accuracy}%</strong>
            </div>
            {reactionTimeMs !== null && (
              <div className="hidden sm:block font-mono text-neutral-400">
                <span>Tốc độ: </span>
                <strong className="text-white">{reactionTimeMs}ms</strong>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md border text-xs transition-colors cursor-pointer ${
                showHint
                  ? 'bg-white text-black border-white font-semibold'
                  : 'border-neutral-800 text-neutral-400 hover:text-white'
              }`}
              title="Bật/Tắt gợi ý hướng phím"
            >
              {showHint ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Gợi ý</span>
            </button>

            <button
              type="button"
              onClick={pickNewTarget}
              className="p-1 rounded-md text-neutral-400 hover:text-white cursor-pointer"
              title="Đổi chữ khác"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Target Box */}
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-neutral-500 font-medium">
            Hãy gõ ký tự:
          </span>

          <div
            className={`w-24 h-24 rounded-xl flex items-center justify-center transition-all duration-150 ${
              feedbackState === 'correct'
                ? 'bg-white text-black font-extrabold shadow-md scale-105'
                : feedbackState === 'wrong'
                ? 'bg-neutral-800 text-rose-400 border border-rose-500 animate-shake'
                : 'bg-[#0E0F12] text-white border border-neutral-800'
            }`}
          >
            <span className="text-5xl font-black font-sans">
              {currentTarget?.char || 'あ'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
            <span>Phiên âm:</span>
            <span className="font-mono font-bold text-white uppercase tracking-widest">
              {currentTarget?.romaji}
            </span>
          </div>

          {/* Reserved slot for modifier hint to prevent CLS */}
          <div className="h-7 flex items-center justify-center">
            {currentTarget?.needsModifier ? (
              <div className="text-xs text-neutral-200 bg-white/[0.06] px-3 py-1 rounded-full border border-white/[0.1] font-medium animate-in fade-in duration-100">
                {!typedBuffer
                  ? `1. Gõ chữ gốc "${currentTarget.baseChar}"`
                  : `2. Đã gõ "${typedBuffer}" ➔ Nhấn "゛゜小" để thành "${currentTarget.char}"!`}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Anchored On-Screen Keyboard */}
      <div className="pt-2 w-full relative z-10">
        <FlickKeyboard
          settings={settings}
          targetKeyId={showHint ? (typedBuffer ? 'mod' : currentTarget?.keyId) : undefined}
          targetDirection={
            showHint
              ? typedBuffer
                ? 'center'
                : currentTarget?.direction
              : undefined
          }
          onCharInput={handleCharInput}
          onModifier={handleModifier}
          onBackspace={() => setTypedBuffer('')}
          onSpace={() => {}}
          onEnter={() => {}}
        />
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { KanaRowId, KanaTarget } from '../../types/practice';
import type { UserSettings } from '../../types/settings';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getPracticeTargets, getModifiedChar } from '../../utils/kanaHelper';
import { recordKanaPractice } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import { Zap, Eye, EyeOff, RotateCcw } from 'lucide-react';
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

  const handleModifier = () => {
    if (!currentTarget || !typedBuffer) {
      return;
    }

    const modified = getModifiedChar(typedBuffer);
    if (modified === currentTarget.char) {
      setTypedBuffer(modified);
      handleCorrect();
    } else {
      handleWrong();
    }
  };

  const accuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Row Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {ROW_FILTERS.map((f) => {
          const isSelected = selectedFilter === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Target Display & Stats */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        {/* Top bar with stats & hint toggle */}
        <div className="flex items-center justify-between text-xs font-medium text-stone-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Combo: {comboStreak}</span>
            </div>
            <div>
              <span>Độ chính xác: </span>
              <span className="font-bold text-stone-800 dark:text-stone-200">{accuracy}%</span>
            </div>
            {reactionTimeMs !== null && (
              <div className="hidden sm:block">
                <span>Tốc độ: </span>
                <span className="font-bold text-stone-800 dark:text-stone-200">{reactionTimeMs}ms</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs transition-colors ${
                showHint
                  ? 'bg-stone-100 dark:bg-stone-800 border-stone-200 text-stone-700 dark:text-stone-300 font-semibold'
                  : 'border-transparent text-stone-400'
              }`}
              title="Bật/Tắt gợi ý hướng phím"
            >
              {showHint ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>Gợi ý</span>
            </button>

            <button
              type="button"
              onClick={pickNewTarget}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-600"
              title="Đổi chữ khác"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Target Box */}
        <div className="flex flex-col items-center justify-center py-4 space-y-2">
          <span className="text-xs uppercase font-mono tracking-wider text-stone-400 font-semibold">
            Hãy gõ chữ cái này:
          </span>

          <div
            className={`w-32 h-32 rounded-3xl flex items-center justify-center transition-all duration-150 ${
              feedbackState === 'correct'
                ? 'bg-emerald-500 text-white shadow-xl scale-105'
                : feedbackState === 'wrong'
                ? 'bg-red-500 text-white shadow-xl animate-shake'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <span className="text-6xl font-extrabold font-sans">
              {currentTarget?.char || 'あ'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-stone-500 font-medium">
            <span>Phiên âm:</span>
            <span className="font-mono font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest">
              {currentTarget?.romaji}
            </span>
          </div>

          {currentTarget?.needsModifier && (
            <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900/60 font-medium animate-pulse">
              {!typedBuffer
                ? `1. Gõ chữ gốc "${currentTarget.baseChar}"`
                : `2. Nhấn phím "゛゜小" để biến âm thành "${currentTarget.char}"!`}
            </div>
          )}
        </div>
      </div>

      {/* On-Screen Keyboard */}
      <div className="pt-1">
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

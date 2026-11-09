import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { WordItem, WordDifficulty } from '../../types/practice';
import type { UserSettings } from '../../types/settings';
import type { FlickDirection } from '../../types/keyboard';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getKanaInfo, applyModifier, isReachableInCycle } from '../../utils/kanaHelper';
import { recordCompletedWord, recordKanaPractice } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronRight, RotateCcw, Filter } from 'lucide-react';

interface WordPracticeModeProps {
  settings: UserSettings;
}

export const WordPracticeMode: React.FC<WordPracticeModeProps> = ({ settings }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<WordDifficulty | 'all'>('all');

  const [currentWord, setCurrentWord] = useState<WordItem>(VOCABULARY_LIST[0]);
  const [charIndex, setCharIndex] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState<string>('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionStats, setCompletionStats] = useState<{
    timeSec: number;
    accuracy: number;
    cpm: number;
  } | null>(null);

  const [totalKeysPressed, setTotalKeysPressed] = useState(0);
  const [shakeActive, setShakeActive] = useState(false);

  const wordStartTimeRef = useRef<number>(Date.now());

  const filteredWords = useMemo(() => {
    return VOCABULARY_LIST.filter((w) => {
      if (selectedDifficulty !== 'all' && w.difficulty !== selectedDifficulty) return false;
      return true;
    });
  }, [selectedDifficulty]);

  const pickWord = useCallback(
    (index?: number) => {
      const pool = filteredWords.length > 0 ? filteredWords : VOCABULARY_LIST;
      let nextWord: WordItem;
      if (index !== undefined && pool[index]) {
        nextWord = pool[index];
      } else {
        const rnd = Math.floor(Math.random() * pool.length);
        nextWord = pool[rnd];
      }

      setCurrentWord(nextWord);
      setCharIndex(0);
      setTypedBuffer('');
      setIsCompleted(false);
      setCompletionStats(null);
      setTotalKeysPressed(0);
      wordStartTimeRef.current = Date.now();
    },
    [filteredWords]
  );

  useEffect(() => {
    pickWord();
  }, [selectedDifficulty, pickWord]);

  const expectedChar = currentWord.kana[charIndex];
  const expectedInfo = expectedChar ? getKanaInfo(expectedChar) : undefined;

  const handleCharInput = (char: string) => {
    if (isCompleted || !expectedChar) return;

    setTotalKeysPressed((prev) => prev + 1);

    if (expectedInfo?.needsModifier) {
      if (char === expectedInfo.baseChar) {
        setTypedBuffer(char);
        if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
      } else {
        triggerError();
      }
    } else {
      if (char === expectedChar) {
        advanceChar();
      } else {
        triggerError();
      }
    }
  };

  const handleModifier = (direction?: FlickDirection) => {
    if (isCompleted || !expectedChar || !typedBuffer) return;

    setTotalKeysPressed((prev) => prev + 1);
    const modified = applyModifier(typedBuffer, direction);

    if (modified === expectedChar) {
      setTypedBuffer('');
      advanceChar();
    } else if (isReachableInCycle(modified, expectedChar)) {
      setTypedBuffer(modified);
      if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
    } else {
      triggerError();
    }
  };

  const advanceChar = () => {
    const nextIdx = charIndex + 1;
    setCharIndex(nextIdx);

    if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);

    if (nextIdx >= currentWord.kana.length) {
      const elapsedMs = Date.now() - wordStartTimeRef.current;
      const timeSec = Number((elapsedMs / 1000).toFixed(1));
      const accuracy = Math.round(
        (currentWord.kana.length / Math.max(currentWord.kana.length, totalKeysPressed + 1)) * 100
      );
      const cpm = Math.round((currentWord.kana.length / Math.max(1, elapsedMs / 1000)) * 60);

      setCompletionStats({ timeSec, accuracy, cpm });
      setIsCompleted(true);

      if (settings.soundEnabled) soundEffects.playCelebration(settings.soundVolume);
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });

      recordCompletedWord(currentWord.id);
      recordKanaPractice('all', true, Math.round(elapsedMs / currentWord.kana.length));
    }
  };

  const triggerError = () => {
    setShakeActive(true);
    setTypedBuffer('');
    if (settings.soundEnabled) soundEffects.playError(settings.soundVolume);
    setTimeout(() => setShakeActive(false), 400);
  };

  const handleBackspace = () => {
    if (typedBuffer) {
      setTypedBuffer('');
    } else if (charIndex > 0) {
      setCharIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-2 space-y-3 animate-in fade-in duration-150">
      {/* Category & Difficulty Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs text-neutral-400 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Cấp độ:
          </span>
          {(['all', 'easy', 'medium', 'hard'] as Array<WordDifficulty | 'all'>).map((diff) => {
            const labels = { all: 'Tất cả', easy: 'Dễ (2-3 âm)', medium: 'Vừa (3-4 âm)', hard: 'Khó' };
            const isSelected = selectedDifficulty === diff;
            return (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? 'bg-white text-black border-white shadow-xs font-bold'
                    : 'bg-white/[0.04] text-neutral-400 hover:text-white border-white/[0.06]'
                }`}
              >
                {labels[diff]}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => pickWord()}
          className="flex items-center gap-1 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đổi từ khác</span>
        </button>
      </div>

      {/* Target Word Card */}
      <div
        className={`p-5 rounded-3xl bg-[#15161c]/90 border border-white/[0.08] shadow-xl space-y-3 text-center transition-all ${
          shakeActive ? 'animate-shake' : ''
        }`}
      >
        {/* Kanji & Category Tag */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/[0.06] text-neutral-300 border border-white/[0.08]">
            {currentWord.category}
          </span>
          {currentWord.kanji && currentWord.kanji !== currentWord.kana && (
            <span className="text-sm font-semibold text-neutral-300 font-serif">
              Hán tự: {currentWord.kanji}
            </span>
          )}
        </div>

        {/* Character-by-character Interactive Display */}
        <div className="py-1 flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
          {currentWord.kana.split('').map((char, idx) => {
            const isDone = idx < charIndex;
            const isCurrent = idx === charIndex;

            return (
              <div
                key={idx}
                className={`w-13 h-16 sm:w-15 sm:h-18 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isDone
                    ? 'bg-white/10 text-white border border-white/20 font-bold'
                    : isCurrent
                    ? 'bg-white text-black font-extrabold shadow-lg scale-105'
                    : 'bg-white/[0.04] text-neutral-500 border border-white/[0.06]'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-sans">
                  {char}
                </span>
                <span className={`text-[9px] uppercase font-mono tracking-wider ${isCurrent ? 'text-black/70' : 'opacity-70'}`}>
                  {getKanaInfo(char)?.romaji || ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Word Meaning in Vietnamese and English */}
        <div className="space-y-0.5 pt-0.5">
          <div className="text-base sm:text-lg font-bold text-white">
            {settings.languageMeaning === 'vi' ? currentWord.meaningVi : currentWord.meaningEn}
          </div>
          <div className="text-xs text-neutral-400 font-mono">
            {currentWord.romaji}
          </div>
        </div>

        {/* Next Hint for Active Character */}
        {expectedInfo?.needsModifier && !isCompleted && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.07] text-neutral-200 text-xs font-medium border border-white/[0.1]">
            <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            {!typedBuffer ? (
              <span>Gõ âm gốc <strong className="text-white">"{expectedInfo.baseChar}"</strong> trước</span>
            ) : (
              <span>Đã gõ <strong className="text-white">{typedBuffer}</strong> ➔ Nhấn <strong className="text-white">"゛゜小"</strong> để thành <strong className="text-white">"{expectedChar}"</strong></span>
            )}
          </div>
        )}

        {/* Completion Celebration Overlay */}
        {isCompleted && completionStats && (
          <div className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.1] space-y-2.5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-center gap-1.5 text-white font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Đã hoàn thành từ vựng!</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div className="text-neutral-400">Thời gian</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {completionStats.timeSec}s
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div className="text-neutral-400">Độ chính xác</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {completionStats.accuracy}%
                </div>
              </div>
              <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                <div className="text-neutral-400">Tốc độ CPM</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {completionStats.cpm}
                </div>
              </div>
            </div>

            <div className="pt-0.5 flex justify-center">
              <button
                type="button"
                onClick={() => pickWord()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs shadow-md transition-all active:scale-95"
              >
                <span>Từ tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Anchored On-Screen Keyboard */}
      <div className="pt-2 w-full relative z-10">
        <FlickKeyboard
          settings={settings}
          targetKeyId={
            settings.showFlickHints && !isCompleted
              ? typedBuffer
                ? 'mod'
                : expectedInfo?.keyId
              : undefined
          }
          targetDirection={
            settings.showFlickHints && !isCompleted
              ? typedBuffer
                ? 'center'
                : expectedInfo?.direction
              : undefined
          }
          onCharInput={handleCharInput}
          onModifier={handleModifier}
          onBackspace={handleBackspace}
          onSpace={() => {}}
          onEnter={() => {
            if (isCompleted) pickWord();
          }}
        />
      </div>
    </div>
  );
};

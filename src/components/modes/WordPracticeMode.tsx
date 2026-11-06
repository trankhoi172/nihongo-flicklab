import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { WordItem, WordDifficulty } from '../../types/practice';
import type { UserSettings } from '../../types/settings';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getKanaInfo, getModifiedChar } from '../../utils/kanaHelper';
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

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    if (selectedDifficulty !== 'all' && w.difficulty !== selectedDifficulty) return false;
    return true;
  });

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

  const handleModifier = () => {
    if (isCompleted || !expectedChar || !typedBuffer) return;

    setTotalKeysPressed((prev) => prev + 1);
    const modified = getModifiedChar(typedBuffer);

    if (modified === expectedChar) {
      setTypedBuffer('');
      advanceChar();
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
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Category & Difficulty Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-xs text-stone-500 flex items-center gap-1">
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-500 shadow-md font-bold'
                    : 'bg-[#14161D] text-stone-400 hover:text-stone-200 border-stone-800'
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
          className="flex items-center gap-1 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Đổi từ khác</span>
        </button>
      </div>

      {/* Target Word Card */}
      <div
        className={`p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xl space-y-4 text-center transition-all ${
          shakeActive ? 'animate-shake' : ''
        }`}
      >
        {/* Kanji & Category Tag */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-stone-850 text-stone-400 border border-stone-800">
            {currentWord.category}
          </span>
          {currentWord.kanji && currentWord.kanji !== currentWord.kana && (
            <span className="text-sm font-semibold text-stone-400 font-serif">
              Hán tự: {currentWord.kanji}
            </span>
          )}
        </div>

        {/* Character-by-character Interactive Display */}
        <div className="py-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          {currentWord.kana.split('').map((char, idx) => {
            const isDone = idx < charIndex;
            const isCurrent = idx === charIndex;

            return (
              <div
                key={idx}
                className={`w-14 h-16 sm:w-16 sm:h-20 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-600 text-white shadow-lg scale-100 font-bold'
                    : isCurrent
                    ? 'bg-[#0D0E13] text-red-400 border-2 border-red-500 shadow-xl scale-105 animate-pulse'
                    : 'bg-stone-850 text-stone-500 border border-stone-800'
                }`}
              >
                <span className="text-2xl sm:text-3xl font-black font-sans">
                  {char}
                </span>
                <span className="text-[9px] uppercase font-mono tracking-wider opacity-70">
                  {getKanaInfo(char)?.romaji || ''}
                </span>
              </div>
            );
          })}
        </div>

        {/* Word Meaning in Vietnamese and English */}
        <div className="space-y-1 pt-1">
          <div className="text-lg font-bold text-white">
            {settings.languageMeaning === 'vi' ? currentWord.meaningVi : currentWord.meaningEn}
          </div>
          <div className="text-xs text-stone-400 font-mono">
            {currentWord.romaji}
          </div>
        </div>

        {/* Next Hint for Active Character */}
        {expectedInfo?.needsModifier && !isCompleted && (
          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/40 text-amber-300 text-xs font-semibold border border-amber-800/80 animate-pulse">
            {!typedBuffer
              ? `👉 Gõ âm cơ bản "${expectedInfo.baseChar}" trước`
              : `👉 Nhấn phím "゛゜小" để hoàn tất biến âm "${expectedChar}"`}
          </div>
        )}

        {/* Completion Celebration Overlay */}
        {isCompleted && completionStats && (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 space-y-3 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center gap-1.5 text-emerald-300 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Tuyệt vời! Đã hoàn thành từ vựng!</span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-stone-900 border border-emerald-900/60">
                <div className="text-stone-400">Thời gian</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {completionStats.timeSec}s
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-emerald-900/60">
                <div className="text-stone-400">Độ chính xác</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {completionStats.accuracy}%
                </div>
              </div>
              <div className="p-2.5 rounded-xl bg-stone-900 border border-emerald-900/60">
                <div className="text-stone-400">Tốc độ CPM</div>
                <div className="font-bold text-white text-sm mt-0.5">
                  {completionStats.cpm}
                </div>
              </div>
            </div>

            <div className="pt-1 flex justify-center">
              <button
                type="button"
                onClick={() => pickWord()}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <span>Từ tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen Keyboard */}
      <div className="pt-1">
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

import React, { useState } from 'react';
import { KEYBOARD_LAYOUT, DIRECTION_CONFIG } from '../../constants/keyboardLayout';
import type { FlickDirection } from '../../types/keyboard';
import type { UserSettings } from '../../types/settings';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, ChevronRight, ChevronLeft, HelpCircle } from 'lucide-react';

interface TutorialModeProps {
  settings: UserSettings;
}

const DIRECTIONS_ORDER: FlickDirection[] = ['center', 'left', 'up', 'right', 'down'];

export const TutorialMode: React.FC<TutorialModeProps> = ({ settings }) => {
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [targetDirIndex, setTargetDirIndex] = useState(0);
  const [completedDirs, setCompletedDirs] = useState<Record<FlickDirection, boolean>>({
    center: false,
    left: false,
    up: false,
    right: false,
    down: false,
  });
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const currentKey = KEYBOARD_LAYOUT[currentRowIndex];
  const targetDir = DIRECTIONS_ORDER[targetDirIndex];
  const targetChar = currentKey.hiragana[targetDir];
  const targetRomaji = currentKey.romaji[targetDir];

  const handleInput = (char: string) => {
    if (char === targetChar) {
      if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);
      setCompletedDirs((prev) => ({ ...prev, [targetDir]: true }));
      setFeedback({ isCorrect: true, message: `Chính xác! Bạn vừa gõ "${targetChar}"` });

      if (targetDirIndex < DIRECTIONS_ORDER.length - 1) {
        setTimeout(() => {
          setTargetDirIndex((prev) => prev + 1);
          setFeedback(null);
        }, 600);
      } else {
        confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
        if (settings.soundEnabled) soundEffects.playCelebration(settings.soundVolume);
        setFeedback({
          isCorrect: true,
          message: `Tuyệt vời! Bạn đã hoàn thành toàn bộ hàng "${currentKey.rowName}"!`,
        });
      }
    } else {
      if (settings.soundEnabled) soundEffects.playError(settings.soundVolume);
      setFeedback({
        isCorrect: false,
        message: `Chưa đúng rồi, hãy thử lại: ${DIRECTION_CONFIG[targetDir].label} để gõ "${targetChar}"`,
      });
    }
  };

  const handleNextRow = () => {
    if (currentRowIndex < KEYBOARD_LAYOUT.length - 1) {
      setCurrentRowIndex((prev) => prev + 1);
      setTargetDirIndex(0);
      setCompletedDirs({
        center: false,
        left: false,
        up: false,
        right: false,
        down: false,
      });
      setFeedback(null);
    }
  };

  const handlePrevRow = () => {
    if (currentRowIndex > 0) {
      setCurrentRowIndex((prev) => prev - 1);
      setTargetDirIndex(0);
      setCompletedDirs({
        center: false,
        left: false,
        up: false,
        right: false,
        down: false,
      });
      setFeedback(null);
    }
  };

  const handleSelectRow = (index: number) => {
    setCurrentRowIndex(index);
    setTargetDirIndex(0);
    setCompletedDirs({
      center: false,
      left: false,
      up: false,
      right: false,
      down: false,
    });
    setFeedback(null);
  };

  const isRowFinished = DIRECTIONS_ORDER.every((d) => completedDirs[d]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Row Selector Stepper */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
        {KEYBOARD_LAYOUT.map((k, idx) => {
          const isSelected = idx === currentRowIndex;
          return (
            <button
              key={k.id}
              onClick={() => handleSelectRow(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                isSelected
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-100 border border-stone-200 dark:border-stone-700'
              }`}
            >
              {k.rowName}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Guide Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-5 text-center">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevRow}
            disabled={currentRowIndex === 0}
            className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 disabled:opacity-30"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <span className="text-xs uppercase font-mono font-semibold text-red-600 dark:text-red-400">
              Bài học {currentRowIndex + 1} / {KEYBOARD_LAYOUT.length}
            </span>
            <h2 className="text-xl font-extrabold text-stone-900 dark:text-stone-100">
              Hàng {currentKey.rowName}
            </h2>
          </div>

          <button
            onClick={handleNextRow}
            disabled={currentRowIndex === KEYBOARD_LAYOUT.length - 1}
            className="p-1.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 disabled:opacity-30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Current Prompt */}
        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-700/60 space-y-1">
          <div className="text-xs text-stone-500 flex items-center justify-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Thử thách hiện tại:</span>
          </div>

          <div className="text-stone-900 dark:text-stone-100 text-base sm:text-lg font-bold">
            {targetDir === 'center' ? (
              <span>
                👉 <span className="text-red-600">Chạm nhẹ</span> vào ô phím{' '}
                <span className="underline decoration-red-500 font-extrabold text-xl">
                  {currentKey.hiragana.center}
                </span>{' '}
                để gõ "{targetChar}"
              </span>
            ) : (
              <span>
                👉 Chạm và{' '}
                <span className="text-red-600 font-extrabold">
                  {targetDir === 'left' && 'Vuốt sang TRÁI (←)'}
                  {targetDir === 'up' && 'Vuốt LÊN TRÊN (↑)'}
                  {targetDir === 'right' && 'Vuốt sang PHẢI (→)'}
                  {targetDir === 'down' && 'Vuốt XUỐNG DƯỚI (↓)'}
                </span>{' '}
                để gõ "{targetChar}" ({targetRomaji})
              </span>
            )}
          </div>
        </div>

        {/* Visual 5-way Blossom Diagram for Current Key */}
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-2">
          {/* Center */}
          <div
            className={`absolute w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'center'
                ? 'bg-red-600 text-white shadow-lg scale-110 ring-4 ring-red-200 dark:ring-red-950'
                : completedDirs.center
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <span className="text-xl font-bold">{currentKey.hiragana.center}</span>
            <span className="text-[9px] uppercase font-mono">Chạm</span>
          </div>

          {/* Left */}
          <div
            className={`absolute left-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'left'
                ? 'bg-red-600 text-white shadow-lg scale-110 ring-4 ring-red-200 dark:ring-red-950'
                : completedDirs.left
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.left}</span>
            <span className="text-[9px] font-mono">← Trái</span>
          </div>

          {/* Up */}
          <div
            className={`absolute top-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'up'
                ? 'bg-red-600 text-white shadow-lg scale-110 ring-4 ring-red-200 dark:ring-red-950'
                : completedDirs.up
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.up}</span>
            <span className="text-[9px] font-mono">↑ Trên</span>
          </div>

          {/* Right */}
          <div
            className={`absolute right-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'right'
                ? 'bg-red-600 text-white shadow-lg scale-110 ring-4 ring-red-200 dark:ring-red-950'
                : completedDirs.right
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.right}</span>
            <span className="text-[9px] font-mono">→ Phải</span>
          </div>

          {/* Down */}
          <div
            className={`absolute bottom-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'down'
                ? 'bg-red-600 text-white shadow-lg scale-110 ring-4 ring-red-200 dark:ring-red-950'
                : completedDirs.down
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.down}</span>
            <span className="text-[9px] font-mono">↓ Dưới</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${
              feedback.isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200'
                : 'bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 animate-shake'
            }`}
          >
            {feedback.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Row Finished Actions */}
        {isRowFinished && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleNextRow}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-sm font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <span>Học hàng tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Keyboard */}
      <div className="pt-1">
        <FlickKeyboard
          settings={settings}
          targetKeyId={currentKey.id}
          targetDirection={targetDir}
          onCharInput={handleInput}
          onModifier={() => handleInput('゛゜小')}
          onBackspace={() => {}}
          onSpace={() => {}}
          onEnter={() => {}}
        />
      </div>
    </div>
  );
};

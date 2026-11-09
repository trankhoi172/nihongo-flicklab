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
        }, 500);
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
        message: `Chưa đúng, hãy thử lại: ${DIRECTION_CONFIG[targetDir].label} để gõ "${targetChar}"`,
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
    <div className="max-w-2xl mx-auto px-4 py-3 space-y-3 animate-in fade-in duration-150">
      {/* Row Selector Stepper */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {KEYBOARD_LAYOUT.map((k, idx) => {
          const isSelected = idx === currentRowIndex;
          return (
            <button
              key={k.id}
              onClick={() => handleSelectRow(idx)}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-colors shrink-0 border ${
                isSelected
                  ? 'bg-white text-black border-white'
                  : 'bg-[#111216] text-neutral-400 hover:text-white border-neutral-800'
              }`}
            >
              {k.rowName}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Guide Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-4 text-center">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevRow}
            disabled={currentRowIndex === 0}
            className="p-1.5 rounded-md border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div>
            <span className="text-[11px] uppercase font-mono tracking-widest text-neutral-400">
              Hàng {currentRowIndex + 1} / {KEYBOARD_LAYOUT.length}
            </span>
            <h2 className="text-lg font-semibold text-neutral-100">
              Hàng {currentKey.rowName}
            </h2>
          </div>

          <button
            onClick={handleNextRow}
            disabled={currentRowIndex === KEYBOARD_LAYOUT.length - 1}
            className="p-1.5 rounded-md border border-neutral-800 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Prompt */}
        <div className="p-3.5 rounded-lg bg-[#0B0C0E] border border-neutral-800 space-y-1">
          <div className="text-[11px] text-neutral-400 flex items-center justify-center gap-1 font-mono">
            <HelpCircle className="w-3 h-3 text-neutral-400" />
            <span>THAO TÁC YÊU CẦU:</span>
          </div>

          <div className="text-neutral-100 text-sm sm:text-base font-medium">
            {targetDir === 'center' ? (
              <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                <span>
                  <span className="text-white font-semibold underline decoration-neutral-500">Chạm nhẹ</span> vào ô phím{' '}
                  <span className="font-semibold text-lg text-white">
                    {currentKey.hiragana.center}
                  </span>{' '}
                  để gõ "{targetChar}"
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                <span>
                  Chạm và{' '}
                  <span className="text-white font-semibold underline decoration-neutral-500">
                    {targetDir === 'left' && 'Vuốt sang TRÁI (←)'}
                    {targetDir === 'up' && 'Vuốt LÊN TRÊN (↑)'}
                    {targetDir === 'right' && 'Vuốt sang PHẢI (→)'}
                    {targetDir === 'down' && 'Vuốt XUỐNG DƯỚI (↓)'}
                  </span>{' '}
                  để gõ "{targetChar}" ({targetRomaji})
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Visual 5-way Blossom Diagram for Current Key */}
        <div className="relative w-44 h-44 mx-auto flex items-center justify-center my-2">
          {/* Center */}
          <div
            className={`absolute w-13 h-13 rounded-lg flex flex-col items-center justify-center transition-all ${
              targetDir === 'center'
                ? 'bg-white text-black font-bold shadow-sm scale-105 z-10'
                : completedDirs.center
                ? 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                : 'bg-[#0B0C0E] text-neutral-400 border border-neutral-800'
            }`}
          >
            <span className="text-lg font-medium">{currentKey.hiragana.center}</span>
            <span className="text-[8px] uppercase font-mono opacity-80">Chạm</span>
          </div>

          {/* Left */}
          <div
            className={`absolute left-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              targetDir === 'left'
                ? 'bg-white text-black font-bold shadow-sm scale-105 z-10'
                : completedDirs.left
                ? 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                : 'bg-[#0B0C0E] text-neutral-400 border border-neutral-800'
            }`}
          >
            <span className="text-base font-medium">{currentKey.hiragana.left}</span>
            <span className="text-[8px] font-mono opacity-80">← Trái</span>
          </div>

          {/* Up */}
          <div
            className={`absolute top-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              targetDir === 'up'
                ? 'bg-white text-black font-bold shadow-sm scale-105 z-10'
                : completedDirs.up
                ? 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                : 'bg-[#0B0C0E] text-neutral-400 border border-neutral-800'
            }`}
          >
            <span className="text-base font-medium">{currentKey.hiragana.up}</span>
            <span className="text-[8px] font-mono opacity-80">↑ Trên</span>
          </div>

          {/* Right */}
          <div
            className={`absolute right-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              targetDir === 'right'
                ? 'bg-white text-black font-bold shadow-sm scale-105 z-10'
                : completedDirs.right
                ? 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                : 'bg-[#0B0C0E] text-neutral-400 border border-neutral-800'
            }`}
          >
            <span className="text-base font-medium">{currentKey.hiragana.right}</span>
            <span className="text-[8px] font-mono opacity-80">→ Phải</span>
          </div>

          {/* Down */}
          <div
            className={`absolute bottom-0 w-11 h-11 rounded-lg flex flex-col items-center justify-center transition-all ${
              targetDir === 'down'
                ? 'bg-white text-black font-bold shadow-sm scale-105 z-10'
                : completedDirs.down
                ? 'bg-neutral-900 text-neutral-200 border border-neutral-700'
                : 'bg-[#0B0C0E] text-neutral-400 border border-neutral-800'
            }`}
          >
            <span className="text-base font-medium">{currentKey.hiragana.down}</span>
            <span className="text-[8px] font-mono opacity-80">↓ Dưới</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 ${
              feedback.isCorrect
                ? 'bg-[#16171B] text-neutral-200 border border-neutral-800'
                : 'bg-[#1C1214] text-rose-300 border border-rose-900/60 animate-shake'
            }`}
          >
            {feedback.isCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Row Finished Actions */}
        {isRowFinished && (
          <div className="pt-1 flex justify-center">
            <button
              onClick={handleNextRow}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
            >
              <span>Học hàng tiếp theo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Anchored On-Screen Keyboard */}
      <div className="pt-2 w-full relative z-10">
        <FlickKeyboard
          settings={settings}
          targetKeyId={currentKey.id}
          targetDirection={targetDir}
          onCharInput={handleInput}
          onModifier={(dir) => {
            const mapped = currentKey.hiragana[dir || 'center'] || '゛゜小';
            handleInput(mapped);
          }}
          onBackspace={() => {}}
          onSpace={() => {}}
          onEnter={() => {}}
        />
      </div>
    </div>
  );
};

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
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Row Selector Stepper */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
        {KEYBOARD_LAYOUT.map((k, idx) => {
          const isSelected = idx === currentRowIndex;
          return (
            <button
              key={k.id}
              onClick={() => handleSelectRow(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 border ${
                isSelected
                  ? 'bg-white text-black border-white shadow-xs font-bold'
                  : 'bg-white/[0.04] text-neutral-400 hover:text-white border-white/[0.06]'
              }`}
            >
              {k.rowName}
            </button>
          );
        })}
      </div>

      {/* Main Interactive Guide Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xl space-y-5 text-center">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevRow}
            disabled={currentRowIndex === 0}
            className="p-2 rounded-xl border border-stone-800 text-stone-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <span className="text-xs uppercase font-mono font-bold text-red-400">
              Hàng {currentRowIndex + 1} / {KEYBOARD_LAYOUT.length}
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Hàng {currentKey.rowName}
            </h2>
          </div>

          <button
            onClick={handleNextRow}
            disabled={currentRowIndex === KEYBOARD_LAYOUT.length - 1}
            className="p-2 rounded-xl border border-stone-800 text-stone-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Current Prompt */}
        <div className="p-4 rounded-2xl bg-[#0D0E13] border border-stone-800/80 space-y-1">
          <div className="text-xs text-stone-400 flex items-center justify-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
            <span>Thao tác yêu cầu:</span>
          </div>

          <div className="text-white text-base sm:text-lg font-bold">
            {targetDir === 'center' ? (
              <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                <ChevronRight className="w-4 h-4 text-neutral-400" />
                <span>
                  <span className="text-white font-extrabold underline decoration-white/40">Chạm nhẹ</span> vào ô phím{' '}
                  <span className="font-extrabold text-xl text-white">
                    {currentKey.hiragana.center}
                  </span>{' '}
                  để gõ "{targetChar}"
                </span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 flex-wrap justify-center">
                <ChevronRight className="w-4 h-4 text-neutral-400" />
                <span>
                  Chạm và{' '}
                  <span className="text-white font-extrabold underline decoration-white/40">
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
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center my-3">
          {/* Center */}
          <div
            className={`absolute w-14 h-14 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'center'
                ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-950 font-bold'
                : completedDirs.center
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                : 'bg-stone-850 text-stone-300 border border-stone-750'
            }`}
          >
            <span className="text-xl font-bold">{currentKey.hiragana.center}</span>
            <span className="text-[9px] uppercase font-mono opacity-80">Chạm</span>
          </div>

          {/* Left */}
          <div
            className={`absolute left-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'left'
                ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-950 font-bold'
                : completedDirs.left
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                : 'bg-stone-850 text-stone-300 border border-stone-750'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.left}</span>
            <span className="text-[9px] font-mono opacity-80">← Trái</span>
          </div>

          {/* Up */}
          <div
            className={`absolute top-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'up'
                ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-950 font-bold'
                : completedDirs.up
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                : 'bg-stone-850 text-stone-300 border border-stone-750'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.up}</span>
            <span className="text-[9px] font-mono opacity-80">↑ Trên</span>
          </div>

          {/* Right */}
          <div
            className={`absolute right-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'right'
                ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-950 font-bold'
                : completedDirs.right
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                : 'bg-stone-850 text-stone-300 border border-stone-750'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.right}</span>
            <span className="text-[9px] font-mono opacity-80">→ Phải</span>
          </div>

          {/* Down */}
          <div
            className={`absolute bottom-0 w-12 h-12 rounded-2xl flex flex-col items-center justify-center transition-all ${
              targetDir === 'down'
                ? 'bg-red-600 text-white shadow-xl scale-110 ring-4 ring-red-950 font-bold'
                : completedDirs.down
                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                : 'bg-stone-850 text-stone-300 border border-stone-750'
            }`}
          >
            <span className="text-lg font-bold">{currentKey.hiragana.down}</span>
            <span className="text-[9px] font-mono opacity-80">↓ Dưới</span>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 ${
              feedback.isCorrect
                ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-800'
                : 'bg-red-950/40 text-red-300 border border-red-800 animate-shake'
            }`}
          >
            {feedback.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Row Finished Actions */}
        {isRowFinished && (
          <div className="pt-2 flex justify-center">
            <button
              onClick={handleNextRow}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-stone-100 text-stone-900 text-sm font-bold shadow-lg hover:bg-white transition-all"
            >
              <span>Học hàng tiếp theo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Locked On-Screen Keyboard */}
      <div className="pt-1 sticky bottom-2 z-20">
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

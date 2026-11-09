import React, { useState, useEffect, useCallback } from 'react';
import { CURRICULUM_MODULES } from '../../constants/curriculum';
import type { UserSettings } from '../../types/settings';
import type { FlickDirection } from '../../types/keyboard';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getKanaInfo, applyModifier, isReachableInCycle } from '../../utils/kanaHelper';
import { recordCompletedLesson } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CurriculumModeProps {
  settings: UserSettings;
  completedLessonIds: string[];
  onLessonFinished?: () => void;
}

export const CurriculumMode: React.FC<CurriculumModeProps> = ({
  settings,
  completedLessonIds,
  onLessonFinished,
}) => {
  const [selectedModuleId, setSelectedModuleId] = useState<string>(CURRICULUM_MODULES[0].id);
  const [selectedLessonId, setSelectedLessonId] = useState<string>(CURRICULUM_MODULES[0].lessons[0].id);

  // Lesson interactive typing state
  const [targetIndex, setTargetIndex] = useState(0);
  const [charIndexInTarget, setCharIndexInTarget] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState<string>('');
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  const currentModule = CURRICULUM_MODULES.find((m) => m.id === selectedModuleId) || CURRICULUM_MODULES[0];
  const currentLesson = currentModule.lessons.find((l) => l.id === selectedLessonId) || currentModule.lessons[0];

  const currentTargetWord = currentLesson.practiceTargets[targetIndex] || '';
  const currentExpectedChar = currentTargetWord[charIndexInTarget] || '';
  const expectedInfo = currentExpectedChar ? getKanaInfo(currentExpectedChar) : undefined;

  // Total lessons count
  const allLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons);
  const totalLessons = allLessons.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const resetLessonPractice = useCallback(() => {
    setTargetIndex(0);
    setCharIndexInTarget(0);
    setTypedBuffer('');
    setIsLessonComplete(false);
    setFeedback(null);
  }, []);

  useEffect(() => {
    resetLessonPractice();
  }, [selectedLessonId, resetLessonPractice]);

  const advanceTarget = () => {
    const nextCharIdx = charIndexInTarget + 1;
    if (nextCharIdx < currentTargetWord.length) {
      // Advance to next char in current target
      setCharIndexInTarget(nextCharIdx);
      setTypedBuffer('');
    } else {
      // Completed current target word/char
      const nextTargetIdx = targetIndex + 1;
      if (nextTargetIdx < currentLesson.practiceTargets.length) {
        setTargetIndex(nextTargetIdx);
        setCharIndexInTarget(0);
        setTypedBuffer('');
      } else {
        // Complete whole lesson!
        setIsLessonComplete(true);
        recordCompletedLesson(currentLesson.id);
        confetti({ particleCount: 45, spread: 70, origin: { y: 0.6 } });
        if (settings.soundEnabled) soundEffects.playCelebration(settings.soundVolume);
        if (onLessonFinished) onLessonFinished();
      }
    }
  };

  const handleCharInput = (char: string) => {
    if (isLessonComplete || !currentExpectedChar) return;

    if (expectedInfo?.needsModifier) {
      if (char === expectedInfo.baseChar) {
        setTypedBuffer(char);
        if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
        setFeedback({
          isCorrect: true,
          message: `Tốt! Bây giờ nhấn phím [゛゜小] để biến âm thành "${currentExpectedChar}"`,
        });
      } else {
        handleMistake();
      }
    } else {
      if (char === currentExpectedChar) {
        if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);
        setFeedback({ isCorrect: true, message: `Chính xác! (${char})` });
        advanceTarget();
      } else {
        handleMistake();
      }
    }
  };

  const handleModifier = (direction?: FlickDirection) => {
    if (isLessonComplete || !currentExpectedChar || !typedBuffer) return;

    const modified = applyModifier(typedBuffer, direction);
    if (modified === currentExpectedChar) {
      if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);
      setFeedback({ isCorrect: true, message: `Chính xác! (${modified})` });
      advanceTarget();
    } else if (isReachableInCycle(modified, currentExpectedChar)) {
      setTypedBuffer(modified);
      if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
      setFeedback({
        isCorrect: true,
        message: `Đang biến âm (${modified}) ➔ Nhấn tiếp [゛゜小] để thành "${currentExpectedChar}"`,
      });
    } else {
      handleMistake();
    }
  };

  const handleMistake = () => {
    if (settings.soundEnabled) soundEffects.playError(settings.soundVolume);
    setFeedback({
      isCorrect: false,
      message: `Chưa đúng, hãy nhìn phím gợi ý màu đỏ để gõ "${currentExpectedChar}"!`,
    });
    setTypedBuffer('');
  };

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    if (currentIndex < allLessons.length - 1) {
      const next = allLessons[currentIndex + 1];
      setSelectedModuleId(next.moduleId);
      setSelectedLessonId(next.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-in fade-in duration-150">
      {/* Curriculum Header & Global Progress */}
      <div className="pb-4 border-b border-neutral-850 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <div className="text-[11px] font-mono text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
              <span>日本語フリック完全カリキュラム • GIÁO TRÌNH CHUẨN</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
              Lộ trình từ Cơ bản đến Bậc thầy
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              8 học phần • 27 bài học chi tiết bao quát toàn bộ quy tắc gõ Kana.
            </p>
          </div>

          <div className="sm:text-right shrink-0">
            <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">Tiến độ giáo trình</div>
            <div className="text-xl font-light text-white mt-0.5">
              <strong className="font-semibold">{completedCount}</strong> / {totalLessons}{' '}
              <span className="text-xs font-normal text-neutral-500 font-mono">({progressPercent}%)</span>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Horizontal Scrollable Module Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
          {CURRICULUM_MODULES.map((mod) => {
            const isSelected = mod.id === selectedModuleId;
            const completedInModule = mod.lessons.filter((l) => completedLessonIds.includes(l.id)).length;
            const isAllCompleted = completedInModule === mod.lessons.length;

            return (
              <button
                key={mod.id}
                onClick={() => {
                  setSelectedModuleId(mod.id);
                  setSelectedLessonId(mod.lessons[0].id);
                }}
                className={`px-3 py-1.5 rounded-md text-xs transition-colors flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-white text-black border-white font-semibold'
                    : 'bg-white/[0.02] text-neutral-400 hover:text-white border-neutral-800/80 hover:border-neutral-700'
                }`}
              >
                <span>Học phần {mod.moduleNumber}</span>
                {isAllCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-black/70' : 'opacity-60'}`}>
                    {completedInModule}/{mod.lessons.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Lessons Drawer & Active Practice Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left: Lessons List in Current Module */}
        <div className="space-y-2 md:col-span-1">
          <div className="text-[11px] font-mono font-medium text-neutral-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span>Danh sách bài học</span>
            <span className="text-[10px] text-neutral-500 font-normal">
              {currentModule.level}
            </span>
          </div>

          <div className="space-y-1 max-h-[460px] overflow-y-auto custom-scrollbar pr-1.5 border-t border-neutral-850 pt-2">
            {currentModule.lessons.map((les) => {
              const isSelected = les.id === selectedLessonId;
              const isDone = completedLessonIds.includes(les.id);

              return (
                <button
                  key={les.id}
                  onClick={() => setSelectedLessonId(les.id)}
                  className={`w-full text-left p-2.5 rounded-md transition-colors flex items-center justify-between gap-2 border-l-2 cursor-pointer ${
                    isSelected
                      ? 'border-red-500 bg-white/[0.05] text-white'
                      : 'border-transparent text-neutral-400 hover:bg-white/[0.02] hover:text-neutral-200'
                  }`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="text-[10px] font-mono text-neutral-500">
                      Bài {les.lessonNumber}
                    </div>
                    <div className="text-xs font-medium truncate text-neutral-200">
                      {les.title}
                    </div>
                  </div>

                  {isDone && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Active Lesson & Interactive Keyboard Drill */}
        <div className="md:col-span-2 space-y-4">
          <div className="p-5 sm:p-6 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-4">
            {/* Lesson Title & Objectives */}
            <div className="space-y-1.5 border-b border-neutral-850 pb-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-red-400 font-mono">
                  Bài {currentLesson.lessonNumber} • {currentLesson.japaneseTitle}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-neutral-400 font-mono border border-neutral-800">
                  {currentModule.level}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">
                {currentLesson.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {currentLesson.description}
              </p>
            </div>

            {/* Rules / Gesture Guidelines */}
            <div className="p-4 rounded-2xl bg-[#0D0E13] border border-stone-800/90 space-y-2">
              <div className="text-[11px] font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Quy tắc thao tác phím:</span>
              </div>
              <ul className="text-xs text-stone-400 space-y-1 pl-4 list-disc">
                {currentLesson.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>

            {/* Practice Step Box */}
            <div className="p-4 rounded-lg bg-black/40 border border-neutral-850 space-y-3 text-center min-h-[220px] flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-neutral-400 font-mono">
                <span>Thực hành gõ bài này:</span>
                <span>
                  Mục tiêu {targetIndex + 1} / {currentLesson.practiceTargets.length}
                </span>
              </div>

              {/* Targets Progress Ribbon */}
              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                {currentLesson.practiceTargets.map((tgt, idx) => {
                  const isFinished = idx < targetIndex;
                  const isCurrent = idx === targetIndex;
                  return (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                        isFinished
                          ? 'bg-neutral-900 text-neutral-400 font-medium'
                          : isCurrent
                          ? 'bg-white text-black font-semibold'
                          : 'bg-white/[0.03] text-neutral-500'
                      }`}
                    >
                      {tgt}
                    </span>
                  );
                })}
              </div>

              {!isLessonComplete ? (
                <>
                  {/* Target Display: Single Kana vs Compound Word */}
                  <div className="py-2 min-h-[96px] flex flex-col items-center justify-center">
                    {currentTargetWord.length > 1 ? (
                      <div className="space-y-1.5 text-center">
                        {/* Compound Word Interactive Character Slots */}
                        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap">
                          {currentTargetWord.split('').map((char, idx) => {
                            const isDone = idx < charIndexInTarget;
                            const isCurrent = idx === charIndexInTarget;

                            return (
                              <div
                                key={idx}
                                className={`w-12 h-14 sm:w-14 sm:h-16 rounded-lg flex flex-col items-center justify-center transition-all ${
                                  isDone
                                    ? 'bg-neutral-900 text-neutral-400 border border-neutral-800'
                                    : isCurrent
                                    ? 'bg-white text-black font-bold shadow-sm'
                                    : 'bg-[#0B0C0E] text-neutral-500 border border-neutral-800/70'
                                }`}
                              >
                                <span className="text-xl sm:text-2xl font-medium font-sans">
                                  {char}
                                </span>
                                <span className={`text-[9px] uppercase font-mono tracking-wider ${isCurrent ? 'text-black/70' : 'text-neutral-500'}`}>
                                  {getKanaInfo(char)?.romaji || ''}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Full Word Romaji and Current Active Character Hint */}
                        <div className="text-xs text-neutral-400 font-mono">
                          Từ ghép:{' '}
                          <span className="text-neutral-200 uppercase font-medium">
                            {currentTargetWord.split('').map((c) => getKanaInfo(c)?.romaji || c).join('')}
                          </span>
                          {expectedInfo && (
                            <span className="ml-2 text-neutral-400">
                              • Đang gõ: <strong className="text-white font-semibold">"{currentExpectedChar}"</strong> ({expectedInfo.romaji.toUpperCase()})
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Single Kana Display */
                      <div className="text-center">
                        <div className="text-5xl font-medium text-neutral-100 font-sans">
                          {currentExpectedChar}
                        </div>
                        {expectedInfo && (
                          <div className="text-xs text-neutral-400 font-mono mt-1">
                            Phiên âm: <span className="text-neutral-200 uppercase font-medium">{expectedInfo.romaji}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reserved Feedback Slot (Fixed height prevents Cumulative Layout Shift of the keyboard) */}
                  <div className="h-10 min-h-[40px] flex items-center justify-center">
                    {feedback ? (
                      <div
                        className={`w-full py-2 px-3 rounded-md text-xs font-medium transition-all duration-150 ${
                          feedback.isCorrect
                            ? 'bg-[#16171B] text-neutral-200 border border-neutral-800'
                            : 'bg-[#1C1214] text-rose-300 border border-rose-900/60 animate-shake'
                        }`}
                      >
                        {feedback.message}
                      </div>
                    ) : (
                      <div className="h-full w-full pointer-events-none" aria-hidden="true" />
                    )}
                  </div>
                </>
              ) : (
                /* Lesson Complete Banner inside same footprint */
                <div className="py-3 rounded-lg bg-[#16171B] border border-neutral-800 space-y-3 animate-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-medium text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Xuất sắc! Bạn đã hoàn thành Bài {currentLesson.lessonNumber}</span>
                  </div>
                  <div className="flex items-center justify-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={resetLessonPractice}
                      className="px-4 py-2 rounded-md bg-[#0B0C0E] border border-neutral-800 text-neutral-300 text-xs font-medium hover:text-white transition-colors"
                    >
                      Luyện lại bài này
                    </button>
                    <button
                      type="button"
                      onClick={handleNextLesson}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors"
                    >
                      <span>Bài tiếp theo</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Anchored On-Screen Keyboard */}
          <div className="pt-2 w-full relative z-10">
            <FlickKeyboard
              settings={settings}
              targetKeyId={
                !isLessonComplete
                  ? typedBuffer
                    ? 'mod'
                    : expectedInfo?.keyId
                  : undefined
              }
              targetDirection={
                !isLessonComplete
                  ? typedBuffer
                    ? 'center'
                    : expectedInfo?.direction
                  : undefined
              }
              onCharInput={handleCharInput}
              onModifier={handleModifier}
              onBackspace={() => setTypedBuffer('')}
              onSpace={() => {}}
              onEnter={() => {
                if (isLessonComplete) handleNextLesson();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

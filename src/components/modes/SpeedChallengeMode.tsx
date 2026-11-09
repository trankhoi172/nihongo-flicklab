import React, { useState, useEffect, useRef } from 'react';
import type { UserSettings } from '../../types/settings';
import type { SpeedChallengeRecord } from '../../types/practice';
import type { FlickDirection } from '../../types/keyboard';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getPracticeTargets, applyModifier, isReachableInCycle, getKanaInfo } from '../../utils/kanaHelper';
import { recordSpeedChallenge, loadProgress } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, Play, RotateCcw, ArrowRight } from 'lucide-react';

interface SpeedChallengeModeProps {
  settings: UserSettings;
}

export const SpeedChallengeMode: React.FC<SpeedChallengeModeProps> = ({ settings }) => {
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [selectedType, setSelectedType] = useState<'kana' | 'word'>('kana');

  const [gameState, setGameState] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState(30);

  const [currentKana, setCurrentKana] = useState<string>('あ');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wordCharIndex, setWordCharIndex] = useState(0);
  const [typedBuffer, setTypedBuffer] = useState('');

  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [currentCombo, setCurrentCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);

  const [resultRecord, setResultRecord] = useState<SpeedChallengeRecord | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const timerRef = useRef<number | null>(null);

  const startChallenge = () => {
    setTimeLeft(selectedDuration);
    setTotalCharsTyped(0);
    setCorrectChars(0);
    setCurrentCombo(0);
    setMaxCombo(0);
    setTypedBuffer('');
    setWordCharIndex(0);
    setIsNewRecord(false);
    setResultRecord(null);

    const pool = getPracticeTargets('all');
    const firstKana = pool[Math.floor(Math.random() * pool.length)].char;
    setCurrentKana(firstKana);
    setCurrentWordIndex(Math.floor(Math.random() * VOCABULARY_LIST.length));

    setGameState('running');
    if (settings.soundEnabled) soundEffects.playTick(settings.soundVolume);
  };

  useEffect(() => {
    if (gameState === 'running') {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishGame();
            return 0;
          }
          if (prev <= 5 && settings.soundEnabled) {
            soundEffects.playTick(settings.soundVolume);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, settings.soundEnabled]);

  const finishGame = () => {
    setGameState('finished');

    const duration = selectedDuration;
    const cpm = Math.round((correctChars / duration) * 60);
    const accuracy = totalCharsTyped > 0 ? Math.round((correctChars / totalCharsTyped) * 100) : 100;
    const score = Math.round(cpm * (accuracy / 100) + maxCombo * 10);

    let rank: 'S' | 'A' | 'B' | 'C' | 'D' = 'D';
    if (cpm >= 160) rank = 'S';
    else if (cpm >= 110) rank = 'A';
    else if (cpm >= 75) rank = 'B';
    else if (cpm >= 40) rank = 'C';

    const record: SpeedChallengeRecord = {
      date: new Date().toISOString(),
      durationSeconds: duration,
      mode: selectedType,
      cpm,
      accuracy,
      totalChars: correctChars,
      score,
      rank,
    };

    setResultRecord(record);

    const prevProgress = loadProgress();
    if (cpm > prevProgress.bestCPM) {
      setIsNewRecord(true);
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.5 } });
    }

    if (settings.soundEnabled) soundEffects.playCelebration(settings.soundVolume);
    recordSpeedChallenge(record);
  };

  const handleCharInput = (char: string) => {
    if (gameState !== 'running') return;

    setTotalCharsTyped((prev) => prev + 1);

    if (selectedType === 'kana') {
      const info = getKanaInfo(currentKana);
      if (info?.needsModifier) {
        if (char === info.baseChar) {
          setTypedBuffer(char);
          if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
        } else {
          onMistake();
        }
      } else {
        if (char === currentKana) {
          onSuccess();
          const pool = getPracticeTargets('all');
          setCurrentKana(pool[Math.floor(Math.random() * pool.length)].char);
          setTypedBuffer('');
        } else {
          onMistake();
        }
      }
    } else {
      const word = VOCABULARY_LIST[currentWordIndex];
      const targetChar = word.kana[wordCharIndex];
      const info = getKanaInfo(targetChar);

      if (info?.needsModifier) {
        if (char === info.baseChar) {
          setTypedBuffer(char);
          if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
        } else {
          onMistake();
        }
      } else {
        if (char === targetChar) {
          onSuccess();
          advanceWordProgress();
        } else {
          onMistake();
        }
      }
    }
  };

  const handleModifier = (direction?: FlickDirection) => {
    if (gameState !== 'running' || !typedBuffer) return;

    setTotalCharsTyped((prev) => prev + 1);
    const modified = applyModifier(typedBuffer, direction);

    if (selectedType === 'kana') {
      if (modified === currentKana) {
        onSuccess();
        const pool = getPracticeTargets('all');
        setCurrentKana(pool[Math.floor(Math.random() * pool.length)].char);
        setTypedBuffer('');
      } else if (isReachableInCycle(modified, currentKana)) {
        setTypedBuffer(modified);
        if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
      } else {
        onMistake();
      }
    } else {
      const word = VOCABULARY_LIST[currentWordIndex];
      const targetChar = word.kana[wordCharIndex];
      if (modified === targetChar) {
        onSuccess();
        setTypedBuffer('');
        advanceWordProgress();
      } else if (isReachableInCycle(modified, targetChar)) {
        setTypedBuffer(modified);
        if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
      } else {
        onMistake();
      }
    }
  };

  const advanceWordProgress = () => {
    const word = VOCABULARY_LIST[currentWordIndex];
    if (wordCharIndex + 1 < word.kana.length) {
      setWordCharIndex((prev) => prev + 1);
    } else {
      setWordCharIndex(0);
      setCurrentWordIndex((prev) => (prev + 1) % VOCABULARY_LIST.length);
    }
  };

  const onSuccess = () => {
    setCorrectChars((prev) => prev + 1);
    setCurrentCombo((prev) => {
      const next = prev + 1;
      if (next > maxCombo) setMaxCombo(next);
      return next;
    });
    if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);
  };

  const onMistake = () => {
    setCurrentCombo(0);
    setTypedBuffer('');
    if (settings.soundEnabled) soundEffects.playError(settings.soundVolume);
  };

  const currentCpm =
    selectedDuration - timeLeft > 0
      ? Math.round((correctChars / (selectedDuration - timeLeft)) * 60)
      : 0;

  return (
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-2 space-y-3 animate-in fade-in duration-150">
      {/* Configuration Header */}
      {gameState === 'idle' && (
        <div className="p-6 rounded-3xl bg-[#15161c]/90 border border-white/[0.08] shadow-xl text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/[0.1] text-white mx-auto flex items-center justify-center">
            <Timer className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white">
              Thử thách tốc độ (タイムアタック)
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Kiểm tra tốc độ gõ phím Nhật Bản, tính CPM và xếp hạng thành tích.
            </p>
          </div>

          {/* Mode & Duration toggles */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
            <div>
              <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Thời gian:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedDuration(sec as 30 | 60)}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedDuration === sec
                        ? 'bg-white text-black font-bold border-white shadow-xs'
                        : 'border-white/[0.08] text-neutral-400 hover:text-white bg-white/[0.03]'
                    }`}
                  >
                    {sec} Giây
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-neutral-400 block mb-1">Kiểu thi:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'kana', label: 'Kana Rush' },
                  { id: 'word', label: 'Từ vựng' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedType(m.id as 'kana' | 'word')}
                    className={`py-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                      selectedType === m.id
                        ? 'bg-white text-black font-bold border-white shadow-xs'
                        : 'border-white/[0.08] text-neutral-400 hover:text-white bg-white/[0.03]'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={startChallenge}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm shadow-md active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bắt đầu đếm ngược</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Game Session */}
      {gameState === 'running' && (
        <div className="p-5 rounded-3xl bg-[#15161c]/90 border border-white/[0.08] shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-neutral-400">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xl font-bold ${
                  timeLeft <= 5 ? 'text-white underline' : 'text-white'
                }`}
              >
                ⏱️ {timeLeft}s
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-neutral-300">
                <Zap className="w-4 h-4 text-white" />
                <span>Combo: {currentCombo}</span>
              </div>
              <div className="text-white font-bold">
                {currentCpm} CPM
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            {selectedType === 'kana' ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#101115] flex flex-col items-center justify-center border border-white/[0.08] shadow-inner relative">
                  <span className="text-4xl sm:text-5xl font-black text-white">
                    {currentKana}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-neutral-400 mt-1">
                    {getKanaInfo(currentKana)?.romaji}
                  </span>
                </div>

                {/* Visual feedback for active buffer and modifier hint */}
                {typedBuffer ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs text-neutral-200">
                    <span className="text-neutral-400">Đã gõ:</span>
                    <span className="font-bold text-white text-sm">{typedBuffer}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
                    <span className="text-white font-semibold">Nhấn phím [゛゜小]</span>
                  </div>
                ) : getKanaInfo(currentKana)?.needsModifier ? (
                  <div className="text-[11px] text-neutral-400 font-medium">
                    Gõ âm gốc <span className="text-white font-bold">"{getKanaInfo(currentKana)?.baseChar}"</span> trước
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {VOCABULARY_LIST[currentWordIndex].kana.split('').map((c, i) => (
                    <span
                      key={i}
                      className={`w-11 h-13 sm:w-12 sm:h-14 rounded-xl flex items-center justify-center text-xl sm:text-2xl font-bold transition-all ${
                        i < wordCharIndex
                          ? 'bg-white/10 text-white border border-white/20'
                          : i === wordCharIndex
                          ? 'bg-white text-black font-extrabold shadow-md scale-105'
                          : 'bg-white/[0.04] text-neutral-500 border border-white/[0.06]'
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-neutral-400">
                  {VOCABULARY_LIST[currentWordIndex].meaningVi}
                </div>

                {typedBuffer && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-[11px] text-neutral-200 mt-1">
                    <span className="text-neutral-400">Đã gõ:</span>
                    <span className="font-bold text-white">{typedBuffer}</span>
                    <ArrowRight className="w-3 h-3 text-neutral-400" />
                    <span className="text-white font-semibold">Nhấn [゛゜小]</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finished Results Screen */}
      {gameState === 'finished' && resultRecord && (
        <div className="p-6 rounded-3xl bg-[#15161c]/90 border border-white/[0.08] shadow-xl space-y-4 text-center animate-in zoom-in-95 duration-150">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.08] border border-white/[0.15] text-white text-xs font-bold">
              <Trophy className="w-3.5 h-3.5" />
              <span>KỶ LỤC TỐC ĐỘ MỚI!</span>
            </div>
          )}

          <div>
            <div className="text-4xl sm:text-5xl font-black text-white my-1 font-serif">
              Hạng {resultRecord.rank}
            </div>
            <h3 className="text-base sm:text-lg font-bold text-neutral-200">
              {resultRecord.rank === 'S'
                ? 'Đẳng cấp Bậc Thầy (達人)'
                : resultRecord.rank === 'A'
                ? 'Tốc độ Siêu Cấp (上級)'
                : resultRecord.rank === 'B'
                ? 'Thành thạo Tốt (中級)'
                : 'Cần luyện thêm (初級)'}
            </h3>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="text-neutral-400">Tốc độ</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {resultRecord.cpm} <span className="text-[10px] font-normal text-neutral-400">CPM</span>
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="text-neutral-400">Chính xác</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {resultRecord.accuracy}%
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="text-neutral-400">Đã gõ</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {resultRecord.totalChars}
              </div>
            </div>
            <div className="p-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
              <div className="text-neutral-400">Combo đỉnh</div>
              <div className="text-base sm:text-lg font-bold text-white mt-0.5">
                {maxCombo}
              </div>
            </div>
          </div>

          <div className="pt-1 flex justify-center gap-3">
            <button
              onClick={startChallenge}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-white text-black text-xs font-bold shadow-md hover:bg-neutral-200 transition-all active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Thử lại lần nữa</span>
            </button>
            <button
              onClick={() => setGameState('idle')}
              className="px-4 py-2.5 rounded-2xl border border-white/[0.08] text-neutral-300 text-xs font-semibold hover:bg-white/[0.05] transition-colors"
            >
              Đổi cài đặt
            </button>
          </div>
        </div>
      )}

      {/* Locked On-Screen Keyboard */}
      <div className="pt-1 sticky bottom-2 z-20">
        <FlickKeyboard
          settings={settings}
          targetKeyId={
            settings.showFlickHints && gameState === 'running'
              ? typedBuffer
                ? 'mod'
                : selectedType === 'kana'
                ? getKanaInfo(currentKana)?.keyId
                : getKanaInfo(VOCABULARY_LIST[currentWordIndex].kana[wordCharIndex])?.keyId
              : undefined
          }
          targetDirection={
            settings.showFlickHints && gameState === 'running'
              ? typedBuffer
                ? 'center'
                : selectedType === 'kana'
                ? getKanaInfo(currentKana)?.direction
                : getKanaInfo(VOCABULARY_LIST[currentWordIndex].kana[wordCharIndex])?.direction
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

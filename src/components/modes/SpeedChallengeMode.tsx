import React, { useState, useEffect, useRef } from 'react';
import type { UserSettings } from '../../types/settings';
import type { SpeedChallengeRecord } from '../../types/practice';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getPracticeTargets, getModifiedChar, getKanaInfo } from '../../utils/kanaHelper';
import { recordSpeedChallenge, loadProgress } from '../../utils/storage';
import { soundEffects } from '../../utils/audio';
import confetti from 'canvas-confetti';
import { Timer, Zap, Trophy, Play, RotateCcw } from 'lucide-react';

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

  const handleModifier = () => {
    if (gameState !== 'running' || !typedBuffer) return;

    setTotalCharsTyped((prev) => prev + 1);
    const modified = getModifiedChar(typedBuffer);

    if (selectedType === 'kana') {
      if (modified === currentKana) {
        onSuccess();
        const pool = getPracticeTargets('all');
        setCurrentKana(pool[Math.floor(Math.random() * pool.length)].char);
        setTypedBuffer('');
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
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Configuration Header */}
      {gameState === 'idle' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-5 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
            <Timer className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              Thử thách tốc độ (タイムアタック)
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Kiểm tra tốc độ gõ phím Nhật Bản, tính CPM và thăng hạng danh hiệu.
            </p>
          </div>

          {/* Mode & Duration toggles */}
          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto text-left">
            <div>
              <span className="text-[11px] font-semibold text-stone-400 block mb-1">Thời gian:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[30, 60].map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSelectedDuration(sec as 30 | 60)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedDuration === sec
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {sec} Giây
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-semibold text-stone-400 block mb-1">Kiểu thi:</span>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'kana', label: 'Kana Rush' },
                  { id: 'word', label: 'Từ vựng' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedType(m.id as 'kana' | 'word')}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all text-center ${
                      selectedType === m.id
                        ? 'bg-red-600 text-white border-red-600 shadow-xs'
                        : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={startChallenge}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl shadow-red-900/30 hover:scale-105 active:scale-95 transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Bắt đầu đếm ngược</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Game Session */}
      {gameState === 'running' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500">
            <div className="flex items-center gap-2">
              <span
                className={`font-mono text-xl font-black ${
                  timeLeft <= 5 ? 'text-red-600 animate-ping' : 'text-stone-900 dark:text-stone-100'
                }`}
              >
                ⏱️ {timeLeft}s
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-600">
                <Zap className="w-4 h-4 fill-current" />
                <span>Combo: {currentCombo}</span>
              </div>
              <div className="text-stone-800 dark:text-stone-200 font-bold">
                {currentCpm} CPM
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            {selectedType === 'kana' ? (
              <div className="w-28 h-28 rounded-3xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center border border-stone-200 dark:border-stone-700 shadow-inner">
                <span className="text-5xl font-black text-stone-900 dark:text-stone-100">
                  {currentKana}
                </span>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2">
                  {VOCABULARY_LIST[currentWordIndex].kana.split('').map((c, i) => (
                    <span
                      key={i}
                      className={`w-12 h-14 rounded-xl flex items-center justify-center text-2xl font-bold ${
                        i < wordCharIndex
                          ? 'bg-emerald-500 text-white'
                          : i === wordCharIndex
                          ? 'bg-red-50 text-red-600 border-2 border-red-500'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-400'
                      }`}
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <div className="text-xs text-stone-500 text-center">
                  {VOCABULARY_LIST[currentWordIndex].meaningVi}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Finished Results Screen */}
      {gameState === 'finished' && resultRecord && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-5 text-center animate-in zoom-in-95 duration-200">
          {isNewRecord && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold animate-bounce">
              <Trophy className="w-3.5 h-3.5" />
              <span>KỶ LỤC TỐC ĐỘ MỚI!</span>
            </div>
          )}

          <div>
            <div className="text-5xl font-black text-red-600 dark:text-red-400 my-1 font-serif">
              Hạng {resultRecord.rank}
            </div>
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
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
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80">
              <div className="text-stone-400">Tốc độ</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                {resultRecord.cpm} <span className="text-[10px] font-normal">CPM</span>
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80">
              <div className="text-stone-400">Chính xác</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                {resultRecord.accuracy}%
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80">
              <div className="text-stone-400">Đã gõ</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-100 mt-1">
                {resultRecord.totalChars}
              </div>
            </div>
            <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80">
              <div className="text-stone-400">Combo đỉnh</div>
              <div className="text-lg font-bold text-amber-600 mt-1">
                {maxCombo}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={startChallenge}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold shadow-md hover:scale-105 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Thử lại lần nữa</span>
            </button>
            <button
              onClick={() => setGameState('idle')}
              className="px-4 py-2.5 rounded-2xl border border-stone-200 dark:border-stone-700 text-stone-600 text-xs font-semibold"
            >
              Đổi cài đặt
            </button>
          </div>
        </div>
      )}

      {/* On-Screen Keyboard */}
      <div className="pt-1">
        <FlickKeyboard
          settings={settings}
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

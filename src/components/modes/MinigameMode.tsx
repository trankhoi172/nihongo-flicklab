import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UserSettings } from '../../types/settings';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { soundEffects } from '../../utils/audio';
import { getModifiedChar } from '../../utils/kanaHelper';
import { recordMinigameScore, loadProgress } from '../../utils/storage';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import confetti from 'canvas-confetti';
import {
  Heart,
  Trophy,
  Play,
  RotateCcw,
  Pause,
  Sparkles,
  Flame,
  HelpCircle,
} from 'lucide-react';

export type GameDifficulty = 'easy' | 'normal' | 'hard' | 'word';

interface FallingItem {
  id: string;
  char: string;
  romaji: string;
  fullWord?: string;
  typedIndex?: number;
  x: number; // 8% to 84%
  y: number; // 0% to 100%
  speed: number;
  points: number;
}

interface FloatingScore {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
}

const EASY_CHARS = [
  { char: 'あ', romaji: 'a' },
  { char: 'い', romaji: 'i' },
  { char: 'う', romaji: 'u' },
  { char: 'え', romaji: 'e' },
  { char: 'お', romaji: 'o' },
  { char: 'か', romaji: 'ka' },
  { char: 'き', romaji: 'ki' },
  { char: 'く', romaji: 'ku' },
  { char: 'け', romaji: 'ke' },
  { char: 'こ', romaji: 'ko' },
];

const NORMAL_CHARS = [
  ...EASY_CHARS,
  { char: 'さ', romaji: 'sa' },
  { char: 'し', romaji: 'shi' },
  { char: 'す', romaji: 'su' },
  { char: 'せ', romaji: 'se' },
  { char: 'そ', romaji: 'so' },
  { char: 'た', romaji: 'ta' },
  { char: 'ち', romaji: 'chi' },
  { char: 'つ', romaji: 'tsu' },
  { char: 'て', romaji: 'te' },
  { char: 'と', romaji: 'to' },
  { char: 'な', romaji: 'na' },
  { char: 'に', romaji: 'ni' },
  { char: 'ぬ', romaji: 'nu' },
  { char: 'ね', romaji: 'ne' },
  { char: 'の', romaji: 'no' },
  { char: 'は', romaji: 'ha' },
  { char: 'ひ', romaji: 'hi' },
  { char: 'ふ', romaji: 'fu' },
  { char: 'へ', romaji: 'he' },
  { char: 'ほ', romaji: 'ho' },
  { char: 'ま', romaji: 'ma' },
  { char: 'み', romaji: 'mi' },
  { char: 'む', romaji: 'mu' },
  { char: 'め', romaji: 'me' },
  { char: 'も', romaji: 'mo' },
  { char: 'や', romaji: 'ya' },
  { char: 'ゆ', romaji: 'yu' },
  { char: 'よ', romaji: 'yo' },
  { char: 'ら', romaji: 'ra' },
  { char: 'り', romaji: 'ri' },
  { char: 'る', romaji: 'ru' },
  { char: 'れ', romaji: 're' },
  { char: 'ろ', romaji: 'ro' },
  { char: 'わ', romaji: 'wa' },
  { char: 'を', romaji: 'wo' },
  { char: 'ん', romaji: 'n' },
];

const HARD_EXTRA_CHARS = [
  { char: 'が', romaji: 'ga' },
  { char: 'ぎ', romaji: 'gi' },
  { char: 'ぐ', romaji: 'gu' },
  { char: 'げ', romaji: 'ge' },
  { char: 'ご', romaji: 'go' },
  { char: 'ざ', romaji: 'za' },
  { char: 'じ', romaji: 'ji' },
  { char: 'ず', romaji: 'zu' },
  { char: 'ぜ', romaji: 'ze' },
  { char: 'ぞ', romaji: 'zo' },
  { char: 'だ', romaji: 'da' },
  { char: 'ぢ', romaji: 'ji' },
  { char: 'づ', romaji: 'zu' },
  { char: 'で', romaji: 'de' },
  { char: 'ど', romaji: 'do' },
  { char: 'ば', romaji: 'ba' },
  { char: 'び', romaji: 'bi' },
  { char: 'ぶ', romaji: 'bu' },
  { char: 'べ', romaji: 'be' },
  { char: 'ぼ', romaji: 'bo' },
  { char: 'ぱ', romaji: 'pa' },
  { char: 'ぴ', romaji: 'pi' },
  { char: 'ぷ', romaji: 'pu' },
  { char: 'ぺ', romaji: 'pe' },
  { char: 'ぽ', romaji: 'po' },
  { char: 'っ', romaji: 'tsu (sokuon)' },
];

interface MinigameModeProps {
  settings: UserSettings;
}

export const MinigameMode: React.FC<MinigameModeProps> = ({ settings }) => {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'gameover'>('menu');
  const [difficulty, setDifficulty] = useState<GameDifficulty>('normal');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [clearedCount, setClearedCount] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  const itemsRef = useRef<FallingItem[]>([]);
  const lastTypedBaseRef = useRef<string>('');
  const [, setRenderTick] = useState(0); // Forces re-render on RAF
  const lastSpawnTime = useRef<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const nextItemId = useRef(1);

  // Load high score on mount
  useEffect(() => {
    const prog = loadProgress();
    setHighScore(prog.minigameHighScore || 0);
  }, []);

  const getDifficultySettings = useCallback((diff: GameDifficulty) => {
    switch (diff) {
      case 'easy':
        return { speed: 0.16, spawnInterval: 2400, speedMultiplier: 1.0 };
      case 'normal':
        return { speed: 0.24, spawnInterval: 1800, speedMultiplier: 1.15 };
      case 'hard':
        return { speed: 0.32, spawnInterval: 1400, speedMultiplier: 1.3 };
      case 'word':
        return { speed: 0.20, spawnInterval: 2600, speedMultiplier: 1.1 };
    }
  }, []);

  const spawnItem = useCallback(() => {
    const { speed } = getDifficultySettings(difficulty);
    const id = `item-${nextItemId.current++}`;
    const x = 12 + Math.random() * 70; // 12% to 82% margin

    if (difficulty === 'word') {
      const easyWords = VOCABULARY_LIST.filter((w) => w.difficulty === 'easy' && w.kana.length <= 3);
      const chosen = easyWords[Math.floor(Math.random() * easyWords.length)] || easyWords[0];
      const newItem: FallingItem = {
        id,
        char: chosen.kana[0],
        romaji: chosen.romaji,
        fullWord: chosen.kana,
        typedIndex: 0,
        x,
        y: -5,
        speed: speed * (0.9 + Math.random() * 0.25),
        points: chosen.kana.length * 120,
      };
      itemsRef.current.push(newItem);
    } else {
      let pool = EASY_CHARS;
      if (difficulty === 'normal') pool = NORMAL_CHARS;
      if (difficulty === 'hard') pool = [...NORMAL_CHARS, ...HARD_EXTRA_CHARS];

      const chosen = pool[Math.floor(Math.random() * pool.length)];
      const newItem: FallingItem = {
        id,
        char: chosen.char,
        romaji: chosen.romaji,
        x,
        y: -5,
        speed: speed * (0.85 + Math.random() * 0.3),
        points: 100,
      };
      itemsRef.current.push(newItem);
    }
  }, [difficulty, getDifficultySettings]);

  // Main game loop using requestAnimationFrame
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      return;
    }

    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Spawn check
      const { spawnInterval } = getDifficultySettings(difficulty);
      if (timestamp - lastSpawnTime.current >= spawnInterval) {
        spawnItem();
        lastSpawnTime.current = timestamp;
      }

      // Update falling items
      let hitBottom = false;
      const survivingItems: FallingItem[] = [];

      for (const item of itemsRef.current) {
        // Move item down
        const step = item.speed * (delta / 16.666);
        item.y += step;

        // Check if item crossed laser/bottom line at 94%
        if (item.y >= 94) {
          hitBottom = true;
        } else {
          survivingItems.push(item);
        }
      }

      itemsRef.current = survivingItems;

      if (hitBottom) {
        if (settings.soundEnabled) soundEffects.playLifeLost(settings.soundVolume);
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 260);

        setCombo(0);
        setLives((prev) => {
          const nextLives = prev - 1;
          if (nextLives <= 0) {
            // Game Over
            setGameState('gameover');
          }
          return Math.max(0, nextLives);
        });
      }

      setRenderTick((t) => (t + 1) % 100000);
      animationFrameId.current = requestAnimationFrame(loop);
    };

    animationFrameId.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, difficulty, getDifficultySettings, spawnItem, settings.soundEnabled, settings.soundVolume]);

  // Handle Game Over
  useEffect(() => {
    if (gameState === 'gameover') {
      const result = recordMinigameScore(score, maxCombo);
      setIsNewHigh(result.isNewHighScore);
      if (result.isNewHighScore) {
        setHighScore(result.highScore);
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }
      if (settings.soundEnabled) soundEffects.playCelebration(settings.soundVolume);
    }
  }, [gameState, score, maxCombo, settings.soundEnabled, settings.soundVolume]);

  const startGame = (diff: GameDifficulty = difficulty) => {
    setDifficulty(diff);
    itemsRef.current = [];
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setClearedCount(0);
    setIsNewHigh(false);
    lastSpawnTime.current = performance.now();
    setGameState('playing');
  };

  const handleKeyPress = (char: string) => {
    if (gameState !== 'playing') return;
    lastTypedBaseRef.current = char;

    // Find candidate matching items
    // Priority: Lowest item (maximum y) that matches the expected character
    let bestIndex = -1;
    let maxY = -999;

    itemsRef.current.forEach((item, idx) => {
      const targetChar = item.fullWord
        ? item.fullWord[item.typedIndex || 0]
        : item.char;

      if (targetChar === char && item.y > maxY) {
        maxY = item.y;
        bestIndex = idx;
      }
    });

    if (bestIndex !== -1) {
      const item = itemsRef.current[bestIndex];

      if (item.fullWord) {
        // Word mode: advance letter
        const nextTyped = (item.typedIndex || 0) + 1;
        if (nextTyped < item.fullWord.length) {
          item.typedIndex = nextTyped;
          if (settings.soundEnabled) soundEffects.playLaserPop(settings.soundVolume);
          // Spawn little tick
          return;
        }
      }

      // Completely destroyed this item!
      itemsRef.current.splice(bestIndex, 1);
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > maxCombo) setMaxCombo(newCombo);
      setClearedCount((c) => c + 1);

      // Score calculation with combo bonus
      const comboMultiplier = Math.min(5, 1 + Math.floor(newCombo / 5) * 0.5);
      const earned = Math.round(item.points * comboMultiplier);
      setScore((s) => s + earned);

      // Trigger floating score
      const floatId = `float-${Date.now()}-${Math.random()}`;
      setFloatingScores((prev) => [
        ...prev.slice(-4),
        {
          id: floatId,
          text: `+${earned}${newCombo > 2 ? ` 🔥x${newCombo}` : ''}`,
          x: item.x,
          y: Math.max(10, item.y),
          color: newCombo >= 5 ? '#F59E0B' : '#10B981',
        },
      ]);
      setTimeout(() => {
        setFloatingScores((prev) => prev.filter((f) => f.id !== floatId));
      }, 700);

      // Sound
      if (settings.soundEnabled) {
        soundEffects.playLaserPop(settings.soundVolume);
        if (newCombo > 1) {
          soundEffects.playCombo(newCombo, settings.soundVolume);
        }
      }

      // Confetti for big combo milestones
      if (newCombo === 10 || newCombo === 20 || newCombo === 30) {
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { x: item.x / 100, y: item.y / 100 },
          });
        } catch {}
      }
    } else {
      // Missed key: reset combo gently or play soft error
      if (settings.soundEnabled) soundEffects.playTap('bubble', settings.soundVolume * 0.3);
    }
  };

  const handleModifier = () => {
    if (gameState !== 'playing' || !lastTypedBaseRef.current) return;
    const modified = getModifiedChar(lastTypedBaseRef.current);
    lastTypedBaseRef.current = modified;
    handleKeyPress(modified);
  };

  const getRank = (finalScore: number) => {
    if (finalScore >= 5000) return { label: 'S+', title: 'Thần Tốc (神速)', color: 'text-amber-400 border-amber-500 bg-amber-950/40' };
    if (finalScore >= 3500) return { label: 'S', title: 'Bậc Thầy (達人)', color: 'text-rose-400 border-rose-500 bg-rose-950/40' };
    if (finalScore >= 2000) return { label: 'A', title: 'Cao Thủ (精鋭)', color: 'text-purple-400 border-purple-500 bg-purple-950/40' };
    if (finalScore >= 1000) return { label: 'B', title: 'Tiến Bộ (上達)', color: 'text-blue-400 border-blue-500 bg-blue-950/40' };
    return { label: 'C', title: 'Tập Sự (修行中)', color: 'text-stone-400 border-stone-600 bg-stone-900' };
  };

  return (
    <div className="max-w-2xl mx-auto px-3 py-2 space-y-3 animate-in fade-in duration-150">
      {/* Game Mode Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Mưa Chữ Kana (雨の降下)</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/80">
                Minigame
              </span>
            </h1>
            <p className="text-[11px] text-stone-400">
              Gõ đúng ký tự rơi trước khi chạm tia đỏ để bảo vệ thành trì!
            </p>
          </div>
        </div>

        {/* High Score Banner */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#14161D] border border-stone-800 text-xs font-mono">
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-stone-400 text-[10px]">KỶ LỤC:</span>
          <span className="font-bold text-amber-300">{highScore}</span>
        </div>
      </div>

      {/* Main Playfield Arena */}
      <div
        className={`relative w-full h-[260px] sm:h-[290px] rounded-3xl bg-[#0D0E12] border border-stone-800/90 overflow-hidden shadow-2xl transition-all ${
          screenShake ? 'animate-shake border-red-500 shadow-red-950/50' : ''
        }`}
      >
        {/* Background Subtle Ambience / Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#1f2430_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        <div className="absolute -right-6 -bottom-6 text-9xl font-serif text-white/[0.02] select-none pointer-events-none">
          雨
        </div>

        {/* HUD Top Bar inside Canvas */}
        <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between text-xs">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 bg-[#14161D]/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-stone-800">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 transition-all duration-300 ${
                  heartIndex <= lives
                    ? 'text-red-500 fill-red-500 scale-100'
                    : 'text-stone-700 fill-stone-800 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Current Score & Combo */}
          <div className="flex items-center gap-2">
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-bold animate-pulse">
                <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span>COMBO x{combo}</span>
              </div>
            )}
            <div className="bg-[#14161D]/80 backdrop-blur-sm px-3 py-1 rounded-full border border-stone-800 font-mono font-bold text-white text-xs">
              {score.toLocaleString()} <span className="text-[10px] text-stone-400">PTS</span>
            </div>
          </div>

          {/* Pause Button */}
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="p-1.5 rounded-full bg-[#14161D]/80 hover:bg-stone-800 text-stone-300 border border-stone-800 transition-colors"
              title="Tạm dừng"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Floating Score Popups */}
        {floatingScores.map((f) => (
          <div
            key={f.id}
            style={{ left: `${f.x}%`, top: `${f.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 font-bold font-mono text-xs sm:text-sm animate-out fade-out slide-out-to-top duration-500"
          >
            <span
              style={{ color: f.color }}
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-2 py-0.5 rounded-md bg-black/60 border border-white/10"
            >
              {f.text}
            </span>
          </div>
        ))}

        {/* Falling Kana Characters */}
        {gameState === 'playing' &&
          itemsRef.current.map((item) => {
            const isWord = Boolean(item.fullWord);
            return (
              <div
                key={item.id}
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 transition-transform duration-75 flex flex-col items-center pointer-events-none select-none"
              >
                {/* Glow Bubble */}
                <div
                  className={`relative flex items-center justify-center rounded-2xl border px-3 py-1.5 shadow-lg backdrop-blur-xs transition-all ${
                    isWord
                      ? 'bg-purple-950/80 border-purple-500/80 shadow-purple-900/40 text-purple-100'
                      : 'bg-stone-900/90 border-stone-700/80 shadow-black/80 text-white'
                  }`}
                >
                  {isWord && item.fullWord ? (
                    <div className="flex items-center text-base sm:text-lg font-bold font-sans tracking-tight">
                      {item.fullWord.split('').map((char, charIdx) => {
                        const isTyped = (item.typedIndex || 0) > charIdx;
                        const isCurrent = (item.typedIndex || 0) === charIdx;
                        return (
                          <span
                            key={charIdx}
                            className={`${
                              isTyped
                                ? 'text-emerald-400 line-through opacity-60'
                                : isCurrent
                                ? 'text-amber-300 underline decoration-amber-400 decoration-2 font-extrabold scale-110'
                                : 'text-stone-200'
                            }`}
                          >
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xl sm:text-2xl font-bold font-sans leading-none">
                      {item.char}
                    </span>
                  )}
                </div>

                {/* Sub Romaji Hint */}
                {settings.showRomaji && (
                  <span className="text-[10px] font-mono text-stone-400 bg-black/70 px-1.5 py-0.2 rounded mt-0.5 leading-tight">
                    {item.romaji}
                  </span>
                )}
              </div>
            );
          })}

        {/* Defense Laser Danger Line */}
        <div className="absolute bottom-[2%] left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-full h-0.5 bg-red-500/80 shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse" />
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-red-400 font-mono mt-0.5 opacity-70">
            <span>Tia phòng tuyến (境界線)</span>
          </div>
        </div>

        {/* OVERLAYS: Menu, Paused, GameOver */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 z-40 bg-[#0B0C0E]/95 backdrop-blur-md p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Rèn luyện phản xạ ngón tay tức thì</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                Chọn chế độ mưa Kana
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Các chữ tiếng Nhật sẽ rơi từ trên xuống. Bạn chỉ cần gõ đúng ký tự bằng bàn phím 12 phím để kích hoạt tia triệt tiêu!
              </p>
            </div>

            {/* Difficulty Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-2">
              {[
                { id: 'easy', name: 'Tập sự', sub: 'A & Ka', desc: '10 chữ cơ bản' },
                { id: 'normal', name: 'Chiến binh', sub: 'Toàn bộ 46 chữ', desc: 'Hàng あ ~ わ' },
                { id: 'hard', name: 'Bậc thầy', sub: 'Biến âm & Ngắt', desc: 'Có が, ぱ, っ' },
                { id: 'word', name: 'Mưa từ vựng', sub: 'Từ 2-3 chữ', desc: 'Neko, Sakura...' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as GameDifficulty)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    difficulty === d.id
                      ? 'bg-red-950/60 border-red-500 text-white shadow-lg shadow-red-950/40 ring-1 ring-red-500/50'
                      : 'bg-[#14161D] border-stone-800 text-stone-400 hover:border-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold text-stone-200">{d.name}</div>
                  <div className="text-[10px] text-red-400 font-semibold leading-tight">{d.sub}</div>
                  <div className="text-[9px] text-stone-500 mt-0.5 leading-none">{d.desc}</div>
                </button>
              ))}
            </div>

            {/* Start Button */}
            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-stone-500 flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>3 lượt chơi ❤️ | Combo tăng điểm</span>
              </div>
              <button
                onClick={() => startGame(difficulty)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl shadow-red-950/80 active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Bắt đầu chơi (開始)</span>
              </button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Đang tạm dừng (一時停止)</h3>
            <p className="text-xs text-stone-400 text-center max-w-xs">
              Thư giãn ngón tay trước khi tiếp tục chuỗi combo rực rỡ!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGameState('playing')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-lg active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Tiếp tục</span>
              </button>
              <button
                onClick={() => startGame(difficulty)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 hover:text-white text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="px-4 py-2.5 rounded-xl bg-stone-850 text-stone-400 hover:text-stone-200 text-xs font-semibold"
              >
                Về menu
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-40 bg-[#0B0C0E]/95 backdrop-blur-md p-5 flex flex-col justify-between animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-[11px] font-bold">
                Trận đấu kết thúc (ゲームオーバー)
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {score.toLocaleString()} <span className="text-sm text-stone-400">PTS</span>
              </h3>
              {isNewHigh && (
                <div className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold animate-bounce">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>KỶ LỤC MỚI ĐÃ ĐƯỢC XÁC LẬP! 🎉</span>
                </div>
              )}
            </div>

            {/* Rank Card */}
            {(() => {
              const rank = getRank(score);
              return (
                <div className="flex items-center justify-around py-3 px-4 rounded-2xl bg-[#14161D] border border-stone-800">
                  <div className="text-center">
                    <div className="text-[10px] text-stone-500 uppercase font-mono">Xếp hạng</div>
                    <div className={`text-2xl font-black px-3 py-0.5 rounded-xl border mt-0.5 ${rank.color}`}>
                      {rank.label}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-stone-500 uppercase font-mono">Danh hiệu</div>
                    <div className="text-xs font-bold text-stone-200 mt-1">{rank.title}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-stone-500 uppercase font-mono">Max Combo</div>
                    <div className="text-lg font-bold text-amber-400 mt-0.5">🔥 {maxCombo}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-stone-500 uppercase font-mono">Đã diệt</div>
                    <div className="text-lg font-bold text-emerald-400 mt-0.5">⚡ {clearedCount}</div>
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setGameState('menu')}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-semibold hover:bg-stone-750"
              >
                Đổi chế độ
              </button>
              <button
                onClick={() => startGame(difficulty)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-sm shadow-xl shadow-red-950/80 active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại ngay (再挑戦)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 12-Key Flick Virtual Keyboard */}
      <div className="pt-1">
        <FlickKeyboard
          settings={settings}
          onCharInput={handleKeyPress}
          onModifier={handleModifier}
          onBackspace={() => {}}
          onSpace={() => {}}
          onEnter={() => {}}
        />
      </div>
    </div>
  );
};

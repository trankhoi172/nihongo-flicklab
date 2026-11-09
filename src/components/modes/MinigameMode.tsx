import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { UserSettings } from '../../types/settings';
import type { FlickDirection } from '../../types/keyboard';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { soundEffects } from '../../utils/audio';
import { applyModifier } from '../../utils/kanaHelper';
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
  Zap,
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
          text: `+${earned}${newCombo > 2 ? ` (x${newCombo})` : ''}`,
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

  const handleModifier = (direction?: FlickDirection) => {
    if (gameState !== 'playing' || !lastTypedBaseRef.current) return;
    const modified = applyModifier(lastTypedBaseRef.current, direction);
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
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-2 space-y-3 animate-in fade-in duration-150">
      {/* Game Mode Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/[0.08] text-white border border-white/[0.1] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Mưa Chữ Kana (雨の降下)</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-white/[0.08] text-neutral-300 border border-white/[0.1]">
                Minigame
              </span>
            </h1>
            <p className="text-[11px] text-neutral-400">
              Gõ đúng ký tự rơi trước khi chạm tia đỏ để bảo vệ thành trì!
            </p>
          </div>
        </div>

        {/* High Score Banner */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#14151a] border border-white/[0.08] text-xs font-mono">
          <Trophy className="w-3.5 h-3.5 text-neutral-300" />
          <span className="text-neutral-400 text-[10px]">KỶ LỤC:</span>
          <span className="font-bold text-white">{highScore}</span>
        </div>
      </div>

      {/* Main Playfield Arena */}
      <div
        className={`relative w-full h-[290px] sm:h-[320px] rounded-3xl bg-[#101115] border border-white/[0.08] overflow-hidden shadow-2xl transition-all ${
          screenShake ? 'animate-shake border-rose-500' : ''
        }`}
      >
        {/* Background Subtle Ambience / Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
        <div className="absolute -right-4 -bottom-4 text-9xl font-serif text-white/[0.02] select-none pointer-events-none">
          雨
        </div>

        {/* HUD Top Bar inside Canvas */}
        <div className="absolute top-2 left-3 right-3 z-20 flex items-center justify-between text-xs">
          {/* Hearts / Lives */}
          <div className="flex items-center gap-1 bg-[#14151a]/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/[0.08]">
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-3.5 h-3.5 transition-all duration-300 ${
                  heartIndex <= lives
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-neutral-700 fill-neutral-800 scale-90'
                }`}
              />
            ))}
          </div>

          {/* Current Score & Combo */}
          <div className="flex items-center gap-2">
            {combo > 1 && (
              <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.1] text-white border border-white/[0.15] text-[11px] font-semibold">
                <Flame className="w-3 h-3 text-white fill-white" />
                <span>COMBO x{combo}</span>
              </div>
            )}
            <div className="bg-[#14151a]/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/[0.08] font-mono font-bold text-white text-xs">
              {score.toLocaleString()} <span className="text-[10px] text-neutral-400 font-normal">PTS</span>
            </div>
          </div>

          {/* Pause Button */}
          {gameState === 'playing' && (
            <button
              onClick={() => setGameState('paused')}
              className="p-1.5 rounded-full bg-[#14151a]/90 hover:bg-neutral-800 text-neutral-300 border border-white/[0.08] transition-colors"
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
              className="px-2 py-0.5 rounded-md bg-black/80 border border-white/10"
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
                {/* Bubble */}
                <div
                  className={`relative flex items-center justify-center rounded-2xl border px-3 py-1.5 shadow-lg backdrop-blur-md transition-all ${
                    isWord
                      ? 'bg-neutral-900/95 border-white/20 text-white'
                      : 'bg-[#18191f]/95 border-white/[0.12] text-white'
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
                                ? 'text-neutral-500 line-through opacity-60'
                                : isCurrent
                                ? 'text-white underline decoration-white decoration-2 font-black scale-105'
                                : 'text-neutral-300'
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
                  <span className="text-[10px] font-mono text-neutral-400 bg-black/80 px-1.5 py-0.2 rounded mt-0.5 leading-tight">
                    {item.romaji}
                  </span>
                )}
              </div>
            );
          })}

        {/* Defense Laser Danger Line */}
        <div className="absolute bottom-[2%] left-0 right-0 z-20 flex flex-col items-center pointer-events-none">
          <div className="w-full h-0.5 bg-rose-500/80" />
          <div className="flex items-center gap-1 text-[9px] uppercase tracking-wider text-rose-400/80 font-mono mt-0.5">
            <span>Tia phòng tuyến (境界線)</span>
          </div>
        </div>

        {/* OVERLAYS: Menu, Paused, GameOver */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 z-40 bg-[#0e0f13]/95 backdrop-blur-md p-3.5 sm:p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>Rèn luyện phản xạ ngón tay tức thì</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Chọn chế độ mưa Kana
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5 line-clamp-2 sm:line-clamp-none">
                Các chữ tiếng Nhật sẽ rơi từ trên xuống. Bạn chỉ cần gõ đúng ký tự bằng bàn phím 12 phím để triệt tiêu!
              </p>
            </div>

            {/* Difficulty Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 my-1.5 sm:my-2">
              {[
                { id: 'easy', name: 'Tập sự', sub: 'A & Ka', desc: '10 chữ cơ bản' },
                { id: 'normal', name: 'Chiến binh', sub: 'Toàn bộ 46 chữ', desc: 'Hàng あ ~ わ' },
                { id: 'hard', name: 'Bậc thầy', sub: 'Biến âm & Ngắt', desc: 'Có が, ぱ, っ' },
                { id: 'word', name: 'Mưa từ vựng', sub: 'Từ 2-3 chữ', desc: 'Neko, Sakura...' },
              ].map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id as GameDifficulty)}
                  className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all ${
                    difficulty === d.id
                      ? 'bg-white text-black border-white shadow-xs font-bold'
                      : 'bg-white/[0.04] border-white/[0.08] text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className={`text-xs font-bold ${difficulty === d.id ? 'text-black' : 'text-neutral-200'}`}>
                    {d.name}
                  </div>
                  <div className={`text-[10px] font-medium leading-tight ${difficulty === d.id ? 'text-black/80' : 'text-neutral-400'}`}>
                    {d.sub}
                  </div>
                  <div className={`text-[9px] mt-0.5 leading-none hidden sm:block ${difficulty === d.id ? 'text-black/60' : 'text-neutral-500'}`}>
                    {d.desc}
                  </div>
                </button>
              ))}
            </div>

            {/* Start Button - Always fully visible on mobile */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-white/[0.08] mt-auto shrink-0">
              <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-neutral-500" />
                <span className="inline-flex items-center gap-1">
                  3 lượt chơi <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> • Combo tăng điểm
                </span>
              </div>
              <button
                onClick={() => startGame(difficulty)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm shadow-md active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Bắt đầu chơi (開始)</span>
              </button>
            </div>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 space-y-4">
            <h3 className="text-xl font-bold text-white">Đang tạm dừng (一時停止)</h3>
            <p className="text-xs text-neutral-400 text-center max-w-xs">
              Thư giãn ngón tay trước khi tiếp tục chuỗi combo rực rỡ!
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGameState('playing')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs shadow-md active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Tiếp tục</span>
              </button>
              <button
                onClick={() => startGame(difficulty)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] text-xs font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại</span>
              </button>
              <button
                onClick={() => setGameState('menu')}
                className="px-4 py-2.5 rounded-xl bg-white/[0.05] text-neutral-400 hover:text-neutral-200 border border-white/[0.06] text-xs font-semibold"
              >
                Về menu
              </button>
            </div>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-40 bg-[#0e0f13]/95 backdrop-blur-md p-3.5 sm:p-5 flex flex-col justify-between overflow-y-auto custom-scrollbar animate-in zoom-in-95 duration-150">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-white/[0.08] border border-white/[0.1] text-white text-[11px] font-bold">
                Trận đấu kết thúc (ゲームオーバー)
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {score.toLocaleString()} <span className="text-sm text-neutral-400">PTS</span>
              </h3>
              {isNewHigh && (
                <div className="inline-flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>KỶ LỤC MỚI ĐÃ ĐƯỢC XÁC LẬP!</span>
                </div>
              )}
            </div>

            {/* Rank Card */}
            {(() => {
              const rank = getRank(score);
              return (
                <div className="flex items-center justify-around py-2.5 px-3 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-500 uppercase font-mono">Xếp hạng</div>
                    <div className="text-xl font-bold px-2.5 py-0.5 rounded-lg border border-white/20 mt-0.5 text-white">
                      {rank.label}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-500 uppercase font-mono">Danh hiệu</div>
                    <div className="text-xs font-bold text-neutral-200 mt-1">{rank.title}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-500 uppercase font-mono">Max Combo</div>
                    <div className="text-base font-bold text-white mt-0.5 flex items-center justify-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{maxCombo}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] text-neutral-500 uppercase font-mono">Đã diệt</div>
                    <div className="text-base font-bold text-white mt-0.5 flex items-center justify-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>{clearedCount}</span>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] mt-auto shrink-0">
              <button
                onClick={() => setGameState('menu')}
                className="px-4 py-2 rounded-xl bg-white/[0.06] text-neutral-300 text-xs font-semibold hover:bg-white/[0.1] border border-white/[0.06]"
              >
                Đổi chế độ
              </button>
              <button
                onClick={() => startGame(difficulty)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm shadow-md active:scale-95 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi lại ngay (再挑戦)</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Anchored 12-Key Flick Virtual Keyboard */}
      <div className="pt-2 w-full relative z-10">
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

import React from 'react';
import type { KeyDefinition, FlickDirection } from '../../types/keyboard';

interface FlickFlowerProps {
  keyDef: KeyDefinition;
  isKatakana: boolean;
  activeDirection: FlickDirection;
  showRomaji?: boolean;
}

export const FlickFlower: React.FC<FlickFlowerProps> = ({
  keyDef,
  isKatakana,
  activeDirection,
  showRomaji = true,
}) => {
  const map = isKatakana ? keyDef.katakana : keyDef.hiragana;
  const isModifier = !!keyDef.isModifier;
  const isPunctuation = !!keyDef.isPunctuation;

  // Determine column index to prevent edge clipping (0 = left, 1 = mid, 2 = right)
  const isLeftCol = ['a', 'ta', 'ma', 'wa'].includes(keyDef.id);
  const isRightCol = ['sa', 'ha', 'ra', 'mod'].includes(keyDef.id);

  const horizontalOffset = isLeftCol ? 42 : isRightCol ? 42 : 46;
  const verticalOffset = 46;

  const petals: Array<{
    dir: FlickDirection;
    char: string;
    romaji: string;
    arrow: string;
    label?: string;
    offsetX: number;
    offsetY: number;
  }> = [
    {
      dir: 'center',
      char: map.center,
      romaji: keyDef.romaji.center,
      arrow: '●',
      label: isModifier ? 'Chạm' : 'A',
      offsetX: 0,
      offsetY: 0,
    },
    {
      dir: 'left',
      char: map.left,
      romaji: keyDef.romaji.left,
      arrow: '←',
      label: isModifier ? 'Đục ゛' : 'I',
      offsetX: -horizontalOffset,
      offsetY: 0,
    },
    {
      dir: 'up',
      char: map.up,
      romaji: keyDef.romaji.up,
      arrow: '↑',
      label: isModifier ? 'Nhỏ 小' : 'U',
      offsetX: 0,
      offsetY: -verticalOffset,
    },
    {
      dir: 'right',
      char: map.right,
      romaji: keyDef.romaji.right,
      arrow: '→',
      label: isModifier ? 'Bán đục ゜' : 'E',
      offsetX: horizontalOffset,
      offsetY: 0,
    },
    {
      dir: 'down',
      char: map.down,
      romaji: keyDef.romaji.down,
      arrow: '↓',
      label: isModifier ? 'Đổi' : 'O',
      offsetX: 0,
      offsetY: verticalOffset,
    },
  ];

  const activeChar = map[activeDirection] || map.center;
  const activeRomaji = keyDef.romaji[activeDirection] || '';

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center">
      {/* 1. Floating Overhead HUD Bubble (Minimal frosted glass callout) */}
      <div className="absolute -top-14 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1c1d22]/95 backdrop-blur-2xl border border-white/[0.12] text-white shadow-xl z-50 whitespace-nowrap animate-in fade-in zoom-in-95 duration-75">
        <span className="text-neutral-300 font-medium text-xs">
          {activeDirection === 'left' && '← Trái'}
          {activeDirection === 'up' && '↑ Lên'}
          {activeDirection === 'right' && '→ Phải'}
          {activeDirection === 'down' && '↓ Dưới'}
          {activeDirection === 'center' && '● Chạm'}
        </span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span className="font-bold text-base text-white">{activeChar}</span>
        {showRomaji && activeRomaji && activeRomaji.length <= 4 && (
          <span className="text-[10px] text-neutral-400 font-mono uppercase">
            ({activeRomaji})
          </span>
        )}
      </div>

      {/* 2. Liquid Glass Cross Flower Petals */}
      <div className="relative w-full h-full flex items-center justify-center">
        {petals.map((petal) => {
          const isActive = activeDirection === petal.dir;
          if (!petal.char) return null;

          return (
            <div
              key={petal.dir}
              style={{
                transform: `translate(calc(-50% + ${petal.offsetX}px), calc(-50% + ${petal.offsetY}px)) scale(${
                  isActive ? 1.12 : 0.96
                })`,
                left: '50%',
                top: '50%',
              }}
              className={`absolute flex flex-col items-center justify-center rounded-2xl transition-all duration-100 ${
                petal.dir === 'center' ? 'z-30 w-13 h-13' : 'z-20 w-12 h-12'
              } ${
                isActive
                  ? 'bg-white text-black shadow-xl ring-1 ring-white/80 font-bold'
                  : 'bg-[#222329]/95 text-neutral-200 border border-white/[0.08] shadow-md backdrop-blur-2xl'
              }`}
            >
              {/* Kana Character */}
              <span
                className={`leading-none ${
                  isModifier
                    ? 'text-xs font-bold'
                    : isPunctuation
                    ? 'text-lg font-bold'
                    : isActive
                    ? 'text-2xl font-bold'
                    : 'text-xl font-medium'
                }`}
              >
                {petal.char}
              </span>

              {/* Direction label or vowel identifier */}
              <span
                className={`text-[8px] uppercase tracking-wider font-mono mt-0.5 leading-none ${
                  isActive ? 'text-black/70 font-semibold' : 'text-neutral-400'
                }`}
              >
                {petal.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

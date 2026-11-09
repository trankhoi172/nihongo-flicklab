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

  // Determine column index to prevent edge clipping on small screens
  // Row 0: a (col 0), ka (col 1), sa (col 2)
  // Row 1: ta (col 0), na (col 1), ha (col 2)
  // Row 2: ma (col 0), ya (col 1), ra (col 2)
  // Row 3: mod (col 0), wa (col 1), punct (col 2)
  const isLeftCol = ['a', 'ta', 'ma', 'mod'].includes(keyDef.id);
  const isRightCol = ['sa', 'ha', 'ra', 'punct'].includes(keyDef.id);

  // Calibrate container shift so edge petals stay comfortably inside screen padding
  const containerShiftX = isLeftCol ? 16 : isRightCol ? -16 : 0;

  // Distance between tile centers (px). Tile size is 54px.
  // 62px offset - 54px tile = 8px clean separation gap! No overlapping ever.
  const stepOffset = 62;

  const petals: Array<{
    dir: FlickDirection;
    char: string;
    romaji: string;
    label?: string;
    offsetX: number;
    offsetY: number;
  }> = [
    {
      dir: 'center',
      char: map.center,
      romaji: keyDef.romaji.center,
      label: isModifier ? 'Chạm' : 'A',
      offsetX: 0,
      offsetY: 0,
    },
    {
      dir: 'left',
      char: map.left,
      romaji: keyDef.romaji.left,
      label: isModifier ? 'Đục ゛' : 'I',
      offsetX: -stepOffset,
      offsetY: 0,
    },
    {
      dir: 'up',
      char: map.up,
      romaji: keyDef.romaji.up,
      label: isModifier ? 'Nhỏ 小' : 'U',
      offsetX: 0,
      offsetY: -stepOffset,
    },
    {
      dir: 'right',
      char: map.right,
      romaji: keyDef.romaji.right,
      label: isModifier ? 'Bán đục ゜' : 'E',
      offsetX: stepOffset,
      offsetY: 0,
    },
    {
      dir: 'down',
      char: map.down,
      romaji: keyDef.romaji.down,
      label: isModifier ? 'Đổi' : 'O',
      offsetX: 0,
      offsetY: stepOffset,
    },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center"
      style={{
        transform: containerShiftX ? `translateX(${containerShiftX}px)` : undefined,
      }}
    >
      {/* 5-way Cross Petals (iOS 27 Liquid Glass Style) */}
      <div className="relative w-full h-full flex items-center justify-center">
        {petals.map((petal) => {
          if (!petal.char || !petal.char.trim()) return null;

          const isActive = activeDirection === petal.dir;

          return (
            <div
              key={petal.dir}
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${petal.offsetX}px), calc(-50% + ${petal.offsetY}px)) scale(${
                  isActive ? 1.08 : 0.98
                })`,
              }}
              className={`absolute w-[54px] h-[54px] flex flex-col items-center justify-center rounded-2xl transition-all duration-100 ease-out select-none ${
                isActive
                  ? 'z-40 bg-white text-black font-extrabold shadow-[0_12px_28px_rgba(0,0,0,0.6)] ring-2 ring-white/90'
                  : 'z-20 bg-[#21232a]/95 text-neutral-100 border border-white/[0.12] shadow-xl backdrop-blur-2xl'
              }`}
            >
              {/* Kana Character */}
              <span
                className={`leading-none select-none tracking-tight ${
                  isModifier
                    ? 'text-xs font-bold'
                    : isPunctuation
                    ? 'text-xl font-bold'
                    : isActive
                    ? 'text-2xl font-bold'
                    : 'text-xl font-medium'
                }`}
              >
                {petal.char}
              </span>

              {/* Subtitle / Romaji vowel or modifier instruction */}
              {showRomaji && petal.label && (
                <span
                  className={`text-[9px] uppercase tracking-wider font-mono mt-1 leading-none select-none ${
                    isActive ? 'text-black/75 font-semibold' : 'text-neutral-400 font-medium'
                  }`}
                >
                  {isModifier ? petal.label : petal.romaji || petal.label}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

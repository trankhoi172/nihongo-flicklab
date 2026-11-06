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

  const petals: Array<{
    dir: FlickDirection;
    char: string;
    romaji: string;
    posClass: string;
    arrow: string;
  }> = [
    {
      dir: 'center',
      char: map.center,
      romaji: keyDef.romaji.center,
      posClass: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20',
      arrow: '●',
    },
    {
      dir: 'left',
      char: map.left,
      romaji: keyDef.romaji.left,
      posClass: 'top-1/2 -left-12 -translate-y-1/2 z-10',
      arrow: '←',
    },
    {
      dir: 'up',
      char: map.up,
      romaji: keyDef.romaji.up,
      posClass: '-top-12 left-1/2 -translate-x-1/2 z-10',
      arrow: '↑',
    },
    {
      dir: 'right',
      char: map.right,
      romaji: keyDef.romaji.right,
      posClass: 'top-1/2 -right-12 -translate-y-1/2 z-10',
      arrow: '→',
    },
    {
      dir: 'down',
      char: map.down,
      romaji: keyDef.romaji.down,
      posClass: '-bottom-12 left-1/2 -translate-x-1/2 z-10',
      arrow: '↓',
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-50 flex items-center justify-center animate-in fade-in zoom-in-95 duration-100">
      <div className="relative w-full h-full">
        {petals.map((petal) => {
          const isActive = activeDirection === petal.dir;
          if (!petal.char) return null;

          return (
            <div
              key={petal.dir}
              className={`absolute flex flex-col items-center justify-center rounded-xl transition-all duration-100 ${petal.posClass} ${
                isActive
                  ? 'w-14 h-14 bg-red-600 dark:bg-red-500 text-white shadow-xl scale-110 ring-4 ring-red-300/40 dark:ring-red-900/50'
                  : 'w-12 h-12 bg-white/95 dark:bg-stone-800/95 text-stone-800 dark:text-stone-100 shadow-md border border-stone-200/80 dark:border-stone-700/80 backdrop-blur-sm opacity-90'
              }`}
            >
              <span className={`font-bold leading-none ${isActive ? 'text-2xl' : 'text-lg'}`}>
                {petal.char}
              </span>
              {showRomaji && petal.romaji && petal.romaji.length <= 3 && (
                <span
                  className={`text-[9px] uppercase tracking-wider font-semibold mt-0.5 leading-none ${
                    isActive ? 'text-red-100' : 'text-stone-400 dark:text-stone-400'
                  }`}
                >
                  {petal.romaji}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

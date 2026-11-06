import React from 'react';
import type { PracticeMode } from '../../types/practice';
import { Settings as SettingsIcon, Flame, Keyboard } from 'lucide-react';

interface HeaderProps {
  currentMode: PracticeMode;
  streakDays: number;
  totalCharsTyped: number;
  onOpenSettings: () => void;
  onSelectMode: (mode: PracticeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakDays,
  totalCharsTyped,
  onOpenSettings,
  onSelectMode,
}) => {
  return (
    <header className="w-full border-b border-stone-200/80 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onSelectMode('dashboard')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-lg bg-red-600 dark:bg-red-500 text-white flex items-center justify-center font-bold text-base shadow-sm group-hover:scale-105 transition-transform">
            <span>あ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-900 dark:text-stone-100 text-base tracking-tight">
                Flick Lab
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 font-medium">
                日本語
              </span>
            </div>
            <p className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:block leading-none mt-0.5">
              Luyện gõ bàn phím 12 phím Kana
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 text-amber-700 dark:text-amber-300 text-xs font-semibold"
            title="Chuỗi ngày luyện tập liên tục"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays} ngày</span>
          </div>

          <div
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-xs font-medium"
            title="Tổng ký tự đã gõ"
          >
            <Keyboard className="w-3.5 h-3.5 text-stone-400" />
            <span>{totalCharsTyped.toLocaleString()} ký tự</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="Cài đặt (Settings)"
            aria-label="Cài đặt"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

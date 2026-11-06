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
    <header className="w-full border-b border-stone-800/80 bg-[#0B0C0E]/90 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onSelectMode('dashboard')}
          className="flex items-center gap-2.5 text-left group"
        >
          <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-base shadow-lg shadow-red-950/60 group-hover:scale-105 transition-transform">
            <span>あ</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">
                Flick Lab
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 font-semibold border border-stone-700/60">
                日本語
              </span>
            </div>
            <p className="text-[11px] text-stone-400 hidden sm:block leading-none mt-0.5 font-medium">
              Luyện gõ bàn phím 12 phím Kana chuẩn Nhật
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs font-bold"
            title="Chuỗi ngày luyện tập liên tục"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays} ngày</span>
          </div>

          <div
            className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-stone-850 text-stone-300 border border-stone-800 text-xs font-medium"
            title="Tổng ký tự đã gõ"
          >
            <Keyboard className="w-3.5 h-3.5 text-stone-400" />
            <span>{totalCharsTyped.toLocaleString()} ký tự</span>
          </div>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 border border-transparent hover:border-stone-700 transition-all"
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

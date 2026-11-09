import React from 'react';
import type { PracticeMode } from '../../types/practice';
import { Settings as SettingsIcon, Flame, Keyboard } from 'lucide-react';
import { FacebookIcon } from './Icons';
import logoImg from '../../assets/logo.png';

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
    <header className="w-full border-b border-white/[0.08] bg-[#0c0d10]/90 backdrop-blur-xl sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onSelectMode('dashboard')}
          className="flex items-center gap-2.5 text-left group"
        >
          <img
            src={logoImg}
            alt="TDK NIHONGO flicklab"
            className="w-8 h-8 rounded-xl object-contain bg-[#FAF9F6] p-0.5 shadow-sm group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">
                TDK <span className="font-normal text-xs uppercase tracking-wider text-neutral-300">NIHONGO</span>
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-neutral-300 font-medium border border-white/[0.08]">
                flicklab
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block leading-none mt-0.5 font-normal">
              Luyện gõ bàn phím 12 phím Kana chuẩn Nhật
            </p>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-neutral-200 text-xs font-semibold"
            title="Chuỗi ngày luyện tập liên tục"
          >
            <Flame className="w-3.5 h-3.5 text-neutral-300 fill-neutral-300" />
            <span>{streakDays} ngày</span>
          </div>

          <div
            className="hidden md:flex items-center gap-1 px-3 py-1 rounded-full bg-white/[0.04] text-neutral-300 border border-white/[0.06] text-xs font-medium"
            title="Tổng ký tự đã gõ"
          >
            <Keyboard className="w-3.5 h-3.5 text-neutral-400" />
            <span>{totalCharsTyped.toLocaleString()} ký tự</span>
          </div>

          <a
            href="https://facebook.com/@ronaldoGoatskibidi"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] text-neutral-400 hover:text-white border border-white/[0.06] hover:border-white/[0.12] text-xs font-medium transition-all group"
            title="Made by Tran Dang Khoi"
          >
            <FacebookIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#1877F2] transition-colors" />
            <span className="text-[11px]">
              Made by <strong className="font-semibold text-neutral-300 group-hover:text-white">Tran Dang Khoi</strong>
            </span>
          </a>

          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-white/[0.08] border border-transparent hover:border-white/[0.08] transition-all"
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

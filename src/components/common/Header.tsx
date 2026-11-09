import React from 'react';
import type { PracticeMode } from '../../types/practice';
import { Settings as SettingsIcon, Flame, Keyboard, Eye, EyeOff, Coffee } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  currentMode: PracticeMode;
  streakDays: number;
  totalCharsTyped: number;
  blindMode?: boolean;
  onToggleBlindMode?: () => void;
  onOpenSettings: () => void;
  onSelectMode: (mode: PracticeMode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  streakDays,
  totalCharsTyped,
  blindMode = false,
  onToggleBlindMode,
  onOpenSettings,
  onSelectMode,
}) => {
  return (
    <header className="w-full border-b border-neutral-800/80 bg-[#0B0C0E]/95 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
        {/* Brand identity */}
        <button
          onClick={() => onSelectMode('dashboard')}
          className="flex items-center gap-2.5 text-left group cursor-pointer"
        >
          <img
            src={logoImg}
            alt="TDK NIHONGO"
            className="w-7 h-7 rounded-lg object-contain bg-[#FAF9F6] p-0.5 shadow-xs group-hover:opacity-90 transition-opacity"
          />
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-white text-sm tracking-tight font-sans">
              TDK NIHONGO
            </span>
            <span className="text-[10px] font-mono text-neutral-400 lowercase tracking-wider">
              flicklab
            </span>
          </div>
        </button>

        {/* Right utility toolbar */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs">
          {/* Subtle streak & character metrics */}
          <div className="hidden sm:flex items-center gap-3 text-neutral-400 font-mono text-[11px] pr-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3 text-neutral-400" />
              <strong className="text-neutral-200 font-medium">{streakDays}</strong>d
            </span>
            <span className="text-neutral-600">•</span>
            <span className="flex items-center gap-1">
              <Keyboard className="w-3 h-3 text-neutral-400" />
              <strong className="text-neutral-200 font-medium">{totalCharsTyped.toLocaleString()}</strong>
            </span>
          </div>

          {/* Ko-fi Support Button */}
          <a
            href="https://ko-fi.com/A0A61LIKK9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-neutral-300 hover:text-white bg-white/[0.04] hover:bg-[#5b8de3]/20 border border-neutral-800 hover:border-[#5b8de3]/40 transition-colors"
            title="Ủng hộ tui nhé trên Ko-fi"
          >
            <Coffee className="w-3.5 h-3.5 text-[#5b8de3]" />
            <span className="hidden sm:inline">Ủng hộ tui nhé</span>
          </a>

          {/* Blind Mode Toggle */}
          {onToggleBlindMode && (
            <button
              onClick={onToggleBlindMode}
              className={`p-1.5 rounded-md border transition-colors cursor-pointer ${
                blindMode
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'text-neutral-400 hover:text-white border-transparent hover:border-neutral-800 hover:bg-white/[0.04]'
              }`}
              title={blindMode ? 'Đang bật Gõ mù (Click để hiện phím)' : 'Bật chế độ Gõ mù (Blind Flick)'}
              aria-label="Chế độ gõ mù"
            >
              {blindMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}

          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-md text-neutral-400 hover:text-white hover:bg-white/[0.04] border border-transparent hover:border-neutral-800 transition-colors cursor-pointer"
            title="Cài đặt (Settings)"
            aria-label="Cài đặt"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};

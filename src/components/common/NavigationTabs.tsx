import React from 'react';
import type { PracticeMode } from '../../types/practice';
import {
  LayoutDashboard,
  GraduationCap,
  Sparkles,
  BookOpen,
  Timer,
  Edit3,
  BarChart3,
  Compass,
  Gamepad2,
} from 'lucide-react';

interface NavigationTabsProps {
  currentMode: PracticeMode;
  onSelectMode: (mode: PracticeMode) => void;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const tabs: Array<{
    id: PracticeMode;
    label: string;
    sub: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'dashboard',
      label: 'Tổng quan',
      sub: 'ホーム',
      icon: <LayoutDashboard className="w-4 h-4" />,
    },
    {
      id: 'curriculum',
      label: 'Giáo trình',
      sub: 'カリキュラム',
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: 'tutorial',
      label: 'Bố cục 12 phím',
      sub: '基本ガイド',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'flick',
      label: 'Luyện Kana',
      sub: 'フリック練習',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'word',
      label: 'Từ vựng',
      sub: '単語練習',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'challenge',
      label: 'Thử thách',
      sub: 'タイムアタック',
      icon: <Timer className="w-4 h-4" />,
    },
    {
      id: 'minigame',
      label: 'Minigame',
      sub: '雨の降下',
      icon: <Gamepad2 className="w-4 h-4" />,
    },
    {
      id: 'free',
      label: 'Gõ tự do',
      sub: '自由入力',
      icon: <Edit3 className="w-4 h-4" />,
    },
    {
      id: 'progress',
      label: 'Tiến trình',
      sub: '上達記録',
      icon: <BarChart3 className="w-4 h-4" />,
    },
  ];

  return (
    <nav className="w-full bg-[#0D0E13] border-b border-stone-800 overflow-x-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-2 flex items-center justify-start sm:justify-center gap-1 sm:gap-1.5 py-1.5 min-w-max">
        {tabs.map((tab) => {
          const isActive = currentMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectMode(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-stone-800/90 text-red-400 font-bold shadow-xs border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-850'
              }`}
            >
              {tab.icon}
              <div className="flex flex-col items-start leading-tight">
                <span>{tab.label}</span>
                <span className="text-[9px] opacity-60 font-normal hidden md:inline">
                  {tab.sub}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

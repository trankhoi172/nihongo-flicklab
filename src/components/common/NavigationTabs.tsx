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
      icon: <LayoutDashboard className="w-3.5 h-3.5" />,
    },
    {
      id: 'curriculum',
      label: 'Giáo trình',
      sub: 'カリキュラム',
      icon: <Compass className="w-3.5 h-3.5" />,
    },
    {
      id: 'tutorial',
      label: 'Bố cục 12 phím',
      sub: '基本ガイド',
      icon: <GraduationCap className="w-3.5 h-3.5" />,
    },
    {
      id: 'flick',
      label: 'Luyện Kana',
      sub: 'フリック',
      icon: <Sparkles className="w-3.5 h-3.5" />,
    },
    {
      id: 'word',
      label: 'Từ vựng',
      sub: '単語',
      icon: <BookOpen className="w-3.5 h-3.5" />,
    },
    {
      id: 'challenge',
      label: 'Thử thách',
      sub: '速度',
      icon: <Timer className="w-3.5 h-3.5" />,
    },
    {
      id: 'minigame',
      label: 'Minigame',
      sub: '降下',
      icon: <Gamepad2 className="w-3.5 h-3.5" />,
    },
    {
      id: 'free',
      label: 'Gõ tự do',
      sub: '自由',
      icon: <Edit3 className="w-3.5 h-3.5" />,
    },
    {
      id: 'progress',
      label: 'Tiến trình',
      sub: '記録',
      icon: <BarChart3 className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <nav className="w-full bg-[#0B0C0E] border-b border-neutral-800/80 overflow-x-auto no-scrollbar">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-1 sm:gap-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = currentMode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectMode(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all relative cursor-pointer border-b-2 ${
                isActive
                  ? 'border-white text-white font-semibold'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:border-neutral-700'
              }`}
            >
              <span className={isActive ? 'text-white' : 'text-neutral-500'}>
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              <span className={`text-[10px] font-normal font-sans ml-0.5 ${isActive ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {tab.sub}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React from 'react';
import type { PracticeMode, UserProgress } from '../../types/practice';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Timer,
  Edit3,
  BarChart3,
  Flame,
  ArrowRight,
  Compass,
  Trophy,
  Zap,
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectMode: (mode: PracticeMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, onSelectMode }) => {
  const modes: Array<{
    id: PracticeMode;
    title: string;
    japanese: string;
    desc: string;
    icon: React.ReactNode;
    color: string;
    badge?: string;
  }> = [
    {
      id: 'tutorial',
      title: 'Học bố cục',
      japanese: '基本ガイド',
      desc: 'Hướng dẫn tương tác trực quan về quy tắc vuốt 5 nguyên âm cho người mới bắt đầu.',
      icon: <GraduationCap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      color: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
      badge: 'Bắt đầu tại đây',
    },
    {
      id: 'flick',
      title: 'Luyện gõ Kana',
      japanese: 'フリック練習',
      desc: 'Rèn luyện phản xạ từng chữ cái theo hàng (あ, か, さ...) kèm độ trễ phản hồi ms.',
      icon: <Sparkles className="w-5 h-5 text-red-600 dark:text-red-400" />,
      color: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/60',
      badge: 'Cốt lõi',
    },
    {
      id: 'word',
      title: 'Luyện từ vựng',
      japanese: '単語練習',
      desc: 'Gõ từ vựng tiếng Nhật thông dụng kèm giải nghĩa tiếng Việt và tiến trình từng âm tiết.',
      icon: <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      color: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
    },
    {
      id: 'challenge',
      title: 'Thử thách tốc độ',
      japanese: 'タイムアタック',
      desc: 'Kiểm tra tốc độ 30s hoặc 60s, tính CPM (ký tự/phút) và xếp hạng danh hiệu.',
      icon: <Timer className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      color: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
      badge: progress.bestCPM > 0 ? `Kỷ lục: ${progress.bestCPM} CPM` : undefined,
    },
    {
      id: 'free',
      title: 'Gõ tự do (Sandbox)',
      japanese: '自由入力',
      desc: 'Bàn phím đầy đủ như điện thoại thật để thử nghiệm gõ câu tùy ý và sao chép văn bản.',
      icon: <Edit3 className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />,
      color: 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-200 dark:border-cyan-800/60',
    },
    {
      id: 'progress',
      title: 'Bản đồ thành thạo',
      japanese: '上達記録',
      desc: 'Bảng nhiệt (Heatmap) theo dõi tỉ lệ làm chủ từng hàng chữ và thống kê chi tiết.',
      icon: <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      color: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800/60',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-stone-900 via-stone-800 to-stone-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-semibold backdrop-blur-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Phương pháp gõ điện thoại chuẩn Nhật Bản</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Làm chủ bàn phím 12 phím Kana bằng phản xạ ngón tay
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Chỉ với 12 ô phím, bạn có thể gõ toàn bộ hệ thống Kana tiếng Nhật bằng thao tác chạm và vuốt 4 hướng trực quan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectMode('tutorial')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg shadow-red-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Học bố cục phím ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectMode('flick')}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-sm border border-stone-700 hover:scale-[1.02] transition-all"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Luyện phản xạ Kana</span>
            </button>
          </div>
        </div>

        <div className="absolute right-4 bottom-2 sm:right-8 sm:bottom-4 opacity-10 sm:opacity-20 pointer-events-none select-none text-right">
          <div className="text-8xl sm:text-9xl font-bold font-serif leading-none tracking-tighter">
            あ
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Chuỗi ngày</span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {progress.currentStreakDays} <span className="text-xs font-normal text-stone-400">ngày</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Ký tự đã gõ</span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {progress.totalCharsTyped.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tốc độ đỉnh cao</span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {progress.bestCPM} <span className="text-xs font-normal text-stone-400">CPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-500 text-xs font-medium">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Từ đã hoàn thành</span>
          </div>
          <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {progress.completedWordIds.length} <span className="text-xs font-normal text-stone-400">từ</span>
          </div>
        </div>
      </div>

      {/* 5-Direction Flick Principle Card */}
      <div className="p-5 rounded-3xl bg-amber-50/70 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
              💡
            </div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100">
              Quy tắc vàng 5 hướng vuốt của người Nhật (5母音の法則)
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-500">A - I - U - E - O</span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
            <div className="text-stone-400 text-base font-bold">● Chạm</div>
            <div className="text-stone-800 dark:text-stone-100 font-bold text-sm mt-0.5">Cột A</div>
            <div className="text-[11px] text-stone-500 font-mono">あ・か・さ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
            <div className="text-red-500 text-base font-bold">← Trái</div>
            <div className="text-stone-800 dark:text-stone-100 font-bold text-sm mt-0.5">Cột I</div>
            <div className="text-[11px] text-stone-500 font-mono">い・き・し</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
            <div className="text-red-500 text-base font-bold">↑ Trên</div>
            <div className="text-stone-800 dark:text-stone-100 font-bold text-sm mt-0.5">Cột U</div>
            <div className="text-[11px] text-stone-500 font-mono">う・く・す</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
            <div className="text-red-500 text-base font-bold">→ Phải</div>
            <div className="text-stone-800 dark:text-stone-100 font-bold text-sm mt-0.5">Cột E</div>
            <div className="text-[11px] text-stone-500 font-mono">え・け・せ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700/80 shadow-2xs">
            <div className="text-red-500 text-base font-bold">↓ Dưới</div>
            <div className="text-stone-800 dark:text-stone-100 font-bold text-sm mt-0.5">Cột O</div>
            <div className="text-[11px] text-stone-500 font-mono">お・こ・そ</div>
          </div>
        </div>
      </div>

      {/* Modes Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
          Chế độ luyện tập (トレーニングモード)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className="text-left p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md hover:border-red-400 dark:hover:border-red-500 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl ${mode.color} border`}>
                    {mode.icon}
                  </div>
                  {mode.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                      {mode.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {mode.title}
                    </h3>
                    <span className="text-xs text-stone-400 font-medium">
                      {mode.japanese}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
                    {mode.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end text-xs font-semibold text-stone-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors gap-1">
                <span>Vào luyện tập</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

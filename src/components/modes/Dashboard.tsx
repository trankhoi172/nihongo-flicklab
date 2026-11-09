import React from 'react';
import type { PracticeMode, UserProgress } from '../../types/practice';
import { CURRICULUM_MODULES } from '../../constants/curriculum';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Timer,
  Edit3,
  Flame,
  ArrowRight,
  Compass,
  Trophy,
  Zap,
  CheckCircle2,
  Gamepad2,
  Lightbulb,
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectMode: (mode: PracticeMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, onSelectMode }) => {
  const totalLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons).length;
  const completedLessons = progress.completedLessonIds?.length || 0;

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
      id: 'curriculum',
      title: 'Giáo trình Toàn diện',
      japanese: '完全カリキュラム',
      desc: '8 học phần, 27 bài học từ cơ bản đến nâng cao bao quát 100% quy tắc gõ Kana.',
      icon: <Compass className="w-5 h-5 text-red-400" />,
      color: 'bg-red-950/40 border-red-800/80',
      badge: `${completedLessons}/${totalLessons} bài`,
    },
    {
      id: 'tutorial',
      title: 'Bố cục 12 phím',
      japanese: '基本ガイド',
      desc: 'Hướng dẫn trực quan từng hàng phím (あ行 → か行) kèm sơ đồ hoa 5 cánh tương tác.',
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
      color: 'bg-indigo-950/40 border-indigo-800/80',
    },
    {
      id: 'flick',
      title: 'Luyện gõ Kana',
      japanese: 'フリック練習',
      desc: 'Rèn luyện phản xạ từng chữ cái theo hàng kèm độ trễ phản hồi (ms) và chuỗi combo.',
      icon: <Sparkles className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-950/40 border-amber-800/80',
      badge: 'Cốt lõi',
    },
    {
      id: 'word',
      title: 'Luyện từ vựng',
      japanese: '単語練習',
      desc: 'Gõ từ vựng tiếng Nhật thực tế kèm giải nghĩa tiếng Việt và tiến trình từng âm tiết.',
      icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
      color: 'bg-emerald-950/40 border-emerald-800/80',
    },
    {
      id: 'challenge',
      title: 'Thử thách tốc độ',
      japanese: 'タイムアタック',
      desc: 'Kiểm tra tốc độ 30s hoặc 60s, tính CPM (ký tự/phút) và xếp hạng danh hiệu S/A/B/C/D.',
      icon: <Timer className="w-5 h-5 text-rose-400" />,
      color: 'bg-rose-950/40 border-rose-800/80',
      badge: progress.bestCPM > 0 ? `Kỷ lục: ${progress.bestCPM} CPM` : undefined,
    },
    {
      id: 'minigame',
      title: 'Mưa chữ Kana (Minigame)',
      japanese: '雨の降下ゲーム',
      desc: 'Bắn hạ các ký tự và từ vựng đang rơi trước khi chạm tia đỏ, duy trì combo rực rỡ và lập kỷ lục!',
      icon: <Gamepad2 className="w-5 h-5 text-amber-400" />,
      color: 'bg-amber-950/40 border-amber-800/80',
      badge: (progress.minigameHighScore || 0) > 0 ? `Kỷ lục: ${progress.minigameHighScore} PTS` : 'Mới',
    },
    {
      id: 'free',
      title: 'Gõ tự do (Sandbox)',
      japanese: '自由入力',
      desc: 'Bàn phím đầy đủ như điện thoại thật để thử nghiệm câu văn tùy ý và sao chép văn bản.',
      icon: <Edit3 className="w-5 h-5 text-cyan-400" />,
      color: 'bg-cyan-950/40 border-cyan-800/80',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#14161D] border border-stone-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 text-red-300 border border-red-800/80 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Phương pháp gõ điện thoại chuẩn Nhật Bản</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
            Làm chủ bàn phím 12 phím Kana bằng phản xạ ngón tay
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Chỉ với 12 ô phím, bạn có thể gõ toàn bộ hệ thống tiếng Nhật bằng thao tác chạm và vuốt 4 hướng trực quan.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onSelectMode('curriculum')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm shadow-md active:scale-95 transition-all"
            >
              <span>Vào học giáo trình chuẩn</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelectMode('flick')}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white/[0.06] hover:bg-white/[0.1] text-neutral-200 font-semibold text-sm border border-white/[0.08] active:scale-95 transition-all"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Luyện phản xạ nhanh</span>
            </button>
          </div>
        </div>

        {/* Decorative Graphic Element */}
        <div className="absolute right-4 bottom-2 sm:right-8 sm:bottom-4 opacity-10 pointer-events-none select-none text-right">
          <div className="text-8xl sm:text-9xl font-bold font-serif leading-none tracking-tighter text-white">
            あ
          </div>
        </div>
      </div>

      {/* Quick Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Chuỗi ngày</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {progress.currentStreakDays} <span className="text-xs font-normal text-stone-400">ngày</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Ký tự đã gõ</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {progress.totalCharsTyped.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Tốc độ đỉnh cao</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {progress.bestCPM} <span className="text-xs font-normal text-stone-400">CPM</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-2 text-stone-400 text-xs font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Bài học đã qua</span>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {completedLessons} / {totalLessons}
          </div>
        </div>
      </div>

      {/* 5-Direction Flick Principle Card (Visual Explainer) */}
      <div className="p-5 rounded-3xl bg-[#14161D] border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-white/[0.08] text-white border border-white/[0.1] flex items-center justify-center text-xs">
              <Lightbulb className="w-3.5 h-3.5 text-neutral-300" />
            </div>
            <h2 className="text-sm font-bold text-white">
              Quy tắc vàng 5 hướng vuốt của người Nhật (5母音の法則)
            </h2>
          </div>
          <span className="text-xs font-mono text-stone-400">A - I - U - E - O</span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-xl bg-stone-850 border border-stone-750 shadow-2xs">
            <div className="text-stone-400 text-base font-bold">● Chạm</div>
            <div className="text-white font-bold text-sm mt-0.5">Cột A</div>
            <div className="text-[11px] text-stone-400 font-mono">あ・か・さ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-850 border border-stone-750 shadow-2xs">
            <div className="text-red-400 text-base font-bold">← Trái</div>
            <div className="text-white font-bold text-sm mt-0.5">Cột I</div>
            <div className="text-[11px] text-stone-400 font-mono">い・き・し</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-850 border border-stone-750 shadow-2xs">
            <div className="text-red-400 text-base font-bold">↑ Trên</div>
            <div className="text-white font-bold text-sm mt-0.5">Cột U</div>
            <div className="text-[11px] text-stone-400 font-mono">う・く・す</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-850 border border-stone-750 shadow-2xs">
            <div className="text-red-400 text-base font-bold">→ Phải</div>
            <div className="text-white font-bold text-sm mt-0.5">Cột E</div>
            <div className="text-[11px] text-stone-400 font-mono">え・け・せ</div>
          </div>
          <div className="p-2.5 rounded-xl bg-stone-850 border border-stone-750 shadow-2xs">
            <div className="text-red-400 text-base font-bold">↓ Dưới</div>
            <div className="text-white font-bold text-sm mt-0.5">Cột O</div>
            <div className="text-[11px] text-stone-400 font-mono">お・こ・そ</div>
          </div>
        </div>
      </div>

      {/* Modes Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">
          Chế độ luyện tập (トレーニングモード)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {modes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id)}
              className="text-left p-5 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xs hover:shadow-lg hover:border-red-500/80 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-2xl ${mode.color} border`}>
                    {mode.icon}
                  </div>
                  {mode.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950/60 text-red-300 border border-red-800">
                      {mode.badge}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                      {mode.title}
                    </h3>
                    <span className="text-xs text-stone-400 font-medium">
                      {mode.japanese}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
                    {mode.desc}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end text-xs font-semibold text-stone-400 group-hover:text-red-400 transition-colors gap-1">
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

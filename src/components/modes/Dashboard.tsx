import React from 'react';
import type { PracticeMode, UserProgress } from '../../types/practice';
import { CURRICULUM_MODULES } from '../../constants/curriculum';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Timer,
  Edit3,
  ArrowRight,
  Compass,
  Gamepad2,
} from 'lucide-react';

interface DashboardProps {
  progress: UserProgress;
  onSelectMode: (mode: PracticeMode) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ progress, onSelectMode }) => {
  const totalLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons).length;
  const completedLessons = progress.completedLessonIds?.length || 0;

  const disciplines: Array<{
    id: PracticeMode;
    index: string;
    title: string;
    japanese: string;
    desc: string;
    icon: React.ReactNode;
    metric?: string;
  }> = [
    {
      id: 'curriculum',
      index: '01',
      title: 'Giáo trình Toàn diện',
      japanese: '完全カリキュラム',
      desc: '8 học phần, 27 bài học từ cơ bản đến nâng cao bao quát 100% quy tắc gõ Kana.',
      icon: <Compass className="w-4 h-4" />,
      metric: `${completedLessons}/${totalLessons} bài hoàn thành`,
    },
    {
      id: 'tutorial',
      index: '02',
      title: 'Bố cục 12 phím',
      japanese: '基本ガイド',
      desc: 'Hướng dẫn trực quan từng hàng phím (あ行 → か行) kèm sơ đồ hoa 5 cánh tương tác.',
      icon: <GraduationCap className="w-4 h-4" />,
    },
    {
      id: 'flick',
      index: '03',
      title: 'Luyện phản xạ Kana',
      japanese: 'フリック練習',
      desc: 'Rèn luyện phản xạ từng chữ cái theo hàng kèm độ trễ phản hồi (ms) và chuỗi combo.',
      icon: <Sparkles className="w-4 h-4" />,
      metric: 'Cốt lõi phản xạ',
    },
    {
      id: 'word',
      index: '04',
      title: 'Luyện từ vựng',
      japanese: '単語練習',
      desc: 'Gõ từ vựng tiếng Nhật thực tế kèm giải nghĩa tiếng Việt và tiến trình từng âm tiết.',
      icon: <BookOpen className="w-4 h-4" />,
      metric: `${progress.completedWordIds.length} từ đã học`,
    },
    {
      id: 'challenge',
      index: '05',
      title: 'Thử thách tốc độ',
      japanese: 'タイムアタック',
      desc: 'Kiểm tra tốc độ 30s hoặc 60s, tính CPM (ký tự/phút) và xếp hạng danh hiệu S/A/B/C/D.',
      icon: <Timer className="w-4 h-4" />,
      metric: progress.bestCPM > 0 ? `Kỷ lục: ${progress.bestCPM} CPM` : undefined,
    },
    {
      id: 'minigame',
      index: '06',
      title: 'Mưa chữ Kana (Minigame)',
      japanese: '雨の降下ゲーム',
      desc: 'Bắn hạ các ký tự và từ vựng đang rơi trước khi chạm đáy, duy trì combo và lập kỷ lục.',
      icon: <Gamepad2 className="w-4 h-4" />,
      metric: (progress.minigameHighScore || 0) > 0 ? `Kỷ lục: ${progress.minigameHighScore} PTS` : undefined,
    },
    {
      id: 'free',
      index: '07',
      title: 'Gõ tự do (Sandbox)',
      japanese: '自由入力',
      desc: 'Bàn phím 12 phím đầy đủ để thử nghiệm câu văn tùy ý và sao chép văn bản tiếng Nhật.',
      icon: <Edit3 className="w-4 h-4" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-12 animate-in fade-in duration-150">
      {/* Editorial Hero Section */}
      <section className="space-y-4 pt-2">
        <div className="text-[11px] font-mono text-neutral-400 tracking-wider uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block" />
          <span>日本語フリック入力 • PHẢN XẠ 12 PHÍM KANA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
          Làm chủ bàn phím Kana bằng phản xạ ngón tay tự nhiên.
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed font-normal">
          Chỉ với 12 ô phím, bạn có thể gõ toàn bộ hệ thống Hiragana, Katakana và biến âm.
          Áp dụng quy tắc 5 nguyên âm để ngón cái tự động ghi nhớ vị trí mà không cần nhìn phím.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectMode('curriculum')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-black font-semibold text-xs tracking-wide transition-colors cursor-pointer"
          >
            <span>Vào học giáo trình chuẩn</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onSelectMode('flick')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-neutral-800 hover:border-neutral-600 text-neutral-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <span>Luyện phản xạ nhanh</span>
          </button>
        </div>
      </section>

      {/* Swiss-Style Performance Data Strip */}
      <section className="border-y border-neutral-850 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              01 • Chuỗi ngày
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-light tracking-tight text-white">
                {progress.currentStreakDays}
              </span>
              <span className="text-xs text-neutral-500 font-mono">ngày</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              02 • Ký tự đã gõ
            </div>
            <div className="mt-1">
              <span className="text-3xl font-light tracking-tight text-white">
                {progress.totalCharsTyped.toLocaleString()}
              </span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              03 • Tốc độ cao nhất
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-light tracking-tight text-white">
                {progress.bestCPM}
              </span>
              <span className="text-xs text-neutral-500 font-mono">CPM</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase text-neutral-500 tracking-wider">
              04 • Tiến độ giáo trình
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-light tracking-tight text-white">
                {completedLessons}
              </span>
              <span className="text-xs text-neutral-500 font-mono">/ {totalLessons} bài</span>
            </div>
          </div>
        </div>
      </section>

      {/* Five-Vowel Principle (5母音の法則) — Clean Editorial Guide */}
      <section className="space-y-4">
        <div className="flex items-baseline justify-between border-b border-neutral-850 pb-2">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Quy tắc 5 nguyên âm (5母音の法則)
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              5 hướng vuốt tương ứng 5 nguyên âm cốt lõi của tiếng Nhật: A - I - U - E - O
            </p>
          </div>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            A • I • U • E • O
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div className="py-3 px-2 border-b-2 border-neutral-700 bg-white/[0.02]">
            <div className="text-[10px] font-mono uppercase text-neutral-400">● Chạm tâm</div>
            <div className="text-base font-semibold text-white mt-1">Cột A</div>
            <div className="text-[11px] text-neutral-400 font-sans mt-0.5">あ・か・さ</div>
          </div>

          <div className="py-3 px-2 border-b-2 border-neutral-700 bg-white/[0.02]">
            <div className="text-[10px] font-mono uppercase text-neutral-400">← Trái</div>
            <div className="text-base font-semibold text-white mt-1">Cột I</div>
            <div className="text-[11px] text-neutral-400 font-sans mt-0.5">い・き・し</div>
          </div>

          <div className="py-3 px-2 border-b-2 border-neutral-700 bg-white/[0.02]">
            <div className="text-[10px] font-mono uppercase text-neutral-400">↑ Lên trên</div>
            <div className="text-base font-semibold text-white mt-1">Cột U</div>
            <div className="text-[11px] text-neutral-400 font-sans mt-0.5">う・く・す</div>
          </div>

          <div className="py-3 px-2 border-b-2 border-neutral-700 bg-white/[0.02]">
            <div className="text-[10px] font-mono uppercase text-neutral-400">→ Phải</div>
            <div className="text-base font-semibold text-white mt-1">Cột E</div>
            <div className="text-[11px] text-neutral-400 font-sans mt-0.5">え・け・せ</div>
          </div>

          <div className="py-3 px-2 border-b-2 border-neutral-700 bg-white/[0.02]">
            <div className="text-[10px] font-mono uppercase text-neutral-400">↓ Dưới</div>
            <div className="text-base font-semibold text-white mt-1">Cột O</div>
            <div className="text-[11px] text-neutral-400 font-sans mt-0.5">お・こ・そ</div>
          </div>
        </div>
      </section>

      {/* Editorial Disciplines Catalog / Index */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between border-b border-neutral-850 pb-2">
          <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
            Danh mục chế độ luyện tập (練習科目)
          </h2>
          <span className="text-[10px] font-mono text-neutral-500 uppercase">
            07 Chuyên đề
          </span>
        </div>

        <div className="divide-y divide-neutral-850 border-b border-neutral-850">
          {disciplines.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectMode(item.id)}
              className="w-full text-left py-4 px-2 hover:bg-white/[0.02] transition-colors flex items-center justify-between gap-4 group cursor-pointer"
            >
              <div className="flex items-start gap-4 sm:gap-6 min-w-0">
                <span className="text-xs font-mono text-neutral-500 pt-0.5 shrink-0">
                  {item.index}
                </span>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="text-sm sm:text-base font-semibold text-white group-hover:text-red-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="text-xs text-neutral-500 font-normal">
                      {item.japanese}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed truncate max-w-xl">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {item.metric && (
                  <span className="hidden sm:inline-block text-[11px] font-mono text-neutral-400 bg-white/[0.04] px-2 py-0.5 rounded border border-neutral-800">
                    {item.metric}
                  </span>
                )}
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};

import React from 'react';
import type { UserProgress } from '../../types/practice';
import { KEYBOARD_LAYOUT } from '../../constants/keyboardLayout';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { CURRICULUM_MODULES } from '../../constants/curriculum';
import { BookOpen, CheckCircle2, Gamepad2 } from 'lucide-react';

interface ProgressModeProps {
  progress: UserProgress;
}

export const ProgressMode: React.FC<ProgressModeProps> = ({ progress }) => {
  const wordsTotal = VOCABULARY_LIST.length;
  const wordsLearned = progress.completedWordIds.length;

  const totalLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons).length;
  const lessonsLearned = progress.completedLessonIds?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 space-y-6 animate-in fade-in duration-150">
      <div>
        <div className="text-[11px] font-mono tracking-widest text-neutral-400 uppercase">
          Thống kê học tập
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mt-1">
          Tiến trình & Bản đồ thành thạo (上達記録)
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Theo dõi mức độ phản xạ cơ bắp trên từng hàng phím Kana và lịch sử luyện tập cá nhân.
        </p>
      </div>

      {/* Top 4 Key Performance Indicators - Swiss Editorial Strip */}
      <div className="border-y border-neutral-800 py-3 grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-neutral-800 text-left">
        <div className="py-2 sm:py-0 sm:px-4 first:pl-0">
          <div className="text-[11px] font-mono text-neutral-400 tracking-wider">01. CHUỖI LIÊN TỤC</div>
          <div className="text-2xl font-bold text-neutral-100 font-mono mt-1">
            {progress.currentStreakDays}{' '}
            <span className="text-xs font-normal text-neutral-400 font-sans">ngày</span>
          </div>
        </div>

        <div className="py-2 sm:py-0 sm:px-4">
          <div className="text-[11px] font-mono text-neutral-400 tracking-wider">02. KÝ TỰ ĐÃ GÕ</div>
          <div className="text-2xl font-bold text-neutral-100 font-mono mt-1">
            {progress.totalCharsTyped.toLocaleString()}
          </div>
        </div>

        <div className="py-2 sm:py-0 sm:px-4">
          <div className="text-[11px] font-mono text-neutral-400 tracking-wider">03. ĐỘ CHÍNH XÁC</div>
          <div className="text-2xl font-bold text-neutral-100 font-mono mt-1">
            {progress.overallAccuracy}%
          </div>
        </div>

        <div className="py-2 sm:py-0 sm:px-4 last:pr-0">
          <div className="text-[11px] font-mono text-neutral-400 tracking-wider">04. KỶ LỤC TỐC ĐỘ</div>
          <div className="text-2xl font-bold text-neutral-100 font-mono mt-1">
            {progress.bestCPM}{' '}
            <span className="text-xs font-normal text-neutral-400 font-mono">CPM</span>
          </div>
        </div>
      </div>

      {/* Curriculum Mastery Card */}
      <div className="p-5 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-neutral-100">
              Tiến độ hoàn thành giáo trình
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-300">
            {lessonsLearned} / {totalLessons} bài ({Math.round((lessonsLearned / totalLessons) * 100)}%)
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-neutral-100 transition-all duration-500"
            style={{ width: `${(lessonsLearned / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Kana Rows Mastery Grid / Heatmap */}
      <div className="p-5 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-100">
            Mức độ làm chủ theo hàng phím (行ごとの習熟度)
          </h3>
          <span className="text-xs text-neutral-400">
            Dựa trên số lượt gõ và tỉ lệ chính xác
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {KEYBOARD_LAYOUT.map((keyDef) => {
            const mastery = progress.rowMastery[keyDef.id];
            const attempts = mastery?.attempts || 0;
            const accuracy = mastery?.accuracy || 0;
            const avgMs = mastery?.avgTimeMs || 0;

            const isMastered = attempts >= 8 && accuracy >= 85;
            const isProficient = attempts >= 4 && accuracy >= 70;
            const isStarted = attempts > 0;

            return (
              <div
                key={keyDef.id}
                className="p-3 rounded-lg bg-[#0B0C0E] border border-neutral-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-md bg-[#16171B] border border-neutral-800 flex items-center justify-center font-medium text-base text-neutral-100">
                    {keyDef.hiragana.center}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-neutral-200">
                      {keyDef.rowName}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                      {keyDef.hiragana.center}・{keyDef.hiragana.left}・{keyDef.hiragana.up}・
                      {keyDef.hiragana.right}・{keyDef.hiragana.down}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isMastered ? (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-200 text-[10px] font-mono border border-neutral-700">
                      Thành thạo
                    </span>
                  ) : isProficient ? (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-300 text-[10px] font-mono border border-neutral-800">
                      Khá tốt ({accuracy}%)
                    </span>
                  ) : isStarted ? (
                    <span className="px-2 py-0.5 rounded-md bg-neutral-900 text-neutral-400 text-[10px] font-mono border border-neutral-800">
                      Đang luyện ({accuracy}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-neutral-500 font-mono">Chưa luyện</span>
                  )}
                  {attempts > 0 && (
                    <div className="text-[10px] text-neutral-400 font-mono mt-1">
                      {attempts} lượt • {avgMs}ms
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Vocabulary Mastery Progress */}
      <div className="p-5 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-neutral-300" />
            <h3 className="text-sm font-semibold text-neutral-100">
              Vốn từ vựng đã gõ thành công
            </h3>
          </div>
          <span className="text-xs font-mono text-neutral-300">
            {wordsLearned} / {wordsTotal} từ ({Math.round((wordsLearned / wordsTotal) * 100)}%)
          </span>
        </div>

        <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
          <div
            className="h-full bg-neutral-100 transition-all duration-500"
            style={{ width: `${(wordsLearned / wordsTotal) * 100}%` }}
          />
        </div>
      </div>

      {/* Minigame Achievement Card */}
      {((progress.minigameGamesPlayed || 0) > 0 || (progress.minigameHighScore || 0) > 0) && (
        <div className="p-5 rounded-xl bg-[#111216] border border-neutral-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-[#0B0C0E] text-neutral-300 border border-neutral-800 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-neutral-100 flex items-center gap-2">
                <span>Thành tích Mưa Chữ Kana (Minigame)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#16171B] text-neutral-400 border border-neutral-800">Arcade</span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                <span>Đã chơi {progress.minigameGamesPlayed || 0} trận</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span>Combo tối đa:</span>
                  <strong className="text-neutral-200">{progress.minigameMaxCombo || 0}</strong>
                </span>
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] text-neutral-500 uppercase font-mono">Điểm cao nhất</div>
            <div className="text-xl font-bold text-neutral-100 font-mono">
              {(progress.minigameHighScore || 0).toLocaleString()} <span className="text-xs text-neutral-400 font-normal">PTS</span>
            </div>
          </div>
        </div>
      )}

      {/* Speed Challenge History */}
      {progress.challengeHistory && progress.challengeHistory.length > 0 && (
        <div className="p-5 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-neutral-100">
              Lịch sử thử thách tốc độ gần nhất
            </h3>
            <span className="text-xs font-mono text-neutral-400">
              {progress.challengeHistory.length} phiên đã lưu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400 font-mono text-[11px] pb-2">
                  <th className="py-2">Thời gian</th>
                  <th className="py-2">Chế độ</th>
                  <th className="py-2">Tốc độ CPM</th>
                  <th className="py-2">Độ chính xác</th>
                  <th className="py-2 text-right">Xếp hạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {progress.challengeHistory.map((item, idx) => (
                  <tr key={idx} className="text-neutral-300">
                    <td className="py-2.5 font-mono text-[11px] text-neutral-400">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 font-medium">
                      {item.durationSeconds}s ({item.mode === 'kana' ? 'Kana' : 'Từ vựng'})
                    </td>
                    <td className="py-2.5 font-mono font-semibold text-neutral-100">
                      {item.cpm} CPM
                    </td>
                    <td className="py-2.5 font-mono">{item.accuracy}%</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-md font-mono font-medium bg-[#16171B] border border-neutral-800 text-neutral-200 text-[10px]">
                        Hạng {item.rank}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

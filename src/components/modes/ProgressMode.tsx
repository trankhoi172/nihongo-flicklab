import React from 'react';
import type { UserProgress } from '../../types/practice';
import { KEYBOARD_LAYOUT } from '../../constants/keyboardLayout';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { CURRICULUM_MODULES } from '../../constants/curriculum';
import { Flame, Zap, Trophy, BookOpen, Target, CheckCircle2, Gamepad2 } from 'lucide-react';

interface ProgressModeProps {
  progress: UserProgress;
}

export const ProgressMode: React.FC<ProgressModeProps> = ({ progress }) => {
  const wordsTotal = VOCABULARY_LIST.length;
  const wordsLearned = progress.completedWordIds.length;

  const totalLessons = CURRICULUM_MODULES.flatMap((m) => m.lessons).length;
  const lessonsLearned = progress.completedLessonIds?.length || 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-black text-white">
          Tiến trình & Bản đồ thành thạo (上達記録)
        </h2>
        <p className="text-xs text-stone-400 mt-1">
          Theo dõi mức độ phản xạ cơ bắp trên từng hàng phím Kana và lịch sử luyện tập cá nhân.
        </p>
      </div>

      {/* Top 4 Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Chuỗi ngày liên tục</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {progress.currentStreakDays}{' '}
            <span className="text-xs font-normal text-stone-500">ngày</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Tổng số ký tự</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {progress.totalCharsTyped.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>Độ chính xác chung</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {progress.overallAccuracy}%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#14161D] border border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Kỷ lục tốc độ</span>
          </div>
          <div className="text-3xl font-black text-white mt-1">
            {progress.bestCPM}{' '}
            <span className="text-xs font-normal text-stone-500">CPM</span>
          </div>
        </div>
      </div>

      {/* Curriculum Mastery Card */}
      <div className="p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Tiến độ hoàn thành giáo trình
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-400">
            {lessonsLearned} / {totalLessons} bài ({Math.round((lessonsLearned / totalLessons) * 100)}%)
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(lessonsLearned / totalLessons) * 100}%` }}
          />
        </div>
      </div>

      {/* Kana Rows Mastery Grid / Heatmap */}
      <div className="p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">
            Mức độ làm chủ theo hàng phím (行ごとの習熟度)
          </h3>
          <span className="text-xs text-stone-400">
            Dựa trên số lượt gõ và tỉ lệ chính xác
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                className="p-3.5 rounded-2xl bg-stone-850/80 border border-stone-800 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center font-bold text-base text-white shadow-2xs">
                    {keyDef.hiragana.center}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">
                      {keyDef.rowName}
                    </div>
                    <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                      {keyDef.hiragana.center}・{keyDef.hiragana.left}・{keyDef.hiragana.up}・
                      {keyDef.hiragana.right}・{keyDef.hiragana.down}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {isMastered ? (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 text-[10px] font-bold border border-emerald-800">
                      Đã thành thạo
                    </span>
                  ) : isProficient ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 text-[10px] font-bold border border-amber-800">
                      Khá tốt ({accuracy}%)
                    </span>
                  ) : isStarted ? (
                    <span className="px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 text-[10px] font-medium border border-stone-700">
                      Đang luyện ({accuracy}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500">Chưa luyện</span>
                  )}
                  {attempts > 0 && (
                    <div className="text-[10px] text-stone-500 mt-1">
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
      <div className="p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Vốn từ vựng đã gõ thành công
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-400">
            {wordsLearned} / {wordsTotal} từ ({Math.round((wordsLearned / wordsTotal) * 100)}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-stone-850 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(wordsLearned / wordsTotal) * 100}%` }}
          />
        </div>
      </div>

      {/* Minigame Achievement Card */}
      {((progress.minigameGamesPlayed || 0) > 0 || (progress.minigameHighScore || 0) > 0) && (
        <div className="p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Thành tích Mưa Chữ Kana (Minigame)</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">Arcade</span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1">
                <span>Đã chơi {progress.minigameGamesPlayed || 0} trận</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <span>Combo tối đa:</span>
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" />
                  <strong className="text-white">{progress.minigameMaxCombo || 0}</strong>
                </span>
              </p>
            </div>
          </div>
          <div className="sm:text-right">
            <div className="text-[10px] text-stone-500 uppercase font-mono">Điểm cao nhất</div>
            <div className="text-2xl font-black text-amber-300">
              {(progress.minigameHighScore || 0).toLocaleString()} <span className="text-xs text-stone-500">PTS</span>
            </div>
          </div>
        </div>
      )}

      {/* Speed Challenge History */}
      {progress.challengeHistory && progress.challengeHistory.length > 0 && (
        <div className="p-6 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              Lịch sử thử thách tốc độ gần nhất
            </h3>
            <span className="text-xs text-stone-400">
              {progress.challengeHistory.length} phiên đã lưu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-800 text-stone-500 pb-2">
                  <th className="py-2">Thời gian</th>
                  <th className="py-2">Chế độ</th>
                  <th className="py-2">Tốc độ CPM</th>
                  <th className="py-2">Độ chính xác</th>
                  <th className="py-2 text-right">Xếp hạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {progress.challengeHistory.map((item, idx) => (
                  <tr key={idx} className="text-stone-300">
                    <td className="py-2.5 font-mono text-[11px] text-stone-500">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 font-medium">
                      {item.durationSeconds}s ({item.mode === 'kana' ? 'Kana' : 'Từ vựng'})
                    </td>
                    <td className="py-2.5 font-bold text-white">
                      {item.cpm} CPM
                    </td>
                    <td className="py-2.5">{item.accuracy}%</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-red-950/60 border border-red-800 text-red-400 text-[10px]">
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

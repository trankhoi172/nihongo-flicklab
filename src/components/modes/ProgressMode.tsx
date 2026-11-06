import React from 'react';
import type { UserProgress } from '../../types/practice';
import { KEYBOARD_LAYOUT } from '../../constants/keyboardLayout';
import { VOCABULARY_LIST } from '../../constants/vocabulary';
import { Flame, Zap, Trophy, BookOpen, Target } from 'lucide-react';

interface ProgressModeProps {
  progress: UserProgress;
}

export const ProgressMode: React.FC<ProgressModeProps> = ({ progress }) => {
  const wordsTotal = VOCABULARY_LIST.length;
  const wordsLearned = progress.completedWordIds.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
          Tiến trình & Bản đồ thành thạo (上達記録)
        </h2>
        <p className="text-xs text-stone-500 mt-1">
          Theo dõi mức độ phản xạ cơ bắp trên từng hàng phím Kana và lịch sử luyện tập cá nhân.
        </p>
      </div>

      {/* Top 4 Key Performance Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Chuỗi ngày liên tục</span>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {progress.currentStreakDays}{' '}
            <span className="text-xs font-normal text-stone-400">ngày</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Zap className="w-4 h-4 text-red-500" />
            <span>Tổng số ký tự</span>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {progress.totalCharsTyped.toLocaleString()}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Target className="w-4 h-4 text-emerald-500" />
            <span>Độ chính xác chung</span>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {progress.overallAccuracy}%
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs">
          <div className="flex items-center gap-1.5 text-stone-400 text-xs font-semibold">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>Kỷ lục tốc độ</span>
          </div>
          <div className="text-3xl font-black text-stone-900 dark:text-stone-100 mt-1">
            {progress.bestCPM}{' '}
            <span className="text-xs font-normal text-stone-400">CPM</span>
          </div>
        </div>
      </div>

      {/* Kana Rows Mastery Grid / Heatmap */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
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
                className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/70 dark:border-stone-700/70 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center font-bold text-base text-stone-800 dark:text-stone-200 shadow-2xs">
                    {keyDef.hiragana.center}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100">
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
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                      Đã thành thạo
                    </span>
                  ) : isProficient ? (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-bold border border-amber-200 dark:border-amber-800">
                      Khá tốt ({accuracy}%)
                    </span>
                  ) : isStarted ? (
                    <span className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300 text-[10px] font-medium">
                      Đang luyện ({accuracy}%)
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-400">Chưa luyện</span>
                  )}
                  {attempts > 0 && (
                    <div className="text-[10px] text-stone-400 mt-1">
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
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Vốn từ vựng đã gõ thành công
            </h3>
          </div>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
            {wordsLearned} / {wordsTotal} từ ({Math.round((wordsLearned / wordsTotal) * 100)}%)
          </span>
        </div>

        <div className="w-full h-3 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(wordsLearned / wordsTotal) * 100}%` }}
          />
        </div>
      </div>

      {/* Speed Challenge History */}
      {progress.challengeHistory && progress.challengeHistory.length > 0 && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Lịch sử thử thách tốc độ gần nhất
            </h3>
            <span className="text-xs text-stone-400">
              {progress.challengeHistory.length} phiên đã lưu
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-100 dark:border-stone-800 text-stone-400 pb-2">
                  <th className="py-2">Thời gian</th>
                  <th className="py-2">Chế độ</th>
                  <th className="py-2">Tốc độ CPM</th>
                  <th className="py-2">Độ chính xác</th>
                  <th className="py-2 text-right">Xếp hạng</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {progress.challengeHistory.map((item, idx) => (
                  <tr key={idx} className="text-stone-700 dark:text-stone-300">
                    <td className="py-2.5 font-mono text-[11px] text-stone-400">
                      {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-2.5 font-medium">
                      {item.durationSeconds}s ({item.mode === 'kana' ? 'Kana' : 'Từ vựng'})
                    </td>
                    <td className="py-2.5 font-bold text-stone-900 dark:text-stone-100">
                      {item.cpm} CPM
                    </td>
                    <td className="py-2.5">{item.accuracy}%</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 text-[10px]">
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

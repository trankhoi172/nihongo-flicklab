import React, { useState } from 'react';
import type { UserSettings, FlickSensitivity, SoundTheme, AppTheme, LanguageMeaning } from '../../types/settings';
import { X, Volume2, VolumeX, Sliders, Moon, Sun, Globe, RotateCcw, Check } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const update = (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    onUpdateSettings(updated);
  };

  const handleSensitivityChange = (val: FlickSensitivity) => {
    update({ flickSensitivity: val });
    if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
  };

  const handleSoundThemeChange = (val: SoundTheme) => {
    update({ soundTheme: val });
    soundEffects.playTap(val, settings.soundVolume);
  };

  const handleThemeChange = (val: AppTheme) => {
    update({ theme: val });
  };

  const handleLanguageChange = (val: LanguageMeaning) => {
    update({ languageMeaning: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
              Cài đặt (設定)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Flick Sensitivity */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-stone-900 dark:text-stone-100 flex items-center justify-between">
              <span>Độ nhạy vuốt (Flick Sensitivity)</span>
              <span className="text-xs font-mono text-stone-500 uppercase">
                {settings.flickSensitivity}
              </span>
            </label>
            <p className="text-xs text-stone-500">
              Khoảng cách ngón tay di chuyển để kích hoạt thao tác vuốt 4 hướng.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {(['low', 'medium', 'high'] as FlickSensitivity[]).map((level) => {
                const labels = {
                  low: 'Nhạy cao (20px)',
                  medium: 'Chuẩn (28px)',
                  high: 'Nhẹ (38px)',
                };
                const isSelected = settings.flickSensitivity === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSensitivityChange(level)}
                    className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                      isSelected
                        ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 dark:text-red-400 font-bold'
                        : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300'
                    }`}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Haptic Feedback */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block">
                  Âm thanh & Phản hồi (Sound & Audio)
                </span>
                <span className="text-xs text-stone-500">
                  Âm gõ phím cơ học và thông báo kết quả tức thì
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  update({ soundEnabled: !settings.soundEnabled });
                  if (!settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
                }}
                className={`p-2 rounded-xl border transition-colors ${
                  settings.soundEnabled
                    ? 'bg-red-50 dark:bg-red-950/40 border-red-500 text-red-600 dark:text-red-400'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-400'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-3 pl-1">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-500 w-16">Âm lượng:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => update({ soundVolume: parseFloat(e.target.value) })}
                    className="flex-1 accent-red-600"
                  />
                  <span className="text-xs font-mono text-stone-500 w-8 text-right">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['click', 'bubble', 'chime'] as SoundTheme[]).map((themeName) => {
                    const names = {
                      click: 'Phím cơ (Click)',
                      bubble: 'Bong bóng (Bubble)',
                      chime: 'Chuông nhẹ (Chime)',
                    };
                    const isSelected = settings.soundTheme === themeName;
                    return (
                      <button
                        key={themeName}
                        type="button"
                        onClick={() => handleSoundThemeChange(themeName)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition-all ${
                          isSelected
                            ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 font-bold border-transparent'
                            : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300'
                        }`}
                      >
                        {names[themeName]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Visual Guides */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block">
              Trợ giúp thị giác (Visual Guides)
            </span>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
                  Hiển thị Romaji (Phiên âm chữ cái Latinh)
                </span>
                <span className="text-[11px] text-stone-400">
                  Hữu ích cho người mới làm quen mặt chữ
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.showRomaji}
                onChange={(e) => update({ showRomaji: e.target.checked })}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-stone-800 dark:text-stone-200 block">
                  Hiển thị 4 chữ vệ tinh trên mặt phím
                </span>
                <span className="text-[11px] text-stone-400">
                  Hiển thị ký tự trái/trên/phải/dưới ngay trên mỗi ô phím
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.showFlickHints}
                onChange={(e) => update({ showFlickHints: e.target.checked })}
                className="w-4 h-4 accent-red-600 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Theme & Meaning Language */}
          <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
            <span className="text-sm font-semibold text-stone-900 dark:text-stone-100 block">
              Giao diện & Ngôn ngữ giải nghĩa
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleThemeChange('wabi')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  settings.theme === 'wabi'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-900 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>📜 Wabi-sabi</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  settings.theme === 'light'
                    ? 'border-red-500 bg-red-50 text-red-700 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Sáng (Light)</span>
              </button>
              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1.5 transition-all ${
                  settings.theme === 'dark'
                    ? 'border-stone-600 bg-stone-800 text-stone-100 font-bold'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Tối (Dark)</span>
              </button>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-stone-400" />
                <span className="text-xs text-stone-700 dark:text-stone-300">
                  Dịch nghĩa từ vựng:
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('vi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    settings.languageMeaning === 'vi'
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    settings.languageMeaning === 'en'
                      ? 'bg-red-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Reset Progress */}
          <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 text-xs text-stone-500 hover:text-red-600 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại toàn bộ dữ liệu tiến trình</span>
              </button>
            ) : (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl space-y-2">
                <p className="text-xs text-red-700 dark:text-red-300 font-medium">
                  Bạn có chắc muốn xóa sạch chuỗi ngày, kỷ lục tốc độ và kết quả luyện tập?
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 text-xs rounded-lg bg-stone-200 text-stone-700"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onResetProgress();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="px-3 py-1 text-xs rounded-lg bg-red-600 text-white font-bold"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-bold hover:bg-stone-800 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Hoàn tất (閉じる)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

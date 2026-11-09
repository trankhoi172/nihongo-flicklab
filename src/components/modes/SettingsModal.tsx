import React, { useState } from 'react';
import type { UserSettings, FlickSensitivity, SoundTheme, LanguageMeaning } from '../../types/settings';
import { X, Volume2, VolumeX, Globe, RotateCcw, Check, EyeOff } from 'lucide-react';
import { FacebookIcon } from '../common/Icons';
import { soundEffects } from '../../utils/audio';
import logoImg from '../../assets/logo.png';

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
    const updated = { ...settings, ...partial, theme: 'dark' as const };
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

  const handleLanguageChange = (val: LanguageMeaning) => {
    update({ languageMeaning: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-lg bg-[#111216] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-800 bg-[#0B0C0E]">
          <div className="flex items-center gap-2.5">
            <img
              src={logoImg}
              alt="TDK NIHONGO"
              className="w-6 h-6 rounded-md object-contain bg-[#FAF9F6] p-0.5"
            />
            <h2 className="text-sm font-semibold text-neutral-100">
              Cài đặt & Tùy biến (設定)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body content */}
        <div className="p-5 space-y-5 overflow-y-auto no-scrollbar overscroll-contain">
          {/* Flick Sensitivity */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-200 flex items-center justify-between">
              <span>Độ nhạy vuốt (Flick Sensitivity)</span>
              <span className="text-[11px] font-mono text-neutral-400 uppercase">
                {settings.flickSensitivity}
              </span>
            </label>
            <p className="text-[11px] text-neutral-400">
              Khoảng cách ngón tay di chuyển để kích hoạt thao tác vuốt 4 hướng.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-0.5">
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
                    className={`py-1.5 px-2 rounded-md text-xs font-medium border text-center transition-colors ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'border-neutral-800 hover:text-white text-neutral-400 bg-[#0B0C0E]'
                    }`}
                  >
                    {labels[level]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound & Haptic Feedback */}
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-medium text-neutral-200 block">
                  Âm thanh & Phản hồi gõ phím
                </span>
                <span className="text-[11px] text-neutral-400">
                  Âm phím cơ học và hiệu ứng chuông thông báo kết quả tức thì
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  update({ soundEnabled: !settings.soundEnabled });
                  if (!settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
                }}
                className={`p-1.5 rounded-md border transition-colors ${
                  settings.soundEnabled
                    ? 'bg-white text-black border-white'
                    : 'bg-[#0B0C0E] border-neutral-800 text-neutral-500'
                }`}
              >
                {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            {settings.soundEnabled && (
              <div className="space-y-2.5 pl-0.5">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-neutral-400 w-16">Âm lượng:</span>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={(e) => update({ soundVolume: parseFloat(e.target.value) })}
                    className="flex-1 accent-white"
                  />
                  <span className="text-[11px] font-mono text-neutral-400 w-8 text-right">
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
                        className={`py-1.5 px-2 rounded-md text-xs font-medium border text-center transition-colors ${
                          isSelected
                            ? 'bg-white text-black border-white'
                            : 'border-neutral-800 text-neutral-400 hover:text-white bg-[#0B0C0E]'
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
          <div className="space-y-3 pt-2 border-t border-neutral-800">
            <span className="text-xs font-medium text-neutral-200 block">
              Trợ giúp thị giác (Visual Guides)
            </span>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-200 block">
                  Hiển thị Romaji (Phiên âm chữ cái Latinh)
                </span>
                <span className="text-[11px] text-neutral-500">
                  Hữu ích cho người mới làm quen mặt chữ
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.showRomaji}
                onChange={(e) => update({ showRomaji: e.target.checked })}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-neutral-200 block">
                  Hiển thị 4 chữ vệ tinh trên mặt phím
                </span>
                <span className="text-[11px] text-neutral-500">
                  Hiển thị ký tự trái/trên/phải/dưới ngay trên mỗi ô phím
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.showFlickHints}
                onChange={(e) => update({ showFlickHints: e.target.checked })}
                className="w-4 h-4 accent-white rounded cursor-pointer"
              />
            </div>

            {/* Blind Mode (Muscle Memory) */}
            <div className="flex items-center justify-between p-3 rounded-md bg-[#16171B] border border-neutral-800">
              <div className="pr-3">
                <span className="text-xs font-medium text-neutral-200 flex items-center gap-1.5">
                  <EyeOff className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Chế độ Luyện phản xạ mù (Blind Flick)</span>
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5 leading-relaxed">
                  Ẩn hoàn toàn ký tự trên mặt phím để rèn luyện và kiểm tra trí nhớ cơ bắp (Muscle Memory) của ngón tay.
                </span>
              </div>
              <input
                type="checkbox"
                checked={!!settings.blindMode}
                onChange={(e) => update({ blindMode: e.target.checked })}
                className="w-4 h-4 accent-white rounded cursor-pointer shrink-0"
              />
            </div>
          </div>

          {/* Meaning Language */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-800">
            <span className="text-xs font-medium text-neutral-200 block">
              Ngôn ngữ giải nghĩa từ vựng
            </span>

            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-400">
                  Dịch nghĩa sang:
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('vi')}
                  className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                    settings.languageMeaning === 'vi'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#0B0C0E] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                    settings.languageMeaning === 'en'
                      ? 'bg-white text-black border-white'
                      : 'bg-[#0B0C0E] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          {/* Reset Progress */}
          <div className="pt-2 border-t border-neutral-800">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2 text-xs text-neutral-500 hover:text-rose-400 flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Đặt lại toàn bộ dữ liệu tiến trình</span>
              </button>
            ) : (
              <div className="p-3 bg-[#1C1214] border border-rose-900/60 rounded-md space-y-2">
                <p className="text-xs text-rose-300">
                  Bạn có chắc muốn xóa sạch chuỗi ngày, bài học đã hoàn thành và kết quả luyện tập?
                </p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-2.5 py-1 text-xs rounded-md bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
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
                    className="px-2.5 py-1 text-xs rounded-md bg-rose-700 text-white font-medium"
                  >
                    Xác nhận xóa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-neutral-800 bg-[#0B0C0E] flex items-center justify-between gap-3">
          <a
            href="https://facebook.com/@ronaldoGoatskibidi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 transition-colors"
            title="Liên hệ Facebook Tran Dang Khoi"
          >
            <FacebookIcon className="w-3.5 h-3.5 text-neutral-400" />
            <span className="text-[11px]">
              Created by <span className="text-neutral-200">Tran Dang Khoi</span>
            </span>
          </a>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-md bg-white text-black text-xs font-medium hover:bg-neutral-200 transition-colors"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Hoàn tất (閉じる)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

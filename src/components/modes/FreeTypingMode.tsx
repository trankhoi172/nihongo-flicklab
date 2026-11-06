import React, { useState } from 'react';
import type { UserSettings } from '../../types/settings';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { getModifiedChar, getKanaInfo } from '../../utils/kanaHelper';
import { Copy, Trash2, Check } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface FreeTypingModeProps {
  settings: UserSettings;
}

export const FreeTypingMode: React.FC<FreeTypingModeProps> = ({ settings }) => {
  const [text, setText] = useState<string>('こんにちは');
  const [isKatakana, setIsKatakana] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCharInput = (char: string) => {
    setText((prev) => prev + char);
  };

  const handleModifier = () => {
    if (text.length === 0) return;
    const lastChar = text[text.length - 1];
    const modified = getModifiedChar(lastChar);
    if (modified !== lastChar) {
      setText((prev) => prev.slice(0, -1) + modified);
    }
  };

  const handleBackspace = () => {
    setText((prev) => prev.slice(0, -1));
  };

  const handleSpace = () => {
    setText((prev) => prev + '　');
  };

  const handleEnter = () => {
    setText((prev) => prev + '\n');
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    if (settings.soundEnabled) soundEffects.playSuccess(settings.soundVolume);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText('');
    if (settings.soundEnabled) soundEffects.playTap(settings.soundTheme, settings.soundVolume);
  };

  const romajiPreview = text
    .split('')
    .map((c) => (c === '\n' ? ' ' : getKanaInfo(c)?.romaji || c))
    .join(' ');

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-4 animate-in fade-in duration-200">
      {/* Sandbox Text Editor Box */}
      <div className="p-5 rounded-3xl bg-[#14161D] border border-stone-800 shadow-xl space-y-3">
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white">
              Văn bản đang gõ (入力テキスト)
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-stone-850 text-stone-400 border border-stone-800">
              {text.length} ký tự
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                copied
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                  : 'bg-stone-850 border-stone-800 text-stone-300 hover:bg-stone-800'
              } disabled:opacity-40`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="p-1.5 rounded-xl border border-stone-800 text-stone-400 hover:text-red-400 hover:bg-stone-850 disabled:opacity-40 transition-colors"
              title="Xóa hết văn bản"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Text Display Canvas */}
        <div className="min-h-[110px] p-4 rounded-2xl bg-[#0D0E13] border border-stone-800/80 flex flex-col justify-between">
          <div className="text-xl sm:text-2xl font-sans font-medium text-white whitespace-pre-wrap break-words tracking-wide">
            {text ? (
              <span>
                {text}
                <span className="inline-block w-0.5 h-6 bg-red-500 align-middle ml-1 animate-pulse" />
              </span>
            ) : (
              <span className="text-stone-500 text-sm font-normal italic">
                Chạm vào các phím bên dưới hoặc vuốt theo 4 hướng để bắt đầu gõ tiếng Nhật...
              </span>
            )}
          </div>

          {text && (
            <div className="text-xs font-mono text-stone-500 pt-3 border-t border-stone-850">
              Romaji: <span className="text-stone-300">{romajiPreview}</span>
            </div>
          )}
        </div>
      </div>

      {/* On-Screen Keyboard */}
      <div className="pt-1">
        <FlickKeyboard
          settings={settings}
          isKatakana={isKatakana}
          onToggleKana={setIsKatakana}
          onCharInput={handleCharInput}
          onModifier={handleModifier}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
          onEnter={handleEnter}
        />
      </div>
    </div>
  );
};

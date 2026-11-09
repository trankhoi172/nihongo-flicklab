import React, { useState, useRef, useEffect } from 'react';
import type { UserSettings } from '../../types/settings';
import type { FlickDirection } from '../../types/keyboard';
import { FlickKeyboard } from '../keyboard/FlickKeyboard';
import { applyModifier, getKanaInfo } from '../../utils/kanaHelper';
import { Copy, Trash2, Check } from 'lucide-react';
import { soundEffects } from '../../utils/audio';

interface FreeTypingModeProps {
  settings: UserSettings;
}

export const FreeTypingMode: React.FC<FreeTypingModeProps> = ({ settings }) => {
  const [text, setText] = useState<string>('こんにちは');
  const [isKatakana, setIsKatakana] = useState(false);
  const [copied, setCopied] = useState(false);
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of the fixed canvas when text grows
  useEffect(() => {
    if (textContainerRef.current) {
      textContainerRef.current.scrollTop = textContainerRef.current.scrollHeight;
    }
  }, [text]);

  const handleCharInput = (char: string) => {
    setText((prev) => prev + char);
  };

  const handleModifier = (direction?: FlickDirection) => {
    if (text.length === 0) return;
    const lastChar = text[text.length - 1];
    const modified = applyModifier(lastChar, direction);
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
    <div className="max-w-xl mx-auto px-3 sm:px-4 py-2 space-y-3 animate-in fade-in duration-150">
      {/* Sandbox Text Editor Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#111216] border border-neutral-800/80 space-y-3">
        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-200">
              Văn bản đang gõ (入力テキスト)
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#16171B] text-neutral-400 border border-neutral-800">
              {text.length} ký tự
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleCopy}
              disabled={!text}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium border transition-colors ${
                copied
                  ? 'bg-white text-black border-white'
                  : 'bg-[#16171B] border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700'
              } disabled:opacity-40`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép'}</span>
            </button>

            <button
              type="button"
              onClick={handleClear}
              disabled={!text}
              className="p-1.5 rounded-md border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 disabled:opacity-40 transition-colors"
              title="Xóa hết văn bản"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fixed Height Text Display Canvas with Auto-Scroll (Locks keyboard position) */}
        <div className="h-[120px] sm:h-[140px] p-4 rounded-lg bg-[#0B0C0E] border border-neutral-800 flex flex-col justify-between overflow-hidden">
          <div
            ref={textContainerRef}
            className="flex-1 overflow-y-auto custom-scrollbar text-xl sm:text-2xl font-sans font-medium text-neutral-100 whitespace-pre-wrap break-words tracking-wide pr-1"
          >
            {text ? (
              <span>
                {text}
                <span className="inline-block w-0.5 h-5 bg-white align-middle ml-0.5 animate-pulse" />
              </span>
            ) : (
              <span className="text-neutral-500 text-sm font-normal">
                Chạm vào các phím bên dưới hoặc vuốt theo 4 hướng để bắt đầu gõ tiếng Nhật...
              </span>
            )}
          </div>

          {text && (
            <div className="text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-800/80 shrink-0 truncate">
              Romaji: <span className="text-neutral-300">{romajiPreview}</span>
            </div>
          )}
        </div>
      </div>

      {/* Anchored On-Screen Keyboard */}
      <div className="pt-2 w-full relative z-10">
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

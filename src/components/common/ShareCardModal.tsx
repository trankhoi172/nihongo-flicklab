import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { UserProgress, SpeedChallengeRecord } from '../../types/practice';
import { Share2, Download, Copy, Check, X, Sparkles } from 'lucide-react';
import logoImg from '../../assets/logo.png';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: UserProgress;
  latestChallengeRecord?: SpeedChallengeRecord | null;
}

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  isOpen,
  onClose,
  progress,
  latestChallengeRecord,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const bestCPM = Math.max(progress.bestCPM, latestChallengeRecord?.cpm || 0);
  const accuracy = latestChallengeRecord?.accuracy || progress.overallAccuracy;
  const streak = progress.currentStreakDays;
  const totalChars = progress.totalCharsTyped;
  const lessonsCount = progress.completedLessonIds?.length || 0;

  let rank = 'D';
  let rankTitle = 'Tập sự (初級)';
  if (bestCPM >= 160) {
    rank = 'S';
    rankTitle = 'Bậc Thầy (達人)';
  } else if (bestCPM >= 110) {
    rank = 'A';
    rankTitle = 'Siêu Cấp (上級)';
  } else if (bestCPM >= 75) {
    rank = 'B';
    rankTitle = 'Thành thạo (中級)';
  } else if (bestCPM >= 40) {
    rank = 'C';
    rankTitle = 'Cơ bản (初級)';
  }

  const renderCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Instagram / Facebook Story 9:16 Aspect Ratio (1080x1920 crisp high-res)
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Deep Monochromatic Japanese Sumi Background
    ctx.fillStyle = '#0B0C0E';
    ctx.fillRect(0, 0, 1080, 1920);

    // Subtle radial light gradient in center
    const radial = ctx.createRadialGradient(540, 960, 50, 540, 960, 800);
    radial.addColorStop(0, 'rgba(255, 255, 255, 0.03)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Subtle Watermark Kanji (Faint Japanese Aesthetic)
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.015)';
    ctx.font = '900 520px "Hiragino Mincho ProN", "Yu Mincho", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('極', 540, 920);
    ctx.restore();

    // 3. Swiss Outer Hairline Grid Frame (Margin 64px)
    const margin = 64;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(margin, margin, 1080 - margin * 2, 1920 - margin * 2);

    // Corner decorative marks
    const cornerSize = 16;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(margin - 2, margin - 2, cornerSize, 3);
    ctx.fillRect(margin - 2, margin - 2, 3, cornerSize);
    ctx.fillRect(1080 - margin - cornerSize + 2, margin - 2, cornerSize, 3);
    ctx.fillRect(1080 - margin - 1, margin - 2, 3, cornerSize);
    ctx.fillRect(margin - 2, 1920 - margin - 1, cornerSize, 3);
    ctx.fillRect(margin - 2, 1920 - margin - cornerSize + 2, 3, cornerSize);
    ctx.fillRect(1080 - margin - cornerSize + 2, 1920 - margin - 1, cornerSize, 3);
    ctx.fillRect(1080 - margin - 1, 1920 - margin - cornerSize + 2, 3, cornerSize);

    // 4. Header Bar
    const contentLeft = margin + 56;
    const contentRight = 1080 - margin - 56;
    let y = margin + 80;

    // Small Red Brand Dot + Tag
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(contentLeft + 8, y + 8, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '600 24px monospace';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText('TDK NIHONGO flicklab • 日本語フリック入力', contentLeft + 32, y);

    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    ctx.textAlign = 'right';
    ctx.fillText(dateStr, contentRight, y);

    // Hairline Divider
    y += 56;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(contentLeft, y);
    ctx.lineTo(contentRight, y);
    ctx.stroke();

    // 5. Title & Subtitle
    y += 70;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 52px "Plus Jakarta Sans", "Noto Sans JP", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('THẺ THÀNH TÍCH LUYỆN PHÍM', contentLeft, y);

    y += 66;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '400 28px "Noto Sans JP", sans-serif';
    ctx.fillText('Báo cáo mức độ thành thạo 12 phím Kana chuẩn Nhật', contentLeft, y);

    // 6. Rank & Best CPM Hero Card
    y += 90;
    const cardHeight = 440;
    ctx.fillStyle = '#111216';
    ctx.fillRect(contentLeft, y, contentRight - contentLeft, cardHeight);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.strokeRect(contentLeft, y, contentRight - contentLeft, cardHeight);

    // Rank Tag
    const heroCardY = y;
    ctx.fillStyle = '#16171B';
    ctx.fillRect(contentLeft + 48, heroCardY + 44, 210, 48);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.strokeRect(contentLeft + 48, heroCardY + 44, 210, 48);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '700 22px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`HẠNG ${rank} • ${rankTitle}`, contentLeft + 48 + 105, heroCardY + 58);

    // CPM Giant Number
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '900 160px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(String(bestCPM), contentLeft + 48, heroCardY + 140);

    // CPM Unit
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '700 36px monospace';
    ctx.fillText('CPM', contentLeft + 48 + ctx.measureText(String(bestCPM)).width + 24, heroCardY + 240);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = '400 24px monospace';
    ctx.fillText('CHARACTERS PER MINUTE', contentLeft + 48, heroCardY + 340);

    // 7. 4-Metric Data Strip (Editorial Swiss Grid)
    y += cardHeight + 60;
    const gridCols = 2;
    const gridRows = 2;
    const cellW = (contentRight - contentLeft - 24) / gridCols;
    const cellH = 180;

    const stats = [
      { id: '01', label: 'CHUỖI NGÀY LIÊN TỤC', value: `${streak} ngày` },
      { id: '02', label: 'ĐỘ CHÍNH XÁC', value: `${accuracy}%` },
      { id: '03', label: 'TỔNG KÝ TỰ ĐÃ GÕ', value: `${totalChars.toLocaleString()} ký tự` },
      { id: '04', label: 'TIẾN ĐỘ BÀI HỌC', value: `${lessonsCount} / 27 bài` },
    ];

    stats.forEach((st, idx) => {
      const col = idx % gridCols;
      const row = Math.floor(idx / gridCols);
      const cx = contentLeft + col * (cellW + 24);
      const cy = y + row * (cellH + 24);

      ctx.fillStyle = '#111216';
      ctx.fillRect(cx, cy, cellW, cellH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.strokeRect(cx, cy, cellW, cellH);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '600 20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(`${st.id}. ${st.label}`, cx + 32, cy + 32);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 44px "Plus Jakarta Sans", monospace';
      ctx.fillText(st.value, cx + 32, cy + 86);
    });

    // 8. Japanese Minimalist Wisdom Quote
    y += gridRows * (cellH + 24) + 60;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(contentLeft, y);
    ctx.lineTo(contentRight, y);
    ctx.stroke();

    y += 50;
    ctx.fillStyle = '#FFFFFF';
    ctx.font = '500 36px "Hiragino Mincho ProN", "Yu Mincho", serif';
    ctx.textAlign = 'center';
    ctx.fillText('「 継続は力なり 」', 540, y);

    y += 52;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.font = '400 24px "Noto Sans JP", sans-serif';
    ctx.fillText('Kiên trì là cội nguồn của sức mạnh • Ngón tay hình thành phản xạ', 540, y);

    // 9. Signature & Watermark Footer
    const footerY = 1920 - margin - 110;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(contentLeft, footerY);
    ctx.lineTo(contentRight, footerY);
    ctx.stroke();

    const bottomY = footerY + 36;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 22px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('CREATED BY TRAN DANG KHOI', contentLeft, bottomY);

    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.fillText('tdk-nihongo.web.app', contentRight, bottomY);

    // Export to data URL
    const url = canvas.toDataURL('image/png');
    setDataUrl(url);
  }, [bestCPM, accuracy, streak, totalChars, lessonsCount, rank, rankTitle]);

  useEffect(() => {
    if (isOpen) {
      // Small timeout ensures canvas element is attached to DOM
      const timer = setTimeout(() => {
        renderCard();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, renderCard]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!dataUrl) return;
    const link = document.createElement('a');
    link.download = `TDK-Nihongo-Streak-${streak}d-${bestCPM}CPM.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleShare = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setSharing(true);
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setSharing(false);
          return;
        }

        const file = new File([blob], `TDK-Nihongo-Streak-${streak}d-${bestCPM}CPM.png`, {
          type: 'image/png',
        });

        // Use native mobile share sheet if supported (Instagram Stories, Facebook, Zalo, AirDrop...)
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: 'Thành tích TDK NIHONGO flicklab',
            text: `Tôi đạt kỷ lục tốc độ ${bestCPM} CPM trên TDK NIHONGO! Luyện phản xạ gõ 12 phím Kana chuẩn Nhật.`,
          });
        } else if (navigator.share) {
          await navigator.share({
            title: 'Thành tích TDK NIHONGO flicklab',
            text: `Tôi đạt kỷ lục tốc độ ${bestCPM} CPM trên TDK NIHONGO!`,
            url: window.location.href,
          });
        } else {
          // Fallback to direct download
          handleDownload();
        }
        setSharing(false);
      }, 'image/png');
    } catch {
      setSharing(false);
    }
  };

  const handleCopyImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard write image failed, falling back to download:', err);
      handleDownload();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-[#111216] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-[#0B0C0E]">
          <div className="flex items-center gap-2">
            <img
              src={logoImg}
              alt="Logo"
              className="w-5 h-5 rounded-md object-contain bg-[#FAF9F6] p-0.5"
            />
            <span className="text-xs font-semibold text-neutral-100 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Thẻ thành tích Story (Instagram / Facebook)</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hidden high-res canvas used for pixel-perfect PNG rendering */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Card Live Preview Area */}
        <div className="p-4 flex items-center justify-center overflow-y-auto no-scrollbar bg-[#0B0C0E]/60">
          {dataUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-neutral-800 shadow-2xl max-w-[240px] sm:max-w-[270px]">
              <img
                src={dataUrl}
                alt="Thẻ thành tích"
                className="w-full h-auto object-contain block"
              />
            </div>
          ) : (
            <div className="w-[240px] h-[426px] rounded-lg bg-[#111216] border border-neutral-800 flex items-center justify-center text-xs text-neutral-500 font-mono">
              Đang vẽ thẻ Story...
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="p-3.5 border-t border-neutral-800 bg-[#0B0C0E] space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {/* Native Mobile Share Button */}
            <button
              onClick={handleShare}
              disabled={sharing || !dataUrl}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-semibold transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{sharing ? 'Đang chuẩn bị...' : 'Chia sẻ Story'}</span>
            </button>

            {/* Direct Download PNG Button */}
            <button
              onClick={handleDownload}
              disabled={!dataUrl}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-[#16171B] hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tải ảnh PNG</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={handleCopyImage}
              disabled={!dataUrl}
              className="text-[11px] text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Đã sao chép ảnh vào Clipboard!' : 'Sao chép ảnh vào Clipboard'}</span>
            </button>

            <span className="text-[10px] font-mono text-neutral-500">
              1080 × 1920 (9:16)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

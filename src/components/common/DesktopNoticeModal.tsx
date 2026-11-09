import React, { useState, useEffect } from 'react';
import { Monitor, Smartphone, ArrowRight, MousePointerClick } from 'lucide-react';
import logoImg from '../../assets/logo.png';

export const DesktopNoticeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if notice was already dismissed
    const dismissed = sessionStorage.getItem('tdk_desktop_notice_dismissed');
    if (dismissed === 'true') {
      return;
    }

    // Detect Laptop / Desktop / PC / iMac
    const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
    const isDesktopScreen =
      window.innerWidth >= 1024 && (!navigator.maxTouchPoints || navigator.maxTouchPoints === 0);

    if ((hasFinePointer && !isMobileUA) || isDesktopScreen) {
      setIsOpen(true);
    }
  }, []);

  const handleProceed = () => {
    sessionStorage.setItem('tdk_desktop_notice_dismissed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-[#121319]/95 border border-white/[0.12] p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center space-y-6 relative overflow-hidden">
        {/* Subtle ambient light behind logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-white/5 blur-3xl pointer-events-none rounded-full" />

        {/* Brand Logo Header */}
        <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
          <img
            src={logoImg}
            alt="TDK NIHONGO flicklab"
            className="w-16 h-16 rounded-2xl object-contain bg-[#FAF9F6] p-1.5 shadow-xl border border-white/20"
          />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold">
            <Monitor className="w-3.5 h-3.5" />
            <span>Phát hiện thiết bị Máy tính / Laptop / PC</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-3 relative z-10">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            Trải nghiệm tối ưu nhất trên Điện thoại di động
          </h2>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed text-left sm:text-center">
            Nền tảng <strong className="text-white">TDK NIHONGO flicklab</strong> được thiết kế
            chuyên biệt cho <strong className="text-white">bàn phím 12 phím Kana (Flick Input)</strong> bằng
            thao tác chạm và vuốt 4 hướng bằng ngón tay trên màn hình cảm ứng điện thoại (iOS / Android).
          </p>

          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-300 space-y-2 text-left">
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>
                Hiện tại hệ thống <strong>chưa hỗ trợ gõ phím cứng / bàn phím cơ PC</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>
                Giao diện và kích thước các ô phím có thể <strong>chưa được tối ưu trọn vẹn</strong> cho màn hình máy tính lớn.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span className="flex items-center gap-1 flex-wrap">
                Trên máy tính, bạn vẫn có thể trải nghiệm bằng cách <strong>nhấp chuột và kéo rê (drag)</strong> để mô phỏng cử chỉ vuốt ngón tay:
                <MousePointerClick className="w-3.5 h-3.5 text-emerald-400 inline" />
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Recommendation Tip */}
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-xs text-neutral-400 flex items-center justify-center gap-2">
          <Smartphone className="w-4 h-4 text-neutral-300 shrink-0" />
          <span>Khuyên dùng: Mở liên kết trên trình duyệt Safari / Chrome của điện thoại để luyện tập chuẩn xác nhất!</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 relative z-10">
          <button
            onClick={handleProceed}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-sm shadow-xl active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Tiếp tục trải nghiệm trên máy tính</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

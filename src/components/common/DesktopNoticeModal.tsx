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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl bg-[#111216] border border-neutral-800 p-6 sm:p-7 shadow-2xl text-center space-y-5 relative">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center justify-center space-y-2.5">
          <img
            src={logoImg}
            alt="TDK NIHONGO flicklab"
            className="w-12 h-12 rounded-md object-contain bg-[#FAF9F6] p-1 border border-neutral-800"
          />

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#16171B] border border-neutral-800 text-neutral-300 text-[11px] font-mono">
            <Monitor className="w-3.5 h-3.5 text-neutral-400" />
            <span>PHÁT HIỆN TRÌNH DUYỆT MÁY TÍNH</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2.5">
          <h2 className="text-lg sm:text-xl font-semibold text-neutral-100 tracking-tight">
            Trải nghiệm tối ưu trên Điện thoại di động
          </h2>

          <p className="text-xs text-neutral-400 leading-relaxed text-left sm:text-center">
            Nền tảng <span className="text-neutral-200 font-medium">TDK NIHONGO flicklab</span> được thiết kế
            chuyên biệt cho <span className="text-neutral-200 font-medium">bàn phím 12 phím Kana (Flick Input)</span> bằng
            thao tác chạm và vuốt 4 hướng bằng ngón tay trên màn hình cảm ứng điện thoại (iOS / Android).
          </p>

          <div className="p-3 rounded-lg bg-[#0B0C0E] border border-neutral-800 text-xs text-neutral-300 space-y-2 text-left">
            <div className="flex items-start gap-2">
              <span className="text-neutral-400">•</span>
              <span>
                Hiện tại hệ thống <strong>chưa hỗ trợ gõ phím cứng / bàn phím cơ PC</strong>.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neutral-400">•</span>
              <span>
                Giao diện và kích thước các ô phím có thể chưa được tối ưu trọn vẹn cho màn hình máy tính lớn.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-neutral-400">•</span>
              <span className="flex items-center gap-1 flex-wrap">
                Trên máy tính, bạn vẫn có thể trải nghiệm bằng cách <strong>nhấp chuột và kéo rê (drag)</strong> để mô phỏng thao tác vuốt:
                <MousePointerClick className="w-3.5 h-3.5 text-neutral-300 inline" />
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Recommendation Tip */}
        <div className="p-2.5 rounded-lg bg-[#16171B] border border-neutral-800 text-[11px] text-neutral-400 flex items-center justify-center gap-2">
          <Smartphone className="w-4 h-4 text-neutral-300 shrink-0" />
          <span>Khuyên dùng: Mở link trên Safari / Chrome điện thoại để cảm giác gõ chân thực nhất.</span>
        </div>

        {/* Action Button */}
        <div className="pt-1">
          <button
            onClick={handleProceed}
            className="w-full flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>Tiếp tục trải nghiệm trên máy tính</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

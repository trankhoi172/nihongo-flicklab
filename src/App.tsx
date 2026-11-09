import React, { useState, useEffect } from 'react';
import type { PracticeMode, UserProgress } from './types/practice';
import type { UserSettings } from './types/settings';
import { loadSettings, saveSettings, loadProgress, resetAllData } from './utils/storage';
import { Header } from './components/common/Header';
import { NavigationTabs } from './components/common/NavigationTabs';
import { Dashboard } from './components/modes/Dashboard';
import { CurriculumMode } from './components/modes/CurriculumMode';
import { TutorialMode } from './components/modes/TutorialMode';
import { FlickPracticeMode } from './components/modes/FlickPracticeMode';
import { WordPracticeMode } from './components/modes/WordPracticeMode';
import { SpeedChallengeMode } from './components/modes/SpeedChallengeMode';
import { MinigameMode } from './components/modes/MinigameMode';
import { FreeTypingMode } from './components/modes/FreeTypingMode';
import { ProgressMode } from './components/modes/ProgressMode';
import { SettingsModal } from './components/modes/SettingsModal';
import { FacebookIcon } from './components/common/Icons';
import { DesktopNoticeModal } from './components/common/DesktopNoticeModal';
import { ExternalLink } from 'lucide-react';
import logoImg from './assets/logo.png';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Pure dark mode enforcement
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.body.classList.add('theme-dark', 'bg-[#0B0C0E]', 'text-stone-100');
  }, []);

  // Refresh progress state whenever returning to dashboard or progress page
  useEffect(() => {
    setProgress(loadProgress());
  }, [currentMode]);

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
  };

  const handleToggleBlindMode = () => {
    const updated = { ...settings, blindMode: !settings.blindMode };
    setSettings(updated);
    saveSettings(updated);
  };

  const handleResetProgress = () => {
    resetAllData();
    setProgress(loadProgress());
    setSettings(loadSettings());
  };

  return (
    <div className="min-h-screen bg-[#0B0C0E] text-stone-100 flex flex-col justify-between selection:bg-red-500/30">
      <div>
        <Header
          currentMode={currentMode}
          streakDays={progress.currentStreakDays}
          totalCharsTyped={progress.totalCharsTyped}
          blindMode={!!settings.blindMode}
          onToggleBlindMode={handleToggleBlindMode}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onSelectMode={setCurrentMode}
        />

        <NavigationTabs
          currentMode={currentMode}
          onSelectMode={setCurrentMode}
        />

        <main className="pb-16 pt-2">
          {currentMode === 'dashboard' && (
            <Dashboard
              progress={progress}
              onSelectMode={setCurrentMode}
            />
          )}

          {currentMode === 'curriculum' && (
            <CurriculumMode
              settings={settings}
              completedLessonIds={progress.completedLessonIds || []}
              onLessonFinished={() => setProgress(loadProgress())}
            />
          )}

          {currentMode === 'tutorial' && (
            <TutorialMode settings={settings} />
          )}

          {currentMode === 'flick' && (
            <FlickPracticeMode settings={settings} />
          )}

          {currentMode === 'word' && (
            <WordPracticeMode settings={settings} />
          )}

          {currentMode === 'challenge' && (
            <SpeedChallengeMode settings={settings} />
          )}

          {currentMode === 'minigame' && (
            <MinigameMode settings={settings} />
          )}

          {currentMode === 'free' && (
            <FreeTypingMode settings={settings} />
          )}

          {currentMode === 'progress' && (
            <ProgressMode progress={progress} />
          )}
        </main>
      </div>

      <footer className="w-full border-t border-white/[0.08] py-6 px-4 bg-[#090A0D]/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <img
                src={logoImg}
                alt="TDK NIHONGO flicklab"
                className="w-10 h-10 rounded-2xl object-contain bg-[#FAF9F6] p-1 shadow-md border border-white/10 shrink-0"
              />
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-extrabold text-white text-sm tracking-tight">
                    TDK <span className="font-normal text-xs uppercase text-neutral-300">NIHONGO</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/[0.08] text-neutral-300 border border-white/[0.08]">
                    flicklab
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal">
                  Luyện phản xạ gõ tiếng Nhật 12 phím Kana chuẩn Nhật
                </p>
              </div>
            </div>

            {/* Author Credit Badge */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com/@ronaldoGoatskibidi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.18] transition-all group shadow-sm text-xs"
                title="Facebook: Tran Dang Khoi"
              >
                <div className="w-6 h-6 rounded-full bg-[#1877F2]/20 border border-[#1877F2]/40 flex items-center justify-center text-[#1877F2] group-hover:scale-105 transition-transform shrink-0">
                  <FacebookIcon className="w-3.5 h-3.5 fill-current" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider leading-none">
                    Project Creator
                  </div>
                  <div className="text-xs font-bold text-white flex items-center gap-1 mt-0.5">
                    <span>Tran Dang Khoi</span>
                    <ExternalLink className="w-3 h-3 text-neutral-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Subfooter notice */}
          <div className="pt-3 border-t border-white/[0.05] flex items-center justify-between text-[11px] text-neutral-500">
            <span>© 2026 TDK NIHONGO flicklab</span>
          </div>
        </div>
      </footer>

      {/* Desktop / Laptop Warning Modal */}
      <DesktopNoticeModal />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default App;

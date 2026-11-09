import React, { useState, useEffect } from 'react';
import type { PracticeMode, UserProgress } from './types/practice';
import type { UserSettings } from './types/settings';
import { loadSettings, saveSettings, loadProgress, resetAllData, initStorage } from './utils/storage';
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
import { ExternalLink, Coffee } from 'lucide-react';
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

  // Hydrate settings and progress from IndexedDB and run automatic migration from localStorage
  useEffect(() => {
    initStorage().then(({ settings: loadedSettings, progress: loadedProgress }) => {
      setSettings(loadedSettings);
      setProgress(loadedProgress);
    });
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

      <footer className="w-full border-t border-neutral-800/80 py-6 px-4 bg-[#0B0C0E]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Brand Logo & Name */}
            <div className="flex items-center gap-3 text-center sm:text-left">
              <img
                src={logoImg}
                alt="TDK NIHONGO flicklab"
                className="w-9 h-9 rounded-md object-contain bg-[#FAF9F6] p-1 border border-neutral-800 shrink-0"
              />
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <span className="font-semibold text-neutral-100 text-sm tracking-tight">
                    TDK <span className="font-normal text-xs uppercase text-neutral-400">NIHONGO</span>
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-[#16171B] text-neutral-400 border border-neutral-800">
                    flicklab
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 font-normal">
                  Luyện phản xạ gõ tiếng Nhật 12 phím Kana chuẩn Nhật
                </p>
              </div>
            </div>

            {/* Support & Author Credit Badges */}
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5">
              {/* Ko-fi Support Link */}
              <a
                href="https://ko-fi.com/A0A61LIKK9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#111216] hover:bg-[#16171B] border border-neutral-800 hover:border-neutral-700 transition-colors text-xs text-neutral-300 hover:text-white"
                title="Ủng hộ tác giả qua Ko-fi"
              >
                <Coffee className="w-3.5 h-3.5 text-[#5b8de3]" />
                <span className="font-medium text-[11px]">Ủng hộ tui nhé</span>
              </a>

              {/* Creator Credit Link */}
              <a
                href="https://facebook.com/@ronaldoGoatskibidi"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111216] hover:bg-[#16171B] border border-neutral-800 hover:border-neutral-700 transition-colors text-xs text-neutral-300 hover:text-white"
                title="Facebook: Tran Dang Khoi"
              >
                <FacebookIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#1877F2] transition-colors" />
                <div className="text-left">
                  <span className="text-[10px] text-neutral-400 font-mono block leading-none">
                    PROJECT CREATOR
                  </span>
                  <span className="text-xs font-medium text-neutral-200 inline-flex items-center gap-1">
                    <span>Tran Dang Khoi</span>
                    <ExternalLink className="w-2.5 h-2.5 text-neutral-500" />
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Subfooter notice */}
          <div className="pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] font-mono text-neutral-500">
            <span>© 2026 TDK NIHONGO flicklab</span>
            <span>Minimalist Kana Interface</span>
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

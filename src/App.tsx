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

      <footer className="w-full border-t border-white/[0.08] py-4 px-4 text-xs bg-[#090A0D]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium text-neutral-400">
            <span className="font-semibold text-neutral-300">Flick Lab</span>
            <span className="text-neutral-600">•</span>
            <span className="text-neutral-500 font-mono text-[11px]">日本語フリック入力</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com/@ronaldoGoatskibidi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors group"
              title="Liên hệ Facebook Tran Dang Khoi"
            >
              <FacebookIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#1877F2] transition-colors" />
              <span className="text-xs">
                Made by <strong className="font-semibold text-neutral-200 group-hover:text-white">Tran Dang Khoi</strong>
              </span>
            </a>
          </div>
        </div>
      </footer>

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

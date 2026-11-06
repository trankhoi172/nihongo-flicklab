import React, { useState, useEffect } from 'react';
import type { PracticeMode, UserProgress } from './types/practice';
import type { UserSettings } from './types/settings';
import { loadSettings, saveSettings, loadProgress, resetAllData } from './utils/storage';
import { Header } from './components/common/Header';
import { NavigationTabs } from './components/common/NavigationTabs';
import { Dashboard } from './components/modes/Dashboard';
import { TutorialMode } from './components/modes/TutorialMode';
import { FlickPracticeMode } from './components/modes/FlickPracticeMode';
import { WordPracticeMode } from './components/modes/WordPracticeMode';
import { SpeedChallengeMode } from './components/modes/SpeedChallengeMode';
import { FreeTypingMode } from './components/modes/FreeTypingMode';
import { ProgressMode } from './components/modes/ProgressMode';
import { SettingsModal } from './components/modes/SettingsModal';

export const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<PracticeMode>('dashboard');
  const [settings, setSettings] = useState<UserSettings>(loadSettings);
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    document.body.classList.remove('theme-wabi', 'theme-light', 'theme-dark', 'dark');
    document.body.classList.add(`theme-${settings.theme}`);
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

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
    <div className="min-h-screen flex flex-col justify-between selection:bg-red-500/20">
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

          {currentMode === 'free' && (
            <FreeTypingMode settings={settings} />
          )}

          {currentMode === 'progress' && (
            <ProgressMode progress={progress} />
          )}
        </main>
      </div>

      <footer className="w-full border-t border-stone-200/80 dark:border-stone-800/80 py-4 px-4 text-center text-xs text-stone-400 dark:text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Flick Lab</span>
            <span>•</span>
            <span>日本語フリック入力の練習プラットフォーム</span>
          </div>
          <div className="text-[11px] font-mono">
            Chạm • Vuốt 4 hướng • Thành thạo gõ tiếng Nhật
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

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

      <footer className="w-full border-t border-stone-800/80 py-4 px-4 text-center text-xs text-stone-500 bg-[#090A0D]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-stone-400">
            <span>Flick Lab</span>
            <span>•</span>
            <span>日本語フリック入力の練習プラットフォーム</span>
          </div>
          <div className="text-[11px] font-mono text-stone-500">
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

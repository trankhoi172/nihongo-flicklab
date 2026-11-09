export type FlickSensitivity = 'low' | 'medium' | 'high';
export type SoundTheme = 'click' | 'bubble' | 'chime';
export type AppTheme = 'wabi' | 'light' | 'dark';
export type LanguageMeaning = 'vi' | 'en';

export interface UserSettings {
  flickSensitivity: FlickSensitivity; // low: 22px, medium: 28px, high: 38px
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  soundTheme: SoundTheme;
  showRomaji: boolean;
  showFlickHints: boolean; // shows direction guides on keyboard
  blindMode?: boolean; // Blind Flick: hides kana on keys to test muscle memory
  languageMeaning: LanguageMeaning;
  theme: AppTheme;
}

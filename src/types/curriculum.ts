import type { FlickDirection } from './keyboard';

export interface GestureStep {
  char: string;
  keyId: string;
  direction: FlickDirection;
  needsModifier?: boolean;
  modifierCount?: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  lessonNumber: number;
  title: string;
  japaneseTitle: string;
  objective: string;
  description: string;
  rules: string[];
  steps: GestureStep[];
  practiceTargets: string[]; // sequence of chars/words to type to pass lesson
}

export interface CurriculumModule {
  id: string;
  moduleNumber: number;
  title: string;
  japaneseTitle: string;
  description: string;
  level: 'Nền tảng' | 'Cơ bản' | 'Trung cấp' | 'Nâng cao' | 'Chuyên sâu';
  lessons: Lesson[];
}

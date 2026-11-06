export type FlickDirection = 'center' | 'left' | 'up' | 'right' | 'down';

export interface KanaMap {
  center: string; // tap (vowel: a)
  left: string;   // flick left (vowel: i)
  up: string;     // flick up (vowel: u)
  right: string;  // flick right (vowel: e)
  down: string;   // flick down (vowel: o)
}

export type KeyType = 'kana' | 'modifier' | 'punctuation' | 'action';

export interface KeyDefinition {
  id: string;
  rowName: string; // e.g. "あ行", "か行", "わ行"
  hiragana: KanaMap;
  katakana: KanaMap;
  romaji: Record<FlickDirection, string>;
  isModifier?: boolean; // ゛゜小 key
  isPunctuation?: boolean;
}

export interface KeyboardEventPayload {
  keyId: string;
  direction: FlickDirection;
  char: string;
  isModifier?: boolean;
}

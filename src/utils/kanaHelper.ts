import { KEYBOARD_LAYOUT, MODIFIER_CYCLES } from '../constants/keyboardLayout';
import type { FlickDirection } from '../types/keyboard';
import type { KanaRowId, KanaTarget } from '../types/practice';

export function toKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) + 0x60);
  });
}

export function toHiragana(str: string): string {
  return str.replace(/[\u30A1-\u30F6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
}

export function getModifiedChar(currentChar: string): string {
  const cycle = MODIFIER_CYCLES[currentChar];
  if (!cycle || cycle.length === 0) return currentChar;
  return cycle[0];
}

export interface KanaInfo {
  char: string;
  keyId: string;
  direction: FlickDirection;
  rowId: KanaRowId;
  romaji: string;
  isKatakana: boolean;
  needsModifier: boolean;
  baseChar?: string;
  modifierType?: 'dakuten' | 'handakuten' | 'small';
}

const KANA_MAP = new Map<string, KanaInfo>();

KEYBOARD_LAYOUT.forEach((k) => {
  const directions: FlickDirection[] = ['center', 'left', 'up', 'right', 'down'];
  directions.forEach((dir) => {
    const hChar = k.hiragana[dir];
    const kChar = k.katakana[dir];
    const romaji = k.romaji[dir];
    const rowId = k.id as KanaRowId;

    if (hChar) {
      KANA_MAP.set(hChar, {
        char: hChar,
        keyId: k.id,
        direction: dir,
        rowId,
        romaji,
        isKatakana: false,
        needsModifier: false,
      });
    }

    if (kChar && kChar !== hChar) {
      KANA_MAP.set(kChar, {
        char: kChar,
        keyId: k.id,
        direction: dir,
        rowId,
        romaji,
        isKatakana: true,
        needsModifier: false,
      });
    }
  });
});

const SPECIAL_MODIFIERS: Array<{
  char: string;
  base: string;
  type: 'dakuten' | 'handakuten' | 'small';
  romaji: string;
}> = [
  { char: 'が', base: 'か', type: 'dakuten', romaji: 'ga' },
  { char: 'ぎ', base: 'き', type: 'dakuten', romaji: 'gi' },
  { char: 'ぐ', base: 'く', type: 'dakuten', romaji: 'gu' },
  { char: 'げ', base: 'け', type: 'dakuten', romaji: 'ge' },
  { char: 'ご', base: 'こ', type: 'dakuten', romaji: 'go' },

  { char: 'ざ', base: 'さ', type: 'dakuten', romaji: 'za' },
  { char: 'じ', base: 'し', type: 'dakuten', romaji: 'ji' },
  { char: 'ず', base: 'す', type: 'dakuten', romaji: 'zu' },
  { char: 'ぜ', base: 'せ', type: 'dakuten', romaji: 'ze' },
  { char: 'ぞ', base: 'そ', type: 'dakuten', romaji: 'zo' },

  { char: 'だ', base: 'た', type: 'dakuten', romaji: 'da' },
  { char: 'ぢ', base: 'ち', type: 'dakuten', romaji: 'ji' },
  { char: 'づ', base: 'つ', type: 'dakuten', romaji: 'zu' },
  { char: 'で', base: 'て', type: 'dakuten', romaji: 'de' },
  { char: 'ど', base: 'と', type: 'dakuten', romaji: 'do' },

  { char: 'ば', base: 'は', type: 'dakuten', romaji: 'ba' },
  { char: 'び', base: 'ひ', type: 'dakuten', romaji: 'bi' },
  { char: 'ぶ', base: 'ふ', type: 'dakuten', romaji: 'bu' },
  { char: 'べ', base: 'へ', type: 'dakuten', romaji: 'be' },
  { char: 'ぼ', base: 'ほ', type: 'dakuten', romaji: 'bo' },

  { char: 'ぱ', base: 'は', type: 'handakuten', romaji: 'pa' },
  { char: 'ぴ', base: 'ひ', type: 'handakuten', romaji: 'pi' },
  { char: 'ぷ', base: 'ふ', type: 'handakuten', romaji: 'pu' },
  { char: 'ぺ', base: 'へ', type: 'handakuten', romaji: 'pe' },
  { char: 'ぽ', base: 'ほ', type: 'handakuten', romaji: 'po' },

  { char: 'っ', base: 'つ', type: 'small', romaji: 'tsu (sokuon)' },
  { char: 'ゃ', base: 'や', type: 'small', romaji: 'ya' },
  { char: 'ゅ', base: 'ゆ', type: 'small', romaji: 'yu' },
  { char: 'ょ', base: 'よ', type: 'small', romaji: 'yo' },
  { char: 'ぁ', base: 'あ', type: 'small', romaji: 'a' },
  { char: 'ぃ', base: 'い', type: 'small', romaji: 'i' },
  { char: 'ぅ', base: 'う', type: 'small', romaji: 'u' },
  { char: 'ぇ', base: 'え', type: 'small', romaji: 'e' },
  { char: 'ぉ', base: 'お', type: 'small', romaji: 'o' },
];

SPECIAL_MODIFIERS.forEach(({ char, base, type, romaji }) => {
  const baseInfo = KANA_MAP.get(base);
  if (baseInfo) {
    KANA_MAP.set(char, {
      char,
      keyId: baseInfo.keyId,
      direction: baseInfo.direction,
      rowId: type === 'small' ? 'small' : 'dakuten',
      romaji,
      isKatakana: false,
      needsModifier: true,
      baseChar: base,
      modifierType: type,
    });

    const katChar = toKatakana(char);
    const katBase = toKatakana(base);
    KANA_MAP.set(katChar, {
      char: katChar,
      keyId: baseInfo.keyId,
      direction: baseInfo.direction,
      rowId: type === 'small' ? 'small' : 'dakuten',
      romaji,
      isKatakana: true,
      needsModifier: true,
      baseChar: katBase,
      modifierType: type,
    });
  }
});

export function getKanaInfo(char: string): KanaInfo | undefined {
  return KANA_MAP.get(char);
}

export function getPracticeTargets(rowFilter: KanaRowId | 'all'): KanaTarget[] {
  const targets: KanaTarget[] = [];

  KANA_MAP.forEach((info) => {
    if (info.isKatakana) return;

    if (rowFilter === 'all') {
      targets.push({
        char: info.char,
        keyId: info.keyId,
        direction: info.direction,
        rowId: info.rowId,
        romaji: info.romaji,
        needsModifier: info.needsModifier,
        baseChar: info.baseChar,
        modifierType: info.modifierType,
      });
    } else if (info.rowId === rowFilter) {
      targets.push({
        char: info.char,
        keyId: info.keyId,
        direction: info.direction,
        rowId: info.rowId,
        romaji: info.romaji,
        needsModifier: info.needsModifier,
        baseChar: info.baseChar,
        modifierType: info.modifierType,
      });
    }
  });

  return targets;
}

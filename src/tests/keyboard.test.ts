import { describe, it, expect } from 'vitest';
import { KEYBOARD_LAYOUT } from '../constants/keyboardLayout';
import { VOCABULARY_LIST } from '../constants/vocabulary';
import {
  getKanaInfo,
  getModifiedChar,
  applyModifier,
  isReachableInCycle,
  toHiragana,
  toKatakana,
  getPracticeTargets,
} from '../utils/kanaHelper';

describe('Japanese 12-Key Keyboard Layout', () => {
  it('should have exactly 12 keys arranged in 4 rows x 3 columns', () => {
    expect(KEYBOARD_LAYOUT).toHaveLength(12);
  });

  it('should contain all 10 standard Kana rows plus punctuation and modifier keys', () => {
    const keyIds = KEYBOARD_LAYOUT.map((k) => k.id);
    expect(keyIds).toEqual([
      'a', 'ka', 'sa',
      'ta', 'na', 'ha',
      'ma', 'ya', 'ra',
      'wa', 'sym', 'mod',
    ]);
  });

  it('should follow authentic 5-vowel flick mapping for the A row (あ行)', () => {
    const aKey = KEYBOARD_LAYOUT.find((k) => k.id === 'a')!;
    expect(aKey.hiragana.center).toBe('あ'); // Tap
    expect(aKey.hiragana.left).toBe('い');   // Left
    expect(aKey.hiragana.up).toBe('う');     // Up
    expect(aKey.hiragana.right).toBe('え');  // Right
    expect(aKey.hiragana.down).toBe('お');   // Down
  });

  it('should follow authentic 5-vowel flick mapping for the Ka row (か行)', () => {
    const kaKey = KEYBOARD_LAYOUT.find((k) => k.id === 'ka')!;
    expect(kaKey.hiragana.center).toBe('か');
    expect(kaKey.hiragana.left).toBe('き');
    expect(kaKey.hiragana.up).toBe('く');
    expect(kaKey.hiragana.right).toBe('け');
    expect(kaKey.hiragana.down).toBe('こ');
  });

  it('should follow authentic 5-vowel flick mapping for the Sa row (さ行)', () => {
    const saKey = KEYBOARD_LAYOUT.find((k) => k.id === 'sa')!;
    expect(saKey.hiragana.center).toBe('さ');
    expect(saKey.hiragana.left).toBe('し');
    expect(saKey.hiragana.up).toBe('す');
    expect(saKey.hiragana.right).toBe('せ');
    expect(saKey.hiragana.down).toBe('そ');
  });

  it('should follow authentic 5-vowel flick mapping for the Ta row (た行)', () => {
    const taKey = KEYBOARD_LAYOUT.find((k) => k.id === 'ta')!;
    expect(taKey.hiragana.center).toBe('た');
    expect(taKey.hiragana.left).toBe('ち');
    expect(taKey.hiragana.up).toBe('つ');
    expect(taKey.hiragana.right).toBe('て');
    expect(taKey.hiragana.down).toBe('と');
  });

  it('should follow authentic 5-vowel flick mapping for the Wa row (わ行)', () => {
    const waKey = KEYBOARD_LAYOUT.find((k) => k.id === 'wa')!;
    expect(waKey.hiragana.center).toBe('わ');
    expect(waKey.hiragana.left).toBe('を');
    expect(waKey.hiragana.up).toBe('ん');
    expect(waKey.hiragana.right).toBe('ー');
  });

  it('should have authentic punctuation on the 記号 key', () => {
    const symKey = KEYBOARD_LAYOUT.find((k) => k.id === 'sym')!;
    expect(symKey.hiragana.center).toBe('、');
    expect(symKey.hiragana.left).toBe('。');
    expect(symKey.hiragana.up).toBe('？');
    expect(symKey.hiragana.right).toBe('！');
  });
});

describe('Modifier Transformations (Dakuten / Handakuten / Small Kana)', () => {
  it('should correctly transform Ka -> Ga', () => {
    expect(getModifiedChar('か')).toBe('が');
    expect(getModifiedChar('き')).toBe('ぎ');
  });

  it('should correctly transform Ha -> Ba -> Pa -> Ha cycle', () => {
    const ba = getModifiedChar('は');
    expect(ba).toBe('ば');
    const pa = getModifiedChar(ba);
    expect(pa).toBe('ぱ');
    const ha = getModifiedChar(pa);
    expect(ha).toBe('は');
  });

  it('should correctly transform Tsu -> small sokuon っ', () => {
    const sokuon = getModifiedChar('つ');
    expect(sokuon).toBe('っ');
    const dzu = getModifiedChar(sokuon);
    expect(dzu).toBe('づ');
  });

  it('should correctly transform Ya -> small ゃ', () => {
    expect(getModifiedChar('や')).toBe('ゃ');
    expect(getModifiedChar('ゆ')).toBe('ゅ');
    expect(getModifiedChar('よ')).toBe('ょ');
  });

  it('should support directional modifier transformations with applyModifier', () => {
    // Dakuten flick (left)
    expect(applyModifier('は', 'left')).toBe('ば');
    expect(applyModifier('か', 'left')).toBe('が');
    expect(applyModifier('さ', 'left')).toBe('ざ');

    // Handakuten flick (right)
    expect(applyModifier('は', 'right')).toBe('ぱ');
    expect(applyModifier('ば', 'right')).toBe('ぱ');
    expect(applyModifier('ひ', 'right')).toBe('ぴ');

    // Small kana flick (up)
    expect(applyModifier('つ', 'up')).toBe('っ');
    expect(applyModifier('や', 'up')).toBe('ゃ');

    // Center/tap fallback to cycle
    expect(applyModifier('は', 'center')).toBe('ば');
    expect(applyModifier('ば', 'center')).toBe('ぱ');
    expect(applyModifier('ぱ', 'center')).toBe('は');
  });

  it('should identify reachable characters in modifier cycles', () => {
    expect(isReachableInCycle('は', 'ば')).toBe(true);
    expect(isReachableInCycle('は', 'ぱ')).toBe(true);
    expect(isReachableInCycle('ば', 'ぱ')).toBe(true);
    expect(isReachableInCycle('つ', 'っ')).toBe(true);
    expect(isReachableInCycle('つ', 'づ')).toBe(true);

    expect(isReachableInCycle('か', 'ぱ')).toBe(false);
    expect(isReachableInCycle('あ', 'ば')).toBe(false);
  });
});

describe('Kana Helper & Practice Targets', () => {
  it('should convert Hiragana to Katakana and back', () => {
    expect(toKatakana('あいうえお')).toBe('アイウエオ');
    expect(toHiragana('アイウエオ')).toBe('あいうえお');
    expect(toKatakana('にほんご')).toBe('ニホンゴ');
  });

  it('should retrieve accurate KanaInfo for all characters', () => {
    const infoA = getKanaInfo('あ')!;
    expect(infoA).toBeDefined();
    expect(infoA.keyId).toBe('a');
    expect(infoA.direction).toBe('center');

    const infoI = getKanaInfo('い')!;
    expect(infoI.keyId).toBe('a');
    expect(infoI.direction).toBe('left');

    const infoGa = getKanaInfo('が')!;
    expect(infoGa.needsModifier).toBe(true);
    expect(infoGa.baseChar).toBe('か');

    const infoSokuon = getKanaInfo('っ')!;
    expect(infoSokuon.needsModifier).toBe(true);
    expect(infoSokuon.baseChar).toBe('つ');
  });

  it('should filter practice targets by row', () => {
    const aTargets = getPracticeTargets('a');
    expect(aTargets.map((t) => t.char)).toEqual(['あ', 'い', 'う', 'え', 'お']);

    const kaTargets = getPracticeTargets('ka');
    expect(kaTargets.map((t) => t.char)).toEqual(['か', 'き', 'く', 'け', 'こ']);
  });
});

describe('Vocabulary Dataset', () => {
  it('should contain 40+ curated Japanese words with Vietnamese translations', () => {
    expect(VOCABULARY_LIST.length).toBeGreaterThanOrEqual(40);
  });

  it('should include key required examples: neko, inu, sakura, arigatou, densha', () => {
    const kanaWords = VOCABULARY_LIST.map((w) => w.kana);
    expect(kanaWords).toContain('ねこ');
    expect(kanaWords).toContain('いぬ');
    expect(kanaWords).toContain('さくら');
    expect(kanaWords).toContain('ありがとう');
    expect(kanaWords).toContain('おはよう');
    expect(kanaWords).toContain('こんにちは');
    expect(kanaWords).toContain('にほんご');
    expect(kanaWords).toContain('たべもの');
    expect(kanaWords).toContain('でんしゃ');
  });

  it('should ensure all words have Vietnamese translation and valid romaji', () => {
    VOCABULARY_LIST.forEach((word) => {
      expect(word.kana).toBeTruthy();
      expect(word.meaningVi).toBeTruthy();
      expect(word.meaningEn).toBeTruthy();
      expect(word.romaji).toBeTruthy();
    });
  });
});

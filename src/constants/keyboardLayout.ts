import type { KeyDefinition, FlickDirection } from '../types/keyboard';

export const KEYBOARD_LAYOUT: KeyDefinition[] = [
  // Row 1
  {
    id: 'a',
    rowName: 'あ行',
    hiragana: { center: 'あ', left: 'い', up: 'う', right: 'え', down: 'お' },
    katakana: { center: 'ア', left: 'イ', up: 'ウ', right: 'エ', down: 'オ' },
    romaji: { center: 'a', left: 'i', up: 'u', right: 'e', down: 'o' },
  },
  {
    id: 'ka',
    rowName: 'か行',
    hiragana: { center: 'か', left: 'き', up: 'く', right: 'け', down: 'こ' },
    katakana: { center: 'カ', left: 'キ', up: 'ク', right: 'ケ', down: 'コ' },
    romaji: { center: 'ka', left: 'ki', up: 'ku', right: 'ke', down: 'ko' },
  },
  {
    id: 'sa',
    rowName: 'さ行',
    hiragana: { center: 'さ', left: 'し', up: 'す', right: 'せ', down: 'そ' },
    katakana: { center: 'サ', left: 'シ', up: 'ス', right: 'セ', down: 'ソ' },
    romaji: { center: 'sa', left: 'shi', up: 'su', right: 'se', down: 'so' },
  },

  // Row 2
  {
    id: 'ta',
    rowName: 'た行',
    hiragana: { center: 'た', left: 'ち', up: 'つ', right: 'て', down: 'と' },
    katakana: { center: 'タ', left: 'チ', up: 'ツ', right: 'テ', down: 'ト' },
    romaji: { center: 'ta', left: 'chi', up: 'tsu', right: 'te', down: 'to' },
  },
  {
    id: 'na',
    rowName: 'な行',
    hiragana: { center: 'な', left: 'に', up: 'ぬ', right: 'ね', down: 'の' },
    katakana: { center: 'ナ', left: 'ニ', up: 'ヌ', right: 'ネ', down: 'ノ' },
    romaji: { center: 'na', left: 'ni', up: 'nu', right: 'ne', down: 'no' },
  },
  {
    id: 'ha',
    rowName: 'は行',
    hiragana: { center: 'は', left: 'ひ', up: 'ふ', right: 'へ', down: 'ほ' },
    katakana: { center: 'ハ', left: 'ヒ', up: 'フ', right: 'ヘ', down: 'ホ' },
    romaji: { center: 'ha', left: 'hi', up: 'fu', right: 'he', down: 'ho' },
  },

  // Row 3
  {
    id: 'ma',
    rowName: 'ま行',
    hiragana: { center: 'ま', left: 'み', up: 'む', right: 'め', down: 'も' },
    katakana: { center: 'マ', left: 'ミ', up: 'ム', right: 'メ', down: 'モ' },
    romaji: { center: 'ma', left: 'mi', up: 'mu', right: 'me', down: 'mo' },
  },
  {
    id: 'ya',
    rowName: 'や行',
    hiragana: { center: 'や', left: '（', up: 'ゆ', right: '）', down: 'よ' },
    katakana: { center: 'ヤ', left: '（', up: 'ユ', right: '）', down: 'ヨ' },
    romaji: { center: 'ya', left: '(', up: 'yu', right: ')', down: 'yo' },
  },
  {
    id: 'ra',
    rowName: 'ら行',
    hiragana: { center: 'ら', left: 'り', up: 'る', right: 'れ', down: 'ろ' },
    katakana: { center: 'ラ', left: 'リ', up: 'ル', right: 'レ', down: 'ロ' },
    romaji: { center: 'ra', left: 'ri', up: 'ru', right: 're', down: 'ro' },
  },

  // Row 4
  {
    id: 'wa',
    rowName: 'わ行',
    hiragana: { center: 'わ', left: 'を', up: 'ん', right: 'ー', down: '〜' },
    katakana: { center: 'ワ', left: 'ヲ', up: 'ン', right: 'ー', down: '〜' },
    romaji: { center: 'wa', left: 'wo', up: 'n', right: '-', down: '~' },
  },
  {
    id: 'sym',
    rowName: '記号',
    isPunctuation: true,
    hiragana: { center: '、', left: '。', up: '？', right: '！', down: '…' },
    katakana: { center: '、', left: '。', up: '？', right: '！', down: '…' },
    romaji: { center: ',', left: '.', up: '?', right: '!', down: '...' },
  },
  {
    id: 'mod',
    rowName: '゛゜小',
    isModifier: true,
    hiragana: { center: '゛゜小', left: '゛', up: '小', right: '゜', down: '゛゜小' },
    katakana: { center: '゛゜小', left: '゛', up: '小', right: '゜', down: '゛゜小' },
    romaji: { center: 'mod', left: 'dakuten', up: 'small', right: 'handakuten', down: 'mod' },
  },
];

// Dakuten / Handakuten / Small cycles for transformation
export const MODIFIER_CYCLES: Record<string, string[]> = {
  'か': ['が', 'か'], 'き': ['ぎ', 'き'], 'く': ['ぐ', 'く'], 'け': ['げ', 'け'], 'こ': ['ご', 'こ'],
  'カ': ['ガ', 'カ'], 'キ': ['ギ', 'キ'], 'ク': ['グ', 'ク'], 'ケ': ['ゲ', 'ケ'], 'コ': ['ゴ', 'コ'],

  'さ': ['ざ', 'さ'], 'し': ['じ', 'し'], 'す': ['ず', 'す'], 'せ': ['ぜ', 'せ'], 'そ': ['ぞ', 'そ'],
  'サ': ['ザ', 'サ'], 'シ': ['ジ', 'シ'], 'ス': ['ズ', 'ス'], 'セ': ['ゼ', 'セ'], 'ソ': ['ゾ', 'ソ'],

  'た': ['だ', 'た'], 'ち': ['ぢ', 'ち'], 'て': ['で', 'て'], 'と': ['ど', 'と'],
  'つ': ['っ', 'づ', 'つ'],
  'タ': ['ダ', 'タ'], 'チ': ['ヂ', 'チ'], 'テ': ['デ', 'テ'], 'ト': ['ド', 'ト'],
  'ツ': ['ッ', 'ヅ', 'ツ'],

  'は': ['ば', 'ぱ', 'は'], 'ひ': ['び', 'ぴ', 'ひ'], 'ふ': ['ぶ', 'ぷ', 'ふ'], 'へ': ['べ', 'ぺ', 'へ'], 'ほ': ['ぼ', 'ぽ', 'ほ'],
  'ハ': ['バ', 'パ', 'ハ'], 'ヒ': ['ビ', 'ピ', 'ヒ'], 'フ': ['ブ', 'プ', 'フ'], 'ヘ': ['ベ', 'ペ', 'ヘ'], 'ホ': ['ボ', 'ポ', 'ホ'],

  'あ': ['ぁ', 'あ'], 'い': ['ぃ', 'い'], 'う': ['ぅ', 'ゔ', 'う'], 'え': ['ぇ', 'え'], 'お': ['ぉ', 'お'],
  'ア': ['ァ', 'ア'], 'イ': ['ィ', 'イ'], 'ウ': ['ゥ', 'ヴ', 'ウ'], 'エ': ['ェ', 'エ'], 'オ': ['ォ', 'オ'],

  'や': ['ゃ', 'や'], 'ゆ': ['ゅ', 'ゆ'], 'よ': ['ょ', 'よ'],
  'ヤ': ['ャ', 'ヤ'], 'ユ': ['ュ', 'ユ'], 'ヨ': ['ョ', 'ヨ'],

  'わ': ['ゎ', 'わ'],
  'ワ': ['ヮ', 'ワ'],

  'が': ['か'], 'ぎ': ['き'], 'ぐ': ['く'], 'げ': ['け'], 'ご': ['こ'],
  'ガ': ['カ'], 'ギ': ['キ'], 'グ': ['ク'], 'ゲ': ['ケ'], 'ゴ': ['コ'],
  'ざ': ['さ'], 'じ': ['し'], 'ず': ['す'], 'ぜ': ['せ'], 'ぞ': ['そ'],
  'ザ': ['サ'], 'ジ': ['シ'], 'ズ': ['ス'], 'ゼ': ['セ'], 'ゾ': ['ソ'],
  'だ': ['た'], 'ぢ': ['ち'], 'づ': ['つ'], 'で': ['て'], 'ど': ['と'],
  'ダ': ['タ'], 'ヂ': ['チ'], 'ヅ': ['ツ'], 'デ': ['テ'], 'ド': ['ト'],
  'っ': ['づ', 'つ'], 'ッ': ['ヅ', 'ツ'],
  'ば': ['ぱ', 'は'], 'び': ['ぴ', 'ひ'], 'ぶ': ['ぷ', 'ふ'], 'べ': ['ぺ', 'へ'], 'ぼ': ['ぽ', 'ほ'],
  'バ': ['パ', 'ハ'], 'ビ': ['ピ', 'ヒ'], 'ブ': ['プ', 'フ'], 'ベ': ['ペ', 'ヘ'], 'ボ': ['ポ', 'ホ'],
  'ぱ': ['は'], 'ぴ': ['ひ'], 'ぷ': ['ふ'], 'ぺ': ['へ'], 'ぽ': ['ほ'],
  'パ': ['ハ'], 'ピ': ['ヒ'], 'プ': ['フ'], 'ペ': ['ヘ'], 'ポ': ['ホ'],
  'ぁ': ['あ'], 'ぃ': ['い'], 'ぅ': ['ゔ', 'う'], 'ゔ': ['う'], 'ぇ': ['え'], 'ぉ': ['お'],
  'ァ': ['ア'], 'ィ': ['イ'], 'ゥ': ['ヴ', 'ウ'], 'ヴ': ['ウ'], 'ェ': ['エ'], 'ォ': ['オ'],
  'ゃ': ['や'], 'ゅ': ['ゆ'], 'ょ': ['よ'],
  'ャ': ['ヤ'], 'ュ': ['ユ'], 'ョ': ['ヨ'],
  'ゎ': ['わ'], 'ヮ': ['ワ'],
};

export const DIRECTION_CONFIG: Record<FlickDirection, { label: string; arrow: string; short: string }> = {
  center: { label: 'Tap', arrow: '●', short: 'A-vowel' },
  left: { label: 'Left', arrow: '←', short: 'I-vowel' },
  up: { label: 'Up', arrow: '↑', short: 'U-vowel' },
  right: { label: 'Right', arrow: '→', short: 'E-vowel' },
  down: { label: 'Down', arrow: '↓', short: 'O-vowel' },
};

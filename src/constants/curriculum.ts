import type { CurriculumModule } from '../types/curriculum';

export const CURRICULUM_MODULES: CurriculumModule[] = [
  // ==========================================
  // MODULE 1: NGUYÊN TẮC CỐT LÕI & HÀNG A (あ行)
  // ==========================================
  {
    id: 'mod-1',
    moduleNumber: 1,
    title: 'Nhập môn & 5 Nguyên âm Cốt lõi',
    japaneseTitle: '基本母音（あ行）とフリックの原則',
    level: 'Nền tảng',
    description: 'Hiểu cấu trúc 12 ô phím và quy tắc vàng 5 hướng vuốt tương ứng với 5 nguyên âm Nhật Bản: A - I - U - E - O.',
    lessons: [
      {
        id: 'les-1',
        moduleId: 'mod-1',
        lessonNumber: 1,
        title: 'Quy tắc vàng 5 hướng vuốt (A-I-U-E-O)',
        japaneseTitle: '5母音フリックの法則',
        objective: 'Nắm vững hướng vuốt của 5 nguyên âm trên bất kỳ phím nào.',
        description: 'Mỗi ô phím trên bàn phím 12 phím đại diện cho một hàng âm. Chạm vào tâm phím sẽ ra nguyên âm A, vuốt theo 4 hướng kim đồng hồ lệch sẽ ra 4 nguyên âm còn lại.',
        rules: [
          'Chạm tâm phím (Tap) ➔ Nguyên âm A (あ, か, さ...)',
          'Vuốt sang Trái (←) ➔ Nguyên âm I (い, き, し...)',
          'Vuốt Lên trên (↑) ➔ Nguyên âm U (う, く, す...)',
          'Vuốt sang Phải (→) ➔ Nguyên âm E (え, け, せ...)',
          'Vuốt Xuống dưới (↓) ➔ Nguyên âm O (お, こ, そ...)',
        ],
        steps: [
          { char: 'あ', keyId: 'a', direction: 'center', explanation: 'Chạm nhẹ tâm phím [あ]' },
          { char: 'い', keyId: 'a', direction: 'left', explanation: 'Chạm phím [あ] rồi vuốt sang TRÁI (←)' },
          { char: 'う', keyId: 'a', direction: 'up', explanation: 'Chạm phím [あ] rồi vuốt LÊN TRÊN (↑)' },
          { char: 'え', keyId: 'a', direction: 'right', explanation: 'Chạm phím [あ] rồi vuốt sang PHẢI (→)' },
          { char: 'お', keyId: 'a', direction: 'down', explanation: 'Chạm phím [あ] rồi vuốt XUỐNG DƯỚI (↓)' },
        ],
        practiceTargets: ['あ', 'い', 'う', 'え', 'お', 'あい', 'うえ', 'あお'],
      },
      {
        id: 'les-2',
        moduleId: 'mod-1',
        lessonNumber: 2,
        title: 'Phản xạ cơ bắp hàng あ行',
        japaneseTitle: 'あ行の反復練習',
        objective: 'Gõ thành thạo và liền mạch các chữ thuộc hàng あ mà không cần nhìn hướng dẫn.',
        description: 'Luyện tập phối hợp các hướng vuốt ngón tay cho hàng あ để hình thành phản xạ tự nhiên.',
        rules: [
          'Giữ ngón tay thư giãn, thao tác vuốt dứt khoát',
          'Không cần nhấc ngón tay quá cao, chỉ trượt nhẹ trên màn hình',
        ],
        steps: [
          { char: 'い', keyId: 'a', direction: 'left', explanation: 'Vuốt trái (←)' },
          { char: 'え', keyId: 'a', direction: 'right', explanation: 'Vuốt phải (→)' },
          { char: 'お', keyId: 'a', direction: 'down', explanation: 'Vuốt xuống (↓)' },
          { char: 'う', keyId: 'a', direction: 'up', explanation: 'Vuốt lên (↑)' },
          { char: 'あ', keyId: 'a', direction: 'center', explanation: 'Chạm tâm phím (●)' },
        ],
        practiceTargets: ['い', 'え', 'お', 'う', 'あ', 'いえ', 'あお', 'いう'],
      },
    ],
  },

  // ==========================================
  // MODULE 2: HỆ THỐNG ÂM TRONG (清音 - SEION)
  // ==========================================
  {
    id: 'mod-2',
    moduleNumber: 2,
    title: '9 Hàng Phụ âm Thanh âm (Seion)',
    japaneseTitle: '清音（か行〜わ行）の完全習得',
    level: 'Cơ bản',
    description: 'Chinh phục toàn bộ các hàng phụ âm cơ bản từ Ka, Sa, Ta, Na, Ha, Ma, Ya, Ra đến Wa theo đúng thứ tự 12 phím.',
    lessons: [
      {
        id: 'les-3',
        moduleId: 'mod-2',
        lessonNumber: 3,
        title: 'Hàng K — か行 (Ka, Ki, Ku, Ke, Ko)',
        japaneseTitle: 'か行の入力',
        objective: 'Làm chủ phím số 2 (か) và 5 ký tự hàng Ka.',
        description: 'Phím [か] nằm ở giữa hàng trên cùng (ngay bên phải phím あ). Áp dụng quy tắc 5 nguyên âm tương tự.',
        rules: [
          'か (Tap), き (Vuốt Trái), く (Vuốt Lên), け (Vuốt Phải), こ (Vuốt Dưới)',
        ],
        steps: [
          { char: 'か', keyId: 'ka', direction: 'center', explanation: 'Chạm tâm phím [か]' },
          { char: 'き', keyId: 'ka', direction: 'left', explanation: 'Vuốt sang TRÁI phím [か]' },
          { char: 'く', keyId: 'ka', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [か]' },
          { char: 'け', keyId: 'ka', direction: 'right', explanation: 'Vuốt sang PHẢI phím [か]' },
          { char: 'こ', keyId: 'ka', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [か]' },
        ],
        practiceTargets: ['か', 'き', 'く', 'け', 'こ', 'きく', 'ここ', 'かき', 'あき'],
      },
      {
        id: 'les-4',
        moduleId: 'mod-2',
        lessonNumber: 4,
        title: 'Hàng S — さ行 (Sa, Shi, Su, Se, So)',
        japaneseTitle: 'さ行の入力',
        objective: 'Làm chủ phím số 3 (さ) ở góc trên bên phải.',
        description: 'Hàng S gồm âm Sa, Shi, Su, Se, So. Chú ý âm [し] đọc là Shi, [す] đọc là Su.',
        rules: [
          'さ (Tap), し (Vuốt Trái), す (Vuốt Lên), せ (Vuốt Phải), そ (Vuốt Dưới)',
        ],
        steps: [
          { char: 'さ', keyId: 'sa', direction: 'center', explanation: 'Chạm tâm phím [さ]' },
          { char: 'し', keyId: 'sa', direction: 'left', explanation: 'Vuốt sang TRÁI phím [さ]' },
          { char: 'す', keyId: 'sa', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [さ]' },
          { char: 'せ', keyId: 'sa', direction: 'right', explanation: 'Vuốt sang PHẢI phím [さ]' },
          { char: 'そ', keyId: 'sa', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [さ]' },
        ],
        practiceTargets: ['さ', 'し', 'す', 'せ', 'そ', 'すし', 'あさ', 'さけ', 'そこ'],
      },
      {
        id: 'les-5',
        moduleId: 'mod-2',
        lessonNumber: 5,
        title: 'Hàng T — た行 (Ta, Chi, Tsu, Te, To)',
        japaneseTitle: 'た行の入力',
        objective: 'Làm chủ phím số 4 (た) ở đầu hàng 2 bên trái.',
        description: 'Hàng T có 2 âm đặc biệt: Chi [ち] (vuốt trái) và Tsu [つ] (vuốt lên). Chữ つ còn là cội nguồn của âm ngắt っ sau này.',
        rules: [
          'た (Tap), ち (Vuốt Trái), つ (Vuốt Lên), て (Vuốt Phải), と (Vuốt Dưới)',
        ],
        steps: [
          { char: 'た', keyId: 'ta', direction: 'center', explanation: 'Chạm tâm phím [た]' },
          { char: 'ち', keyId: 'ta', direction: 'left', explanation: 'Vuốt sang TRÁI phím [た]' },
          { char: 'つ', keyId: 'ta', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [た]' },
          { char: 'て', keyId: 'ta', direction: 'right', explanation: 'Vuốt sang PHẢI phím [た]' },
          { char: 'と', keyId: 'ta', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [た]' },
        ],
        practiceTargets: ['た', 'ち', 'つ', 'て', 'と', 'うた', 'つき', 'てと', 'たこ'],
      },
      {
        id: 'les-6',
        moduleId: 'mod-2',
        lessonNumber: 6,
        title: 'Hàng N — な行 (Na, Ni, Nu, Ne, No)',
        japaneseTitle: 'な行の入力',
        objective: 'Làm chủ phím số 5 (な) ở chính giữa bàn phím.',
        description: 'Phím [な] nằm ngay trung tâm bàn phím (Row 2, Col 2), là vị trí trụ quan trọng nhất khi gõ 1 tay hoặc 2 tay.',
        rules: [
          'な (Tap), に (Vuốt Trái), ぬ (Vuốt Lên), ね (Vuốt Phải), の (Vuốt Dưới)',
        ],
        steps: [
          { char: 'な', keyId: 'na', direction: 'center', explanation: 'Chạm tâm phím [な]' },
          { char: 'に', keyId: 'na', direction: 'left', explanation: 'Vuốt sang TRÁI phím [な]' },
          { char: 'ぬ', keyId: 'na', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [な]' },
          { char: 'ね', keyId: 'na', direction: 'right', explanation: 'Vuốt sang PHẢI phím [な]' },
          { char: 'の', keyId: 'na', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [な]' },
        ],
        practiceTargets: ['な', 'に', 'ぬ', 'ね', 'の', 'ねこ', 'いぬ', 'なつ', 'きの'],
      },
      {
        id: 'les-7',
        moduleId: 'mod-2',
        lessonNumber: 7,
        title: 'Hàng H — は行 (Ha, Hi, Fu, He, Ho)',
        japaneseTitle: 'は行の入力',
        objective: 'Làm chủ phím số 6 (は) ở bên phải hàng 2.',
        description: 'Hàng H có âm [ふ] đọc là Fu. Sau này phím [は] kết hợp với phím biến âm sẽ tạo ra cả hàng Ba và hàng Pa.',
        rules: [
          'は (Tap), ひ (Vuốt Trái), ふ (Vuốt Lên), へ (Vuốt Phải), ほ (Vuốt Dưới)',
        ],
        steps: [
          { char: 'は', keyId: 'ha', direction: 'center', explanation: 'Chạm tâm phím [は]' },
          { char: 'ひ', keyId: 'ha', direction: 'left', explanation: 'Vuốt sang TRÁI phím [は]' },
          { char: 'ふ', keyId: 'ha', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [は]' },
          { char: 'へ', keyId: 'ha', direction: 'right', explanation: 'Vuốt sang PHẢI phím [は]' },
          { char: 'ほ', keyId: 'ha', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [は]' },
        ],
        practiceTargets: ['は', 'ひ', 'ふ', 'へ', 'ほ', 'はな', 'ひと', 'ふね', 'ほし'],
      },
      {
        id: 'les-8',
        moduleId: 'mod-2',
        lessonNumber: 8,
        title: 'Hàng M — ま行 (Ma, Mi, Mu, Me, Mo)',
        japaneseTitle: 'ま行の入力',
        objective: 'Làm chủ phím số 7 (ま) ở góc trái hàng 3.',
        description: 'Hàng M gồm Ma, Mi, Mu, Me, Mo.',
        rules: [
          'ま (Tap), み (Vuốt Trái), む (Vuốt Lên), め (Vuốt Phải), も (Vuốt Dưới)',
        ],
        steps: [
          { char: 'ま', keyId: 'ma', direction: 'center', explanation: 'Chạm tâm phím [ま]' },
          { char: 'み', keyId: 'ma', direction: 'left', explanation: 'Vuốt sang TRÁI phím [ま]' },
          { char: 'む', keyId: 'ma', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [ま]' },
          { char: 'め', keyId: 'ma', direction: 'right', explanation: 'Vuốt sang PHẢI phím [ま]' },
          { char: 'も', keyId: 'ma', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [ま]' },
        ],
        practiceTargets: ['ま', 'み', 'む', 'め', 'も', 'みず', 'あめ', 'まち', 'くも'],
      },
      {
        id: 'les-9',
        moduleId: 'mod-2',
        lessonNumber: 9,
        title: 'Hàng Y — や行 (Ya, Yu, Yo) & Dấu ngoặc',
        japaneseTitle: 'や行と括弧の入力',
        objective: 'Hiểu cấu trúc đặc biệt của hàng Ya: chỉ có 3 nguyên âm và 2 dấu ngoặc.',
        description: 'Tiếng Nhật không có Yi và Ye, do đó phím [や] có: Tap = や, Vuốt Lên = ゆ, Vuốt Dưới = よ. Vuốt Trái = ngoặc mở （, Vuốt Phải = ngoặc đóng ）.',
        rules: [
          'や (Tap), （ (Vuốt Trái), ゆ (Vuốt Lên), ） (Vuốt Phải), よ (Vuốt Dưới)',
        ],
        steps: [
          { char: 'や', keyId: 'ya', direction: 'center', explanation: 'Chạm tâm phím [や]' },
          { char: 'ゆ', keyId: 'ya', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [や]' },
          { char: 'よ', keyId: 'ya', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [や]' },
        ],
        practiceTargets: ['や', 'ゆ', 'よ', 'やま', 'ゆき', 'よる', 'へや'],
      },
      {
        id: 'les-10',
        moduleId: 'mod-2',
        lessonNumber: 10,
        title: 'Hàng R — ら行 (Ra, Ri, Ru, Re, Ro)',
        japaneseTitle: 'ら行の入力',
        objective: 'Làm chủ phím số 9 (ら) ở bên phải hàng 3.',
        description: 'Hàng R gồm Ra, Ri, Ru, Re, Ro. Phát âm uốn lưỡi nhẹ giữa R và L.',
        rules: [
          'ら (Tap), り (Vuốt Trái), る (Vuốt Lên), れ (Vuốt Phải), ろ (Vuốt Dưới)',
        ],
        steps: [
          { char: 'ら', keyId: 'ra', direction: 'center', explanation: 'Chạm tâm phím [ら]' },
          { char: 'り', keyId: 'ra', direction: 'left', explanation: 'Vuốt sang TRÁI phím [ら]' },
          { char: 'る', keyId: 'ra', direction: 'up', explanation: 'Vuốt LÊN TRÊN phím [ら]' },
          { char: 'れ', keyId: 'ra', direction: 'right', explanation: 'Vuốt sang PHẢI phím [ら]' },
          { char: 'ろ', keyId: 'ra', direction: 'down', explanation: 'Vuốt XUỐNG DƯỚI phím [ら]' },
        ],
        practiceTargets: ['ら', 'り', 'る', 'れ', 'ろ', 'さくら', 'そら', 'くるま', 'しろ'],
      },
      {
        id: 'les-11',
        moduleId: 'mod-2',
        lessonNumber: 11,
        title: 'Hàng W & Âm mũi — わ行 (Wa, Wo, N, ー)',
        japaneseTitle: 'わ行と濁音・長音符',
        objective: 'Làm chủ phím số 10 (わ) ở góc dưới cùng bên trái.',
        description: 'Phím [わ] cực kỳ đặc biệt và thường xuyên sử dụng nhất: Chạm = わ, Vuốt Trái = を (trợ từ wo), Vuốt Lên = ん (âm mũi n), Vuốt Phải = ー (dấu trường âm chōonpu).',
        rules: [
          'わ (Tap), を (Vuốt Trái), ん (Vuốt Lên), ー (Vuốt Phải)',
        ],
        steps: [
          { char: 'わ', keyId: 'wa', direction: 'center', explanation: 'Chạm tâm phím [わ]' },
          { char: 'を', keyId: 'wa', direction: 'left', explanation: 'Vuốt sang TRÁI ➔ trợ từ [を]' },
          { char: 'ん', keyId: 'wa', direction: 'up', explanation: 'Vuốt LÊN TRÊN ➔ âm mũi [ん]' },
          { char: 'ー', keyId: 'wa', direction: 'right', explanation: 'Vuốt sang PHẢI ➔ dấu kéo dài âm [ー]' },
        ],
        practiceTargets: ['わ', 'を', 'ん', 'ー', 'ほん', 'にほん', 'わたし', 'さん'],
      },
    ],
  },

  // ==========================================
  // MODULE 3: BIẾN ÂM DAKUTEN & HANDAKUTEN
  // ==========================================
  {
    id: 'mod-3',
    moduleNumber: 3,
    title: 'Biến âm Đục & Bán đục (濁音・半濁音)',
    japaneseTitle: '濁音・半濁音と「゛゜小」キーの仕組み',
    level: 'Trung cấp',
    description: 'Cách sử dụng phím biến âm [゛゜小] ở góc dưới cùng bên phải để tạo ra âm đục (Ga, Za, Da, Ba) và âm bán đục (Pa).',
    lessons: [
      {
        id: 'les-12',
        moduleId: 'mod-3',
        lessonNumber: 12,
        title: 'Nguyên lý hoạt động phím [゛゜小]',
        japaneseTitle: '「゛゜小」キーの基本操作',
        objective: 'Hiểu quy trình 2 bước: Gõ chữ gốc trước ➔ Nhấn phím biến âm để chuyển hóa.',
        description: 'Khác với bàn phím QWERTY gõ "ga" ra が, trên bàn phím 12 phím bạn gõ âm gốc [か] trước, sau đó ấn phím [゛゜小] để biến thành [が].',
        rules: [
          'Bước 1: Gõ âm cơ bản (か, さ, た, は...)',
          'Bước 2: Ấn ngay phím [゛゜小] để thêm dấu hai chấm (゛) hoặc dấu tròn (゜)',
          'Ấn tiếp [゛゜小] sẽ luân chuyển chu kỳ (ví dụ: は ➔ ば ➔ ぱ ➔ は)',
        ],
        steps: [
          { char: 'が', keyId: 'ka', direction: 'center', needsModifier: true, explanation: 'Gõ [か] ➔ Ấn [゛゜小] để ra [が]' },
          { char: 'ざ', keyId: 'sa', direction: 'center', needsModifier: true, explanation: 'Gõ [さ] ➔ Ấn [゛゜小] để ra [ざ]' },
          { char: 'だ', keyId: 'ta', direction: 'center', needsModifier: true, explanation: 'Gõ [た] ➔ Ấn [゛゜小] để ra [だ]' },
          { char: 'ば', keyId: 'ha', direction: 'center', needsModifier: true, explanation: 'Gõ [は] ➔ Ấn [゛゜小] để ra [ば]' },
          { char: 'ぱ', keyId: 'ha', direction: 'center', needsModifier: true, modifierCount: 2, explanation: 'Gõ [は] ➔ Ấn [゛゜小] 2 lần để ra [ぱ]' },
        ],
        practiceTargets: ['が', 'ざ', 'だ', 'ば', 'ぱ', 'かぎ', 'みず', 'えき'],
      },
      {
        id: 'les-13',
        moduleId: 'mod-3',
        lessonNumber: 13,
        title: 'Hàng G — が行 (Ga, Gi, Gu, Ge, Go)',
        japaneseTitle: 'が行の入力',
        objective: 'Luyện tập biến âm cho toàn bộ hàng Ka thành hàng Ga.',
        description: 'か➔が, き➔ぎ, く➔ぐ, け➔げ, こ➔ご.',
        rules: ['Mỗi âm gõ bằng thao tác vuốt tương ứng trên phím [か], sau đó ấn [゛゜小]'],
        steps: [
          { char: 'が', keyId: 'ka', direction: 'center', needsModifier: true, explanation: 'か + ゛' },
          { char: 'ぎ', keyId: 'ka', direction: 'left', needsModifier: true, explanation: 'き + ゛' },
          { char: 'ぐ', keyId: 'ka', direction: 'up', needsModifier: true, explanation: 'く + ゛' },
          { char: 'げ', keyId: 'ka', direction: 'right', needsModifier: true, explanation: 'け + ゛' },
          { char: 'ご', keyId: 'ka', direction: 'down', needsModifier: true, explanation: 'こ + ゛' },
        ],
        practiceTargets: ['が', 'ぎ', 'ぐ', 'げ', 'ご', 'ごはん', 'まんが', 'かぎ'],
      },
      {
        id: 'les-14',
        moduleId: 'mod-3',
        lessonNumber: 14,
        title: 'Hàng Z & D — ざ行 / だ行',
        japaneseTitle: 'ざ行・だ行の入力',
        objective: 'Luyện tập biến âm hàng Sa thành Za/Ji/Zu/Ze/Zo và hàng Ta thành Da/Ji/Zu/De/Do.',
        description: 'さ➔ざ, し➔じ, す➔ず, せ➔ぜ, そ➔ぞ | た➔だ, ち➔ぢ, つ➔づ, て➔で, と➔ど.',
        rules: ['Đặc biệt: Chữ [じ] (Ji) là [し] + [゛゜小], chữ [で] (De) là [て] + [゛゜小]'],
        steps: [
          { char: 'じ', keyId: 'sa', direction: 'left', needsModifier: true, explanation: 'し (vuốt trái) + [゛゜小] ➔ じ' },
          { char: 'で', keyId: 'ta', direction: 'right', needsModifier: true, explanation: 'て (vuốt phải) + [゛゜小] ➔ で' },
          { char: 'ど', keyId: 'ta', direction: 'down', needsModifier: true, explanation: 'と (vuốt xuống) + [゛゜小] ➔ ど' },
        ],
        practiceTargets: ['じ', 'で', 'ど', 'ざ', 'でんしゃ', 'ともだち', 'みず'],
      },
      {
        id: 'les-15',
        moduleId: 'mod-3',
        lessonNumber: 15,
        title: 'Hàng B & P — ば行 / ぱ行 (Dấu hai chấm & Dấu tròn)',
        japaneseTitle: 'ば行・ぱ行の入力',
        objective: 'Nắm vững cách luân chuyển giữa dấu đục (Ba) và bán đục (Pa) trên cùng phím [は].',
        description: 'Gõ [は] ➔ ấn [゛゜小] 1 lần ra [ば] ➔ ấn [゛゜小] lần nữa ra [ぱ].',
        rules: [
          'は + 1 lần [゛゜小] ➔ ば (Ba)',
          'は + 2 lần [゛゜小] ➔ ぱ (Pa)',
        ],
        steps: [
          { char: 'ば', keyId: 'ha', direction: 'center', needsModifier: true, explanation: 'は + [゛゜小] ➔ ば' },
          { char: 'ぱ', keyId: 'ha', direction: 'center', needsModifier: true, modifierCount: 2, explanation: 'は + [゛゜小] + [゛゜小] ➔ ぱ' },
          { char: 'び', keyId: 'ha', direction: 'left', needsModifier: true, explanation: 'ひ + [゛゜小] ➔ び' },
          { char: 'ぴ', keyId: 'ha', direction: 'left', needsModifier: true, modifierCount: 2, explanation: 'ひ + 2 lần [゛゜小] ➔ ぴ' },
        ],
        practiceTargets: ['ば', 'ぱ', 'び', 'ぴ', 'たべもの', 'さんぽ', 'えんぴつ'],
      },
    ],
  },

  // ==========================================
  // MODULE 4: ÂM NGẮT SOKUON & CHỮ VIẾT NHỎ
  // ==========================================
  {
    id: 'mod-4',
    moduleNumber: 4,
    title: 'Âm ngắt Sokuon & Nguyên âm nhỏ',
    japaneseTitle: '促音（っ）と小書き文字の入力',
    level: 'Trung cấp',
    description: 'Bí quyết gõ chữ Tsu nhỏ [っ] và các nguyên âm nhỏ cực kỳ phổ biến trong tiếng Nhật.',
    lessons: [
      {
        id: 'les-16',
        moduleId: 'mod-4',
        lessonNumber: 16,
        title: 'Âm ngắt Sokuon — Chữ っ nhỏ',
        japaneseTitle: '促音「っ」の入力手順',
        objective: 'Gõ thành thạo âm ngắt っ trong các từ vựng tiếng Nhật.',
        description: 'Âm ngắt [っ] được gõ bằng cách: Vuốt LÊN trên phím [た] để ra [つ] ➔ Nhấn phím [゛゜小] để thu nhỏ thành [っ].',
        rules: [
          'Bước 1: Chạm phím [た] vuốt LÊN (↑) ➔ ra chữ [つ]',
          'Bước 2: Ấn phím [゛゜小] ➔ chữ [つ] lập tức biến thành [っ] nhỏ!',
        ],
        steps: [
          { char: 'っ', keyId: 'ta', direction: 'up', needsModifier: true, explanation: 'つ (vuốt lên) ➔ ấn [゛゜小] ➔ っ' },
        ],
        practiceTargets: ['っ', 'がっこう', 'きっぷ', 'ざっし', 'きって', 'もっと'],
      },
      {
        id: 'les-17',
        moduleId: 'mod-4',
        lessonNumber: 17,
        title: 'Các nguyên âm nhỏ (ぁ, ぃ, ぅ, ぇ, ぉ)',
        japaneseTitle: '小書き母音（ぁ・ぃ・ぅ・ぇ・ぉ）',
        objective: 'Biết cách thu nhỏ các nguyên âm để gõ từ cảm thán hoặc phiên âm hiện đại.',
        description: 'Tương tự âm ngắt, bạn gõ nguyên âm lớn trước (あ, い, う, え, お), sau đó ấn phím [゛゜小] để biến thành chữ nhỏ.',
        rules: [
          'Gõ nguyên âm tương ứng ➔ Ấn phím [゛゜小]',
        ],
        steps: [
          { char: 'ぁ', keyId: 'a', direction: 'center', needsModifier: true, explanation: 'あ + [゛゜小] ➔ ぁ' },
          { char: 'ぃ', keyId: 'a', direction: 'left', needsModifier: true, explanation: 'い + [゛゜小] ➔ ぃ' },
          { char: 'ぇ', keyId: 'a', direction: 'right', needsModifier: true, explanation: 'え + [゛゜小] ➔ ぇ' },
        ],
        practiceTargets: ['ぁ', 'ぃ', 'ぇ', 'カフェ', 'パーティー', 'チェス'],
      },
    ],
  },

  // ==========================================
  // MODULE 5: 36 ÂM GHÉP TIẾNG NHẬT (YŌON)
  // ==========================================
  {
    id: 'mod-5',
    moduleNumber: 5,
    title: 'Toàn bộ 36 Âm ghép tiếng Nhật (Yōon)',
    japaneseTitle: '拗音（ゃ・ゅ・ょ）のマスター',
    level: 'Nâng cao',
    description: 'Quy tắc ghép phụ âm cột I với các chữ ya, yu, yo nhỏ để tạo thành Kya, Shu, Cho, Nya, Hyo, Myo, Ryo, Gya, Ja, Byo, Pya.',
    lessons: [
      {
        id: 'les-18',
        moduleId: 'mod-5',
        lessonNumber: 18,
        title: 'Nguyên lý gõ âm ghép Yōon',
        japaneseTitle: '拗音の入力原則',
        objective: 'Hiểu cách gõ chữ Ya, Yu, Yo nhỏ (ゃ, ゅ, ょ).',
        description: 'Một âm ghép gồm 2 chữ: Chữ thứ nhất là âm cột I (き, し, ち...), chữ thứ hai là [や]/[ゆ]/[よ] được thu nhỏ bằng phím [゛゜小].',
        rules: [
          'Để gõ [ゃ]: Chạm phím [や] ➔ Ấn [゛゜小] ➔ [ゃ]',
          'Để gõ [ゅ]: Vuốt LÊN phím [や] ➔ Ấn [゛゜小] ➔ [ゅ]',
          'Để gõ [ょ]: Vuốt XUỐNG phím [や] ➔ Ấn [゛゜小] ➔ [ょ]',
        ],
        steps: [
          { char: 'ゃ', keyId: 'ya', direction: 'center', needsModifier: true, explanation: 'や + [゛゜小] ➔ ゃ' },
          { char: 'ゅ', keyId: 'ya', direction: 'up', needsModifier: true, explanation: 'ゆ (vuốt lên) + [゛゜小] ➔ ゅ' },
          { char: 'ょ', keyId: 'ya', direction: 'down', needsModifier: true, explanation: 'よ (vuốt xuống) + [゛゜小] ➔ ょ' },
        ],
        practiceTargets: ['ゃ', 'ゅ', 'ょ', 'おちゃ', 'きょう', 'しゃしん'],
      },
      {
        id: 'les-19',
        moduleId: 'mod-5',
        lessonNumber: 19,
        title: 'Nhóm âm ghép thanh âm: Kya, Sha, Cha',
        japaneseTitle: '清音の拗音（きゃ・しゃ・ちゃ等）',
        objective: 'Thực hành gõ tổ hợp âm ghép thông dụng nhất.',
        description: 'き+ゃ=きゃ, し+ゃ=しゃ, ち+ゃ=ちゃ, に+ゃ=にゃ, ひ+ゃ=ひゃ, み+ゃ=みゃ, り+ゃ=りゃ.',
        rules: [
          'Gõ liền tay: Gõ chữ cột I trước ➔ Gõ Ya/Yu/Yo ➔ Ấn phím [゛゜小]',
        ],
        steps: [
          { char: 'き', keyId: 'ka', direction: 'left', explanation: 'Chữ [き]' },
          { char: 'ゃ', keyId: 'ya', direction: 'center', needsModifier: true, explanation: 'Chữ [ゃ]' },
          { char: 'し', keyId: 'sa', direction: 'left', explanation: 'Chữ [し]' },
          { char: 'ゅ', keyId: 'ya', direction: 'up', needsModifier: true, explanation: 'Chữ [ゅ]' },
        ],
        practiceTargets: ['おちゃ', 'とうきょう', 'きょうと', 'しゃしん', 'りょこう', 'びょういん'],
      },
      {
        id: 'les-20',
        moduleId: 'mod-5',
        lessonNumber: 20,
        title: 'Nhóm âm ghép đục & bán đục: Gya, Ja, Byo, Pya',
        japaneseTitle: '濁音・半濁音の拗音（じゃ・びょ・ぴゃ等）',
        objective: 'Thực hành kết hợp biến âm và âm ghép trong cùng một từ.',
        description: 'Ví dụ từ "じゅぎょう" (tiết học): gồm [じゅ] (し + ゛ + ゆ + 小) và [ぎょう] (ぎ + ゛ + よ + 小 + う).',
        rules: [
          'Xử lý từng âm tiết tuần tự, không vội vàng',
        ],
        steps: [
          { char: 'じ', keyId: 'sa', direction: 'left', needsModifier: true, explanation: 'し + ゛' },
          { char: 'ゃ', keyId: 'ya', direction: 'center', needsModifier: true, explanation: 'や + 小' },
        ],
        practiceTargets: ['じゃ', 'じゅ', 'じょ', 'じゅぎょう', 'びょういん', 'じゃあ'],
      },
    ],
  },

  // ==========================================
  // MODULE 6: KÝ HIỆU & DẤU CÂU (記号・長音符)
  // ==========================================
  {
    id: 'mod-6',
    moduleNumber: 6,
    title: 'Ký hiệu, Dấu câu & Trường âm',
    japaneseTitle: '句読点（、・。）・長音符・記号',
    level: 'Cơ bản',
    description: 'Cách gõ dấu phẩy tiếng Nhật 、 dấu chấm 。 dấu hỏi ？ dấu chấm than ！ và dấu gạch nối kéo dài âm ー.',
    lessons: [
      {
        id: 'les-21',
        moduleId: 'mod-6',
        lessonNumber: 21,
        title: 'Phím Ký hiệu [記号] (、。？！…)',
        japaneseTitle: '句読点と記号キーの操作',
        objective: 'Sử dụng thuần thục phím ký hiệu nằm giữa phím [わ] và phím [゛゜小].',
        description: 'Văn bản tiếng Nhật sử dụng dấu phẩy `、` (Ten) và dấu chấm tròn `。` (Maru).',
        rules: [
          'Chạm tâm phím [記号] ➔ Dấu phẩy [、]',
          'Vuốt sang Trái (←) ➔ Dấu chấm [。]',
          'Vuốt Lên trên (↑) ➔ Dấu hỏi [？]',
          'Vuốt sang Phải (→) ➔ Dấu than [！]',
          'Vuốt Xuống dưới (↓) ➔ Dấu ba chấm […]',
        ],
        steps: [
          { char: '、', keyId: 'sym', direction: 'center', explanation: 'Chạm tâm ➔ [、]' },
          { char: '。', keyId: 'sym', direction: 'left', explanation: 'Vuốt trái ➔ [。]' },
          { char: '？', keyId: 'sym', direction: 'up', explanation: 'Vuốt lên ➔ [？]' },
          { char: '！', keyId: 'sym', direction: 'right', explanation: 'Vuốt phải ➔ [！]' },
        ],
        practiceTargets: ['、', '。', '？', '！', 'はい、そうです。', '元気ですか？'],
      },
      {
        id: 'les-22',
        moduleId: 'mod-6',
        lessonNumber: 22,
        title: 'Dấu trường âm Katakana [ー]',
        japaneseTitle: '長音符（ー）の入力',
        objective: 'Gõ thành thạo dấu trường âm kéo dài trong các từ Katakana.',
        description: 'Dấu trường âm `ー` nằm ở phím [わ] vuốt sang PHẢI (→). Cực kỳ phổ biến trong các từ như コーヒー, ラーメン, ケーキ.',
        rules: [
          'Chạm phím [わ] vuốt sang PHẢI (→) ➔ Ký tự [ー]',
        ],
        steps: [
          { char: 'ー', keyId: 'wa', direction: 'right', explanation: 'Phím [わ] vuốt sang PHẢI (→)' },
        ],
        practiceTargets: ['ー', 'コーヒー', 'ラーメン', 'ケーキ', 'ノート', 'スキー'],
      },
    ],
  },

  // ==========================================
  // MODULE 7: BẢNG CHỮ KATAKANA
  // ==========================================
  {
    id: 'mod-7',
    moduleNumber: 7,
    title: 'Bảng chữ Katakana (カタカナ入力)',
    japaneseTitle: 'カタカナ入力と外来語の練習',
    level: 'Trung cấp',
    description: 'Chuyển đổi chế độ gõ Katakana và luyện tập các từ mượn tiếng nước ngoài thông dụng.',
    lessons: [
      {
        id: 'les-23',
        moduleId: 'mod-7',
        lessonNumber: 23,
        title: 'Nút chuyển đổi [かな ⇄ カナ]',
        japaneseTitle: 'かな・カナ切り替え',
        objective: 'Sử dụng nút chuyển chế độ ở góc dưới bên trái bàn phím.',
        description: 'Nhấn nút [かな/カナ] sẽ chuyển toàn bộ bàn phím sang hiển thị chữ Katakana. Toàn bộ thao tác vuốt 5 hướng vẫn giữ nguyên 100%.',
        rules: [
          'Thao tác ngón tay vuốt 5 hướng trên Katakana hoàn toàn giống hệt Hiragana',
          'Chỉ cần chuyển đổi trạng thái bằng nút [かな/カナ]',
        ],
        steps: [
          { char: 'ア', keyId: 'a', direction: 'center', explanation: 'Chữ ア (Katakana của あ)' },
          { char: 'イ', keyId: 'a', direction: 'left', explanation: 'Chữ イ (Katakana của い)' },
          { char: 'ウ', keyId: 'a', direction: 'up', explanation: 'Chữ ウ (Katakana của う)' },
          { char: 'エ', keyId: 'a', direction: 'right', explanation: 'Chữ エ (Katakana của え)' },
          { char: 'オ', keyId: 'a', direction: 'down', explanation: 'Chữ オ (Katakana của お)' },
        ],
        practiceTargets: ['アニメ', 'テレビ', 'カメラ', 'ホテル', 'カフェ'],
      },
      {
        id: 'les-24',
        moduleId: 'mod-7',
        lessonNumber: 24,
        title: 'Từ vựng công nghệ & đời sống Katakana',
        japaneseTitle: '頻出カタカナ単語',
        objective: 'Gõ trôi chảy các từ Katakana hiện đại.',
        description: 'Luyện gõ các từ vựng xuất hiện hàng ngày trong xã hội Nhật Bản hiện đại.',
        rules: [
          'Chú ý kết hợp giữa Katakana thường, biến âm, trường âm và chữ nhỏ',
        ],
        steps: [
          { char: 'ス', keyId: 'sa', direction: 'up', explanation: 'Chữ [ス]' },
          { char: 'マ', keyId: 'ma', direction: 'center', explanation: 'Chữ [マ]' },
          { char: 'ホ', keyId: 'ha', direction: 'down', explanation: 'Chữ [ホ]' },
        ],
        practiceTargets: ['スマホ', 'パソコン', 'レストラン', 'タクシー', 'パン'],
      },
    ],
  },

  // ==========================================
  // MODULE 8: THỰC CHIẾN CÂU & TĂNG TỐC 2 NGÓN
  // ==========================================
  {
    id: 'mod-8',
    moduleNumber: 8,
    title: 'Thực chiến Câu & Kỹ thuật Tăng tốc',
    japaneseTitle: '実践フレーズと高速フリック技術',
    level: 'Chuyên sâu',
    description: 'Các câu giao tiếp hàng ngày và kỹ thuật gõ liên hoàn 2 ngón tay cái giúp đạt tốc độ trên 120 CPM.',
    lessons: [
      {
        id: 'les-25',
        moduleId: 'mod-8',
        lessonNumber: 25,
        title: 'Lời chào & Giao tiếp thường nhật',
        japaneseTitle: '日常の基本挨拶フレーズ',
        objective: 'Gõ thành thạo các câu giao tiếp cơ bản không cần dừng lại suy nghĩ.',
        description: 'Những câu chào cửa miệng của người Nhật: こんにちは, おはよう, ありがとう, さようなら, すみません.',
        rules: [
          'Luyện tập cho đến khi ngón tay tự động tìm đến phím mà không cần nhìn gợi ý',
        ],
        steps: [
          { char: 'あ', keyId: 'a', direction: 'center', explanation: 'Chữ [あ]' },
          { char: 'り', keyId: 'ra', direction: 'left', explanation: 'Chữ [り]' },
          { char: 'が', keyId: 'ka', direction: 'center', needsModifier: true, explanation: 'か + [゛゜小]' },
          { char: 'と', keyId: 'ta', direction: 'down', explanation: 'Chữ [と]' },
          { char: 'う', keyId: 'a', direction: 'up', explanation: 'Chữ [う]' },
        ],
        practiceTargets: ['ありがとう', 'おはよう', 'こんにちは', 'こんばんは', 'さようなら', 'すみません'],
      },
      {
        id: 'les-26',
        moduleId: 'mod-8',
        lessonNumber: 26,
        title: 'Giao tiếp công sở & Tác phong văn hóa',
        japaneseTitle: 'ビジネス・敬語フレーズ',
        objective: 'Gõ các cụm từ lịch sự và quy tắc ứng xử nơi làm việc.',
        description: 'よろしくおねがいします, いただきます, ごちそうさまでした, おつかれさまでした.',
        rules: [
          'Giữ nhịp điệu gõ đều đặn (rhythm) thay vì gõ ngắt quãng',
        ],
        steps: [
          { char: 'よ', keyId: 'ya', direction: 'down', explanation: 'Chữ [よ]' },
          { char: 'ろ', keyId: 'ra', direction: 'down', explanation: 'Chữ [ろ]' },
          { char: 'し', keyId: 'sa', direction: 'left', explanation: 'Chữ [し]' },
          { char: 'く', keyId: 'ka', direction: 'up', explanation: 'Chữ [く]' },
        ],
        practiceTargets: ['よろしく', 'いただきます', 'おつかれさま', 'どういたしまして'],
      },
      {
        id: 'les-27',
        moduleId: 'mod-8',
        lessonNumber: 27,
        title: 'Kỹ thuật 2 ngón tay cái & Blind-flicking',
        japaneseTitle: '両手フリックとブラインドタッチ',
        objective: 'Phân chia nhiệm vụ 2 ngón cái trên màn hình để tăng gấp đôi tốc độ gõ.',
        description: 'Phân chia chuẩn: Ngón cái Trái phụ trách cột 1 (あ, た, ま, わ). Ngón cái Phải phụ trách cột 3 (さ, は, ら, ゛゜小). Cột 2 (か, な, や, 記号) ngón nào thuận gần hơn sẽ gõ.',
        rules: [
          'Ngón cái Trái: [あ], [た], [ま], [わ]',
          'Ngón cái Phải: [さ], [は], [ら], [゛゜小], [Backspace], [Enter]',
          'Cột giữa: [か], [な], [や], [記号] linh hoạt chia đôi',
        ],
        steps: [
          { char: 'に', keyId: 'na', direction: 'left', explanation: 'Ngón phải vuốt [な] sang trái' },
          { char: 'ほ', keyId: 'ha', direction: 'down', explanation: 'Ngón phải vuốt [は] xuống' },
          { char: 'ん', keyId: 'wa', direction: 'up', explanation: 'Ngón trái vuốt [わ] lên' },
          { char: 'ご', keyId: 'ka', direction: 'down', needsModifier: true, explanation: 'Ngón phải vuốt [か] xuống + [゛゜小]' },
        ],
        practiceTargets: ['にほんご', 'ありがとうございます', 'よろしくおねがいします'],
      },
    ],
  },
];

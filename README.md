# 🇯🇵 Flick Lab — 日本語フリック練習 (Kana Flick Keyboard Trainer)

[![React 19](https://img.shields.io/badge/React-19.3-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tests](https://img.shields.io/badge/Vitest-46_passed-brightgreen?logo=vitest&logoColor=white)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Flick Lab** là ứng dụng web mã nguồn mở (Open Source) thiết kế theo tư duy Mobile-First, giúp người học tiếng Nhật làm quen và làm chủ kỹ năng gõ bàn phím **12 phím Kana Flick Input (日本語フリック入力)** trên điện thoại và máy tính thông qua phản xạ cơ bắp.

---

## ✨ Điểm nổi bật (Features)

1. **Bàn phím 12 phím chuẩn Nhật (Authentic 12-Key Kana Flick Layout)**:
   - Đầy đủ 10 hàng âm Hiragana (`あ行` ~ `わ行`), phím ký hiệu `[記号]` và phím biến âm/thu nhỏ `[゛゜小]`.
   - Cơ chế vuốt 5 nguyên âm chuẩn: **Chạm (Tap) = A, Trái (←) = I, Lên (↑) = U, Phải (→) = E, Xuống (↓) = O**.
   - Cánh hoa flick đa hướng mượt mà, tự động co lùi ở mép viền không bị cắt trên màn hình nhỏ và có bong bóng HUD preview ngay phía trên ngón tay.
   - Hỗ trợ cảm ứng đa điểm Pointer Events trên điện thoại và kéo chuột (mouse drag) trên máy tính.

2. **Giáo trình toàn diện 8 Module — 27 Bài học (Comprehensive Curriculum)**:
   - **Module 1**: Nhập môn & 5 Nguyên âm cốt lõi (A-I-U-E-O).
   - **Module 2**: Toàn bộ 10 hàng phụ âm cơ bản (`か` ~ `わ`).
   - **Module 3**: Biến âm Đục (Dakuten `゛`) & Bán đục (Handakuten `゜`).
   - **Module 4**: Âm ngắt Sokuon (`っ`) & Các nguyên âm nhỏ (`ぁ`, `ぃ`, `ぅ`, `ぇ`, `ぉ`).
   - **Module 5**: Toàn bộ 36 Âm ghép Yōon (`きゃ`, `しゅ`, `ちょ`, `じゃ`, `びょ`...).
   - **Module 6**: Dấu câu tiếng Nhật (`、`, `。`, `？`, `！`), dấu gạch nối kéo dài trường âm (`ー`).
   - **Module 7**: Chữ Katakana & Từ mượn ngoại lai.
   - **Module 8**: Kỹ thuật ngón tay, phương pháp gõ song thủ 2 ngón cái & phản xạ không nhìn phím.

3. **Minigame: Mưa Chữ Kana (雨の降下 - Kana Rain Arcade)**:
   - Các giọt chữ Kana / từ vựng tiếng Nhật rơi tự do từ trên bầu trời.
   - Bắn hạ ký tự trước khi chạm tia phòng tuyến Laser đỏ với hệ thống 3 mạng sống (❤️❤️❤️).
   - Chuỗi combo nhân điểm rực rỡ (`x2`, `x3`, `x5`, `x10`), hiệu ứng pháo hoa và âm thanh arcade tổng hợp qua Web Audio API.

4. **Nhiều chế độ luyện tập đa dạng**:
   - **Luyện Kana đơn (Flick Practice)**: Lọc theo từng hàng âm, đo thời gian phản xạ (Reaction Time ms).
   - **Luyện từ vựng (Word Practice)**: Gõ từ vựng tiếng Nhật thực tế kèm nghĩa tiếng Việt / tiếng Anh.
   - **Thử thách tốc độ (Speed Challenge)**: 30s hoặc 60s, tính tốc độ CPM (ký tự/phút) và xếp hạng danh hiệu S/A/B/C/D.
   - **Gõ tự do (Free Typing Sandbox)**: Hộp cát gõ văn bản tùy ý, chuyển đổi Hiragana/Katakana và sao chép văn bản vào clipboard.

5. **Giao diện Minimalist Dark Theme chuẩn Nhật**:
   - Tông màu than trầm `#0B0C0E` tinh tế kết hợp điểm nhấn Chu sa `#E83D3D`.
   - Typography chuẩn `Noto Sans JP`, thanh cuộn được ẩn mượt mà không gây xao nhãng.
   - Lưu trữ tiến độ, kỷ lục điểm cao và chuỗi ngày luyện tập hoàn toàn trên `localStorage` (100% Offline-ready).

---

## 🚀 Cài đặt & Chạy cục bộ (Local Development)

### Yêu cầu môi trường
- [Node.js](https://nodejs.org/) (phiên bản 18 trở lên, khuyên dùng LTS v20+)
- npm hoặc pnpm / yarn

### Các bước thực hiện

```bash
# 1. Clone repository
git clone https://github.com/<tai-khoan-cua-ban>/flick-lab.git

# 2. Di chuyển vào thư mục dự án
cd flick-lab

# 3. Cài đặt các gói phụ thuộc
npm install

# 4. Khởi chạy máy chủ phát triển cục bộ
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:5173`

### Kiểm thử & Đóng gói sản phẩm

```bash
# Chạy bộ test tự động (Vitest)
npm test

# Kiểm tra kiểu TypeScript & Đóng gói sản phẩm (Production Build)
npm run build

# Xem thử bản build production
npm run preview
```

---

## 🌐 Triển khai lên GitHub Pages (Host miễn phí)

Dự án đã được tích hợp sẵn file tự động hóa **GitHub Actions** (`.github/workflows/deploy.yml`) và thiết lập `base: './'` trong `vite.config.ts`.

Khi bạn đẩy code lên GitHub, GitHub sẽ tự động build và xuất bản trang web.

### Hướng dẫn chi tiết 3 bước:

1. **Tạo Repository mới trên GitHub**:
   - Vào [GitHub New Repository](https://github.com/new).
   - Đặt tên repository (ví dụ: `flick-lab` hoặc `nihongonara`).
   - Chọn chế độ **Public** (để dùng miễn phí GitHub Pages và chia sẻ open source).
   - Không tick chọn "Initialize with README" vì dự án đã có sẵn code.

2. **Đẩy mã nguồn lên GitHub**:
   ```bash
   # Thêm remote repository của bạn
   git remote add origin https://github.com/<tai-khoan-cua-ban>/<ten-repo>.git

   # Đẩy code lên nhánh master (hoặc main)
   git push -u origin master
   ```

3. **Kích hoạt GitHub Pages**:
   - Truy cập vào Repository trên GitHub ➔ Chọn tab **Settings** (Cài đặt).
   - Ở thanh menu bên trái, nhấp vào mục **Pages** (dưới nhóm *Code and automation*).
   - Tại mục **Build and deployment** ➔ **Source**: Chuyển từ *Deploy from a branch* sang **GitHub Actions**.
   - Chờ khoảng 1-2 phút, GitHub Actions sẽ chạy xong và đường link web của bạn sẽ hiển thị tại đây:
     ```
     https://<tai-khoan-cua-ban>.github.io/<ten-repo>/
     ```

---

## 📂 Cấu trúc mã nguồn (Project Architecture)

```
d:\nihongonara
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow tự động deploy lên GitHub Pages
├── src/
│   ├── components/
│   │   ├── common/             # Header, NavigationTabs
│   │   ├── keyboard/           # FlickKeyboard, KeyButton, FlickFlower (Cơ chế vuốt 5 hướng)
│   │   └── modes/              # Dashboard, Curriculum, Tutorial, Flick, Word, Speed, Minigame, FreeTyping, Progress, Settings
│   ├── constants/
│   │   ├── keyboardLayout.ts   # Cấu hình 12 phím Kana, chu kỳ biến âm Dakuten/Handakuten
│   │   ├── curriculum.ts       # 8 Module, 27 bài học chuẩn sư phạm
│   │   └── vocabulary.ts       # Từ điển từ vựng có nghĩa tiếng Việt & tiếng Anh
│   ├── hooks/
│   │   └── usePointerFlick.ts  # Nhận diện cử chỉ vuốt 4 hướng bằng Pointer Events
│   ├── tests/                  # Bộ test tự động (Vitest & Testing Library)
│   ├── types/                  # Định nghĩa kiểu TypeScript cho phím, tiến độ, giáo trình
│   ├── utils/
│   │   ├── audio.ts            # Bộ tổng hợp âm thanh Web Audio API (không phụ thuộc file mp3 ngoài)
│   │   ├── kanaHelper.ts       # Xử lý Romaji, Hiragana, Katakana, Dakuten
│   │   └── storage.ts          # Quản lý lưu trữ localStorage, chuỗi streak ngày
│   ├── App.tsx                 # Điều hướng ứng dụng chính
│   ├── index.css               # Cấu hình Tailwind CSS v4 & tùy biến scrollbar
│   └── main.tsx                # Điểm khởi chạy React 19
├── vite.config.ts              # Thiết lập Vite với base: './' cho GitHub Pages
└── package.json
```

---

## 📜 Giấy phép (License)

Dự án này được phát hành dưới giấy phép mã nguồn mở [MIT License](LICENSE). Bạn hoàn toàn có thể tự do sử dụng, chỉnh sửa, đóng góp hoặc phát triển thêm cho cộng đồng học tiếng Nhật!

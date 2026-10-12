# TÀI LÊ — PORTALVERSE v1.5.0 | PORTAL GLYPHS

Website tĩnh tương thích GitHub Pages. Giữ nguyên các tính năng v1.4.0 (5 bài nhạc thật, trình phát, bản đồ sao, My Products, mascot, 3 ngôn ngữ) và thay toàn bộ icon hệ thống bằng **44 SVG Portal Glyph** tự thiết kế.

## Đăng lên GitHub Pages (kể cả từ iPhone)

1. Giải nén ZIP bằng ứng dụng **Tệp (Files)** trên iPhone hoặc máy tính.
2. Tạo repository GitHub mới, ví dụ `tai-le-portalverse`.
3. Mở thư mục giải nén, tải **các file và thư mục bên trong** lên repository (không tải nguyên ZIP).
4. Đảm bảo `index.html`, `portal-glyphs.js`, `portal-glyphs.css` và `assets/` nằm đúng vị trí ở thư mục gốc.
5. Trong **Settings → Pages**, chọn **Deploy from a branch → main → /(root) → Save**.
6. Chờ GitHub Pages triển khai, sau đó mở `https://<username>.github.io/tai-le-portalverse/`.

**Lưu ý tải từ iPhone:** giao diện web của GitHub có thể bất tiện khi upload nhiều file; nếu ứng dụng Tệp không giải nén được, hãy thử lưu ZIP vào On My iPhone và chạm một lần để giải nén. GitHub Desktop hoặc git trên máy tính dễ giữ nguyên các thư mục hơn.

## Nội dung và tùy chỉnh

- `config.js`: phần giới thiệu, mạng xã hội và liên hệ.
- `v13-content.js`: 5 bài hát, album art, MP3, MV và các dự án.
- `i18n.js`, `v13.js`, `v14.js`: giao diện đa ngôn ngữ Việt–Anh–Nhật.
- `portal-glyphs.js`: 44 glyph SVG custom và hệ thống thay thế biểu tượng động.
- `portal-glyphs.css`: nét sáng, hoạt ảnh, kích thước, màu sắc của glyph.
- `ICON-SYSTEM.md`: quy chuẩn bộ icon và cách mở rộng.

Mỗi file đều dưới 25 MB. Nhạc được để trong `assets/` riêng, không nhúng base64 vào `index.html`.

# PORTALVERSE — PORTAL GLYPH SYSTEM (v1.5.0)

- Toàn bộ biểu tượng là SVG tự thiết kế theo lưới 32×32; không tải Lucide, FontAwesome, emoji hoặc icon font.
- Tài nguyên nằm trong `portal-glyphs.js` (SVG symbol & thay thế nội dung động) và `portal-glyphs.css` (màu và chuyển động).
- Biểu tượng sử dụng nét chính 2.3px và nét nhấn 1.8px; hồng, cyan, vàng và tím Portalverse.
- SVG được tạo trong DOM bằng `<svg><use href="#pv-..."></use></svg>` nên tương thích GitHub Pages, kể cả khi website ở đường dẫn repo.
- Bộ 40+ glyph bao gồm: Play, Pause, Prev, Next, Shuffle, Repeat, Album, Music, Piano, Guitar, Game, App, Link, Search, Language, Menu, Social orb, Star, Heart, Mood, Home, World, Close, etc.
- Trong nội dung từ ba ngôn ngữ, những dấu icon legacy khi xuất hiện sẽ tự được thay bằng SVG; không còn render emoji hệ điều hành.
- Không can thiệp ký tự chữ, dấu tiếng Việt hoặc văn bản tiếng Nhật. Dấu mũi tên/icon trong nút được chuyển thành glyph.
- Nếu muốn bổ sung glyph mới, thêm SVG path vào định nghĩa trong `portal-glyphs.js`, sau đó thêm mapping tương ứng.

> Website khách xem không hiển thị các ghi chú này.

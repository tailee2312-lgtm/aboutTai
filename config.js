/**
 * TÀI LÊ · PORTALVERSE — DỮ LIỆU WEBSITE
 * Bạn chỉ cần chỉnh file này để thêm video / đổi tên / gắn mạng xã hội.
 * video: link YouTube thông thường hoặc ID YouTube. Để "" nếu chưa có link.
 * thumbnail: đường dẫn ảnh trong thư mục assets/ hoặc URL ảnh.
 */
window.PORTALVERSE_CONTENT = {
  artist: 'TÀI LÊ',
  headline: 'Sound & Code.',
  intro: 'Âm nhạc và những sản phẩm số do Tài Lê thực hiện.',
  about: 'Tài Lê sáng tác âm nhạc, chơi piano và guitar, đồng thời phát triển web game và ứng dụng. Portalverse tập hợp những dự án và bản thu đã thực hiện.',
  email: '', // Ví dụ: hello@example.com
  socials: {
    youtube: '',
    tiktok: '',
    instagram: '',
    facebook: '',
    spotify: ''
  },
  localized: {
    en: {
      intro: 'Original music and digital creations by Tài Lê.',
      about: 'Tài Lê creates music, performs piano and guitar, and develops web games and applications. Portalverse brings together selected music and digital projects.',
      works: {
        'mv-01': {title:'A portal yet to open',subtitle:'A world told through music and images.'},
        'piano-01': {title:'Piano — first melodies',subtitle:'A little journey across the keys.'},
        'guitar-01': {title:'Guitar — stories in strings',subtitle:'One guitar, countless feelings.'}
      }
    },
    ja: {
      intro: 'Tài Lêの音楽とデジタル作品を紹介します。',
      about: 'Tài Lêは音楽制作、ピアノ・ギター演奏、Webゲームやアプリの開発を手がけています。Portalverseでは楽曲と制作プロジェクトを公開しています。',
      works: {
        'mv-01': {title:'まだ開かないポータル',subtitle:'音楽と映像で紡ぐ世界。'},
        'piano-01': {title:'ピアノ — はじまりのメロディー',subtitle:'鍵盤から広がる音の旅。'},
        'guitar-01': {title:'ギター — 弦が語る物語',subtitle:'一本のギターにたくさんの想いを。'}
      }
    }
  },
  works: [
    {
      id: 'mv-01', type: 'mv', title: 'Một cánh cổng chưa mở',
      subtitle: 'Một thế giới được kể bằng âm nhạc và hình ảnh.',
      tag: 'MUSIC VIDEO', duration: '',
      thumbnail: 'assets/mv-scene.webp', video: ''
    },
    {
      id: 'piano-01', type: 'piano', title: 'Piano — những nốt nhạc đầu tiên',
      subtitle: 'Những giai điệu qua các phím đàn.',
      tag: 'PIANO COVER', duration: '',
      thumbnail: 'assets/piano-scene.webp', video: ''
    },
    {
      id: 'guitar-01', type: 'guitar', title: 'Guitar — những giai điệu kể chuyện',
      subtitle: 'Một chiếc guitar và những câu chuyện.',
      tag: 'GUITAR COVER', duration: '',
      thumbnail: 'assets/guitar-scene.webp', video: ''
    }
  ]
};

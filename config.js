/**
 * TÀI LÊ · PORTALVERSE — DỮ LIỆU WEBSITE
 * Bạn chỉ cần chỉnh file này để thêm video / đổi tên / gắn mạng xã hội.
 * video: link YouTube thông thường hoặc ID YouTube. Để "" nếu chưa có link.
 * thumbnail: đường dẫn ảnh trong thư mục assets/ hoặc URL ảnh.
 */
window.PORTALVERSE_CONTENT = {
  artist: 'TÀI LÊ',
  headline: 'A small boy in a big universe.',
  intro: 'Chào mừng đến với vũ trụ nhỏ của mình — nơi giai điệu mở ra những thế giới mới và các ý tưởng biến thành game, ứng dụng đầy màu sắc.',
  about: 'Mình thích viết nhạc, chơi piano, guitar và biến những ý tưởng tưởng chừng vô lý thành điều gì đó có thật. Portalverse là góc nhỏ để mình gom lại những câu chuyện, bản nhạc và những thứ mình đang sáng tạo.',
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
      intro: 'Welcome to my little universe, where melodies open new worlds and ideas become colorful games and apps.',
      about: 'I love writing music, playing piano and guitar, and turning unlikely ideas into something real. Portalverse is the little place where I bring my stories, music and creative experiments together.',
      works: {
        'mv-01': {title:'A portal yet to open',subtitle:'A world told through music and images.'},
        'piano-01': {title:'Piano — first melodies',subtitle:'A little journey across the keys.'},
        'guitar-01': {title:'Guitar — stories in strings',subtitle:'One guitar, countless feelings.'}
      }
    },
    ja: {
      intro: '僕の小さな宇宙へようこそ。音楽が新しい世界を開き、アイデアがゲームやアプリになる場所です。',
      about: '作曲、ピアノ、ギターが好きです。ちょっと不思議なアイデアを形にするのも大好き。Portalverseは、僕の音楽と物語、創作を集めた小さな場所です。',
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

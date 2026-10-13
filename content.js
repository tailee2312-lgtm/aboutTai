/* SOURCE: config.js */
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


/* SOURCE: i18n.js */
/* Visitor-facing translations. Strings containing markup are authored constants only. */
window.PORTALVERSE_I18N={
vi:{
 realmProducts:'PHÒNG SÁNG TẠO',navHome:'Trang chủ',navMusic:'MV',navCovers:'Cover',navAbout:'Về mình',navContact:'Liên hệ',
 headerTag:'ÂM NHẠC · TRÒ CHƠI · SÁNG TẠO',welcomeHtml:'<span class="pulse-dot"></span> TÀI LÊ / SOUND & CODE <span>✦</span>',
 heroSubtitleHtml:'<span>✧</span> ÂM NHẠC · SẢN PHẨM SỐ <span>✧</span>',exploreHtml:'KHÁM PHÁ VŨ TRỤ <span class="btn-arrow">↗</span>',watchMVHtml:'<span class="play-icon">▶</span> XEM MV',scrollHtml:'CUỘN ĐỂ KHÁM PHÁ <span>↓</span>',
 bubbleWelcomeHtml:'SOUND<br/>& CODE <span>♡</span>',bubbleRealitiesHtml:'ÂM NHẠC<br/>VÀ CÔNG NGHỆ <span>✳</span>',heroSideHtml:'ÂM NHẠC<br/>& CÔNG NGHỆ <span>♡</span>',
 mapOverline:'✦ BẢN ĐỒ ĐA CHIỀU',choosePortalHtml:'CHỌN MỘT CÁNH CỔNG <span>↘</span>',touchPortal:'CHẠM VÀO CÁNH CỔNG ĐỂ DỊCH CHUYỂN',gateMvDesc:'Câu chuyện hóa thành hình ảnh',gatePianoDesc:'Bay cùng những phím đàn',gateGuitarDesc:'Giai điệu bừng sáng',
 musicTitleHtml:'MUSIC <span class="highlight-pink">VIDEOS<span class="ink-star">✳</span></span>',coversTitleHtml:'THE <span class="highlight-cyan">COVER</span> DIMENSIONS',momentsTitleHtml:'LITTLE <span class="highlight-yellow">MOMENTS</span>',aboutTitleHtml:'Ồ, CHÀO!<br/>MÌNH LÀ <span>TÀI!</span> <span class="hi-emoji">✳</span>',
 mvLead:'Những câu chuyện mình kể bằng giai điệu và từng khung hình.',coversLead:'Một người, hai thế giới âm nhạc rất khác nhau.',pianoCardLead:'Những nốt nhạc bay giữa bầu trời xanh.',guitarCardLead:'Một chiếc guitar, những chuyến đi và cảm xúc.',memoryLead:'Những mảnh ký ức rơi ra từ những chiều không gian khác.',contactLead:'Cùng yêu âm nhạc hay có một ý tưởng thú vị? Mình rất vui được gặp bạn ở đây.',
 allWorlds:'TẤT CẢ',backToTop:'VỀ ĐẦU TRANG ↑',contactOverline:'BẠN ĐÃ ĐẾN CUỐI HÀNH TRÌNH ♡',contactTitleHtml:'KẾT NỐI NHAU<br/><span>GIỮA NHỮNG VŨ TRỤ!</span>',goodbye:'Cảm ơn bạn đã ghé xem các tác phẩm.',
 portalOne:'CỔNG SỐ 01 ↗',portalTwoThree:'CỔNG SỐ 02 & 03 ↗',extraDimension:'CHIỀU KHÔNG GIAN KHÁC ✦',aboutOverline:'AI ĐỨNG SAU THẾ GIỚI NÀY?',mvTag:'✦ MV NỔI BẬT',mvEyebrow:'MỘT CÂU CHUYỆN QUA ÂM NHẠC',mvStampHtml:'THẾ<br/>GIỚI<br/>MV ↗',
 mvBubbleHtml:'KHÔNG CHỈ<br/>MỘT BÀI NHẠC.<br/><em>MÀ LÀ CẢ THẾ GIỚI!</em><span>↘</span>',pressPlayHtml:'NHẤN PHÁT<br/><span>VÀ CẢM NHẬN</span>',pianoDoodleHtml:'HÃY ĐỂ ÂM NHẠC<br/>CẤT TIẾNG ♡',guitarDoodleHtml:'GIAI ĐIỆU CŨ<br/>CÂU CHUYỆN MỚI ✳',
 skipLink:'Chuyển đến nội dung',enterMvAria:'Đi xuyên cổng đến thế giới MV',enterPianoAria:'Đi xuyên cổng đến thế giới Piano',enterGuitarAria:'Đi xuyên cổng đến thế giới Guitar',closeAria:'Đóng',menuAria:'Mở menu',mascotAria:'Chạm để đổi biểu cảm của mascot',logoAria:'Tài Lê, về đầu trang',surpriseAria:'Đi đến một thế giới bất ngờ',
 playgroundOverline:'✳ CHIỀU KHÔNG GIAN BÍ MẬT',playgroundTitle:'GIẢI TRÍ',playgroundDesc:'Thử Mini Piano, nghe nhạc và khám phá những chi tiết tương tác.',miniPianoLabel:'01 · ĐÀN PIANO BỎ TÚI',miniPianoTitle:'Mini Piano',miniPianoDesc:'Chạm vào phím đàn hoặc sử dụng A–K trên máy tính.',pianoHint:'♫ Chạm phím để đánh thức những vì sao',mysteryLabel:'02 · ĐIỀU CHƯA BIẾT',mysteryTitle:'Cổng bí ẩn',mysteryDesc:'Mở ngẫu nhiên một mục âm nhạc hoặc sản phẩm.',mysteryGo:'THỬ VẬN MAY',questEyebrow:'✶ SĂN SAO',questTitle:'Có 5 ngôi sao đang trốn đâu đó...',questDesc:'Tìm các biểu tượng ẩn trên trang để khám phá tương tác đặc biệt.',
 travel:'ĐANG XUYÊN QUA KHÔNG GIAN',videoNote:'Cảm ơn bạn đã lắng nghe. Chúc bạn có một chuyến đi âm nhạc thật vui! ♡',previewNote:'Cánh cổng âm nhạc này sẽ sớm mở. Hẹn gặp bạn ở đây! ✦',missingWork:'Cánh cổng này đang đợi một câu chuyện mới ✦',starFound:'Đã tìm được ngôi sao!',starFinished:'🌟 Bạn đã thắp sáng cả vũ trụ! Cảm ơn bạn đã khám phá!',mysteryToast:'✦ Không gian đang chọn một điểm đến bất ngờ...',selectLanguage:'Chọn ngôn ngữ',starAria:'Thu thập ngôi sao',noContact:'Hẹn gặp nhau ở thế giới tiếp theo ✦',
 realmHome:'VŨ TRỤ CỦA TÀI',realmMap:'BẢN ĐỒ CÁNH CỔNG',realmMusic:'DẢI NGÂN HÀ MV',realmPiano:'TẦN SỐ XANH',realmGuitar:'DÂY ĐÀN HOÀNG HÔN',realmCovers:'NHỮNG THẾ GIỚI COVER',realmAbout:'GẶP NGƯỜI SÁNG TẠO',realmContact:'HẸN GẶP LẠI',
},
en:{
 realmProducts:'CREATIVE LAB',navHome:'Home',navMusic:'MV',navCovers:'Covers',navAbout:'About',navContact:'Contact',
 headerTag:'MUSIC · DIGITAL CREATIONS',welcomeHtml:'<span class="pulse-dot"></span> TÀI LÊ / SOUND & CODE <span>✦</span>',heroSubtitleHtml:'<span>✧</span> MUSIC · DIGITAL CREATIONS <span>✧</span>',exploreHtml:'EXPLORE MY WORLD <span class="btn-arrow">↗</span>',watchMVHtml:'<span class="play-icon">▶</span> WATCH MV',scrollHtml:'SCROLL TO EXPLORE <span>↓</span>',
 bubbleWelcomeHtml:'SOUND<br/>& CODE <span>♡</span>',bubbleRealitiesHtml:'MUSIC<br/>MEETS TECHNOLOGY <span>✳</span>',heroSideHtml:'MUSIC<br/>& TECHNOLOGY <span>♡</span>',mapOverline:'✦ INTERDIMENSIONAL MAP',choosePortalHtml:'CHOOSE A PORTAL <span>↘</span>',touchPortal:'TAP A PORTAL TO TRAVEL',gateMvDesc:'Stories turned into moving pictures',gatePianoDesc:'Get lost in the keys',gateGuitarDesc:'Where melodies shine',
 musicTitleHtml:'MUSIC <span class="highlight-pink">VIDEOS<span class="ink-star">✳</span></span>',coversTitleHtml:'THE <span class="highlight-cyan">COVER</span> DIMENSIONS',momentsTitleHtml:'LITTLE <span class="highlight-yellow">MOMENTS</span>',aboutTitleHtml:'OH, HI.<br/>I’M <span>TÀI!</span> <span class="hi-emoji">✳</span>',
 mvLead:'Stories I tell through melodies and frames.',coversLead:'One person, two very different musical worlds.',pianoCardLead:'Notes floating across a blue sky.',guitarCardLead:'One guitar, countless journeys and feelings.',memoryLead:'Little memories drifting through other realities.',contactLead:'Love music or have a creative idea? I would love to connect.',
 allWorlds:'ALL WORLDS',backToTop:'BACK TO TOP ↑',contactOverline:'YOU MADE IT TO THE END ♡',contactTitleHtml:'LET’S CONNECT<br/><span>ACROSS UNIVERSES!</span>',goodbye:'Thanks for listening and exploring. ✦',portalOne:'PORTAL NO. 01 ↗',portalTwoThree:'PORTALS NO. 02 & 03 ↗',extraDimension:'EXTRA DIMENSION ✦',aboutOverline:'WHO IS BEHIND THIS CHAOS?',mvTag:'✦ FEATURED MV',mvEyebrow:'VISUAL STORYTELLING',mvStampHtml:'MY<br/>WORLD<br/>OF MV ↗',mvBubbleHtml:'NOT JUST<br/>A SONG.<br/><em>A WHOLE WORLD!</em><span>↘</span>',pressPlayHtml:'PRESS PLAY<br/><span>AND FEEL SOMETHING</span>',pianoDoodleHtml:'LET MUSIC<br/>BREATHE ♡',guitarDoodleHtml:'SAME CHORDS<br/>NEW STORIES ✳',
 skipLink:'Skip to content',enterMvAria:'Travel through the portal to MV',enterPianoAria:'Travel through the portal to Piano',enterGuitarAria:'Travel through the portal to Guitar',closeAria:'Close',menuAria:'Open menu',mascotAria:'Tap to change mascot expression',logoAria:'Tài Lê, go to top',surpriseAria:'Surprise me with a destination',
 playgroundOverline:'✳ SECRET INTERACTIVE DIMENSION',playgroundTitle:'ENTERTAINMENT',playgroundDesc:'Try the mini piano and explore interactive features.',miniPianoLabel:'01 · POCKET PIANO',miniPianoTitle:'Mini Piano',miniPianoDesc:'Tap the keys or press A–K on your keyboard.',pianoHint:'♫ Touch the keys to wake the stars',mysteryLabel:'02 · THE UNKNOWN',mysteryTitle:'Mystery Portal',mysteryDesc:'Open a random track or digital project.',mysteryGo:'TAKE A CHANCE',questEyebrow:'✶ THE STAR HUNT',questTitle:'Five stars are hiding somewhere...',questDesc:'Discover five hidden symbols for a special interaction.',travel:'TRAVELING THROUGH SPACE',videoNote:'Thanks for listening. Enjoy this musical journey! ♡',previewNote:'This musical portal will open soon. See you here! ✦',missingWork:'This portal awaits a new story ✦',starFound:'You found a star!',starFinished:'🌟 You lit up the universe! Thanks for exploring!',mysteryToast:'✦ A random destination is calling...',selectLanguage:'Select language',starAria:'Collect star',noContact:'See you in another world ✦',
 realmHome:'TÀI’S UNIVERSE',realmMap:'THE PORTAL MAP',realmMusic:'CINEMA GALAXY',realmPiano:'BLUE FREQUENCY',realmGuitar:'SOLAR STRINGS',realmCovers:'COVER DIMENSIONS',realmAbout:'MEET THE CREATOR',realmContact:'UNTIL NEXT TIME',
},
ja:{
 realmProducts:'制作の世界',navHome:'ホーム',navMusic:'MV',navCovers:'カバー',navAbout:'プロフィール',navContact:'コンタクト',
 headerTag:'音楽 · デジタル作品',welcomeHtml:'<span class="pulse-dot"></span> TÀI LÊ / SOUND & CODE <span>✦</span>',heroSubtitleHtml:'<span>✧</span> 音楽 · 物語 · 別世界 <span>✧</span>',exploreHtml:'宇宙を探検する <span class="btn-arrow">↗</span>',watchMVHtml:'<span class="play-icon">▶</span> MVを見る',scrollHtml:'スクロールして探検 <span>↓</span>',
 bubbleWelcomeHtml:'SOUND<br/>& CODE <span>♡</span>',bubbleRealitiesHtml:'音楽と<br/>デジタル制作 <span>✳</span>',heroSideHtml:'音楽と<br/>デジタル作品 <span>♡</span>',mapOverline:'✦ 異次元マップ',choosePortalHtml:'ポータルを選ぼう <span>↘</span>',touchPortal:'タップして別世界へ',gateMvDesc:'音楽で描く物語',gatePianoDesc:'鍵盤の世界へ',gateGuitarDesc:'輝くメロディーの世界',
 musicTitleHtml:'MUSIC <span class="highlight-pink">VIDEOS<span class="ink-star">✳</span></span>',coversTitleHtml:'<span class="highlight-cyan">カバー</span>の世界',momentsTitleHtml:'小さな<span class="highlight-yellow">思い出</span>',aboutTitleHtml:'こんにちは！<br/><span>タ イ</span>です！ <span class="hi-emoji">✳</span>',
 mvLead:'メロディーと映像で紡ぐ僕の物語。',coversLead:'ひとりの僕、ふたつの音楽世界。',pianoCardLead:'青空に舞う音符たち。',guitarCardLead:'一本のギターと、旅と、たくさんの想い。',memoryLead:'異世界からこぼれ落ちた小さな思い出。',contactLead:'音楽や創作が好きですか？ ここで出会えたらうれしいです。',
 allWorlds:'すべて',backToTop:'トップに戻る ↑',contactOverline:'最後まで来てくれてありがとう ♡',contactTitleHtml:'宇宙を越えて<br/><span>つながろう！</span>',goodbye:'作品をご覧いただきありがとうございます。',portalOne:'ポータル 01 ↗',portalTwoThree:'ポータル 02 & 03 ↗',extraDimension:'もうひとつの次元 ✦',aboutOverline:'この宇宙を作ったのは誰？',mvTag:'✦ 注目のMV',mvEyebrow:'音楽で描くストーリー',mvStampHtml:'MVの<br/>世界 ↗',mvBubbleHtml:'ただの曲じゃない。<br/><em>ひとつの世界だ！</em><span>↘</span>',pressPlayHtml:'再生して<br/><span>感じてみよう</span>',pianoDoodleHtml:'音楽を<br/>感じよう ♡',guitarDoodleHtml:'同じコード<br/>新しい物語 ✳',
 skipLink:'本文へスキップ',enterMvAria:'MVの世界へ移動',enterPianoAria:'ピアノの世界へ移動',enterGuitarAria:'ギターの世界へ移動',closeAria:'閉じる',menuAria:'メニューを開く',mascotAria:'クリックで表情が変わります',logoAria:'トップに戻る',surpriseAria:'ランダムな世界へ',
 playgroundOverline:'✳ 秘密のプレイゾーン',playgroundTitle:'エンタメ',playgroundDesc:'ミニピアノやインタラクティブな機能をお試しください。',miniPianoLabel:'01 · ポケットピアノ',miniPianoTitle:'ミニピアノ',miniPianoDesc:'鍵盤をタップ、またはA〜Kキーを押そう。',pianoHint:'♫ 鍵盤に触れて星を輝かせよう',mysteryLabel:'02 · 未知の世界',mysteryTitle:'ミステリーポータル',mysteryDesc:'楽曲または作品をランダムに開きます。',mysteryGo:'運試しする',questEyebrow:'✶ スターハント',questTitle:'5つの星がどこかに隠れている...',questDesc:'隠された5つのマークを見つけると特別な演出が見られます。',travel:'異次元を移動中',videoNote:'聴いてくれてありがとう。音楽の旅を楽しんでね！ ♡',previewNote:'この音楽ポータルは、まもなく開きます。お楽しみに！ ✦',missingWork:'新しい物語を待っているポータルです ✦',starFound:'星を見つけた！',starFinished:'🌟 宇宙が明るくなった！探検してくれてありがとう！',mysteryToast:'✦ 行き先を探しています...',selectLanguage:'言語を選択',starAria:'星を集める',noContact:'また別の世界で会おう ✦',
 realmHome:'タイの宇宙',realmMap:'ポータルマップ',realmMusic:'シネマ銀河',realmPiano:'青い周波数',realmGuitar:'夕焼けの弦',realmCovers:'カバーの世界',realmAbout:'クリエイター紹介',realmContact:'またね',
}
};


/* SOURCE: v13-content.js */
/* v1.4.0: 5 user-provided original songs; cover art is custom web artwork. Add timestamped LRC files for karaoke when verified. */
window.PORTALVERSE_V13 = {
  tracks: [
    {id:'thanh-xuan-ghe-qua', artist:'Tài ft. Yant, T.R', kind:'original', demo:false, title:'Thanh Xuân Ghé Qua', subtitle:{vi:'Bản thu chính thức',en:'Original recording',ja:'オリジナル音源'}, mood:'Nhớ nhung · tuổi trẻ', audio:'assets/thanh-xuan-ghe-qua.mp3',cover:'assets/thanh-xuan-ghe-qua-cover-v18.webp',lyrics:'',lyricsFile:'assets/lyrics/thanh-xuan-ghe-qua.lrc'},
    {id:'tet-ngap-troi', artist:'Tài ft. Yant', kind:'original', demo:false, title:'Tết Ngập Trời', subtitle:{vi:'Bản thu chính thức',en:'Original recording',ja:'オリジナル音源'}, mood:'Tươi vui · ngày Tết', audio:'assets/tet-ngap-troi.mp3',cover:'assets/tet-ngap-troi-cover-v18.webp',lyrics:'',lyricsFile:'assets/lyrics/tet-ngap-troi.lrc'},
    {id:'tan-trong-anh-mat', artist:'Tài ft. Yant', kind:'original', demo:false, title:'Tan Trong Ánh Mắt', subtitle:{vi:'Bản thu chính thức',en:'Original recording',ja:'オリジナル音源'}, mood:'Lãng mạn · cảm xúc', audio:'assets/tan-trong-anh-mat.mp3',cover:'assets/tan-trong-anh-mat-cover-v18.webp',lyrics:'',lyricsFile:'assets/lyrics/tan-trong-anh-mat.lrc'},
    {id:'giang-sinh-gap-em', artist:'Tài ft. Yant', kind:'original', demo:false, title:'Giáng Sinh Gặp Em', lyricsFile:'assets/lyrics/giang-sinh-gap-em.lrc', subtitle:{vi:'Bản thu chính thức',en:'Original recording',ja:'オリジナル音源'}, mood:'Mùa đông · những tâm sự', audio:'assets/giang-sinh-gap-em.mp3',cover:'assets/giang-sinh-gap-em-cover-v18.webp',lyrics:''},
    {id:'ngon-doi-thanh-xuan', artist:'Tài ft. Aki', kind:'original', demo:false, title:'Ngọn Đồi Thanh Xuân', subtitle:{vi:'Bản thu chính thức',en:'Original recording',ja:'オリジナル音源'}, mood:'Thanh xuân · hy vọng', audio:'assets/ngon-doi-thanh-xuan.mp3',cover:'assets/ngon-doi-thanh-xuan-cover-v18.webp',lyrics:'',lyricsFile:'assets/lyrics/ngon-doi-thanh-xuan.lrc'}
  ],
  videos: [
    {id:'mv-thanh-xuan-ghe-qua',category:'mv',title:'Thanh Xuân Ghé Qua',cover:'assets/thanh-xuan-ghe-qua-cover-v18.webp',description:{vi:'MV sẽ được cập nhật khi phát hành.',en:'Music video coming soon.',ja:'MVは公開時に追加予定です。'},url:''},
    {id:'mv-tet-ngap-troi',category:'mv',title:'Tết Ngập Trời',cover:'assets/tet-ngap-troi-cover-v18.webp',description:{vi:'MV sẽ được cập nhật khi phát hành.',en:'Music video coming soon.',ja:'MVは公開時に追加予定です。'},url:''},
    {id:'mv-tan-trong-anh-mat',category:'mv',title:'Tan Trong Ánh Mắt',cover:'assets/tan-trong-anh-mat-cover-v18.webp',description:{vi:'MV sẽ được cập nhật khi phát hành.',en:'Music video coming soon.',ja:'MVは公開時に追加予定です。'},url:''},
    {id:'mv-giang-sinh-gap-em',category:'mv',title:'Giáng Sinh Gặp Em',cover:'assets/giang-sinh-gap-em-cover-v18.webp',description:{vi:'MV sẽ được cập nhật khi phát hành.',en:'Music video coming soon.',ja:'MVは公開時に追加予定です。'},url:''},
    {id:'mv-ngon-doi-thanh-xuan',category:'mv',title:'Ngọn Đồi Thanh Xuân',cover:'assets/ngon-doi-thanh-xuan-cover-v18.webp',description:{vi:'MV sẽ được cập nhật khi phát hành.',en:'Music video coming soon.',ja:'MVは公開時に追加予定です。'},url:''}
  ],
  projects: [
    {id:'co-thu',type:'game',image:'assets/product-rpg.webp',gallery:['assets/product-rpg.webp','assets/product-rpg-detail-1.webp','assets/product-rpg-detail-2.webp'],
      title:'Hành Trình Cổ Thư',tag:'PIXEL RPG',tags:['Pixel Art','RPG','Storytelling'],url:'',
      description:{vi:'Một trò chơi nhập vai phiêu lưu giữa rừng cổ, những tàn tích và các mảnh thư thất lạc. Người chơi khám phá, nhận nhiệm vụ và chạm trán những sinh vật canh giữ bí mật.',en:'A story-driven pixel RPG across ancient forests, lost ruins and mysterious scroll fragments. Explore, complete quests and encounter guardians of a forgotten world.',ja:'古代の森や遺跡、失われた古文書のかけらを巡るピクセルRPG。探索、クエスト、ボス戦が待っています。'},
      features:{vi:['Thế giới nhiều bản đồ, NPC và nhiệm vụ','Hệ thống chiến đấu, quái vật và boss','Trang bị, chế tạo và thu thập cổ thư'],en:['Multiple regions, NPCs and quests','Combat, creatures and boss encounters','Gear, crafting and ancient scrolls'],ja:['複数のマップ・NPC・クエスト','戦闘・モンスター・ボス戦','装備・クラフト・古文書の収集']}},
    {id:'taiou',type:'app',image:'assets/product-taiou.webp',gallery:['assets/product-taiou.webp','assets/product-taiou-detail-1.webp','assets/product-taiou-detail-2.webp'],
      title:'Taiou CS Workspace',tag:'JAPANESE CS APP',tags:['Japanese','Learning','Simulation'],url:'',
      description:{vi:'Không gian luyện kỹ năng chăm sóc khách hàng bằng tiếng Nhật, kết hợp mẫu câu, từ vựng, luyện gõ và hội thoại mô phỏng.',en:'A Japanese customer-support learning workspace combining templates, vocabulary, typing drills and simulated service chats.',ja:'日本語カスタマーサポートを学ぶためのワークスペース。定型文、語彙、タイピング練習、模擬チャットをまとめました。'},
      features:{vi:['Mẫu câu xử lý tình huống CS','Từ điển kèm ví dụ và luyện gõ','Hội thoại khách hàng mô phỏng'],en:['Customer-service response templates','Vocabulary and typing practice','Simulated customer conversations'],ja:['問い合わせ対応テンプレート','語彙学習とタイピング練習','お客様との模擬会話']}},
    {id:'quiz',type:'game',image:'assets/product-quiz.webp',gallery:['assets/product-quiz.webp','assets/product-quiz-detail-1.webp','assets/product-quiz-detail-2.webp'],
      title:'Quiz Party',tag:'MULTI MINI-GAMES',tags:['Party','Arcade','Local Multiplayer'],url:'',
      description:{vi:'Một bộ sưu tập mini game vui nhộn cho bạn bè, kết hợp giải trí và những thử thách câu hỏi với giao diện arcade.',en:'A playful mini-game collection for friends that mixes arcade action and question challenges.',ja:'友達と楽しめるミニゲーム集。アーケード風の遊びとクイズを組み合わせています。'},
      features:{vi:['Nhiều mini game trong một giao diện','Chế độ chơi cùng bạn bè trên một máy','Bộ câu hỏi có thể tùy chỉnh'],en:['Multiple mini-games in one hub','Local shared-device multiplayer','Flexible question sets'],ja:['複数のミニゲームを収録','同一端末でのマルチプレイ','カスタマイズ可能なクイズ']}},
    {id:'arcade',type:'game',image:'assets/product-arcade.webp',gallery:['assets/product-arcade.webp','assets/product-arcade-detail-1.webp','assets/product-arcade-detail-2.webp'],
      title:'Arcade Nexus',tag:'3D SURVIVAL',tags:['3D','Survival','Adventure'],url:'',
      description:{vi:'Một không gian arcade kết nối các trò chơi, nổi bật với thử thách sinh tồn trong rừng, dựng trại, thu thập tài nguyên và chống lại những đêm nguy hiểm.',en:'An arcade hub of experiences including forest survival, camp-building, resource gathering and nights full of danger.',ja:'複数のゲームを楽しめるアーケードハブ。森でのサバイバル、キャンプ、資源集め、危険な夜が待っています。'},
      features:{vi:['Sinh tồn và nâng cấp trại lửa','Nhân vật nhiều nghề và đồng hành AI','Thu thập, chế tạo và phòng thủ'],en:['Survive and improve the campfire','Multiple classes and AI companions','Gather, craft and defend'],ja:['サバイバルと焚き火の強化','職業とAI仲間','採集・クラフト・防衛']}},
    {id:'coop',type:'game',image:'assets/product-coop.webp',gallery:['assets/product-coop.webp','assets/product-coop-detail-1.webp','assets/product-coop-detail-2.webp'],
      title:'Co-op Survival',tag:'MULTIPLAYER',tags:['2–4 Players','Co-op','Pixel Art'],url:'',
      description:{vi:'Dự án sinh tồn co-op theo đợt quái dành cho 2–4 người, định hướng pixel art HD và kết nối thời gian thực.',en:'A 2–4 player co-op wave-survival game concept with HD pixel art and real-time multiplayer architecture.',ja:'2〜4人向けの協力型ウェーブサバイバル。HDピクセルアートとリアルタイムマルチプレイを目指しています。'},
      features:{vi:['Co-op 2–4 người','Sinh tồn trước các đợt quái','Kiến trúc hướng tới real-time'],en:['2–4 player co-op','Enemy wave survival','Real-time networking foundation'],ja:['2〜4人協力プレイ','敵のウェーブを乗り切る','リアルタイム通信の基盤']}},
  ]
};


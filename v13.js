(() => {
 'use strict';
 const library=window.PORTALVERSE_V13||{tracks:[],videos:[],projects:[]};
 const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
 const dict={
 vi:{navHome:'Trang chủ',navMusic:'Nhạc Của Tài',navProducts:'Dự án',navAbout:'Về Tài',navContact:'Liên hệ',
 myMusic:'MY MUSICS',myProduct:'PROJECTS',gateMusic:'NHẠC CỦA TÀI',gateProducts:'DỰ ÁN',gateMusicDesc:'Âm nhạc · Karaoke · MV',gateProductDesc:'Web Game · Apps · Dự án',enter:'BƯỚC VÀO',
 backUniverse:'← TRANG CHỦ',musicLead:'Các ca khúc, bản thu và MV của Tài.',productsLead:'Web game, ứng dụng và dự án số do Tài thực hiện.',
 musicOverline:'✦ 01 / ÂM NHẠC',productsRouteOverline:'✳ 02 / DỰ ÁN',nowPlaying:'ĐANG PHÁT',karaokeTitle:'✧ LỜI KARAOKE',lyricsLoading:'Chưa có lời đồng bộ cho bài hát này. Bạn vẫn có thể nghe nhạc đầy đủ.',karaokeFocus:'TOÀN MÀN HÌNH ↗',karaokeClose:'THU NHỎ ↙',musicCollection:'✦ THƯ VIỆN NHẠC',trackList:'DANH SÁCH NHẠC',filterAll:'Tất cả',filterOriginal:'Sáng tác',filterPiano:'Piano',filterGuitar:'Guitar',searchTracks:'Tìm bài hát',demo:'DEMO',
 musicDisclaimer:'',videoSoon:'MV SẮP CẬP NHẬT',filmRealm:'✦ THẾ GIỚI HÌNH ẢNH',mvHeading:'MUSIC',mvLeadNew:'Các thế giới MV và cover được kể qua từng khung hình.',
 productsOverline:'✦ DỰ ÁN',projectLibrary:'KHÁM PHÁ',productInstruction:'Chạm vào một dự án để mở hồ sơ, xem hình ảnh và những tính năng bên trong.',searchProducts:'Tìm dự án',filterGames:'Web Game',filterApps:'Ứng dụng',detail:'KHÁM PHÁ DỰ ÁN',projectDetails:'✦ BÊN TRONG DỰ ÁN',featuresTitle:'ĐIỂM NỔI BẬT',galleryTitle:'GÓC NHÌN KHÁC',conceptNote:'Hình minh họa định hướng, không phải ảnh chụp giao diện sản phẩm thực tế.',visit:'TRẢI NGHIỆM NGAY ↗',projectsOutro:'Một số dự án game và ứng dụng do Tài phát triển.',crossToMusic:'GHÉ THẾ GIỚI ÂM NHẠC ↗',videoPreview:'KHÁM PHÁ KHUNG HÌNH',videoCatMv:'MV',videoCatPiano:'PIANO COVER',videoCatGuitar:'GUITAR COVER',close:'Đóng',noItems:'Chưa có nội dung phù hợp.',trackMissing:'Bản nhạc này chưa có tệp âm thanh.',play:'Phát',pause:'Tạm dừng'},
 en:{navHome:'Home',navMusic:'My Musics',navProducts:'Projects',navAbout:'About',navContact:'Contact',
 myMusic:'MY MUSICS',myProduct:'PROJECTS',gateMusic:'MY MUSICS',gateProducts:'PROJECTS',gateMusicDesc:'Songs · Karaoke · MV',gateProductDesc:'Web Games · Apps · Projects',enter:'ENTER WORLD',
 backUniverse:'← BACK TO HOME',musicLead:'Original music and recordings by Tài.',productsLead:'Web games, applications and selected digital projects.',
 musicOverline:'✦ 01 / MUSIC',productsRouteOverline:'✳ 02 / DIGITAL PROJECTS',nowPlaying:'NOW PLAYING',karaokeTitle:'✧ KARAOKE LYRICS',lyricsLoading:'Timed lyrics will appear here when available. Enjoy the full song!',karaokeFocus:'FULL SCREEN ↗',karaokeClose:'MINIMIZE ↙',musicCollection:'✦ THE COLLECTION',trackList:'MUSIC LIBRARY',filterAll:'All',filterOriginal:'Original',filterPiano:'Piano',filterGuitar:'Guitar',searchTracks:'Search songs',demo:'DEMO',
 musicDisclaimer:'',videoSoon:'MV COMING SOON',filmRealm:'✦ THE VISUAL STORIES',mvHeading:'MUSIC',mvLeadNew:'Worlds of music videos and covers, told frame by frame.',
 productsOverline:'✦ PROJECTS',projectLibrary:'EXPLORE',productInstruction:'Open any project for details, visual concepts and key features.',searchProducts:'Search projects',filterGames:'Web Games',filterApps:'Web Apps',detail:'EXPLORE PROJECT',projectDetails:'✦ INSIDE THE PROJECT',featuresTitle:'HIGHLIGHTS',galleryTitle:'MORE VIEWS',conceptNote:'Concept illustrations, not screenshots of the working product.',visit:'EXPLORE PROJECT ↗',projectsOutro:'Selected games and applications developed by Tài.',crossToMusic:'VISIT THE MUSIC WORLD ↗',videoPreview:'EXPLORE THE STORY',videoCatMv:'MV',videoCatPiano:'PIANO COVER',videoCatGuitar:'GUITAR COVER',close:'Close',noItems:'No matching content.',trackMissing:'No audio file available for this track.',play:'Play',pause:'Pause'},
 ja:{navHome:'ホーム',navMusic:'僕の音楽',navProducts:'プロジェクト',navAbout:'プロフィール',navContact:'連絡先',
 myMusic:'MY MUSICS',myProduct:'PROJECTS',gateMusic:'僕の音楽',gateProducts:'プロジェクト',gateMusicDesc:'音楽 · 歌詞 · MV',gateProductDesc:'Webゲーム · アプリ · プロジェクト',enter:'世界へ入る',
 backUniverse:'← ホームへ戻る',musicLead:'オリジナル楽曲と制作音源を公開しています。',productsLead:'開発したWebゲーム、アプリ、デジタル作品。',
 musicOverline:'✦ 01 / 音楽',productsRouteOverline:'✳ 02 / デジタル作品',nowPlaying:'再生中',karaokeTitle:'✧ カラオケ歌詞',lyricsLoading:'同期歌詞は準備中です。楽曲は最後まで再生できます。',karaokeFocus:'全画面 ↗',karaokeClose:'元に戻す ↙',musicCollection:'✦ 音楽ライブラリ',trackList:'曲の一覧',filterAll:'すべて',filterOriginal:'オリジナル',filterPiano:'ピアノ',filterGuitar:'ギター',searchTracks:'曲を検索',demo:'デモ',
 musicDisclaimer:'',videoSoon:'MV準備中',filmRealm:'✦ 映像の世界',mvHeading:'MUSIC',mvLeadNew:'MVやカバー映像で紡ぐ別世界の物語。',
 productsOverline:'✦ プロジェクト',projectLibrary:'プロジェクト',productInstruction:'作品をタップすると説明、イメージ、機能を見られます。',searchProducts:'作品を検索',filterGames:'Webゲーム',filterApps:'Webアプリ',detail:'作品を見る',projectDetails:'✦ プロジェクト詳細',featuresTitle:'主な機能',galleryTitle:'他のイメージ',conceptNote:'これはコンセプト画像です。実際の製品画面ではありません。',visit:'作品にアクセス ↗',projectsOutro:'制作したゲームやアプリの一部をご紹介します。',crossToMusic:'音楽の世界へ ↗',videoPreview:'映像を見る',videoCatMv:'MV',videoCatPiano:'ピアノカバー',videoCatGuitar:'ギターカバー',close:'閉じる',noItems:'該当する項目がありません。',trackMissing:'この曲の音源はまだありません。',play:'再生',pause:'一時停止'}
 };
 const getLang=()=>['vi','en','ja'].includes(document.documentElement.lang)?document.documentElement.lang:'vi';
 let lang=getLang();const tr=k=>dict[lang]?.[k]||dict.vi[k]||k;
 const loc=x=>(typeof x==='string'?x:x?.[lang]||x?.vi||x?.en||'');
 const svgSafe=s=>typeof s==='string'&&(/^(assets\/[-\w./]+|https:\/\/[^\s]+|data:image\/(?:png|webp|jpeg);base64,[a-z0-9+/=]+)$/i.test(s))?s:'';
 const urlSafe=s=>typeof s==='string'&&/^https:\/\//i.test(s)?s:'';
 const htmlEscape=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
 const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el};
 let route='home',trackIndex=0,activeFilter='all',projectFilter='all',shuffle=false,loop=false,startedAudio=false,lyricLines=[],activeLine=-1;
 const audio=document.createElement('audio');audio.id='portalverse-audio';audio.preload='metadata';audio.volume=.75;document.body.append(audio);
 const tracks=library.tracks||[],projects=library.projects||[],videos=library.videos||[];
 window.PORTALVERSE_AUDIO=audio;window.PORTALVERSE_TRACKS=tracks;window.PORTALVERSE_SELECT_TRACK=(i,autoplay=true)=>selectTrack(i,autoplay);
 window.PORTALVERSE_CURRENT_TRACK=()=>trackIndex;
 const audioSource=s=>typeof s==='string'&&(/^(assets\/[-\w./]+|https:\/\/[^\s]+|data:audio\/mpeg;base64,[a-z0-9+/=]+)$/i.test(s))?s:'';
 const fmt=seconds=>{if(!Number.isFinite(seconds)||seconds<0)return'00:00';return String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(Math.floor(seconds%60)).padStart(2,'0')};
 // Keep the original home, mascot and mini-piano intact. Hide only superseded MV/Covers sections.
 $$('main#main > *').forEach(element=>{if(!element.classList.contains('route-page')&&!element.classList.contains('persistent-mini-player')&&!element.classList.contains('project-modal'))element.classList.add('home-only')});
 const navGroups=[...$$('.desktop-nav .nav-link'),...$$('#mobile-menu a'),...$$('.bottom-nav .bottom-item')];
 const hrefs=['#/home','#/music','#/products','#/about','#/contact'];
 const navKeys=['navHome','navMusic','navProducts','navAbout','navContact'];
 for(const group of [$$('.desktop-nav .nav-link'),$$('#mobile-menu a'),$$('.bottom-nav .bottom-item')])group.forEach((el,i)=>{el.removeAttribute('data-i18n');el.href=hrefs[i];el.dataset.v13Nav=navKeys[i];});
 $('.wordmark')?.setAttribute('href','#/home');$('.footer-logo')?.setAttribute('href','#/home');
 $('#back-to-top')?.addEventListener('click',()=>{location.hash='#/home';});
 const heroVideo=$('[data-open-work="mv-01"]', $('.hero-actions'));
 if(heroVideo){heroVideo.removeAttribute('data-open-work');heroVideo.dataset.v13Route='music';heroVideo.removeAttribute('data-i18n-html')}
 const gateHolder=$('.portal-gates');if(gateHolder){gateHolder.className='portal-gates v13-gates';gateHolder.innerHTML=`<button class="v13-gate music-gate" data-v13-route="music" type="button" aria-label="My Musics"><span class="gate-vortex"></span><span class="gate-icon">♫</span><span class="gate-content"><small class="gate-index">01 / THE SOUND GALAXY</small><strong class="gate-title">MY MUSICS</strong><span class="gate-vi">NHẠC CỦA TÀI</span><span class="gate-enter"><span>ENTER WORLD</span><span>↗</span></span></span></button><button class="v13-gate product-gate" data-v13-route="products" type="button" aria-label="Projects"><span class="gate-vortex"></span><span class="gate-icon">✳</span><span class="gate-content"><small class="gate-index">02 / THE CREATIVE LAB</small><strong class="gate-title">PROJECTS</strong><span class="gate-vi">DỰ ÁN</span><span class="gate-enter"><span>ENTER WORLD</span><span>↗</span></span></span></button>`}
 // The five-star quest remains completable, including stars formerly inside the replaced sections.
 const star3=$('[data-star-id="3"]'),star4=$('[data-star-id="4"]');
 if(star3){star3.className='collectible-star';star3.style.cssText='position:absolute;top:35%;right:1%';$('#route-music .route-shell')?.append(star3)}
 if(star4){star4.className='collectible-star';star4.style.cssText='position:absolute;top:36%;right:1%';$('#route-products .route-shell')?.append(star4)}
 const musicSection=$('#route-music'),productSection=$('#route-products');
 function syncNav(){navGroups.forEach(a=>{const href=a.getAttribute('href');a.classList.toggle('active',href===`#/${route}`||(route==='home'&&href==='#/home'))});}
 function setRoute(page,anchor=''){
  const next=['music','products'].includes(page)?page:'home';route=next;document.body.dataset.view=next;
  musicSection.hidden=next!=='music';productSection.hidden=next!=='products';syncNav();
  $('#realm-status-text').textContent=next==='music'?tr('navMusic'):next==='products'?tr('navProducts'):tr('navHome');
  document.body.dataset.realm=next==='products'?'products':next==='music'?'music':'home';
  document.title=`${next==='music'?tr('navMusic')+' · ':next==='products'?tr('navProducts')+' · ':''}TÀI LÊ | Music & Digital Creations`;
  document.body.classList.remove('karaoke-max');$('#karaoke-focus').textContent=tr('karaokeFocus');
  if(next==='home'&&anchor&&$('#'+anchor)){window.scrollTo({top:0,behavior:'instant'});setTimeout(()=>$('#'+anchor)?.scrollIntoView({block:'start',behavior:'instant'}),20)}else{window.scrollTo({top:0,behavior:'instant'})}
  const mini=$('#persistent-mini-player');mini.hidden=!startedAudio;
 }
 window.PORTALVERSE_ROUTE=(page)=>{setRoute(page);setHash(page)};
 function setHash(next){const h=`#/${next}`;if(location.hash!==h){try{history.pushState(null,'',h)}catch{location.hash=h}}}
 function readHash(){const m=/^#\/(home|music|products|about|contact)/.exec(location.hash);return m?m[1]:'home'}
 function routeFromHash(){const r=readHash();setRoute(r,r==='about'||r==='contact'?r:'')}
 function go(next,withWarp=true){if(next===route&&!['about','contact'].includes(next))return;if(['about','contact'].includes(next)){setHash(next);setRoute(next,next);return}
  if(withWarp&&typeof window.PORTALVERSE_TRAVEL==='function'&&['music','products','home'].includes(next))window.PORTALVERSE_TRAVEL(next==='home'?'home':next==='music'?'route-music':'route-products',next);
  else{setHash(next);setRoute(next)}
 }
 // Capture internal hash-route navigation before old anchor handlers. Nothing reloads: music keeps playing.
 document.addEventListener('click',e=>{const link=e.target.closest('a[href^="#/"]');if(link){e.preventDefault();e.stopImmediatePropagation();const key=link.getAttribute('href').split('/')[1];go(key,['home','music','products'].includes(key));}},true);
 document.addEventListener('click',e=>{const button=e.target.closest('[data-v13-route]');if(button){go(button.dataset.v13Route,true);}},true);
 window.addEventListener('hashchange',routeFromHash);
 window.addEventListener('popstate',routeFromHash);
 // Media / playlist state
 const playerArt=$('#player-art'),playerTitle=$('#player-title'),playerSubtitle=$('#player-subtitle');
 function parseLRC(raw){const lines=[];for(const line of String(raw||'').split(/\r?\n/)){
   const m=line.match(/^\[(\d{1,2}):(\d{2}(?:\.\d{1,3})?)\](.*)$/);if(!m)continue;
   const time=Number(m[1])*60+Number(m[2]);const body=m[3].trim();const words=[];
   const re=/<(\d{1,2}):(\d{2}(?:\.\d{1,3})?)>([^<]*)/g;let w;
   while((w=re.exec(body)))words.push({time:Number(w[1])*60+Number(w[2]),text:w[3].trim()});
   lines.push({time,text:body.replace(/<\d{1,2}:\d{2}(?:\.\d{1,3})?>/g,'').trim(),words});
  }return lines.sort((a,b)=>a.time-b.time)
 }
 function updateLyricTime(force=false){if(!lyricLines.length)return;const current=audio.currentTime||0;let index=-1;for(let i=0;i<lyricLines.length;i++){if(current>=lyricLines[i].time)index=i;else break;}
  const vp=$('#lyrics-viewport');if(activeLine!==index||force){activeLine=index;$$('.lyric-line',vp).forEach((node,i)=>node.classList.toggle('active',i===index));if(index>=0){const line=$$(`.lyric-line`,vp)[index];if(line){vp.scrollTo({top:line.offsetTop-vp.offsetTop-vp.clientHeight/2+line.clientHeight/2,behavior:force?'instant':'smooth'})}}}
  const nextLine=index>=0?lyricLines[index+1]:null;const fadeForBreak=index>=0&&nextLine&&nextLine.time-lyricLines[index].time>7.5&&current<nextLine.time&&current>lyricLines[index].time+Math.min(6.5,(nextLine.time-lyricLines[index].time)*.64);vp.classList.toggle('lyrics-instrumental',!!fadeForBreak);
  $$('.lyric-line',vp).forEach((node,i)=>{if(i!==index)return;$$('.lyric-word',node).forEach((word,j)=>word.classList.toggle('sung',current>=lyricLines[i].words[j].time))});
 }
 function renderLyrics(){const vp=$('#lyrics-viewport');vp.classList.remove('lyrics-instrumental');vp.replaceChildren();lyricLines=parseLRC(tracks[trackIndex]?.lyrics||'');activeLine=-1;
  if(!lyricLines.length){vp.append(make('div','lyric-empty',tr('lyricsLoading')));return;}
  lyricLines.forEach((line,i)=>{const p=make('p','lyric-line');p.lang='vi';p.dataset.time=line.time;p.tabIndex=0;p.setAttribute('role','button');p.setAttribute('aria-label',`Seek to ${fmt(line.time)}`);
   if(line.words.length){for(const word of line.words){p.append(make('span','lyric-word',word.text))}}
   else p.textContent=line.text||'♪';
   p.addEventListener('click',()=>{if(audio.src&&Number.isFinite(audio.duration))audio.currentTime=line.time});p.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();p.click()}});vp.append(p)
  });updateLyricTime(true)
 }
 let lyricsRequest=0;
 function selectTrack(index,autoplay=false){if(!tracks.length)return;trackIndex=(index+tracks.length)%tracks.length;const x=tracks[trackIndex];
  audio.pause();audio.removeAttribute('src');const src=audioSource(x.audio);if(src)audio.src=src;audio.load();
  playerArt.src=svgSafe(x.cover)||'assets/mv-scene.webp';playerArt.alt=loc(x.title);playerTitle.textContent=loc(x.title);playerTitle.lang='vi';playerSubtitle.textContent=x.artist||'Tài';playerSubtitle.lang='vi';
  $('#mini-track-title').textContent=loc(x.title);$('#mini-track-title').lang='vi';$('#mini-track-artist').textContent=x.artist||'Tài';$('#mini-track-artist').lang='vi';$('#mini-cover').src=svgSafe(x.cover)||'assets/mv-scene.webp';$('#player-sample-tag').hidden=!x.demo;$('#player-sample-tag').textContent=tr('demo');
  $('#current-time').textContent='00:00';$('#total-time').textContent='00:00';$('#player-seek').value=0;renderLyrics();renderTracks();updatePlaybackUI();
  // Hosted sites can load an external .lrc or enhanced .lrc; inline lyrics keep the offline HTML usable.
  const requestId=++lyricsRequest;
  if(x.lyricsFile && /^(assets\/[-\w./]+|https:\/\/[^\s]+\.lrc)$/i.test(x.lyricsFile)) {
    fetch(x.lyricsFile).then(r=>{if(!r.ok)throw new Error('LRC unavailable');return r.text()}).then(lrc=>{if(requestId===lyricsRequest){const keepTime=audio.currentTime;x.lyrics=lrc;renderLyrics();if(Number.isFinite(keepTime))updateLyricTime(true)}}).catch(()=>{});
  }
  window.dispatchEvent(new CustomEvent('portalverse:trackchange',{detail:{index:trackIndex,track:x}}));
  if(autoplay){startedAudio=true;audio.play().catch(()=>{showNotice(tr('trackMissing'))});$('#persistent-mini-player').hidden=false;}
 }
 let noticeTimer;function showNotice(value){const el=$('#toast');el.textContent=value;el.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>el.classList.remove('show'),2700)}
 function updatePlaybackUI(){const on=!audio.paused;$('#player-play').textContent=on?'Ⅱ':'▶';$('#player-play').setAttribute('aria-label',on?tr('pause'):tr('play'));$('#mini-player-toggle').textContent=on?'Ⅱ':'▶';$('.live-dot')?.classList.toggle('is-playing',on)}
 function toggleAudio(){const track=tracks[trackIndex];if(!track||!audioSource(track.audio)){showNotice(tr('trackMissing'));return}
  startedAudio=true;$('#persistent-mini-player').hidden=false;
  if(audio.paused)audio.play().catch(()=>showNotice(tr('trackMissing')));else audio.pause();}
 const nextTrack=dir=>{if(!tracks.length)return;let idx;if(shuffle&&tracks.length>1){do{idx=Math.floor(Math.random()*tracks.length)}while(idx===trackIndex)}else idx=(trackIndex+dir+tracks.length)%tracks.length;selectTrack(idx,true)};
 $('#player-play').addEventListener('click',toggleAudio);$('#player-next').addEventListener('click',()=>nextTrack(1));$('#player-prev').addEventListener('click',()=>{if(audio.currentTime>3)audio.currentTime=0;else nextTrack(-1)});
 $('#mini-player-toggle').addEventListener('click',toggleAudio);$('#mini-player-prev').addEventListener('click',()=>{if(audio.currentTime>3)audio.currentTime=0;else nextTrack(-1)});$('#mini-player-next').addEventListener('click',()=>nextTrack(1));
 const miniBar=$('#persistent-mini-player');miniBar.addEventListener('click',e=>{if(e.target.closest('button'))return;go('music',route!=='music')});miniBar.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target===miniBar){e.preventDefault();go('music',route!=='music')}});
 $('#player-shuffle').addEventListener('click',()=>{$('#player-shuffle').classList.toggle('is-on',shuffle=!shuffle);$('#player-shuffle').setAttribute('aria-pressed',String(shuffle))});
 $('#player-loop').addEventListener('click',()=>{$('#player-loop').classList.toggle('is-on',loop=!loop);$('#player-loop').setAttribute('aria-pressed',String(loop))});
 audio.addEventListener('ended',()=>{if(loop){audio.currentTime=0;audio.play().catch(()=>{})}else nextTrack(1)});
 audio.addEventListener('play',()=>{startedAudio=true;updatePlaybackUI();$('#persistent-mini-player').hidden=false});audio.addEventListener('pause',updatePlaybackUI);
 audio.addEventListener('loadedmetadata',()=>{$('#total-time').textContent=fmt(audio.duration)});
 audio.addEventListener('timeupdate',()=>{$('#current-time').textContent=fmt(audio.currentTime);const r=Number.isFinite(audio.duration)&&audio.duration>0?audio.currentTime/audio.duration:0;$('#player-seek').value=Math.floor(r*1000);$('#mini-progress-fill').style.width=`${Math.max(0,Math.min(100,r*100))}%`;updateLyricTime()});
 $('#player-seek').addEventListener('input',ev=>{if(Number.isFinite(audio.duration))audio.currentTime=Number(ev.target.value)/1000*audio.duration});
 $('#player-volume').addEventListener('input',ev=>{audio.volume=Number(ev.target.value)});
 $('#karaoke-focus').addEventListener('click',()=>{const on=document.body.classList.toggle('karaoke-max');$('#karaoke-focus').textContent=tr(on?'karaokeClose':'karaokeFocus')});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.body.classList.contains('karaoke-max')){document.body.classList.remove('karaoke-max');$('#karaoke-focus').textContent=tr('karaokeFocus')}});
 function setFilters(target,items,current,setCurrent){const root=$(target);root.replaceChildren();for(const [key,label] of items){const b=make('button','filter-pill'+(key===current?' active':''),tr(label));b.type='button';b.setAttribute('aria-pressed',String(key===current));b.addEventListener('click',()=>{setCurrent(key);renderAll()});root.append(b)}}
 function renderTracks(){const root=$('#track-list');root.replaceChildren();let count=0;const term=$('#music-search').value.trim().toLowerCase();tracks.forEach((entry,i)=>{
  if(activeFilter!=='all'&&entry.kind!==activeFilter)return;if(term&&!loc(entry.title).toLowerCase().includes(term))return;count++;
  const btn=make('button','track-row'+(i===trackIndex?' selected':''));btn.type='button';const num=make('span','track-num',i===trackIndex&&!audio.paused?'♫':String(i+1).padStart(2,'0'));
  const image=make('img');image.src=svgSafe(entry.cover)||'assets/mv-scene.webp';image.alt='';image.loading='lazy';
  const info=make('span','track-info');info.lang='vi';info.append(make('strong','',loc(entry.title)),make('small','',`${entry.artist||'Tài'}${entry.demo?' · '+tr('demo'):''}`));const end=make('span','track-end','▶');btn.append(num,image,info,end);
  btn.addEventListener('click',()=>{if(trackIndex===i){toggleAudio()}else{selectTrack(i,true)}});root.append(btn);
 });if(!count)root.append(make('p','lyric-empty',tr('noItems')));$('#track-count').textContent=`${count.toString().padStart(2,'0')} TRACKS`;
 }
 $('#music-search').addEventListener('input',renderTracks);
 function openVideo(item){const existing=(window.PORTALVERSE_CONTENT?.works||[]).find(x=>x.video&&x.type===item.category);
   const raw=item.url||existing?.video||'';
   const yt=raw.match(/(?:youtube\.com\/(?:watch\?[^#]*v=|embed\/)|youtu\.be\/)([\w-]{11})/);
   const modal=$('#work-modal'),box=$('#modal-media');if(!modal||modal.open)return;
   box.replaceChildren();if(yt){const iframe=make('iframe');iframe.src=`https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0`;iframe.title=loc(item.title);iframe.allow='autoplay; encrypted-media; picture-in-picture';iframe.allowFullscreen=true;box.append(iframe)}else{const img=make('img');img.src=svgSafe(item.cover)||'assets/mv-scene.webp';img.alt=loc(item.title);box.append(img)}
   $('#modal-title').textContent=loc(item.title);$('#modal-tag').textContent=tr('videoCat'+item.category[0].toUpperCase()+item.category.slice(1));$('#modal-description').textContent=loc(item.description);$('#modal-note').textContent='';modal.showModal();
 }
 function renderVideos(){const root=$('#mv-gallery');root.replaceChildren();videos.forEach(v=>{const b=make('button','mv-gallery-card');b.type='button';const art=make('div','mv-gallery-art');const img=make('img');img.src=svgSafe(v.cover)||'assets/mv-scene.webp';img.alt='';img.loading='lazy';art.append(img,make('span','mv-gallery-play','▶'));const box=make('div','mv-gallery-info');box.append(make('span','',tr('videoCat'+v.category[0].toUpperCase()+v.category.slice(1))),make('strong','',loc(v.title)),make('small','',loc(v.description)));b.append(art,box);if(v.url){b.addEventListener('click',()=>openVideo(v))}else{b.disabled=true;b.classList.add('is-upcoming');art.querySelector('.mv-gallery-play').textContent='✦';box.append(make('small','soon-label',tr('videoSoon')))}root.append(b)})}
 const dialog=$('#project-dialog');
 function renderProducts(){const root=$('#products-grid');root.replaceChildren();const term=$('#product-search').value.trim().toLowerCase();let count=0;
  projects.forEach(p=>{if(projectFilter!=='all'&&p.type!==projectFilter)return;if(term&&!(`${p.title} ${p.tag} ${loc(p.description)}`.toLowerCase().includes(term)))return;count++;
   const b=make('button','product-card');b.type='button';const frame=make('div','product-img');const img=make('img');img.src=svgSafe(p.image)||'assets/mini-portal.webp';img.alt='';img.loading='lazy';frame.append(img,make('span','product-chip',p.tag));
   const inner=make('div','product-body');inner.append(make('h3','',p.title),make('p','',loc(p.description)));const open=make('div','project-open');open.append(make('span','',tr('detail')),make('span','', '↗'));inner.append(open);b.append(frame,inner);b.addEventListener('click',()=>openProject(p));root.append(b);
  });if(!count)root.append(make('p','lyric-empty',tr('noItems')));
 }
 $('#product-search').addEventListener('input',renderProducts);
 function openProject(p){$('#project-title').textContent=p.title;$('#project-cover').src=svgSafe(p.image)||'assets/mini-portal.webp';$('#project-cover').alt=p.title;$('#project-type-label').textContent=p.tag;
  $('#project-description').textContent=loc(p.description);$('#project-tags').replaceChildren(...(p.tags||[]).map(s=>make('span','',s)));$('#project-features').replaceChildren(...(p.features?.[lang]||p.features?.vi||[]).map(s=>make('div','',s)));
  const gallery=$('#project-gallery');gallery.replaceChildren();(p.gallery||[p.image]).forEach((src,i)=>{const b=make('button');b.type='button';b.setAttribute('aria-label',`${p.title} · ${i+1}`);const img=make('img');img.src=svgSafe(src)||svgSafe(p.image);img.alt='';b.append(img);b.addEventListener('click',()=>{$('#project-cover').src=img.src});gallery.append(b)});
  const slot=$('#project-link-slot');slot.replaceChildren();if(urlSafe(p.url)){const a=make('a','launch-link',tr('visit'));a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';slot.append(a)}
  dialog.showModal();document.body.classList.add('project-opened');
 }
 function closeProject(){if(dialog.open)dialog.close()}
 $('#project-close').addEventListener('click',closeProject);dialog.addEventListener('click',e=>{if(e.target===dialog)closeProject()});dialog.addEventListener('close',()=>document.body.classList.remove('project-opened'));
 function renderAll(){setFilters('#track-filters',[['all','filterAll'],['original','filterOriginal'],...(['piano','guitar'].filter(kind=>tracks.some(t=>t.kind===kind)).map(kind=>[kind,kind==='piano'?'filterPiano':'filterGuitar']))],activeFilter,k=>{activeFilter=k});setFilters('#product-filters',[['all','filterAll'],['game','filterGames'],['app','filterApps']],projectFilter,k=>{projectFilter=k});renderTracks();renderVideos();renderProducts()}
 function translate(){lang=getLang();
  const routeHeadings={vi:[['NHẠC','CỦA TÀI'],['DỰ','ÁN']],en:[['MY','MUSICS'],['','PROJECTS']],ja:[['私の','音楽'],['','プロジェクト']]};
  const labels=routeHeadings[lang]||routeHeadings.vi;
  [['.music-heading',labels[0]],['.product-heading',labels[1]]].forEach(([selector,parts])=>{const node=$(selector);if(node){node.querySelector('span').textContent=parts[0];node.querySelector('em').textContent=parts[1]}});
  const playerSpace=$('.eyebrow-cyan');if(playerSpace)playerSpace.textContent={vi:'TÀI LÊ / ÂM NHẠC',en:'TÀI LÊ / MUSIC',ja:'TÀI LÊ / 音楽'}[lang];
$$('[data-v13]').forEach(el=>{const val=tr(el.dataset.v13);el.textContent=val; if(el.dataset.v13==='musicDisclaimer')el.hidden=true;});$$('[data-placeholder-v13]').forEach(el=>el.placeholder=tr(el.dataset.placeholderV13));
  $$('[data-v13-nav]').forEach(el=>{const s=el.querySelector('small');if(s)s.textContent=tr(el.dataset.v13Nav);else el.textContent=tr(el.dataset.v13Nav)});
  $$('.v13-gate').forEach((g,i)=>{g.querySelector('.gate-title').textContent=tr(i===0?'myMusic':'myProduct');g.querySelector('.gate-vi').textContent=tr(i===0?'gateMusic':'gateProducts');g.querySelector('.gate-enter span').textContent=tr('enter');g.setAttribute('aria-label',tr(i===0?'navMusic':'navProducts'))});
  if(heroVideo)heroVideo.innerHTML=`<span class="play-icon">▶</span> ${htmlEscape(tr('navMusic'))}`;
  $('#player-sample-tag').textContent=tr('demo');$('#karaoke-focus').textContent=tr(document.body.classList.contains('karaoke-max')?'karaokeClose':'karaokeFocus');
  $('#player-title').textContent=loc(tracks[trackIndex]?.title);$('#player-title').lang='vi';$('#player-subtitle').textContent=tracks[trackIndex]?.artist||'Tài';$('#player-subtitle').lang='vi';$('#mini-track-artist').textContent=tracks[trackIndex]?.artist||'Tài';$('#mini-track-artist').lang='vi';$('#mini-track-title').textContent=loc(tracks[trackIndex]?.title);$('#mini-track-title').lang='vi';renderAll();
  if(dialog.open){const p=projects.find(x=>x.title===$('#project-title').textContent);if(p)openProjectRefresh(p)}
  if(route!=='home')document.title=`${route==='music'?tr('navMusic'):tr('navProducts')} · TÀI LÊ | Music & Digital Creations`;
 }
 function openProjectRefresh(p){$('#project-description').textContent=loc(p.description);$('#project-features').replaceChildren(...(p.features?.[lang]||p.features?.vi||[]).map(s=>make('div','',s)));const slot=$('#project-link-slot a');if(slot)slot.textContent=tr('visit')}
 const languageObs=new MutationObserver(()=>{if(getLang()!==lang)translate()});languageObs.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // Rewire the original mystery portal, so it now genuinely explores the two route destinations.
 const mystery=$('#mystery-portal-button'),surprise=$('#surprise-button');
 for(const b of [mystery,surprise])if(b)b.addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();go(Math.random()>.5?'music':'products',true)},true);
 translate();selectTrack(0,false);routeFromHash();
})();

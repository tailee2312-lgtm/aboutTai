/* Portalverse v1.4.0 — audio-reactive listening universe and creator's five original tracks. */
(() => {
 'use strict';
 const $=s=>document.querySelector(s), audio=window.PORTALVERSE_AUDIO, tracks=window.PORTALVERSE_TRACKS||[];
 if(!audio||!tracks.length)return;
 const localized={
  vi:{title:'CHỌN MỘT VÌ SAO',lead:'Chọn một ca khúc từ bản đồ sao.', mood:'CHỌN TÂM TRẠNG',dream:'Mơ màng',energy:'Năng lượng',love:'Lãng mạn',memory:'Hoài niệm',surprise:'Bất ngờ',wave:'SÓNG ÂM TRỰC TIẾP',real:'5 CA KHÚC · TÀI LÊ', fullscreen:'KHÔNG GIAN NGHE NHẠC',moodNote:'Gợi ý theo màu sắc cảm xúc của bài hát',soon:'MV đang được cập nhật',closing:'Cảm ơn bạn đã lắng nghe.'},
  en:{title:'PICK A STAR',lead:'Select a track from the constellation.',mood:'CHOOSE YOUR MOOD',dream:'Dreamy',energy:'Energy',love:'Romance',memory:'Nostalgia',surprise:'Surprise',wave:'LIVE AUDIO WAVE',real:'5 TRACKS · TÀI LÊ',fullscreen:'IMMERSIVE LISTENING',moodNote:'A soundtrack to your mood',soon:'Music videos are coming soon',closing:'Thanks for listening.'},
  ja:{title:'星を選んで',lead:'星を選んで楽曲を再生できます。',mood:'気分で選ぶ',dream:'夢心地',energy:'元気',love:'ロマンチック',memory:'思い出',surprise:'おまかせ',wave:'ライブ音声ビジュアライザー',real:'5曲 · TÀI LÊ',fullscreen:'音楽の世界に浸る',moodNote:'気分に合わせて曲を探そう',soon:'MVは準備中です',closing:'ご視聴ありがとうございます。'}
 };
 const lang=()=>localized[document.documentElement.lang]||localized.vi;
 const safeIndex=()=>Math.max(0,Math.min(tracks.length-1,Number(window.PORTALVERSE_CURRENT_TRACK?.()??0)));
 let current=safeIndex();
 const colorThemes=[['#8eddfc','#ff75d7'],['#ffb86b','#ffe26b'],['#ff75c5','#b98cff'],['#7becff','#efa0ed'],['#d4ff79','#7cffe8']];
 const setAccent=()=>{const [a,b]=colorThemes[current%colorThemes.length];document.documentElement.style.setProperty('--active-accent',a);document.documentElement.style.setProperty('--active-accent2',b);};
 // Build an actual record behind the cover rather than replacing the album art.
 const panel=$('.player-art-panel'),art=$('#player-art');
 if(panel&&art){
  const stage=document.createElement('div');stage.className='v14-vinyl-stage';
  art.parentNode.insertBefore(stage,art);
  const vinyl=document.createElement('div');vinyl.className='v14-vinyl-record';vinyl.innerHTML='<span class="v14-record-center">✳</span>';
  stage.append(vinyl,art);
  const canvas=document.createElement('canvas');canvas.id='v14-wave';canvas.width=600;canvas.height=92;canvas.setAttribute('aria-label','Audio visualizer');canvas.setAttribute('role','img');panel.append(canvas);
  // No redundant credits or count below the audio visualizer.
 }
 // Constellation map with five accessible song selections.
 const layout=$('.music-layout');
 const sky=document.createElement('section');sky.className='v14-starfield-section';sky.setAttribute('aria-label','Interactive music constellation');
 sky.innerHTML=`<div class="v14-starhead"><h2 data-v14="title"></h2><p data-v14="lead"></p></div><div class="v14-constellation" id="v14-constellation"><div class="v14-orbit-ring ring-a"></div><div class="v14-orbit-ring ring-b"></div><span class="v14-skyline">TÀI LÊ<br><small>✳ MUSIC UNIVERSE</small></span></div><div class="v14-moods"><div class="v14-moods-head"><h3 data-v14="mood"></h3><p data-v14="moodNote"></p></div><div class="v14-mood-buttons" id="v14-mood-buttons"></div></div>`;
 layout?.insertAdjacentElement('afterend',sky);
 const starRoot=$('#v14-constellation');
 tracks.forEach((track,i)=>{
  const b=document.createElement('button');b.type='button';b.className=`v14-song-star star-${i+1}`;
  b.style.setProperty('--starglow',colorThemes[i%5][0]); b.setAttribute('aria-label',track.title.vi||track.title);
  const img=document.createElement('img');img.src=track.cover;img.alt='';img.loading='lazy';
  const text=document.createElement('span');text.textContent=typeof track.title==='string'?track.title:track.title.vi;text.lang='vi';
  const sparkle=document.createElement('i');sparkle.textContent='✦';b.append(img,text,sparkle);
  b.addEventListener('click',()=>{
    if(b.classList.contains('v18-bursting'))return;
    const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduced){
      b.classList.add('v18-bursting');
      const layer=document.createElement('span');layer.className='v18-star-particles';layer.setAttribute('aria-hidden','true');
      for(let n=0;n<14;n++){
        const p=document.createElement('i');const angle=(n/14)*Math.PI*2;
        p.style.setProperty('--dx',(Math.cos(angle)*(32+(n%4)*12)).toFixed(1)+'px');
        p.style.setProperty('--dy',(Math.sin(angle)*(26+(n%3)*15)).toFixed(1)+'px');
        p.style.setProperty('--delay',((n%4)*13)+'ms');
        layer.appendChild(p);
      }
      b.appendChild(layer);
      setTimeout(()=>{layer.remove();b.classList.remove('v18-bursting')},610);
    }
    window.PORTALVERSE_SELECT_TRACK?.(i,true);
    setTimeout(()=>$('.player-surface')?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'center'}),reduced?0:520);
  });starRoot?.append(b);
 });
 const moods=[['dream',0,'☁'],['energy',1,'⚡'],['love',2,'♡'],['memory',4,'✧'],['surprise',-1,'✳']];
 moods.forEach(([key,index,ico])=>{const b=document.createElement('button');b.type='button';b.className='v14-mood-button';b.dataset.key=key;b.append(document.createElement('span'));b.firstElementChild.className='v14-mood-glyph';b.firstElementChild.textContent=ico;const label=document.createElement('span');label.className='v14-mood-label';label.textContent=lang()[key];b.append(label);
  b.addEventListener('click',()=>{const target=index<0?Math.floor(Math.random()*tracks.length):index;window.PORTALVERSE_SELECT_TRACK?.(target,true);$('.player-surface')?.scrollIntoView({block:'center',behavior:'smooth'})});$('#v14-mood-buttons')?.append(b)});
 const footer=$('.music-videos-title');if(footer){const s=document.createElement('span');s.className='v14-video-soon';s.setAttribute('data-v14','soon');footer.append(s)}
 const musicFooter=document.createElement('div');musicFooter.className='v14-music-footer';musicFooter.setAttribute('data-v14','closing');$('#route-music .route-shell')?.append(musicFooter);
 // Equalizer: visual effects are tied to actual FFT values, not a canned random animation.
 const visual=$('#v14-wave');const ctx=visual?.getContext('2d');let actx,analyser,frequency,raf=0,initialized=false;
 function makeGraph(){
  if(initialized)return; initialized=true;
  const AudioContext=window.AudioContext||window.webkitAudioContext;
  if(!AudioContext||!ctx)return;
  try{actx=new AudioContext();const node=actx.createMediaElementSource(audio);analyser=actx.createAnalyser();analyser.fftSize=256;analyser.smoothingTimeConstant=.83;node.connect(analyser);analyser.connect(actx.destination);frequency=new Uint8Array(analyser.frequencyBinCount)}catch(e){console.warn('Visualizer not available:',e);}
 }
 function renderWave(){raf=0;if(!ctx||document.hidden)return;
  const w=visual.width,h=visual.height;ctx.clearRect(0,0,w,h);const cols=47, barW=5, gap=7, total=cols*(barW+gap), start=(w-total)/2;
  if(analyser&&frequency)analyser.getByteFrequencyData(frequency);
  for(let i=0;i<cols;i++){const bin=3+Math.floor(i*.92);const val=analyser?frequency[Math.min(frequency.length-1,bin)]/255:0;
    const height=Math.max(5,Math.pow(val,.8)*(h-14));const x=start+i*(barW+gap),y=(h-height)/2;
    ctx.fillStyle=i%3===0?'#ed7acb':i%3===1?'#74eaff':'#d4ff68';ctx.shadowBlur=val*19;ctx.shadowColor=ctx.fillStyle;ctx.beginPath();ctx.roundRect(x,y,barW,height,3);ctx.fill();}
  ctx.shadowBlur=0;
  if(!audio.paused)raf=requestAnimationFrame(renderWave)
 }
 function refreshWave(){cancelAnimationFrame(raf);raf=0;if(!audio.paused){makeGraph();actx?.resume().catch(()=>{});renderWave()}else if(ctx){renderWave()}}
 // Graph initialization occurs in a visitor interaction to satisfy audio autoplay and WebAudio rules.
 document.addEventListener('pointerdown',e=>{if(e.target.closest('#player-play,#player-next,#player-prev,#mini-player-toggle,.track-row,.v14-song-star,.v14-mood-button'))makeGraph()},{capture:true,passive:true});
 audio.addEventListener('play',()=>{document.body.classList.add('v14-is-playing');refreshWave()});
 audio.addEventListener('pause',()=>{document.body.classList.remove('v14-is-playing');refreshWave()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0}else if(!audio.paused)renderWave()});
 function refresh(){setAccent();starRoot?.querySelectorAll('.v14-song-star').forEach((el,i)=>el.classList.toggle('is-current',i===current));}
 window.addEventListener('portalverse:trackchange',e=>{current=e.detail.index;refresh()});
 refresh();
 function translate(){document.querySelectorAll('[data-v14]').forEach(el=>{el.textContent=lang()[el.dataset.v14]||''});$('#v14-mood-buttons')?.querySelectorAll('[data-key]').forEach(el=>{const label=el.querySelector('.v14-mood-label');if(label)label.textContent=lang()[el.dataset.key]});}
 translate();new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // Mouse-responsive project cards, disabled for touch/low-motion users.
 const hoverOK=window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches;
 if(hoverOK){document.addEventListener('pointermove',e=>{const card=e.target.closest('.product-card');if(!card)return;const rect=card.getBoundingClientRect();const x=Math.max(0,Math.min(1,(e.clientX-rect.left)/rect.width)),y=Math.max(0,Math.min(1,(e.clientY-rect.top)/rect.height));card.style.setProperty('--tilt-x',((.5-y)*6).toFixed(2)+'deg');card.style.setProperty('--tilt-y',((x-.5)*7).toFixed(2)+'deg');card.style.setProperty('--cursor-x',(x*100)+'%');card.style.setProperty('--cursor-y',(y*100)+'%')});
  const resetTilt=card=>{if(!card)return;card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');};
  document.addEventListener('pointerout',e=>{const card=e.target.closest('.product-card');if(card&&!card.contains(e.relatedTarget))resetTilt(card)});
  document.addEventListener('pointerup',e=>resetTilt(e.target.closest('.product-card')));
  document.addEventListener('pointercancel',e=>resetTilt(e.target.closest('.product-card')));
  window.addEventListener('blur',()=>document.querySelectorAll('.product-card').forEach(resetTilt));
 }
 // Reveal cards on scroll without blocking accessibility or rendering offscreen contents.
 if('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion:reduce)').matches){
  const io=new IntersectionObserver(entries=>{entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('v14-visible');io.unobserve(en.target)}})},{threshold:.05});
  new MutationObserver(()=>document.querySelectorAll('.product-card:not(.v14-observed),.track-row:not(.v14-observed)').forEach(el=>{el.classList.add('v14-observed');io.observe(el)})).observe($('#products-grid')||document.body,{subtree:true,childList:true});
  document.querySelectorAll('.product-card,.track-row').forEach(el=>{el.classList.add('v14-observed');io.observe(el)});
 }
})();

(() => {
  'use strict';
  const data = window.PORTALVERSE_CONTENT || {};
  const dictionaries=window.PORTALVERSE_I18N||{};
  const getInitialLanguage=()=>{try{const saved=localStorage.getItem('portalverse-language');return ['vi','en','ja'].includes(saved)?saved:'vi';}catch{return 'vi';}};
  let language=getInitialLanguage();
  const t=(key)=>dictionaries[language]?.[key]||dictionaries.vi?.[key]||key;
  const localizedData=()=>data.localized?.[language]||{};
  const localizedWork=(item)=>({ ...item,...(localizedData().works?.[item.id]||{}) });
  const effectsOn = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (query, root = document) => root.querySelector(query);
  const $$ = (query, root = document) => [...root.querySelectorAll(query)];
  const asset = (name) => (window.PORTALVERSE_EMBEDDED_ASSETS || {})[name] || `assets/mascot-${name}.webp`;
  const reactions = ['happy', 'love', 'sparkles', 'surprise', 'star-eyes', 'shy', 'sleepy', 'dizzy', 'laugh'];
  const byId = (id) => {const item=(data.works || []).find((entry) => entry.id === id);return item?localizedWork(item):null;};
  const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const safeImage = (url) => {
    if (typeof url !== 'string') return '';
    const value = url.trim();
    return /^(assets\/[-\w./]+|https?:\/\/[^\s]+|data:image\/(?:webp|png|jpeg);base64,[A-Za-z0-9+/=]+)$/i.test(value) ? value : '';
  };
  const iconNames = {youtube:'▶',tiktok:'♪',instagram:'◎',facebook:'✳',spotify:'◉'};
  let toastTimer, reactionTimer, idleTimer;

  // Inject real author data into layout, keeping the design useful with empty media links.
  if (data.artist) document.title = `${data.artist} · MUSIC & DIGITAL PROJECTS`;
  if (data.intro) $('#hero-intro').textContent = data.intro;
  if (data.about) $('#about-content').textContent = data.about;
  $('#year').textContent = new Date().getFullYear();
  const primaryMV = (data.works || []).find(x => x.type === 'mv');
  if (primaryMV) {
    $('#mv-title').textContent = primaryMV.title;
    $('#mv-subtitle').textContent = primaryMV.subtitle || '';
    const img = safeImage(primaryMV.thumbnail);
    if (img) $('#mv-image').style.backgroundImage = `linear-gradient(0deg,rgba(5,7,38,.48),transparent 55%),url("${img.replace(/"/g,'%22')}")`;
    $$('[data-open-work="mv-01"]').forEach(el => el.setAttribute('data-open-work',primaryMV.id));
  }
  for (const category of ['piano','guitar']) {
    const item=(data.works||[]).find(x=>x.type===category);
    if(item){
      const card=$(`[data-world="${category}"]`);
      if(card){
        const art=$('.artwork',card);
        const img=safeImage(item.thumbnail);
        if(img)art.style.backgroundImage=`url("${img.replace(/"/g,'%22')}")`;
        const link=$('[data-open-work]',card);
        link.setAttribute('data-open-work',item.id);
        link.setAttribute('aria-label',`Mở ${item.title}`);
      }
    }
  }

  // Small seeded star field: deterministic visual density, no external assets or canvas loop.
  const starsEl=$('#stars');
  let seed=43167;
  const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  if(starsEl){
    const frag=document.createDocumentFragment();
    for(let i=0;i<145;i++){
      const star=document.createElement('span');star.className='star';
      const r=rand();const size=r>.94?3:r>.66?2:1;
      star.style.left=`${(rand()*100).toFixed(2)}%`;
      star.style.top=`${(rand()*100).toFixed(2)}%`;
      star.style.width=`${size}px`;star.style.height=`${size}px`;
      star.style.color=['#fff','#d9aaff','#7deaff','#ffce74'][Math.floor(rand()*4)];
      star.style.setProperty('--alpha',(0.35+rand()*.55).toFixed(2));
      star.style.setProperty('--duration',`${(2.2+rand()*3.5).toFixed(2)}s`);
      star.style.animationDelay=`-${(rand()*5).toFixed(2)}s`;
      frag.appendChild(star);
    }
    starsEl.appendChild(frag);
  }

  // Mascot: normalized 460×500 sprite canvases with persistent click-selected expression.
  const mascot=$('#mascot');
  const mascotImg=$('#mascot-image');
  const visual=$('#hero-visual');
  const pupilLayer=$('#tracking-pupils');
  let reaction='surprise',mascotClicks=0,userSelectedMascot=false;
  const setMascot=(next,hold=0,origin='ambient')=>{
    if(origin!=='user')return; // never override a visitor's chosen expression
    if(!reactions.includes(next))return;
    reaction=next;mascotImg.src=asset(next);
    mascot.classList.toggle('is-looking',next==='surprise');
  };
  mascotImg.src=asset('surprise');mascot.classList.add('is-looking');
  const scheduleIdle=()=>{}; // visitor choices remain stable, even after inactivity
  mascot.addEventListener('click',()=>{
    userSelectedMascot=true;
    const order=['surprise','happy','love','sparkles','star-eyes','shy','sleepy','dizzy','laugh'];
    mascotClicks=(mascotClicks+1)%order.length;
    setMascot(order[mascotClicks],0,'user');
    if(mascotClicks===8)showToast('✦ '+t('starFound'));
  });
  if(window.matchMedia('(pointer:fine)').matches&&!prefersReducedMotion){
    let targetX=0,targetY=0,currentX=0,currentY=0,raf=0;
    const aura=$('#pointer-aura');
    document.addEventListener('pointermove',ev=>{
      const rect=visual.getBoundingClientRect();
      targetX=Math.max(-1,Math.min(1,(ev.clientX-(rect.left+rect.width/2))/(rect.width*.48)));
      targetY=Math.max(-1,Math.min(1,(ev.clientY-(rect.top+rect.height/2))/(rect.height*.45)));
      pupilLayer.style.setProperty('--eye-x',`${(targetX*8).toFixed(2)}px`);
      pupilLayer.style.setProperty('--eye-y',`${(targetY*6).toFixed(2)}px`);
      aura.style.opacity='1';aura.style.left=`${ev.clientX}px`;aura.style.top=`${ev.clientY}px`;
      if(!raf)raf=requestAnimationFrame(frame);
    },{passive:true});
    function frame(){
      currentX+=(targetX-currentX)*.12;currentY+=(targetY-currentY)*.12;
      visual.style.setProperty('--cursor-x',currentX.toFixed(3));
      visual.style.setProperty('--cursor-y',currentY.toFixed(3));
      raf=(Math.abs(currentX-targetX)>.006||Math.abs(currentY-targetY)>.006)?requestAnimationFrame(frame):0;
    }
    document.addEventListener('pointerleave',()=>{aura.style.opacity='0';targetX=0;targetY=0;if(!raf)raf=requestAnimationFrame(frame)});
  }
  // On touch devices, tap position adjusts the gaze while the expression remains intact.
  visual.addEventListener('pointerdown',ev=>{
    if(ev.pointerType==='mouse')return;
    const r=visual.getBoundingClientRect();
    pupilLayer.style.setProperty('--eye-x',`${Math.max(-8,Math.min(8,(ev.clientX-r.left-r.width/2)/r.width*16)).toFixed(2)}px`);
  });

  // Surprises and friendly feedback.
  function showToast(message){const toast=$('#toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3400)}
  // Menu + navigation active state.
  const menuButton=$('#menu-button'), mobileMenu=$('#mobile-menu');
  const closeMenu=()=>{menuButton.setAttribute('aria-expanded','false');mobileMenu.hidden=true};
  menuButton.addEventListener('click',()=>{const opened=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!opened));mobileMenu.hidden=opened});
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',()=>{closeMenu();scheduleIdle();}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu()});
  document.addEventListener('click',e=>{if(!mobileMenu.hidden && !mobileMenu.contains(e.target)&&!menuButton.contains(e.target))closeMenu()});
  $('#back-to-top').addEventListener('click',()=>window.scrollTo({top:0,behavior:prefersReducedMotion?'instant':'smooth'}));
  const activeSections=['home','music','covers','about','contact'];
  const updateNav=()=>{
    const t=window.scrollY+window.innerHeight*.4;
    let selected='home';
    for(const id of activeSections){const el=$(`#${id}`);if(el&&el.getBoundingClientRect().top+window.scrollY<=t)selected=id}
    $$('.nav-link,.bottom-item').forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${selected}`));
    const height=document.documentElement.scrollHeight-window.innerHeight;
    $('#reading-progress').style.width=`${height>0?Math.min(100,window.scrollY/height*100):0}%`;
  };
  window.addEventListener('scroll',updateNav,{passive:true});updateNav();

  // In-page interdimensional travel. Works on file:// and static hosting.
  const rift=$('#rift-transition');
  let traveling=false,travelTimer1=0,travelTimer2=0;
  const realmNames={
    home:['00 / 03','realmHome','#a85dff'], 'portal-map':['MAP / 03','realmMap','#b7f873'],
    music:['01 / 03','realmMusic','#ff55ba'],products:['02 / 03','realmProducts','#dbff6a'],piano:['02 / 03','realmPiano','#36eeff'],
    guitar:['03 / 03','realmGuitar','#ffb23c'],covers:['02–03 / 03','realmCovers','#5bddff'],
    about:['EXTRA / 03','realmAbout','#adff6c'],contact:['FINALE / 03','realmContact','#cf77ff']
  };
  function showRealm(id){
    const realm=realmNames[id]?id:'home';
    document.body.dataset.realm=realm;
    $('#realm-status-text').textContent=t(realmNames[realm][1]);
  }
  function switchDimension(which){
    const dimension=['piano','guitar'].includes(which)?which:'both';
    $$('.dimension-chip').forEach(c=>{
      const selected=c.dataset.dimension===dimension;
      c.classList.toggle('active',selected);
      c.setAttribute('aria-pressed',String(selected));
    });
    $$('.dimension-card').forEach(card=>card.classList.toggle('is-hidden',dimension!=='both'&&card.dataset.world!==dimension));
    $('.dimension-grid').classList.toggle('single',dimension!=='both');
    setMascot(dimension==='piano'?'shy':dimension==='guitar'?'laugh':'sparkles',2300);
  }
  function navigateTo(target,realm,changeHash=true){
    if(target==='route-music'||target==='route-products'){window.PORTALVERSE_ROUTE?.(target==='route-music'?'music':'products');return;}
    const element=$('#'+target);
    if(!element)return;
    if(realm==='piano'||realm==='guitar')switchDimension(realm);
    else if(target==='covers')switchDimension('both');
    showRealm(realm||target);
    if(changeHash && location.hash!=='#'+target){try{history.pushState({},'', '#'+target)}catch{ /* Embedded previews may have an opaque origin. */ }}
    element.scrollIntoView({behavior:'instant',block:'start'});
    updateNav();
  }
  // Lightweight GPU-composited transition: no particles, canvas or per-frame JS work.
  function travelTo(target,realm=target){
    if(traveling||target.startsWith('/'))return;
    const desired=target==='route-music'?'music':target==='route-products'?'products':target==='home'?'home':null;
    if(desired && document.body.dataset.view===desired)return;
    if(target!=='home'&&!$('#'+target))return;
    if(!desired){navigateTo(target,realm);return;}
    traveling=true;
    const info=realmNames[realm]||realmNames[target]||realmNames.home;
    $('#rift-counter').textContent=`DIMENSION ${info[0]}`;
    $('#rift-name').textContent=t(info[1]);
    rift.style.setProperty('--travel-color',info[2]);
    // Four random light-weight scene transitions. Only true page changes reach travelTo.
    const variant='pulse'; // The only page transition: Center Pulse + Star Flash.
    rift.dataset.motion=variant;
    rift.classList.remove('is-exiting');
    rift.classList.add('is-active');
    const arrive=()=>{if(desired)window.PORTALVERSE_ROUTE?.(desired);else navigateTo(target,realm)};
    if(prefersReducedMotion){arrive();rift.classList.remove('is-active');traveling=false;return}
    clearTimeout(travelTimer1);clearTimeout(travelTimer2);
    travelTimer1=setTimeout(()=>{arrive();rift.classList.add('is-exiting')},260);
    travelTimer2=setTimeout(()=>{rift.classList.remove('is-active','is-exiting');traveling=false},620);
  }
  function mysteryTravel(){
    const destinations=[['music','music'],['covers','piano'],['covers','guitar'],['about','about'],['playground','portal-map']];
    const [target,world]=destinations[Math.floor(Math.random()*destinations.length)];
    showToast(t('mysteryToast'));setTimeout(()=>travelTo(target,world),210);
  }
  $('#surprise-button')?.addEventListener('click',mysteryTravel);
  $('#mystery-portal-button')?.addEventListener('click',mysteryTravel);
  $$('[data-portal-to]').forEach(button=>button.addEventListener('click',()=>{
    travelTo(button.dataset.portalTo,button.dataset.portalWorld||button.dataset.portalTo);
  }));
  document.addEventListener('click',ev=>{
    const link=ev.target.closest('a[href^="#"]');
    if(!link||ev.defaultPrevented||ev.ctrlKey||ev.metaKey||ev.altKey||ev.shiftKey)return;
    const href=link.getAttribute('href');
    if(!href||href==='#')return;
    const target=href.slice(1);
    if(target.startsWith('/'))return;
    if(!$('#'+target))return;
    ev.preventDefault();
    closeMenu();
    travelTo(target,target);
  });
  window.addEventListener('popstate',()=>{
    const id=decodeURIComponent(location.hash.slice(1))||'home';
    if(id.startsWith('/'))return;
    if($('#'+id))navigateTo(id,id,false);
  });
  // Realm glow reacts to visible content, without a permanent frame loop.
  if('IntersectionObserver' in window){
    const sections=['home','music','covers','about','contact'].map(id=>$('#'+id)).filter(Boolean);
    const observer=new IntersectionObserver(entries=>{
      if(traveling)return;
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if(visible){const current=visible.target.id;const selected=$('.dimension-chip.active');const realm=current==='covers'&&selected&&selected.dataset.dimension!=='both'?selected.dataset.dimension:current;showRealm(realm);}
    },{rootMargin:'-15% 0px -50% 0px',threshold:[0,.15,.35]});
    sections.forEach(el=>observer.observe(el));
  }
  showRealm('home');
  // One scroll listener, throttled to animation frames; max 160px drift.
  let parallaxWaiting=false;
  const applyDepth=()=>{
    parallaxWaiting=false;
    if(!effectsOn||prefersReducedMotion)return;
    visual.style.setProperty('--scroll-drift',`${Math.min(160,Math.max(0,scrollY)*.25).toFixed(2)}px`);
  };
  window.addEventListener('scroll',()=>{
    if(!parallaxWaiting){parallaxWaiting=true;requestAnimationFrame(applyDepth)}
  },{passive:true});

  // World selector.
  $$('.dimension-chip').forEach(chip=>chip.addEventListener('click',()=>{
    const dimension=chip.dataset.dimension;
    if(dimension!=='both' && !prefersReducedMotion){
      if(traveling)return;
      switchDimension(dimension);
      travelTo('covers',dimension);
    }else{switchDimension(dimension);showRealm(dimension==='both'?'covers':dimension);}
  }));
  $$('.dimension-chip').forEach(c=>c.setAttribute('aria-pressed',String(c.classList.contains('active'))));

  // Add extra cards automatically if new works are listed in config.js.
  const extras=(data.works||[]).filter(w=>['mv','piano','guitar'].includes(w.type)&&w!== (data.works||[]).find(x=>x.type===w.type));
  if(extras.length){
    const container=document.createElement('div');container.className='extra-works-grid';
    extras.forEach(item=>{
      const button=document.createElement('button');button.type='button';button.className='extra-work';button.dataset.openWork=item.id;
      const image=document.createElement('img');image.loading='lazy';image.src=safeImage(item.thumbnail)||'assets/mini-portal.webp';image.alt='';
      const info=document.createElement('div');
      const type=document.createElement('small');type.textContent=`${item.type.toUpperCase()} · ${item.tag||'NEW RELEASE'}`;
      const title=document.createElement('strong');title.textContent=item.title;
      info.append(type,title);button.append(image,info);container.appendChild(button);
    });
    const heading=document.createElement('h3');heading.className='extra-works-title';heading.textContent='MORE FROM MY UNIVERSE ✦';
    $('#covers').after(heading,container);
  }

  // Video overlay: YouTube/Vimeo not guessed; no made-up artist links. Supports direct mp4/webm.
  const modal=$('#work-modal');
  function videoEmbed(raw){
    if(!raw||typeof raw!=='string')return null;
    const input=raw.trim();
    const m=/^[\w-]{11}$/.test(input)?[null,input]:input.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?[^#]*v=|embed\/|shorts\/))([\w-]{11})/);
    if(m)return {type:'youtube',src:`https://www.youtube-nocookie.com/embed/${m[1]}?autoplay=1&rel=0`};
    if(/^https?:\/\//i.test(input)&&/\.(?:mp4|webm)(?:[?#].*)?$/i.test(input))return {type:'video',src:input};
    return null;
  }
  const makeImage=(url)=>{const image=document.createElement('img');image.src=safeImage(url)||'assets/mv-scene.webp';image.alt='Ảnh tác phẩm';return image};
  function openWork(id){
    const item=byId(id);
    if(!item){showToast(t('missingWork'));return}
    const media=$('#modal-media');media.replaceChildren();
    const embed=videoEmbed(item.video);
    if(embed){
      if(embed.type==='youtube'){
        const iframe=document.createElement('iframe');iframe.src=embed.src;iframe.title=item.title;iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';iframe.referrerPolicy='strict-origin-when-cross-origin';iframe.allowFullscreen=true;media.append(iframe);
      }else{
        const video=document.createElement('video');video.src=embed.src;video.controls=true;video.autoplay=true;video.playsInline=true;video.style.cssText='width:100%;height:100%;object-fit:contain';media.append(video);
      }
    }else{media.append(makeImage(item.thumbnail))}
    $('#modal-tag').textContent=item.tag||item.type.toUpperCase();
    $('#modal-title').textContent=item.title;
    $('#modal-description').textContent=item.subtitle||'';
    const note=$('#modal-note');
    note.textContent=embed?t('videoNote'):t('previewNote');
    modal.showModal();document.body.style.overflow='hidden';
    setMascot('star-eyes',3000);
  }
  document.addEventListener('click',(ev)=>{
    const element=ev.target.closest('[data-open-work]');
    if(element)openWork(element.dataset.openWork);
  });
  function closeModal(){if(modal.open)modal.close()}
  $('#modal-close').addEventListener('click',closeModal);
  modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});
  modal.addEventListener('close',()=>{$('#modal-media').replaceChildren();document.body.style.overflow='';});

  // Only show real links, never dev-only placeholder buttons.
  const socials=$('#social-links');
  function populateSocials(){
    socials.replaceChildren();let count=0;
    for(const [platform,glyph] of Object.entries(iconNames)){
      const url=(data.socials||{})[platform];
      if(!url||!/^https?:\/\//i.test(url))continue;
      const link=document.createElement('a');link.className='social-link';link.href=url;link.target='_blank';link.rel='noopener noreferrer';
      const ico=document.createElement('span');ico.textContent=glyph;const label=document.createElement('strong');label.textContent=platform[0].toUpperCase()+platform.slice(1);
      link.append(ico,label);socials.append(link);count++;
    }
    if(data.email){const a=document.createElement('a');a.className='social-link';a.href=`mailto:${encodeURIComponent(data.email)}`;a.textContent='✉ Email';socials.append(a);count++;}
    if(!count){const text=document.createElement('span');text.className='no-social-message';text.textContent=t('noContact');socials.append(text);}
  }
  populateSocials();

  // Sound is only created after an explicit visitor interaction. No media autoplay.
  let audioContext=null;
  const pianoKeys=$$('#mini-piano .piano-key');
  function soundNote(frequency,key){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      if(!audioContext)audioContext=new AC();
      if(audioContext.state==='suspended')audioContext.resume();
      const now=audioContext.currentTime;
      const o1=audioContext.createOscillator(),o2=audioContext.createOscillator(),gain=audioContext.createGain(),filter=audioContext.createBiquadFilter();
      filter.type='lowpass';filter.frequency.value=2600;
      o1.type='triangle';o1.frequency.value=frequency;
      o2.type='sine';o2.frequency.value=frequency*2;
      gain.gain.setValueAtTime(.001,now);gain.gain.exponentialRampToValueAtTime(.21,now+.016);
      gain.gain.exponentialRampToValueAtTime(.06,now+.18);gain.gain.exponentialRampToValueAtTime(.001,now+1.1);
      o1.connect(filter);o2.connect(filter);filter.connect(gain);gain.connect(audioContext.destination);
      o1.start(now);o2.start(now);o1.stop(now+1.12);o2.stop(now+1.12);
      key.classList.add('pressed');setTimeout(()=>key.classList.remove('pressed'),180);
      const bars=$$('#piano-visualizer i');bars.forEach((bar,i)=>bar.style.setProperty('--note-power',`${30+Math.sin(i*1.3+frequency)*20+Math.random()*50}%`));
      $('#piano-visualizer').classList.remove('playing');void $('#piano-visualizer').offsetWidth;$('#piano-visualizer').classList.add('playing');
    }catch(err){/* Visitors without WebAudio still have the visual keyboard. */}
  }
  pianoKeys.forEach(k=>k.addEventListener('pointerdown',()=>soundNote(Number(k.dataset.note),k)));
  document.addEventListener('keydown',event=>{
    if(event.repeat||event.ctrlKey||event.altKey||event.metaKey||event.target.matches('input,textarea,select,[contenteditable]'))return;
    const key=pianoKeys.find(k=>k.dataset.key===event.key.toUpperCase());
    if(key){event.preventDefault();soundNote(Number(key.dataset.note),key)}
  });

  // Collectibles shared between sessions, no user data transmitted anywhere.
  let collected=new Set();
  try{const stored=JSON.parse(localStorage.getItem('portalverse-stars')||'[]');if(Array.isArray(stored))collected=new Set(stored.filter(x=>['1','2','3','4','5'].includes(x)));}catch{}
  function updateStars(){
    $$('#star-count').forEach(el=>el.textContent=collected.size);
    $$('[data-star-id]').forEach(el=>{el.classList.toggle('collected',collected.has(el.dataset.starId));el.disabled=collected.has(el.dataset.starId);el.setAttribute('aria-label',`${t('starAria')} ${el.dataset.starId}/5`)});
    $('#star-quest').classList.toggle('quest-completed',collected.size===5);
  }
  $$('[data-star-id]').forEach(star=>star.addEventListener('click',()=>{
    if(collected.has(star.dataset.starId))return;
    collected.add(star.dataset.starId);
    try{localStorage.setItem('portalverse-stars',JSON.stringify([...collected]))}catch{}
    updateStars();showToast(collected.size===5?t('starFinished'):`✦ ${t('starFound')} ${collected.size}/5`);
    if(collected.size===5){document.body.classList.add('magic-burst');setTimeout(()=>document.body.classList.remove('magic-burst'),2000);}
  }));
  updateStars();

  // Instant trilingual UI: no reload, hash/scroll/mascot state preserved.
  const languageButton=$('#language-button'),languageMenu=$('#language-menu');
  function closeLanguage(){languageMenu.hidden=true;languageButton.setAttribute('aria-expanded','false')}
  function updateLanguage(next,save=true){
    if(!dictionaries[next])return;
    language=next;document.documentElement.lang=next;
    document.documentElement.dataset.language=next;
    document.title='TÀI LÊ · MUSIC & DIGITAL PROJECTS';
    $('#language-code').textContent=next==='ja'?'JP':next.toUpperCase();
    languageButton.setAttribute('aria-label',t('selectLanguage'));
    $$('[data-i18n]').forEach(el=>{const key=el.dataset.i18n;if(dictionaries[next][key])el.textContent=t(key)});
    $$('[data-i18n-html]').forEach(el=>{const key=el.dataset.i18nHtml;if(dictionaries[next][key])el.innerHTML=t(key)});
    $$('[data-i18n-aria]').forEach(el=>el.setAttribute('aria-label',t(el.dataset.i18nAria)));
    $$('[data-language]').forEach(el=>{const on=el.dataset.language===next;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on))});
    $('#hero-intro').textContent=localizedData().intro||data.intro||'';
    $('#about-content').textContent=localizedData().about||data.about||'';
    for(const kind of ['mv','piano','guitar']){
      const item=(data.works||[]).find(w=>w.type===kind);
      if(!item)continue;
      const resolved=localizedWork(item);
      if(kind==='mv'){$('#mv-title').textContent=resolved.title;$('#mv-subtitle').textContent=resolved.subtitle||'';}
      const card=$(`[data-world="${kind}"]`);
      card?.querySelector('[data-open-work]')?.setAttribute('aria-label',resolved.title);
    }
    $$('.extra-work').forEach(el=>{const item=byId(el.dataset.openWork);if(item){el.querySelector('strong').textContent=item.title}});
    $('#realm-status-text').textContent=t(realmNames[document.body.dataset.realm||'home']?.[1]||'realmHome');
    $('#rift-name').textContent=t(realmNames[document.body.dataset.realm||'home']?.[1]||'realmHome');
    if(modal?.open)$('#modal-note').textContent=$('#modal-media iframe, #modal-media video')?t('videoNote'):t('previewNote');
    populateSocials();updateStars();
    if(save)try{localStorage.setItem('portalverse-language',next)}catch{}
    closeLanguage();
  }
  languageButton.addEventListener('click',e=>{e.stopPropagation();const opened=languageMenu.hidden;languageMenu.hidden=!opened;languageButton.setAttribute('aria-expanded',String(opened));});
  $$('[data-language]').forEach(button=>button.addEventListener('click',()=>updateLanguage(button.dataset.language)));
  document.addEventListener('click',e=>{if(!$('#language-switch').contains(e.target))closeLanguage()});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLanguage()});
  updateLanguage(language,false);

  window.PORTALVERSE_TRAVEL=travelTo;
  // Lightweight hover tilt — leave screen readers and touch devices unaffected.
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches&&!prefersReducedMotion){
    $$('.tilt-card').forEach(card=>{
      card.addEventListener('pointermove',e=>{
        const box=card.getBoundingClientRect();
        const x=(e.clientX-box.left)/box.width-.5,y=(e.clientY-box.top)/box.height-.5;
        card.style.transform=`perspective(1000px) rotateX(${(-y*2.1).toFixed(2)}deg) rotateY(${(x*2.1).toFixed(2)}deg) translateY(-4px)`;
      });
      card.addEventListener('pointerleave',()=>{card.style.transform=''});
    });
  }
})();

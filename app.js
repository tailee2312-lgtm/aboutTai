/* COMPONENT: app.js */
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
  // Real page changes have one dedicated controller. In-page navigation never animates.
  function travelTo(target,realm=target){
    const page=(target==='route-music'||target==='music')?'music':(target==='route-products'||target==='products')?'products':target==='home'?'home':null;
    if(page){
      if(typeof window.TAI_PAGE_TRANSITION==='function')window.TAI_PAGE_TRANSITION(page);
      else window.PORTALVERSE_ROUTE?.(page);
      return;
    }
    navigateTo(target,realm);
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

;
/* COMPONENT: v13.js */
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

;
/* COMPONENT: v14.js */
/* Portalverse v1.4.0 — audio-reactive listening universe and creator's five original tracks. */
(() => {
 'use strict';
 const $=s=>document.querySelector(s), audio=window.PORTALVERSE_AUDIO, tracks=window.PORTALVERSE_TRACKS||[];
 if(!audio||!tracks.length)return;
 const localized={
  vi:{title:'TINH HÀ ÂM NHẠC',lead:'', mood:'CHỌN TÂM TRẠNG',dream:'Mơ màng',energy:'Năng lượng',love:'Lãng mạn',memory:'Hoài niệm',surprise:'Bất ngờ',wave:'SÓNG ÂM TRỰC TIẾP',real:'5 CA KHÚC · TÀI LÊ', fullscreen:'KHÔNG GIAN NGHE NHẠC',moodNote:'Gợi ý theo màu sắc cảm xúc của bài hát',soon:'MV đang được cập nhật',closing:'Cảm ơn bạn đã lắng nghe.'},
  en:{title:'MUSIC ORBITS',lead:'',mood:'CHOOSE YOUR MOOD',dream:'Dreamy',energy:'Energy',love:'Romance',memory:'Nostalgia',surprise:'Surprise',wave:'LIVE AUDIO WAVE',real:'5 TRACKS · TÀI LÊ',fullscreen:'IMMERSIVE LISTENING',moodNote:'A soundtrack to your mood',soon:'Music videos are coming soon',closing:'Thanks for listening.'},
  ja:{title:'音楽の軌道',lead:'',mood:'気分で選ぶ',dream:'夢心地',energy:'元気',love:'ロマンチック',memory:'思い出',surprise:'おまかせ',wave:'ライブ音声ビジュアライザー',real:'5曲 · TÀI LÊ',fullscreen:'音楽の世界に浸る',moodNote:'気分に合わせて曲を探そう',soon:'MVは準備中です',closing:'ご視聴ありがとうございます。'}
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
 sky.innerHTML=`<div class="v14-starhead"><h2 data-v14="title"></h2><p data-v14="lead"></p></div><div class="v14-constellation" id="v14-constellation"><div class="v14-orbit-ring ring-a"></div><div class="v14-orbit-ring ring-b"></div><div class="v14-orbit-ring ring-c"></div><span class="v14-skyline">TÀI LÊ<br><small>MUSIC · ORBITAL SYSTEM</small></span></div><div class="v14-moods"><div class="v14-moods-head"><h3 data-v14="mood"></h3><p data-v14="moodNote"></p></div><div class="v14-mood-buttons" id="v14-mood-buttons"></div></div>`;
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
  if(analyser&&frequency){
    analyser.getByteFrequencyData(frequency);
    // Publish smoothed audio energies for the shared cosmic background. No duplicate AudioContext.
    const avg=(a,b)=>{let z=0;for(let k=a;k<b;k++)z+=frequency[k]||0;return z/Math.max(1,b-a)/255};
    window.TAI_AUDIO_LEVELS={bass:avg(1,9),mid:avg(9,34),high:avg(34,83)};
  }
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

;
/* COMPONENT: portal-glyphs.js */
/* PORTALVERSE ICON SYSTEM | v1.5.0
  Original in-house SVG glyphs. No emoji font, no icon library. */
(()=>{'use strict';
 const NS='http://www.w3.org/2000/svg';
 const KEYMAP={"✦": "nova", "✧": "spark", "✳": "asterisk", "✴": "spark", "✶": "star", "★": "star", "☆": "star", "♡": "heart", "♥": "heart", "❤": "heart", "♫": "music", "♪": "music", "𝄞": "music", "▶": "play", "⏵": "play", "Ⅱ": "pause", "⏸": "pause", "⏮": "previous", "⏭": "next", "⤨": "shuffle", "↻": "repeat", "↗": "arrow", "←": "back", "↑": "up", "↓": "down", "↘": "diag-down", "⌄": "chevron", "⌂": "home", "⌘": "products", "◉": "vinyl", "↙": "back", "◎": "language", "⌕": "search", "✉": "mail", "✕": "close", "×": "close", "☁": "cloud", "⚡": "lightning", "🌟": "star", "🎵": "music", "🎶": "music", "🎮": "game", "💿": "vinyl", "🚀": "arrow", "🎹": "piano", "🎸": "guitar", "🔊": "volume"};
 const GLYPH_RX=new RegExp("[✦✧✳✴✶★☆♡♥❤♫♪𝄞▶⏵Ⅱ⏸⏮⏭⤨↻↗←↑↓↘⌄⌂◎⌕✉✕×☁⚡🌟🎵🎶🎮💿🚀🎹🎸🔊]", "gu");
 const BLOCKED=new Set(['SCRIPT','STYLE','SVG','TEXTAREA','NOSCRIPT','TITLE','OPTION']);
 function glyph(name, extra=''){
   const svg=document.createElementNS(NS,'svg');
   svg.setAttribute('viewBox','0 0 32 32');svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false');
   svg.setAttribute('class','pv-glyph '+(extra||''));
   const use=document.createElementNS(NS,'use');use.setAttribute('href','#pv-'+(name||'spark'));svg.append(use);
   return svg;
 }
 function iconizeText(node){
   if(!node||!node.parentElement || BLOCKED.has(node.parentElement.tagName) ||node.parentElement.closest('[data-no-glyphs]'))return;
   const value=node.nodeValue||'';if(!GLYPH_RX.test(value))return;
   GLYPH_RX.lastIndex=0;
   const frag=document.createDocumentFragment();let start=0,match;
   while((match=GLYPH_RX.exec(value))){
     if(match.index>start)frag.append(document.createTextNode(value.slice(start,match.index)));
     const name=KEYMAP[match[0]]||'spark';
     const el=glyph(name,'pv-icon-'+name);
     if(node.parentElement.matches('button,a')&&node.parentElement.getAttribute('title')===match[0]) node.parentElement.removeAttribute('title');
     frag.append(el);start=match.index+match[0].length;
   }
   if(start<value.length)frag.append(document.createTextNode(value.slice(start)));
   node.replaceWith(frag);
 }
 function walk(root){
   if(!root)return;
   if(root.nodeType===Node.TEXT_NODE){iconizeText(root);return;}
   if(root.nodeType!==Node.ELEMENT_NODE&&root.nodeType!==Node.DOCUMENT_FRAGMENT_NODE)return;
   if(root.nodeType===Node.ELEMENT_NODE&&(BLOCKED.has(root.tagName)||root.hasAttribute('data-no-glyphs')))return;
   const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
   const found=[];let t;
   while((t=walker.nextNode()))if(t.parentElement&&!BLOCKED.has(t.parentElement.tagName)&&(t.nodeValue||'').match(GLYPH_RX))found.push(t);
   found.forEach(iconizeText);
 }
 function upgradeAccessibility(){
   // Icon actions must preserve their real accessible names, not reveal unicode glyphs.
   const names={'player-prev':'Bài trước','player-next':'Bài tiếp','player-shuffle':'Trộn bài','player-repeat':'Lặp lại','player-volume':'Âm lượng'};
   for(const [id,name] of Object.entries(names)){const el=document.getElementById(id);if(el&&!el.getAttribute('aria-label'))el.setAttribute('aria-label',name)}
   document.querySelectorAll('button.collectible-star').forEach(el=>el.removeAttribute('title'));
 }
 const library=document.createElement('div');library.innerHTML='<svg id="pv-portal-glyph-library" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" style="position:absolute;width:0;height:0;overflow:hidden"><defs><symbol id="pv-spark" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 1 20.3 11.7 31 16 20.3 20.3 16 31 11.7 20.3 1 16 11.7 11.7Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M16 7v18M7 16h18"/></g></symbol>\n<symbol id="pv-nova" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 2c1.7 8 5.3 11.7 14 14-8.7 2.3-12.3 6-14 14-1.7-8-5.3-11.7-14-14C10.7 13.7 14.3 10 16 2Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m7 4 1.2 3.8L12 9l-3.8 1.2L7 14l-1.2-3.8L2 9l3.8-1.2L7 4Z"/></g></symbol>\n<symbol id="pv-star" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 2.5 19.8 12l9.9 3.1-9.2 5-1.1 10.3L16 24.1l-8.5 6.3-1.1-10.3-9.1-5 9.8-3.1z" transform="translate(2 0) scale(.88 1)"/><circle class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" cx="16" cy="16" r="2.3"/></g></symbol>\n<symbol id="pv-asterisk" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="4"/><path d="M16 1v9m0 12v9M1 16h9m12 0h9M5.4 5.4l6.4 6.4m8.4 8.4 6.4 6.4M26.6 5.4l-6.4 6.4m-8.4 8.4-6.4 6.4"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M16 12v8m-4-4h8"/></g></symbol>\n<symbol id="pv-heart" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 28C9 23 3.5 19 3.5 12.8 3.5 4.5 13 3 16 10c3-7 12.5-5.5 12.5 2.8C28.5 19 23 23 16 28Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m9 15 4-2 2 4 6-6"/></g></symbol>\n<symbol id="pv-play" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4.8 27 16 9 27.2Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M5 10v12M13 16h7"/></g></symbol>\n<symbol id="pv-pause" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h6v22H7zM19 5h6v22h-6z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M10 2v3m12 22v3"/></g></symbol>\n<symbol id="pv-next" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="m4 6 13 10L4 26V6Zm13 0 11 10-11 10V6Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M29 5v22"/></g></symbol>\n<symbol id="pv-previous" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="m28 6-13 10 13 10V6Zm-13 0L4 16l11 10V6Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M3 5v22"/></g></symbol>\n<symbol id="pv-shuffle" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h5c8 0 8 18 16 18h5m-5-5 5 5-5 5M3 25h5c8 0 8-18 16-18h5m-5-5 5 5-5 5"/><circle class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" cx="16" cy="16" r="3"/></g></symbol>\n<symbol id="pv-repeat" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M8 8h15l-4-4m4 4-4 4M24 24H9l4 4m-4-4 4-4M27 12a13 13 0 0 1 0 8M5 20a13 13 0 0 1 0-8"/><circle class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" cx="16" cy="16" r="3"/></g></symbol>\n<symbol id="pv-arrow" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M6 26 26 6M12 6h14v14"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m5 15 0 12 12 0"/></g></symbol>\n<symbol id="pv-back" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M26 16H5M14 7l-9 9 9 9"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M24 11V6M24 6h-5"/></g></symbol>\n<symbol id="pv-up" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 28V4M6 14 16 4l10 10"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M9 27h14"/></g></symbol>\n<symbol id="pv-down" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4v24M6 18l10 10 10-10"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M9 5h14"/></g></symbol>\n<symbol id="pv-diag-down" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6 26 26M12 26h14V12"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M5 20v7h7"/></g></symbol>\n<symbol id="pv-chevron" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="m5 11 11 11 11-11"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M16 3v8"/></g></symbol>\n<symbol id="pv-close" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5 27 27M27 5 5 27"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M15 2h3M15 30h3M2 15v3M30 15v3"/></g></symbol>\n<symbol id="pv-home" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="m3 15 13-11 13 11-3 3v11H6V18z"/><path d="M12 29V19h8v10"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m9 10 7-5 7 5"/></g></symbol>\n<symbol id="pv-music" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M12 24V8l15-4v17M12 8l15-4"/><ellipse cx="7" cy="25" rx="5" ry="3.5"/><ellipse cx="22" cy="22" rx="5" ry="3.5"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M12 12 27 8"/></g></symbol>\n<symbol id="pv-vinyl" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="13"/><circle cx="16" cy="16" r="5"/><circle cx="16" cy="16" r="1" fill="currentColor"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M16 3c6 0 13 7 13 13m-26 0c0 7 7 13 13 13"/></g></symbol>\n<symbol id="pv-video" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8c0-2 2-3 4-3h18c3 0 4 1 4 4v14c0 3-2 4-4 4H7c-2 0-4-2-4-4z"/><path d="m13 10 10 6-10 6z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M4 10h4M24 22h4"/></g></symbol>\n<symbol id="pv-products" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="m16 2 12 7v14l-12 7-12-7V9z"/><path d="m4 9 12 7 12-7M16 16v14"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m10 12 12-7M9 20l5 3"/></g></symbol>\n<symbol id="pv-game" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11h18c3 0 5 3 5 6l-2 9c-1 4-4 4-7 2l-5-4-5 4c-3 2-6 2-7-2l-2-9c0-3 2-6 5-6Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M11 15v8M7 19h8"/><circle cx="23" cy="17" r="1.6"/><circle cx="26" cy="21" r="1.6"/></g></symbol>\n<symbol id="pv-app" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M5 4h22v24H5z"/><path d="M5 11h22M11 11v17"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M16 17h7M16 22h4M9 8h1M14 8h1"/></g></symbol>\n<symbol id="pv-search" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 20.5 29 29M24 13c0 6-5 11-11 11S2 19 2 13 7 2 13 2s11 5 11 11Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M8 13c0-3 2-5 5-5"/></g></symbol>\n<symbol id="pv-language" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 2 28 7v16L16 30 4 23V7Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M4 15h24M16 2c-9 7-9 21 0 28 9-7 9-21 0-28Z"/></g></symbol>\n<symbol id="pv-volume" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h7l8-7v22l-8-7H3z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M22 11c3 2 3 8 0 10m3-14c6 4 6 14 0 18"/></g></symbol>\n<symbol id="pv-mail" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h26v18H3z"/><path d="m3 8 13 10L29 8"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m4 24 9-9m15 9-9-9"/></g></symbol>\n<symbol id="pv-user" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="10" r="6"/><path d="M4 29v-4c0-7 5-10 12-10s12 3 12 10v4Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M10 22h12"/></g></symbol>\n<symbol id="pv-world" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="13"/><path d="M3 16h26M16 3c-8 8-8 18 0 26 8-8 8-18 0-26Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M6 9c7 4 13 4 20 0M6 23c7-4 13-4 20 0"/></g></symbol>\n<symbol id="pv-lyrics" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h18v22H7z"/><path d="M11 11h11m-11 5h7m-7 5h8"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m23 17 6-4v11"/></g></symbol>\n<symbol id="pv-expand" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M13 4H4v9m15-9h9v9M4 19v9h9m15-9v9h-9"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M11 11 4 4m17 7 7-7m-17 17-7 7m17-7 7 7"/></g></symbol>\n<symbol id="pv-link" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M11 11 6 16c-4 4-2 11 3 12 3 1 6 0 8-2l5-5M21 21l5-5c4-4 2-11-3-12-3-1-6 0-8 2l-5 5"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m12 20 8-8"/></g></symbol>\n<symbol id="pv-piano" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h26v22H3z"/><path d="M10 6v22m6-22v22m7-22v22"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M8 6v11h5V6m6 0v11h5V6"/></g></symbol>\n<symbol id="pv-guitar" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3 29 11 18 22c-2 7-9 9-13 5S3 16 10 14L21 3Z"/><circle cx="10" cy="22" r="3"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M19 5 27 13m-14 7 9-9M6 25l7-7"/></g></symbol>\n<symbol id="pv-cloud" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M8 25c-8 0-8-11 0-12 1-7 11-12 17-4 9-1 10 13 2 15Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m13 19 3-5 3 5m-3-5v9"/></g></symbol>\n<symbol id="pv-lightning" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2 5 19h11l-2 11 13-17H16z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m18 6-3 7"/></g></symbol>\n<symbol id="pv-memory" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3c-8 0-13 6-13 13s5 13 13 13 13-6 13-13S24 3 16 3Z"/><path d="M16 8v9l7 4"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m7 4-4 4 5 1"/></g></symbol>\n<symbol id="pv-mystery" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M16 2c9 0 14 7 14 14S25 30 16 30 2 23 2 16 7 2 16 2Z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M11 12c0-3 2-5 5-5 4 0 6 2 6 5 0 4-6 4-6 9m0 3v2"/></g></symbol>\n<symbol id="pv-headphones" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18v-4C4 5 9 2 16 2s12 3 12 12v4"/><path d="M4 16h6v12H6c-2 0-2-1-2-3zm18 0h6v9c0 2 0 3-2 3h-4z"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="M10 7c3-3 9-3 12 0"/></g></symbol>\n<symbol id="pv-gallery" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h20v17H4zM9 3h19v19"/><path d="m4 21 6-7 5 4 4-4 5 7"/><circle class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" cx="18" cy="11" r="2"/></g></symbol>\n<symbol id="pv-check" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="16" r="13"/><path class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" d="m9 16 5 5 9-11"/></g></symbol>\n<symbol id="pv-menu" viewBox="0 0 32 32"><g class="base" fill="none" stroke="currentColor" stroke-width="2.35" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h24M4 16h18M4 24h24"/><circle class="a" stroke="var(--glyph-accent, #6df5ff)" stroke-width="1.8" cx="26" cy="16" r="2"/></g></symbol></defs></svg>';document.body.insertBefore(library.firstElementChild,document.body.firstChild);
 walk(document.body);upgradeAccessibility();
 const obs=new MutationObserver(records=>{
   const work=new Set();
   records.forEach(m=>{
     if(m.type==='characterData')work.add(m.target);
     else m.addedNodes.forEach(n=>work.add(n));
   });
   work.forEach(walk);
 });
 obs.observe(document.body,{subtree:true,childList:true,characterData:true});
 window.PortalGlyphs={create:glyph,refresh:()=>walk(document.body)};
})();

;
/* COMPONENT: unified-motion */
/* TÀI LÊ / one motion owner: three previewable transitions, still ellipse rings,
   independently orbiting album centres, one music-reactive background. */
(()=>{
 'use strict';
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const $=s=>document.querySelector(s);
 const overlay=$('#rift-transition');
 const valid=['pulse','spiral','ribbon'];
 let choice='pulse';
 try{const value=localStorage.getItem('tai-transition-choice');if(valid.includes(value))choice=value}catch{}
 const sampleButtons=[...document.querySelectorAll('[data-transition-choice]')];
 function syncChoices(){for(const b of sampleButtons){const on=b.dataset.transitionChoice===choice;b.classList.toggle('is-selected',on);b.setAttribute('aria-pressed',String(on))}}
 syncChoices();
 let pending=null,transitioning=false;
 const clean=()=>{if(overlay)overlay.classList.remove('is-active');transitioning=false;pending=null};
 function playTransition(which,route){
   if(transitioning){return false}
   if(!overlay||reduce.matches){if(route)route();return true}
   transitioning=true;
   overlay.dataset.effect=valid.includes(which)?which:'pulse';
   overlay.classList.remove('is-active');
   void overlay.offsetWidth;
   overlay.classList.add('is-active');
   let arrived=false;
   const arrive=()=>{if(!arrived){arrived=true;route?.()}};
   pending=setTimeout(arrive,530);
   setTimeout(()=>{arrive();clean()},1140);
   return true;
 }
 // Preview controls don't navigate or interrupt music. Choice persists across reloads.
 for(const b of sampleButtons)b.addEventListener('click',()=>{
   choice=b.dataset.transitionChoice;syncChoices();
   try{localStorage.setItem('tai-transition-choice',choice)}catch{}
   playTransition(choice,null);
 });
 window.TAI_PAGE_TRANSITION=(destination)=>{
   if(!['home','music','products'].includes(destination)||!window.PORTALVERSE_ROUTE)return;
   if(transitioning||document.body.dataset.view===destination)return;
   playTransition(choice,()=>window.PORTALVERSE_ROUTE(destination));
 };
 // A translated sample gallery without injecting labels into permanent navigation.
 const localized={
   vi:{transitionsOverline:'HOẠT ẢNH',transitionsTitle:'Thử chuyển cảnh',transitionsLead:'Chọn một hiệu ứng để xem thử. Hiệu ứng đã chọn sẽ dùng khi chuyển giữa các trang.',tryNow:'Xem thử'},
   en:{transitionsOverline:'PAGE MOTION',transitionsTitle:'Preview transitions',transitionsLead:'Try any effect. Your selection will be used between pages.',tryNow:'Preview'},
   ja:{transitionsOverline:'画面の切り替え',transitionsTitle:'切り替えを試す',transitionsLead:'効果を選んでプレビューできます。選択した効果がページ切り替え時に使われます。',tryNow:'プレビュー'}
 };
 function translate(){const l=localized[document.documentElement.lang]||localized.vi;document.querySelectorAll('[data-tai-lang]').forEach(el=>el.textContent=l[el.dataset.taiLang]||'')}
 translate();new MutationObserver(translate).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 // Background star layer is independent of the old decorative star quest.
 const field=$('#universe-stars');
 if(field){let seed=872623;const rand=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296};
  const amount=matchMedia('(max-width:700px)').matches?42:74;
  for(let i=0;i<amount;i++){
    const star=document.createElement('span');star.className='universe-star'+(i%13===0?' is-spark':'');
    const x=(rand()*100).toFixed(2)+'%',y=(rand()*100).toFixed(2)+'%',sz=(1+rand()*2.8).toFixed(1)+'px';
    star.style.cssText=`--x:${x};--y:${y};--size:${sz};--o:${(.35+rand()*.5).toFixed(2)};--period:${(2.6+rand()*6).toFixed(1)}s;--delay:-${(rand()*8).toFixed(1)}s;--shade:${i%3===0?'#9fefff':i%3===1?'#fff1ff':'#ffd4f4'}`;
    field.append(star);
  }
 }
 // A stationary atomic orbital system: every card centre is calculated on the SAME
 // rotated ellipse that CSS paints. Ring transform never changes during animation.
 const sky=$('#v14-constellation');
 if(sky){
  const rings=[...sky.querySelectorAll('.v14-orbit-ring')];
  const songs=[...sky.querySelectorAll('.v14-song-star')];
  const map=[0,1,2,0,1],offsets=[.08,.37,.67,.55,.85];
  const period=[43,59,72,91,108],direction=[1,-1,1,-1,1];
  const sizes=rings.map(()=>({x:0,y:0,ang:0}));
  let visible=true,elapsed=0,last=0;
  function measure(){
    rings.forEach((ring,i)=>{
      const s=getComputedStyle(ring);
      sizes[i]={x:Math.max(0,(ring.offsetWidth-parseFloat(s.borderLeftWidth||'0'))/2),
                y:Math.max(0,(ring.offsetHeight-parseFloat(s.borderTopWidth||'0'))/2),
                ang:parseFloat(s.getPropertyValue('--ring-angle'))*Math.PI/180||0};
    });
  }
  function position(){songs.forEach((song,i)=>{
    const orbit=sizes[map[i]];if(!orbit)return;
    const a=(offsets[i]+direction[i]*elapsed/period[i])*Math.PI*2;
    const ex=orbit.x*Math.cos(a),ey=orbit.y*Math.sin(a);
    const x=ex*Math.cos(orbit.ang)-ey*Math.sin(orbit.ang);
    const y=ex*Math.sin(orbit.ang)+ey*Math.cos(orbit.ang);
    song.style.setProperty('--orbit-x',x.toFixed(2)+'px');
    song.style.setProperty('--orbit-y',y.toFixed(2)+'px');
    song.dataset.orbitRing=String(map[i]);
  })}
  measure();position();
  if('ResizeObserver'in window)new ResizeObserver(()=>{measure();position()}).observe(sky);
  else addEventListener('resize',()=>{measure();position()},{passive:true});
  if('IntersectionObserver'in window)new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);last=0},{rootMargin:'140px'}).observe(sky);
  document.addEventListener('visibilitychange',()=>{last=0});
  function tick(now){
    if(!last)last=now;
    const dt=Math.min((now-last)/1000,.07);last=now;
    if(visible&&!document.hidden&&!reduce.matches&&document.body.dataset.view==='music'){
      elapsed+=dt;position();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
 }
 // Shared sound-reactive background reuses the existing analyser; never creates another AudioContext.
 let bass=0,mid=0,high=0,lastVisual=0;
 const audio=window.PORTALVERSE_AUDIO;
 const playing=()=>!!(audio&&!audio.paused);
 if(audio){audio.addEventListener('play',()=>document.body.classList.add('music-playing'));audio.addEventListener('pause',()=>document.body.classList.remove('music-playing'));audio.addEventListener('ended',()=>document.body.classList.remove('music-playing'))}
 function atmos(now){
   if(now-lastVisual>70&&!document.hidden){
     const f=playing()?window.TAI_AUDIO_LEVELS||{bass:0,mid:0,high:0}:{bass:0,mid:0,high:0};
     bass+=((f.bass||0)-bass)*.16;mid+=((f.mid||0)-mid)*.16;high+=((f.high||0)-high)*.16;
     const s=document.documentElement.style;
     s.setProperty('--audio-bass',bass.toFixed(3));s.setProperty('--audio-mid',mid.toFixed(3));s.setProperty('--audio-high',high.toFixed(3));
     lastVisual=now;
   }
   requestAnimationFrame(atmos);
 }
 requestAnimationFrame(atmos);
 // Preserve native Vietnamese diacritics while Japanese UI is selected.
 for(const id of ['player-title','player-subtitle','mini-track-title','mini-track-artist','lyrics-viewport']){const el=document.getElementById(id);if(el)el.lang='vi'}
})();


/* Tài Lê motion controller — single owner for orbit geometry and page transition. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const overlay = document.getElementById('rift-transition');
  let changing = false;
  let timer = 0;
  // Only genuine Home/Music/Projects route changes animate. Nothing else does.
  window.TAI_PAGE_TRANSITION = (destination) => {
    if (!['home','music','products'].includes(destination) || !window.PORTALVERSE_ROUTE) return;
    if (changing || document.body.dataset.view === destination) return;
    if (reduced.matches || !overlay) { window.PORTALVERSE_ROUTE(destination); return; }
    changing = true;
    overlay.dataset.motion = 'pulse';
    overlay.classList.remove('is-active');
    // Force a fresh animation even if a previous trip completed recently.
    void overlay.offsetWidth;
    overlay.classList.add('is-active');
    let arrived = false;
    const arrive = () => { if (!arrived) {arrived = true; window.PORTALVERSE_ROUTE(destination);} };
    clearTimeout(timer);
    setTimeout(arrive, 260);
    timer = setTimeout(() => {arrive();overlay.classList.remove('is-active');changing = false;}, 610);
  };

  const sky = document.getElementById('v14-constellation');
  if (!sky) return;
  const rings = [...sky.querySelectorAll('.v14-orbit-ring')];
  const songs = [...sky.querySelectorAll('.v14-song-star')];
  if (rings.length !== 3 || songs.length !== 5) return;
  // Pairs on the same orbit remain diametrically opposed and never overlap each other.
  const orbits = [
    {phase:.08,ring:0}, {phase:.21,ring:1}, {phase:.64,ring:2},
    {phase:.58,ring:0}, {phase:.71,ring:1}
  ];
  const baseAngles = [-23, 34, 78].map(n => n * Math.PI / 180);
  const ringPeriods = [74,91,80];
  const orbitalPeriods = [52,64,57];
  const directions = [1,-1,1];
  const radii = rings.map(() => ({rx:0,ry:0}));
  let elapsed = 0, previous = 0, visible = true;
  const size = () => rings.forEach((ring,i) => {
    // Same actual measured border-box ellipse used by CSS, including breakpoints.
    radii[i].rx = Math.max(0,(ring.offsetWidth - parseFloat(getComputedStyle(ring).borderLeftWidth || 0)) / 2);
    radii[i].ry = Math.max(0,(ring.offsetHeight - parseFloat(getComputedStyle(ring).borderTopWidth || 0)) / 2);
  });
  const refresh = () => {
    rings.forEach((ring,i) => {
      const rotation = baseAngles[i] + directions[i]*Math.PI*2*elapsed/ringPeriods[i];
      ring.style.transform = `translate3d(-50%,-50%,0) rotate(${rotation}rad)`;
    });
    songs.forEach((song,i) => {
      const o=orbits[i], k=o.ring;
      const rotation=baseAngles[k]+directions[k]*Math.PI*2*elapsed/ringPeriods[k];
      const angle=(o.phase + directions[k]*elapsed/orbitalPeriods[k])*2*Math.PI;
      const ex=radii[k].rx*Math.cos(angle), ey=radii[k].ry*Math.sin(angle);
      const x=ex*Math.cos(rotation)-ey*Math.sin(rotation);
      const y=ex*Math.sin(rotation)+ey*Math.cos(rotation);
      song.style.setProperty('--orbit-x',`${x.toFixed(3)}px`);
      song.style.setProperty('--orbit-y',`${y.toFixed(3)}px`);
      song.dataset.orbitRing = String(k);
    });
  };
  size();refresh();
  if ('ResizeObserver' in window) new ResizeObserver(() => {size();refresh()}).observe(sky);
  else window.addEventListener('resize',()=>{size();refresh()},{passive:true});
  if('IntersectionObserver' in window) new IntersectionObserver(entries => {visible=entries.some(e=>e.isIntersecting);previous=0;},{rootMargin:'200px'}).observe(sky);
  document.addEventListener('visibilitychange',()=>{previous=0;});
  const frame = now => {
    if (!previous) previous=now;
    const dt=Math.min((now-previous)/1000,.06);previous=now;
    // NEVER pause for hover, click or song selection: only page/device visibility.
    const active = visible && !document.hidden && !sky.closest('[hidden]') && !reduced.matches;
    if(active){elapsed += dt;refresh();}
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);

})();

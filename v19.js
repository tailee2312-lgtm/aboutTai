/* TÀI LÊ — Music Orbits v1.9: animated gallery without blocking controls. */
(()=>{'use strict';
 const sky=document.getElementById('v14-constellation');
 if(!sky)return;
 const stars=[...sky.querySelectorAll('.v14-song-star')];
 if(!stars.length)return;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const offsets=[.08,.30,.54,.74,.91];
 const speeds=[70,88,105,76,99];
 const layers=[0,1,2,0,1];
 let paused=false,inView=true,start=performance.now(),last=0,frame=0;
 const sizes=[[.35,.34,-.37],[.45,.235,.39],[.26,.405,-.85]];
 const r=(i,t)=>{
  const [rx,ry,angle]=sizes[layers[i]];
  const w=sky.clientWidth,h=sky.clientHeight;
  const theta=(offsets[i]+t/speeds[i])*Math.PI*2*(i%2?-1:1);
  const x=Math.cos(theta)*rx*w,y=Math.sin(theta)*ry*h;
  return [x*Math.cos(angle)-y*Math.sin(angle),x*Math.sin(angle)+y*Math.cos(angle)];
 };
 stars.forEach(s=>{
  s.addEventListener('pointerenter',()=>{paused=true});
  s.addEventListener('pointerleave',()=>{paused=false});
  s.addEventListener('focusin',()=>{paused=true});
  s.addEventListener('focusout',()=>{paused=false});
 });
 const io=window.IntersectionObserver?new IntersectionObserver(es=>{inView=es.some(e=>e.isIntersecting)},{rootMargin:'120px'}):null;
 io?.observe(sky);
 let elapsed=0;
 function tick(now){
  frame=requestAnimationFrame(tick);
  if(now-last<30)return;
  let dt=last?Math.min((now-last)/1000,.07):0;last=now;
  if(!inView||document.hidden)return;
  if(!paused&&!reduced.matches)elapsed+=dt;
  for(let i=0;i<stars.length;i++){
   const [x,y]=r(i,elapsed);
   stars[i].style.setProperty('--orbit-x',x.toFixed(1)+'px');
   stars[i].style.setProperty('--orbit-y',y.toFixed(1)+'px');
  }
 }
 frame=requestAnimationFrame(tick);
 document.addEventListener('visibilitychange',()=>{last=performance.now()});
})();

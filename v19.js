/* Tài Lê / Music orbits v2.0: song centers are bound to the EXACT visible ellipse. */
(()=>{'use strict';
 const sky=document.getElementById('v14-constellation'); if(!sky)return;
 const stars=[...sky.querySelectorAll('.v14-song-star')];
 const rings=[...sky.querySelectorAll('.v14-orbit-ring')];
 if(stars.length!==5||rings.length<3)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sets=[
  {ring:0,phase:0.10,orbitSpeed:68,ringSpeed:83,dir:1,base:-23},
  {ring:1,phase:0.36,orbitSpeed:84,ringSpeed:108,dir:-1,base:34},
  {ring:2,phase:0.63,orbitSpeed:93,ringSpeed:96,dir:1,base:78},
  {ring:0,phase:0.69,orbitSpeed:68,ringSpeed:83,dir:1,base:-23},
  {ring:1,phase:0.91,orbitSpeed:84,ringSpeed:108,dir:-1,base:34}
 ];
 let inView=true,oldTime=0,elapsed=0,width=0,height=0;
 const readSize=()=>{width=sky.clientWidth;height=sky.clientHeight};
 readSize();new ResizeObserver(readSize).observe(sky);
 if('IntersectionObserver' in window)new IntersectionObserver(es=>{inView=es.some(x=>x.isIntersecting)},{rootMargin:'160px'}).observe(sky);
 const rad=Math.PI/180;
 function draw(){
  const wh=[[.77,.78],[.93,.52],[.59,.85]];
  const rotations=sets.slice(0,3).map(s=>(s.base+s.dir*elapsed*360/s.ringSpeed)*rad);
  rings.slice(0,3).forEach((ring,i)=>ring.style.transform=`translate(-50%,-50%) rotate(${rotations[i]}rad)`);
  stars.forEach((star,i)=>{
   const spec=sets[i],layer=spec.ring,rotation=rotations[layer];
   const a=(spec.phase + spec.dir*elapsed/spec.orbitSpeed)*Math.PI*2;
   const rx=wh[layer][0]*width/2,ry=wh[layer][1]*height/2;
   const ex=rx*Math.cos(a),ey=ry*Math.sin(a);
   const x=ex*Math.cos(rotation)-ey*Math.sin(rotation);
   const y=ex*Math.sin(rotation)+ey*Math.cos(rotation);
   star.style.setProperty('--orbit-x',x.toFixed(2)+'px');
   star.style.setProperty('--orbit-y',y.toFixed(2)+'px');
  });
 }
 draw();
 function tick(now){
  if(oldTime===0)oldTime=now;
  const dt=Math.min((now-oldTime)/1000,.05);oldTime=now;
  if(inView&&!document.hidden&&!reduced.matches){elapsed+=dt;draw()}
  requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
 document.addEventListener('visibilitychange',()=>{oldTime=0});
})();

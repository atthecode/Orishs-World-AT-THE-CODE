(() => {
  'use strict';
  const profileId=localStorage.getItem('orish.activeProfile.v1')||'preview';
  const KEY=`orish-life-city-explore-v1:${profileId}`;
  const CASE_KEY=`orish-life-city-v1:${profileId}`;
  const stations=[
    {id:'audit',label:'Building Audit',x:360,y:76,icon:'A'},
    {id:'transport',label:'Transport Data',x:628,y:240,icon:'T'},
    {id:'survey',label:'Youth Survey',x:92,y:240,icon:'Y'},
    {id:'sponsor',label:'Sponsor Offer',x:360,y:408,icon:'S'}
  ];
  let data={x:360,y:248,scans:[],complete:false};
  let canvas,ctx,scanButton,statusNode,distanceNode,raf=0,heldTimer=0,audioCtx=null,ambienceTimer=0,proximityAnnounced='';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;

  function read(){try{return{...data,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return{...data}}}
  function save(){try{localStorage.setItem(KEY,JSON.stringify({...data,updated:Date.now()}))}catch{}}
  function readCase(){try{return JSON.parse(localStorage.getItem(CASE_KEY)||'{}')}catch{return{}}}
  function activeProfile(){try{const id=localStorage.getItem('orish.activeProfile.v1')||'',profiles=JSON.parse(localStorage.getItem('orish.profiles.v1')||'[]');return profiles.find(p=>p.id===id)||null}catch{return null}}
  function soundEnabled(){return document.getElementById('soundToggle')?.textContent?.includes('🔊')===true;}
  function ensureAudio(){const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return null;if(!audioCtx)audioCtx=new AudioCtx();if(audioCtx.state==='suspended')audioCtx.resume();return audioCtx;}
  function tone(freq,duration=.09,type='sine',volume=.02){if(!soundEnabled())return;try{const ac=ensureAudio();if(!ac)return;const o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,ac.currentTime);g.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+duration);}catch{}}
  function scanChime(){tone(560,.08,'triangle',.025);setTimeout(()=>tone(760,.1,'triangle',.024),70);setTimeout(()=>tone(980,.14,'triangle',.02),145);}
  function blockedSound(){tone(145,.08,'square',.014);setTimeout(()=>tone(110,.1,'square',.011),70);}
  function proximityPing(){tone(420,.055,'sine',.012);setTimeout(()=>tone(630,.07,'triangle',.012),55);}
  function completeChime(){[523,659,784,1046].forEach((f,i)=>setTimeout(()=>tone(f,.16,'triangle',.023),i*90));}
  function startAmbience(){stopAmbience();if(!soundEnabled())return;tone(105,.35,'sine',.008);ambienceTimer=setInterval(()=>{if(document.hidden||!soundEnabled())return;tone(105,.28,'sine',.005);setTimeout(()=>tone(165,.14,'triangle',.004),160);},3200);}
  function stopAmbience(){clearInterval(ambienceTimer);ambienceTimer=0;}

  function init(){
    if(new URLSearchParams(location.search).has('replay')){try{localStorage.removeItem(KEY)}catch{}}
    data=read();
    const oldCase=readCase();if(oldCase.started===true&&!data.complete){data.complete=true;save();}
    canvas=document.getElementById('cityCanvas');ctx=canvas?.getContext('2d');scanButton=document.getElementById('scanAction');statusNode=document.getElementById('runStatus');distanceNode=document.getElementById('distancePill');
    if(!canvas||!ctx)return;
    const start=document.getElementById('startMission');start?.addEventListener('click',interceptStart,true);
    document.getElementById('openDesk')?.addEventListener('click',openDesk);
    scanButton?.addEventListener('click',scanNearest);
    document.querySelectorAll('[data-move]').forEach(button=>{
      button.addEventListener('pointerdown',event=>{event.preventDefault();move(button.dataset.move);clearInterval(heldTimer);heldTimer=setInterval(()=>move(button.dataset.move),80)});
      ['pointerup','pointercancel','pointerleave'].forEach(name=>button.addEventListener(name,()=>{clearInterval(heldTimer);heldTimer=0}));
    });
    addEventListener('keydown',onKey);
    document.getElementById('soundToggle')?.addEventListener('click',()=>setTimeout(()=>{if(soundEnabled())startAmbience();else stopAmbience();},0));
    paintScanList();
  }

  function interceptStart(event){
    const profile=activeProfile();if(!profile||profile.ageBand!=='13-16')return;
    if(data.complete)return;
    event.preventDefault();event.stopImmediatePropagation();
    const soundButton=document.getElementById('soundToggle');if(soundButton&&!soundEnabled())soundButton.click();
    showExplore();
  }

  function showExplore(){
    document.getElementById('introPanel').hidden=true;document.getElementById('gameShell').hidden=true;document.getElementById('completion').hidden=true;document.getElementById('exploreShell').hidden=false;
    paintScanList();draw();updateProximity();startAmbience();
    setTimeout(()=>document.getElementById('exploreShell').scrollIntoView({behavior:reduced?'auto':'smooth'}),30);
  }

  function openDesk(){
    if(data.scans.length<stations.length)return;
    data.complete=true;save();stopAmbience();document.getElementById('exploreShell').hidden=true;
    const start=document.getElementById('startMission');start?.click();
  }

  function onKey(event){
    if(document.getElementById('exploreShell')?.hidden)return;
    const map={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
    if(map[event.key]){event.preventDefault();move(map[event.key]);return;}
    if(event.code==='Space'){event.preventDefault();scanNearest();}
  }

  function walkable(x,y){
    const onVertical=x>=300&&x<=420&&y>=32&&y<=448;
    const onHorizontal=y>=182&&y<=298&&x>=38&&x<=682;
    return onVertical||onHorizontal;
  }

  function move(dir){
    const step=13;let nx=data.x,ny=data.y;if(dir==='up')ny-=step;if(dir==='down')ny+=step;if(dir==='left')nx-=step;if(dir==='right')nx+=step;
    nx=Math.max(42,Math.min(678,nx));ny=Math.max(38,Math.min(442,ny));
    if(!walkable(nx,ny)){blockedSound();pulseStatus('Road blocked — use the lit streets to reach the next station.');return;}
    data.x=nx;data.y=ny;save();draw();updateProximity();
  }

  function nearest(){
    return stations.map(s=>({...s,d:Math.hypot(data.x-s.x,data.y-s.y)})).sort((a,b)=>a.d-b.d)[0];
  }

  function updateProximity(){
    const close=nearest(),collected=data.scans.includes(close.id),inRange=close.d<=50;
    distanceNode.textContent=inRange?'SCAN RANGE ✓':`RANGE ${Math.round(close.d)}`;
    if(data.scans.length===stations.length){
      statusNode.textContent='All four signals collected. Open the strategy desk.';scanButton.disabled=true;scanButton.textContent='EVIDENCE PACK COMPLETE';document.getElementById('openDesk').hidden=false;document.getElementById('runComplete').hidden=false;return;
    }
    document.getElementById('openDesk').hidden=true;document.getElementById('runComplete').hidden=true;
    if(inRange&&!collected){if(proximityAnnounced!==close.id){proximityAnnounced=close.id;proximityPing();}scanButton.disabled=false;scanButton.textContent=`SCAN ${close.label.toUpperCase()}`;statusNode.textContent=`Signal locked: ${close.label}. Press SCAN.`;}
    else if(inRange&&collected){scanButton.disabled=true;scanButton.textContent='ALREADY COLLECTED';statusNode.textContent=`${close.label} is already in your evidence pack. Move to another signal.`;}
    else{proximityAnnounced='';scanButton.disabled=true;scanButton.textContent='MOVE CLOSER TO SCAN';statusNode.textContent='Move toward a glowing evidence station.';}
  }

  function scanNearest(){
    const close=nearest();if(close.d>50||data.scans.includes(close.id))return;
    data.scans.push(close.id);save();navigator.vibrate?.([35,25,55]);scanChime();paintScanList();draw();pulseStatus(`${close.label} collected. ${stations.length-data.scans.length} signal${stations.length-data.scans.length===1?'':'s'} remaining.`);if(data.scans.length===stations.length)completeChime();updateProximity();
  }

  function paintScanList(){
    document.getElementById('scanCount').textContent=String(data.scans.length);
    stations.forEach(station=>{const row=document.querySelector(`[data-scan="${station.id}"]`);if(!row)return;const done=data.scans.includes(station.id);row.classList.toggle('done',done);row.querySelector('i').textContent=done?'✓':String(stations.indexOf(station)+1).padStart(2,'0');});
  }

  function pulseStatus(text){statusNode.textContent=text;clearTimeout(pulseStatus.t);pulseStatus.t=setTimeout(updateProximity,950)}

  function draw(){
    cancelAnimationFrame(raf);const w=canvas.width,h=canvas.height;ctx.clearRect(0,0,w,h);
    const sky=ctx.createLinearGradient(0,0,0,h);sky.addColorStop(0,'#071a2a');sky.addColorStop(1,'#0a2a3e');ctx.fillStyle=sky;ctx.fillRect(0,0,w,h);
    drawBuildings();drawRoads();drawStations();drawPlayer();
  }

  function drawBuildings(){
    const blocks=[{x:40,y:35,w:240,h:125,n:'CIVIC ARCHIVE'},{x:440,y:35,w:240,h:125,n:'TRANSIT HQ'},{x:40,y:320,w:240,h:125,n:'YOUTH DISTRICT'},{x:440,y:320,w:240,h:125,n:'FUNDING QUARTER'}];
    blocks.forEach((b,index)=>{ctx.fillStyle=index%2?'#102f45':'#0d293c';roundRect(b.x,b.y,b.w,b.h,14,true);ctx.strokeStyle='#24566e';ctx.lineWidth=2;roundRect(b.x,b.y,b.w,b.h,14,false);ctx.fillStyle='#8db8c9';ctx.font='700 13px system-ui';ctx.fillText(b.n,b.x+15,b.y+25);for(let r=0;r<2;r++)for(let c=0;c<5;c++){ctx.fillStyle=(r+c+index)%3===0?'#6fe5d5':'#244e62';ctx.fillRect(b.x+18+c*42,b.y+45+r*32,22,14);}});
  }

  function drawRoads(){
    ctx.fillStyle='#173847';ctx.fillRect(300,22,120,436);ctx.fillRect(28,182,664,116);ctx.strokeStyle='#79b3bd';ctx.lineWidth=2;ctx.setLineDash([18,16]);ctx.beginPath();ctx.moveTo(360,25);ctx.lineTo(360,455);ctx.moveTo(30,240);ctx.lineTo(690,240);ctx.stroke();ctx.setLineDash([]);
    ctx.fillStyle='#08151e';ctx.fillRect(334,205,52,70);ctx.fillStyle='#ffe16d';ctx.font='900 12px system-ui';ctx.textAlign='center';ctx.fillText('CITY HUB',360,244);ctx.textAlign='left';
  }

  function drawStations(){
    const time=performance.now();stations.forEach((s,i)=>{const done=data.scans.includes(s.id),pulse=reduced?1:1+Math.sin(time*.004+i)*.12;ctx.save();ctx.translate(s.x,s.y);ctx.scale(pulse,pulse);ctx.beginPath();ctx.arc(0,0,25,0,Math.PI*2);ctx.fillStyle=done?'#1e6c63':'#0d4d61';ctx.shadowColor=done?'#71f0df':'#55cfff';ctx.shadowBlur=done?8:22;ctx.fill();ctx.lineWidth=3;ctx.strokeStyle=done?'#a7fff3':'#6ee9ff';ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#fff';ctx.font='900 15px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(done?'✓':s.icon,0,1);ctx.restore();ctx.fillStyle='#d8f5ff';ctx.font='700 10px system-ui';ctx.textAlign='center';ctx.fillText(s.label,s.x,s.y+39);ctx.textAlign='left';});
    if(!reduced){raf=requestAnimationFrame(draw)}
  }

  function drawPlayer(){
    ctx.save();ctx.translate(data.x,data.y);ctx.beginPath();ctx.arc(0,0,15,0,Math.PI*2);ctx.fillStyle='#ffe16d';ctx.shadowColor='#ffe16d';ctx.shadowBlur=16;ctx.fill();ctx.shadowBlur=0;ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fillStyle='#10243c';ctx.fill();ctx.restore();
  }

  function roundRect(x,y,w,h,r,fill){ctx.beginPath();ctx.roundRect?ctx.roundRect(x,y,w,h,r):(ctx.rect(x,y,w,h));fill?ctx.fill():ctx.stroke()}
  addEventListener('pagehide',()=>{cancelAnimationFrame(raf);clearInterval(heldTimer);stopAmbience();audioCtx?.suspend();});
  addEventListener('DOMContentLoaded',init,{once:true});
})();
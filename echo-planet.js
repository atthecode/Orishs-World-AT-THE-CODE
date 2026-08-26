(() => {
  'use strict';

  const LEVEL_KEY='orish.level1.signal.v1';
  const canvas=document.getElementById('planetCanvas');
  const ctx=canvas.getContext('2d');
  const intro=document.getElementById('intro');
  const begin=document.getElementById('beginMission');
  const actionButton=document.getElementById('actionButton');
  const jumpButton=document.getElementById('jumpButton');
  const eventLayer=document.getElementById('eventLayer');
  const eventCard=document.getElementById('eventCard');
  const objectiveText=document.getElementById('objectiveText');
  const samplesText=document.getElementById('samplesText');
  const tracksText=document.getElementById('tracksText');
  const suitText=document.getElementById('suitText');
  const starsText=document.getElementById('starsText');
  const orishText=document.getElementById('orishText');
  const stormTint=document.getElementById('stormTint');
  const soundToggle=document.getElementById('soundToggle');

  const W=1280,H=720;
  const keys=new Set();
  const player={x:130,y:570,r:17,speed:220,facing:1,jumpUntil:0,jumpReadyAt:0};
  const sprite=new Image();sprite.src='assets/orish-game-walk.webp';
  let running=false,paused=false,last=0,nearTarget=null,soundOn=true,audio=null,hitCooldown=0,stormAnnounced=false;

  const state={phase:'atmosphere',samples:0,tracks:0,suit:100,stars:0,atmosphere:false,mineral:false,plant:false,caveSample:false,trackFound:[false,false,false],complete:false};

  const rocks=[
    {x:0,y:0,w:1280,h:28},{x:0,y:692,w:1280,h:28},{x:0,y:0,w:28,h:720},{x:1252,y:0,w:28,h:720},
    {x:320,y:240,w:130,h:42},{x:545,y:80,w:44,h:190},{x:545,y:365,w:44,h:327},{x:760,y:280,w:160,h:38},{x:990,y:80,w:42,h:210},{x:990,y:390,w:42,h:302}
  ];
  const gaps=[{x:410,y:300,w:100,h:190},{x:780,y:55,w:75,h:170}];
  const geysers=[{x:280,y:410,r:35,o:0},{x:690,y:505,r:38,o:2.2},{x:1110,y:350,r:36,o:4.1}];

  const targets={
    atmosphere:{x:255,y:150,r:55,label:'ATMOSPHERE VENT'},
    mineral:{x:475,y:560,r:55,label:'MINERAL NODE'},
    plant:{x:705,y:585,r:55,label:'STRANGE GROWTH'},
    track1:{x:700,y:155,r:45,label:'TRACK 1'},
    track2:{x:875,y:395,r:45,label:'TRACK 2'},
    track3:{x:1110,y:220,r:45,label:'TRACK 3'},
    cave:{x:1160,y:575,r:65,label:'ECHO CAVE'}
  };

  function say(text){orishText.textContent=text}
  function setObjective(text){objectiveText.textContent=text}
  function setSamples(v){state.samples=v;samplesText.textContent=`${v} / 4`}
  function setTracks(v){state.tracks=v;tracksText.textContent=`${v} / 3`}
  function setSuit(v){state.suit=Math.max(0,Math.min(100,Math.round(v)));suitText.textContent=`${state.suit}%`}
  function addStars(v){state.stars+=v;starsText.textContent=String(state.stars)}

  function beep(freq=540,duration=.08){if(!soundOn)return;try{const Ctx=window.AudioContext||window.webkitAudioContext;audio||=new Ctx();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.frequency.value=freq;g.gain.value=.035;g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration)}catch(_){}}
  function collidesRect(x,y,r){return x+player.r>r.x&&x-player.r<r.x+r.w&&y+player.r>r.y&&y-player.r<r.y+r.h}
  function collides(x,y){if(rocks.some(r=>collidesRect(x,y,r)))return true;if(performance.now()>=player.jumpUntil&&gaps.some(r=>collidesRect(x,y,r)))return true;return false}
  function move(dx,dy,dt){const len=Math.hypot(dx,dy)||1;const boost=performance.now()<player.jumpUntil?1.72:1;const nx=player.x+dx/len*player.speed*boost*dt,ny=player.y+dy/len*player.speed*boost*dt;if(!collides(nx,player.y))player.x=nx;if(!collides(player.x,ny))player.y=ny;if(dx)player.facing=dx>0?1:-1}
  function jump(){const now=performance.now();if(!running||paused||now<player.jumpReadyAt)return;player.jumpUntil=now+820;player.jumpReadyAt=now+1700;jumpButton.classList.remove('ready');beep(720,.08);setTimeout(()=>jumpButton.classList.add('ready'),1700)}

  function activeTargets(){
    const list=[];
    if(!state.atmosphere)list.push(targets.atmosphere);
    if(state.atmosphere&&!state.mineral)list.push(targets.mineral);
    if(state.mineral&&!state.plant)list.push(targets.plant);
    if(state.plant&&state.phase==='tracks'){
      if(!state.trackFound[0])list.push(targets.track1);else if(!state.trackFound[1])list.push(targets.track2);else if(!state.trackFound[2])list.push(targets.track3);
    }
    if(state.tracks===3&&!state.caveSample)list.push(targets.cave);
    return list;
  }

  function updateNearTarget(){nearTarget=activeTargets().map(t=>({t,d:Math.hypot(player.x-t.x,player.y-t.y)})).filter(v=>v.d<v.t.r+28).sort((a,b)=>a.d-b.d)[0]?.t||null;actionButton.classList.toggle('ready',Boolean(nearTarget));actionButton.querySelector('b').textContent=nearTarget?nearTarget.label:'SCAN'}

  function openEvent(html){paused=true;keys.clear();eventCard.innerHTML=html;eventLayer.hidden=false}
  function closeEvent(){eventLayer.hidden=true;eventCard.innerHTML='';paused=false;last=performance.now()}

  function interact(){
    if(!running||paused||!nearTarget)return;
    if(nearTarget===targets.atmosphere)scanAtmosphere();
    else if(nearTarget===targets.mineral)scanMineral();
    else if(nearTarget===targets.plant)scanPlant();
    else if(nearTarget===targets.track1)scanTrack(0);
    else if(nearTarget===targets.track2)scanTrack(1);
    else if(nearTarget===targets.track3)scanTrack(2);
    else if(nearTarget===targets.cave)enterCave();
  }

  function scanAtmosphere(){
    state.atmosphere=true;setSamples(1);addStars(60);beep(850,.1);
    openEvent(`<p class="kicker">SAMPLE 1 // ATMOSPHERE</p><h2>Thin air. Reactive minerals.</h2><div class="evidence-grid"><span>Pressure: lower than Earth</span><span>Oxygen: trace only</span><span>Fine metallic dust</span><span>Strong temperature swings</span></div><p>This environment would challenge Earth animals. Any local life would need different adaptations.</p><button id="continueAtmosphere" class="event-primary" type="button">CONTINUE EXPLORING</button>`);
    document.getElementById('continueAtmosphere').addEventListener('click',()=>{setObjective('Cross the rift and scan the mineral node');say('Low gravity helps with the rift. Use JUMP while moving to cross the dark crack.');closeEvent()});
  }

  function scanMineral(){
    state.mineral=true;setSamples(2);addStars(70);beep(900,.1);
    openEvent(`<p class="kicker">SAMPLE 2 // MINERAL NODE</p><h2>The rocks carry the same pulse rhythm.</h2><div class="evidence-grid"><span>Conductive crystal veins</span><span>Pulse repeats through the ground</span><span>No machine parts detected</span><span>Heat rises below surface</span></div><p>The signal may be travelling through natural minerals. That is a new explanation we have to consider.</p><button id="continueMineral" class="event-primary" type="button">FIND THE STRANGE GROWTH</button>`);
    document.getElementById('continueMineral').addEventListener('click',()=>{setObjective('Reach the strange growth');say('There is something plant-like near the next geyser field. We need a closer look.');closeEvent()});
  }

  function scanPlant(){
    state.plant=true;setSamples(3);state.phase='tracks';addStars(90);beep(980,.11);
    openEvent(`<p class="kicker">SAMPLE 3 // STRANGE GROWTH</p><h2>It reacts — but is it alive?</h2><div class="evidence-grid"><span>Closes when shadow passes</span><span>Contains water-rich gel</span><span>Anchored to warm mineral seam</span><span>No movement away from base</span></div><p>Reaction can be evidence of life, but it can also be chemistry or mechanics. Nearby marks may tell us more.</p><button id="followTracks" class="event-primary" type="button">FOLLOW THE MARKS</button>`);
    document.getElementById('followTracks').addEventListener('click',()=>{setObjective('Scan the first unusual track');say('Three marks lead away from the growth. Follow them in order.');closeEvent()});
  }

  function scanTrack(index){
    state.trackFound[index]=true;setTracks(index+1);addStars(55);beep(760+index*90,.08);
    const descriptions=[
      'Track 1 presses into the dust from two directions, unlike the wind streaks nearby.',
      'Track 2 is farther apart. Whatever caused the marks may have changed speed or made a longer low-gravity step.',
      'Track 3 ends beside the cave entrance. A fresh dust slide partly covers it.'
    ];
    openEvent(`<p class="kicker">TRACK ${index+1} // SURFACE EVIDENCE</p><h2>${index===0?'Not a normal wind mark.':index===1?'The spacing changed.':'The trail ends at a cave.'}</h2><p>${descriptions[index]}</p><p class="science-note">Tracks are evidence that something disturbed the surface. They do not tell us what the cause was yet.</p><button id="continueTrack" class="event-primary" type="button">${index<2?'FOLLOW NEXT TRACK':'ENTER CAVE'}</button>`);
    document.getElementById('continueTrack').addEventListener('click',()=>{if(index<2){setObjective(`Find track ${index+2}`);say('Keep following the trail. Compare each mark instead of guessing.')}else{setObjective('Reach Echo Cave');say('The trail ends underground. Suit lights on — we are going in.')}closeEvent()});
  }

  function enterCave(){
    state.caveSample=true;setSamples(4);addStars(120);beep(1030,.12);
    openHypothesis();
  }

  function openHypothesis(){
    openEvent(`
      <p class="kicker">ECHO CAVE // LIFE HYPOTHESIS</p>
      <h2>Build a creature that could fit the evidence.</h2>
      <p>You are not choosing what the alien “really” looks like. Build a scientific hypothesis using the planet conditions we measured.</p>
      <div class="trait-grid" data-group="body">
        <button class="trait-card" type="button" data-trait="body" data-value="spring"><b>Spring-like limbs</b><small>Could use low gravity for long controlled movement.</small></button>
        <button class="trait-card" type="button" data-trait="body" data-value="heavy"><b>Very heavy body</b><small>More stable, but requires more energy to move.</small></button>
        <button class="trait-card" type="button" data-trait="body" data-value="floating"><b>Gas float sacs</b><small>Would need enough atmosphere to create lift.</small></button>
      </div>
      <div class="trait-grid" data-group="surface">
        <button class="trait-card" type="button" data-trait="surface" data-value="shell"><b>Dust-sealing shell</b><small>Could protect against metallic mineral storms.</small></button>
        <button class="trait-card" type="button" data-trait="surface" data-value="fur"><b>Loose thick fur</b><small>Insulates, but may trap abrasive dust.</small></button>
        <button class="trait-card" type="button" data-trait="surface" data-value="wet"><b>Always-wet skin</b><small>Could lose water quickly in thin dry air.</small></button>
      </div>
      <div class="trait-grid" data-group="sense">
        <button class="trait-card" type="button" data-trait="sense" data-value="vibration"><b>Vibration sensing</b><small>Useful in dark caves and conductive rock.</small></button>
        <button class="trait-card" type="button" data-trait="sense" data-value="bright"><b>Only bright-colour vision</b><small>Less useful underground with very little light.</small></button>
        <button class="trait-card" type="button" data-trait="sense" data-value="sound"><b>Pressure-sensitive hearing</b><small>Possible, but the thin atmosphere carries sound differently.</small></button>
      </div>
      <button id="buildCreature" class="event-primary" type="button" disabled>BUILD HYPOTHESIS</button>
    `);
    const selected={};const cards=[...eventCard.querySelectorAll('[data-trait]')];const build=document.getElementById('buildCreature');
    cards.forEach(card=>card.addEventListener('click',()=>{const group=card.dataset.trait;selected[group]=card.dataset.value;cards.filter(c=>c.dataset.trait===group).forEach(c=>c.classList.toggle('selected',c===card));build.disabled=Object.keys(selected).length!==3;beep(520+Object.keys(selected).length*90,.05)}));
    build.addEventListener('click',()=>showHypothesisResult(selected));
  }

  function showHypothesisResult(selected){
    let fit=0;if(selected.body==='spring')fit++;if(selected.surface==='shell')fit++;if(selected.sense==='vibration')fit++;
    addStars(120+fit*40);
    eventCard.innerHTML=`
      <p class="kicker">MODEL COMPLETE // ${fit===3?'STRONG FIT':'TESTABLE HYPOTHESIS'}</p>
      <h2>Your creature model explains ${fit} of 3 major conditions well.</h2>
      <div class="evidence-grid"><span>Low gravity → ${selected.body}</span><span>Mineral storms → ${selected.surface}</span><span>Dark conductive caves → ${selected.sense}</span><span>Still missing: direct observation</span></div>
      <div class="silhouette" aria-label="A distant unidentified silhouette moves at the back of the cave"></div>
      <p>While Orish records the model, something shifts across the far cave opening. It is too distant for a clear identification.</p>
      <p class="science-note">New evidence: movement was observed. Still unknown: what moved, whether it was alive, and whether it made the tracks or signal.</p>
      <button id="finishEcho" class="event-primary" type="button">COMPLETE LEVEL 1</button>
    `;
    document.getElementById('finishEcho').addEventListener('click',completeLevel);
  }

  function completeLevel(){
    state.complete=true;state.phase='complete';
    try{const current=JSON.parse(localStorage.getItem(LEVEL_KEY)||'{}');localStorage.setItem(LEVEL_KEY,JSON.stringify({...current,echoComplete:true,cinemaSeen:true,stars:(Number(current.stars)||0)+state.stars,updated:Date.now()}))}catch(_){ }
    eventCard.innerHTML=`
      <p class="kicker">LEVEL 1 COMPLETE</p>
      <h2>Unknown Signal Investigator</h2>
      <p>You crossed two worlds, rescued equipment, collected environmental evidence, followed tracks and built a life hypothesis without pretending the mystery was solved.</p>
      <div class="evidence-grid"><span>📡 Signal evidence</span><span>🪐 Planet samples</span><span>👣 Surface tracks</span><span>🧬 Adaptation model</span></div>
      <p class="science-note">Best current conclusion: <strong>Echo Planet contains unexplained signals, reactive growth, unusual tracks and a distant movement observation. Direct evidence of alien life is not yet confirmed.</strong></p>
      <a class="event-primary" href="level-one.html">VIEW LEVEL REWARD →</a>
    `;
  }

  function geyserActive(g,time){return Math.sin(time/520+g.o)>.5}
  function handleGeysers(time){if(performance.now()<hitCooldown||performance.now()<player.jumpUntil)return;const hit=geysers.some(g=>geyserActive(g,time)&&Math.hypot(player.x-g.x,player.y-g.y)<g.r+18);if(!hit)return;hitCooldown=performance.now()+1300;setSuit(state.suit-5);say('Geyser burst! Use JUMP to clear active vents. Suit is still safe.');beep(190,.14);player.y=Math.min(H-45,player.y+38)}
  function stormActive(time){const cycle=(time/1000)%22;return cycle>15&&cycle<20}
  function handleStorm(time,dt){const active=stormActive(time);stormTint.style.opacity=active?'.48':'0';if(active){player.x=Math.max(40,player.x-dt*28);if(!stormAnnounced){stormAnnounced=true;say('Mineral storm! Keep moving. Low gravity makes the crosswind push harder.')}}else stormAnnounced=false}

  function drawWorld(time){
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#2a1d57');bg.addColorStop(.48,'#3c315f');bg.addColorStop(1,'#18243e');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const sky=ctx.createLinearGradient(0,0,0,230);sky.addColorStop(0,'#0c102c');sky.addColorStop(1,'rgba(56,43,94,.25)');ctx.fillStyle=sky;ctx.fillRect(0,0,W,230);
    for(let i=0;i<30;i++){const x=(i*181+41)%W,y=(i*71+27)%200;ctx.globalAlpha=.25+.3*Math.sin(time/400+i);ctx.fillStyle=i%4===0?'#ffe3a0':'#d7e5ff';ctx.beginPath();ctx.arc(x,y,i%5===0?2:1.2,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
    drawDistantPlanet();drawTerrain(time);drawTargets(time);drawGeysers(time);drawTracks();drawPlayer(time);
  }

  function drawDistantPlanet(){ctx.save();ctx.fillStyle='#8f76c8';ctx.beginPath();ctx.arc(1110,105,72,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,217,106,.7)';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(1110,105,102,25,-.15,0,Math.PI*2);ctx.stroke();ctx.restore()}
  function drawTerrain(time){
    gaps.forEach(g=>{const gr=ctx.createLinearGradient(g.x,g.y,g.x+g.w,g.y+g.h);gr.addColorStop(0,'#090d1b');gr.addColorStop(.5,'#02040a');gr.addColorStop(1,'#171130');ctx.fillStyle=gr;ctx.fillRect(g.x,g.y,g.w,g.h);ctx.strokeStyle='rgba(191,139,255,.25)';ctx.strokeRect(g.x,g.y,g.w,g.h)});
    rocks.forEach((r,i)=>{ctx.fillStyle=i<4?'#2b3151':'#443760';ctx.fillRect(r.x,r.y,r.w,r.h);if(i>=4){ctx.fillStyle='rgba(161,125,208,.18)';ctx.fillRect(r.x+5,r.y+5,Math.max(0,r.w-10),6)}});
    for(let i=0;i<18;i++){const x=(i*149+73)%W,y=260+(i*97)%400;ctx.fillStyle=['#6b4f8f','#5f6e83','#77703d'][i%3];ctx.beginPath();ctx.moveTo(x,y-18);ctx.lineTo(x+15,y+13);ctx.lineTo(x-17,y+13);ctx.closePath();ctx.fill()}
  }

  function drawTargets(time){
    const active=activeTargets();
    active.forEach(t=>{ctx.save();ctx.translate(t.x,t.y);const p=1+Math.sin(time/180)*.08;ctx.scale(p,p);ctx.fillStyle='rgba(103,241,223,.13)';ctx.strokeStyle='#67f1df';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#eaffff';ctx.font='900 18px system-ui';ctx.textAlign='center';ctx.fillText(t.label.startsWith('TRACK')?'⌁':t===targets.cave?'◒':'◎',0,6);ctx.restore()});
    if(!state.plant){ctx.save();ctx.translate(targets.plant.x,targets.plant.y);ctx.strokeStyle='#9af5c9';ctx.fillStyle='#2e745e';ctx.lineWidth=2;for(let i=0;i<5;i++){ctx.beginPath();ctx.ellipse((i-2)*9,-Math.abs(i-2)*4,9,27,(i-2)*.18,0,Math.PI*2);ctx.fill();ctx.stroke()}ctx.restore()}
    ctx.save();ctx.translate(targets.cave.x,targets.cave.y);ctx.fillStyle='#050817';ctx.beginPath();ctx.ellipse(0,0,60,78,0,Math.PI,Math.PI*2);ctx.lineTo(60,50);ctx.lineTo(-60,50);ctx.closePath();ctx.fill();ctx.strokeStyle='#7659a5';ctx.lineWidth=4;ctx.stroke();ctx.restore();
  }

  function drawGeysers(time){geysers.forEach(g=>{const active=geyserActive(g,time);ctx.save();ctx.translate(g.x,g.y);ctx.fillStyle='#4f3e67';ctx.beginPath();ctx.ellipse(0,0,34,17,0,0,Math.PI*2);ctx.fill();if(active){ctx.globalAlpha=.65;ctx.fillStyle='#a7fff0';ctx.beginPath();ctx.moveTo(-13,0);ctx.quadraticCurveTo(0,-90-Math.sin(time/90)*20,13,0);ctx.closePath();ctx.fill()}ctx.restore()})}

  function drawTracks(){const arr=[targets.track1,targets.track2,targets.track3];arr.forEach((t,i)=>{if(state.trackFound[i])return;ctx.save();ctx.translate(t.x,t.y);ctx.fillStyle='rgba(255,223,151,.48)';ctx.beginPath();ctx.ellipse(-7,0,7,13,-.28,0,Math.PI*2);ctx.ellipse(8,5,7,13,.28,0,Math.PI*2);ctx.fill();ctx.restore()})}

  function drawPlayer(time){ctx.save();ctx.translate(player.x,player.y);const jumping=performance.now()<player.jumpUntil;const lift=jumping?20*Math.sin(Math.PI*Math.max(0,1-(player.jumpUntil-performance.now())/820)):0;ctx.fillStyle='rgba(0,0,0,.34)';ctx.beginPath();ctx.ellipse(0,19,23-jumping*4,8-jumping*2,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=jumping?'#ffd96a':'rgba(103,241,223,.34)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-lift,30+Math.sin(time/170)*2,0,Math.PI*2);ctx.stroke();if(sprite.complete&&sprite.naturalWidth){ctx.save();ctx.translate(0,-lift);ctx.scale(player.facing,1);ctx.drawImage(sprite,-31,-68,62,88);ctx.restore()}else{ctx.fillStyle='#67f1df';ctx.beginPath();ctx.arc(0,-lift,17,0,Math.PI*2);ctx.fill()}ctx.restore()}

  function update(dt,time){let dx=0,dy=0;if(keys.has('up')||keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('down')||keys.has('ArrowDown')||keys.has('s'))dy++;if(keys.has('left')||keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('right')||keys.has('ArrowRight')||keys.has('d'))dx++;if(dx||dy)move(dx,dy,dt);updateNearTarget();handleGeysers(time);handleStorm(time,dt)}
  function loop(time){const dt=Math.min(.04,(time-last)/1000||0);last=time;if(running&&!paused)update(dt,time);drawWorld(time);requestAnimationFrame(loop)}
  function start(){intro.hidden=true;running=true;paused=false;last=performance.now();jumpButton.classList.add('ready');setObjective('Scan the atmosphere vent');say('First sample: atmosphere. The glowing vent is northwest of the lander.');beep(650,.1)}

  begin.addEventListener('click',start);actionButton.addEventListener('click',interact);jumpButton.addEventListener('click',jump);soundToggle.addEventListener('click',()=>{soundOn=!soundOn;soundToggle.textContent=soundOn?'♫':'×'});
  document.querySelectorAll('[data-move]').forEach(button=>{const id=button.dataset.move;const on=e=>{e.preventDefault();keys.add(id)},off=e=>{e.preventDefault();keys.delete(id)};button.addEventListener('pointerdown',on);button.addEventListener('pointerup',off);button.addEventListener('pointercancel',off);button.addEventListener('pointerleave',off);button.addEventListener('touchstart',on,{passive:false});button.addEventListener('touchend',off,{passive:false})});
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' ','Shift'].includes(e.key))e.preventDefault();if(e.key===' ')interact();else if(e.key==='Shift')jump();else keys.add(e.key)});document.addEventListener('keyup',e=>keys.delete(e.key));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();paused=true}else if(running&&eventLayer.hidden){paused=false;last=performance.now()}});
  requestAnimationFrame(loop);
})();
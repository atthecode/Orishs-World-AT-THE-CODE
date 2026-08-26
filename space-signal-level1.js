(() => {
  'use strict';

  const LEVEL_KEY = 'orish.level1.signal.v1';
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const intro = document.getElementById('intro');
  const begin = document.getElementById('beginMission');
  const actionButton = document.getElementById('actionButton');
  const dashButton = document.getElementById('dashButton');
  const eventLayer = document.getElementById('eventLayer');
  const eventCard = document.getElementById('eventCard');
  const objectiveText = document.getElementById('objectiveText');
  const powerText = document.getElementById('powerText');
  const signalText = document.getElementById('signalText');
  const evidenceText = document.getElementById('evidenceText');
  const starsText = document.getElementById('starsText');
  const orishText = document.getElementById('orishText');
  const soundToggle = document.getElementById('soundToggle');
  const flashNode = document.getElementById('screenFlash');

  const W = 1280, H = 720;
  const keys = new Set();
  const player = { x: 110, y: 580, r: 17, speed: 245, facing: 1, dashUntil: 0, dashReadyAt: 0 };
  const sprite = new Image();
  sprite.src = 'assets/orish-game-walk.webp';

  let running = false;
  let paused = false;
  let last = 0;
  let nearTarget = null;
  let soundOn = true;
  let audio = null;
  let carryingDrone = false;
  let reactorDeadline = 0;
  let reactorTimeoutHandled = false;
  let hitCooldownUntil = 0;
  let alarmPulse = 0;
  let signalPhase = 0;

  const state = {
    phase: 'console',
    power: 100,
    powerChoice: [],
    evidence: 0,
    stars: 0,
    reactorStable: false,
    droneRescued: false,
    dishes: [false,false,false],
    doorOpen: false,
    complete: false
  };

  const walls = [
    {x:0,y:0,w:1280,h:28},{x:0,y:692,w:1280,h:28},{x:0,y:0,w:28,h:720},{x:1252,y:0,w:28,h:720},
    {x:235,y:28,w:30,h:205},{x:235,y:335,w:30,h:357},
    {x:515,y:28,w:30,h:120},{x:515,y:250,w:30,h:442},
    {x:820,y:28,w:30,h:220},{x:820,y:350,w:30,h:342},
    {x:1030,y:255,w:190,h:26},{x:570,y:330,w:175,h:26},{x:292,y:465,w:150,h:26}
  ];

  const targets = {
    console:{x:388,y:112,r:55,label:'SIGNAL CONSOLE'},
    reactor:{x:402,y:575,r:58,label:'REACTOR'},
    drone:{x:684,y:445,r:52,label:'RESEARCH DRONE'},
    charger:{x:705,y:128,r:52,label:'DRONE CHARGER'},
    dish1:{x:930,y:118,r:52,label:'DISH A'},
    dish2:{x:1130,y:145,r:52,label:'DISH B'},
    dish3:{x:930,y:505,r:52,label:'DISH C'},
    lowerDoor:{x:1138,y:535,r:60,label:'LOWER DOOR'},
    hidden:{x:1190,y:620,r:48,label:'CALIBRATION ARRAY'}
  };

  const arcs = [
    {x:330,y:330,w:105,h:16,offset:0},
    {x:610,y:250,w:120,h:16,offset:1.8},
    {x:865,y:332,w:118,h:16,offset:3.2},
    {x:1065,y:385,w:90,h:16,offset:4.5}
  ];

  function setObjective(text){ objectiveText.textContent = text; }
  function say(text){ orishText.textContent = text; }
  function setPower(value){ state.power = Math.max(0, Math.min(100, Math.round(value))); powerText.textContent = `${state.power}%`; }
  function setSignal(text){ signalText.textContent = text; }
  function setEvidence(value){ state.evidence = value; evidenceText.textContent = `${value} / 4`; }
  function addStars(value){ state.stars += value; starsText.textContent = String(state.stars); }
  function flash(){ flashNode.animate([{opacity:.75},{opacity:0}],{duration:420,easing:'ease-out'}); }

  function beep(freq=540,duration=.08){
    if(!soundOn) return;
    try{
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audio ||= new Ctx();
      if(audio.state==='suspended') audio.resume();
      const o=audio.createOscillator(),g=audio.createGain();
      o.frequency.value=freq;g.gain.value=.035;g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
      o.connect(g).connect(audio.destination);o.start();o.stop(audio.currentTime+duration);
    }catch(_){ }
  }

  function saveLevelComplete(){
    let current={};
    try{current=JSON.parse(localStorage.getItem(LEVEL_KEY)||'{}')}catch(_){ }
    try{localStorage.setItem(LEVEL_KEY,JSON.stringify({...current,spaceComplete:true,cinemaSeen:false,stars:state.stars,updated:Date.now()}))}catch(_){ }
  }

  function collides(x,y){
    return walls.some(w=>x+player.r>w.x&&x-player.r<w.x+w.w&&y+player.r>w.y&&y-player.r<w.y+w.h);
  }

  function move(dx,dy,dt){
    const len=Math.hypot(dx,dy)||1;
    const boost=performance.now()<player.dashUntil?2.05:1;
    const speed=player.speed*boost;
    const nx=player.x+dx/len*speed*dt,ny=player.y+dy/len*speed*dt;
    if(!collides(nx,player.y)) player.x=nx;
    if(!collides(player.x,ny)) player.y=ny;
    if(dx) player.facing=dx>0?1:-1;
  }

  function activeTargets(){
    if(state.phase==='console') return [targets.console];
    if(state.phase==='reactor') return [targets.reactor];
    if(state.phase==='drone') return [targets.drone];
    if(state.phase==='carry-drone') return [targets.charger];
    if(state.phase==='dishes') return [targets.dish1,targets.dish2,targets.dish3].filter((_,i)=>!state.dishes[i]);
    if(state.phase==='door') return [targets.lowerDoor];
    if(state.phase==='hidden') return [targets.hidden];
    return [];
  }

  function updateNearTarget(){
    nearTarget = activeTargets().map(t=>({t,d:Math.hypot(player.x-t.x,player.y-t.y)})).filter(item=>item.d<item.t.r+28).sort((a,b)=>a.d-b.d)[0]?.t||null;
    actionButton.classList.toggle('ready',Boolean(nearTarget));
    actionButton.querySelector('b').textContent=nearTarget?nearTarget.label:'ACTION';
  }

  function dash(){
    const now=performance.now();
    if(now<player.dashReadyAt||paused||!running) return;
    player.dashUntil=now+650;player.dashReadyAt=now+2200;dashButton.classList.remove('ready');beep(720,.08);
    setTimeout(()=>dashButton.classList.add('ready'),2200);
  }

  function hazardActive(arc,time){ return Math.sin(time/440+arc.offset)>.28; }

  function handleHazards(time){
    if(performance.now()<hitCooldownUntil) return;
    const hit=arcs.some(arc=>hazardActive(arc,time)&&player.x>arc.x-10&&player.x<arc.x+arc.w+10&&player.y>arc.y-24&&player.y<arc.y+40);
    if(!hit) return;
    hitCooldownUntil=performance.now()+1300;
    setPower(state.power-4);flash();beep(180,.16);say('Electrical arc! Back away and use DASH to cross during the quiet pulse.');
    player.x=Math.max(46,player.x-34);
  }

  function openEvent(html){ paused=true;keys.clear();eventCard.innerHTML=html;eventLayer.hidden=false; }
  function closeEvent(){ eventLayer.hidden=true;eventCard.innerHTML='';paused=false;last=performance.now(); }

  function interact(){
    if(!running||paused||!nearTarget) return;
    if(nearTarget===targets.console) inspectConsole();
    else if(nearTarget===targets.reactor) openReactorRecovery();
    else if(nearTarget===targets.drone) pickUpDrone();
    else if(nearTarget===targets.charger) deliverDrone();
    else if(nearTarget===targets.dish1) openDish(0);
    else if(nearTarget===targets.dish2) openDish(1);
    else if(nearTarget===targets.dish3) openDish(2);
    else if(nearTarget===targets.lowerDoor) openLowerDoor();
    else if(nearTarget===targets.hidden) finishMission();
  }

  function inspectConsole(){
    setEvidence(1);addStars(50);setSignal('CHANGING');alarmPulse=1;flash();beep(880,.12);
    say('The pulse moved while we were measuring it. Main power just dropped too. Pick what the station protects.');
    openPowerCrisis();
  }

  function openPowerCrisis(){
    openEvent(`
      <p class="kicker">EMERGENCY // MAIN GRID FAILURE</p>
      <h2>Protect two systems. Lose one.</h2>
      <p>Your choice changes the rest of the mission. There is no perfect answer.</p>
      <div class="system-grid">
        <button class="system-card" type="button" data-system="scanner"><b>◎ SCANNER</b><small>Wider signal-lock window at the dishes.</small></button>
        <button class="system-card" type="button" data-system="doors"><b>▣ LOWER DOORS</b><small>Keeps the lower observatory entrance powered.</small></button>
        <button class="system-card" type="button" data-system="comms"><b>◉ COMMS</b><small>Keeps full Orish support online.</small></button>
      </div>
      <p id="powerStatus">Choose 2 systems.</p>
      <button id="confirmPower" class="event-primary" type="button" disabled>ROUTE EMERGENCY POWER</button>
    `);
    const picked=new Set();
    const buttons=[...eventCard.querySelectorAll('[data-system]')];
    const confirm=document.getElementById('confirmPower');
    const status=document.getElementById('powerStatus');
    buttons.forEach(button=>button.addEventListener('click',()=>{
      const id=button.dataset.system;
      if(picked.has(id)) picked.delete(id); else if(picked.size<2) picked.add(id); else return;
      buttons.forEach(b=>b.classList.toggle('selected',picked.has(b.dataset.system)));
      confirm.disabled=picked.size!==2;
      status.textContent=picked.size===2?`Protected: ${[...picked].join(' + ')}`:`Choose ${2-picked.size} more.`;
      beep(460+picked.size*110,.06);
    }));
    confirm.addEventListener('click',()=>{
      state.powerChoice=[...picked];
      const lost=['scanner','doors','comms'].find(id=>!picked.has(id));
      setPower(lost==='scanner'?72:78);
      if(lost==='scanner') say('Scanner assist is weak. Dish alignment will need tighter manual control.');
      if(lost==='doors') say('Lower doors are offline. If the signal goes below, we will have to reroute them ourselves.');
      if(lost==='comms') say('Full comms are down. I can still guide you on-screen, but no voice support for this mission.');
      state.phase='reactor';
      reactorDeadline=performance.now()+18000;
      reactorTimeoutHandled=false;
      setObjective('Stabilise the reactor — 18 seconds');
      closeEvent();
    });
  }

  function openReactorRecovery(){
    openEvent(`
      <p class="kicker">REACTOR // MANUAL RECOVERY</p>
      <h2>Catch the stable current.</h2>
      <p>Move emergency current into the safe window. Too little will not restart the coolant pump; too much overloads the relay.</p>
      <div class="slider-block" id="reactorBlock"><strong><span>CURRENT</span><span id="reactorReading">LOW</span></strong><input id="reactorSlider" type="range" min="0" max="100" value="24"><div class="meter"><i id="reactorMeter"></i></div><button id="stabiliseReactor" class="event-primary" type="button" disabled>STABILISE REACTOR</button></div>
    `);
    const slider=document.getElementById('reactorSlider'),reading=document.getElementById('reactorReading'),meter=document.getElementById('reactorMeter'),button=document.getElementById('stabiliseReactor'),block=document.getElementById('reactorBlock');
    const update=()=>{const v=Number(slider.value),safe=v>=57&&v<=68;meter.style.width=`${v}%`;reading.textContent=safe?'STABLE':v<57?'LOW':'OVERLOAD';button.disabled=!safe;block.classList.toggle('ready',safe)};
    slider.addEventListener('input',update);
    button.addEventListener('click',()=>{state.reactorStable=true;state.phase='drone';setPower(Math.min(88,state.power+8));addStars(80);setObjective('Rescue the research drone');say('Reactor stable. New problem: the research drone is trapped beyond the electrical arcs.');beep(960,.14);closeEvent();});
    update();
  }

  function handleReactorTimer(now){
    if(state.phase!=='reactor'||paused||reactorTimeoutHandled) return;
    const remaining=Math.max(0,Math.ceil((reactorDeadline-now)/1000));
    setObjective(`Stabilise the reactor — ${remaining} seconds`);
    if(remaining>0) return;
    reactorTimeoutHandled=true;setPower(state.power-10);say('Coolant backup kicked in. We lost extra power, but the mission continues — reach the reactor now.');beep(190,.2);flash();setObjective('Reach the reactor — backup power active');
  }

  function pickUpDrone(){
    carryingDrone=true;state.phase='carry-drone';addStars(35);setObjective('Carry the drone to its charger');say('Drone secured. Get it to the charger in the upper array room. Watch the electrical arcs.');beep(700,.1);
  }

  function deliverDrone(){
    carryingDrone=false;state.droneRescued=true;state.phase='dishes';setEvidence(2);addStars(100);setObjective('Align all three tracking dishes');say('Drone online. It recovered a second direction sample. We need all three dishes now.');beep(1040,.14);
  }

  function openDish(index){
    const names=['A','B','C'];
    const targetsValue=state.powerChoice.includes('scanner')?[26,72,43]:[31,66,49];
    const tolerance=state.powerChoice.includes('scanner')?5:3;
    openEvent(`
      <p class="kicker">DISH ${names[index]} // LIVE TRACKING</p>
      <h2>Lock the moving pulse.</h2>
      <p>${state.powerChoice.includes('scanner')?'Scanner assist is online.':'Scanner assist is weak — the lock window is narrow.'} Find the strongest signal, then lock the dish.</p>
      <div class="slider-block" id="dishBlock"><strong><span>DISH ${names[index]}</span><span id="dishReading">0% SIGNAL</span></strong><input id="dishSlider" type="range" min="0" max="100" value="50"><div class="meter"><i id="dishMeter"></i></div><button id="lockDish" class="event-primary" type="button" disabled>LOCK DISH ${names[index]}</button></div>
      <p class="science-note">A direction match is evidence about where a signal comes from. It is not evidence of aliens by itself.</p>
    `);
    const slider=document.getElementById('dishSlider'),reading=document.getElementById('dishReading'),meter=document.getElementById('dishMeter'),button=document.getElementById('lockDish'),block=document.getElementById('dishBlock');
    const update=()=>{const distance=Math.abs(Number(slider.value)-targetsValue[index]);const score=Math.max(0,Math.min(100,Math.round(100-distance*4.2)));reading.textContent=`${score}% SIGNAL`;meter.style.width=`${score}%`;const ready=distance<=tolerance;button.disabled=!ready;block.classList.toggle('ready',ready)};
    slider.addEventListener('input',update);
    button.addEventListener('click',()=>{
      state.dishes[index]=true;addStars(60);const count=state.dishes.filter(Boolean).length;beep(980,.12);
      if(count<3){setObjective(`Align ${3-count} more dish${3-count===1?'':'es'}`);say(`Dish ${names[index]} locked. The pulse shifted again — keep moving.`);closeEvent();return;}
      setEvidence(3);setSignal('SOURCE BELOW');state.phase='door';setObjective('Reach the lower observatory');say('All dishes agree. The pulse is strongest below the observatory.');closeEvent();
    });
    update();
  }

  function openLowerDoor(){
    if(state.powerChoice.includes('doors')){
      state.doorOpen=true;state.phase='hidden';addStars(40);setObjective('Enter the hidden calibration bay');say('Door power held. The signal is just beyond this corridor.');beep(760,.12);return;
    }
    openEvent(`
      <p class="kicker">LOWER ACCESS // POWER OFFLINE</p>
      <h2>Your earlier choice changed this route.</h2>
      <p>The lower doors were not protected. Hold the emergency current inside the stable band to open them manually.</p>
      <div class="slider-block" id="doorBlock"><strong><span>DOOR CURRENT</span><span id="doorReading">LOW</span></strong><input id="doorSlider" type="range" min="0" max="100" value="18"><div class="meter"><i id="doorMeter"></i></div><button id="openDoor" class="event-primary" type="button" disabled>OPEN LOWER DOOR</button></div>
    `);
    const slider=document.getElementById('doorSlider'),reading=document.getElementById('doorReading'),meter=document.getElementById('doorMeter'),button=document.getElementById('openDoor'),block=document.getElementById('doorBlock');
    const update=()=>{const v=Number(slider.value),safe=v>=63&&v<=75;reading.textContent=safe?'STABLE':v<63?'LOW':'OVERLOAD';meter.style.width=`${v}%`;button.disabled=!safe;block.classList.toggle('ready',safe)};
    slider.addEventListener('input',update);
    button.addEventListener('click',()=>{state.doorOpen=true;state.phase='hidden';addStars(70);setObjective('Enter the hidden calibration bay');say('Manual reroute successful. Door open.');beep(900,.14);closeEvent();});
    update();
  }

  function finishMission(){
    state.complete=true;state.phase='complete';setEvidence(4);setSignal('DESTINATION FOUND');addStars(150);saveLevelComplete();
    openEvent(`
      <p class="kicker">HIDDEN CALIBRATION BAY // DISCOVERY</p>
      <h2>The signal has a destination.</h2>
      <p>The old calibration array confirms the moving pulse lines up repeatedly with the same distant planetary system. That tells us where to investigate next — not what made the signal.</p>
      <div class="reward-grid"><span>📡 4 evidence points</span><span>🤖 Research drone rescued</span><span>⭐ ${state.stars} stars</span></div>
      <p class="science-note">Evidence: repeating pulse + matching direction + distant planetary destination. Conclusion: <strong>source unknown</strong>. Alien life is still a hypothesis, not a fact.</p>
      <a class="event-primary" href="level-one-cinema.html">WATCH CINEMA BRIDGE →</a>
    `);
  }

  function drawStation(time){
    const bg=ctx.createLinearGradient(0,0,W,H);bg.addColorStop(0,'#031020');bg.addColorStop(.52,'#08233d');bg.addColorStop(1,'#061325');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
    const glow=ctx.createRadialGradient(1030,120,15,1030,120,430);glow.addColorStop(0,'rgba(85,230,234,.17)');glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
    const rooms=[{x:40,y:42,w:175,h:630,n:'ENTRY'},{x:282,y:42,w:215,h:170,n:'SIGNAL LAB'},{x:282,y:520,w:215,h:145,n:'REACTOR'},{x:565,y:42,w:230,h:220,n:'DRONE BAY'},{x:565,y:385,w:230,h:280,n:'SYSTEMS'},{x:865,y:42,w:350,h:195,n:'OBSERVATION ARRAY'},{x:865,y:310,w:350,h:355,n:'LOWER ACCESS'}];
    rooms.forEach((r,i)=>{ctx.fillStyle=i%2?'rgba(7,31,53,.88)':'rgba(5,25,45,.9)';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle='rgba(103,225,235,.14)';ctx.strokeRect(r.x+.5,r.y+.5,r.w-1,r.h-1);ctx.fillStyle='rgba(147,220,229,.45)';ctx.font='800 11px system-ui';ctx.fillText(r.n,r.x+12,r.y+20)});
    walls.forEach(w=>{ctx.fillStyle='#133650';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle='rgba(102,244,232,.12)';ctx.fillRect(w.x+4,w.y+4,Math.min(4,w.w-8),Math.max(0,w.h-8))});
    for(let i=0;i<24;i++){const sx=(i*179+63)%W,sy=(i*113+51)%215;ctx.fillStyle=i%4===0?'#ffe6a1':'#9befff';ctx.globalAlpha=.18+.28*Math.sin(time/350+i);ctx.beginPath();ctx.arc(sx,sy,i%5===0?2:1.2,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
    drawTarget(targets.console,'◎',state.phase==='console');drawTarget(targets.reactor,'⚡',state.phase==='reactor');
    if(!state.droneRescued) drawDrone(time);
    if(state.phase==='carry-drone') drawTarget(targets.charger,'⌁',true);
    drawTarget(targets.dish1,'A',state.phase==='dishes'&&!state.dishes[0]);drawTarget(targets.dish2,'B',state.phase==='dishes'&&!state.dishes[1]);drawTarget(targets.dish3,'C',state.phase==='dishes'&&!state.dishes[2]);
    drawDoor();if(state.phase==='hidden'||state.phase==='complete') drawTarget(targets.hidden,'?',true);
    drawArcs(time);drawMovingSignal(time);
  }

  function drawTarget(t,glyph,active){
    if(!active&&![targets.drone,targets.lowerDoor].includes(t)) return;
    ctx.save();ctx.translate(t.x,t.y);const pulse=active?1+Math.sin(performance.now()/180)*.08:1;ctx.scale(pulse,pulse);ctx.fillStyle=active?'rgba(102,244,232,.16)':'rgba(77,110,132,.12)';ctx.strokeStyle=active?'#66f4e8':'#4b6c7d';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,28,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=active?'#efffff':'#748d9a';ctx.font='900 20px system-ui';ctx.textAlign='center';ctx.fillText(glyph,0,7);ctx.restore();
  }

  function drawDrone(time){
    const t=targets.drone;ctx.save();ctx.translate(t.x,t.y+Math.sin(time/280)*6);ctx.strokeStyle=state.phase==='drone'?'#ffe26a':'#66f4e8';ctx.fillStyle='#0c2e45';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,30,20,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#ffe26a';ctx.fillRect(-45,-3,20,6);ctx.fillRect(25,-3,20,6);ctx.fillStyle='#9efff5';ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function drawDoor(){
    const t=targets.lowerDoor;ctx.save();ctx.translate(t.x,t.y);ctx.fillStyle=state.doorOpen?'rgba(102,244,232,.1)':'#091c2c';ctx.strokeStyle=state.phase==='door'?'#ffe26a':'#42657a';ctx.lineWidth=4;ctx.fillRect(-32,-50,64,100);ctx.strokeRect(-32,-50,64,100);ctx.fillStyle=state.doorOpen?'#66f4e8':'#9bb2be';ctx.font='900 10px system-ui';ctx.textAlign='center';ctx.fillText(state.doorOpen?'OPEN':'LOWER',0,4);ctx.restore();
  }

  function drawArcs(time){
    arcs.forEach(arc=>{const active=hazardActive(arc,time);ctx.save();ctx.translate(arc.x,arc.y);ctx.globalAlpha=active?.85:.14;ctx.strokeStyle=active?'#8af9ff':'#315f72';ctx.lineWidth=active?4:2;ctx.beginPath();ctx.moveTo(0,0);for(let x=0;x<=arc.w;x+=12){ctx.lineTo(x,(Math.random()-.5)*(active?28:6))}ctx.stroke();ctx.restore()});
  }

  function drawMovingSignal(time){
    if(state.phase==='console') return;
    signalPhase+=.008;const pts=[[390,120],[685,150],[1080,125],[970,485],[1150,575]];const seg=Math.floor(signalPhase)%pts.length,n=(seg+1)%pts.length,f=signalPhase-Math.floor(signalPhase),x=pts[seg][0]+(pts[n][0]-pts[seg][0])*f,y=pts[seg][1]+(pts[n][1]-pts[seg][1])*f;ctx.save();ctx.globalAlpha=.55+.3*Math.sin(time/110);ctx.strokeStyle='#ffe26a';ctx.lineWidth=2;for(let r=8;r<36;r+=9){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}ctx.fillStyle='#fff2a7';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function drawPlayer(time){
    ctx.save();ctx.translate(player.x,player.y);ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(0,20,23,8,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=performance.now()<player.dashUntil?'#ffe26a':'rgba(102,244,232,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,2,31+Math.sin(time/170)*2,0,Math.PI*2);ctx.stroke();
    const bob=Math.sin(time/(performance.now()<player.dashUntil?45:80))*2.5;
    if(sprite.complete&&sprite.naturalWidth){ctx.save();ctx.scale(player.facing,1);ctx.drawImage(sprite,-31,-68+bob,62,88);ctx.restore()}else{ctx.fillStyle='#66f4e8';ctx.beginPath();ctx.arc(0,0,17,0,Math.PI*2);ctx.fill()}
    if(carryingDrone){ctx.fillStyle='#ffe26a';ctx.strokeStyle='#66f4e8';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-78,20,12,0,0,Math.PI*2);ctx.fill();ctx.stroke()}
    ctx.restore();
  }

  function update(dt,time){
    let dx=0,dy=0;if(keys.has('up')||keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('down')||keys.has('ArrowDown')||keys.has('s'))dy++;if(keys.has('left')||keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('right')||keys.has('ArrowRight')||keys.has('d'))dx++;if(dx||dy)move(dx,dy,dt);updateNearTarget();handleHazards(time);handleReactorTimer(performance.now());
  }

  function render(time){drawStation(time);drawPlayer(time);if(alarmPulse>0){ctx.fillStyle=`rgba(255,84,112,${.06+.04*Math.sin(time/90)})`;ctx.fillRect(0,0,W,H)}}
  function loop(time){const dt=Math.min(.04,(time-last)/1000||0);last=time;if(running&&!paused)update(dt,time);render(time);requestAnimationFrame(loop)}

  function start(){intro.hidden=true;running=true;paused=false;last=performance.now();dashButton.classList.add('ready');setObjective('Reach the signal console');say('The upper Signal Lab is flashing. Move there and investigate.');beep(650,.1)}

  begin.addEventListener('click',start);actionButton.addEventListener('click',interact);dashButton.addEventListener('click',dash);soundToggle.addEventListener('click',()=>{soundOn=!soundOn;soundToggle.textContent=soundOn?'♫':'×'});
  document.querySelectorAll('[data-move]').forEach(button=>{const id=button.dataset.move;const on=e=>{e.preventDefault();keys.add(id)};const off=e=>{e.preventDefault();keys.delete(id)};button.addEventListener('pointerdown',on);button.addEventListener('pointerup',off);button.addEventListener('pointercancel',off);button.addEventListener('pointerleave',off);button.addEventListener('touchstart',on,{passive:false});button.addEventListener('touchend',off,{passive:false})});
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' ','Shift'].includes(e.key))e.preventDefault();if(e.key===' ')interact();else if(e.key==='Shift')dash();else keys.add(e.key)});
  document.addEventListener('keyup',e=>keys.delete(e.key));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();paused=true}else if(running&&eventLayer.hidden){paused=false;last=performance.now()}});
  requestAnimationFrame(loop);
})();
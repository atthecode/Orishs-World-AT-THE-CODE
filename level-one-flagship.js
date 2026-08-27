(() => {
  'use strict';

  const SAVE_KEY = 'orish.level1.flagship.v1';
  const root = document.getElementById('gameRoot');
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const panel = document.getElementById('overlayPanel');
  const objectiveText = document.getElementById('objectiveText');
  const chapterLabel = document.getElementById('chapterLabel');
  const checkpointLabel = document.getElementById('checkpointLabel');
  const evidenceText = document.getElementById('evidenceText');
  const suitText = document.getElementById('suitText');
  const starsText = document.getElementById('starsText');
  const commsText = document.getElementById('commsText');
  const actionBtn = document.getElementById('actionBtn');
  const abilityBtn = document.getElementById('abilityBtn');
  const joystick = document.getElementById('joystick');
  const stick = document.getElementById('stick');
  const pauseBtn = document.getElementById('pauseBtn');
  const soundBtn = document.getElementById('soundBtn');
  const meter = document.getElementById('miniMeter');
  const meterFill = meter.querySelector('i');
  const toast = document.getElementById('toast');
  const flash = document.getElementById('damageFlash');
  const stormFilter = document.getElementById('stormFilter');

  const sprite = new Image();
  sprite.src = 'assets/orish-game-walk.webp';
  const portrait = new Image();
  portrait.src = 'assets/orish-approved-hq.webp';

  let cssW = innerWidth, cssH = innerHeight, dpr = Math.min(2, devicePixelRatio || 1);
  let running = false, paused = true, overlayOpen = true, last = performance.now();
  let soundOn = true, audio = null, nearTarget = null, actionHeld = false, actionPressAt = 0;
  let inputX = 0, inputY = 0, joyPointer = null, screenShake = 0, hitCooldown = 0, toastTimer = 0;
  const keys = new Set();
  const camera = {x:0,y:0};
  const player = {x:230,y:920,r:24,speed:250,facing:1,dashUntil:0,jumpUntil:0,suit:100};

  const state = {
    chapter:'station', stationPhase:'console', planetPhase:'atmosphere',
    evidence:0, stars:0, checkpoint:'Arrival',
    reactorRepair:0, reactorDeadline:0, reactorFailed:false,
    droneCarried:false, droneRescued:false, power:[], dishes:[false,false,false], reroute:0,
    stationComplete:false,
    atmosphere:false, mineral:false, growth:false, tracks:[false,false,false], cave:false,
    creatureBuilt:false, levelComplete:false
  };

  const stationWorld = {w:2300,h:1280};
  const planetWorld = {w:2660,h:1450};

  const stationTargets = {
    console:{x:520,y:260,r:72,label:'SIGNAL CONSOLE',glyph:'◎'},
    reactor:{x:700,y:990,r:82,label:'REACTOR',glyph:'⚡'},
    drone:{x:1180,y:340,r:72,label:'RESEARCH DRONE',glyph:'◇'},
    charger:{x:1390,y:555,r:74,label:'DRONE CHARGER',glyph:'⌁'},
    power:{x:1510,y:880,r:78,label:'POWER CORE',glyph:'◫'},
    dish1:{x:1830,y:260,r:72,label:'DISH A',glyph:'A'},
    dish2:{x:2070,y:460,r:72,label:'DISH B',glyph:'B'},
    dish3:{x:1840,y:690,r:72,label:'DISH C',glyph:'C'},
    reroute:{x:2050,y:930,r:78,label:'DOOR REROUTE',glyph:'↯'},
    hidden:{x:2180,y:1110,r:88,label:'HIDDEN BAY',glyph:'?'}
  };

  const planetTargets = {
    atmosphere:{x:420,y:340,r:82,label:'ATMOSPHERE VENT',glyph:'◎'},
    mineral:{x:930,y:1100,r:82,label:'MINERAL NODE',glyph:'◆'},
    growth:{x:1440,y:430,r:82,label:'STRANGE GROWTH',glyph:'✦'},
    track1:{x:1690,y:880,r:68,label:'TRACK A',glyph:'⌁'},
    track2:{x:2080,y:520,r:68,label:'TRACK B',glyph:'⌁'},
    track3:{x:2260,y:1110,r:68,label:'TRACK C',glyph:'⌁'},
    cave:{x:2520,y:720,r:100,label:'ECHO CAVE',glyph:'◒'}
  };

  const stationHazards = [
    {x:840,y:610,w:190,h:22,o:0.2},{x:1240,y:770,w:220,h:22,o:1.8},{x:1620,y:560,w:190,h:22,o:3.4},{x:1900,y:840,w:180,h:22,o:4.6}
  ];
  const planetGaps = [{x:650,y:470,w:160,h:520},{x:1570,y:80,w:150,h:610}];
  const geysers = [{x:760,y:1160,r:48,o:0},{x:1360,y:780,r:52,o:2.1},{x:2130,y:870,r:50,o:4.2}];
  const starField = Array.from({length:90},(_,i)=>({x:(i*173+41)%2800,y:(i*83+29)%900,s:i%7===0?2.2:1,a:.18+(i%5)*.09}));
  const planetRocks = Array.from({length:38},(_,i)=>({x:120+(i*211)%2450,y:270+(i*137)%1030,r:12+(i%5)*8,c:i%3}));

  function resize(){
    cssW = innerWidth; cssH = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.floor(cssW*dpr));
    canvas.height = Math.max(1, Math.floor(cssH*dpr));
    canvas.style.width = cssW+'px'; canvas.style.height = cssH+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener('resize', resize, {passive:true}); resize();

  function beep(freq=620,duration=.07,gain=.035,type='sine'){
    if(!soundOn) return;
    try{
      const AC = window.AudioContext || window.webkitAudioContext;
      audio ||= new AC(); if(audio.state==='suspended') audio.resume();
      const o=audio.createOscillator(), g=audio.createGain(); o.type=type; o.frequency.value=freq;
      g.gain.setValueAtTime(gain,audio.currentTime); g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);
      o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime+duration);
    }catch(_){ }
  }
  function chord(){beep(520,.1,.028);setTimeout(()=>beep(690,.12,.025),70);setTimeout(()=>beep(900,.16,.02),140)}
  function feedback(ms=12){try{navigator.vibrate?.(ms)}catch(_){}}
  function say(text){commsText.textContent=text}
  function setObjective(text){objectiveText.textContent=text}
  function setCheckpoint(name){state.checkpoint=name;checkpointLabel.textContent=name}
  function addEvidence(n=1){state.evidence+=n;evidenceText.textContent=String(state.evidence)}
  function addStars(n){state.stars+=n;starsText.textContent=String(state.stars)}
  function setSuit(v){player.suit=Math.max(0,Math.min(100,Math.round(v)));suitText.textContent=player.suit+'%'}
  function toastMsg(title,text){
    toast.innerHTML=`<b>${title}</b> ${text}`; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),3100);
  }
  function damage(amount=8){
    if(performance.now()<hitCooldown) return; hitCooldown=performance.now()+900; setSuit(player.suit-amount); screenShake=12; flash.style.opacity='.9'; setTimeout(()=>flash.style.opacity='0',120); beep(150,.12,.05,'sawtooth'); feedback(30);
    if(player.suit<=0){setSuit(100);toastMsg('Suit rebooted.','You were returned to the last safe checkpoint.');restartCheckpoint();}
  }

  function serialize(){return {state:{...state,power:[...state.power],dishes:[...state.dishes],tracks:[...state.tracks]},player:{x:player.x,y:player.y,suit:player.suit}}}
  function saveCheckpoint(name){setCheckpoint(name);try{localStorage.setItem(SAVE_KEY,JSON.stringify(serialize()))}catch(_){ } }
  function loadSave(){try{return JSON.parse(localStorage.getItem(SAVE_KEY)||'null')}catch(_){return null}}
  function applySave(data){
    if(!data?.state) return false; Object.assign(state,data.state); state.power=[...(data.state.power||[])];state.dishes=[...(data.state.dishes||[false,false,false])];state.tracks=[...(data.state.tracks||[false,false,false])];
    if(data.player){player.x=Number(data.player.x)||230;player.y=Number(data.player.y)||920;setSuit(Number(data.player.suit)||100)}
    syncHud();updateObjective();return true;
  }
  function clearSave(){try{localStorage.removeItem(SAVE_KEY)}catch(_){}}
  function resetState(){
    Object.assign(state,{chapter:'station',stationPhase:'console',planetPhase:'atmosphere',evidence:0,stars:0,checkpoint:'Arrival',reactorRepair:0,reactorDeadline:0,reactorFailed:false,droneCarried:false,droneRescued:false,power:[],reroute:0,stationComplete:false,atmosphere:false,mineral:false,growth:false,cave:false,creatureBuilt:false,levelComplete:false});
    state.dishes=[false,false,false];state.tracks=[false,false,false]; player.x=230;player.y=920;player.dashUntil=0;player.jumpUntil=0;setSuit(100); clearSave(); syncHud();
  }
  function syncHud(){
    chapterLabel.textContent=state.chapter==='station'?'SPACE SIGNAL // OBSERVATORY':'ECHO PLANET // FIRST LANDING'; checkpointLabel.textContent=state.checkpoint||'Arrival';evidenceText.textContent=String(state.evidence||0);starsText.textContent=String(state.stars||0);suitText.textContent=player.suit+'%';
    abilityBtn.querySelector('b').textContent=state.chapter==='station'?'DASH':'JUMP'; abilityBtn.querySelector('span').textContent=state.chapter==='station'?'»':'↥';
  }

  function openOverlay(html,wide=false){paused=true;overlayOpen=true;keys.clear();inputX=inputY=0;resetStick();panel.className='panel'+(wide?' wide':'');panel.innerHTML=html;overlay.hidden=false}
  function closeOverlay(){overlay.hidden=true;overlayOpen=false;paused=false;last=performance.now()}

  function showIntro(){
    const saved=loadSave();
    openOverlay(`<div class="hero-layout"><div><p class="kicker">ORISH'S WORLD // FLAGSHIP LEVEL 1</p><h1>The Unknown Signal</h1><p>This is one continuous adventure. Run an observatory during a systems emergency, track a moving signal, travel to Echo Planet and investigate what the evidence really proves.</p><div class="buttons"><button id="startNew" class="primary" type="button">START LEVEL</button>${saved?'<button id="resumeSave" class="secondary" type="button">RESUME CHECKPOINT</button>':''}</div></div><div class="hero-art"><div class="orbit"></div><img src="assets/orish-explorer.webp" alt="Orish ready for the mission"></div></div>`);
    document.getElementById('startNew').onclick=()=>{resetState();startPlaying()};
    if(saved)document.getElementById('resumeSave').onclick=()=>{applySave(saved);startPlaying()};
  }
  function startPlaying(){root.classList.add('playing');running=true;closeOverlay();syncHud();updateObjective();say(state.chapter==='station'?'The signal console is ahead. Something just changed direction.':'Echo Planet is live. Measure first. Guess second.');chord()}

  function showPause(){
    openOverlay(`<p class="kicker">PAUSED // ${state.checkpoint}</p><h2>Mission paused</h2><p>Your last checkpoint is saved on this device.</p><div class="pause-actions"><button id="resumeGame" class="primary" type="button">RESUME</button><button id="restartCheck" class="secondary" type="button">RESTART CHECKPOINT</button><button id="restartLevel" class="secondary" type="button">RESTART LEVEL</button></div>`);
    document.getElementById('resumeGame').onclick=closeOverlay;document.getElementById('restartCheck').onclick=()=>{restartCheckpoint();closeOverlay()};document.getElementById('restartLevel').onclick=()=>{resetState();closeOverlay();updateObjective();say('Fresh start. Reach the signal console.')};
  }
  function restartCheckpoint(){const saved=loadSave();if(saved)applySave(saved);else resetState();last=performance.now()}

  function updateObjective(){
    if(state.chapter==='station'){
      const p=state.stationPhase;
      if(p==='console')setObjective('Reach the signal console');
      else if(p==='reactor')setObjective('Hold ACTION at the reactor before the timer expires');
      else if(p==='drone')setObjective('Reach and recover the disabled research drone');
      else if(p==='charger')setObjective('Carry the drone to its charger');
      else if(p==='power')setObjective('Reach the power core and choose two systems');
      else if(p==='dishes')setObjective(`Align the observation dishes (${state.dishes.filter(Boolean).length}/3)`);
      else if(p==='reroute')setObjective('Hold ACTION at the lower-door reroute');
      else if(p==='hidden')setObjective('Enter the hidden calibration bay');
    }else{
      const p=state.planetPhase;
      if(p==='atmosphere')setObjective('Scan the atmosphere vent');
      else if(p==='mineral')setObjective('Cross the rift and scan the mineral node');
      else if(p==='growth')setObjective('Reach the strange growth');
      else if(p==='tracks')setObjective(`Find the three unusual tracks (${state.tracks.filter(Boolean).length}/3)`);
      else if(p==='cave')setObjective('Reach Echo Cave');
      else if(p==='complete')setObjective('Level complete');
    }
  }

  function activeTargets(){
    if(state.chapter==='station'){
      const p=state.stationPhase;
      if(p==='console')return [stationTargets.console];if(p==='reactor')return [stationTargets.reactor];if(p==='drone')return [stationTargets.drone];if(p==='charger')return [stationTargets.charger];if(p==='power')return [stationTargets.power];
      if(p==='dishes')return [stationTargets.dish1,stationTargets.dish2,stationTargets.dish3].filter((_,i)=>!state.dishes[i]);
      if(p==='reroute')return [stationTargets.reroute];if(p==='hidden')return [stationTargets.hidden];return [];
    }
    const p=state.planetPhase;
    if(p==='atmosphere')return [planetTargets.atmosphere];if(p==='mineral')return [planetTargets.mineral];if(p==='growth')return [planetTargets.growth];
    if(p==='tracks')return [planetTargets.track1,planetTargets.track2,planetTargets.track3].filter((_,i)=>!state.tracks[i]);if(p==='cave')return [planetTargets.cave];return [];
  }
  function updateNear(){
    nearTarget=activeTargets().map(t=>({t,d:Math.hypot(player.x-t.x,player.y-t.y)})).filter(v=>v.d<v.t.r+34).sort((a,b)=>a.d-b.d)[0]?.t||null;
    actionBtn.classList.toggle('ready',!!nearTarget); actionBtn.querySelector('b').textContent=nearTarget?((state.stationPhase==='reactor'||state.stationPhase==='reroute')?'HOLD':state.chapter==='planet'?'SCAN':'ACTION'):'ACTION';
  }

  function interact(){
    if(!running||paused||!nearTarget)return;
    if(state.chapter==='station')interactStation(nearTarget);else interactPlanet(nearTarget);
  }
  function interactStation(t){
    if(t===stationTargets.console){
      addEvidence(1);addStars(80);state.stationPhase='reactor';state.reactorDeadline=performance.now()+42000;saveCheckpoint('Signal acquired');
      openOverlay(`<p class="kicker">SIGNAL EVENT // UNEXPECTED MOVEMENT</p><h2>The signal changed direction.</h2><p>That should not happen if we were only following a fixed beacon. At the same moment, the observatory power grid spikes.</p><div class="evidence-grid"><span>Direction shifted</span><span>Pulse rhythm remains stable</span><span>Station power falling</span><span>Source still unknown</span></div><button id="reactNow" class="primary" type="button">RUN TO THE REACTOR</button>`);
      document.getElementById('reactNow').onclick=()=>{closeOverlay();updateObjective();say('Reactor room, now. Hold ACTION at the core until the bypass locks.');beep(210,.2,.05,'square')};
    }else if(t===stationTargets.drone){state.droneCarried=true;state.stationPhase='charger';addStars(60);updateObjective();say('Drone secured. Carry it to the charger without crossing an active arc.');feedback(16)}
    else if(t===stationTargets.charger){state.droneCarried=false;state.droneRescued=true;state.stationPhase='power';addEvidence(1);addStars(90);saveCheckpoint('Drone rescued');updateObjective();toastMsg('Drone online.','Its last recording contains the same moving pulse.');say('Good rescue. Next problem: the station cannot power everything.')}
    else if(t===stationTargets.power)showPowerChoice();
    else if(t===stationTargets.dish1)showDishPuzzle(0);else if(t===stationTargets.dish2)showDishPuzzle(1);else if(t===stationTargets.dish3)showDishPuzzle(2);
    else if(t===stationTargets.hidden)finishStation();
  }

  function showPowerChoice(){
    const systems=[['scanner','SCANNER','Sharper signal lock and easier dish calibration.'],['doors','DOORS','Keeps lower observatory access online.'],['comms','COMMS','Keeps transmission and drone telemetry stable.']];
    openOverlay(`<p class="kicker">POWER CRISIS // CHOOSE TWO</p><h2>One system has to go dark.</h2><p>Your choice changes the rest of the mission.</p><div class="system-grid">${systems.map(s=>`<button class="choice system-choice" data-v="${s[0]}" type="button"><b>${s[1]}</b><small>${s[2]}</small></button>`).join('')}</div><button id="confirmPower" class="primary" type="button" disabled>CONFIRM POWER ROUTE</button>`,true);
    const picks=new Set(state.power);const buttons=[...panel.querySelectorAll('.system-choice')],confirm=document.getElementById('confirmPower');
    const sync=()=>{buttons.forEach(b=>b.classList.toggle('selected',picks.has(b.dataset.v)));confirm.disabled=picks.size!==2};sync();
    buttons.forEach(b=>b.onclick=()=>{const v=b.dataset.v;if(picks.has(v))picks.delete(v);else if(picks.size<2)picks.add(v);sync();beep(540+picks.size*90,.05)});
    confirm.onclick=()=>{state.power=[...picks];state.stationPhase='dishes';addStars(100);saveCheckpoint('Power routed');closeOverlay();updateObjective();say(state.power.includes('scanner')?'Scanner power is stable. Find and align all three dishes.':'Scanner is on backup power. Dish alignment will be less forgiving.');chord()};
  }

  function showDishPuzzle(index){
    const targets=[31,68,46], target=targets[index], starts=[78,18,84];const tolerance=state.power.includes('scanner')?7:4;
    openOverlay(`<p class="kicker">OBSERVATION ARRAY // DISH ${String.fromCharCode(65+index)}</p><h2>Rotate until the pulse locks.</h2><p>Use the signal strength, not a guessed answer.</p><div class="range-wrap"><strong><span>ROTATION</span><span id="dishValue">${starts[index]}°</span></strong><input id="dishRange" type="range" min="0" max="100" value="${starts[index]}"><div class="signal-gauge"><i id="signalFill"></i></div></div><button id="lockDish" class="primary" type="button" disabled>LOCK DISH</button>`);
    const range=document.getElementById('dishRange'),val=document.getElementById('dishValue'),fill=document.getElementById('signalFill'),lock=document.getElementById('lockDish');
    const sync=()=>{const v=Number(range.value),diff=Math.abs(v-target),strength=Math.max(0,100-diff*2.2);val.textContent=v+'°';fill.style.width=strength+'%';lock.disabled=diff>tolerance;if(diff<=tolerance)beep(920,.035,.012)};range.oninput=sync;sync();
    lock.onclick=()=>{state.dishes[index]=true;addEvidence(1);addStars(70);closeOverlay();if(state.dishes.every(Boolean)){state.stationPhase=state.power.includes('doors')?'hidden':'reroute';saveCheckpoint('Signal triangulated');say(state.power.includes('doors')?'Triangulation complete. The lower bay just unlocked.':'Triangulation complete — but the lower doors are dark. We need a manual reroute.')}else say(`${state.dishes.filter(Boolean).length} of 3 dishes locked. Keep moving.`);updateObjective();chord()};
  }

  function finishStation(){
    state.stationComplete=true;addEvidence(2);addStars(160);saveCheckpoint('Destination found');
    openOverlay(`<div class="cinematic"><p class="kicker">MISSION 1 COMPLETE // SIGNAL TRIANGULATED</p><h2>The pulse points to one world.</h2><div class="pulse-line"></div><div class="planet-reveal"></div><p>Three dishes agree on the same destination. That proves where the signal is pointing — <b>not</b> what created it.</p><div class="evidence-grid"><span>Destination: confirmed</span><span>Life-form: not confirmed</span><span>Drone data: matching pulse</span><span>Next step: direct observation</span></div><button id="launchPlanet" class="primary" type="button">LAUNCH TO ECHO PLANET</button></div>`,true);
    document.getElementById('launchPlanet').onclick=()=>{state.chapter='planet';state.planetPhase='atmosphere';player.x=230;player.y=1190;player.suit=100;state.checkpoint='Echo landing';saveCheckpoint('Echo landing');syncHud();closeOverlay();updateObjective();say('Low gravity confirmed. Stay curious and keep your conclusions smaller than your evidence.');chord()};
  }

  function interactPlanet(t){
    if(t===planetTargets.atmosphere){state.atmosphere=true;state.planetPhase='mineral';addEvidence(1);addStars(70);saveCheckpoint('Atmosphere sampled');updateObjective();toastMsg('Atmosphere sample:','thin air, metallic dust, strong temperature swings.');say('Earth animals would struggle here. Jump while moving to cross the dark rift.');chord()}
    else if(t===planetTargets.mineral){state.mineral=true;state.planetPhase='growth';addEvidence(1);addStars(80);saveCheckpoint('Mineral pulse found');updateObjective();toastMsg('Mineral node:','the same pulse travels through conductive crystal veins.');say('Natural minerals might carry the signal. That gives us another explanation to test.')}
    else if(t===planetTargets.growth){state.growth=true;state.planetPhase='tracks';addEvidence(1);addStars(100);saveCheckpoint('Reactive growth');updateObjective();openOverlay(`<p class="kicker">BIOLOGY QUESTION // REACTIVE GROWTH</p><h2>It reacts. That does not automatically mean it is alive.</h2><div class="evidence-grid"><span>Closes when shadow passes</span><span>Contains water-rich gel</span><span>Anchored to warm mineral seam</span><span>No free movement observed</span></div><p class="science-note">Nearby surface marks may help us separate biology from chemistry or mechanics.</p><button id="followMarks" class="primary" type="button">FOLLOW THE MARKS</button>`);document.getElementById('followMarks').onclick=()=>{closeOverlay();say('Three unusual tracks are spread across the surface. Find them in any order.')}}
    else if(t===planetTargets.track1)scanTrack(0);else if(t===planetTargets.track2)scanTrack(1);else if(t===planetTargets.track3)scanTrack(2);else if(t===planetTargets.cave)openCreatureBuilder();
  }

  function scanTrack(i){
    if(state.tracks[i])return;state.tracks[i]=true;addEvidence(1);addStars(55);feedback(12);toastMsg(`Track ${String.fromCharCode(65+i)}:`,['two-direction pressure marks unlike nearby wind streaks.','spacing changes as if the source changed speed or stride.','fresh dust partly covers the trail beside the cave.'][i]);
    if(state.tracks.every(Boolean)){state.planetPhase='cave';saveCheckpoint('Trail complete');updateObjective();say('All three marks point toward Echo Cave. Suit lights on.')}else{updateObjective();say(`${state.tracks.filter(Boolean).length} of 3 tracks recorded. Keep comparing, not guessing.`)}
  }

  function openCreatureBuilder(){
    state.cave=true;addEvidence(1);
    openOverlay(`<p class="kicker">ECHO CAVE // LIFE HYPOTHESIS</p><h2>Build a creature that fits the planet.</h2><p>You are building a scientific model, not claiming this is what lives here.</p><div class="trait-grid" data-group="body"><button class="choice trait" data-g="body" data-v="spring" type="button"><b>Spring-like limbs</b><small>Low gravity could allow long controlled movement.</small></button><button class="choice trait" data-g="body" data-v="heavy" type="button"><b>Heavy body</b><small>Stable, but expensive to move.</small></button><button class="choice trait" data-g="body" data-v="float" type="button"><b>Float sacs</b><small>Would need a denser atmosphere for lift.</small></button></div><div class="trait-grid"><button class="choice trait" data-g="surface" data-v="shell" type="button"><b>Dust-sealing shell</b><small>Protects against abrasive mineral storms.</small></button><button class="choice trait" data-g="surface" data-v="fur" type="button"><b>Loose fur</b><small>Warm, but traps metallic dust.</small></button><button class="choice trait" data-g="surface" data-v="wet" type="button"><b>Wet skin</b><small>Could lose water quickly in thin air.</small></button></div><div class="trait-grid"><button class="choice trait" data-g="sense" data-v="vibration" type="button"><b>Vibration sensing</b><small>Useful in dark conductive caves.</small></button><button class="choice trait" data-g="sense" data-v="bright" type="button"><b>Bright-colour vision</b><small>Less useful in darkness.</small></button><button class="choice trait" data-g="sense" data-v="pressure" type="button"><b>Pressure hearing</b><small>Possible, but thin air changes sound travel.</small></button></div><button id="buildModel" class="primary" type="button" disabled>BUILD HYPOTHESIS</button>`,true);
    const selected={},cards=[...panel.querySelectorAll('.trait')],build=document.getElementById('buildModel');
    cards.forEach(card=>card.onclick=()=>{selected[card.dataset.g]=card.dataset.v;cards.filter(c=>c.dataset.g===card.dataset.g).forEach(c=>c.classList.toggle('selected',c===card));build.disabled=Object.keys(selected).length!==3;beep(560+Object.keys(selected).length*100,.05)});
    build.onclick=()=>showCreatureResult(selected);
  }

  function showCreatureResult(sel){
    let fit=0;if(sel.body==='spring')fit++;if(sel.surface==='shell')fit++;if(sel.sense==='vibration')fit++;state.creatureBuilt=true;addStars(120+fit*50);state.planetPhase='complete';saveCheckpoint('Echo hypothesis complete');
    panel.innerHTML=`<p class="kicker">MODEL COMPLETE // ${fit===3?'STRONG ENVIRONMENTAL FIT':'TESTABLE HYPOTHESIS'}</p><h2>Your model explains ${fit} of 3 major conditions well.</h2><div class="silhouette-reveal" aria-label="A distant unidentified shape moves at the back of Echo Cave"></div><p>Then something moves across the far cave opening.</p><div class="evidence-grid"><span>Movement: observed</span><span>Identity: unknown</span><span>Made the tracks: unknown</span><span>Created the signal: unknown</span></div><p class="science-note">The mystery just became more interesting — not more certain.</p><button id="finishLevel" class="primary" type="button">COMPLETE LEVEL 1</button>`;
    document.getElementById('finishLevel').onclick=completeLevel;
  }

  function completeLevel(){
    state.levelComplete=true;addStars(200);saveCheckpoint('Level 1 complete');
    panel.innerHTML=`<div class="cinematic"><p class="kicker">LEVEL 1 COMPLETE</p><h1>Unknown Signal Investigator</h1><p>You handled an emergency, rescued equipment, made a systems decision, triangulated a moving signal, crossed an alien world and kept your conclusions tied to evidence.</p><div class="end-badges"><span>📡 Signal Investigator</span><span>🛰 Systems Responder</span><span>🪐 Planet Explorer</span><span>🔬 Evidence Thinker</span></div><div class="buttons"><a class="primary" href="world-map.html" style="text-decoration:none;display:grid;place-items:center">RETURN TO ORISH'S WORLD</a><button id="replayLevel" class="secondary" type="button">REPLAY LEVEL</button></div></div>`;
    document.getElementById('replayLevel').onclick=()=>{resetState();closeOverlay();updateObjective();say('New run. Try a different power choice this time.')};chord();
  }

  function ability(){
    if(!running||paused)return;const now=performance.now();
    if(state.chapter==='station'){if(now<player.dashUntil)return;player.dashUntil=now+520;abilityBtn.classList.remove('ready');setTimeout(()=>abilityBtn.classList.add('ready'),900);beep(760,.07);feedback(8)}
    else{if(now<player.jumpUntil)return;player.jumpUntil=now+860;abilityBtn.classList.remove('ready');setTimeout(()=>abilityBtn.classList.add('ready'),1250);beep(820,.07);feedback(8)}
  }

  function stationCollision(nx,ny){return nx<45||ny<45||nx>stationWorld.w-45||ny>stationWorld.h-45}
  function planetCollision(nx,ny){
    if(nx<45||ny<45||nx>planetWorld.w-45||ny>planetWorld.h-45)return true;
    if(performance.now()>=player.jumpUntil&&planetGaps.some(g=>nx+player.r>g.x&&nx-player.r<g.x+g.w&&ny+player.r>g.y&&ny-player.r<g.y+g.h))return true;
    return false;
  }
  function move(dx,dy,dt){
    const len=Math.hypot(dx,dy)||1;let boost=1;if(performance.now()<player.dashUntil)boost=2.05;if(performance.now()<player.jumpUntil)boost=1.62;
    const nx=player.x+dx/len*player.speed*boost*dt,ny=player.y+dy/len*player.speed*boost*dt;const coll=state.chapter==='station'?stationCollision:planetCollision;
    if(!coll(nx,player.y))player.x=nx;if(!coll(player.x,ny))player.y=ny;if(Math.abs(dx)>.08)player.facing=dx>0?1:-1;
  }

  function stationHazardActive(h,time){return state.stationPhase!=='console'&&state.stationPhase!=='hidden'&&((time/900+h.o)%5)<2.05}
  function handleStationHazards(time){
    for(const h of stationHazards){if(!stationHazardActive(h,time))continue;const cx=Math.max(h.x,Math.min(player.x,h.x+h.w)),cy=Math.max(h.y,Math.min(player.y,h.y+h.h));if(Math.hypot(player.x-cx,player.y-cy)<player.r+16){damage(9);player.x-=42;break}}
  }
  function geyserActive(g,time){return ((time/1000+g.o)%6)<1.55}
  function stormActive(time){return state.atmosphere&&Math.sin(time/2600)>.72}
  function handlePlanetHazards(time,dt){
    const storm=stormActive(time);stormFilter.style.opacity=storm?'.55':'0';if(storm){player.x=Math.max(50,player.x-dt*42);if(Math.random()<.006)beep(170,.05,.007)}
    for(const g of geysers){if(geyserActive(g,time)&&Math.hypot(player.x-g.x,player.y-g.y)<g.r+30){damage(10);player.y-=48;break}}
  }

  function updateHold(dt){
    const holdPhase=state.chapter==='station'&&(state.stationPhase==='reactor'||state.stationPhase==='reroute');
    if(!holdPhase){meter.classList.remove('show');return}
    const target=state.stationPhase==='reactor'?stationTargets.reactor:stationTargets.reroute,near=Math.hypot(player.x-target.x,player.y-target.y)<target.r+38;
    let value=state.stationPhase==='reactor'?state.reactorRepair:state.reroute;
    if(near&&actionHeld){value=Math.min(1,value+dt*(state.stationPhase==='reactor'?.46:.38));actionBtn.classList.add('hold');meter.classList.add('show')}else{value=Math.max(0,value-dt*.12);actionBtn.classList.remove('hold');if(near)meter.classList.add('show');else meter.classList.remove('show')}
    meterFill.style.width=(value*100)+'%';
    if(state.stationPhase==='reactor')state.reactorRepair=value;else state.reroute=value;
    if(value>=1){
      actionHeld=false;actionBtn.classList.remove('hold');meter.classList.remove('show');chord();feedback(25);
      if(state.stationPhase==='reactor'){state.stationPhase='drone';state.reactorDeadline=0;addStars(state.reactorFailed?60:120);saveCheckpoint('Reactor stabilised');updateObjective();say('Bypass locked. Power is stable enough to move. The research drone is stranded ahead.')}
      else{state.stationPhase='hidden';addStars(100);saveCheckpoint('Lower door rerouted');updateObjective();say('Manual reroute complete. The hidden bay is open.')}
    }
  }

  function update(dt,time){
    let dx=inputX,dy=inputY;if(keys.has('ArrowUp')||keys.has('w'))dy-=1;if(keys.has('ArrowDown')||keys.has('s'))dy+=1;if(keys.has('ArrowLeft')||keys.has('a'))dx-=1;if(keys.has('ArrowRight')||keys.has('d'))dx+=1;if(dx||dy)move(dx,dy,dt);
    updateNear();updateHold(dt);
    if(state.chapter==='station'){
      if(state.stationPhase==='reactor'&&state.reactorDeadline){const left=Math.max(0,state.reactorDeadline-performance.now());setObjective(`Stabilise reactor — ${Math.ceil(left/1000)}s`);if(left<=0&&state.reactorRepair<1){state.reactorFailed=true;state.reactorDeadline=0;state.stationPhase='drone';saveCheckpoint('Reactor backup engaged');toastMsg('Reactor backup engaged.','The mission continues, but the station took damage.');say('We missed the bypass window. Backup power caught it — keep moving.');updateObjective()}}
      handleStationHazards(time);
    }else handlePlanetHazards(time,dt);
    const world=state.chapter==='station'?stationWorld:planetWorld;const tx=Math.max(0,Math.min(world.w-cssW,player.x-cssW*.5)),ty=Math.max(0,Math.min(world.h-cssH,player.y-cssH*.5));camera.x+=(tx-camera.x)*Math.min(1,dt*5.5);camera.y+=(ty-camera.y)*Math.min(1,dt*5.5);
    if(screenShake>0)screenShake=Math.max(0,screenShake-dt*34);
  }

  function beginWorld(){ctx.save();const sx=screenShake?(Math.random()-.5)*screenShake:0,sy=screenShake?(Math.random()-.5)*screenShake:0;ctx.translate(-camera.x+sx,-camera.y+sy)}
  function endWorld(){ctx.restore()}
  function drawTarget(t,active=true){
    if(!active)return;const pulse=1+Math.sin(performance.now()/180)*.08;ctx.save();ctx.translate(t.x,t.y);ctx.scale(pulse,pulse);ctx.fillStyle='rgba(105,243,229,.1)';ctx.strokeStyle='#69f3e5';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,34,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#f0ffff';ctx.font='900 19px system-ui';ctx.textAlign='center';ctx.fillText(t.glyph,0,7);ctx.restore();
  }
  function drawPlayer(time){
    const moving=Math.hypot(inputX,inputY)>.08||['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d'].some(k=>keys.has(k)),jumping=performance.now()<player.jumpUntil,dashing=performance.now()<player.dashUntil;const bob=moving?Math.sin(time/(dashing?45:85))*3:0,lift=jumping?22*Math.sin(Math.PI*Math.max(0,1-(player.jumpUntil-performance.now())/860)):0;
    ctx.save();ctx.translate(player.x,player.y);ctx.fillStyle='rgba(0,0,0,.38)';ctx.beginPath();ctx.ellipse(0,24,30-(jumping?6:0),10-(jumping?2:0),0,0,Math.PI*2);ctx.fill();ctx.strokeStyle=dashing||jumping?'#ffd96a':'rgba(105,243,229,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-lift,36+Math.sin(time/190)*2,0,Math.PI*2);ctx.stroke();
    if(sprite.complete&&sprite.naturalWidth){const h=104,ratio=Math.max(.46,Math.min(1.05,sprite.naturalWidth/sprite.naturalHeight)),w=h*ratio;ctx.save();ctx.translate(0,-lift+bob);ctx.scale(player.facing,1);ctx.rotate(moving?Math.sin(time/120)*.025:0);ctx.drawImage(sprite,-w/2,-h+26,w,h);ctx.restore()}else{ctx.fillStyle='#69f3e5';ctx.beginPath();ctx.arc(0,-lift,20,0,Math.PI*2);ctx.fill()}
    if(state.droneCarried){ctx.fillStyle='#ffd96a';ctx.strokeStyle='#69f3e5';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(0,-96-lift,24,14,0,0,Math.PI*2);ctx.fill();ctx.stroke()}ctx.restore();
  }

  function drawStation(time){
    const bg=ctx.createLinearGradient(0,0,0,cssH);bg.addColorStop(0,'#020817');bg.addColorStop(1,'#071a2e');ctx.fillStyle=bg;ctx.fillRect(0,0,cssW,cssH);
    ctx.save();ctx.translate(-camera.x*.12,-camera.y*.06);for(const s of starField){ctx.globalAlpha=s.a+.12*Math.sin(time/600+s.x);ctx.fillStyle=s.s>2?'#ffe7a8':'#b8f7ff';ctx.beginPath();ctx.arc(s.x,s.y,s.s,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;ctx.restore();
    beginWorld();
    const floor=ctx.createLinearGradient(0,0,stationWorld.w,stationWorld.h);floor.addColorStop(0,'#07192b');floor.addColorStop(.5,'#0a2741');floor.addColorStop(1,'#09162a');ctx.fillStyle=floor;ctx.fillRect(0,0,stationWorld.w,stationWorld.h);
    ctx.strokeStyle='rgba(101,221,231,.075)';ctx.lineWidth=1;for(let x=0;x<stationWorld.w;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,stationWorld.h);ctx.stroke()}for(let y=0;y<stationWorld.h;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(stationWorld.w,y);ctx.stroke()}
    const rooms=[['ENTRY',70,760,430,410],['SIGNAL LAB',380,90,500,370],['REACTOR',420,800,570,370],['DRONE BAY',1040,120,520,430],['SYSTEMS',1260,700,510,390],['ARRAY',1710,110,520,680],['LOWER BAY',1850,860,390,300]];
    rooms.forEach((r,i)=>{ctx.fillStyle=i%2?'rgba(10,42,65,.38)':'rgba(6,31,51,.45)';ctx.strokeStyle='rgba(105,243,229,.13)';ctx.lineWidth=2;ctx.fillRect(r[1],r[2],r[3],r[4]);ctx.strokeRect(r[1],r[2],r[3],r[4]);ctx.fillStyle='rgba(167,220,229,.5)';ctx.font='800 14px system-ui';ctx.fillText(r[0],r[1]+18,r[2]+26)});
    stationHazards.forEach(h=>{const active=stationHazardActive(h,time);ctx.globalAlpha=active?.95:.16;ctx.strokeStyle=active?'#8df8ff':'#315d70';ctx.lineWidth=active?5:2;ctx.beginPath();ctx.moveTo(h.x,h.y);for(let x=0;x<=h.w;x+=14)ctx.lineTo(h.x+x,h.y+(Math.sin(time/40+x)*14*(active?1:.25)));ctx.stroke();ctx.globalAlpha=1});
    const active=activeTargets();active.forEach(t=>drawTarget(t,true));
    if(!state.droneRescued&&!state.droneCarried){const d=stationTargets.drone;ctx.save();ctx.translate(d.x,d.y+Math.sin(time/260)*7);ctx.fillStyle='#0b2f49';ctx.strokeStyle='#ffd96a';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,0,34,21,0,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle='#69f3e5';ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();ctx.restore()}
    [stationTargets.dish1,stationTargets.dish2,stationTargets.dish3].forEach((d,i)=>{ctx.save();ctx.translate(d.x,d.y);ctx.strokeStyle=state.dishes[i]?'#69f3e5':'#526f82';ctx.lineWidth=5;ctx.beginPath();ctx.arc(0,0,46,.15,Math.PI-.15);ctx.stroke();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(0,64);ctx.stroke();ctx.restore()});
    drawPlayer(time);endWorld();
  }

  function drawPlanet(time){
    const sky=ctx.createLinearGradient(0,0,0,cssH);sky.addColorStop(0,'#090c2a');sky.addColorStop(.48,'#31225a');sky.addColorStop(1,'#5b3d68');ctx.fillStyle=sky;ctx.fillRect(0,0,cssW,cssH);
    ctx.save();ctx.translate(-camera.x*.08,-camera.y*.03);for(const s of starField){ctx.globalAlpha=s.a;ctx.fillStyle='#e8e6ff';ctx.beginPath();ctx.arc(s.x,s.y,s.s,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;ctx.fillStyle='#8d79c9';ctx.beginPath();ctx.arc(cssW*.82,120,82,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,217,106,.65)';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(cssW*.82,120,118,28,-.15,0,Math.PI*2);ctx.stroke();ctx.restore();
    beginWorld();const ground=ctx.createLinearGradient(0,0,planetWorld.w,planetWorld.h);ground.addColorStop(0,'#3b315d');ground.addColorStop(.5,'#5a426e');ground.addColorStop(1,'#263b59');ctx.fillStyle=ground;ctx.fillRect(0,0,planetWorld.w,planetWorld.h);
    planetGaps.forEach(g=>{const gr=ctx.createLinearGradient(g.x,g.y,g.x+g.w,g.y+g.h);gr.addColorStop(0,'#080914');gr.addColorStop(.5,'#010207');gr.addColorStop(1,'#17102d');ctx.fillStyle=gr;ctx.fillRect(g.x,g.y,g.w,g.h);ctx.strokeStyle='rgba(202,152,255,.28)';ctx.lineWidth=3;ctx.strokeRect(g.x,g.y,g.w,g.h)});
    planetRocks.forEach(r=>{ctx.fillStyle=['#6d5487','#667383','#857a49'][r.c];ctx.beginPath();ctx.moveTo(r.x,r.y-r.r);ctx.lineTo(r.x+r.r,r.y+r.r*.7);ctx.lineTo(r.x-r.r*.9,r.y+r.r*.8);ctx.closePath();ctx.fill()});
    geysers.forEach(g=>{const active=geyserActive(g,time);ctx.save();ctx.translate(g.x,g.y);ctx.fillStyle='#4b3a61';ctx.beginPath();ctx.ellipse(0,0,44,20,0,0,Math.PI*2);ctx.fill();if(active){ctx.fillStyle='rgba(173,255,241,.7)';ctx.beginPath();ctx.moveTo(-16,0);ctx.quadraticCurveTo(0,-130-Math.sin(time/80)*20,16,0);ctx.closePath();ctx.fill()}ctx.restore()});
    if(!state.growth){const t=planetTargets.growth;ctx.save();ctx.translate(t.x,t.y);ctx.fillStyle='#3c8a71';ctx.strokeStyle='#a0f7ce';ctx.lineWidth=2;for(let i=0;i<6;i++){ctx.beginPath();ctx.ellipse((i-2.5)*11,-Math.abs(i-2.5)*5,12,34,(i-2.5)*.16,0,Math.PI*2);ctx.fill();ctx.stroke()}ctx.restore()}
    [planetTargets.track1,planetTargets.track2,planetTargets.track3].forEach((t,i)=>{if(state.tracks[i])return;ctx.fillStyle='rgba(255,228,166,.55)';ctx.beginPath();ctx.ellipse(t.x-8,t.y,8,15,-.3,0,Math.PI*2);ctx.ellipse(t.x+9,t.y+7,8,15,.3,0,Math.PI*2);ctx.fill()});
    const c=planetTargets.cave;ctx.save();ctx.translate(c.x,c.y);ctx.fillStyle='#03050d';ctx.beginPath();ctx.ellipse(0,0,78,105,0,Math.PI,Math.PI*2);ctx.lineTo(78,65);ctx.lineTo(-78,65);ctx.closePath();ctx.fill();ctx.strokeStyle='#8569b9';ctx.lineWidth=5;ctx.stroke();ctx.restore();
    activeTargets().forEach(t=>drawTarget(t,true));drawPlayer(time);endWorld();
  }

  function render(time){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,cssW,cssH);if(state.chapter==='station')drawStation(time);else drawPlanet(time)}
  function loop(time){const dt=Math.min(.04,(time-last)/1000||0);last=time;if(running&&!paused)update(dt,time);render(time);requestAnimationFrame(loop)}

  function resetStick(){inputX=inputY=0;stick.style.transform='translate(0px,0px)'}
  function joyMove(e){if(joyPointer!==e.pointerId)return;const r=joystick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,max=r.width*.34,dx=e.clientX-cx,dy=e.clientY-cy,len=Math.hypot(dx,dy)||1,mag=Math.min(max,len),nx=dx/len,ny=dy/len;inputX=nx*(mag/max);inputY=ny*(mag/max);stick.style.transform=`translate(${nx*mag}px,${ny*mag}px)`}
  joystick.addEventListener('pointerdown',e=>{e.preventDefault();joyPointer=e.pointerId;joystick.setPointerCapture?.(e.pointerId);joyMove(e)});
  joystick.addEventListener('pointermove',joyMove);
  const joyEnd=e=>{if(joyPointer!==e.pointerId)return;joyPointer=null;resetStick()};joystick.addEventListener('pointerup',joyEnd);joystick.addEventListener('pointercancel',joyEnd);

  actionBtn.addEventListener('pointerdown',e=>{e.preventDefault();actionHeld=true;actionPressAt=performance.now();actionBtn.setPointerCapture?.(e.pointerId)});
  actionBtn.addEventListener('pointerup',e=>{e.preventDefault();const held=performance.now()-actionPressAt;actionHeld=false;actionBtn.classList.remove('hold');if(held<340)interact()});
  actionBtn.addEventListener('pointercancel',()=>{actionHeld=false;actionBtn.classList.remove('hold')});
  abilityBtn.addEventListener('click',ability);pauseBtn.addEventListener('click',()=>{if(running)showPause()});soundBtn.addEventListener('click',()=>{soundOn=!soundOn;soundBtn.textContent=soundOn?'♫':'×';if(soundOn)beep(700,.05)});
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' ','Shift'].includes(e.key))e.preventDefault();if(e.key===' '&&!overlayOpen)interact();else if(e.key==='Shift'&&!overlayOpen)ability();else keys.add(e.key)});
  document.addEventListener('keyup',e=>keys.delete(e.key));
  function clearInput(){keys.clear();resetStick();actionHeld=false}addEventListener('blur',clearInput);document.addEventListener('visibilitychange',()=>{if(document.hidden)clearInput()});

  syncHud();showIntro();requestAnimationFrame(loop);
})();
(() => {
  'use strict';

  const canvas = document.getElementById('stationCanvas');
  const ctx = canvas.getContext('2d');
  const intro = document.getElementById('missionIntro');
  const begin = document.getElementById('beginV2');
  const action = document.getElementById('actionButton');
  const eventLayer = document.getElementById('eventLayer');
  const eventCard = document.getElementById('eventCard');
  const objectiveNode = document.getElementById('missionObjective');
  const powerNode = document.getElementById('powerValue');
  const signalNode = document.getElementById('signalValue');
  const evidenceNode = document.getElementById('evidenceValue');
  const orishText = document.getElementById('orishText');
  const soundButton = document.getElementById('soundButton');

  const W = 1280, H = 720;
  const keys = new Set();
  const player = { x: 135, y: 565, r: 18, speed: 245, facing: 1 };
  const orishImage = new Image();
  orishImage.src = 'assets/orish-approved-hq.webp';

  let running = false;
  let paused = false;
  let last = 0;
  let soundOn = true;
  let audio = null;
  let nearTarget = null;
  let signalT = 0;
  let flash = 0;
  let shake = 0;

  const state = {
    phase: 'reach-console',
    evidence: 0,
    powerChoice: [],
    dishLocked: [false, false, false],
    doorOpen: false,
    rerouteDone: false,
    complete: false
  };

  const walls = [
    {x:0,y:0,w:1280,h:34},{x:0,y:686,w:1280,h:34},{x:0,y:0,w:34,h:720},{x:1246,y:0,w:34,h:720},
    {x:260,y:34,w:34,h:210},{x:260,y:345,w:34,h:341},
    {x:560,y:34,w:34,h:130},{x:560,y:265,w:34,h:421},
    {x:870,y:34,w:34,h:235},{x:870,y:385,w:34,h:301},
    {x:294,y:250,w:170,h:28},{x:640,y:340,w:170,h:28},{x:945,y:255,w:230,h:28}
  ];

  const targets = {
    signalConsole: {x:420,y:115,r:55,label:'SIGNAL CONSOLE'},
    dish1: {x:690,y:130,r:52,label:'DISH A'},
    dish2: {x:1080,y:145,r:52,label:'DISH B'},
    dish3: {x:760,y:530,r:52,label:'DISH C'},
    lowerDoor: {x:1090,y:520,r:60,label:'LOWER OBSERVATORY'},
    hiddenArray: {x:1170,y:590,r:55,label:'CALIBRATION ARRAY'}
  };

  function setObjective(text) { objectiveNode.textContent = text; }
  function say(text) { orishText.textContent = text; }
  function setSignal(text) { signalNode.textContent = text; }
  function setPower(text) { powerNode.textContent = text; }
  function setEvidence(value) { state.evidence = value; evidenceNode.textContent = `${value} / 3`; }

  function beep(freq = 520, duration = .08) {
    if (!soundOn) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audio ||= new Ctx();
      if (audio.state === 'suspended') audio.resume();
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = freq; g.gain.value = .035;
      g.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
      o.connect(g).connect(audio.destination); o.start(); o.stop(audio.currentTime + duration);
    } catch (_) {}
  }

  function collides(x, y) {
    return walls.some(w => x + player.r > w.x && x - player.r < w.x + w.w && y + player.r > w.y && y - player.r < w.y + w.h);
  }

  function move(dx, dy, dt) {
    const len = Math.hypot(dx, dy) || 1;
    const nx = player.x + dx / len * player.speed * dt;
    const ny = player.y + dy / len * player.speed * dt;
    if (!collides(nx, player.y)) player.x = nx;
    if (!collides(player.x, ny)) player.y = ny;
    if (dx) player.facing = dx > 0 ? 1 : -1;
  }

  function activeTargets() {
    if (state.phase === 'reach-console') return [targets.signalConsole];
    if (state.phase === 'triangulate') {
      return [targets.dish1, targets.dish2, targets.dish3].filter((_, i) => !state.dishLocked[i]);
    }
    if (state.phase === 'lower-door') return [targets.lowerDoor];
    if (state.phase === 'hidden-array') return [targets.hiddenArray];
    return [];
  }

  function updateNearTarget() {
    const candidates = activeTargets();
    nearTarget = candidates
      .map(t => ({t, d: Math.hypot(player.x - t.x, player.y - t.y)}))
      .filter(item => item.d < item.t.r + 28)
      .sort((a,b)=>a.d-b.d)[0]?.t || null;
    action.classList.toggle('ready', Boolean(nearTarget));
    action.querySelector('b').textContent = nearTarget ? nearTarget.label : 'ACTION';
  }

  function interact() {
    if (!running || paused || !nearTarget) return;
    if (nearTarget === targets.signalConsole) inspectSignalConsole();
    else if (nearTarget === targets.dish1) openDish(0);
    else if (nearTarget === targets.dish2) openDish(1);
    else if (nearTarget === targets.dish3) openDish(2);
    else if (nearTarget === targets.lowerDoor) handleDoor();
    else if (nearTarget === targets.hiddenArray) revealArray();
  }

  function inspectSignalConsole() {
    beep(760,.12); setEvidence(1); setSignal('MOVING'); flash = 1; shake = 1;
    say('That changed. The signal is no longer coming from the same direction — and the station just lost main power.');
    setObjective('Protect two critical systems');
    openPowerCrisis();
  }

  function showEvent(html) {
    paused = true;
    keys.clear();
    eventCard.innerHTML = html;
    eventLayer.hidden = false;
  }

  function closeEvent() {
    eventLayer.hidden = true;
    eventCard.innerHTML = '';
    paused = false;
    last = performance.now();
  }

  function openPowerCrisis() {
    showEvent(`
      <p class="kicker">EMERGENCY // MAIN POWER FAILURE</p>
      <h2>You can only keep two systems online.</h2>
      <p>The surge damaged the station grid. Choose what to protect. The system you leave off will create a different problem later.</p>
      <div class="system-grid">
        <button class="system-card" type="button" data-system="scanner"><b>◎ SCANNER</b><small>Keeps dish readings precise.</small></button>
        <button class="system-card" type="button" data-system="doors"><b>▣ LOWER DOORS</b><small>Keeps access to the lower observatory.</small></button>
        <button class="system-card" type="button" data-system="comms"><b>◉ COMMS</b><small>Keeps full Orish guidance online.</small></button>
      </div>
      <p id="powerChoiceStatus">Choose 2 systems.</p>
      <button id="confirmPowerV2" class="event-primary" type="button" disabled>ROUTE EMERGENCY POWER</button>
    `);
    const picked = new Set();
    const buttons = [...eventCard.querySelectorAll('[data-system]')];
    const confirm = document.getElementById('confirmPowerV2');
    const status = document.getElementById('powerChoiceStatus');
    buttons.forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.system;
      if (picked.has(id)) picked.delete(id);
      else if (picked.size < 2) picked.add(id);
      else return;
      buttons.forEach(b => b.classList.toggle('selected', picked.has(b.dataset.system)));
      confirm.disabled = picked.size !== 2;
      status.textContent = picked.size === 2 ? `Protected: ${[...picked].join(' + ')}` : `Choose ${2-picked.size} more.`;
      beep(420 + picked.size * 120,.07);
    }));
    confirm.addEventListener('click', () => {
      state.powerChoice = [...picked];
      setPower(state.powerChoice.includes('scanner') ? '68%' : '54%');
      const lost = ['scanner','doors','comms'].find(id => !picked.has(id));
      if (lost === 'scanner') say('Scanner precision is reduced. You will have to align the dishes manually with less margin for error.');
      if (lost === 'doors') say('The lower doors are offline. If the signal leads down there, we will need another way in.');
      if (lost === 'comms') say('Full comms are down. I can still guide you on screen — keep moving.');
      state.phase = 'triangulate';
      setObjective('Reach and align all three dishes');
      closeEvent();
    });
  }

  function openDish(index) {
    const names = ['A','B','C'];
    const targetValues = state.powerChoice.includes('scanner') ? [28,71,43] : [34,65,49];
    const tolerance = state.powerChoice.includes('scanner') ? 5 : 3;
    showEvent(`
      <p class="kicker">DISH ${names[index]} // MANUAL ALIGNMENT</p>
      <h2>Find the strongest lock.</h2>
      <p>Move the dish slowly. When the reading rises above 85%, lock it. ${state.powerChoice.includes('scanner') ? 'Scanner assist is online.' : 'Scanner assist is weak — the lock window is narrow.'}</p>
      <div class="dish-list"><div class="dish-row" id="dishRowV2"><strong><span>DISH ${names[index]}</span><span id="dishStrengthV2">0% signal</span></strong><input id="dishSliderV2" type="range" min="0" max="100" value="50" aria-label="Dish alignment"><button id="dishLockV2" class="dish-lock" type="button" disabled>LOCK DISH ${names[index]}</button></div></div>
    `);
    const slider = document.getElementById('dishSliderV2');
    const strength = document.getElementById('dishStrengthV2');
    const lock = document.getElementById('dishLockV2');
    const row = document.getElementById('dishRowV2');
    const update = () => {
      const distance = Math.abs(Number(slider.value) - targetValues[index]);
      const score = Math.max(0, Math.min(100, Math.round(100 - distance * 4.2)));
      strength.textContent = `${score}% signal`;
      const ready = distance <= tolerance;
      lock.disabled = !ready;
      row.classList.toggle('ready', ready);
      if (ready) beep(880,.04);
    };
    slider.addEventListener('input', update);
    lock.addEventListener('click', () => {
      state.dishLocked[index] = true;
      row.classList.add('locked');
      beep(1040,.15);
      const count = state.dishLocked.filter(Boolean).length;
      setEvidence(Math.min(3, 1 + Math.ceil(count * 2 / 3)));
      if (count < 3) {
        say(`Dish ${names[index]} locked. ${3-count} dish${3-count===1?'':'es'} still disagree with the moving signal.`);
        setObjective(`Align ${3-count} more dish${3-count===1?'':'es'}`);
        closeEvent();
      } else {
        setSignal('SOURCE BELOW');
        say('All three dishes agree. The strongest pulse is coming from below the observatory.');
        state.phase = 'lower-door';
        setObjective('Reach the lower observatory door');
        closeEvent();
      }
    });
    update();
  }

  function handleDoor() {
    if (state.powerChoice.includes('doors')) {
      state.doorOpen = true;
      state.phase = 'hidden-array';
      setObjective('Enter the hidden calibration bay');
      say('Lower doors are powered. The source trace continues into a sealed calibration bay.');
      beep(620,.18);
      return;
    }
    showEvent(`
      <p class="kicker">ACCESS FAILURE // LOWER DOOR</p>
      <h2>Your earlier choice changed the mission.</h2>
      <p>The lower doors were not protected during the power failure. Reroute just enough emergency current to open them without overloading the circuit.</p>
      <div class="dish-list"><div class="dish-row"><strong><span>EMERGENCY CURRENT</span><span id="rerouteStatusV2">too low</span></strong><input id="rerouteSliderV2" type="range" min="0" max="100" value="20" aria-label="Emergency current"><button id="rerouteButtonV2" class="dish-lock" type="button" disabled>OPEN LOWER DOOR</button></div></div>
    `);
    const slider = document.getElementById('rerouteSliderV2');
    const status = document.getElementById('rerouteStatusV2');
    const button = document.getElementById('rerouteButtonV2');
    const update = () => {
      const v = Number(slider.value), safe = v >= 64 && v <= 76;
      status.textContent = safe ? 'stable window' : v < 64 ? 'too low' : 'overload risk';
      button.disabled = !safe;
    };
    slider.addEventListener('input', update);
    button.addEventListener('click', () => {
      state.rerouteDone = true; state.doorOpen = true; state.phase = 'hidden-array';
      setObjective('Enter the hidden calibration bay');
      say('Emergency reroute worked. Door open. The signal is strongest just beyond it.');
      beep(760,.16); closeEvent();
    });
    update();
  }

  function revealArray() {
    state.complete = true; state.phase = 'complete'; setEvidence(3); setSignal('SOURCE UNKNOWN'); setObjective('Mission complete');
    showEvent(`
      <p class="kicker">HIDDEN CALIBRATION BAY // DISCOVERY</p>
      <h2>The evidence got stronger — but the answer did not get simpler.</h2>
      <p>An old deep-space calibration array is receiving the same repeating pulse. The direction is consistent now, but nothing here identifies the cause.</p>
      <div class="evidence-panel"><span>✓ Three dishes agree on direction</span><span>✓ Pulse intervals repeat</span><span>✓ It is not a fixed local beacon</span><strong>? Cause remains unknown</strong></div>
      <p>Good science stops where the evidence stops. “Unknown” is a valid conclusion.</p>
      <button id="finishMissionV2" class="event-primary" type="button">RETURN TO ORISH'S WORLD</button>
    `);
    document.getElementById('finishMissionV2').addEventListener('click', () => {
      closeEvent(); running = false; say('Mission complete. You found better evidence without pretending it proved more than it did.');
    });
  }

  function drawStation(time) {
    const grd = ctx.createLinearGradient(0,0,W,H); grd.addColorStop(0,'#041328'); grd.addColorStop(.5,'#09203c'); grd.addColorStop(1,'#071224'); ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
    const glow = ctx.createRadialGradient(980,120,20,980,120,390); glow.addColorStop(0,'rgba(92,235,229,.16)'); glow.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
    for(let x=40;x<W;x+=48){ctx.strokeStyle='rgba(88,169,210,.05)';ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
    for(let y=40;y<H;y+=48){ctx.strokeStyle='rgba(88,169,210,.05)';ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
    const rooms=[{x:46,y:52,w:198,h:590,name:'ENTRY'},{x:310,y:52,w:230,h:176,name:'SIGNAL LAB'},{x:310,y:305,w:230,h:353,name:'POWER CORE'},{x:610,y:52,w:238,h:255,name:'DISH CONTROL'},{x:610,y:395,w:238,h:263,name:'ARRAY CONTROL'},{x:920,y:52,w:300,h:180,name:'OBSERVATION'},{x:920,y:315,w:300,h:343,name:'LOWER ACCESS'}];
    rooms.forEach((r,i)=>{ctx.fillStyle=i%2?'rgba(8,31,55,.82)':'rgba(6,25,46,.84)';ctx.fillRect(r.x,r.y,r.w,r.h);ctx.strokeStyle='rgba(95,223,236,.16)';ctx.strokeRect(r.x+.5,r.y+.5,r.w-1,r.h-1);ctx.fillStyle='rgba(135,215,228,.42)';ctx.font='700 12px system-ui';ctx.fillText(r.name,r.x+12,r.y+22)});
    walls.forEach(w=>{ctx.fillStyle='#143653';ctx.fillRect(w.x,w.y,w.w,w.h);ctx.fillStyle='rgba(98,243,238,.12)';ctx.fillRect(w.x+4,w.y+4,Math.min(4,w.w-8),Math.max(0,w.h-8))});
    for(let i=0;i<18;i++){const sx=(i*173+77)%W,sy=(i*109+53)%220;ctx.fillStyle=i%3===0?'#fff0a8':'#9befff';ctx.globalAlpha=.3+.3*Math.sin(time/400+i);ctx.beginPath();ctx.arc(sx,sy,1.5,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
    drawConsole(targets.signalConsole,'◎',state.phase==='reach-console');
    drawConsole(targets.dish1,'A',state.phase==='triangulate'&&!state.dishLocked[0]);
    drawConsole(targets.dish2,'B',state.phase==='triangulate'&&!state.dishLocked[1]);
    drawConsole(targets.dish3,'C',state.phase==='triangulate'&&!state.dishLocked[2]);
    drawDoor();
    if(state.phase==='hidden-array'||state.phase==='complete')drawConsole(targets.hiddenArray,'?',true);
    drawMovingSignal(time);
  }

  function drawConsole(t, glyph, active) {
    ctx.save();ctx.translate(t.x,t.y);const pulse=active?1+Math.sin(performance.now()/190)*.08:1;ctx.scale(pulse,pulse);ctx.fillStyle=active?'rgba(98,243,238,.16)':'rgba(73,111,135,.11)';ctx.strokeStyle=active?'#62f3ee':'#496b7e';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,27,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.fillStyle=active?'#e9fffc':'#78909d';ctx.font='900 20px system-ui';ctx.textAlign='center';ctx.fillText(glyph,0,7);ctx.restore();
  }

  function drawDoor() {
    const x=targets.lowerDoor.x,y=targets.lowerDoor.y;ctx.save();ctx.translate(x,y);ctx.fillStyle=state.doorOpen?'rgba(101,238,228,.12)':'rgba(15,35,54,.95)';ctx.strokeStyle=state.phase==='lower-door'?'#ffd96a':'#4d7085';ctx.lineWidth=4;ctx.fillRect(-30,-45,60,90);ctx.strokeRect(-30,-45,60,90);ctx.fillStyle=state.doorOpen?'#65eee4':'#9ab3bf';ctx.font='900 10px system-ui';ctx.textAlign='center';ctx.fillText(state.doorOpen?'OPEN':'LOWER',0,4);ctx.restore();
  }

  function drawMovingSignal(time) {
    if(state.phase==='reach-console')return;signalT+=.012;const path=[[365,150],[800,130],[1120,165],[780,500],[1100,545]];const seg=Math.floor(signalT)%path.length,next=(seg+1)%path.length,f=signalT-Math.floor(signalT);const x=path[seg][0]+(path[next][0]-path[seg][0])*f,y=path[seg][1]+(path[next][1]-path[seg][1])*f;ctx.save();ctx.globalAlpha=.55+.35*Math.sin(time/120);ctx.strokeStyle='#ffd96a';ctx.lineWidth=2;for(let r=8;r<38;r+=10){ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke()}ctx.fillStyle='#fff4a8';ctx.beginPath();ctx.arc(x,y,5,0,Math.PI*2);ctx.fill();ctx.restore();
  }

  function drawPlayer(time) {
    ctx.save();ctx.translate(player.x,player.y);if(shake>0){ctx.translate((Math.random()-.5)*8*shake,(Math.random()-.5)*8*shake)}ctx.fillStyle='rgba(0,0,0,.4)';ctx.beginPath();ctx.ellipse(0,18,24,9,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#62f3ee';ctx.globalAlpha=.38;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,30+Math.sin(time/160)*2,0,Math.PI*2);ctx.stroke();ctx.globalAlpha=1;if(orishImage.complete&&orishImage.naturalWidth){ctx.save();ctx.scale(player.facing,1);ctx.drawImage(orishImage,-28,-56,56,72);ctx.restore()}else{ctx.fillStyle='#62f3ee';ctx.beginPath();ctx.arc(0,0,18,0,Math.PI*2);ctx.fill()}ctx.restore();
  }

  function update(dt) {
    let dx=0,dy=0;if(keys.has('up')||keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('down')||keys.has('ArrowDown')||keys.has('s'))dy++;if(keys.has('left')||keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('right')||keys.has('ArrowRight')||keys.has('d'))dx++;if(dx||dy)move(dx,dy,dt);updateNearTarget();if(flash>0)flash=Math.max(0,flash-dt*1.7);if(shake>0)shake=Math.max(0,shake-dt*1.2);
  }

  function render(time) {
    drawStation(time);drawPlayer(time);if(flash>0){ctx.fillStyle=`rgba(140,244,255,${flash*.18})`;ctx.fillRect(0,0,W,H)}
  }

  function loop(time) {
    const dt=Math.min(.04,(time-last)/1000||0);last=time;if(running&&!paused)update(dt);render(time);requestAnimationFrame(loop);
  }

  function start() {
    intro.hidden=true;running=true;paused=false;last=performance.now();setObjective('Reach the signal console');say('The signal console is glowing in the upper signal lab. Move there and investigate.');beep(620,.12);
  }

  begin.addEventListener('click', start);
  action.addEventListener('click', interact);
  soundButton.addEventListener('click',()=>{soundOn=!soundOn;soundButton.textContent=soundOn?'♫':'×';soundButton.setAttribute('aria-label',soundOn?'Mute sound':'Turn sound on')});

  const moveButtons=[...document.querySelectorAll('[data-move]')];
  moveButtons.forEach(button=>{
    const id=button.dataset.move;
    const on=e=>{e.preventDefault();keys.add(id)};
    const off=e=>{e?.preventDefault?.();keys.delete(id)};
    button.addEventListener('pointerdown',on);button.addEventListener('pointerup',off);button.addEventListener('pointercancel',off);button.addEventListener('pointerleave',off);
    button.addEventListener('touchstart',on,{passive:false});button.addEventListener('touchend',off,{passive:false});
  });
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d',' '].includes(e.key))e.preventDefault();if(e.key===' ')interact();else keys.add(e.key)});
  document.addEventListener('keyup',e=>keys.delete(e.key));
  document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();paused=true}else if(running&&!eventLayer.hidden===false){paused=false;last=performance.now()}});
  requestAnimationFrame(loop);
})();

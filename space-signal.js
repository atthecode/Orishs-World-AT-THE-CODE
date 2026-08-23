(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const characterImage = new Image();
  characterImage.src = 'assets/orish-game-walk.webp';
  const ui = {
    briefing: $('#briefing'), stage: $('#gameStage'), analysis: $('#analysisPanel'), complete: $('#completePanel'),
    objective: $('#objectiveText'), evidence: $('#evidenceCount'), stars: $('#starCount'), scanner: $('#scannerFill'),
    comms: $('#commsText'), scan: $('#scanButton'), vignette: $('#scanVignette'), pause: $('#pauseModal')
  };
  const world = { width: 960, height: 540 };
  const player = { x: 105, y: 430, r: 13, speed: 190, facing: 1, moving: false };
  const traces = [
    { x: 230, y: 128, found: false, colour: '#42e8ff', label: 'Pulse timing' },
    { x: 710, y: 148, found: false, colour: '#ffc857', label: 'Signal strength' },
    { x: 790, y: 405, found: false, colour: '#a879ff', label: 'Direction trace' }
  ];
  const walls = [
    { x: 0, y: 0, w: 960, h: 34 }, { x: 0, y: 506, w: 960, h: 34 }, { x: 0, y: 0, w: 34, h: 540 }, { x: 926, y: 0, w: 34, h: 540 },
    { x: 165, y: 70, w: 34, h: 220 }, { x: 165, y: 400, w: 34, h: 106 }, { x: 410, y: 34, w: 34, h: 150 }, { x: 410, y: 300, w: 34, h: 206 },
    { x: 650, y: 80, w: 34, h: 205 }, { x: 650, y: 390, w: 34, h: 116 }, { x: 240, y: 300, w: 120, h: 28 }, { x: 495, y: 355, w: 110, h: 28 },
    { x: 730, y: 250, w: 145, h: 28 }
  ];
  const keys = new Set();
  let running = false, paused = false, last = 0, scannerPower = 8, foundCount = 0, soundOn = true, animationId, audioContext, musicMaster;

  function reset() {
    player.x = 105; player.y = 430; foundCount = 0; scannerPower = 8;
    traces.forEach(t => t.found = false);
    ui.evidence.textContent = '0'; ui.stars.textContent = '300'; ui.objective.textContent = 'Find the first trace';
    ui.comms.textContent = 'Use the controls to explore. Scan when the meter glows.';
  }
  function beep(freq = 440, duration = .08) {
    if (!soundOn) return;
    try { const ac = getAudio(); const o = ac.createOscillator(); const g = ac.createGain(); o.frequency.value = freq; g.gain.setValueAtTime(.035, ac.currentTime); g.gain.exponentialRampToValueAtTime(.001, ac.currentTime + duration); o.connect(g).connect(ac.destination); o.start(); o.stop(ac.currentTime + duration); } catch (_) {}
  }
  function getAudio() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    audioContext ||= new AudioCtx();
    if (audioContext.state === 'suspended') audioContext.resume();
    return audioContext;
  }
  function startMusic() {
    if (musicMaster) { musicMaster.gain.setTargetAtTime(soundOn ? .045 : 0, getAudio().currentTime, .25); return; }
    try {
      const ac = getAudio(); musicMaster = ac.createGain(); musicMaster.gain.value = soundOn ? .045 : 0; musicMaster.connect(ac.destination);
      const filter = ac.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 780; filter.Q.value = 1.2; filter.connect(musicMaster);
      [82.41, 123.47, 164.81].forEach((frequency, index) => { const oscillator = ac.createOscillator(); const gain = ac.createGain(); oscillator.type = index === 1 ? 'triangle' : 'sine'; oscillator.frequency.value = frequency; gain.gain.value = index === 0 ? .42 : .16; oscillator.connect(gain).connect(filter); oscillator.start(); });
      const shimmer = ac.createOscillator(); const shimmerGain = ac.createGain(); const lfo = ac.createOscillator(); const lfoGain = ac.createGain(); shimmer.type = 'sine'; shimmer.frequency.value = 659.25; shimmerGain.gain.value = .025; lfo.frequency.value = .075; lfoGain.gain.value = .018; lfo.connect(lfoGain).connect(shimmerGain.gain); shimmer.connect(shimmerGain).connect(filter); lfo.start(); shimmer.start();
    } catch (_) {}
  }
  function speak(text) {
    if (!('speechSynthesis' in window)) { ui.comms.textContent = 'Read-aloud is not available in this browser.'; return; }
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-GB'; utterance.rate = .92; utterance.pitch = 1.04;
    const voice = window.speechSynthesis.getVoices().find(item => item.lang === 'en-GB' || item.lang.startsWith('en-GB')); if (voice) utterance.voice = voice; window.speechSynthesis.speak(utterance);
  }
  function collides(x, y) { return walls.some(w => x + player.r > w.x && x - player.r < w.x + w.w && y + player.r > w.y && y - player.r < w.y + w.h); }
  function move(dx, dy, dt) {
    const length = Math.hypot(dx, dy) || 1; const nx = player.x + dx / length * player.speed * dt; const ny = player.y + dy / length * player.speed * dt;
    if (!collides(nx, player.y)) player.x = nx; if (!collides(player.x, ny)) player.y = ny;
  }
  function nearestTrace() { return traces.filter(t => !t.found).sort((a,b) => Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y))[0]; }
  function scan() {
    if (!running || paused) return;
    ui.vignette.classList.remove('active'); void ui.vignette.offsetWidth; ui.vignette.classList.add('active'); beep(620,.15);
    const trace = nearestTrace(); const distance = trace ? Math.hypot(player.x-trace.x,player.y-trace.y) : Infinity;
    if (trace && distance < 88) {
      trace.found = true; foundCount++; scannerPower = 8; ui.evidence.textContent = String(foundCount); ui.stars.textContent = String(300 - (3-foundCount)*10);
      ui.comms.textContent = `${trace.label} secured. Evidence ${foundCount} of 3.`; ui.objective.textContent = foundCount < 3 ? `Find trace ${foundCount + 1}` : 'Return to the evidence lab'; beep(880,.22);
      if (foundCount === 3) setTimeout(openAnalysis, 950);
    } else ui.comms.textContent = distance < 170 ? 'The trace is close. Follow the brighter scanner meter.' : 'No trace here. Explore another section.';
  }
  function openAnalysis() { running = false; cancelAnimationFrame(animationId); ui.stage.hidden = true; ui.analysis.hidden = false; }
  function drawGrid() {
    ctx.fillStyle = '#041226'; ctx.fillRect(0,0,world.width,world.height);
    const glow = ctx.createRadialGradient(player.x,player.y,20,player.x,player.y,260); glow.addColorStop(0,'rgba(47,115,177,.24)'); glow.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=glow;ctx.fillRect(0,0,world.width,world.height);
    ctx.strokeStyle='rgba(81,165,214,.08)';ctx.lineWidth=1;for(let x=0;x<world.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,world.height);ctx.stroke()}for(let y=0;y<world.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(world.width,y);ctx.stroke()}
    ctx.strokeStyle='rgba(66,232,255,.16)';ctx.lineWidth=2;ctx.strokeRect(44,44,872,452);
  }
  function drawWalls(time) {
    walls.forEach((w,i)=>{const g=ctx.createLinearGradient(w.x,w.y,w.x+w.w,w.y+w.h);g.addColorStop(0,'#153a60');g.addColorStop(.5,'#0a2547');g.addColorStop(1,'#183f62');ctx.fillStyle=g;ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle='rgba(82,219,255,.24)';ctx.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);if(i>3){ctx.fillStyle=`rgba(66,232,255,${.18+Math.sin(time/600+i)*.08})`;ctx.fillRect(w.x+5,w.y+5,Math.min(5,w.w-10),Math.max(0,w.h-10))}});
    [[90,92,'OBSERVATION'],[490,90,'SIGNAL LAB'],[755,330,'ARRAY']].forEach(([x,y,t])=>{ctx.fillStyle='rgba(13,46,80,.8)';ctx.fillRect(x-55,y-18,110,36);ctx.strokeStyle='rgba(66,232,255,.25)';ctx.strokeRect(x-55,y-18,110,36);ctx.fillStyle='#8bddec';ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText(t,x,y+4)});
  }
  function drawTraces(time) {
    traces.forEach((t,i)=>{if(t.found)return;const d=Math.hypot(player.x-t.x,player.y-t.y);const alpha=Math.max(.08,1-d/380);ctx.save();ctx.translate(t.x,t.y);ctx.strokeStyle=t.colour;ctx.globalAlpha=alpha;ctx.lineWidth=2;for(let r=14;r<50;r+=12){ctx.beginPath();ctx.arc(0,0,r+Math.sin(time/300+i)*3,0,Math.PI*2);ctx.stroke()}ctx.fillStyle=t.colour;ctx.shadowBlur=22;ctx.shadowColor=t.colour;ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();ctx.restore()});
  }
  function drawPlayer(time) {
    const bob = player.moving ? Math.sin(time / 85) * 2.5 : Math.sin(time / 420) * .8;
    ctx.save(); ctx.translate(player.x, player.y); ctx.fillStyle='rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(0,16,20,8,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(66,232,255,.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,5,28+Math.sin(time/180)*2,0,Math.PI*2); ctx.stroke();
    if (characterImage.complete && characterImage.naturalWidth) { ctx.scale(player.facing,1); ctx.drawImage(characterImage,-29,-67+bob,58,87); }
    else { ctx.fillStyle='#42e8ff';ctx.beginPath();ctx.arc(0,0,player.r,0,Math.PI*2);ctx.fill(); }
    ctx.restore();
  }
  function update(dt) {
    let dx=0,dy=0;if(keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('ArrowDown')||keys.has('s'))dy++;if(keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('ArrowRight')||keys.has('d'))dx++;player.moving=Boolean(dx||dy);if(dx)player.facing=dx>0?1:-1;if(dx||dy)move(dx,dy,dt);
    const n=nearestTrace();const d=n?Math.hypot(player.x-n.x,player.y-n.y):400;scannerPower=Math.max(8,Math.min(100,112-d/2));ui.scanner.style.width=`${scannerPower}%`;ui.scan.classList.toggle('ready',scannerPower>70);
  }
  function loop(time) { if(!running)return;const dt=Math.min(.035,(time-last)/1000||0);last=time;if(!paused)update(dt);drawGrid();drawWalls(time);drawTraces(time);drawPlayer(time);animationId=requestAnimationFrame(loop); }
  function start() { reset(); startMusic(); ui.briefing.hidden=true;ui.analysis.hidden=true;ui.complete.hidden=true;ui.stage.hidden=false;running=true;paused=false;last=performance.now();animationId=requestAnimationFrame(loop); }
  function setMove(direction,on){const map={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};on?keys.add(map[direction]):keys.delete(map[direction]);}
  $('#startMission').addEventListener('click',start); $('#replayMission').addEventListener('click',start); ui.scan.addEventListener('click',scan);
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d'].includes(e.key))e.preventDefault();if(e.key===' ')scan();else keys.add(e.key.toLowerCase()==='w'?'w':e.key.toLowerCase()==='a'?'a':e.key.toLowerCase()==='s'?'s':e.key.toLowerCase()==='d'?'d':e.key)});
  document.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
  document.querySelectorAll('[data-move]').forEach(b=>{['pointerdown','touchstart'].forEach(evt=>b.addEventListener(evt,e=>{e.preventDefault();setMove(b.dataset.move,true)}));['pointerup','pointerleave','pointercancel','touchend'].forEach(evt=>b.addEventListener(evt,()=>setMove(b.dataset.move,false)))});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{const feedback=$('#analysisFeedback');if(button.dataset.answer==='signal'){feedback.textContent='Correct—the equal gaps show a repeating pulse. Mission solved.';feedback.style.color='#70f0bd';beep(980,.25);setTimeout(()=>{ui.analysis.hidden=true;ui.complete.hidden=false},700)}else{feedback.textContent='Good test, but that trace does not repeat evenly. Compare the gaps and try again.';feedback.style.color='#ffc857';beep(260,.16)}}));
  document.querySelectorAll('[data-speak]').forEach(button=>button.addEventListener('click',()=>speak(button.dataset.speak)));
  $('.comms-speak').addEventListener('click',()=>speak(ui.comms.textContent));
  $('#pauseButton').addEventListener('click',()=>{paused=true;ui.pause.hidden=false}); $('#resumeButton').addEventListener('click',()=>{paused=false;ui.pause.hidden=true;last=performance.now()});
  $('#soundToggle').addEventListener('click',e=>{soundOn=!soundOn;if(musicMaster&&audioContext)musicMaster.gain.setTargetAtTime(soundOn?.045:0,audioContext.currentTime,.18);e.currentTarget.textContent=soundOn?'♫':'×';e.currentTarget.setAttribute('aria-label',soundOn?'Mute music and sound':'Turn music and sound on')});
})();

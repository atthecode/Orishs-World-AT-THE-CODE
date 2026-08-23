(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const canvas = $('#gameCanvas');
  const ctx = canvas.getContext('2d');
  const characterImage = new Image();
  characterImage.src = 'assets/orish-game-walk.webp';
  const customAvatarImage = new Image();
  const AvatarLab = window.OrishAvatarLab;
  const SecurityStore = window.OrishSecurityStore;
  const ParentControls = window.OrishParentControls;
  const originalVoiceClips = {
    welcomeOrishWorld: 'assets/audio/orish/welcome-orish-world.m4a',
    welcomeMyWorld: 'assets/audio/orish/welcome-my-world.m4a',
    letsGo: 'assets/audio/orish/lets-go.m4a',
    funAndLearn: 'assets/audio/orish/fun-and-learn.m4a',
    signalReturned: 'assets/audio/orish/signal-returned.m4a',
    moveObservatory: 'assets/audio/orish/move-through-observatory.m4a'
  };
  const ui = {
    briefing: $('#briefing'), stage: $('#gameStage'), analysis: $('#analysisPanel'), complete: $('#completePanel'),
    objective: $('#objectiveText'), evidence: $('#evidenceCount'), miniCount: $('#miniCount'), stars: $('#starCount'), scanner: $('#scannerFill'),
    comms: $('#commsText'), scan: $('#scanButton'), vignette: $('#scanVignette'), pause: $('#pauseModal')
  };
  const world = { width: 960, height: 540 };
  const player = { x: 105, y: 430, r: 13, speed: 190, facing: 1, moving: false };
  const traces = [
    { x: 230, y: 128, found: false, colour: '#42e8ff', label: 'Pulse timing' },
    { x: 710, y: 148, found: false, colour: '#ffc857', label: 'Signal strength' },
    { x: 790, y: 405, found: false, colour: '#a879ff', label: 'Direction trace' }
  ];
  const miniMissions = [
    { x: 300, y: 430, complete: false, badge: 'MINI MISSION · POWER ROUTE', title: 'Complete the energy cell', question: 'The battery is three quarters full. Which piece completes one whole battery?', clue:'<div class="fraction-battery"><span class="filled">¼</span><span class="filled">¼</span><span class="filled">¼</span><span class="missing">?</span></div><p><b>Quarter</b> means one of four equal parts. Four quarters make one whole.</p>', speech: 'A quarter means one of four equal parts. The battery is divided into four equal boxes. Three boxes are filled, so it is three quarters full. Which piece completes one whole battery?', options: ['¼ · one quarter', '½ · one half', '¾ · three quarters'], choicePlainSpeech:['One quarter.','One half.','Three quarters.'], choiceSpeech: ['One quarter. Listen to the sounds in quarter: kuh-wuh, or, tuh, er. The letters are Q, U, A, R, T, E, R. Quarter. One quarter.','One half. Listen to the sounds in half: huh, ar, fff. The letters are H, A, L, F. Half. One half.','Three quarters. Listen to the sounds in three: th, rrr, ee. The letters are T, H, R, E, E. Three. Quarter sounds: kuh-wuh, or, tuh, er. The letters are Q, U, A, R, T, E, R, S. Quarters. Three quarters.'], answer: 0 },
    { x: 525, y: 235, complete: false, badge: 'MINI MISSION · STAR MAP', title: 'Continue the signal pattern', question: 'The lights repeat blue, gold, blue, gold. Which colour comes next?', clue:'<div class="colour-pattern"><span class="blue"></span><span class="gold"></span><span class="blue"></span><span class="gold"></span><span class="unknown">?</span></div><p>A <b>pattern</b> is an order that repeats in the same way.</p>', speech: 'A pattern is an order that repeats in the same way. The lights repeat blue, gold, blue, gold. Which colour comes next?', options: ['BLUE', 'PURPLE', 'GOLD'], choicePlainSpeech:['Blue.','Purple.','Gold.'], choiceSpeech: ['Blue. Listen to the sounds: buh, lll, oo. The letters are B, L, U, E. Blue.','Purple. Listen to the sounds: puh, ur, puh, ul. The letters are P, U, R, P, L, E. Purple.','Gold. Listen to the sounds: guh, oh, lll, duh. The letters are G, O, L, D. Gold.'], answer: 0 },
    { x: 820, y: 175, complete: false, badge: 'MINI MISSION · EVIDENCE CHECK', title: 'Choose the strongest clue', question: 'A sound happened twice at the same time. What should an investigator do next?', clue:'<div class="evidence-steps"><span>👀 Observe</span><b>→</b><span>🔁 Test</span><b>→</b><span>✓ Check</span></div><p><b>Evidence</b> is information we can observe and check. Testing again helps us know whether it was a pattern or a coincidence.</p>', speech: 'Evidence is information we can observe and check. Testing again helps us know whether something is a pattern or a coincidence. A sound happened twice at the same time. What should an investigator do next?', options: ['DECIDE NOW', 'TEST AGAIN', 'IGNORE IT'], choicePlainSpeech:['Decide now.','Test again.','Ignore it.'], choiceSpeech: ['Decide now. Decide. Listen to the sounds: duh, ih, sss, eye, duh. The letters are D, E, C, I, D, E. Decide. Now sounds: nnn, ow. The letters are N, O, W. Now. Decide now.','Test again. Test. Listen to the sounds: tuh, eh, sss, tuh. The letters are T, E, S, T. Test. Again sounds: uh, guh, eh, nnn. The letters are A, G, A, I, N. Again. Test again.','Ignore it. Ignore. Listen to the sounds: ih, guh, nor. The letters are I, G, N, O, R, E. Ignore. It sounds: ih, tuh. The letters are I, T. It. Ignore it.'], answer: 1 }
  ];
  const walls = [
    { x: 0, y: 0, w: 960, h: 34 }, { x: 0, y: 506, w: 960, h: 34 }, { x: 0, y: 0, w: 34, h: 540 }, { x: 926, y: 0, w: 34, h: 540 },
    { x: 165, y: 70, w: 34, h: 220 }, { x: 165, y: 400, w: 34, h: 106 }, { x: 410, y: 34, w: 34, h: 150 }, { x: 410, y: 300, w: 34, h: 206 },
    { x: 650, y: 80, w: 34, h: 205 }, { x: 650, y: 390, w: 34, h: 116 }, { x: 240, y: 300, w: 120, h: 28 }, { x: 495, y: 355, w: 110, h: 28 },
    { x: 730, y: 250, w: 145, h: 28 }
  ];
  const keys = new Set();
  let running = false, paused = false, last = 0, scannerPower = 8, foundCount = 0, miniComplete = 0, activeMini = null, soundOn = true, animationId, audioContext, musicMaster, blockedAt = 0, originalVoiceAudio = null, voiceSequenceId = 0;
  let selectedCharacter = 'orish';
  let customAvatar = AvatarLab?.get('demo') || { mode:'real', skin:'#805141', hair:'afro', hairColor:'#17120f', outfit:'explorer', accent:'#17d7e8' };
  const avatarLabels = {afro:'Rounded afro',braids:'Beaded braids',locs:'Shoulder-length locs',curls:'Round curls',waves:'Close waves',straight:'Straight side panels',explorer:'Explorer',scientist:'Scientist',space:'Space',chef:'Chef',artist:'Artist'};

  window.__orishAvatarState = customAvatar;
  function avatarColourButton(colour, selected, label, attribute) { return `<button type="button" class="${selected?'active':''}" style="--swatch:${colour}" ${attribute}="${colour}" aria-label="${label}" aria-pressed="${selected}"></button>`; }
  function updateAvatarState(patch, announce = true) {
    customAvatar = AvatarLab?.normalize({...customAvatar,...patch}) || {...customAvatar,...patch}; window.__orishAvatarState = customAvatar; window.OrishAvatar3D?.update(customAvatar); window.dispatchEvent(new CustomEvent('orish-avatar:update',{detail:customAvatar})); renderAvatarDesigner(); setTimeout(refreshAvatarSprite,140); if(announce) $('#avatarSaveStatus').textContent='Changed — press Use this Explorer when ready.';
  }
  function renderAvatarDesigner() {
    if (!AvatarLab) return; const skins=customAvatar.mode==='creative'?[...AvatarLab.NATURAL_SKINS,...AvatarLab.FANTASY_SKINS]:AvatarLab.NATURAL_SKINS;
    $('#avatarRealMode').classList.toggle('active',customAvatar.mode==='real'); $('#avatarCreativeMode').classList.toggle('active',customAvatar.mode==='creative');
    $('#avatarSkinPalette').innerHTML=skins.map((colour,index)=>avatarColourButton(colour,customAvatar.skin===colour,`Skin tone ${index+1}`,'data-avatar-skin')).join('');
    $('#avatarHairPalette').innerHTML=AvatarLab.HAIR_COLORS.map((colour,index)=>avatarColourButton(colour,customAvatar.hairColor===colour,`Hair colour ${index+1}`,'data-avatar-hair-colour')).join('');
    $('#avatarAccentPalette').innerHTML=AvatarLab.ACCENTS.map((colour,index)=>avatarColourButton(colour,customAvatar.accent===colour,`Outfit accent ${index+1}`,'data-avatar-accent')).join('');
    $('#avatarHairStyles').innerHTML=AvatarLab.HAIR.map(item=>`<button type="button" class="${customAvatar.hair===item?'active':''}" data-avatar-hair="${item}">${avatarLabels[item]||item}</button>`).join('');
    $('#avatarOutfits').innerHTML=AvatarLab.OUTFITS.map(item=>`<button type="button" class="${customAvatar.outfit===item?'active':''}" data-avatar-outfit="${item}">${avatarLabels[item]||item}</button>`).join('');
    $('#avatarSkinPalette').querySelectorAll('[data-avatar-skin]').forEach(b=>b.addEventListener('click',()=>updateAvatarState({skin:b.dataset.avatarSkin})));
    $('#avatarHairPalette').querySelectorAll('[data-avatar-hair-colour]').forEach(b=>b.addEventListener('click',()=>updateAvatarState({hairColor:b.dataset.avatarHairColour})));
    $('#avatarAccentPalette').querySelectorAll('[data-avatar-accent]').forEach(b=>b.addEventListener('click',()=>updateAvatarState({accent:b.dataset.avatarAccent})));
    $('#avatarHairStyles').querySelectorAll('[data-avatar-hair]').forEach(b=>b.addEventListener('click',()=>updateAvatarState({hair:b.dataset.avatarHair})));
    $('#avatarOutfits').querySelectorAll('[data-avatar-outfit]').forEach(b=>b.addEventListener('click',()=>updateAvatarState({outfit:b.dataset.avatarOutfit})));
  }
  function refreshAvatarSprite() {
    if (!window.OrishAvatar3D?.ready) return; const shot=window.OrishAvatar3D.capture(); if(!shot)return; customAvatarImage.src=shot; $('#avatarPreview').style.backgroundImage=`url(${shot})`; $('#avatarPreview').style.backgroundSize='cover'; $('#avatarPreview').textContent='';
  }

  function reset() {
    player.x = 105; player.y = 430; foundCount = 0; miniComplete = 0; scannerPower = 8;
    traces.forEach(t => t.found = false);
    miniMissions.forEach(m => m.complete = false);
    ui.evidence.textContent = '0'; ui.miniCount.textContent = '0'; ui.stars.textContent = '300'; ui.objective.textContent = 'Find the first trace';
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
    if (!spokenSupportEnabled()) { ui.comms.textContent = 'Spoken support is turned off in Parent Studio.'; return; }
    stopOriginalVoice();
    if (!('speechSynthesis' in window)) { ui.comms.textContent = 'Read-aloud is not available in this browser.'; return; }
    window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(text); utterance.lang = 'en-GB'; utterance.rate = .92; utterance.pitch = 1.04;
    const voice = window.speechSynthesis.getVoices().find(item => item.lang === 'en-GB' || item.lang.startsWith('en-GB')); if (voice) utterance.voice = voice; window.speechSynthesis.speak(utterance);
  }
  function phonicsGuideEnabled() {
    const profile = SecurityStore?.getActiveProfile?.();
    if (!profile) return true;
    return ParentControls?.get?.(profile.id, profile.ageBand)?.phonicsGuide !== false;
  }
  function spokenSupportEnabled() {
    const profile = SecurityStore?.getActiveProfile?.();
    if (!profile) return true;
    return ParentControls?.get?.(profile.id, profile.ageBand)?.spokenSupport !== false;
  }
  function stopOriginalVoice() {
    voiceSequenceId += 1;
    if (originalVoiceAudio) { originalVoiceAudio.pause(); originalVoiceAudio.currentTime = 0; originalVoiceAudio = null; }
  }
  function playOriginalClip(source, sequenceId) {
    return new Promise(resolve => {
      if (sequenceId !== voiceSequenceId) { resolve(false); return; }
      const audio = new Audio(source); originalVoiceAudio = audio; audio.preload = 'auto'; audio.volume = 1;
      const finish = success => { audio.onended = null; audio.onerror = null; if (originalVoiceAudio === audio) originalVoiceAudio = null; resolve(success); };
      audio.onended = () => finish(true); audio.onerror = () => finish(false); audio.play().catch(() => finish(false));
    });
  }
  async function playOriginalSequence(keys, fallbackText = '') {
    if (!spokenSupportEnabled()) { ui.comms.textContent = 'Spoken support is turned off in Parent Studio.'; return; }
    if (!soundOn) { ui.comms.textContent = 'Sound is off. Tap the music button to turn sound on.'; return; }
    window.speechSynthesis?.cancel(); stopOriginalVoice(); const sequenceId = voiceSequenceId;
    if (musicMaster && audioContext) musicMaster.gain.setTargetAtTime(.012, audioContext.currentTime, .08);
    let allPlayed = true;
    for (const key of keys) { const source = originalVoiceClips[key]; if (!source || !(await playOriginalClip(source, sequenceId))) { allPlayed = false; break; } }
    if (musicMaster && audioContext) musicMaster.gain.setTargetAtTime(soundOn ? .045 : 0, audioContext.currentTime, .2);
    if (!allPlayed && fallbackText && sequenceId === voiceSequenceId) speak(fallbackText);
  }
  function collides(x, y) { return walls.some(w => x + player.r > w.x && x - player.r < w.x + w.w && y + player.r > w.y && y - player.r < w.y + w.h); }
  function blockedRoute() {
    const now = performance.now(); if (now - blockedAt < 850) return; blockedAt = now;
    ui.comms.textContent = 'That route is blocked. Look for a wide glowing doorway and try another path.';
    beep(210,.12); setTimeout(()=>beep(145,.18),110);
  }
  function move(dx, dy, dt) {
    const length = Math.hypot(dx, dy) || 1; const nx = player.x + dx / length * player.speed * dt; const ny = player.y + dy / length * player.speed * dt;
    if (!collides(nx, player.y)) player.x = nx; else if (dx) blockedRoute();
    if (!collides(player.x, ny)) player.y = ny; else if (dy) blockedRoute();
  }
  function nearestTrace() { return traces.filter(t => !t.found).sort((a,b) => Math.hypot(player.x-a.x,player.y-a.y)-Math.hypot(player.x-b.x,player.y-b.y))[0]; }
  function scan() {
    if (!running || paused) return;
    ui.vignette.classList.remove('active'); void ui.vignette.offsetWidth; ui.vignette.classList.add('active'); beep(620,.15);
    const mini = miniMissions.find(mission => !mission.complete && Math.hypot(player.x-mission.x,player.y-mission.y) < 82);
    if (mini) { openMiniMission(mini); return; }
    const trace = nearestTrace(); const distance = trace ? Math.hypot(player.x-trace.x,player.y-trace.y) : Infinity;
    if (trace && distance < 88) {
      trace.found = true; foundCount++; scannerPower = 8; ui.evidence.textContent = String(foundCount); ui.stars.textContent = String(300 - (3-foundCount)*10);
      ui.comms.textContent = `${trace.label} secured. Evidence ${foundCount} of 3.`; ui.objective.textContent = foundCount < 3 ? `Find trace ${foundCount + 1}` : 'Return to the evidence lab'; beep(880,.22);
      if (foundCount === 3) setTimeout(openAnalysis, 950);
    } else ui.comms.textContent = distance < 170 ? 'The trace is close. Follow the brighter scanner meter.' : 'No trace here. Explore another section.';
  }
  function openMiniMission(mission) {
    activeMini = mission; paused = true; $('#miniBadge').textContent = mission.badge; $('#miniTitle').textContent = mission.title; $('#miniQuestion').textContent = mission.question; $('#miniClue').innerHTML = mission.clue || ''; $('#miniFeedback').textContent = ''; $('#miniClose').style.display = 'none';
    const letters = ['A','B','C'];
    $('#miniOptions').innerHTML = mission.options.map((option,index) => `<div class="mini-option-row"><button type="button" data-mini-answer="${index}">${letters[index]} · ${option}</button><button class="mini-choice-speak" type="button" data-mini-speak="${index}" aria-label="Hear choice ${letters[index]}">🔊 Hear ${letters[index]}</button></div>`).join('');
    $('#miniModal').hidden = false; $('#miniOptions').querySelectorAll('[data-mini-answer]').forEach(button => button.addEventListener('click', () => answerMini(Number(button.dataset.miniAnswer)))); $('#miniOptions').querySelectorAll('[data-mini-speak]').forEach(button => button.addEventListener('click',()=>{const index=Number(button.dataset.miniSpeak);const letter=letters[index];const choice=phonicsGuideEnabled()?mission.choiceSpeech[index]:mission.choicePlainSpeech[index];speak(`Choice ${letter}. ${choice}.`)}));
  }
  function answerMini(answer) {
    if (!activeMini) return; const feedback = $('#miniFeedback');
    if (answer !== activeMini.answer) { feedback.textContent = 'Good try. Look at the information again and test another answer.'; feedback.style.color = '#ffc857'; beep(260,.15); return; }
    activeMini.complete = true; miniComplete += 1; ui.miniCount.textContent = String(miniComplete); ui.stars.textContent = String(Number(ui.stars.textContent) + 40); feedback.textContent = 'Mini mission complete! You earned 40 extra stars.'; feedback.style.color = '#70f0bd'; $('#miniOptions').querySelectorAll('button').forEach(button => button.disabled = true); $('#miniClose').style.display = 'inline-flex'; beep(980,.24);
  }
  function openAnalysis() { running = false; cancelAnimationFrame(animationId); ui.stage.hidden = true; ui.analysis.hidden = false; }
  function drawGrid(time) {
    const floor = ctx.createLinearGradient(0,0,world.width,world.height); floor.addColorStop(0,'#071b3b'); floor.addColorStop(.35,'#0d2850'); floor.addColorStop(.7,'#171d50'); floor.addColorStop(1,'#092d45'); ctx.fillStyle=floor;ctx.fillRect(0,0,world.width,world.height);
    [[120,120,'rgba(28,208,255,.18)'],[500,420,'rgba(171,83,255,.18)'],[825,135,'rgba(255,103,54,.16)']].forEach(([x,y,colour],index)=>{const g=ctx.createRadialGradient(x,y,5,x,y,180+Math.sin(time/700+index)*20);g.addColorStop(0,colour);g.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=g;ctx.fillRect(x-210,y-210,420,420)});
    const glow = ctx.createRadialGradient(player.x,player.y,20,player.x,player.y,260); glow.addColorStop(0,'rgba(47,115,177,.24)'); glow.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=glow;ctx.fillRect(0,0,world.width,world.height);
    ctx.strokeStyle='rgba(81,165,214,.08)';ctx.lineWidth=1;for(let x=0;x<world.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,world.height);ctx.stroke()}for(let y=0;y<world.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(world.width,y);ctx.stroke()}
    for(let i=0;i<34;i++){const x=(i*127+43)%world.width,y=(i*73+91)%world.height,twinkle=.25+Math.sin(time/260+i)*.2;ctx.fillStyle=`rgba(${i%3===0?'255,210,84':i%3===1?'79,230,255':'190,126,255'},${twinkle})`;ctx.beginPath();ctx.arc(x,y,1.5+(i%4===0?1.5:0),0,Math.PI*2);ctx.fill()}
    ctx.strokeStyle='rgba(66,232,255,.16)';ctx.lineWidth=2;ctx.strokeRect(44,44,872,452);
  }
  function drawWalls(time) {
    walls.forEach((w,i)=>{const g=ctx.createLinearGradient(w.x,w.y,w.x+w.w,w.y+w.h);g.addColorStop(0,'#153a60');g.addColorStop(.5,'#0a2547');g.addColorStop(1,'#183f62');ctx.fillStyle=g;ctx.fillRect(w.x,w.y,w.w,w.h);ctx.strokeStyle='rgba(82,219,255,.24)';ctx.strokeRect(w.x+.5,w.y+.5,w.w-1,w.h-1);if(i>3){ctx.fillStyle=`rgba(66,232,255,${.18+Math.sin(time/600+i)*.08})`;ctx.fillRect(w.x+5,w.y+5,Math.min(5,w.w-10),Math.max(0,w.h-10))}});
    [[90,92,'OBSERVATION'],[490,90,'SIGNAL LAB'],[755,330,'ARRAY']].forEach(([x,y,t])=>{ctx.fillStyle='rgba(13,46,80,.8)';ctx.fillRect(x-55,y-18,110,36);ctx.strokeStyle='rgba(66,232,255,.25)';ctx.strokeRect(x-55,y-18,110,36);ctx.fillStyle='#8bddec';ctx.font='10px system-ui';ctx.textAlign='center';ctx.fillText(t,x,y+4)});
  }
  function drawTraces(time) {
    traces.forEach((t,i)=>{if(t.found)return;const d=Math.hypot(player.x-t.x,player.y-t.y);const alpha=Math.max(.08,1-d/380);ctx.save();ctx.translate(t.x,t.y);ctx.strokeStyle=t.colour;ctx.globalAlpha=alpha;ctx.lineWidth=2;for(let r=14;r<50;r+=12){ctx.beginPath();ctx.arc(0,0,r+Math.sin(time/300+i)*3,0,Math.PI*2);ctx.stroke()}ctx.fillStyle=t.colour;ctx.shadowBlur=22;ctx.shadowColor=t.colour;ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();ctx.restore()});
  }
  function drawMiniMissions(time) {
    miniMissions.forEach((mission,index) => { ctx.save(); ctx.translate(mission.x,mission.y); const pulse=1+Math.sin(time/260+index)*.08; ctx.scale(pulse,pulse); ctx.fillStyle=mission.complete?'rgba(112,240,189,.18)':'rgba(168,121,255,.22)'; ctx.strokeStyle=mission.complete?'#70f0bd':'#c69cff'; ctx.lineWidth=2; ctx.beginPath(); for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6;const x=Math.cos(a)*22,y=Math.sin(a)*22;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle=mission.complete?'#70f0bd':'#efe2ff';ctx.font='bold 19px system-ui';ctx.textAlign='center';ctx.fillText(mission.complete?'✓':'✦',0,7);ctx.restore(); });
  }
  function drawPlayer(time) {
    const bob = player.moving ? Math.sin(time / 85) * 2.5 : Math.sin(time / 420) * .8;
    ctx.save(); ctx.translate(player.x, player.y); ctx.fillStyle='rgba(0,0,0,.38)'; ctx.beginPath(); ctx.ellipse(0,16,20,8,0,0,Math.PI*2); ctx.fill(); ctx.strokeStyle='rgba(66,232,255,.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,5,28+Math.sin(time/180)*2,0,Math.PI*2); ctx.stroke();
    if (selectedCharacter === 'orish' && characterImage.complete && characterImage.naturalWidth) { ctx.scale(player.facing,1); ctx.drawImage(characterImage,-29,-67+bob,58,87); }
    else if (selectedCharacter === 'explorer' && customAvatarImage.complete && customAvatarImage.naturalWidth) { ctx.scale(player.facing,1); ctx.drawImage(customAvatarImage,-31,-70+bob,62,92); }
    else if (selectedCharacter === 'explorer') { drawCustomExplorer(bob); }
    else { ctx.fillStyle='#42e8ff';ctx.beginPath();ctx.arc(0,0,player.r,0,Math.PI*2);ctx.fill(); }
    ctx.restore();
  }
  function drawCustomExplorer(bob) {
    ctx.scale(player.facing,1);ctx.translate(0,bob);ctx.fillStyle=customAvatar.accent;ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1.5;ctx.beginPath();if(ctx.roundRect)ctx.roundRect(-16,-34,32,38,10);else ctx.rect(-16,-34,32,38);ctx.fill();ctx.stroke();ctx.fillStyle=customAvatar.skin;ctx.beginPath();ctx.arc(0,-43,13,0,Math.PI*2);ctx.fill();ctx.fillStyle=customAvatar.hairColor;ctx.beginPath();ctx.arc(0,-47,13,Math.PI,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(-4,-42,2.5,0,Math.PI*2);ctx.arc(4,-42,2.5,0,Math.PI*2);ctx.fill();ctx.fillStyle='#15294b';ctx.fillRect(-15,2,12,19);ctx.fillRect(3,2,12,19);ctx.fillStyle='#fff36b';ctx.font='bold 15px system-ui';ctx.textAlign='center';ctx.fillText('★',0,-10);
  }
  function update(dt) {
    let dx=0,dy=0;if(keys.has('ArrowUp')||keys.has('w'))dy--;if(keys.has('ArrowDown')||keys.has('s'))dy++;if(keys.has('ArrowLeft')||keys.has('a'))dx--;if(keys.has('ArrowRight')||keys.has('d'))dx++;player.moving=Boolean(dx||dy);if(dx)player.facing=dx>0?1:-1;if(dx||dy)move(dx,dy,dt);
    const n=nearestTrace();const traceDistance=n?Math.hypot(player.x-n.x,player.y-n.y):400;const miniDistances=miniMissions.filter(m=>!m.complete).map(m=>Math.hypot(player.x-m.x,player.y-m.y));const d=Math.min(traceDistance,...miniDistances,400);scannerPower=Math.max(8,Math.min(100,112-d/2));ui.scanner.style.width=`${scannerPower}%`;ui.scan.classList.toggle('ready',scannerPower>70);
  }
  function loop(time) { if(!running)return;const dt=Math.min(.035,(time-last)/1000||0);last=time;if(!paused)update(dt);drawGrid(time);drawWalls(time);drawMiniMissions(time);drawTraces(time);drawPlayer(time);animationId=requestAnimationFrame(loop); }
  function start() { reset(); if(selectedCharacter==='explorer')refreshAvatarSprite(); startMusic(); playOriginalSequence(['letsGo'], 'Let’s go!'); ui.briefing.hidden=true;ui.analysis.hidden=true;ui.complete.hidden=true;ui.stage.hidden=false;running=true;paused=false;last=performance.now();animationId=requestAnimationFrame(loop); }
  function setMove(direction,on){const map={up:'ArrowUp',down:'ArrowDown',left:'ArrowLeft',right:'ArrowRight'};on?keys.add(map[direction]):keys.delete(map[direction]);}
  $('#startMission').addEventListener('click',start); $('#replayMission').addEventListener('click',start); ui.scan.addEventListener('click',scan);
  $('#playOrishWelcome').addEventListener('click',()=>playOriginalSequence(['welcomeOrishWorld','welcomeMyWorld','funAndLearn'], 'Welcome to Orish’s World. Welcome to my world. You can have fun and learn as you explore.'));
  $('#hearMissionVoice').addEventListener('click',()=>playOriginalSequence(['signalReturned','moveObservatory'], 'The signal has returned. Move through the observatory.'));
  document.addEventListener('keydown',e=>{if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d'].includes(e.key))e.preventDefault();if(e.key===' ')scan();else keys.add(e.key.toLowerCase()==='w'?'w':e.key.toLowerCase()==='a'?'a':e.key.toLowerCase()==='s'?'s':e.key.toLowerCase()==='d'?'d':e.key)});
  document.addEventListener('keyup',e=>keys.delete(e.key.length===1?e.key.toLowerCase():e.key));
  document.querySelectorAll('[data-move]').forEach(b=>{['pointerdown','touchstart'].forEach(evt=>b.addEventListener(evt,e=>{e.preventDefault();setMove(b.dataset.move,true)}));['pointerup','pointerleave','pointercancel','touchend'].forEach(evt=>b.addEventListener(evt,()=>setMove(b.dataset.move,false)))});
  document.querySelectorAll('[data-answer]').forEach(button=>button.addEventListener('click',()=>{const feedback=$('#analysisFeedback');if(button.dataset.answer==='signal'){feedback.textContent='Correct—the equal gaps show a repeating pulse. Mission solved.';feedback.style.color='#70f0bd';beep(980,.25);setTimeout(()=>{ui.analysis.hidden=true;ui.complete.hidden=false},700)}else{feedback.textContent='Good test, but that trace does not repeat evenly. Compare the gaps and try again.';feedback.style.color='#ffc857';beep(260,.16)}}));
  document.querySelectorAll('[data-speak]').forEach(button=>button.addEventListener('click',()=>speak(!phonicsGuideEnabled()&&button.dataset.plainSpeak?button.dataset.plainSpeak:button.dataset.speak)));
  $('.comms-speak').addEventListener('click',()=>speak(ui.comms.textContent));
  $('#miniSpeak').addEventListener('click',()=>activeMini&&speak(`${activeMini.speech} ${(phonicsGuideEnabled()?activeMini.choiceSpeech:activeMini.choicePlainSpeech).map((choice,index)=>`Choice ${['A','B','C'][index]}. ${choice}`).join(' ')}`));
  $('#miniClose').addEventListener('click',()=>{ $('#miniModal').hidden=true; paused=false; activeMini=null; last=performance.now(); ui.comms.textContent='Mini mission complete. Keep exploring for more clues.'; });
  document.querySelectorAll('[data-character]').forEach(button=>button.addEventListener('click',()=>{selectedCharacter=button.dataset.character;document.querySelectorAll('[data-character]').forEach(item=>item.classList.toggle('active',item===button));$('#avatarBuilder').hidden=selectedCharacter!=='explorer';if(selectedCharacter==='explorer'){renderAvatarDesigner();updateAvatarState({},false);}}));
  $('#avatarRealMode').addEventListener('click',()=>updateAvatarState({mode:'real',skin:AvatarLab?.NATURAL_SKINS.includes(customAvatar.skin)?customAvatar.skin:AvatarLab?.defaults.skin}));
  $('#avatarCreativeMode').addEventListener('click',()=>updateAvatarState({mode:'creative'}));
  $('#avatarSurprise').addEventListener('click',()=>{customAvatar=AvatarLab?.surprise(customAvatar.mode)||customAvatar;updateAvatarState({},true);});
  $('#avatarSave').addEventListener('click',()=>{customAvatar=AvatarLab?.save('demo',customAvatar)||customAvatar;updateAvatarState({},false);refreshAvatarSprite();$('#avatarSaveStatus').textContent='Saved privately on this device. This Explorer will enter the mission.';});
  window.addEventListener('orish-avatar:3d-ready',()=>{updateAvatarState({},false);refreshAvatarSprite();});
  renderAvatarDesigner();
  $('#openSignalGuide').addEventListener('click',()=>$('#signalGuide').hidden=false); $('#closeSignalGuide').addEventListener('click',()=>$('#signalGuide').hidden=true);
  $('#pauseButton').addEventListener('click',()=>{paused=true;ui.pause.hidden=false}); $('#resumeButton').addEventListener('click',()=>{paused=false;ui.pause.hidden=true;last=performance.now()});
  $('#soundToggle').addEventListener('click',e=>{soundOn=!soundOn;if(!soundOn)stopOriginalVoice();if(musicMaster&&audioContext)musicMaster.gain.setTargetAtTime(soundOn?.045:0,audioContext.currentTime,.18);e.currentTarget.textContent=soundOn?'♫':'×';e.currentTarget.setAttribute('aria-label',soundOn?'Mute music and sound':'Turn music and sound on')});
})();

(() => {
  'use strict';
  const SAVE_KEY='orish-fossil-detective-v1';
  const fossilNames=['flat tooth','strong leg bone','spine piece','tail bone','fossil leaf'];
  const fossilInfo=[
    {icon:'🦷',title:'A broad fossil tooth',copy:'Its wide, ridged surface worked like a small plant-grinder. Shape is evidence: broad teeth are useful for crushing tough leaves and stems.',history:'Iguanodon was named in 1825 after fossil teeth like these were compared with an iguana’s teeth—only much larger.'},
    {icon:'🦴',title:'A powerful leg bone',copy:'This thick weight-bearing bone supported a large body. Its joints show where the leg moved and connected.',history:'Scientists compare the shape and size of fossil bones with living animals to reconstruct how extinct animals stood and moved.'},
    {icon:'🦴',title:'Part of the backbone',copy:'These connected vertebrae protected the spinal cord and helped support the body. Repeating bones are a pattern clue.',history:'A fossil skeleton is rarely found perfectly complete. Palaeontologists compare matching vertebrae and other finds to rebuild the missing pattern.'},
    {icon:'🦴',title:'A chain of tail bones',copy:'The vertebrae become smaller toward the tail tip. The tail helped balance the animal as it moved.',history:'Early dinosaur reconstructions sometimes changed when new fossils were found. Scientific pictures improve when the evidence improves.'},
    {icon:'🌿',title:'A fossil leaf impression',copy:'This leaf is an environment clue. It shows that plants grew in the same ancient landscape, but it does not prove by itself what one dinosaur ate.',history:'Plants, pollen and rock layers help scientists reconstruct an ancient habitat as well as the animals that lived there.'}
  ];
  const guide=document.getElementById('guideText'), status=document.getElementById('statusLine');
  const pit=document.getElementById('digPit'), canvas=document.getElementById('sandCanvas');
  const ctx=canvas.getContext('2d'), marker=document.getElementById('scanMarker'), modal=document.getElementById('miniModal');
  const targets=[
    {x:.22,y:.31,name:'flat tooth'}, {x:.72,y:.27,name:'strong leg bone'},
    {x:.50,y:.51,name:'spine piece'}, {x:.73,y:.75,name:'tail bone'},
    {x:.24,y:.73,name:'fossil leaf'}
  ];
  const bonusFinds=[
    {icon:'✨',name:'ancient amber fleck',stars:8},
    {icon:'🔷',name:'canyon crystal',stars:10},
    {icon:'🌰',name:'fossilised seed',stars:12}
  ];
  let character='orish', phase='intro', stars=0, fossils=0, found=[], currentTarget=-1;
  let brushing=false, clearedAmount=0, lastPoint=null, wrongBrushWarned=false, pendingReveal=-1, selectedMatch='';
  let brushStreak=0,lastAccurateBrush=0,scanBusy=false,bonuses=[],latestBonus=null;
  let audioCtx=null, musicTimer=0, musicOn=false, currentSpeech='', sandNoiseBuffer=null, lastSandSound=0;

  const messages={
    training:'Move your finger gently over the glowing sand. Keep brushing until the practice fossil appears.',
    dig:'Press Pulse Scan. Then drag your finger over the glowing sand to uncover the fossil. Examine it, then scan for the next signal.',
    identify:'Look at the shape and purpose of each fossil. Evidence tells us more than guessing.',
    assemble:'Build from the centre outward: skull, spine, legs and tail.',
    evidence:'Flat teeth and fossil leaves are clues. What kind of food did this animal eat?'
  };

  function init(){
    document.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
    document.querySelectorAll('.character').forEach(b=>b.addEventListener('click',()=>{selectCharacter(b);startTraining();}));
    document.getElementById('startMission').addEventListener('click',startTraining);
    document.getElementById('guideSpeak').addEventListener('click',()=>speak(guide.textContent));
    document.getElementById('miniSpeak').addEventListener('click',()=>speak(currentSpeech));
    document.getElementById('scanButton').addEventListener('click',scan);
    document.getElementById('soundToggle').addEventListener('click',toggleSound);
    document.getElementById('findSpeak').addEventListener('click',()=>speak(currentSpeech));
    document.getElementById('keepEvidence').addEventListener('click',keepEvidence);
    pit.addEventListener('pointerdown',startBrush);
    pit.addEventListener('pointermove',moveBrush);
    pit.addEventListener('pointerup',endBrush);
    pit.addEventListener('pointercancel',endBrush);
    window.addEventListener('resize',positionMarker);
  }

  function selectCharacter(button){
    character=button.dataset.character;
    document.querySelectorAll('.character').forEach(b=>b.classList.toggle('active',b===button));
    document.getElementById('playerBadge').textContent=character==='orish'?'ORISH':'MY EXPLORER';
  }

  function startTraining(){
    if(phase!=='intro')return;
    enableSound();
    phase='training'; document.getElementById('introPanel').hidden=true; document.getElementById('gameShell').hidden=false;
    document.getElementById('missionName').textContent='Brush training';
    document.getElementById('stageTitle').textContent='Try the fossil brush';
    guide.textContent=messages.training; status.textContent='Drag gently across the glowing sand until the practice fossil appears.';
    currentTarget=2; clearedAmount=0; resetSand(); showMarker(); updateBrushMeter(); updateHud(); tone(420,.08,'sine');
    setTimeout(()=>document.getElementById('gameShell').scrollIntoView({behavior:'smooth'}),50);
  }

  function resetSand(){
    canvas.width=1536; canvas.height=1024;
    ctx.globalCompositeOperation='source-over';
    const g=ctx.createLinearGradient(0,0,0,canvas.height);
    g.addColorStop(0,'#d89b52'); g.addColorStop(.48,'#bd773f'); g.addColorStop(1,'#9e5d35');
    ctx.fillStyle=g; ctx.fillRect(0,0,canvas.width,canvas.height);
    let seed=713;
    const rand=()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646;};
    for(let i=0;i<4200;i++){
      const x=rand()*canvas.width,y=rand()*canvas.height,r=.6+rand()*3.2;
      ctx.fillStyle=rand()>.55?'rgba(255,220,145,.24)':'rgba(91,48,31,.18)';
      ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle='rgba(255,225,163,.12)';ctx.lineWidth=7;
    for(let y=36;y<canvas.height;y+=52){ctx.beginPath();ctx.moveTo(0,y);ctx.bezierCurveTo(420,y-22,930,y+25,1536,y-8);ctx.stroke();}
  }

  function pointFromEvent(event){
    const rect=pit.getBoundingClientRect();
    return{x:(event.clientX-rect.left)/rect.width*canvas.width,y:(event.clientY-rect.top)/rect.height*canvas.height};
  }

  function startBrush(event){
    if(currentTarget<0||!['training','dig'].includes(phase)){
      if(phase==='dig')wrong(pit,scanBusy?'Scanner sweep in progress. Watch the canyon floor.':'Press Pulse Scan before brushing the sand.');
      return;
    }
    brushing=true; wrongBrushWarned=false; lastPoint=pointFromEvent(event); pit.setPointerCapture?.(event.pointerId);
    brushAt(lastPoint,true); showBrushCursor(event);
  }

  function moveBrush(event){
    if(!brushing)return;
    const point=pointFromEvent(event); brushAt(point,false); lastPoint=point; showBrushCursor(event);
  }

  function endBrush(){brushing=false;lastPoint=null;document.getElementById('brushCursor').hidden=true;}

  function brushAt(point,isStart){
    if(currentTarget<0)return;
    const target=targets[currentTarget],tx=target.x*canvas.width,ty=target.y*canvas.height;
    const distance=Math.hypot(point.x-tx,point.y-ty);
    if(distance>225){
      brushStreak=0;
      if(!wrongBrushWarned){wrongBrushWarned=true;wrong(pit,'The scanner glow shows where to brush. Move your finger inside the glowing circle.');}
      return;
    }
    const from=lastPoint||point, travelled=Math.max(10,Math.hypot(point.x-from.x,point.y-from.y));
    const now=performance.now();brushStreak=now-lastAccurateBrush<420?brushStreak+1:1;lastAccurateBrush=now;
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=120;
    ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(point.x,point.y);ctx.stroke();
    ctx.beginPath();ctx.arc(point.x,point.y,62,0,Math.PI*2);ctx.fill();ctx.restore();
    clearedAmount+=isStart?18:Math.min(58,travelled*.72); stars+=travelled>18?1:0;
    dustAt(point); updateBrushMeter(); sandBrushSound(Math.min(1,travelled/55));
    const needed=phase==='training'?275:390;
    const percent=Math.min(100,Math.round(clearedAmount/needed*100));
    status.textContent=percent<100?`Sand cleared: ${percent}%. Keep brushing gently inside the glow.`:'Fossil uncovered!';
    if(brushStreak===5||brushStreak===9)showCombo(brushStreak===5?2:3);
    if(clearedAmount>=needed)finishReveal();
  }

  function beginDig(){
    phase='dig'; found=[]; fossils=0; currentTarget=-1; clearedAmount=0;brushStreak=0;scanBusy=false;bonuses=[];latestBonus=null;resetSand(); hideMarker();
    document.querySelectorAll('[data-evidence]').forEach(slot=>{slot.textContent='?';slot.classList.remove('collected');slot.removeAttribute('title');});
    document.getElementById('bonusCounter').textContent='✨ Bonus discoveries 0/3';
    document.getElementById('missionName').textContent='Canyon excavation';document.getElementById('stageTitle').textContent='Uncover five clues';
    guide.textContent=messages.dig;status.textContent='Step 1: press Pulse Scan to locate fossil signal 1.';updateBrushMeter();updateHud();
  }

  function finishReveal(){
    brushing=false;lastPoint=null;document.getElementById('brushCursor').hidden=true;
    const target=targets[currentTarget],tx=target.x*canvas.width,ty=target.y*canvas.height;
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(tx,ty,190,0,Math.PI*2);ctx.fill();ctx.restore();
    hideMarker(); tone(760,.18,'triangle');
    if(phase==='training'){
      currentTarget=-1;stars+=10;status.textContent='Practice fossil uncovered!';guide.textContent='Excellent brushing. Now scan the real dig, then clear only the glowing sand.';updateHud();setTimeout(beginDig,1100);return;
    }
    const revealed=currentTarget;found.push(revealed);fossils++;stars+=12;currentTarget=-1;clearedAmount=0;pendingReveal=revealed;
    latestBonus=[0,2,4].includes(revealed)?bonusFinds[[0,2,4].indexOf(revealed)]:null;
    if(latestBonus){bonuses.push(latestBonus);stars+=latestBonus.stars;document.getElementById('bonusCounter').textContent=`${latestBonus.icon} Bonus discoveries ${bonuses.length}/3`;}
    celebrateReveal(target,latestBonus);
    status.textContent=`Clue ${fossils}: ${fossilNames[revealed]} found.`;
    guide.textContent=`You uncovered a ${fossilNames[revealed]}. Let us examine what this clue means.`;
    updateBrushMeter();updateHud();setTimeout(()=>openFindCard(revealed),500);
  }

  function openFindCard(index){
    const info=fossilInfo[index],bonusSpeech=latestBonus?` Bonus discovery. You also found a ${latestBonus.name}, worth ${latestBonus.stars} stars.`:'';currentSpeech=`${info.title}. ${info.copy} History clue. ${info.history}${bonusSpeech}`;
    document.getElementById('findSymbol').textContent=info.icon;document.getElementById('findTitle').textContent=info.title;
    document.getElementById('findCopy').textContent=latestBonus?`${info.copy} ${latestBonus.icon} BONUS FIND: ${latestBonus.name} · +${latestBonus.stars} stars.`:info.copy;document.getElementById('findHistory').textContent=`HISTORY CLUE · ${info.history}`;
    document.getElementById('findModal').hidden=false;
  }

  function keepEvidence(){
    if(pendingReveal<0)return;const info=fossilInfo[pendingReveal],slot=document.querySelector(`[data-evidence="${pendingReveal}"]`);
    slot.textContent=info.icon;slot.title=info.title;slot.classList.add('collected');document.getElementById('findModal').hidden=true;pendingReveal=-1;
    tone(690,.12,'triangle');
    if(fossils===5){status.textContent='Evidence tray complete. Match every clue to where it belongs.';guide.textContent='Five clues collected. Now connect each fossil to the correct place in the reconstruction.';setTimeout(showCollection,550);}
    else{status.textContent=`Evidence saved. Press Pulse Scan to locate fossil signal ${fossils+1}.`;guide.textContent=`Evidence saved. Press Scan when you are ready for clue ${fossils+1}.`;}
  }

  function showMarker(){marker.hidden=false;positionMarker();pit.classList.add('scanning');setTimeout(()=>pit.classList.remove('scanning'),850);}
  function hideMarker(){marker.hidden=true;}
  function positionMarker(){
    if(currentTarget<0)return;const t=targets[currentTarget];marker.style.left=`${t.x*100}%`;marker.style.top=`${t.y*100}%`;
  }
  function updateBrushMeter(){
    const needed=phase==='training'?275:390;document.getElementById('brushPower').textContent=`${Math.min(100,Math.round(clearedAmount/needed*100))}%`;
  }
  function showBrushCursor(event){const rect=pit.getBoundingClientRect(),c=document.getElementById('brushCursor');c.hidden=false;c.style.left=`${event.clientX-rect.left}px`;c.style.top=`${event.clientY-rect.top}px`;}
  function dustAt(point){
    const d=document.createElement('i');d.className='sand-dust';d.style.left=`${point.x/canvas.width*100}%`;d.style.top=`${point.y/canvas.height*100}%`;pit.appendChild(d);setTimeout(()=>d.remove(),600);
  }

  function showCombo(multiplier){
    const toast=document.getElementById('comboToast');toast.textContent=`CAREFUL BRUSHING ×${multiplier} · +${multiplier} ★`;toast.hidden=false;stars+=multiplier;tone(620+multiplier*80,.1,'triangle');setTimeout(()=>toast.hidden=true,850);updateHud();
  }

  function celebrateReveal(target,bonus){
    const layer=document.getElementById('revealLayer'),burst=document.createElement('div');burst.className='reveal-celebration';burst.style.left=`${target.x*100}%`;burst.style.top=`${target.y*100}%`;burst.innerHTML=`<b>FOSSIL FOUND!</b><span>+12 ★${bonus?` · ${bonus.icon} BONUS!`:''}</span>`;
    for(let i=0;i<12;i++){const spark=document.createElement('i');spark.style.setProperty('--turn',`${i*30}deg`);burst.appendChild(spark);}layer.appendChild(burst);pit.classList.add('discovery-shake');navigator.vibrate?.([35,25,55]);setTimeout(()=>pit.classList.remove('discovery-shake'),450);setTimeout(()=>burst.remove(),1500);
  }

  function scan(){
    if(phase!=='dig'){status.textContent='Finish the short brush training first.';tone(120,.09,'square');return;}
    if(scanBusy){status.textContent='Scanner sweep in progress…';return;}
    if(currentTarget>=0){status.textContent='The scanner has already marked the sand. Drag your finger inside the glowing circle.';return;}
    const nextTarget=targets.findIndex((_,index)=>!found.includes(index));if(nextTarget<0){status.textContent='Every fossil signal has been uncovered.';return;}
    scanBusy=true;const button=document.getElementById('scanButton'),sweep=document.getElementById('scanSweep');button.disabled=true;button.innerHTML='⌁ SCANNING… <small>reading the canyon layers</small>';sweep.hidden=false;pit.classList.add('deep-scanning');status.textContent='Scanner pulse travelling across the canyon…';guide.textContent='Watch the blue scanner line. It is measuring changes beneath the sand.';tone(330,.12,'sine');
    setTimeout(()=>{currentTarget=nextTarget;clearedAmount=0;showMarker();updateBrushMeter();scanBusy=false;button.disabled=false;button.innerHTML='✦ Pulse scan <small>find the next dig patch</small>';sweep.hidden=true;pit.classList.remove('deep-scanning');status.textContent=`Signal ${fossils+1} locked. Brush inside the glowing ring.`;guide.textContent=`Signal ${fossils+1} locked. Move your finger back and forth like a careful fossil brush.`;tone(440,.1,'sine');setTimeout(()=>tone(720,.14,'triangle'),130);},850);
  }

  function showIdentify(){
    phase='identify';document.getElementById('missionName').textContent='Identify the clue';guide.textContent=messages.identify;
    openMini({eyebrow:'MINI MISSION 1 · BONE LAB',title:'Which fossil is a tooth?',copy:'A tooth helps an animal bite and chew. Look for the pointed shape.',speech:'Which fossil is a tooth? A tooth helps an animal bite and chew. Look for the pointed shape.',visual:'<span>🦴</span><span>🦷</span><span>🌿</span>',options:[['Long bone','bone'],['Pointed tooth','tooth'],['Fossil leaf','leaf']],answer:'tooth',next:showAssembly});
  }

  function showCollection(){
    phase='identify';document.getElementById('missionName').textContent='Connect the evidence';guide.textContent='Look at the complete evidence tray, then match every clue to its correct place.';
    openMini({eyebrow:'EVIDENCE TRAY COMPLETE',title:'What have you found?',copy:'A tooth, a leg bone, backbone pieces, tail bones and a fossil leaf. The bones connect to a body; the leaf connects to the ancient environment.',speech:'Your evidence tray has a tooth, a leg bone, backbone pieces, tail bones and a fossil leaf. Next, match each clue to where it belongs.',visual:'<span>🦷</span><span>🦴</span><span>🦴</span><span>🦴</span><span>🌿</span>',options:[['Start the matching mission','start']],answer:'start',next:showAssembly});
  }

  function showAssembly(){
    phase='assemble';selectedMatch='';document.getElementById('missionName').textContent='Match the fossils';guide.textContent='Tap one fossil clue, then tap the place where it belongs. Match all five.';
    modal.hidden=false;document.getElementById('miniEyebrow').textContent='PLAYABLE MINI MISSION · RECONSTRUCTION LAB';document.getElementById('miniTitle').textContent='Connect each fossil clue';
    document.getElementById('miniCopy').textContent='First choose a fossil. Then choose its correct body or environment location.';
    currentSpeech='Choose a fossil clue, then choose where it belongs. Match the tooth to the mouth, the leg bone to the leg, the spine to the back, the tail bones to the tail, and the fossil leaf to the environment.';
    document.getElementById('miniFeedback').textContent='Choose your first fossil clue.';
    document.getElementById('visualClue').innerHTML='<div class="match-board" aria-label="Dinosaur reconstruction locations"><button data-slot="tooth">MOUTH<br><small>chewing</small></button><button data-slot="spine">BACK<br><small>support</small></button><button data-slot="leg">LEG<br><small>movement</small></button><button data-slot="tail">TAIL<br><small>balance</small></button><button data-slot="leaf">ENVIRONMENT<br><small>ancient plants</small></button></div>';
    const holder=document.getElementById('miniOptions');holder.innerHTML='';holder.className='mini-options match-pieces';
    [['🦷','Flat tooth','tooth'],['🦴','Leg bone','leg'],['🦴','Spine piece','spine'],['🦴','Tail bones','tail'],['🌿','Fossil leaf','leaf']].forEach(([icon,label,value])=>{
      const button=document.createElement('button');button.type='button';button.dataset.piece=value;button.innerHTML=`<b>${icon}</b><span>${label}</span>`;
      button.addEventListener('click',()=>{if(button.classList.contains('matched'))return;selectedMatch=value;holder.querySelectorAll('button').forEach(b=>b.classList.toggle('selected',b===button));document.getElementById('miniFeedback').textContent=`${label} selected. Now choose where it belongs.`;tone(430,.07,'sine');});holder.appendChild(button);
    });
    document.querySelectorAll('[data-slot]').forEach(slot=>slot.addEventListener('click',()=>matchSlot(slot)));
  }

  function matchSlot(slot){
    if(slot.classList.contains('matched'))return;
    if(!selectedMatch){document.getElementById('miniFeedback').textContent='Choose a fossil clue first.';tone(105,.1,'square');return;}
    if(slot.dataset.slot!==selectedMatch){slot.classList.add('wrong');document.getElementById('miniFeedback').textContent='Those do not connect. Think about what job this fossil did, then try another place.';tone(105,.12,'square');setTimeout(()=>slot.classList.remove('wrong'),450);return;}
    const piece=document.querySelector(`[data-piece="${selectedMatch}"]`);piece.classList.add('matched');piece.classList.remove('selected');slot.classList.add('matched');slot.innerHTML=`✓ ${slot.innerHTML}`;stars+=8;selectedMatch='';tone(720,.12,'triangle');
    const count=document.querySelectorAll('[data-slot].matched').length;document.getElementById('miniFeedback').textContent=`Evidence connected: ${count} of 5.`;updateHud();
    if(count===5){document.getElementById('miniFeedback').textContent='All five clues connected. Your reconstruction is ready!';stars+=20;setTimeout(()=>{document.getElementById('miniOptions').className='mini-options';showEvidence();},850);}
  }

  function showEvidence(){
    phase='evidence';document.getElementById('missionName').textContent='Solve the fossil case';guide.textContent=messages.evidence;
    openMini({eyebrow:'FINAL MINI MISSION · HISTORY DESK',title:'What does the strongest evidence suggest?',copy:'Broad ridged teeth are strong diet evidence. The fossil leaf helps us picture the ancient environment, but does not prove one animal ate that leaf.',speech:'Broad ridged teeth are strong diet evidence. A fossil leaf helps us picture the ancient environment. What does the strongest evidence suggest this dinosaur ate?',visual:'<span>🦷</span><b>+</b><span>🌿</span>',options:[['Mostly plants','plants'],['Mostly rocks','rocks'],['Mostly fish','fish']],answer:'plants',next:complete});
  }

  function openMini(config){
    modal.hidden=false;document.getElementById('miniEyebrow').textContent=config.eyebrow;document.getElementById('miniTitle').textContent=config.title;document.getElementById('miniCopy').textContent=config.copy;document.getElementById('visualClue').innerHTML=config.visual;document.getElementById('miniFeedback').textContent='';currentSpeech=config.speech;
    const holder=document.getElementById('miniOptions');holder.innerHTML='';
    config.options.forEach(([label,value])=>{
      const wrap=document.createElement('div');wrap.className='option-wrap';const answer=document.createElement('button');answer.type='button';answer.textContent=label;
      const hear=document.createElement('button');hear.type='button';hear.className='option-speak';hear.textContent=`🔉 Hear “${label}”`;hear.addEventListener('click',()=>speak(label));
      answer.addEventListener('click',()=>chooseMini(answer,value,config));wrap.append(answer,hear);holder.appendChild(wrap);
    });
  }

  function chooseMini(button,value,config){
    const expected=typeof config.answer==='function'?config.answer():config.answer;
    if(value!==expected){button.classList.add('wrong');wrong(button,`Not this time. Use the visual clue and try again.`);setTimeout(()=>button.classList.remove('wrong'),450);return;}
    button.classList.add('correct');stars+=15;tone(720,.12,'triangle');setTimeout(()=>tone(920,.15,'triangle'),120);document.getElementById('miniFeedback').textContent='Evidence matched! Great detective work.';updateHud();
    const finished=config.onCorrect?.(value);if(finished)return;
    if(!config.keep)setTimeout(()=>{modal.hidden=true;config.next?.();},650);
  }

  function complete(){
    modal.hidden=true;phase='complete';stars=Math.max(110,stars);updateHud();document.getElementById('finalStars').textContent=`${stars} ★`;document.getElementById('finalBonus').textContent=`Fossil Detective badge · ${bonuses.length}/3 bonus discoveries`;document.getElementById('completion').hidden=false;save();navigator.vibrate?.([40,35,70,35,100]);tone(523,.14,'sine');setTimeout(()=>tone(659,.14,'sine'),150);setTimeout(()=>tone(784,.22,'triangle'),300);
  }

  function updateHud(){
    document.getElementById('fossilCount').textContent=fossils;document.getElementById('starCount').textContent=`${stars} ★`;
    const pct={intro:0,training:18,dig:28+fossils*8,identify:72,assemble:82,evidence:94,complete:100}[phase]||4;document.getElementById('progressBar').style.width=`${pct}%`;save();
  }

  function wrong(element,message){status.textContent=message;tone(105,.12,'square');element?.classList.add('wrong');setTimeout(()=>element?.classList.remove('wrong'),400);}
  function shuffle(list){for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({phase,stars,fossils,character,bonuses:bonuses.length,updated:Date.now()}));}catch{}}

  function speak(text){
    if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.rate=.88;u.pitch=1.04;u.lang='en-GB';window.speechSynthesis.speak(u);
  }

  function toggleSound(){
    musicOn=!musicOn;const b=document.getElementById('soundToggle');b.classList.toggle('active',musicOn);b.setAttribute('aria-label',musicOn?'Turn music and sounds off':'Turn music and sounds on');
    b.textContent=musicOn?'🔊':'🔇';
    if(musicOn){ensureAudio();playMusic();}else{clearInterval(musicTimer);musicTimer=0;audioCtx?.suspend();}
  }
  function enableSound(){
    if(musicOn)return;musicOn=true;const b=document.getElementById('soundToggle');b.classList.add('active');b.textContent='🔊';b.setAttribute('aria-label','Turn music and sounds off');ensureAudio();playMusic();
  }
  function ensureAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}
  function makeSandNoise(){
    ensureAudio();if(sandNoiseBuffer)return sandNoiseBuffer;const length=Math.floor(audioCtx.sampleRate*.12),buffer=audioCtx.createBuffer(1,length,audioCtx.sampleRate),data=buffer.getChannelData(0);let smooth=0;
    for(let i=0;i<length;i++){const grain=Math.random()*2-1;smooth=smooth*.72+grain*.28;data[i]=smooth*(1-i/length);}
    sandNoiseBuffer=buffer;return buffer;
  }
  function sandBrushSound(strength=.5){
    if(!musicOn)return;const now=performance.now();if(now-lastSandSound<72)return;lastSandSound=now;ensureAudio();
    const source=audioCtx.createBufferSource(),filter=audioCtx.createBiquadFilter(),gain=audioCtx.createGain();source.buffer=makeSandNoise();filter.type='bandpass';filter.frequency.value=920+Math.random()*420;filter.Q.value=.55;gain.gain.setValueAtTime(.018+.025*strength,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+.12);source.connect(filter).connect(gain).connect(audioCtx.destination);source.start();source.stop(audioCtx.currentTime+.13);
  }
  function tone(freq,duration=.08,type='sine',volume=.035){if(!musicOn)return;ensureAudio();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}
  function playMusic(){clearInterval(musicTimer);let n=0;const notes=[196,247,294,330,294,247,220,247];const pulse=()=>{tone(notes[n++%notes.length],.34,'sine',.018);};pulse();musicTimer=setInterval(pulse,620);}

  window.addEventListener('DOMContentLoaded',init,{once:true});
})();

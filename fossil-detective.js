(() => {
  'use strict';
  const SAVE_KEY='orish-fossil-detective-v1';
  const fossilNames=['flat tooth','strong leg bone','spine piece','tail bone','fossil leaf'];
  const guide=document.getElementById('guideText'), status=document.getElementById('statusLine');
  const pit=document.getElementById('digPit'), canvas=document.getElementById('sandCanvas');
  const ctx=canvas.getContext('2d'), marker=document.getElementById('scanMarker'), modal=document.getElementById('miniModal');
  const targets=[
    {x:.22,y:.31,name:'flat tooth'}, {x:.72,y:.27,name:'strong leg bone'},
    {x:.50,y:.51,name:'spine piece'}, {x:.73,y:.75,name:'tail bone'},
    {x:.24,y:.73,name:'fossil leaf'}
  ];
  let character='orish', phase='intro', stars=0, fossils=0, found=[], currentTarget=-1;
  let brushing=false, clearedAmount=0, lastPoint=null, wrongBrushWarned=false;
  let audioCtx=null, musicTimer=0, musicOn=false, currentSpeech='';

  const messages={
    training:'Move your finger gently over the glowing sand. Keep brushing until the practice fossil appears.',
    dig:'Press Pulse Scan. Then drag your finger over the glowing sand to uncover the fossil. Examine it, then scan for the next signal.',
    identify:'Look at the shape and purpose of each fossil. Evidence tells us more than guessing.',
    assemble:'Build from the centre outward: skull, spine, legs and tail.',
    evidence:'Flat teeth and fossil leaves are clues. What kind of food did this animal eat?'
  };

  function init(){
    document.querySelectorAll('[data-speak]').forEach(b=>b.addEventListener('click',()=>speak(b.dataset.speak)));
    document.querySelectorAll('.character').forEach(b=>b.addEventListener('click',()=>selectCharacter(b)));
    document.getElementById('startMission').addEventListener('click',startTraining);
    document.getElementById('guideSpeak').addEventListener('click',()=>speak(guide.textContent));
    document.getElementById('miniSpeak').addEventListener('click',()=>speak(currentSpeech));
    document.getElementById('scanButton').addEventListener('click',scan);
    document.getElementById('soundToggle').addEventListener('click',toggleSound);
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
      if(phase==='dig')wrong(pit,'Press Pulse Scan before brushing the sand.');
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
    const target=targets[currentTarget],tx=target.x*canvas.width,ty=target.y*canvas.height;
    const distance=Math.hypot(point.x-tx,point.y-ty);
    if(distance>185){
      if(!wrongBrushWarned){wrongBrushWarned=true;wrong(pit,'The scanner glow shows where to brush. Move your finger inside the glowing circle.');}
      return;
    }
    const from=lastPoint||point, travelled=Math.max(10,Math.hypot(point.x-from.x,point.y-from.y));
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.lineCap='round';ctx.lineJoin='round';ctx.lineWidth=92;
    ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(point.x,point.y);ctx.stroke();
    ctx.beginPath();ctx.arc(point.x,point.y,48,0,Math.PI*2);ctx.fill();ctx.restore();
    clearedAmount+=isStart?12:Math.min(42,travelled*.55); stars+=travelled>18?1:0;
    dustAt(point); updateBrushMeter(); tone(145+Math.random()*34,.035,'sine',.012);
    const needed=phase==='training'?470:600;
    if(clearedAmount>=needed)finishReveal();
  }

  function beginDig(){
    phase='dig'; found=[]; fossils=0; currentTarget=-1; clearedAmount=0; resetSand(); hideMarker();
    document.getElementById('missionName').textContent='Canyon excavation';document.getElementById('stageTitle').textContent='Uncover five clues';
    guide.textContent=messages.dig;status.textContent='Step 1: press Pulse Scan to locate fossil signal 1.';updateBrushMeter();updateHud();
  }

  function finishReveal(){
    const target=targets[currentTarget],tx=target.x*canvas.width,ty=target.y*canvas.height;
    ctx.save();ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(tx,ty,190,0,Math.PI*2);ctx.fill();ctx.restore();
    hideMarker(); tone(760,.18,'triangle');
    if(phase==='training'){
      currentTarget=-1;stars+=10;status.textContent='Practice fossil uncovered!';guide.textContent='Excellent brushing. Now scan the real dig, then clear only the glowing sand.';updateHud();setTimeout(beginDig,1100);return;
    }
    const revealed=currentTarget;found.push(revealed);fossils++;stars+=12;currentTarget=-1;clearedAmount=0;
    status.textContent=`Clue ${fossils}: ${fossilNames[revealed]} found.`;
    guide.textContent=fossils<5?`You uncovered a ${fossilNames[revealed]}. Press Scan to find signal ${fossils+1}.`:'All five clues are collected. Now use them to solve the fossil case.';
    updateBrushMeter();updateHud();if(fossils===5)setTimeout(showIdentify,950);
  }

  function showMarker(){marker.hidden=false;positionMarker();pit.classList.add('scanning');setTimeout(()=>pit.classList.remove('scanning'),850);}
  function hideMarker(){marker.hidden=true;}
  function positionMarker(){
    if(currentTarget<0)return;const t=targets[currentTarget];marker.style.left=`${t.x*100}%`;marker.style.top=`${t.y*100}%`;
  }
  function updateBrushMeter(){
    const needed=phase==='training'?470:600;document.getElementById('brushPower').textContent=`${Math.min(100,Math.round(clearedAmount/needed*100))}%`;
  }
  function showBrushCursor(event){const rect=pit.getBoundingClientRect(),c=document.getElementById('brushCursor');c.hidden=false;c.style.left=`${event.clientX-rect.left}px`;c.style.top=`${event.clientY-rect.top}px`;}
  function dustAt(point){
    const d=document.createElement('i');d.className='sand-dust';d.style.left=`${point.x/canvas.width*100}%`;d.style.top=`${point.y/canvas.height*100}%`;pit.appendChild(d);setTimeout(()=>d.remove(),600);
  }

  function scan(){
    if(phase!=='dig'){status.textContent='Finish the short brush training first.';tone(120,.09,'square');return;}
    if(currentTarget>=0){status.textContent='The scanner has already marked the sand. Drag your finger inside the glowing circle.';return;}
    currentTarget=targets.findIndex((_,index)=>!found.includes(index));if(currentTarget<0){status.textContent='Every fossil signal has been uncovered.';return;}
    clearedAmount=0;showMarker();updateBrushMeter();status.textContent=`Signal ${fossils+1} found. Drag gently over the glowing sand.`;guide.textContent=`The cyan scanner ring marks signal ${fossils+1}. Move your finger back and forth like a careful fossil brush.`;tone(440,.1,'sine');setTimeout(()=>tone(660,.1,'sine'),130);
  }

  function showIdentify(){
    phase='identify';document.getElementById('missionName').textContent='Identify the clue';guide.textContent=messages.identify;
    openMini({eyebrow:'MINI MISSION 1 · BONE LAB',title:'Which fossil is a tooth?',copy:'A tooth helps an animal bite and chew. Look for the pointed shape.',speech:'Which fossil is a tooth? A tooth helps an animal bite and chew. Look for the pointed shape.',visual:'<span>🦴</span><span>🦷</span><span>🌿</span>',options:[['Long bone','bone'],['Pointed tooth','tooth'],['Fossil leaf','leaf']],answer:'tooth',next:showAssembly});
  }

  function showAssembly(){
    phase='assemble';document.getElementById('missionName').textContent='Rebuild the skeleton';guide.textContent=messages.assemble;
    let step=0;const order=['skull','spine','legs','tail'];
    openMini({eyebrow:'MINI MISSION 2 · REBUILD BAY',title:'Build the skeleton',copy:'Choose the next section, starting at the head and moving through the body.',speech:'Build from the centre outward. Start with the skull, then the spine, legs and tail.',visual:'<span id="buildView">○ · · ·</span>',options:[['Skull','skull'],['Spine','spine'],['Legs','legs'],['Tail','tail']],answer:()=>order[step],keep:true,onCorrect:(value)=>{step++;document.getElementById('buildView').textContent=['◉ · · ·','◉═ · ·','◉═╫ ·','◉═╫〰'][step-1];if(step===4){stars+=20;setTimeout(showEvidence,650);return true;}document.getElementById('miniFeedback').textContent=`Correct. Next: ${order[step]}.`;return false;}});
  }

  function showEvidence(){
    phase='evidence';document.getElementById('missionName').textContent='Solve the fossil case';guide.textContent=messages.evidence;
    openMini({eyebrow:'FINAL MINI MISSION · EVIDENCE DESK',title:'What did it eat?',copy:'The creature had broad, flat teeth. Fossil leaves were found beside its ribs.',speech:'The creature had broad flat teeth, and fossil leaves were found beside its ribs. What did it eat?',visual:'<span>🦷</span><b>+</b><span>🌿</span>',options:[['Mostly plants','plants'],['Mostly rocks','rocks'],['Mostly fish','fish']],answer:'plants',next:complete});
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
    modal.hidden=true;phase='complete';stars=Math.max(110,stars);updateHud();document.getElementById('completion').hidden=false;save();tone(523,.14,'sine');setTimeout(()=>tone(659,.14,'sine'),150);setTimeout(()=>tone(784,.22,'triangle'),300);
  }

  function updateHud(){
    document.getElementById('fossilCount').textContent=fossils;document.getElementById('starCount').textContent=`${stars} ★`;
    const pct={intro:0,training:18,dig:28+fossils*8,identify:72,assemble:82,evidence:94,complete:100}[phase]||4;document.getElementById('progressBar').style.width=`${pct}%`;save();
  }

  function wrong(element,message){status.textContent=message;tone(105,.12,'square');element?.classList.add('wrong');setTimeout(()=>element?.classList.remove('wrong'),400);}
  function shuffle(list){for(let i=list.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[list[i],list[j]]=[list[j],list[i]];}return list;}
  function save(){try{localStorage.setItem(SAVE_KEY,JSON.stringify({phase,stars,fossils,character,updated:Date.now()}));}catch{}}

  function speak(text){
    if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(String(text||''));u.rate=.88;u.pitch=1.04;u.lang='en-GB';window.speechSynthesis.speak(u);
  }

  function toggleSound(){
    musicOn=!musicOn;const b=document.getElementById('soundToggle');b.classList.toggle('active',musicOn);b.setAttribute('aria-label',musicOn?'Turn music and sounds off':'Turn music and sounds on');
    if(musicOn){ensureAudio();playMusic();}else{clearInterval(musicTimer);musicTimer=0;audioCtx?.suspend();}
  }
  function ensureAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}
  function tone(freq,duration=.08,type='sine',volume=.035){if(!musicOn)return;ensureAudio();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(volume,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration);}
  function playMusic(){clearInterval(musicTimer);let n=0;const notes=[196,247,294,330,294,247,220,247];const pulse=()=>{tone(notes[n++%notes.length],.34,'sine',.018);};pulse();musicTimer=setInterval(pulse,620);}

  window.addEventListener('DOMContentLoaded',init,{once:true});
})();

(() => {
  'use strict';
  const SAVE_KEY='orish-fossil-detective-v1';
  const fossilIcons=['🦴','🦷','🦴','🦴','🌿'];
  const guide=document.getElementById('guideText'), status=document.getElementById('statusLine');
  const grid=document.getElementById('digGrid'), modal=document.getElementById('miniModal');
  let character='orish', phase='intro', stars=0, fossils=0, trainingHits=0, found=[], tileState=[];
  let audioCtx=null, musicTimer=0, musicOn=false, currentSpeech='';

  const messages={
    training:'Tap the three glowing squares. Each careful brush removes one layer of sand.',
    dig:'Brush each patch carefully. A fossil needs three gentle brushes. Use the pulse scan if you need one clue.',
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
  }

  function selectCharacter(button){
    character=button.dataset.character;
    document.querySelectorAll('.character').forEach(b=>b.classList.toggle('active',b===button));
    document.getElementById('playerBadge').textContent=character==='orish'?'ORISH':'MY EXPLORER';
  }

  function startTraining(){
    phase='training'; document.getElementById('introPanel').hidden=true; document.getElementById('gameShell').hidden=false;
    renderTraining(); updateHud(); tone(420,.08,'sine');
    setTimeout(()=>document.getElementById('gameShell').scrollIntoView({behavior:'smooth'}),50);
  }

  function renderTraining(){
    grid.innerHTML=''; trainingHits=0; guide.textContent=messages.training; status.textContent='Find the three glowing practice squares.';
    document.getElementById('missionName').textContent='Brush training'; document.getElementById('stageTitle').textContent='Brush practice';
    for(let i=0;i<12;i++){
      const b=document.createElement('button'); b.type='button'; b.className='dig-tile'+([1,6,10].includes(i)?' training':'');
      b.innerHTML='<span>·</span>'; b.setAttribute('aria-label',`Sand square ${i+1}`);
      b.addEventListener('click',()=>brushTraining(b,[1,6,10].includes(i))); grid.appendChild(b);
    }
  }

  function brushTraining(tile,target){
    dust(tile);
    if(!target){wrong(tile,'That square is stable. Try one with a cyan glow.');return;}
    if(tile.classList.contains('cleared'))return;
    tile.classList.remove('training'); tile.classList.add('cleared'); tile.innerHTML='<span>✓</span>'; trainingHits++; stars+=5; tone(620,.1,'triangle');
    status.textContent=`Careful brushes: ${trainingHits} of 3`;
    if(trainingHits===3){guide.textContent='Training complete. Now the real excavation begins!';stars+=10;updateHud();setTimeout(beginDig,700);} else updateHud();
  }

  function beginDig(){
    phase='dig'; found=[]; fossils=0; tileState=Array.from({length:20},()=>({layers:3,fossil:-1}));
    const spots=shuffle([...Array(20).keys()]).slice(0,5); spots.forEach((spot,i)=>tileState[spot].fossil=i);
    document.getElementById('missionName').textContent='Canyon excavation';document.getElementById('stageTitle').textContent='Uncover five clues';
    guide.textContent=messages.dig;status.textContent='Each patch needs three careful brushes.';renderDig();updateHud();
  }

  function renderDig(){
    grid.innerHTML=''; tileState.forEach((state,i)=>{
      const b=document.createElement('button');b.type='button';b.className='dig-tile';b.dataset.index=i;b.innerHTML='<span>≈</span>';b.setAttribute('aria-label',`Excavation patch ${i+1}, ${state.layers} sand layers`);
      b.addEventListener('click',()=>brushDig(b,i));grid.appendChild(b);
    });
  }

  function brushDig(tile,index){
    const state=tileState[index]; if(state.layers<=0)return; dust(tile);state.layers--;stars+=1;tone(180+state.layers*55,.045,'sine');
    tile.classList.add('brushed');tile.innerHTML=`<span>${state.layers?['','◌','≈'][state.layers-1]:'·'}</span>`;tile.setAttribute('aria-label',`Excavation patch ${index+1}, ${state.layers} sand layers`);
    document.getElementById('brushPower').textContent=`${Math.max(36,100-Math.round(tileState.filter(t=>t.layers<3).length*2.4))}%`;
    if(state.layers===0){tile.classList.add('cleared');if(state.fossil>=0){tile.classList.add('found');tile.innerHTML=`<span>${fossilIcons[state.fossil]}</span>`;found.push(state.fossil);fossils++;stars+=12;tone(760,.18,'triangle');status.textContent=`Fossil clue ${fossils} found!`;guide.textContent=fossils<5?'Excellent. Keep checking nearby layers.':'All five pieces found. Time to investigate the evidence.';}}
    updateHud(); if(fossils===5)setTimeout(showIdentify,800);
  }

  function scan(){
    if(phase!=='dig'){status.textContent='The pulse scan becomes available during the full excavation.';tone(120,.09,'square');return;}
    const target=tileState.findIndex(t=>t.fossil>=0&&t.layers>0);if(target<0){status.textContent='Every fossil signal has already been uncovered.';return;}
    const tile=grid.children[target];tile.classList.add('training');setTimeout(()=>tile.classList.remove('training'),2200);status.textContent='Pulse detected! Check the glowing patch.';tone(440,.1,'sine');setTimeout(()=>tone(660,.1,'sine'),130);
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
    const pct={intro:0,training:8+trainingHits*7,dig:28+fossils*8,identify:72,assemble:82,evidence:94,complete:100}[phase]||4;document.getElementById('progressBar').style.width=`${pct}%`;save();
  }

  function wrong(element,message){status.textContent=message;tone(105,.12,'square');element?.classList.add('wrong');setTimeout(()=>element?.classList.remove('wrong'),400);}
  function dust(tile){const d=document.createElement('i');d.className='dust';tile.appendChild(d);setTimeout(()=>d.remove(),520);}
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

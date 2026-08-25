(() => {
  'use strict';

  const Store=window.OrishSecurityStore;
  const Controls=window.OrishParentControls;
  const profile=Store?.getActiveProfile?.()||null;
  const profileId=profile?.id||'preview';
  const SAVE_KEY=`orish-life-city-v1:${profileId}`;
  const SUMMARY_KEY='orish-life-city-v1';
  const defaultState=()=>({started:false,complete:false,stageIndex:0,score:0,stars:0,metrics:{evidence:50,budget:50,access:50,resilience:50},decisions:[],evidenceRecorded:false,updated:Date.now()});
  let state=load();
  let soundOn=false,audioCtx=null;

  const stages=[
    {
      id:'training',tag:'TRAINING',eyebrow:'TRAINING // SOURCE CHECK',title:'Which source deserves the most trust?',
      copy:'The learning hub roof may be unsafe. Which source should carry the most weight when deciding whether repair work is required?',
      principle:['Evidence beats volume','A confident claim is not automatically reliable. Check source, method and relevance.'],
      guide:'Before the live case starts, prove that you can tell strong evidence from a loud claim.',
      visual:()=>`<div class="source-card"><b>A</b><div><small>AUDITED BUILDING REPORT</small><p>Inspection records visible water damage, weakened roof sections and a costed repair schedule.</p></div><span class="source-grade">METHOD + DATA</span></div><div class="source-card"><b>B</b><div><small>ANONYMOUS SOCIAL POST</small><p>“The roof is completely fine. Everyone is overreacting.” No evidence or author details supplied.</p></div><span class="source-grade">UNVERIFIED</span></div><div class="source-card"><b>C</b><div><small>LOCAL HEADLINE</small><p>“Hub crisis shocks district.” The article summarises arguments but does not include the inspection data.</p></div><span class="source-grade">SECONDARY</span></div>`,
      choices:[
        {label:'Use the audited inspection report',copy:'It directly examines the roof, explains the method and records the findings.',grade:'best',delta:{evidence:10},score:40,feedback:'Correct reasoning. The audited report is directly relevant and shows how the conclusion was reached.'},
        {label:'Use the anonymous social post',copy:'It sounds certain and is easy to understand.',grade:'poor',delta:{evidence:-8},score:5,feedback:'Weak evidence. Confidence is not a substitute for a named source, method or verifiable data.'},
        {label:'Use the headline alone',copy:'A published headline is enough to settle the issue.',grade:'weak',delta:{evidence:-3},score:15,feedback:'The article may help with context, but the underlying inspection is stronger evidence for the roof condition.'}
      ],
      live:false
    },
    {
      id:'evidence',tag:'STAGE 1',eyebrow:'LIVE CASE // EVIDENCE BOARD',title:'Build the evidence pack before spending anything.',
      copy:'The city needs to know whether the hub is needed, what repairs are required and whether evening access matters. Choose the strongest evidence bundle.',
      principle:['Triangulate before deciding','Strong decisions often use more than one relevant source. Different sources can answer different parts of the problem.'],
      guide:'Do not look for one source that proves everything. Build a pack where each source answers a different question.',
      visual:()=>`<div class="source-card"><b>01</b><div><small>BUILDING AUDIT</small><p>Urgent safe repair: 40 credits. Full long-term repair: 65 credits.</p></div><span class="source-grade">DIRECT</span></div><div class="source-card"><b>02</b><div><small>TRANSPORT DATA</small><p>63% of teen journeys to the hub after 17:00 use the district bus route.</p></div><span class="source-grade">RECORDED DATA</span></div><div class="source-card"><b>03</b><div><small>STUDENT SURVEY · 112 RESPONSES</small><p>71% say access between 18:00 and 21:00 would support study, training or projects.</p></div><span class="source-grade">SAMPLE</span></div><div class="source-card"><b>04</b><div><small>SPONSOR OFFER</small><p>20 credits available if the hub hosts one free public learning event.</p></div><span class="source-grade">CONDITION</span></div><div class="source-card"><b>05</b><div><small>ANONYMOUS POST</small><p>“Nobody even uses the bus anymore.” No source attached.</p></div><span class="source-grade">UNVERIFIED</span></div>`,
      choices:[
        {label:'Audit + transport data + student survey',copy:'Covers safety, access and demonstrated demand using three relevant sources.',grade:'best',delta:{evidence:18,access:8},score:150,feedback:'Strong pack. You used different evidence for three different questions instead of forcing one source to do everything.'},
        {label:'Audit + sponsor offer + student survey',copy:'Good evidence, but it misses the strongest transport-access data.',grade:'weak',delta:{evidence:8,access:1},score:105,feedback:'Workable, but incomplete. The transport data matters because access can fail even when the building reopens.'},
        {label:'Headline + petition + anonymous posts',copy:'These show public feeling and are quick to collect.',grade:'poor',delta:{evidence:-12,access:-3},score:45,feedback:'You captured opinion but not enough verifiable evidence about safety, cost or actual access.'},
        {label:'Sponsor offer + anonymous post',copy:'Focus on money and the loudest public reaction.',grade:'poor',delta:{evidence:-15,budget:3},score:30,feedback:'A funding offer is useful, but it cannot replace evidence about the actual problem.'}
      ],
      live:true
    },
    {
      id:'budget',tag:'STAGE 2',eyebrow:'LIVE CASE // RESOURCE PLAN',title:'You have 100 credits. Pick a plan that can survive scrutiny.',
      copy:'Every plan spends exactly 100 credits. The difference is what it protects, what it delays and what risk it leaves behind.',
      principle:['Budgeting is prioritising','A budget is not only arithmetic. It records which risks and outcomes you chose to protect.'],
      guide:'Look past the total. Every option adds to 100. The real question is what the 100 credits are doing.',
      visual:()=>`<div class="budget-card"><small>KNOWN CONSTRAINTS</small><div class="budget-table"><div class="budget-row"><span>Urgent safe repair</span><strong>40</strong></div><div class="budget-row"><span>Temporary learning hall</span><strong>12</strong></div><div class="budget-row"><span>Evening transport support</span><strong>20</strong></div><div class="budget-row"><span>Recommended contingency</span><strong>20+</strong></div></div></div>`,
      choices:[
        {label:'Balanced reopening plan',copy:'40 repair · 12 temporary hall · 20 transport · 28 reserve.',grade:'best',delta:{budget:18,access:14,resilience:16},score:190,feedback:'Strong strategy. It meets the urgent repair, keeps learning going, protects evening access and leaves a real contingency.'},
        {label:'Full repair immediately',copy:'65 full repair · 15 transport · 0 temporary hall · 20 reserve.',grade:'weak',delta:{budget:9,access:-8,resilience:8},score:125,feedback:'Financially defensible, but access drops while the hub stays closed and transport support is reduced.'},
        {label:'High-visibility launch plan',copy:'20 repair · 12 temporary hall · 38 transport · 20 event · 10 reserve.',grade:'poor',delta:{budget:-15,access:6,resilience:-15},score:55,feedback:'The plan is visible and active, but it underfunds the known safety repair and leaves a thin reserve.'},
        {label:'Repair-only plan',copy:'65 full repair · 0 temporary hall · 0 transport · 35 reserve.',grade:'weak',delta:{budget:12,access:-18,resilience:12},score:95,feedback:'The building gets protected, but the strategy ignores the evidence that transport and continuity affect who can actually use it.'}
      ],
      live:true
    },
    {
      id:'shock',tag:'STAGE 3',eyebrow:'PRESSURE EVENT // COST SHOCK',title:'The urgent repair rises by 10 credits after hidden damage is found.',
      copy:'You must absorb the extra cost. Your earlier plan matters now because a resilient system expects some uncertainty.',
      principle:['Reserves buy options','Contingency is not wasted money. It reduces the damage caused by surprises.'],
      guide:'This is why the case tracked resilience separately from budget. Choose what you protect when the plan is hit by new information.',
      visual:()=>`<div class="crisis-card"><small>NEW VERIFIED INFORMATION</small><h3>Repair requirement: +10 credits</h3><p>The contractor documents concealed water damage behind a roof panel. The extra work is required for the urgent safe repair.</p></div>`,
      choices:[
        {label:'Use 10 credits from contingency',copy:'Keep the repair, temporary hall and transport plan intact.',grade:'best',delta:{budget:6,resilience:20,access:5,evidence:3},score:200,feedback:'That is what contingency is for. The surprise costs money, but it does not force the whole strategy to collapse.'},
        {label:'Accept the 20-credit sponsor offer',copy:'Cover the rise and keep 10 extra credits, while committing to a free public event.',grade:'weak',delta:{budget:12,resilience:8,access:5},score:145,feedback:'Reasonable, but it creates a new obligation. The funding is not free of conditions, so the commitment must be planned as well.'},
        {label:'Cut evening transport by 10',copy:'Keep every building cost unchanged and reduce access support.',grade:'poor',delta:{budget:4,access:-18,resilience:-4},score:70,feedback:'The numbers balance, but the cut contradicts the evidence showing evening transport is central to access.'},
        {label:'Ignore the extra repair for now',copy:'Keep the original budget and hope the damaged section lasts.',grade:'poor',delta:{budget:-10,resilience:-20,evidence:-8},score:20,feedback:'That rejects new verified safety information. A strategy has to update when the evidence changes.'}
      ],
      live:true
    },
    {
      id:'civic',tag:'STAGE 4',eyebrow:'PUBLIC DECISION // CIVIC TRADE-OFF',title:'A petition asks for the hub to stay open until midnight.',
      copy:'The petition has 430 signatures. The student survey shows strongest demand from 18:00–21:00, and current staffing can safely cover until 21:00. What should the first policy be?',
      principle:['Public voice + workable evidence','Participation matters, but a public decision still has to be deliverable, reviewable and open to new evidence.'],
      guide:'Do not confuse listening with automatically granting the loudest request. A strong civic response can listen, test and review.',
      visual:()=>`<div class="civic-card"><small>PUBLIC INPUT</small><h3>430-signature petition: “Open until midnight.”</h3><p>Other evidence: strongest measured demand ends around 21:00 · staffing currently supports a 21:00 close · no late-night transport study has been completed.</p></div>`,
      choices:[
        {label:'Pilot 18:00–21:00, measure demand, then review',copy:'Publish the evidence, collect attendance and transport data, and reconsider later hours with new staffing evidence.',grade:'best',delta:{evidence:16,budget:6,access:14,resilience:12},score:220,feedback:'Strong civic decision. It responds to public demand, stays within current evidence and builds a route for the policy to change.'},
        {label:'Open until midnight immediately',copy:'The petition has many signatures, so implement the full request now.',grade:'poor',delta:{access:8,budget:-12,resilience:-15,evidence:-8},score:75,feedback:'You responded to public pressure, but moved beyond the current staffing and transport evidence without a test.'},
        {label:'Keep the hub closed in the evening',copy:'Avoid all staffing and transport uncertainty.',grade:'poor',delta:{budget:8,access:-25,resilience:2},score:45,feedback:'Low operational risk, but it ignores strong evidence of evening demand and undermines the purpose of reopening.'},
        {label:'Ignore the petition and choose 21:00 privately',copy:'Use the survey but do not explain the decision or review it.',grade:'weak',delta:{evidence:5,access:7,resilience:2},score:110,feedback:'The hours may be sensible, but accountable decisions should explain the evidence and show how public input was considered.'}
      ],
      live:true
    }
  ];

  function load(){
    if(new URLSearchParams(location.search).has('replay')){try{localStorage.removeItem(SAVE_KEY);}catch{}return defaultState();}
    try{return{...defaultState(),...JSON.parse(localStorage.getItem(SAVE_KEY)||'{}')}}catch{return defaultState()}
  }
  function save(){state.updated=Date.now();try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));}catch{}}
  function clamp(value){return Math.max(0,Math.min(100,Math.round(value)))}
  function applyDelta(delta={}){Object.entries(delta).forEach(([key,value])=>{state.metrics[key]=clamp((state.metrics[key]||0)+value)});}

  function init(){
    document.querySelectorAll('[data-speak]').forEach(button=>button.addEventListener('click',()=>speak(button.dataset.speak)));
    document.getElementById('soundToggle').addEventListener('click',toggleSound);
    document.getElementById('guideSpeak').addEventListener('click',()=>speak(document.getElementById('guideText').textContent));
    document.getElementById('startMission').addEventListener('click',start);
    document.getElementById('continueButton').addEventListener('click',continueCase);
    applySpokenControl();
    if(state.complete){showCompletion();return;}
    if(state.started){showGame();renderStage(state.stageIndex);}
    updateHud();
    enforceAgeBand();
  }

  function enforceAgeBand(){
    const start=document.getElementById('startMission');
    if(!profile){start.disabled=true;start.textContent='Create an approved profile first';return;}
    if(profile.ageBand!=='13-16'){
      start.disabled=true;start.textContent='Select an Ages 14–16 profile';
      const note=document.createElement('p');note.className='safety-note';note.textContent='Life City is the Advanced Missions Level 1 for ages 14–16. A parent can select or create the correct age experience in Account.';start.closest('.hero-actions').after(note);
    }
  }

  function applySpokenControl(){
    if(!profile||!Controls)return;
    const settings=Controls.get(profile.id,profile.ageBand);
    if(settings.spokenSupport===false)document.querySelectorAll('.speak,#guideSpeak').forEach(button=>button.hidden=true);
  }

  function start(){
    if(!profile||profile.ageBand!=='13-16')return;
    state.started=true;save();showGame();renderStage(state.stageIndex);enableSound();
    setTimeout(()=>document.getElementById('gameShell').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}),50);
  }

  function showGame(){document.getElementById('introPanel').hidden=true;document.getElementById('gameShell').hidden=false;document.getElementById('completion').hidden=true;}

  function renderStage(index){
    if(index>=stages.length){complete();return;}
    const stage=stages[index];
    document.getElementById('stageName').textContent=stage.live?`Decision ${Math.min(4,index)}`:'Training';
    document.getElementById('stageEyebrow').textContent=stage.eyebrow;
    document.getElementById('stageTitle').textContent=stage.title;
    document.getElementById('stageCopy').textContent=stage.copy;
    document.getElementById('stageTag').textContent=stage.tag;
    document.getElementById('guideText').textContent=stage.guide;
    document.getElementById('principleTitle').textContent=stage.principle[0];
    document.getElementById('principleText').textContent=stage.principle[1];
    document.getElementById('stageVisual').innerHTML=stage.visual();
    const grid=document.getElementById('choiceGrid');grid.innerHTML='';
    stage.choices.forEach(choice=>{
      const button=document.createElement('button');button.type='button';button.innerHTML=`<b>${choice.label}</b><span>${choice.copy}</span>`;
      button.addEventListener('click',()=>resolveChoice(button,stage,choice));grid.appendChild(button);
    });
    const feedback=document.getElementById('feedback');feedback.textContent='Choose a strategy. Your decision cannot be changed after you continue.';feedback.className='feedback';
    document.getElementById('continueButton').hidden=true;
    updateHud();
  }

  function resolveChoice(button,stage,choice){
    const grid=document.getElementById('choiceGrid');if(grid.dataset.locked==='1')return;grid.dataset.locked='1';
    [...grid.querySelectorAll('button')].forEach(item=>{item.disabled=true;});
    button.classList.add(choice.grade==='best'?'correct':choice.grade==='weak'?'weak':'poor');
    applyDelta(choice.delta);state.score+=choice.score;
    if(stage.live)state.decisions.push({stage:stage.id,label:choice.label,grade:choice.grade});
    state.stageIndex+=1;save();
    const feedback=document.getElementById('feedback');feedback.textContent=choice.feedback;feedback.className=`feedback ${choice.grade==='best'?'good':choice.grade==='weak'?'caution':'bad'}`;
    document.getElementById('continueButton').textContent=state.stageIndex>=stages.length?'Close the case':'Continue case';document.getElementById('continueButton').hidden=false;
    tone(choice.grade==='best'?740:choice.grade==='weak'?430:180,.14,choice.grade==='best'?'triangle':'sine');
    updateHud();renderDecisionLog();
  }

  function continueCase(){
    document.getElementById('choiceGrid').dataset.locked='0';
    if(state.stageIndex>=stages.length)complete();else renderStage(state.stageIndex);
  }

  function renderDecisionLog(){
    const list=document.getElementById('decisionLog');
    if(!state.decisions.length){list.innerHTML='<li>No live decisions recorded yet.</li>';return;}
    const labels={evidence:'Evidence pack',budget:'Resource plan',shock:'Cost shock',civic:'Public policy'};
    list.innerHTML=state.decisions.map(item=>`<li><b>${labels[item.stage]||item.stage}:</b> ${escapeHtml(item.label)}</li>`).join('');
  }

  function updateHud(){
    const liveCount=state.decisions.length;
    document.getElementById('caseScore').textContent=state.score;
    document.getElementById('decisionCount').textContent=liveCount;
    document.getElementById('progressBar').style.width=`${Math.min(100,Math.round(state.stageIndex/stages.length*100))}%`;
    Object.entries(state.metrics).forEach(([key,value])=>{
      const valueNode=document.getElementById(`${key}Value`),bar=document.getElementById(`${key}Bar`);if(valueNode)valueNode.textContent=value;if(bar)bar.style.width=`${value}%`;
    });
    renderDecisionLog();
  }

  function complete(){
    const metricAverage=Object.values(state.metrics).reduce((sum,value)=>sum+value,0)/4;
    const decisionScore=Math.min(800,state.score);
    const finalScore=Math.max(0,Math.min(1000,Math.round(decisionScore+metricAverage*2)));
    state.score=finalScore;state.stars=Math.max(50,Math.round(finalScore/10));state.complete=true;state.started=true;save();
    try{localStorage.setItem(SUMMARY_KEY,JSON.stringify({profileId,stars:state.stars,score:finalScore,updated:Date.now()}));}catch{}
    if(!state.evidenceRecorded&&profile&&Store?.addEvidence){
      Store.addEvidence({subject:'Life skills',title:'Life City: Pressure Test',detail:'Completed an advanced strategy case using evidence quality, constrained budgeting, contingency planning and civic decision-making.',framework:'Advanced Missions · 14–16',objective:'Evaluate evidence, balance competing constraints, respond to new information and justify a workable public decision.',score:finalScore,total:1000,independence:'Independent strategy simulation'});
      state.evidenceRecorded=true;save();
    }
    showCompletion();
  }

  function showCompletion(){
    document.getElementById('introPanel').hidden=true;document.getElementById('gameShell').hidden=true;document.getElementById('completion').hidden=false;
    document.getElementById('finalScore').textContent=state.score;document.getElementById('finalStars').textContent=`${state.stars} ★`;
    const average=Object.values(state.metrics).reduce((sum,value)=>sum+value,0)/4;
    document.getElementById('badgeText').textContent=average>=82?'Systems Strategist badge':average>=68?'Life City Strategist badge':'Case Analyst badge';
    document.getElementById('finalMetrics').innerHTML=Object.entries(state.metrics).map(([key,value])=>`<span>${key.toUpperCase()} ${value}</span>`).join('');
    const best=Object.entries(state.metrics).sort((a,b)=>b[1]-a[1])[0],lowest=Object.entries(state.metrics).sort((a,b)=>a[1]-b[1])[0];
    document.getElementById('finalBrief').textContent=`Your strongest dimension was ${best[0]} (${best[1]}). Your biggest trade-off was ${lowest[0]} (${lowest[1]}). A stronger replay would try to improve the weakest dimension without sacrificing the evidence behind the decision.`;
    document.getElementById('completionTitle').textContent=state.score>=850?'You built a strategy that held together under pressure.':state.score>=650?'Your strategy worked, but the trade-offs were visible.':'The case exposed weak points—exactly what a pressure test is meant to do.';
  }

  function escapeHtml(value){return String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));}
  function speak(text){if(!('speechSynthesis'in window))return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(String(text||''));utterance.lang='en-GB';utterance.rate=.94;utterance.pitch=.98;speechSynthesis.speak(utterance);}
  function ensureAudio(){if(!audioCtx)audioCtx=new(window.AudioContext||window.webkitAudioContext)();if(audioCtx.state==='suspended')audioCtx.resume();}
  function tone(freq,duration=.1,type='sine',volume=.028){if(!soundOn)return;ensureAudio();const oscillator=audioCtx.createOscillator(),gain=audioCtx.createGain();oscillator.type=type;oscillator.frequency.value=freq;gain.gain.setValueAtTime(volume,audioCtx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);oscillator.connect(gain).connect(audioCtx.destination);oscillator.start();oscillator.stop(audioCtx.currentTime+duration);}
  function toggleSound(){soundOn=!soundOn;const button=document.getElementById('soundToggle');button.textContent=soundOn?'🔊':'🔇';button.classList.toggle('active',soundOn);button.setAttribute('aria-label',soundOn?'Turn sound off':'Turn sound on');if(soundOn){ensureAudio();tone(220,.12);setTimeout(()=>tone(330,.12),90);}else audioCtx?.suspend();}
  function enableSound(){if(soundOn)return;soundOn=true;const button=document.getElementById('soundToggle');button.textContent='🔊';button.classList.add('active');button.setAttribute('aria-label','Turn sound off');ensureAudio();tone(220,.12);setTimeout(()=>tone(330,.12),90);}

  addEventListener('pagehide',()=>{speechSynthesis?.cancel();audioCtx?.suspend();});
  addEventListener('DOMContentLoaded',init,{once:true});
})();

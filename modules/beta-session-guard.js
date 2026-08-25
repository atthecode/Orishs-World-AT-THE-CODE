(() => {
  'use strict';
  const USAGE_KEY='orish.beta.dailyUsage.v1',Store=window.OrishSecurityStore,Controls=window.OrishParentControls;
  const profileId=Store?.getActiveProfileId?.(); if(!profileId||!Controls)return;
  const profile=Store.getProfiles().find(item=>item.id===profileId); if(!profile)return;
  const controls=Controls.get(profile.id,profile.ageBand),schedule=controls.playSchedule||{start:'07:00',end:'09:00',dailyMinutes:30,bedtimeMode:false};
  const dateKey=new Date().toLocaleDateString('en-CA');
  function read(){try{return JSON.parse(localStorage.getItem(USAGE_KEY)||'{}')}catch{return{}}}
  function timeToMinutes(value){const[h,m]=String(value).split(':').map(Number);return h*60+m}
  function allowedNow(){const now=new Date().getHours()*60+new Date().getMinutes(),start=timeToMinutes(schedule.start),end=timeToMinutes(schedule.end);return end>=start?now>=start&&now<end:now>=start||now<end}
  function usedSeconds(){return Number(read()?.[dateKey]?.[profile.id]||0)}
  function save(seconds){const all=read();all[dateKey]||={};all[dateKey][profile.id]=seconds;localStorage.setItem(USAGE_KEY,JSON.stringify(all))}
  function overlay(title,copy){if(document.getElementById('betaLimitOverlay'))return;const box=document.createElement('div');box.id='betaLimitOverlay';box.className='beta-limit-overlay';box.innerHTML=`<div><span>⏳</span><p>BETA PLAY SCHEDULE</p><h2>${title}</h2><p>${copy}</p><a href="account.html">Grown-up: change play time</a><a href="premium-preview.html">Leave the play area</a></div>`;document.body.appendChild(box)}
  const style=document.createElement('style');style.textContent='.beta-time-pill{position:fixed;right:max(12px,env(safe-area-inset-right));top:max(12px,env(safe-area-inset-top));z-index:80;padding:8px 11px;border-radius:99px;background:#071f37e8;color:#fff;border:1px solid #64eadf;font:800 12px system-ui}.beta-limit-overlay{position:fixed;inset:0;z-index:9999;display:grid;place-items:center;padding:20px;background:#031528ed;color:#fff;font-family:system-ui}.beta-limit-overlay>div{width:min(480px,100%);padding:28px;border-radius:25px;background:#0b3558;border:1px solid #65ede2;text-align:center}.beta-limit-overlay span{font-size:3rem}.beta-limit-overlay h2{font-size:clamp(1.8rem,7vw,3rem);overflow-wrap:anywhere}.beta-limit-overlay p{line-height:1.5}.beta-limit-overlay a{display:block;margin-top:10px;padding:13px;border-radius:13px;background:#ffd96a;color:#10243c;font-weight:900;text-decoration:none}.beta-limit-overlay a+a{background:#fff;color:#10243c}';document.head.appendChild(style);
  if(!allowedNow()){overlay('It is not play time yet.',`Your grown-up chose ${schedule.start}–${schedule.end}. Orish will be ready during that time.`);return}
  const limitSeconds=Number(schedule.dailyMinutes||30)*60;if(usedSeconds()>=limitSeconds){overlay('Today’s beta time is complete.','Great exploring. Come back tomorrow, or try something away from the screen.');return}
  document.body.classList.toggle('orish-bedtime-mode',schedule.bedtimeMode===true);
  const pill=document.createElement('div');pill.className='beta-time-pill';pill.setAttribute('aria-live','polite');document.body.appendChild(pill);let last=Date.now();
  function tick(){if(document.hidden){last=Date.now();return}const now=Date.now(),elapsed=Math.min(5,Math.max(0,(now-last)/1000));last=now;const used=usedSeconds()+elapsed;save(used);const remaining=Math.max(0,limitSeconds-used);pill.textContent=`⏳ ${Math.ceil(remaining/60)} min beta time`;if(remaining<=0)overlay('Today’s beta time is complete.','Great exploring. Come back tomorrow, or try something away from the screen.')}
  tick();setInterval(tick,1000);addEventListener('pagehide',tick);window.OrishBetaSession={schedule,remainingSeconds:()=>Math.max(0,limitSeconds-usedSeconds())};
})();

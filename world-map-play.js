(() => {
  'use strict';
  const routes={
    '0-2':{icon:'🌈',title:'Parent & Me',copy:'Shared play with a grown-up.',href:'',state:'BUILDING'},
    '4-6':{icon:'📖',title:'Story Forest',copy:'Spoken visual mission for Early Explorers.',href:'',state:'BUILDING'},
    '7-9':{icon:'🦴',title:'Fossil Detective',copy:'Brush, scan, uncover fossils and solve the dinosaur case.',href:'fossil-detective.html',state:'PLAYABLE NOW'},
    '10-12':{icon:'🚀',title:'Space Signal',copy:'Move through the observatory, scan signals and solve the evidence mission.',href:'space-signal.html',state:'PLAYABLE NOW'},
    '13-16':{icon:'🏙️',title:'Life City: Pressure Test',copy:'Move through the city, scan evidence and solve a strategy case under pressure.',href:'life-city.html',state:'PLAYABLE NOW'}
  };
  function profile(){try{const id=localStorage.getItem('orish.activeProfile.v1')||'',profiles=JSON.parse(localStorage.getItem('orish.profiles.v1')||'[]');return profiles.find(p=>p.id===id)||null}catch{return null}}
  function init(){
    const p=profile(),card=document.getElementById('quickPlayCard'),icon=document.getElementById('quickPlayIcon'),title=document.getElementById('quickPlayTitle'),copy=document.getElementById('quickPlayCopy'),state=document.getElementById('quickPlayState'),link=document.getElementById('quickPlayLink'),toggle=document.getElementById('exploreWorldButton');
    if(!card||!link||!toggle)return;
    const route=routes[p?.ageBand]||routes['7-9'];icon.textContent=route.icon;title.textContent=route.title;copy.textContent=route.copy;state.textContent=route.state;
    link.href=route.href||'#';link.textContent=route.href?'PLAY NOW →':'NOT PLAYABLE YET';card.classList.toggle('quick-play-unavailable',!route.href);link.setAttribute('aria-disabled',String(!route.href));
    if(!route.href)link.addEventListener('click',event=>event.preventDefault());
    document.body.classList.add('simple-mode');
    toggle.addEventListener('click',()=>{const hidden=document.body.classList.toggle('simple-mode');toggle.textContent=hidden?'EXPLORE FULL WORLD':'HIDE FULL WORLD';if(!hidden)setTimeout(()=>document.getElementById('mapViewport')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}),30)});
  }
  addEventListener('DOMContentLoaded',init,{once:true});
})();
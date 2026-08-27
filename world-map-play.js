(() => {
  'use strict';
  const games={
    '0-2':[{icon:'🌈',title:'Parent & Me',copy:'Shared play with a grown-up.',href:'',state:'BUILDING'}],
    '4-6':[{icon:'📖',title:'Story Forest',copy:'Spoken visual mission for Early Explorers.',href:'',state:'BUILDING'}],
    '7-9':[{icon:'🦴',title:'Fossil Detective',copy:'Brush, scan, uncover fossils and solve the dinosaur case.',href:'fossil-detective.html',state:'PLAYABLE NOW'}],
    '10-12':[
      {icon:'🚀',title:'Space Signal',copy:'Move through the observatory, collect signals and solve the space evidence mission.',href:'space-signal.html',state:'PLAYABLE'},
      {icon:'📡',title:'Signal Detective',copy:'Explore three lab rooms, scan six anomalies and decode a hidden repeating transmission.',href:'signal-detective.html',state:'NEW · PLAYABLE'}
    ],
    '13-16':[
      {icon:'🏙️',title:'Life City: Pressure Test',copy:'Explore the city, gather evidence and solve a connected strategy case.',href:'life-city.html',state:'PLAYABLE'},
      {icon:'⚡',title:'Grid Rescue',copy:'Move through the city grid, stabilise failing systems and protect limited reserve energy.',href:'grid-rescue.html',state:'NEW · PLAYABLE'}
    ]
  };
  function profile(){try{const id=localStorage.getItem('orish.activeProfile.v1')||'',profiles=JSON.parse(localStorage.getItem('orish.profiles.v1')||'[]');return profiles.find(p=>p.id===id)||null}catch{return null}}
  function makeLibrary(list){
    const section=document.createElement('section');section.className='age-games';section.innerHTML='<div class="age-games-head"><small>YOUR PLAYABLE GAMES</small><h2>Choose a mission</h2><p>No need to use the full world map. Tap a game and play.</p></div><div class="age-games-grid"></div>';
    const grid=section.querySelector('.age-games-grid');
    list.forEach(game=>{const card=document.createElement(game.href?'a':'div');card.className=`age-game-card${game.href?'':' unavailable'}`;if(game.href)card.href=game.href;card.innerHTML=`<span class="age-game-icon">${game.icon}</span><small>${game.state}</small><h3>${game.title}</h3><p>${game.copy}</p><b>${game.href?'PLAY →':'COMING SOON'}</b>`;grid.appendChild(card)});
    document.querySelector('.quick-play')?.after(section);
  }
  function init(){
    const p=profile(),card=document.getElementById('quickPlayCard'),icon=document.getElementById('quickPlayIcon'),title=document.getElementById('quickPlayTitle'),copy=document.getElementById('quickPlayCopy'),state=document.getElementById('quickPlayState'),link=document.getElementById('quickPlayLink'),toggle=document.getElementById('exploreWorldButton');
    if(!card||!link||!toggle)return;
    const list=games[p?.ageBand]||games['7-9'],route=list[0];icon.textContent=route.icon;title.textContent=route.title;copy.textContent=route.copy;state.textContent=list.length>1?`${list.length} GAMES READY`:route.state;
    link.href=route.href||'#';link.textContent=route.href?'PLAY FEATURED GAME →':'NOT PLAYABLE YET';card.classList.toggle('quick-play-unavailable',!route.href);link.setAttribute('aria-disabled',String(!route.href));if(!route.href)link.addEventListener('click',event=>event.preventDefault());
    makeLibrary(list);document.body.classList.add('simple-mode');
    toggle.addEventListener('click',()=>{const hidden=document.body.classList.toggle('simple-mode');toggle.textContent=hidden?'EXPLORE FULL WORLD':'HIDE FULL WORLD';if(!hidden)setTimeout(()=>document.getElementById('mapViewport')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}),30)});
  }
  addEventListener('DOMContentLoaded',init,{once:true});
})();
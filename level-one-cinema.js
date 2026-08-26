(() => {
  'use strict';
  const KEY='orish.level1.signal.v1';
  const scenes=[
    {k:'SCENE 1 // EVIDENCE LAB',t:'The answer is not “alien”.',p:'The observatory found a destination, not a life-form. Orish checks the evidence twice before choosing the next mission.',o:'We know where the pulse points. We still don’t know what made it.'},
    {k:'SCENE 2 // FLIGHT PATH',t:'One world keeps appearing.',p:'Three direction checks line up with the same small planet. Its atmosphere, gravity and surface conditions are still mostly unknown.',o:'If we go, we go as investigators. We measure first and imagine second.'},
    {k:'SCENE 3 // APPROACH',t:'Echo Planet.',p:'The research craft enters orbit. A faint repeating pulse is still detectable below — and something on the surface is changing position.',o:'Landing site selected. New rule: if something moves, we observe before we decide what it is.'}
  ];
  let index=0;
  const kicker=document.getElementById('sceneKicker'),title=document.getElementById('sceneTitle'),text=document.getElementById('sceneText'),line=document.getElementById('orishLine'),next=document.getElementById('nextScene'),dots=[...document.querySelectorAll('.scene-dots i')];
  function markSeen(){try{const current=JSON.parse(localStorage.getItem(KEY)||'{}');localStorage.setItem(KEY,JSON.stringify({...current,cinemaSeen:true,updated:Date.now()}))}catch(_){}}
  function render(){const s=scenes[index];kicker.textContent=s.k;title.textContent=s.t;text.textContent=s.p;line.textContent=s.o;dots.forEach((dot,i)=>dot.classList.toggle('active',i===index));if(index===scenes.length-1){next.outerHTML='<a id="nextScene" href="echo-planet.html">LAND ON ECHO PLANET →</a>'}}
  next.addEventListener('click',()=>{if(index<scenes.length-1){index+=1;render();if(index===scenes.length-1)markSeen()}});
  render();
})();
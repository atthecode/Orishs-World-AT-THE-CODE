const CACHE='orish-world-v158-family-routine-gate';
const SHELL=[
  './','./index.html','./styles.css','./app.js','./manifest.webmanifest',
  './premium-preview.html','./premium-preview.css','./premium-preview-fixes.css','./premium-preview-additions.css','./premium-preview.js','./account.html','./account-v1.css','./account-schedule.css','./account-v1.js','./family-check-in.html','./family-check-in.css','./family-check-in.js',
  './world-map.html','./world-map.css','./world-map.js','./space-signal.html','./space-signal.css','./space-signal.js','./fossil-detective.html','./fossil-detective.css','./fossil-detective-fixes.css','./fossil-detective.js','./learning-cinema.html','./learning-cinema-v3.css','./learning-cinema-v3.js',
  './assets/orish-approved-hq.webp','./assets/orish-game-walk.webp','./assets/orish-world-map-v2.webp','./assets/orish-fossil-detective-v2.webp','./assets/fossil-dig-bed-v3.webp',
  './assets/audio/orish/welcome-orish-world.m4a','./assets/audio/orish/welcome-my-world.m4a','./assets/audio/orish/lets-go.m4a','./assets/audio/orish/fun-and-learn.m4a','./assets/audio/orish/signal-returned.m4a','./assets/audio/orish/move-through-observatory.m4a',
  './toy-portal/index.html','./toy-portal/styles.css','./toy-portal/app.js',
  './modules/security-store.js','./modules/beta-session-guard.js','./modules/curriculum-engine.js','./modules/age-game-engine.js','./modules/rewards-engine.js','./modules/profile-ui.js',
  './modules/mission-engine.js','./modules/routines-engine.js','./modules/kitchen-engine.js','./modules/maker-engine.js','./modules/creative-engine.js','./modules/visual-game-engine.js','./modules/family-engine.js',
  './modules/accessibility-engine.js','./modules/memory-game-engine.js','./modules/maths-game-engine.js','./modules/observation-game-engine.js','./modules/sequencing-game-engine.js','./modules/literacy-keyboard-engine.js','./modules/story-choice-engine.js','./modules/good-news-engine.js','./modules/parent-summary-engine.js','./modules/discovery-engine.js','./modules/life-skills-engine.js','./modules/global-history-engine.js','./modules/are-we-alone-engine.js','./modules/orish-intelligence-engine.js','./modules/parent-controls-engine.js','./modules/avatar-lab-engine.js','./modules/avatar-3d-viewer.js','./modules/open-voice-engine.js',
  './assets/models/avatar-base.glb','./assets/at-the-code-mark.webp','./assets/orish-explorer.webp','./assets/fossil-detective.webp','./assets/fraction-rescue.webp','./assets/learning-adventures.webp','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-192.png','./assets/icon-maskable-512.png','./assets/apple-touch-icon.png'
];
const SHELL_URLS=new Set(SHELL.map(item=>new URL(item,self.registration.scope).href));
self.addEventListener('install',(event)=>{event.waitUntil(caches.open(CACHE).then((cache)=>cache.addAll(SHELL)));self.skipWaiting();});
self.addEventListener('activate',(event)=>{event.waitUntil(caches.keys().then((keys)=>Promise.all(keys.filter((key)=>key!==CACHE).map((key)=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',(event)=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.includes('/api/')||url.pathname.includes('/private/')||url.pathname.includes('/parent-data/'))return;
  if(url.pathname.endsWith('/modules/avatar-3d-viewer.js')||url.pathname.endsWith('/modules/avatar-lab-engine.js')||url.pathname.endsWith('/assets/models/avatar-base.glb')){
    event.respondWith(fetch(event.request,{cache:'no-store'}).then((response)=>{const copy=response.clone();caches.open(CACHE).then((cache)=>cache.put(event.request,copy));return response;}).catch(()=>caches.match(event.request)));
    return;
  }
  if(event.request.mode==='navigate'){
    const fallback=url.pathname.includes('/toy-portal')?'./toy-portal/index.html':'./index.html';
    const pageKey=new URL(url.pathname,url.origin).href;
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(pageKey).then((page)=>page||caches.match(fallback))));
    return;
  }
  const shellKey=new URL(url.pathname,url.origin).href;
  if(!SHELL_URLS.has(shellKey))return;
  event.respondWith(caches.match(shellKey).then((cached)=>cached||fetch(event.request,{cache:'no-store'}).then((response)=>{const copy=response.clone();caches.open(CACHE).then((cache)=>cache.put(shellKey,copy));return response;})));
});

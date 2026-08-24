const CACHE='orish-world-v133-azure-original-character';
const SHELL=[
  './','./index.html','./styles.css','./app.js','./manifest.webmanifest',
  './toy-portal/index.html','./toy-portal/styles.css','./toy-portal/app.js',
  './modules/security-store.js','./modules/curriculum-engine.js','./modules/age-game-engine.js','./modules/rewards-engine.js','./modules/profile-ui.js',
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
    event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match(fallback)));
    return;
  }
  if(!SHELL_URLS.has(url.href))return;
  event.respondWith(caches.match(event.request).then((cached)=>cached||fetch(event.request,{cache:'no-store'})));
});

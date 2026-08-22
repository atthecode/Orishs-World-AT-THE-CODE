(() => {
  'use strict';

  const Store = window.OrishSecurityStore;
  const KEY = Store.KEYS.rewards;

  const badgeRules = [
    {id:'first', icon:'🌟', name:'First Discovery', description:'Complete the first learning activity.', test:p=>p.activities>=1},
    {id:'curious', icon:'🧭', name:'Curious Explorer', description:'Complete five different learning activities.', test:p=>p.activities>=5},
    {id:'science', icon:'🔬', name:'Science Scout', description:'Complete three science activities.', test:p=>p.science>=3},
    {id:'numbers', icon:'🧠', name:'Problem Solver', description:'Complete three maths activities.', test:p=>p.maths>=3},
    {id:'maker', icon:'🛠️', name:'Maker Mind', description:'Complete two design or making activities.', test:p=>p.maker>=2},
    {id:'missions', icon:'🚀', name:'Mission Explorer', description:'Complete three Mission HQ activities.', test:p=>p.missions>=3},
    {id:'trail', icon:'🏅', name:'Trailblazer', description:'Complete twelve different learning activities.', test:p=>p.activities>=12}
  ];

  const itemRules = [
    {id:'patch', icon:'🪡', name:'Explorer Patch', stars:3},
    {id:'lab', icon:'🥼', name:'Science Lab Badge', stars:8},
    {id:'visor', icon:'🕶️', name:'Stargazer Visor', stars:15},
    {id:'pack', icon:'🎒', name:'Creator Backpack', stars:25},
    {id:'room', icon:'🌌', name:'Cosmic Room Theme', stars:40}
  ];

  function readAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }

  function writeAll(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  function blank() {
    return {stars:0,activities:0,science:0,maths:0,maker:0,missions:0,history:[],badges:[],updatedAt:null};
  }

  function get(profileId = Store.getActiveProfileId()) {
    if (!profileId) return blank();
    const data = readAll()[profileId] || blank();
    return {...blank(), ...data, history:Array.isArray(data.history)?data.history:[], badges:Array.isArray(data.badges)?data.badges:[]};
  }

  function dayKey(date = new Date()) { return date.toISOString().slice(0,10); }

  function classifySubject(subject='') {
    const s=String(subject).toLowerCase();
    return {
      science:s.includes('science'),
      maths:s.includes('math'),
      maker:s.includes('design') || s.includes('creative') || s.includes('making')
    };
  }

  function deriveBadges(progress) { return badgeRules.filter(rule=>rule.test(progress)).map(rule=>rule.id); }

  function unlockedItems(progress) { return itemRules.filter(item=>progress.stars>=item.stars).map(item=>item.id); }

  function recordActivity(profileId, activity) {
    if (!profileId) return {awarded:0,repeat:false,progress:blank(),newBadges:[]};
    const all = readAll();
    const progress = {...blank(), ...(all[profileId] || {})};
    progress.history = Array.isArray(progress.history) ? progress.history : [];
    progress.badges = Array.isArray(progress.badges) ? progress.badges : [];
    const today=dayKey();
    const title=Store.cleanText(activity.title || 'Learning activity',80);
    const type=Store.cleanText(activity.type || 'activity',30);
    const dedupe=`${today}:${type}:${title}`;
    if (progress.history.some(item=>item.dedupe===dedupe)) return {awarded:0,repeat:true,progress,newBadges:[]};

    const beforeBadges=new Set(progress.badges);
    let awarded = activity.shared ? 1 : 2;
    if (!activity.shared && Number.isFinite(activity.score) && Number.isFinite(activity.total) && activity.total>=3 && activity.score===activity.total) awarded += 1;

    progress.stars += awarded;
    progress.activities += 1;
    const subjectClass=classifySubject(activity.subject);
    if (subjectClass.science) progress.science += 1;
    if (subjectClass.maths) progress.maths += 1;
    if (subjectClass.maker) progress.maker += 1;
    if (type==='mission') progress.missions += 1;
    progress.history.unshift({
      id:crypto.randomUUID?crypto.randomUUID():`rw-${Date.now()}`,
      dedupe,
      createdAt:new Date().toISOString(),
      type,
      title,
      subject:Store.cleanText(activity.subject || 'Learning',40),
      stars:awarded
    });
    progress.history=progress.history.slice(0,80);
    progress.badges=deriveBadges(progress);
    progress.updatedAt=new Date().toISOString();
    all[profileId]=progress;
    writeAll(all);
    const newBadges=progress.badges.filter(id=>!beforeBadges.has(id));
    return {awarded,repeat:false,progress,newBadges};
  }

  function level(progress) { return 1 + Math.floor((progress.activities || 0) / 5); }

  function badgeDetails(progress) {
    const unlocked=new Set(progress.badges || []);
    return badgeRules.map(item=>({...item, unlocked:unlocked.has(item.id)}));
  }

  function itemDetails(progress) {
    const unlocked=new Set(unlockedItems(progress));
    return itemRules.map(item=>({...item, unlocked:unlocked.has(item.id)}));
  }

  window.OrishRewards={get,recordActivity,level,badgeDetails,itemDetails,badgeRules,itemRules};
})();

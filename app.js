(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const Store = window.OrishSecurityStore;
  const Curriculum = window.OrishCurriculum;
  const AgeGames = window.OrishAgeGames;
  const Rewards = window.OrishRewards;
  const ProfileUI = window.OrishProfileUI;
  const Mission = window.OrishMissionEngine;
  const Routines = window.OrishRoutines;
  const Kitchen = window.OrishKitchen;
  const Maker = window.OrishMaker;
  const Creative = window.OrishCreative;
  const VisualGames = window.OrishVisualGames;
  const Family = window.OrishFamily;
  const Accessibility = window.OrishAccessibility;
  const MemoryGames = window.OrishMemoryGame;
  const ObservationGames = window.OrishObservationGame;
  const SequenceGames = window.OrishSequencingGame;
  const Literacy = window.OrishLiteracyKeyboard;
  const StoryChoice = window.OrishStoryChoice;
  const Maths = window.OrishMaths;
  const GoodNews = window.OrishGoodNews;
  const ParentSummary = window.OrishParentSummary;
  const Discovery = window.OrishDiscovery;
  const LifeSkills = window.OrishLifeSkills;
  const Intelligence = window.OrishIntelligence;
  const ParentControls = window.OrishParentControls;
  const AvatarLab = window.OrishAvatarLab;
  const GlobalHistory = window.OrishGlobalHistory;
  const AreWeAlone = window.OrishAreWeAlone;
  const panels = ['landing','partnerDemo','childWorld','avatarPanel','orishPanel','gamePanel','sciencePanel','discoveryPanel','evidencePanel','globalHistoryPanel','areWeAlonePanel','lifeSkillsPanel','rewardsPanel','missionPanel','routinePanel','kitchenPanel','makerPanel','creativePanel','familyPanel','visualGamePanel','accessibilityPanel','memoryPanel','observationPanel','mathsPanel','sequencePanel','literacyPanel','storyPanel','goodNewsPanel','parentGateScreen','parentPanel'];

  const ageProfiles = {
    '0-2': { label:'Parent & Baby', tone:'Parent-led mode: rhymes, bonding, first words, gentle movement, sensory play and routines. No independent baby chatbot.', voice:'Hi grown-up. We can sing, look, listen and play together.' },
    '2-4': { label:'Early Explorer', tone:'Short spoken activities, songs, colours, counting, pretend play and simple choices with adult support.', voice:'Hello little explorer! Shall we sing, count, move or make something?' },
    '4-6': { label:'Little Explorer', tone:'Large visual controls, read-aloud, early literacy, maths, simple science and playful routine missions.', voice:'Ready for an adventure? I can make a game just for your level.' },
    '7-9': { label:'Growing Explorer', tone:'More independence, puzzles, science adventures, reading, maths, family missions and positive life-skills learning through play.', voice:'What are you curious about today? We can turn it into a mission.' },
    '10-12': { label:'Big Explorer', tone:'Mysteries, strategy, experiments, deeper science, life skills and longer multi-step missions.', voice:'Choose a challenge. We can investigate it, test ideas and build something from what we learn.' },
    '13-16': { label:'Teen Explorer', tone:'A more mature AT THE CODE experience with advanced science, technology, critical thinking, life skills and sophisticated missions.', voice:'Pick something worth solving. I can make the challenge more advanced if you want.' }
  };

  const worlds = {
    'Talk to Orish': 'Talk, ask questions, request a game, quiz, story or mission. V1 uses local scripted intelligence and free device speech; live AI can plug in later behind a secure gateway.',
    'Mission HQ': 'Daily missions mix learning with real life. Parent goals can become private-to-child adventures without exposing the adult wording.',
    'Science World': 'Explore space, fossils, weather, caves, minerals, oceans, plants and experiments — plus a Mysteries & Unexplained wing that tests Bermuda Triangle, strange signals, black holes and life-beyond-Earth claims against evidence.',
    'Evidence Detective': 'Learn how to use AI to ask better questions, check claims, find and compare sources, document evidence, state uncertainty and draw labelled investigation diagrams.',
    'Are We Alone?': 'Investigate extraterrestrial-life claims, exoplanets, UAP reports and what would actually count as proof — separating possibility, testimony, unresolved data and confirmation.',
    'Global History & Culture': 'Investigate real Black history, overlooked changemakers and cultures around the world through source-backed journeys, timelines, creative missions and evidence checks — all year, not as a seasonal add-on.',
    'Real-World Missions': 'Financial literacy and age-appropriate law/civics through games: saving, budgeting, comparison shopping, subscriptions, rights, rules, evidence and jurisdiction.',
    'Learning Adventures': 'Maths, reading, spelling, keyboard skills, observation, memory and logic scale with age and curriculum mapping.',
    'Maths Lab': 'Visual number play grows into fractions, money, measurement, geometry, graphs, probability, algebra and quantitative reasoning — without a speed race.',
    'Kitchen Lab': 'Parents enter ingredients first. Children only see realistic recipes and each step is tagged Child / Adult / Together.',
    'Make With Orish': 'Offline-first crafts and experiments: paper planes, origami, paper bridges, mini books, drawing, building and science tests.',
    'Family Clubhouse': 'Approved activities for parents, siblings, grandparents and other trusted family members — no public child social network.',
    'Home & Routines': 'Morning and bedtime routines become adventures with positive encouragement rather than shaming or punishment.',
    'Creative Studio': 'Draw, invent worlds, create comics, design rockets, make stories and complete offline creative challenges.',
    'My Avatar Lab': 'Create a private explorer avatar with inclusive natural skin tones or playful fantasy colours, hair, outfits and 360-degree rotation. No photo, camera or external branded character service is used in this prototype.',
    'Memory Lab': 'A reusable no-timer visual memory and matching engine. Pair content changes by age from shared picture matching to scientific reasoning concepts.',
    'Observation Lab': 'Hidden-object discovery and spot-the-change become evidence investigations as children grow. No camera, uploads, countdown or facial recognition.',
    'Logic Lab': 'Sequencing and planning challenges grow from simple first/next/last activities into scientific process design, dependencies and evaluation.',
    'Reading & Keyboard Lab': 'First words, phonics, spelling, comprehension, vocabulary, editing and keyboard habits scale from parent-led language play to mature evidence-based writing.',
    'Story & Choice Lab': 'Branching stories let choices change what happens next. Communication, routines, feelings, consequences, science mysteries and evidence reasoning appear naturally without behaviour scoring.',
    'Accessibility Centre': 'Change text size, contrast, motion, spacing, decorative visuals and spoken support without changing the learning goal.',
    'Good News': 'A calm, hopeful child-safe Beacon. V1.9 uses manually written demo cards only, with age-adaptive media-literacy prompts and no live feed.',
    'Rewards': 'Stars, badges, outfits and world items reward participation and learning without turning every good action into spending.'
  };

  const worldZones = {
    all: {title:'Choose a district', intro:'Everything is connected. Pick a district or show the whole world.'},
    core: {title:'Orish Core', intro:'Start with Orish, Mission HQ and the controls that shape the whole experience.'},
    discovery: {title:'Discovery District', intro:'Science, mysteries, evidence, global history, culture, observation and hopeful world discoveries live here.'},
    skills: {title:'Skills Academy', intro:'Maths, literacy, memory, logic and story challenges grow with the active age band.'},
    create: {title:'Create & Make', intro:'Build, draw, invent, cook and take learning away from the screen.'},
    life: {title:'Life & Family', intro:'Money, rights, routines and trusted family activities connect learning to everyday life.'}
  };

  let selectedZone = 'all';
  let demoAgeOverride = null;
  let showcaseSceneKey = 'origin';
  let showcaseTourTimer = null;
  let selectedWorld = null;
  let currentGame = null;
  let currentGameKey = null;
  let currentQuestion = 0;
  let score = 0;
  let gateFailures = 0;
  let gateBlockedUntil = 0;
  let currentMissionId = null;
  let currentRoutineType = null;
  let currentMakerProject = null;
  let currentCreativeChallenge = null;
  let currentVisualGame = null;
  let currentFamilyActivity = null;
  let selectedFamilyRole = 'parent';
  let familyQuestionIndex = 0;
  let selectedVisualCardId = null;
  let visualPlacedCount = 0;
  let visualErrors = 0;
  let currentRecipeId = null;
  let currentMemoryGame = null;
  let currentObservationGame = null;
  let currentSequenceGame = null;
  let currentLiteracyGame = null;
  let currentStoryGame = null;
  let currentMathsGame = null;
  let currentDiscovery = null;
  let currentLifeSkill = null;
  let historyMode = 'changemakers';
  let currentHistoryItem = null;
  let areWeAloneStages = [];
  let areWeAloneStageIndex = 0;
  let currentAreWeAloneStage = null;
  let evidenceLesson = null;
  let researchDrawing = false;
  let mathsRoundIndex = 0;
  let mathsCorrect = 0;
  let mathsAttempts = 0;
  let mathsHints = 0;
  let mathsSolved = false;
  let currentStoryNodeId = null;
  let storyChoiceCount = 0;
  let storyVisited = new Set();
  let literacyRoundIndex = 0;
  let literacyCorrect = 0;
  let literacyAttempts = 0;
  let literacyHints = 0;
  let literacySolved = false;
  let sequenceOrder = [];
  let sequenceAttempts = 0;
  let sequenceHints = 0;
  let observationFound = new Set();
  let observationMistakes = 0;
  let observationReasoningDone = false;
  let memoryOpen = [];
  let memoryMatched = new Set();
  let memoryTurns = 0;
  let memoryLocked = false;
  let cookStepIndex = 0;
  let cookTimerRemaining = 0;
  let cookTimerInterval = null;
  let selectedGoodNewsCategory = 'All';
  let currentGoodNewsStoryId = null;

  function show(id) {
    if (id !== 'avatarPanel') stopAvatarAutoSpin();
    panels.forEach(panelId => $(panelId)?.classList.toggle('hidden', panelId !== id));
    const dock = $('worldDock');
    const childFacing = !['landing','partnerDemo','parentGateScreen','parentPanel'].includes(id);
    if (dock) dock.classList.toggle('hidden', !childFacing);
    document.body.classList.toggle('world-dock-active', childFacing);
    window.scrollTo({top:0, behavior:'smooth'});
  }

  function activeAgeBand() {
    return demoAgeOverride || Store.getActiveProfile()?.ageBand || $('ageBand').value;
  }

  function activeFramework() {
    return Store.getActiveProfile()?.curriculum || 'custom';
  }

  function activeParentControls() {
    const profile = Store.getActiveProfile();
    return ParentControls.get(profile?.id, profile?.ageBand || activeAgeBand());
  }

  function featureAllowed(feature) {
    const profile = Store.getActiveProfile();
    if (!profile) return true;
    const controls = ParentControls.get(profile.id, profile.ageBand);
    const map = {
      kitchen: controls.kitchenLab,
      family: controls.familyClubhouse,
      goodNews: controls.goodNews,
      mission: controls.parentMissions
    };
    return map[feature] !== false;
  }

  function blockedFeatureMessage(label) {
    const profile = Store.getActiveProfile();
    const name = profile?.nickname || 'this explorer';
    return `${label} is currently turned off for ${name} in Parent Studio. A grown-up can change it in the Safety & Parent Controls Centre.`;
  }

  function say(text) {
    const profile = Store.getActiveProfile();
    const prefs = Accessibility.get(profile?.id);
    const controls = ParentControls.get(profile?.id, profile?.ageBand || activeAgeBand());
    if ((profile && !profile.readAloud) || !prefs.speechEnabled || !controls.spokenSupport) return;
    if (window.OrishOpenVoice?.canSelfHostedSpeak?.()) {
      window.OrishOpenVoice.speak(text).catch(() => fallbackBrowserSpeech(text));
      return;
    }
    fallbackBrowserSpeech(text);
  }

  function fallbackBrowserSpeech(text) {
    if (!('speechSynthesis' in window)) {
      if ($('orishStatus')) $('orishStatus').textContent = 'No local/self-hosted voice is connected and this browser does not provide speech playback.';
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const age = activeAgeBand();
    utterance.rate = ['0-2','2-4'].includes(age) ? .88 : 1;
    utterance.pitch = 1.04;
    window.speechSynthesis.speak(utterance);
  }

  function updateChildExperience() {
    const profile = Store.getActiveProfile();
    const age = demoAgeOverride || profile?.ageBand || $('ageBand').value;
    const ageProfile = ageProfiles[age];
    $('ageBand').value = age;
    $('ageBand').disabled = Boolean(profile) && !demoAgeOverride;
    $('ageMessage').textContent = ageProfile.tone;
    document.body.dataset.age = age;
    $('activeChildName').textContent = profile?.nickname || 'Explorer';
    $('activeChildFramework').textContent = demoAgeOverride ? 'Partner demo • age experience preview' : (profile ? Curriculum.getFrameworkName(profile.curriculum) : 'Demo age can be changed here');
    $('worldTitle').textContent = profile ? `${profile.nickname}, what shall we do?` : 'What shall we do?';
    Accessibility.apply(Accessibility.get(profile?.id));

    const babyMode = age === '0-2';
    const controls = ParentControls.get(profile?.id, age);
    const freeTextOff = babyMode || (profile && !controls.freeTextOrish);
    $('orishInput').disabled = freeTextOff;
    $('sendToOrish').disabled = freeTextOff;
    const voiceAllowed = Boolean(profile) && !babyMode && controls.twoWayVoice === true;
    if ($('voiceMicButton')) {
      $('voiceMicButton').disabled = !voiceAllowed || !window.OrishOpenVoice?.supportsRecording?.();
      $('voiceModeBadge').textContent = babyMode ? 'Parent-led only' : (voiceAllowed ? 'Enabled by grown-up' : 'Parent opt-in');
      if (!voiceAllowed) $('voiceGatewayStatus').textContent = babyMode
        ? 'For ages 0–2, Orish voice activities stay parent-led and the child microphone is locked off.'
        : 'Two-way microphone is off until a grown-up enables it in Parent Studio.';
      else if (!window.OrishOpenVoice?.supportsRecording?.()) $('voiceGatewayStatus').textContent = 'This browser cannot record a voice turn with the current prototype.';
      else $('voiceGatewayStatus').textContent = 'Voice is enabled. Tap the microphone when you want Orish to listen.';
    }
    if (babyMode) $('orishInput').placeholder = 'Parent-led mode — use the guided buttons above';
    else if (freeTextOff) $('orishInput').placeholder = 'Free-text Ask Orish is off in Parent Studio';
    else $('orishInput').placeholder = 'Type a safe prototype question…';
    if ($('orishIntelligenceStatus')) {
      const interestCount = profile?.interests?.length || 0;
      $('orishIntelligenceStatus').textContent = `${ageProfile.label} routing • ${Intelligence.getRoutes().length} approved pathways${interestCount ? ` • ${interestCount} local interests considered` : ''}`;
    }
    renderTodayCounts();
    renderWorldAvatarCompanion();
  }

  function selectWorldZone(zone) {
    selectedZone = worldZones[zone] ? zone : 'all';
    document.querySelectorAll('.world-portal').forEach(button => {
      const active = button.dataset.zone === selectedZone;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    document.querySelectorAll('#worldGrid .world-card').forEach(card => {
      card.classList.toggle('zone-hidden', selectedZone !== 'all' && card.dataset.zone !== selectedZone);
    });
    if ($('worldMapTitle')) $('worldMapTitle').textContent = worldZones[selectedZone].title;
    if ($('worldZoneIntro')) $('worldZoneIntro').textContent = worldZones[selectedZone].intro;
  }

  function previewWorld(name) {
    selectedWorld = name;
    $('previewTitle').textContent = name;
    $('previewText').textContent = worlds[name] || 'This area is part of the V1 world.';
    const featureMap = {'Kitchen Lab':'kitchen','Family Clubhouse':'family','Good News':'goodNews','Mission HQ':'mission'};
    const feature = featureMap[name];
    const allowed = !feature || featureAllowed(feature);
    $('previewAction').disabled = !allowed;
    $('previewAction').textContent = !allowed ? 'Turned off in Parent Studio' : (name === 'Talk to Orish' ? 'Talk to Orish' : 'Open V1 preview');
    if (!allowed) $('previewText').textContent = blockedFeatureMessage(name);
  }


  let avatarDraft = null;
  let avatarAngle = -8;
  let avatarDragging = false;
  let avatarDragX = 0;
  let avatarAutoFrame = null;
  let avatarLastFrame = 0;
  let worldAvatarPreviewData = '';

  const avatarHairLabels = {afro:'Afro',braids:'Braids',locs:'Locs',curls:'Curls',waves:'Waves',straight:'Straight'};
  const avatarOutfitLabels = {explorer:'Explorer',scientist:'Scientist',space:'Space',chef:'Chef',artist:'Artist'};
  const avatarOutfitIcons = {explorer:'🧭',scientist:'🔬',space:'🚀',chef:'🥣',artist:'🎨'};

  function avatarProfileId() { return Store.getActiveProfile()?.id || 'demo'; }

  function avatarColourName(colour, type='colour') {
    const fantasy = {'#17d7e8':'Cyan','#4f7cff':'Blue','#ff63b7':'Pink','#ff8d3b':'Orange','#9a6cff':'Purple','#57e6b1':'Mint'};
    return fantasy[colour] || `${type} option`;
  }

  function makeAvatarSwatch(colour, selected, label, onClick) {
    const button=document.createElement('button');
    button.type='button'; button.className=`avatar-swatch${selected?' selected':''}`;
    button.style.background=colour; button.setAttribute('aria-label',label); button.setAttribute('aria-pressed',String(selected));
    button.addEventListener('click',onClick); return button;
  }

  function setAvatarDraft(patch, {announce=false}={}) {
    avatarDraft=AvatarLab.normalize({...avatarDraft,...patch});
    avatarAngle=avatarDraft.angle;
    updateAvatarModel();
    renderAvatarControls();
    $('avatarSaveStatus').textContent=announce ? 'Changed — save when you are ready.' : 'Your changes are not saved yet.';
  }

  function updateAvatarModel() {
    if(!avatarDraft) return;
    const model=$('avatarModel'); if(!model) return;
    model.className=`avatar-model hair-${avatarDraft.hair} outfit-${avatarDraft.outfit}`;
    model.style.setProperty('--avatar-skin',avatarDraft.skin);
    model.style.setProperty('--avatar-hair',avatarDraft.hairColor);
    model.style.setProperty('--avatar-accent',avatarDraft.accent);
    model.style.setProperty('--avatar-angle',`${avatarAngle}deg`);
    const liveState={...avatarDraft,angle:avatarAngle};
    window.__orishAvatarState=liveState;
    window.dispatchEvent(new CustomEvent('orish-avatar:update',{detail:liveState}));
    const platform=$('avatarViewport')?.querySelector('.avatar-platform');
    if(platform) platform.style.setProperty('--avatar-accent',avatarDraft.accent);
  }

  function renderAvatarControls() {
    if(!avatarDraft) return;
    const creative=avatarDraft.mode==='creative';
    $('avatarRealMode').classList.toggle('active',!creative); $('avatarRealMode').setAttribute('aria-pressed',String(!creative));
    $('avatarCreativeMode').classList.toggle('active',creative); $('avatarCreativeMode').setAttribute('aria-pressed',String(creative));

    const skinHost=$('avatarSkinPalette'); skinHost.innerHTML='';
    const skins=creative?[...AvatarLab.NATURAL_SKINS,...AvatarLab.FANTASY_SKINS]:AvatarLab.NATURAL_SKINS;
    skins.forEach((colour,index)=>skinHost.appendChild(makeAvatarSwatch(colour,avatarDraft.skin===colour,avatarColourName(colour,`Skin tone ${index+1}`),()=>setAvatarDraft({skin:colour},{announce:true}))));

    const hairHost=$('avatarHairStyles'); hairHost.innerHTML='';
    AvatarLab.HAIR.forEach(style=>{
      const b=document.createElement('button'); b.type='button'; b.className=`avatar-choice${avatarDraft.hair===style?' selected':''}`; b.textContent=avatarHairLabels[style]||style; b.setAttribute('aria-pressed',String(avatarDraft.hair===style));
      b.addEventListener('click',()=>setAvatarDraft({hair:style},{announce:true})); hairHost.appendChild(b);
    });
    const hairColours=$('avatarHairPalette'); hairColours.innerHTML='';
    AvatarLab.HAIR_COLORS.forEach((colour,index)=>hairColours.appendChild(makeAvatarSwatch(colour,avatarDraft.hairColor===colour,avatarColourName(colour,`Hair colour ${index+1}`),()=>setAvatarDraft({hairColor:colour},{announce:true}))));

    const outfitHost=$('avatarOutfits'); outfitHost.innerHTML='';
    AvatarLab.OUTFITS.forEach(outfit=>{
      const b=document.createElement('button'); b.type='button'; b.className=`avatar-choice${avatarDraft.outfit===outfit?' selected':''}`; b.textContent=`${avatarOutfitIcons[outfit]||'✦'} ${avatarOutfitLabels[outfit]||outfit}`; b.setAttribute('aria-pressed',String(avatarDraft.outfit===outfit));
      b.addEventListener('click',()=>setAvatarDraft({outfit},{announce:true})); outfitHost.appendChild(b);
    });
    const accentHost=$('avatarAccentPalette'); accentHost.innerHTML='';
    AvatarLab.ACCENTS.forEach((colour,index)=>accentHost.appendChild(makeAvatarSwatch(colour,avatarDraft.accent===colour,avatarColourName(colour,`Accent colour ${index+1}`),()=>setAvatarDraft({accent:colour},{announce:true}))));
  }

  function renderAvatarLab() {
    avatarDraft=AvatarLab.get(avatarProfileId()); avatarAngle=avatarDraft.angle;
    updateAvatarModel(); renderAvatarControls();
    const profile=Store.getActiveProfile();
    $('avatarTitle').textContent=profile ? `${profile.nickname}, create your explorer` : 'Create your explorer';
    $('avatarSaveStatus').textContent=avatarDraft.updatedAt ? 'Your saved avatar is loaded.' : 'Create your explorer and save it when you are ready.';
    $('avatarAutoSpin').setAttribute('aria-pressed','false'); $('avatarAutoSpin').textContent='↻ Auto spin';
    playAvatarPose('idle');
  }

  function rotateAvatar(delta) {
    stopAvatarAutoSpin(false); avatarAngle+=delta; avatarDraft={...avatarDraft,angle:avatarAngle}; updateAvatarModel();
    $('avatarSaveStatus').textContent='View changed — your design choices are ready to save.';
  }

  function stopAvatarAutoSpin(updateButton=true) {
    if(avatarAutoFrame) cancelAnimationFrame(avatarAutoFrame); avatarAutoFrame=null; avatarLastFrame=0;
    if(updateButton && $('avatarAutoSpin')) { $('avatarAutoSpin').setAttribute('aria-pressed','false'); $('avatarAutoSpin').textContent='↻ Auto spin'; }
  }

  function startAvatarAutoSpin() {
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){ $('avatarSaveStatus').textContent='Auto spin is off because reduced motion is enabled.'; return; }
    stopAvatarAutoSpin(false); $('avatarAutoSpin').setAttribute('aria-pressed','true'); $('avatarAutoSpin').textContent='■ Stop spin';
    const tick=(time)=>{ if(!avatarAutoFrame) return; if(!avatarLastFrame) avatarLastFrame=time; const dt=Math.min(40,time-avatarLastFrame); avatarLastFrame=time; avatarAngle+=(dt*.035); if(avatarDraft) avatarDraft={...avatarDraft,angle:avatarAngle}; updateAvatarModel(); avatarAutoFrame=requestAnimationFrame(tick); };
    avatarAutoFrame=requestAnimationFrame(tick);
  }

  function toggleAvatarAutoSpin() { if(avatarAutoFrame) stopAvatarAutoSpin(); else startAvatarAutoSpin(); }

  function saveAvatar() {
    if(!avatarDraft) return;
    avatarDraft=AvatarLab.save(avatarProfileId(),{...avatarDraft,angle:avatarAngle,autoSpin:false});
    $('avatarSaveStatus').textContent=`Saved for ${Store.getActiveProfile()?.nickname || 'this demo explorer'} on this device.`;
    playAvatarPose('celebrate');
    setTimeout(captureWorldAvatarPreview,180);
    say('Avatar saved. Your explorer is ready for Orish’s World.');
  }

  function captureWorldAvatarPreview() {
    const api=window.OrishAvatar3D;
    if(api?.ready){
      const shot=api.capture?.();
      if(shot) worldAvatarPreviewData=shot;
    }
    renderWorldAvatarCompanion();
  }

  function renderWorldAvatarCompanion() {
    const wrap=$('worldExplorerCompanion'); if(!wrap) return;
    const profile=Store.getActiveProfile();
    const saved=AvatarLab.get(avatarProfileId());
    const name=profile?.nickname || 'Explorer';
    $('worldExplorerName').textContent=name;
    $('worldExplorerLook').textContent=`${avatarOutfitLabels[saved.outfit]||'Explorer'} outfit • ${saved.mode==='creative'?'creative':'real-me'} look`;
    const img=$('worldExplorerPortrait'), fallback=$('worldExplorerFallback');
    if(worldAvatarPreviewData){img.src=worldAvatarPreviewData;img.hidden=false;fallback.hidden=true;}
    else {img.hidden=true;fallback.hidden=false;fallback.style.setProperty('--companion-skin',saved.skin);fallback.style.setProperty('--companion-hair',saved.hairColor);fallback.style.setProperty('--companion-accent',saved.accent);}
  }

  function playAvatarPose(pose, {speak=false}={}) {
    if(window.OrishAvatar3D?.setPose) window.OrishAvatar3D.setPose(pose);
    else window.dispatchEvent(new CustomEvent('orish-avatar:pose',{detail:{pose}}));
    if(speak && pose==='wave') say('Hi! Your explorer is ready for an adventure with Orish.');
  }

  function playWorldAvatarWave() {
    const strip=$('worldExplorerCompanion'); if(!strip) return;
    strip.classList.remove('is-waving'); void strip.offsetWidth; strip.classList.add('is-waving');
    setTimeout(()=>strip.classList.remove('is-waving'),900);
    say('Hi! Your explorer is ready for an adventure with Orish.');
  }

  function addBubble(text, type) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${type === 'user' ? 'user-bubble' : 'orish-bubble'}`;
    bubble.textContent = text;
    $('chatLog').appendChild(bubble);
    $('chatLog').scrollTop = $('chatLog').scrollHeight;
  }

  function launchOrishRoute(launcher) {
    switch (launcher) {
      case 'science': renderScienceWorld(); show('sciencePanel'); break;
      case 'areWeAlone': renderAreWeAlone(); show('areWeAlonePanel'); break;
      case 'spaceGame': startGame('space'); break;
      case 'bodyGame': startGame('body'); break;
      case 'evidence': renderEvidenceDetective(); show('evidencePanel'); break;
      case 'history': renderGlobalHistory(); show('globalHistoryPanel'); break;
      case 'maths': renderMathsGame(); show('mathsPanel'); break;
      case 'lifeSkills': renderLifeSkills(); show('lifeSkillsPanel'); break;
      case 'literacy': renderLiteracyGame(); show('literacyPanel'); break;
      case 'sequence': renderSequenceGame(); show('sequencePanel'); break;
      case 'observation': renderObservationGame(); show('observationPanel'); break;
      case 'memory': renderMemoryGame(); show('memoryPanel'); break;
      case 'story': renderStoryGame(); show('storyPanel'); break;
      case 'maker': renderMakerPanel(); show('makerPanel'); break;
      case 'creative': renderCreativeStudio(); show('creativePanel'); break;
      case 'kitchen': if (!featureAllowed('kitchen')) { addBubble(blockedFeatureMessage('Kitchen Lab'),'orish'); break; } renderKitchenPanel(); show('kitchenPanel'); break;
      case 'family': if (!featureAllowed('family')) { addBubble(blockedFeatureMessage('Family Clubhouse'),'orish'); break; } renderFamilyClubhouse(); show('familyPanel'); break;
      case 'routine': renderRoutinePanel(); show('routinePanel'); break;
      case 'goodNews': if (!featureAllowed('goodNews')) { addBubble(blockedFeatureMessage('Good News'),'orish'); break; } renderGoodNews(); show('goodNewsPanel'); break;
      case 'mission': if (!featureAllowed('mission')) { addBubble(blockedFeatureMessage('Mission HQ'),'orish'); break; } renderMissionHQ(); show('missionPanel'); break;
      default: renderMissionHQ(); show('missionPanel');
    }
  }

  function appendOrishPlan(plan) {
    const card = document.createElement('div');
    card.className = 'orish-plan-card';

    const heading = document.createElement('div');
    heading.className = 'orish-plan-heading';
    const icon = document.createElement('span');
    icon.className = 'orish-plan-icon';
    icon.textContent = plan.primary.icon;
    const copy = document.createElement('div');
    const eyebrow = document.createElement('small');
    eyebrow.textContent = 'ORISH CHOSE';
    const title = document.createElement('strong');
    title.textContent = plan.primary.label;
    copy.append(eyebrow, title);
    heading.append(icon, copy);

    const age = document.createElement('p');
    age.className = 'orish-plan-age';
    age.textContent = plan.ageMessage;

    const safety = document.createElement('div');
    safety.className = 'orish-plan-safety';
    safety.textContent = 'Approved engine • local routing • no generated code • no network call';

    const actions = document.createElement('div');
    actions.className = 'orish-plan-actions';
    const primary = document.createElement('button');
    primary.type = 'button';
    primary.className = 'primary-button';
    primary.textContent = `Start ${plan.primary.label}`;
    primary.addEventListener('click', () => launchOrishRoute(plan.primary.launcher));
    actions.appendChild(primary);

    plan.alternatives.forEach(route => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'ghost-button';
      button.textContent = `Try ${route.label}`;
      button.addEventListener('click', () => launchOrishRoute(route.launcher));
      actions.appendChild(button);
    });

    card.append(heading, age, safety, actions);
    $('chatLog').appendChild(card);
    $('chatLog').scrollTop = $('chatLog').scrollHeight;
  }

  function respondToPrompt(prompt) {
    if (activeAgeBand() === '0-2' && document.activeElement === $('orishInput')) return;
    const clean = Store.cleanText(prompt, 180);
    if (!clean) return;
    addBubble(clean, 'user');

    const profile = Store.getActiveProfile();
    const plan = Intelligence.makePlan(clean, {
      ageBand: activeAgeBand(),
      interests: profile?.interests || [],
      currentFocus: profile?.currentFocus || '',
      offlineActivities: profile?.offlineActivities !== false
    });

    window.setTimeout(() => {
      addBubble(plan.response, 'orish');
      say(plan.response);
      if (plan.ok && plan.primary) appendOrishPlan(plan);
    }, 120);
    $('orishInput').value = '';
  }

  async function refreshOpenVoiceHealth() {
    if (!window.OrishOpenVoice || !$('voiceGatewayStatus')) return null;
    const profile = Store.getActiveProfile();
    const controls = ParentControls.get(profile?.id, profile?.ageBand || activeAgeBand());
    if (!profile || activeAgeBand() === '0-2' || !controls.twoWayVoice) return null;
    $('voiceGatewayStatus').textContent = 'Checking the AT THE CODE voice gateway…';
    const health = await window.OrishOpenVoice.health();
    if (!health) {
      $('voiceGatewayStatus').textContent = 'Voice gateway is not connected yet. The app remains usable with typed Orish and local read-aloud.';
      return null;
    }
    const stt = health.stt?.ready ? 'speech recognition ready' : 'speech recognition needs setup';
    const tts = health.tts?.ready ? 'self-hosted voice ready' : 'device voice fallback';
    $('voiceGatewayStatus').textContent = `Private gateway connected • ${stt} • ${tts}.`;
    return health;
  }

  async function toggleVoiceTurn() {
    const profile = Store.getActiveProfile();
    const controls = ParentControls.get(profile?.id, profile?.ageBand || activeAgeBand());
    if (!profile || activeAgeBand() === '0-2' || !controls.twoWayVoice) {
      $('voiceGatewayStatus').textContent = 'A grown-up needs to enable two-way voice for this profile first.';
      return;
    }
    if (window.OrishOpenVoice?.isRecording?.()) {
      window.OrishOpenVoice.stopTurn();
      return;
    }
    try {
      const health = await refreshOpenVoiceHealth();
      if (!health?.stt?.ready) {
        $('voiceGatewayStatus').textContent = health ? 'The private gateway is connected, but self-hosted speech recognition still needs its local model configured.' : 'Start the private AT THE CODE voice gateway before using the microphone.';
        return;
      }
      await window.OrishOpenVoice.startTurn({ ageBand: activeAgeBand(), locale: 'en-GB', maxMs: 12000 });
    } catch (error) {
      $('voiceGatewayStatus').textContent = `Voice could not start: ${error.message}`;
    }
  }

  function startGame(key) {
    currentGameKey = ['space','body','paper','math','story'].includes(key) ? key : 'space';
    currentGame = AgeGames.getGame(currentGameKey, activeAgeBand());
    currentQuestion = 0;
    score = 0;
    $('gameThemeIcon').textContent = currentGame.icon;
    $('gameName').textContent = currentGame.name;
    $('gameAgeTag').textContent = currentGame.ageLabel;
    $('gameDifficultyTag').textContent = currentGame.difficultyLabel;
    $('gameAgeSummary').textContent = currentGame.ageSummary;
    const map = Curriculum.mapGame(currentGameKey, activeAgeBand(), activeFramework());
    $('gameInstruction').textContent = `${map.subject} • ${map.objective}`;
    show('gamePanel');
    renderQuestion();
  }

  function renderQuestion() {
    const q = currentGame.questions[currentQuestion];
    $('gameProgress').textContent = `${currentQuestion + 1} / ${currentGame.questions.length}`;
    $('gameQuestion').textContent = q[0];
    $('gameFeedback').textContent = '';
    $('nextQuestion').classList.add('hidden');
    const answers = $('gameAnswers');
    answers.innerHTML = '';
    q[1].forEach((answer, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = answer;
      button.addEventListener('click', () => checkAnswer(index));
      answers.appendChild(button);
    });
  }

  function checkAnswer(index) {
    const q = currentGame.questions[currentQuestion];
    [...$('gameAnswers').querySelectorAll('button')].forEach(button => button.disabled = true);
    const correct = index === q[2];
    if (correct) score += 1;
    if (currentGame.mode === 'guided') {
      $('gameFeedback').textContent = `Together answer: ${q[1][q[2]]}. ${q[3] || ''}`;
    } else if (correct) {
      const prefix = currentGame.ageBand === '13-16' ? 'Correct.' : currentGame.ageBand === '2-4' ? 'Yes — nice noticing!' : 'Good catch.';
      $('gameFeedback').textContent = `${prefix} ${q[3] || ''}`;
    } else {
      const prefix = currentGame.ageBand === '2-4' ? 'Let’s try that one together.' : 'Not this time.';
      $('gameFeedback').textContent = `${prefix} The best answer is “${q[1][q[2]]}”. ${q[3] || ''}`;
    }
    $('nextQuestion').classList.remove('hidden');
    $('nextQuestion').textContent = currentQuestion === currentGame.questions.length - 1 ? (currentGame.mode === 'guided' ? 'Finish together' : 'Finish mission') : 'Next';
  }

  function finishGame() {
    const guided = currentGame.mode === 'guided';
    $('gameQuestion').textContent = guided ? 'Shared discovery complete' : `Mission complete — ${score}/${currentGame.questions.length}`;
    $('gameAnswers').innerHTML = '';
    const profile = Store.getActiveProfile();
    const map = Curriculum.mapGame(currentGameKey, activeAgeBand(), activeFramework());
    let message = guided ? 'You explored this together.' : 'Mission finished.';
    if (profile?.evidenceEnabled) {
      Store.addEvidence({
        subject: map.subject,
        title: currentGame.name,
        detail: guided ? `${currentGame.questions.length} parent-led prompts completed • ${currentGame.difficultyLabel}` : `${currentGame.questions.length} questions completed • ${score} correct • ${currentGame.difficultyLabel}`,
        framework: map.framework,
        objective: map.objective,
        score: guided ? undefined : score,
        total: guided ? undefined : currentGame.questions.length,
        independence: guided ? 'Parent-led shared activity' : 'Prototype independent play'
      });
      message = `Saved privately to ${profile.nickname}’s local Learning Passport.`;
    }
    if (profile) {
      const reward = Rewards.recordActivity(profile.id, {type:'game',subject:map.subject,title:currentGame.name,score:guided?undefined:score,total:guided?undefined:currentGame.questions.length,shared:guided});
      if (reward.repeat) message += ' Replay complete — today’s stars for this activity were already earned.';
      else if (reward.awarded) message += ` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
      if (reward.newBadges.length) message += ` New badge${reward.newBadges.length===1?'':'s'} unlocked!`;
    }
    $('gameFeedback').textContent = message;
    $('nextQuestion').classList.add('hidden');
    renderTodayCounts();
  }

  function renderTodayCounts() {
    const profile = Store.getActiveProfile();
    const missionCount = profile ? Mission.countReady(profile.id) : 0;
    if ($('todayMissionCount')) $('todayMissionCount').textContent = `${missionCount} waiting`;
    const stars = profile ? Rewards.get(profile.id).stars : 0;
    if ($('todayStarCount')) $('todayStarCount').textContent = `${stars} earned`;
    if ($('dockStarCount')) $('dockStarCount').textContent = String(stars);
  }

  function makeScienceCard(item, onClick, tagText) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'science-topic-card';
    const icon = document.createElement('span'); icon.className='world-icon'; icon.textContent=item.icon;
    const title = document.createElement('strong'); title.textContent=item.name || item.title;
    const skill = document.createElement('small'); skill.textContent=item.skill || item.family || item.subject || '';
    const tag = document.createElement('span'); tag.className='card-tag'; tag.textContent=tagText || item.difficultyLabel || item.label || 'Investigation';
    card.append(icon,title,skill,tag);
    card.addEventListener('click',onClick);
    return card;
  }

  function renderScienceWorld() {
    const ageBand = activeAgeBand();
    const meta = AgeGames.getAgeMeta(ageBand);
    $('scienceAgeTitle').textContent = `${meta.label} • ${meta.difficulty}`;
    $('scienceAgeSummary').textContent = ageBand==='13-16'
      ? 'Explore scientific systems, then move into source quality, competing explanations, uncertainty and the evidence behind unusual claims.'
      : `${meta.summary} Science World also has a Mystery Wing where Orish asks “what do we know, how do we know it, and what is still unknown?”`;
    const grid = $('scienceTopicGrid');
    grid.innerHTML = '';
    AgeGames.listScience(ageBand).forEach(game => grid.appendChild(makeScienceCard(game,()=>startGame(game.key),game.difficultyLabel)));

    const expeditions=$('scienceExpeditionGrid'); expeditions.innerHTML='';
    Discovery.listExpeditions(ageBand).forEach(item=>expeditions.appendChild(makeScienceCard(
      {icon:item.icon,name:item.title,skill:item.family},
      ()=>openDiscovery('expedition',item.key), item.label
    )));

    const mysteries=$('scienceMysteryGrid'); mysteries.innerHTML='';
    Discovery.listMysteries(ageBand).forEach(item=>mysteries.appendChild(makeScienceCard(
      {icon:item.icon,name:item.title,skill:item.subject},
      ()=>openDiscovery('mystery',item.key), ageBand==='13-16'?'Evidence case':'Mystery file'
    )));
  }

  function openDiscovery(kind, key) {
    const ageBand=activeAgeBand();
    currentDiscovery = kind==='mystery' ? Discovery.getMystery(key,ageBand) : Discovery.getExpedition(key,ageBand);
    if(!currentDiscovery) return;
    $('discoveryEyebrow').textContent = kind==='mystery' ? 'MYSTERIES & UNEXPLAINED' : 'SCIENCE EXPEDITION';
    $('discoveryIcon').textContent=currentDiscovery.icon;
    $('discoveryAge').textContent=currentDiscovery.label;
    $('discoveryCaseTitle').textContent=currentDiscovery.title;
    $('discoveryHook').textContent=currentDiscovery.hook;
    $('discoveryQuestion').textContent=currentDiscovery.question;
    $('discoveryFeedback').textContent='';
    $('completeDiscovery').classList.add('hidden');

    const facts=$('discoveryFacts'); facts.innerHTML='';
    currentDiscovery.facts.forEach((text,index)=>{
      const article=document.createElement('article');
      const p=document.createElement('p'); p.textContent=text;
      article.appendChild(p); article.setAttribute('aria-label',`Evidence ${index+1}`); facts.appendChild(article);
    });
    const steps=$('discoverySteps'); steps.innerHTML='';
    currentDiscovery.steps.forEach((text,index)=>{
      const row=document.createElement('div'); row.className='step-check';
      const number=document.createElement('span'); number.textContent=String(index+1);
      const strong=document.createElement('strong'); strong.textContent=text;
      row.append(number,strong); steps.appendChild(row);
    });
    const choices=$('discoveryChoices'); choices.innerHTML='';
    currentDiscovery.choices.forEach((choice,index)=>{
      const button=document.createElement('button'); button.type='button'; button.className='answer-button'; button.textContent=choice;
      button.addEventListener('click',()=>{
        [...choices.querySelectorAll('button')].forEach(b=>b.disabled=true);
        if(index===currentDiscovery.correct){
          button.classList.add('correct');
          $('discoveryFeedback').textContent=`Evidence check: ${currentDiscovery.explanation}`;
          $('completeDiscovery').classList.remove('hidden');
        } else {
          button.classList.add('incorrect');
          $('discoveryFeedback').textContent='That answer goes further than the evidence. Review the evidence pack, then try again.';
          window.setTimeout(()=>{[...choices.querySelectorAll('button')].forEach(b=>{b.disabled=false;b.classList.remove('incorrect');});},550);
        }
      });
      choices.appendChild(button);
    });
    show('discoveryPanel');
  }

  function finishDiscovery() {
    if(!currentDiscovery) return;
    const profile=Store.getActiveProfile();
    let msg='Investigation complete. Curiosity is strongest when it stays connected to evidence.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:currentDiscovery.subject,
        title:currentDiscovery.title,
        detail:'Science / mystery investigation completed • evidence check passed',
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:currentDiscovery.objective,
        independence:currentDiscovery.mode==='guided'?'Parent-led shared discovery':currentDiscovery.mode==='supported'?'Adult-supported investigation':'Independent evidence investigation'
      });
      msg=`Saved privately to ${profile.nickname}’s Learning Passport. `+msg;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{type:'science-discovery',subject:currentDiscovery.subject,title:currentDiscovery.title,shared:currentDiscovery.mode==='guided'});
      if(reward.awarded) msg+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
      if(reward.repeat) msg+=' Replay complete — today’s stars for this case were already earned.';
    }
    $('discoveryFeedback').textContent=msg;
    $('completeDiscovery').classList.add('hidden');
    renderTodayCounts();
  }


  function renderAreWeAlone() {
    if (!AreWeAlone) return;
    const meta=AreWeAlone.ageMeta(activeAgeBand());
    areWeAloneStages=AreWeAlone.stages(activeAgeBand());
    areWeAloneStageIndex=0;
    $('areWeAloneAge').textContent=meta.label;
    $('areWeAloneIntro').textContent=meta.intro;
    $('areWeAloneSourceCount').textContent=`${AreWeAlone.sourceCount()} checked source records`;
    const sources=$('areWeAloneSources'); sources.innerHTML='';
    AreWeAlone.sourceTrail().forEach(source=>{
      const row=document.createElement('div'); row.className='history-source-row';
      const org=document.createElement('strong');org.textContent=source.org;
      const title=document.createElement('span');title.textContent=source.title;
      const note=document.createElement('small');note.textContent=source.note;
      row.append(org,title,note);sources.appendChild(row);
    });
    renderAreWeAloneProgress();
    renderAreWeAloneStage();
  }

  function renderAreWeAloneProgress(){
    const wrap=$('areWeAloneProgress');wrap.innerHTML='';
    areWeAloneStages.forEach((stage,index)=>{
      const node=document.createElement('span');node.className=`cosmic-progress-node${index<areWeAloneStageIndex?' done':''}${index===areWeAloneStageIndex?' active':''}`;
      node.innerHTML=`<b>${stage.icon}</b><small>${index+1}</small>`;node.setAttribute('aria-label',`${index<areWeAloneStageIndex?'Completed: ':index===areWeAloneStageIndex?'Current: ':''}${stage.title}`);wrap.appendChild(node);
    });
  }

  function renderAreWeAloneStage(){
    currentAreWeAloneStage=areWeAloneStages[areWeAloneStageIndex];
    if(!currentAreWeAloneStage) return;
    const stage=currentAreWeAloneStage;
    $('areWeAloneStageLabel').textContent=`CASE ${areWeAloneStageIndex+1} OF ${areWeAloneStages.length}`;
    $('areWeAloneStageTitle').textContent=stage.title;
    $('areWeAloneStagePrompt').textContent=stage.prompt;
    $('areWeAloneQuestion').textContent=stage.prompt;
    $('areWeAloneVisual').dataset.visual=stage.visual || stage.kind || 'planet';
    $('areWeAloneFeedback').textContent='';
    $('areWeAloneNext').classList.add('hidden');$('finishAreWeAlone').classList.add('hidden');
    const facts=$('areWeAloneFacts');facts.innerHTML='';
    stage.facts.forEach((fact,index)=>{
      const item=document.createElement('article');item.className='cosmic-evidence-chip';
      const light=document.createElement('span');light.className='evidence-light';
      const p=document.createElement('p');p.textContent=fact;
      item.append(light,p);facts.appendChild(item);
      setTimeout(()=>item.classList.add('lit'),activeAccessibilityPrefs().reducedMotion?0:120*(index+1));
    });
    const choices=$('areWeAloneChoices');choices.innerHTML='';
    stage.choices.forEach((choice,index)=>{
      const button=document.createElement('button');button.type='button';button.className='answer-button';button.textContent=choice;
      button.addEventListener('click',()=>{
        [...choices.querySelectorAll('button')].forEach(b=>b.disabled=true);
        if(index===stage.correct){
          button.classList.add('correct');$('areWeAloneFeedback').textContent=`Evidence conclusion: ${stage.explanation}`;
          if(areWeAloneStageIndex<areWeAloneStages.length-1)$('areWeAloneNext').classList.remove('hidden');else $('finishAreWeAlone').classList.remove('hidden');
        } else {
          button.classList.add('incorrect');$('areWeAloneFeedback').textContent='That conclusion goes beyond what the evidence establishes. “Possible”, “unknown” and “proven” are different things.';
          setTimeout(()=>{[...choices.querySelectorAll('button')].forEach(b=>{b.disabled=false;b.classList.remove('incorrect');});},600);
        }
      });choices.appendChild(button);
    });
    renderAreWeAloneProgress();
  }

  function nextAreWeAloneStage(){
    if(areWeAloneStageIndex>=areWeAloneStages.length-1)return;
    areWeAloneStageIndex+=1;renderAreWeAloneStage();$('areWeAlonePanel').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function speakAreWeAlone(){
    if(!currentAreWeAloneStage)return;
    say(`${currentAreWeAloneStage.title}. ${currentAreWeAloneStage.facts.join(' ')} ${currentAreWeAloneStage.prompt}`);
  }

  function completeAreWeAlone(){
    const profile=Store.getActiveProfile();const meta=AreWeAlone.ageMeta(activeAgeBand());
    let msg=`Investigation complete. ${AreWeAlone.integrationMessage()}`;
    if(profile?.evidenceEnabled){
      Store.addEvidence({subject:'Astronomy, astrobiology & evidence',title:'Are We Alone?',detail:'Completed the extraterrestrial-life evidence investigation • distinguished confirmed evidence, claims, unresolved UAP data and standards for proof',framework:Curriculum.getFrameworkName(profile.curriculum),objective:'Distinguish possibility, testimony, unresolved observations and independently verified evidence; explain what would justify changing a scientific conclusion.',independence:meta.mode==='guided'?'Parent-led shared space inquiry':meta.mode==='supported'?'Adult-supported evidence investigation':'Independent evidence-based science investigation'});
      msg=`Saved the learning outcome — not private notes — to ${profile.nickname}’s Learning Passport. ${AreWeAlone.integrationMessage()}`;
    }
    if(profile){const reward=Rewards.recordActivity(profile.id,{type:'are-we-alone',subject:'Astronomy & evidence',title:'Are We Alone?',shared:meta.mode==='guided'});if(reward.awarded)msg+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;if(reward.repeat)msg+=' Replay complete — no extra stars today.';}
    $('areWeAloneFeedback').textContent=msg;$('finishAreWeAlone').classList.add('hidden');renderTodayCounts();
  }

  function renderRewards() {
    const profile = Store.getActiveProfile();
    const progress = profile ? Rewards.get(profile.id) : Rewards.get('');
    $('rewardsTitle').textContent = profile ? `${profile.nickname}’s discoveries` : 'Stars, badges & discoveries';
    $('rewardStars').textContent = progress.stars;
    $('rewardLevel').textContent = Rewards.level(progress);
    $('rewardActivities').textContent = progress.activities;
    const badgeGrid=$('badgeGrid'); badgeGrid.innerHTML='';
    Rewards.badgeDetails(progress).forEach(badge=>{
      const card=document.createElement('article'); card.className=`badge-card${badge.unlocked?' unlocked':' locked'}`;
      const icon=document.createElement('span'); icon.textContent=badge.icon;
      const copy=document.createElement('div'); const title=document.createElement('strong'); title.textContent=badge.name; const desc=document.createElement('small'); desc.textContent=badge.description; copy.append(title,desc); card.append(icon,copy); badgeGrid.appendChild(card);
    });
    const itemGrid=$('rewardItemGrid'); itemGrid.innerHTML='';
    Rewards.itemDetails(progress).forEach(item=>{
      const card=document.createElement('article'); card.className=`reward-item${item.unlocked?' unlocked':' locked'}`;
      const icon=document.createElement('span'); icon.textContent=item.icon;
      const copy=document.createElement('div'); const title=document.createElement('strong'); title.textContent=item.name; const status=document.createElement('small'); status.textContent=item.unlocked?'Unlocked':`Unlocks at ${item.stars} stars`; copy.append(title,status); card.append(icon,copy); itemGrid.appendChild(card);
    });
    const history=$('rewardHistory'); history.innerHTML='';
    if (!progress.history.length) { const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent=profile?'No discoveries recorded yet. Complete a learning game or Mission HQ activity.':'Create or select a child profile first.'; history.appendChild(empty); }
    else progress.history.slice(0,10).forEach(item=>{ const row=document.createElement('div'); row.className='reward-history-row'; const copy=document.createElement('div'); const title=document.createElement('strong'); title.textContent=item.title; const meta=document.createElement('small'); meta.textContent=`${item.subject} • ${new Date(item.createdAt).toLocaleDateString()}`; copy.append(title,meta); const stars=document.createElement('span'); stars.textContent=`+${item.stars} ⭐`; row.append(copy,stars); history.appendChild(row); });
  }

  function renderMissionHQ() {
    const profile = Store.getActiveProfile();
    const list = $('missionList');
    list.innerHTML = '';
    currentMissionId = null;
    $('completeMission').classList.add('hidden');
    $('missionSteps').innerHTML = '';
    $('missionPlayStatus').textContent = '';
    if (!profile) {
      $('missionReadyCount').textContent = '0 ready';
      const empty = document.createElement('div'); empty.className='empty-evidence'; empty.textContent='A grown-up can create a local child profile and mission in Parent Studio.'; list.appendChild(empty);
      $('missionPlayTitle').textContent = 'No active explorer yet';
      $('missionPlayIntro').textContent = 'Create a profile first so Orish knows which age experience to use.';
      return;
    }
    const missions = Mission.getForProfile(profile.id);
    const ready = missions.filter(item => item.status !== 'completed');
    $('missionReadyCount').textContent = `${ready.length} ready`;
    if (!missions.length) {
      const empty = document.createElement('div'); empty.className='empty-evidence'; empty.textContent='No missions waiting yet. A grown-up can create one privately in Parent Studio.'; list.appendChild(empty);
      $('missionPlayTitle').textContent = `${profile.nickname}, Mission HQ is ready`;
      $('missionPlayIntro').textContent = 'When a grown-up creates a mission, only the child-friendly version appears here.';
      return;
    }
    missions.slice(0,12).forEach(mission => {
      const card=document.createElement('article'); card.className=`mission-row${mission.status==='completed'?' completed':''}`;
      const copy=document.createElement('div'); const title=document.createElement('strong'); title.textContent=mission.title; const small=document.createElement('small'); small.textContent=mission.status==='completed'?'Completed':'Ready to play'; copy.append(title,small);
      const play=document.createElement('button'); play.type='button'; play.className='ghost-button'; play.textContent=mission.status==='completed'?'Replay':'Play'; play.addEventListener('click',()=>playMission(mission.id));
      card.append(copy,play); list.appendChild(card);
    });
  }

  function playMission(id) {
    const profile = Store.getActiveProfile();
    if (!profile) return;
    const mission = Mission.getForProfile(profile.id).find(item => item.id === id);
    if (!mission) return;
    currentMissionId = id;
    $('missionPlayTitle').textContent = mission.title;
    $('missionPlayIntro').textContent = mission.intro;
    $('missionPlayStatus').textContent = 'Complete the steps in your own time. This is not a race.';
    const container=$('missionSteps'); container.innerHTML='';
    mission.steps.forEach((step,index)=>{
      const button=document.createElement('button'); button.type='button'; button.className='step-check'; button.dataset.done='0';
      const number=document.createElement('span'); number.textContent=String(index+1);
      const text=document.createElement('strong'); text.textContent=step;
      button.append(number,text);
      button.addEventListener('click',()=>{
        const done=button.dataset.done==='1'; button.dataset.done=done?'0':'1'; button.classList.toggle('done',!done);
        const all=[...container.querySelectorAll('.step-check')].every(item=>item.dataset.done==='1');
        $('completeMission').classList.toggle('hidden',!all);
      });
      container.appendChild(button);
    });
    $('completeMission').classList.add('hidden');
  }

  function completeCurrentMission() {
    const profile=Store.getActiveProfile();
    if (!profile || !currentMissionId) return;
    const completed=Mission.complete(profile.id,currentMissionId);
    if (!completed) return;
    if (profile.evidenceEnabled) {
      Store.addEvidence({subject:completed.subject,title:completed.title,detail:'Mission HQ activity completed',framework:completed.framework,objective:completed.objective,independence:'Completion recorded without a behaviour score'});
      $('missionPlayStatus').textContent=`Mission complete. A simple learning record was saved privately for ${profile.nickname}.`;
    } else $('missionPlayStatus').textContent='Mission complete.';
    const reward=Rewards.recordActivity(profile.id,{type:'mission',subject:completed.subject,title:completed.title});
    if (reward.repeat) $('missionPlayStatus').textContent += ' Replay complete — no extra pressure or repeat stars today.';
    else if (reward.awarded) $('missionPlayStatus').textContent += ` +${reward.awarded} Explorer Stars.`;
    $('completeMission').classList.add('hidden');
    renderMissionHQ();
    renderTodayCounts();
  }

  function fillExtendedParentSettings() {
    const profile=Store.getActiveProfile();
    if (!profile) {
      $('morningRoutineSteps').value=''; $('bedtimeRoutineSteps').value=''; $('routineEncouragementInput').value='';
      $('kitchenIngredients').value=''; $('kitchenEquipment').value=''; $('kitchenAllergyNote').value='';
      return;
    }
    const routine=Routines.get(profile.id);
    $('morningRoutineSteps').value=routine.morning.join('\n');
    $('bedtimeRoutineSteps').value=routine.bedtime.join('\n');
    $('routineEncouragementInput').value=routine.encouragement;
    const setup=Kitchen.getSetup(profile.id);
    $('kitchenIngredients').value=(setup.ingredients||[]).join(', ');
    $('kitchenEquipment').value=(setup.equipment||[]).join(', ');
    $('kitchenAllergyNote').value=setup.allergyNote||'';
  }

  function saveRoutinesFromParent() {
    const profile=Store.getActiveProfile();
    if (!profile) { $('routineSaveStatus').textContent='Create or select a child profile first.'; return; }
    Routines.save(profile.id,{morning:$('morningRoutineSteps').value,bedtime:$('bedtimeRoutineSteps').value,encouragement:$('routineEncouragementInput').value});
    $('routineSaveStatus').textContent='Morning and bedtime routines saved locally.';
  }

  function renderRoutinePanel() {
    const profile=Store.getActiveProfile();
    currentRoutineType=null;
    $('routineSteps').innerHTML=''; $('finishRoutine').classList.add('hidden'); $('routineStatus').textContent='';
    if (!profile) { $('routinePlayTitle').textContent='A grown-up needs to create a profile first'; $('routineEncouragement').textContent='Routines are configured privately in Parent Studio.'; return; }
    const data=Routines.get(profile.id);
    $('routinePlayTitle').textContent=`${profile.nickname}, choose your routine`;
    $('routineEncouragement').textContent=data.encouragement;
  }

  function startRoutine(type) {
    const profile=Store.getActiveProfile(); if(!profile) { renderRoutinePanel(); return; }
    currentRoutineType=type;
    const data=Routines.get(profile.id); const steps=data[type]||[];
    $('routinePlayTitle').textContent=type==='morning'?'Morning Launch':'Night Landing';
    $('routineEncouragement').textContent=data.encouragement;
    $('routineStatus').textContent='Tap each step when it is finished. There is no score and no punishment.';
    const container=$('routineSteps'); container.innerHTML='';
    steps.forEach((step,index)=>{
      const button=document.createElement('button'); button.type='button'; button.className='step-check'; button.dataset.done='0';
      const number=document.createElement('span'); number.textContent=String(index+1); const text=document.createElement('strong'); text.textContent=step; button.append(number,text);
      button.addEventListener('click',()=>{ const done=button.dataset.done==='1'; button.dataset.done=done?'0':'1'; button.classList.toggle('done',!done); $('finishRoutine').classList.toggle('hidden',![...container.querySelectorAll('.step-check')].every(item=>item.dataset.done==='1')); });
      container.appendChild(button);
    });
    $('finishRoutine').classList.add('hidden');
  }

  function finishCurrentRoutine() {
    const profile=Store.getActiveProfile(); if(!profile || !currentRoutineType) return;
    const title=currentRoutineType==='morning'?'Morning routine':'Bedtime routine';
    if(profile.evidenceEnabled) Store.addEvidence({subject:'Life skills',title,detail:'Routine sequence completed',framework:Curriculum.getFrameworkName(profile.curriculum),objective:'Practise sequencing, preparation and growing independence without a behaviour score.',independence:'Routine completion only — not graded'});
    $('routineStatus').textContent='Routine complete. Orish noticed the effort, not perfection.';
    $('finishRoutine').classList.add('hidden');
  }

  function saveKitchenFromParent() {
    const profile=Store.getActiveProfile();
    if(!profile){ $('kitchenSaveStatus').textContent='Create or select a child profile first.'; return; }
    Kitchen.saveSetup(profile.id,{ingredients:$('kitchenIngredients').value,equipment:$('kitchenEquipment').value,allergyNote:$('kitchenAllergyNote').value});
    $('kitchenSaveStatus').textContent='Kitchen list saved locally. Kitchen Lab will now match recipes against it.';
  }

  function kitchenRole(role) {
    const age=activeAgeBand();
    if (role==='adult') return {role:'adult', label:'GROWN-UP TURN 🔥'};
    if (age==='0-2' || age==='2-4') return {role:'together', label:'TOGETHER'};
    return role==='together' ? {role:'together',label:'TOGETHER'} : {role:'child',label:'MY TURN'};
  }

  function kitchenFilterValues() {
    return {category:$('kitchenCategory').value, mode:$('measureMode').value, factor:Number($('servingScale').value)||1};
  }

  function addRecipeRow(container, recipe, ready) {
    const card=document.createElement('article'); card.className=`recipe-row ${ready?'ready':'almost'}`;
    const copy=document.createElement('div'); const title=document.createElement('strong'); title.textContent=`${recipe.icon} ${recipe.title}`;
    const small=document.createElement('small');
    if (ready) small.textContent=`${recipe.category} • ${recipe.time} • ready with your list`;
    else {
      const missing=[...recipe.missingIngredients.map(x=>`ingredient: ${x}`),...recipe.missingEquipment.map(x=>`equipment: ${x}`)];
      small.textContent=`${recipe.category} • missing ${missing.join(', ')}`;
    }
    copy.append(title,small); const open=document.createElement('button'); open.type='button'; open.className='ghost-button'; open.textContent=ready?'View':'See what is missing'; open.addEventListener('click',()=>showRecipe(recipe.id)); card.append(copy,open); container.appendChild(card);
  }

  function renderKitchenPanel() {
    const profile=Store.getActiveProfile(), list=$('recipeList'), almostList=$('recipeAlmostList');
    list.innerHTML=''; almostList.innerHTML=''; $('recipeSteps').innerHTML=''; $('recipeIngredients').innerHTML='';
    $('cookModeCard').classList.add('hidden'); stopCookTimer(); currentRecipeId=null;
    if(!profile){
      $('kitchenReadyCount').textContent='0 ready'; $('kitchenAlmostCount').textContent='0 close';
      const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent='A grown-up needs to create a profile and kitchen setup first.'; list.appendChild(empty); return;
    }
    const setup=Kitchen.getSetup(profile.id), {category}=kitchenFilterValues(), matches=Kitchen.filterMatches(profile.id,category,activeAgeBand());
    const ready=matches.filter(item=>item.canMake), almost=matches.filter(item=>item.almost);
    $('kitchenReadyCount').textContent=`${ready.length} ready`; $('kitchenAlmostCount').textContent=`${almost.length} close`;
    if(!ready.length){ const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent='No recipe in this area matches the current kitchen list yet. Orish will not pretend you can make something you cannot.'; list.appendChild(empty); }
    ready.forEach(recipe=>addRecipeRow(list,recipe,true));
    if(!almost.length){ const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent='No recipes are within one or two items right now.'; almostList.appendChild(empty); }
    almost.slice(0,8).forEach(recipe=>addRecipeRow(almostList,recipe,false));
    $('recipeAllergy').textContent=`Adult food-safety note: ${setup.allergyNote}`;
  }

  function renderRecipeIngredients(recipe) {
    const {mode,factor}=kitchenFilterValues(), measures=$('recipeIngredients'); measures.innerHTML='';
    Kitchen.formatIngredients(recipe,mode,factor).forEach(item=>{const line=document.createElement('div'); line.textContent=item; measures.appendChild(line);});
  }

  function renderRecipeSteps(recipe) {
    const steps=$('recipeSteps'); steps.innerHTML='';
    recipe.steps.forEach(([role,text],index)=>{
      const adapted=kitchenRole(role), row=document.createElement('article'); row.className=`cook-step role-${adapted.role}`;
      const badge=document.createElement('span'); badge.textContent=adapted.label;
      const copy=document.createElement('div'), number=document.createElement('strong'); number.textContent=`Step ${index+1}`;
      const p=document.createElement('p'); p.textContent=text; copy.append(number,p); row.append(badge,copy); steps.appendChild(row);
    });
  }

  function showRecipe(id) {
    const profile=Store.getActiveProfile(), recipe=Kitchen.getRecipe(id); if(!profile || !recipe) return;
    const setup=Kitchen.getSetup(profile.id), match=Kitchen.matches(profile.id,activeAgeBand()).find(item=>item.id===id); currentRecipeId=id;
    $('recipeTitle').textContent=`${recipe.icon} ${recipe.title}`;
    $('recipeMeta').textContent=`${recipe.category} • base ${recipe.baseServings} serving${recipe.baseServings===1?'':'s'} • ${recipe.time} • ${recipe.difficulty} • ${recipe.heat?'grown-up heat step required':'no heat'}`;
    renderRecipeIngredients(recipe); renderRecipeSteps(recipe);
    $('startCookMode').classList.toggle('hidden',!match?.canMake);
    const missing=match && !match.canMake ? ` Missing now: ${[...match.missingIngredients,...match.missingEquipment].join(', ')}.` : '';
    $('recipeAllergy').textContent=`Common allergens: ${recipe.allergens.join(', ') || 'none listed'}. Adult food-safety note: ${setup.allergyNote}.${missing}`;
  }

  function stopCookTimer() {
    if (cookTimerInterval) window.clearInterval(cookTimerInterval);
    cookTimerInterval=null;
  }

  function formatClock(seconds) {
    const m=Math.floor(seconds/60), s=seconds%60; return `${m}:${String(s).padStart(2,'0')}`;
  }

  function updateCookTimerDisplay() {
    const recipe=Kitchen.getRecipe(currentRecipeId), step=recipe?.steps[cookStepIndex], seconds=step?.[2]||0;
    $('cookTimerDisplay').textContent=seconds ? `${formatClock(cookTimerRemaining)} remaining` : 'No timer for this step';
    $('cookTimerStart').disabled=!seconds;
  }

  function resetCookTimer() {
    stopCookTimer(); const recipe=Kitchen.getRecipe(currentRecipeId), seconds=recipe?.steps[cookStepIndex]?.[2]||0; cookTimerRemaining=seconds; updateCookTimerDisplay(); $('cookTimerStart').textContent='Start timer';
  }

  function toggleCookTimer() {
    if (cookTimerInterval) { stopCookTimer(); $('cookTimerStart').textContent='Resume timer'; return; }
    if (!cookTimerRemaining) resetCookTimer();
    if (!cookTimerRemaining) return;
    $('cookTimerStart').textContent='Pause timer';
    cookTimerInterval=window.setInterval(()=>{
      cookTimerRemaining=Math.max(0,cookTimerRemaining-1); updateCookTimerDisplay();
      if(!cookTimerRemaining){ stopCookTimer(); $('cookTimerStart').textContent='Start timer'; $('cookStatus').textContent='Timer finished. A grown-up still checks whether food is safely cooked — the timer is only a guide.'; }
    },1000);
  }

  function renderCookStep() {
    const recipe=Kitchen.getRecipe(currentRecipeId); if(!recipe) return;
    const step=recipe.steps[cookStepIndex], adapted=kitchenRole(step[0]);
    $('cookModeTitle').textContent=recipe.title; $('cookProgress').textContent=`Step ${cookStepIndex+1} of ${recipe.steps.length}`;
    $('cookRole').textContent=adapted.label; $('cookRole').className=`cook-role-badge role-${adapted.role}`; $('cookStepText').textContent=step[1];
    $('cookPrev').disabled=cookStepIndex===0; $('cookNext').textContent=cookStepIndex===recipe.steps.length-1?'Finish recipe':'Next step';
    $('cookStatus').textContent=adapted.role==='adult'?'Wait for the grown-up to do or confirm this step.':'Take your time. There is no race.'; resetCookTimer();
  }

  function startCookMode() {
    if(!currentRecipeId) return; cookStepIndex=0; $('cookModeCard').classList.remove('hidden'); renderCookStep(); $('cookModeCard').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function moveCookStep(direction) {
    const recipe=Kitchen.getRecipe(currentRecipeId), profile=Store.getActiveProfile(); if(!recipe || !profile) return;
    if(direction<0){ cookStepIndex=Math.max(0,cookStepIndex-1); renderCookStep(); return; }
    if(cookStepIndex<recipe.steps.length-1){ cookStepIndex+=1; renderCookStep(); return; }
    stopCookTimer();
    if(profile.evidenceEnabled) Store.addEvidence({subject:'Food & life skills',title:recipe.title,detail:`Kitchen Lab recipe completed (${recipe.category})`,framework:Curriculum.getFrameworkName(profile.curriculum),objective:recipe.objective,independence:'Role-tagged family cooking activity; heat/sharp tasks remain adult-led'});
    const reward=Rewards.recordActivity(profile.id,{type:'kitchen',subject:'Food & life skills',title:recipe.title});
    $('cookStatus').textContent=`Recipe sequence complete. ${reward.awarded?`+${reward.awarded} Explorer Stars. `:''}The supervising adult still decides when food is safe to eat.`;
    $('cookNext').disabled=true; renderTodayCounts();
  }

  function renderInterestGrid(selected = []) {
    const grid = $('interestGrid');
    grid.innerHTML = '';
    ProfileUI.interestOptions.forEach(interest => {
      const label = document.createElement('label');
      label.className = 'interest-chip';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.value = interest;
      input.checked = selected.includes(interest);
      const span = document.createElement('span');
      span.textContent = interest;
      label.append(input, span);
      grid.appendChild(label);
    });
  }

  function resetProfileForm() {
    $('profileId').value = '';
    $('childNickname').value = '';
    $('profileAge').value = '7-9';
    $('curriculumRegion').value = 'england';
    $('routineGoal').value = 'Learning curiosity';
    $('readAloudSetting').checked = true;
    $('offlineSetting').checked = true;
    $('evidenceSetting').checked = true;
    renderInterestGrid([]);
    $('profileStatus').textContent = '';
  }

  function fillProfileForm(profile) {
    if (!profile) { resetProfileForm(); return; }
    $('profileId').value = profile.id;
    $('childNickname').value = profile.nickname;
    $('profileAge').value = profile.ageBand;
    $('curriculumRegion').value = profile.curriculum;
    $('routineGoal').value = profile.currentFocus;
    $('readAloudSetting').checked = profile.readAloud;
    $('offlineSetting').checked = profile.offlineActivities;
    $('evidenceSetting').checked = profile.evidenceEnabled;
    renderInterestGrid(profile.interests || []);
  }

  function selectedInterests() {
    return [...$('interestGrid').querySelectorAll('input:checked')].map(input => input.value);
  }

  function renderProfiles() {
    const profiles = Store.getProfiles();
    const active = Store.getActiveProfile();
    $('profileCount').textContent = `${profiles.length} profile${profiles.length === 1 ? '' : 's'}`;
    $('parentActiveProfile').textContent = active ? `Active: ${active.nickname}` : 'No active child profile';
    const list = $('profileList');
    list.innerHTML = '';
    if (!profiles.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-evidence';
      empty.textContent = 'No profiles yet. Create one on the left.';
      list.appendChild(empty);
      return;
    }
    profiles.forEach(profile => {
      const card = document.createElement('article');
      card.className = `profile-row${active?.id === profile.id ? ' active' : ''}`;
      const copy = document.createElement('div');
      const strong = document.createElement('strong'); strong.textContent = profile.nickname;
      const small = document.createElement('small'); small.textContent = `${profile.ageBand} • ${Curriculum.getFrameworkName(profile.curriculum)}`;
      copy.append(strong, small);
      const actions = document.createElement('div'); actions.className = 'profile-row-actions';
      const use = document.createElement('button'); use.type='button'; use.className='ghost-button'; use.textContent = active?.id === profile.id ? 'Active' : 'Use'; use.disabled = active?.id === profile.id;
      use.addEventListener('click', () => { Store.setActiveProfile(profile.id); fillProfileForm(profile); refreshParentStudio(); updateChildExperience(); });
      const edit = document.createElement('button'); edit.type='button'; edit.className='ghost-button'; edit.textContent='Edit'; edit.addEventListener('click', () => fillProfileForm(profile));
      const del = document.createElement('button'); del.type='button'; del.className='text-danger-button'; del.textContent='Delete'; del.addEventListener('click', () => {
        if (window.confirm(`Delete ${profile.nickname}’s local prototype profile and stop using it as active profile? Learning evidence already stored for that profile will remain until “Delete all local prototype data” is used.`)) {
          Store.deleteProfile(profile.id); resetProfileForm(); refreshParentStudio(); updateChildExperience();
        }
      });
      actions.append(use, edit, del); card.append(copy, actions); list.appendChild(card);
    });
  }

  function renderCurriculumPreview() {
    const profile = Store.getActiveProfile();
    const box = $('curriculumPreview');
    box.innerHTML = '';
    if (!profile) {
      const strong = document.createElement('strong'); strong.textContent='No active profile yet';
      const p = document.createElement('p'); p.textContent='Create a profile to see its framework and age-adaptive objectives.';
      box.append(strong,p); return;
    }
    const title = document.createElement('strong');
    title.textContent = `${profile.nickname} • ${Curriculum.getFrameworkName(profile.curriculum)}`;
    box.appendChild(title);
    ['space','body','math','paper','story'].forEach(key => {
      const mapped = Curriculum.mapGame(key, profile.ageBand, profile.curriculum);
      const row = document.createElement('div'); row.className='curriculum-row';
      const subject = document.createElement('b'); subject.textContent=mapped.subject;
      const text = document.createElement('span'); text.textContent=mapped.objective;
      row.append(subject,text); box.appendChild(row);
    });
  }

  function renderEvidence() {
    const profile = Store.getActiveProfile();
    const grid = $('evidenceGrid');
    grid.innerHTML = '';
    if (!profile) {
      const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent='Create or select a profile to see its Learning Passport.'; grid.appendChild(empty); return;
    }
    const items = Store.getEvidence(profile.id);
    if (!items.length) {
      const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent=`No learning evidence yet for ${profile.nickname}. Complete a V1 game to create the first record.`; grid.appendChild(empty); return;
    }
    items.slice(0,18).forEach(item => {
      const card=document.createElement('article'); card.className='evidence-card';
      const subject=document.createElement('small'); subject.textContent=item.subject;
      const title=document.createElement('strong'); title.textContent=item.title;
      const detail=document.createElement('small'); detail.textContent=item.detail;
      const objective=document.createElement('small'); objective.textContent=item.objective;
      const date=document.createElement('time'); date.dateTime=item.createdAt; date.textContent=new Date(item.createdAt).toLocaleDateString();
      card.append(subject,title,detail,objective,date); grid.appendChild(card);
    });
  }

  function refreshParentStudio() {
    renderProfiles();
    renderCurriculumPreview();
    renderEvidence();
    renderParentLearningSummary();
    fillExtendedParentSettings();
    renderParentControlsCentre();
    renderPrivacyDashboard();
  }

  function renderParentControlsCentre() {
    const profile = Store.getActiveProfile();
    $('safetyCentreProfile').textContent = profile ? `${profile.nickname} • ${profile.ageBand}` : 'No active profile';
    $('safetyNoProfile').classList.toggle('hidden', Boolean(profile));
    $('safetyControlsBody').classList.toggle('hidden', !profile);
    if (!profile) return;
    const controls = ParentControls.get(profile.id, profile.ageBand);
    $('controlFreeTextOrish').checked = controls.freeTextOrish;
    $('controlFreeTextOrish').disabled = profile.ageBand === '0-2';
    $('controlSpokenSupport').checked = controls.spokenSupport;
    $('controlTwoWayVoice').checked = controls.twoWayVoice;
    $('controlTwoWayVoice').disabled = profile.ageBand === '0-2';
    $('controlOfflineActivities').checked = controls.offlineActivities;
    $('controlEvidence').checked = controls.learningEvidence;
    $('controlFamily').checked = controls.familyClubhouse;
    $('controlKitchen').checked = controls.kitchenLab;
    $('controlGoodNews').checked = controls.goodNews;
    $('controlParentMissions').checked = controls.parentMissions;
    const roleMap = {parent:'controlRoleParent',sibling:'controlRoleSibling',grandparent:'controlRoleGrandparent',family:'controlRoleFamily'};
    Object.entries(roleMap).forEach(([role,id]) => { $(id).checked = controls.trustedFamilyRoles.includes(role); });
    $('parentControlsStatus').textContent = `Current: ${ParentControls.describe(controls)}.`;
  }

  function selectedTrustedFamilyRoles() {
    return [
      ['parent','controlRoleParent'],['sibling','controlRoleSibling'],['grandparent','controlRoleGrandparent'],['family','controlRoleFamily']
    ].filter(([,id]) => $(id).checked).map(([role]) => role);
  }

  function saveParentControlsFromForm() {
    const profile = Store.getActiveProfile();
    if (!profile) { $('parentControlsStatus').textContent='Create or select a child profile first.'; return; }
    const roles = selectedTrustedFamilyRoles();
    if ($('controlFamily').checked && !roles.length) {
      $('parentControlsStatus').textContent='Choose at least one approved Family Clubhouse role, or turn Family Clubhouse off.';
      return;
    }
    const controls = ParentControls.save(profile.id, profile.ageBand, {
      freeTextOrish: $('controlFreeTextOrish').checked,
      spokenSupport: $('controlSpokenSupport').checked,
      twoWayVoice: $('controlTwoWayVoice').checked,
      offlineActivities: $('controlOfflineActivities').checked,
      learningEvidence: $('controlEvidence').checked,
      familyClubhouse: $('controlFamily').checked,
      kitchenLab: $('controlKitchen').checked,
      goodNews: $('controlGoodNews').checked,
      parentMissions: $('controlParentMissions').checked,
      trustedFamilyRoles: roles
    });
    const updated = Store.updateProfilePreferences(profile.id, {
      readAloud: controls.spokenSupport,
      offlineActivities: controls.offlineActivities,
      evidenceEnabled: controls.learningEvidence
    });
    if (updated) fillProfileForm(updated);
    $('parentControlsStatus').textContent='Safety controls saved locally for this profile.';
    updateChildExperience();
    renderPrivacyDashboard();
  }

  function resetParentControlsToDefaults() {
    const profile = Store.getActiveProfile();
    if (!profile) { $('parentControlsStatus').textContent='Create or select a child profile first.'; return; }
    const controls = ParentControls.reset(profile.id, profile.ageBand);
    const updated = Store.updateProfilePreferences(profile.id, {
      readAloud: controls.spokenSupport,
      offlineActivities: controls.offlineActivities,
      evidenceEnabled: controls.learningEvidence
    });
    if (updated) fillProfileForm(updated);
    renderParentControlsCentre();
    updateChildExperience();
    $('parentControlsStatus').textContent='Age-safe defaults restored for this profile.';
  }

  function renderPrivacyDashboard() {
    const box = $('privacyDashboard');
    if (!box) return;
    box.innerHTML='';
    const profile = Store.getActiveProfile();
    if (!profile) {
      const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent='Select a profile to view its local-data summary.'; box.appendChild(empty); return;
    }
    const snap = Store.privacySnapshot(profile.id);
    [
      ['Learning records',snap.activeProfileEvidence],
      ['Private parent goals',snap.activeProfileParentRequests],
      ['Local missions',snap.activeProfileMissions],
      ['Profiles on device',snap.profiles]
    ].forEach(([label,value])=>{
      const card=document.createElement('div'); card.className='privacy-stat';
      const strong=document.createElement('strong'); strong.textContent=String(value);
      const small=document.createElement('small'); small.textContent=label;
      card.append(strong,small); box.appendChild(card);
    });
  }

  function clearActiveProfileRecords() {
    const profile=Store.getActiveProfile();
    if (!profile) { $('privacyDashboardStatus').textContent='Select a child profile first.'; return; }
    const typed=window.prompt(`Type CLEAR to delete ${profile.nickname}’s local Learning Passport records, private parent goals, missions and reward history. The child profile, routines, kitchen setup, accessibility and safety controls will remain.`);
    if (typed !== 'CLEAR') { $('privacyDashboardStatus').textContent='Nothing was deleted.'; return; }
    Store.clearProfileLearningData(profile.id);
    $('privacyDashboardStatus').textContent=`${profile.nickname}’s local activity records were deleted. Profile and safety/setup settings were kept.`;
    refreshParentStudio();
    renderTodayCounts();
  }

  function configureGate() {
    const setup = !Store.hasParentPin();
    $('gateModeTitle').textContent = setup ? 'Create an adult PIN' : 'Unlock Parent Studio';
    $('gateHelp').textContent = setup
      ? 'Choose a 6–8 digit PIN. This local gate helps stop casual child access to parent-only controls.'
      : 'Enter the adult PIN to open parent-only controls on this device.';
    $('pinConfirmWrap').classList.toggle('hidden', !setup);
    $('parentPin').value=''; $('parentPinConfirm').value=''; $('gateStatus').textContent='';
  }

  function openParentGate() {
    if (Store.isParentUnlocked()) {
      refreshParentStudio();
      show('parentPanel');
      return;
    }
    configureGate();
    show('parentGateScreen');
    $('parentPin').focus();
  }

  async function handleGateSubmit() {
    const now = Date.now();
    if (now < gateBlockedUntil) {
      $('gateStatus').textContent = `Please wait ${Math.ceil((gateBlockedUntil-now)/1000)} seconds before trying again.`;
      return;
    }
    const pin = $('parentPin').value;
    const setup = !Store.hasParentPin();
    try {
      if (setup) {
        if (pin !== $('parentPinConfirm').value) throw new Error('The two PIN entries do not match.');
        await Store.setParentPin(pin);
      } else {
        const ok = await Store.verifyParentPin(pin);
        if (!ok) {
          gateFailures += 1;
          if (gateFailures >= 5) { gateBlockedUntil = Date.now() + 30000; gateFailures = 0; }
          throw new Error('That PIN was not accepted.');
        }
      }
      gateFailures = 0;
      refreshParentStudio();
      fillProfileForm(Store.getActiveProfile());
      show('parentPanel');
    } catch (error) {
      $('gateStatus').textContent = error.message || 'Parent Gate could not be unlocked.';
    }
  }

  function saveProfileFromForm() {
    const profile = Store.saveProfile({
      id: $('profileId').value || undefined,
      nickname: $('childNickname').value,
      ageBand: $('profileAge').value,
      curriculum: $('curriculumRegion').value,
      interests: selectedInterests(),
      currentFocus: $('routineGoal').value,
      readAloud: $('readAloudSetting').checked,
      offlineActivities: $('offlineSetting').checked,
      evidenceEnabled: $('evidenceSetting').checked
    });
    const existingControls = ParentControls.get(profile.id, profile.ageBand);
    ParentControls.save(profile.id, profile.ageBand, {
      ...existingControls,
      spokenSupport: profile.readAloud,
      offlineActivities: profile.offlineActivities,
      learningEvidence: profile.evidenceEnabled
    });
    $('profileStatus').textContent = `${profile.nickname} saved locally and set as the active profile.`;
    fillProfileForm(profile);
    refreshParentStudio();
    updateChildExperience();
  }

  function makeMission() {
    const profile = Store.getActiveProfile();
    const request = Store.cleanText($('lessonRequest').value, 300);
    const preview = $('missionPreview');
    if (!profile) { preview.textContent='Create or select a child profile first.'; return; }
    if (!request) { preview.textContent='Add a short private parent goal first.'; return; }
    const blueprint = Curriculum.createMissionBlueprint({
      ageBand: profile.ageBand,
      curriculum: profile.curriculum,
      focus: profile.currentFocus,
      format: $('lessonFormat').value,
      parentGoal: request
    });
    Store.saveParentRequest(request, $('lessonFormat').value);
    const mission=Mission.createFromBlueprint(profile,{...blueprint,format:$('lessonFormat').value});
    preview.innerHTML='';
    const title=document.createElement('strong'); title.textContent=blueprint.childTitle;
    const intro=document.createElement('p'); intro.textContent=blueprint.childIntro;
    const meta=document.createElement('small'); meta.textContent=`Age ${blueprint.ageBand} • ${blueprint.framework} • Evidence: ${blueprint.evidence}`;
    const safe=document.createElement('p'); safe.className='privacy-note'; safe.textContent=`${blueprint.safetyNote} Mission saved to Mission HQ for ${profile.nickname}.`;
    preview.append(title,intro,meta,safe);
    $('lessonRequest').value='';
    renderTodayCounts();
    if (mission) renderMissionHQ();
  }


  function renderMakerPanel() {
    const ageBand = activeAgeBand();
    const meta = Maker.ageMeta[ageBand] || Maker.ageMeta['7-9'];
    $('makerAgeTitle').textContent = meta.label;
    $('makerAgeSummary').textContent = meta.note;
    currentMakerProject = null;
    $('makerProjectTitle').textContent = 'Choose a project';
    $('makerProjectQuestion').textContent = 'The investigation question and steps will appear here.';
    $('makerSafety').textContent = '';
    $('makerMaterials').innerHTML = '';
    $('makerObjective').textContent = '';
    $('makerSteps').innerHTML = '';
    $('makerStatus').textContent = '';
    $('completeMakerProject').classList.add('hidden');
    const grid = $('makerProjectGrid');
    grid.innerHTML = '';
    Maker.list(ageBand).forEach(project => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'maker-project-card';
      const icon = document.createElement('span'); icon.className='world-icon'; icon.textContent=project.icon;
      const title = document.createElement('strong'); title.textContent=project.title;
      const family = document.createElement('small'); family.textContent=project.family;
      const question = document.createElement('p'); question.textContent=project.question;
      button.append(icon,title,family,question);
      button.addEventListener('click',()=>openMakerProject(project.id));
      grid.appendChild(button);
    });
  }

  function openMakerProject(projectId) {
    currentMakerProject = Maker.getProject(projectId, activeAgeBand());
    $('makerProjectTitle').textContent = currentMakerProject.title;
    $('makerProjectQuestion').textContent = currentMakerProject.question;
    $('makerSafety').textContent = `Safety: ${currentMakerProject.safety}`;
    $('makerObjective').textContent = currentMakerProject.objective;
    $('makerStatus').textContent = 'Complete the steps at your own pace. Put the device down while building when that is safer or more useful.';
    const materials=$('makerMaterials'); materials.innerHTML='';
    currentMakerProject.materials.forEach(item=>{
      const row=document.createElement('div'); row.textContent=item; materials.appendChild(row);
    });
    const steps=$('makerSteps'); steps.innerHTML='';
    currentMakerProject.steps.forEach((step,index)=>{
      const button=document.createElement('button'); button.type='button'; button.className='step-check'; button.dataset.done='0';
      const number=document.createElement('span'); number.textContent=String(index+1);
      const text=document.createElement('strong'); text.textContent=step;
      button.append(number,text);
      button.addEventListener('click',()=>{
        const done=button.dataset.done==='1';
        button.dataset.done=done?'0':'1';
        button.classList.toggle('done',!done);
        const finished=[...steps.querySelectorAll('.step-check')].every(item=>item.dataset.done==='1');
        $('completeMakerProject').classList.toggle('hidden',!finished);
      });
      steps.appendChild(button);
    });
    $('completeMakerProject').classList.add('hidden');
  }

  function completeMakerProject() {
    const profile=Store.getActiveProfile();
    if(!currentMakerProject) return;
    let message='Maker investigation complete. Nice work testing an idea in the real world.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:currentMakerProject.subject,
        title:currentMakerProject.title,
        detail:`Offline maker project completed • Investigation: ${currentMakerProject.question}`,
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:currentMakerProject.objective,
        independence:currentMakerProject.mode==='guided'?'Parent-led shared making':currentMakerProject.mode==='supported'?'Adult-supported making':'Offline design investigation'
      });
      message=`Saved privately to ${profile.nickname}’s Learning Passport.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{
        type:'maker',
        subject:currentMakerProject.subject,
        title:currentMakerProject.title,
        shared:currentMakerProject.mode==='guided'
      });
      if(reward.repeat) message+=' Replay complete — today’s stars for this project were already earned.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
      if(reward.newBadges.length) message+=' New Maker badge progress unlocked!';
    }
    $('makerStatus').textContent=message;
    $('completeMakerProject').classList.add('hidden');
    renderTodayCounts();
  }

  function renderCreativeStudio() {
    const ageBand=activeAgeBand();
    const labels={
      '0-2':'Parent & Baby Creative Time','2-4':'Early Creator','4-6':'Little Designer',
      '7-9':'Growing Creator','10-12':'Design Investigator','13-16':'Teen Creative Lab'
    };
    const summaries={
      '0-2':'Adult-led colour, shape, picture and sequence play.',
      '2-4':'Simple choices, pictures, patterns and first story sequences.',
      '4-6':'Creative briefs with clear goals, labels and beginning–middle–end thinking.',
      '7-9':'Design challenges add clues, systems and reasons for choices.',
      '10-12':'Creative work adds perspective, user testing and systems design.',
      '13-16':'Mature briefs add constraints, accessibility, evidence and trade-offs.'
    };
    $('creativeAgeTitle').textContent=labels[ageBand]||labels['7-9'];
    $('creativeAgeSummary').textContent=summaries[ageBand]||summaries['7-9'];
    currentCreativeChallenge=null;
    $('creativeBriefTitle').textContent='Choose a challenge';
    $('creativeBriefText').textContent='Your age-adapted design brief will appear here.';
    $('creativeConstraints').innerHTML='';
    $('creativeObjective').textContent='';
    $('creativeStatus').textContent='';
    $('completeCreativeChallenge').classList.add('hidden');
    const grid=$('creativeChallengeGrid'); grid.innerHTML='';
    Creative.list(ageBand).forEach(challenge=>{
      const button=document.createElement('button'); button.type='button'; button.className='creative-challenge-card';
      const icon=document.createElement('span'); icon.className='world-icon'; icon.textContent=challenge.icon;
      const title=document.createElement('strong'); title.textContent=challenge.name;
      const subject=document.createElement('small'); subject.textContent=challenge.subject;
      const brief=document.createElement('p'); brief.textContent=challenge.brief;
      button.append(icon,title,subject,brief);
      button.addEventListener('click',()=>openCreativeChallenge(challenge.id));
      grid.appendChild(button);
    });
  }

  function openCreativeChallenge(challengeId){
    currentCreativeChallenge=Creative.get(challengeId,activeAgeBand());
    $('creativeBriefTitle').textContent=currentCreativeChallenge.name;
    $('creativeBriefText').textContent=currentCreativeChallenge.brief;
    $('creativeObjective').textContent=currentCreativeChallenge.objective;
    $('creativeStatus').textContent='Make it offline, then return when you are ready. Orish does not need a photo of the finished work.';
    const list=$('creativeConstraints'); list.innerHTML='';
    currentCreativeChallenge.constraints.forEach((constraint,index)=>{
      const row=document.createElement('div');
      const number=document.createElement('span'); number.textContent=String(index+1);
      const text=document.createElement('strong'); text.textContent=constraint;
      row.append(number,text); list.appendChild(row);
    });
    $('completeCreativeChallenge').classList.remove('hidden');
  }

  function completeCreativeChallenge(){
    const profile=Store.getActiveProfile();
    if(!currentCreativeChallenge) return;
    let message='Creative challenge complete.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:currentCreativeChallenge.subject,
        title:currentCreativeChallenge.name,
        detail:'Offline creative design brief completed; artwork/story content was not uploaded or stored.',
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:currentCreativeChallenge.objective,
        independence:activeAgeBand()==='0-2'?'Parent-led shared creativity':'Offline creative project'
      });
      message=`Completion saved privately to ${profile.nickname}’s Learning Passport — not the artwork itself.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{
        type:'creative',
        subject:currentCreativeChallenge.subject,
        title:currentCreativeChallenge.name,
        shared:activeAgeBand()==='0-2'
      });
      if(reward.repeat) message+=' Replay complete — no extra stars needed today.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    $('creativeStatus').textContent=message;
    $('completeCreativeChallenge').classList.add('hidden');
    renderTodayCounts();
  }

  function renderFamilyClubhouse(){
    const ageBand=activeAgeBand();
    const meta=Family.ageMeta[ageBand] || Family.ageMeta['7-9'];
    $('familyAgeTitle').textContent=meta.label;
    $('familyAgeSummary').textContent=meta.note;
    currentFamilyActivity=null;
    familyQuestionIndex=0;
    $('familyActivityTitle').textContent='Choose a challenge';
    $('familyActivitySummary').textContent='Your shared family activity will appear here.';
    $('familySafety').textContent='';
    $('familyObjective').textContent='';
    $('familySteps').innerHTML='';
    $('familyStatus').textContent='';
    $('familyQuizArea').classList.add('hidden');
    $('familyStepsArea').classList.remove('hidden');
    $('completeFamilyActivity').classList.add('hidden');
    $('speakFamilyActivity').classList.add('hidden');
    $('openFamilyKitchen').classList.add('hidden');

    const roles=$('familyRoleGrid'); roles.innerHTML='';
    const profile = Store.getActiveProfile();
    const controls = ParentControls.get(profile?.id, ageBand);
    const approvedRoles = Family.roles.filter(role => !profile || controls.trustedFamilyRoles.includes(role.id));
    if (approvedRoles.length && !approvedRoles.some(role => role.id === selectedFamilyRole)) selectedFamilyRole = approvedRoles[0].id;
    approvedRoles.forEach(role=>{
      const button=document.createElement('button'); button.type='button';
      button.className=`family-role-button${role.id===selectedFamilyRole?' selected':''}`;
      const icon=document.createElement('span'); icon.textContent=role.icon;
      const label=document.createElement('strong'); label.textContent=role.label;
      button.append(icon,label);
      button.addEventListener('click',()=>{
        selectedFamilyRole=role.id;
        [...roles.children].forEach(item=>item.classList.remove('selected'));
        button.classList.add('selected');
        if(currentFamilyActivity) $('familyStatus').textContent=`Playing together with: ${Family.role(selectedFamilyRole).label}. Names are not stored.`;
      });
      roles.appendChild(button);
    });

    const grid=$('familyActivityGrid'); grid.innerHTML='';
    Family.list(ageBand).forEach(activity=>{
      const button=document.createElement('button'); button.type='button'; button.className='family-activity-card';
      const icon=document.createElement('span'); icon.className='world-icon'; icon.textContent=activity.icon;
      const title=document.createElement('strong'); title.textContent=activity.title;
      const subject=document.createElement('small'); subject.textContent=activity.subject;
      const summary=document.createElement('p'); summary.textContent=activity.summary;
      button.append(icon,title,subject,summary);
      button.addEventListener('click',()=>openFamilyActivity(activity.id));
      grid.appendChild(button);
    });
  }

  function openFamilyActivity(activityId){
    currentFamilyActivity=Family.get(activityId,activeAgeBand());
    familyQuestionIndex=0;
    $('familyActivityTitle').textContent=currentFamilyActivity.title;
    $('familyActivitySummary').textContent=currentFamilyActivity.summary;
    $('familySafety').textContent=`Safety: ${currentFamilyActivity.safety}`;
    $('familyObjective').textContent=currentFamilyActivity.objective;
    $('familyStatus').textContent=`Playing together with: ${Family.role(selectedFamilyRole).label}. Names are not required or stored.`;
    $('speakFamilyActivity').classList.remove('hidden');
    $('openFamilyKitchen').classList.toggle('hidden', currentFamilyActivity.id!=='bake');
    $('completeFamilyActivity').classList.add('hidden');

    if(Array.isArray(currentFamilyActivity.questions) && currentFamilyActivity.questions.length){
      $('familyStepsArea').classList.add('hidden');
      $('familyQuizArea').classList.remove('hidden');
      renderFamilyQuestion();
    } else {
      $('familyQuizArea').classList.add('hidden');
      $('familyStepsArea').classList.remove('hidden');
      const steps=$('familySteps'); steps.innerHTML='';
      currentFamilyActivity.steps.forEach((step,index)=>{
        const button=document.createElement('button'); button.type='button'; button.className='step-check'; button.dataset.done='0';
        const number=document.createElement('span'); number.textContent=String(index+1);
        const text=document.createElement('strong'); text.textContent=step;
        button.append(number,text);
        button.addEventListener('click',()=>{
          const done=button.dataset.done==='1';
          button.dataset.done=done?'0':'1'; button.classList.toggle('done',!done);
          const finished=[...steps.querySelectorAll('.step-check')].every(item=>item.dataset.done==='1');
          $('completeFamilyActivity').classList.toggle('hidden',!finished);
        });
        steps.appendChild(button);
      });
    }
  }

  function renderFamilyQuestion(){
    if(!currentFamilyActivity?.questions?.length) return;
    const item=currentFamilyActivity.questions[familyQuestionIndex];
    $('familyQuizProgress').textContent=`Question ${familyQuestionIndex+1} / ${currentFamilyActivity.questions.length}`;
    $('familyQuizQuestion').textContent=item.q;
    $('familyQuizAnswer').textContent=item.a;
    $('familyQuizAnswer').classList.add('hidden');
    $('revealFamilyAnswer').classList.remove('hidden');
    $('nextFamilyQuestion').classList.add('hidden');
    $('nextFamilyQuestion').textContent=familyQuestionIndex===currentFamilyActivity.questions.length-1?'Finish quiz':'Next question';
  }

  function revealFamilyAnswer(){
    if(!currentFamilyActivity?.questions?.length) return;
    $('familyQuizAnswer').classList.remove('hidden');
    $('revealFamilyAnswer').classList.add('hidden');
    $('nextFamilyQuestion').classList.remove('hidden');
  }

  function nextFamilyQuestion(){
    if(!currentFamilyActivity?.questions?.length) return;
    if(familyQuestionIndex>=currentFamilyActivity.questions.length-1){
      $('nextFamilyQuestion').classList.add('hidden');
      $('completeFamilyActivity').classList.remove('hidden');
      $('familyStatus').textContent='Team round complete. No individual scores — explain one answer you found interesting.';
      return;
    }
    familyQuestionIndex += 1;
    renderFamilyQuestion();
  }

  function speakFamilyActivity(){
    if(!currentFamilyActivity) return;
    const text=currentFamilyActivity.questions?.length
      ? `${currentFamilyActivity.title}. ${currentFamilyActivity.summary}. ${currentFamilyActivity.questions[familyQuestionIndex].q}`
      : `${currentFamilyActivity.title}. ${currentFamilyActivity.summary}. ${currentFamilyActivity.steps.join(' ')}`;
    say(text);
  }

  function completeFamilyActivity(){
    const profile=Store.getActiveProfile();
    if(!currentFamilyActivity) return;
    let message='Family challenge complete. The team worked together — nobody was ranked.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:currentFamilyActivity.subject,
        title:currentFamilyActivity.title,
        detail:'Shared Family Clubhouse activity completed. No family names, recordings, individual scores or private discussion content stored.',
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:currentFamilyActivity.objective,
        independence:currentFamilyActivity.mode==='guided'?'Adult-led shared family activity':'Cooperative family activity'
      });
      message=`Shared completion saved privately to ${profile.nickname}’s Learning Passport — not the family conversation itself.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{type:'family',subject:currentFamilyActivity.subject,title:currentFamilyActivity.title,shared:true});
      if(reward.repeat) message+=' Replay complete — no extra stars needed today.';
      else if(reward.awarded) message+=` +${reward.awarded} shared Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    $('familyStatus').textContent=message;
    $('completeFamilyActivity').classList.add('hidden');
    renderTodayCounts();
  }

  function renderVisualGame(){
    currentVisualGame=VisualGames.get(activeAgeBand());
    selectedVisualCardId=null;
    visualPlacedCount=0;
    visualErrors=0;
    $('visualGameIcon').textContent=currentVisualGame.icon;
    $('visualGameName').textContent=currentVisualGame.title;
    $('visualGameInstruction').textContent=currentVisualGame.instruction;
    $('visualGameProgress').textContent=`0 / ${currentVisualGame.cards.length}`;
    $('visualGameFeedback').textContent=currentVisualGame.mode==='guided'?'Grown-up: make this a shared talking activity.':'Choose a card, then choose its zone.';
    $('finishVisualGame').classList.add('hidden');
    const bank=$('visualCardBank'); bank.innerHTML='';
    const zones=$('visualZones'); zones.innerHTML='';

    currentVisualGame.cards.forEach(card=>{
      const button=document.createElement('button'); button.type='button'; button.className='visual-sort-card'; button.dataset.cardId=card.id; button.draggable=true;
      const icon=document.createElement('span'); icon.textContent=card.icon;
      const label=document.createElement('strong'); label.textContent=card.label;
      button.append(icon,label);
      button.addEventListener('click',()=>selectVisualCard(card.id));
      button.addEventListener('dragstart',event=>{ selectedVisualCardId=card.id; event.dataTransfer?.setData('text/plain',card.id); button.classList.add('selected'); });
      button.addEventListener('dragend',()=>button.classList.remove('selected'));
      bank.appendChild(button);
    });

    currentVisualGame.zones.forEach(zone=>{
      const target=document.createElement('button'); target.type='button'; target.className='visual-zone'; target.dataset.zoneId=zone.id;
      const icon=document.createElement('span'); icon.className='world-icon'; icon.textContent=zone.icon;
      const label=document.createElement('strong'); label.textContent=zone.label;
      const tray=document.createElement('div'); tray.className='visual-zone-tray'; tray.setAttribute('aria-live','polite');
      target.append(icon,label,tray);
      target.addEventListener('click',()=>{ if(selectedVisualCardId) placeVisualCard(selectedVisualCardId,zone.id); });
      target.addEventListener('dragover',event=>{ event.preventDefault(); target.classList.add('drag-over'); });
      target.addEventListener('dragleave',()=>target.classList.remove('drag-over'));
      target.addEventListener('drop',event=>{
        event.preventDefault(); target.classList.remove('drag-over');
        const id=event.dataTransfer?.getData('text/plain')||selectedVisualCardId;
        if(id) placeVisualCard(id,zone.id);
      });
      zones.appendChild(target);
    });
  }

  function selectVisualCard(cardId){
    selectedVisualCardId=cardId;
    document.querySelectorAll('.visual-sort-card').forEach(card=>card.classList.toggle('selected',card.dataset.cardId===cardId));
    const card=currentVisualGame.cards.find(item=>item.id===cardId);
    $('visualGameFeedback').textContent=card?`Selected: ${card.label}. Now choose a zone.`:'Choose a zone.';
  }

  function placeVisualCard(cardId,zoneId){
    if(!currentVisualGame) return;
    const data=currentVisualGame.cards.find(item=>item.id===cardId);
    const cardEl=document.querySelector(`.visual-sort-card[data-card-id="${cardId}"]`);
    const zoneEl=document.querySelector(`.visual-zone[data-zone-id="${zoneId}"]`);
    if(!data||!cardEl||!zoneEl) return;
    if(data.zone!==zoneId){
      visualErrors+=1;
      $('visualGameFeedback').textContent=currentVisualGame.mode==='guided'?'Try another place together. Name the picture and think about where you would find it.':'Not that zone yet. Look at what the category means and try another.';
      zoneEl.classList.add('wrong-zone');
      window.setTimeout(()=>zoneEl.classList.remove('wrong-zone'),360);
      return;
    }
    const chip=document.createElement('span'); chip.className='placed-chip'; chip.textContent=`${data.icon} ${data.label}`;
    zoneEl.querySelector('.visual-zone-tray').appendChild(chip);
    cardEl.remove();
    visualPlacedCount+=1;
    selectedVisualCardId=null;
    $('visualGameProgress').textContent=`${visualPlacedCount} / ${currentVisualGame.cards.length}`;
    $('visualGameFeedback').textContent=currentVisualGame.mode==='guided'?`${data.label} placed. Say the category together.`:`${data.label} classified correctly.`;
    if(visualPlacedCount===currentVisualGame.cards.length){
      $('visualGameFeedback').textContent=currentVisualGame.mode==='guided'?'Shared sorting complete. You explored the categories together.':`Sort complete. ${visualErrors ? 'You revised some choices as you went — that is part of learning.' : 'Every placement was correct first time.'}`;
      $('finishVisualGame').classList.remove('hidden');
    }
  }

  function finishVisualGame(){
    const profile=Store.getActiveProfile();
    if(!currentVisualGame) return;
    let message='Visual sorting complete.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:currentVisualGame.subject,
        title:currentVisualGame.title,
        detail:`Visual drag/tap sorting completed • ${currentVisualGame.cards.length} cards classified`,
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:currentVisualGame.objective,
        independence:currentVisualGame.mode==='guided'?'Parent-led shared visual activity':'Interactive visual classification'
      });
      message=`Saved privately to ${profile.nickname}’s Learning Passport.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{
        type:'visual',
        subject:currentVisualGame.subject,
        title:currentVisualGame.title,
        shared:currentVisualGame.mode==='guided'
      });
      if(reward.repeat) message+=' Replay complete — today’s stars were already earned.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    $('visualGameFeedback').textContent=message;
    $('finishVisualGame').classList.add('hidden');
    renderTodayCounts();
  }


  function observationTargetIds(game) {
    return new Set(game.type === 'hidden' ? (game.targets || []) : (game.changes || []));
  }

  function makeObservationItem(item, interactive, targetIds) {
    const element = document.createElement(interactive ? 'button' : 'div');
    if (interactive) element.type = 'button';
    element.className = `observation-item${interactive ? ' interactive' : ''}`;
    element.dataset.observationId = item.id;
    const icon = document.createElement('span'); icon.className = 'observation-item-icon'; icon.textContent = item.icon;
    const label = document.createElement('strong'); label.textContent = item.label;
    element.append(icon,label);
    if (item.badge) { const badge=document.createElement('small'); badge.textContent=item.badge; element.appendChild(badge); }
    if (interactive) {
      element.setAttribute('aria-label', `${item.label}. Tap if this is one of the things you are looking for.`);
      element.addEventListener('click', () => chooseObservationItem(item.id, element, targetIds));
    }
    return element;
  }

  function makeObservationStage(title, items, interactive, targetIds) {
    const card = document.createElement('section'); card.className = 'observation-scene-card';
    const heading = document.createElement('div'); heading.className='observation-scene-title';
    const h = document.createElement('strong'); h.textContent=title;
    const note = document.createElement('small'); note.textContent=interactive ? 'Tap only the evidence you think matters.' : 'Reference scene — look carefully.';
    heading.append(h,note);
    const stage = document.createElement('div'); stage.className='observation-stage';
    items.forEach(item => stage.appendChild(makeObservationItem(item, interactive, targetIds)));
    card.append(heading,stage);
    return card;
  }

  function renderObservationGame() {
    currentObservationGame = ObservationGames.get(activeAgeBand());
    observationFound = new Set();
    observationMistakes = 0;
    observationReasoningDone = false;
    const game = currentObservationGame;
    const targetIds = observationTargetIds(game);
    $('observationIcon').textContent = game.icon;
    $('observationGameName').textContent = game.title;
    $('observationInstruction').textContent = game.instruction;
    $('observationProgress').textContent = `0 / ${targetIds.size}`;
    $('observationFeedback').textContent = game.mode === 'guided' ? 'Grown-up: name what you see and explore together.' : 'Take your time. Careful observation matters more than speed.';
    $('finishObservationGame').classList.add('hidden');
    $('observationReasoning').classList.add('hidden');
    $('observationReasoning').innerHTML = '';

    const targets = $('observationTargets'); targets.innerHTML='';
    if (game.type === 'hidden') {
      const intro=document.createElement('span'); intro.className='safe-pill'; intro.textContent='Find:'; targets.appendChild(intro);
      game.scene.filter(item => targetIds.has(item.id)).forEach(item => {
        const chip=document.createElement('span'); chip.className='observation-target-chip'; chip.dataset.targetId=item.id; chip.textContent=`${item.icon} ${item.label}`; targets.appendChild(chip);
      });
    } else {
      const chip=document.createElement('span'); chip.className='observation-target-chip'; chip.textContent=`Find ${targetIds.size} material change${targetIds.size===1?'':'s'}`; targets.appendChild(chip);
    }

    const scenes = $('observationScenes'); scenes.innerHTML='';
    if (game.type === 'hidden') {
      scenes.classList.add('single');
      scenes.appendChild(makeObservationStage('Look & find', game.scene, true, targetIds));
    } else {
      scenes.classList.remove('single');
      scenes.appendChild(makeObservationStage('Scene A — before', game.before, false, targetIds));
      scenes.appendChild(makeObservationStage('Scene B — after', game.after, true, targetIds));
    }
  }

  function chooseObservationItem(id, element, targetIds) {
    if (!currentObservationGame || observationFound.has(id)) return;
    if (!targetIds.has(id)) {
      observationMistakes += 1;
      element.classList.add('checked-not-target');
      window.setTimeout(() => element.classList.remove('checked-not-target'), activeAccessibilityPrefs().reducedMotion ? 0 : 420);
      $('observationFeedback').textContent = currentObservationGame.type === 'hidden' ? 'That picture is part of the scene, but it is not one of today’s find-it targets.' : 'That item stayed the same. Compare Scene A and Scene B again.';
      return;
    }
    observationFound.add(id);
    element.classList.add('found');
    element.disabled = true;
    const targetChip = document.querySelector(`.observation-target-chip[data-target-id="${id}"]`);
    if (targetChip) targetChip.classList.add('found');
    $('observationProgress').textContent = `${observationFound.size} / ${targetIds.size}`;
    $('observationFeedback').textContent = currentObservationGame.type === 'hidden' ? 'Found it. Keep looking.' : 'Change identified. Keep comparing the evidence.';
    if (observationFound.size === targetIds.size) {
      if (currentObservationGame.reasoning) renderObservationReasoning();
      else {
        $('observationFeedback').textContent = currentObservationGame.mode === 'guided' ? 'You found the pictures together. Shared looking complete.' : 'All observation targets found. No speed score was used.';
        $('finishObservationGame').classList.remove('hidden');
      }
    }
  }

  function renderObservationReasoning() {
    const reasoning = currentObservationGame.reasoning;
    const wrap = $('observationReasoning'); wrap.innerHTML=''; wrap.classList.remove('hidden');
    const h=document.createElement('h3'); h.textContent='Evidence check';
    const p=document.createElement('p'); p.textContent=reasoning.prompt;
    const grid=document.createElement('div'); grid.className='observation-reasoning-options';
    reasoning.options.forEach(option => {
      const button=document.createElement('button'); button.type='button'; button.className='observation-reasoning-option'; button.textContent=option.text;
      button.addEventListener('click', () => {
        if (!option.correct) {
          $('observationFeedback').textContent = 'That statement goes beyond what the visible evidence proves. Try the option that stays closest to direct observation.';
          return;
        }
        observationReasoningDone = true;
        grid.querySelectorAll('button').forEach(item => { item.disabled=true; item.classList.toggle('correct',item===button); });
        const explain=document.createElement('div'); explain.className='observation-explanation'; explain.textContent=reasoning.explain; wrap.appendChild(explain);
        $('observationFeedback').textContent='Evidence check complete. You separated direct observation from unsupported inference.';
        $('finishObservationGame').classList.remove('hidden');
      });
      grid.appendChild(button);
    });
    wrap.append(h,p,grid);
  }

  function finishObservationGame() {
    const profile=Store.getActiveProfile();
    const game=currentObservationGame;
    if(!game) return;
    const targetCount=observationTargetIds(game).size;
    if (game.reasoning && !observationReasoningDone) { $('observationFeedback').textContent='Complete the evidence check first.'; return; }
    let message=`Observation Lab complete: ${targetCount} target${targetCount===1?'':'s'} identified.`;
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:game.subject,
        title:game.title,
        detail:`${game.type==='hidden'?'Visual find-it discovery':'Before/after evidence comparison'} completed • ${targetCount} target${targetCount===1?'':'s'} identified${game.reasoning?' • evidence reasoning completed':''}`,
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:game.objective,
        independence:game.mode==='guided'?'Parent-led shared observation activity':'Interactive observation and evidence investigation'
      });
      message=`Saved privately to ${profile.nickname}’s Learning Passport.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{type:'observation',subject:game.subject,title:game.title,shared:game.mode==='guided'});
      if(reward.repeat) message+=' Replay complete — today’s stars were already earned.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    if (observationMistakes) message += ' You revised some choices while investigating — that is part of careful learning.';
    $('observationFeedback').textContent=message;
    $('finishObservationGame').classList.add('hidden');
    renderTodayCounts();
  }


  function shuffleSequence(ids) {
    const copy=[...ids];
    for(let i=copy.length-1;i>0;i-=1){
      const j=Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    if(currentSequenceGame && SequenceGames.isCorrect(currentSequenceGame,copy) && copy.length>1){
      [copy[0],copy[1]]=[copy[1],copy[0]];
    }
    return copy;
  }

  function sequenceStepById(id){ return currentSequenceGame?.steps.find(step=>step.id===id); }

  function renderSequenceList(){
    const list=$('sequenceList'); list.innerHTML='';
    sequenceOrder.forEach((id,index)=>{
      const step=sequenceStepById(id); if(!step) return;
      const item=document.createElement('li'); item.className='sequence-card'; item.dataset.sequenceId=id;
      const number=document.createElement('span'); number.className='sequence-number'; number.textContent=String(index+1);
      const icon=document.createElement('span'); icon.className='sequence-icon'; icon.textContent=step.icon;
      const copy=document.createElement('div'); copy.className='sequence-copy';
      const title=document.createElement('strong'); title.textContent=step.label;
      const detail=document.createElement('small'); detail.textContent=step.detail;
      copy.append(title,detail);
      const controls=document.createElement('div'); controls.className='sequence-move-controls';
      const up=document.createElement('button'); up.type='button'; up.className='ghost-button sequence-move'; up.textContent='↑'; up.setAttribute('aria-label',`Move ${step.label} earlier`); up.disabled=index===0;
      const down=document.createElement('button'); down.type='button'; down.className='ghost-button sequence-move'; down.textContent='↓'; down.setAttribute('aria-label',`Move ${step.label} later`); down.disabled=index===sequenceOrder.length-1;
      up.addEventListener('click',()=>moveSequenceStep(index,-1));
      down.addEventListener('click',()=>moveSequenceStep(index,1));
      controls.append(up,down); item.append(number,icon,copy,controls); list.appendChild(item);
    });
  }

  function renderSequenceGame(){
    currentSequenceGame=SequenceGames.get(activeAgeBand());
    sequenceOrder=shuffleSequence(currentSequenceGame.steps.map(step=>step.id));
    sequenceAttempts=0; sequenceHints=0;
    $('sequenceIcon').textContent=currentSequenceGame.icon;
    $('sequenceGameName').textContent=currentSequenceGame.title;
    $('sequenceInstruction').textContent=currentSequenceGame.instruction;
    $('sequenceStatus').textContent=currentSequenceGame.mode==='guided'?'Together mode':`${currentSequenceGame.steps.length} steps`;
    $('sequenceFeedback').textContent=currentSequenceGame.mode==='guided'?'Grown-up: use first, next and last while moving the cards together.':'Use the arrow buttons to move steps. There is no timer.';
    $('finishSequenceGame').classList.add('hidden');
    $('checkSequence').classList.remove('hidden');
    renderSequenceList();
  }

  function moveSequenceStep(index,direction){
    const next=index+direction;
    if(next<0 || next>=sequenceOrder.length) return;
    [sequenceOrder[index],sequenceOrder[next]]=[sequenceOrder[next],sequenceOrder[index]];
    renderSequenceList();
    $('sequenceFeedback').textContent=currentSequenceGame?.mode==='guided'?'You moved a step together. Read the order aloud again.':'Step moved. Check the dependencies and read the plan from top to bottom.';
  }

  function checkSequence(){
    if(!currentSequenceGame) return;
    sequenceAttempts+=1;
    const correct=SequenceGames.isCorrect(currentSequenceGame,sequenceOrder);
    document.querySelectorAll('.sequence-card').forEach(card=>card.classList.remove('sequence-problem','sequence-correct'));
    if(correct){
      document.querySelectorAll('.sequence-card').forEach(card=>card.classList.add('sequence-correct'));
      $('sequenceFeedback').textContent=currentSequenceGame.mode==='guided'?'Great shared sequencing. Read the first, next and last steps together.':`Plan complete. The sequence respects the process from start to finish${currentSequenceGame.dependencies?' and keeps the investigation dependencies in a defensible order':''}.`;
      $('sequenceStatus').textContent='Order complete';
      $('finishSequenceGame').classList.remove('hidden');
      return;
    }
    const problem=SequenceGames.firstProblem(currentSequenceGame,sequenceOrder);
    const problemEl=problem?document.querySelector(`.sequence-card[data-sequence-id="${problem.actual}"]`):null;
    problemEl?.classList.add('sequence-problem');
    $('sequenceFeedback').textContent=currentSequenceGame.mode==='guided'?'Not quite yet. Ask: what has to happen first? Move one picture together and try again.':'That order has a dependency problem. Start with what must be decided or happen before the highlighted step.';
  }

  function showSequenceHint(){
    if(!currentSequenceGame) return;
    sequenceHints+=1;
    const problem=SequenceGames.firstProblem(currentSequenceGame,sequenceOrder);
    if(!problem){ $('sequenceFeedback').textContent='Your order is ready to check.'; return; }
    const expected=sequenceStepById(problem.expected);
    $('sequenceFeedback').textContent=`Hint: ${currentSequenceGame.hint} ${expected?`At position ${problem.index+1}, look for “${expected.label}”.`:''}`;
  }

  function finishSequenceGame(){
    const profile=Store.getActiveProfile();
    const game=currentSequenceGame;
    if(!game || !SequenceGames.isCorrect(game,sequenceOrder)){ $('sequenceFeedback').textContent='Check the order before saving.'; return; }
    let message='Logic activity complete.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:game.subject,
        title:game.title,
        detail:`Sequencing/planning activity completed • ${game.steps.length} steps ordered • ${sequenceAttempts} check attempt${sequenceAttempts===1?'':'s'} • ${sequenceHints} hint${sequenceHints===1?'':'s'}`,
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:game.objective,
        independence:game.mode==='guided'?'Parent-led shared sequencing activity':'Interactive sequencing and planning challenge'
      });
      message=`Saved privately to ${profile.nickname}’s Learning Passport.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{type:'logic',subject:game.subject,title:game.title,shared:game.mode==='guided'});
      if(reward.repeat) message+=' Replay complete — today’s stars were already earned.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    $('sequenceFeedback').textContent=message;
    $('finishSequenceGame').classList.add('hidden');
    renderTodayCounts();
  }


  function currentMathsRound(){ return currentMathsGame?.rounds[mathsRoundIndex] || null; }

  function renderMathsGame(){
    currentMathsGame=Maths.get(activeAgeBand());
    mathsRoundIndex=0; mathsCorrect=0; mathsAttempts=0; mathsHints=0; mathsSolved=false;
    $('mathsIcon').textContent=currentMathsGame.icon;
    $('mathsGameName').textContent=currentMathsGame.title;
    $('mathsInstruction').textContent=currentMathsGame.instruction;
    $('mathsDifficulty').textContent=currentMathsGame.difficulty;
    const strip=$('mathsTopicStrip'); strip.innerHTML='';
    currentMathsGame.topics.forEach((topic,index)=>{const chip=document.createElement('span');chip.className='maths-topic-chip';chip.dataset.topic=topic;chip.textContent=topic;if(index===0)chip.classList.add('active');strip.appendChild(chip);});
    $('finishMathsGame').classList.add('hidden');
    renderMathsRound();
  }

  function renderMathsVisual(visual){
    const host=$('mathsVisual'); host.innerHTML=''; if(!visual) return;
    const make=(tag,cls,text)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el;};
    if(visual.type==='objects'){
      const row=make('div','maths-object-row'); for(let i=0;i<visual.count;i++)row.appendChild(make('span','maths-object',visual.icon)); host.appendChild(row); return;
    }
    if(visual.type==='groups'){
      const row=make('div','maths-object-row'); visual.groups.forEach(group=>{const card=make('div','maths-fraction-card');const icons=make('div','maths-object-row');for(let i=0;i<group.count;i++)icons.appendChild(make('span','maths-object',group.icon));card.append(icons,make('small','',group.label));row.appendChild(card);});host.appendChild(row);return;
    }
    if(visual.type==='sizes'){
      const row=make('div','maths-object-row');visual.items.forEach(item=>{const card=make('div','maths-fraction-card');card.append(make('span',item.size==='large'?'maths-size-large':'maths-size-small',item.icon),make('small','',item.label));row.appendChild(card);});host.appendChild(row);return;
    }
    if(visual.type==='numbers'||visual.type==='shapes'||visual.type==='sequence'||visual.type==='outcomes'||visual.type==='money'||visual.type==='fractionText'){
      const row=make('div',visual.type==='shapes'?'maths-shape-row':visual.type==='sequence'?'maths-sequence-row':visual.type==='outcomes'?'maths-outcome-row':'maths-number-row');
      const items=visual.items||[];items.forEach(item=>row.appendChild(make('span',visual.type==='outcomes'?'maths-outcome':'maths-number-tile',String(item))));host.appendChild(row);return;
    }
    if(visual.type==='equation'){host.appendChild(make('div','maths-equation',visual.text));return;}
    if(visual.type==='shape'){const box=make('div','maths-geometry-box');box.append(make('span','maths-big-shape',visual.shape),make('strong','',visual.label||''));host.appendChild(box);return;}
    if(visual.type==='fractions'){
      const grid=make('div','maths-fraction-grid'); visual.items.forEach(item=>{const card=make('div','maths-fraction-card');const parts=make('div','maths-fraction-parts');for(let i=0;i<item.total;i++){const part=make('span','maths-fraction-part');if(i<item.filled)part.classList.add('filled');parts.appendChild(part);}card.append(parts,make('small','',item.label));grid.appendChild(card);});host.appendChild(grid);return;
    }
    if(visual.type==='bars'){
      const bars=make('div','maths-bars');visual.items.forEach(item=>{const row=make('div','maths-bar-row');const track=make('div','maths-bar-track');const fill=make('div','maths-bar-fill');fill.style.width=`${Math.max(4,Math.min(100,(Number(item.value)/Number(item.max||item.value))*100))}%`;track.appendChild(fill);row.append(make('strong','',item.label),track,make('span','',String(item.value)));bars.appendChild(row);});host.appendChild(bars);return;
    }
    if(visual.type==='ratio'){
      const ratio=make('div','maths-ratio');const left=make('div','maths-ratio-card');left.append(make('small','',visual.left.label),make('strong','',`${visual.left.parts} parts`),make('span','',String(visual.left.value)));const right=make('div','maths-ratio-card');right.append(make('small','',visual.right.label),make('strong','',`${visual.right.parts} parts`),make('span','',String(visual.right.value)));ratio.append(left,make('span','maths-equation',':'),right);host.appendChild(ratio);return;
    }
    if(visual.type==='rectangle'){
      const box=make('div','maths-geometry-box');const rect=make('div','maths-rectangle',`${visual.width} cm × ${visual.height} cm`);box.appendChild(rect);host.appendChild(box);return;
    }
    if(visual.type==='triangle'){
      const box=make('div','maths-geometry-box');const tri=make('div','maths-triangle-shape');const note=make('strong','',`base ${visual.base} • height ${visual.height}${visual.right?' • right-angled':''}`);box.append(tri,note);host.appendChild(box);return;
    }
    if(visual.type==='data'){
      const row=make('div','maths-data-row');visual.items.forEach(v=>row.appendChild(make('span','maths-data-pill',String(v))));host.appendChild(row);return;
    }
  }

  function renderMathsRound(){
    const game=currentMathsGame; const round=currentMathsRound(); if(!game||!round)return;
    mathsSolved=false;
    $('mathsProgress').textContent=`${mathsRoundIndex+1} / ${game.rounds.length}`;
    document.querySelectorAll('.maths-topic-chip').forEach(chip=>chip.classList.toggle('active',chip.dataset.topic===round.topic));
    renderMathsVisual(round.visual);
    const roundHost=$('mathsRound');roundHost.innerHTML='';const topic=document.createElement('div');topic.className='maths-topic-label';topic.textContent=round.topic;const prompt=document.createElement('h3');prompt.textContent=round.prompt;roundHost.append(topic,prompt);
    const area=$('mathsAnswerArea');area.innerHTML='';
    $('nextMathsRound').classList.add('hidden');$('finishMathsGame').classList.add('hidden');
    $('checkMathsAnswer').classList.toggle('hidden',round.input==='choice');
    $('mathsFeedback').textContent=game.mode==='guided'?'Grown-up: point, count and choose together.':'Take your time. You can use a hint — there is no timer.';
    if(round.input==='choice'){
      const grid=document.createElement('div');grid.className='maths-choice-grid';round.options.forEach((option,index)=>{const button=document.createElement('button');button.type='button';button.className='maths-choice';button.textContent=option;button.addEventListener('click',()=>chooseMathsOption(index,button));grid.appendChild(button);});area.appendChild(grid);return;
    }
    const wrap=document.createElement('div');wrap.className='maths-input-wrap';const input=document.createElement('input');input.id='mathsInput';input.className='maths-input';input.type='number';input.inputMode='decimal';input.step='any';input.autocomplete='off';input.setAttribute('aria-label','Enter your numerical answer');input.addEventListener('keydown',event=>{if(event.key==='Enter'&&!mathsSolved)checkMathsAnswer();});wrap.appendChild(input);if(round.suffix){const unit=document.createElement('span');unit.className='maths-unit';unit.textContent=round.suffix;wrap.appendChild(unit);}area.appendChild(wrap);window.setTimeout(()=>input.focus(),0);
  }

  function chooseMathsOption(index,button){
    if(mathsSolved)return;mathsAttempts+=1;const round=currentMathsRound();const correct=Maths.evaluate(round,index);
    if(correct){mathsSolved=true;mathsCorrect+=1;button.classList.add('correct');document.querySelectorAll('.maths-choice').forEach(item=>item.disabled=true);$('mathsFeedback').textContent=currentMathsGame.mode==='guided'?`Together: ${round.explanation}`:`Correct. ${round.explanation}`;showMathsAdvance();}
    else{button.classList.add('incorrect');button.disabled=true;$('mathsFeedback').textContent=currentMathsGame.mode==='guided'?'Try another one together.':'Not that one yet. Check the quantities or relationship and try again.';}
  }

  function checkMathsAnswer(){
    if(!currentMathsGame||mathsSolved)return;const round=currentMathsRound();if(!round||round.input==='choice')return;const input=$('mathsInput');if(!input||input.value===''){$('mathsFeedback').textContent='Enter a number first.';return;}mathsAttempts+=1;
    if(Maths.evaluate(round,input.value)){mathsSolved=true;mathsCorrect+=1;input.disabled=true;input.classList.add('correct');$('mathsFeedback').textContent=`Correct. ${round.explanation}`;showMathsAdvance();}
    else{input.classList.add('incorrect');$('mathsFeedback').textContent='Not quite. Re-check the operation, units or relationship and try again.';window.setTimeout(()=>input.classList.remove('incorrect'),600);}
  }

  function showMathsAdvance(){
    $('checkMathsAnswer').classList.add('hidden');if(mathsRoundIndex>=currentMathsGame.rounds.length-1)$('finishMathsGame').classList.remove('hidden');else $('nextMathsRound').classList.remove('hidden');
  }

  function nextMathsRound(){if(!mathsSolved)return;mathsRoundIndex+=1;renderMathsRound();}
  function showMathsHint(){const round=currentMathsRound();if(!round)return;mathsHints+=1;$('mathsFeedback').textContent=`Hint: ${round.hint}`;}

  function finishMathsGame(){
    const profile=Store.getActiveProfile();const game=currentMathsGame;if(!game||mathsCorrect<game.rounds.length){$('mathsFeedback').textContent='Finish each challenge before saving the activity.';return;}
    const scored=game.mode!=='guided';let message='Maths Lab complete.';
    if(profile?.evidenceEnabled){Store.addEvidence({subject:game.subject,title:game.title,detail:scored?`${game.rounds.length} maths challenges completed • ${mathsCorrect}/${game.rounds.length} correct • ${mathsAttempts} answer attempt${mathsAttempts===1?'':'s'} • ${mathsHints} hint${mathsHints===1?'':'s'} • raw working/answers not retained`:`${game.rounds.length} parent-led maths prompts completed • no independent score`,framework:Curriculum.getFrameworkName(profile.curriculum),objective:game.objective,score:scored?mathsCorrect:undefined,total:scored?game.rounds.length:undefined,independence:game.mode==='guided'?'Parent-led shared number play':game.mode==='supported'?'Supported age-adaptive maths practice':'Independent age-adaptive maths reasoning'});message=`Saved privately to ${profile.nickname}’s Learning Passport.`;}
    if(profile){const reward=Rewards.recordActivity(profile.id,{type:'maths',subject:game.subject,title:game.title,score:scored?mathsCorrect:undefined,total:scored?game.rounds.length:undefined,shared:game.mode==='guided'});if(reward.repeat)message+=' Replay complete — today’s stars were already earned.';else if(reward.awarded)message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;}
    $('mathsFeedback').textContent=message;$('finishMathsGame').classList.add('hidden');renderTodayCounts();
  }

  function currentLiteracyRound(){ return currentLiteracyGame?.rounds[literacyRoundIndex] || null; }

  function renderLiteracyGame(){
    currentLiteracyGame=Literacy.get(activeAgeBand());
    literacyRoundIndex=0; literacyCorrect=0; literacyAttempts=0; literacyHints=0; literacySolved=false;
    $('literacyIcon').textContent=currentLiteracyGame.icon;
    $('literacyGameName').textContent=currentLiteracyGame.title;
    $('literacyInstruction').textContent=currentLiteracyGame.instruction;
    $('literacyKeyboardTip').textContent=currentLiteracyGame.keyboardTip;
    $('finishLiteracyGame').classList.add('hidden');
    renderLiteracyRound();
  }

  function renderLiteracyRound(){
    const game=currentLiteracyGame; const round=currentLiteracyRound(); if(!game || !round) return;
    literacySolved=false;
    $('literacyProgress').textContent=`${literacyRoundIndex+1} / ${game.rounds.length}`;
    const host=$('literacyRound'); host.innerHTML='';
    if(round.passage){ const passage=document.createElement('p'); passage.className='literacy-passage'; passage.textContent=round.passage; host.appendChild(passage); }
    if(round.cue){ const cue=document.createElement('div'); cue.className='literacy-cue'; cue.textContent=round.cue; host.appendChild(cue); }
    const prompt=document.createElement('h3'); prompt.textContent=round.prompt; host.appendChild(prompt);
    const area=$('literacyAnswerArea'); area.innerHTML='';
    $('checkLiteracyAnswer').classList.toggle('hidden',game.input==='choice');
    $('nextLiteracyRound').classList.add('hidden');
    $('finishLiteracyGame').classList.add('hidden');
    $('literacyFeedback').textContent=game.mode==='guided'?'Grown-up: say the words and choose together.':'Take your time. Nothing you type here is saved as free text.';

    if(game.input==='choice'){
      const grid=document.createElement('div'); grid.className='literacy-choice-grid';
      round.options.forEach((option,index)=>{
        const button=document.createElement('button'); button.type='button'; button.className='literacy-choice';
        const icon=document.createElement('span'); icon.textContent=option[0];
        const label=document.createElement('strong'); label.textContent=option[1];
        button.append(icon,label); button.addEventListener('click',()=>chooseLiteracyOption(index,button)); grid.appendChild(button);
      }); area.appendChild(grid); return;
    }

    const input=document.createElement('input'); input.id='literacyInput'; input.className='literacy-input'; input.type='text'; input.maxLength=120; input.autocomplete='off'; input.autocapitalize='off'; input.spellcheck=false; input.setAttribute('aria-label','Type your answer'); input.placeholder=game.input==='builder'?'Build or type the word…':'Type your answer…';
    input.addEventListener('keydown',event=>{ if(event.key==='Enter' && !literacySolved) checkLiteracyAnswer(); });
    area.appendChild(input);
    if(game.input==='builder'){
      const bank=document.createElement('div'); bank.className='letter-bank';
      round.letters.forEach(letter=>{ const b=document.createElement('button'); b.type='button'; b.className='letter-key'; b.textContent=letter.toUpperCase(); b.addEventListener('click',()=>{ input.value=(input.value+letter).slice(0,input.maxLength); input.focus(); }); bank.appendChild(b); });
      const back=document.createElement('button'); back.type='button'; back.className='ghost-button'; back.textContent='⌫ Backspace'; back.addEventListener('click',()=>{input.value=input.value.slice(0,-1);input.focus();});
      const clear=document.createElement('button'); clear.type='button'; clear.className='ghost-button'; clear.textContent='Clear'; clear.addEventListener('click',()=>{input.value='';input.focus();});
      bank.append(back,clear); area.appendChild(bank);
    }
    window.setTimeout(()=>input.focus(),0);
  }

  function chooseLiteracyOption(index,button){
    if(literacySolved) return;
    literacyAttempts+=1;
    const round=currentLiteracyRound(); const correct=index===round.answer;
    if(correct){
      literacySolved=true; literacyCorrect+=1; button.classList.add('correct');
      document.querySelectorAll('.literacy-choice').forEach(item=>item.disabled=true);
      $('literacyFeedback').textContent=currentLiteracyGame.mode==='guided'?`Together: ${round.explanation}`:`Correct. ${round.explanation}`;
      showLiteracyAdvance();
    } else {
      button.classList.add('incorrect'); button.disabled=true;
      $('literacyFeedback').textContent=currentLiteracyGame.mode==='guided'?'Try another picture together.':'Not that one yet. Look or listen again and try another choice.';
    }
  }

  function checkLiteracyAnswer(){
    if(!currentLiteracyGame || literacySolved || currentLiteracyGame.input==='choice') return;
    const input=$('literacyInput'); const round=currentLiteracyRound(); if(!input || !round) return;
    literacyAttempts+=1;
    const correct=Literacy.evaluate(round,input.value);
    if(correct){
      literacySolved=true; literacyCorrect+=1; input.disabled=true; input.classList.add('correct');
      $('literacyFeedback').textContent=`Correct. ${round.explanation}`; showLiteracyAdvance();
    } else {
      input.classList.add('incorrect');
      $('literacyFeedback').textContent=activeAgeBand()==='4-6'?'Nearly. Say the sounds slowly, check each letter and try again.':'Not quite. Re-read the prompt, edit the answer and try again.';
      window.setTimeout(()=>input.classList.remove('incorrect'),600);
    }
  }

  function showLiteracyAdvance(){
    if(literacyRoundIndex>=currentLiteracyGame.rounds.length-1){
      $('finishLiteracyGame').classList.remove('hidden');
      $('checkLiteracyAnswer').classList.add('hidden');
    } else {
      $('nextLiteracyRound').classList.remove('hidden');
      $('checkLiteracyAnswer').classList.add('hidden');
    }
  }

  function nextLiteracyRound(){
    if(!literacySolved) return;
    literacyRoundIndex+=1; renderLiteracyRound();
  }

  function showLiteracyHint(){
    const round=currentLiteracyRound(); if(!round) return;
    literacyHints+=1;
    let hint='Say the prompt aloud and look for the strongest clue.';
    if(currentLiteracyGame.input==='builder') hint=`The word has ${round.target.length} letters. Try the sounds one at a time.`;
    else if(currentLiteracyGame.input==='typing') hint=round.acceptExact?'Capital letters and punctuation are part of this answer.':`The target begins with “${String(round.target).charAt(0)}”.`;
    $('literacyFeedback').textContent=`Hint: ${hint}`;
  }

  function finishLiteracyGame(){
    const profile=Store.getActiveProfile(); const game=currentLiteracyGame;
    if(!game || literacyCorrect<game.rounds.length){ $('literacyFeedback').textContent='Finish each round before saving the activity.'; return; }
    const scored=game.mode!=='guided';
    let message='Literacy activity complete.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:game.subject,
        title:game.title,
        detail:scored?`${game.rounds.length} literacy rounds completed • ${literacyCorrect}/${game.rounds.length} correct • ${literacyAttempts} answer attempt${literacyAttempts===1?'':'s'} • ${literacyHints} hint${literacyHints===1?'':'s'} • typed practice text not retained`:`${game.rounds.length} parent-led language prompts completed • typed/free-text content not retained`,
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:game.objective,
        score:scored?literacyCorrect:undefined,
        total:scored?game.rounds.length:undefined,
        independence:game.mode==='guided'?'Parent-led shared first-words activity':game.mode==='supported'?'Supported literacy and early keyboard activity':'Independent literacy and keyboard practice'
      });
      message=`Saved privately to ${profile.nickname}’s Learning Passport. The words typed during practice were not saved.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{type:'literacy',subject:game.subject,title:game.title,score:scored?literacyCorrect:undefined,total:scored?game.rounds.length:undefined,shared:game.mode==='guided'});
      if(reward.repeat) message+=' Replay complete — today’s stars were already earned.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    $('literacyFeedback').textContent=message;
    $('finishLiteracyGame').classList.add('hidden');
    renderTodayCounts();
  }


  function renderStoryGame(){
    currentStoryGame=StoryChoice.get(activeAgeBand());
    currentStoryNodeId=currentStoryGame.start;
    storyChoiceCount=0;
    storyVisited=new Set([currentStoryNodeId]);
    $('storyIcon').textContent=currentStoryGame.icon;
    $('storyGameName').textContent=currentStoryGame.title;
    $('storyInstruction').textContent=currentStoryGame.instruction;
    $('finishStoryGame').classList.add('hidden');
    $('storyReflection').classList.add('hidden');
    renderStoryNode();
  }

  function renderStoryNode(effectText=''){
    const game=currentStoryGame; const node=StoryChoice.getNode(game,currentStoryNodeId); if(!game || !node) return;
    $('storyProgress').textContent=node.ending?'Ending':`Scene ${storyVisited.size}`;
    const host=$('storyScene'); host.innerHTML='';
    const heading=document.createElement('h3'); heading.textContent=node.ending?(node.title || 'Story ending'):`${game.icon} ${game.title}`;
    const scene=document.createElement('p'); scene.textContent=node.scene;
    host.append(heading,scene);
    if(node.prompt){ const prompt=document.createElement('p'); prompt.className='story-prompt'; prompt.textContent=node.prompt; host.appendChild(prompt); }
    if(effectText){ const effect=document.createElement('p'); effect.className='story-effect'; effect.textContent=effectText; host.appendChild(effect); }
    const choices=$('storyChoices'); choices.innerHTML='';
    const reflection=$('storyReflection'); reflection.innerHTML=''; reflection.classList.add('hidden');
    $('finishStoryGame').classList.toggle('hidden',!node.ending);
    if(node.ending){
      const strong=document.createElement('strong'); strong.textContent='Reflect, don’t judge';
      const p=document.createElement('p'); p.textContent=node.reflection || 'Talk about what changed and what evidence or communication helped.';
      reflection.append(strong,p); reflection.classList.remove('hidden');
      $('storyFeedback').textContent=game.mode==='guided'?'Shared story complete. Repeat a favourite word or action if it is still enjoyable.':'Story route complete. Your exact choices are not saved.';
      return;
    }
    node.choices.forEach((choice,index)=>{
      const button=document.createElement('button'); button.type='button'; button.className='story-choice'; button.textContent=choice.label;
      button.addEventListener('click',()=>chooseStoryOption(index)); choices.appendChild(button);
    });
    $('storyFeedback').textContent=game.mode==='guided'?'Grown-up: choose together. There is no right-answer score.':'Choose a path. The story will show what changes next.';
  }

  function chooseStoryOption(index){
    const node=StoryChoice.getNode(currentStoryGame,currentStoryNodeId); const choice=node?.choices?.[index]; if(!choice) return;
    storyChoiceCount+=1;
    currentStoryNodeId=choice.to;
    storyVisited.add(currentStoryNodeId);
    renderStoryNode(choice.effect || 'The story changes direction.');
  }

  function finishStoryGame(){
    const profile=Store.getActiveProfile(); const game=currentStoryGame; const node=StoryChoice.getNode(game,currentStoryNodeId);
    if(!game || !node?.ending){ $('storyFeedback').textContent='Reach an ending before saving the activity.'; return; }
    let message='Interactive story complete. Exact choices were not retained.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({
        subject:game.subject,
        title:game.title,
        detail:`Branching story completed • ${storyChoiceCount} choice${storyChoiceCount===1?'':'s'} explored • exact route and choice labels not retained`,
        framework:Curriculum.getFrameworkName(profile.curriculum),
        objective:game.objective,
        independence:game.mode==='guided'?'Parent-led shared interactive story':game.mode==='supported'?'Supported interactive story and reflection':'Independent branching story and evidence reflection'
      });
      message=`Saved privately to ${profile.nickname}’s Learning Passport. Exact story choices were not saved.`;
    }
    if(profile){
      const reward=Rewards.recordActivity(profile.id,{type:'story-choice',subject:game.subject,title:game.title,shared:game.mode==='guided'});
      if(reward.repeat) message+=' Replay complete — today’s stars were already earned.';
      else if(reward.awarded) message+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;
    }
    $('storyFeedback').textContent=message;
    $('finishStoryGame').classList.add('hidden');
    renderTodayCounts();
  }


  function activeAccessibilityPrefs() {
    return Accessibility.get(Store.getActiveProfile()?.id);
  }

  function renderAccessibilityCentre() {
    const profile = Store.getActiveProfile();
    const prefs = activeAccessibilityPrefs();
    $('a11yTextSize').value = prefs.textSize;
    $('a11yHighContrast').checked = prefs.highContrast;
    $('a11yReducedMotion').checked = prefs.reducedMotion;
    $('a11ySpaciousText').checked = prefs.spaciousText;
    $('a11ySimplifiedVisuals').checked = prefs.simplifiedVisuals;
    $('a11ySpeechEnabled').checked = prefs.speechEnabled;
    const parentAllowsSpeech = !profile || profile.readAloud !== false;
    $('a11ySpeechEnabled').disabled = !parentAllowsSpeech;
    $('testAccessibilityVoice').disabled = !parentAllowsSpeech || !prefs.speechEnabled;
    $('accessibilityStatus').textContent = parentAllowsSpeech
      ? `${Accessibility.describe(prefs)}. Changes save only on this device.`
      : `${Accessibility.describe(prefs)}. Spoken support is disabled in Parent Studio for this profile.`;
  }

  function saveAccessibilityFromUI() {
    const profile = Store.getActiveProfile();
    const prefs = Accessibility.save(profile?.id, {
      textSize: $('a11yTextSize').value,
      highContrast: $('a11yHighContrast').checked,
      reducedMotion: $('a11yReducedMotion').checked,
      spaciousText: $('a11ySpaciousText').checked,
      simplifiedVisuals: $('a11ySimplifiedVisuals').checked,
      speechEnabled: $('a11ySpeechEnabled').checked
    });
    Accessibility.apply(prefs);
    renderAccessibilityCentre();
  }

  function resetAccessibilityPrefs() {
    const profile = Store.getActiveProfile();
    const prefs = Accessibility.reset(profile?.id);
    if (profile?.readAloud === false) prefs.speechEnabled = false;
    Accessibility.apply(prefs);
    renderAccessibilityCentre();
  }

  function renderMemoryGame() {
    currentMemoryGame = MemoryGames.makeDeck(activeAgeBand());
    memoryOpen = [];
    memoryMatched = new Set();
    memoryTurns = 0;
    memoryLocked = false;
    $('memoryIcon').textContent = currentMemoryGame.icon;
    $('memoryGameName').textContent = currentMemoryGame.title;
    $('memoryInstruction').textContent = currentMemoryGame.instruction;
    $('memoryProgress').textContent = `0 / ${currentMemoryGame.pairs.length} pairs`;
    $('memoryTurns').textContent = '0 turns';
    $('memoryFeedback').textContent = currentMemoryGame.mode === 'guided'
      ? 'Grown-up and child: take turns together. There is no timer or score.'
      : 'Take your time. There is no timer.';
    $('finishMemoryGame').classList.add('hidden');
    const board = $('memoryBoard');
    board.innerHTML = '';
    currentMemoryGame.deck.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'memory-card';
      button.dataset.memoryIndex = String(index);
      button.setAttribute('aria-label', `Card ${index + 1}, face down`);
      const back = document.createElement('span'); back.className='memory-card-back'; back.textContent='?';
      const face = document.createElement('span'); face.className='memory-card-face';
      const icon = document.createElement('span'); icon.className='memory-card-icon'; icon.textContent=card.icon;
      const label = document.createElement('strong'); label.textContent=card.label;
      face.append(icon,label); button.append(back,face);
      button.addEventListener('click', () => flipMemoryCard(index));
      board.appendChild(button);
    });
  }

  function memoryCardElement(index) {
    return $('memoryBoard').querySelector(`[data-memory-index="${index}"]`);
  }

  function setMemoryCardState(index, state) {
    const button = memoryCardElement(index);
    const card = currentMemoryGame?.deck[index];
    if (!button || !card) return;
    const revealed = state === 'open' || state === 'matched';
    button.classList.toggle('open', revealed);
    button.classList.toggle('matched', state === 'matched');
    button.disabled = state === 'matched';
    button.setAttribute('aria-label', revealed ? `${card.label}${state === 'matched' ? ', matched' : ', face up'}` : `Card ${index + 1}, face down`);
  }

  function flipMemoryCard(index) {
    if (!currentMemoryGame || memoryLocked || memoryMatched.has(index) || memoryOpen.includes(index)) return;
    setMemoryCardState(index, 'open');
    memoryOpen.push(index);
    const card = currentMemoryGame.deck[index];
    $('memoryFeedback').textContent = `Turned over: ${card.label}.`;
    if (memoryOpen.length < 2) return;
    memoryTurns += 1;
    $('memoryTurns').textContent = `${memoryTurns} turn${memoryTurns === 1 ? '' : 's'}`;
    const [aIndex,bIndex] = memoryOpen;
    const a = currentMemoryGame.deck[aIndex];
    const b = currentMemoryGame.deck[bIndex];
    if (a.pairId === b.pairId) {
      memoryMatched.add(aIndex); memoryMatched.add(bIndex);
      setMemoryCardState(aIndex, 'matched'); setMemoryCardState(bIndex, 'matched');
      memoryOpen = [];
      const pairCount = memoryMatched.size / 2;
      $('memoryProgress').textContent = `${pairCount} / ${currentMemoryGame.pairs.length} pairs`;
      $('memoryFeedback').textContent = `Match found: ${a.label} ↔ ${b.label}.`;
      if (pairCount === currentMemoryGame.pairs.length) {
        $('memoryFeedback').textContent = `All ${pairCount} pairs found in ${memoryTurns} turns. No speed score was used.`;
        $('finishMemoryGame').classList.remove('hidden');
      }
      return;
    }
    memoryLocked = true;
    $('memoryFeedback').textContent = `${a.label} and ${b.label} are not a pair. Look once more, then they will turn back.`;
    window.setTimeout(() => {
      setMemoryCardState(aIndex, 'closed');
      setMemoryCardState(bIndex, 'closed');
      memoryOpen = [];
      memoryLocked = false;
      $('memoryFeedback').textContent = 'Try another pair. Take your time.';
    }, activeAccessibilityPrefs().reducedMotion ? 650 : 900);
  }

  function finishMemoryGame() {
    const profile = Store.getActiveProfile();
    if (!currentMemoryGame) return;
    let message = `Memory Lab complete: ${currentMemoryGame.pairs.length} pairs in ${memoryTurns} turns.`;
    if (profile?.evidenceEnabled) {
      Store.addEvidence({
        subject: currentMemoryGame.subject,
        title: currentMemoryGame.title,
        detail: `No-timer memory/matching activity completed • ${currentMemoryGame.pairs.length} pairs • ${memoryTurns} turns`,
        framework: Curriculum.getFrameworkName(profile.curriculum),
        objective: currentMemoryGame.objective,
        independence: currentMemoryGame.mode === 'guided' ? 'Parent-led shared matching activity' : 'Interactive memory and semantic matching'
      });
      message = `Saved privately to ${profile.nickname}’s Learning Passport.`;
    }
    if (profile) {
      const reward = Rewards.recordActivity(profile.id,{type:'memory',subject:currentMemoryGame.subject,title:currentMemoryGame.title,shared:currentMemoryGame.mode==='guided'});
      if (reward.repeat) message += ' Replay complete — today’s stars were already earned.';
      else if (reward.awarded) message += ` +${reward.awarded} Explorer Star${reward.awarded === 1 ? '' : 's'}.`;
    }
    $('memoryFeedback').textContent = message;
    $('finishMemoryGame').classList.add('hidden');
    renderTodayCounts();
  }

  function renderGoodNewsDetail(storyId) {
    const story = GoodNews.getStory(storyId);
    const guidance = GoodNews.getAgeGuidance(activeAgeBand());
    currentGoodNewsStoryId = story.id;
    const detail = $('goodNewsDetail');
    detail.innerHTML = '';

    const top = document.createElement('div'); top.className='good-news-detail-head';
    const icon = document.createElement('span'); icon.className='world-icon'; icon.textContent=story.icon;
    const copy = document.createElement('div');
    const category = document.createElement('small'); category.textContent=`${story.category} • approved demo card`;
    const title = document.createElement('h3'); title.textContent=story.title;
    copy.append(category,title); top.append(icon,copy);

    const summary = document.createElement('p'); summary.className='good-news-summary'; summary.textContent=story.summary;
    const blocks = [
      ['Why this is hopeful', story.whyGood],
      ['Learn something', story.learn],
      ['Explore it', story.tryIt],
      ['Age-level thinking prompt', guidance.question]
    ];
    detail.append(top,summary);
    blocks.forEach(([label,text]) => {
      const block=document.createElement('section'); block.className='good-news-block';
      const strong=document.createElement('strong'); strong.textContent=label;
      const p=document.createElement('p'); p.textContent=text;
      block.append(strong,p); detail.appendChild(block);
    });
    const actions=document.createElement('div'); actions.className='good-news-actions';
    const read=document.createElement('button'); read.type='button'; read.className='secondary-button'; read.textContent='🔊 Orish reads this card';
    read.addEventListener('click',()=>say(`${story.title}. ${story.summary} ${story.whyGood} ${story.learn}`));
    const note=document.createElement('small'); note.textContent='No reading history, score or reward is stored for Good News Beacon cards.';
    actions.append(read,note); detail.appendChild(actions);
  }

  function renderGoodNews() {
    const guidance = GoodNews.getAgeGuidance(activeAgeBand());
    $('goodNewsAgeLabel').textContent = `${guidance.label} • demo Beacon`;
    $('goodNewsAgeIntro').textContent = guidance.intro;

    const filterBox=$('goodNewsCategories'); filterBox.innerHTML='';
    GoodNews.getCategories().forEach(category=>{
      const button=document.createElement('button'); button.type='button'; button.className=`good-news-filter${category===selectedGoodNewsCategory?' selected':''}`; button.textContent=category;
      button.setAttribute('aria-pressed', category===selectedGoodNewsCategory ? 'true' : 'false');
      button.addEventListener('click',()=>{ selectedGoodNewsCategory=category; renderGoodNews(); });
      filterBox.appendChild(button);
    });

    const grid=$('goodNewsGrid'); grid.innerHTML='';
    const stories=GoodNews.getStories(selectedGoodNewsCategory);
    stories.forEach(story=>{
      const card=document.createElement('button'); card.type='button'; card.className=`good-news-card${story.id===currentGoodNewsStoryId?' selected':''}`;
      const icon=document.createElement('span'); icon.className='world-icon'; icon.textContent=story.icon;
      const cat=document.createElement('small'); cat.textContent=story.category;
      const title=document.createElement('strong'); title.textContent=story.title;
      const text=document.createElement('p'); text.textContent=story.summary;
      card.append(icon,cat,title,text);
      card.addEventListener('click',()=>{ renderGoodNewsDetail(story.id); renderGoodNews(); });
      grid.appendChild(card);
    });
    if (!currentGoodNewsStoryId || !stories.some(story=>story.id===currentGoodNewsStoryId)) {
      const beacon=stories.find(story=>story.id===GoodNews.beaconForDate().id) || stories[0];
      if (beacon) renderGoodNewsDetail(beacon.id);
    }
  }

  function renderParentLearningSummary() {
    const box=$('parentLearningSummary');
    if (!box) return;
    box.innerHTML='';
    const profile=Store.getActiveProfile();
    if (!profile) {
      const empty=document.createElement('div'); empty.className='empty-evidence'; empty.textContent='Create or select a child profile to see a learning summary.'; box.appendChild(empty); return;
    }
    const days=$('summaryPeriod')?.value || '7';
    const summary=ParentSummary.summarize({profile,evidence:Store.getEvidence(profile.id),rewards:Rewards.get(profile.id),days});
    const stats=document.createElement('div'); stats.className='summary-stats';
    [
      ['Activities', String(summary.activityCount), summary.period],
      ['Subjects', String(summary.subjects.length), 'different learning areas'],
      ['Explorer Stars', String(summary.explorerStars), 'local learning rewards'],
      ['Question accuracy', summary.scorePercent===null?'—':`${summary.scorePercent}%`, summary.scoredCount?`across ${summary.scoredCount} scored activities`:'no scored activities in this period']
    ].forEach(([label,value,note])=>{
      const card=document.createElement('article'); const small=document.createElement('small'); small.textContent=label; const strong=document.createElement('strong'); strong.textContent=value; const p=document.createElement('p'); p.textContent=note; card.append(small,strong,p); stats.appendChild(card);
    });
    box.appendChild(stats);

    const columns=document.createElement('div'); columns.className='summary-columns';
    const makeList=(title,items,emptyText)=>{
      const section=document.createElement('section'); section.className='summary-list-card'; const h=document.createElement('h4'); h.textContent=title; section.appendChild(h);
      if(!items.length){const e=document.createElement('p');e.className='summary-empty';e.textContent=emptyText;section.appendChild(e);return section;}
      const list=document.createElement('ul'); items.forEach(item=>{const li=document.createElement('li'); li.textContent=item.count?`${item.label} — ${item.count}`:item; list.appendChild(li);}); section.appendChild(list); return section;
    };
    columns.append(
      makeList('Learning areas',summary.subjects,'No learning areas recorded in this period.'),
      makeList('Recent objectives',summary.objectives,'No objectives recorded in this period.'),
      makeList('Participation notes',summary.modes,'No participation notes recorded in this period.')
    );
    box.appendChild(columns);

    const recent=document.createElement('section'); recent.className='summary-recent'; const h=document.createElement('h4'); h.textContent='Recent learning records'; recent.appendChild(h);
    if(!summary.recent.length){const e=document.createElement('p');e.className='summary-empty';e.textContent='No Learning Passport records in this period.';recent.appendChild(e);} else {
      summary.recent.forEach(item=>{const row=document.createElement('div');row.className='summary-recent-row';const copy=document.createElement('div');const title=document.createElement('strong');title.textContent=item.title;const meta=document.createElement('small');meta.textContent=`${item.subject} • ${new Date(item.createdAt).toLocaleDateString()}`;copy.append(title,meta);row.appendChild(copy);recent.appendChild(row);});
    }
    box.appendChild(recent);
    const privacy=document.createElement('p'); privacy.className='summary-privacy'; privacy.textContent=summary.privacyNote; box.appendChild(privacy);
  }


  function evidenceStepList(containerId, steps) {
    const box=$(containerId); box.innerHTML='';
    steps.forEach((text,index)=>{
      const row=document.createElement('div'); row.className='step-check';
      const num=document.createElement('span'); num.textContent=String(index+1);
      const strong=document.createElement('strong'); strong.textContent=text;
      row.append(num,strong); box.appendChild(row);
    });
  }

  function renderEvidenceDetective() {
    const profile=Store.getActiveProfile();
    evidenceLesson=LifeSkills.get('evidence',activeAgeBand());
    $('evidenceAgeIntro').textContent = activeAgeBand()==='13-16'
      ? 'Use AI for questions, search terms and counter-arguments, then trace important claims to checkable sources. Never trust a citation only because it looks convincing.'
      : 'Orish can help form a question, but important answers should be checked with a trusted source, observation or grown-up.';
    $('evidenceIcon').textContent=evidenceLesson.icon;
    $('evidenceAge').textContent=evidenceLesson.label;
    $('evidenceLessonTitle').textContent=evidenceLesson.title;
    $('evidenceLessonIntro').textContent=evidenceLesson.intro;
    evidenceStepList('evidenceLessonSteps',evidenceLesson.steps);
    $('evidenceQuestion').textContent=evidenceLesson.question;
    $('evidenceFeedback').textContent='';
    $('completeEvidenceLesson').classList.add('hidden');
    const choices=$('evidenceChoices'); choices.innerHTML='';
    evidenceLesson.choices.forEach((choice,index)=>{
      const button=document.createElement('button'); button.type='button'; button.className='answer-button'; button.textContent=choice;
      button.addEventListener('click',()=>{
        [...choices.querySelectorAll('button')].forEach(b=>b.disabled=true);
        if(index===evidenceLesson.correct){
          button.classList.add('correct'); $('evidenceFeedback').textContent=evidenceLesson.explanation; $('completeEvidenceLesson').classList.remove('hidden');
        } else {
          button.classList.add('incorrect'); $('evidenceFeedback').textContent='Check the lesson steps. AI can be useful, but a confident answer is not the same thing as checkable evidence.';
          window.setTimeout(()=>{[...choices.querySelectorAll('button')].forEach(b=>{b.disabled=false;b.classList.remove('incorrect');});},550);
        }
      }); choices.appendChild(button);
    });
    $('researchNotebookStatus').textContent = profile ? `Notebook practice for ${profile.nickname}. Raw notebook text and drawing are not automatically stored.` : 'Notebook practice stays on this screen. Raw text and drawing are not automatically stored.';
    setupResearchCanvas();
  }

  function finishEvidenceLesson() {
    const profile=Store.getActiveProfile(); if(!evidenceLesson)return;
    let msg='Evidence lesson complete. Remember: ask, check, compare, document.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({subject:evidenceLesson.subject,title:evidenceLesson.familyTitle,detail:'AI evidence-checking lesson completed • raw prompts/notes not retained',framework:Curriculum.getFrameworkName(profile.curriculum),objective:evidenceLesson.objective,independence:evidenceLesson.mode==='guided'?'Parent-led shared research literacy':evidenceLesson.mode==='supported'?'Adult-supported research literacy':'Independent research-literacy practice'});
      msg=`Saved the learning skill — not the raw research text — to ${profile.nickname}’s Learning Passport.`;
    }
    if(profile){const reward=Rewards.recordActivity(profile.id,{type:'evidence-literacy',subject:evidenceLesson.subject,title:evidenceLesson.familyTitle,shared:evidenceLesson.mode==='guided'});if(reward.awarded)msg+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;if(reward.repeat)msg+=' Replay complete — no extra stars today.';}
    $('evidenceFeedback').textContent=msg; $('completeEvidenceLesson').classList.add('hidden'); renderTodayCounts();
  }

  function setupResearchCanvas(){
    const canvas=$('researchCanvas'); if(!canvas || canvas.dataset.ready==='1') return;
    const ctx=canvas.getContext('2d');
    ctx.lineWidth=4; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.strokeStyle='#102234';
    const point=(event)=>{const r=canvas.getBoundingClientRect();return {x:(event.clientX-r.left)*(canvas.width/r.width),y:(event.clientY-r.top)*(canvas.height/r.height)}};
    canvas.addEventListener('pointerdown',event=>{researchDrawing=true;canvas.setPointerCapture(event.pointerId);const p=point(event);ctx.beginPath();ctx.moveTo(p.x,p.y);});
    canvas.addEventListener('pointermove',event=>{if(!researchDrawing)return;const p=point(event);ctx.lineTo(p.x,p.y);ctx.stroke();});
    const stop=()=>{researchDrawing=false;ctx.beginPath();}; canvas.addEventListener('pointerup',stop);canvas.addEventListener('pointercancel',stop);canvas.addEventListener('pointerleave',stop);
    canvas.dataset.ready='1';
  }

  function clearResearchCanvas(){const canvas=$('researchCanvas');const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);$('researchNotebookStatus').textContent='Drawing cleared. Nothing was uploaded.';}
  function clearResearchNotebook(){['researchQuestion','researchClaim','researchSource','researchObservation','researchConclusion'].forEach(id=>$(id).value='');$('researchConfidence').selectedIndex=2;clearResearchCanvas();$('researchNotebookStatus').textContent='Notebook cleared from this screen.';}
  function finishResearchNotebook(){
    const profile=Store.getActiveProfile();
    const filled=['researchQuestion','researchClaim','researchSource','researchObservation','researchConclusion'].filter(id=>Store.cleanText($(id).value,800)).length;
    let msg=filled>=3?'Notebook practice complete: you documented a question, evidence and reasoning.':'Try to document at least a question, evidence/source and conclusion before finishing.';
    if(filled<3){$('researchNotebookStatus').textContent=msg;return;}
    if(profile?.evidenceEnabled){Store.addEvidence({subject:'Digital & information literacy',title:'Investigation Notebook Practice',detail:'Research documentation practice completed • raw notes and drawing were not retained',framework:Curriculum.getFrameworkName(profile.curriculum),objective:'Document a research question, source/evidence, observation or inference, conclusion and confidence without treating AI output as proof.',independence:activeAgeBand()==='0-2'?'Parent-led shared documentation':'Notebook practice'});msg=`Learning skill saved to ${profile.nickname}’s Passport. Raw notebook text and drawing remain unsaved.`;}
    $('researchNotebookStatus').textContent=msg; renderTodayCounts();
  }

  function renderGlobalHistory() {
    const age = activeAgeBand();
    const meta = GlobalHistory.ageMeta(age);
    $('historyAgePill').textContent = meta.label;
    $('historyAgeIntro').textContent = meta.prompt;
    $('historySourceCount').textContent = `${GlobalHistory.sourceCount()} checked source records in this starter pack`;
    renderHistoryMode();
  }

  function setHistoryMode(mode) {
    historyMode = mode === 'cultures' ? 'cultures' : 'changemakers';
    document.querySelectorAll('[data-history-mode]').forEach(button => {
      const active = button.dataset.historyMode === historyMode;
      button.classList.toggle('selected', active);
      button.setAttribute('aria-pressed', String(active));
    });
    renderHistoryMode();
  }

  function renderHistoryMode() {
    if (!GlobalHistory) return;
    const items = historyMode === 'cultures' ? GlobalHistory.listCultures() : GlobalHistory.listChangemakers();
    const grid = $('historyGrid'); grid.innerHTML = '';
    items.forEach(item => {
      const button = document.createElement('button');
      button.type='button'; button.className='history-card';
      const icon=document.createElement('span');icon.className='history-card-icon';icon.textContent=item.icon;
      const copy=document.createElement('span');copy.className='history-card-copy';
      const region=document.createElement('small');region.textContent=item.region;
      const name=document.createElement('strong');name.textContent=item.name;
      const field=document.createElement('em');field.textContent=historyMode==='cultures'?item.theme:item.field;
      copy.append(region,name,field);button.append(icon,copy);
      button.addEventListener('click',()=>openHistoryItem(item.id)); grid.appendChild(button);
    });
    currentHistoryItem=null;
    $('historyPlayerTitle').textContent = historyMode==='cultures' ? 'Choose a culture journey' : 'Choose a changemaker';
    $('historyPlayerMeta').textContent = historyMode==='cultures' ? 'Living cultures are taught with context, variation and respect.' : 'Black history stays available all year and includes overlooked people as well as familiar names.';
    $('historyPlayerIntro').textContent=''; $('historyJourney').innerHTML=''; $('historyMission').textContent=''; $('historyChoices').innerHTML=''; $('historyFeedback').textContent=''; $('historySources').innerHTML=''; $('historyContext').textContent='Choose a journey to see context, impact and evidence.'; $('completeHistoryMission').classList.add('hidden'); $('speakHistory').disabled=true;
  }

  function openHistoryItem(id) {
    const isCulture = historyMode==='cultures';
    currentHistoryItem = isCulture ? GlobalHistory.getCulture(id) : GlobalHistory.getChangemaker(id);
    if(!currentHistoryItem) return;
    $('historyPlayerIcon').textContent=currentHistoryItem.icon;
    $('historyPlayerTitle').textContent=currentHistoryItem.name;
    $('historyPlayerMeta').textContent=isCulture ? `${currentHistoryItem.region} • ${currentHistoryItem.communities}` : `${currentHistoryItem.years} • ${currentHistoryItem.region} • ${currentHistoryItem.field}`;
    $('historyPlayerIntro').textContent=currentHistoryItem.short;
    const journey=$('historyJourney'); journey.innerHTML='';
    const steps=isCulture ? currentHistoryItem.explore : currentHistoryItem.journey;
    steps.forEach((text,index)=>{
      const row=document.createElement('article');row.className='history-timeline-step';
      const marker=document.createElement('span');marker.textContent=String(index+1);
      const p=document.createElement('p');p.textContent=text;row.append(marker,p);journey.appendChild(row);
    });
    const context=$('historyContext');
    context.textContent=isCulture ? currentHistoryItem.respect : `What changed: ${currentHistoryItem.changed}`;
    const mission=$('historyMission');
    const ageMeta=GlobalHistory.ageMeta(activeAgeBand());
    mission.textContent=activeAgeBand()==='0-2' ? 'Grown-up prompt: look together, say the person/place name, and share one true idea in your own words.' : (isCulture ? `Off-screen mission: ${currentHistoryItem.mission}` : currentHistoryItem.question);
    const choices=$('historyChoices');choices.innerHTML='';
    $('historyFeedback').textContent='';$('completeHistoryMission').classList.add('hidden');
    if(activeAgeBand()==='0-2'){
      const shared=document.createElement('button');shared.type='button';shared.className='answer-button';shared.textContent='Grown-up: we looked and listened together';
      shared.addEventListener('click',()=>{$('historyFeedback').textContent='Shared history moment complete. No baby score or independent quiz is used.';$('completeHistoryMission').classList.remove('hidden');});
      choices.appendChild(shared);
    } else if(isCulture){
      const ready=document.createElement('button');ready.type='button';ready.className='answer-button';ready.textContent='I understand: learn the context, then create something original';
      ready.addEventListener('click',()=>{$('historyFeedback').textContent='Good history practice: appreciate, investigate and create without turning a living culture into a costume or stereotype.';$('completeHistoryMission').classList.remove('hidden');});
      choices.appendChild(ready);
    } else {
      currentHistoryItem.choices.forEach((choice,index)=>{
        const button=document.createElement('button');button.type='button';button.className='answer-button';button.textContent=choice;
        button.addEventListener('click',()=>{
          [...choices.querySelectorAll('button')].forEach(b=>b.disabled=true);
          if(index===currentHistoryItem.correct){button.classList.add('correct');$('historyFeedback').textContent='That conclusion fits the source-backed journey. History is stronger when the claim matches the evidence and context.';$('completeHistoryMission').classList.remove('hidden');}
          else {button.classList.add('incorrect');$('historyFeedback').textContent='Try again by using the journey as evidence rather than guessing from the person’s fame or identity.';setTimeout(()=>{[...choices.querySelectorAll('button')].forEach(b=>{b.disabled=false;b.classList.remove('incorrect');});},550);}
        });choices.appendChild(button);
      });
    }
    const sources=$('historySources');sources.innerHTML='';
    currentHistoryItem.sourceTrail.forEach(source=>{
      const row=document.createElement('div');row.className='history-source-row';
      const org=document.createElement('strong');org.textContent=source.org;
      const title=document.createElement('span');title.textContent=source.title;
      const domain=document.createElement('small');try{domain.textContent=new URL(source.url).hostname.replace(/^www\./,'');}catch{domain.textContent='Source record';}
      row.append(org,title,domain);sources.appendChild(row);
    });
    $('speakHistory').disabled=false;
    $('historyPlayer').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function speakHistoryItem(){
    if(!currentHistoryItem) return;
    const isCulture=historyMode==='cultures';
    const extra=isCulture ? currentHistoryItem.explore.join(' ') : currentHistoryItem.journey.join(' ');
    say(`${currentHistoryItem.name}. ${currentHistoryItem.short} ${extra}`);
  }

  function completeHistoryMission(){
    if(!currentHistoryItem)return;
    const profile=Store.getActiveProfile();
    const isCulture=historyMode==='cultures';
    const meta=GlobalHistory.ageMeta(activeAgeBand());
    let msg=isCulture?'Culture journey complete.':'History investigation complete.';
    if(profile?.evidenceEnabled){
      Store.addEvidence({subject:isCulture?'History, culture & citizenship':'History & evidence',title:currentHistoryItem.name,detail:isCulture?'Source-backed culture/context mission completed; no private family history retained':'Source-backed changemaker investigation completed',framework:Curriculum.getFrameworkName(profile.curriculum),objective:isCulture?'Describe a cultural practice with place, community, historical context and respectful variation rather than stereotypes.':'Use a biographical journey and source trail to connect a person’s work with historical context, evidence and impact.',independence:meta.mode==='guided'?'Parent-led shared history':meta.mode==='supported'?'Adult-supported history investigation':'Independent evidence-based history investigation'});
      msg=`Saved the learning outcome — not private notes — to ${profile.nickname}’s Learning Passport.`;
    }
    if(profile){const reward=Rewards.recordActivity(profile.id,{type:isCulture?'culture-history':'global-history',subject:'History & culture',title:currentHistoryItem.name,shared:meta.mode==='guided'});if(reward.awarded)msg+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;if(reward.repeat)msg+=' Replay complete — no extra stars today.';}
    $('historyFeedback').textContent=msg;$('completeHistoryMission').classList.add('hidden');renderTodayCounts();
  }

  function localizeLifeSkillText(text, profile){
    const symbol=LifeSkills.currencySymbol(profile?.curriculum || activeFramework());
    return String(text||'').replace(/£20\/\$20/g,`${symbol}20`).replace(/\b20 units\b/g,`${symbol}20`);
  }

  function renderLifeSkills() {
    const profile=Store.getActiveProfile();
    $('lifeSkillsNote').textContent=LifeSkills.jurisdictionNote(profile?.curriculum || activeFramework())+' Financial examples are practice scenarios, not financial advice.';
    const grid=$('lifeSkillGrid');grid.innerHTML='';
    LifeSkills.list(activeAgeBand()).filter(item=>item.key!=='evidence').forEach(item=>{
      grid.appendChild(makeScienceCard({icon:item.icon,name:item.familyTitle,skill:item.subject},()=>openLifeSkill(item.key),item.label));
    });
    currentLifeSkill=null;$('lifeSkillMissionTitle').textContent='Choose a mission';$('lifeSkillMissionIntro').textContent='Select Money Missions or Rights, Rules & Choices.';$('lifeSkillSteps').innerHTML='';$('lifeSkillQuestion').textContent='';$('lifeSkillChoices').innerHTML='';$('lifeSkillFeedback').textContent='';$('completeLifeSkill').classList.add('hidden');
  }

  function openLifeSkill(key){
    const profile=Store.getActiveProfile(); currentLifeSkill=LifeSkills.get(key,activeAgeBand()); if(!currentLifeSkill)return;
    $('lifeSkillIcon').textContent=currentLifeSkill.icon;$('lifeSkillAge').textContent=currentLifeSkill.label;$('lifeSkillMissionTitle').textContent=currentLifeSkill.title;$('lifeSkillMissionIntro').textContent=localizeLifeSkillText(currentLifeSkill.intro,profile);
    evidenceStepList('lifeSkillSteps',currentLifeSkill.steps.map(step=>localizeLifeSkillText(step,profile)));
    $('lifeSkillQuestion').textContent=localizeLifeSkillText(currentLifeSkill.question,profile);$('lifeSkillFeedback').textContent='';$('completeLifeSkill').classList.add('hidden');
    const choices=$('lifeSkillChoices');choices.innerHTML='';
    currentLifeSkill.choices.forEach((choice,index)=>{const button=document.createElement('button');button.type='button';button.className='answer-button';button.textContent=localizeLifeSkillText(choice,profile);button.addEventListener('click',()=>{[...choices.querySelectorAll('button')].forEach(b=>b.disabled=true);if(index===currentLifeSkill.correct){button.classList.add('correct');$('lifeSkillFeedback').textContent=currentLifeSkill.explanation;$('completeLifeSkill').classList.remove('hidden');}else{button.classList.add('incorrect');$('lifeSkillFeedback').textContent='Review the mission steps and try the choice that protects the budget, evidence, rights or safety more carefully.';window.setTimeout(()=>{[...choices.querySelectorAll('button')].forEach(b=>{b.disabled=false;b.classList.remove('incorrect');});},550);}});choices.appendChild(button);});
    $('lifeSkillPlayer').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function finishLifeSkill(){
    const profile=Store.getActiveProfile();if(!currentLifeSkill)return;let msg='Real-world mission complete.';
    if(profile?.evidenceEnabled){Store.addEvidence({subject:currentLifeSkill.subject,title:currentLifeSkill.familyTitle,detail:'Age-adapted real-world decision mission completed',framework:Curriculum.getFrameworkName(profile.curriculum),objective:currentLifeSkill.objective,independence:currentLifeSkill.mode==='guided'?'Parent-led shared activity':currentLifeSkill.mode==='supported'?'Adult-supported real-world learning':'Independent scenario reasoning'});msg=`Saved privately to ${profile.nickname}’s Learning Passport.`;}
    if(profile){const reward=Rewards.recordActivity(profile.id,{type:'life-skills',subject:currentLifeSkill.subject,title:currentLifeSkill.familyTitle,shared:currentLifeSkill.mode==='guided'});if(reward.awarded)msg+=` +${reward.awarded} Explorer Star${reward.awarded===1?'':'s'}.`;if(reward.repeat)msg+=' Replay complete — today’s stars were already earned.';}
    $('lifeSkillFeedback').textContent=msg;$('completeLifeSkill').classList.add('hidden');renderTodayCounts();
  }

  function exportEvidence() {
    const data = Store.exportActiveProfileData();
    if (!data) { window.alert('Select a child profile first.'); return; }
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url;
    a.download=`orish-learning-passport-${data.profile.nickname.toLowerCase().replace(/[^a-z0-9]+/g,'-') || 'explorer'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const showcaseScenes = {
    origin: {
      number:'01', eyebrow:'WHY IT EXISTS', image:'assets/learning-adventures.webp',
      title:'A six-year-old asked for a learning game that is actually fun.',
      copy:'Orish’s World begins with play, curiosity and movement — then grows with the child into science, evidence, technology and real-world problem solving.',
      speech:'Tap the glowing points. This is a doorway into the real prototype, not a picture pretending to be a game.',
      proofCore:'£0', proofMode:'origin', proofTitle:'Built before paid AI',
      proofText:'The current experience runs as a mobile-first local PWA with reusable learning engines, device speech and parent controls.',
      proof:['Age-adaptive','Interactive','Local-first'],
      primary:{label:'Try the age-6 world',action:'age6'},
      hotspots:[
        {label:'Age 6 experience',action:'age6',x:'20%',y:'34%'},
        {label:'Talk to Orish',action:'orish',x:'47%',y:'23%'},
        {label:'Explore the world',action:'world',x:'66%',y:'47%'},
        {label:'Create an avatar',action:'avatar',x:'78%',y:'30%'}
      ]
    },
    learning: {
      number:'02', eyebrow:'DISCOVERY DISTRICT', image:'assets/fossil-detective.webp',
      title:'Children investigate instead of just tapping answers.',
      copy:'Science missions ask children to notice clues, compare evidence, explain uncertainty and decide what would make an explanation stronger.',
      speech:'This fossil mission can open as a real age-adapted investigation. The same engine scales the reasoning as the child grows.',
      proofCore:'66+', proofMode:'learning', proofTitle:'Science + mystery variants',
      proofText:'Fossils, weather, oceans, plants, space, black holes, strange signals and other investigations already use reusable evidence-aware engines.',
      proof:['Fossils','Space','Evidence'],
      primary:{label:'Play Fossil Detective',action:'fossils'},
      hotspots:[
        {label:'Fossil Detective',action:'fossils',x:'24%',y:'33%'},
        {label:'Science World',action:'science',x:'58%',y:'24%'},
        {label:'Evidence Detective',action:'evidence',x:'72%',y:'50%'},
        {label:'Global History',action:'history',x:'43%',y:'56%'}
      ]
    },
    skills: {
      number:'03', eyebrow:'SKILLS ACADEMY', image:'assets/fraction-rescue.webp',
      title:'The game engines are reusable — the challenge changes with age.',
      copy:'Maths, reading, memory, observation, logic and branching stories are playable engines rather than fixed worksheets or static question screens.',
      speech:'Pick a glowing skill and I will take you into the working activity. There is no speed race and no leaderboard pressure.',
      proofCore:'20+', proofMode:'learning', proofTitle:'Connected learning pathways',
      proofText:'One world routes children into approved activities while the language, difficulty and learning objective adapt to the active age experience.',
      proof:['Maths','Literacy','Memory'],
      primary:{label:'Play Fraction Rescue',action:'maths'},
      hotspots:[
        {label:'Maths Lab',action:'maths',x:'25%',y:'42%'},
        {label:'Reading Lab',action:'literacy',x:'54%',y:'24%'},
        {label:'Memory Lab',action:'memory',x:'72%',y:'45%'}
      ]
    },
    safety: {
      number:'04', eyebrow:'SAFETY IS THE ARCHITECTURE', image:'assets/learning-adventures.webp',
      title:'The child experience is restricted before a live model is ever connected.',
      copy:'Approved game engines, age rules, parent permissions, local-first prototype data and blocked future capabilities form the safety boundary around Orish.',
      speech:'A moderation API can help later, but it will never be the only safeguard. The child app keeps its own rules and approved routes.',
      proofCore:'✓', proofMode:'safety', proofTitle:'Guardrails already designed',
      proofText:'No ads, no trackers, no open child social network, no unrestricted web research and no arbitrary AI-generated code execution.',
      proof:['Parent controls','No open web','Server-side keys'],
      primary:{label:'See Parent safety gate',action:'parent'},
      hotspots:[
        {label:'Parent Studio',action:'parent',x:'22%',y:'32%'},
        {label:'Learning Passport',action:'rewards',x:'52%',y:'23%'},
        {label:'No open web',action:'safetyInfo',x:'70%',y:'44%'}
      ]
    },
    cloud: {
      number:'05', eyebrow:'CLOUD-READY NEXT LAYER', image:'assets/orish-explorer.webp',
      title:'Cloud AI plugs into a controlled gateway — it does not replace the product.',
      copy:'Trial credit can be used to measure real conversational, moderation, generation and compute costs before deciding what belongs in a free tier or subscription.',
      speech:'The prototype is already useful without paid AI. Cloud services would add selected intelligence and generation only where they improve the experience safely.',
      proofCore:'API', proofMode:'cloud', proofTitle:'Measure before pricing',
      proofText:'Trial usage → cost per activity → cost per child → useful free allowance → sustainable paid subscription. No invented cost assumptions.',
      proof:['Secure gateway','Moderation layer','Elastic compute'],
      primary:{label:'Enter the working world',action:'world'},
      hotspots:[
        {label:'Secure AI gateway',action:'cloudInfo',x:'24%',y:'28%'},
        {label:'Moderation layer',action:'cloudInfo',x:'52%',y:'20%'},
        {label:'Generation tools',action:'cloudInfo',x:'72%',y:'40%'},
        {label:'GPU / serverless',action:'cloudInfo',x:'43%',y:'48%'}
      ]
    }
  };

  const showcaseSceneOrder = ['origin','learning','skills','safety','cloud'];

  function renderShowcaseScene(key, options={}) {
    const scene = showcaseScenes[key] || showcaseScenes.origin;
    showcaseSceneKey = key in showcaseScenes ? key : 'origin';
    const stage = $('partnerStage');
    if (!stage) return;
    stage.dataset.scene = showcaseSceneKey;
    stage.classList.remove('scene-flash');
    void stage.offsetWidth;
    stage.classList.add('scene-flash');
    $('partnerSceneImage').src = scene.image;
    $('partnerSceneNumber').textContent = scene.number;
    $('partnerSceneEyebrow').textContent = scene.eyebrow;
    $('partnerSceneTitle').textContent = scene.title;
    $('partnerSceneCopy').textContent = scene.copy;
    $('partnerOrishSpeech').querySelector('p').textContent = scene.speech;
    $('showcasePrimaryAction').textContent = scene.primary.label;
    $('showcasePrimaryAction').dataset.action = scene.primary.action;
    const proofVisual = $('showcaseProofVisual');
    proofVisual.dataset.mode = scene.proofMode;
    proofVisual.querySelector('.proof-core').textContent = scene.proofCore;
    $('showcaseProofTitle').textContent = scene.proofTitle;
    $('showcaseProofText').textContent = scene.proofText;
    $('showcaseProofList').innerHTML = scene.proof.map(item => `<span>${item}</span>`).join('');
    $('partnerCloudNetwork').classList.toggle('hidden', showcaseSceneKey !== 'cloud');
    $('partnerStageOrish').classList.toggle('hidden', showcaseSceneKey === 'learning' || showcaseSceneKey === 'skills');
    $('partnerHotspots').innerHTML = '';
    scene.hotspots.forEach(point => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'partner-hotspot';
      button.style.setProperty('--hx', point.x);
      button.style.setProperty('--hy', point.y);
      button.dataset.action = point.action;
      button.textContent = point.label;
      button.addEventListener('click', () => runShowcaseAction(point.action));
      $('partnerHotspots').appendChild(button);
    });
    document.querySelectorAll('.showcase-scene-button').forEach(button => {
      const active = button.dataset.showcaseScene === showcaseSceneKey;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'step' : 'false');
    });
    const index = showcaseSceneOrder.indexOf(showcaseSceneKey);
    $('showcaseProgressBar').style.width = `${((index + 1) / showcaseSceneOrder.length) * 100}%`;
    if (options.speak) say(`${scene.title} ${scene.speech}`);
  }

  function setShowcaseTour(running) {
    const stage = $('partnerStage');
    const toggle = $('showcaseTourToggle');
    if (showcaseTourTimer) window.clearInterval(showcaseTourTimer);
    showcaseTourTimer = null;
    stage?.classList.toggle('tour-running', running);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(running));
      toggle.textContent = running ? '❚❚ Pause tour' : '▶ Guided tour';
    }
    if (!running) return;
    showcaseTourTimer = window.setInterval(() => {
      const index = showcaseSceneOrder.indexOf(showcaseSceneKey);
      renderShowcaseScene(showcaseSceneOrder[(index + 1) % showcaseSceneOrder.length]);
    }, 5800);
  }

  function enterShowcaseAgeSix(target='world') {
    demoAgeOverride = '4-6';
    $('ageBand').value = '4-6';
    updateChildExperience();
    if (target === 'orish') {
      show('orishPanel');
      say('Hi! I am Orish. Tell me what you want to learn and I will turn it into one of my safe learning adventures.');
      return;
    }
    show('childWorld');
    say('Welcome to the age six Orish’s World demo. Tap a district, choose a mission, or talk to Orish.');
  }

  function runShowcaseAction(action) {
    setShowcaseTour(false);
    switch (action) {
      case 'age6': enterShowcaseAgeSix('world'); break;
      case 'orish': enterShowcaseAgeSix('orish'); break;
      case 'avatar': demoAgeOverride='4-6'; updateChildExperience(); renderAvatarLab(); show('avatarPanel'); break;
      case 'world': demoAgeOverride = demoAgeOverride || '4-6'; updateChildExperience(); show('childWorld'); break;
      case 'science': demoAgeOverride='4-6'; updateChildExperience(); renderScienceWorld(); show('sciencePanel'); break;
      case 'fossils': demoAgeOverride='4-6'; updateChildExperience(); openDiscovery('expedition','fossils'); break;
      case 'evidence': demoAgeOverride='4-6'; updateChildExperience(); renderEvidenceDetective(); show('evidencePanel'); break;
      case 'history': demoAgeOverride='4-6'; updateChildExperience(); renderGlobalHistory(); show('globalHistoryPanel'); break;
      case 'maths': demoAgeOverride='4-6'; updateChildExperience(); renderMathsGame(); show('mathsPanel'); break;
      case 'literacy': demoAgeOverride='4-6'; updateChildExperience(); renderLiteracyGame(); show('literacyPanel'); break;
      case 'memory': demoAgeOverride='4-6'; updateChildExperience(); renderMemoryGame(); show('memoryPanel'); break;
      case 'rewards': renderRewards(); show('rewardsPanel'); break;
      case 'parent': openParentGate(); break;
      case 'safetyInfo': renderShowcaseScene('safety', {speak:true}); break;
      case 'cloudInfo': renderShowcaseScene('cloud', {speak:true}); break;
      default: renderShowcaseScene(showcaseSceneKey);
    }
  }

  // Navigation + world
  $('homeButton').addEventListener('click', () => { demoAgeOverride=null; setShowcaseTour(false); show('landing'); });
  $('partnerDemoButton')?.addEventListener('click', () => { demoAgeOverride=null; show('partnerDemo'); renderShowcaseScene('origin'); });
  $('partnerBackHome')?.addEventListener('click', () => { setShowcaseTour(false); demoAgeOverride=null; show('landing'); });
  $('partnerEnterWorld')?.addEventListener('click', () => runShowcaseAction('world'));
  $('showcasePrimaryAction')?.addEventListener('click', event => runShowcaseAction(event.currentTarget.dataset.action));
  $('showcaseSpeak')?.addEventListener('click', () => { const scene=showcaseScenes[showcaseSceneKey]; say(`${scene.title} ${scene.speech}`); });
  $('showcaseTourToggle')?.addEventListener('click', () => setShowcaseTour($('showcaseTourToggle').getAttribute('aria-pressed') !== 'true'));
  document.querySelectorAll('.showcase-scene-button').forEach(button => button.addEventListener('click', () => { setShowcaseTour(false); renderShowcaseScene(button.dataset.showcaseScene); }));
  $('startChild').addEventListener('click', () => { demoAgeOverride=null; updateChildExperience(); show('childWorld'); });
  $('talkToOrish').addEventListener('click', () => { show('orishPanel'); say(ageProfiles[activeAgeBand()].voice); });
  $('accessibilityButton').addEventListener('click', () => { renderAccessibilityCentre(); show('accessibilityPanel'); });
  $('parentGateButton').addEventListener('click', openParentGate);
  $('cancelParentGate').addEventListener('click', () => show('landing'));
  $('unlockParent').addEventListener('click', handleGateSubmit);
  $('parentPin').addEventListener('keydown', event => { if (event.key === 'Enter') handleGateSubmit(); });
  $('parentPinConfirm').addEventListener('keydown', event => { if (event.key === 'Enter') handleGateSubmit(); });
  document.querySelectorAll('.back-to-world').forEach(button => button.addEventListener('click', () => show('childWorld')));
  $('ageBand').addEventListener('change', updateChildExperience);

  $('avatarRealMode')?.addEventListener('click',()=>setAvatarDraft({mode:'real'},{announce:true}));
  $('avatarCreativeMode')?.addEventListener('click',()=>setAvatarDraft({mode:'creative'},{announce:true}));
  $('avatarSurprise')?.addEventListener('click',()=>{ const mode=avatarDraft?.mode||'creative'; avatarDraft=AvatarLab.surprise(mode); avatarAngle=avatarDraft.angle; updateAvatarModel(); renderAvatarControls(); $('avatarSaveStatus').textContent='Surprise explorer created — save it if you like it.'; });
  $('avatarSave')?.addEventListener('click',saveAvatar);
  $('avatarRotateLeft')?.addEventListener('click',()=>rotateAvatar(-25));
  $('avatarRotateRight')?.addEventListener('click',()=>rotateAvatar(25));
  $('avatarResetView')?.addEventListener('click',()=>{ stopAvatarAutoSpin(); avatarAngle=0; if(avatarDraft) avatarDraft={...avatarDraft,angle:0}; updateAvatarModel(); });
  $('avatarAutoSpin')?.addEventListener('click',toggleAvatarAutoSpin);
  document.querySelectorAll('[data-avatar-pose]').forEach(button=>button.addEventListener('click',()=>playAvatarPose(button.dataset.avatarPose)));
  $('worldExplorerEdit')?.addEventListener('click',()=>{renderAvatarLab();show('avatarPanel');});
  $('worldExplorerWave')?.addEventListener('click',playWorldAvatarWave);
  window.addEventListener('orish-avatar:3d-ready',()=>{ if(!$('avatarPanel')?.classList.contains('hidden')) setTimeout(captureWorldAvatarPreview,120); });
  const avatarViewport=$('avatarViewport');
  avatarViewport?.addEventListener('pointerdown',event=>{ stopAvatarAutoSpin(); avatarDragging=true; avatarDragX=event.clientX; avatarViewport.setPointerCapture?.(event.pointerId); });
  avatarViewport?.addEventListener('pointermove',event=>{ if(!avatarDragging)return; const dx=event.clientX-avatarDragX; avatarDragX=event.clientX; avatarAngle+=dx*.8; if(avatarDraft)avatarDraft={...avatarDraft,angle:avatarAngle}; updateAvatarModel(); });
  const endAvatarDrag=()=>{ if(!avatarDragging)return; avatarDragging=false; $('avatarSaveStatus').textContent='Nice spin — change anything you like, then save your avatar.'; };
  avatarViewport?.addEventListener('pointerup',endAvatarDrag); avatarViewport?.addEventListener('pointercancel',endAvatarDrag);
  avatarViewport?.addEventListener('keydown',event=>{ if(event.key==='ArrowLeft'){event.preventDefault();rotateAvatar(-15);} if(event.key==='ArrowRight'){event.preventDefault();rotateAvatar(15);} if(event.key==='Home'){event.preventDefault();avatarAngle=0;if(avatarDraft)avatarDraft={...avatarDraft,angle:0};updateAvatarModel();} });

  document.querySelectorAll('.world-portal').forEach(button => button.addEventListener('click', () => selectWorldZone(button.dataset.zone)));
  if ($('dockWorldHome')) $('dockWorldHome').addEventListener('click', () => { updateChildExperience(); show('childWorld'); });
  if ($('dockOrish')) $('dockOrish').addEventListener('click', () => show('orishPanel'));
  if ($('dockMission')) $('dockMission').addEventListener('click', () => { if (!featureAllowed('mission')) return; renderMissionHQ(); show('missionPanel'); });
  if ($('dockRewards')) $('dockRewards').addEventListener('click', () => { renderRewards(); show('rewardsPanel'); });

  document.querySelectorAll('[data-world]').forEach(button => button.addEventListener('click', () => {
    const name=button.dataset.world;
    if (name==='Talk to Orish') { show('orishPanel'); return; }
    if (name==='Rewards') { renderRewards(); show('rewardsPanel'); return; }
    previewWorld(name);
    $('worldPreview').scrollIntoView({behavior:'smooth',block:'center'});
  }));

  $('previewAction').addEventListener('click', () => {
    if (selectedWorld==='Talk to Orish') { show('orishPanel'); return; }
    if (selectedWorld==='Mission HQ') { if(!featureAllowed('mission')) return; renderMissionHQ(); show('missionPanel'); return; }
    if (selectedWorld==='Science World') { renderScienceWorld(); show('sciencePanel'); return; }
    if (selectedWorld==='Are We Alone?') { renderAreWeAlone(); show('areWeAlonePanel'); return; }
    if (selectedWorld==='Evidence Detective') { renderEvidenceDetective(); show('evidencePanel'); return; }
    if (selectedWorld==='Global History & Culture') { renderGlobalHistory(); show('globalHistoryPanel'); return; }
    if (selectedWorld==='Real-World Missions') { renderLifeSkills(); show('lifeSkillsPanel'); return; }
    if (selectedWorld==='Home & Routines') { renderRoutinePanel(); show('routinePanel'); return; }
    if (selectedWorld==='Kitchen Lab') { if(!featureAllowed('kitchen')) return; renderKitchenPanel(); show('kitchenPanel'); return; }
    if (selectedWorld==='Make With Orish') { renderMakerPanel(); show('makerPanel'); return; }
    if (selectedWorld==='Creative Studio') { renderCreativeStudio(); show('creativePanel'); return; }
    if (selectedWorld==='My Avatar Lab') { renderAvatarLab(); show('avatarPanel'); return; }
    if (selectedWorld==='Family Clubhouse') { if(!featureAllowed('family')) return; renderFamilyClubhouse(); show('familyPanel'); return; }
    if (selectedWorld==='Memory Lab') { renderMemoryGame(); show('memoryPanel'); return; }
    if (selectedWorld==='Observation Lab') { renderObservationGame(); show('observationPanel'); return; }
    if (selectedWorld==='Maths Lab' || selectedWorld==='Learning Adventures') { renderMathsGame(); show('mathsPanel'); return; }
    if (selectedWorld==='Logic Lab') { renderSequenceGame(); show('sequencePanel'); return; }
    if (selectedWorld==='Reading & Keyboard Lab') { renderLiteracyGame(); show('literacyPanel'); return; }
    if (selectedWorld==='Story & Choice Lab') { renderStoryGame(); show('storyPanel'); return; }
    if (selectedWorld==='Accessibility Centre') { renderAccessibilityCentre(); show('accessibilityPanel'); return; }
    if (selectedWorld==='Good News') { if(!featureAllowed('goodNews')) return; renderGoodNews(); show('goodNewsPanel'); return; }
    if (selectedWorld==='Rewards') { renderRewards(); show('rewardsPanel'); return; }
    const gameKey=selectedWorld==='Learning Adventures'?'math':'space';
    startGame(gameKey);
  });

  // Mission HQ, routines and Kitchen Lab
  $('completeMission').addEventListener('click', completeCurrentMission);
  $('startMorningRoutine').addEventListener('click', () => startRoutine('morning'));
  $('startBedtimeRoutine').addEventListener('click', () => startRoutine('bedtime'));
  $('finishRoutine').addEventListener('click', finishCurrentRoutine);
  $('completeMakerProject').addEventListener('click', completeMakerProject);
  $('completeCreativeChallenge').addEventListener('click', completeCreativeChallenge);
  $('openVisualLab').addEventListener('click', () => { renderVisualGame(); show('visualGamePanel'); });
  $('visualBackCreative').addEventListener('click', () => { renderCreativeStudio(); show('creativePanel'); });
  $('finishVisualGame').addEventListener('click', finishVisualGame);
  $('revealFamilyAnswer').addEventListener('click', revealFamilyAnswer);
  $('nextFamilyQuestion').addEventListener('click', nextFamilyQuestion);
  $('speakFamilyActivity').addEventListener('click', speakFamilyActivity);
  $('completeFamilyActivity').addEventListener('click', completeFamilyActivity);
  $('openFamilyKitchen').addEventListener('click', () => { $('kitchenCategory').value='Family Baking'; renderKitchenPanel(); show('kitchenPanel'); });
  ['a11yTextSize','a11yHighContrast','a11yReducedMotion','a11ySpaciousText','a11ySimplifiedVisuals','a11ySpeechEnabled'].forEach(id => $(id).addEventListener('change', saveAccessibilityFromUI));
  $('testAccessibilityVoice').addEventListener('click', () => say('Hi. This is Orish spoken support. You can change text, contrast, motion and spacing without changing the learning challenge.'));
  $('resetAccessibility').addEventListener('click', resetAccessibilityPrefs);
  $('restartMemoryGame').addEventListener('click', renderMemoryGame);
  $('speakMemoryInstruction').addEventListener('click', () => currentMemoryGame && say(currentMemoryGame.instruction));
  $('finishMemoryGame').addEventListener('click', finishMemoryGame);
  $('restartObservationGame').addEventListener('click', renderObservationGame);
  $('speakObservationInstruction').addEventListener('click', () => currentObservationGame && say(currentObservationGame.instruction));
  $('finishObservationGame').addEventListener('click', finishObservationGame);
  $('restartMathsGame').addEventListener('click', renderMathsGame);
  $('speakMathsInstruction').addEventListener('click', () => currentMathsGame && say(currentMathsGame.instruction));
  $('mathsHint').addEventListener('click', showMathsHint);
  $('checkMathsAnswer').addEventListener('click', checkMathsAnswer);
  $('nextMathsRound').addEventListener('click', nextMathsRound);
  $('finishMathsGame').addEventListener('click', finishMathsGame);
  $('restartSequenceGame').addEventListener('click', renderSequenceGame);
  $('speakSequenceInstruction').addEventListener('click', () => currentSequenceGame && say(currentSequenceGame.instruction));
  $('sequenceHint').addEventListener('click', showSequenceHint);
  $('checkSequence').addEventListener('click', checkSequence);
  $('finishSequenceGame').addEventListener('click', finishSequenceGame);
  $('restartLiteracyGame').addEventListener('click', renderLiteracyGame);
  $('speakLiteracyInstruction').addEventListener('click', () => currentLiteracyGame && say(currentLiteracyGame.instruction));
  $('literacyHint').addEventListener('click', showLiteracyHint);
  $('checkLiteracyAnswer').addEventListener('click', checkLiteracyAnswer);
  $('nextLiteracyRound').addEventListener('click', nextLiteracyRound);
  $('finishLiteracyGame').addEventListener('click', finishLiteracyGame);
  $('restartStoryGame').addEventListener('click', renderStoryGame);
  $('speakStoryInstruction').addEventListener('click', () => currentStoryGame && say(currentStoryGame.instruction));
  $('finishStoryGame').addEventListener('click', finishStoryGame);
  $('readBeaconIntro').addEventListener('click', () => say(GoodNews.getAgeGuidance(activeAgeBand()).intro));
  $('openAreWeAlone')?.addEventListener('click',()=>{renderAreWeAlone();show('areWeAlonePanel');});
  $('areWeAloneBackScience')?.addEventListener('click',()=>{renderScienceWorld();show('sciencePanel');});
  $('speakAreWeAlone')?.addEventListener('click',speakAreWeAlone);
  $('areWeAloneNext')?.addEventListener('click',nextAreWeAloneStage);
  $('finishAreWeAlone')?.addEventListener('click',completeAreWeAlone);
  $('discoveryBackScience').addEventListener('click', () => { renderScienceWorld(); show('sciencePanel'); });
  $('speakDiscovery').addEventListener('click', () => currentDiscovery && say(`${currentDiscovery.title}. ${currentDiscovery.hook} ${currentDiscovery.facts.join(' ')}`));
  $('completeDiscovery').addEventListener('click', finishDiscovery);
  $('completeEvidenceLesson').addEventListener('click', finishEvidenceLesson);
  $('clearResearchCanvas').addEventListener('click', clearResearchCanvas);
  $('clearResearchNotebook').addEventListener('click', clearResearchNotebook);
  $('finishResearchNotebook').addEventListener('click', finishResearchNotebook);
  $('completeLifeSkill').addEventListener('click', finishLifeSkill);
  document.querySelectorAll('[data-history-mode]').forEach(button => button.addEventListener('click', () => setHistoryMode(button.dataset.historyMode)));
  $('speakHistory')?.addEventListener('click', speakHistoryItem);
  $('completeHistoryMission')?.addEventListener('click', completeHistoryMission);

  // Orish local voice / prompts
  $('speakWelcome').addEventListener('click', () => say(ageProfiles[activeAgeBand()].voice));
  $('sendToOrish').addEventListener('click', () => respondToPrompt($('orishInput').value));
  $('orishInput').addEventListener('keydown', event => { if(event.key==='Enter') respondToPrompt(event.currentTarget.value); });
  document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => respondToPrompt(button.dataset.prompt)));
  $('voiceMicButton')?.addEventListener('click', toggleVoiceTurn);
  $('voiceStopButton')?.addEventListener('click', () => window.OrishOpenVoice?.stopTurn?.());
  window.addEventListener('orish-voice:state', event => {
    if (!$('voiceMicButton')) return;
    const stage = event.detail?.stage;
    const listening = stage === 'listening';
    $('voiceMicButton').setAttribute('aria-pressed', listening ? 'true' : 'false');
    $('voiceMicButton').textContent = listening ? '■ Stop & send' : '🎤 Tap to talk';
    $('voiceStopButton')?.classList.toggle('hidden', !listening);
    if (stage === 'requesting-microphone') $('voiceGatewayStatus').textContent = 'Waiting for microphone permission…';
    if (stage === 'listening') $('voiceGatewayStatus').textContent = 'Listening now… tap Stop when you finish, or the turn will stop automatically.';
    if (stage === 'processing') $('voiceGatewayStatus').textContent = 'Turning your speech into words locally through the configured gateway…';
  });
  window.addEventListener('orish-voice:transcript', event => {
    const transcript = Store.cleanText(event.detail?.transcript || '', 180);
    if (!transcript) return;
    $('voiceTranscriptPreview').textContent = `I heard: “${transcript}”`;
    $('voiceTranscriptPreview').classList.remove('hidden');
    $('voiceGatewayStatus').textContent = 'Voice turn received. Orish is responding through the approved learning router.';
    respondToPrompt(transcript);
  });
  window.addEventListener('orish-voice:error', event => {
    $('voiceGatewayStatus').textContent = `Voice turn could not be completed: ${event.detail?.error || 'unknown error'}`;
  });

  // Game
  $('nextQuestion').addEventListener('click', () => {
    currentQuestion += 1;
    if (currentQuestion >= currentGame.questions.length) finishGame(); else renderQuestion();
  });

  // Parent Studio
  $('lockParent').addEventListener('click', () => { Store.lockParent(); configureGate(); show('parentGateScreen'); });
  $('saveProfile').addEventListener('click', saveProfileFromForm);
  $('newProfile').addEventListener('click', resetProfileForm);
  $('makeMission').addEventListener('click', makeMission);
  $('saveRoutines').addEventListener('click', saveRoutinesFromParent);
  $('saveKitchenSetup').addEventListener('click', saveKitchenFromParent);
  $('saveParentControls').addEventListener('click', saveParentControlsFromForm);
  $('resetParentControls').addEventListener('click', resetParentControlsToDefaults);
  $('clearActiveLearningData').addEventListener('click', clearActiveProfileRecords);
  $('kitchenCategory').addEventListener('change', renderKitchenPanel);
  $('measureMode').addEventListener('change', () => { if(currentRecipeId) showRecipe(currentRecipeId); });
  $('servingScale').addEventListener('change', () => { if(currentRecipeId) showRecipe(currentRecipeId); });
  $('startCookMode').addEventListener('click', startCookMode);
  $('cookPrev').addEventListener('click', () => moveCookStep(-1));
  $('cookNext').addEventListener('click', () => moveCookStep(1));
  $('cookTimerStart').addEventListener('click', toggleCookTimer);
  $('cookTimerReset').addEventListener('click', resetCookTimer);
  $('exportEvidence').addEventListener('click', exportEvidence);
  $('printEvidence').addEventListener('click', () => window.print());
  $('summaryPeriod').addEventListener('change', renderParentLearningSummary);
  $('clearLocalData').addEventListener('click', () => {
    const typed = window.prompt('Type DELETE to remove all Orish’s World prototype data stored in this browser.');
    if (typed === 'DELETE') {
      Store.clearAllLocalData();
      resetProfileForm();
      updateChildExperience();
      configureGate();
      show('landing');
    }
  });



  let deferredInstallPrompt = null;
  let pwaRegistration = null;

  function isStandaloneMode() {
    return window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;
  }

  function updateReleaseReadiness() {
    const online = navigator.onLine !== false;
    if ($('networkStatus')) $('networkStatus').textContent = online ? 'Online / local-ready' : 'Offline';
    if ($('footerConnectionStatus')) $('footerConnectionStatus').textContent = online ? 'online' : 'offline-ready';
    if ($('displayModeStatus')) $('displayModeStatus').textContent = isStandaloneMode() ? 'Installed app' : 'Browser tab';
    if ($('serviceWorkerStatus')) {
      const controlled = Boolean(navigator.serviceWorker?.controller);
      $('serviceWorkerStatus').textContent = controlled ? 'Offline shell active' : (pwaRegistration ? 'Installed — reload once' : 'Checking…');
    }
  }

  async function installOrishApp() {
    const help=$('installHelp');
    if (isStandaloneMode()) { if(help) help.textContent='Orish’s World is already running as an installed app.'; return; }
    if (!deferredInstallPrompt) {
      if(help) help.textContent='If no install prompt appears, use your browser menu. On iPhone/iPad Safari: Share → Add to Home Screen.';
      return;
    }
    deferredInstallPrompt.prompt();
    const choice=await deferredInstallPrompt.userChoice;
    if(help) help.textContent = choice.outcome === 'accepted' ? 'Install accepted. The app can now open from your Home Screen/app launcher.' : 'Install was not completed. You can try again later.';
    deferredInstallPrompt=null;
    updateReleaseReadiness();
  }

  async function registerPwa() {
    if (!('serviceWorker' in navigator)) { if($('serviceWorkerStatus')) $('serviceWorkerStatus').textContent='Not supported here'; return; }
    try {
      pwaRegistration=await navigator.serviceWorker.register('./service-worker.js');
      updateReleaseReadiness();
      pwaRegistration.addEventListener('updatefound',()=>{
        const worker=pwaRegistration.installing;
        if(!worker) return;
        worker.addEventListener('statechange',()=>{
          if(worker.state==='installed' && navigator.serviceWorker.controller && $('reloadUpdateButton')) $('reloadUpdateButton').classList.remove('hidden');
        });
      });
      navigator.serviceWorker.addEventListener('controllerchange',()=>updateReleaseReadiness());
    } catch { if($('serviceWorkerStatus')) $('serviceWorkerStatus').textContent='Unavailable'; }
  }

  // Initialise
  renderInterestGrid([]);
  Accessibility.apply(activeAccessibilityPrefs());
  updateChildExperience();
  selectWorldZone('all');
  renderTodayCounts();
  if (Store.isParentUnlocked()) { refreshParentStudio(); fillProfileForm(Store.getActiveProfile()); }
  window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstallPrompt = event; updateReleaseReadiness(); });
  window.addEventListener('appinstalled', () => { deferredInstallPrompt = null; updateReleaseReadiness(); });
  window.addEventListener('online', updateReleaseReadiness);
  window.addEventListener('offline', updateReleaseReadiness);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      updateReleaseReadiness();
      if (!$('parentPanel').classList.contains('hidden') && !Store.isParentUnlocked()) { configureGate(); show('parentGateScreen'); }
    }
  });
  $('installAppButton')?.addEventListener('click', installOrishApp);
  $('reloadUpdateButton')?.addEventListener('click', () => window.location.reload());
  ['pointerdown','input'].forEach(type => $('parentPanel')?.addEventListener(type, () => Store.touchParentSession?.(), { passive:true }));
  window.setInterval(() => {
    if (!$('parentPanel').classList.contains('hidden') && !Store.isParentUnlocked()) { configureGate(); show('parentGateScreen'); }
  }, 60000);
  updateReleaseReadiness();
  const entryMode = new URLSearchParams(window.location.search).get('mode');
  if (entryMode === 'showcase') { show('partnerDemo'); renderShowcaseScene('origin'); }
  window.addEventListener('load', registerPwa);
})();

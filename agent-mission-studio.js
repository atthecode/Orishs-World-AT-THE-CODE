(() => {
  'use strict';

  const DEMO_KEY = 'orish.webmcp.demo.mission.v2';
  const LEVEL_ONE_KEY = 'orish.level1.signal.v1';
  const DEMO_PROFILE = Object.freeze({ name: 'Demo Explorer', privacy: 'fictional-demo-only' });
  const VALID_AGES = ['4-6', '7-9', '10-12', '13-16'];
  const VALID_TOPICS = ['space', 'fossils', 'evidence', 'money', 'science'];
  const VALID_STYLES = ['explore', 'puzzle', 'build', 'story'];
  const VALID_DURATIONS = [10, 15, 20, 30];
  let memoryMission = null;

  const TOPICS = {
    space: {
      label: 'Space & strange signals', title: 'The Signal Changed Direction', route: 'level-one.html?v=20260827-1',
      steps: ['Enter the observatory and locate the moving signal.', 'Protect critical systems during a station failure.', 'Collect evidence before deciding what the signal means.', 'Follow the evidence toward Echo Planet.'],
      followup: 'Go outside or look through a window. Pick one object in the sky and write down three things you can observe before guessing what it is.'
    },
    fossils: {
      label: 'Fossils & deep time', title: 'The Fossil Bed Mystery', route: 'fossil-detective.html',
      steps: ['Survey the dig site before touching anything.', 'Compare fossil clues and rock layers.', 'Build a timeline from evidence.', 'Explain which conclusion is strongest and what is still unknown.'],
      followup: 'Make a mini excavation tray with safe household objects hidden under paper or dry pasta. Record where each object was found before moving it.'
    },
    evidence: {
      label: 'Evidence detective', title: 'The Contradiction in the Lab', route: 'signal-detective.html',
      steps: ['Inspect the scene and note what is actually visible.', 'Find a detail that changed or contradicts the first explanation.', 'Separate evidence from assumptions.', 'Choose the next check that would reduce uncertainty.'],
      followup: 'Choose a harmless everyday claim such as “this room is warmer than that room.” List what you would measure to test it.'
    },
    money: {
      label: 'Money & real-life choices', title: 'Life City: The Budget Shock', route: 'life-city.html',
      steps: ['Start with a limited budget and a real-life goal.', 'Make a spending choice and see the consequence.', 'Respond to an unexpected cost.', 'Finish with a plan that protects the most important need.'],
      followup: 'Plan a pretend £10 budget for a snack, an activity and saving. Explain why you chose each amount.'
    },
    science: {
      label: 'Science mystery', title: 'The Experiment That Would Not Repeat', route: 'index.html#childWorld',
      steps: ['Observe the surprising result.', 'Choose what variable to check first.', 'Repeat the test with one controlled change.', 'Decide what the evidence supports and what needs another test.'],
      followup: 'Pick two ice cubes. Put them in different safe places and predict which melts first. Observe instead of changing the experiment midway.'
    }
  };

  const AGE_GUIDANCE = {
    '4-6': { label: '4–6 Early Explorer', brief: 'short instructions, visible cause and effect, playful observation', difficulty: 'gentle' },
    '7-9': { label: '7–9 Growing Explorer', brief: 'exploration, simple strategy and evidence choices', difficulty: 'balanced' },
    '10-12': { label: '10–12 Big Explorer', brief: 'multi-step investigation, trade-offs and explanation', difficulty: 'investigator' },
    '13-16': { label: '13–16 Teen Explorer', brief: 'systems thinking, uncertainty, strategy and stronger evidence standards', difficulty: 'advanced' }
  };

  const el = (id) => document.getElementById(id);
  const refs = {};

  function bindRefs() {
    Object.assign(refs, {
      badge: el('webmcpBadge'), ageBand: el('ageBand'), topic: el('topic'), duration: el('duration'), learningGoal: el('learningGoal'), style: el('style'),
      build: el('buildMission'), example: el('exampleMission'), empty: el('emptyMission'), preview: el('missionPreview'), missionState: el('missionState'),
      kicker: el('missionKicker'), title: el('missionTitle'), brief: el('missionBrief'), age: el('missionAge'), durationText: el('missionDuration'), styleText: el('missionStyle'),
      steps: el('missionSteps'), goal: el('missionGoal'), followup: el('followupText'), launch: el('launchMission'), copy: el('copyPrompt'), log: el('activityLog'), clear: el('clearActivity')
    });
    return refs.build && refs.example && refs.preview && refs.empty && refs.log;
  }

  function cleanText(value, max = 120) {
    return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  }

  function safeEnum(value, allowed, fallback) { return allowed.includes(value) ? value : fallback; }
  function safeDuration(value) { const n = Number(value); return VALID_DURATIONS.includes(n) ? n : 15; }
  function nowLabel() { try { return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date()); } catch { return 'NOW'; } }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); }
    catch { return null; }
  }

  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); return true; }
    catch { return false; }
  }

  function logActivity(message, source = 'HUMAN') {
    if (!refs.log) return;
    const p = document.createElement('p');
    const time = document.createElement('time');
    const span = document.createElement('span');
    time.textContent = `${source} ${nowLabel()}`;
    span.textContent = message;
    p.append(time, span);
    refs.log.prepend(p);
    while (refs.log.children.length > 12) refs.log.lastElementChild.remove();
  }

  function missionBrief(ageBand, topic, style) {
    const stylePhrase = {
      explore: 'Move through the world, investigate changing conditions and make evidence-based choices.',
      puzzle: 'Solve connected environmental puzzles where each answer changes what becomes possible next.',
      build: 'Build, test and improve a solution using feedback from the world.',
      story: 'Follow a branching story where choices reveal consequences and new evidence.'
    }[style];
    return `${TOPICS[topic].label} adapted for ${AGE_GUIDANCE[ageBand].label}: ${AGE_GUIDANCE[ageBand].brief}. ${stylePhrase}`;
  }

  function adaptSteps(baseSteps, ageBand, style) {
    return baseSteps.map((step, index) => {
      if (ageBand === '4-6') return step.replace('evidence', 'clues').replace('conclusion', 'best answer');
      if (ageBand === '13-16' && index === baseSteps.length - 1) return `${step} State confidence and one alternative explanation.`;
      if (style === 'build' && index === 2) return `${step} Build or adjust a testable solution before moving on.`;
      return step;
    });
  }

  function renderMission(mission) {
    if (!mission) {
      refs.empty.hidden = false;
      refs.preview.hidden = true;
      refs.missionState.textContent = 'Ready';
      return;
    }
    refs.empty.hidden = true;
    refs.preview.hidden = false;
    refs.missionState.textContent = mission.source === 'AGENT' ? 'Agent-built' : 'Mission ready';
    refs.kicker.textContent = `${mission.topicLabel.toUpperCase()} · ${mission.difficulty.toUpperCase()}`;
    refs.title.textContent = mission.title;
    refs.brief.textContent = mission.brief;
    refs.age.textContent = mission.ageLabel;
    refs.durationText.textContent = `${mission.durationMinutes} min`;
    refs.styleText.textContent = mission.styleLabel;
    refs.goal.textContent = mission.learningGoal;
    refs.followup.textContent = mission.realWorldFollowup;
    refs.steps.innerHTML = '';
    mission.steps.forEach((step) => { const li = document.createElement('li'); li.textContent = step; refs.steps.appendChild(li); });
    refs.preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function createMission(input = {}, source = 'HUMAN') {
    const ageBand = safeEnum(input.ageBand, VALID_AGES, '7-9');
    const topic = safeEnum(input.topic, VALID_TOPICS, 'space');
    const durationMinutes = safeDuration(input.durationMinutes);
    const style = safeEnum(input.style, VALID_STYLES, 'explore');
    const defaultGoal = topic === 'space' ? 'Use evidence before deciding what a strange signal means' : 'Use observations and evidence to make a stronger decision';
    const learningGoal = cleanText(input.learningGoal || defaultGoal) || defaultGoal;
    const topicData = TOPICS[topic];
    const age = AGE_GUIDANCE[ageBand];
    const mission = {
      version: 2, learner: DEMO_PROFILE, createdAt: new Date().toISOString(), ageBand, ageLabel: age.label, topic,
      topicLabel: topicData.label, title: topicData.title, durationMinutes, style, styleLabel: style[0].toUpperCase() + style.slice(1),
      difficulty: age.difficulty, learningGoal, brief: missionBrief(ageBand, topic, style), steps: adaptSteps(topicData.steps, ageBand, style),
      realWorldFollowup: topicData.followup, route: topicData.route, source
    };
    memoryMission = mission;
    const persisted = storageSet(DEMO_KEY, JSON.stringify(mission));
    renderMission(mission);
    logActivity(`${source === 'AGENT' ? 'ChatGPT' : 'You'} created “${mission.title}” for ${mission.ageLabel}.${persisted ? '' : ' Browser storage was unavailable, so this session is using memory only.'}`, source);
    return mission;
  }

  function loadMission() {
    if (memoryMission) return memoryMission;
    try {
      const parsed = JSON.parse(storageGet(DEMO_KEY) || 'null');
      if (parsed && parsed.title) memoryMission = parsed;
      return memoryMission;
    } catch { return null; }
  }

  function adaptMission(input = {}, source = 'AGENT') {
    const current = loadMission();
    if (!current) return createMission(input, source);
    return createMission({
      ageBand: input.ageBand || current.ageBand, topic: input.topic || current.topic,
      durationMinutes: input.durationMinutes || current.durationMinutes, learningGoal: input.learningGoal || current.learningGoal,
      style: input.style || current.style
    }, source);
  }

  function currentFormMission() {
    return { ageBand: refs.ageBand.value, topic: refs.topic.value, durationMinutes: Number(refs.duration.value), learningGoal: refs.learningGoal.value, style: refs.style.value };
  }

  function getSummary() {
    let level = null;
    try { level = JSON.parse(storageGet(LEVEL_ONE_KEY) || 'null'); } catch { level = null; }
    const mission = loadMission();
    return {
      privacy: 'Local demo summary only. No real child identity or conversation data.',
      mission: mission ? { title: mission.title, ageLabel: mission.ageLabel, learningGoal: mission.learningGoal, route: mission.route } : null,
      playableProgress: level ? { spaceComplete: !!level.spaceComplete, cinemaSeen: !!level.cinemaSeen, echoComplete: !!level.echoComplete, stars: Number(level.stars || 0) } : { spaceComplete: false, cinemaSeen: false, echoComplete: false, stars: 0 }
    };
  }

  function launchMission(source = 'HUMAN') {
    const mission = loadMission();
    if (!mission) { logActivity('Create a mission before launching.', source); refs.missionState.textContent = 'Create one first'; return { launched: false }; }
    const url = new URL(mission.route, window.location.href).href;
    logActivity(`${source === 'AGENT' ? 'ChatGPT' : 'You'} launched ${mission.title}.`, source);
    window.location.assign(url);
    return { launched: true, title: mission.title, url };
  }

  function followupFor(topic, ageBand) {
    const safeTopic = safeEnum(topic, VALID_TOPICS, loadMission()?.topic || 'space');
    const safeAge = safeEnum(ageBand, VALID_AGES, loadMission()?.ageBand || '7-9');
    return { topic: TOPICS[safeTopic].label, ageExperience: AGE_GUIDANCE[safeAge].label, activity: TOPICS[safeTopic].followup, safety: 'Short family/off-screen activity; use age-appropriate adult supervision.' };
  }

  function safeUiAction(action, label) {
    try { return action(); }
    catch (error) {
      console.error(label, error);
      refs.missionState.textContent = 'Try again';
      logActivity(`${label} hit a browser error. The page stayed open so you can retry.`, 'SYSTEM');
      return null;
    }
  }

  function wireManualControls() {
    refs.build.addEventListener('click', () => {
      const original = refs.build.textContent;
      refs.build.disabled = true;
      refs.build.textContent = 'Building…';
      safeUiAction(() => createMission(currentFormMission(), 'HUMAN'), 'Build mission');
      refs.build.textContent = 'Mission ready ✓';
      setTimeout(() => { refs.build.disabled = false; refs.build.textContent = original; }, 900);
    });
    refs.example.addEventListener('click', () => safeUiAction(() => {
      refs.ageBand.value = '7-9'; refs.topic.value = 'space'; refs.duration.value = '15'; refs.style.value = 'puzzle';
      refs.learningGoal.value = 'Use evidence before deciding what a strange signal means';
      createMission(currentFormMission(), 'HUMAN');
    }, 'Load judge demo'));
    refs.launch.addEventListener('click', () => safeUiAction(() => launchMission('HUMAN'), 'Launch mission'));
    refs.clear.addEventListener('click', () => { refs.log.innerHTML = ''; logActivity('Activity log cleared.', 'HUMAN'); });
    refs.copy.addEventListener('click', async () => {
      const prompt = 'Create a 15-minute space investigation for an 8-year-old about evidence, make it exciting, then launch it.';
      try { await navigator.clipboard.writeText(prompt); logActivity('Demo prompt copied.', 'HUMAN'); }
      catch { logActivity(`Demo prompt: ${prompt}`, 'SYSTEM'); }
    });
  }

  async function registerWebMCP() {
    const navContext = typeof navigator !== 'undefined' ? navigator.modelContext : null;
    const modelContext = document.modelContext || navContext;
    if (!modelContext || typeof modelContext.registerTool !== 'function') {
      refs.badge.className = 'status fallback'; refs.badge.textContent = 'Manual demo · WebMCP host not detected';
      logActivity('WebMCP host not detected. Manual mission controls are ready.', 'SYSTEM');
      return;
    }
    const tools = [
      { name: 'get_orish_world_capabilities', title: 'Get Orish’s World mission capabilities', description: 'Discover safe demo mission options.', inputSchema: { type: 'object', properties: {} }, annotations: { readOnlyHint: true }, execute: async () => ({ demoOnly: true, ageBands: VALID_AGES, topics: VALID_TOPICS, styles: VALID_STYLES, durationsMinutes: VALID_DURATIONS }) },
      { name: 'create_learning_mission', title: 'Create an Orish learning mission', description: 'Create and visibly render a safe age-adapted demo learning mission.', inputSchema: { type: 'object', properties: { ageBand: { type: 'string', enum: VALID_AGES }, topic: { type: 'string', enum: VALID_TOPICS }, durationMinutes: { type: 'integer', enum: VALID_DURATIONS }, learningGoal: { type: 'string', maxLength: 120 }, style: { type: 'string', enum: VALID_STYLES } }, required: ['ageBand', 'topic'] }, annotations: { readOnlyHint: false }, execute: async (input) => ({ success: true, mission: createMission(input, 'AGENT'), visiblePageUpdated: true }) },
      { name: 'adapt_learning_mission', title: 'Adapt the current Orish mission', description: 'Modify the mission currently visible in Agent Mission Studio.', inputSchema: { type: 'object', properties: { ageBand: { type: 'string', enum: VALID_AGES }, topic: { type: 'string', enum: VALID_TOPICS }, durationMinutes: { type: 'integer', enum: VALID_DURATIONS }, learningGoal: { type: 'string', maxLength: 120 }, style: { type: 'string', enum: VALID_STYLES } } }, annotations: { readOnlyHint: false }, execute: async (input) => ({ success: true, mission: adaptMission(input || {}, 'AGENT'), visiblePageUpdated: true }) },
      { name: 'launch_learning_mission', title: 'Launch the current Orish mission', description: 'Launch the playable Orish’s World route matched to the current mission.', inputSchema: { type: 'object', properties: {} }, annotations: { readOnlyHint: false }, execute: async () => launchMission('AGENT') },
      { name: 'get_learning_summary', title: 'Get local demo learning progress', description: 'Read current demo mission and Level 1 local completion state.', inputSchema: { type: 'object', properties: {} }, annotations: { readOnlyHint: true }, execute: async () => getSummary() },
      { name: 'suggest_real_world_followup', title: 'Suggest an off-screen follow-up', description: 'Suggest a short real-world activity connected to the selected mission topic.', inputSchema: { type: 'object', properties: { topic: { type: 'string', enum: VALID_TOPICS }, ageBand: { type: 'string', enum: VALID_AGES } } }, annotations: { readOnlyHint: true }, execute: async (input) => followupFor(input?.topic, input?.ageBand) }
    ];
    try {
      for (const tool of tools) await modelContext.registerTool(tool);
      refs.badge.className = 'status ready'; refs.badge.textContent = `${tools.length} WebMCP tools live`;
      logActivity(`${tools.length} WebMCP site tools registered on this page.`, 'SYSTEM');
    } catch (error) {
      console.error('WebMCP registration failed', error);
      refs.badge.className = 'status fallback'; refs.badge.textContent = 'Manual demo ready · WebMCP registration error';
      logActivity('WebMCP registration failed, but manual Build mission is still available.', 'SYSTEM');
    }
  }

  function init() {
    if (!bindRefs()) { console.error('Agent Mission Studio could not find required controls.'); return; }
    wireManualControls();
    renderMission(loadMission());
    registerWebMCP();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
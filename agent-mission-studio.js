(() => {
  'use strict';

  const DEMO_KEY = 'orish.webmcp.demo.mission.v1';
  const LEVEL_ONE_KEY = 'orish.level1.signal.v1';
  const DEMO_PROFILE = Object.freeze({ name: 'Demo Explorer', privacy: 'fictional-demo-only' });
  const VALID_AGES = ['4-6', '7-9', '10-12', '13-16'];
  const VALID_TOPICS = ['space', 'fossils', 'evidence', 'money', 'science'];
  const VALID_STYLES = ['explore', 'puzzle', 'build', 'story'];
  const VALID_DURATIONS = [10, 15, 20, 30];

  const TOPICS = {
    space: {
      label: 'Space & strange signals',
      title: 'The Signal Changed Direction',
      route: 'level-one.html?v=20260827-1',
      steps: ['Enter the observatory and locate the moving signal.', 'Protect critical systems during a station failure.', 'Collect evidence before deciding what the signal means.', 'Follow the evidence toward Echo Planet.'],
      followup: 'Go outside or look through a window. Pick one object in the sky and write down three things you can observe before guessing what it is.'
    },
    fossils: {
      label: 'Fossils & deep time',
      title: 'The Fossil Bed Mystery',
      route: 'fossil-detective.html',
      steps: ['Survey the dig site before touching anything.', 'Compare fossil clues and rock layers.', 'Build a timeline from evidence.', 'Explain which conclusion is strongest and what is still unknown.'],
      followup: 'Make a mini excavation tray with safe household objects hidden under paper or dry pasta. Record where each object was found before moving it.'
    },
    evidence: {
      label: 'Evidence detective',
      title: 'The Contradiction in the Lab',
      route: 'signal-detective.html',
      steps: ['Inspect the scene and note what is actually visible.', 'Find a detail that changed or contradicts the first explanation.', 'Separate evidence from assumptions.', 'Choose the next check that would reduce uncertainty.'],
      followup: 'Choose a harmless everyday claim such as “this room is warmer than that room.” List what you would measure to test it.'
    },
    money: {
      label: 'Money & real-life choices',
      title: 'Life City: The Budget Shock',
      route: 'life-city.html',
      steps: ['Start with a limited budget and a real-life goal.', 'Make a spending choice and see the consequence.', 'Respond to an unexpected cost.', 'Finish with a plan that protects the most important need.'],
      followup: 'Plan a pretend £10 budget for a snack, an activity and saving. Explain why you chose each amount.'
    },
    science: {
      label: 'Science mystery',
      title: 'The Experiment That Would Not Repeat',
      route: 'index.html#childWorld',
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
  const refs = {
    badge: el('webmcpBadge'), ageBand: el('ageBand'), topic: el('topic'), duration: el('duration'), learningGoal: el('learningGoal'), style: el('style'),
    build: el('buildMission'), example: el('exampleMission'), empty: el('emptyMission'), preview: el('missionPreview'), missionState: el('missionState'),
    kicker: el('missionKicker'), title: el('missionTitle'), brief: el('missionBrief'), age: el('missionAge'), durationText: el('missionDuration'), styleText: el('missionStyle'),
    steps: el('missionSteps'), goal: el('missionGoal'), followup: el('followupText'), launch: el('launchMission'), copy: el('copyPrompt'), log: el('activityLog'), clear: el('clearActivity')
  };

  function cleanText(value, max = 120) {
    return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
  }

  function safeEnum(value, allowed, fallback) {
    return allowed.includes(value) ? value : fallback;
  }

  function safeDuration(value) {
    const n = Number(value);
    return VALID_DURATIONS.includes(n) ? n : 15;
  }

  function nowLabel() {
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date());
  }

  function logActivity(message, source = 'HUMAN') {
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
    const age = AGE_GUIDANCE[ageBand];
    const topicData = TOPICS[topic];
    const stylePhrase = {
      explore: 'Move through the world, investigate changing conditions and make evidence-based choices.',
      puzzle: 'Solve connected environmental puzzles where each answer changes what becomes possible next.',
      build: 'Build, test and improve a solution using feedback from the world.',
      story: 'Follow a branching story where choices reveal consequences and new evidence.'
    }[style];
    return `${topicData.label} adapted for ${age.label}: ${age.brief}. ${stylePhrase}`;
  }

  function adaptSteps(baseSteps, ageBand, style) {
    const age = AGE_GUIDANCE[ageBand];
    return baseSteps.map((step, index) => {
      if (ageBand === '4-6') return step.replace('evidence', 'clues').replace('conclusion', 'best answer');
      if (ageBand === '13-16' && index === baseSteps.length - 1) return `${step} State confidence and one alternative explanation.`;
      if (style === 'build' && index === 2) return `${step} Build or adjust a testable solution before moving on.`;
      return step;
    });
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
      version: 1,
      learner: DEMO_PROFILE,
      createdAt: new Date().toISOString(),
      ageBand,
      ageLabel: age.label,
      topic,
      topicLabel: topicData.label,
      title: topicData.title,
      durationMinutes,
      style,
      styleLabel: style[0].toUpperCase() + style.slice(1),
      difficulty: age.difficulty,
      learningGoal,
      brief: missionBrief(ageBand, topic, style),
      steps: adaptSteps(topicData.steps, ageBand, style),
      realWorldFollowup: topicData.followup,
      route: topicData.route,
      source
    };
    localStorage.setItem(DEMO_KEY, JSON.stringify(mission));
    renderMission(mission);
    logActivity(`${source === 'AGENT' ? 'ChatGPT' : 'You'} created “${mission.title}” for ${mission.ageLabel}.`, source);
    return mission;
  }

  function loadMission() {
    try {
      const parsed = JSON.parse(localStorage.getItem(DEMO_KEY) || 'null');
      return parsed && parsed.title ? parsed : null;
    } catch {
      return null;
    }
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
    refs.missionState.textContent = mission.source === 'AGENT' ? 'Agent-built' : 'Human-built';
    refs.kicker.textContent = `${mission.topicLabel.toUpperCase()} · ${mission.difficulty.toUpperCase()}`;
    refs.title.textContent = mission.title;
    refs.brief.textContent = mission.brief;
    refs.age.textContent = mission.ageLabel;
    refs.durationText.textContent = `${mission.durationMinutes} min`;
    refs.styleText.textContent = mission.styleLabel;
    refs.goal.textContent = mission.learningGoal;
    refs.followup.textContent = mission.realWorldFollowup;
    refs.steps.replaceChildren(...mission.steps.map((step) => {
      const li = document.createElement('li');
      li.textContent = step;
      return li;
    }));
  }

  function adaptMission(input = {}, source = 'AGENT') {
    const current = loadMission();
    if (!current) return createMission(input, source);
    return createMission({
      ageBand: input.ageBand || current.ageBand,
      topic: input.topic || current.topic,
      durationMinutes: input.durationMinutes || current.durationMinutes,
      learningGoal: input.learningGoal || current.learningGoal,
      style: input.style || current.style
    }, source);
  }

  function getSummary() {
    const mission = loadMission();
    let level = null;
    try { level = JSON.parse(localStorage.getItem(LEVEL_ONE_KEY) || 'null'); } catch { level = null; }
    return {
      privacy: 'Local demo summary only. No real child identity or conversation data.',
      mission: mission ? { title: mission.title, ageLabel: mission.ageLabel, learningGoal: mission.learningGoal, route: mission.route } : null,
      playableProgress: level ? {
        spaceComplete: Boolean(level.spaceComplete),
        cinemaSeen: Boolean(level.cinemaSeen),
        echoComplete: Boolean(level.echoComplete),
        stars: Number(level.stars || 0)
      } : { spaceComplete: false, cinemaSeen: false, echoComplete: false, stars: 0 },
      interpretation: level && level.echoComplete ? 'Level 1 completed in this browser demo.' : 'No completed Level 1 run is recorded in this browser yet.'
    };
  }

  function launchMission(source = 'HUMAN') {
    const mission = loadMission();
    if (!mission) {
      logActivity('Launch requested before a mission existed.', source);
      return { launched: false, reason: 'Create a mission first.' };
    }
    logActivity(`${source === 'AGENT' ? 'ChatGPT' : 'You'} launched ${mission.title}.`, source);
    const url = new URL(mission.route, window.location.href).href;
    setTimeout(() => window.location.assign(url), 180);
    return { launched: true, title: mission.title, url };
  }

  function followupFor(topic, ageBand) {
    const safeTopic = safeEnum(topic, VALID_TOPICS, loadMission()?.topic || 'space');
    const safeAge = safeEnum(ageBand, VALID_AGES, loadMission()?.ageBand || '7-9');
    return {
      topic: TOPICS[safeTopic].label,
      ageExperience: AGE_GUIDANCE[safeAge].label,
      activity: TOPICS[safeTopic].followup,
      safety: 'Designed as a short family/off-screen activity. Adult supervision remains appropriate for the child’s age and setting.'
    };
  }

  function currentFormMission() {
    return {
      ageBand: refs.ageBand.value,
      topic: refs.topic.value,
      durationMinutes: Number(refs.duration.value),
      learningGoal: refs.learningGoal.value,
      style: refs.style.value
    };
  }

  async function registerWebMCP() {
    const modelContext = document.modelContext || (navigator && navigator.modelContext);
    if (!modelContext || typeof modelContext.registerTool !== 'function') {
      refs.badge.className = 'status fallback';
      refs.badge.textContent = 'Manual demo · WebMCP host not detected';
      logActivity('WebMCP host not detected. Manual mission controls remain available.', 'SYSTEM');
      return;
    }

    const register = (tool) => Promise.resolve(modelContext.registerTool(tool));
    const commonReadOnly = { readOnlyHint: true };

    const tools = [
      {
        name: 'get_orish_world_capabilities',
        title: 'Get Orish’s World mission capabilities',
        description: 'Discover the safe demo age bands, learning topics, play styles and playable routes available in Orish’s World. Use this before creating a mission when the user has not specified all choices.',
        inputSchema: { type: 'object', properties: {} },
        annotations: commonReadOnly,
        execute: async () => JSON.stringify({
          demoOnly: true,
          privacy: 'Fictional learner profile only; no real child data is exposed to this tool.',
          ageBands: VALID_AGES.map((id) => ({ id, label: AGE_GUIDANCE[id].label })),
          topics: VALID_TOPICS.map((id) => ({ id, label: TOPICS[id].label })),
          styles: VALID_STYLES,
          durationsMinutes: VALID_DURATIONS,
          playableRoutes: Object.fromEntries(VALID_TOPICS.map((id) => [id, TOPICS[id].route]))
        })
      },
      {
        name: 'create_learning_mission',
        title: 'Create an Orish learning mission',
        description: 'Create and visibly render a safe age-adapted demo learning mission on the current page. Use when the parent asks ChatGPT to turn a topic or learning goal into an Orish’s World adventure.',
        inputSchema: {
          type: 'object',
          properties: {
            ageBand: { type: 'string', enum: VALID_AGES, description: 'Demo learner age experience.' },
            topic: { type: 'string', enum: VALID_TOPICS, description: 'Mission world/topic.' },
            durationMinutes: { type: 'integer', enum: VALID_DURATIONS, description: 'Target mission length.' },
            learningGoal: { type: 'string', maxLength: 120, description: 'What the learner should practise or understand.' },
            style: { type: 'string', enum: VALID_STYLES, description: 'Preferred play style.' }
          },
          required: ['ageBand', 'topic']
        },
        annotations: { readOnlyHint: false },
        execute: async (input) => JSON.stringify({ success: true, mission: createMission(input, 'AGENT'), visiblePageUpdated: true })
      },
      {
        name: 'adapt_learning_mission',
        title: 'Adapt the current Orish mission',
        description: 'Modify the mission currently visible in Agent Mission Studio. Use for requests such as make it shorter, older, more puzzle-based, or change the learning goal without rebuilding the whole experience manually.',
        inputSchema: {
          type: 'object',
          properties: {
            ageBand: { type: 'string', enum: VALID_AGES },
            topic: { type: 'string', enum: VALID_TOPICS },
            durationMinutes: { type: 'integer', enum: VALID_DURATIONS },
            learningGoal: { type: 'string', maxLength: 120 },
            style: { type: 'string', enum: VALID_STYLES }
          }
        },
        annotations: { readOnlyHint: false },
        execute: async (input) => JSON.stringify({ success: true, mission: adaptMission(input, 'AGENT'), visiblePageUpdated: true })
      },
      {
        name: 'launch_learning_mission',
        title: 'Launch the current Orish mission',
        description: 'Launch the playable Orish’s World route matched to the mission currently shown in Agent Mission Studio. Call only after a mission exists and the user asks to start or launch it.',
        inputSchema: { type: 'object', properties: {} },
        annotations: { readOnlyHint: false },
        execute: async () => JSON.stringify(launchMission('AGENT'))
      },
      {
        name: 'get_learning_summary',
        title: 'Get local demo learning progress',
        description: 'Read the current mission and local Level 1 demo completion state from this browser. It intentionally excludes real child identity, transcripts and private parent data.',
        inputSchema: { type: 'object', properties: {} },
        annotations: commonReadOnly,
        execute: async () => {
          const summary = getSummary();
          logActivity('ChatGPT checked the local demo learning summary.', 'AGENT');
          return JSON.stringify(summary);
        }
      },
      {
        name: 'suggest_real_world_followup',
        title: 'Suggest an off-screen follow-up',
        description: 'Suggest a short real-world activity that reinforces the selected Orish’s World mission topic without requiring more screen time.',
        inputSchema: {
          type: 'object',
          properties: {
            topic: { type: 'string', enum: VALID_TOPICS },
            ageBand: { type: 'string', enum: VALID_AGES }
          }
        },
        annotations: commonReadOnly,
        execute: async (input) => {
          const result = followupFor(input?.topic, input?.ageBand);
          logActivity('ChatGPT generated an off-screen follow-up activity.', 'AGENT');
          return JSON.stringify(result);
        }
      }
    ];

    try {
      for (const tool of tools) await register(tool);
      refs.badge.className = 'status ready';
      refs.badge.textContent = `${tools.length} WebMCP tools live`;
      logActivity(`${tools.length} WebMCP site tools registered on this page.`, 'SYSTEM');
    } catch (error) {
      console.error('WebMCP registration failed', error);
      refs.badge.className = 'status fallback';
      refs.badge.textContent = 'Manual demo · WebMCP registration error';
      logActivity('The browser exposed WebMCP but tool registration failed. Manual controls still work.', 'SYSTEM');
    }
  }

  refs.build.addEventListener('click', () => createMission(currentFormMission(), 'HUMAN'));
  refs.example.addEventListener('click', () => {
    refs.ageBand.value = '7-9'; refs.topic.value = 'space'; refs.duration.value = '15'; refs.style.value = 'explore';
    refs.learningGoal.value = 'Use evidence before deciding what a strange signal means';
    createMission(currentFormMission(), 'HUMAN');
  });
  refs.launch.addEventListener('click', () => launchMission('HUMAN'));
  refs.clear.addEventListener('click', () => { refs.log.innerHTML = ''; logActivity('Activity log cleared.', 'HUMAN'); });
  refs.copy.addEventListener('click', async () => {
    const prompt = 'Create a 15-minute space investigation for an 8-year-old about evidence, make it exciting, then launch it.';
    try { await navigator.clipboard.writeText(prompt); logActivity('Demo prompt copied.', 'HUMAN'); }
    catch { logActivity(`Demo prompt: ${prompt}`, 'SYSTEM'); }
  });

  renderMission(loadMission());
  registerWebMCP();
})();
(() => {
  'use strict';

  const STORAGE_KEY = 'orish-toy-play-world-v1';
  const $ = (id) => document.getElementById(id);
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  const clean = (value) => String(value || '').replace(/[<>]/g, '').trim().slice(0, 32);
  const titleCase = (value) => value ? value[0].toUpperCase() + value.slice(1) : value;

  const state = {
    age: '6-7', world: 'space', time: 20, customToys: [], mission: null,
    stage: 0, xp: 0, completed: 0, muted: false
  };

  const worlds = {
    space: {
      name: 'Space Rescue',
      calls: ['MOONBRIDGE', 'STARLIGHT', 'ORBIT ZERO', 'NOVA GATE'],
      briefs: [
        'A strange signal has opened a temporary portal in your play zone. Orish needs your Toy Vault to build a rescue route before the signal fades.',
        'A tiny explorer beacon is stranded beyond the Moon Gate. Your toys are the only equipment close enough to reach it.',
        'Mission Control has lost contact with a friendly scout beyond Sector Seven. Build, test and solve your way to the signal.'
      ],
      twists: ['The portal changed direction.', 'A second signal has appeared.', 'The map has rotated ninety degrees.']
    },
    dino: {
      name: 'Dino Sector',
      calls: ['FOSSIL ONE', 'RAPTOR TRACE', 'AMBER TRACK', 'JURASSIC SIGNAL'],
      briefs: [
        'Fresh tracks have appeared in Dino Sector, but one young dinosaur is separated from its group. Orish needs a safe route, sharp eyes and a clever final plan.',
        'A research marker has gone missing near the dinosaur zone. Your Toy Vault has been activated for a search-and-rescue mission.',
        'Something has moved in the fossil zone. Follow the clues, protect the route and help Orish identify what happened.'
      ],
      twists: ['The tracks split into two paths.', 'A harmless mystery sound changes the route.', 'The rescue marker moved to a new safe zone.']
    },
    spy: {
      name: 'Signal Detective',
      calls: ['CODE CYAN', 'ECHO KEY', 'SIGNAL NINE', 'HIDDEN FREQUENCY'],
      briefs: [
        'A scrambled message has appeared in the room. Orish has only part of the code. Build the evidence route, inspect the scene and unlock the final signal.',
        'Someone left a harmless mystery signal in the play zone. Notice patterns, test ideas and solve the code before it disappears.',
        'The Signal Board shows one impossible reading. Orish needs a detective who can build, observe and reason carefully.'
      ],
      twists: ['One clue is a decoy.', 'The signal repeats in a new pattern.', 'The evidence order has changed.']
    },
    magic: {
      name: 'Hidden Portal',
      calls: ['GOLDEN DOOR', 'WONDER KEY', 'PORTAL BLUE', 'SECRET PATH'],
      briefs: [
        'A hidden portal has appeared in an ordinary room, but it only opens for builders and problem-solvers. Your toys have become portal tools.',
        'Orish found a doorway that cannot be seen with ordinary eyes. Build the path, solve the riddle and discover what is on the other side.',
        'A lost spark from the Hidden World is waiting to get home. Your Toy Vault can create the route it needs.'
      ],
      twists: ['The portal only accepts a new shape.', 'The path has become a mirror route.', 'A golden key symbol appears in a different place.']
    },
    science: {
      name: 'Science Lab',
      calls: ['LAB CYAN', 'PATTERN ZERO', 'DISCOVERY ONE', 'TEST SIGNAL'],
      briefs: [
        'Orish detected a pattern that needs testing. Today your toys become safe lab equipment for a build, observation and logic experiment.',
        'The Discovery Lab has one unanswered question. Create a model, test a route and use evidence to finish the mission.',
        'A new signal behaves differently every time it meets an obstacle. Orish needs a careful tester to work out the pattern.'
      ],
      twists: ['The first idea needs one change.', 'A new piece of evidence appears.', 'The test must work in a smaller space.']
    },
    rescue: {
      name: 'Rescue HQ',
      calls: ['RESCUE CYAN', 'SAFE ROUTE', 'HELPER ONE', 'BRIDGE TEAM'],
      briefs: [
        'A pretend explorer needs help crossing the play zone safely. Orish activated your toys as rescue equipment. Plan first, then test the route.',
        'Rescue HQ has a problem: the normal path is blocked. Build another way using only safe items already in the Toy Vault.',
        'A friendly mission marker is stranded behind an obstacle. Orish needs teamwork, a safe build and a calm solution.'
      ],
      twists: ['The first route is now closed.', 'The rescue target moved one safe step away.', 'You must finish using fewer pieces.']
    }
  };

  const ageRules = {
    '4-5': {
      build: 'Use 3–5 pieces. A grown-up helps read and checks the play space.',
      observe: 'Find two differences or name two colours or shapes.',
      code: 'Count, match or copy a simple pattern.',
      lines: ['We can do this together.', 'Slow and clever beats fast and messy.', 'Show me your best safe idea.']
    },
    '6-7': {
      build: 'Use at least 5 pieces or make a route with two clear sections.',
      observe: 'Look carefully, remember positions and spot one change.',
      code: 'Solve a short number, shape or order clue.',
      lines: ['Agent, I need your eyes and your ideas.', 'Try it, test it, then improve it.', 'A good mission solver checks before moving on.']
    },
    '8-10': {
      build: 'Add one rule: limited pieces, a height limit or two connected zones.',
      observe: 'Collect three observations before deciding what they mean.',
      code: 'Explain the pattern or give a reason for your answer.',
      lines: ['Evidence first. Guessing comes second.', 'If the first plan fails, that is new information.', 'I want a reason, not just an answer.']
    },
    '11-12': {
      build: 'Plan before building. Use a constraint and justify one design choice.',
      observe: 'Separate what you saw from what you think it means.',
      code: 'Compare two possible solutions and choose the stronger one.',
      lines: ['Strategy means thinking one move ahead.', 'Tell me what evidence would change your mind.', 'Efficiency is part of the challenge.']
    }
  };

  const icons = { BUILD: '🧱', MOVE: '🛞', OBSERVE: '🔎', CODE: '⌁', TWIST: '⚡' };

  const stageFactories = {
    BUILD: [
      ({ a, b }) => ({ title: 'Build the first safe route', text: `Use your ${a} and ${b} to create a pretend route between two spots on the floor or table. It can be a bridge, base, tunnel or checkpoint.`, rule: 'Keep everything low, stable and inside the grown-up-approved play area.' }),
      ({ a, b }) => ({ title: 'Create Mission Base', text: `Turn the ${a} into the main base and use the ${b} to mark a safe entrance. Your build needs a clear start and finish.`, rule: 'Nothing needs to be climbed on, tied to furniture or placed near doors.' }),
      ({ a, b }) => ({ title: 'Engineer a portal station', text: `Build a pretend portal station using the ${a}. Your ${b} must be able to reach or pass it without knocking it over.`, rule: 'Test gently. If it falls, redesign it rather than making it bigger.' })
    ],
    MOVE: [
      ({ a, b }) => ({ title: 'Run the rescue route', text: `Move the ${b} from the start of your build to the finish. The ${a} is part of the mission terrain, so find a careful path around or through it.`, rule: 'Use hands and toys only—no running, throwing or climbing.' }),
      ({ a, b }) => ({ title: 'Deliver the signal', text: `Choose one toy as the pretend signal carrier. Move it past the ${a} and safely reach the ${b} without touching the edge of your mission zone.`, rule: 'If you touch the edge, reset calmly and try a different route.' }),
      ({ a, b }) => ({ title: 'Test your transport plan', text: `Your ${a} must help the ${b} reach the other side of the play zone. Invent a safe pretend transport rule and test it once.`, rule: 'The toy stays on the floor or table. No launching or throwing.' })
    ],
    OBSERVE: [
      ({ a, b }) => ({ title: 'Scan for the change', text: `Look closely at the positions of the ${a}, ${b} and one other safe toy. Close your eyes while the grown-up moves one item slightly. Open them and identify what changed.`, rule: 'Older agents: describe the evidence that helped you decide.' }),
      ({ a, b }) => ({ title: 'Collect three clues', text: `Study the ${a} and ${b}. Find three details—colour, shape, size, texture, pattern or position—that could help Orish identify them later.`, rule: 'Say what you actually observe before explaining what you think.' }),
      ({ a, b }) => ({ title: 'Map the scene', text: `Without moving anything, describe where the ${a} is compared with the ${b}: left or right, nearer or farther, in front or behind.`, rule: 'Now change one position and describe the new map.' })
    ],
    CODE: [
      ({ a, b, age }) => ({ title: 'Break the mission code', text: age === '4-5' ? `Make a pattern: ${titleCase(a)}, ${titleCase(b)}, ${titleCase(a)}… What comes next?` : `Create a four-part pattern using the ${a} and ${b}. Change one part and see if another player can spot the broken rule.`, rule: age === '11-12' ? 'Explain two possible rules, then say which is better supported.' : 'The code works when you can explain the rule.' }),
      ({ a, b, age }) => ({ title: "Solve Orish's logic lock", text: age === '4-5' ? `Put the ${a} beside the ${b}. Pick one true comparison: bigger, smaller, longer or shorter.` : `Imagine the ${a} is worth 2 signal points and the ${b} is worth 3. Build a safe combination worth exactly 8 points, or get as close as your available toys allow.`, rule: age === '8-10' || age === '11-12' ? 'Can you find a second solution and compare it?' : 'Count carefully before you answer.' }),
      ({ a, b }) => ({ title: 'Unlock the sequence', text: `Give the ${a} code A and the ${b} code B. Make a six-step sequence using A and B, say it aloud, cover it, then repeat it from memory.`, rule: 'Make it harder only if the first sequence feels easy.' })
    ],
    TWIST: [
      ({ a, b, world }) => ({ title: 'Unexpected transmission', text: `${pick(worlds[world].twists)} Adapt the mission using the same ${a} and ${b}.`, rule: 'Change one thing, test it, and explain why your new plan works.' }),
      ({ a, b, world }) => ({ title: 'The final portal shift', text: `${pick(worlds[world].twists)} Reconfigure one part of your build so the ${b} can still complete the route past the ${a}.`, rule: 'This is the final test. Stay calm, change the plan and finish safely.' })
    ]
  };

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      state.xp = Number(saved.xp) || 0;
      state.completed = Number(saved.completed) || 0;
      state.muted = Boolean(saved.muted);
    } catch (_) {}
    renderScore();
    renderVoice();
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp: state.xp, completed: state.completed, muted: state.muted })); } catch (_) {}
  }

  function renderScore() {
    $('xpValue').textContent = state.xp;
    $('missionCount').textContent = state.completed;
  }

  function renderVoice() {
    $('voiceToggle').textContent = state.muted ? '🔇 Voice off' : '🔊 Voice on';
    $('voiceToggle').setAttribute('aria-pressed', String(state.muted));
  }

  function show(screen) {
    ['setupScreen', 'missionScreen', 'completeScreen'].forEach((id) => $(id).classList.remove('active'));
    $(screen).classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function selectedToys() {
    const preset = [...document.querySelectorAll('#toyChoices .chip.selected')].map((button) => button.dataset.toy);
    return [...preset, ...state.customToys].filter(Boolean);
  }

  function renderCustomToys() {
    const root = $('customToyList');
    root.replaceChildren();
    state.customToys.forEach((toy) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = `${toy} ×`;
      button.setAttribute('aria-label', `Remove ${toy}`);
      button.addEventListener('click', () => {
        state.customToys = state.customToys.filter((item) => item !== toy);
        renderCustomToys();
      });
      root.appendChild(button);
    });
  }

  function addCustomToy() {
    const toy = clean($('customToy').value).toLowerCase();
    if (!toy || state.customToys.includes(toy)) return;
    state.customToys.push(toy);
    $('customToy').value = '';
    renderCustomToys();
  }

  function createMission() {
    const toys = selectedToys();
    const shuffled = [...toys].sort(() => Math.random() - 0.5);
    const a = shuffled[0];
    const b = shuffled[1] || shuffled[0];
    const world = worlds[state.world];
    const rules = ageRules[state.age];
    const types = state.time === 10 ? ['BUILD', 'OBSERVE', 'CODE'] : state.time === 20 ? ['BUILD', 'MOVE', 'OBSERVE', 'CODE'] : ['BUILD', 'MOVE', 'OBSERVE', 'CODE', 'TWIST'];

    const stages = types.map((type) => {
      const stage = pick(stageFactories[type])({ a, b, age: state.age, world: state.world });
      const ageNote = type === 'BUILD' ? rules.build : type === 'OBSERVE' ? rules.observe : type === 'CODE' ? rules.code : 'Complete it safely before moving on.';
      return { ...stage, type, icon: icons[type], orish: `${pick(rules.lines)} ${ageNote}` };
    });

    return {
      id: `OR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      title: `${world.name}: ${pick(world.calls)}`,
      brief: pick(world.briefs),
      toys,
      world: state.world,
      stages
    };
  }

  function speak(text) {
    if (state.muted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const voice = new SpeechSynthesisUtterance(text);
    voice.rate = state.age === '4-5' ? 0.88 : 0.94;
    voice.pitch = 1.03;
    voice.volume = 0.92;
    window.speechSynthesis.speak(voice);
  }

  function currentSpeech() {
    if (!state.mission) return '';
    const stage = state.mission.stages[state.stage];
    return `Orish transmission. ${stage.title}. ${stage.text} ${stage.orish}`;
  }

  function renderMissionHeader() {
    $('missionTitle').textContent = state.mission.title;
    $('missionBrief').textContent = state.mission.brief;
    const loadout = $('toyLoadout');
    loadout.replaceChildren();
    state.mission.toys.forEach((toy) => {
      const badge = document.createElement('span');
      badge.textContent = `TOY VAULT · ${toy}`;
      loadout.appendChild(badge);
    });
  }

  function renderStage() {
    const stage = state.mission.stages[state.stage];
    const total = state.mission.stages.length;
    $('stageCounter').textContent = `STAGE ${state.stage + 1} OF ${total}`;
    $('progressFill').style.width = `${(state.stage / total) * 100}%`;
    $('stageType').textContent = stage.type;
    $('stageIcon').textContent = stage.icon;
    $('stageTitle').textContent = stage.title;
    $('stageText').textContent = stage.text;
    $('challengeBox').textContent = `MISSION RULE · ${stage.rule}`;
    $('orishLine').replaceChildren();
    const strong = document.createElement('strong');
    strong.textContent = 'Orish: ';
    $('orishLine').append(strong, document.createTextNode(stage.orish));
  }

  function startMission() {
    state.mission = createMission();
    state.stage = 0;
    renderMissionHeader();
    renderStage();
    show('missionScreen');
    speak(`Orish online. ${state.mission.brief}`);
  }

  function finishMission() {
    state.xp += 100;
    state.completed += 1;
    save();
    renderScore();
    $('newMissionCount').textContent = state.completed;
    $('completeMessage').textContent = `You completed ${state.mission.title} using things already in your world. The toys stayed the same. The adventure changed.`;
    $('memoryText').textContent = `Mission ${state.mission.id}: ${worlds[state.mission.world].name} completed with ${state.mission.toys.slice(0, 3).join(', ')}. Next time Orish can reuse the same Toy Vault in a different world.`;
    $('progressFill').style.width = '100%';
    show('completeScreen');
    speak('Mission complete. Portal secured. One hundred XP earned. Excellent work, Agent.');
  }

  document.querySelectorAll('[data-group] button').forEach((button) => {
    button.addEventListener('click', () => {
      const group = button.closest('[data-group]');
      group.querySelectorAll('button').forEach((item) => item.classList.remove('selected'));
      button.classList.add('selected');
      const value = button.dataset.value;
      if (group.dataset.group === 'age') state.age = value;
      if (group.dataset.group === 'world') state.world = value;
      if (group.dataset.group === 'time') state.time = Number(value);
    });
  });

  document.querySelectorAll('#toyChoices .chip').forEach((button) => button.addEventListener('click', () => button.classList.toggle('selected')));
  $('addToy').addEventListener('click', addCustomToy);
  $('customToy').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); addCustomToy(); }
  });

  $('missionForm').addEventListener('submit', (event) => {
    event.preventDefault();
    if (selectedToys().length < 2) {
      $('formError').textContent = 'Choose at least two safe toys or play items for Orish to use.';
      return;
    }
    if (!$('safeZone').checked) {
      $('formError').textContent = 'A grown-up needs to confirm the safe play area before Orish starts.';
      return;
    }
    $('formError').textContent = '';
    startMission();
  });

  $('completeStage').addEventListener('click', () => {
    if (state.stage < state.mission.stages.length - 1) {
      state.stage += 1;
      renderStage();
      speak(currentSpeech());
      $('stageCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      finishMission();
    }
  });

  $('repeatVoice').addEventListener('click', () => speak(currentSpeech()));
  $('voiceToggle').addEventListener('click', () => {
    state.muted = !state.muted;
    if (state.muted && 'speechSynthesis' in window) window.speechSynthesis.cancel();
    save();
    renderVoice();
  });

  const goHome = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    show('setupScreen');
  };

  $('homeButton').addEventListener('click', goHome);
  $('backToVault').addEventListener('click', goHome);
  $('newMission').addEventListener('click', goHome);
  $('sameLoadout').addEventListener('click', () => {
    state.mission = createMission();
    state.stage = 0;
    renderMissionHeader();
    renderStage();
    show('missionScreen');
    speak(`New mission. ${state.mission.brief}`);
  });

  $('parentInfoButton').addEventListener('click', () => $('parentDialog').showModal());
  $('closeDialog').addEventListener('click', () => $('parentDialog').close());
  $('dialogDone').addEventListener('click', () => $('parentDialog').close());
  $('parentDialog').addEventListener('click', (event) => { if (event.target === $('parentDialog')) $('parentDialog').close(); });

  load();
})();

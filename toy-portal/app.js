(() => {
  "use strict";

  const STORAGE_KEY = "atc-orish-play-world-v1";
  const safeText = (value) => String(value || "").replace(/[<>]/g, "").trim().slice(0, 32);
  const pick = (items) => items[Math.floor(Math.random() * items.length)];
  const cap = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1) : text;

  const state = {
    age: "6-7",
    world: "space",
    time: 20,
    toys: ["building blocks", "toy car"],
    customToys: [],
    mission: null,
    stageIndex: 0,
    muted: false,
    xp: 0,
    completed: 0
  };

  const worldData = {
    space: {
      label: "Space Rescue",
      callsigns: ["MOONBRIDGE", "STARLIGHT", "ORBIT ZERO", "NOVA GATE"],
      briefs: [
        "A strange signal has opened a temporary portal in your play zone. Orish needs your Toy Vault to build a rescue route before the signal fades.",
        "A tiny explorer beacon is stranded beyond the Moon Gate. Your toys are the only equipment close enough to reach it.",
        "Mission Control has lost contact with a friendly scout beyond Sector Seven. Build, test and solve your way to the signal."
      ],
      twist: ["The portal changed direction.", "A second signal has appeared.", "The map has rotated ninety degrees."]
    },
    dino: {
      label: "Dino Sector",
      callsigns: ["FOSSIL ONE", "RAPTOR TRACE", "AMBER TRACK", "JURASSIC SIGNAL"],
      briefs: [
        "Fresh tracks have appeared in Dino Sector, but one young dinosaur is separated from its group. Orish needs a safe route, sharp eyes and a clever final plan.",
        "A research marker has gone missing near the dinosaur zone. Your Toy Vault has been activated for a search-and-rescue mission.",
        "Something has moved in the fossil zone. Follow the clues, protect the route and help Orish identify what happened."
      ],
      twist: ["The tracks split into two paths.", "A harmless mystery sound changes the route.", "The rescue marker has moved to a new safe zone."]
    },
    spy: {
      label: "Signal Detective",
      callsigns: ["CODE CYAN", "ECHO KEY", "SIGNAL NINE", "HIDDEN FREQUENCY"],
      briefs: [
        "A scrambled message has appeared in the room. Orish has only part of the code. Build the evidence route, inspect the scene and unlock the final signal.",
        "Someone left a harmless mystery signal in the play zone. Your mission is to notice patterns, test ideas and solve the code before it disappears.",
        "The Signal Board shows one impossible reading. Orish needs a detective who can build, observe and reason carefully."
      ],
      twist: ["One clue is a decoy.", "The signal repeats in a new pattern.", "The evidence order has changed."]
    },
    magic: {
      label: "Hidden Portal",
      callsigns: ["GOLDEN DOOR", "WONDER KEY", "PORTAL BLUE", "SECRET PATH"],
      briefs: [
        "A hidden portal has appeared in an ordinary room, but it only opens for builders and problem-solvers. Your toys have become portal tools.",
        "Orish found a doorway that cannot be seen with ordinary eyes. Build the path, solve the riddle and discover what is on the other side.",
        "A lost spark from the Hidden World is waiting to get home. Your Toy Vault can create the route it needs."
      ],
      twist: ["The portal only accepts a new shape.", "The path has become a mirror route.", "A golden key symbol appears in a different place."]
    },
    science: {
      label: "Science Lab",
      callsigns: ["LAB CYAN", "PATTERN ZERO", "DISCOVERY ONE", "TEST SIGNAL"],
      briefs: [
        "Orish has detected a pattern that needs testing. Today your toys become safe lab equipment for a build, observation and logic experiment.",
        "The Discovery Lab has one unanswered question. Create a model, test a route and use evidence to finish the mission.",
        "A new signal behaves differently every time it meets an obstacle. Orish needs a careful tester to work out the pattern."
      ],
      twist: ["The first idea needs one change.", "A new piece of evidence appears.", "The test must work in a smaller space."]
    },
    rescue: {
      label: "Rescue HQ",
      callsigns: ["RESCUE CYAN", "SAFE ROUTE", "HELPER ONE", "BRIDGE TEAM"],
      briefs: [
        "A pretend explorer needs help crossing the play zone safely. Orish has activated your toys as rescue equipment. Plan first, then test the route.",
        "Rescue HQ has a problem: the normal path is blocked. Your mission is to build another way using only the safe items already in the Toy Vault.",
        "A friendly mission marker is stranded behind an obstacle. Orish needs teamwork, a safe build and a calm solution."
      ],
      twist: ["The first route is now closed.", "The rescue target has moved one safe step away.", "You must finish using fewer pieces."]
    }
  };

  const difficulty = {
    "4-5": {
      label: "Grown-up together",
      count: 3,
      build: "Use 3–5 pieces. A grown-up helps read and checks the play space.",
      observe: "Find two differences or name two colours/shapes.",
      puzzle: "Count, match or copy a simple pattern.",
      orish: ["We can do this together.", "Slow and clever beats fast and messy.", "Show me your best safe idea."]
    },
    "6-7": {
      label: "Curious explorer",
      count: 4,
      build: "Use at least 5 pieces or make a route with two clear sections.",
      observe: "Look carefully, remember positions and spot one change.",
      puzzle: "Solve a short number, shape or order clue.",
      orish: ["Agent, I need your eyes and your ideas.", "Try it, test it, then improve it.", "A good mission solver checks before moving on."]
    },
    "8-10": {
      label: "Mission solver",
      count: 5,
      build: "Add one rule: limited pieces, a height limit, or two connected zones.",
      observe: "Collect three observations before deciding what they mean.",
      puzzle: "Explain the pattern or give a reason for your answer.",
      orish: ["Evidence first. Guessing comes second.", "If the first plan fails, that is new information.", "I want a reason, not just an answer."]
    },
    "11-12": {
      label: "Strategy agent",
      count: 5,
      build: "Plan before building. Use a constraint and be ready to justify one design choice.",
      observe: "Separate what you saw from what you think it means.",
      puzzle: "Compare two possible solutions and choose the stronger one.",
      orish: ["Strategy means thinking one move ahead.", "Tell me what evidence would change your mind.", "Efficiency is part of the challenge."]
    }
  };

  const stageIcons = {
    BUILD: "🧱",
    MOVE: "🛞",
    OBSERVE: "🔎",
    CODE: "⌁",
    TWIST: "⚡"
  };

  const templates = {
    BUILD: [
      ({ a, b }) => ({ title: "Build the first safe route", text: `Use your ${a} and ${b} to create a pretend route between two spots on the floor or table. It can be a bridge, base, tunnel or checkpoint.`, challenge: "Keep everything low, stable and inside the grown-up-approved play area." }),
      ({ a, b }) => ({ title: "Create Mission Base", text: `Turn the ${a} into the main base and use the ${b} to mark a safe entrance. Your build needs a clear start and finish.`, challenge: "Nothing needs to be climbed on, tied to furniture or placed near doors." }),
      ({ a, b }) => ({ title: "Engineer a portal station", text: `Build a pretend portal station using the ${a}. Your ${b} must be able to reach or pass the station without knocking it over.`, challenge: "Test gently. If it falls, redesign it rather than making it bigger." })
    ],
    MOVE: [
      ({ a, b }) => ({ title: "Run the rescue route", text: `Move the ${b} from the start of your build to the finish. The ${a} is now part of the mission terrain, so find a careful path around or through it.`, challenge: "Use hands and toys only—no running, throwing or climbing." }),
      ({ a, b }) => ({ title: "Deliver the signal", text: `Choose one toy as the pretend signal carrier. Move it past the ${a} and safely reach the ${b} without touching the edge of your mission zone.`, challenge: "If you touch the edge, reset calmly and try a different route." }),
      ({ a, b }) => ({ title: "Test your transport plan", text: `Your ${a} must help the ${b} reach the other side of the play zone. Invent a safe pretend transport rule and test it once.`, challenge: "The toy stays on the floor or table. No launching or throwing." })
    ],
    OBSERVE: [
      ({ a, b }) => ({ title: "Scan for the change", text: `Look closely at the positions of the ${a}, ${b} and one other safe toy. Close your eyes while the grown-up moves one item slightly. Open them and identify what changed.`, challenge: "Older agents: describe the evidence that helped you decide." }),
      ({ a, b }) => ({ title: "Collect three clues", text: `Study the ${a} and ${b}. Find three details—colour, shape, size, texture, pattern or position—that could help Orish identify them later.`, challenge: "Say what you actually observe before explaining what you think." }),
      ({ a, b }) => ({ title: "Map the scene", text: `Without moving anything, describe where the ${a} is compared with the ${b}: left/right, nearer/farther, in front/behind or another accurate relation.`, challenge: "Now change one position and describe the new map." })
    ],
    CODE: [
      ({ a, b, age }) => ({ title: "Break the mission code", text: age === "4-5" ? `Make a pattern: ${cap(a)}, ${cap(b)}, ${cap(a)}… What comes next?` : `Create a four-part pattern using the ${a} and ${b}. Then change one part and see if another player can spot the broken rule.`, challenge: age === "11-12" ? "Explain two possible rules, then say which is better supported." : "The code works when you can explain the rule." }),
      ({ a, b, age }) => ({ title: "Solve Orish's logic lock", text: age === "4-5" ? `Put the ${a} beside the ${b}. Which one is bigger, smaller, longer or shorter? Pick one true comparison.` : `Imagine the ${a} is worth 2 signal points and the ${b} is worth 3. Build a safe combination worth exactly 8 points, or get as close as your available toys allow.`, challenge: age === "8-10" || age === "11-12" ? "Can you find a second solution and compare it?" : "Count carefully before you answer." }),
      ({ a, b }) => ({ title: "Unlock the sequence", text: `Give the ${a} the code A and the ${b} the code B. Make a six-step sequence using A and B, say it aloud, cover it, then try to repeat it from memory.`, challenge: "Make it harder only if the first sequence feels easy." })
    ],
    TWIST: [
      ({ a, b, world }) => ({ title: "Unexpected transmission", text: `${pick(worldData[world].twist)} Adapt your mission using the same ${a} and ${b}—do not add anything you do not already have in the safe play zone.`, challenge: "Change one thing, test it, and explain why your new plan works." }),
      ({ a, b, world }) => ({ title: "The final portal shift", text: `${pick(worldData[world].twist)} Reconfigure one part of your build so the ${b} can still complete the route past the ${a}.`, challenge: "This is the final test. Stay calm, change the plan, and finish safely." })
    ]
  };

  const els = {
    setup: document.getElementById("setupScreen"),
    mission: document.getElementById("missionScreen"),
    complete: document.getElementById("completeScreen"),
    form: document.getElementById("missionForm"),
    error: document.getElementById("formError"),
    safeZone: document.getElementById("safeZone"),
    customToy: document.getElementById("customToy"),
    customToyList: document.getElementById("customToyList"),
    xp: document.getElementById("xpValue"),
    count: document.getElementById("missionCount"),
    missionTitle: document.getElementById("missionTitle"),
    missionBrief: document.getElementById("missionBrief"),
    toyLoadout: document.getElementById("toyLoadout"),
    progress: document.getElementById("progressFill"),
    stageCounter: document.getElementById("stageCounter"),
    stageType: document.getElementById("stageType"),
    stageIcon: document.getElementById("stageIcon"),
    stageTitle: document.getElementById("stageTitle"),
    stageText: document.getElementById("stageText"),
    challengeBox: document.getElementById("challengeBox"),
    orishLine: document.getElementById("orishLine"),
    completeMessage: document.getElementById("completeMessage"),
    newMissionCount: document.getElementById("newMissionCount"),
    memoryText: document.getElementById("memoryText"),
    voiceToggle: document.getElementById("voiceToggle"),
    dialog: document.getElementById("parentDialog")
  };

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      state.xp = Number(saved.xp) || 0;
      state.completed = Number(saved.completed) || 0;
      state.muted = Boolean(saved.muted);
    } catch (_) {
      // If storage is unavailable, the game still works without persistence.
    }
    renderScore();
    renderVoice();
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ xp: state.xp, completed: state.completed, muted: state.muted }));
    } catch (_) {}
  }

  function renderScore() {
    els.xp.textContent = state.xp;
    els.count.textContent = state.completed;
  }

  function renderVoice() {
    els.voiceToggle.textContent = state.muted ? "🔇 Voice off" : "🔊 Voice on";
    els.voiceToggle.setAttribute("aria-pressed", String(state.muted));
  }

  function showScreen(which) {
    [els.setup, els.mission, els.complete].forEach((screen) => screen.classList.remove("active"));
    which.classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getSelectedToys() {
    const chosen = [...document.querySelectorAll("#toyChoices .chip.selected")].map((button) => button.dataset.toy);
    return [...chosen, ...state.customToys].filter(Boolean);
  }

  function addCustomToy() {
    const value = safeText(els.customToy.value).toLowerCase();
    if (!value || state.customToys.includes(value)) return;
    state.customToys.push(value);
    els.customToy.value = "";
    renderCustomToys();
  }

  function renderCustomToys() {
    els.customToyList.replaceChildren();
    state.customToys.forEach((toy) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = `＋ ${toy} ×`;
      button.setAttribute("aria-label", `Remove ${toy}`);
      button.addEventListener("click", () => {
        state.customToys = state.customToys.filter((item) => item !== toy);
        renderCustomToys();
      });
      els.customToyList.appendChild(button);
    });
  }

  function buildMission() {
    const toys = getSelectedToys();
    const world = worldData[state.world];
    const level = difficulty[state.age];
    const shuffled = [...toys].sort(() => Math.random() - 0.5);
    const a = shuffled[0];
    const b = shuffled[1] || shuffled[0];

    let stageTypes;
    if (state.time === 10) stageTypes = ["BUILD", "OBSERVE", "CODE"];
    else if (state.time === 20) stageTypes = ["BUILD", "MOVE", "OBSERVE", "CODE"];
    else stageTypes = ["BUILD", "MOVE", "OBSERVE", "CODE", "TWIST"];

    // Older age bands always get the deeper five-stage loop when a 30-minute mission is chosen.
    if (level.count === 3 && stageTypes.length > 3) stageTypes = stageTypes.slice(0, 4);

    const stages = stageTypes.map((type) => {
      const factory = pick(templates[type]);
      const stage = factory({ a, b, age: state.age, world: state.world });
      const skillNote = type === "BUILD" ? level.build : type === "OBSERVE" ? level.observe : type === "CODE" ? level.puzzle : "Complete it safely before moving on.";
      return { type, icon: stageIcons[type], ...stage, orish: `${pick(level.orish)} ${skillNote}` };
    });

    return {
      id: `OR-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      title: `${world.label}: ${pick(world.callsigns)}`,
      brief: pick(world.briefs),
      toys,
      age: state.age,
      world: state.world,
      stages
    };
  }

  function speak(text) {
    if (state.muted || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = state.age === "4-5" ? 0.88 : 0.94;
    utterance.pitch = 1.03;
    utterance.volume = 0.92;
    window.speechSynthesis.speak(utterance);
  }

  function missionSpeech() {
    if (!state.mission) return "";
    const stage = state.mission.stages[state.stageIndex];
    return `Orish transmission. ${stage.title}. ${stage.text} ${stage.orish}`;
  }

  function startMission() {
    state.toys = getSelectedToys();
    state.mission = buildMission();
    state.stageIndex = 0;
    els.missionTitle.textContent = state.mission.title;
    els.missionBrief.textContent = state.mission.brief;
    els.toyLoadout.replaceChildren();
    state.mission.toys.forEach((toy) => {
      const item = document.createElement("span");
      item.textContent = `TOY VAULT · ${toy}`;
      els.toyLoadout.appendChild(item);
    });
    renderStage();
    showScreen(els.mission);
    setTimeout(() => speak(`Orish online. ${state.mission.brief}`), 250);
  }

  function renderStage() {
    const mission = state.mission;
    const stage = mission.stages[state.stageIndex];
    const total = mission.stages.length;
    els.stageCounter.textContent = `STAGE ${state.stageIndex + 1} OF ${total}`;
    els.progress.style.width = `${(state.stageIndex / total) * 100}%`;
    els.stageType.textContent = stage.type;
    els.stageIcon.textContent = stage.icon;
    els.stageTitle.textContent = stage.title;
    els.stageText.textContent = stage.text;
    els.challengeBox.textContent = `MISSION RULE · ${stage.challenge}`;
    els.orishLine.innerHTML = `<strong>Orish:</strong> ${stage.orish}`;
  }

  function completeStage() {
    if (!state.mission) return;
    if (state.stageIndex < state.mission.stages.length - 1) {
      state.stageIndex += 1;
      renderStage();
      speak(missionSpeech());
      document.getElementById("stageCard").scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    finishMission();
  }

  function finishMission() {
    state.xp += 100;
    state.completed += 1;
    saveProgress();
    renderScore();
    els.newMissionCount.textContent = state.completed;
    const world = worldData[state.mission.world].label;
    els.completeMessage.textContent = `You completed ${state.mission.title} using things already in your world. The toys stayed the same. The adventure changed.`;
    els.memoryText.textContent = `Mission ${state.mission.id}: ${world} completed with ${state.mission.toys.slice(0, 3).join(", ")}. Next time Orish can reuse the same Toy Vault in a different world.`;
    els.progress.style.width = "100%";
    showScreen(els.complete);
    speak("Mission complete. Portal secured. One hundred XP earned. Excellent work, Agent.");
  }

  function setGroupSelection(button) {
    const group = button.closest("[data-group]");
    if (!group) return;
    group.querySelectorAll("button").forEach((item) => item.classList.remove("selected"));
    button.classList.add("selected");
    const value = button.dataset.value;
    if (group.dataset.group === "age") state.age = value;
    if (group.dataset.group === "world") state.world = value;
    if (group.dataset.group === "time") state.time = Number(value);
  }

  document.querySelectorAll("[data-group] button").forEach((button) => {
    button.addEventListener("click", () => setGroupSelection(button));
  });

  document.querySelectorAll("#toyChoices .chip").forEach((button) => {
    button.addEventListener("click", () => button.classList.toggle("selected"));
  });

  document.getElementById("addToy").addEventListener("click", addCustomToy);
  els.customToy.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addCustomToy();
    }
  });

  els.form.addEventListener("submit", (event) => {
    event.preventDefault();
    const toys = getSelectedToys();
    if (toys.length < 2) {
      els.error.textContent = "Choose at least two safe toys or play items for Orish to use.";
      return;
    }
    if (!els.safeZone.checked) {
      els.error.textContent = "A grown-up needs to confirm the safe play area before Orish starts.";
      return;
    }
    els.error.textContent = "";
    startMission();
  });

  document.getElementById("completeStage").addEventListener("click", completeStage);
  document.getElementById("repeatVoice").addEventListener("click", () => speak(missionSpeech()));
  els.voiceToggle.addEventListener("click", () => {
    state.muted = !state.muted;
    if (state.muted && "speechSynthesis" in window) window.speechSynthesis.cancel();
    saveProgress();
    renderVoice();
  });

  const goHome = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    showScreen(els.setup);
  };
  document.getElementById("homeButton").addEventListener("click", goHome);
  document.getElementById("backToVault").addEventListener("click", goHome);
  document.getElementById("newMission").addEventListener("click", goHome);
  document.getElementById("sameLoadout").addEventListener("click", () => {
    state.mission = buildMission();
    state.stageIndex = 0;
    els.missionTitle.textContent = state.mission.title;
    els.missionBrief.textContent = state.mission.brief;
    els.toyLoadout.replaceChildren();
    state.mission.toys.forEach((toy) => {
      const item = document.createElement("span");
      item.textContent = `TOY VAULT · ${toy}`;
      els.toyLoadout.appendChild(item);
    });
    renderStage();
    showScreen(els.mission);
    speak(`New mission. ${state.mission.brief}`);
  });

  document.getElementById("parentInfoButton").addEventListener("click", () => els.dialog.showModal());
  document.getElementById("closeDialog").addEventListener("click", () => els.dialog.close());
  document.getElementById("dialogDone").addEventListener("click", () => els.dialog.close());
  els.dialog.addEventListener("click", (event) => {
    if (event.target === els.dialog) els.dialog.close();
  });

  loadProgress();
})();

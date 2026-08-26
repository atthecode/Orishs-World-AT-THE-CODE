(() => {
  'use strict';

  const STORAGE_KEY = 'orish-space-signal-adventure-v2';
  const defaults = {
    crisisDone: false,
    crisisOpen: false,
    powerChoice: [],
    triangulationDone: false,
    triangulationOpen: false,
    hiddenBayDone: false,
    hiddenBayOpen: false,
    bonusAwarded: false
  };

  let state = load();
  let eventRoot = null;
  let lastFocus = null;
  let triggerTimer = 0;

  function load() {
    if (new URLSearchParams(location.search).has('replay')) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (_) {}
      return { ...defaults };
    }
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') }; }
    catch (_) { return { ...defaults }; }
  }

  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
  }

  function init() {
    const stage = document.getElementById('gameStage');
    const evidence = document.getElementById('evidenceCount');
    if (!stage || !evidence) return;

    buildAdventureHud();
    buildEventRoot();
    restoreHud();

    const observer = new MutationObserver(checkProgress);
    observer.observe(evidence, { childList: true, characterData: true, subtree: true });
    const mini = document.getElementById('miniCount');
    if (mini) observer.observe(mini, { childList: true, characterData: true, subtree: true });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && eventRoot && !eventRoot.hidden) {
        event.preventDefault();
      }
    });

    checkProgress();
  }

  function buildAdventureHud() {
    const hud = document.querySelector('.hud');
    if (!hud || document.getElementById('adventurePower')) return;

    const power = document.createElement('div');
    power.className = 'hud-card adventure-hud-card';
    power.innerHTML = '<small>STATION POWER</small><strong id="adventurePower">100%</strong>';

    const signal = document.createElement('div');
    signal.className = 'hud-card adventure-hud-card';
    signal.innerHTML = '<small>SIGNAL STATUS</small><strong id="adventureSignal">STABLE</strong>';

    hud.append(power, signal);
  }

  function buildEventRoot() {
    if (document.getElementById('adventureEvent')) {
      eventRoot = document.getElementById('adventureEvent');
      return;
    }
    eventRoot = document.createElement('div');
    eventRoot.id = 'adventureEvent';
    eventRoot.className = 'adventure-event';
    eventRoot.hidden = true;
    eventRoot.setAttribute('role', 'dialog');
    eventRoot.setAttribute('aria-modal', 'true');
    eventRoot.setAttribute('aria-labelledby', 'adventureEventTitle');
    eventRoot.innerHTML = '<div class="adventure-event-card" id="adventureEventCard"></div>';
    document.body.appendChild(eventRoot);
  }

  function restoreHud() {
    const power = document.getElementById('adventurePower');
    const signal = document.getElementById('adventureSignal');
    if (!power || !signal) return;

    if (!state.crisisDone) {
      power.textContent = '100%';
      signal.textContent = 'STABLE';
      return;
    }

    power.textContent = state.powerChoice.includes('scanner') ? '68%' : '54%';
    if (state.hiddenBayDone) signal.textContent = 'SOURCE UNKNOWN';
    else if (state.triangulationDone) signal.textContent = 'SOURCE BELOW';
    else signal.textContent = 'MOVING';

    if (!state.powerChoice.includes('comms') && !state.hiddenBayDone) {
      document.body.classList.add('adventure-comms-off');
    }
  }

  function checkProgress() {
    clearTimeout(triggerTimer);
    triggerTimer = setTimeout(() => {
      const stage = document.getElementById('gameStage');
      if (!stage || stage.hidden) return;
      const evidence = Number(document.getElementById('evidenceCount')?.textContent || 0);

      if (evidence >= 1 && !state.crisisDone && !state.crisisOpen) {
        launchPowerCrisis();
        return;
      }
      if (evidence >= 2 && state.crisisDone && !state.triangulationDone && !state.triangulationOpen) {
        launchTriangulation();
        return;
      }
      if (evidence >= 3 && state.triangulationDone && !state.hiddenBayDone && !state.hiddenBayOpen) {
        launchHiddenBay();
      }
    }, 450);
  }

  function openEvent(html) {
    if (!eventRoot) buildEventRoot();
    lastFocus = document.activeElement;
    eventRoot.querySelector('#adventureEventCard').innerHTML = html;
    eventRoot.hidden = false;
    document.body.classList.add('adventure-event-open');
    requestAnimationFrame(() => eventRoot.querySelector('button, input')?.focus());
  }

  function closeEvent() {
    if (!eventRoot) return;
    eventRoot.hidden = true;
    eventRoot.querySelector('#adventureEventCard').innerHTML = '';
    document.body.classList.remove('adventure-event-open');
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    checkProgress();
  }

  function launchPowerCrisis() {
    state.crisisOpen = true;
    save();
    setSignalText('POWER FAILURE');
    setComms('Power just dropped across the observatory. We cannot keep every system online. Choose two systems to protect.');

    openEvent(`
      <p class="adventure-kicker">EMERGENCY EVENT // POWER DROP</p>
      <h2 id="adventureEventTitle">The station cannot power everything.</h2>
      <p class="adventure-lead">A surge hit the observatory. You have enough emergency power for <strong>two of three systems</strong>. Your choice will change the rest of the mission.</p>
      <div class="power-grid" id="powerGrid">
        <button class="power-system" type="button" data-power="scanner" aria-pressed="false"><span>◎</span><b>SCANNER</b><small>Keeps signal readings accurate.</small></button>
        <button class="power-system" type="button" data-power="doors" aria-pressed="false"><span>▣</span><b>DOORS</b><small>Keeps lower observatory access online.</small></button>
        <button class="power-system" type="button" data-power="comms" aria-pressed="false"><span>◉</span><b>COMMS</b><small>Keeps Orish voice support online.</small></button>
      </div>
      <div class="power-summary" id="powerSummary" role="status">Choose 2 systems.</div>
      <button class="adventure-primary" id="confirmPower" type="button" disabled>ROUTE EMERGENCY POWER</button>
    `);

    const chosen = new Set();
    const buttons = [...eventRoot.querySelectorAll('[data-power]')];
    const confirm = eventRoot.querySelector('#confirmPower');
    const summary = eventRoot.querySelector('#powerSummary');

    buttons.forEach(button => button.addEventListener('click', () => {
      const id = button.dataset.power;
      if (chosen.has(id)) chosen.delete(id);
      else if (chosen.size < 2) chosen.add(id);
      else return;

      buttons.forEach(item => {
        const on = chosen.has(item.dataset.power);
        item.classList.toggle('selected', on);
        item.setAttribute('aria-pressed', String(on));
      });
      confirm.disabled = chosen.size !== 2;
      summary.textContent = chosen.size === 2
        ? `Power locked to ${[...chosen].join(' + ')}.`
        : `Choose ${2 - chosen.size} more system${2 - chosen.size === 1 ? '' : 's'}.`;
    }));

    confirm.addEventListener('click', () => {
      state.powerChoice = [...chosen];
      state.crisisDone = true;
      state.crisisOpen = false;
      save();

      const lost = ['scanner', 'doors', 'comms'].find(id => !chosen.has(id));
      document.getElementById('adventurePower').textContent = chosen.has('scanner') ? '68%' : '54%';
      setSignalText('MOVING');

      if (lost === 'comms') {
        document.body.classList.add('adventure-comms-off');
        setComms('Comms are offline. I can still guide you with text. Keep moving — the signal changed position during the surge.');
      } else if (lost === 'scanner') {
        setComms('Scanner power is reduced. Your later signal lock will need tighter manual alignment.');
      } else {
        setComms('Lower observatory doors are offline. If the signal leads down there, we will have to reroute power manually.');
      }

      showConsequence(lost);
    });
  }

  function showConsequence(lost) {
    const descriptions = {
      scanner: ['SCANNER WEAK', 'Signal readings now drift. Manual alignment will be less forgiving.'],
      doors: ['LOWER DOORS OFFLINE', 'If the signal leads below the observatory, access will require an emergency reroute.'],
      comms: ['COMMS OFFLINE', 'Orish voice support is unavailable until station power is restored. Text guidance remains available.']
    };
    const [title, copy] = descriptions[lost];
    eventRoot.querySelector('#adventureEventCard').innerHTML = `
      <p class="adventure-kicker">CONSEQUENCE REGISTERED</p>
      <h2 id="adventureEventTitle">${title}</h2>
      <p class="adventure-lead">${copy}</p>
      <p class="science-note">No choice is treated as a punishment. The mission changes and gives you a different problem to solve.</p>
      <button class="adventure-primary" id="continueAfterPower" type="button">CONTINUE MISSION</button>
    `;
    eventRoot.querySelector('#continueAfterPower').addEventListener('click', closeEvent);
  }

  function launchTriangulation() {
    state.triangulationOpen = true;
    save();
    setSignalText('SIGNAL MOVED');
    setComms('The signal moved again. That should not happen if we are tracking a fixed local source. Align three dishes and triangulate it.');

    const targets = state.powerChoice.includes('scanner') ? [27, 71, 44] : [31, 66, 49];
    const tolerance = state.powerChoice.includes('scanner') ? 5 : 3;

    openEvent(`
      <p class="adventure-kicker">LIVE EVENT // TRIANGULATION</p>
      <h2 id="adventureEventTitle">The signal changed direction.</h2>
      <p class="adventure-lead">Drag each dish angle until the signal strength rises above <strong>85%</strong>, then lock it. All three dishes must agree before we can locate the source.</p>
      <div class="dish-board" id="dishBoard"></div>
      <div class="triangulation-status" id="triangulationStatus" role="status">0 / 3 dishes locked</div>
      <button class="adventure-primary" id="finishTriangulation" type="button" hidden>FOLLOW THE SIGNAL</button>
      <p class="science-note">A repeating signal is evidence of a repeating signal. It is <strong>not</strong> proof of aliens or life.</p>
    `);

    const board = eventRoot.querySelector('#dishBoard');
    const status = eventRoot.querySelector('#triangulationStatus');
    const finish = eventRoot.querySelector('#finishTriangulation');
    const locked = new Set();

    targets.forEach((target, index) => {
      const row = document.createElement('section');
      row.className = 'dish-row';
      row.innerHTML = `
        <div class="dish-heading"><b>DISH ${index + 1}</b><span id="strength${index}">0% signal</span></div>
        <input id="dish${index}" type="range" min="0" max="100" value="50" aria-label="Dish ${index + 1} alignment">
        <div class="signal-bar"><i id="bar${index}"></i></div>
        <button class="dish-lock" id="lock${index}" type="button" disabled>LOCK DISH ${index + 1}</button>
      `;
      board.appendChild(row);

      const slider = row.querySelector('input');
      const bar = row.querySelector(`#bar${index}`);
      const strengthNode = row.querySelector(`#strength${index}`);
      const lockButton = row.querySelector(`#lock${index}`);

      const update = () => {
        const distance = Math.abs(Number(slider.value) - target);
        const strength = Math.max(0, Math.min(100, Math.round(100 - distance * 4.3)));
        bar.style.width = `${strength}%`;
        strengthNode.textContent = `${strength}% signal`;
        lockButton.disabled = distance > tolerance;
        row.classList.toggle('dish-ready', distance <= tolerance);
      };

      slider.addEventListener('input', update);
      lockButton.addEventListener('click', () => {
        if (locked.has(index)) return;
        locked.add(index);
        slider.disabled = true;
        lockButton.disabled = true;
        lockButton.textContent = 'LOCKED ✓';
        row.classList.add('dish-locked');
        status.textContent = `${locked.size} / 3 dishes locked`;
        navigator.vibrate?.(35);
        if (locked.size === 3) {
          status.textContent = 'TRIANGULATION COMPLETE — source is below the observatory.';
          finish.hidden = false;
          finish.focus();
        }
      });
      update();
    });

    finish.addEventListener('click', () => {
      state.triangulationDone = true;
      state.triangulationOpen = false;
      save();
      setSignalText('SOURCE BELOW');
      setComms('Three dishes agree. The strongest repeating pulse is coming from below the main observatory. We still do not know what caused it.');
      closeEvent();
    });
  }

  function launchHiddenBay() {
    state.hiddenBayOpen = true;
    save();

    const doorsPowered = state.powerChoice.includes('doors');
    if (doorsPowered) {
      revealHiddenBay();
      return;
    }

    openEvent(`
      <p class="adventure-kicker">ACCESS PROBLEM // LOWER OBSERVATORY</p>
      <h2 id="adventureEventTitle">The signal is behind an unpowered door.</h2>
      <p class="adventure-lead">You chose not to protect the lower doors during the power crisis. Now reroute a narrow emergency circuit to open the bay.</p>
      <label class="reroute-control" for="rerouteRange"><b>EMERGENCY REROUTE</b><span>Hold the circuit inside the green window.</span></label>
      <input id="rerouteRange" class="reroute-range" type="range" min="0" max="100" value="15" aria-label="Emergency door power">
      <div class="reroute-meter"><i id="rerouteMeter"></i><span class="safe-window" aria-hidden="true"></span></div>
      <p id="rerouteStatus" class="triangulation-status" role="status">Door power unstable.</p>
      <button class="adventure-primary" id="openReroutedDoor" type="button" disabled>OPEN LOWER BAY</button>
    `);

    const slider = eventRoot.querySelector('#rerouteRange');
    const meter = eventRoot.querySelector('#rerouteMeter');
    const status = eventRoot.querySelector('#rerouteStatus');
    const openButton = eventRoot.querySelector('#openReroutedDoor');

    const update = () => {
      const value = Number(slider.value);
      meter.style.width = `${value}%`;
      const safe = value >= 64 && value <= 76;
      status.textContent = safe ? 'Stable emergency circuit — door can open.' : value < 64 ? 'Not enough power.' : 'Too much load — reduce power.';
      openButton.disabled = !safe;
    };
    slider.addEventListener('input', update);
    openButton.addEventListener('click', revealHiddenBay);
    update();
  }

  function revealHiddenBay() {
    openEvent(`
      <p class="adventure-kicker">HIDDEN AREA DISCOVERED</p>
      <div class="hidden-bay-visual" aria-hidden="true"><span></span><i></i><b>▆ · ▆ · ▆ ·</b></div>
      <h2 id="adventureEventTitle">A sealed calibration array is still receiving the pulse.</h2>
      <p class="adventure-lead">The lower bay contains an old deep-space calibration array. It confirms the pulse is coherent and repeating — but the source itself is still unknown.</p>
      <div class="evidence-reveal"><b>WHAT WE KNOW</b><span>✓ Three dishes agree on direction</span><span>✓ Pulse intervals repeat</span><span>✓ Source is not a fixed local station beacon</span><span>?</span><strong>Cause remains unexplained</strong></div>
      <p class="science-note">Good science stops where the evidence stops. “Unknown” is a valid conclusion.</p>
      <button class="adventure-primary" id="finishHiddenBay" type="button">RETURN TO EVIDENCE LAB</button>
    `);

    eventRoot.querySelector('#finishHiddenBay').addEventListener('click', () => {
      state.hiddenBayDone = true;
      state.hiddenBayOpen = false;
      if (!state.bonusAwarded) {
        const stars = document.getElementById('starCount');
        if (stars) stars.textContent = String((Number(stars.textContent) || 0) + 50);
        state.bonusAwarded = true;
      }
      save();
      document.body.classList.remove('adventure-comms-off');
      setSignalText('SOURCE UNKNOWN');
      setComms('Hidden bay secured. We have stronger evidence now, but the source is still unknown. Take that uncertainty into the Evidence Lab.');
      const objective = document.getElementById('objectiveText');
      if (objective) objective.textContent = 'Analyse the unknown signal';
      closeEvent();
    });
  }

  function setComms(text) {
    const node = document.getElementById('commsText');
    if (node) node.textContent = text;
  }

  function setSignalText(text) {
    const node = document.getElementById('adventureSignal');
    if (node) node.textContent = text;
  }

  addEventListener('DOMContentLoaded', init, { once: true });
})();
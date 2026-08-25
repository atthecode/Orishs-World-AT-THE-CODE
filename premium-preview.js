(() => {
  'use strict';

  const signalLevels = [
    ['TRAINING MISSION', "Calibrate Orish's scanner", 'Tap the signal nodes in order. Orish will show you how movement, scanning and evidence collection work.'],
    ['LEVEL 1 · OBSERVE', 'Find the hidden signal', 'Move through the station, inspect the consoles and separate useful observations from guesses.'],
    ['LEVEL 2 · INVESTIGATE', 'Collect three evidence traces', 'Compare signal strength, timing and direction without deciding the answer too early.'],
    ['LEVEL 3 · TEST', 'Build and test the pattern', 'Tune frequencies, repeat the scan and check whether the pattern appears again.'],
    ['LEVEL 4 · DECIDE', 'Choose the safest station response', 'Use the evidence to make a decision and see the consequences of that choice.'],
    ['LEVEL 5 · CASE CONCLUSION', 'Solve the Space Signal case', 'Combine every discovery, explain what is known and unlock the cinema ending.']
  ];

  const ageJourneys = {
    parent: ['🌱', 'PARENT & ME', 'Shared discovery starts here.', 'Parent-led sound, rhythm, visual tracking, movement, early words and tiny real-world missions—never independent baby AI.', ['Notice and explore together', 'Simple cause and effect', 'Copy, choose and celebrate', 'Short off-screen family activities']],
    early: ['🪁', 'EARLY EXPLORERS', 'Playful missions build confidence.', 'Spoken and visual instructions lead children through phonics, numbers, patterns, routines, imagination and simple discoveries.', ['Training through play', 'Five-step mini adventures', 'Positive choices and trying again', 'Movement and real-world curiosity']],
    explorer: ['🧭', 'EXPLORERS', 'Clues become connected adventures.', 'Children investigate science, maths, literacy, evidence, money and creativity through increasingly independent missions.', ['Search and collect clues', 'Combine patterns and information', 'Strategy and route challenges', 'Meaningful rewards and unlocks']],
    investigator: ['🔎', 'INVESTIGATORS', 'Every claim needs evidence.', 'Sophisticated mysteries develop logic, source checking, strategy, communication and consequences without making the experience feel childish.', ['Observe contradictions', 'Gather and compare evidence', 'Test competing explanations', 'Complete full case conclusions']],
    advanced: ['🛰️', 'ADVANCED MISSIONS', 'Build solutions for the real world.', 'Older learners tackle finance, civics, science, data, media literacy and project-building through mature simulations and capstones.', ['Define complex problems', 'Research and analyse data', 'Model systems and trade-offs', 'Produce a design, report or solution']]
  };

  const levelButtons = [...document.querySelectorAll('[data-signal-level]')];
  levelButtons.forEach((button) => button.addEventListener('click', () => {
    levelButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    levelButtons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
    const selected = signalLevels[Number(button.dataset.signalLevel)] || signalLevels[0];
    document.getElementById('signalLevelBadge').textContent = selected[0];
    document.getElementById('signalLevelTitle').textContent = selected[1];
    document.getElementById('signalLevelCopy').textContent = selected[2];
  }));

  const ageTabs = [...document.querySelectorAll('[data-age]')];
  ageTabs.forEach((button) => button.addEventListener('click', () => {
    const selected = ageJourneys[button.dataset.age] || ageJourneys.parent;
    ageTabs.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
    ageTabs.forEach((item) => item.setAttribute('aria-selected', String(item === button)));
    document.getElementById('ageIcon').textContent = selected[0];
    document.getElementById('ageLabel').textContent = selected[1];
    document.getElementById('ageTitle').textContent = selected[2];
    document.getElementById('ageCopy').textContent = selected[3];
    document.getElementById('ageFeatures').innerHTML = selected[4].map((item) => `<li>${item}</li>`).join('');
  }));

  const nodes = [...document.querySelectorAll('[data-signal-node]')];
  let nextNode = 1;
  const updateSignal = (message) => {
    document.getElementById('evidenceCount').textContent = `${nextNode - 1} / 3`;
    document.getElementById('orishSignalMessage').textContent = message;
    document.getElementById('signalStatus').textContent = nextNode > 3 ? 'SIGNAL: CALIBRATED' : 'SIGNAL: TUNING';
  };
  nodes.forEach((node) => node.addEventListener('click', () => {
    const value = Number(node.dataset.signalNode);
    if (value !== nextNode) {
      updateSignal(`Try node ${nextNode} next. Evidence works best in order.`);
      return;
    }
    node.classList.add('found');
    nextNode += 1;
    updateSignal(nextNode > 3 ? 'Excellent. The scanner is calibrated—Level 1 is ready.' : `Good observation. Now find node ${nextNode}.`);
  }));
  document.getElementById('resetSignal')?.addEventListener('click', () => {
    nodes.forEach((node) => node.classList.remove('found'));
    nextNode = 1;
    document.getElementById('evidenceCount').textContent = '0 / 3';
    document.getElementById('orishSignalMessage').textContent = "Let's calibrate the scanner.";
    document.getElementById('signalStatus').textContent = 'SIGNAL: UNCALIBRATED';
  });

  function readProgress() {
    try {
      const fossil = JSON.parse(localStorage.getItem('orish-fossil-detective-v1') || '{}');
      const space = JSON.parse(localStorage.getItem('orish-space-signal-v1') || '{}');
      const completed = [fossil, space].filter(item => item.phase === 'complete').length;
      const stars = Number(fossil.stars || 0) + Number(space.stars || 0);
      document.getElementById('headerStars').textContent = `★ ${stars}`;
      document.getElementById('progressStars').textContent = `★ ${stars}`;
      document.getElementById('progressBadges').textContent = `🛡️ ${completed}`;
      document.getElementById('progressMissions').textContent = `📖 ${completed}`;
    } catch (_) {}
  }
  levelButtons.forEach((item, index) => item.setAttribute('aria-pressed', String(index === 0)));
  ageTabs.forEach((item, index) => item.setAttribute('aria-selected', String(index === 0)));
  readProgress();
  addEventListener('storage', readProgress);

  const betaClips = [
    'assets/audio/orish/welcome-orish-world.m4a',
    'assets/audio/orish/fun-and-learn.m4a'
  ];
  let betaAudio = null;
  let betaClipIndex = 0;
  const betaPlay = document.getElementById('playBetaWelcome');
  const betaStop = document.getElementById('stopBetaWelcome');
  const betaVoiceStatus = document.getElementById('betaVoiceStatus');
  function stopBetaVoice(message = '🔇 Voice is off. Orish only speaks after you press the button.') {
    if (betaAudio) { betaAudio.pause(); betaAudio.currentTime = 0; }
    betaAudio = null; betaClipIndex = 0;
    betaPlay.disabled = false; betaStop.disabled = true;
    betaVoiceStatus.textContent = message;
  }
  function playNextBetaClip() {
    if (betaClipIndex >= betaClips.length) {
      stopBetaVoice('✓ Welcome finished. Full conversational guidance will be tested separately with parent permission.');
      return;
    }
    betaAudio = new Audio(betaClips[betaClipIndex++]);
    betaAudio.addEventListener('ended', playNextBetaClip, { once: true });
    betaAudio.addEventListener('error', () => stopBetaVoice('The welcome recording could not play on this device. The written introduction is available above.'), { once: true });
    betaAudio.play().catch(() => stopBetaVoice('Tap the welcome button again to allow sound.'));
  }
  betaPlay?.addEventListener('click', () => {
    stopBetaVoice(); betaPlay.disabled = true; betaStop.disabled = false;
    betaVoiceStatus.textContent = '🔊 Orish is speaking. Press Stop voice at any time.';
    playNextBetaClip();
  });
  betaStop?.addEventListener('click', () => stopBetaVoice());

  const feedbackForm = document.getElementById('betaFeedbackForm');
  const shareFeedback = document.getElementById('shareFeedback');
  const feedbackStatus = document.getElementById('feedbackStatus');
  feedbackForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const area = document.getElementById('feedbackArea').value;
    const message = document.getElementById('feedbackMessage').value.trim();
    if (!message) return;
    localStorage.setItem('orish-beta-feedback-draft-v1', JSON.stringify({ area, message, savedAt: new Date().toISOString() }));
    shareFeedback.disabled = false;
    feedbackStatus.textContent = '✓ Feedback saved privately on this device. Press Share feedback when ready.';
  });
  shareFeedback?.addEventListener('click', async () => {
    const saved = JSON.parse(localStorage.getItem('orish-beta-feedback-draft-v1') || 'null');
    if (!saved) return;
    const text = `Orish's World beta feedback\nArea: ${saved.area}\n\n${saved.message}`;
    try {
      if (navigator.share) await navigator.share({ title: "Orish's World beta feedback", text });
      else { await navigator.clipboard.writeText(text); feedbackStatus.textContent = '✓ Feedback copied. A grown-up can paste it into a message.'; }
    } catch (error) { if (error?.name !== 'AbortError') feedbackStatus.textContent = 'Feedback remains saved privately on this device.'; }
  });
  document.getElementById('referFriend')?.addEventListener('click', async () => {
    const share = { title: "Orish's World family beta", text: "You may be interested in helping test Orish's World, a parent-controlled learning universe for children.", url: location.href };
    const status = document.getElementById('referralStatus');
    try {
      if (navigator.share) await navigator.share(share);
      else { await navigator.clipboard.writeText(`${share.text} ${share.url}`); status.textContent = '✓ Beta invitation link copied.'; }
    } catch (error) { if (error?.name !== 'AbortError') status.textContent = 'The invitation could not open. Please copy the page link instead.'; }
  });
  document.getElementById('betaInterest')?.addEventListener('click', () => {
    localStorage.setItem('orish-beta-interest-v1', new Date().toISOString());
    document.getElementById('referralStatus').textContent = '✓ Interest noted on this device. Secure invite registration will be connected before family recruitment opens.';
  });
  addEventListener('pagehide', () => stopBetaVoice());
})();

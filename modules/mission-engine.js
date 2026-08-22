(() => {
  'use strict';

  const KEY = 'orish.v1.childMissions';
  const MAX_MISSIONS = 60;

  function readAll() {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
  }

  function writeAll(items) {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_MISSIONS)));
  }

  function getForProfile(profileId) {
    return readAll().filter(item => item.profileId === profileId);
  }

  function ageSteps(ageBand, focus) {
    const safeFocus = String(focus || 'learning curiosity').toLowerCase();
    const banks = {
      '0-2': [
        'Grown-up says the mission name and gives a cuddle, smile or gentle high-five.',
        `Together, notice one simple thing linked to ${safeFocus}.`,
        'Finish with a short rhyme, movement or calm celebration.'
      ],
      '2-4': [
        'Listen to Orish’s short challenge.',
        `Choose one helpful action for ${safeFocus}.`,
        'Show or tell a grown-up what you did.'
      ],
      '4-6': [
        'Spot what the mission is asking you to do.',
        `Try one small action connected to ${safeFocus}.`,
        'Tell Orish what worked, then finish with a star moment.'
      ],
      '7-9': [
        'Read or hear the mission clue.',
        `Choose a plan for ${safeFocus}.`,
        'Do the real-world action and check whether your plan worked.'
      ],
      '10-12': [
        'Identify the mission goal and one possible obstacle.',
        `Choose a strategy for ${safeFocus}.`,
        'Try it, review the result and choose one improvement.'
      ],
      '13-16': [
        'Define the problem in your own words.',
        `Choose a practical strategy for ${safeFocus} and explain why it may work.`,
        'Test the strategy, reflect on the outcome and adjust it if needed.'
      ]
    };
    return banks[ageBand] || banks['7-9'];
  }

  function createFromBlueprint(profile, blueprint) {
    if (!profile || !blueprint) return null;
    const mission = {
      id: crypto.randomUUID ? crypto.randomUUID() : `m-${Date.now()}`,
      profileId: profile.id,
      createdAt: new Date().toISOString(),
      status: 'ready',
      title: String(blueprint.childTitle || 'Orish Mission').slice(0, 80),
      intro: String(blueprint.childIntro || 'A new mission is ready.').slice(0, 240),
      ageBand: profile.ageBand,
      framework: blueprint.framework,
      subject: blueprint.format === 'Science challenge' ? 'Science' : 'Personal development & learning',
      objective: blueprint.format === 'Science challenge'
        ? 'Plan, observe and explain a safe test.'
        : `Practise ${String(profile.currentFocus || 'learning curiosity').toLowerCase()} through an age-appropriate mission.`,
      steps: ageSteps(profile.ageBand, profile.currentFocus),
      evidenceLabel: blueprint.evidence || 'completion and reflection',
      completedAt: null
    };
    const items = readAll();
    items.unshift(mission);
    writeAll(items);
    return mission;
  }

  function complete(profileId, missionId) {
    const items = readAll();
    const index = items.findIndex(item => item.profileId === profileId && item.id === missionId);
    if (index < 0) return null;
    items[index] = { ...items[index], status: 'completed', completedAt: new Date().toISOString() };
    writeAll(items);
    return items[index];
  }

  function remove(profileId, missionId) {
    writeAll(readAll().filter(item => !(item.profileId === profileId && item.id === missionId)));
  }

  function countReady(profileId) {
    return getForProfile(profileId).filter(item => item.status !== 'completed').length;
  }

  window.OrishMissionEngine = { createFromBlueprint, getForProfile, complete, remove, countReady };
})();

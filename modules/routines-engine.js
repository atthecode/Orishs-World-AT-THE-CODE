(() => {
  'use strict';

  const KEY = 'orish.v1.routines';
  const DEFAULTS = {
    morning: ['Wake up and stretch', 'Wash and get dressed', 'Breakfast', 'Brush teeth', 'Bag / things ready'],
    bedtime: ['Quiet tidy-up', 'Wash / bath routine', 'Brush teeth', 'Choose clothes / prepare for tomorrow', 'Calm story or breathing', 'Lights down']
  };

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; }
  }

  function write(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  function normaliseSteps(value, fallback) {
    const source = Array.isArray(value) ? value : String(value || '').split(/\n|,/);
    const cleaned = source.map(item => String(item).replace(/[<>]/g, '').trim().slice(0, 70)).filter(Boolean).slice(0, 10);
    return cleaned.length ? cleaned : [...fallback];
  }

  function get(profileId) {
    const all = read();
    const stored = all[profileId] || {};
    return {
      morning: normaliseSteps(stored.morning, DEFAULTS.morning),
      bedtime: normaliseSteps(stored.bedtime, DEFAULTS.bedtime),
      encouragement: String(stored.encouragement || 'You’re building your routine one step at a time.').slice(0, 120)
    };
  }

  function save(profileId, input) {
    const all = read();
    all[profileId] = {
      morning: normaliseSteps(input.morning, DEFAULTS.morning),
      bedtime: normaliseSteps(input.bedtime, DEFAULTS.bedtime),
      encouragement: String(input.encouragement || '').replace(/[<>]/g, '').trim().slice(0, 120) || 'You’re building your routine one step at a time.'
    };
    write(all);
    return get(profileId);
  }

  window.OrishRoutines = { DEFAULTS, get, save };
})();

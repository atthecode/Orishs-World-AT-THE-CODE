(() => {
  'use strict';

  const KEY = 'orish.v1.accessibility';
  const defaults = Object.freeze({
    textSize: 'standard',
    highContrast: false,
    reducedMotion: false,
    spaciousText: false,
    simplifiedVisuals: false,
    speechEnabled: true
  });

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function all() { return safeParse(localStorage.getItem(KEY), {}); }
  function profileKey(profileId) { return profileId || 'demo'; }

  function normalise(input = {}) {
    return {
      textSize: ['standard','large','extra'].includes(input.textSize) ? input.textSize : defaults.textSize,
      highContrast: input.highContrast === true,
      reducedMotion: input.reducedMotion === true,
      spaciousText: input.spaciousText === true,
      simplifiedVisuals: input.simplifiedVisuals === true,
      speechEnabled: input.speechEnabled !== false
    };
  }

  function get(profileId) {
    const data = all();
    return normalise({ ...defaults, ...(data[profileKey(profileId)] || {}) });
  }

  function save(profileId, input) {
    const data = all();
    const prefs = normalise(input);
    data[profileKey(profileId)] = prefs;
    localStorage.setItem(KEY, JSON.stringify(data));
    return prefs;
  }

  function reset(profileId) {
    const data = all();
    delete data[profileKey(profileId)];
    localStorage.setItem(KEY, JSON.stringify(data));
    return { ...defaults };
  }

  function apply(prefs) {
    const p = normalise(prefs);
    const root = document.documentElement;
    root.dataset.textSize = p.textSize;
    root.dataset.highContrast = String(p.highContrast);
    root.dataset.reducedMotion = String(p.reducedMotion);
    root.dataset.spaciousText = String(p.spaciousText);
    root.dataset.simplifiedVisuals = String(p.simplifiedVisuals);
    return p;
  }

  function describe(prefs) {
    const p = normalise(prefs);
    const active = [];
    if (p.textSize !== 'standard') active.push(p.textSize === 'extra' ? 'extra-large text' : 'large text');
    if (p.highContrast) active.push('high contrast');
    if (p.reducedMotion) active.push('reduced motion');
    if (p.spaciousText) active.push('spacious text');
    if (p.simplifiedVisuals) active.push('simplified visuals');
    if (!p.speechEnabled) active.push('spoken support off');
    return active.length ? active.join(' • ') : 'Standard display settings';
  }

  window.OrishAccessibility = { KEY, defaults, get, save, reset, apply, describe };
})();

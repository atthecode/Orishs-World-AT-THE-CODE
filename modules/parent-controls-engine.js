(() => {
  'use strict';

  const KEY = 'orish.v1.parentControls';
  const ROLE_IDS = ['parent','sibling','grandparent','family'];

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function readAll() { return safeParse(localStorage.getItem(KEY), {}); }
  function writeAll(data) { localStorage.setItem(KEY, JSON.stringify(data)); }

  function defaults(ageBand='7-9') {
    return {
      freeTextOrish: ageBand !== '0-2',
      spokenSupport: true,
      phonicsGuide: ['0-2','2-4','4-6','7-9'].includes(ageBand),
      twoWayVoice: false,
      offlineActivities: true,
      learningEvidence: true,
      familyClubhouse: true,
      kitchenLab: true,
      goodNews: true,
      parentMissions: true,
      trustedFamilyRoles: [...ROLE_IDS],
      futureLiveAI: false,
      futureWebSearch: false,
      futurePublicSocial: false,
      futureLocation: false,
      futureCameraUploads: false,
      updatedAt: null
    };
  }

  function normalise(input={}, ageBand='7-9') {
    const base = defaults(ageBand);
    const roles = Array.isArray(input.trustedFamilyRoles)
      ? input.trustedFamilyRoles.filter(role => ROLE_IDS.includes(role))
      : base.trustedFamilyRoles;
    return {
      freeTextOrish: ageBand === '0-2' ? false : input.freeTextOrish !== false,
      spokenSupport: input.spokenSupport !== false,
      phonicsGuide: typeof input.phonicsGuide === 'boolean' ? input.phonicsGuide : base.phonicsGuide,
      twoWayVoice: ageBand === '0-2' ? false : input.twoWayVoice === true,
      offlineActivities: input.offlineActivities !== false,
      learningEvidence: input.learningEvidence !== false,
      familyClubhouse: input.familyClubhouse !== false,
      kitchenLab: input.kitchenLab !== false,
      goodNews: input.goodNews !== false,
      parentMissions: input.parentMissions !== false,
      trustedFamilyRoles: roles.length ? [...new Set(roles)] : ['parent'],
      // Future online-capability flags are deliberately locked OFF in this prototype.
      futureLiveAI: false,
      futureWebSearch: false,
      futurePublicSocial: false,
      futureLocation: false,
      futureCameraUploads: false,
      updatedAt: input.updatedAt || null
    };
  }

  function get(profileId, ageBand='7-9') {
    if (!profileId) return normalise({}, ageBand);
    const all = readAll();
    return normalise(all[profileId] || {}, ageBand);
  }

  function save(profileId, ageBand, input) {
    if (!profileId) throw new Error('Select a child profile first.');
    const all = readAll();
    const controls = normalise({ ...input, updatedAt:new Date().toISOString() }, ageBand);
    all[profileId] = controls;
    writeAll(all);
    return controls;
  }

  function reset(profileId, ageBand='7-9') {
    if (!profileId) return defaults(ageBand);
    const all = readAll();
    delete all[profileId];
    writeAll(all);
    return get(profileId, ageBand);
  }

  function remove(profileId) {
    const all = readAll();
    delete all[profileId];
    writeAll(all);
  }

  function isRoleApproved(profileId, ageBand, roleId) {
    return get(profileId, ageBand).trustedFamilyRoles.includes(roleId);
  }

  function describe(controls) {
    const c = normalise(controls || {});
    const enabled = [
      c.freeTextOrish && 'free-text Orish',
      c.spokenSupport && 'spoken support',
      c.phonicsGuide && 'phonics & reading guide',
      c.twoWayVoice && 'two-way voice',
      c.offlineActivities && 'offline activities',
      c.learningEvidence && 'Learning Passport',
      c.familyClubhouse && 'Family Clubhouse',
      c.kitchenLab && 'Kitchen Lab',
      c.goodNews && 'Good News',
      c.parentMissions && 'parent-created missions'
    ].filter(Boolean);
    return enabled.length ? enabled.join(' • ') : 'Only core guided learning is enabled';
  }

  window.OrishParentControls = { KEY, ROLE_IDS, defaults, normalise, get, save, reset, remove, isRoleApproved, describe };
})();

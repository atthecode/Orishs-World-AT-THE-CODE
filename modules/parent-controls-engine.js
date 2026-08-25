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
      twoWayVoice: false,
      offlineActivities: true,
      learningEvidence: true,
      familyClubhouse: true,
      kitchenLab: true,
      goodNews: true,
      parentMissions: true,
      playSchedule: { preset:'anytime', start:'00:00', end:'23:59', dailyMinutes:30, bedtimeMode:false },
      conversationalDailyMinutes: 10,
      conversationalDailyTurns: 20,
      conversationIdleSeconds: 60,
      caregiverTitle: 'parent',
      greetingStyle: 'hello',
      routineGateEnabled: false,
      routineTasks: ['wash','teeth','dress','breakfast','bag'],
      familySupportFocus: '',
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
      twoWayVoice: ageBand === '0-2' ? false : input.twoWayVoice === true,
      offlineActivities: input.offlineActivities !== false,
      learningEvidence: input.learningEvidence !== false,
      familyClubhouse: input.familyClubhouse !== false,
      kitchenLab: input.kitchenLab !== false,
      goodNews: input.goodNews !== false,
      parentMissions: input.parentMissions !== false,
      playSchedule: {
        preset: String(input.playSchedule?.preset || base.playSchedule.preset),
        start: /^\d{2}:\d{2}$/.test(input.playSchedule?.start || '') ? input.playSchedule.start : base.playSchedule.start,
        end: /^\d{2}:\d{2}$/.test(input.playSchedule?.end || '') ? input.playSchedule.end : base.playSchedule.end,
        dailyMinutes: Math.min(60, Math.max(10, Number(input.playSchedule?.dailyMinutes) || base.playSchedule.dailyMinutes)),
        bedtimeMode: input.playSchedule?.preset === 'bedtime' || input.playSchedule?.bedtimeMode === true
      },
      conversationalDailyMinutes: Math.min(10, Math.max(0, Number(input.conversationalDailyMinutes) || base.conversationalDailyMinutes)),
      conversationalDailyTurns: Math.min(20, Math.max(0, Number(input.conversationalDailyTurns) || base.conversationalDailyTurns)),
      conversationIdleSeconds: Math.min(90, Math.max(30, Number(input.conversationIdleSeconds) || base.conversationIdleSeconds)),
      caregiverTitle: ['parent','mother','father','guardian','grandparent','grown-up'].includes(input.caregiverTitle) ? input.caregiverTitle : base.caregiverTitle,
      greetingStyle: ['hello','good-morning','grand-rising','rich-risings','grand-evening','grand-night'].includes(input.greetingStyle) ? input.greetingStyle : base.greetingStyle,
      routineGateEnabled: input.routineGateEnabled === true,
      routineTasks: Array.isArray(input.routineTasks) ? input.routineTasks.filter(task => ['wash','teeth','dress','breakfast','bag','listen','tidy','calm'].includes(task)).slice(0,8) : base.routineTasks,
      familySupportFocus: String(input.familySupportFocus || '').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,240),
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

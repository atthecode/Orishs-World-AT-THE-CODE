(() => {
  'use strict';

  const KEY = 'orish.schoolSupport.v1';

  const roles = {
    teacher: {
      label: 'Teacher',
      scope: 'Assigned-child learning support',
      canSeeChildLearning: true,
      canSeeSchoolAggregate: false,
      canSeePrivateParentRequests: false,
      canSeeHealthData: false,
      description: 'Prototype view for supporting an assigned child using learning outcomes only. Private Parent Studio wording stays hidden.'
    },
    headteacher: {
      label: 'Headteacher / school leader',
      scope: 'Whole-school aggregate',
      canSeeChildLearning: false,
      canSeeSchoolAggregate: true,
      canSeePrivateParentRequests: false,
      canSeeHealthData: false,
      description: 'Prototype whole-school overview using aggregate learning counts only. It does not expose private Parent Studio wording.'
    },
    deputy: {
      label: 'Deputy head / school leader',
      scope: 'Whole-school aggregate',
      canSeeChildLearning: false,
      canSeeSchoolAggregate: true,
      canSeePrivateParentRequests: false,
      canSeeHealthData: false,
      description: 'Prototype leadership overview using aggregate learning counts only.'
    },
    healthVisitor: {
      label: 'Health visitor / family support',
      scope: 'Family support only',
      canSeeChildLearning: false,
      canSeeSchoolAggregate: false,
      canSeePrivateParentRequests: false,
      canSeeHealthData: false,
      description: 'No reading scores, learning evidence, private notes or school-performance data are shown. This role is limited to family-support pathways and non-sensitive information packs.'
    },
    homeEducator: {
      label: 'Home educator',
      scope: 'Household learning overview',
      canSeeChildLearning: true,
      canSeeSchoolAggregate: false,
      canSeePrivateParentRequests: true,
      canSeeHealthData: false,
      description: 'Prototype home-education view for the adult-owned household account.'
    }
  };

  function safeParse(value, fallback) {
    try { return JSON.parse(value); } catch { return fallback; }
  }

  function clean(value, max = 80) {
    return String(value || '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, max);
  }

  function getConfig() {
    const saved = safeParse(localStorage.getItem(KEY), null);
    const role = roles[saved?.role] ? saved.role : 'homeEducator';
    return {
      role,
      organisation: clean(saved?.organisation || '', 80),
      settingType: ['school','home','family-support'].includes(saved?.settingType) ? saved.settingType : 'home'
    };
  }

  function saveConfig(input = {}) {
    const role = roles[input.role] ? input.role : 'homeEducator';
    const next = {
      role,
      organisation: clean(input.organisation || '', 80),
      settingType: ['school','home','family-support'].includes(input.settingType) ? input.settingType : 'home',
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(KEY, JSON.stringify(next));
    return next;
  }

  function getRole(roleKey) {
    return roles[roleKey] || roles.homeEducator;
  }

  function aggregate(profiles = [], getEvidence = () => []) {
    const subjectCounts = {};
    let evidenceCount = 0;
    profiles.forEach(profile => {
      const evidence = Array.isArray(getEvidence(profile.id)) ? getEvidence(profile.id) : [];
      evidenceCount += evidence.length;
      evidence.forEach(item => {
        const subject = clean(item.subject || 'Learning', 40) || 'Learning';
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      });
    });
    return {
      profileCount: profiles.length,
      evidenceCount,
      subjectCounts
    };
  }

  function buildView(config, profiles = [], getEvidence = () => [], activeProfile = null) {
    const role = getRole(config?.role);
    const base = {
      role,
      organisation: clean(config?.organisation || '', 80),
      settingType: config?.settingType || 'home',
      profiles: [],
      aggregate: null,
      message: role.description
    };

    if (config?.role === 'healthVisitor') {
      base.message = role.description;
      return base;
    }

    if (role.canSeeSchoolAggregate) {
      base.aggregate = aggregate(profiles, getEvidence);
      return base;
    }

    if (config?.role === 'teacher') {
      if (activeProfile) {
        base.profiles = [{
          id: activeProfile.id,
          nickname: activeProfile.nickname,
          ageBand: activeProfile.ageBand,
          curriculum: activeProfile.curriculum,
          evidenceCount: getEvidence(activeProfile.id).length
        }];
      }
      return base;
    }

    base.profiles = profiles.map(profile => ({
      id: profile.id,
      nickname: profile.nickname,
      ageBand: profile.ageBand,
      curriculum: profile.curriculum,
      evidenceCount: getEvidence(profile.id).length
    }));
    return base;
  }

  function clear() {
    localStorage.removeItem(KEY);
  }

  window.OrishSchoolSupport = { roles, getConfig, saveConfig, getRole, aggregate, buildView, clear };
})();

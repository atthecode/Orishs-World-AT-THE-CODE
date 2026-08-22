(() => {
  'use strict';

  const KEYS = {
    gate: 'orish.parentGate.v1',
    profiles: 'orish.profiles.v1',
    activeProfile: 'orish.activeProfile.v1',
    evidence: 'orish.evidence.v1',
    parentRequests: 'orish.parentRequests.v1',
    missions: 'orish.v1.childMissions',
    routines: 'orish.v1.routines',
    kitchen: 'orish.v1.kitchen',
    rewards: 'orish.v1.rewards',
    accessibility: 'orish.v1.accessibility',
    parentControls: 'orish.v1.parentControls',
    avatar: 'orish.v1.avatarLab'
  };

  const enc = new TextEncoder();
  const PARENT_SESSION_MS = 15 * 60 * 1000;
  const PARENT_UNLOCK_KEY = 'orish.parentUnlocked';
  const PARENT_UNLOCKED_AT_KEY = 'orish.parentUnlockedAt';

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }

  function getJSON(key, fallback) {
    return safeParse(localStorage.getItem(key), fallback);
  }

  function setJSON(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function randomSalt() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  function hexBytes(hex) {
    const out = new Uint8Array(Math.floor(hex.length / 2));
    for (let i = 0; i < out.length; i += 1) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    return out;
  }

  async function legacyDigest(value) {
    if (!window.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable. Use HTTPS or localhost.');
    const hash = await crypto.subtle.digest('SHA-256', enc.encode(value));
    return Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
  }

  async function derivePin(pin, saltHex, iterations = 210000) {
    if (!window.crypto?.subtle) throw new Error('Secure browser cryptography is unavailable. Use HTTPS or localhost.');
    const key = await crypto.subtle.importKey('raw', enc.encode(pin), 'PBKDF2', false, ['deriveBits']);
    const bits = await crypto.subtle.deriveBits({ name:'PBKDF2', hash:'SHA-256', salt:hexBytes(saltHex), iterations }, key, 256);
    return Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2, '0')).join('');
  }

  function constantTimeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
  }

  async function setParentPin(pin) {
    if (!/^\d{6,8}$/.test(pin)) throw new Error('Use a 6–8 digit adult PIN.');
    const salt = randomSalt();
    const iterations = 210000;
    const hash = await derivePin(pin, salt, iterations);
    setJSON(KEYS.gate, { version: 2, algorithm:'PBKDF2-HMAC-SHA256', iterations, salt, hash, createdAt: new Date().toISOString() });
    sessionStorage.setItem(PARENT_UNLOCK_KEY, '1');
    sessionStorage.setItem(PARENT_UNLOCKED_AT_KEY, String(Date.now()));
  }

  async function verifyParentPin(pin) {
    const record = getJSON(KEYS.gate, null);
    if (!record) return false;
    let hash;
    if (record.version === 2) hash = await derivePin(pin, record.salt, record.iterations || 210000);
    else hash = await legacyDigest(`${record.salt}:${pin}`);
    const ok = constantTimeEqual(hash, record.hash);
    if (ok) {
      sessionStorage.setItem(PARENT_UNLOCK_KEY, '1');
      sessionStorage.setItem(PARENT_UNLOCKED_AT_KEY, String(Date.now()));
    }
    return ok;
  }

  function hasParentPin() { return Boolean(getJSON(KEYS.gate, null)); }
  function isParentUnlocked() {
    if (sessionStorage.getItem(PARENT_UNLOCK_KEY) !== '1') return false;
    const unlockedAt = Number(sessionStorage.getItem(PARENT_UNLOCKED_AT_KEY) || 0);
    if (!unlockedAt || Date.now() - unlockedAt > PARENT_SESSION_MS) { lockParent(); return false; }
    return true;
  }
  function touchParentSession() { if (isParentUnlocked()) sessionStorage.setItem(PARENT_UNLOCKED_AT_KEY, String(Date.now())); }
  function lockParent() { sessionStorage.removeItem(PARENT_UNLOCK_KEY); sessionStorage.removeItem(PARENT_UNLOCKED_AT_KEY); }

  function cleanText(value, max = 80) {
    return String(value || '').replace(/[<>\u0000-\u001f]/g, '').trim().slice(0, max);
  }

  function getProfiles() { return getJSON(KEYS.profiles, []); }
  function getActiveProfileId() { return localStorage.getItem(KEYS.activeProfile) || ''; }
  function getActiveProfile() {
    const id = getActiveProfileId();
    return getProfiles().find(profile => profile.id === id) || null;
  }

  function saveProfile(input) {
    const profiles = getProfiles();
    const now = new Date().toISOString();
    const profile = {
      id: input.id || (crypto.randomUUID ? crypto.randomUUID() : `p-${Date.now()}`),
      nickname: cleanText(input.nickname || 'Explorer', 30) || 'Explorer',
      ageBand: input.ageBand || '7-9',
      curriculum: input.curriculum || 'england',
      interests: Array.isArray(input.interests) ? input.interests.slice(0, 8).map(x => cleanText(x, 30)).filter(Boolean) : [],
      currentFocus: cleanText(input.currentFocus || 'Learning curiosity', 60),
      readAloud: input.readAloud !== false,
      offlineActivities: input.offlineActivities !== false,
      evidenceEnabled: input.evidenceEnabled !== false,
      createdAt: input.createdAt || now,
      updatedAt: now
    };
    const index = profiles.findIndex(item => item.id === profile.id);
    if (index >= 0) profiles[index] = profile; else profiles.push(profile);
    setJSON(KEYS.profiles, profiles.slice(0, 12));
    localStorage.setItem(KEYS.activeProfile, profile.id);
    return profile;
  }

  function setActiveProfile(id) {
    const exists = getProfiles().some(profile => profile.id === id);
    if (exists) localStorage.setItem(KEYS.activeProfile, id);
    return getActiveProfile();
  }

  function deleteProfile(id) {
    if (!id) return;
    const profiles = getProfiles().filter(profile => profile.id !== id);
    setJSON(KEYS.profiles, profiles);
    setJSON(KEYS.evidence, getJSON(KEYS.evidence, []).filter(item => item.profileId !== id));
    setJSON(KEYS.parentRequests, getJSON(KEYS.parentRequests, []).filter(item => item.profileId !== id));
    setJSON(KEYS.missions, getJSON(KEYS.missions, []).filter(item => item.profileId !== id));
    [KEYS.routines, KEYS.kitchen, KEYS.rewards, KEYS.accessibility, KEYS.parentControls, KEYS.avatar].forEach(key => {
      const data = getJSON(key, {});
      if (data && typeof data === 'object' && !Array.isArray(data)) { delete data[id]; setJSON(key, data); }
    });
    if (getActiveProfileId() === id) {
      if (profiles[0]) localStorage.setItem(KEYS.activeProfile, profiles[0].id);
      else localStorage.removeItem(KEYS.activeProfile);
    }
  }

  function addEvidence(entry) {
    const active = getActiveProfile();
    if (!active || !active.evidenceEnabled) return null;
    const items = getJSON(KEYS.evidence, []);
    const record = {
      id: crypto.randomUUID ? crypto.randomUUID() : `e-${Date.now()}`,
      profileId: active.id,
      createdAt: new Date().toISOString(),
      subject: cleanText(entry.subject, 40),
      title: cleanText(entry.title, 80),
      detail: cleanText(entry.detail, 240),
      framework: cleanText(entry.framework, 80),
      objective: cleanText(entry.objective, 180),
      score: Number.isFinite(entry.score) ? entry.score : null,
      total: Number.isFinite(entry.total) ? entry.total : null,
      independence: cleanText(entry.independence || 'Independent play', 50)
    };
    items.unshift(record);
    setJSON(KEYS.evidence, items.slice(0, 250));
    return record;
  }

  function getEvidence(profileId = getActiveProfileId()) {
    return getJSON(KEYS.evidence, []).filter(item => item.profileId === profileId);
  }

  function saveParentRequest(text, format) {
    const active = getActiveProfile();
    if (!active) return;
    const items = getJSON(KEYS.parentRequests, []);
    items.unshift({
      id: crypto.randomUUID ? crypto.randomUUID() : `r-${Date.now()}`,
      profileId: active.id,
      text: cleanText(text, 300),
      format: cleanText(format, 50),
      createdAt: new Date().toISOString()
    });
    setJSON(KEYS.parentRequests, items.slice(0, 30));
  }

  function exportActiveProfileData() {
    const profile = getActiveProfile();
    if (!profile) return null;
    return {
      exportedAt: new Date().toISOString(),
      profile,
      evidence: getEvidence(profile.id)
    };
  }


  function updateProfilePreferences(id, patch = {}) {
    const profiles = getProfiles();
    const index = profiles.findIndex(profile => profile.id === id);
    if (index < 0) return null;
    const current = profiles[index];
    profiles[index] = {
      ...current,
      readAloud: patch.readAloud === undefined ? current.readAloud : patch.readAloud !== false,
      offlineActivities: patch.offlineActivities === undefined ? current.offlineActivities : patch.offlineActivities !== false,
      evidenceEnabled: patch.evidenceEnabled === undefined ? current.evidenceEnabled : patch.evidenceEnabled !== false,
      updatedAt: new Date().toISOString()
    };
    setJSON(KEYS.profiles, profiles.slice(0, 12));
    return profiles[index];
  }

  function privacySnapshot(profileId = getActiveProfileId()) {
    const profiles = getProfiles();
    const evidence = getJSON(KEYS.evidence, []);
    const parentRequests = getJSON(KEYS.parentRequests, []);
    const missions = getJSON(KEYS.missions, []);
    const relevant = id => !profileId || id === profileId;
    return {
      profiles: profiles.length,
      activeProfileEvidence: evidence.filter(item => relevant(item.profileId)).length,
      activeProfileParentRequests: parentRequests.filter(item => relevant(item.profileId)).length,
      activeProfileMissions: missions.filter(item => relevant(item.profileId)).length,
      storesPresent: Object.values(KEYS).filter(key => localStorage.getItem(key) !== null).length,
      transcriptStore: false,
      rawVoiceStore: false,
      locationStore: false,
      cameraStore: false
    };
  }

  function clearProfileLearningData(profileId) {
    if (!profileId) return false;
    setJSON(KEYS.evidence, getJSON(KEYS.evidence, []).filter(item => item.profileId !== profileId));
    setJSON(KEYS.parentRequests, getJSON(KEYS.parentRequests, []).filter(item => item.profileId !== profileId));
    setJSON(KEYS.missions, getJSON(KEYS.missions, []).filter(item => item.profileId !== profileId));
    [KEYS.rewards].forEach(key => {
      const data = getJSON(key, {});
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        delete data[profileId];
        setJSON(key, data);
      }
    });
    return true;
  }

  function clearAllLocalData() {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    lockParent();
  }

  window.OrishSecurityStore = {
    KEYS, cleanText, setParentPin, verifyParentPin, hasParentPin, isParentUnlocked, lockParent,
    getProfiles, getActiveProfileId, getActiveProfile, saveProfile, setActiveProfile, deleteProfile, updateProfilePreferences,
    addEvidence, getEvidence, saveParentRequest, exportActiveProfileData, privacySnapshot, clearProfileLearningData, clearAllLocalData, touchParentSession
  };
})();

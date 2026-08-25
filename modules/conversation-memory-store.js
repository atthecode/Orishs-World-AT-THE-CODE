(() => {
  'use strict';
  const KEY = 'orish.beta.conversationSummary.v1';
  const SAFE_TOPICS = ['maths','literacy','science','space','history','art','cooking','routines','confidence','game-help','general-learning'];
  function readAll() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
  function writeAll(value) { localStorage.setItem(KEY, JSON.stringify(value)); }
  function clean(value, max) { return String(value || '').replace(/[<>\u0000-\u001f]/g,'').trim().slice(0,max); }
  function get(profileId, retentionDays = 7) {
    const item = readAll()[profileId]; if (!item) return null;
    if (Date.now() - Number(item.savedAt || 0) > Number(retentionDays || 7) * 86400000) { clear(profileId); return null; }
    return { topic:item.topic, summary:item.summary, nextStep:item.nextStep, savedAt:item.savedAt };
  }
  function save(profileId, input, controls = {}) {
    if (!profileId || controls.conversationMemory !== 'last-summary') return null;
    const topic = SAFE_TOPICS.includes(input?.topic) ? input.topic : 'general-learning';
    const summary = clean(input?.summary, 240), nextStep = clean(input?.nextStep, 120);
    if (!summary) return null;
    const all = readAll(); all[profileId] = { topic, summary, nextStep, savedAt:Date.now() }; writeAll(all); return all[profileId];
  }
  function clear(profileId) { const all=readAll(); delete all[profileId]; writeAll(all); }
  function clearAll() { localStorage.removeItem(KEY); }
  window.OrishConversationMemory = { KEY, SAFE_TOPICS, get, save, clear, clearAll };
})();

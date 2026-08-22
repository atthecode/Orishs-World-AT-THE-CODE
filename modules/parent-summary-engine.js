(() => {
  'use strict';

  function parseDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  function withinDays(item, days, now = new Date()) {
    if (!days || days === 'all') return true;
    const date = parseDate(item.createdAt);
    if (!date) return false;
    return now.getTime() - date.getTime() <= Number(days) * 86400000;
  }

  function topCounts(items, key, limit = 4) {
    const counts = new Map();
    items.forEach(item => {
      const value = String(item[key] || 'Other').trim() || 'Other';
      counts.set(value, (counts.get(value) || 0) + 1);
    });
    return Array.from(counts.entries()).sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0])).slice(0, limit).map(([label,count]) => ({label,count}));
  }

  function summarize({profile, evidence = [], rewards = null, days = 7, now = new Date()}) {
    const selected = evidence.filter(item => withinDays(item, days, now));
    const scored = selected.filter(item => Number.isFinite(item.score) && Number.isFinite(item.total) && item.total > 0);
    const scoreTotal = scored.reduce((sum,item) => sum + item.score, 0);
    const questionTotal = scored.reduce((sum,item) => sum + item.total, 0);
    const subjects = topCounts(selected, 'subject');
    const frameworks = topCounts(selected, 'framework', 3);
    const modes = topCounts(selected, 'independence', 4);
    const recent = selected.slice().sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt))).slice(0, 6);
    const objectiveSet = [];
    const seen = new Set();
    selected.forEach(item => {
      const objective = String(item.objective || '').trim();
      if (objective && !seen.has(objective)) { seen.add(objective); objectiveSet.push(objective); }
    });

    return {
      profileName: profile?.nickname || 'Explorer',
      period: days === 'all' ? 'All local records' : `Last ${days} days`,
      activityCount: selected.length,
      scoredCount: scored.length,
      scorePercent: questionTotal ? Math.round(scoreTotal / questionTotal * 100) : null,
      subjects,
      frameworks,
      modes,
      recent,
      objectives: objectiveSet.slice(0, 5),
      explorerStars: rewards?.stars || 0,
      explorerActivities: rewards?.activities || 0,
      privacyNote:'Built only from compact Learning Passport records and local reward totals. It does not read private Parent Studio wording, Orish chat text, family discussions, artwork, photos, voice or location. This is an informational learning overview, not a diagnosis, behaviour grade or formal assessment.'
    };
  }

  window.OrishParentSummary = { summarize };
})();

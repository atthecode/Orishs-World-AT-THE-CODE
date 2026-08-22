(() => {
  'use strict';

  const KEY = 'orish.v1.avatarLab';
  const NATURAL_SKINS = [
    '#3a241c','#513126','#684034','#805141','#986451','#b77760','#ce9178','#dfa88f','#edc2a8','#f4d7c3'
  ];
  const FANTASY_SKINS = ['#17d7e8','#4f7cff','#ff63b7','#ff8d3b','#9a6cff','#57e6b1'];
  const HAIR_COLORS = ['#17120f','#2e2119','#513324','#7b4a2f','#a9693d','#d8aa62','#f0e8df','#3e71ff','#b45cff','#17d7e8'];
  const ACCENTS = ['#17d7e8','#f4c95d','#ff63b7','#9a6cff','#57e6b1','#ff8d3b'];
  const HAIR = ['afro','braids','locs','curls','waves','straight'];
  const OUTFITS = ['explorer','scientist','space','chef','artist'];
  const MODES = ['real','creative'];

  const defaults = {
    mode: 'real',
    skin: '#805141',
    hair: 'afro',
    hairColor: '#17120f',
    outfit: 'explorer',
    accent: '#17d7e8',
    angle: -8,
    autoSpin: false,
    updatedAt: null
  };

  function safeParse(value, fallback) {
    try { return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }
  function all() { return safeParse(localStorage.getItem(KEY), {}); }
  function normalize(input = {}) {
    const mode = MODES.includes(input.mode) ? input.mode : defaults.mode;
    const allowedSkins = mode === 'creative' ? [...NATURAL_SKINS, ...FANTASY_SKINS] : NATURAL_SKINS;
    return {
      ...defaults,
      ...input,
      mode,
      skin: allowedSkins.includes(input.skin) ? input.skin : (mode === 'creative' ? '#17d7e8' : defaults.skin),
      hair: HAIR.includes(input.hair) ? input.hair : defaults.hair,
      hairColor: HAIR_COLORS.includes(input.hairColor) ? input.hairColor : defaults.hairColor,
      outfit: OUTFITS.includes(input.outfit) ? input.outfit : defaults.outfit,
      accent: ACCENTS.includes(input.accent) ? input.accent : defaults.accent,
      angle: Number.isFinite(Number(input.angle)) ? Number(input.angle) : defaults.angle,
      autoSpin: input.autoSpin === true
    };
  }
  function get(profileId = 'demo') {
    return normalize(all()[profileId] || defaults);
  }
  function save(profileId = 'demo', input = {}) {
    const data = all();
    const record = normalize({...input, updatedAt: new Date().toISOString()});
    data[profileId] = record;
    localStorage.setItem(KEY, JSON.stringify(data));
    return record;
  }
  function remove(profileId = 'demo') {
    const data = all();
    delete data[profileId];
    localStorage.setItem(KEY, JSON.stringify(data));
  }
  function randomItem(items) { return items[Math.floor(Math.random() * items.length)]; }
  function surprise(mode = 'creative') {
    const skins = mode === 'creative' ? [...NATURAL_SKINS, ...FANTASY_SKINS] : NATURAL_SKINS;
    return normalize({
      mode,
      skin: randomItem(skins),
      hair: randomItem(HAIR),
      hairColor: randomItem(HAIR_COLORS),
      outfit: randomItem(OUTFITS),
      accent: randomItem(ACCENTS),
      angle: Math.round(Math.random() * 50) - 25
    });
  }

  window.OrishAvatarLab = {
    KEY, NATURAL_SKINS, FANTASY_SKINS, HAIR_COLORS, ACCENTS, HAIR, OUTFITS,
    defaults, get, save, remove, surprise, normalize
  };
})();

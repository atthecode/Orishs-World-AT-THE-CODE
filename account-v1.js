(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const state = { principal:null, selectedId:'', editing:false };
  const AGE_LABELS = {'0-2':'Birth–3 · Parent & Me','4-6':'Ages 4–6 · Early Explorers','7-9':'Ages 7–10 · Explorers','10-12':'Ages 11–13 · Investigators','13-16':'Ages 14–16 · Advanced Missions'};
  const PLAY_PRESETS = {'morning':['07:00','09:00'],'after-school':['15:30','18:00'],'evening':['18:00','19:00'],'bedtime':['19:00','20:00']};
  const DEFAULT_ROUTINE_TASKS = ['wash','teeth','dress','breakfast','bag'];

  function setStep(step) {
    ['stepAccount','stepProfile','stepWorld'].forEach((id,index) => $(id)?.classList.toggle('active', index < step));
  }

  async function getPrincipal() {
    if (location.protocol === 'file:') return null;
    try {
      const response = await fetch('/.auth/me', {credentials:'same-origin', cache:'no-store', headers:{Accept:'application/json'}});
      if (!response.ok) return null;
      const data = await response.json();
      return data?.clientPrincipal || null;
    } catch { return null; }
  }

  function friendlyParentName(principal) {
    const raw = principal?.userDetails || '';
    if (!raw) return 'Verified grown-up';
    if (raw.includes('@')) return `Verified grown-up · ${raw.replace(/^(.{1,2}).*(@.*)$/,'$1•••$2')}`;
    return raw.slice(0, 45);
  }

  function showSignedOut() {
    $('loadingState').hidden = true;
    $('signedOutState').hidden = false;
    $('signedInState').hidden = true;
    setStep(1);
    if (location.hostname === 'localhost' || location.protocol === 'file:') $('authUnavailable').hidden = false;
  }

  function selectedProfile() {
    return window.OrishSecurityStore?.getProfiles().find(profile => profile.id === state.selectedId) || null;
  }

  function renderProfiles() {
    const store = window.OrishSecurityStore;
    const profiles = store?.getProfiles() || [];
    const list = $('profileList');
    list.innerHTML = '';
    $('emptyProfiles').hidden = profiles.length > 0;
    if (!state.selectedId && store?.getActiveProfileId()) state.selectedId = store.getActiveProfileId();
    profiles.forEach(profile => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `profile-card${profile.id === state.selectedId ? ' selected' : ''}`;
      button.setAttribute('aria-pressed', String(profile.id === state.selectedId));
      const support = [profile.readAloud && '🔉 Spoken guide', profile.offlineActivities && '🌍 Real-world missions'].filter(Boolean);
      button.innerHTML = `<span class="profile-head"><span class="profile-initial">${escapeHTML(profile.nickname.charAt(0).toUpperCase())}</span><span><strong>${escapeHTML(profile.nickname)}</strong><small>${escapeHTML(AGE_LABELS[profile.ageBand] || profile.ageBand)}</small></span></span><span class="profile-features">${support.map(item=>`<span>${item}</span>`).join('')}</span>`;
      button.addEventListener('click', () => selectProfile(profile.id));
      list.appendChild(button);
    });
    updateReadyPanel();
  }

  function escapeHTML(value) {
    const node = document.createElement('span');
    node.textContent = String(value || '');
    return node.innerHTML;
  }

  function selectProfile(id) {
    window.OrishSecurityStore?.setActiveProfile(id);
    state.selectedId = id;
    renderProfiles();
    setStep(3);
  }

  function updateReadyPanel() {
    const profile = selectedProfile();
    $('readyPanel').hidden = !profile;
    $('deleteProfile').disabled = !profile;
    if (!profile) return;
    $('readyAvatar').textContent = profile.nickname.charAt(0).toUpperCase();
    $('readyName').textContent = profile.nickname;
    const controls = window.OrishParentControls?.get(profile.id, profile.ageBand);
    const schedule = controls?.playSchedule;
    $('readyDescription').textContent = `${AGE_LABELS[profile.ageBand] || profile.ageBand} · ${profile.readAloud ? 'spoken guide available' : 'spoken guide off'}${schedule ? ` · ${schedule.start}–${schedule.end} · ${schedule.dailyMinutes} min/day` : ''}`;
    const enter = document.querySelector('.enter-button');
    enter.href = controls?.routineGateEnabled ? 'family-check-in.html' : 'world-map.html';
    enter.innerHTML = controls?.routineGateEnabled ? 'CONTINUE TO FAMILY CHECK-IN <span>→</span>' : "ENTER ORISH'S WORLD <span>→</span>";
  }

  function openProfileForm(editing = false) {
    state.editing = editing === true;
    $('profileForm').hidden = false;
    $('profileFormTitle').textContent = state.editing ? 'Edit profile and play schedule' : 'Create child profile';
    if (state.editing) {
      const profile = selectedProfile();
      if (!profile) return;
      const controls = window.OrishParentControls?.get(profile.id, profile.ageBand);
      $('profileName').value = profile.nickname;
      $('profileAge').value = profile.ageBand;
      $('spokenGuide').checked = profile.readAloud !== false;
      $('offlineGuide').checked = profile.offlineActivities !== false;
      $('readingGuide').checked = controls?.spokenSupport !== false;
      const preset = controls?.playSchedule?.preset || 'custom';
      $('playSchedule').value = PLAY_PRESETS[preset] ? preset : 'custom';
      $('playStart').value = controls?.playSchedule?.start || '07:00';
      $('playEnd').value = controls?.playSchedule?.end || '09:00';
      $('dailyPlayMinutes').value = String(controls?.playSchedule?.dailyMinutes || 30);
      $('caregiverTitle').value = controls?.caregiverTitle || 'parent';
      $('greetingStyle').value = controls?.greetingStyle || 'hello';
      $('routineGate').checked = controls?.routineGateEnabled === true;
      document.querySelectorAll('[name="routineTask"]').forEach(input => { input.checked = (controls?.routineTasks || DEFAULT_ROUTINE_TASKS).includes(input.value); });
      $('familySupportFocus').value = controls?.familySupportFocus || '';
    }
    $('profileName').focus();
  }

  function closeProfileForm() {
    $('profileForm').hidden = true;
    $('profileForm').reset();
    $('spokenGuide').checked = true;
    $('readingGuide').checked = true;
    $('offlineGuide').checked = true;
    $('playSchedule').value = 'morning';
    $('playStart').value = '07:00';
    $('playEnd').value = '09:00';
    $('dailyPlayMinutes').value = '30';
    $('caregiverTitle').value = 'parent';
    $('greetingStyle').value = 'hello';
    $('routineGate').checked = false;
    document.querySelectorAll('[name="routineTask"]').forEach(input => { input.checked = DEFAULT_ROUTINE_TASKS.includes(input.value); });
    $('familySupportFocus').value = '';
    state.editing = false;
  }

  function saveProfile(event) {
    event.preventDefault();
    const store = window.OrishSecurityStore;
    if (!store) return;
    const existing = state.editing ? selectedProfile() : null;
    const profile = store.saveProfile({
      id:existing?.id,
      createdAt:existing?.createdAt,
      nickname:$('profileName').value,
      ageBand:$('profileAge').value,
      readAloud:$('spokenGuide').checked,
      offlineActivities:$('offlineGuide').checked,
      evidenceEnabled:true,
      currentFocus:'Learning curiosity'
    });
    const controls = window.OrishParentControls;
    controls?.save(profile.id, profile.ageBand, {
      spokenSupport:$('spokenGuide').checked,
      phonicsGuide:$('readingGuide').checked,
      offlineActivities:$('offlineGuide').checked,
      learningEvidence:true,
      playSchedule:{preset:$('playSchedule').value,start:$('playStart').value,end:$('playEnd').value,dailyMinutes:Number($('dailyPlayMinutes').value),bedtimeMode:$('playSchedule').value === 'bedtime'},
      conversationalDailyMinutes:10,
      conversationalDailyTurns:20,
      caregiverTitle:$('caregiverTitle').value,
      greetingStyle:$('greetingStyle').value,
      routineGateEnabled:$('routineGate').checked,
      routineTasks:[...document.querySelectorAll('[name="routineTask"]:checked')].map(input => input.value),
      familySupportFocus:$('familySupportFocus').value
    });
    state.selectedId = profile.id;
    closeProfileForm();
    renderProfiles();
    setStep(3);
    $('privacyMessage').textContent = `${profile.nickname}'s approved profile is ready on this device.`;
  }

  function exportData() {
    const store = window.OrishSecurityStore;
    const profiles = store?.getProfiles() || [];
    const payload = {exportedAt:new Date().toISOString(), source:'Orish’s World beta device data', profiles, activeProfileId:store?.getActiveProfileId() || ''};
    const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orish-world-device-data.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    $('privacyMessage').textContent = 'A copy of this device’s Orish profile data was prepared.';
  }

  function deleteSelectedProfile() {
    const profile = selectedProfile();
    if (!profile) return;
    const confirmed = confirm(`Delete ${profile.nickname}'s profile and locally saved learning data from this device? This cannot be undone.`);
    if (!confirmed) return;
    window.OrishSecurityStore?.deleteProfile(profile.id);
    window.OrishParentControls?.remove(profile.id);
    state.selectedId = '';
    renderProfiles();
    setStep(2);
    $('privacyMessage').textContent = 'The selected profile and its saved data were removed from this device.';
  }

  async function init() {
    $('newProfileButton').addEventListener('click', () => openProfileForm(false));
    $('editScheduleButton').addEventListener('click', () => openProfileForm(true));
    $('closeProfileForm').addEventListener('click', closeProfileForm);
    $('profileForm').addEventListener('submit', saveProfile);
    $('exportData').addEventListener('click', exportData);
    $('deleteProfile').addEventListener('click', deleteSelectedProfile);
    $('playSchedule').addEventListener('change', () => {
      const preset = PLAY_PRESETS[$('playSchedule').value];
      if (!preset) return;
      $('playStart').value = preset[0];
      $('playEnd').value = preset[1];
    });
    state.principal = await getPrincipal();
    if (!state.principal) { showSignedOut(); return; }
    $('loadingState').hidden = true;
    $('signedOutState').hidden = true;
    $('signedInState').hidden = false;
    $('parentDisplay').textContent = friendlyParentName(state.principal);
    setStep(2);
    renderProfiles();
    if (selectedProfile()) setStep(3);
  }

  document.addEventListener('DOMContentLoaded', init);
})();

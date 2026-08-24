(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const state = { principal:null, selectedId:'' };
  const AGE_LABELS = {'0-2':'Birth–3 · Parent & Me','4-6':'Ages 4–6 · Early Explorers','7-9':'Ages 7–10 · Explorers','10-12':'Ages 11–13 · Investigators','13-16':'Ages 14–16 · Advanced Missions'};

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
    $('readyDescription').textContent = `${AGE_LABELS[profile.ageBand] || profile.ageBand} · ${profile.readAloud ? 'spoken guide available' : 'spoken guide off'}`;
  }

  function openProfileForm() {
    $('profileForm').hidden = false;
    $('profileName').focus();
  }

  function closeProfileForm() {
    $('profileForm').hidden = true;
    $('profileForm').reset();
    $('spokenGuide').checked = true;
    $('readingGuide').checked = true;
    $('offlineGuide').checked = true;
  }

  function saveProfile(event) {
    event.preventDefault();
    const store = window.OrishSecurityStore;
    if (!store) return;
    const profile = store.saveProfile({
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
      learningEvidence:true
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
    const report = [
      "ORISH'S WORLD @ THE CODE — PARENT DATA EXPORT",
      'Private copy prepared for the parent or guardian.',
      'This plain-text file contains the Orish profiles and learning settings saved on this device.',
      '',
      JSON.stringify(payload, null, 2)
    ].join('\n');
    const blob = new Blob(['\uFEFF', report], {type:'text/plain;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orish-world-parent-data-export.txt';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    $('privacyMessage').textContent = 'A private Orish’s World text copy was prepared. Save it to Files; do not open it in another shopping or social app.';
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
    $('newProfileButton').addEventListener('click', openProfileForm);
    $('closeProfileForm').addEventListener('click', closeProfileForm);
    $('profileForm').addEventListener('submit', saveProfile);
    $('exportData').addEventListener('click', exportData);
    $('deleteProfile').addEventListener('click', deleteSelectedProfile);
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

(() => {
  'use strict';
  const Store = window.OrishSecurityStore;
  const Controls = window.OrishParentControls;
  const profile = Store?.getActiveProfile?.();
  if (!profile || !Controls) { location.replace('account.html'); return; }
  const controls = Controls.get(profile.id, profile.ageBand);
  const labels = {
    wash:'Wash and freshen up', teeth:'Brush teeth', dress:'Get dressed',
    breakfast:'Breakfast or morning plan checked', bag:'School bag or belongings ready',
    listen:'Family instructions checked together', tidy:'Put belongings away', calm:'Calm bedtime activity ready'
  };
  const greetings = {
    hello:`Hello, ${profile.nickname}. How are you today?`,
    'good-morning':`Good morning, ${profile.nickname}. Are you ready for today?`,
    'grand-rising':`Grand rising, ${profile.nickname}. How is your sunrise?`,
    'rich-risings':`Rich risings, ${profile.nickname}. What are you ready to grow today?`,
    'grand-evening':`Grand evening, ${profile.nickname}. How has your day been?`,
    'grand-night':`Grand night, ${profile.nickname}. Shall we wind down together?`
  };
  document.getElementById('checkGreeting').textContent = greetings[controls.greetingStyle] || greetings.hello;
  document.getElementById('checkIntro').textContent = `Your ${controls.caregiverTitle} chose a few things to check together before play.`;
  const list = document.getElementById('routineList');
  const tasks = controls.routineTasks?.length ? controls.routineTasks : ['wash','teeth','dress','breakfast','bag'];
  tasks.forEach(id => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${id}"><span>${labels[id] || id}</span>`;
    list.appendChild(label);
  });
  function confirm(skipped = false) {
    if (!skipped && [...list.querySelectorAll('input')].some(input => !input.checked)) {
      document.getElementById('routineMessage').textContent = 'Check each selected item, or use Pause routine for today.';
      return;
    }
    const key = 'orish.beta.routineConfirm.v1';
    const date = new Date().toLocaleDateString('en-CA');
    let all = {};
    try { all = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}
    all[date] ||= {};
    all[date][profile.id] = true;
    localStorage.setItem(key, JSON.stringify(all));
    document.getElementById('routineMessage').textContent = skipped ? 'Routine paused by the grown-up for today.' : 'Today’s family check-in is complete.';
    setTimeout(() => { location.href = 'world-map.html'; }, 500);
  }
  document.getElementById('confirmRoutine').addEventListener('click', () => confirm(false));
  document.getElementById('skipRoutine').addEventListener('click', () => confirm(true));
})();

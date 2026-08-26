(() => {
  'use strict';
  const KEY = 'orish.level1.signal.v1';
  const defaults = { spaceComplete:false, cinemaSeen:false, echoComplete:false, stars:0, updated:0 };
  const read = () => { try { return {...defaults,...JSON.parse(localStorage.getItem(KEY)||'{}')}; } catch (_) { return {...defaults}; } };
  const write = state => { try { localStorage.setItem(KEY, JSON.stringify({...state,updated:Date.now()})); } catch (_) {} };
  const state = read();
  const spaceStatus = document.getElementById('spaceStatus');
  const echoStatus = document.getElementById('echoStatus');
  const echoCard = document.getElementById('echoCard');
  const echoLink = document.getElementById('echoLink');
  const progress = document.getElementById('levelProgress');
  const bar = document.getElementById('levelProgressBar');
  const reward = document.getElementById('levelReward');
  const message = document.getElementById('orishLevelMessage');

  function render() {
    const score = state.echoComplete ? 100 : state.spaceComplete ? 50 : 0;
    progress.textContent = `${score}%`;
    bar.style.width = `${score}%`;
    spaceStatus.textContent = state.spaceComplete ? `Completed · ${state.stars || 0} stars saved` : 'Not completed';
    if (state.spaceComplete) {
      echoCard.classList.remove('locked');
      echoLink.removeAttribute('aria-disabled');
      echoLink.textContent = state.echoComplete ? 'REPLAY MISSION 2' : 'PLAY MISSION 2';
      echoStatus.textContent = state.echoComplete ? 'Completed' : 'Unlocked by Space Signal';
      message.textContent = state.echoComplete
        ? 'Level complete. We found better evidence — and kept the mystery honest.'
        : 'The signal has a destination. Next stop: Echo Planet.';
    } else {
      echoCard.classList.add('locked');
      echoLink.setAttribute('aria-disabled','true');
      echoLink.textContent = 'COMPLETE MISSION 1';
      echoStatus.textContent = 'Locked by story';
      message.textContent = 'First stop: the observatory. Something out there just changed direction.';
    }
    reward.hidden = !state.echoComplete;
  }

  echoLink.addEventListener('click', event => {
    if (!state.spaceComplete) event.preventDefault();
  });

  document.getElementById('resetLevel').addEventListener('click', () => {
    if (!confirm('Reset Level 1 test progress on this device?')) return;
    write({...defaults});
    location.reload();
  });

  render();
})();
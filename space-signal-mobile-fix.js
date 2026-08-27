(() => {
  'use strict';

  const lastTouch = new WeakMap();
  const TAP_SELECTOR = [
    '#startMission', '#replayMission', '#playOrishWelcome', '#hearMissionVoice',
    '#openSignalGuide', '#closeSignalGuide', '#pauseButton', '#resumeButton',
    '#soundToggle', '.comms-speak', '#miniSpeak', '#miniClose',
    '[data-character]', '[data-movement-mode]', '[data-answer]', '[data-speak]',
    '#adventureEvent button', '#miniModal button', '#signalGuide button'
  ].join(',');

  function closestTapTarget(node) {
    if (!(node instanceof Element)) return null;
    return node.closest(TAP_SELECTOR);
  }

  function isUsable(button) {
    return button && !button.disabled && button.getAttribute('aria-disabled') !== 'true';
  }

  // iOS/WebKit occasionally loses the synthetic click after a touch when a page
  // contains canvas controls, range inputs and dynamically mounted dialogs.
  // Generate one explicit click for ordinary UI buttons only. D-pad controls are
  // intentionally excluded because they already use press-and-hold touch events.
  document.addEventListener('touchend', event => {
    const button = closestTapTarget(event.target);
    if (!isUsable(button) || button.closest('.dpad')) return;

    const now = performance.now();
    const previous = lastTouch.get(button) || 0;
    if (now - previous < 350) return;
    lastTouch.set(button, now);

    event.preventDefault();
    button.click();
  }, { passive: false, capture: true });

  document.addEventListener('click', event => {
    const button = closestTapTarget(event.target);
    if (!button) return;
    button.dataset.tapConfirmed = '1';
  }, true);

  function markReady() {
    document.documentElement.classList.add('space-controls-ready');
    const start = document.getElementById('startMission');
    if (start) start.dataset.mobileTapReady = '1';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markReady, { once: true });
  } else {
    markReady();
  }
})();

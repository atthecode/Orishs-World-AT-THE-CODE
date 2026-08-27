(() => {
  'use strict';

  // Level 1 mobile control bridge.
  // The original mission scripts listen for both Pointer Events and Touch Events.
  // On touch browsers that support both, one finger can reach both handlers and
  // leave movement state inconsistent. This capture-phase bridge makes each
  // physical press produce exactly one keyboard-style movement signal.

  const keyFor = {
    up: 'ArrowUp',
    down: 'ArrowDown',
    left: 'ArrowLeft',
    right: 'ArrowRight'
  };

  const activePointers = new Map();
  const activeTouches = new Map();
  const heldCounts = new Map();
  const supportsPointer = 'PointerEvent' in window;

  function moveButtonFrom(target) {
    return target instanceof Element ? target.closest('[data-move]') : null;
  }

  function emit(type, key) {
    document.dispatchEvent(new KeyboardEvent(type, {
      key,
      bubbles: true,
      cancelable: true
    }));
  }

  function hold(direction) {
    const key = keyFor[direction];
    if (!key) return;
    const next = (heldCounts.get(key) || 0) + 1;
    heldCounts.set(key, next);
    if (next === 1) emit('keydown', key);
  }

  function release(direction) {
    const key = keyFor[direction];
    if (!key) return;
    const next = Math.max(0, (heldCounts.get(key) || 0) - 1);
    if (next === 0) {
      heldCounts.delete(key);
      emit('keyup', key);
    } else {
      heldCounts.set(key, next);
    }
  }

  function clearAll() {
    for (const key of heldCounts.keys()) emit('keyup', key);
    heldCounts.clear();
    activePointers.clear();
    activeTouches.clear();
  }

  if (supportsPointer) {
    document.addEventListener('pointerdown', event => {
      const button = moveButtonFrom(event.target);
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const direction = button.dataset.move;
      if (!activePointers.has(event.pointerId)) {
        activePointers.set(event.pointerId, direction);
        hold(direction);
      }
    }, { capture: true, passive: false });

    const endPointer = event => {
      const direction = activePointers.get(event.pointerId);
      const button = moveButtonFrom(event.target);
      if (!direction && !button) return;
      event.preventDefault();
      event.stopPropagation();
      if (direction) {
        release(direction);
        activePointers.delete(event.pointerId);
      }
    };

    document.addEventListener('pointerup', endPointer, { capture: true, passive: false });
    document.addEventListener('pointercancel', endPointer, { capture: true, passive: false });

    // Suppress the legacy touch listeners on the movement buttons. Pointer
    // events above are the single source of movement on modern touch browsers.
    for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) {
      document.addEventListener(type, event => {
        if (!moveButtonFrom(event.target)) return;
        event.preventDefault();
        event.stopPropagation();
      }, { capture: true, passive: false });
    }
  } else {
    document.addEventListener('touchstart', event => {
      const button = moveButtonFrom(event.target);
      if (!button) return;
      event.preventDefault();
      event.stopPropagation();
      const direction = button.dataset.move;
      for (const touch of event.changedTouches) {
        if (!activeTouches.has(touch.identifier)) {
          activeTouches.set(touch.identifier, direction);
          hold(direction);
        }
      }
    }, { capture: true, passive: false });

    const endTouch = event => {
      if (!moveButtonFrom(event.target) && activeTouches.size === 0) return;
      event.preventDefault();
      event.stopPropagation();
      for (const touch of event.changedTouches) {
        const direction = activeTouches.get(touch.identifier);
        if (direction) release(direction);
        activeTouches.delete(touch.identifier);
      }
    };

    document.addEventListener('touchend', endTouch, { capture: true, passive: false });
    document.addEventListener('touchcancel', endTouch, { capture: true, passive: false });
  }

  window.addEventListener('blur', clearAll);
  window.addEventListener('pagehide', clearAll);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearAll();
  });
})();

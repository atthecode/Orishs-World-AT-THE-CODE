(() => {
  'use strict';
  const WARNING_TEXT = 'You have been quiet for a little while, so I will rest my listening ears soon. Tap Talk to Orish whenever you want me again.';
  const RESTING_TEXT = 'Orish is resting. Tap Talk to Orish when you want to speak.';

  class ConversationIdleManager {
    constructor(options = {}) {
      this.warningMs = Math.max(15000, Number(options.warningMs) || 45000);
      this.stopMs = Math.max(this.warningMs + 5000, Number(options.stopMs) || 60000);
      this.onWarning = typeof options.onWarning === 'function' ? options.onWarning : () => {};
      this.onStop = typeof options.onStop === 'function' ? options.onStop : () => {};
      this.warningTimer = 0;
      this.stopTimer = 0;
      this.active = false;
      this.boundVisibility = () => { if (document.hidden && this.active) this.stop('page-hidden'); };
      this.boundPageHide = () => { if (this.active) this.stop('page-left'); };
      document.addEventListener('visibilitychange', this.boundVisibility);
      addEventListener('pagehide', this.boundPageHide);
    }
    start() { this.active = true; this.noteActivity(); }
    noteActivity() {
      if (!this.active) return;
      clearTimeout(this.warningTimer); clearTimeout(this.stopTimer);
      this.warningTimer = setTimeout(() => this.onWarning({ text:WARNING_TEXT, remainingMs:this.stopMs-this.warningMs }), this.warningMs);
      this.stopTimer = setTimeout(() => this.stop('silence'), this.stopMs);
    }
    stop(reason = 'manual') {
      if (!this.active) return;
      this.active = false;
      clearTimeout(this.warningTimer); clearTimeout(this.stopTimer);
      this.onStop({ reason, text:RESTING_TEXT });
    }
    destroy() {
      this.stop('destroyed');
      document.removeEventListener('visibilitychange', this.boundVisibility);
      removeEventListener('pagehide', this.boundPageHide);
    }
  }
  window.OrishConversationIdleManager = ConversationIdleManager;
  window.OrishConversationIdleMessages = { warning:WARNING_TEXT, resting:RESTING_TEXT };
})();

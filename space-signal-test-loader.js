(() => {
  'use strict';

  async function boot() {
    const status = document.getElementById('mobileTestStatus');
    try {
      const response = await fetch(`space-signal.html?fresh=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      let html = await response.text();
      const additions = [
        '<link rel="stylesheet" href="space-signal-mobile-fix.css?v=20260826-2">',
        '<script src="space-signal-mobile-fix.js?v=20260826-2" defer><\/script>'
      ].join('');
      html = html.replace('</head>', `${additions}</head>`);
      document.open();
      document.write(html);
      document.close();
    } catch (error) {
      if (status) status.textContent = `Could not load the fresh mobile test build: ${error.message}`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();

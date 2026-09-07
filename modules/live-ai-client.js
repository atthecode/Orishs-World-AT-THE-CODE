(() => {
  'use strict';

  const STATUS_TTL_MS = 30000;
  const SESSION_CAP = 5;
  const ENDPOINT = '/api/orish-ai';

  let statusCache = null;
  let statusCheckedAt = 0;
  let sessionTurns = 0;
  let bypassNextClick = false;
  let bypassNextEnter = false;
  let busy = false;

  const $ = id => document.getElementById(id);

  function ageBand() {
    return document.body?.dataset?.age || '';
  }

  function freeTextAllowed() {
    const input = $('orishInput');
    const send = $('sendToOrish');
    return Boolean(input && send && !input.disabled && !send.disabled && ageBand() !== '0-2');
  }

  function clean(value, max = 180) {
    return String(value || '')
      .replace(/[\u0000-\u001F\u007F]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, max);
  }

  function setStatus(text) {
    const node = $('orishIntelligenceStatus');
    if (node) node.textContent = text;
  }

  function addBubble(text, who) {
    const log = $('chatLog');
    if (!log) return;
    const bubble = document.createElement('div');
    bubble.className = `bubble ${who === 'user' ? 'user-bubble' : 'orish-bubble'}`;
    bubble.textContent = text;
    log.appendChild(bubble);
    log.scrollTop = log.scrollHeight;
  }

  async function getStatus({ force = false } = {}) {
    const fresh = statusCache && Date.now() - statusCheckedAt < STATUS_TTL_MS;
    if (!force && fresh) return statusCache;
    try {
      const response = await fetch(ENDPOINT, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        cache: 'no-store',
        credentials: 'same-origin'
      });
      const data = await response.json().catch(() => ({}));
      statusCache = response.ok ? data : { ok: false, configured: false };
    } catch {
      statusCache = { ok: false, configured: false };
    }
    statusCheckedAt = Date.now();
    return statusCache;
  }

  function canAttempt(status) {
    return Boolean(
      status?.configured &&
      freeTextAllowed() &&
      sessionTurns < SESSION_CAP &&
      Number(status.processDailyRemaining ?? 1) > 0 &&
      navigator.onLine !== false
    );
  }

  function runLocalFallbackFromClick() {
    bypassNextClick = true;
    $('sendToOrish')?.click();
  }

  function runLocalFallbackFromEnter() {
    const input = $('orishInput');
    if (!input) return;
    bypassNextEnter = true;
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      bubbles: true,
      cancelable: true
    }));
  }

  async function askLive(prompt, fallback) {
    if (busy) return;
    const text = clean(prompt);
    if (!text) return fallback();

    const status = await getStatus();
    if (!canAttempt(status)) return fallback();

    busy = true;
    const send = $('sendToOrish');
    if (send) send.disabled = true;
    setStatus(`Orish Live • Qwen free-quota test • ${Math.max(0, SESSION_CAP - sessionTurns)} session turns left`);

    try {
      const response = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        cache: 'no-store',
        credentials: 'same-origin',
        body: JSON.stringify({
          prompt: text,
          ageBand: ageBand()
        })
      });
      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok && data.answer) {
        addBubble(text, 'user');
        addBubble(clean(data.answer, 1100), 'orish');
        if ($('orishInput')) $('orishInput').value = '';
        sessionTurns += 1;
        const remaining = Math.max(0, SESSION_CAP - sessionTurns);
        setStatus(`Orish Live • Qwen • ${remaining} session turn${remaining === 1 ? '' : 's'} left • local fallback always available`);
        if (typeof window.speechSynthesis !== 'undefined' && window.OrishOpenVoice?.interrupt) {
          // app-level read-aloud remains governed by the existing parent controls;
          // live text is not auto-spoken here to avoid bypassing them.
        }
        statusCache = { ...statusCache, processDailyRemaining: data.processDailyRemaining };
        return;
      }

      if (data.safeReply) {
        addBubble(text, 'user');
        addBubble(clean(data.safeReply, 700), 'orish');
        if ($('orishInput')) $('orishInput').value = '';
        setStatus('Orish safety route • live model was not used for that request');
        return;
      }

      statusCache = {
        ...(statusCache || {}),
        configured: data.code !== 'not_configured',
        processDailyRemaining: data.code === 'daily_cap' || data.code === 'provider_quota' ? 0 : statusCache?.processDailyRemaining
      };
      fallback();
    } catch {
      fallback();
    } finally {
      busy = false;
      if (send && freeTextAllowed()) send.disabled = false;
    }
  }

  async function interceptClick(event) {
    if (bypassNextClick) {
      bypassNextClick = false;
      return;
    }
    if (!freeTextAllowed() || busy) return;
    const prompt = $('orishInput')?.value || '';
    const status = await getStatus();
    if (!canAttempt(status)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    askLive(prompt, runLocalFallbackFromClick);
  }

  async function interceptEnter(event) {
    if (event.key !== 'Enter') return;
    if (bypassNextEnter) {
      bypassNextEnter = false;
      return;
    }
    if (!freeTextAllowed() || busy) return;
    const status = await getStatus();
    if (!canAttempt(status)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    askLive($('orishInput')?.value || '', runLocalFallbackFromEnter);
  }

  function attach() {
    $('sendToOrish')?.addEventListener('click', interceptClick);
    $('orishInput')?.addEventListener('keydown', interceptEnter);
    getStatus().then(status => {
      if (status?.configured) {
        setStatus(`Orish Live ready • Qwen free-quota test • ${SESSION_CAP} session turns available`);
      }
    });
  }

  window.OrishLiveAI = {
    getStatus,
    getSessionUsage: () => ({ used: sessionTurns, cap: SESSION_CAP, remaining: Math.max(0, SESSION_CAP - sessionTurns) })
  };

  attach();
})();

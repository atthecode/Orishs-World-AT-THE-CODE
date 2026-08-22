(() => {
  'use strict';

  const MAX_TURN_MS = 12000;
  const MAX_AUDIO_BYTES = 4 * 1024 * 1024;
  const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);
  const DEFAULT_GATEWAY = LOCAL_HOSTS.has(window.location.hostname)
    ? 'http://127.0.0.1:8787'
    : `${window.location.origin}/api/voice`;

  let gatewayBase = localStorage.getItem('orish.v127.voiceGateway') || DEFAULT_GATEWAY;
  let recorder = null;
  let stream = null;
  let chunks = [];
  let turnTimer = null;
  let currentAudio = null;
  let gatewayHealth = null;
  let recording = false;

  function emit(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(`orish-voice:${name}`, { detail }));
  }

  function cleanGateway(url) {
    const value = String(url || '').trim().replace(/\/+$/, '');
    if (!value) return DEFAULT_GATEWAY;
    if (value.startsWith('/')) return value;
    try {
      const parsed = new URL(value);
      if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Unsupported protocol');
      return parsed.toString().replace(/\/+$/, '');
    } catch {
      throw new Error('Voice gateway must be a valid http(s) URL or same-origin path.');
    }
  }

  function setGateway(url) {
    gatewayBase = cleanGateway(url);
    localStorage.setItem('orish.v127.voiceGateway', gatewayBase);
    gatewayHealth = null;
    return gatewayBase;
  }

  function getGateway() { return gatewayBase; }

  function preferredMimeType() {
    if (!window.MediaRecorder) return '';
    const candidates = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus'
    ];
    return candidates.find(type => MediaRecorder.isTypeSupported?.(type)) || '';
  }

  function supportsRecording() {
    return Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
  }

  async function health({ timeoutMs = 1800 } = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${gatewayBase}/v1/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        cache: 'no-store',
        signal: controller.signal,
        credentials: 'omit'
      });
      if (!response.ok) throw new Error(`Gateway returned ${response.status}`);
      gatewayHealth = await response.json();
      emit('health', { ok: true, health: gatewayHealth });
      return gatewayHealth;
    } catch (error) {
      gatewayHealth = null;
      emit('health', { ok: false, error: error.message });
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  function stopTracks() {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      stream = null;
    }
  }

  function clearTurnTimer() {
    if (turnTimer) clearTimeout(turnTimer);
    turnTimer = null;
  }

  function interrupt() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.src = '';
      currentAudio = null;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    emit('interrupted', {});
  }

  function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    const chunkSize = 0x8000;
    let binary = '';
    for (let i = 0; i < bytes.length; i += chunkSize) {
      binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
  }

  async function sendAudio(blob, context = {}) {
    if (blob.size > MAX_AUDIO_BYTES) throw new Error('That voice turn was too large. Try a shorter sentence.');
    const base64 = arrayBufferToBase64(await blob.arrayBuffer());
    const response = await fetch(`${gatewayBase}/v1/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
      body: JSON.stringify({
        audioBase64: base64,
        mimeType: blob.type || 'application/octet-stream',
        ageBand: String(context.ageBand || ''),
        locale: String(context.locale || 'en-GB'),
        retention: 'none'
      })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok) throw new Error(data.error || `Voice gateway returned ${response.status}`);
    const transcript = String(data.transcript || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, 220);
    if (!transcript) throw new Error('I could not hear enough words. Try again.');
    emit('transcript', { transcript, engine: data.engine || 'self-hosted STT' });
    return transcript;
  }

  async function startTurn(context = {}) {
    if (recording) return;
    if (!supportsRecording()) throw new Error('This browser does not support the microphone recorder used by this prototype.');
    interrupt();
    emit('state', { stage: 'requesting-microphone' });

    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        channelCount: 1
      },
      video: false
    });

    const mimeType = preferredMimeType();
    recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    chunks = [];

    recorder.addEventListener('dataavailable', event => {
      if (event.data?.size) chunks.push(event.data);
    });

    recorder.addEventListener('stop', async () => {
      clearTurnTimer();
      recording = false;
      stopTracks();
      emit('state', { stage: 'processing' });
      const blob = new Blob(chunks, { type: recorder?.mimeType || mimeType || 'application/octet-stream' });
      chunks = [];
      recorder = null;
      try {
        await sendAudio(blob, context);
        emit('state', { stage: 'ready' });
      } catch (error) {
        emit('error', { error: error.message });
        emit('state', { stage: 'ready' });
      }
    }, { once: true });

    recorder.start(250);
    recording = true;
    emit('state', { stage: 'listening' });
    turnTimer = setTimeout(() => stopTurn(), Math.min(Number(context.maxMs) || MAX_TURN_MS, MAX_TURN_MS));
  }

  function stopTurn() {
    if (!recording || !recorder) return;
    clearTurnTimer();
    if (recorder.state !== 'inactive') recorder.stop();
  }

  function cancelTurn() {
    clearTurnTimer();
    if (recorder && recorder.state !== 'inactive') {
      recorder.ondataavailable = null;
      try { recorder.stop(); } catch {}
    }
    recorder = null;
    recording = false;
    chunks = [];
    stopTracks();
    emit('state', { stage: 'ready' });
  }

  function canSelfHostedSpeak() {
    return Boolean(gatewayHealth?.tts?.ready);
  }

  async function speak(text) {
    const clean = String(text || '').trim().slice(0, 1200);
    if (!clean || !canSelfHostedSpeak()) return false;
    interrupt();
    const response = await fetch(`${gatewayBase}/v1/speak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
      body: JSON.stringify({ text: clean, locale: 'en-GB', retention: 'none' })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.ok || !data.audioBase64) return false;
    currentAudio = new Audio(`data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`);
    currentAudio.addEventListener('ended', () => { currentAudio = null; }, { once: true });
    await currentAudio.play();
    return true;
  }

  function isRecording() { return recording; }
  function getHealth() { return gatewayHealth; }

  window.OrishOpenVoice = {
    MAX_TURN_MS,
    MAX_AUDIO_BYTES,
    supportsRecording,
    preferredMimeType,
    health,
    startTurn,
    stopTurn,
    cancelTurn,
    interrupt,
    speak,
    canSelfHostedSpeak,
    isRecording,
    getHealth,
    setGateway,
    getGateway
  };
})();

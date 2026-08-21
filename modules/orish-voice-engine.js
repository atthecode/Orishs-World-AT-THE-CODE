/*
 * Orish's World @ THE CODE — Voice Engine Stage 1
 *
 * Free-first, provider-neutral foundation for child-safe voice sessions.
 * No paid API, model endpoint, secret, or production child conversation service
 * is connected by this file. Real model adapters are injected later.
 */

(function attachOrishVoiceEngine(root) {
  'use strict';

  const DEFAULTS = Object.freeze({
    enabled: false,
    mode: 'disabled', // disabled | device | server | hybrid
    retainRawAudio: false,
    retainTranscript: false,
    maxSessionMinutes: 15,
    maxTurnSeconds: 90,
    requireAdultApproval: true,
  });

  const AGE_BANDS = Object.freeze({
    parentLed: { min: 0, max: 4 },
    youngLearner: { min: 5, max: 8 },
    learner: { min: 9, max: 12 },
    teen: { min: 13, max: 16 },
  });

  const ADULT_SUPPORT_PATTERNS = [
    /\bi am (?:not )?safe\b/i,
    /\bsomeone (?:hurt|hit|touched|threatened) me\b/i,
    /\bi(?:'m| am) scared of (?:someone|a person)\b/i,
    /\bkeep (?:this|it) a secret from (?:mum|mom|dad|parent|grown[- ]?up)\b/i,
    /\bi want to hurt (?:myself|someone)\b/i,
  ];

  function ageBand(age) {
    const years = Number(age);
    if (!Number.isFinite(years) || years < 0 || years > 16) return null;
    if (years <= AGE_BANDS.parentLed.max) return 'parent-led';
    if (years <= AGE_BANDS.youngLearner.max) return 'young-learner';
    if (years <= AGE_BANDS.learner.max) return 'learner';
    return 'teen';
  }

  function requiresAdultSupport(text) {
    const value = String(text || '').trim();
    return value.length > 0 && ADULT_SUPPORT_PATTERNS.some((pattern) => pattern.test(value));
  }

  function createUnavailableAdapter(name) {
    return Object.freeze({
      async run() {
        throw new Error(`${name} adapter is not configured.`);
      },
    });
  }

  class OrishVoiceEngine {
    constructor(options = {}) {
      this.config = { ...DEFAULTS, ...options };
      this.adapters = {
        speechToText: createUnavailableAdapter('Speech-to-text'),
        brain: createUnavailableAdapter('AI brain'),
        textToSpeech: createUnavailableAdapter('Text-to-speech'),
      };
      this.session = null;
      this.onSafetyEvent = typeof options.onSafetyEvent === 'function'
        ? options.onSafetyEvent
        : function noop() {};
    }

    registerAdapter(type, adapter) {
      if (!Object.prototype.hasOwnProperty.call(this.adapters, type)) {
        throw new Error(`Unknown voice adapter: ${type}`);
      }
      if (!adapter || typeof adapter.run !== 'function') {
        throw new Error(`${type} adapter must expose an async run(payload) function.`);
      }
      this.adapters[type] = adapter;
      return this;
    }

    getCapabilities(profile = {}) {
      const band = ageBand(profile.age);
      const adultApproved = profile.adultApproved === true;
      const parentPresent = profile.parentPresent === true;
      const parentLedReady = band !== 'parent-led' || parentPresent;
      const modeReady = this.config.mode !== 'disabled';

      return {
        enabled: Boolean(this.config.enabled),
        mode: this.config.mode,
        ageBand: band,
        parentLed: band === 'parent-led',
        canStart: Boolean(
          this.config.enabled
          && modeReady
          && band
          && parentLedReady
          && (!this.config.requireAdultApproval || adultApproved)
        ),
        privacy: {
          retainRawAudio: Boolean(this.config.retainRawAudio),
          retainTranscript: Boolean(this.config.retainTranscript),
        },
      };
    }

    startSession(profile = {}) {
      const capabilities = this.getCapabilities(profile);
      if (!capabilities.canStart) {
        throw new Error('Voice session is not available for this profile yet.');
      }

      this.session = {
        id: `orish-voice-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        startedAt: Date.now(),
        profile: {
          age: Number(profile.age),
          ageBand: capabilities.ageBand,
          adultApproved: profile.adultApproved === true,
          parentPresent: profile.parentPresent === true,
        },
        turns: 0,
        memory: [], // RAM-only Stage 1 memory; never written to storage here.
      };

      return { ...this.session, memory: undefined };
    }

    stopSession(reason = 'ended') {
      if (!this.session) return null;
      const summary = {
        id: this.session.id,
        reason,
        turns: this.session.turns,
        durationMs: Date.now() - this.session.startedAt,
      };
      this.session = null;
      return summary;
    }

    ensureActiveSession() {
      if (!this.session) throw new Error('Start a voice session first.');
      const elapsedMinutes = (Date.now() - this.session.startedAt) / 60000;
      if (elapsedMinutes >= this.config.maxSessionMinutes) {
        this.stopSession('time-limit');
        throw new Error('Voice session time limit reached.');
      }
    }

    async handleAudio(audioPayload) {
      this.ensureActiveSession();
      const transcriptResult = await this.adapters.speechToText.run({
        audio: audioPayload,
        ageBand: this.session.profile.ageBand,
        maxTurnSeconds: this.config.maxTurnSeconds,
      });
      const text = transcriptResult && transcriptResult.text;
      return this.handleText(text);
    }

    async handleText(text) {
      this.ensureActiveSession();
      const cleaned = String(text || '').trim();
      if (!cleaned) {
        return { status: 'empty', text: '', audio: null };
      }

      if (requiresAdultSupport(cleaned)) {
        const safetyReply = this.session.profile.parentPresent
          ? 'Please tell the grown-up with you what happened so they can help you now.'
          : 'Please go to a trusted grown-up now and tell them what happened. I can stay simple and calm while you get them.';

        this.onSafetyEvent({
          type: 'adult-support-needed',
          sessionId: this.session.id,
          ageBand: this.session.profile.ageBand,
          occurredAt: Date.now(),
          // Deliberately do not include the child's raw words in the event.
        });

        const spoken = await this.adapters.textToSpeech.run({
          text: safetyReply,
          voice: 'orish',
          ageBand: this.session.profile.ageBand,
        });

        return {
          status: 'adult-support-needed',
          text: safetyReply,
          audio: spoken && spoken.audio ? spoken.audio : null,
        };
      }

      const memoryForModel = this.session.memory.slice(-6);
      const brainResult = await this.adapters.brain.run({
        input: cleaned,
        age: this.session.profile.age,
        ageBand: this.session.profile.ageBand,
        parentLed: this.session.profile.ageBand === 'parent-led',
        memory: memoryForModel,
        rules: {
          teachRatherThanPretendToKnow: true,
          noSecretsFromTrustedAdults: true,
          noAds: true,
          noPurchasingPressure: true,
          ageAppropriate: true,
        },
      });

      const reply = String((brainResult && brainResult.text) || '').trim();
      if (!reply) throw new Error('AI brain returned an empty reply.');

      this.session.turns += 1;
      this.session.memory.push(
        { role: 'child', text: cleaned },
        { role: 'orish', text: reply }
      );
      if (this.session.memory.length > 12) {
        this.session.memory.splice(0, this.session.memory.length - 12);
      }

      const spoken = await this.adapters.textToSpeech.run({
        text: reply,
        voice: 'orish',
        ageBand: this.session.profile.ageBand,
      });

      return {
        status: 'ok',
        text: reply,
        audio: spoken && spoken.audio ? spoken.audio : null,
        turns: this.session.turns,
      };
    }
  }

  const api = Object.freeze({
    OrishVoiceEngine,
    ageBand,
    requiresAdultSupport,
    DEFAULTS,
  });

  root.OrishVoice = api;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : this);

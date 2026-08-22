# V1.27 — AT THE CODE Open Voice Foundation

## Goal

Give Orish a path toward genuine two-way spoken interaction **without making a hosted AI API the permanent core of the product**.

V1.27 establishes the boundary; it does not pretend that a production voice system is finished.

## Working child flow in this prototype

```text
Parent enables two-way voice for a profile
        ↓
Child taps Talk
        ↓
Browser requests microphone access for that turn
        ↓
Maximum 12-second audio turn
        ↓
AT THE CODE private voice gateway
        ↓
Configured local speech-to-text
        ↓
Text only returns to Orish's approved learning router
        ↓
Orish chooses a reviewed learning route / response
        ↓
Self-hosted TTS when configured, otherwise device read-aloud
```

Pressing Talk while Orish is speaking stops the current audio first, creating the foundation for interruption/barge-in behaviour. Continuous always-listening audio is intentionally not used.

## Free/open-source-first candidates

The architecture is intentionally adapter-based rather than tied to one vendor. Current candidates include:

- Blender for 3D asset creation and animation;
- Godot for the future full game-world layer;
- `whisper.cpp` for local/self-hosted speech recognition;
- a reviewed open-weight LLM served locally (for example through a local inference server) only where it adds value;
- Kokoro-family local speech generation as a candidate TTS route;
- optional self-hosted WebRTC/real-time infrastructure if natural streaming later needs it.

**Licence rule:** verify the exact repository, model weights, voice assets and their current licences immediately before importing or distributing them. “Open source” does not automatically mean every model, voice or dataset has identical commercial rights.

## Child-safety design choices

- two-way microphone is **OFF by default**;
- ages 0–2 remain parent-led and cannot enable child microphone mode;
- microphone starts only after an explicit interaction;
- each turn is short and auto-stops;
- browser microphone tracks close after a turn;
- raw audio is not intentionally written to localStorage or Learning Passport;
- transcripts are transient and are not added to child history in this prototype;
- service-worker rules exclude future `/api/` traffic from offline caching;
- typed/spoken child input still enters the approved Orish router rather than arbitrary generated code;
- open web remains locked off;
- a local/open model is **not treated as a safety system by itself**.

## Why there is still a browser speech fallback

The current prototype already has device/browser `speechSynthesis`. V1.27 keeps it as a graceful fallback so the app remains demonstrable before a local TTS model is installed. This fallback is not the target production voice architecture.

## Production work still required

Before real children use live voice over a network: production authentication/session binding, verified parental authorisation, HTTPS, rate/capacity limits, safe observability without exposing child content, deletion/retention enforcement, model and voice licence review, threat testing, safeguarding/privacy/legal review, device QA, accessibility testing, latency testing and a clear incident-response path.

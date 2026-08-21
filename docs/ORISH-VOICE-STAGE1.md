# Orish Voice Engine — Stage 1

This stage creates the provider-neutral voice foundation for Orish's World without connecting a paid AI API or turning a personal phone into a public server.

## Free-first target stack

- Speech recognition: Whisper-compatible local/self-hosted adapter
- AI brain: Qwen-compatible local/self-hosted adapter
- Speech generation: Kokoro-compatible local/self-hosted adapter
- Real-time transport later: standard WebRTC or self-hosted LiveKit where justified
- Visual character work later: Blender assets; Godot only for scenes that genuinely need runtime 3D interaction

The app talks to one `OrishVoiceEngine` interface. Model/provider details stay behind adapters so they can be changed without rebuilding the child experience.

## Phone-first does not mean phone-as-public-server

A capable iPhone can be used to test microphone capture, on-device models, voice playback, character animation and limited local inference. Each customer's capable device may eventually perform some of its own processing.

The owner's phone must not be used as the permanent internet server for all customers. Shared processing later belongs behind the AT THE CODE API on dedicated infrastructure. The engine therefore supports four deployment modes:

- `disabled` — default; no live AI conversation
- `device` — compatible processing stays on the user's device
- `server` — approved self-hosted server performs heavier inference
- `hybrid` — device does light/private work and server handles heavier approved jobs

## Child-safety boundary

Stage 1 intentionally ships **disabled by default**. It is architecture, not a claim that open models are automatically child-safe.

Before production child voice is enabled, the deployment needs real adult authentication/authorization, age-appropriate policy layers, input/output moderation, secure transport, clear parent controls, minimal retention, abuse testing, safeguarding review and a documented escalation design.

For ages 0–4, voice is parent/guardian-led. For older children the engine still requires an adult-approved profile before a session can start. Raw audio and transcripts are not retained by this Stage 1 engine.

The small pattern check in `orish-voice-engine.js` is only an early fail-safe hook. It is not sufficient production moderation.

## Adapter contract

Each model adapter exposes:

```js
{
  async run(payload) {
    return { /* adapter-specific result */ };
  }
}
```

Expected results:

- speech-to-text: `{ text }`
- brain: `{ text }`
- text-to-speech: `{ audio }`

No API key or model URL belongs in the child-facing bundle. When a server mode is introduced, secrets stay server-side.

## Stage 1 test plan

1. Keep `enabled: false` in normal builds.
2. Use mocked adapters first to prove turn-taking without sending child speech anywhere.
3. Test one adult/test voice session on a capable phone.
4. Benchmark Whisper/Qwen/Kokoro separately before choosing on-device model sizes.
5. Add interruption/turn detection only after the basic pipeline is stable.
6. Add a server fallback behind the same adapter contract.
7. Enable real child testing only after the privacy/safeguarding production boundary is complete.

## Shared infrastructure later

The underlying inference infrastructure may be shared with other AT THE CODE products, but Orish sessions must have separate policies, data boundaries and child-safety configuration. Adult products must not share conversation memory or relaxed safety settings with Orish's World.

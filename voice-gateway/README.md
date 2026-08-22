# AT THE CODE Local Voice Gateway — V1.28

V1.28 adds a practical local runtime around the V1.27 self-hosted voice boundary.
It remains a development scaffold, not a production child-data service.

## Included now

- standard-library Python voice gateway;
- short no-retention speech turns from the PWA;
- `whisper.cpp` command adapter for local STT;
- a local Kokoro TTS adapter (`adapters/kokoro_tts.py`);
- separate Python interpreter support for the TTS virtual environment;
- macOS/Linux runtime bootstrap script;
- local runtime readiness doctor;
- an end-to-end adapter-contract smoke test that needs no model weights;
- browser/device speech fallback if local TTS is unavailable.

## Fast local path

```bash
cd voice-gateway
./scripts/install-local-voice.sh
./scripts/start-local-voice.sh
```

The installer is intentionally manual: it runs only when the developer executes
it. Runtime/model files are placed in `.runtime/` and excluded from Git.

Serve the PWA from another terminal at `http://127.0.0.1:8000` and enable two-way
voice for a non-0–2 profile in Parent Studio.

## Health

`GET /v1/health` reports whether local STT and TTS are ready. It reports engine
state only; it does not expose transcripts, voice text or local model paths.

## Child boundary

The transcript returns to Orish's existing approved learning router. V1.28 does
not send child speech straight to an unrestricted LLM. No open-source model should
be treated as a safety layer by itself.

## Production boundary

Before real online child use: production authentication/session binding, verified
parental authorisation, HTTPS, abuse/rate/capacity controls, safe observability,
retention/deletion enforcement, licence review, privacy/safeguarding/security
review and physical-device testing are required.

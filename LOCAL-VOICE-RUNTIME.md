# V1.28 — Local Voice Runtime

## What changed

V1.28 turns the V1.27 voice boundary into an installable local development runtime.
The child app still uses the same parent opt-in and short tap-to-talk flow, but the
repository now contains explicit adapters and setup scripts for a fully local
speech path:

```text
Microphone
  → AT THE CODE Voice Gateway
  → local ffmpeg conversion
  → local whisper.cpp + local Whisper model
  → approved Orish learning/safety router
  → local Kokoro adapter when installed
  → speaker
```

The PWA contains **no model weights, no hosted-AI key and no child-facing vendor
branding**. Runtime/model files live under `voice-gateway/.runtime/`, which is
Git-ignored.

## Development setup

For macOS/Linux, the helper script can prepare the runtime when run on a machine
with Git, CMake, Python 3 and ffmpeg:

```bash
cd voice-gateway
./scripts/install-local-voice.sh
./scripts/start-local-voice.sh
```

Then serve the PWA separately, for example:

```bash
python3 -m http.server 8000
```

The helper downloads `whisper.cpp` from the official `ggml-org/whisper.cpp`
repository, builds `whisper-cli`, downloads the selected GGML model and creates a
private Python virtual environment for Kokoro. It does not execute automatically.

Run the non-content readiness check after sourcing the generated environment:

```bash
set -a; source .runtime/local.env; set +a
.runtime/venv/bin/python scripts/doctor.py
```

## Test without model downloads

`voice-gateway/tests/smoke_test.py` uses clearly marked test-only fake adapters to
check the gateway contract end-to-end. It does **not** claim speech recognition or
speech synthesis quality and never enters the child UI.

```bash
python3 voice-gateway/tests/smoke_test.py
```

## Why this is still a prototype

Local/open-source software removes per-call API dependence, not the physical cost
of compute. A real release still needs capacity planning, authentication, TLS,
rate/cost controls, reviewed model/voice licences, child privacy/safeguarding and
security review, physical-device latency tests and an incident-response path.

A locally hosted language model is deliberately not connected directly to child
speech in V1.28. The existing approved Orish router remains the response boundary.

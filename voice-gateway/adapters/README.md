# Local TTS adapter contract

The gateway calls a reviewed adapter using:

```text
PYTHON ADAPTER.py INPUT.txt OUTPUT.wav
```

V1.28 includes `kokoro_tts.py`, which expects the optional Kokoro Python runtime
and `soundfile` to be installed in a private virtual environment. The selected
voice/language/speed come from `ORISH_KOKORO_*` environment variables rather than
child-facing code.

The adapter must write a non-empty WAV file and must not upload the text or audio.
Do not add hosted fallbacks inside an adapter without a separate architecture and
privacy review.

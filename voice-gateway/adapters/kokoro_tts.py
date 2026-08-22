#!/usr/bin/env python3
"""Kokoro adapter for AT THE CODE Open Voice.

Contract: python kokoro_tts.py INPUT.txt OUTPUT.wav

The adapter loads Kokoro locally and writes one 24 kHz mono WAV file. It does not
send text or audio to a hosted service. Model/library installation is deliberately
kept outside the PWA and outside Git-tracked files.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path


def fail(message: str, code: int = 2) -> None:
    print(f"kokoro-adapter: {message}", file=sys.stderr)
    raise SystemExit(code)


def main() -> None:
    if len(sys.argv) != 3:
        fail("usage: kokoro_tts.py INPUT.txt OUTPUT.wav")

    input_path = Path(sys.argv[1])
    output_path = Path(sys.argv[2])
    if not input_path.is_file():
        fail("input text file not found")

    text = input_path.read_text(encoding="utf-8", errors="replace").strip()
    if not text:
        fail("input text is empty")
    text = text[:1200]

    try:
        import numpy as np
        import soundfile as sf
        from kokoro import KPipeline
    except Exception as exc:  # pragma: no cover - depends on optional runtime
        fail(f"Kokoro runtime is not installed: {exc}")

    # Defaults mirror Kokoro's documented example and can be changed without
    # editing child-facing code. Review the chosen voice before production use.
    lang = os.getenv("ORISH_KOKORO_LANG", "a").strip() or "a"
    voice = os.getenv("ORISH_KOKORO_VOICE", "af_heart").strip() or "af_heart"
    speed = float(os.getenv("ORISH_KOKORO_SPEED", "1.0"))
    speed = min(max(speed, 0.8), 1.2)

    pipeline = KPipeline(lang_code=lang)
    chunks = []
    for _graphemes, _phonemes, audio in pipeline(text, voice=voice, speed=speed):
        array = np.asarray(audio, dtype=np.float32)
        if array.size:
            chunks.append(array)
    if not chunks:
        fail("Kokoro produced no audio")

    combined = np.concatenate(chunks)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(output_path), combined, 24000, subtype="PCM_16")
    if not output_path.is_file() or output_path.stat().st_size < 128:
        fail("output WAV was not created")


if __name__ == "__main__":
    main()

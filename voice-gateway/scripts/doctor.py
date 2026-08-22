#!/usr/bin/env python3
"""Local runtime readiness check. Does not transmit files or child content."""
from __future__ import annotations

import json
import os
import shutil
import sys
from pathlib import Path


def exe(value: str) -> bool:
    if not value:
        return False
    found = shutil.which(value) if os.path.sep not in value else value
    return bool(found and Path(found).is_file() and os.access(found, os.X_OK))


def main() -> int:
    whisper_bin = os.getenv("ORISH_WHISPER_CPP_BIN", "")
    whisper_model = os.getenv("ORISH_WHISPER_MODEL", "")
    ffmpeg = os.getenv("ORISH_FFMPEG_BIN", "ffmpeg")
    adapter = os.getenv("ORISH_TTS_ADAPTER", "")
    report = {
        "gatewayPython": sys.version.split()[0],
        "ffmpeg": exe(ffmpeg),
        "whisperCli": exe(whisper_bin),
        "whisperModel": bool(whisper_model and Path(whisper_model).is_file()),
        "ttsAdapter": bool(adapter and Path(adapter).is_file()),
        "kokoroImport": False,
        "soundfileImport": False,
    }
    try:
        import kokoro  # noqa: F401
        report["kokoroImport"] = True
    except Exception:
        pass
    try:
        import soundfile  # noqa: F401
        report["soundfileImport"] = True
    except Exception:
        pass
    report["sttReady"] = report["ffmpeg"] and report["whisperCli"] and report["whisperModel"]
    report["ttsReady"] = report["ttsAdapter"] and report["kokoroImport"] and report["soundfileImport"]
    print(json.dumps(report, indent=2))
    return 0 if report["sttReady"] and report["ttsReady"] else 1


if __name__ == "__main__":
    raise SystemExit(main())

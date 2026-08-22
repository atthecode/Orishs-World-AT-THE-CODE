#!/usr/bin/env python3
"""AT THE CODE Open Voice — zero-dependency development gateway.

This gateway deliberately does not bundle model weights or API keys. It can call a
local whisper.cpp executable for speech-to-text and a reviewed local TTS adapter
for speech output. Request bodies are processed in memory or short-lived temp
files and are not logged or retained by this server.

Development only: production child use still requires reviewed authentication,
rate limits, TLS, abuse controls, monitoring that does not expose child content,
and formal privacy/safeguarding/security review.
"""
from __future__ import annotations

import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

HOST = os.getenv("ORISH_VOICE_HOST", "127.0.0.1")
PORT = int(os.getenv("ORISH_VOICE_PORT", "8787"))
MAX_BODY = int(os.getenv("ORISH_VOICE_MAX_BODY", str(6 * 1024 * 1024)))
MAX_AUDIO = int(os.getenv("ORISH_VOICE_MAX_AUDIO", str(4 * 1024 * 1024)))
MAX_TEXT = int(os.getenv("ORISH_VOICE_MAX_TEXT", "1200"))

WHISPER_BIN = os.getenv("ORISH_WHISPER_CPP_BIN", "")
WHISPER_MODEL = os.getenv("ORISH_WHISPER_MODEL", "")
FFMPEG_BIN = os.getenv("ORISH_FFMPEG_BIN", "ffmpeg")
TTS_ADAPTER = os.getenv("ORISH_TTS_ADAPTER", "")
TTS_PYTHON = os.getenv("ORISH_TTS_PYTHON", sys.executable)
LLM_URL = os.getenv("ORISH_LOCAL_LLM_URL", "")

DEFAULT_ORIGINS = "http://127.0.0.1:8000,http://localhost:8000,http://127.0.0.1:8080,http://localhost:8080"
ALLOWED_ORIGINS = {x.strip() for x in os.getenv("ORISH_VOICE_ALLOWED_ORIGINS", DEFAULT_ORIGINS).split(",") if x.strip()}

MIME_EXT = {
    "audio/webm": ".webm",
    "audio/webm;codecs=opus": ".webm",
    "audio/mp4": ".m4a",
    "audio/ogg": ".ogg",
    "audio/ogg;codecs=opus": ".ogg",
    "audio/wav": ".wav",
    "audio/x-wav": ".wav",
}


def existing_executable(value: str) -> str | None:
    if not value:
        return None
    path = shutil.which(value) if os.path.sep not in value else value
    return path if path and Path(path).is_file() and os.access(path, os.X_OK) else None


def whisper_ready() -> bool:
    return bool(existing_executable(WHISPER_BIN) and Path(WHISPER_MODEL).is_file() and existing_executable(FFMPEG_BIN))


def tts_ready() -> bool:
    return bool(TTS_ADAPTER and Path(TTS_ADAPTER).is_file() and existing_executable(TTS_PYTHON))


def run_checked(args: list[str], timeout: int = 45) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        stdin=subprocess.DEVNULL,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
        timeout=timeout,
        check=True,
    )


def transcribe_with_whisper(audio: bytes, mime_type: str) -> str:
    if not whisper_ready():
        raise RuntimeError("Self-hosted speech recognition is not configured.")
    extension = MIME_EXT.get(mime_type.split(";")[0], MIME_EXT.get(mime_type, ".bin"))
    whisper_bin = existing_executable(WHISPER_BIN)
    ffmpeg_bin = existing_executable(FFMPEG_BIN)
    if not whisper_bin or not ffmpeg_bin:
        raise RuntimeError("Required local voice executables are unavailable.")

    with tempfile.TemporaryDirectory(prefix="orish-voice-") as td:
        td_path = Path(td)
        input_path = td_path / f"turn{extension}"
        wav_path = td_path / "turn.wav"
        output_base = td_path / "transcript"
        input_path.write_bytes(audio)

        run_checked([
            ffmpeg_bin, "-nostdin", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(input_path), "-ac", "1", "-ar", "16000", str(wav_path)
        ], timeout=30)

        # whisper.cpp CLI flags: no timestamps + plain-text sidecar output.
        run_checked([
            whisper_bin, "-m", WHISPER_MODEL, "-f", str(wav_path),
            "-nt", "-otxt", "-of", str(output_base)
        ], timeout=45)
        text_path = Path(f"{output_base}.txt")
        if not text_path.is_file():
            raise RuntimeError("Speech engine did not produce a transcript.")
        return text_path.read_text(encoding="utf-8", errors="replace").strip()[:500]


def render_tts(text: str) -> tuple[bytes, str]:
    if not tts_ready():
        raise RuntimeError("Self-hosted TTS adapter is not configured.")
    adapter = Path(TTS_ADAPTER)
    with tempfile.TemporaryDirectory(prefix="orish-tts-") as td:
        td_path = Path(td)
        text_path = td_path / "input.txt"
        output_path = td_path / "output.wav"
        text_path.write_text(text, encoding="utf-8")
        tts_python = existing_executable(TTS_PYTHON)
        if not tts_python:
            raise RuntimeError("Self-hosted TTS Python runtime is unavailable.")
        run_checked([tts_python, str(adapter), str(text_path), str(output_path)], timeout=45)
        if not output_path.is_file() or output_path.stat().st_size == 0:
            raise RuntimeError("TTS adapter did not produce audio.")
        return output_path.read_bytes(), "audio/wav"


class VoiceHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"
    server_version = "AT-THE-CODE-Voice/0.2"

    def log_message(self, fmt: str, *args) -> None:
        # Log method/path/status only. Never log request bodies, transcripts or text.
        safe_args = tuple(str(a).replace("\n", " ")[:160] for a in args)
        sys.stderr.write("voice-gateway: " + (fmt % safe_args) + "\n")

    def _origin_allowed(self) -> bool:
        origin = self.headers.get("Origin")
        return origin is None or origin in ALLOWED_ORIGINS

    def _cors_headers(self) -> None:
        origin = self.headers.get("Origin")
        if origin and origin in ALLOWED_ORIGINS:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Accept")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Content-Type-Options", "nosniff")

    def _json(self, status: int, payload: dict) -> None:
        data = json.dumps(payload, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._cors_headers()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _read_json(self) -> dict:
        length = int(self.headers.get("Content-Length", "0"))
        if length <= 0 or length > MAX_BODY:
            raise ValueError("Request size is invalid.")
        body = self.rfile.read(length)
        try:
            value = json.loads(body.decode("utf-8"))
        except Exception as exc:
            raise ValueError("Request must be valid JSON.") from exc
        if not isinstance(value, dict):
            raise ValueError("Request must be a JSON object.")
        return value

    def do_OPTIONS(self) -> None:  # noqa: N802
        if not self._origin_allowed():
            self._json(403, {"ok": False, "error": "Origin not allowed."})
            return
        self.send_response(204)
        self._cors_headers()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if not self._origin_allowed():
            self._json(403, {"ok": False, "error": "Origin not allowed."})
            return
        path = urlparse(self.path).path
        if path != "/v1/health":
            self._json(404, {"ok": False, "error": "Not found."})
            return
        self._json(200, {
            "ok": True,
            "service": "AT THE CODE Open Voice",
            "version": "0.2",
            "runtime": "local/self-hosted",
            "retention": "none",
            "stt": {"ready": whisper_ready(), "engine": "whisper.cpp"},
            "router": {"ready": True, "engine": "Orish approved learning router"},
            "llm": {"configured": bool(LLM_URL), "usedByChildRoute": False},
            "tts": {"ready": tts_ready(), "engine": "Kokoro/local adapter" if tts_ready() else "device/browser fallback"},
        })

    def do_POST(self) -> None:  # noqa: N802
        if not self._origin_allowed():
            self._json(403, {"ok": False, "error": "Origin not allowed."})
            return
        path = urlparse(self.path).path
        try:
            payload = self._read_json()
            if path == "/v1/transcribe":
                encoded = str(payload.get("audioBase64", ""))
                if not encoded:
                    raise ValueError("audioBase64 is required.")
                try:
                    audio = base64.b64decode(encoded, validate=True)
                except Exception as exc:
                    raise ValueError("Audio data is not valid base64.") from exc
                if not audio or len(audio) > MAX_AUDIO:
                    raise ValueError("Audio turn is empty or too large.")
                transcript = transcribe_with_whisper(audio, str(payload.get("mimeType", "application/octet-stream")))
                self._json(200, {"ok": True, "transcript": transcript, "engine": "whisper.cpp", "retained": False})
                return

            if path == "/v1/speak":
                text = str(payload.get("text", "")).strip()
                if not text or len(text) > MAX_TEXT:
                    raise ValueError("Speech text is empty or too long.")
                audio, mime = render_tts(text)
                self._json(200, {
                    "ok": True,
                    "audioBase64": base64.b64encode(audio).decode("ascii"),
                    "mimeType": mime,
                    "retained": False,
                })
                return

            self._json(404, {"ok": False, "error": "Not found."})
        except ValueError as exc:
            self._json(400, {"ok": False, "error": str(exc)})
        except subprocess.TimeoutExpired:
            self._json(504, {"ok": False, "error": "Local voice engine timed out."})
        except subprocess.CalledProcessError:
            self._json(502, {"ok": False, "error": "Local voice engine failed. Check the gateway setup."})
        except RuntimeError as exc:
            self._json(503, {"ok": False, "error": str(exc)})
        except Exception:
            self._json(500, {"ok": False, "error": "Unexpected local voice gateway error."})


def main() -> None:
    server = ThreadingHTTPServer((HOST, PORT), VoiceHandler)
    print(f"AT THE CODE Open Voice gateway listening on http://{HOST}:{PORT}")
    print("No request body, transcript or voice text is intentionally logged by this development server.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()

#!/usr/bin/env bash
set -euo pipefail

# AT THE CODE V1.28 local voice bootstrap for macOS/Linux development.
# This script downloads/builds open-source runtime components only when YOU run it.
# It does not modify the PWA or commit model weights to Git.

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME="${ORISH_RUNTIME_DIR:-$ROOT/.runtime}"
WHISPER_DIR="$RUNTIME/whisper.cpp"
MODEL_NAME="${ORISH_WHISPER_MODEL_NAME:-base.en}"
VENV="$RUNTIME/venv"
mkdir -p "$RUNTIME"

need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing required tool: $1" >&2; exit 2; }; }
need git
need cmake
need python3
need ffmpeg

if [ ! -d "$WHISPER_DIR/.git" ]; then
  git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git "$WHISPER_DIR"
else
  echo "Using existing whisper.cpp checkout at $WHISPER_DIR"
fi

cmake -S "$WHISPER_DIR" -B "$WHISPER_DIR/build" -DCMAKE_BUILD_TYPE=Release
cmake --build "$WHISPER_DIR/build" -j --config Release

MODEL_PATH="$WHISPER_DIR/models/ggml-$MODEL_NAME.bin"
if [ ! -f "$MODEL_PATH" ]; then
  (cd "$WHISPER_DIR" && sh ./models/download-ggml-model.sh "$MODEL_NAME")
fi

if [ ! -d "$VENV" ]; then
  python3 -m venv "$VENV"
fi
"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/python" -m pip install -r "$ROOT/requirements-kokoro.txt"

# Kokoro uses espeak-ng for English fallback/phonemisation. Installation differs
# by operating system; keep it explicit rather than silently changing the host.
if ! command -v espeak-ng >/dev/null 2>&1; then
  echo
  echo "NOTE: espeak-ng is not installed. Install it with your OS package manager"
  echo "before using Kokoro (for example: brew install espeak-ng on macOS)."
fi

WHISPER_CLI="$WHISPER_DIR/build/bin/whisper-cli"
[ -x "$WHISPER_CLI" ] || { echo "whisper-cli was not built at $WHISPER_CLI" >&2; exit 3; }

cat > "$RUNTIME/local.env" <<EOF
ORISH_VOICE_HOST=127.0.0.1
ORISH_VOICE_PORT=8787
ORISH_VOICE_ALLOWED_ORIGINS=http://127.0.0.1:8000,http://localhost:8000
ORISH_WHISPER_CPP_BIN=$WHISPER_CLI
ORISH_WHISPER_MODEL=$MODEL_PATH
ORISH_FFMPEG_BIN=ffmpeg
ORISH_TTS_PYTHON=$VENV/bin/python
ORISH_TTS_ADAPTER=$ROOT/adapters/kokoro_tts.py
ORISH_KOKORO_LANG=a
ORISH_KOKORO_VOICE=af_heart
ORISH_KOKORO_SPEED=1.0
EOF

echo
echo "Local voice runtime prepared."
echo "Environment: $RUNTIME/local.env"
echo "Next: $ROOT/scripts/start-local-voice.sh"

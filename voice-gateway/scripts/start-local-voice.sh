#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
RUNTIME="${ORISH_RUNTIME_DIR:-$ROOT/.runtime}"
ENV_FILE="${ORISH_VOICE_ENV:-$RUNTIME/local.env}"
if [ ! -f "$ENV_FILE" ]; then
  echo "Local voice environment not found: $ENV_FILE" >&2
  echo "Run: $ROOT/scripts/install-local-voice.sh" >&2
  exit 2
fi
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a
PYTHON="${ORISH_GATEWAY_PYTHON:-python3}"
exec "$PYTHON" "$ROOT/server.py"

#!/usr/bin/env python3
"""TEST ONLY: copies the input bytes to the requested output path."""
from pathlib import Path
import sys
args=sys.argv[1:]
try:
    src=Path(args[args.index('-i')+1])
    dst=Path(args[-1])
except Exception:
    raise SystemExit(2)
dst.write_bytes(src.read_bytes() or b'fake-wav')

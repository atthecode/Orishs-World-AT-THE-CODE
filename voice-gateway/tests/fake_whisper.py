#!/usr/bin/env python3
"""TEST ONLY: emulates whisper.cpp output contract without a model."""
from pathlib import Path
import sys
args=sys.argv[1:]
try:
    base=Path(args[args.index('-of')+1])
except Exception:
    raise SystemExit(2)
Path(str(base)+'.txt').write_text('test voice turn', encoding='utf-8')

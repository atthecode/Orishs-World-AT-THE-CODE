#!/usr/bin/env python3
"""TEST ONLY: creates a tiny valid PCM WAV; never used in the child app."""
import math
import struct
import sys
import wave
from pathlib import Path
if len(sys.argv)!=3: raise SystemExit(2)
out=Path(sys.argv[2])
rate=8000
with wave.open(str(out),'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
    frames=[]
    for i in range(rate//20):
        sample=int(500*math.sin(2*math.pi*440*i/rate))
        frames.append(struct.pack('<h', sample))
    w.writeframes(b''.join(frames))

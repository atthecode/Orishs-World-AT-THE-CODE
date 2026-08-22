#!/usr/bin/env python3
"""End-to-end contract test for the local voice gateway using test-only adapters."""
from __future__ import annotations
import base64
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
PORT='18787'
env=os.environ.copy()
env.update({
    'ORISH_VOICE_HOST':'127.0.0.1',
    'ORISH_VOICE_PORT':PORT,
    'ORISH_WHISPER_CPP_BIN':str(ROOT/'tests/fake_whisper.py'),
    'ORISH_WHISPER_MODEL':str(ROOT/'tests/fake-model.bin'),
    'ORISH_FFMPEG_BIN':str(ROOT/'tests/fake_ffmpeg.py'),
    'ORISH_TTS_ADAPTER':str(ROOT/'tests/fake_tts.py'),
    'ORISH_TTS_PYTHON':sys.executable,
})
proc=subprocess.Popen([sys.executable, str(ROOT/'server.py')], env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
base=f'http://127.0.0.1:{PORT}'

def get(path):
    with urllib.request.urlopen(base+path, timeout=3) as r: return json.load(r)

def post(path, payload):
    req=urllib.request.Request(base+path, data=json.dumps(payload).encode(), headers={'Content-Type':'application/json'}, method='POST')
    with urllib.request.urlopen(req, timeout=3) as r: return json.load(r)

try:
    for _ in range(30):
        try:
            health=get('/v1/health'); break
        except Exception: time.sleep(.1)
    else: raise RuntimeError('gateway did not start')
    assert health['ok'] and health['stt']['ready'] and health['tts']['ready']
    stt=post('/v1/transcribe', {'audioBase64':base64.b64encode(b'fake-audio').decode(), 'mimeType':'audio/webm'})
    assert stt['transcript']=='test voice turn'
    tts=post('/v1/speak', {'text':'Hello explorer'})
    assert tts['ok'] and len(base64.b64decode(tts['audioBase64']))>100
    print('PASS: health + STT adapter + TTS adapter contracts')
finally:
    proc.terminate()
    try: proc.wait(timeout=2)
    except subprocess.TimeoutExpired: proc.kill()

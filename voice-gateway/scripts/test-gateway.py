#!/usr/bin/env python3
"""Smoke test the gateway health endpoint without sending voice/text."""
from __future__ import annotations
import json
import os
import urllib.request

url = os.getenv("ORISH_VOICE_HEALTH_URL", "http://127.0.0.1:8787/v1/health")
with urllib.request.urlopen(url, timeout=4) as response:
    data = json.load(response)
print(json.dumps(data, indent=2))
if not data.get("ok"):
    raise SystemExit(1)

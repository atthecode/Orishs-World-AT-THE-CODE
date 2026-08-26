from __future__ import annotations

import json
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IGNORE_DIRS = {".git", ".venv", "venv", "__pycache__"}


def iter_files(pattern: str):
    for path in ROOT.rglob(pattern):
        if any(part in IGNORE_DIRS for part in path.parts):
            continue
        if path.is_file():
            yield path


class IdCollector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []

    def handle_starttag(self, tag, attrs):
        for key, value in attrs:
            if key == "id" and value:
                self.ids.append(value)


def check_json(errors: list[str]) -> None:
    candidates = list(iter_files("*.json")) + list(iter_files("*.webmanifest"))
    for path in candidates:
        try:
            with path.open("r", encoding="utf-8") as handle:
                json.load(handle)
        except Exception as exc:
            errors.append(f"Invalid JSON: {path.relative_to(ROOT)}: {exc}")


def check_html_ids(errors: list[str]) -> None:
    for path in iter_files("*.html"):
        parser = IdCollector()
        try:
            parser.feed(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"HTML parse failed: {path.relative_to(ROOT)}: {exc}")
            continue
        seen: set[str] = set()
        duplicates: set[str] = set()
        for element_id in parser.ids:
            if element_id in seen:
                duplicates.add(element_id)
            seen.add(element_id)
        if duplicates:
            errors.append(
                f"Duplicate HTML id(s) in {path.relative_to(ROOT)}: "
                + ", ".join(sorted(duplicates))
            )


def check_required_pwa_files(errors: list[str]) -> None:
    for rel in ("index.html", "app.js", "styles.css", "manifest.webmanifest", "service-worker.js"):
        if not (ROOT / rel).is_file():
            errors.append(f"Missing required PWA file: {rel}")


def check_sensitive_files(errors: list[str]) -> None:
    disallowed_names = {".env", "id_rsa", "id_ed25519"}
    disallowed_suffixes = {".pem", ".p12", ".pfx"}
    for path in ROOT.rglob("*"):
        if any(part in IGNORE_DIRS for part in path.parts) or not path.is_file():
            continue
        if path.name in disallowed_names or path.suffix.lower() in disallowed_suffixes:
            errors.append(f"Potential secret/credential file committed: {path.relative_to(ROOT)}")


def main() -> int:
    errors: list[str] = []
    check_required_pwa_files(errors)
    check_json(errors)
    check_html_ids(errors)
    check_sensitive_files(errors)

    if errors:
        print("Static quality checks failed:")
        for error in errors:
            print(f" - {error}")
        return 1

    print("Static quality checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

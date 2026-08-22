> **V1.28:** the local runtime/model directory is Git-ignored; model binaries and environment configuration must not be committed. Production still requires authenticated TLS boundaries.

# Security — Orish's World @ THE CODE

## Prototype boundary
This repository starts as a fictional/demo-data-only prototype. Do not enter real child, family, school, health, safeguarding, case or professional information until production security, privacy and safeguarding gates have been completed.

## Non-negotiable rules
- Never commit API keys, service-role keys, passwords, signing certificates, private keys or child data.
- Browser/PWA code must never contain privileged backend credentials.
- Any future AI provider must sit behind a server-side gateway with rate limits, authentication and content-safety checks.
- Parent/guardian controls and private back-channel requests must not be accessible from child mode.
- No unrestricted child-to-child private messaging.
- No public child profiles or public child-photo features.
- Minimise collection and retention of child information.
- Production authentication must use secure, revocable sessions. A visual PIN alone is not sufficient for cloud account security.
- Sensitive pages must not be cached by the service worker.
- Generated AI game content must be data/configuration consumed by approved game engines, not arbitrary executable code.
- File uploads, if introduced, require type/size validation, malware scanning strategy and explicit access rules.

## Web controls
The prototype uses a restrictive Content Security Policy and no third-party trackers. Production deployment should add platform-level headers including CSP, HSTS, Referrer-Policy, Permissions-Policy and X-Content-Type-Options.

## Before live child data
Required: threat-model review, dependency/security scan, authentication test, authorisation test, data-retention design, deletion/export flow, privacy review, safeguarding review, backup/restore test and independent penetration/security testing appropriate to deployment risk.

## V1.2 Parent Gate and local profiles
- Parent Studio now has a local adult PIN gate.
- The raw PIN is not stored; on HTTPS/localhost the prototype stores a random salt plus a PBKDF2-HMAC-SHA256 verification value using Web Crypto (210,000 iterations in new V1.3 setups).
- Parent access is session-scoped and can be manually locked.
- Repeated failed PIN attempts receive a short in-memory cooldown.
- This local PIN is a **casual child-access barrier only**. It is not production authentication and must not be treated as protecting sensitive live child data from a technically capable person with device/browser access.
- Child profiles deliberately avoid date of birth, address, school, contact details and other unnecessary identifiers.
- Learning Passport records and private parent requests remain in local browser storage in this prototype.
- Production requires authenticated adult accounts, server-side authorization, encrypted transport, secure data storage, deletion/export workflows, audit controls, and independent security testing before real child information is used.

## V1.3 local activity separation
- Private parent-request wording is stored only in the parent-request store; the saved child mission contains the transformed child-facing title, intro, steps and learning metadata, not the private wording.
- Learning Passport export intentionally excludes private parent-request text.
- Mission and routine completion records are not behaviour scores and should not be used to rank, shame or punish a child.
- Kitchen Lab stores only a prototype ingredient/equipment list and a short adult food-safety note. Do not enter medical/allergy diagnoses or other sensitive health details in this prototype.
- Child-facing Kitchen Lab shows only recipes that the current parent-entered ingredient/equipment list can make; missing-item diagnostics are not exposed as child recommendations.
- Heat and knife actions in starter recipes are explicitly adult-tagged.


## V1.8 local accessibility preferences
Accessibility preferences are low-sensitivity presentation settings stored locally per prototype profile. They do not request or record a diagnosis. The key is included in the same local-data deletion path as the other prototype state. Memory Lab stores no card-by-card behavioural telemetry; only an optional compact completion/evidence record is created through the existing Learning Passport path.


## V1.9 news and summary data boundaries
- Good News Beacon is static in this release: no third-party news endpoint, cookie, tracker or remote content script is connected.
- Parent Learning Summary is computed in-memory from the active profile's existing Learning Passport records and local reward totals; no new summary transcript or behavioural dossier is required.
- Private Parent Studio requests and local Orish prompt text are intentionally outside the summary input path.
- Any future live-news ingestion must occur server-side or in an editorial system, never by exposing provider secrets or unrestricted feeds to the child-facing PWA.


## Observation Lab / device-permission boundary
V1.10 Observation Lab is deliberately permission-free: it uses static local scene data and native HTML controls. The module does not call camera, media capture, photo library, geolocation, WebRTC, biometrics or external computer-vision services. Future image-based observation features must not be enabled for children by silently expanding device permissions; they require a separate privacy/security review and explicit adult-facing design.

## V1.12 Sequencing engine
The Logic Lab is static local content. It performs no network calls, accepts no executable generated code, requests no device permissions and stores no separate personal-data dataset. Completion evidence flows only through the existing local Learning Passport/rewards boundaries.


## V1.12 transient text boundary
- Literacy text inputs are local DOM state only.
- `Store.addEvidence` receives aggregate metadata (completion, accuracy, attempts, hints) but not the answer string.
- The literacy engine performs no fetch/XHR/WebSocket calls and adds no external script, font or analytics dependency.

## V1.14 story-engine data boundary

The Story & Choice Lab runs entirely from bundled local story data. It makes no network request and requires no camera, microphone, location, contacts or photo-library permission. Runtime choice state remains in memory. Persistent evidence contains only completion metadata; exact choices and branching routes are deliberately excluded.


## V1.14 Maths data boundary
The Maths Lab is a same-origin local rules engine. It does not make external network requests, require a child account with a third party, or transmit answer attempts. Persistent evidence stores only aggregate completion/result metadata when the parent has enabled Learning Passport evidence.


## V1.15 transient research data
The Investigation Notebook and drawing canvas are intentionally transient. V1.15 does not automatically write the raw research question, claim, source notes, conclusion or canvas pixels into localStorage, Learning Passport records or any remote service. Completion evidence stores only learning metadata. Any future persistent notebook/export feature must be designed as an explicit user/adult-controlled action with appropriate data minimisation.

## V1.16 intelligence routing security
- `modules/orish-intelligence-engine.js` is a same-origin deterministic router with no fetch/XHR/WebSocket dependency.
- Routes are an explicit allow-list; the intelligence layer can launch existing reviewed engines only.
- No `eval`, `Function` constructor, dynamic script injection or arbitrary generated code execution is used.
- Child chat cannot reveal/change Parent PIN or safety settings through the routing layer.
- Provider/API secrets remain absent from the browser. Future AI integration must use a server-side gateway and strict schema validation before approved engine configuration reaches the client.


## V1.17 control-plane notes
The local Parent Gate now exposes a consolidated Safety & Parent Controls Centre. Controls are profile-scoped in `orish.v1.parentControls` and are treated as prototype preferences, not production authorization. Child navigation and local Orish routing enforce disabled Kitchen, Family, Good News and Mission areas, and the free-text composer respects the parent setting. Future networked capabilities are hard-coded off in the parent-controls engine rather than represented as writable browser flags.

The Privacy Dashboard reports record counts only and does not render private parent-goal text. Active-profile record deletion removes Learning Passport evidence, private parent-request history, missions and reward history while preserving profile/setup controls. Full local-data deletion still removes the adult PIN and all known Orish local-storage keys.

These controls do not replace server-side authorization, tenant isolation, secure account recovery, rate limiting, moderation, audit logging or a formal production security review.

## V1.18 visual/navigation boundary
V1.18 adds only same-origin navigation and local artwork. District filters do not change authorization or Parent Controls decisions; they only hide/show existing child destination buttons. The child quick dock has no Parent Studio shortcut and Mission HQ continues to check the active profile's parent controls. No CDN, analytics script, remote font, external image host or new browser permission is introduced.


## V1.19 release hardening
The service worker now caches only an explicit static shell and excludes future `/api/`, `/private/` and `/parent-data/` routes from service-worker caching. A deployable `_headers` template adds CSP, clickjacking, MIME-sniffing, referrer and Permissions-Policy protections on compatible hosts. Parent Studio local unlock state expires after 15 minutes of inactivity, and deleting a profile removes its profile-scoped local records. These controls improve the prototype but do not replace production authentication, server-side authorisation, secure backend storage, monitoring, penetration testing or child-safety review.

## V1.27 microphone and voice gateway boundary
V1.27 deliberately changes the deployable Permissions-Policy from `microphone=()` to `microphone=(self)` so the same-origin Orish experience can request audio **only after an explicit user gesture**. Camera, location and the other restricted device capabilities remain blocked. The app-level parent toggle is a UX/safety control, not production authorization; a live service must enforce voice eligibility server-side.

The browser never contains a speech/LLM provider secret. Future production traffic is intended for a same-origin `/api/voice` boundary, which remains excluded from service-worker caching. The development gateway binds to loopback by default, accepts only configured origins, limits body/audio/text size, avoids shell command construction, does not intentionally log child request bodies/transcripts and uses short-lived temp directories for local media conversion. Production still requires authenticated sessions, TLS, rate limiting, abuse controls, capacity isolation, hardened logging, security testing and formal child-safety/privacy review.

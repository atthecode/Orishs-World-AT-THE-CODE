> **V1.28:** new local-runtime threats include compromised model/runtime dependencies, resource exhaustion and accidental exposure of the localhost gateway; production mitigations remain required.

# Initial Threat Model

## Assets to protect
Child identity/profile data, parent back-channel requests, learning evidence, voice/transcript data, authentication sessions, school/organisation records, AI provider credentials and subscription data.

## Major threat classes
- Child bypassing parent controls
- Unauthorised adult viewing child records
- Cross-family or cross-school data leakage
- API-key exposure in client code
- Prompt injection / unsafe AI outputs
- Arbitrary AI-generated code execution
- XSS / injection
- Unsafe uploads
- Excessive data retention
- Sensitive data cached offline
- Account takeover
- Third-party tracking

## Design responses
Role separation, server-side authorisation, least privilege, minimal data, output constraints, structured game generation, strong CSP, no trackers, no secrets in browser code, secure-session design, explicit evidence permissions and production security testing.


## V1.15 additional threats
- **Misinformation / sensational claims:** mystery content can accidentally amplify myths. Mitigation: curated evidence packs, explicit fact/claim/hypothesis separation, competing explanations and uncertainty language.
- **Fabricated AI citations:** a future AI connection could invent references. Mitigation: Evidence Detective explicitly teaches citation verification and the local prototype contains no live AI-generated citations.
- **Sensitive research notes:** free-text notebooks could capture personal details. Mitigation: V1.15 keeps notebook text/drawing transient and does not automatically persist it.
- **Financial/legal overreach:** educational scenarios could be mistaken for advice. Mitigation: no real-money transactions, no investment solicitation, jurisdiction warnings and explicit educational/not-advice framing.

## V1.16 added threat cases
- **Prompt asks to bypass Parent Studio/security:** local router refuses to reveal/change security controls.
- **Prompt attempts arbitrary-code generation/execution:** architecture never executes generated code; only approved launchers are selectable.
- **Sensitive child prompt retention:** child prompt text is transient and excluded from Learning Passport/export paths.
- **Future model returns unsafe route/config:** production design requires schema validation, allow-listed engine IDs and server-side moderation before client delivery.


## V1.17 threats addressed in prototype controls
- **Child opens disabled feature through alternate navigation:** world-preview and Orish-route paths enforce Family/Kitchen/Good News/Mission permissions.
- **Young child uses free-text chat:** 0–2 remains hard-disabled; other bands respect the parent free-text toggle.
- **Family activity exposes unapproved relationship categories:** only adult-approved role labels are rendered.
- **Parent dashboard leaks private goal text:** privacy dashboard uses counts only.
- **Browser toggle activates future risky network capability:** future live AI, open-web search, public social, location and child camera/uploads are hard-coded false in the prototype engine.

Residual risk remains high for any future networked/production deployment; these local controls are UX/security-boundary prototypes, not a complete authorization system.


## V1.19 additional mitigations
- Cache only the known static application shell.
- Reserve future `/api/`, `/private/` and `/parent-data/` routes as non-service-worker-cached boundaries.
- Expire local Parent Studio unlock state after 15 minutes of inactivity.
- Remove orphaned profile-scoped records when a profile is deleted.
- Supply deployable response headers to reduce framing, MIME-sniffing, permission and referrer leakage risks on compatible hosts.

## V1.27 voice threat cases
- **Unexpected/background microphone capture:** mitigated by parent opt-in, explicit tap-to-talk, bounded 12-second turns and closing media tracks after every turn. No always-listening mode.
- **0–2 independent voice interaction:** forced off in the parent-control normaliser and disabled in the UI.
- **Raw child audio retained accidentally:** browser persistence is not used; the dev gateway uses a temporary directory and returns only a transcript. Production must verify retention independently.
- **Voice transcript bypasses safety routing:** transcript is fed into the same allow-listed Orish learning router as typed text; V1.27 does not send the child directly to an unrestricted LLM.
- **Gateway/model compromise or cross-origin calls:** dev gateway binds to loopback by default and permits configured origins only; production requires authenticated same-origin HTTPS, rate limits, isolation and monitoring.
- **Model licence/provenance risk:** model binaries are deliberately not bundled; exact code/model/voice licences and provenance must be reviewed before distribution.

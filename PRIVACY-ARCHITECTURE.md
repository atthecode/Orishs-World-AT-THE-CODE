> **V1.28:** voice model/runtime files are local infrastructure; raw voice and transient transcripts are not intentionally added to profile storage, Learning Passport or exports.

# Privacy Architecture

Planned logical separation:
- Child World
- Parent / Guardian Area
- Learning & Evidence Records
- School / Organisation Area
- AI Gateway
- Subscription / Billing metadata

Each area should receive only the minimum access it needs. School or professional access must never imply access to all family data. Parent-visible learning evidence should be separated from private AI operational logs.

Prototype data is local and fictional only. Production storage/provider choices are intentionally deferred until privacy, jurisdiction and security requirements are selected.


## V1.15 research notebook data minimisation
The on-screen Investigation Notebook can contain a child’s research question, claim, source notes, observations, conclusion and drawing. In V1.15 those fields are intentionally **not persisted by default**. The Learning Passport records only that research-documentation practice was completed and the learning objective. No canvas image, raw note text or AI-research prompt is uploaded or added to the profile store.

## V1.16 transient child prompts
The Orish Intelligence Layer processes the current child prompt in memory to select an approved local engine. Prompt text is not added to Learning Passport evidence, profile export, rewards history or Parent Learning Summary. The router may use the active profile's age band and optional interest tags, but does not read private Parent Studio request text. A production AI service would require a documented retention policy and server-side privacy controls before connection.


## V1.17 privacy dashboard and controls
- Parent-control preferences are stored locally per profile and contain boolean permissions plus approved family role categories; no family names are required.
- Privacy dashboard displays counts only for the active profile and does not display private Parent Studio wording.
- No Orish transcript store, raw voice store, location store or camera/photo store is introduced.
- Active-profile activity-record deletion is separate from full-device prototype deletion so a family can remove learning/history records without losing routine, kitchen, accessibility or safety setup.

## V1.18 visual assets and navigation
V1.18 uses only bundled local visual assets supplied for the project. No remote image request, CDN identifier, behavioural analytics or navigation-history profile was added. District selection is an in-memory UI state and is not written to the Learning Passport or Parent Summary.


## V1.19 deletion and cache boundary
Deleting a child profile removes profile-scoped learning evidence, private parent requests, missions, routines, kitchen setup, rewards, accessibility preferences and Parent Controls. The service worker caches application shell files only and is deliberately structured not to cache future child-data/API routes.

## V1.22 avatar configuration
My Avatar Lab stores only appearance configuration choices (mode, palette selections, hair, outfit, accent and view angle) locally against the active prototype profile. It does **not** ask for or store a child photograph, face scan, biometric template, camera feed or external avatar-service account. Avatar choices are not treated as evidence of race, ethnicity, gender or identity; they are creative appearance settings. Production avatar storage must remain profile-scoped and deletable with the child profile.


## V1.23 local 3D rendering

The GLB avatar model is packaged with the app and rendered locally. Avatar customisation does not require a selfie, camera stream, face geometry, biometric template, external asset upload, third-party character account, or network request to a model-generation service. The saved record remains a small set of configuration choices linked to the local demo profile.


## V1.24 in-world avatar preview
The saved explorer can be represented in Child World using an in-memory PNG snapshot generated from the local WebGL avatar canvas. This is a rendering of approved avatar geometry, not a child photograph or biometric. V1.24 does not upload or persist that PNG; the structured avatar choices remain the only profile avatar data stored locally.


## V1.25 culture-history privacy
The history engine stores curriculum participation only. It does not ask a child to declare race, ethnicity, religion, ancestry, migration history or family identity. Culture missions use fictional or non-personal examples by default.

## V1.27 voice-data boundary

The browser records only after an explicit tap and sends a bounded short turn to the configured AT THE CODE voice gateway. The browser app does not intentionally persist the raw audio or transcript. The development gateway uses short-lived temporary files only where local speech tooling requires them, does not intentionally log request bodies/transcripts, and deletes its temporary directory after the turn. Production must replace this development assumption with enforceable retention/deletion controls, authentication, access logging that excludes content, TLS and formal review.

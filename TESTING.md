> **V1.28:** adds `python3 voice-gateway/tests/smoke_test.py` for model-free gateway contract checks and `voice-gateway/scripts/doctor.py` for local runtime readiness.

# V1.7 prototype test notes

Checks run on the V1.7 source before packaging:

- JavaScript syntax check passed for `app.js`, service worker and every module.
- HTML/JavaScript ID reference check passed: no referenced UI IDs are missing and no duplicate HTML IDs were found.
- Existing Age Game Engine structural checks remain valid for 30 differentiated question-game levels.
- New Maker Engine structural test passed for **30 maker variants** (5 project families × 6 age bands).
- Every maker variant contains materials, age-specific safety text, an investigation question, learning objective and build/test steps.
- New Creative Engine structural test passed for **24 creative variants** (4 challenge families × 6 age bands).
- Every creative variant contains a brief, constraints and a learning objective.
- New Visual Sort Engine structural test passed for all **6 age-band games**.
- Every visual card maps to a valid destination zone.
- 0–2 visual mode is parent-led/shared; 13–16 visual mode uses observation/inference/hypothesis reasoning.
- Make With Orish, Creative Studio and Visual Sort use the existing Learning Passport and Explorer Rewards systems rather than adding a new personal-data store.
- No photo/video upload control, advertising library, tracker, external AI call or paid API was introduced.
- PWA cache list now includes Maker, Creative and Visual Game modules.
- Existing PBKDF2 adult PIN implementation remains unchanged.
- Private Parent Studio wording remains separate from child Mission HQ content and excluded from Learning Passport exports.

These are prototype engineering checks, not a penetration test, security certification, safeguarding approval or production-readiness declaration.


## V1.6 Kitchen checks
- JavaScript syntax check for app and kitchen module.
- 24-recipe count and six-category coverage.
- Every recipe has role-tagged steps, allergens, equipment, learning objective and four measurement representations.
- Matching logic distinguishes Ready / Almost There / unavailable.
- Serving-factor formatting tested at 0.5× and 3×.
- Cook Mode UI IDs and event wiring checked.
- Service-worker cache version advanced for the new shell.


## V1.7 Family Clubhouse checks
- Family Engine structural test covers **36 variants** (6 activity families × 6 age bands).
- All six age bands expose quiz, treasure, science, baking, story and build activities.
- Every family variant includes a learning objective and age-appropriate safety boundary; non-quiz activities include shared steps and quiz activities include team questions/answers.
- 0–2 family mode is adult-led/shared and does not create independent scoring.
- Family quiz has no individual score, timer, leaderboard or winner/loser state.
- Role selection stores only a transient role label in memory; no family member name is requested.
- Shared completion uses the existing Learning Passport and Rewards stores without saving family conversation, recordings or personal family details.
- Family module is included in the offline PWA shell cache.
- HTML ID/reference, duplicate-ID, JavaScript syntax and local HTTP smoke tests passed after the Family Clubhouse integration.


## V1.8 accessibility + memory test coverage
- verified all six age bands return a memory game with a non-empty, even-sized deck;
- verified each pair ID occurs exactly twice and deck card IDs are unique;
- verified Memory Lab uses native `<button>` cards, no countdown/timer UI and text labels alongside icons;
- verified Accessibility Centre controls have unique IDs and every `app.js` DOM reference resolves to an element in `index.html`;
- verified high-contrast, reduced-motion, text-size, spacing and simplified-visual selectors are present in CSS;
- verified accessibility module and memory module are included in the offline service-worker shell;
- verified the local-data deletion key list includes accessibility preferences;
- `node --check` passed for app, security store, accessibility engine, memory engine and service worker;
- static localhost smoke test returned the V1.8 shell successfully.


## V1.9 checks
- Good News engine contains six static demo cards and performs no fetch/network calls.
- Every Beacon card has a category, summary, hopeful context, learning fact and offline discussion/exploration prompt.
- Six age bands have distinct Good News interpretation guidance, including parent-led 0–2 and evidence/source reasoning for 13–16.
- Parent Learning Summary accepts only profile, Learning Passport evidence and reward totals.
- Summary period filters support 7 days, 30 days and all local records.
- Parent summary excludes private Parent Studio requests and Orish chat text by architecture.
- New modules are included in the service-worker shell cache.
- JavaScript syntax, DOM-ID references and local static-server loading are checked before packaging.

**V1.9 validation result:** passed local syntax, DOM-reference, static-content, privacy-path, service-worker-reference and HTTP smoke checks on 2026-08-20.


## V1.10 Observation Lab checks
- verified all six age bands return a structurally valid observation game;
- verified 0–2 and 2–4 use built-in find-it scenes and 4–16 use before/after comparison scenes;
- verified every target/change ID exists in the corresponding scene data;
- verified 7–16 reasoning activities include exactly one correct evidence-based answer;
- verified the observation module contains no fetch/network, camera, media-device, geolocation or WebRTC calls;
- verified Observation Lab uses native button targets and has no countdown/timer/leaderboard UI;
- verified Observation Lab DOM IDs are unique and every `app.js` ID reference resolves in `index.html`;
- verified the observation module is included in the offline service-worker shell cache;
- `node --check` passed for app, observation engine and service worker;
- local static HTTP smoke test loads the V1.10 shell and observation module.

**V1.10 validation result:** passed local structural, syntax, DOM-reference, permission-boundary, service-worker-reference and HTTP smoke checks on 2026-08-20.

## V1.12 Sequencing + Logic Lab checks
- verified all six age bands return a sequencing/planning game with 3–7 ordered steps;
- verified 0–2 is parent-led/shared and 13–16 uses a multi-stage investigation dependency-planning challenge;
- verified each sequencing step has a unique ID, visual icon, label and explanation;
- verified the engine uses accessible Up/Down buttons and does not require drag-and-drop;
- verified there is no timer, leaderboard, public score or network call in the sequencing module;
- verified hint/check/restart/save controls are present and wired to unique DOM IDs;
- verified completed Logic Lab activities reuse Learning Passport and Explorer Rewards stores rather than adding a new personal-data store;
- verified the sequencing module is included in the offline service-worker shell cache;
- JavaScript syntax, DOM-reference, module-structure and local HTTP smoke checks are run before packaging.

These prototype checks are not a penetration test, accessibility certification, safeguarding approval or production-readiness declaration.

**V1.12 validation result:** passed JavaScript syntax, six-age-band sequencing structure, duplicate/DOM-ID, permission-boundary, service-worker-reference and local HTTP smoke checks on 2026-08-20.


## V1.12 literacy/keyboard checks
- Validate all six age-band literacy configurations and their round counts.
- Validate choice indexes, builder targets and accepted typed-answer lists.
- Confirm exact punctuation rounds require the documented exact answer.
- Confirm typed practice text is never passed to Store.addEvidence or Rewards.recordActivity.
- Confirm Learning Passport detail contains only completion/accuracy/attempt/hint metadata.
- Confirm no typing timer, words-per-minute score, leaderboard or network request exists.
- Confirm the new engine is included in the same-origin offline service-worker shell.

**V1.12 validation result:** passed local structural, JavaScript syntax, six-age-band literacy data, transient-text privacy boundary, same-origin/offline cache and HTTP smoke checks on 2026-08-20.

## V1.14 checks

Run before packaging:
- JavaScript syntax checks for app.js and story-choice-engine.js.
- Validate all six age-band story graphs: start node exists; every non-ending node has at least two choices; every choice target exists.
- Confirm Story & Choice Lab IDs referenced by app.js exist exactly once in index.html.
- Confirm story-choice-engine.js is included in index.html and the service-worker shell.
- Confirm no story route/choice text is passed into `Store.addEvidence`.
- Confirm no camera, geolocation, media capture or external fetch is introduced by the new module.
- Local HTTP smoke test for index, app, module and service worker.

**V1.14 validation result (2026-08-20):** passed JavaScript syntax checks; 297 unique DOM IDs with all Story & Choice controls present; all six age-band branching graphs validated; exact route/choice persistence exclusion verified; no new camera/geolocation/media/network calls in the story module; service-worker inclusion verified; and local HTTP smoke tests returned 200 for the app shell, story module, service worker and stylesheet.


## V1.14 Maths Lab checks
- Validate all six age-band maths configurations.
- Validate each choice answer index and numeric answer.
- Confirm 0–2 is guided/no independent score.
- Confirm no timer/leaderboard/network dependency is introduced.
- Confirm Maths Lab module is cached for same-origin offline use.
- Confirm raw maths inputs are not added to Learning Passport evidence.

### V1.14 build verification completed
- JavaScript syntax checks passed for `app.js` and `modules/maths-game-engine.js`.
- All six Maths Lab age-band configurations loaded and every configured correct answer passed the engine evaluator.
- 315 HTML IDs checked with no duplicate IDs; only `mathsInput` and the pre-existing `literacyInput` are intentionally created dynamically at runtime.
- Service-worker same-origin shell references resolve, including the new Maths Lab module.
- Maths module scan found no fetch/XHR/WebSocket/external URL dependency.
- Local HTTP smoke test successfully served the app shell, Maths module and stylesheet.


## V1.15 Science Discovery + Evidence + Real-World Missions checks
- JavaScript syntax passed for `app.js`, `discovery-engine.js`, `life-skills-engine.js`, `kitchen-engine.js` and `service-worker.js`.
- Science Discovery structural test validated **36 expedition variants** (6 expedition families × 6 age bands).
- Mysteries & Unexplained structural test validated **30 mystery variants** (5 mystery families × 6 age bands), including age-adapted Bermuda Triangle, life-beyond-Earth, strange-signal, black-hole and ball-lightning cases.
- All 66 discovery/mystery variants include at least two evidence facts, investigation steps, a valid evidence-check answer and a learning objective.
- Real-World Missions structural test validated **18 variants** (AI Evidence Detective, Money Missions, Rights/Rules/Choices × 6 age bands).
- AI Evidence Detective and research modules add no fetch/XHR/WebSocket/geolocation/media-device dependency.
- Investigation Notebook raw text/drawing is not passed to `Store.addEvidence`; completion evidence records only learning metadata.
- 369 HTML IDs are unique and all 307 static `app.js` DOM references resolve except the two pre-existing runtime-created inputs (`literacyInput`, `mathsInput`).
- Service-worker shell contains 28 same-origin assets including both new V1.15 modules; cache revision advanced to `orish-world-v1-shell-16`.
- Honey safety regression test confirms `Cinnamon Honey Butter` and `No-Bake Oat Bites` are hidden in the 0–2 Kitchen view while remaining available to older age bands when ingredients/equipment match.
- Local HTTP smoke test returned 200 for the app shell, app script, new modules, service worker and stylesheet.

**V1.15 validation result (2026-08-20):** passed local structural, syntax, DOM-reference, privacy-boundary, honey-safety, same-origin/offline-cache and HTTP smoke checks. These are prototype engineering checks, not a penetration test, legal review, financial-services review, safeguarding approval or production-readiness declaration.

## V1.16 Orish Intelligence Layer checks
- JavaScript syntax passed for `app.js`, `modules/orish-intelligence-engine.js` and `service-worker.js`.
- Intelligence registry validated **20 approved routes** spanning mystery/science, space, body, evidence research, maths, money, law/civics, literacy, logic, observation, memory, story, maker, creative, kitchen, family, routines, Good News and Mission HQ.
- Routing regression prompts correctly selected Bermuda Triangle → Mystery Investigation, AI source checking → Evidence Detective, budgeting → Money Mission, fractions → Maths Lab, contracts/rights → Law & civics, bread baking → Kitchen Lab and paper bridge → Make With Orish.
- Harm/security checks refused a weapon-construction request and a Parent PIN bypass request. A normal educational password question remained allowed, confirming the security filter is not simply blocking the word “password”.
- Every successful route reports `approvedTemplateOnly:true`, `arbitraryCode:false` and `networkRequired:false`.
- Intelligence module scan found no `fetch`, XHR, WebSocket, geolocation, media-device, `eval` or dynamic `Function` dependency.
- Intelligence module has no direct Learning Passport or Parent Studio request persistence calls. Child prompt text remains transient in the current DOM chat only.
- **370 HTML IDs** are unique and all **308** static `app.js` DOM references resolve except the two intentional runtime-created fields (`literacyInput`, `mathsInput`).
- Service-worker shell contains **29** same-origin assets including `modules/orish-intelligence-engine.js`; cache revision advanced to `orish-world-v1-shell-17`.
- Local HTTP smoke test returned 200 for the app shell, app script, intelligence module, service worker and stylesheet.

**V1.16 validation result (2026-08-20):** passed local syntax, routing, safety-boundary, DOM-reference, privacy-boundary, same-origin/offline-cache and HTTP smoke checks. This remains a prototype test set, not a penetration test, safeguarding certification, production moderation review or guarantee of AI safety.

## V1.17 Safety & Parent Controls Centre checks
- Validate defaults for all six age bands; free-text Ask Orish must be false for 0–2 even if input attempts to enable it.
- Validate future live AI, web search, public social, location and camera/upload flags are always normalised to false.
- Validate family role selections accept only the four approved role IDs and never require names.
- Confirm central spoken/offline/evidence settings can mirror the existing active-profile preferences.
- Confirm disabled Kitchen, Family, Good News and Mission features are enforced in world navigation and Orish routing paths.
- Confirm the Privacy Dashboard obtains counts only and does not render Parent Studio private goal wording.
- Confirm active-profile record deletion removes evidence, parent-request history, missions and rewards while retaining profile, routine, kitchen, accessibility and parent-control setup.
- Confirm full local deletion includes the new parent-controls storage key.
- Confirm parent-controls module contains no fetch/XHR/WebSocket/geolocation/media-device/eval/dynamic Function dependency.
- Confirm new module is included in the same-origin service-worker shell.
- Run JavaScript syntax, unique/DOM-ID, service-worker reference and local HTTP smoke tests before packaging.

### V1.17 build verification completed
- JavaScript syntax passed for `app.js`, every module and `service-worker.js`.
- Parent-controls tests passed across all six age bands; 0–2 free-text Ask Orish cannot be enabled by stored input.
- All five future online capability flags remained hard-locked false even when tests attempted to save them as true.
- Approved-family-role filtering rejected an unrecognised `stranger` role and correctly preserved selected approved roles.
- Privacy deletion boundary test removed Learning Passport evidence, private parent goals, missions and rewards while retaining routines, kitchen setup and parent safety controls.
- **391 HTML IDs** are unique and all **325** static `app.js` DOM references resolve except the two intentional runtime-created fields (`literacyInput`, `mathsInput`).
- Service-worker shell contains **30** same-origin assets including `modules/parent-controls-engine.js`; cache revision advanced to `orish-world-v1-shell-18`.
- Parent-controls module scan found no fetch/XHR/WebSocket/geolocation/media-device/eval/dynamic-Function dependency.
- Static enforcement checks verified disabled Mission HQ, Kitchen Lab, Family Clubhouse and Good News navigation paths, approved-family-role rendering and central speech enforcement.
- Local HTTP smoke test returned 200 for the app shell, app script, parent-controls engine, security store, service worker, stylesheet and manifest.

**V1.17 validation result (2026-08-20):** passed local syntax, six-age-band parent-control, locked-future-capability, role-filter, privacy-deletion-boundary, DOM-reference, permission/network-boundary, same-origin/offline-cache and HTTP smoke checks. These remain prototype engineering checks, not a penetration test, safeguarding certification, legal/privacy compliance opinion or production authorization review.


## V1.18 Connected World + premium navigation checks
- Validate five named districts plus Whole World filter and confirm every world card has exactly one approved district assignment.
- Confirm district filtering only changes visibility and does not bypass Parent Controls enforcement.
- Confirm mobile quick dock is visible only on child-facing screens and hidden on Landing, Parent Gate and Parent Studio.
- Confirm quick-dock Mission and Rewards buttons use existing permission/reward engines.
- Confirm supplied local artwork resolves same-origin and no new external image/network dependency exists.
- Confirm manifest exposes local 192x192 and 512x512 app icons.
- Confirm all V1.18 artwork and icons are included in the service-worker shell.
- Confirm high-contrast, reduced-motion and simplified-visual accessibility selectors remain present.
- Run JavaScript syntax, duplicate-ID, static DOM-reference, service-worker reference and local HTTP smoke checks before packaging.


### V1.18 build verification completed
- JavaScript syntax passed for `app.js`, every module and `service-worker.js`.
- **401 HTML IDs** are unique and all **333 static `app.js` DOM references** resolve, excluding only the two intentional runtime-created fields (`literacyInput`, `mathsInput`).
- World Map contains **6 portal controls**: Whole World plus 5 named districts.
- All **19 child-world destination cards** have exactly one approved district assignment: Orish Core 3, Discovery 4, Skills Academy 6, Create & Make 3, Life & Family 3.
- Three supplied-art Featured Journey cards resolve locally to Science World, Maths Lab and Learning Adventures.
- Quick dock is wired to World, Orish, Mission HQ and Explorer Rewards, and its visibility logic excludes Landing, Parent Gate and Parent Studio.
- Existing Mission, Kitchen, Family and Good News Parent Controls checks remain present in navigation code.
- Manifest icons validated at **192×192** and **512×512**.
- Service-worker shell resolves **37 same-origin entries**, including all seven new V1.18 visual/icon assets; cache revision advanced to `orish-world-v1-shell-19`.
- No external image/script/font URLs were introduced in the HTML, and the changed shell/app contains no new geolocation, media-device, XHR, WebSocket, `eval` or dynamic-Function dependency.
- CSS brace balance passed, and high-contrast, reduced-motion, simplified-visual and text-size accessibility selectors remain present.
- Local HTTP smoke test returned 200 for the shell, app, stylesheet, manifest, service worker, key new assets and existing safety/intelligence modules.

**V1.18 validation result (2026-08-20):** passed local syntax, DOM-reference, connected-world structure, Parent Controls regression, manifest/icon, same-origin/offline-cache, permission/network-boundary and HTTP smoke checks. Visual appearance has been structurally reviewed but this remains a prototype engineering build, not final device QA, a penetration test, safeguarding certification or App Store approval.


## V1.19 Release Readiness checks
- Validate app/module JavaScript syntax.
- Validate unique IDs and app `$()` references, accounting for the two deliberately dynamic answer inputs.
- Validate manifest JSON, icon presence/dimensions and dedicated maskable icons.
- Validate every service-worker shell path exists and that unknown/API GETs are not runtime-cached.
- Validate Parent Studio session-expiry code and complete profile-scoped deletion code.
- Validate `_headers` security baseline.
- Fetch every shell resource over a local HTTP server.
- Physical device/browser rendering, service-worker offline runtime, VoiceOver/TalkBack and TestFlight remain release QA items and are not claimed by this local static test suite.


### V1.19 build verification completed
- JavaScript syntax passed for `app.js`, every module and `service-worker.js`.
- **409 HTML IDs** are unique; all **341 `app.js` `$()` references** resolve after accounting for the two intentional runtime-created inputs (`literacyInput`, `mathsInput`).
- Manifest JSON passed with `en-GB`, dedicated regular/maskable icons, and verified 192×192, 512×512 and Apple 180×180 icon dimensions.
- All **40 explicit service-worker shell entries** exist; source checks confirm future `/api/`, `/private/` and `/parent-data/` routes are excluded and unknown GETs are not runtime-cached.
- Source scan found no `eval`, `new Function`, geolocation, media-input capture, WebSocket or EventSource use.
- `_headers` contains CSP, Permissions-Policy, frame denial, MIME-sniffing protection and no-referrer baseline.
- Functional browser-storage harness verified current Parent PIN session state and profile deletion cascading across evidence, private parent requests, missions, routines, kitchen setup, rewards, accessibility and Parent Controls.
- Local HTTP server fetched all 40 precached shell resources successfully.
- Physical iPhone/iPad/Android rendering, true browser offline-service-worker execution, VoiceOver/TalkBack and TestFlight remain uncompleted QA and are intentionally not claimed.

**V1.19 validation result (2026-08-20):** core V1 feature build is complete and the package passed static/security-boundary/local-storage/local-HTTP release-readiness checks available in this environment. It is a controlled-testing prototype, not a production child-data system, penetration-tested release, safeguarding certification or App Store-approved application.

## V1.22 My Avatar Lab manual test
1. Enter the child world and open Create & Make → My Avatar Lab.
2. Verify the character reacts to Real Me / Creative Me and palette changes.
3. Confirm cyan, blue, pink, orange, purple and mint are available only when Creative Me is selected.
4. Drag/swipe the viewport through multiple full rotations; test Turn left, Turn right, Front and keyboard arrows.
5. Toggle auto-spin, then enable OS/browser reduced motion and confirm auto-spin does not start.
6. Save an avatar, leave the panel, reopen it and confirm the same local configuration loads for that profile.
7. Verify no camera/photo permission prompt, remote request, third-party logo or external character-site frame appears.
8. Delete the child profile and verify its avatar configuration is removed from the local avatar store while other profiles remain intact.


## V1.23 real 3D avatar manual test

1. Open My Avatar Lab on a WebGL-capable phone/tablet.
2. Confirm the status badge changes from `Loading local 3D model…` to `Real 3D • local GLB`.
3. Swipe/drag horizontally and verify the actual GLB model rotates through 360 degrees.
4. Use Turn left / Front / Turn right and confirm the same 3D model changes orientation.
5. Change natural skin tones and then Creative Me fantasy colours; confirm skin meshes update without a network call.
6. Switch all six hair styles and at least three hair colours. Only the chosen hair group should be visible.
7. Switch Explorer, Scientist, Space, Chef and Artist outfits. Only the selected outfit-specific mesh group should be visible.
8. Change accent colour and verify the chest/trim/accessory accents update.
9. Enable Auto spin; verify rotation. With reduced motion enabled, confirm auto-spin is blocked.
10. Save, reload, reopen Avatar Lab and confirm the saved choices restore.
11. Test offline after the service worker has cached the shell. The local GLB should still load.
12. On a device/browser with WebGL disabled, confirm the original fallback avatar remains usable and the status clearly says fallback is active.

Automated static checks should verify the GLB 2.0 header, JSON/BIN chunks, expected named mesh groups, JavaScript syntax, service-worker cache inclusion and that no external model/CDN URLs are present in the runtime files.


## V1.24 living avatar manual test

1. Open My Avatar Lab on a WebGL2-capable phone/tablet. Confirm subtle idle movement and periodic blinking.
2. Tap Wave, Power Pose and Celebrate. Confirm motion returns to idle and does not break rotation/customisation.
3. Enable reduced motion at OS/browser level. Confirm procedural animation stops while manual rotation/customisation remains usable.
4. Save an avatar while the 3D view is visible, return to World, and confirm “My Explorer” displays the locally rendered avatar preview (or the safe fallback badge if capture is unavailable).
5. Tap Edit avatar from World and confirm the saved choices reload.
6. Delete the child profile and confirm avatar settings are removed under the existing profile-delete cascade.


## V1.25 global history manual test
1. Open Discovery District → Global History & Culture. Confirm the animated globe and source-backed intro appear.
2. Open at least Alice Ball, Frederick Jones, George Carruthers and Kofoworola Pratt. Confirm journey timeline, context, question and source trail populate.
3. Switch to Culture Explorer and open Kente, Whakapapa, Día de los Muertos and Ukiyo-e. Confirm each pack has community/place context, a respect note and an original/off-screen mission.
4. Verify no source row is a live external link in child mode.
5. Change age band from 0–2 through 13–16 and confirm the age guidance changes without exposing an independent baby quiz.
6. Complete a history mission with Learning Passport enabled. Confirm only the learning outcome is saved; no private ancestry, ethnicity, religion or family history is requested or retained.
7. Ask Orish for “Black history”, “inventor”, “culture” and “heritage”. Confirm routing points to Global History & Culture.
8. Test offline after caching; the history engine and starter source metadata should remain available without network access.


## V1.26 — Are We Alone?

Added the age-adaptive, source-backed extraterrestrial-life evidence investigation. See `ARE-WE-ALONE.md`. Children do not get unrestricted web access; claims are never upgraded to facts without verifiable evidence.

## V1.27 Open Voice checks

- [ ] Two-way voice is OFF for a new profile.
- [ ] 0–2 cannot enable child microphone mode.
- [ ] Microphone permission is requested only after the Talk button is pressed.
- [ ] Pressing Talk while Orish is speaking interrupts current playback before recording.
- [ ] Recording stops on user stop or after 12 seconds.
- [ ] Microphone tracks close after every completed/cancelled turn.
- [ ] No raw voice or transcript key is written to localStorage.
- [ ] Service worker does not cache `/api/voice` or other `/api/` routes.
- [ ] Unavailable gateway fails closed without recording a turn.
- [ ] Gateway with STT not configured reports setup state rather than pretending voice succeeded.
- [ ] Configured local STT transcript re-enters the approved Orish router.
- [ ] Optional TTS failure falls back safely to device/browser speech where available.
- [ ] Camera, location and open-web permissions remain unavailable.

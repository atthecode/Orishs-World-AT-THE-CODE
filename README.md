# Orish’s World @ THE CODE

**Current prototype: V1.28 — Local Voice Runtime** — keeps the V1.27 parent-controlled voice boundary and adds a practical self-hosted runtime path: a `whisper.cpp` STT adapter, a local Kokoro TTS adapter, private runtime setup/start scripts, model/runtime Git exclusions, a readiness doctor and an end-to-end adapter contract test. The child route still goes through Orish’s approved learning router rather than directly into an unrestricted LLM.

## V1.28 now working locally — Local Voice Runtime

The code required to connect locally installed speech models is now present. `voice-gateway/scripts/install-local-voice.sh` can build `whisper.cpp`, download a selected local GGML model, create a private virtual environment and install the optional Kokoro runtime when executed on a development computer. Nothing runs or downloads automatically, and the repository does not bundle model weights. See `LOCAL-VOICE-RUNTIME.md`.

The gateway now supports a separate TTS Python environment, reports local/self-hosted runtime state without exposing paths or child content, and includes a model-free smoke test for the STT/TTS adapter contracts. Real model quality/latency still requires installation and physical-device testing.

## V1.27 now working locally — Open Voice Foundation

The child app now has a real microphone interaction path, but it is **OFF by default** for every profile and locked off for ages 0–2. A grown-up must enable Two-way microphone with Orish in Parent Studio. The microphone starts only after the child taps the button; recording stops after the turn; browser microphone tracks are closed; raw audio and transcripts are not intentionally added to localStorage, Learning Passport or exports.

The new `voice-gateway/` is a zero-dependency Python development server. When configured with a local `whisper.cpp` executable/model and `ffmpeg`, it can transcribe the short turn and return only text to the existing approved Orish learning router. An optional reviewed local TTS adapter can supply Orish speech; otherwise the existing device/browser read-aloud remains the fallback. V1.27 deliberately does **not** route a child directly into an unrestricted open LLM. See `OPEN-SOURCE-VOICE.md` and `voice-gateway/README.md`.

## V1.26 now working locally — Are We Alone? Evidence Investigation

V1.26 adds an age-adaptive investigation that separates confirmed scientific knowledge, plausible possibilities, reported UAP observations and extraordinary claims. It teaches children to ask what evidence would actually be needed before treating extraterrestrial contact as established fact.

## V1.25 now working locally — Global History, Culture & Changemakers

V1.25 adds a permanent Discovery District pathway for source-backed Black history and global culture learning. The first local pack includes eight Black changemaker journeys across chemistry, engineering, space science, nursing, journalism, sport and community organising, plus four Culture Explorer packs. The interface uses an animated world-history globe, journey timelines, age-adaptive evidence questions, off-screen creative missions and visible source trails rather than a static list of fact cards.

The child app does **not** open external source websites. It shows the source organisation/title while retaining the existing no-open-web boundary. Culture packs include explicit anti-stereotype/context notes, and no activity requires a child to disclose ethnicity, religion, migration history or ancestry. See `GLOBAL-HISTORY.md`.

## V1.24 now working locally — living 3D avatar

V1.24 keeps the local **GLB 2.0** model and AT THE CODE WebGL viewer, then adds subtle idle life, blinking, procedural poses and a local in-world explorer companion. The character still rotates 360 degrees and responds live to skin colour, hair, outfit and accent choices without sending the child to a third-party character website or calling a paid API.

The V1.22 renderer remains built in as a fallback if WebGL is unavailable. The GLB remains original prototype geometry and the new movement is procedural rather than a production skeletal rig. See `LIVING-AVATAR.md`, `REAL-3D-AVATAR.md` and `CHARACTER-FORGE.md`.

## V1.22 historical foundation — My Avatar Lab

V1.22 keeps the V1.21 cinematic partner showcase and all existing learning engines, then adds the first **My Avatar Lab** foundation. Children can switch between Real Me and Creative Me, choose inclusive natural skin tones or fantasy colours such as cyan, blue, pink, orange, purple and mint, choose hair style and colour, pick an explorer/science/space/chef/artist outfit, change accent colour, use Surprise Me, swipe/drag or keyboard controls to rotate the character through 360 degrees, optionally auto-spin it, and save the configuration locally to the active demo profile.

The current V1.22 figure is an **original AT THE CODE prototype renderer**, not a claim that a finished production GLB character library already exists. It proves the child interaction, privacy and data model while preserving a clean upgrade path to reviewed GLB/GLTF character assets. No child photo, camera feed, face scan, biometric identification, third-party branded character website or paid API is used. See `CHARACTER-FORGE.md` for the white-label 3D asset pipeline.

## V1.21 now working locally — Cinematic Interactive Showcase

V1.21 keeps the **core V1 feature build** intact and adds a cinematic, interactive partner walkthrough on top of the safer prototype release preparation. The connected V1.18 world remains intact, while the PWA shell, install metadata, parent-session handling and local-data deletion boundaries are tightened for controlled testing.

The service worker now precaches only an explicit list of static application files. Unknown same-origin requests are not runtime-cached, and future `/api/`, `/private/` and `/parent-data/` routes are deliberately outside the service-worker cache boundary. The manifest now separates regular and maskable icons and includes an Apple touch icon for better Home Screen behaviour.

Parent Studio includes a local App & Device Readiness card showing connection, installed/standalone mode and service-worker state without analytics. The local Parent Studio unlock expires after 15 minutes of inactivity, and deleting a child profile now removes all of that profile's scoped prototype records rather than leaving orphaned local data.

**Core V1 build sections are now complete.** Physical-device QA, production security/backend work and store submission remain separate release steps.

## V1.17 now working locally — Safety & Parent Controls Centre

V1.17 consolidates the most important parent-facing safety settings into one profile-specific control centre. A grown-up can allow or disable free-text Ask Orish, spoken support, offline activities, Learning Passport evidence, Family Clubhouse, Kitchen Lab, Good News Beacon and parent-created missions. Family Clubhouse can also be limited to approved role labels (Parent/Guardian, Sibling, Grandparent or Other Approved Family) without storing family names.

The controls are enforced in the child experience: disabled Kitchen/Family/Good News/Mission areas cannot be opened through normal world navigation or Orish route buttons; free-text Ask Orish can be disabled while curated quick prompts remain available; 0–2 free-text remains locked off regardless of the switch; and spoken support respects both the existing profile/accessibility settings and the central parent control.

A local Privacy & Data Dashboard shows counts for Learning Passport records, private parent goals, missions and profiles without exposing the underlying private wording. A parent can delete the active profile's activity records (evidence, private goal history, missions and reward history) while keeping the profile, routines, kitchen setup, accessibility preferences and safety controls. The existing full-device prototype deletion remains available separately.

Future live generative AI, open-web search, public social features, location and child camera/uploads are visibly **locked OFF** in this browser prototype. They are not browser toggles and would require a reviewed production architecture, server-side gateway and explicit parent controls before being considered.


## V1.16 now working locally — Orish Intelligence Layer

V1.16 connects the previously separate learning engines through a local, deterministic Orish routing layer. A child can ask about a topic in ordinary language and Orish selects an approved route based on the request, active age band and optional locally stored interests. The router currently exposes 21 approved pathways covering science/mysteries, space, human body, evidence research, maths, money, law/civics, literacy, logic, observation, memory, branching stories, making, creativity, kitchen, family activities, routines, Good News and Mission HQ.

This is intentionally not a free-form code generator. Orish chooses from existing reviewed engines and passes no arbitrary generated code into the child app. Child chat text is used transiently for the current response and is not added to the Learning Passport or exported profile data. Parent Studio private back-channel wording is not read into the child router. Safety patterns also prevent the child chat from revealing Parent PIN/security settings or converting clearly harmful/explicit requests into games.

The £0 prototype remains fully local: no paid model, no external AI request, no tracking, and no network dependency for routing. A future live AI model can sit behind a secure server-side gateway while preserving this approved-engine boundary.

## V1.15 now working locally
- premium mobile-first Orish's World shell;
- age experiences from 0–2 through 13–16;
- 0–2 parent-led mode rather than independent baby AI chat or competitive scoring;
- true age-adaptive Space, Human Body, Maths, Paper Flight and routine/reflection game content;
- 30 age/game combinations in the local question-game content engine;
- Science World topic chooser with mature evidence/systems reasoning for teens;
- local child profiles with minimal information only;
- private Parent Studio with a local adult PIN gate;
- active-profile switching for families;
- curriculum framework starter mapping for England, Scotland, Wales, Northern Ireland, US starter tags and flexible homeschool;
- Parent Studio private back channel that creates a child-facing mission without quoting the adult's wording;
- Mission HQ with playable parent-created missions and non-graded Learning Passport evidence;
- configurable Morning Launch and Night Landing routines with positive, non-punitive step tracking;
- Kitchen Lab starter matcher using parent-entered ingredients/equipment only;
- Kitchen steps tagged MY TURN / TOGETHER / GROWN-UP TURN;
- free browser speech playback where supported;
- local safe Orish prompt prototype — no message is sent to an AI provider;
- automatic local Learning Passport evidence when enabled;
- local Explorer Rewards with stars, badges, explorer levels and cosmetic milestone items;
- repeat-reward limiting so replay is welcome without reward grinding;
- Learning Passport JSON export excludes private Parent Studio request wording;
- local Learning Passport print view;
- offline PWA service worker;
- security, child-safety, privacy, AI-safety and threat-model documents.

### New in V1.5 — Make With Orish
- **5 offline maker project families × 6 age bands = 30 age-adapted maker experiences**;
- Paper Flight, Paper Bridge, Parachute, Transforming Origami Star/geometry and Fold-a-Book projects;
- 0–2 versions are explicitly adult-led and use safer large-material shared exploration;
- 7–12 versions add predictions, fair tests and measurement;
- 13–16 versions add controlled variables, repeated trials, constraints, uncertainty and design trade-offs;
- maker activities are designed to send the child **off screen** to build/test;
- completing a project stores a compact learning record, not a photo or video of the child.

### New in V1.5 — Creative Studio
- **4 creative challenge families × 6 age bands = 24 age-adapted creative briefs**;
- world-building, visual storytelling, habitat/system design and visual-symbol/interface design;
- teen briefs include evidence vs speculation, systems constraints, accessibility and user testing;
- no artwork, handwriting, photo or personal story content needs to be uploaded or stored;
- Learning Passport records only the learning completion/objective.

### New in V1.5 — Visual Sort Engine
- the first richer reusable visual mini-game beyond multiple choice;
- tap-to-select + tap-zone works on touch devices, with drag/drop available where supported;
- 6 differentiated age experiences:
  - 0–2 shared picture sorting;
  - 2–4 Sky/Ground;
  - 4–6 Earth/Sky/Space;
  - 7–9 Star/Planet/Moon;
  - 10–12 body-system classification;
  - 13–16 Observation/Inference/Testable Hypothesis;
- visual activity completion can create Learning Passport evidence and Explorer Stars without storing free-form child content.


### New in V1.6 — full Kitchen Lab
- **24 curated starter recipes across 6 areas**: Bread, Homemade Butter, Cakes, Microwave Cakes, No-Heat and Family Baking;
- ingredient + equipment matching against the parent-saved kitchen list;
- a separate **Almost there** section for recipes missing only one or two things;
- measurement modes for metric, imperial, cups/spoons and practical no-scales measures;
- batch scaling from ½× through 3×;
- age-aware role presentation: very young children stay in Together/Grown-Up roles while older children can receive MY TURN steps where safe;
- one-step-at-a-time **Cook Mode** with optional per-step timers;
- heat, knives, ovens, microwaves, hot pans and final doneness remain adult responsibilities;
- recipe completion can save a compact Food & Life Skills Learning Passport record and local Explorer reward;
- no recipe photo, child photo, voice recording or free-form food/health record is required.

### New in V1.7 — Family Clubhouse
- **6 cooperative family activity families × 6 age bands = 36 age-adapted experiences**;
- Family Team Quiz, Safe Treasure Hunt, Family Science Challenge, Bake Together Mission, Family Story Circle and Build Together;
- role-only joining for Parent/Guardian, Sibling, Grandparent or Other Approved Family — names are not required or stored;
- quizzes are solved as a team with no individual ranking, speed pressure or loser state;
- treasure hunts explicitly prohibit unsafe hiding/search areas, climbing, unsupervised outside searching, locked-room play and similar risks;
- science challenges use low-risk household materials and become more evidence-focused for older children;
- family cooking routes back through Kitchen Lab safety roles rather than bypassing adult heat/knife controls;
- story activities never require disclosure of private family experiences and no family recordings are required;
- completion can save a compact shared Learning Passport record and one shared Explorer Star, while family names, recordings, scores and discussion content stay out of storage;
- Family Clubhouse has **no public profiles, stranger matching, child-to-child private messaging or location sharing**.


### New in V1.8 — Accessibility Centre
- child/family-facing presentation controls that do **not** require a diagnosis or explanation;
- standard / large / extra-large text modes;
- high-contrast presentation;
- reduced-motion override in addition to the browser/OS `prefers-reduced-motion` support already present;
- spacious-text option and simplified decorative visuals;
- optional spoken support using the browser’s free speech synthesis where available and where the active Parent Studio profile permits read-aloud;
- settings are stored locally per active profile (or as a local demo preference when no profile exists);
- accessibility settings are removed by the existing “Delete all local prototype data” control;
- keyboard focus remains visible and activities avoid relying on colour alone.

### New in V1.8 — Memory + Matching Engine
- a second reusable richer game engine with **6 materially different age experiences**;
- 0–2: parent-led two-pair shared picture matching;
- 2–4: three familiar-picture pairs;
- 4–6: numeral ↔ quantity matching;
- 7–9: Solar System object ↔ fact matching;
- 10–12: organ/structure ↔ body function matching;
- 13–16: experimental-design/evidence term ↔ precise definition matching;
- no countdown, speed ranking or loser state;
- every card is a native keyboard-focusable button with a text label as well as an icon;
- matched learning can be saved to the local Learning Passport and Explorer Rewards systems without storing free-form child conversation.


### New in V1.9 — Good News Beacon
- child-facing hopeful-news prototype using **six manually written and manually approved demo cards only**;
- cards are explicitly labelled as demo/example content rather than live/current reporting;
- no RSS/news API, advertising, recommendation tracking, browser fingerprinting or breaking-news alert stream;
- age-adaptive interpretation changes from grown-up-led noticing at 0–2 through evidence, uncertainty and source-checking prompts at 13–16;
- categories include Nature, Science, Community, People, Earth and Space;
- reading a Beacon card is not scored, rewarded or stored as a child behaviour/history event;
- future live retrieval must remain behind an editorial/safety review gate rather than publishing directly to children.

### New in V1.9 — Parent Learning Summary
- parent-only summary generated locally from compact Learning Passport records and Explorer Reward totals;
- selectable 7-day, 30-day or all-local-record views;
- shows activity count, learning areas, recent objectives, recent records and optional scored-question accuracy where a scored game exists;
- does **not** read private Parent Studio requests, Orish chat text, family discussions, artwork, photographs, voice, location or raw child free-text;
- summary is an informational learning overview, not a diagnosis, behaviour grade or formal educational assessment.


### New in V1.10 — Observation / Hidden Object / Spot-the-Change Engine
- a third reusable richer visual game engine across all six age bands;
- 0–2 uses a parent-led shared Look & Find activity with no independent scoring;
- 2–4 uses calm familiar-object visual scanning;
- 4–6 introduces simple before/after Spot What Changed play;
- 7–9 adds a Signal Deck evidence hunt and a direct-observation check;
- 10–12 compares changing lab conditions and asks for an evidence-safe conclusion;
- 13–16 becomes an Evidence Lab that distinguishes direct observation from causal inference;
- no camera, microphone capture, photo upload, facial recognition, location, countdown, leaderboard or stranger interaction is used;
- every interactive evidence item is a native keyboard-focusable button and can be completed by tap/click;
- activity completion can save only a compact learning record and Explorer Reward, not a screenshot or visual recording of the child.


### New in V1.15 — Science Discovery expansion
- Science World now contains **six additional expedition families** across all six age bands: Fossils/Dinosaurs, Weather, Caves & Minerals, Oceans, Plants and Experiment Design;
- adds a **Mysteries & Unexplained** wing with curated, age-adapted case files around the Bermuda Triangle, possible life beyond Earth, strange signals, black holes and ball-lightning reports;
- mystery content is deliberately framed as investigation rather than sensational fact: children separate observations, claims, hypotheses, source quality, alternative explanations and uncertainty;
- older explorers practise comparison groups, exposure/risk reasoning, bias, replication, controls and converging evidence;
- no live mystery/news feed or unrestricted web search is connected in this £0 prototype.

### New in V1.15 — AI Evidence Detective + Investigation Notebook
- a dedicated research-literacy path teaches children to use AI for **questions, search terms, counter-questions and source ideas**, not as automatic proof;
- age progression runs from parent-led “look and notice” through claim-check-source habits to teen lateral reading, citation verification, primary/high-quality source tracing and hallucination awareness;
- includes a local Investigation Notebook for research question, claim, source/evidence, observation-vs-inference, conclusion and confidence;
- includes a touch/pointer drawing canvas for labelled diagrams, maps and evidence sketches;
- raw notebook text and drawings are **transient by default and are not added to the Learning Passport**; only the learning skill/completion may be recorded.

### New in V1.15 — Financial + legal/civic literacy
- **Money Missions** scale from shared pretend-token play to saving, budgeting, unit-price comparison, subscriptions, borrowing cost, interest and risk;
- **Rights, Rules & Choices** scales from simple safety/rule distinctions to consumer/online choices and teen legal reasoning;
- teen legal-literacy missions explicitly separate facts, evidence, jurisdiction and the rule that may apply;
- UK and US curriculum modes display jurisdiction warnings because laws vary by nation/state/local area;
- the app does not present personalised legal or financial advice.

### V1.15 kitchen safety patch
- honey-containing prototype recipes are hidden from the broad 0–2 age band because exact age is intentionally not collected and honey is not suitable for infants under 12 months;
- this avoids collecting date of birth simply to resolve a food-safety rule.

## Important prototype boundary
This is still a fictional/demo-data build. Browser local storage and a local PIN are not a production child-data security system. Do not enter real sensitive child information, medical details or safeguarding information. Before live family, school or service use, add real adult authentication/authorization, secure backend data boundaries, formal privacy/safeguarding design, testing and legal review appropriate to the deployment.

## Run it
Serve the folder from `localhost` or HTTPS so the PWA service worker and Web Crypto parent-gate features work correctly. A simple static development server is enough.

## Cost rule
The core code project stays free-first. Any future feature that genuinely needs a paid external service must be separated, clearly flagged and explicitly approved before being connected.


## V1.12 Logic Lab
A reusable sequencing/planning engine now scales from parent-led first/next/last ordering through early procedures, the water cycle, fair-test planning and teen investigation dependency planning. It is untimed, keyboard/touch accessible, local-only and uses the existing Learning Passport/rewards stores.


## V1.12 Reading, Spelling & Keyboard Lab

- Adds one reusable literacy/keyboard engine across all six age bands.
- 0–2 remains parent-led first-word sharing with no independent typing or score.
- 2–4 focuses on first sounds and letter recognition.
- 4–6 adds short-word building with optional letter buttons or keyboard input.
- 7–9 adds spelling, sentence typing, capitals and punctuation.
- 10–12 adds short comprehension, evidence retrieval and precise typed answers.
- 13–16 adds mature precision editing, cautious claims and academic/media-literacy vocabulary.
- There is no typing-speed leaderboard. Accuracy and revision are prioritised.
- Free-text practice answers are not written to the Learning Passport or local profile store; only completion/accuracy/support metadata can be retained.

## V1.14 — Interactive Story & Choice Engine

V1.14 adds a reusable local branching-story engine. The active age band changes the story content from parent-led shared attention (0–2) through early turn-taking and routine repair, science-team communication, evidence mysteries, and teen-level uncertainty/evidence analysis.

Privacy rule: story choice labels and exact routes are transient and are not written to the Learning Passport. Evidence stores only completion/support metadata. There is no behaviour score, personality label, leaderboard, advertising or external AI call.


## V1.14 — Full Maths Lab

- New age-adaptive Maths Lab for all six age bands.
- 0–2 stays parent-led with quantity, size, shape and pattern language and no independent score.
- 2–4 adds counting, comparison, shapes and repeating patterns.
- 4–6 adds addition, subtraction, halves, measurement and geometry.
- 7–9 adds multiplication, fractions, money, unit conversion and perimeter.
- 10–12 adds fractions, percentages, ratio, area, data and probability.
- 13–16 adds algebra, rates, probability, Pythagoras, statistics and percentage-change reasoning.
- No countdown, WPM-style pressure, leaderboard, ads, paid API or external maths service.
- Learning Passport records summary outcomes only; raw working and answers are not retained.


## V1.20 release-readiness changes
- Safer service worker: only the explicit static shell is cached; future `/api/`, `/private/` and `/parent-data/` paths are excluded.
- Install-ready manifest metadata, dedicated maskable icons and an Apple touch icon.
- Parent-only App & Device Readiness panel for network, installed mode and offline-shell status.
- 15-minute Parent Studio unlock expiry while inactive.
- Deleting a child profile also removes that profile's evidence, private parent requests, missions, routines, kitchen setup, rewards, accessibility and safety-control records.
- `_headers` supplies a strong response-header baseline for compatible static hosts such as Cloudflare Pages.
- The prototype still requires a production backend/authentication model and formal child privacy, safeguarding and security review before real child data.


## V1.21 Cinematic Interactive Partner Showcase

V1.21 replaces the static partner-summary presentation with an animated, interactive showcase route. Five visual chapters use moving scene layers, Orish narration, tappable hotspots and direct launches into the real age-6 world, Fossil Detective, Science, Evidence, Maths, Reading and Memory engines. It still clearly separates future cloud/AI integration, explains the cost-per-child testing model, and surfaces existing child-safety guardrails without claiming production readiness. No external API, tracking service or paid AI dependency was added.


## V1.26 — Are We Alone?

Added the age-adaptive, source-backed extraterrestrial-life evidence investigation. See `ARE-WE-ALONE.md`. Children do not get unrestricted web access; claims are never upgraded to facts without verifiable evidence.

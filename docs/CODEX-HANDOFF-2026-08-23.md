# ORISH’S WORLD @ THE CODE — FULL CODEX BUILD HANDOFF

**Date:** 23 August 2026

**Repository:** `atthecode/Orishs-World-AT-THE-CODE`

This is now the master implementation handoff for Codex. Read this file together with:

- `docs/PREMIUM-3D-DEVELOPER-HANDOFF.md`
- `docs/PREMIUM-ORISH-ASSET-MAP.md`
- `docs/APPROVED-ORISH-CHARACTER-REFERENCE.md`
- `docs/POSITIVE-BLACK-HISTORY-GAME-PILLAR.md`
- `docs/SHOWCASE-CINEMA-SPOTLIGHT-SAFETY.md`

Do not treat any one document as permission to ignore the rest.

---

## 1. SCOPE — ORISH’S WORLD ONLY

Work ONLY on **Orish’s World @ THE CODE**.

Do not introduce Elegua’s Crossroads, adult products, adult spirituality, adult cinema, readings, candles, or any other 18+ project into this repository or its child-facing assets.

Do not rebuild the application from scratch.

Inspect the actual repository first and preserve working V1.28 functionality, parent controls, safety architecture, age adaptation, Toy Play World, PWA behaviour, current learning systems and working navigation.

The goal is to turn the existing project into a real, premium, subscription-ready children’s learning universe.

Core product formula:

**PLAY + LEARNING + REAL LIFE + AI + FAMILY + CINEMA + CURIOSITY**

Orish is the character who connects those systems.

---

## 2. INSPECT FIRST — THEN UNIFY THE BEST IDEAS

Before major code changes, inspect and understand:

- existing V1.28 application
- `feature/azure-mvp-v128`
- `feature/premium-orish-world`
- PR #6
- Toy Play World
- current games and learning areas
- parent/guardian controls
- age-routing and safety controls
- current Orish interaction
- cinema work and premium preview
- PWA/mobile behaviour

Do not replace the current product with a generic template or a collection of disconnected cards.

The finished product should feel like one living universe. A child should understand where they are, what they can do next, what they have learned, what they have unlocked and how Orish connects the experience.

Connect systems wherever appropriate. Examples:

- cinema scene → playable mission → discovery → return to story
- parent-set real-life goal → Orish mission → reward/progress
- science topic → game → investigation → practical activity → cinema/story
- child-created film → literacy activity → saved scene → remix → related mission
- history/inventor story → build challenge → investigation → cinema follow-up

Preserve what works. Improve weaknesses. Consolidate overlap only for genuine product reasons.

---

## 3. PROTECTED BRANCH / DEPLOYMENT STATE

- Azure-ready branch: `feature/azure-mvp-v128`
- Premium work branch: `feature/premium-orish-world`
- Open PR: **#6 — Premium Orish World visual preview**
- PR base: `feature/azure-mvp-v128`
- PR head: `feature/premium-orish-world`
- **DO NOT MERGE PR #6 until the user explicitly approves the visual/game preview.**
- Do not edit `main` directly.

Premium preview:

`premium-preview.html`

Current Azure PR preview:

`https://thankful-pebble-09c35f110-6.centralus.7.azurestaticapps.net/premium-preview.html`

---

## 4. ORISH CHARACTER IDENTITY — LOCKED

Orish is a **fictional six-year-old Black boy**.

Do not change these identity features without explicit approval:

- taller/longer-limbed believable six-year-old proportions; not toddler-short
- medium-to-deep warm brown skin, kept consistent
- same approved face and facial proportions
- hair is **PLAITS / BRAIDS — NOT LOCS / DREADLOCKS**
- neat age-appropriate plaits/braids with consistent arrangement
- black/navy/cyan explorer jacket/hoodie as his core explorer look
- subtle gold/cyan AT THE CODE details
- cargo trousers and trainers for full-body versions
- warm, curious, expressive child personality
- premium animated-film / high-end 3D game quality

### Orish voice is also locked

**Orish must always have the same recognisable voice.**

Children may choose approved voices for other fictional characters, but they must not change Orish’s voice, pitch identity or personality from film to film/game to game.

Long-term, keep a canonical `orishVoiceId` / equivalent provider-independent identity rather than hard-coding one vendor-specific implementation throughout the app.

---

## 5. IMMEDIATE VISUAL FIX — SHARP ORISH FIRST

The large Orish hero image in the premium preview is currently fuzzy.

Current file:

`assets/orish-profile-approved.svg`

It embeds a small **160 x 160 WebP**, which is being stretched too far.

Do NOT keep solving this with large base64 images inside SVG.

Use a genuine high-resolution binary web asset such as:

- `assets/orish-hero-approved.webp`
- optional AVIF/WebP `srcset`
- separate smaller avatar asset

Use the **exact approved Orish image**. Do not redraw/regenerate/change his face while implementing the fix.

Acceptance criteria:

1. sharp large hero on iPhone/Retina screens
2. no broken/question-mark image
3. same approved face, skin, plaits and clothing
4. no adult/foreign branding
5. small avatar remains sharp
6. performant loading
7. verified specifically in iPhone Safari

Only after the image is sharp may a subtle non-distorting idle movement be added, with `prefers-reduced-motion` support.

Experimental branches:

- `feature/premium-orish-world-image-motion` — reference only; do not merge wholesale
- `feature/orish-hires-staging` — failed text-chunk image attempt; do not merge

---

## 6. PREMIUM VISUAL DIRECTION

Do not create a generic blue educational dashboard.

Target feeling:

- premium cinematic 3D animated-film/game world
- Orish prominent as character, guide and personality
- floating worlds, portals, labs, caves, landscapes, warm skies, space environments, waterfalls, towers, workshops, shops and discovery zones
- navy/cyan balanced with turquoise, gold, violet/lavender, coral, peach, mint, warm cream, natural greens and cosmic purples
- naturally inviting to girls and boys without stereotypes
- girls naturally represented as scientists, investigators, builders, explorers, astronauts, inventors, coders, artists and leaders
- mobile-first but excellent on tablets, Chromebooks and desktop

Implementation hierarchy:

**CHARACTER → WORLD → PLAY → LEARNING → SAFETY → FAMILY → AI**

---

# 7. AGE-ADAPTIVE PRODUCT SYSTEM — BIRTH TO 16

The same universe must adapt in complexity rather than becoming five unrelated apps.

## Birth–3 — Parent & Me

Parent/guardian controls the device and experience.

Focus:

- sensory play
- sound and rhythm
- visual tracking
- simple cause/effect
- early words
- naming
- movement
- songs/stories
- copying actions
- parent-child interaction

No independent conversational AI. Ages 0–2 microphone remains locked off.

### Progression for Birth–3

Use developmental stages rather than competitive game levels:

- **Stage A — Notice:** look/listen/touch with parent
- **Stage B — Cause & Effect:** tap/move and see a response
- **Stage C — Copy & Choose:** identify a sound/shape/object/action
- **Stage D — Parent & Me Mission:** complete a tiny real-world action together

Never display failure/shaming. Parent-led replay and encouragement matter more than scores.

## Ages 4–6 — Early Explorers

Focus:

- phonics
- early reading/spelling
- numbers
- shapes/patterns
- simple science
- routines
- behaviour choices
- imagination
- movement and discovery

### Every flagship game for 4–6 should support

- **Training Mission** — learn controls through play
- **Level 1 — Discover**
- **Level 2 — Match / Sort**
- **Level 3 — Guided Puzzle**
- **Level 4 — Short Mission**
- **Level 5 — Mini Adventure / Celebration**

Keep instructions spoken + visual. Avoid text-heavy screens.

## Ages 7–10 — Explorers

Focus:

- independent missions
- maths/literacy
- science investigations
- evidence
- problem solving
- money basics
- research habits
- creativity

### Every flagship game for 7–10 should support

- **Training Mission**
- **Level 1 — Learn the mechanic**
- **Level 2 — Find clues / patterns**
- **Level 3 — Combine information**
- **Level 4 — Route/timed/strategy challenge**
- **Level 5 — Multi-stage mission + meaningful unlock**

## Ages 11–13 — Investigators

Focus:

- mysteries
- evidence
- contradictions
- research
- logic
- strategy
- consequences
- source checking
- deeper science/math/civics/finance

### Every flagship game for 11–13 should support

- **Training Mission — Detective/strategy tutorial**
- **Level 1 — Observe**
- **Level 2 — Gather evidence**
- **Level 3 — Identify contradictions / test explanations**
- **Level 4 — Strategic decision with consequences**
- **Level 5 — Full investigation / case conclusion**

## Ages 14–16 — Advanced Missions

Do not make this band feel childish.

Focus:

- advanced research
- critical thinking
- finance
- civics
- science
- data
- communication
- project building
- media literacy
- real-world decisions

### Every flagship game for 14–16 should support

- **Training Mission — systems briefing**
- **Level 1 — Define the problem**
- **Level 2 — Research / analyse data**
- **Level 3 — Model systems / compare explanations**
- **Level 4 — Make trade-offs / strategic decisions**
- **Level 5 — Capstone project, case or simulation**

Older children should increasingly produce something: conclusion, design, budget, report, solution, film/script, experiment plan or evidence-based decision.

---

# 8. GAME BUILD MANDATE — CODEX MUST CREATE THE GAMES, NOT ONLY MOCKUPS

Codex must progress beyond visual cards and start building playable game systems.

The premium experience must not be mostly multiple-choice. Target **70%+ of flagship interaction as active gameplay**, including:

- movement/navigation
- searching
- collecting
- dragging
- sorting
- matching
- aiming
- assembling
- building
- rotating/inspecting objects
- sequencing
- route choices
- experimenting
- operating consoles/tools
- observing scene changes
- evidence boards
- unlocking rooms/areas

Multiple choice can exist where pedagogically useful, but should not be the main game mechanic.

Build reusable game components so new levels do not require rebuilding everything.

Suggested reusable primitives:

- mission state machine
- age-band difficulty config
- training/tutorial system
- collectible/evidence system
- inventory/prop system
- drag/drop and sorting engine
- timer/challenge engine
- scene/object interaction hotspots
- rewards/progress/unlock engine
- hints/clues system
- accessibility controls
- save/resume
- cinema-trigger hooks
- parent-goal mission hooks

Every game must have a short age-appropriate **Training Mission** before harder levels.

---

# 9. FLAGSHIP GAMES + AGE-ADAPTIVE LEVEL DIRECTION

## A. SPACE SIGNAL MISSION — FIRST FLAGSHIP

Core world: premium space station / observatory / signal mystery.

Core mechanics:

- move through station
- activate consoles
- tune signal
- match waves/patterns
- collect evidence
- compare possible sources
- unlock rooms
- solve mystery

### Birth–3 Parent & Me

- Stage A: watch stars/signal lights and hear tones
- Stage B: tap glowing planets/signals to cause response
- Stage C: match simple sound/colour/shape with parent
- Stage D: parent-child “find something round / bright / far away” mini mission

### 4–6

- Training: move Orish + tap a console
- L1: find the glowing signal
- L2: match 2–3 wave/colour patterns
- L3: put planets/signals in simple order
- L4: follow a short route and repair one console
- L5: identify where the friendly mystery signal came from and celebrate

### 7–10

- Training: navigation + console use
- L1: tune frequency using visual feedback
- L2: collect three clues around station
- L3: compare repeating patterns
- L4: route power between rooms under a light time challenge
- L5: combine evidence to identify likely source and unlock cinema ending

### 11–13

- Training: observation/evidence tutorial
- L1: detect signal anomaly
- L2: log evidence and exclude weak sources
- L3: find contradiction between two readings
- L4: decide where to allocate limited scanner time/power
- L5: write/select evidence-based conclusion with uncertainty level

### 14–16

- Training: instrumentation/data briefing
- L1: define signal problem and variables
- L2: analyse signal data/noise/patterns
- L3: compare hypotheses and source reliability
- L4: design observation strategy with limited resources
- L5: present an evidence-based conclusion / research note and unlock advanced mission

## B. FOSSIL DETECTIVE

Core world: dig site → tent → lab → reconstruction room.

Core mechanics:

- brush/uncover fossils
- rotate/inspect
- assemble skeletons
- compare tracks
- classify evidence
- build timeline/environment explanation

Age adaptation:

- Birth–3: textures/shapes/sounds + parent-led dinosaur naming
- 4–6: uncover, match shapes, simple “which creature?” clues
- 7–10: assemble fossil, compare footprints, identify habitat evidence
- 11–13: stratigraphy, competing explanations, evidence quality, contradiction spotting
- 14–16: dating concepts, scientific uncertainty, reconstruction limits, research/capstone case

Use Training + Levels 1–5 framework for each independent age band.

## C. FRACTION RESCUE

Core world: broken bridge / machines / supply route repaired using fractions and proportion.

Core mechanics:

- drag/cut/combine pieces
- balance
- build bridge sections
- compare fractions
- ratios/proportions for older bands

Age adaptation:

- Birth–3: whole/half visual play with parent, matching pieces
- 4–6: halves/whole and simple equal pieces through visual puzzles
- 7–10: halves/quarters/eighths, equivalence, repair route
- 11–13: fractions/decimals/percentages, constraints, multi-step repair
- 14–16: ratios/proportions/scaling/optimisation and real-world design scenario

## D. BODY EXPLORER

Core world: interactive anatomy lab/body journey.

Topics:

- skeleton
- muscles
- organs
- senses
- circulation
- digestion
- safe injury/health understanding

Age adaptation:

- Birth–3: point/name body parts, movement and senses with parent
- 4–6: bones/heart/lungs/senses through matching/movement
- 7–10: systems, organ placement, simple cause/effect
- 11–13: interacting systems, evidence-based health scenarios, anatomy puzzles
- 14–16: deeper physiology, data/scenario analysis, health misinformation/source checking

Do not diagnose medical conditions. Keep educational scope clear.

## E. MONEY MISSION SHOP

Core world: interactive shop / town / household money missions.

Mechanics:

- choose items
- compare prices
- make change
- budget
- needs vs wants
- plan purchases
- understand subscriptions/ads for older children

Age adaptation:

- Birth–3: counting objects/coins symbolically with parent, shop role-play
- 4–6: number recognition, simple buying/counting, choices
- 7–10: prices/change/budget/needs-wants
- 11–13: discounts, saving, simple bills/subscriptions, advertising influence
- 14–16: budgeting, interest basics, recurring costs, comparison shopping, financial trade-offs and scams/media literacy

No real-money gambling mechanics and no pay-to-win design.

## F. MYSTERY ISLAND

Core world: research station / island / weather / maps / witness reports / strange observations.

Core thinking loop:

**CLAIM → EVIDENCE → ALTERNATIVES → UNCERTAINTY → CONCLUSION**

Age adaptation:

- Birth–3: sensory exploration + “what changed?” with parent
- 4–6: find objects, simple observation/matching
- 7–10: collect clues, maps, weather signs, sequence events
- 11–13: witness claims vs evidence, contradictions, alternative explanations
- 14–16: source reliability, data, uncertainty, competing hypotheses, written conclusion

## G. POSITIVE BLACK HISTORY / INVENTORS / MAKERS — MANDATORY PILLAR

Read `docs/POSITIVE-BLACK-HISTORY-GAME-PILLAR.md`.

This is not a static biography page and must not reduce Black history to slavery/oppression.

Playable formats include:

- Inventor Workshop
- Who Made This Possible?
- Build the Breakthrough
- Hidden History Detective
- Journey Through Time
- maker/engineering missions
- cinema → investigation → build loop

Coverage should include Britain/Black British history, Africa/African civilisations, Caribbean, US, Europe and wider diaspora, with verified contributions across science, medicine, engineering, maths/computing, transport, agriculture, manufacturing, space, literature, music, art/design/film, sport, entrepreneurship and civic/community leadership.

Use accurate verbs: invented / improved / patented / pioneered / led / contributed. Do not repeat viral historical myths.

Age adaptation:

- Birth–3: music, shapes, objects, family stories and joyful cultural discovery with parent
- 4–6: “meet a maker” mini-stories + simple build/match activity
- 7–10: inventor workshop + clue/build missions
- 11–13: hidden-history detective + source/evidence missions
- 14–16: research claims, patents/sources/context, innovation case studies and project creation

## H. TOY PLAY WORLD

Toy Play World already exists.

Preserve it, improve it and connect it into the same progression/reward/navigation universe rather than treating it as a separate forgotten mini-site.

---

# 10. BROADER LEARNING UNIVERSE

The platform should be extensible across:

- Mathematics
- Literacy
- Science
- Astronomy & Space
- Human Body
- Financial Literacy
- Civics
- Research & Critical Thinking
- Creativity
- positive Black history / inventors / achievement
- practical family learning
- food/cooking science through Butter, Bread & Bakes concepts where appropriately integrated

Do not create a shallow card for every subject immediately. Build fewer excellent reusable worlds first, then expand.

---

# 11. BEHAVIOUR, ROUTINES AND REAL-LIFE MISSIONS

Parent dashboard can set current goals/situations such as:

- bedtime
- morning routine
- teeth
- listening
- sharing
- turn-taking
- new school
- trying something new
- family cooking
- spelling practice
- money goal
- interest in dinosaurs/space/science

Orish should be able to transform appropriate parent-defined goals into:

- missions
- stories
- role-play
- puzzles
- games
- reflective choices
- practical activities

Behaviour learning should teach:

- choices/consequences
- perspective
- emotional literacy
- respectful communication
- boundaries
- listening
- turn-taking
- repair/responsibility
- recognising repeated patterns
- trying again

Do not use humiliation, shame or punitive food/exercise systems.

---

# 12. CINEMA → GAME LOOP

Children’s Cinema is a learning cinema, not passive filler.

Content can include:

- cartoons
- mini-films
- science shorts
- behaviour stories
- mysteries
- cooking/family activities
- space adventures
- interactive episodes

Core loop:

**WATCH → PLAY → DISCOVER → RETURN TO STORY**

Example:

5-minute space mystery → Orish notices anomaly → playable Space Signal mission → child gathers evidence → solves puzzle → returns to cinema → ending reflects discovery.

Codex should create reusable hooks so cinema chapters can unlock missions and mission outcomes can select/modify follow-up story states.

---

# 13. INTERACTIVE FILMMAKER CINEMA — CORE CREATIVE FEATURE

Build this as a **controlled Children’s Interactive Cinema Studio**, not an unrestricted child-facing AI video generator.

Core experience:

**SPEAK OR TYPE → SEE YOUR WORDS → READ → SPELL/EDIT → CREATE CARTOON → WATCH → EDIT/REMIX → PLAY RELATED MISSION**

## Input choices

Children should have equal choices to:

- speak their idea
- type their idea

### Younger-child on-screen keyboard

For younger children, provide an Orish’s World child keyboard with:

- large keys
- light-up/pulsing suggested letters
- letter sounds when tapped
- upper/lowercase learning
- missing-letter activities
- picture clues
- optional word suggestions
- “Help me” button

The app can light up **on-screen keys**. Do not assume arbitrary physical keyboard lighting can be controlled.

## Literacy before submit

Do not invisibly autocorrect every mistake and immediately generate a movie.

Give the child an age-appropriate opportunity to read and improve their own words first.

Examples:

- 4–6: phonics, missing letters, picture clues, read-aloud
- 7–10: spelling, punctuation, sentence building, vocabulary
- 11–13: stronger vocabulary, paragraphs, dialogue, story sequence
- 14–16: scripts, tone, concise editing, scene descriptions, creative writing

Always offer support so the experience does not become frustrating.

## Safety prompt layer

Child ideas must not directly control an unrestricted generation model.

Use a controlled story-builder / safety pipeline that blocks or redirects:

- sexual content
- graphic violence
- frightening/dangerous requests beyond age-safe storytelling
- personal information
- real-person impersonation
- inappropriate language
- unsafe real-world instructions

Keep public-facing output cartoon/stylised by default. Do not invite children to upload realistic photos of themselves/other children for movie creation.

---

# 14. MOVIE VAULT + REUSABLE CREATIVE ASSET SYSTEM

AI generation must not become disposable.

Every suitable creation should be stored as reusable structured assets where technically possible.

Create a family-private creative library with:

## Movie Vault

- saved films
- versions
- trailers
- remixes
- scene order/timeline

## Scene Library

- reusable scenes
- locations
- shots
- transitions

## Character Library

- approved fictional characters
- rig/animation identity where possible
- voice identity
- costumes

## Wardrobe Vault

Children can save clothing they create/select for fictional characters and reuse it later.

Wardrobe can contain:

- full outfits
- tops
- bottoms
- jackets
- shoes
- hats
- approved accessories
- mission gear
- space/lab/cinema/builder costumes

Children should be able to:

- reuse exact outfits
- swap one item
- recolour approved areas
- combine saved pieces
- save favourite combinations
- assign outfits to a character

### Orish wardrobe rule

Orish’s **face, body identity, skin, hair and voice remain fixed**.

Orish may change into approved context-relevant outfits, e.g. explorer, astronaut, scientist, fossil dig, chef, filmmaker/director, builder, weather gear, celebration outfit, historically appropriate educational costume where suitable.

Do not allow clothing changes to alter Orish’s identity.

## Prop Vault

Reusable safe props, tools, science equipment, cooking items, detective kits, space gear etc.

## World Library

Reusable environments/backgrounds/locations.

## Sound Studio

- approved music
- sound effects
- generated character dialogue
- saved speech lines

Orish’s canonical voice remains locked.

---

# 15. EDITING / REMIXING SHOULD NOT WASTE GENERATION CREDITS

Architect the film system so a child can create new edits from saved assets without requiring a full new AI-video generation every time.

Examples of low/no-generation remix actions:

- reorder scenes
- shorten/trim scenes
- combine old scenes
- change title cards
- change approved music
- change dialogue for non-Orish fictional characters
- change approved voice for non-Orish characters
- reuse backgrounds/props
- change saved wardrobe pieces
- create a trailer from existing scenes
- alternate ending using already generated assets

Where characters are rigged, support new dialogue with speech + viseme/lip-sync so mouth movement matches the words without regenerating the entire scene when feasible.

Only genuinely new expensive AI media generation should consume a generation allowance.

Do not hard-code a commercial allowance yet; make quotas configurable by subscription plan. Current product thinking includes a small number of new AI movie creations per month with extensive reuse/remixing of the existing vault.

---

# 16. SHOWCASE CINEMA + SPOTLIGHT

Read `docs/SHOWCASE-CINEMA-SPOTLIGHT-SAFETY.md`.

Required flow:

**PRIVATE MOVIE VAULT → SUBMIT TO SHOWCASE → PARENT APPROVAL → AUTOMATED SAFETY CHECK → HUMAN/OWNER MODERATION → SHOWCASE CINEMA → OPTIONAL SPOTLIGHT → SEPARATE PARENT PERMISSION FOR EXTERNAL SOCIAL USE → ADMIN-ONLY SAFE EXPORT**

Important rules:

- child-created films are private by default
- child cannot publish externally by themselves
- internal Showcase approval does not equal external social permission
- no open DMs
- no unrestricted comments
- no follower mechanics/location sharing
- no real full child name, email, school, address, exact DOB/location
- use safe alias/display name
- default to generated character voices rather than raw child voice for public Showcase

## NO DOWNLOADS FOR CHILDREN OR PARENTS

Children, parents/guardians and Showcase viewers must **not** receive a Download button or permanent raw media URL.

Parents can:

- review
- approve/decline Showcase submission
- give/withdraw external-sharing permission where applicable
- request deletion
- review approvals

They cannot download the master video.

Only an authorised Orish’s World owner/admin role may generate a social-safe Spotlight export, and only when explicit permission exists for that specific film.

Admin export should:

- strip unnecessary metadata
- use safe attribution only
- avoid exposing private account IDs
- add optional Orish’s World watermark/branding
- record consent state
- record export/audit event

Master media stays private.

No browser/app can completely prevent screen recording, but remove direct download paths and permanent raw media URLs.

---

# 17. PARENT ACCOUNT / CHILD PROFILE ARCHITECTURE

Parent/guardian owns the account.

Child profile is subordinate.

Parent controls should include:

- child name/profile label
- age band
- interests
- preferences
- accessibility
- routines
- goals/current situations
- allowed features
- speech/camera permissions
- time/bedtime/content settings
- saved progress
- Showcase permissions
- subscription
- deletion/export of account data where legally required

Do not expose parent/admin controls in a way that children can casually bypass.

---

# 18. CHILD SAFETY / PRIVACY — NON-NEGOTIABLE

Preserve and strengthen:

- parent-owned accounts
- minimal child data
- private by default
- no ad profiling/sale of child data
- no public child profile
- no unrestricted chatbot
- no open DMs/stranger chat
- controlled safe shared-play signals only
- microphone parent opt-in
- ages 0–2 microphone locked off
- secure deletion/export processes
- separated child/parent/admin permissions
- rate limiting
- secure authentication
- audit logs for sensitive admin actions
- encryption/backups appropriate to production
- breach/deletion procedures

The architecture should be capable of supporting UK GDPR / ICO Children’s Code work, DPIA, age assurance and safeguarding review before launch.

Do not weaken safety to improve engagement/virality.

---

# 19. SAFE SHARED PLAY

Shared/cooperative gameplay may include:

- parent-approved access
- predetermined signals
- structured speech bubbles
- cooperative actions
- safe emotes
- mission teamwork

Do not add initially:

- unrestricted free-text child chat
- unrestricted child voice chat
- DMs
- photo exchange
- precise location
- stranger matching
- livestreaming

---

# 20. POSITIVE NEWS FLASH

Plan for a child-safe daily Positive News Flash focused on constructive, age-appropriate developments such as:

- science
- conservation
- helpful technology
- space discoveries
- community achievements
- inspiring young people
- medical progress explained safely

This feature requires controlled sourcing/review; do not pipe unrestricted breaking news directly to children.

---

# 21. SUBSCRIPTION-READY ARCHITECTURE

Build the product so subscriptions can be enabled without redesigning the child experience.

Current commercial principle:

- useful free discovery
- paid family membership
- premium games/cinema/parent tools/progression
- configurable AI allowance
- limited expensive NEW media generation
- extensive replay/remix of already-created media

Payments/upgrades belong in the **Parent Portal only**.

No child-facing pressure such as “buy more generations”, gambling-style currency or pay-to-win mechanics.

The child may see a neutral allowance such as “Movie creations available”, but upgrade/payment controls stay behind the parent gate.

Keep plan limits/pricing configurable rather than hard-coded into gameplay.

Do not enable a new paid service or payment flow without explicit approval.

---

# 22. COST CONTROL + PORTABLE CLOUD ARCHITECTURE

Development remains **free-first**.

The current Azure Static Web App is on the Free plan.

Do not add paid Azure services, paid APIs or switch plans merely for visual work.

Azure credits may later be used for genuinely valuable production/testing workloads, but activation/spend requires explicit approval.

Design provider adapters so expensive services can be swapped later instead of trapping the product with one provider.

Separate interfaces for:

- video generation
- speech-to-text
- text-to-speech
- conversational/model inference
- image generation
- storage
- moderation where practical

Keep Orish’s age adaptation, safety logic, story rules, game rules and canonical identity in our own application code/config rather than buried inside one provider.

Prefer portable formats:

- WebP/AVIF/images
- MP4/WebM where appropriate
- GLB/glTF 3D assets
- standard audio
- JSON project manifests
- exportable data structures

For filmmaking, save structured project data such as:

**character + outfit + scene + dialogue + voice identity + animation + music + timing**

rather than relying only on one flattened finished video.

---

# 23. MEDIA STORAGE PRINCIPLE

Do not store a growing film library inside Static Web Apps assets.

When real Movie Vault storage is activated, use private object/blob storage or equivalent with:

- private containers/buckets
- short-lived authorised playback access
- no permanent public raw URL
- parent/child access checks
- versioning/metadata
- deletion lifecycle
- admin export audit

Keep storage provider replaceable so it can move to a cheaper compatible service later if needed.

---

# 24. MOBILE / PWA / FUTURE APP STORES

The web/PWA must remain first-class so families can use Orish’s World on phones/tablets before native app-store releases.

Target:

- iPhone/iPad Safari + Add to Home Screen
- Android phones/tablets
- Chromebook
- Windows/Mac browser/desktop

Later the same core product should be packageable for:

- Apple App Store
- Google Play
- Microsoft Store

Do not make current web architecture dependent on having Xcode/Mac available today.

Maintain mobile touch targets, responsive game controls, orientation behaviour, safe areas, accessibility and performance.

---

# 25. PERFORMANCE

Premium does not mean enormous unoptimised files.

Use:

- WebP/AVIF
- responsive image sizing
- compressed GLB/glTF assets
- texture compression where appropriate
- lazy loading
- caching
- scene/module code splitting where sensible
- lower-detail fallbacks for weaker devices

Test real mobile performance rather than assuming desktop behaviour.

---

# 26. DEVELOPMENT ORDER FOR CODEX

## Phase 0 — Inspect and protect

1. inspect V1.28/current working application
2. inspect Azure branch + premium branch + PR #6
3. inventory working functionality and safety controls
4. identify reusable game/navigation/state systems
5. do not merge experimental branches

## Phase 1 — Fix canonical Orish visual

1. replace stretched tiny hero asset with exact approved high-resolution binary asset
2. verify iPhone Safari
3. preserve identity
4. optional subtle reduced-motion-aware idle effect after sharpness confirmed

## Phase 2 — Build the first real flagship game vertical slice

Use **Space Signal Mission**.

At minimum create:

- shared game shell
- Training Mission
- working movement/navigation
- interactive consoles
- signal/wave mechanic
- evidence collection
- age-band difficulty/config
- save/progress
- reward/unlock
- cinema hook

Implement at least one polished playable level first, then expand through the defined age-adaptive level ladder rather than making six shallow mockups.

## Phase 3 — Age adaptation

Build/configure the same flagship so the experience meaningfully changes for:

- Birth–3 Parent & Me
- 4–6
- 7–10
- 11–13
- 14–16

Use the level frameworks in this handoff.

## Phase 4 — Expand flagship game library

In priority order after Space Signal is stable:

1. Fossil Detective
2. Fraction Rescue
3. Body Explorer
4. Money Mission Shop
5. Mystery Island
6. Positive Black History / Inventor Workshop missions

Preserve/integrate Toy Play World throughout.

## Phase 5 — Cinema/game connection

Create reusable Watch → Play → Discover → Return hooks.

## Phase 6 — Interactive Movie Studio foundation

Build without paid generation first:

- Speak / Type choice
- child keyboard with light-up keys
- transcript
- read-aloud/highlighting
- literacy correction activity
- story safety structuring
- storyboard/scene editor
- placeholder/mock generation pipeline
- Movie Vault data model
- wardrobe/prop/world/sound library models
- remix/edit timeline
- permissions

Only connect real paid/credit-consuming video/speech generation after explicit approval.

## Phase 7 — Showcase foundation

Build permission/data states for:

- private
- submitted
- parent approved
- moderation pending
- Showcase approved
- Spotlight selected
- external permission approved/declined/withdrawn
- admin exported

No parent/child/viewer downloads.

## Phase 8 — Subscription readiness

Create configurable plan/entitlement architecture and parent-only upgrade surfaces without prematurely activating paid services.

---

# 27. DEFINITION OF A GOOD CODEX UPDATE

A good update is not “many new cards”. It should demonstrate real product progress.

For the next substantial Codex delivery, aim to show:

- exact sharp approved Orish on iPhone
- premium coherent navigation/world presentation
- working parent/safety controls preserved
- Toy Play World preserved
- first genuinely playable Space Signal vertical slice
- Training Mission
- real interaction beyond MCQ
- age-adaptive framework present in code/data
- clear path to Levels 1–5 for every independent age band
- Birth–3 Parent & Me developmental stages
- save/progress/reward structure
- cinema mission hook
- no paid services accidentally activated
- no merge of PR #6 until user approval

Then continue systematically through the remaining games, cinema and creative studio.

---

# 28. NON-NEGOTIABLE PRODUCT TEST

Before calling any major feature complete, ask:

1. Is it genuinely fun?
2. Is there something the child actually does, not just reads/clicks?
3. Does it adapt appropriately by age?
4. Does it connect to the wider Orish universe?
5. Is Orish recognisable and consistent?
6. Is it safe/private by default?
7. Can the parent understand/control what matters?
8. Does it work well on a phone/tablet?
9. Can expensive providers/services be changed later?
10. Does it feel premium enough that a family could reasonably subscribe?

If the answer to several of these is no, it is not finished.

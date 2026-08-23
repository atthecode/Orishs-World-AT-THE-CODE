# Orish’s World @ THE CODE — Premium 3D Developer Handoff

Current direction: 23 August 2026

## Scope

Work only on Orish’s World @ THE CODE. Preserve the existing working PWA, parent controls, age adaptation, safety logic, games, missions, Toy Play World and Azure Static Web Apps deployment. Do not use Emergent and do not rebuild the app from scratch.

Repository: `atthecode/Orishs-World-AT-THE-CODE`
Live Azure branch: `feature/azure-mvp-v128`
Premium development branch: `feature/premium-orish-world`
Hosting: Azure Static Web Apps Free plan

## Product goal

Transform the existing prototype into a premium, subscription-ready, cinematic 3D learning universe combining PLAY + LEARNING + CINEMA + AI + FAMILY + REAL LIFE + CURIOSITY. Orish is the main character, guide and personality of the entire product, not merely a chatbot.

## Visual rules

Do not make the whole application blue. Keep navy/cyan as part of the AT THE CODE identity but introduce turquoise, warm gold, lavender, violet, coral, peach, mint, soft pink highlights, warm cream, natural greens and cosmic purples. Different worlds should have distinct atmospheres. The experience must feel welcoming to girls and boys without stereotyped content.

Orish must remain a consistent young Black boy with neat plaits/braids, expressive face, premium stylised 3D quality, warm personality, modern navy/cyan/black clothing, restrained gold AT THE CODE details, trainers and explorer styling. Do not replace Orish with random children and remove every old blue O/body placeholder.

Orish’s World is an AT THE CODE children’s product. Never use Elegua’s Crossroads branding, wording, logos, watermarks or “Powered by Elegua’s Crossroads” anywhere in the children’s product.

## Reusable Orish character system

Create consistent reusable variants of the same character: Core, Explorer, Science, Space, Detective, Kitchen, Maker, Calm and Mission Orish. Long-term 3D pipeline: design → model → texture → rig → animate → export → reuse, preferably GLB/glTF. Initial animation targets: idle breathing, blink, smile, look left/right, point, wave, celebrate, thinking, discovery reaction, walk, run, jump, crouch and pick-up. Later: lip-sync, expressions, game-specific motion and cinematic animation.

## Homepage and world hub

Keep working functionality but make the homepage feel like an entrance to a world. Hero copy remains Orish’s World @ THE CODE / Explore. Learn. Play. Grow. Primary CTA: Enter Orish’s World. Secondary: Meet Orish, Watch Adventure, Parent Portal. Place premium 3D Orish prominently with restrained floating discovery objects.

Replace the software-button feeling of the world grid with visual portals for Discovery District, Skills Academy, Maker Bay, Story Forest, Life City, Family Harbour and Space Station. Each area needs recognisable scenery rather than relying on emojis.

## Gameplay standard

Multiple-choice questions may exist but cannot be the main mechanic. At least 70% of the flagship experience should involve interaction beyond selecting an answer: movement, dragging, sorting, searching, collecting, exploring, building, assembling, matching, aiming, navigating, investigating, observing, unlocking, sequencing, designing, experimenting and choosing routes.

First flagship game: Space Signal Mission. Build one excellent game before expanding the set. It must demonstrate movement, interaction, collection, investigation, animation, Orish guidance, age adaptation, rewards and saved progress. Follow-on flagship concepts: Fossil Detective, Fraction Rescue, Body Explorer, Money Mission Shop and Mystery Island.

## Toy Play and cinema

Keep Toy Play World and bring it visually into the same universe. It should encourage children to leave the screen and use toys they already own in safe missions.

Create Orish Cinema over time. Desired loop: WATCH → PLAY → DISCOVER → RETURN TO STORY, with short cinematics that open and close flagship missions.

## Talk to Orish and voice

Use real Orish artwork/3D character on the Talk to Orish screen. Do not use the blue O/body placeholder. Give Orish visible reactions while speaking. Target voice is a natural child voice: warm, curious, confident, playful, clear and not babyish. Browser speech is development fallback only. Any cloud speech/AI credentials must remain server-side.

## Image rules

Correct imagery systematically. Every major image must satisfy IMAGE ↔ ACTIVITY NAME ↔ SUBJECT ↔ GAMEPLAY. Do not reuse unrelated artwork. Prefer Orish doing the relevant activity. Maintain consistent face, plaits, proportions, clothing language, lighting and premium animated-film-quality stylised 3D art. Avoid cheap clipart, stock photography, random children and inconsistent AI characters.

## Age adaptation

Preserve existing age architecture: birth–3 parent-led; ages 4–6 simple visual exploration; 7–10 adventure/building/collecting; 11–13 evidence/strategy/mysteries; 14–16 advanced research, finance, science, projects and decision-making. Reuse game concepts with increasing sophistication.

## Safety

Never sacrifice safety for visual polish. Preserve parent-owned account design, subordinate child profiles, no ad profiling, no open child DMs, no stranger matching, no unrestricted livestreaming, parent-controlled microphone/camera, no unrestricted web chatbot, approved Orish pathways, minimal child data, age adaptation, deletion/export and secure parent gate.

## Parent Portal

Keep parent controls clearly separate from the child world. Required controls include profiles, ages, interests, accessibility, bedtime/morning routines, goals, parent missions, microphone, camera, Ask Orish, time limits, subscription, progress, privacy and deletion/export.

## Platform and performance

Mobile first: Chromebook, iPhone, Android-sized screen, tablet and desktop. Keep PWA installability and touch-sized controls. Use WebP/AVIF, compressed GLB, texture compression, lazy loading, caching, progressive loading and lightweight animation.

Keep Azure Static Web Apps on Free. Do not spend Azure credit merely because it exists. Add paid/cloud services only when genuinely required and measured.

## Subscription direction

Free discovery must demonstrate value. Paid family membership may later unlock expanded games, missions, saved progress, richer Orish interaction, cinema, family tools, premium worlds and parent custom missions. No pay-to-win or gambling-like rewards.

## Implementation order

Phase A: fix images and placeholders, establish consistent Orish, broaden palette, upgrade homepage/world portals and improve mobile presentation.

Phase B: build one excellent Space Signal Mission.

Phase C: proper reusable 3D Orish, animations, expressions, reactions and improved voice.

Phase D: secure parent account, child profiles, database, progress sync, subscription and server-side AI gateway.

## Immediate priorities before new Azure services

Finish image corrections; verify Orish on Talk to Orish; remove repeated/inappropriate imagery; improve colour balance; test navigation and Parent Portal access; test every existing button, Toy Play and existing games; then convert the strongest existing game into the first premium playable experience.

## Acceptance standard

A child should think: “I want to play this.” A parent should think: “This looks safe, educational and worth paying for.” A funder should see a serious scalable children’s platform. A screenshot should immediately read as Orish’s World, not a generic education app.

Priority order: CHARACTER → WORLD → PLAY → LEARNING → SAFETY → FAMILY → AI.

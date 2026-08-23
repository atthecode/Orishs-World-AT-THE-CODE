# ORISH’S WORLD @ THE CODE — CODEX HANDOFF

**Date:** 23 August 2026

## 1. Scope

Work ONLY on **Orish’s World @ THE CODE** in this repository:

`atthecode/Orishs-World-AT-THE-CODE`

Do not introduce Elegua’s Crossroads, adult products, adult spirituality, adult cinema, readings, candles, or any other 18+ project into this codebase or its child-facing assets.

Do not rebuild the application from scratch. Inspect the existing repository and preserve working V1.28 functionality, parent controls, safety architecture, age adaptation, Toy Play World, PWA behaviour and existing learning systems.

## 2. Protected branch / deployment state

- Existing Azure-ready application branch: `feature/azure-mvp-v128`
- Premium visual work branch: `feature/premium-orish-world`
- Open PR: **#6 — Premium Orish World visual preview**
- PR base: `feature/azure-mvp-v128`
- PR head: `feature/premium-orish-world`
- **Do not merge PR #6 until the visual preview is explicitly approved.**
- Do not edit `main` directly.
- Keep the current Azure/live build protected while fixing the preview.

Premium preview page:

`premium-preview.html`

Azure PR preview used during review:

`https://thankful-pebble-09c35f110-6.centralus.7.azurestaticapps.net/premium-preview.html`

## 3. Immediate problem Codex must fix first

The large Orish hero image in the premium preview is fuzzy.

Current file:

`assets/orish-profile-approved.svg`

That SVG embeds a very small **160 x 160 WebP**. It is acceptable only as a tiny avatar. The preview stretches it into a large hero card, so it inevitably looks soft/fuzzy on iPhone.

An attempted high-resolution replacement using another large base64-embedded image inside SVG rendered as a large blurred/question-mark-style broken image in iPhone Safari. That attempt was rolled back.

### Correct fix

Do NOT keep solving this with a base64 image embedded inside an SVG.

Use a normal high-resolution binary asset in the repository, e.g.:

- `assets/orish-hero-approved.webp`
- optionally an AVIF/WebP `srcset`
- a separately sized avatar image if useful

The user will provide/identify the **exact approved high-resolution Orish image** from the ChatGPT visual work. Use that exact image as the master source. Do not redraw, regenerate or subtly change his face while implementing it.

Compress for web while retaining enough resolution for Retina/iPhone screens. Verify the actual rendered image in Safari/iPhone before considering the task complete.

### Acceptance criteria for the image fix

1. Orish is sharp on the large mobile hero card.
2. No broken/question-mark image.
3. No visible pixelation/fuzziness at normal iPhone zoom.
4. Same approved face, skin tone, plaits and clothing.
5. No Elegua’s Crossroads branding anywhere in the asset.
6. Small avatar remains sharp as well.
7. Keep image loading performant.

## 4. Character identity is locked

Orish is a **fictional six-year-old Black boy**.

Do not change these identity features without explicit approval:

- taller/longer-limbed six-year-old proportions; not toddler-short
- medium-to-deep warm brown skin; do not lighten or darken him between screens
- same approved face and facial proportions
- hair is **PLAITS / BRAIDS — NOT LOCS / DREADLOCKS**
- neat age-appropriate plaits/braids with a consistent arrangement
- black/navy/cyan explorer jacket/hoodie
- subtle gold/cyan AT THE CODE details
- cargo trousers and trainers for full-body versions
- warm, curious, expressive child character
- premium animated-film / high-end 3D game quality

The approved Orish identity should remain visually consistent across homepage, Talk to Orish, games, cinema, profile/avatar and parent-facing previews.

## 5. Movement requirement

The user also wants Orish to have movement.

For the current still-image preview, a subtle lightweight idle effect is acceptable only after the sharp image is working, such as a very small breathing/float motion. It must not warp or distort the character image.

Include `prefers-reduced-motion` support.

Longer-term character movement should come from a proper reusable rigged 3D character, not from aggressively deforming a 2D image. Planned movements include:

- blink / look
- wave
- point
- celebrate
- react while speaking
- walk
- run
- jump
- crouch
- pick up / interact with objects
- context-specific game animations

Reference-only experimental branch:

`feature/premium-orish-world-image-motion`

It contains an early motion plan/CSS experiment. **Do not merge this branch wholesale.** Inspect and reuse only what is useful after the image problem is solved.

## 6. High-resolution staging branch warning

Experimental branch:

`feature/orish-hires-staging`

This branch is currently ahead of the premium branch only because it contains incomplete text chunks under:

`assets/orish-hires/`

including files such as `part00.txt` and `avif00.txt` etc.

These were an unsuccessful attempt to move a binary image through a text-only path. They are not production assets.

**Do not merge this branch.** It is safe to ignore/delete the incomplete chunks when cleaning up later.

## 7. Premium visual direction

Do not turn the app into a generic blue dashboard.

Target feeling:

- polished premium 3D animated-film/game UI
- Orish prominent as the guide and central personality
- cinematic worlds, floating environments, waterfalls, towers, warm skies, glowing portals, labs and space environments
- navy/cyan as part of the brand but balanced with turquoise, gold, violet/lavender, coral, peach, mint, warm cream, natural green and cosmic purple
- naturally inviting to girls and boys without stereotyped “girls content”
- girls represented naturally as scientists, investigators, builders, astronauts, coders, inventors, artists and leaders
- mobile-first but strong on Chromebook/tablet/desktop

Implementation priority remains:

**CHARACTER → WORLD → PLAY → LEARNING → SAFETY → FAMILY → AI**

## 8. Premium preview issues after the image fix

Once the Orish image is sharp and stable, improve the preview incrementally rather than redesigning everything at once.

Known visual work still needed:

- Space Signal should become a cinematic playable-looking mission scene instead of a simple gradient/rocket placeholder.
- Fossil Detective and Fraction Rescue currently rely on generic images and need context-correct premium scenes later.
- World cards should eventually become cinematic mini-worlds rather than flat gradient emoji cards.
- Keep mobile navigation clear and prevent the header from covering page content.
- Remove any remaining placeholder visual language.

Do not let this later visual work delay the first priority: **make Orish sharp, correct and stable.**

## 9. Flagship gameplay direction

The first premium playable flagship is **Space Signal Mission**.

It should use genuine interaction rather than being mostly multiple choice:

- movement/navigation
- activate consoles
- tune signals
- match waves/patterns
- collect evidence
- compare possible sources
- unlock the next room

Then planned premium modules include:

- Fossil Detective
- Fraction Rescue
- Body Explorer
- Money Mission Shop
- Mystery Island

Toy Play World already exists and must remain integrated.

## 10. Child-safety / parent architecture is not optional

Preserve the existing principles:

- parent/guardian owns the account
- child profiles subordinate to adult account
- age-adaptive experience from birth to 16
- babies/very young children are parent-led
- no unrestricted child chatbot
- microphone is parent opt-in
- ages 0–2 microphone locked off
- minimal child data
- private by default
- no ad profiling or sale of child data
- no public child profile
- controlled permissions
- deletion/export controls
- safe shared play only; no unrestricted DMs/open stranger chat

Do not weaken safety or privacy while improving visuals.

## 11. Cost / infrastructure rule

Keep development **free-first**.

The Azure Static Web App is currently on the Free plan. Do not add paid Azure services, paid APIs or switch plans merely to fix visual assets or animations.

Use Azure credits only when genuinely valuable and explicitly approved.

## 12. What Codex should do when it starts

1. Check out / inspect `feature/premium-orish-world` first.
2. Inspect PR #6 and the actual current files before writing code.
3. Do NOT work from `feature/orish-hires-staging`.
4. Do NOT merge `feature/premium-orish-world-image-motion` wholesale.
5. Obtain the exact approved high-resolution Orish image from the user/current supplied asset.
6. Add it as a genuine binary web asset, preferably WebP/AVIF with suitable dimensions.
7. Point the large premium hero to the high-resolution asset.
8. Keep a sensible smaller avatar asset for profile use.
9. Test locally/browser first, then deploy preview.
10. Specifically test iPhone Safari rendering.
11. Add only a subtle non-distorting idle movement after the image is verified sharp.
12. Keep PR #6 unmerged until the user visually approves the result.

## 13. Definition of done for the next Codex session

The immediate Codex session is successful when the user opens the Azure premium preview on iPhone and sees:

- the exact approved Orish
- sharp image quality
- correct plaits
- correct skin tone
- no broken image
- no foreign/adult branding
- stable mobile layout
- subtle movement if enabled

Only then continue to the next premium visual/game pass.

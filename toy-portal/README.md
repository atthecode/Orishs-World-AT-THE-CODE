# Orish Play World — Toy Portal MVP

**AT THE CODE**

A mobile-first prototype where Orish turns toys and safe household play items a family already owns into real-world missions.

## What V1 does

- Grown-up chooses an age band: 4–5, 6–7, 8–10 or 11–12.
- Family selects at least two toys from the Toy Vault or adds a custom safe toy by name.
- Family selects a mission world and 10, 20 or 30 minute play length.
- Orish creates a multi-stage mission using the selected toys.
- Mission stages combine building, movement, observation, logic/coding and an optional twist.
- Browser speech synthesis lets Orish read mission instructions aloud.
- XP and completed-mission count are stored locally in the browser.
- The same toys can immediately generate a different adventure.

## £0 / free-first architecture

This prototype is plain HTML, CSS and JavaScript. It has no paid builder, paid AI API, backend, account requirement, analytics SDK, external font/library, child photo upload or unrestricted child chat.

The **Orish mission engine is procedural and on-device in V1**. It combines authored, age-adaptive mission components locally. That is intentional: validate the play experience before adding usage-based AI costs.

## Child-safety decisions

The mission can start only after a grown-up confirms a safe play area. Authored instructions prohibit climbing, throwing, roads, balconies and hot/sharp/medicine areas. Ages 4–5 are labelled as grown-up-together play.

This is a prototype, not a substitute for adult supervision or a completed production safeguarding review.

## Run

Open `index.html` in a modern browser. No build command is required. Or run `python3 -m http.server 8080` in this directory and open `http://localhost:8080`.

## Next production steps

1. User-test the mission loop with grown-ups and children.
2. Add the approved Orish character asset/animation instead of inventing a replacement character.
3. Integrate with the wider parent-owned Orish's World profile architecture.
4. Expand the mission library and safety test coverage.
5. Add a moderated generative-AI layer behind Orish only after privacy, safeguarding, cost limits and parent controls are defined.
6. Consider optional camera-assisted toy recognition later; do not make child image upload a requirement.

## Product promise

**Your toys. New adventure.**

The goal is not to sell families another physical toy. It is to make the toys they already own feel new again through structured, replayable missions guided by Orish.

# Orish's World — Explorer 3D Production Standard

Status: APPROVED DIRECTION — 24 August 2026

This replaces the rounded primitive avatar as the visual target for **My Explorer**. The existing local GLB is a technical prototype only and must not be presented as a finished character.

## Visual target

The Explorer must look like a believable premium animated character from the same cinematic universe as Orish:

- child presentation appropriate to the selected age band;
- coherent anatomy, expressive eyes, eyelids, mouth, ears, hands, fingers and footwear;
- polished skin, hair and fabric materials;
- a strong silhouette that remains readable on a phone;
- initial approved identity: Black child explorer, shoulder-length locs, navy/cyan jacket, trousers, trainers, backpack and subtle mission patches.

## Genuine customisation

Customisation must use authored geometry/material variants, never unrelated blocks or floating shapes.

Launch-ready options must include a broad real-world skin-tone range; rounded afro; beaded braids; shoulder-length locs; round curls; close waves; straight side-swept hair; natural and selected creative hair colours; Explorer, Scientist, Space, Chef and Artist outfit families; and coordinated colourways.

Every hairstyle must match its label from front, three-quarter and rear views and must not intersect the face, ears, neck or clothing.

## Orish remains distinct

Orish requires a separate owned 3D model based on the approved Orish reference: braided/cornrow hair, blue hoodie/jacket, explorer backpack and recognisable facial identity. Orish is not a recoloured Explorer, and the Explorer is not a modified Orish.

Both may share a documented humanoid skeleton and animation library where proportions allow, while keeping distinct faces, hair, clothing and silhouettes.

## Reusable animation library

Required clips: idle/breathing, walk, run, start/stop/turn, scan, point/explain, wave, celebrate, think/listen, gentle wrong-route reaction, console interaction, clue pickup and age-appropriate speech/facial expressions.

Walk and run must be separate animations, not one bobbing motion at different speeds. Feet must contact the floor believably, and both characters must fit through every Level 1 route and doorway.

## Technical delivery

- Blender-compatible master source and local glTF 2.0 `.glb` runtime delivery.
- No proprietary generator lock-in or paid runtime dependency.
- Named skin, eye, hair, outfit and accent parts where customisation needs them.
- Embedded/local textures, mobile-conscious geometry, textures and draw calls.
- Named animation clips tested after export.
- Documented scale, axis, ground origin and asset provenance.
- Commercial-use and ownership evidence for every source asset.

## Integration and acceptance

Replace `assets/models/avatar-base.glb` only after the new Explorer passes visual and movement tests. Preserve **Play as Orish** / **My Explorer**, private parent-approved profiles and saved choices. Walk/run controls must select matching clips. Collision must follow the body and fit every Level 1 space.

Acceptance requires coherent identity from all angles, hair labels matching geometry, natural skin under game lighting, no floating/intersecting clothing, readable hands/feet/facial features, distinct Orish and Explorer identities, responsive mobile performance, local loading, route-clearance tests and screenshots meeting the approved premium direction.

## Build policy

Use a free-first, open and reusable pipeline. Blender and standard glTF tooling are preferred. A paid modeller, scanning service or specialist asset may only be commissioned with explicit approval and a clear licence, cost and ownership handoff.

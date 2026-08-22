# V1.23 — Real 3D Avatar Layer

V1.23 moves My Avatar Lab from the CSS prototype figure to a real local **GLB 2.0** character asset rendered with an original **AT THE CODE WebGL viewer**.

## What is real in this build

- `assets/models/avatar-base.glb` is an actual binary glTF/GLB model, stored locally with the app.
- `modules/avatar-3d-viewer.js` parses the local GLB and sends its mesh data to WebGL on the device.
- The existing swipe/drag, turn buttons and auto-spin now rotate the 3D model through 360 degrees.
- Skin colour, hair colour, six hair groups, five outfit accessory groups and accent colour are applied live to named 3D mesh parts.
- Real Me and Creative Me still use the same child-safe local configuration model.
- If WebGL is unavailable, the V1.22 AT THE CODE renderer remains visible as a safe fallback rather than leaving a broken screen.

## Ownership / branding

The model in V1.23 is built from original parametric geometry for this prototype; it does not embed a third-party character asset or third-party logo. The child-facing UI remains Orish’s World / AT THE CODE.

The runtime does **not** call a 3D generation API, CDN, model marketplace or external character website. It uses the local GLB and local JavaScript only.

## Model-builder route

`tools/make-avatar-base.py` documents the reproducible model-building step used for the prototype. It uses the free/open-source Python `trimesh` development library to assemble basic geometry and export the result to GLB. That development dependency is not shipped into or executed by the child-facing app.

The final commercial character art can later replace this proof model while preserving the same part names and Avatar Lab controls.

## Deliberate limitation

This is a **real 3D engineering proof**, not final studio-quality character art. The next art pass should replace the simple parametric meshes with polished reviewed character meshes, facial detail, rigging and animations while keeping the local/private control architecture already proven here.

# AT THE CODE Character Forge — V1.23 architecture

## Purpose
AT THE CODE Character Forge is the internal 3D asset pipeline that will supply approved characters and avatar parts to Orish's World. The child-facing name is **My Avatar Lab**. Children do not see external provider branding or an embedded third-party creation website.

## Child-facing boundary
My Avatar Lab is limited to pre-approved avatar parts and colours. It does not request a child's photograph, camera feed, face scan, precise location, voice print, or unrestricted image-to-3D generation. The current prototype stores only avatar configuration choices locally against the active demo profile.

V1.22 proved the interaction model: Real Me / Creative Me / Surprise Me, inclusive natural skin tones, fantasy colours, hair choices, outfits, accent colours, swipe/drag 360-degree rotation, keyboard rotation, optional auto-spin and local save.

V1.23 now adds a real local GLB 2.0 model and an original AT THE CODE WebGL renderer. The current geometry remains an engineering proof rather than finished commercial character art. Reviewed production GLB/GLTF assets can replace the proof model later without changing the child controls or local avatar data model.

## Internal Character Forge pipeline
1. Start with original or appropriately licensed source artwork/assets.
2. Remove or prepare the background locally where practical.
3. Run an approved image-to-3D reconstruction worker when needed. An open-source TripoSR-compatible route may be evaluated separately; its licence and notices must be preserved in technical/legal documentation.
4. Review the mesh before it is allowed into the child product.
5. Optimise topology, textures and file size for mobile.
6. Rig and animate approved models where required.
7. Export a reviewed GLB/GLTF master plus optional OBJ/authoring formats.
8. Register the approved model and modular parts in the AT THE CODE Character Library.
9. Only approved library assets become available in My Avatar Lab.

## White-label rule
The product interface remains Orish's World / AT THE CODE. No third-party service UI, logo, watermark or "powered by" label is added to the child experience unless a future licence or commercial contract explicitly requires it. Any required open-source notices belong in the appropriate licence/legal documentation, not as competing child-facing branding.

## Production next steps
- Replace the prototype renderer with tested mobile-friendly GLB/GLTF characters.
- Add modular meshes/materials for hair, outfits, accessories and mobility/accessibility representation.
- Add animation clips for idle, walk, celebrate, think and wave.
- Keep child profile/avatar data minimal and separate from biometric identity.
- Benchmark iPhone/iPad performance and memory before expanding the asset catalogue.


## V1.23 proven bridge

`assets/models/avatar-base.glb` + `modules/avatar-3d-viewer.js` now prove the real model bridge: load locally, map named mesh parts, recolour them, select hair/outfit groups, rotate 360°, and fall back safely when 3D is unavailable.

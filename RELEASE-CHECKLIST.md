> **V1.28 release note:** local voice adapters/scripts are present and contract-tested; actual Whisper/Kokoro model quality, latency and device behaviour are not claimed until installed and physically tested.

# Orish's World @ THE CODE — V1 Release Checklist

## Core V1 status
The local/free-build feature set is complete at **V1.19**. It is ready for controlled prototype testing, not public use with real child data.

## Verified in this build environment
- JavaScript syntax for `app.js`, every module and the service worker.
- Unique HTML IDs and app DOM-reference coverage, including dynamic maths/literacy answer inputs.
- Manifest JSON validity and icon dimensions.
- Explicit service-worker shell presence and restricted same-origin cache boundary.
- No `eval`, `new Function`, camera, microphone input, geolocation, WebSocket or EventSource use.
- Security-header template and local CSP alignment.
- Functional local-storage test confirming profile deletion removes profile-scoped records.
- Local HTTP smoke test for all precached shell files.

## Must still happen before real child use
1. Test on physical iPhones/iPads and representative Android devices, including orientation, keyboard and Add to Home Screen.
2. Test VoiceOver/TalkBack and real touch-target/focus behaviour.
3. Replace browser-only PIN/localStorage storage with production accounts, server-side authorisation and an appropriate secure data store.
4. Complete child privacy/data-protection assessment, safeguarding review and legal review for launch jurisdictions.
5. Run professional security review/penetration testing on the production deployment/backend.
6. Validate production recipes, activities and learning claims.
7. Test any future live AI/web-search gateway separately before enabling it for children.
8. Wrap/test with Capacitor/Xcode/TestFlight if publishing to the Apple App Store; approval cannot be guaranteed.

## Free deployment path
The static V1 can remain GitHub-first and deploy to a compatible free static host. The included `_headers` file is a starting point for hosts that support response-header configuration, including Cloudflare Pages. HTTPS is required for service-worker/PWA behaviour outside localhost.

## V1.22 Avatar Lab checks
- [ ] My Avatar Lab opens from Create & Make and returns safely to the World.
- [ ] Real Me shows natural tones; Creative Me adds fantasy colours.
- [ ] Drag/swipe, arrow keys and turn buttons rotate the prototype character.
- [ ] Reduced-motion preference prevents auto-spin.
- [ ] Avatar choices save locally per active profile and no photo/camera permission is requested.
- [ ] Character Forge legal/licence review is completed before any external 3D reconstruction component is added.
- [ ] Production GLB/GLTF assets are performance-tested on real iPhone/iPad hardware before release.


## V1.23 Real 3D Avatar checks

- [ ] `assets/models/avatar-base.glb` has GLB magic `glTF`, version 2, JSON and BIN chunks.
- [ ] Expected Skin / Hair / BaseOutfit / Outfit / Accent mesh groups are present.
- [ ] `modules/avatar-3d-viewer.js` passes `node --check`.
- [ ] No runtime CDN, third-party model host or paid 3D API is required.
- [ ] GLB and 3D viewer are included in the approved service-worker shell.
- [ ] Real Me, Creative Me, Surprise Me, save and delete behaviour remain intact.
- [ ] Physical iPhone/iPad WebGL rotation/customisation test completed before external demo claims.
- [ ] V1.22 fallback remains usable when WebGL is unavailable.


## V1.24 Living Avatar checks
- [ ] WebGL avatar idles without visible clipping on iPhone/iPad and Android test devices
- [ ] Wave / Power Pose / Celebrate return to idle
- [ ] reduced-motion preference disables non-essential motion
- [ ] local avatar capture is never uploaded
- [ ] in-world My Explorer strip falls back cleanly when WebGL/capture is unavailable
- [ ] Edit avatar returns to Avatar Lab with saved local choices


## V1.25 Global History & Culture checks
- [ ] Global History & Culture opens from Discovery District and returns safely to World.
- [ ] Black Changemakers and Culture Explorer switch without a page reload.
- [ ] All starter profiles show at least one named reputable source organisation/title.
- [ ] Child mode does not navigate to external source URLs.
- [ ] History completion stores only the learning outcome, not private ancestry or cultural identity data.
- [ ] 0–2 remains parent-led; 13–16 shows more mature evidence/context framing.
- [ ] Culture packs identify community/place/time context and include anti-stereotype guidance.
- [ ] History content receives human educational/editorial/cultural review before public child release.


## V1.26 — Are We Alone?

Added the age-adaptive, source-backed extraterrestrial-life evidence investigation. See `ARE-WE-ALONE.md`. Children do not get unrestricted web access; claims are never upgraded to facts without verifiable evidence.

## V1.27 Open Voice gate

- [ ] Keep two-way voice OFF by default in production migrations.
- [ ] Do not ship local model weights until their exact licences and provenance are reviewed.
- [ ] Do not expose a child directly to an unrestricted open LLM.
- [ ] Put production voice behind authenticated HTTPS and server-side parental policy.
- [ ] Verify retention/deletion, rate limits, capacity, abuse handling and privacy-safe observability.
- [ ] Complete real iPhone/iPad/Android microphone, interruption and accessibility testing before release.

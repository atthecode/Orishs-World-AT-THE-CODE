> **V1.28:** local STT/TTS adapters do not change the AI-safety boundary. Child speech still reaches the approved Orish router first; an open model is not automatically child-safe.

# Orish AI Safety Architecture

## V1
No paid or live generative AI is required for the first shell. Local templates and reusable game engines provide the first safe experience.

## Future talking AI
1. Child/parent input is received through a protected gateway.
2. Access role and age band are resolved server-side.
3. Input safety checks run before model invocation.
4. The model receives only the minimum context required.
5. Output is constrained to an age-appropriate Orish policy.
6. Output safety checks run before it reaches the child.
7. Game generation produces structured game configuration, never arbitrary executable JavaScript.
8. AI usage is rate-limited by subscription/account policy at the adult account level.
9. Provider keys stay server-side.

## Privacy
Raw voice/transcripts should not be permanently stored by default. Production retention must be explicit, minimised and configurable where appropriate.


## V1.15 AI research-literacy boundary
The AI Evidence Detective is an educational workflow, not a live unrestricted research agent. Children are taught that AI output can contain mistakes or fabricated citations. The prototype uses local curated lessons and encourages important claims to be traced to checkable sources. Future live AI/search connections must remain behind the adult/safety architecture and must not expose unrestricted web retrieval directly to young children.

## V1.16 Orish Intelligence boundary
- Child requests are routed locally into a fixed allow-list of approved activity/game engines.
- The prototype does not execute model-generated JavaScript, HTML, commands or arbitrary child-provided code.
- A future generative model must return constrained content/configuration for approved engines through a server-side gateway; the client must not hold provider secrets.
- The child router does not read private Parent Studio back-channel wording.
- Local safety patterns redirect clearly harmful, explicit or security-bypass requests instead of turning them into activities. These patterns are a prototype layer, not a substitute for production moderation/safeguarding review.


## V1.17 AI parent controls
- Free-text Ask Orish can be disabled per profile and remains always disabled for 0–2.
- Curated local quick prompts can remain available when free-text input is disabled.
- The local intelligence layer continues to route only into approved engines and does not execute generated code.
- Live generative AI and open-web search are locked off in the prototype; enabling them later requires a reviewed server-side gateway, child-safe retrieval/moderation design and explicit adult controls.


## V1.19 release boundary
Release hardening does not enable live generative AI or open-web research. Those capabilities remain locked out of the local V1 prototype and require a reviewed server-side safety gateway before future production use.


## V1.23 avatar generation boundary

My Avatar Lab does not use generative AI in V1.23. The model and its approved customisation parts are local. A future parent/developer Character Forge may use a reviewed image-to-3D service behind an adult-only gateway, but that capability is not exposed to children in this build.


## V1.24 animation boundary
The living-avatar actions are deterministic local animation rules. No generative AI creates executable animation code, poses or child-facing 3D content in this release.


## V1.25 historical-claim boundary
A future live model may help phrase questions or suggest research terms, but it must not publish a new historical claim directly into approved child content. Historical profiles require a reviewed source trail. Popular claims, disputed credit and uncertain stories must be labelled and checked rather than presented as fact because an AI states them confidently.


## V1.26 — Are We Alone?

Added the age-adaptive, source-backed extraterrestrial-life evidence investigation. See `ARE-WE-ALONE.md`. Children do not get unrestricted web access; claims are never upgraded to facts without verifiable evidence.

## V1.27 — Open Voice boundary

Two-way voice is now represented as a self-hosted gateway architecture rather than a direct child-to-hosted-model API. The microphone is parent opt-in, 0–2 remains parent-led, and each recorded turn is bounded. Speech-to-text returns text into the existing approved Orish router. V1.27 does not allow an optional local LLM to bypass that router, generate executable code, enable open-web access or redefine child-safety policy. Open/local models still require content controls, testing and human governance.

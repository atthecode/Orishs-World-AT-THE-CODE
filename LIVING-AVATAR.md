# V1.24 — Living Avatar

V1.24 builds on the local GLB/WebGL avatar proof and adds lightweight on-device motion without introducing an external runtime, paid API or third-party child-facing brand.

## Added

- subtle idle bob / breathing motion
- gentle head sway
- periodic blink animation
- procedural Wave, Power Pose and Celebrate actions
- reduced-motion handling
- local 3D snapshot after save for the child-world “My Explorer” companion strip
- fallback companion badge when a 3D snapshot is unavailable
- one-tap return from the world to edit the saved avatar

## Technical boundary

These are procedural mesh-group animations, not a production skeletal rig. The model remains the original V1.23 engineering GLB proof. A later art pass can replace it with a rigged premium model while preserving the same profile data and controls. No child photo, face scan, biometric template, remote avatar generator or external branded character UI is used.

The 3D screenshot used inside the world is generated locally from the avatar canvas and held in memory only; it is not uploaded or treated as a photograph of the child.

# ORISH’S WORLD @ THE CODE — SHOWCASE CINEMA & SPOTLIGHT SHARING

**Status:** Mandatory safety/product design for child-created films

This document supplements the main Codex handoff and the Movie Studio / creative cinema direction.

## Core concept

Children can create cartoons in their private Movie Vault, then optionally submit selected creations to an **Orish’s World Showcase Cinema**.

The Showcase Cinema is a controlled, moderated exhibition space for child-created cartoons. It is not an open social network.

The platform owner may select exceptional submissions as **Spotlight Films** for official Orish’s World promotion, but only through the parent/guardian permission process below.

## Required flow

PRIVATE MOVIE VAULT → CHILD CHOOSES “SUBMIT TO SHOWCASE” → PARENT/GUARDIAN REVIEW & APPROVAL → AUTOMATED SAFETY CHECK → HUMAN/OWNER MODERATION → SHOWCASE CINEMA → OPTIONAL SPOTLIGHT SELECTION → SEPARATE PARENT/GUARDIAN APPROVAL FOR EXTERNAL SOCIAL SHARING → PLATFORM-OWNER SOCIAL EXPORT

A child must never be able to publish a film publicly or externally by themselves.

## NON-DOWNLOAD RULE — CHILDREN, PARENTS AND VIEWERS

**Children, parents/guardians and Showcase viewers must NOT be given a download-video function.**

Parent/guardian control is for consent, review, deletion requests, Showcase approval and external-sharing permission. It does **not** give the parent a downloadable copy of the media file.

Reasons include reducing the risk that child-created media, character assets, voices or scenes are copied outside the protected environment, reconstructed, manipulated, re-uploaded or reused for harmful purposes.

Required product rules:

- no child-facing Download button
- no parent-facing Download button
- no Showcase-viewer Download button
- no public raw Blob Storage URLs
- use authenticated/authorised playback and short-lived access where practical
- keep original masters private
- do not expose source assets, individual character layers, voice stems, editable project packages or generation files to end users
- prevent ordinary UI actions from exposing direct permanent media URLs where practical
- log sensitive media access and platform-owner exports
- remove unnecessary metadata from any approved external export

No web/app system can guarantee that a determined viewer will never screen-record visible content, so the design must combine technical controls, minimal exposure and strict permissions rather than claiming absolute prevention.

## Showcase Cinema rules

- Parent/guardian account controls whether Showcase submissions are allowed for each child profile.
- Every submitted film must pass moderation before appearing.
- No open DMs, unrestricted comments, stranger messaging, follower systems or location sharing.
- Do not expose a child’s real full name, email, school, address, exact location, date of birth or other identifying information.
- Use a parent-approved display name, fictional creator name or safe platform alias if attribution is shown.
- Prefer broad age band rather than exact age where age context is useful.
- Strip unnecessary file metadata before publication/export.
- Child-created films remain private by default unless the parent explicitly approves a Showcase submission.
- Showcase playback must not provide a downloadable master file.

## External Orish’s World social sharing

A film being approved for the internal Showcase does **not** automatically grant permission for TikTok, Instagram, YouTube, Facebook, advertising, websites, press, trailers or other external distribution.

External sharing requires a separate, clear parent/guardian approval for that specific film or a suitably designed, revocable creator-sharing permission model reviewed before launch.

The parent should be shown:

- the exact film being considered
- the creator display name / attribution that will appear
- where Orish’s World may share it
- whether it may be edited into a trailer, montage or promotional clip
- whether the Orish’s World logo/watermark will be added
- how long permission applies
- how to withdraw future use where applicable

The parent approves or declines the platform’s use; **approval does not unlock a parent download**.

Do not rely on vague blanket wording hidden in general terms.

## Spotlight Films

The platform owner can select outstanding Showcase submissions as **Spotlight Films**.

Spotlight can celebrate:

- storytelling
- creativity
- science ideas
- positive Black history/inventor missions
- literacy improvement
- animation/editing
- humour
- world-building
- clever reuse of Movie Vault scenes
- costume/wardrobe design
- strong educational ideas

Spotlight selection must not become a popularity contest based on public follower counts or unrestricted likes.

Safer recognition can include:

- “Orish’s Pick”
- “Young Filmmaker Spotlight”
- “Inventor Story Spotlight”
- “Science Cinema Spotlight”
- “Best Remix”
- “Brilliant Storytelling”

## Download/export for the PLATFORM OWNER ONLY

Only an authorised Orish’s World owner/admin role may have a secure **Create Spotlight Export** / **Download Spotlight Export** action, and only for films that have the required parent/guardian external-sharing permission.

This privilege must not be inherited by parent accounts, child accounts, moderators without export permission, or ordinary Showcase viewers.

Where practical, export a **social-safe derivative** rather than exposing the private master. The export process should automatically:

- render only the approved version
- remove unnecessary metadata
- use safe attribution only
- avoid exposing private child/account identifiers
- use generated character voices rather than raw child voice by default
- add optional Orish’s World branding/watermark
- preserve the creator credit according to the parent-approved safe display name
- record the consent state, admin identity, purpose, timestamp and export audit event

Do not make every child-created film freely downloadable by admins for promotional use without the correct permission state.

## Child voice/privacy rule

For Showcase or external social sharing, default to the approved generated character voices rather than publishing a child’s raw recorded voice.

If any future feature proposes publishing a child’s real voice, treat that as a higher-risk privacy/safeguarding feature requiring explicit parent permission and specific legal/privacy review before launch.

Orish’s own voice remains locked and consistent across all films.

## Real children / images

The Movie Studio should remain cartoon-focused. Do not allow children to upload or generate realistic likenesses of themselves or other children for public Showcase content by default.

Use fictional characters, approved avatars and stylised cartoon assets.

## Reuse and remix

A child can continue editing and remixing their private film after submitting a version to Showcase **inside Orish’s World**, without downloading the source video.

The Showcase submission should be treated as a versioned snapshot so later edits do not silently change an already approved public film.

If the child creates a materially different version and wants it showcased, it should go through submission and parent approval again.

Movie Vault reuse should happen through controlled in-app scene, character, wardrobe, dialogue and editing tools rather than exporting raw files to the device.

## Safety over virality

The purpose of Showcase Cinema is to celebrate creativity and inspire other children while preserving privacy and safeguarding.

Growth/marketing must never override the child-safety model.

The platform should make it easy for a parent to:

- see what their child submitted
- withdraw a Showcase submission where appropriate
- manage external-sharing permissions
- request deletion
- review previous approvals

These controls do not require media-download access.

## Product opportunity

This gives Orish’s World a powerful loop:

CREATE → LEARN → EDIT IN APP → SAVE → SUBMIT → SHOWCASE → CELEBRATE → INSPIRE OTHER CHILDREN

Exceptional parent-approved Spotlight Films can then become official Orish’s World social content, trailers, montages or campaign clips through the restricted platform-owner export process, without treating children’s private creative work as automatically available for marketing or downloadable by family/viewer accounts.

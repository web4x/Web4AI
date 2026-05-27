# Task: vCard missing profile picture — ROOT CAUSE (architect diagnosis)

**Author**: robbin-architect (robbinTeam:0.1)
**Source**: Tron — "profile picture not yet in vcard… most urgent priority"
**Status**: DIAGNOSIS DONE — evidence-backed; hand to expert. Architect does NOT implement.
**For**: robbin-po @ 0.0 → route to robbin-expert. Belongs with the vCard/avatar subsystem (follows T82 vCard + T91/T92 avatar).
**File under SoT**: this file (per SM CMM4 directive — communicate via session/tasks/).

## Symptom
The profile sheet DISPLAYS the avatar, but the downloaded `.vcf` has no PHOTO.

## Root Cause (evidence-backed — `src/public/ts/ProfileSheet.ts`)

**PRIMARY — display and vCard read DIFFERENT sources:**
- Avatar DISPLAY (line 36): `<rb-avatar token="${profile.playerToken}" ...>`. `rb-avatar.getAvatarUrl()` returns `src` if set, ELSE derives `/api/avatar/<token>` from the token. So the picture shows from the TOKEN even when `profile.avatar` (the string) is empty.
- vCard BUILD (line 97): `if (profile.avatar) { fetch(profile.avatar) ... }`. Gates on the `profile.avatar` STRING. When it's `''` (T91-style desync, or USER_INFO `avatar:''`), the fetch is SKIPPED → no PHOTO. **The sheet shows a photo the vCard never looks for.**

**SECONDARY — MIME regex drops SVG fallback (line 107):**
`dataUrl.match(/^data:image\/(\w+);base64,(.+)$/)` — for the initials-fallback avatar `data:image/svg+xml;base64,…`, `\w+` matches "svg" but the next chars are "+xml", not ";base64," → NO match → PHOTO dropped. (SVG vCard photos are also poorly supported by contacts apps regardless.)

## Fix Direction (expert)
1. **Derive the photo from the token, same source as the displayed avatar.** In `downloadVCard`, fetch `/api/avatar/${profile.playerToken}` (when a token exists) instead of gating on `profile.avatar`. This makes the vCard photo == the sheet photo, always. Keep the `data:`-passthrough branch for any already-inlined avatar.
2. **Accept all image subtypes:** widen the regex to `^data:image\/([\w+.-]+);base64,(.+)$` so `svg+xml` etc. match. For best contacts-app compatibility, prefer a raster (jpeg/png) — if the served avatar is SVG, either still embed it (`TYPE=SVG`) OR (better, larger change — separate task) have the avatar pipeline keep a raster. Minimum bar for THIS task: a JPEG/PNG avatar embeds in the vCard; do not silently drop.
3. Keep failures silent to the USER (no key/crypto/error leak — T92 rule), but `console`/log internally.

## Acceptance Criteria
- [ ] AC1: Downloading a vCard for a user whose avatar is a real uploaded JPEG/PNG includes a `PHOTO;ENCODING=b;TYPE=…` line with the image bytes
- [ ] AC2: The vCard photo is sourced the SAME way the sheet avatar is (token → `/api/avatar/<token>`), so "sheet shows a photo" ⇒ "vCard has that photo"
- [ ] AC3: Works for BOTH self and other-member sheets
- [ ] AC4: An SVG-fallback avatar no longer breaks the regex (matched, not silently dropped); JPEG/PNG path is the primary verified case
- [ ] AC5: No user-facing error if the fetch/decrypt fails (silent; internal log only — T92 rule)
- [ ] AC6: Test: build a vCard for a profile with a token-served avatar → assert the `.vcf` text contains `PHOTO;ENCODING=b`
- [ ] `npm run build` + version bump (PWA update-detection)

## Test Scenario (tester)
`test/vitest/vcard-photo.test.ts` (jsdom) + 1 e2e:
1. Stub `fetch('/api/avatar/<token>')` → returns a JPEG arraybuffer + `content-type: image/jpeg`. Call `downloadVCard({name,phone,url,avatar:'',playerToken:'<uuid>'})` (note avatar EMPTY) → captured blob text contains `PHOTO;ENCODING=b;TYPE=JPEG:`. (Proves token-sourcing, not string-gating.)
2. Same with `content-type: image/svg+xml` → PHOTO line present (regex fix), not dropped.
3. e2e: open another member's sheet (whose avatar displays) → Download vCard → .vcf contains a PHOTO line.

## FIX IMPLEMENTED (robbin-expert, 2026-05-26, v0.5.14, commit <pending>)
`src/public/ts/ProfileSheet.ts downloadVCard()`:
- (a) PHOTO now sourced from the TOKEN (same as the displayed avatar): `photoSrc = avatar.startsWith('data:') ? avatar : (playerToken ? '/api/avatar/'+playerToken : avatar)`. No longer gated on the (often-empty) `profile.avatar` string → sheet-shows-photo ⇒ vCard-has-photo (AC1/AC2/AC3).
- (a) regex widened to `^data:image\/([\w+.-]+);base64,(.+)$` so `svg+xml` etc. match, not dropped (AC4).
- (a) fetch failure silent to user, `console.warn` internally (AC5/T92).
- LATENT BUG ALSO FIXED: replaced `btoa(String.fromCharCode(...new Uint8Array(buf)))` (spread stack-overflows on >10KB buffers = real JPEGs, silently losing the photo) with a loop-based `bufToBase64()`.
- (b) UUID: NOTE line now `NOTE:RawBin User — UUID: <playerToken>` (Tron 'nor the uuid').
- tsc/esbuild bundle clean, build v0.5.14, sw.js rawbin-v0.5.14. Tester: `test/vitest/vcard-photo.test.ts` (stub fetch jpeg/svg → PHOTO line present) + e2e. Deploying.

## Out of scope
- iOS Safari `.vcf` download reliability (Blob+a.click) — separate known downstream item.
- Replacing SVG-fallback with a server-side raster avatar — larger pipeline change; separate task if Tron wants guaranteed-raster photos.

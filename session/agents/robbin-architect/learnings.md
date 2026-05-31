# robbin-architect — Learnings

## Working Directory Split
The RawBin project has TWO working directories:
- **Planning/docs:** `workspaces/Web4RawBin/` (in the Claude workspace)
- **Implementation:** `workspaces/2cuGitHub/Web4RawBin/` (the GitHub clone)

Sprint planning, task files, templates, and role docs go in the first. Code changes go in the second. Always check which dir the PO specifies. Build verification (`esbuild`) runs in 2cuGitHub.

## PlantUML Rendering
- PlantUML is installed via homebrew. Use `plantuml -tsvg file.puml` to render.
- SVG filenames inherit from the `title` in the PUML. If the title has spaces/unicode, the output filename will too. Rename immediately after rendering.
- Always verify SVGs are non-trivial (>10KB = real diagram, <1KB = error).

## Template Audit Approach
When standardizing templates across sprints, extract header fields from ALL task files programmatically (`grep -E "^\*\*(Status|Assigned|..."`) to find inconsistencies. Don't sample — scan everything. The patterns only emerge from the full set.

## Sprint 2 Format Is Canonical
After auditing 33 files: Sprint 2 had the most consistent format. Key decisions:
- `Effort` not `Estimated effort`
- `Dependencies` not `Depends on`
- `T<N>:` not `Task <N>:`
- Priority field dropped (task order in planning.md IS the priority)

## CSS Class Naming
When replacing UI components, use a distinct prefix (e.g., `mb-` for member badges) so old and new classes don't conflict during transition. Remove old classes from CSS after confirming no references remain.

## ProfileSheet Pattern
For bottom-sheet overlays: create overlay div, append to document.body, add touchstart/touchmove listeners for swipe-to-dismiss (threshold: 50px). Use one-shot event handler pattern (`client.on` + `client.off` in handler) for request-response flows like GET_USER_INFO → USER_INFO.

## Build Verification
Always run `esbuild` after client-side changes to catch import errors. The bundle size is a useful sanity check (63KB as of Sprint 6).

## Linter Modifies Files
The project has a linter/hook that may modify files between my edits. Always re-read files if an edit fails with "File has been modified since read." The linter changes are intentional and should be preserved.

## Never Assume File State
The 2cuGitHub working dir may be updated independently by other agents (expert, tester). My T11 ProfileSheet was created in 2cuGitHub but RoomView didn't have the import when I came back for T19 — the expert had updated the file separately. Always read current state before editing.

## PO Process Doc Structure
When creating role process docs, reference the Web4Articles canonical format but adapt — don't copy verbatim. RawBin is simpler (no requirements.md yet, no PDCA cycle yet). Include concrete violation examples from team history to make rules tangible.

## iOS PWA Assets
- Use `sips -z H W file.png` for resizing icons on macOS (no ImageMagick needed).
- iOS requires apple-touch-icon at 180x180 specifically — 192px won't be used.
- Splash screens: pure Python PNG generation works for solid-color backgrounds (no PIL needed). Use struct+zlib for minimal valid PNGs.
- The 180px icon must NOT use `"purpose": "maskable"` — iOS doesn't support maskable icons and will crop incorrectly. Use `"purpose": "any"`.
- iOS ignores manifest.json for splash screens — must use `<link rel="apple-touch-startup-image">` with media queries matching exact device-width/height/pixel-ratio.

## WS Reconnect Architecture
- Exponential backoff belongs in the client class, not the UI. The client emits events (`reconnecting`, `reconnected`, `online`, `offline`, `queued`, `queue-flushed`) that the UI subscribes to.
- Message queue: buffer as serialized JSON strings (not objects) so replay is just `ws.send(data)` with no re-serialization.
- On reconnect, replay the queue BEFORE the welcome/IDENTIFY flow completes — the server processes messages in order anyway, and queued messages from the previous session (like CHAT_MESSAGE) will be handled after re-identification.
- Manual reconnect (user taps status dot) should reset backoff to 0 for immediate retry, distinct from the auto-reconnect schedule.

## Web Component Migration Strategy
- Light DOM for most components — RawBin uses a single app.css with well-namespaced prefixes (mb-, ws-, chat-). Shadow DOM only for truly self-contained overlays (rb-qr-popup, rb-chat-sheet) that have position:fixed and their own complete style blocks.
- Use Custom Events with `bubbles: true` for component→parent communication. The parent listens on the container, not on the component directly. This decouples the component from its consumer.
- When extracting from a god class (RoomView was 372 lines), do it incrementally — one component per task, each independently deployable. Track RoomView line count across tasks to prove the extraction is working.
- The linter/expert may modify files between architect tasks. Always `cat -n` the file via Bash before editing — the Read tool's "unchanged" detection can be stale when external modifications happened between system reminders.
- For Shadow DOM components that need share/clipboard: embed the logic in the component rather than importing a utility — keeps the component truly self-contained.

## PWA Cache Review Checklist
When reviewing PWA caching, check these specific items:
1. CACHE_NAME in sw.js matches package.json version
2. activate handler deletes ALL old caches (keys.filter !== CACHE_NAME)
3. self.skipWaiting() should ONLY be in message handler, never unconditional in install
4. sw.js itself must be served with no-cache (not max-age=3600)
5. Mutable assets (app.css, manifest.json) need no-cache headers OR content hashing
6. All STATIC_SHELL entries exist as actual files (icon-180 was missing)
7. Update flow: version check → banner → user click → skipWaiting → controllerchange → reload — verify each step

## Hybrid Encryption Design
- RSA-2048 max plaintext is 190 bytes (OAEP SHA-256). Files (avatars ~100KB) need hybrid encryption: random AES-256 key per file, encrypt data with AES-256-GCM, encrypt the AES key with RSA public key.
- Use `storedName` parameter for deterministic filenames (e.g. 'avatar') so serving endpoints can find them by convention. Random hex names for user-uploaded arbitrary files.
- GCM provides authenticated encryption — the authTag in meta.json detects tampering without a separate HMAC.
- Server holds both keys (encryption-at-rest, not E2E). True E2E = private key only on client = future work.

## Avatar URL Migration
- Old: base64 data URLs stored in profile.avatar field and localStorage. New: `/api/avatar/<token>` URLs pointing to encrypted files on disk.
- ProfileSheet.downloadVCard must handle BOTH — check if avatar starts with `data:` (old) or is a URL (new). For URLs, fetch → arrayBuffer → btoa → embed as PHOTO.
- When adding avatar display to existing pages, always provide `/icon-192.png` as fallback for profiles without avatars.

## Bug Reproduction with Playwright
- When reproducing UI bugs, write a standalone tsx script (not a test file) — faster iteration, direct console output.
- Handle the full user flow: profile gate → device enrollment → lobby → room. The secret code isn't always in the client profile object (backfill PROFILE_UPDATED overwrites without secretCode). Capture it by intercepting JSON.parse on the raw WS message.
- Take screenshots at every state transition. Compare BEFORE/AFTER programmatically (attribute values, not visual diff).
- The measurement task found that the src attribute DID update (mechanism works) but the image load failed (onerror → fallback) — a different root cause than assumed. NEVER ASSUME — ALWAYS MEASURE.

## Monaco Editor Architecture
- Separate entry point (edit.ts/edit.html) — not a tab in /app. Monaco is 5MB, can't bloat the main bundle.
- CDN loading (cdn.jsdelivr.net) with AMD require() — Monaco doesn't support ESM natively. Load the loader first, then require Monaco, then import the app entry.
- FileApi.ts as a separate server module — same pattern as UserKeys.ts and UserCrypto.ts. Domain-specific logic in focused modules, not inline in the 1,249-line server.ts.
- Shadow DOM for rb-code-editor and rb-preview — Monaco injects hundreds of CSS rules that would bleed into the page without isolation.
- mtime-based conflict detection — simple, fast, good enough for single-user dev tool. Content hashing is over-engineering.

## Cross-Linking Pattern
- pageNav() helper with optional editPath parameter — backward compatible, existing calls unaffected.
- Edit links use orange color (#ff9800) to visually distinguish from navigation links.
- Edit icons in directory listings: check extension against editable set, only show ✏️ for text files.
- View link in editor toolbar: only for .md/.puml (files that have meaningful rendered output at /md/).

## TRON RULE: No Artificial Character Limits
NEVER introduce maxlength, truncation, or arbitrary size boundaries on user input fields. No maxlength attributes on inputs, no `.slice(0, N)` on user-provided strings, no artificial boundaries. This applies to ALL specs, ALL components, ALL future work. If a technical limit exists (e.g. WS frame size, DB column), handle it gracefully at the boundary — don't pre-truncate user input.

## Decrypt-Exception Must Never Trigger Destructive Overwrite (avatar recurrence)
A "fileExists" guard does NOT protect a file whose decrypt THROWS. `ensureAvatar` overwrote real avatars because `decryptFile` threw (key mismatch after key regen/token redirect) and the `catch` fell through to write a default. RULE: distinguish "no file" (regenerate OK) from "present-but-undecryptable" (NEVER overwrite — log, leave intact, prompt re-upload). Encrypted-at-rest files MUST be re-encrypted (not orphaned/overwritten) on any key rotation or identity rekey. Disjoint-data check before sequencing migrations: avatars live on UUID dirs; token-* dirs being migrated had 0 avatars/0 keys → no interaction.

## Async Side-Effect Messages Re-Trigger Handlers
The avatar backfill (Sprint 7) sends a SECOND PROFILE_UPDATED after the synchronous one. Any client handler that fires a callback on PROFILE_UPDATED runs TWICE. This caused the T80 enrollment bug: ProfileEditor.onSave fired on both messages, re-opening DeviceEnrollDialog mid-flow and resetting #de-submit to disabled.
- Pattern: callbacks bound to a message that the server may send more than once must be ONE-SHOT — clear the callback before invoking it (`const cb = this.onSave; this.onSave = null; cb(...)`).
- Deeper fix: don't overload one message type for distinct events. A backfilled avatar should be its own AVATAR_UPDATED message, not a reused PROFILE_UPDATED.
- When diagnosing "button stays disabled" or "dialog resets" bugs: suspect a re-render triggered by a duplicate/async message. RUN the test to capture the actual Playwright locator state rather than theorizing from code.

## CMM4 Standing Rules (S17+)
- **#18 Planner-first:** planner creates task file with T-number FIRST, then architect refines into it. Never design from harness numbers or create task files.
- **#46 Web4Articles template:** every sub-task file must have Status, Traceability, AC, Dependencies, DoD, QA Audit, Subtasks sections. No skeleton-only designs.
- **Task files = single source of truth.** Write designs INTO task files before reporting via otmux. SM enforces this.

## UpDown Convention: 5-Level UUID Index
UcpStorage (Persistence/0.3.23.0 line 300-303): `uuid.replace(/-/g,'').substring(0,5).split('')` → 5 single-char directories. Example: `44443290-...` → `index/4/4/4/4/3/`. NOT a flat 5-char folder.

## PlantUML @startuml Naming
Always set `@startuml` to a path-safe slug (no spaces, no unicode). PlantUML derives SVG filename from the @startuml title. Unicode em-dash in title → broken filename on disk → SVG-not-found. Use a separate `title` directive for the human-readable display text.

## Symlink Visibility: Two Browsers
- `/md/` directory handler (server.ts): uses `withFileTypes`, checks `isSymbolicLink()`, shows 🔗 marker. Correct.
- `/api/files/` (FileApi.ts readDir): was dropping symlinks — `isFile()` and `isDirectory()` both return false for symlinks. Fixed by adding `isSymbolicLink()` check + `statSync` target.

## vCard Parse (Pre-T142)
- RFC 6350 line unfolding: lines starting with space/tab are continuations. `text.replace(/\r\n[ \t]/g, '')`.
- PHOTO field: v3 uses `ENCODING=b;TYPE=JPEG`, v4 uses `MEDIATYPE=image/jpeg`. Handle both.
- Feed photo Blob into existing rb-avatar upload pipeline via a new `uploadBlob(blob)` method — no new server endpoint needed.

## Skill Catalog (T139)
16 skills across 6 domains: core CRUD (4), migration (3), view generation (2), source location (2), tracelink (2), chain integrity (3). All return `SkillResult<T> = {ior, unit, links[]}`.

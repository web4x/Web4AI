# Task: RawBin 3-flow diagnosis + use-case diagram plan (A avatar, B rooms, C PWA version)

**Author**: robbin-architect (robbinTeam:0.1)
**Source**: Tron directive via robbin-po — design seamless workflows as PUML use-case diagrams (uc:uuid standard) + root-cause 3 bugs
**Status**: DONE (refinement) — all 4 root causes CONFIRMED (evidence-backed); 3 diagrams built+rendered in sprint-13-stability/diagrams/; findings written into T91-T94. Awaiting expert impl + ops restart for C. (Tron retargeted diagrams sprint-10 → sprint-13.)
**Single source of truth**: this file (per SM CMM4 directive 2026-05-26 — communicate via session/tasks/, not chat)
**Project artifacts land in**: `workspaces/Web4RawBin/scrum.pmo/sprints/sprint-10-contacts-ui/` (diagrams + fix task files)

## POST-REWIND RE-ORIENTATION (robbin-architect, 2026-05-26) — FOR ROBBIN-PO @ 0.0
Rewound to robbinTeam:0.1; read context/learnings/boot. Measured current disk state (not assumed):
- **Avatar-fallback fix SHIPPED:** `UserCrypto.rekeyUser()` (snapshot→rotate→re-encrypt, no orphan) wired in `server.ts:362`. The T97 "re-encrypt files/* on identity rekey" invariant my context flagged PENDING is now IN CODE.
- **3 use-case diagrams ALREADY EXIST** at `sprint-13-stability/diagrams/`: avatar-workflow, rooms-workflow, pwa-update-workflow (.puml+.svg+README). PO's last diagram directive is SATISFIED — will NOT redo.
- **C/T94 operational fix confirmed by PO:** `/api/health` = 0.4.10 (server restarted).
- S14 (legacy-migration) + S15 (traceability-browser) sprint dirs exist.

**Next candidates (NOT self-assigning — awaiting PO direction at 0.0):**
1. Verify shipped `rekeyUser` wiring satisfies the "decrypt-exception never overwrites" rule end-to-end (review).
2. S15 T104 — Object.verb use-case diagrams.

**Handoff:** standing by for robbin-po to pick (1) or (2). No open architect action until directed.

## S15 DESIGN COMPLETE (robbin-architect, 2026-05-26) — PO directed (skip avatar re-verify; live=v0.5.11)
- **T103 Object.verb routing** — design written INTO task-103 (refinement checked). Object.verb = OOSH-CLI cmd = `#<type>.<verb>?<params>` route. 3 new client modules in `src/public/ts/trace/`: TraceRouter (Controller), VerbRegistry, ViewBus (MVC observer — client-side to keep shared TraceModel DOM-free). Attributes=web-component attrs. Serialize/deserialize REUSE T101 `graph.toJSON`/`fromJSON`. Enables T105-T108.
- **T104 diagrams** — authored `sprint-15.../diagrams/object-verb-usecases.puml` + `.svg` (31KB, clean). 7 objects(noun) × verbs(method), 16 uc:uuid anchors for T101-T108. task-104 marked delivered.
- Reported design-ready to robbin-po @ 0.0. Awaiting review before expert builds views.

## S15 VIEW SPECS T105-T108 DESIGN-READY (robbin-architect, 2026-05-26) — all on the T103 seam
Each has Design + sharpened AC + a concrete test scenario written INTO its task file; refinement checked.
- **T105 `rb-object-item`** — defaultItemView, lobby `.room-card` parity, draggable native-OS (text/plain `#type.verb?uuid`, text/uri-list absolute, application/rb-object-ref), ViewBus live-update, click→TraceRouter.navigate.
- **T106 `rb-list-overview`** — list of T105 items + `SearchProvider` interface (LocalSearch default, RemoteSearch swap WITHOUT API change), debounced, empty state, graph-topic ViewBus, no artificial limits (Tron rule).
- **T107 `rb-detail-view` + `rb-overview`** — detail = chain-navigable link rows; overview = COMPUTED-from-graph rollup (drift structurally impossible), both ViewBus-live; registered as show/overview verbs.
- **T108 `rb-trace-tree` capstone** — tree sibling to `rb-file-tree` in /edit Documentation; integrates T105/106/107; node-select→DetailView; built from T102-validated graph via `GET /api/trace`=graph.toJSON(); broken nodes flagged not hidden.
- Reported design-ready to robbin-po @ 0.0. Awaiting review before expert builds (expert frees from S14).

## Cross-refs
- T82 (vCard visibility + avatar DRY) + T83 (self-click sheet) — DESIGN DONE, in PO review. Separate from this diagnosis.
- Relates to: Sprint 7 (encrypted avatar storage), Sprint 9 T75/T77 (room persistence + lobby sync).

---

## (C) PWA version-update bar missing — ROOT CAUSE CONFIRMED

**Mechanism (two independent update paths in `rb-update-banner.ts`):**
1. version-check (`checkForUpdate`, line 29): `fetch('/api/config')` → compare `localStorage['rawbin-version']` vs `config.version` → mismatch shows "v… available" bar.
2. SW update (`registerServiceWorker`, line 12): register `/sw.js`; `updatefound`→installed→banner (no version label).

**Root cause — stale server PROCESS:**
- `server.ts:25` — `const PKG_VERSION = JSON.parse(readFileSync(package.json)).version` is read ONCE at module load (frozen at process start).
- `/api/config` (line 357) and `/api/health` (line 364) return this frozen value forever.
- Restarts deferred through v0.4.8/9/10 → live process froze at ~v0.4.7. Disk serves v0.4.10 bundles + `sw.js` CACHE_NAME `rawbin-v0.4.10`, but `/api/config` still says 0.4.7.
- Device stored `rawbin-version=0.4.7`; check compares 0.4.7 vs 0.4.7 → equal → **banner never fires** despite newer disk code.

**Fix (two parts):**
1. OPERATIONAL (immediate): clean server restart → `PKG_VERSION` re-reads 0.4.10 → device mismatch → bar fires → Update Now → new code. Unblocks Tron's device now.
2. DESIGN HARDENING (removes recurrence): stop freezing version. In `/api/config` + `/api/health`, read version per-request (inline `readFileSync(package.json)` — tiny file) OR derive from `build-manifest.json` (rewritten every build). Reported version then always matches served bundle without restart.

**Verification:** after restart, `curl -k https://localhost:4444/api/config` must report `version: 0.4.10` (currently 0.4.7).

---

## (A) Avatar revert + key-error leak — HYPOTHESES (confirm during diagram trace)

- **Revert to default:** avatar encrypted at `data/users/<token>/files/avatar.enc`, served `/api/avatar/<token>`. Reverting to `/icon-192.png` ⇒ either `profile.avatar` URL not restored on reconnect, or decrypt fails and serve-handler falls back (`catch { 500; 'Decrypt error' }` → `<img>` onerror → default).
- **"key not found" leaking (bug + UX violation):** `UserCrypto.decryptFile` throws `'User private key not found'`; raw error string surfaces to user. Likely key mismatch (Sprint 9 room keys vs Sprint 7 user keys) or keys regenerated after avatar was encrypted (old AES envelope undecryptable).
- **Confirm by:** reproduce decrypt failure; trace which key path the avatar serve uses; check whether reconnect restores `profile.avatar`.

## (B) Rooms — only 1 shows on connect — HYPOTHESIS

- Sprint 9 T75/T77 persist rooms under `data/users/<token>/rooms/`, load + advertise on connect.
- "Only 1 shows" ⇒ either IDENTIFY load loop registers a single room, OR `listRooms(connectedOwners)` filter (`!isPrivate && (members>0 || connectedOwners.has(creatorToken))`) hides the rest.
- **Confirm by:** trace connect → IDENTIFY → enumerate rooms dir → register → advertise → listRooms.

---

## Diagram plan — 3 use-case PUMLs (uc:uuid standard, complete, no gaps, no key-leakage)

Land in `workspaces/Web4RawBin/scrum.pmo/sprints/sprint-10-contacts-ui/diagrams/`. Each node tagged `uc:uuid:<uuidv4>`, color-coded done/new/bugfix.

1. **`avatar-workflow.puml`** — User/Server/Disk. upload→encrypt(user key)→store→set profile.avatar→[reconnect→load→serve→decrypt]→display. Error lane: decrypt-fail → SILENT fallback to default, NEVER surface "key not found" (UX-violation guard as constraint node). Drives A fix tasks.
2. **`rooms-load-workflow.puml`** — User/Server/Disk. connect→IDENTIFY→enumerate ALL `rooms/*`→register each→advertise→listRooms(no over-filter)→ALL rooms in lobby. Models "load ALL not 1" completeness. Drives B fix tasks.
3. **`version-update-workflow.puml`** — Device/Server/SW. build(bump+stamp sw.js)→server reports LIVE version (per-request, not frozen)→device check→mismatch→banner→Update Now→skipWaiting→reload→new bundle. Models the hardening (no stale-process gap). Drives C fix task.

## Recommended sequence
1. **C first** — operational restart unblocks device immediately; then C hardening task.
2. A and B — build their diagrams, confirm root causes, then fix tasks.

## Handoff / next action
- Awaiting PO/SM go: build the 3 `.puml` files + render SVGs, then write fix task files per diagram.
- C operational restart is an OPS action (PO/Tron owns the server process) — flagged, not architect-executable.

---

## ADDENDUM 2026-05-26 — Avatar-fallback RECURRENCE diagnosis (post-T91)

**Tron:** "app keeps breaking the profile picture to the shitty fallback" — still happening despite T91. PO KEY question: disk OVERWRITE (storage) vs FAIL-TO-LOAD (display)?

**Answer: BOTH symptoms, ONE root — a decrypt FAILURE on an avatar.enc that EXISTS. The dominant damage is a STORAGE OVERWRITE that T91 did NOT close.**

### T91 status: implemented but incomplete
`ensureAvatar()` (server.ts:808-849) now has the `fileExists` guard (line 815) — it correctly stops the STRING-desync overwrite (real JPEG on disk + decrypts → line 818 returns, restores URL). That path is fixed.

### The two surviving overwrite/fail paths

**PATH 1 — decrypt-exception → destructive overwrite (THE recurrence, storage bug).**
`ensureAvatar` line 815 `fileExists` = true, but line 817 `decryptFile(token,'avatar')` THROWS → line 828 `catch { /* fall through to fetch a fresh default */ }` → falls to line 831+ → line 845 `encryptFile(...,'avatar')` **OVERWRITES the real avatar.enc with a default.** The fileExists guard does NOT protect because the file exists — it's a decrypt EXCEPTION, and the catch treats "present-but-undecryptable" as "no avatar, make a default." The real photo is destroyed on disk (permanent; re-upload then breaks again if the key mismatch persists).

**Why decryptFile throws on an existing file:** avatar.enc's RSA-wrapped AES key was encrypted with the user's PRIOR public key; `decryptFile` uses the CURRENT private key. If the user's keypair was regenerated (any path that rewrites keys; or T92's self-heal if it ever runs when keys are only partially present) OR a token redirect/consolidation changed which key context applies, the current private key ≠ the key the envelope was sealed with → `crypto.privateDecrypt` throws → catch → overwrite.

**PATH 2 — SVG-fallback re-fetch (secondary, storage).** If the on-disk avatar is an initials-SVG (`image/svg+xml`, from a prior failed photo fetch), line 818 is false → no return → line 827 logs "retrying" → line 831 `fetchAvatarWithRetry(3)`; if that fails again, line 839 writes a NEW initials SVG over avatar.enc. Not destructive of a real upload (only replaces one fallback with another), but keeps the user on a fallback whenever thispersondoesnotexist is unreachable.

**PATH 3 — display fallback (the visible symptom).** The SAME decrypt failure hits the serve endpoint: `/api/avatar/<token>` line 471 `decryptFile(...)` throws → 500 → client `<img>` onerror → rb-avatar renders the initials-SVG fallback. So even before/without the overwrite, a key-mismatched avatar shows the fallback at display time.

### Root cause (one sentence)
A real, present `avatar.enc` becomes undecryptable (key mismatch after key regeneration / token desync); `ensureAvatar`'s `catch` then OVERWRITES it with a default (storage) and the serve path 500s to the client fallback (display) — T91 closed the string-desync overwrite but not the decrypt-exception overwrite.

### Fix direction (owner: EXPERT)
1. **ensureAvatar must NEVER overwrite on a decrypt EXCEPTION.** Distinguish "no avatar file" (fileExists false → fetch default OK) from "file exists but won't decrypt" (→ do NOT write; log; leave the file intact for possible recovery; optionally flag the profile for a re-upload prompt). A decrypt throw must be non-destructive.
2. **Address the key mismatch root:** ensure avatar.enc is always sealed with the key that will open it — do NOT regenerate user keys out from under existing encrypted files; on any key rotation/consolidation, re-encrypt (or migrate) existing files, or treat old files as orphaned WITHOUT deleting. (Ties to T92 key self-heal — the self-heal must not orphan existing avatars.)
3. Display: serve endpoint should fall back to icon-192 on decrypt failure (it does) — acceptable as a transient display fallback ONCE the overwrite bug is fixed, since the real file survives and can be re-served after key reconciliation.

**Disposition:** S13 recurrence task not yet created by req at diagnosis time. This addendum is the durable record; will copy the root-cause section into that task file the moment it exists (or on PO confirming the number, e.g. T101). Diagnosis-only — no code changed.

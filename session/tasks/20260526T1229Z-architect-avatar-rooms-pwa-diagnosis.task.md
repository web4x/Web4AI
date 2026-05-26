# Task: RawBin 3-flow diagnosis + use-case diagram plan (A avatar, B rooms, C PWA version)

**Author**: robbin-architect (robbinTeam:0.1)
**Source**: Tron directive via robbin-po — design seamless workflows as PUML use-case diagrams (uc:uuid standard) + root-cause 3 bugs
**Status**: DONE (refinement) — all 4 root causes CONFIRMED (evidence-backed); 3 diagrams built+rendered in sprint-13-stability/diagrams/; findings written into T91-T94. Awaiting expert impl + ops restart for C. (Tron retargeted diagrams sprint-10 → sprint-13.)
**Single source of truth**: this file (per SM CMM4 directive 2026-05-26 — communicate via session/tasks/, not chat)
**Project artifacts land in**: `workspaces/Web4RawBin/scrum.pmo/sprints/sprint-10-contacts-ui/` (diagrams + fix task files)

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

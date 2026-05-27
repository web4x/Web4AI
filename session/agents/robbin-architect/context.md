# robbin-architect — Context

## ACTIVE (2026-05-26, pre-rewind save): Sprints 13 + 14
- **Avatar-fallback recurrence (S13 T91):** ROOT CAUSE done + saved into task-91 + session/tasks diagnosis addendum. Decrypt-exception in ensureAvatar (server.ts:828 catch) OVERWRITES real avatar with default; serve 500→client fallback. T91 fileExists guard didn't cover decrypt-throw. Fix = never overwrite on decrypt exception. Owner: expert. AVATAR FIX FIRST, then S14 (disjoint data).
- **S14 legacy→UUID migration:** T96-T99 designs + migration-workflow.puml committed (d953d5a, 4501e05). Flat data/rooms = stale dup (all per-user); token-* dirs = room-only orphans (0 profiles/keys). T98 baseline run-time not hardcoded. T99 Tron-gated. PENDING: add T97 invariant "re-encrypt files/* on identity rekey".
- **S13 T95** newest-rooms-first committed faa7d89. **S13 T91-T94** root causes committed 1042a4a.
- **NEXT after rewind:** (2) T97 re-encrypt-on-rekey invariant, (3) S15 T104 Object.verb use-case diagrams.

## Identity
- **Role:** robbin-architect
- **Pane:** robbinTeam:0.1
- **Team:** robbinTeam
- **Project:** RawBin (Web4RawBin) — AI Server Management Interface
- **Working dirs:**
  - Planning: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
  - Implementation: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin/`

## Sprint History

### Sprints 1-6 (summarized)
S1: Foundation (QnD fork, rebrand). S2: Identity/SSH (diagrams, ProfileSheet). S3: E2E (member badges). S4: Traceability (templates, PO process). S5: PWA/Offline (reconnect, iOS). S6: Web Components (rb-header, rb-member-badge/list, rb-qr-popup).

### Sprint 7 — Encrypted Storage + Avatar (DONE)
- **Planning:** Designed hybrid RSA+AES crypto, avatar pipeline, 8 tasks.
- **T48:** Default avatar assignment (encryptFile with storedName param).
- **T52:** Avatar visible everywhere (lobby, profile page, vCard fetch).
- **Avatar lifecycle diagram:** Identified root cause bug (refreshAll missing) + race condition + crop propagation gap.
- **Bug repro (Playwright):** Reproduced on 375x812 — avatar src DOES update via rb-avatar-updated event, but image load fails showing initial fallback. Root cause: served image issue, not refresh mechanism.
- **PDCA reviews:** v0.2.6 cache fixes PASS. v0.2.7 safe-area PASS. Crop normalization (percentages 0-1) PASS. Crop attribute pass-through (all creators) PASS.

### Sprint 8 — Monaco Editor (DONE)
- **Architecture:** Full design at architecture.md — FileApi.ts module, 5 Web Components (rb-editor-layout, rb-file-tree, rb-code-editor, rb-preview, rb-editor-toolbar), CDN Monaco loading, /edit route, 4-phase plan, 6 design decisions documented.
- **Diagrams:** class-diagram.puml + sequence-edit.puml (open→edit→save→conflict flow).
- **T72:** Cross-links /md/ ↔ /edit/ — pageNav() gets editPath param, /md/ dir listing gets edit icons per file (editable extensions only), /md/*.md and /docs/*.md pages get "✏️ Edit" nav link, rb-editor-toolbar gets "👁 View" link for .md/.puml files.

## Key Components Created (cumulative)
- `rb-header.ts`, `rb-member-badge.ts`, `rb-member-list.ts`, `rb-qr-popup.ts` (Sprint 6)
- `rb-avatar.ts` created by expert, reviewed by me (Sprint 7)
- `rb-editor-layout.ts`, `rb-file-tree.ts`, `rb-code-editor.ts`, `rb-preview.ts`, `rb-editor-toolbar.ts` (Sprint 8, created by expert, toolbar modified by me for T72)

## Architecture Docs Written
- S1: task-2-rawbin-architecture-definition.md (QnD audit, keep/remove/rename)
- S2: diagrams/ (use-case, class, enrollment, auth sequences)
- S4: templates/ (task + planning), roles/PO/process.md
- S6: sprint-6 planning.md (full UI audit, 7 components, 4-phase migration)
- S7: sprint-7 planning.md (hybrid crypto design), diagrams/avatar-lifecycle.puml
- S8: architecture.md (Monaco design, FileApi, CDN strategy, routes), diagrams/ (class + sequence)

## Build State
- App bundle: 70.9KB (v0.3.11)
- Editor bundle: separate entry (edit.js), Monaco from CDN
- Server: 1,249+ lines

### Sprint 9 — Room as SSH Identity (IN PROGRESS)
- **Architecture:** Designed rooms as persistent SSH identities. Each room gets UUID folder under data/users/<token>/rooms/<room-uuid>/ with room.json + full .ssh/ structure. RoomKeys.ts module (mirrors UserKeys.ts). No auto-cleanup, manual delete only. Room name defaults to "<Name>'s Room". WS sync on lobby entry. class-diagram.puml. 10 tasks / 4 phases.
- **T78:** Client room updates — RoomInfo gets ownerToken/ownerName, create form default name from profile, room cards show owner name + full UUID, removed hardcoded "My Room".
- **T80 (diagnosis + task file):** Diagnosed E2E 19/21 failure. Root cause: second (avatar backfill) PROFILE_UPDATED re-fires ProfileEditor.onSave → re-renders DeviceEnrollDialog → resets #de-submit to disabled. APP BUG not test bug. Wrote fix task (one-shot onSave clear) assigned to expert. Future fix: AVATAR_UPDATED message split.

## Status
Sprint 9 in progress. T80 task file written, routed to expert. Standing by for Sprint 10.

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

### Sprint 16 — Traceability UX & DetailViews (IN PROGRESS)
- T110-T115: Architect designs written into all task files (PO APPROVED)
- T111: Refined per PO — separate Web Components per type, VerbRegistry dispatch
- T113: Icon lib: Lucide (ISC), vendored inline SVGs, 7 type-specific icons
- T117: s16-usecases.puml AUTHORED — 15 <<UseCase>> instances, rendered 95KB SVG
- T116: Chain audit COMPLETE — 18 methods → 15 UCs → 8 tasks → 10 reqs, zero orphans
- Scanner extension spec written (Pass 4 PUML, Pass 5 impl:uuid) for expert

### Sprint 17 — Scenario Units / IOR Data Model (IN PROGRESS)
- T124.1: Data model — ior=class loader, model.uuid=instance, ownerIor=parent (Tron-refined, fda5970)
- T124.2: View template architecture — 7 class templates, ViewTemplateRegistry, live-update (14b2821)
  - Tron refinements: subtask indentation, speaking-name filenames (not uuid.md), speaking-name hrefs, 404 page (44f9dce)
- T124.3: Storage layout — 3-layer (index/json-tree/md-tree), 5-level deep UUID dirs matching UpDown convention (1d80907)
- T124.6: s17-usecases.puml — 13 UCs across 4 phases, 6 implementing classes (1316b7e)
- T121: Chain data quality — Phase 1 defect catalog DONE (7777ad6): 34 invalid v4 UUIDs (BLOCKER), 8 defect classes
- S16 T116 chain gaps fixed — all TBD→real uc:uuid (d87e826)
- S16 SVG filename fixed — unicode→path-safe s16-usecases.svg (d87e826)
- Symlink diagnosis: FileApi.readDir() drops symlinks (BUG), /md/ handler correct. Expert fixed (DirEntry.symlink field)
- T128.3: S17 migration structure verified — parent-child X.Y inference works for task-124/task-124.1
- T132: HTML status template — root cause <pre> dump, fix: shared renderStatusHtml() (497cee2)
- T133: Task FSM — 7 states, 8 transitions, guardTransition(), tronApprove() gate (497cee2)
- T134: TraceLink — 8 typed relations + inverses, bidirectional ln emission, 8th template (497cee2)
- T136: Req+UC migration — two parsers (requirements.md split + PUML <<UseCase>>), deterministic link UUIDs (5073c3b)
- T138: 4 skills — captureQuote/proposeTask/walkChain/statusTransition, SkillResult<T> (5073c3b)
- T139: Skill catalog — 16 skills across 6 domains, SKILL.md structure for skill-expert (47bec60)
- T140: Source-location IOR — ior:file:<path>?commit=<sha>&lines=<a>-<b>, 3 regex extractors (7aea2df)
- T141: Chain-link 🔗 icon — shared renderChainSection(), all 7 templates, speaking-name hrefs (d978db8)
- T142: vCard import pipeline designed (pre-task-file) — parseVCard, 3 input methods, rb-avatar.uploadBlob()

- T121: Close-out audit — C5 deferred to S11 T87-T89, 6/8 fixed, boundary documented (b2e0c72)
- T142: vCard import pipeline written into task file (d87fd5f) — parseVCard, 3 inputs, rb-avatar.uploadBlob
- PENDING: T143 (reload button on connection-failed page — waiting for planner file)

## Status
S17 design phase mostly complete. T124.1-.3, T132-T134, T136, T138-T142 all designed + committed. T121 close-out done. Waiting for planner T143 + any new PO assignments.

## CMM4 Standing Rules
- #18: req captures → planner stands up task file with T-number → architect refines → expert impl → tester verify. Never design from harness numbers.
- #46: sub-task files MUST follow Web4Articles standard template (Status, Traceability, AC, etc.)

## Status
S17 design phase mostly complete (T124.1-.3 + T124.6 done, T121 Phase 1 done). Waiting for planner T132/T133/T134 task files, then refine. Context at ~28% — healthy.

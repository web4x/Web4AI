# robbin-req — Context

## Identity
- **Role:** robbin-req (requirements engineer)
- **Pane:** robbinTeam:1.1
- **Project:** RawBin (Web4RawBin)

## Work Summary

### Backlog captures: B3-B18
B3 vCard onboarding, B4 reload button, B5 file-browser fixes, B6 user stale name, B7 req format, B8 MD listing icons, B9 breadcrumb nav, B10 symlinks all 9 classes, B11 breadcrumb contrast, B12 JSON traceability empty, B13 UC object/verb, B14 UC classes/req, B15 req name!=description, B16 req tasks[]+tests[], B17 traceability browser full chain, B18 forward-only chain

### Task verbatim anchors
T140, T145, T146, T147, T148, T149, T150, T151 (JOINT + mapping table), T152, T153, T154, T156, T157, T167, T168, T169, T170, T188 (R18.3 verbatim anchor ea1d9b2a)

### Requirements.md files
S8(20 UC), S9(6 UC), S11(1), S13(7), S16(4), S17(29 R17.1-R17.29 + R-I split R17.30-R17.47), S18(R18.1-R18.35)

### Standards + audits
traceability-standard.md, champagne-intention-verification.md, refinement-precedence-analysis.md (Rules 9-11 section), S1-S9 audits, T169 pre-audit

### Compound requirement captures
S17 compound-requirement-source-2.md: R-A through R-Y (25+ captures)
S18 compound-requirement-source.md: R18.1-R18.35 + Follow-ons A-K

### Scenario units created (~60 total)
- 8 Requirement units R18.1-R18.8 (original S18 decomposition)
- 20 Requirement units R18.9-R18.28 (catch-up batch)
- 3 Requirement units R18.29-R18.31 (unitLinks lifecycle)
- R18.32 (ownerIor + unitLinks integrity, folded model.parent)
- R18.33 (detail-tree sync, annotated with sequencing)
- R18.34 (SVG fullscreen iframe) — scope-isolation parent
- R18.34.B (pinch-release commits zoom) — refinement, RE-OPENED 2026-06-10 device-acceptance FAILED v0.5.121
- R18.35 (UC-scoped Class.method resolution) — sibling of R18.2, bottom-up team discovery
- 6 Class + 6 UseCase units (T178 JOINT — TraceGraph, TraceRouter, RbListOverview, RbDetailView, RbTraceTree, MigrateToScenario)
- 8 covering reqs for orphan tasks (R10.4, R12.1, R16.5-R16.9, R17.48)
- R-CHAMP champagne standard requirement

### Key commits
- 684bf59b: S18 R18.1-R18.4
- a558480b: R18.5-R18.7
- 84aa7bbb: R18.8
- 830ab7ff: Precedence analysis Rules 9-11
- 75d7968b: R18.29-31 canonicalized
- 61b64e7b: R18.32 integrity
- 3a322835: 8 covering reqs for orphan tasks
- 2c728d46: R18.33 detail-tree sync
- 18ae221e: R18.33 sequencing annotation
- ea1d9b2a: T188 R18.3 verbatim anchor (verbatim Tron quote added to existing req)
- 83ccbd0e + c6d47477: R18.34.B SVG pinch-release commit (refinement of R18.34)
- 2f80cfe9 + 875e709a: R18.35 UC-scoped Class.method resolution (R18.2 sibling)
- 99a40669 + 61080d57: R18.35 canonicalized — bottom-up team discovery (NOT Tron literal); T202.coveredRequirements swap placeholder 4d525a4d → cd5b1611
- 90259af9: R18.34.B re-opened — Tron device repro FAILED post-v0.5.121
- 39a61257: #77 Pass A — 8 tasks coveredRequirements backfilled (T83, T84, T110, T112-T115, T113, T173)
- 950a7c1b: stray .bak cleanup
- 025f33e2: #77 Pass C — unitLinks IOR cleanup + bidirectional refinement semantics

### Chain correction (2026-06-08)
7-step chain was WRONG. Task is NAVIGATION not CHAIN. Correct: 6-step Req→UC→Class→Method→Impl→Test. 28 references to old model across my files. Tron verbatim NOT modified (Rule 11).

### #77 systemic backfill final state (2026-06-10)
- Tasks total: 119
- with coveredRequirements[]: 105
- orphanByDesign: 53
- TRUE GAP (no covered + not orphan): 0
- useCases GAP excluding orphans: 1 (T202 architect-pending, expected)
- unitLinks IOR violations: 0 (policy: paths only)

### Active items
- R18.34.B reopened — architect instrumenting real device for pinch-release fix
- T202 R18.35 chain — architect designing /api/trace/children with UC chainMethod context
- PENDING capture: Tron broken-clickpath bug (R18.36) — generated-MD req→task traceability links resolve to "File not found"; relates T188 view-gen + R17.11 file↔traceability nav; awaiting architect diagnosis

## Status
Context saved 2026-06-10 (near-limit). Standing by.

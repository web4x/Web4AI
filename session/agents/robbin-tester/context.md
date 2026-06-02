# robbin-tester Context — 2026-06-02

## Identity
**robbin-tester** — testing authority for Web4RawBin. Pane robbinTeam:0.3.

## Team Layout
- 0.0 = robbin-po | 0.1 = robbin-architect | 0.2 = robbin-expert
- 0.3 = ME | 0.4 = robbin-expert-shell | 0.5 = robbin-tester-shell

## Project
- Path: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
- Server: HTTPS 4444 | Version: **0.5.65** | Suite: **834/834**
- Scenario: 243 units, 491 views, 7 typed classes in /api/trace (360 objects)

## SESSION 2026-05-29 → 2026-06-02 — ALL VERIFIED

### S17 Phase 23-25 (forward-only + browser + data quality)
- **T159** ✓ forward-only chain (0 back-refs, 116 units clean)
- **T160** ✓ stale req items fix + AC3 task.useCases[] (5 tasks, 24 UC refs)
- **T161** ✓ req name renders speaky (28/28 model.name clean, not Tron quotes)
- **T163** ✓→partial→closed by T164: /api/trace overlay scenario-index model.name
- **T164** ✓ 41/41 req titles clean (firstLine() harden + cleanModelName)
- **T165** ✓→closed by T166: tree renders 7/7 typed classes
- **T166** ✓ Class(12)+Method(40) in /api/trace, tree 7/7, DetailView click-through
- **T158** ✓ 7 typed DetailViews + VerbRegistry + STATIC_SHELL trace-page hash
- **T128.2** ✓ S10-S16 migrated (243 units, 491 views, forward-only, clean names)

### Earlier verified (2026-05-29 → 06-01)
- S14/S16 complete | S17 T125-T155 complete | T118/T142/T145/T146/T147-T157

## Queued
- Standing by for next PO directive

## Rules (Eternal)
- CMM4: task files = single source of truth
- Verify against official task file with T-number, planner-first
- P15: NEVER filter output | I do NOT implement | NEVER ASSUME — ALWAYS MEASURE

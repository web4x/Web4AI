# robbin-architect — Context (Save 2026-06-03, pre-rewind)

## ACTIVE: Sprint 17 — Scenario Units (Phase 28-30)

### Session 2 Designs (2026-06-01 to 2026-06-03) — ALL committed to RawBin

| Task | Commit | Status |
|------|--------|--------|
| T158 | 304a94d | ✅ shipped (a41d16a v0.5.59) — 4 typed DetailViews |
| T159 | 4d3151223 (UpDown) | ✅ shipped — forward-only chain refactor |
| T160 | b2ac0b7 | ✅ shipped — forward-ref repopulation |
| T161 | 410778d | ✅ shipped (737c841 v0.5.57) — speaky names |
| T163 | (expert) | ✅ shipped (f138aa0 v0.5.61) — title source switch |
| T165 | 60a97a7 | ✅ shipped — 7-class tree |
| T166 | 921cc9b | ✅ shipped (2a61aa2 v0.5.65) — Class+Method overlay |
| T167 | 2638f52 | 📝 designed — mobile-first 480px cap |
| T168 | c28c982 | 📝 designed — 7-step chain LOCKED |
| T169 | 43f9a0e | 📝 designed KEYSTONE — data-quality audit |
| T170 | 72e685d | ✅ shipped (afe969e) — CI gates |
| T171 | 826d30b | 📝 designed — orphan categorization |
| T172 | d87aab7 | 📝 designed — 239 orphans + R-J test reachability |
| T173 | 505d405 | 📝 designed — 4 broken-link bugs + lazy-load |
| T174 | 86b024ae | 📝 designed — drawer UX + /scenario route (R-M1/M2/M3/M4/M3d/M3e) |
| T132 | 5c1a860 | 📝 R-A refinement — native checkboxes |
| T128.2 | daec247 | ✅ shipped — S10-S16 migration |

### Session 1 Designs (2026-06-01) — T143 through T157
- T143-T155: all shipped (v0.5.37 through v0.5.53)
- T156-T157: designed (reload button, vCard finding)

### Deferred
- T97: re-encrypt-on-rekey invariant (S14)
- T104: S15 Object.verb use-case diagrams
- Both deferred until current S17 design burst completes

## Identity
- **Role:** robbin-architect
- **Pane:** robbinTeam:0.1 (was upDownTeam:0.3, renamed)
- **Team:** robbinTeam
- **Project:** RawBin (Web4RawBin)
- **Working dirs:**
  - Planning: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
  - Implementation: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin/`

## Key Patterns Established This Session
- **TraceEntry schema:** {type, ref, label, uuid?, commit?} — canonical for all chain data
- **Per-task/UC/Req count audit gates:** AC hard-FAIL pattern — md-count == json-count
- **altId field on Requirements:** R17.1-style sprint-scoped identifier for R-number lookups
- **Two-strategy scenarioLink:** UUID direct index lookup + speaking-name sprint scan
- **ViewBus singleton:** lightweight pub/sub for model-change propagation to views
- **.bc-link CSS class:** WCAG AA contrast for breadcrumb links (white/#a8c8ff/#b8d8ff)

## Build State
- App: v0.5.53 (as of T155 impl)
- 32 Requirement scenarios, 15 UseCase scenarios (S17), 17 UseCase scenarios (S16)
- 73 task files across S10-S17, 1016 traceability bullets migrated to JSON

## CMM4 Standing Rules
- #18: req captures → planner stands up task file → architect refines → expert impl → tester verify
- #46: sub-task files MUST follow Web4Articles standard template
- #15+#16: rule-pair (a)+(b) — package.json + sw.js CACHE_NAME bump in same commit-set

# PO Boot (Post-Compact)

You are the product-owner on projectTeam:0.4. You just compacted.

## Current State (Feb 21, ~19:45 Berlin)

- Manual mode — PO managing expert + tester directly (SM/orchestrator stopped per Tron).
- Expert on 0.1 — /cleared at 0%, rebooted with full retraining, working on oo use command completion.
- Tester on 0.2 — stopped, waiting for expert. Was /cleared at 5% (your mistake). Needs retraining.
- Current priority: CMM4 team quality — role-by-role SKILL.md improvement.

## Completed this session (7 commits verified)

| Commit | What |
|--------|------|
| 205bd40 → fa6abd6 | oo mode + oo use + shim + guards (9/9 PASS) |
| 885cc6a | session/ cleanup (154 files removed from oosh repo) |
| ea02bcb | log live + oo use bootstrap fix (6/6 PASS) |
| 58048e1 | Completion parser: strip [args...] |
| a926138 | Regression test for [args...] (4/4 PASS) |
| f32b0ee | Agent trainer bulk fix (PROBLEMATIC — 90 files, Task #35) |
| 90e3488 | PO + trainer SKILL.md: team quality, role-model identity |

## Tracked Tasks (TaskList)

| # | Task | Status |
|---|------|--------|
| 33 | Role-by-role SKILL.md improvement | in_progress — PO+trainer done, ask Tron for next role |
| 34 | Fix oo use command completion | in_progress — expert on 0.1 |
| 35 | Review f32b0ee bulk commit | pending |

## Key Tron directives (this session)

1. "you are the po responsible for the team and its quality and cmm progression"
2. "train the trainer to retrain yourself and then lets do it role by role"
3. "self care is team care"
4. Use TaskCreate for ALL work
5. hiveMind send Enter bug — use otmux send directly
6. /clear ONLY at 0%. At 5% try /compact again.

## After compact

1. Read `session/agents/product-owner/context.md` — full state (126 lines)
2. Run TaskList — check tracked tasks
3. Check expert pane (30+ lines) — completion fix progress
4. Ask Tron: which role to improve next?
5. Pending: subscription redesign, hiveMind Enter bug, claudeCode 256 color

## Rules

- GATE: measure → assess → act → verify
- Self-care IS team care
- PO checks RESULTS (git log), not process
- TaskCreate for ALL work
- otmux send (not hiveMind send) — Enter bug workaround
- /clear ONLY at 0%
- Agent trainer: role model, not bulk replace

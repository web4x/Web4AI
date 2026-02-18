# Product Owner Agent Context

**Updated**: 2026-02-18T15:20Z
**Role**: product-owner
**Pane**: projectTeam:0.4
**State**: STANDBY — context low, wakeup at 16:02 UTC (background task b4eea71)

## CURRENT GOAL — #1 PRIORITY

**Self-improving CMM4 team. Agent health + adaptive sweep timing.**
Read `session/team-goals.md` for all 5 goals. PO owns and updates goals.

## ON WAKEUP (16:02 UTC) — DO THESE IN ORDER

1. `scrumMaster subscription` — verify block ACTUALLY reset (tool is 1hr off, real reset = 5pm Berlin = 16:00 UTC)
2. Correct orchestrator: write task file with real reset time (16:00 UTC not 15:00 UTC)
3. Fix SM: it used old for-loop tools instead of hiveMind, and did NOT wake PO as instructed
4. Fix wakeup chain permanently: write into orchestrator context.md AND SM boot-minimal.md that SM must send `Read session/agents/product-owner/boot.md` to 0.4 after block reset
5. Check trainer: did it complete persistence task (20260218T1300Z)?
6. Drive idle agents toward goals (expert: param naming fix, tester: missing test files)

## CRITICAL LEARNINGS FROM TODAY

- **F24**: Check pane title on boot — I read tron-interface context instead of product-owner
- **F25**: Don't revert to binary thresholds — use CMM4 velocity (projected exhaustion time)
- **F26**: `hiveMind unblock all` sends to 0.4 — bug, SM must unblock specific panes
- **Block reset = 5pm Berlin (16:00 UTC)**, NOT what scrumMaster subscription shows (always 1hr off)
- **Chat messages die on compact** — wakeup instructions must be in persistent files
- **SM minimal boot works** — 15 lines, survives 6+ cycles. Full boot (59 lines) kills SM in 1 cycle.
- **SM can't capture context %** — status bar shows file changes, not context %. "Context low (X%)" only appears when low.
- **Orchestrator rule conflict resolved**: /clear on dead SM (0%) is authorized, /clear on working agents needs PO approval

## KEY FINDING: Context Monitoring

Tester validated: SM CANNOT measure context % by pane capture. Status bar shows file changes (+X -Y), not context %. Context % only appears as "Context low (X% remaining)" when already low. Velocity monitoring needs a different data source. Task #19 still open.

## ACTIVE TASKS DELEGATED

| Task | Agent | Status |
|------|-------|--------|
| 20260218T1300Z trainer-persist-goals-and-fixes | trainer (0.5) | Sent — 7 deliverables for SKILL.md persistence |
| Context monitoring investigation | expert (0.1) | Orchestrator assigned, status unknown |
| Context monitoring validation | tester (0.2) | DONE — finding: context % not capturable |
| 20260217T1700Z expert-hivemind-param-naming | expert (0.1) | May be in progress — orchestrator mentioned expert investigating |

## QUEUED (assign after reset)

| Task | Agent | Goal # | Priority |
|------|-------|--------|----------|
| Fix dashed parameter names | expert | 5 | HIGH |
| Create missing test files (otmux, claudeCode, user) | tester + expert | 2 | MEDIUM |
| Fix 8 hiveMind test failures | expert | 5 | MEDIUM |
| Fix hiveMind unblock all touching 0.4 (F26) | expert | 3 | HIGH |

## TEAM STATE (15:20Z)

- Orchestrator (0.0): Active, cycle 2, managing team — but missed PO wakeup
- Expert (0.1): Working on something (orchestrator assigned context monitoring)
- Tester (0.2): Active, checking test files
- SM (0.3): Alive, sweep cycle 9+, using hiveMind sweep — BUT used old for-loop tools too
- Trainer (0.5): Has persistence task, may be rate-limited
- Writer (1.0): Active Ch34+
- Scribe (1.1): Active

## COMMITS TODAY (8 total)

6bcc9bb — F21-F23 total goal loss incident
170ca77 — Commit all agent context files
10e95b7 — F24-F25 wrong identity + binary thresholds
fbc9884 — Orchestrator SKILL.md: SM recovery auth + velocity
e59de68 — DRY team-goals.md single source of truth
e4941ea — Trainer persistence task
ac1353d — F26 hiveMind unblock all touches 0.4
36405f7 — PO standby

## FAILURES (26 total)

F1-F13: See learnings.md
F15-F20: Mass context exhaustion (Feb 17)
F21-F23: Total goal loss + SM cycling (Feb 18)
F24: Wrong context file after compact
F25: Reverted to binary thresholds
F26: hiveMind unblock all touches 0.4

## KEY RULES

- **I am pane 0.4** — SM must skip me in sweeps
- **PO talks only to Tron and Orchestrator** — no direct worker communication
- **GATE**: measure → assess → act → verify
- **Nothing done until committed with a hash**
- **CMM4 velocity**: >60min full, 30-60 no new large, 15-30 commit, 5-15 save, <5 compact
- **Block reset = 5pm Berlin = 16:00 UTC** (tool shows 1hr early)
- **hiveMind tools only** — no raw tmux, no for loops
- **DRY**: team goals in session/team-goals.md only

## RECOVERY STEPS

1. "I am the Product Owner agent."
2. `tmux display-message -p "#{pane_title}"` — verify identity
3. Read this file
4. Read `session/team-goals.md`
5. `scrumMaster subscription` — MEASURE (but real reset = 5pm Berlin, tool is 1hr off)
6. Read `session/dashboard-assignments.md`
7. Execute ON WAKEUP list above

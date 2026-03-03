# Product Owner Context

**Updated**: 2026-03-03 14:50
**Role**: product-owner
**Pane**: ooshDebug:0.0
**State**: Monitoring hiveMindTeam + PDCA-1.2 Step 5

## ACTIVE WORK: hiveMindTeam Self-Management (Tron directive 2026-03-03)

Tron ordered hiveMind expert to fix self-management. Major architecture change completed.

### What happened this session:
1. Expert replaced static registry with **live-fact discovery** (fea74d5)
   - `private.hiveMind.live.discover` — PID→TTY→pane→UUID→session name→role
   - `registry.get/find/list` rewritten: live first, file as fallback cache
   - Verified: `team.status` works WITHOUT registry file
2. Expert created `hiveMindTeam02_03_26` session with correct names/colors
3. Expert added `process.lookup` and `process.list` methods (6e25180)
   - `hiveMind process.lookup 80082` → shows pane, role, UUID, TTY
   - `hiveMind process.list` → table of all Claude instances
   - PID completion for Tab
4. Tester running automated T-CONSIST tests against new implementation

### Key Tron directives this session:
- "the registry was a bad idea — rely on live facts like open processes and tmux sessions"
- "panes are just views, agents can move and reinstantiate"
- "make sure all cases are consistently checked in real tests and confirmed as DRY and fixed"
- "not just verifying but having tests for it" — proper test.suite test cases

### Known issues:
- Tester pane (0.1) has wrong registry entry (hiveMind-expert instead of hiveMind-tester)
- T-CONSIST-5 caught this — pane title vs registry mismatch
- otmux send Enter doesn't work during agent mid-turn (same INC-001 pattern)
- Pre-compact hook sent wrong boot file to tester (BUG-6 still open)

### Commits this session (oosh repo):
- `5a6c03c` — registry.refresh hardening + /rename in bootstrap
- `fea74d5` — live-fact discovery replaces static registry
- `704dd6e` — T-CONSIST-8 session.id test
- `6e25180` — process.lookup and process.list methods

## PDCA-1.2 PROGRESS (unchanged from last session)

| Step | Status | Notes |
|------|--------|-------|
| 0 | DONE (c75b042) | Plan files split |
| 1 | DEFERRED | hiveMind plan.create — not blocking |
| 2 | DONE (f282afb) | PO added role prompts |
| 3 | DONE | backupTeam registered |
| 4 | DONE | backup agents bootstrapped |
| 5 | IN PROGRESS | Trainer at baseTeam:0.0 has approved plan, awaiting GO |
| 6-8 | PENDING | |

## AGENT STATES

- **hiveMind-expert** (hiveMindTeam02_03_26:0.0): alive, idle after commits
- **hiveMind-tester** (hiveMindTeam02_03_26:0.1): alive, running tests
- **hiveMind-expert OLD** (hiveMindTeam:0.0): old session, still alive
- **hiveMind-tester OLD** (hiveMindTeam:0.1): bare shell after session moved
- **backup-expert** (backupTeam:0.0): alive, waiting
- **backup-tester** (backupTeam:0.1): alive, waiting
- **trainer** (baseTeam:0.0): alive, has approved Step 5 plan
- **oosh-expert** (baseTeam:0.2): alive (discovered this session)

## TRON DIRECTIVES

- Do NOT touch projectTeam session layout
- Reboot stuck agents in baseTeam, not projectTeam
- Every agent enters plan mode. PO reviews. Tron approves before kickoff.
- ALWAYS use OOSH wrappers — never raw tmux/claude
- hiveMind must rely on live facts, not static registry
- All fixes need proper automated tests, not just manual verification

## TOOL KNOWLEDGE

- `otmux` (no args) — see ALL sessions and panes
- `otmux tree.detailed` — see sessions with Claude session UUIDs
- `hiveMind process.lookup <PID>` — NEW: resolve PID to pane, role, UUID
- `hiveMind process.list` — NEW: table of all Claude processes
- `claudeCode join <uuid>` — resume session
- `claudeCode new` — start fresh session
- otmux send Enter unreliable during agent mid-turn — always verify submission

## NEXT ACTIONS

1. Check tester test results at hiveMindTeam02_03_26:0.1
2. If tests pass → report to Tron
3. If tests fail → expert fixes, tester re-runs
4. Resume PDCA-1.2 Step 5 — tell trainer to GO (Tron approved the plan)
5. Monitor trainer training backup agents

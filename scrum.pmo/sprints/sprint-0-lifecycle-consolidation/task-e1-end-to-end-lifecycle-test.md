[Back to Planning Sprint 0](./planning.md)

# Task E1: End-to-End Lifecycle Test
[task:uuid:5e7bd287-e0dd-4338-a8e5-7a30fdb28df4]

## Naming Conventions
- Tasks: `task-<epic><number>-<short-description>.md`
- Subtasks: `task-<epic><number>.<subnumber>-<role>-<short-description>.md`
- Subtasks must always indicate the affected role in the filename.
- Subtasks must be ordered to avoid blocking dependencies.

## Status
- [ ] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Traceability
- Source: Sprint 0 - Lifecycle Consolidation, Epic E (Integration)

  - up
    - [Sprint 0 Planning - Lifecycle Consolidation](./planning.md)

  - down
    - [Task E1.1: Tester - Setup-Save-Kill-Restore Cycle](./task-e1.1-tester-setup-save-kill-restore-cycle.md)
    - [Task E1.2: Tester - Post-Restore Verification](./task-e1.2-tester-post-restore-verification.md)
    - [Task E1.3: Tester - tronMonitor Shows Restored Team](./task-e1.3-tester-tronmonitor-shows-restored-team.md)

## Task Description
The sprint's final validation: an end-to-end test that exercises the complete lifecycle across all MVC layers. Setup a team, save state, kill tmux server, restore from config, and verify everything works. This is the Definition of Done for the sprint.

## Context
This task depends on all other tasks being complete. It validates that the MVC layers work together correctly:
- claudeCode (Model) provides session data without tmux
- otmux (View) saves and restores layouts
- hiveMind (Controller) orchestrates the full restore
- tronMonitor (Monitor) auto-syncs with restored teams

The test cycle: setup -> save -> kill -> restore -> verify

Key files: `/Users/donges/oosh/claudeCode`, `/Users/donges/oosh/otmux`, `/Users/donges/oosh/hiveMind`, `/Users/donges/oosh/tronMonitor`

## Intention

### Why This Task Exists:
1. **Sprint Validation:** Proves the sprint goal is met
2. **Integration Confidence:** Verifies all layers work together
3. **Regression Gate:** This test must pass before sprint is Done

### Problems This Task Solves:
- **Unit vs integration gap:** Individual tasks may pass but integration may fail
- **Assumption validation:** Verifies cross-layer contracts actually work
- **Definition of Done enforcement:** Binary pass/fail for sprint completion

### How This Task Solves These Problems:
- **Full lifecycle exercise:** Tests the complete setup-save-kill-restore cycle
- **Cross-layer verification:** Checks Model, View, Controller, Monitor together
- **Pass/fail gate:** Sprint is not Done until this test passes

---

## Test Specification

**File:** `test/test.lifecycle.e2e` (new — sibling of `test.lifecycle`)
**Run:** `test.suite run lifecycle.e2e 1`
**Estimated duration:** 90–120 s (claudeCode fork takes ~8 s × N agents)
**Isolation:** test team uses prefix `__test_e2e_$$_` to avoid colliding with running sessions.

### Test fixture / pre-conditions

| Item | Required state |
|------|---------------|
| `tmux` server | running (test creates its own session, doesn't kill server) |
| `~/config/hivemind.teams.env` | writable; test entry will be added + cleaned up |
| `~/config/hivemind.snapshot.*.env` | dir writable for save/restore |
| `~/.claude/projects/*/` | at least one trained JSONL per role (`oosh-expert`, `oosh-tester`) |
| `screen` | installed (for tronMonitor verification) |
| `private.tronMonitor.screen.isAlive` | clean — test creates + tears down its own screen if needed |

### Test sequence (8 stages — each with explicit assertions)

```
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 1 — SETUP                                                │
├─────────────────────────────────────────────────────────────────┤
│  Action: hiveMind team.setup __test_e2e_$$ "oosh-expert,oosh-tester"
│  Wait:   sleep 8  (let agents boot)
│  Assert: otmux has __test_e2e_$$                          → true │
│  Assert: panes-in-session ≥ 2                                    │
│  Assert: claudeCode process.running for both panes        → true │
│  Assert: hiveMind resolve oosh-expert __test_e2e_$$              │
│            returns __test_e2e_$$:0.X                              │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 2 — AGENTS WORKING (light load)                          │
├─────────────────────────────────────────────────────────────────┤
│  Action: hiveMind agent.send oosh-expert "echo E2E-MARKER-1"     │
│  Wait:   sleep 3                                                  │
│  Assert: pane.capture contains "E2E-MARKER-1"                    │
│  Assert: claudeCode session.id <pane> returns valid UUID         │
│  Capture: store original UUIDs for stage 6 comparison            │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 3 — SAVE                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Action: hiveMind teams.save                                     │
│  Assert: ~/config/hivemind.snapshot.<TS>.env exists              │
│  Assert: snapshot contains __test_e2e_$$ entries                  │
│  Assert: each entry has 8 fields (sess|addr|role|uuid|title|cwd|model|kind)
│  Assert: kind ∈ {claude, shell, monitor, unknown} for all rows   │
│  Capture: $SNAPSHOT_FILE for stage 5                              │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 4 — KILL (graceful, scoped to test session)              │
├─────────────────────────────────────────────────────────────────┤
│  Action: otmux kill __test_e2e_$$                                │
│  Wait:   sleep 2                                                  │
│  Assert: otmux has __test_e2e_$$                          → false│
│  Assert: claudeCode process.running for previous panes    → false│
│   (don't kill global tmux server — would kill the test runner)  │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 5 — RESTORE                                              │
├─────────────────────────────────────────────────────────────────┤
│  Action: hiveMind teams.restore "$SNAPSHOT_FILE"                 │
│  Wait:   sleep 15  (claudeCode fork.byID is slow, polling agents)│
│  Assert: otmux has __test_e2e_$$                          → true │
│  Assert: panes-in-session matches saved count                    │
│  Assert: layout signature matches (window/pane geometry)         │
│  Assert: claudeCode process.running for both panes        → true │
│  Assert: each pane's CWD matches saved cwd                       │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 6 — VERIFY AGENT IDENTITY (post-restore)                 │
├─────────────────────────────────────────────────────────────────┤
│  Assert: claudeCode session.id <pane> returns NON-EMPTY UUID     │
│  Assert: NEW UUIDs ≠ original UUIDs (fork creates new IDs)       │
│  Assert: claudeCode session.name <newUUID> matches saved title   │
│            (customTitle preserved through fork — same role+@model)
│  Assert: pane title in tmux matches role                         │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 7 — VERIFY hiveMind RESOLVE                              │
├─────────────────────────────────────────────────────────────────┤
│  Assert: hiveMind resolve oosh-expert __test_e2e_$$              │
│            returns the actual __test_e2e_$$:0.X                   │
│  Assert: hiveMind agent.send oosh-expert "echo E2E-MARKER-2"     │
│            delivers (verify via pane.capture)                    │
│  Assert: hiveMind registry.list __test_e2e_$$ contains both roles│
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  STAGE 8 — VERIFY tronMonitor RECONCILES                        │
├─────────────────────────────────────────────────────────────────┤
│  Pre:    skip if no $TRON_MONITOR_PANE or screen not running    │
│  Action: hiveMind team.register __test_e2e_$$ "E2E test"         │
│            (observer pattern → tronMonitor.add fires)            │
│  Action: tronMonitor sync                                         │
│  Wait:   sleep 1                                                  │
│  Assert: tronMonitor.env contains entry for __test_e2e_$$        │
│  Assert: tronMonitor switch __test_e2e_$$  →  succeeds            │
│  Assert: monitor pane shows team content (capture matches        │
│            "${BOLD_GREEN}attached" or pane.title from team)       │
└─────────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────────┐
│  CLEANUP (always run, even on failure — trap EXIT)              │
├─────────────────────────────────────────────────────────────────┤
│  • otmux kill __test_e2e_$$                                       │
│  • tronMonitor remove __test_e2e_$$ (idempotent — silent if no-op)│
│  • hiveMind team.remove __test_e2e_$$                             │
│  • Drop test entries from hivemind.teams.env                      │
│  • Delete $SNAPSHOT_FILE if it had __test_e2e prefix              │
└─────────────────────────────────────────────────────────────────┘
```

### Assertion details (test.case structure)

```bash
source test.suite $*
log.level $level

TEAM="__test_e2e_$$"

# Trap for cleanup so a mid-test failure doesn't leave debris
private.cleanup() {
  otmux kill "$TEAM" 2>/dev/null
  tronMonitor remove "$TEAM" 2>/dev/null
  hiveMind team.remove "$TEAM" 2>/dev/null
  grep -v "^${TEAM}|" "$HOME/config/hivemind.teams.env" > "$HOME/config/hivemind.teams.env.tmp" \
    && mv "$HOME/config/hivemind.teams.env.tmp" "$HOME/config/hivemind.teams.env"
  [ -f "$SNAPSHOT_FILE" ] && [[ "$SNAPSHOT_FILE" == *__test_e2e* ]] && rm "$SNAPSHOT_FILE"
}
trap private.cleanup EXIT

# STAGE 1
test.case - "S1: team.setup creates session with N agents" \
  hiveMind.team.setup "$TEAM" "oosh-expert,oosh-tester"
sleep 8
[ "$(otmux has "$TEAM" 2>&1; echo $?)" = "0" ] && expect.pass "S1.1 session exists" || expect.fail "..."

local pane_count
pane_count=$(otmux panes -t "$TEAM" -F '#{pane_index}' 2>/dev/null | wc -l | tr -d ' ')
[ "$pane_count" -ge 2 ] && expect.pass "S1.2 ≥2 panes" || expect.fail "S1.2 got $pane_count"

# STAGE 2 — agents working
hiveMind agent.send oosh-expert "echo E2E-MARKER-1"
sleep 3
otmux pane.capture "$TEAM:0.1" 30 | grep -q "E2E-MARKER-1" && expect.pass "S2.1 marker delivered" || expect.fail

EXPERT_UUID_BEFORE=$(claudeCode session.id "$TEAM:0.1")
[ -n "$EXPERT_UUID_BEFORE" ] && expect.pass "S2.2 UUID known" || expect.fail "S2.2 no UUID"

# STAGE 3 — save
hiveMind teams.save
SNAPSHOT_FILE=$(ls -t "$HOME/config"/hivemind.snapshot.*.env 2>/dev/null | head -1)
grep -q "^${TEAM}|" "$SNAPSHOT_FILE" && expect.pass "S3.1 team in snapshot" || expect.fail
local fields
fields=$(grep "^${TEAM}|" "$SNAPSHOT_FILE" | head -1 | awk -F'|' '{print NF}')
[ "$fields" -eq 8 ] && expect.pass "S3.2 8-field schema" || expect.fail "S3.2 got $fields"

# STAGE 4 — kill (scoped)
otmux kill "$TEAM"
sleep 2
otmux has "$TEAM" 2>/dev/null && expect.fail "S4.1 session still alive" || expect.pass "S4.1 killed"

# STAGE 5 — restore
hiveMind teams.restore "$SNAPSHOT_FILE"
sleep 15
otmux has "$TEAM" 2>/dev/null && expect.pass "S5.1 restored" || expect.fail
claudeCode process.running "$TEAM:0.1" && expect.pass "S5.2 expert claude alive" || expect.fail

# STAGE 6 — identity
EXPERT_UUID_AFTER=$(claudeCode session.id "$TEAM:0.1")
[ "$EXPERT_UUID_AFTER" != "$EXPERT_UUID_BEFORE" ] \
  && expect.pass "S6.1 fork created new UUID" \
  || expect.fail "S6.1 UUID unchanged — fork didn't fire"

claudeCode session.name "$EXPERT_UUID_AFTER" | grep -q "oosh-expert" \
  && expect.pass "S6.2 customTitle preserved" || expect.fail

# STAGE 7 — resolve
local resolved
resolved=$(hiveMind resolve oosh-expert "$TEAM" 2>/dev/null)
[ "$resolved" = "${TEAM}:0.1" ] && expect.pass "S7.1 resolve returns correct pane" || expect.fail "S7.1 got $resolved"

hiveMind agent.send oosh-expert "echo E2E-MARKER-2"
sleep 3
otmux pane.capture "$TEAM:0.1" 30 | grep -q "E2E-MARKER-2" && expect.pass "S7.2 send post-restore" || expect.fail

# STAGE 8 — tronMonitor (skip-aware)
if private.tronMonitor.screen.isAlive 2>/dev/null; then
  hiveMind team.register "$TEAM" "E2E test"
  tronMonitor sync
  sleep 1
  grep -q "|${TEAM}\$" "$HOME/config/tronMonitor.env" && expect.pass "S8.1 tracked" || expect.fail
  tronMonitor switch "$TEAM" && expect.pass "S8.2 switch ok" || expect.fail
else
  info.log "S8 skipped — tronMonitor screen not running"
fi

test.suite.save.results
```

### Definition of PASS

Every numbered assertion (S1.1 through S8.2) returns `expect.pass`. Cleanup runs cleanly leaving no `__test_e2e_*` debris in:
- tmux sessions (`otmux sessions`)
- `~/config/hivemind.teams.env`
- `~/config/hivemind.snapshot.*.env`
- `~/config/tronMonitor.env`
- screen windows (`screen -X windows`)

### Negative-path coverage (out of scope for E1, queue as E1.4 if PO wants)

- Restore from a snapshot whose JSONLs are missing → graceful fallback (start fresh)
- Restore when target tmux session already exists → refuse OR force based on flag
- Save during agent /compact → snapshot captures pre-compact UUID; restore re-forks correctly

### Subtask split

| Subtask | Owner | Stages |
|---------|-------|--------|
| E1.1 | tester | S1–S5 (setup-save-kill-restore mechanics) |
| E1.2 | tester | S6–S7 (identity + hiveMind resolve post-restore) |
| E1.3 | tester | S8 (tronMonitor reconciliation) |

Each subtask's individual file should reference back to this spec and reuse the trap-cleanup pattern so any failure leaves the system clean.

---

*Sprint 0 - Lifecycle Consolidation*
*Epic E: Integration*
*Priority: 1 (CRITICAL - Sprint Validation)*

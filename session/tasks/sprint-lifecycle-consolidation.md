# Sprint: Agent Lifecycle Consolidation

## Sprint Goal
Consolidate all agent lifecycle methods across the MVC stack (claudeCode=Model, otmux=View, hiveMind=Controller, tronMonitor=Monitor) into a coherent, DRY, tested architecture where each layer has clear responsibilities and no cross-layer duplication.

## Sprint Overview
**Duration:** 1 week
**Focus:** MVC layer boundaries, DRY lifecycle, restore-from-cold capability
**Team:** oosh-expert (implementation), oosh-tester (validation)
**Input:** UUID DRY refactor (02b4070), multi-team resolve (03149ef), sweep.detect fixes (eca047a), tronMonitor prune (0594575)
**Constraint:** Token-efficient — stagger work, no parallel heavy refactors

## Architecture (MVC)

```
┌─────────────────────────────────────────────────────────────┐
│ tronMonitor (Monitor)                                        │
│ Tron's visual interface — see and switch teams from one pane │
│ Uses: GNU screen in TRONinterface monitor pane               │
├─────────────────────────────────────────────────────────────┤
│ hiveMind (Controller)                                        │
│ Agent orchestration — spawn, teach, resolve, send, sweep     │
│ Controls Model instances in View panes                       │
│ Persists: roles.env, sessions.env, teams.env, forks.env      │
│ Restores: team config survives otmux server restart           │
├─────────────────────────────────────────────────────────────┤
│ otmux (View)                                                 │
│ Pane management — split, capture, send, lock, tree            │
│ Sessions/windows/panes are the visual container               │
│ No agent knowledge — pure tmux wrapper                        │
├─────────────────────────────────────────────────────────────┤
│ claudeCode (Model)                                           │
│ Agent data — session UUID, context %, process PID, JSONL      │
│ session.current is the single UUID source of truth            │
│ Can join/fork sessions even without tmux (portable)           │
└─────────────────────────────────────────────────────────────┘
```

## Task List

### EPIC A: MODEL LAYER — claudeCode Lifecycle (Priority 1)

- [ ] **Task A1: Audit claudeCode methods against Model boundary**
  **Priority:** 1 (CRITICAL) **Status:** PLANNED
  - [ ] Task A1.1: Expert — list all claudeCode methods, classify as Model/View/Controller leak
  - [ ] Task A1.2: Expert — identify methods that call otmux directly (View leak) vs through hiveMind
  - [ ] Task A1.3: Tester — write boundary tests: claudeCode methods must NOT call otmux.send/pane.capture

- [ ] **Task A2: claudeCode session lifecycle — join/fork/new without tmux**
  **Priority:** 1 (CRITICAL) **Status:** PLANNED
  - [ ] Task A2.1: Expert — verify claudeCode join/fork work without $TMUX set (CLI-only mode)
  - [ ] Task A2.2: Expert — ensure session.current resolves UUID from sessions.env even when tmux is down
  - [ ] Task A2.3: Tester — test join.byID, join.byName, fork with tmux server stopped

### EPIC B: VIEW LAYER — otmux Lifecycle (Priority 2)

- [ ] **Task B1: Audit otmux for Controller/Model leaks**
  **Priority:** 2 (HIGH) **Status:** PLANNED
  - [ ] Task B1.1: Expert — list otmux methods that reference hiveMind/claudeCode/HIVEMIND_*
  - [ ] Task B1.2: Expert — sender prefix uses HIVEMIND_ROLE — acceptable? Or should Controller set it?
  - [ ] Task B1.3: Tester — boundary test: otmux must not source hiveMind or claudeCode

- [ ] **Task B2: otmux server lifecycle — save/restore pane layout**
  **Priority:** 2 (HIGH) **Status:** PLANNED
  - [ ] Task B2.1: Expert — does otmux have session save/restore? If not, design it
  - [ ] Task B2.2: Expert — pane titles, layouts, window names must persist across server restart
  - [ ] Task B2.3: Tester — stop tmux server, restart, verify layout restored

### EPIC C: CONTROLLER LAYER — hiveMind Lifecycle (Priority 1)

- [ ] **Task C1: hiveMind cold-start restore**
  **Priority:** 1 (CRITICAL) **Status:** PLANNED
  - [ ] Task C1.1: Expert — audit teams.restore: does it recreate sessions + panes + start Claude + teach roles?
  - [ ] Task C1.2: Expert — ensure hiveMind can restore from teams.env + roles.env + sessions.env when tmux server was killed
  - [ ] Task C1.3: Expert — teams.save must capture everything needed for cold restore (verified: 02b4070 UUID fix)
  - [ ] Task C1.4: Tester — full cycle: teams.save → kill tmux → teams.restore → verify all agents running

- [ ] **Task C2: hiveMind DRY audit — remaining duplication**
  **Priority:** 2 (HIGH) **Status:** PLANNED
  - [ ] Task C2.1: Expert — grep for remaining inline UUID discovery (after 02b4070 consolidation)
  - [ ] Task C2.2: Expert — grep for remaining direct tmux calls (should be zero — all through otmux)
  - [ ] Task C2.3: Tester — T-DRY pattern tests: zero raw tmux, zero inline UUID grep, zero duplicate discovery

- [ ] **Task C3: hiveMind sweep.detect reliability**
  **Priority:** 2 (HIGH) **Status:** PLANNED
  - [ ] Task C3.1: Expert — audit remaining false-positive patterns after prose-scrub (eca047a)
  - [ ] Task C3.2: Expert — add test fixtures: pane content samples for each of the 18 states
  - [ ] Task C3.3: Tester — fixture-based tests: feed known pane content, verify correct state detection

### EPIC D: MONITOR LAYER — tronMonitor Lifecycle (Priority 3)

- [ ] **Task D1: tronMonitor lifecycle review**
  **Priority:** 3 (NORMAL) **Status:** PLANNED
  - [ ] Task D1.1: Expert — audit add/remove/list/switch/reset/prune — are they DRY? Do they validate?
  - [ ] Task D1.2: Expert — auto-sync with hiveMind team.register/remove — when a team is registered, tronMonitor should auto-add
  - [ ] Task D1.3: Expert — tronMonitor.setup must be idempotent — safe to run repeatedly

- [ ] **Task D2: tronMonitor integration with hiveMind**
  **Priority:** 3 (NORMAL) **Status:** PLANNED
  - [ ] Task D2.1: Expert — hiveMind team.register should call tronMonitor.add (DRY event)
  - [ ] Task D2.2: Expert — hiveMind team.remove should call tronMonitor.remove
  - [ ] Task D2.3: Tester — register a team → verify tronMonitor.list shows it. Remove → verify gone.

### EPIC E: CROSS-CUTTING — Integration Tests (Priority 1)

- [ ] **Task E1: Full lifecycle integration test**
  **Priority:** 1 (CRITICAL) **Status:** PLANNED
  - [ ] Task E1.1: Tester — end-to-end: team.setup → agents working → teams.save → tmux kill → teams.restore → agents resume
  - [ ] Task E1.2: Tester — verify: resolve works, send.message works, sweep detects states correctly after restore
  - [ ] Task E1.3: Tester — verify: tronMonitor shows restored team

## Dependency Order

```
Week 1:
  A1 (audit claudeCode) + C2 (DRY audit)     ← parallel, independent
  ↓
  A2 (session without tmux) + B1 (audit otmux) ← parallel
  ↓
  C1 (cold-start restore)                      ← depends on A2 + B2
  B2 (otmux save/restore)                      ← parallel with C1
  ↓
  C3 (sweep.detect fixtures)                   ← after C1 proven
  D1 + D2 (tronMonitor)                        ← after C1 proven
  ↓
  E1 (integration test)                        ← last, validates everything
```

## Token Budget Rule
- ONE agent works at a time on heavy refactors
- Check `scrumMaster subscription` from PO shell every 10 minutes
- If >70% 5h: pause, save context, wait for reset
- Tester runs tests in test shell (token-free)

## Success Criteria
- [ ] claudeCode has zero otmux.send calls (pure Model)
- [ ] otmux has zero hiveMind/claudeCode source calls (pure View)
- [ ] hiveMind can cold-restore a team from saved config files
- [ ] sweep.detect has fixture-based tests for all 18 states
- [ ] tronMonitor auto-syncs with hiveMind team registry
- [ ] Full lifecycle test passes: setup → save → kill → restore → verify

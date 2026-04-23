# Sprint 0 Planning - Agent Lifecycle MVC Consolidation

## Sprint Goal
Consolidate all agent lifecycle methods across the MVC stack (claudeCode=Model, otmux=View, hiveMind=Controller, tronMonitor=Monitor) into a coherent, DRY, tested architecture where each layer has clear responsibilities, no cross-layer duplication, and cold-restart capability.

## Sprint Overview
**Duration:** 1 week
**Focus:** MVC layer boundaries, DRY lifecycle, restore-from-cold capability
**Team:** oosh-expert (implementation), oosh-tester (validation)
**Input Sources:** UUID DRY refactor (02b4070), multi-team resolve (03149ef), sweep.detect fixes (eca047a, b3a63ae), tronMonitor prune (0594575)
**Constraint:** Token-efficient — stagger work, never run all agents simultaneously

## Architecture (MVC)

```
tronMonitor (Monitor) — Tron's visual interface, see+switch teams from one pane
     │
hiveMind (Controller) — orchestrate Model instances in View panes, persist+restore state
     │
     ├── otmux (View) — pane management, capture, send, layout. No agent knowledge.
     │
     └── claudeCode (Model) — session UUID, context %, PID, JSONL. Portable without tmux.
```

## Foundation Dependencies
**Must be complete (already landed):**
- 02b4070: DRY consolidation — session.current as single UUID source
- 03149ef: multi-team resolve — cross-team agent lookup
- ff1d6dd: lifecycle auto-refresh — spawn/bootstrap/rename auto-update registry
- 635158d: consistency.fix broken UUID pruning
- eca047a: sweep.detect prose-scrub (false-positive reduction)
- 0594575: tronMonitor add() validation + prune()

## Task List (Sprint 0 - Lifecycle Consolidation)

> **Note:** Subtasks must be named to indicate the affected role (e.g., `task-a1.1-expert-model-boundary-audit.md`). Subtasks must be ordered to avoid blocking dependencies. If a blocking dependency is unavoidable, the Scrum Master is responsible for removing the impediment by reordering or splitting tasks.

### **WEEK 1: MODEL + CONTROLLER BOUNDARIES**

#### **EPIC A: MODEL LAYER — claudeCode Lifecycle**

- [ ] [Task A1: claudeCode MVC Boundary Audit](./task-a1-claudecode-mvc-boundary-audit.md)
  **Priority:** 1 (CRITICAL - Foundation) **Status:** PLANNED
  - [ ] [Task A1.1: Expert - Model Boundary Audit](./task-a1.1-expert-model-boundary-audit.md)
  - [ ] [Task A1.2: Expert - View Leak Identification](./task-a1.2-expert-view-leak-identification.md)
  - [ ] [Task A1.3: Tester - Boundary Violation Tests](./task-a1.3-tester-boundary-violation-tests.md)

- [ ] [Task A2: claudeCode Session Portability](./task-a2-claudecode-session-portability.md)
  **Priority:** 1 (CRITICAL - Cold Restart) **Status:** PLANNED
  - [ ] [Task A2.1: Expert - Session Operations Without tmux](./task-a2.1-expert-session-without-tmux.md)
  - [ ] [Task A2.2: Expert - UUID Resolution Without tmux](./task-a2.2-expert-uuid-resolution-without-tmux.md)
  - [ ] [Task A2.3: Tester - Portability Tests](./task-a2.3-tester-portability-tests.md)

#### **EPIC B: VIEW LAYER — otmux Lifecycle**

- [ ] [Task B1: otmux MVC Boundary Audit](./task-b1-otmux-mvc-boundary-audit.md)
  **Priority:** 2 (HIGH - Layer Purity) **Status:** PLANNED
  - [ ] [Task B1.1: Expert - Controller/Model Leak Identification](./task-b1.1-expert-controller-model-leak-identification.md)
  - [ ] [Task B1.2: Expert - Sender Prefix Layer Decision](./task-b1.2-expert-sender-prefix-layer-decision.md)
  - [ ] [Task B1.3: Tester - Boundary Violation Tests](./task-b1.3-tester-boundary-violation-tests.md)

- [ ] [Task B2: otmux Layout Persistence](./task-b2-otmux-layout-persistence.md)
  **Priority:** 2 (HIGH - Cold Restart) **Status:** PLANNED
  - [ ] [Task B2.1: Expert - Layout Save/Restore Design](./task-b2.1-expert-layout-save-restore-design.md)
  - [ ] [Task B2.2: Expert - Pane Title/Layout Persistence](./task-b2.2-expert-pane-title-layout-persistence.md)
  - [ ] [Task B2.3: Tester - Server Restart Recovery Tests](./task-b2.3-tester-server-restart-recovery-tests.md)

#### **EPIC C: CONTROLLER LAYER — hiveMind Lifecycle**

- [ ] [Task C1: hiveMind Cold-Start Restore](./task-c1-hivemind-cold-start-restore.md)
  **Priority:** 1 (CRITICAL - Primary Deliverable) **Status:** PLANNED
  - [ ] [Task C1.1: Expert - Restore Audit](./task-c1.1-expert-restore-audit.md)
  - [ ] [Task C1.2: Expert - Config-Only Restore](./task-c1.2-expert-config-only-restore.md)
  - [ ] [Task C1.3: Expert - Save Completeness](./task-c1.3-expert-save-completeness.md)
  - [ ] [Task C1.4: Tester - Full Cycle Test](./task-c1.4-tester-full-cycle-test.md)

- [ ] [Task C2: hiveMind DRY Remaining Audit](./task-c2-hivemind-dry-remaining-audit.md)
  **Priority:** 2 (HIGH - Code Quality) **Status:** PLANNED
  - [ ] [Task C2.1: Expert - Inline UUID Discovery Grep](./task-c2.1-expert-inline-uuid-discovery-grep.md)
  - [ ] [Task C2.2: Expert - Raw tmux Call Grep](./task-c2.2-expert-raw-tmux-call-grep.md)
  - [ ] [Task C2.3: Tester - DRY Pattern Tests](./task-c2.3-tester-dry-pattern-tests.md)

- [ ] [Task C3: sweep.detect Fixture Tests](./task-c3-sweep-detect-fixture-tests.md)
  **Priority:** 2 (HIGH - Monitoring Reliability) **Status:** PLANNED
  - [ ] [Task C3.1: Expert - Remaining False Positive Audit](./task-c3.1-expert-remaining-false-positive-audit.md)
  - [ ] [Task C3.2: Expert - 18-State Test Fixtures](./task-c3.2-expert-18-state-test-fixtures.md)
  - [ ] [Task C3.3: Tester - Fixture-Based Detection Tests](./task-c3.3-tester-fixture-based-detection-tests.md)

#### **EPIC D: MONITOR LAYER — tronMonitor Lifecycle**

- [ ] [Task D1: tronMonitor Lifecycle Review](./task-d1-tronmonitor-lifecycle-review.md)
  **Priority:** 3 (NORMAL - Tron UX) **Status:** PLANNED
  - [ ] [Task D1.1: Expert - DRY and Validation Audit](./task-d1.1-expert-dry-validation-audit.md)
  - [ ] [Task D1.2: Expert - Auto-Sync with hiveMind Registry](./task-d1.2-expert-auto-sync-hivemind-registry.md)
  - [ ] [Task D1.3: Expert - Idempotent Setup](./task-d1.3-expert-idempotent-setup.md)

- [ ] [Task D2: tronMonitor-hiveMind Integration](./task-d2-tronmonitor-hivemind-integration.md)
  **Priority:** 3 (NORMAL - Event Wiring) **Status:** PLANNED
  - [ ] [Task D2.1: Expert - team.register Triggers tronMonitor.add](./task-d2.1-expert-register-triggers-add.md)
  - [ ] [Task D2.2: Expert - team.remove Triggers tronMonitor.remove](./task-d2.2-expert-remove-triggers-remove.md)
  - [ ] [Task D2.3: Tester - Integration Tests](./task-d2.3-tester-integration-tests.md)

#### **EPIC E: INTEGRATION — Full Lifecycle Test**

- [ ] [Task E1: End-to-End Lifecycle Test](./task-e1-end-to-end-lifecycle-test.md)
  **Priority:** 1 (CRITICAL - Sprint Validation) **Status:** PLANNED
  - [ ] [Task E1.1: Tester - Setup-Save-Kill-Restore Cycle](./task-e1.1-tester-setup-save-kill-restore-cycle.md)
  - [ ] [Task E1.2: Tester - Post-Restore Verification](./task-e1.2-tester-post-restore-verification.md)
  - [ ] [Task E1.3: Tester - tronMonitor Shows Restored Team](./task-e1.3-tester-tronmonitor-shows-restored-team.md)

## Sprint Dependencies

```
A1 (audit claudeCode) + C2 (DRY audit)     <- parallel, independent
  |
A2 (session portability) + B1 (audit otmux) <- parallel
  |
C1 (cold-start restore) + B2 (layout persist) <- depends on A2, B1
  |
C3 (sweep fixtures) + D1 + D2 (tronMonitor) <- after C1 proven
  |
E1 (integration test)                        <- last, validates everything
```

## Definition of Done
- [ ] claudeCode has zero otmux.send calls (pure Model)
- [ ] otmux has zero hiveMind/claudeCode source calls (pure View)
- [ ] hiveMind cold-restores a team from saved config files
- [ ] sweep.detect has fixture-based tests for all 18 states
- [ ] tronMonitor auto-syncs with hiveMind team registry
- [ ] Full lifecycle test passes: setup -> save -> kill -> restore -> verify

## Token Budget Rule
- ONE agent works at a time on heavy refactors
- Check `scrumMaster subscription` from PO shell every 10 minutes
- If >70% 5h: pause, save context, wait for reset
- Tester runs tests in test shell (token-free pane)

## Sprint Metrics
- **Layer Purity**: Count cross-layer calls before/after (target: zero)
- **Cold Restart Success**: Binary — restore works or doesn't
- **sweep.detect Accuracy**: False positive rate before/after fixtures
- **Token Efficiency**: % of 5h budget per task completed

## Risk Management
- **Token exhaustion**: Mitigated by one-agent-at-a-time rule + subscription monitoring
- **Context loss mid-refactor**: Mitigated by commit-after-each-fix + context.md saves
- **Regression from DRY consolidation**: Mitigated by test-first approach + tester cross-check

---

**Product Owner:** product-owner (TRONinterface:0.0)
**Created:** 2026-04-23
**Sprint:** Sprint 0 - Lifecycle Consolidation
**Input Sources:** UUID DRY refactor session + multi-team resolve bugs + tronMonitor investigation

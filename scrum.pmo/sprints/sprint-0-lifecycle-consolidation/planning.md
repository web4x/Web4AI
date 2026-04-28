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

#### **EPIC G: CRITICAL FIXES (Priority 0 — before all other work)**

- [x] Task G1: claudeCode context.read hardcodes 200k — BROKEN for 1M agents
  **Priority:** 0 (BLOCKER - SM gives wrong alerts) **Status:** DONE
  - [x] Task G1.1: Expert — fix 4x hardcoded 200000 in claudeCode (lines 1386, 1643, 1720, 1725) + 180000 threshold (line 1723). Detect model from JSONL `"model"` field and set max_tokens: opus[1m]=1000000, opus=200000, sonnet=200000, haiku=200000 — commit `ca49445` per-session max_tokens detection
  - [x] Task G1.2: Expert — fix velocity calculator same bug (lines 1643, 1720, 1725) — commit `ae002cd` DRY refactor: single-source env constants
  - [x] Task G1.3: Tester — test context.read returns correct % for 1M agent (should be ~60% not -226%) — commits `a515fdc` + `3f786b0` test.claudeCode T-CTX1M-*

#### **EPIC A: MODEL LAYER — claudeCode Lifecycle**

- [x] [Task A1: claudeCode MVC Boundary Audit](./task-a1-claudecode-mvc-boundary-audit.md)
  **Priority:** 1 (CRITICAL - Foundation) **Status:** DONE
  - [x] [Task A1.1: Expert - Model Boundary Audit](./task-a1.1-expert-model-boundary-audit.md) — QA REVIEW: 68 methods, 14 View leaks, 4 Controller leaks. Findings at task-a1.1-findings.md
  - [x] [Task A1.2: Expert - View Leak Identification](./task-a1.2-expert-view-leak-identification.md) — commits `66ddcd6` raw tmux→otmux, `6d264df` extract pure parser, `de65ac2` delete duplicate `agent.recover`
  - [x] [Task A1.3: Tester - Boundary Violation Tests](./task-a1.3-tester-boundary-violation-tests.md) — commit `57d8a00`

- [x] [Task A2: claudeCode Session Portability](./task-a2-claudecode-session-portability.md)
  **Priority:** 1 (CRITICAL - Cold Restart) **Status:** DONE
  - [x] [Task A2.1: Expert - Session Operations Without tmux](./task-a2.1-expert-session-without-tmux.md) — commit `1dc8b91` session-op portability fixes
  - [x] [Task A2.2: Expert - UUID Resolution Without tmux](./task-a2.2-expert-uuid-resolution-without-tmux.md) — commit `1dc8b91` (same commit, 2 fixes bundled)
  - [x] [Task A2.3: Tester - Portability Tests](./task-a2.3-tester-portability-tests.md) — commit `cb31d3f` claudeCode works without tmux

#### **EPIC B: VIEW LAYER — otmux Lifecycle**

- [x] [Task B1: otmux MVC Boundary Audit](./task-b1-otmux-mvc-boundary-audit.md)
  **Priority:** 2 (HIGH - Layer Purity) **Status:** DONE — B1.1/B1.2 audit covered by A1.2 work; B1.3 tests landed
  - [x] [Task B1.1: Expert - Controller/Model Leak Identification](./task-b1.1-expert-controller-model-leak-identification.md) — covered by A1.2 audit
  - [x] [Task B1.2: Expert - Sender Prefix Layer Decision](./task-b1.2-expert-sender-prefix-layer-decision.md) — covered by A1.2 audit
  - [x] [Task B1.3: Tester - Boundary Violation Tests](./task-b1.3-tester-boundary-violation-tests.md) — commits `dc9d2cb` zero claudeCode/hiveMind leaks; `9b7138e` macos.latest backport

- [x] [Task B2: otmux Layout Persistence](./task-b2-otmux-layout-persistence.md)
  **Priority:** 2 (HIGH - Cold Restart) **Status:** DONE
  - [x] [Task B2.1: Expert - Layout Save/Restore Design](./task-b2.1-expert-layout-save-restore-design.md) — commit `ec7fe28` (single commit covers design + persistence + restart recovery)
  - [x] [Task B2.2: Expert - Pane Title/Layout Persistence](./task-b2.2-expert-pane-title-layout-persistence.md) — commit `ec7fe28`
  - [x] [Task B2.3: Tester - Server Restart Recovery Tests](./task-b2.3-tester-server-restart-recovery-tests.md) — commit `ec7fe28`

- [ ] [Task B3: otmux pane.lock idempotent relock](./task-b3-otmux-pane-lock-idempotent.md)
  **Priority:** 2 (HIGH - silently fails) **Status:** QA REVIEW (pending B3.2)
  - [x] [Task B3.1: Expert - pane.lock idempotent](./task-b3.1-expert-pane-lock-idempotent.md) — commit 75ab018
  - [ ] [Task B3.2: Tester - pane.lock relock test](./task-b3.2-tester-pane-lock-relock-test.md)

- [ ] [Task B4: otmux client lifecycle — attach -r read-only + window-size largest](./task-b4-otmux-client-lifecycle.md)
  **Priority:** 2 (HIGH - tronMonitor dependency) **Status:** PLANNED
  - [ ] [Task B4.1: Expert - attach readonly](./task-b4.1-expert-attach-readonly.md)
  - [ ] [Task B4.2: Expert - window-size largest](./task-b4.2-expert-window-size-largest.md)
  - [ ] [Task B4.3: Tester - client lifecycle tests](./task-b4.3-tester-client-lifecycle-tests.md)

#### **EPIC C: CONTROLLER LAYER — hiveMind Lifecycle**

- [x] [Task C1: hiveMind Cold-Start Restore](./task-c1-hivemind-cold-start-restore.md)
  **Priority:** 1 (CRITICAL - Primary Deliverable) **Status:** DONE
  - [x] [Task C1.1: Expert - Restore Audit](./task-c1.1-expert-restore-audit.md) — commits `22bb525` teams.save/restore + `c6033dd` positional fork|join arg
  - [x] [Task C1.2: Expert - Config-Only Restore](./task-c1.2-expert-config-only-restore.md) — commits `22bb525` + `c6033dd`
  - [x] [Task C1.3: Expert - Save Completeness](./task-c1.3-expert-save-completeness.md) — commits `22bb525` + `c6033dd`
  - [x] [Task C1.4: Tester - Full Cycle Test](./task-c1.4-tester-full-cycle-test.md) — commit `d092295` 8 tests save/restore/idempotency

- [x] [Task C2: hiveMind DRY Remaining Audit](./task-c2-hivemind-dry-remaining-audit.md)
  **Priority:** 2 (HIGH - Code Quality) **Status:** QA REVIEW
  - [x] [Task C2.1: Expert - Inline UUID Discovery Grep](./task-c2.1-expert-inline-uuid-discovery-grep.md) — commit 02b4070 (session.current consolidation)
  - [x] [Task C2.2: Expert - Raw tmux Call Grep](./task-c2.2-expert-raw-tmux-call-grep.md) — pre-sprint DRY audit confirmed zero raw tmux
  - [x] [Task C2.3: Tester - DRY Pattern Tests](./task-c2.3-tester-dry-pattern-tests.md) — commit 57d8a00

- [x] [Task C3: sweep.detect Fixture Tests](./task-c3-sweep-detect-fixture-tests.md)
  **Priority:** 2 (HIGH - Monitoring Reliability) **Status:** DONE
  - [x] [Task C3.1: Expert - Remaining False Positive Audit](./task-c3.1-expert-remaining-false-positive-audit.md) — commits eca047a (prose-scrub), b3a63ae (DRY detection), bb76bb6 (edit-dialog)
  - [x] [Task C3.2: Expert - 18-State Test Fixtures](./task-c3.2-expert-18-state-test-fixtures.md) — commit `afc57d3` 18 states + 7 edge-case variants
  - [x] [Task C3.3: Tester - Fixture-Based Detection Tests](./task-c3.3-tester-fixture-based-detection-tests.md) — commit `c0e59d0` test.hiveMind C3.3

#### **EPIC D: MONITOR LAYER — tronMonitor Lifecycle**

- [x] [Task D1: tronMonitor Lifecycle Review](./task-d1-tronmonitor-lifecycle-review.md)
  **Priority:** 3 (NORMAL - Tron UX) **Status:** DONE
  - [x] [Task D1.1: Expert - DRY and Validation Audit](./task-d1.1-expert-dry-validation-audit.md) — commit 0594575 (add validation + prune)
  - [x] [Task D1.2: Expert - Auto-Sync with hiveMind Registry](./task-d1.2-expert-auto-sync-hivemind-registry.md) — commit `e66036f` auto-sync with hiveMind registry
  - [x] [Task D1.3: Expert - Idempotent Setup](./task-d1.3-expert-idempotent-setup.md) — commit `e66036f` (same commit)

- [ ] [Task D2: tronMonitor-hiveMind Integration](./task-d2-tronmonitor-hivemind-integration.md)
  **Priority:** 3 (NORMAL - Event Wiring) **Status:** IN PROGRESS — D2.1+D2.2 done, D2.3 in flight
  - [x] [Task D2.1: Expert - team.register Triggers tronMonitor.add](./task-d2.1-expert-register-triggers-add.md) — commit `597f93e` team.register triggers tronMonitor observer
  - [x] [Task D2.2: Expert - team.remove Triggers tronMonitor.remove](./task-d2.2-expert-remove-triggers-remove.md) — commit `597f93e` (same commit)
  - [ ] [Task D2.3: Tester - Integration Tests](./task-d2.3-tester-integration-tests.md) — currently being written by oosh-tester

#### **EPIC F: SCRUMMASTER CMM4 RELIABILITY**

- [x] [Task F1: scrumMaster subscription velocity tracking](./task-f1-scrummaster-subscription-velocity.md)
  **Priority:** 2 (HIGH - Token Management) **Status:** DONE — commit `3fd0420` velocity time-series logging + burn-rate alerts
  - [x] Task F1.1: Expert — add velocity.log method: store 5h% with timestamp, calculate burn rate per 10-min window
  - [x] Task F1.2: Expert — add velocity.alert: if burn >15%/10min, output warning with rate
  - [x] Task F1.3: Tester — test velocity calculation with mock data

- [x] [Task F2: sweep.detect false-positive hardening](./task-f2-sweep-detect-false-positive-hardening.md)
  **Priority:** 2 (HIGH - Monitoring Reliability) **Status:** DONE — commit `1996c9a` prose-scrub strips comments + 6 fixtures
  - [x] Task F2.1: Expert — prose-scrub must strip ALL comment patterns (# and // and --)
  - [x] Task F2.2: Expert — add test fixtures for each known false-positive pattern (code comments, menu text, preamble)
  - [x] Task F2.3: Tester — regression tests: feed code-content pane captures, verify no false triggers

- [x] [Task F3: scrumMaster subscription API resilience](./task-f3-scrummaster-subscription-api-resilience.md)
  **Priority:** 3 (NORMAL - Reliability) **Status:** DONE — commit `7c818c3` cache on rate_limit + `subscription.cache.age`
  - [x] Task F3.1: Expert — handle API rate_limit_error gracefully: return cached value with staleness warning
  - [x] Task F3.2: Expert — add subscription.cache.age method to show seconds since last fresh read
  - [x] Task F3.3: Tester — test with simulated API failure

#### **EPIC E: INTEGRATION — Full Lifecycle Test**

- [ ] [Task E1: End-to-End Lifecycle Test](./task-e1-end-to-end-lifecycle-test.md)
  **Priority:** 1 (CRITICAL - Sprint Validation) **Status:** IN PROGRESS — E1.2/E1.3 currently being written by oosh-tester; E1.1 covered by C1.4
  - [x] [Task E1.1: Tester - Setup-Save-Kill-Restore Cycle](./task-e1.1-tester-setup-save-kill-restore-cycle.md) — covered by C1.4 (`d092295`)
  - [ ] [Task E1.2: Tester - Post-Restore Verification](./task-e1.2-tester-post-restore-verification.md)
  - [ ] [Task E1.3: Tester - tronMonitor Shows Restored Team](./task-e1.3-tester-tronmonitor-shows-restored-team.md)

### Tasks added mid-sprint

Tasks that landed during Sprint 0 but were not in the original plan:

- [x] Task B3.1: Tester — pane.lock relock idempotent — commits `75ab018` (impl) + `fb30cc2` (4 tests)
- [x] Task B4.1: Expert — `otmux.attach <readonly>` + `attach.readonly` alias — commit `44ad07e`
- [x] Task B4.2: Expert — `otmux.setup.default window-size=largest` + `aggressive-resize` + `window.size` method — commits `e0ddb95` + `7d27904`
- [x] Task D1.4: Expert — tronMonitor prune EPERM + survive `__test_*` cleanup — commit `26c4fdf`
- [x] Task D1.5: Expert — pane resolution respects env var, validates existence — commit `a030f68`
- [x] Task D1.6: Expert — screen session resilience + remove kill fix — commit `cd23b6e`
- [x] Task D1.10: Expert — tronMonitor matches proven Tron recipe (named windows, inline attach cmd) — commit `0f9330b`

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
- [x] claudeCode has zero otmux.send calls (pure Model) — A1.2
- [x] otmux has zero hiveMind/claudeCode source calls (pure View) — B1.3
- [x] hiveMind cold-restores a team from saved config files — C1 + C1.4
- [x] sweep.detect has fixture-based tests for all 18 states — C3.2 + C3.3
- [x] tronMonitor auto-syncs with hiveMind team registry — D1.2 + D2.1/D2.2
- [ ] Full lifecycle test passes: setup -> save -> kill -> restore -> verify — depends on E1.2/E1.3 currently in flight

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

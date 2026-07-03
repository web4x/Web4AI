# Sprint 1 Planning — SETUP_SERVER Cross-Platform + State-Machine Correctness

## Sprint Goal
A naked system reaches a **correct, mode-aware, platform-appropriate** OOSH installation via BOTH install paths (P1 self-bootstrap `init/oosh`, P2 `ossh install` dev→naked), with ALL install/branch logic in the **`oo`** custom script (the SETUP_SERVER machine driver) and **ZERO edits to the `state` engine**. Install locations are **derived from platform defaults**, never hardcoded. Existing installs **self-heal** to the corrected state order.

## Sprint Overview
- **Host:** MacStudio (donges@MacStudio) · **Test box:** WODA.test (v36421)
- **Branch model (Tron):** `dev` = OS-INDEPENDENT master; `macos.latest` = platform-specific staging (features flow macos.latest → generalized → **down into dev**). This sprint lands on **`dev`** — no promote-up.
- **Team:** oosh-architect (design), oosh-expert (impl), oosh-tester (verify) — MacStudio ooshTeam
- **Code repo:** `Cerulean-Circle-GmbH/once.sh` (branch `dev`) · **Mailbox:** `web4x/Web4AI` (branch `main`)
- **Origin:** consolidates the scattered `session/tasks/` files into proper sprint tracking (Tron directive 2026-07-02)

## Constraint (hard, Tron)
- **DO NOT modify the `state` engine.** Fix only `oo` (SETUP_SERVER checks/order) + `config`/`os`/`odocker` (platform defaults).
- OOSH wrappers only; **no output filtering** (no `2>&1|tail`, `2>/dev/null` on shown output); measure live on WODA.test.
- Architect = WHAT/WHY · Expert = HOW · Tester = verify. Report-back in task files + one-line nudge.

## Origin / source task files (consolidated here)
- `session/tasks/woda-test-state-order-check.md` (diagnosis) → Epic A
- `session/tasks/sprint-setup-server-crossplatform.md` (the working sprint) → Epics A–E
- `session/tasks/init-constructor-live-fix.md` (predecessor, DONE) → Foundation
- `session/tasks/sprint-teamsave-status-parity-FIX.md` (delegated) → Epic F (cross-ref)

## Foundation (already landed)
- init-constructor self-heal sprint — PO-signed-off `c0e6036` (blank-slate polluted box → valid `[oosh]`); commit ladder in `init-constructor-live-fix.md`.

---

## Task List

> Subtasks named `task-<epic><n>.<sub>-<role>-<slug>.md`, role in filename, ordered to avoid blocking deps.

### EPIC A — State-Machine Correctness (D1 order + D2 XOR) — **Priority 0**
- [x] [Task A1: SETUP_SERVER state order + XOR redirect](./task-a1-state-order-xor.md) — **Status: DONE (PO-approved)**
  - [x] [A1.1 Tester — diagnose ordering (WODA.test live)](./task-a1.1-tester-order-diagnosis.md) — `703b817`: user.installation.done(21) mis-indexed before user.mode.release(22)/dev(23); XOR modeled sequential, release-check dead-ends on dev.
  - [x] [A1.2 Architect — design corrected order + XOR redirect](./task-a1.2-architect-order-xor-design.md) — `f4aea76`: mode branch before done; checks return numeric RESULT via `state.find` (redirect), no engine edit.
  - [x] [A1.3 Expert — D1 reorder + D2 redirect-on-OOSH_MODE](./task-a1.3-expert-order-xor-impl.md) — `566fed9`: both mode checks `create.result 0` + `state.find … id`; C.1 single OOSH_MODE seam in `user.rights.only`.
  - [x] [A1.4 Tester — verify XOR crossing both arms live](./task-a1.4-tester-xor-verify.md) — `9395fca` (S4 dev arm live 20→21→22→23) + `bceb7b2` (F3 released arm, `T-MODE-XOR`); `test.setup.server.order` 12/12 GREEN.

### EPIC B — Cross-Platform Defaults (D3) — **Priority 1**
- [x] [Task B1: Platform-derived install locations](./task-b1-platform-defaults.md) — **Status: DONE (PO-approved)**
  - [x] [B1.1 Architect — platform-derivation strategy (os detection)](./task-b1.1-architect-platform-design.md) — in `f4aea76` §D: single seam keyed on OS, consumed by both paths.
  - [x] [B1.2 Expert — OOSH_SHARED_BASE seam + consumers](./task-b1.2-expert-shared-base-seam.md) — `650e743`: `config.init` derives `OOSH_SHARED_BASE`→`OOSH_COMPONENTS_DIR`/`ODOCKER_WORKSPACES`; `oo.mode.base.get` + `odocker` drop macOS literals.
  - [x] [B1.3 Expert — single-source OS discriminator `os.os`](./task-b1.3-expert-os-accessor.md) — `19a2a45`: side-effect-free `os.os` (owns `$OSTYPE→OOSH_OS` map); config.init consumes `$(os os)`.
  - [x] [B1.4 Tester — T-PLATFORM-DEFAULTS + T-OS-DISCRIMINATOR](./task-b1.4-tester-platform-tests.md) — `9395fca`: 8/8 GREEN both envs.

### EPIC C — Constructor Safety: no naked hang (F2) — **Priority 0**
- [x] [Task C1: Non-interactive privilege probe](./task-c1-no-sudo-hang.md) — **Status: DONE (PO-approved)**
  - [x] [C1.1 Expert — sudo -n probe, defer-to-user-band](./task-c1.1-expert-sudo-n-probe.md) — `8be593d`: dropped prompting `$SUDO touch`; root/marker/`sudo -n`→defer+warn; mirrors `oosh_can_escalate` (DRY).
  - [x] [C1.2 Tester — T-NO-SUDO-HANG](./task-c1.2-tester-no-sudo-hang.md) — `f97fc06`: 7/7 GREEN live, no prompt/hang, RESULT=20 defer.

### EPIC D — Self-Heal Existing Installs (F1 / S8) — **Priority 1**
- [x] [Task D1: Reconcile existing-install state order](./task-d1-reconcile-selfheal.md) — **Status: DONE (PO-approved); persistence verify pending on isolated box**
  - [x] [D1.1 Architect — two-tier detect + reconcile-by-name design](./task-d1.1-architect-reconcile-design.md) — `e20dbe27`: schema stamp + order-invariant probe → reconcile-by-name; F2-safe (no drive); zero engine edit.
  - [x] [D1.2 Expert — declare helper + reconcile + fix machine.delete hang](./task-d1.2-expert-reconcile-impl.md) — `09d33c9` (+ cleanup `691a269`): DRY `private.setup.server.declare`; **caught+fixed `state machine.delete` running `oo cmd vim` → naked-box hang**, replaced with direct data-file `rm`.
  - [ ] [D1.3 Tester — T-RECONCILE + T-RECONCILE-IDEMPOTENT (isolated box)](./task-d1.3-tester-reconcile-persistence.md) — **BLOCKED:** WODA.test co-resident install reverts CONFIG_PATH; rides the Epic E container.

### EPIC E — Install-Path Verification (P1 + P2) — **Priority 1**
- [ ] [Task E1: Verify both install paths reach the correct terminal](./task-e1-install-path-verify.md) — **Status: IN PROGRESS**
  - [x] [E1.1 Tester — P1 self-bootstrap (naked→user.installation.done)](./task-e1.1-tester-p1-selfbootstrap.md) — covered by A1.4 `9395fca` (dev XOR crossing, platform paths, idempotent).
  - [ ] [E1.2 Tester — P2 `ossh install` dev→naked container](./task-e1.2-tester-p2-ossh-naked.md) — **BLOCKED on Tron:** `odocker run.sshd` provisions clean, but (1) `donges` not in `docker` group (needs sudo), (2) container needs `authorized_keys` injection. Awaiting docker-group auth / pre-keyed container decision.

### EPIC F — Delegated: teams.save/status MVC parity (cross-ref) — **Priority CRITICAL (WODA.prod team)**
- [ ] Task F1: teams.save/status parity FIX — **owned by oosh-po@WODA.prod team on dev**
  - Spec: `session/tasks/sprint-teamsave-status-parity-FIX.md` (PF1 naming, PF2 shell-drop, PF3 enum-gap, PF4 freshness, PF5 tests). Evidence: `session/tasks/teamsave-vs-status-parity.md` (agent|uuid GREEN; shell/enum/freshness/naming RED).
  - **Blocker (#32):** WODA.prod local `main` 175 commits ahead of origin (mailbox broken) — their PO reconciling.

---

## Open follow-ups (non-blocking)
- [ ] **S7-nit** Expert — `config save oosh OOSH >/dev/null 2>&1` stamp swallows stderr (silent failed stamp) → drop `2>&1` per ERROR/WARNING doctrine. Closed `691a269` (verify).
- [ ] **Testability seam** — optional `OOSH_MODE_FORCE` before branch-derivation (oo:322) to allow full `state next` released-path drive on a dev box (currently function-level verified).

## Sprint Dependencies
```
A1 (state order+XOR) ── C1 (no-sudo-hang) ──┐
B1 (platform defaults) ─────────────────────┤
                                            D1 (self-heal reconcile)
                                            └── E1 (P1 ✓ / P2 blocked: naked container)
F1 (parity) — parallel, delegated to WODA.prod
```

## Definition of Done
- [x] `state next` crosses release⊕dev XOR to `user.installation.done` for BOTH OOSH_MODE values (A1.4, 12/12)
- [x] mode branch precedes `user.installation.done` (D1 order); existing installs self-heal (D1 reconcile)
- [x] install locations derived from platform (`os.os` single source); macOS literals gone (B1)
- [x] naked P1 never hangs on sudo (C1, 7/7)
- [ ] P2 `ossh install`→naked reaches same terminal + platform-correct paths (E1.2 — blocked on naked box)
- [ ] T-RECONCILE persistence proven on isolated box (D1.3 — rides E1 container)
- [x] ZERO `state`-engine edits (all epics)

## Risk Management
- **Naked-box provisioning friction** (docker group + keying) → E1.2/D1.3 blocked; needs Tron authorization. Core mechanics already proven independently.
- **Context loss mid-drive** → commit-after-each + PO context.md checkpoints.
- **Cross-repo (code=once.sh/dev, mailbox=Web4AI/main)** → report-backs to mailbox; code to dev.

---
**Product Owner:** oosh-po@MacStudio (ooshTeam:0.0)
**Created:** 2026-07-02
**Sprint:** Sprint 1 @MacStudio — SETUP_SERVER Cross-Platform + State Correctness

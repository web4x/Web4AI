[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 02: non-claude verify — detect commit, log correctly (no false-WARNING on shell)
[task:uuid:07da4b8b-deab-463c-9f95-2f555b73312e]

## Naming Conventions
- Tasks: `task-<n>-<short-description>.md` · Subtasks: `task-<n>.<m>-<role>-<short-description>.md`

## Status
- [x] Planned
- [ ] In Progress
  - [ ] refinement
  - [ ] creating test cases
  - [ ] implementing
  - [ ] testing
- [ ] QA Review
- [ ] Done

## Deliverable (TRON-directed — this is Task 01's acceptance gate)
`otmux.send.verified` on a **non-claude (shell)** target must **detect whether the Enter actually applied** — not run the meaningless `❯`-region check:
- **Enter applied** (command ran / shell prompt advanced) → **`info.log` "committed"** + **rc0**. (No `WARNING`.)
- **Enter genuinely did NOT apply** (text still staged, prompt unchanged) → **`WARNING`** + **rc2**.

A delivered shell send is `info`; a `WARNING` fires **only** when the send truly failed to commit — never a false alarm on a working send. Claude targets keep the g.7 `❯`-region verify unchanged.

## Traceability
- Source: Sprint 1 @ WODA.prod — TRON acceptance condition for Task 01 (finding from Task 01's live proof)
  - up
    - [Sprint 1 Planning @ WODA.prod](./planning.md)
  - down
    - [Task 2.1: Tester - shell commit-detect / log-level test](./task-02.1-tester-shell-rc0-tests.md)

## Task Description
Task 01's live proof showed a shell send that **committed** (the shell ran the command) yet logged `WARNING: STAGED (not committed) — rc 2`. The g.7 `❯`-verify is claude-specific; a shell has no `❯`, so it can't see the commit. Fix: give the non-claude verify a **shell-commit check** (did the prompt advance / did the command echo+run) so it reports the truth — `info`+rc0 on commit, `WARNING`+rc2 only on genuine non-apply. Also removes the false-rc2 → drain re-drive dup risk on the `agent.send`→shell path.

## Context
Key file: `/root/oosh/otmux` — `otmux.send.verified` verify branch (mirror the existing kind-branch that already gates the Escape). Relates to g.6#1.

## Intention
### Why This Task Exists
- **Honest logs**: a delivered send must not scream `WARNING`; a `WARNING` must mean something is actually wrong.
- **Gate for Task 01**: TRON accepts Task 01 only when a delivered shell send logs `info`, not `WARNING`.
### Problems This Task Solves
- False `WARNING rc2` on a committed shell send (noise + erodes trust in warnings).
- False rc2 → potential drain re-drive dup on `agent.send`→shell.
### How This Task Solves Them
- Kind-branch the verify: non-claude → shell-commit check → `info`+rc0 on commit; `WARNING`+rc2 only on genuine non-apply. Claude → g.7 region-verify unchanged.

## Approval
- [x] **TRON-directed 2026-07-03** (defined as Task 01's acceptance criterion) → architect confirms the shell-commit check + log levels → tester runs TC-2.1 → expert implements → QA → unblocks Task 01 acceptance.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
*Priority: HIGH (gates Task 01 acceptance)*

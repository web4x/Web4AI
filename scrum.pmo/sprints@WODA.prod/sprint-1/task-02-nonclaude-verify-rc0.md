[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 02: non-claude verify → `rc0` (fix false-rc2-on-shell)
[task:uuid:07da4b8b-deab-463c-9f95-2f555b73312e]

## Naming Conventions
- Tasks: `task-<n>-<short-description>.md` · Subtasks: `task-<n>.<m>-<role>-<short-description>.md`

## Status
- [x] Planned
- [ ] **PROPOSED — awaiting TRON approval**
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Deliverable (proposed)
For a **non-claude** (shell) target, `otmux.send.verified` returns **`rc0`** (a shell has no autocomplete, so its single Enter always submits — trust the commit; skip the meaningless `❯`-region check). Claude targets keep the g.7 region-verify unchanged. Tiny kind-branch in `otmux.send.verified` (mirrors the Escape's existing kind-branch).

## Traceability
- Source: Sprint 1 @ WODA.prod — finding from Task 01's live proof
  - up
    - [Sprint 1 Planning @ WODA.prod](./planning.md)
  - down
    - [Task 02.1: Tester - shell rc0 / no-drain-re-drive test](./task-02.1-tester-shell-rc0-tests.md)

## Task Description
Task 01's live proof caught it: a shell send **commits** (the shell ran the command) but `send.verified` reports **`rc2` "staged"** — the g.7 `❯`-verify is claude-specific and a shell has no `❯`. Harmless for a direct `otmux send` (no drain → no re-drive); a **dup risk** for `agent.send`→shell (queue+drain: false rc2 → fresh re-drive). Shells aren't normal agent.send targets → risk **LOW**, but the label is **wrong**.

## Context
Key file: `/root/oosh/otmux` (`otmux.send.verified` verify branch). Relates to g.6#1 (vacuous shell verify).

## Intention
### Why This Task Exists
- Honest rc: a committed send must not report "staged."
### Problems This Task Solves
- False rc2 on shells → potential drain re-drive dup on the `agent.send`→shell path.
### How This Task Solves Them
- Kind-branch the verify: non-claude → rc0 (Enter always submits, no autocomplete); claude → g.7 region-verify unchanged.

## Approval
- [ ] **TRON approves Task 02** → then: architect confirms the kind-branch → tester runs TC-2.1 → expert implements → QA-ACCEPTED.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
*Priority: LOW (cosmetic for direct sends; low dup-risk on agent.send→shell)*

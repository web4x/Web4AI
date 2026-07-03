[Back to Sprint 1 @ WODA.prod](./planning.md)

# Task 2: non-claude verify → `rc0` (fix false-rc2-on-shell)
[task:uuid:07da4b8b-deab-463c-9f95-2f555b73312e]

## Status
- [x] Planned
- [ ] **PROPOSED — awaiting TRON approval**
- [ ] In Progress
- [ ] QA Review
- [ ] Done

## Description
**Finding from the task-1 live proof (2026-07-03):** on a bash SHELL, `send.verified` correctly
delivers (the shell ran the command) but **reports `rc 2` "STAGED (not committed)"** — because the
g.7 `❯`-region verify is *claude-specific* and a shell has no `❯`, so it cannot see the commit and
mislabels it staged.

- **Harmless for a direct `otmux send`** (no drain → no re-drive → delivered once).
- **Risk for `agent.send`→shell** (queue+drain): a false rc2 could trigger a *fresh re-drive* on next idle = a **duplicate**. Shells aren't normal agent.send targets, so risk is **LOW** — but the label is **wrong**.

## Proposed fix
A shell has **no autocomplete** to eat the Enter → its single Enter **always submits**. So for a
**non-claude** target, `send.verified` should **trust the commit and return `rc0`** (skip the
`❯`-region check, which is meaningless without a `❯`). Claude targets keep the g.7 region-verify unchanged.
Tiny, localized change in `otmux.send.verified` (branch the verify on kind, like the Escape already is).

## Test cases
- **TC-2.1** [test:uuid:82abf58e-8fd7-4162-a699-0ea87b5ace37] — **shell send → rc0, no false-staged, no drain re-drive.** Send to a bash shell → command runs once AND `send.verified` returns rc0 (not rc2). Then a queue-drain of the same target does NOT re-drive (no duplicate). Claude target still returns g.7-verified rc {0/2} unchanged (no regression).

## Definition of Done (proposed)
- non-claude target → `send.verified` returns `rc0` when the Enter was sent (shell always commits)
- no false rc2 on shells → no drain re-drive → no dup on the `agent.send`→shell path
- claude verify unchanged (g.7 region-verify intact); T-SEND-MATRIX + send-selfheal stay green
- **TC-2.1 green (tester-run, PO-gated, TRON-accepted)**

## Approval
- [ ] **TRON approves this task** → then: architect confirms the kind-branch → tester writes TC-2.1 → expert implements → QA.

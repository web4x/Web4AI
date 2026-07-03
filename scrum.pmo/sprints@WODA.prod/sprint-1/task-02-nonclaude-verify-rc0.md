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

---
## ARCHITECT DESIGN (oosh-architect, 2026-07-03) — shell-commit check + exact log levels
**Kind-branch the verify (mirror the existing isClaudeCode Escape gate): CLAUDE → g.7 `❯`-region verify UNCHANGED. NON-CLAUDE → the shell-commit check below.** Closes g.6#1 (the vacuous no-`❯` verify that always rc0'd); composes with g.8 (no-poke: shell path = single Enter, no Escape, no poke, then this check).

### The signal: "did the Enter APPLY?" — probe-left-input, corroborated by pane-advanced
A shell has no `❯`, but it has an observable truth: when the Enter applies, the staged command LEAVES the input line (echoes + runs → a fresh prompt/output appears); when it doesn't, the command sits UNCHANGED at the prompt. Use the distinctive tail probe + a before/after diff so a WARNING fires ONLY on genuine non-apply.

1. **Capture the STAGED state** — right after `send-keys -l "$text"`, BEFORE the Enter: `staged=$(capture)`. (Bottom line = `<prompt> <command>`, probe = `${text: -24}` is its tail.)
2. **SINGLE Enter** (shell: no Escape, no poke), settle ~0.5s.
3. **Capture AFTER**: `after=$(capture)`; `lastline` = its bottom line.
4. **COMMITTED → `info.log` + rc0** IF **either**:
   - (a) the probe is NOT the tail of `lastline` (the command left the input line — echoed/ran/scrolled; covers done AND still-running), OR
   - (b) `after` ≠ `staged` (the pane ADVANCED — a fresh prompt / new output appeared). *(Corroborator: catches the rare case where a running command's output tail coincidentally contains the probe.)*
5. **NOT-APPLIED → `WARNING` + rc2** IFF **both**: the probe IS still the tail of `lastline` **AND** `after` == `staged` (byte-identical — the command is still sitting at the prompt and nothing happened). Genuine non-commit.

### Exact log levels (Tron's core ask — honest logs)
- committed: `info.log "send.verified: committed to $target (shell — prompt advanced)"` → **INFO, NO warning**, `RESULT=COMMITTED`, `return 0`.
- not-applied: `warn.log "send.verified: $target — Enter did not apply, text still staged, prompt unchanged (rc 2)"` → **WARNING**, `RESULT=STAGED`, `return 2`.
- **A WARNING requires BOTH conditions** (probe stuck on the input line AND the pane didn't change) → it can only fire on a TRUE non-commit. A delivered shell send always trips (a) or (b) → INFO. This is the acceptance gate.

### Why robust (no false WARNING on a working send)
- The 24-char distinctive tail probe rarely appears by accident; and even if a running command's output tail contains it, condition (b) (pane advanced) still yields rc0. Both (a) and (b) must FAIL for a WARNING → that only happens when the Enter genuinely didn't apply (command frozen at the prompt, nothing moved). Wrapping OOSH prompt (`… >` wraps on long paths) is handled: `lastline` is the wrapped continuation; a committed send advances the pane (b).

### Composition
- Removes the false-rc2 on a committed shell send → no more spurious `agent.send`→shell drain-redrive (the dup risk the task notes): committed → rc0 → dequeued.
- Claude path bit-for-bit unchanged (g.7). Shell path gains a REAL commit signal.

### Handoff
- **Expert**: in `otmux.send.verified`, kind-branch the verify — claude keeps the `❯`-region scan; non-claude runs the shell-commit check (capture-staged → Enter → capture-after → (a)|(b) rc0 info / both-fail rc2 warn). Commit.
- **Tester (TC-02.1)**: a real command to a shell that RUNS → `info`+rc0, NO warning; a send to a wedged/blocked shell where the command stays at the prompt unchanged → `WARNING`+rc2; assert the log LEVEL (info vs warn) not just rc; assert exactly ONE Enter (g.8).

## Report-back
- Architect (shell-commit check + log levels): **DONE 2026-07-03** — kind-branch the verify (mirror the Escape gate): claude→g.7 `❯`-region UNCHANGED; shell→commit check = **probe-left-the-input-line (a) OR pane-advanced (b) → info+rc0; ONLY if BOTH fail (probe still on bottom AND pane byte-unchanged) → WARNING+rc2**. Exact levels specified (info on commit, warn only on true non-apply). Closes g.6#1, composes with g.8 no-poke, kills the false-rc2 shell drain-redrive. → expert impl → tester TC-02.1 asserts the LOG LEVEL.
- Expert (impl):
- Tester (TC-02.1):

---
## PO sign-off (oosh-po@WODA.prod, 2026-07-03)
Design `3681952` APPROVED — meets TRON's spec: a delivered shell send always trips (a) probe-left-input OR (b) pane-advanced → `info`+rc0; `WARNING`+rc2 fires ONLY if BOTH fail (genuine non-commit). Robust (24-char probe + before/after diff; wrapping prompt handled by (b)); claude path bit-for-bit unchanged; kills the false-rc2 shell drain-redrive dup. → expert impl → tester TC-02.1 (asserts LOG LEVEL + exactly-one-Enter) → unblocks Task 01 acceptance.

[Back to Planning Sprint 1 @ WODA.prod](./planning.md)

# Task 01: `send.verified` clean single-submit (poke removed)
[task:uuid:fa66cc8a-f073-4b4d-8192-36de1c8a9f7e]

## Naming Conventions
- Tasks: `task-<n>-<short-description>.md`
- Subtasks: `task-<n>.<m>-<role>-<short-description>.md` (role in filename)

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases
  - [x] implementing
  - [x] testing
- [x] QA Review
- [x] Done
## Deliverable
`otmux.send.verified` is a **single clean submit**, never a retry loop:
**stage ONCE** (`C-u` + `send-keys -l`) → **Escape** (dismiss `@`/`/`-autocomplete — CLAUDE + IDLE only, never a shell, never a generating agent) → **SINGLE Enter** → **one-shot** g.7 region-verify → **honest rc {0 committed / 2 staged}**. **No poke, no retry, no 2nd Enter.** A staged (rc2) message is retried by the **drain layer** as a fresh single-shot next idle (composes with the rc0-gate + dup-fix).
**Commit:** `once.sh@dev 494597e` (poke loop deleted; keystream-verified: shell 1 Enter/0 Escape, claude 1 Escape/1 Enter).

## Traceability
- Source: Sprint 1 @ WODA.prod, TRON directive 2026-07-03
  - up
    - [Sprint 1 Planning @ WODA.prod](./planning.md)
  - down
    - [Task 01.1: Architect - remove-poke clean-send design](./task-01.1-architect-remove-poke-design.md)
    - [Task 01.2: Expert - remove-poke impl](./task-01.2-expert-remove-poke-impl.md)
    - [Task 01.3: Tester - single-submit test cases](./task-01.3-tester-single-submit-tests.md)

## Task Description
Make every send a single, verified submit. The Enter must COMMIT (the idle-only Escape dismisses the autocomplete that otherwise turns Enter into a swallowed newline). Delivery is verified once by capture, never by re-Entering. The reliability lives in doing the one submit right, and — for a genuinely staged message — in the drain layer re-driving a fresh single-shot, not in an in-place poke loop.

## Context
Key file: `/root/oosh/otmux` (`otmux.send.verified`, `send.smart`). Prior arc closed the dup (`fccdad8` enqueue, `d4e3ae0` drain), the stray-newline (`bcd8f84`), the kind mis-classify (`6213ad6`), the wrap region-verify (g.7). This task removes the poke loop itself (g.8 `494597e`).

## Intention
### Why This Task Exists
1. **A send is not a retry machine** — "type text, press Enter, once."
2. **Never interrupt a working agent** — the Escape (the interrupt vector) fires idle-only.
3. **Exactly-once** — no duplicate, no stray-Enter spray.

### Problems This Task Solves
- **Poke-spray:** the retry loop stamped `poke 1/3`/`poke 2/3` and sprayed blank Enters (2× on a shell; picker mis-select risk on claude).
- **Enter=newline (BUG10):** `@`/`/`-autocomplete swallowed the Enter → text staged, never submitted.
- **Duplicate delivery:** re-Entering / re-delivery duplicated messages.

### How This Task Solves Them
- **Delete the poke loop**; single Escape (idle-only) makes the one Enter submit.
- **One-shot verify** → honest rc; rc2 → the **drain** retries fresh (not an in-place poke).
- Composes with the enqueue/drain rc0-gate + dup-fix → exactly-once, no interrupt.

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*
*Priority: CRITICAL (send is core infrastructure)*

## Completion-usability (a75753d)
Added `otmux.send` + `send.enter/key/raw/tui/verified` `.completion.target()` → `private.complete.paneTargets` (mirrors `send.zoomed@3597`). `otmux send <TAB>` now completes the target pane (live panes + CURRENT/U/D/L/R) instead of falling back to method-name completion. Part of Task 1 being usable.

## QA acceptance
**TRON QA-ACCEPTED 2026-07-03.** Clean single-submit (poke removed, `494597e`) + target-completion (`a75753d`), tester + live-proof verified. Task 02 (shell-log) is a separate follow-on task, not a Task 01 gate.

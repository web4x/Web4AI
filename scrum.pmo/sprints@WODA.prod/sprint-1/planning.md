# Sprint 1 @ WODA.prod — Reliable Send & Capture
[sprint:uuid:94fff2f6-e044-408d-8d84-a99722496655]

## Sprint Goal
`otmux` and `hiveMind` send + capture are **reliable and exactly-once** on every method:
the Enter always COMMITS (never a stray newline), each message is delivered **once** (no
duplicate), a working agent is **never interrupted**, and nothing sprays extra keystrokes.
Verification is by **capture** (the prove-step), never by a retry loop.

## Machine scope
This is the **WODA.prod** (home, v60211) sprint level — `scrum.pmo/sprints@WODA.prod/`.
Code lands in `Cerulean-Circle-GmbH/once.sh@dev` (`/root/oosh`); this sprint/task tree lives in
`web4x/Web4AI@main`.

## Team
oosh-po@WODA.prod (drive + QA gate) · oosh-architect (design/contracts) · oosh-expert (impl) · oosh-tester (validation) · scrum-master (monitor) · TRON (operator, final acceptance)

## QA workflow (per task)
1. **architect** designs the contract → PO signs off the design
2. **tester** writes the test cases (scenario-first, on disk) — each `[test:uuid:…]`
3. **expert** implements → commits to once.sh@dev
4. **tester** runs the cases → reports PASS/FAIL (measure-don't-assume)
5. **PO** gates on the tester report + an independent proof; **TRON** gives final acceptance
6. Only then: task = **QA-ACCEPTED**

## Tasks
| Task | Title | Status |
|------|-------|--------|
| [task-1](./task-1-clean-single-submit-send.md) | `send.verified` clean single-submit (poke removed) | ✅ **PROVEN + QA-ACCEPTED** (TRON, 2026-07-03) |
| [task-2](./task-2-nonclaude-verify-rc0.md) | non-claude verify → `rc0` (fix false-rc2-on-shell) | 🔲 **PROPOSED — awaiting TRON approval** |

## Provenance (the send-reliability arc, once.sh@dev — folded into task-1)
`fccdad8` enqueue dup · `d4e3ae0` drain rc2 dup · `g.6 bcd8f84` pane.get stray-newline · `g.4 6213ad6` kind mis-classify · `g.7` wrap region-verify · **`g.8 494597e` REMOVE-POKE (the clean single-submit)** · verified by `test.send-selfheal`, `T-SEND-MATRIX` (superset), the live testSend proof.

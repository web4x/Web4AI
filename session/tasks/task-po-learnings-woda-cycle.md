---
name: PO learnings — WODA.prod cycle 2026-06-28
uuid: c3a7f2e1-8b45-4d9c-a6e3-7f1d0b2c8e54
type: improvement
owner: robbin-po
---

# Task: Write real learnings from WODA.prod cycle into learnings.md

## Problem (measured)
ARON measured: ~65 of 98 agent learnings.md files are empty. robbin-po's learnings.md
on WODA.prod carries MacStudio-era content but ZERO learnings from this cycle — despite
hitting: --force violation, otmux /dev/tty failure, 3-slot collapse, wrong-UUID pointer,
BUG-A/B/C, agent identity mismatches, staggered rewind coordination, and Sprint 21 planning.
All that knowledge is in chat, not in the file. It dies on rewind.

## Fix
Write these cycle learnings into session/agents/robbin-po/learnings.md:
1. --force is forbidden in radical OOP — fix the object, don't bypass the guard
2. LOG_DEVICE=/dev/stderr workaround for headless (until oosh fix lands)
3. otmux send verified OK but agent may still not process (permission prompts, stale buffers)
4. hiveMind registry drifts when agents migrate hosts — verify after any migration
5. boot.md pane numbers must be updated on host migration (5/5 were wrong)
6. BUG-A: wipStatus must read hopStates at last hop, not just position
7. BUG-B: setFocus must rotate lastCompleted (capture old focus before clearing)
8. BUG-C: 3-slot uniqueness invariant — exclude by construction, not data patching
9. UUID prefix match ≠ UUID match (f2f84ce3-bbbc ≠ f2f84ce3-6f8f — caused "missing" unit)
10. Staggered rewind order: idle+highest-burn first, WIP-preserved via context.md commit

## Acceptance Criteria
- [ ] learnings.md contains ≥10 real learnings from this WODA.prod cycle
- [ ] Each learning has a number, title, and one-paragraph explanation
- [ ] File is committed

## Status
- [x] Planned
- [ ] In Progress
- [ ] Done

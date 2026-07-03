[Back to Task 01](./task-01-clean-single-submit-send.md)

# Task 01.1: Architect - remove-poke clean-send design
[task:uuid:f9b3974a-f7e5-4122-950e-16dabbc2ea7c]

## Status
- [x] Planned
- [x] In Progress
- [x] QA Review
- [x] Done (design `5668c71`, PO-signed)

## Traceability
- up
  - [Task 01: clean single-submit send.verified](./task-01-clean-single-submit-send.md)

## Description
**Role: oosh-architect**
Design the clean send contract (`g.8`, once.sh@dev `5668c71`): stage ONCE → Escape (CLAUDE+IDLE only) → SINGLE Enter → one-shot g.7 region-verify → honest rc{0/2}. **Delete** the poke loop / maxpokes / retry / 2nd-Enter. Core insight: the Escape already makes the one Enter land, so the poke was redundant + harmful; the legitimate retry moves to the **drain layer** (fresh single-shot next idle), composing with the rc0-gate (`a420664`) + dup-fix (`fccdad8`). Caller impact minimal (already handle rc2).

---
*Sprint 1 @ WODA.prod — Reliable Send & Capture*

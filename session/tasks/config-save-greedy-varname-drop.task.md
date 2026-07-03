# config.save GREEDY varname extraction → silent var DROP (any value containing ' ident=')

**From**: oosh-po@WODA.prod (oosh-expert flag during task-18 root-cause, 2026-07-03)
**Owners**: config-expert/oosh-architect (contract) → oosh-expert (impl) → config-tester
**Priority**: HIGH — SILENT data loss (a persisted var vanishes with no error)
**Date**: 2026-07-03
**Related**: task-18 cyan (the symptom), fix `9d65d12` (the 2 sites already anchored)

## Problem / Why
`config.save`'s varname extraction sed was GREEDY (`s/^.*[ ]\(name\)=.*/`). For any var whose VALUE contains ` identifier=` (e.g. `FORMAT_PARSE_METHOD`, value has `METHOD_DESCRIPTION=`), the `.*[ ]` matched INTO the value → wrong varname → the allow-list `case` failed → **var SILENTLY DROPPED from the .env**. Cost: line.format lost FORMAT_PARSE_METHOD → METHOD_PARAMETER always empty → cyan never fired (task-18). The 2 known sites are fixed (`9d65d12`, anchor on `declare -<flags> ` prefix), BUT the expert flagged: **this class could silently lose ANY var with ` ident=` in its value** — needs a broader check.

## Design / Approach
1. AUDIT: grep all config.save call sites / varname-extraction paths for the greedy pattern; confirm all anchor on the `declare -<flags> ` prefix (first real identifier).
2. HARDEN: one canonical varname extractor (DRY) used everywhere config parses `declare` lines — anchored, never greedy.
3. DETECT: config.save/validate should FAIL-LOUD if a var it was asked to persist did not round-trip (save→reload count mismatch) → no silent drop.
4. SWEEP: check existing persisted .env files for already-dropped vars (any var expected but missing).

## Acceptance Criteria
- [ ] No config.save path uses greedy varname extraction (all anchored on declare-prefix)
- [ ] A var whose value contains ` ident=` round-trips (save→reload) intact
- [ ] config.save fails-loud on a persist round-trip mismatch (no silent drop)
- [ ] T-CONFIG-SAVE-VALUE-IDENT: persist a var with ` x=` in its value → reload → present
- [ ] DRY: single canonical declare-line varname extractor

## Report-back (owners edit here; one line + commit)
- Architect (canonical extractor contract):
- Expert (audit + harden + fail-loud):
- Tester (T-CONFIG-SAVE-VALUE-IDENT + sweep):

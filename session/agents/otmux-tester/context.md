# otmux-tester Agent Context

## Identity
- **Role**: otmux-tester@opus
- **Host**: MacStudio.fritz.box
- **Pane**: otmuxTeam:0.1
- **Session ID**: a79b35f1-2d40-4be0-bdfc-b6b3ceb60256
- **Expert**: otmuxTeam:0.0
- **Test shell**: otmuxTeam:0.2

## Current State (2026-03-14)
- **37/37 otmux tests passing** in test/test.otmux
- Mid-line completion v2 **VERIFIED PASS** (interactive test in test shell)
- send.key tests written (T33-T37)

## Tests Written This Session (T9-T37)
- T9-T15: setup.default (runs, pane-border-status, mouse, vi, clipboard, history, function)
- T16-T21: DRY parameter.completion (target, sourcePane, session, direction, layout, window)
- T22-T23: pane.swap (no args error, signature has sourcePane+targetPane)
- T24: pane.join uses <window> param
- T25: COMP_WORDBREAKS colon fix is global in 2c.intsall
- T26: parameter.completion.targetPane returns panes
- T27: pane.move uses <window> param
- T28-T30: tree/tree.detailed session filter (filter works, no-arg shows all)
- T31-T32: tree/tree.detailed have <?session> optional param
- T33: send.key function defined
- T34: send.key signature has <target> <key> <?count:1>
- T35: send.keys function defined
- T36: send.key with no args returns error
- T37: 2c.intsall has midline/COMP_POINT detection code

## Bugs Found & Fixed (ALL VERIFIED)
1. **COMP_WORDBREAKS colon** — fixed globally in f38c12c (not local cda06e7)
2. **c2 param color** — sed g flag fix in 3addcd9
3. **tree.detailed consistency** — 3d98c20 (shells no sub-branches, role@model, full UUIDs)
4. **Mid-line completion** — expert v2 fix WORKS: `tree.de` + TAB at mid-line → `tree.detailed` without garbling

## send.key — VERIFIED PASS
- `otmux send.key <target> <key> <?count:1>` works
- Cursor movement verified: ABCDE + Left 5 + _X_ = ABCDE_X_FGHIJ
- TAB on key param shows: BSpace DC Down End Enter Home Left Right Tab Up
- Also `otmux send.keys` exists for key sequences

## Pending Work
- **Issue 5**: split.h tests (root cause known in learnings L1)
- **Issue 3**: send drops first char in narrow panes

## NEXT STEPS after boot
1. Read SKILL.md FIRST (OOSH architecture & test.suite API)
2. Read this context.md + learnings.md
3. Resume Issue 5 and Issue 3

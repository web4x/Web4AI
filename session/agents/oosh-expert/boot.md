# Boot: oosh-expert
*Written by agent 2026-06-22.*

## You are: oosh-expert
## Pane: ooshTeam:0.2
## Goal: Awaiting next PO assignment

## Immediate actions:
1. Run `otmux pane.get.target` — confirm pane address
2. Read `session/agents/oosh-expert/context.md`
3. Read `session/agents/oosh-expert/learnings.md`
4. Check PO: `otmux pane.capture ooshTeam:0.0 10`

## Recent commits (2026-06-21/22, this session):
- d79a4c9: sweep.detect — live bottom area BEFORE scrollback
- b904be5: claudeCode.stop — kill PID + respawn cooked shell
- 516ebb3: otmux.send.zoomed — zoom + send + unzoom for 27-col TUI
- 12100f8: this dispatch — private/unknown method human-readable errors
- 80fdbd8: DURING_REWIND — operator state override layer (set/clear/get + sweep + send)
- 33da219: c2 completion — fix ''' corruption + suppress usage text

## Key facts:
- restore-backlog #1-10 ALL DONE
- DURING_REWIND shipped, awaiting tester T-REWIND-STATE
- c2 completion fix DONE+TESTER-VERIFIED (7/7 GREEN)
- this-dispatch fix DONE+TESTER-VERIFIED (7/7 GREEN)
- sweep.detect stale fix DONE+PO-VERIFIED

## Rules:
- OOSH is on PATH — no sourcing, no cd, no ./
- One-liner commits, details in task file
- Never git rebase. Pull with merge only.
- Shell pane ooshTeam:0.4 for execution (test.suite, git, source)
- Expert does NOT test — hand off to tester

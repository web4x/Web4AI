# Task D5: tronMonitor stale client cleanup — prevent pane size collapse

**Status:** PLANNED
**Priority:** 1 (CRITICAL — stale clients crush ALL sessions to 1×3)
**Root cause (2026-05-14):** 20 tronMonitor read-only screen clients (1×3, idle 50h) were the "largest" client for every session. window-size=largest picked 1×3, crushing all agent panes.

## Problem

tronMonitor.setup creates GNU screen windows that attach read-only tmux clients (`TMUX= tmux attach -r -t teamName`). When screen dies or the monitor pane is resized to tiny, these clients survive as zombie 1×3 attachments. Since B4.2 set `window-size=largest`, tmux sizes every session to the largest attached client — which is now 1×3.

This is a recurring failure: happened before (B8 fix), happened again today. Manual `client.cleanup read-only` + `floor.apply` fixes it temporarily but doesn't prevent recurrence.

## Fix Design

### D5.1: tronMonitor.setup must register cleanup hooks
- On `tronMonitor.reset` / `tronMonitor.remove`: detach ALL read-only clients for that session before removing the screen window
- On `tronMonitor.setup`: run `client.cleanup read-only` first to clear any stale remnants from previous runs

### D5.2: tronMonitor.sync must check client health
- During sync, check each monitored session's attached clients
- If any read-only client is idle >1h AND size <10×10: auto-detach it
- Log the detach as a state-correction event (SC-B event dispatch)

### D5.3: scrumMaster.cycle integration
- Add `otmux client.cleanup read-only` to the reconcile cycle (SC-D.2)
- Stale read-only clients are a state-drift class — reconcile should catch them
- Gate: only cleanup if any read-only client is idle >30min

### D5.4: tester verification
- Test: start tronMonitor, verify read-only clients created
- Test: kill screen, verify read-only clients cleaned up
- Test: simulate stale client (idle >1h, 1×3), verify sync detaches it
- Test: verify sessions return to proper size after cleanup

## Acceptance Criteria
- [ ] tronMonitor.reset cleans up read-only clients before rebuilding
- [ ] tronMonitor.sync detaches stale tiny clients
- [ ] scrumMaster.cycle includes client cleanup in reconcile
- [ ] No manual intervention needed when tronMonitor screen dies
- [ ] Sessions never stay at 1×3 for more than one reconcile cycle

## Dependencies
- B4.2 window-size=largest (DONE)
- B6 client.cleanup (DONE — d860bec)
- B8 window.size.floor.apply (DONE — 2196cdc)
- SC-D.2 scrumMaster.cycle reconcile (DONE — cef6e8f)
- SC-B event dispatch (DONE — 8feac46)

## Traceability
- Up: Sprint 1 planning.md
- Related: B6 (client lifecycle), B8 (size floor), D3 (tronMonitor state sync)

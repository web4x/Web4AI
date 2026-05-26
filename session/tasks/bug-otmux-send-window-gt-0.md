# BUG — otmux send to session:WINDOW.pane misroutes when window > 0

**Reporter**: Tron via PO (ooshTeam:0.0)
**Symptom**: `otmux send robbinTeam:1.1 ...` arrives at wrong pane
**Impact**: HIGH — any team using multi-window layouts (e.g. robbinTeam window 1) cannot be addressed
**Assignee**: oosh-expert

## Hypothesis (to verify)

Several otmux methods parse pane targets with patterns like `${pane%%:*}` (session), `${pane#*:}` (window.pane). These split on first `:` correctly. But somewhere a method may be assuming `addr` is always `0.N` (window-0-only) or normalizing `addr` incorrectly.

Candidates to inspect:
1. `otmux send` / `send.raw` / `send.verified` / `send.smart` — target classification + isPane regex
2. `private.resolve.target` (U/D/L/R resolver) — does it round-trip?
3. `this.isPaneTarget` regex — does it accept `session:1.1`?
4. `tmux send-keys -t "$target"` — does tmux itself handle `session:1.1`?

## Investigation plan

1. Reproduce: `otmux send robbinTeam:1.1 "echo test" Enter` → `otmux pane.capture robbinTeam:1.1 5`
2. Verify isPaneTarget regex accepts `session:1.1`
3. Test direct tmux: `tmux send-keys -t robbinTeam:1.1 "test"` — does TMUX itself route correctly?
4. Trace through otmux.send dispatch: where does the target get rewritten?

## Findings

**Reported symptom misleading — bug is not in window-number routing.**

Reproduction tests:
- `otmux send.raw robbinTeam:1.1 "..." Enter` → delivered to 1.1 correctly ✓
- `otmux send robbinTeam:1.1 "..." Enter` → delivered, `send.verified OK: pane robbinTeam:1.1 changed` ✓
- `otmux send.enter robbinTeam:1.1 "/help"` → /help displayed in 1.1 correctly ✓
- `hiveMind send robbin-req "..."` → resolves to robbinTeam:1.1, routes correctly

`this.isPaneTarget` regex `^[A-Za-z_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+$` accepts `session:1.1`. tmux `send-keys -t robbinTeam:1.1` routes correctly to window 1, pane 1. Address normalization in registry/snapshot/restart paths uses `${pane#*:}` which preserves multi-window addresses.

**Actual bug**: `hiveMind.agent.send` uses `info.log` for the "queue at position N" and "INFORM delivered" feedback. `info.log` gates on `LOG_LEVEL > 3`. Default is 3, so these paths are silent at default level. Operator sends to a busy agent → message correctly queued → operator sees ZERO output → operator concludes "message went somewhere wrong / disappeared".

Tron's observation "send to window 1 arrives wrong pane" was the silent-queue bug manifesting on a window-1 pane that happened to be busy. Same silent behavior reproduces on window 0:
- `hiveMind send web4-expert "..."` to busy web4team:0.2 → exit 0, no output, message in `~/config/hivemind.queue/web4team_0_2.queue`

The window-number was a red herring.

## Fix

`hiveMind.agent.send` at line ~2157 (INFORM delivered) and line ~2175 (QUEUE position): `info.log` → `console.log`. Console.log gates on `LOG_LEVEL > 2` so visible at default level 3. Added drain hint to queue message so operator knows recovery command.

No change to routing logic, no new methods, no regex changes. Pure visibility fix.

Two lines changed semantically (info.log → console.log), plus added drain hint in queue message.

## Commit

`hiveMind: make agent.send queue/deliver feedback visible at default log level (ref: bug-otmux-send-window-gt-0.md)`

## Status (closure)

- **Investigation**: routing verified correct across all 4 send paths × both windows (0 and 1). No routing bug exists.
- **Real bug identified**: silent feedback at default log level — operator perception of "wrong pane" was symptom of invisible queue path.
- **Fix shipped**: commit `82213a6` — info.log → console.log on 2 success paths in `hiveMind.agent.send`. Drain hint added.
- **Verification**: post-fix `hiveMind send robbin-req "..."` produces `QUEUE: robbin-req (robbinTeam:1.1) busy ...` at default level — operator now sees the routing decision.
- **Handoff**: tester to verify (a) default-level visible queue/deliver messages, (b) routing still correct on multi-window panes, (c) no regression on existing send-path tests.

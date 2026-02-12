# Task: Implement hiveMind team.loop

## Requested by: ScrumMaster (via PO/user directive)

## Problem
SM currently uses manual batch `otmux pane.capture` calls with `&&` chains to sweep all panes. This:
- Wastes tokens on long compound commands
- Misses panes (SM forgot task-agent, scribe, tester, expert after compact)
- Requires manual parsing of raw pane output

## Specification

### hiveMind team.sweep <session>
Single command that captures ALL registered panes and returns a structured summary.

**Output format** (one line per pane):
```
<pane> <agent> <state> [details]
```

**States to detect**:
- `PERMISSION` — "Do you want to proceed?" or option list visible
- `CONTEXT_LOW` — "Context low (X% remaining)" in status bar
- `ACTIVE` — creative verb spinner (Composing, Misting, etc.) or "thinking"
- `COMPLETED` — past-tense verb (Baked, Brewed, Cooked, etc.)
- `IDLE` — empty prompt `>` or `❯` with no text
- `INPUT` — text in the input buffer (queued message)

**Example output**:
```
0.0 orchestrator ACTIVE Processing (14m)
0.1 oosh-expert IDLE
0.2 oosh-tester IDLE
0.4 product-owner CONTEXT_LOW 1%
0.5 agent-trainer PERMISSION "access to session/"
1.0 woda-writer ACTIVE chapter 10
1.1 woda-scribe COMPLETED
1.2 task-agent INPUT "commit setup scripts"
1.3 developer IDLE
1.4 script-product-owner IDLE
```

### hiveMind team.loop <session> <interval>
Runs `team.sweep` in a continuous loop, printing output every <interval> seconds.

**Example**: `hiveMind team.loop projectTeam 30`

## Notes
- Read pane registry from `/tmp/hivemind.roles`
- Skip the SM's own pane (self)
- Use `otmux pane.capture` internally (OOSH wrappers, not raw tmux)
- Detect states by pattern matching on the last ~15 lines of pane output

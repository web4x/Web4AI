# Task 8: Agent Navigation by Name & Tree-based Status

## Problem

1. `hiveMind team.status` uses table/box output — bad TUI UX
2. Agents are addressed by pane numbers (0.1, 0.2) — fragile, confusing when panes change
3. ScrumMaster had difficulty finding session IDs — too complex
4. Raw `tmux` commands with cryptic flags used everywhere instead of OOSH wrappers

## Requirements

### A) `hiveMind team.status` — Tree Output
Replace table/box output with tree-like format:
```
cursorOrchestrator
├── 0.0  Agent Teacher (active)
├── 0.1  Test Shell (bash)
├── 0.2  OOSH Expert (idle)
├── 0.3  ScrumMaster (monitoring)
└── 0.4  OOSH Tester (idle)
```

### B) Agent Name Registry
Agents should be addressable by name, not pane number:
- `hiveMind send expert "do something"` instead of `tmux send-keys -t cursorOrchestrator:0.2 "..."`
- `hiveMind monitor expert` instead of `tmux capture-pane -t cursorOrchestrator:0.2 -p`
- Name → pane mapping stored in pane titles (already set by `private.hiveMind.pane.identify()`)

### C) `otmux` Wrappers
Add/improve OOSH methods so hiveMind never calls raw tmux:
- `otmux pane.get.target` — already exists (user showed it)
- `otmux pane.capture <target> <?lines:20>` — wraps `tmux capture-pane -t ... -p | tail -N`
- `otmux pane.send <target> <text>` — wraps `tmux send-keys -t ...`
- `otmux pane.list <?session>` — wraps `tmux list-panes -t ... -F ...`
- `otmux session.list` — wraps `tmux list-sessions`

### D) `hiveMind` Name Resolution
- `hiveMind.resolve <name>` — returns pane target for a named agent (searches pane titles)
- `hiveMind send <name> <message>` — resolves name → pane, sends via `otmux pane.send`
- `hiveMind monitor <name> <?lines:5>` — resolves name → pane, captures via `otmux pane.capture`

### E) Simple Status Commands
- `hiveMind status` — one-line overview: session name, agent count, test results
- `hiveMind team.status` — tree output showing all panes with agent names and state

## Testing
Use pane 0.1 as test shell to verify UX:
- `./hiveMind team.status` — verify tree output
- `./hiveMind resolve expert` — verify returns correct pane
- `./hiveMind send expert "hello"` — verify message arrives

## Delegation
Expert (pane 0.2) implements. Tester verifies. ScrumMaster coordinates.
Agent Teacher tests UX via pane 0.1 (test shell).

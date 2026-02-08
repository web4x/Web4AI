# Task 5: ScrumMaster Default Monitor Method

## Origin
Requested by ScrumMaster (pane 0.3)

## Problem

The ScrumMaster currently uses a raw bash loop to monitor all panes:
```bash
for pane in 0.0 0.1 0.2; do
  echo "=== PANE $pane ==="
  tmux capture-pane -t cursorOrchestrator:$pane -p | tail -5
done
```

This should become a proper hiveMind method following OOSH conventions (method signature, logging, completion, usage).

## Requirements

Add `hiveMind.monitor()` method that:
1. Captures the last N lines from all OTHER panes in the hiveMind session (excludes own pane)
2. Formats output clearly with pane identifiers (role name if available)
3. Accepts optional parameters: `<?lines:5>` for tail depth, `<?session>` for session name
4. Follows OOSH conventions: method signature comment, logging, return values
5. Auto-detects current session from `$HIVEMIND_SESSION` or defaults to `cursorOrchestrator`
6. Lists panes dynamically (don't hardcode 0.0/0.1/0.2)

## Method Signature

```bash
hiveMind.monitor() # <?lines:5> <?session> # Monitor all panes — capture last N lines from each
```

## Delegation

| Step | Agent | Task |
|------|-------|------|
| 1 | Expert (0.1) | Implement `hiveMind.monitor()` in hiveMind script |
| 2 | Expert (0.1) | Update `hiveMind.usage()` to include monitor method |
| 3 | Tester (0.2) | Verify method exists, signature correct, output format |
| 4 | Tester (0.2) | Verify completion works: `./c2 function.completion ./hiveMind monitor` |

## Acceptance Criteria

- `./hiveMind monitor` captures all panes with role labels
- `./hiveMind monitor 10` captures last 10 lines per pane
- Method has proper signature comment
- `./hiveMind usage` lists monitor method
- Tester verifies PASS

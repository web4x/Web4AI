# FEATURE: tronMonitor auto-switch on hiveMind team interaction

**From**: product-owner@opus (TRONinterface:0.0)
**To**: oosh-expert, oosh-tester
**Priority**: HIGH — Tron directive
**Date**: 2026-03-29

## Problem

When PO sends tasks to a team via `hiveMind task` or `hiveMind send.enter`, the TRON-monitor stays on whatever team it was last showing. Tron has to manually switch. This defeats the purpose of the monitor.

## Required behavior

Whenever hiveMind interacts with a team pane, the tronMonitor should auto-switch to show that team's session.

### Option A: Hook in hiveMind (preferred)

Add `tronMonitor switch` calls inside hiveMind's messaging methods. When any of these run:
- `hiveMind task <role> "msg"`
- `hiveMind send <role> "msg"`
- `hiveMind send.enter <role> "msg"`
- `hiveMind broadcast "msg"`
- `hiveMind monitor <role>`
- `hiveMind sweep`

...the tronMonitor should auto-switch to the team session that contains the target pane. This means:

1. Resolve the target pane's session name (already known from `hiveMind resolve`)
2. Call `tronMonitor switch <sessionName>` before or after the send

Add a private helper:
```bash
private.hiveMind.monitor.switch() {
  local pane="$1"
  local session="${pane%%:*}"
  tronMonitor switch "$session" 2>/dev/null
}
```

Call it from `hiveMind.task()`, `hiveMind.send.enter()`, `hiveMind.send()`, etc.

### Also needed: hiveMind team.switch should switch monitor

When PO runs `hiveMind team.switch <team>`, that should also call `tronMonitor switch <team>`.

## Test requirements

1. `hiveMind task oosh-expert "test"` on UpDown_ai_projectTeam → monitor shows UpDown_ai_projectTeam
2. `hiveMind team.switch hiveMindTeam02_03_26` → monitor shows hiveMindTeam02_03_26
3. `hiveMind monitor oosh-expert` → monitor shows correct team
4. Auto-switch only happens if tronMonitor is set up (don't error if no screen)

## OOSH rules

- camelCase for ALL variables
- Positional args only, NEVER --flags
- Use OOSH wrappers only
- `2>/dev/null` OK on the tronMonitor call (graceful if monitor not set up) — but NOT on any other output

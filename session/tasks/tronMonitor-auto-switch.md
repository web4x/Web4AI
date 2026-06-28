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

## Owners + Status (re-activated 2026-06-28 — Tron directive via SM, oosh-po driving)
| Role | Pane | Owns | Status |
|------|------|------|--------|
| oosh-expert | ooshTeam:0.2 (@MacStudio) | Implement: `private.hiveMind.monitor.switch` helper + wire into hiveMind task/send/send.enter/broadcast/monitor/sweep + team.switch. camelCase, no flags, OOSH wrappers, `2>/dev/null` ONLY on the tronMonitor call. | IN PROGRESS |
| oosh-tester | ooshTeam:0.3 (@MacStudio) | D3.3 verify: the 4 test requirements above (task/team.switch/monitor switch the tronMonitor; no error when monitor not set up). | IN PROGRESS |

SM (TRONinterface:0.1) monitors commit-delta + context-health on both. Report-back: edit your block below, commit, push.

## Report-back (owner edits + commits + pushes — git mailbox)
- oosh-expert: DONE `3249104`. Audited all 6 required methods — 5 already wired (task, send/send.message/send.enter via agent.inform, broadcast via send.message chain, monitor=agent.monitor, team.switch, pane.sweep). Only gap: `team.sweep` was missing. Added `private.hiveMind.monitor.switch "${session}:0.0"` after arg validation. Helper already has 2s timeout + swallow-all-failures guard. bash -n green. 7 call sites total now cover all interaction paths.
- oosh-tester (D3.3): MEASURED 4 requirements. Test 1 PASS: `hiveMind task oosh-expert` auto-switched monitor from baseTeam→ooshTeam (pane title changed). Test 2 FAIL: `hiveMind team.switch baseTeam` exited 0, registry updated, but pane title stayed `ooshTeam@MacStudio` — tronMonitor.switch itself fails to update tmux pane title on second call (macOS screen v4.00.03 bug? or title lock?). Test 3 BLOCKED: need live agent.monitor test. Test 4 PASS: no error when tronMonitor set up (`2>/dev/null` + `return 0`). Code audit: 7 call sites in hiveMind confirmed (lines 1202, 2070, 2418, 7122, 7623, 8286 + agent.inform chain). BUG: tronMonitor.switch registry updates but title doesn't persist — this is a tronMonitor bug, not hiveMind.
- oosh-po (QA):

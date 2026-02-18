# Context Monitoring Validation

**By**: ossh-tester (task-agent, pane 1.2)
**Date**: 2026-02-18 (updated 21:25Z)
**Task**: `session/tasks/20260218T1251Z.task.md`

## Method

Captured 5 agent panes at two depths (5 lines and 15 lines) to check if context % is visible via `otmux pane.capture`.

## Results — Round 2 (21:25Z, post-standdown)

| Pane | Agent | Context % Visible? | Status Bar Content |
|------|-------|--------------------|-------------------|
| 0.1 | oosh-expert | **NO** | `19 files +206 -252` — stood down, healthy |
| 0.5 | agent-trainer | **YES — 5%** | `Context low (5% remaining) · Run /compact to compact & continue` |
| 1.0 | woda-writer | **NO** | `2 bashes · esc to interrupt · ctrl+t to hide tasks` — active, healthy |
| 1.3 | developer | **NO** | Permission prompt visible, no context indicator |
| 1.4 | script-PO | **NO** | `19 files +206 -252` — stood down, healthy |

## Results — Round 1 (13:00Z, all agents active)

| Pane | Agent | Context % Visible? | Status Bar Content |
|------|-------|--------------------|-------------------|
| 0.1 | oosh-expert | **NO** | `12 files +20 -7` |
| 0.5 | agent-trainer | **NO** | `12 files +20 -7` |
| 1.0 | woda-writer | **PARTIAL** | `62.9k tokens` in spinner, no % |
| 1.3 | developer | **NO** | `12 files +20 -7` |
| 1.4 | script-PO | **NO** | `12 files +20 -7` |

## Confirmed Findings

1. **Context % only appears when LOW.** Round 1 (all healthy): 0/5 showed %. Round 2 (trainer at 5%): 1/5 showed %. This confirms the expert's finding.

2. **The indicator format**: `Context low (X% remaining) · Run /compact to compact & continue` — appears in the status bar (last 1-2 lines of pane).

3. **5 lines is sufficient** to capture the status bar indicator when present.

4. **Absence of indicator = healthy.** No way to distinguish 50% from 90% — only the critical low-context state is detectable.

5. **Pattern to grep**: `Context low` or `Context low ([0-9]+% remaining)`

## Reliability Assessment

| Use Case | Reliable? | Notes |
|----------|-----------|-------|
| Detect LOW context (critical alerts) | **YES** | Consistently visible in status bar when low |
| Measure EXACT context % | **NO** | Only shows when low, not when healthy |
| SM sweep monitoring | **YES** | Binary detection (low/healthy) is sufficient for the primary use case |

## Recommendation

SM sweep protocol:
1. Capture last 5 lines of each pane
2. `grep "Context low"` on output
3. If found → extract %, trigger save/compact based on severity
4. If NOT found → agent is healthy (>~10% context)

This is **CMM3-sufficient**: deterministic detection of the critical condition.

## Cross-Reference

Expert findings: `session/knowledge-base/context-monitoring-findings.md`

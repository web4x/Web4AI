# Task: Build hiveMind agent.context.status

**From**: product-owner (Tron directive)
**To**: oosh-expert (spec + implement), oosh-tester (test), agent-trainer (coordinate)
**Priority**: HIGH — base-level fractal prerequisite
**Task #**: 47
**Date**: 2026-02-22

---

## Goal

Create `hiveMind agent.context.status` — a reliable tool that reports context % for all agents in a team session. This replaces manual /context measurement with a deterministic, repeatable command.

## Why

Manual context measurement is CMM1. Every compact this session required manual /context → capture → parse → assess. This tool makes it CMM3: same input → same output, anyone can run it.

## The "42" Process (the reliable base)

The ONLY reliable way to get context % is:
1. Send `/context` to an **idle** agent pane
2. Wait for output to render
3. Capture the pane output
4. Parse the token line: `claude-opus-4-6 · 63k/200k tokens (31%)`

`claudeCode.context.read` exists (line 1010) but is unreliable — uses JSONL data that's stale/wrong. **Do NOT use it.** Build on the native `/context` process.

## Existing Code to Build On

### In `/Users/donges/oosh/claudeCode`:
- **Line 898**: `private.claudeCode.context.parse()` — parses percentage from captured pane content. Has 3 pattern matches. Start here for parsing logic.
- **Line 1010**: `claudeCode.context.read()` — reads from JSONL (unreliable). The TUI fallback path may be useful.

### In `/Users/donges/oosh/hiveMind`:
- Add new method `hiveMind.agent.context.status()`
- Uses `hiveMind role.list` or `/tmp/hivemind.roles` for agent discovery
- Uses `otmux send` + `otmux pane.capture` for the /context cycle

## Specification (expert refines this)

```
hiveMind agent.context.status [session]
```

**For each registered agent**:
1. Check if pane is idle (capture, check for `❯` at bottom)
2. If idle: send `/context`, wait 5s, capture 30 lines
3. Parse: model, tokens used/total, percentage
4. If busy: report "BUSY — skip" (don't disrupt working agents)
5. If self: report "SELF — cannot measure (42 principle)"

**Output format**:
```
Agent Context Status — projectTeam
──────────────────────────────────────────
agent-trainer    0.5    31%   63k/200k   OK
oosh-expert      0.1    40%   79k/200k   OK
product-owner    0.4    BUSY  —          skip
oosh-tester      0.2    IDLE  —          not running
──────────────────────────────────────────
Alerts: product-owner BUSY (retry when idle)
```

**Thresholds** (from team protocol):
- > 50%: OK
- 35-50%: WARN — save context soon
- 25-35%: CRITICAL — prepare for compact
- < 25%: DANGER — compact NOW

## Edge Cases (tester must cover)

1. **Idle pane** — sends /context, gets result, parses correctly
2. **Busy pane** — detects activity, skips without disruption
3. **Self pane** — detects own pane, reports "42 principle"
4. **Empty pane** — no agent running, clean report
5. **Pane with garbled output** — parser handles gracefully
6. **Multiple sessions** — works with session name parameter
7. **Completion** — `hiveMind agent.context.status.completion()` exists

## Team Roles

| Who | Does what |
|-----|-----------|
| **oosh-expert** | Refine spec, decide architecture, implement in hiveMind + claudeCode. You OWN both scripts. |
| **oosh-tester** | Write tests for all 7 edge cases. Test before AND after implementation. |
| **agent-trainer** | Coordinate: send task to expert + tester, monitor context %, manage compacts if needed. |

## Expert: Your Call

You are the OOSH principle guardian. This spec is a starting point — you decide:
- Where exactly to add the method (hiveMind vs claudeCode vs both)
- How to detect idle vs busy (capture analysis? process check?)
- Whether to improve `private.claudeCode.context.parse()` or rewrite
- Whether to add `claudeCode context.print` as a lower-level primitive
- Completion system integration

PO gives the goal. You write the spec. You implement. Tester tests.

## Git Rules
- NO git rebase. Ever.
- Commit early, commit often.
- Nothing exists until committed with a hash.

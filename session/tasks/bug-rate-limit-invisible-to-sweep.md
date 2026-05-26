# BUG — rate-limited agents invisible to sweep (state-transition detection needed)

**Reporter**: Tron via PO (ooshTeam:0.0) 2026-05-26
**Status**: QUEUED — investigated after otmux-layout-dynamic
**Assignee**: oosh-expert

## Symptom

When a Claude agent hits a rate limit:
1. TUI briefly shows rate-limit message
2. Agent transitions to IDLE prompt
3. By next sweep cycle, the rate-limit message has scrolled off
4. `sweep.detect` (via `pane.capture` 15-30 lines) sees only the IDLE state
5. Sweep reports IDLE — operator sees "agent waiting" when really "agent stuck"

## Root cause

`private.hiveMind.sweep.detect` classifies based on a single snapshot. There's no memory of previous state. ACTIVE→IDLE without forward progress (commit, file change, response delivery) is suspicious — likely silent failure.

Possible mitigations (need design):

1. **Wider pane.history**: capture last N lines (e.g. 200) instead of visible-area. Scan for `rate-limit|429|quota` markers in the history.
2. **State-transition tracking**: store previous state per pane, flag ACTIVE→IDLE transitions without observable forward progress (commit, file mtime, pane title change).
3. **Time-anchored detection**: if last activity timestamp is recent but state is IDLE, look harder.

## Hypothesis to verify

Option 1 (wider history scan) is likely sufficient — rate-limit messages are unique enough strings. Option 2/3 add complexity. Start with 1, escalate if false-negatives persist.

## Investigation plan

1. Read `private.hiveMind.sweep.detect` — current capture depth + state classifier
2. Reproduce: trigger a rate limit on a test agent, observe TUI message wording, measure how long it stays visible
3. Identify rate-limit signature strings (search Claude Code source / changelog if accessible, otherwise observe)
4. Design wider-history scan with conservative match (must contain "rate limit" or known error patterns to avoid false positives)

## Findings

(filled during investigation)

## Fix

(filled after diagnosis)

## Commit

(filled after fix)

## Status

QUEUED — implementation starts after otmux-layout-dynamic ships.

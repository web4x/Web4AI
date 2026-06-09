# Bug: otmux send Enter intermittently fails to submit — agents stall silently

**Priority**: CRITICAL
**Date**: 2026-06-10
**From**: robbin-po (cross-team report, hit repeatedly on robbinTeam)

## Problem

`otmux send <pane> "text" Enter` INTERMITTENTLY types text into Claude Code TUI but does NOT submit. Agent stalls with staged/unsent input. SM idle-catches it but PO must manually retrigger.

## Symptoms

1. `otmux send <pane> "text" Enter` — text appears at `❯` prompt but Enter doesn't submit
2. `otmux send <pane> Enter` (bare) — does NOT flush already-staged text
3. Pane shows `❯ <staged text>` with NO "esc to interrupt" (= not submitted)
4. Agents silently stall mid-pipeline

## Workaround (reliable)

```bash
otmux send <pane> C-u          # clear line first
otmux send <pane> "text" Enter # then send fresh
```

This works because C-u clears any leftover input state before the new text arrives.

## Root Cause Candidates

1. **Timing**: text and Enter arrive too close together — TUI processes Enter as newline inside multi-line input, not as submit
2. **Autocomplete dropdown**: TUI shows autocomplete suggestions, Enter selects completion instead of submitting
3. **Accept-edits mode**: the smart send checks for accept-edits but may not handle all TUI states
4. **Buffer state**: previous unsent text still in input buffer, new text appends instead of replacing

## Fix Options

### A: send.submit / send.flush verb
New method that: C-u (clear) → type text → small delay → Enter. Deterministic.

### B: Fix otmux.send to always C-u before text
The smart send already does C-u for Claude Code panes (line 1044 in otmux). But only inside the isClaudeCode guard. If the detection fails, C-u is skipped.

### C: Double-Enter with delay
Send text, wait 100ms, send Enter, wait 100ms, send Enter again. Catches both autocomplete and submit cases.

## Acceptance Criteria

- [ ] `otmux send <pane> "text"` deterministically submits to Claude Code TUI
- [ ] No silent stalls — if submit fails, error is reported
- [ ] Works across: idle prompt, post-rate-limit, post-completion, post-rewind states
- [ ] Existing send.verified checks still work
- [ ] Tested on ooshTeam AND robbinTeam agents

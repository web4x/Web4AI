# Task 52: Research claudeCode context.read unreliable readings

**Assigned to**: Tester (cursorOrchestrator:0.5) — RESEARCH ONLY
**Priority**: High — blocks CMM4 burn rate tracking

## Problem

`claudeCode context.read` reports "above-threshold" at 12%, gives inconsistent numbers (20% then "above-threshold" in same session). This breaks velocity/health measurement.

## Research Steps

1. Read `components/OOSH/dev.claude/claudeCode` — find the `context.read` method
2. Understand how it extracts context percentage from Claude Code TUI
3. Check what "above-threshold" means — is it a parsing failure? A fallback?
4. Look at the TUI status bar format — what does it actually display at low context?
5. Test by capturing a real pane's status bar: `tmux capture-pane -t cursorOrchestrator:0.4 -p -S -1` and examine what context info is visible
6. Check if the TUI format changes at different context levels (does it switch from "X%" to words?)

## Do NOT
- Modify any code — this is research only
- Interact with claudeWoda panes

## Report
Send findings to SM at pane 0.6: what the root cause is and what fix you recommend.

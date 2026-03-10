# Task 30 — Fix Enter Submission Issue

**Created**: 2026-02-04T15:07Z
**Status**: Done (commit 064c184, pushing to origin)
**Priority**: High
**Requested by**: Product Owner (via Orchestrator)
**Assigned to**: oosh-expert, oosh-tester

## Original Directive (verbatim)

> When sending prompts to agent panes via `./otmux send <pane> 'text' Enter`, the text lands in the Claude Code input bar but Enter does NOT submit it. This happens consistently across ALL panes. The Orchestrator and SM have to send a second `Enter` every time.

## Problem

`./otmux send <pane> 'text' Enter` delivers text to the Claude Code TUI input bar, but the Enter keystroke does not trigger submission. Every agent communication requires a follow-up Enter, causing delays and stalls across the team.

## Root Cause Investigation Needed

- Is it a timing issue? (text arrives, Enter arrives before text is rendered)
- Is it a Claude Code TUI issue? (Enter key handled differently when input bar has content)
- Does `./otmux send.enter` (which uses `-l` flag) behave differently from `./otmux send ... Enter`?
- Does adding a `sleep 0.1` between text and Enter fix it?

## Headline Plan

| Step | Agent | Action |
|------|-------|--------|
| 1 | oosh-expert | Investigate root cause: timing, `-l` flag behavior, TUI input handling |
| 2 | oosh-expert | Test fix candidates: sleep delay between text and Enter, send.enter method, separate send calls |
| 3 | oosh-expert | Implement fix in otmux send method |
| 4 | oosh-tester | Validate: single `./otmux send <pane> 'text' Enter` submits on first attempt across all panes |

## Acceptance Criteria

- [ ] `./otmux send <pane> 'text' Enter` submits prompt on first attempt
- [ ] Works across all pane types (Claude Code TUI, bash, zsh)
- [ ] No second Enter needed
- [ ] No regression in other otmux send functionality
- [ ] Root cause documented

# ISSUES FOUND: UUID Resolution, Session Picker, and Ground Truth Gaps

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert AND hiveMind-tester
**Priority**: HIGH — these are real bugs discovered during otmuxTeam setup
**Date**: 2026-03-11

## Context

I just set up **otmuxTeam** (otmux-expert@opus + otmux-tester@opus) by forking backup-expert and backup-tester. The process exposed multiple bugs and gaps that need hiveMind tests and possibly hiveMind/otmux fixes.

## NEW TEAM: otmuxTeam

A new team is now live:
- **otmuxTeam:0.0** = otmux-expert@opus (forked from backup-expert)
- **otmuxTeam:0.1** = otmux-tester@opus (forked from backup-tester)

Their job: ground-truth testing of otmux methods against raw tmux. Interact with them for otmux-related issues. They are your counterpart team for otmux work.

---

## Issue 1: `claudeCode session.id` and `otmux tree.detailed` Return STALE UUIDs

### What happened
`otmux tree.detailed` showed backup-expert with UUID `[124ac722]` and backup-tester with `[d45f08a4]`. I used these to fork. `claudeCode fork 124ac722-ac97-40eb-b3d7-5642a17d4d5d` opened the session picker instead of forking — UUID was unknown.

### Root cause
After an agent compacts or restarts, it gets a NEW session UUID. But `otmux tree.detailed` still shows the OLD UUID from the previous session. `claudeCode session.id <pane>` returned the same stale UUID.

### Ground truth
The ONLY way to get the REAL current UUID is to ask the agent: `/status` → shows "Session ID: a552f5ac-b8bf-4032-b8db-767c5e0b26d0" (the actual ID). This was different from what otmux and claudeCode reported.

### What needs testing
1. **Test**: Compare `claudeCode session.id <pane>` output against agent's `/status` Session ID after a compact. Do they match?
2. **Test**: Compare `otmux tree.detailed` UUID display against agent's `/status` after compact. Does it update?
3. **Test**: After agent compacts, does the live-fact discovery chain (tmux pane → PID → UUID) resolve to the NEW or OLD UUID?
4. **Fix needed**: If `claudeCode session.id` and `otmux tree.detailed` can't detect the UUID changed, they should at minimum report "possibly stale" or validate the UUID still exists.

## Issue 2: `claudeCode fork` Opens Session Picker Instead of Forking

### What happened
`claudeCode fork <uuid>` (with both short and full UUID) opened the interactive session picker (search UI with "Ctrl+B to toggle branch, Ctrl+V to preview"). It did NOT directly fork. The picker searched for the UUID but seemed unable to select it automatically.

### Root cause
When the UUID is unknown to Claude Code (because the session was already replaced), `claude --resume <id> --fork-session` falls through to the interactive picker. The `claudeCode` wrapper doesn't detect this failure mode.

### What needs testing
1. **Test**: `claudeCode fork <valid-uuid>` — does it fork directly without picker? (baseline)
2. **Test**: `claudeCode fork <stale-uuid>` — does it gracefully error or silently open the picker?
3. **Test**: `claudeCode fork <short-uuid>` (8 chars) — same behavior?
4. **Fix needed**: `claudeCode fork` should detect the picker opening (= UUID not found) and return a clear error: "Session UUID not found. Use /status on the agent to get its current UUID."

## Issue 3: `otmux send` Swallows First Character of Long Commands

### What happened
Sent `claudeCode fork a552f5ac-b8bf-4032-b8db-767c5e0b26d0` via `otmux send otmuxTeam:0.0`. The pane received `laudeCode fork a552f5ac-...` — missing the `c`. Error: `bash: laudeCode: command not found`.

### Root cause
The otmuxTeam panes are narrow (split side-by-side). The long command exceeds pane width. Something in the send path — possibly a timing issue or a buffer wrap — consumes the first character.

### What needs testing
1. **Test**: `otmux send <narrow-pane> "longcommand..."` — reproduce the first-char-eaten bug
2. **Test**: Same command to a wide pane — does it work?
3. **Test**: Sending an empty line first, then the command — does that fix it? (It did for me)
4. **Test**: Various command lengths at different pane widths — find the threshold
5. **Fix needed**: `otmux send` should handle narrow panes without dropping characters. Maybe it needs to use `send-keys` differently or handle line wrapping.

## Issue 4: Phantom Panes — Still Open

### Status
The projectTeam phantom panes bug (7 panes shown, only 1 exists) was already reported. Tron confirmed: trust visual reality, not tmux metadata. This is STILL the primary ground-truth issue.

### What the otmuxTeam needs from you
The otmux-tester needs test patterns from you (hiveMind-tester) for comparing:
- Raw `tmux list-panes` output vs `otmux` tree output
- Raw `tmux send-keys` + `tmux capture-pane` vs `otmux send` + `otmux pane.capture`
- Process existence checks (PID alive?) vs metadata claims

Coordinate with otmuxTeam:0.1 (otmux-tester@opus) on shared test infrastructure.

## Issue 5: `otmux split.h` Silently Fails

### What happened (from earlier session)
`otmux split.h otmuxTeam:0.0` ran without error but didn't create a pane. Had to use raw `tmux split-window -h -t otmuxTeam:0.0` (Tron allowed once). This is a reliability issue.

### What needs testing
1. **Test**: `otmux split.h <target>` for various session:window.pane targets
2. **Test**: Does it work for attached sessions? Detached?
3. **Test**: Compare `otmux split.h` result with raw `tmux split-window -h` result

---

## Summary for hiveMind-tester

You need **ground truth comparison tests** for:

| Test Category | Raw tmux | OOSH wrapper | Compare |
|---|---|---|---|
| UUID resolution | `tmux list-panes -F "#{pane_pid}"` → find claude process → extract --resume arg | `claudeCode session.id <pane>` and `otmux tree.detailed` | Do they agree? Are they current? |
| Pane existence | `tmux list-panes -t <session>` count | `otmux` tree pane count | Do they agree? Are phantom panes in either? |
| Send reliability | `tmux send-keys -t <pane> "text" Enter` | `otmux send <pane> "text" Enter` | Does the full text arrive? First char intact? |
| Capture accuracy | `tmux capture-pane -t <pane> -p` | `otmux pane.capture <pane> N` | Same content? |
| Split creation | `tmux split-window -h -t <pane>` | `otmux split.h <pane>` | Both create a pane? |
| Fork session | Check session exists after `claudeCode fork` | Check picker doesn't open | Direct fork vs picker fallback |

Write these as `test.suite` test cases in `test/test.hiveMind` or coordinate with the otmux-tester for `test/test.otmux`.

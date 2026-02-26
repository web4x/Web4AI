# Bugs Found During PDCA-1.2 Setup

**Date**: 2026-02-26
**Reporter**: PO (product-owner)
**Context**: Setting up backupTeam during PDCA-1.2 execution

---

## BUG-1: hiveMind agent.bootstrap creates pane in ACTIVE team, not REGISTERED team

**Severity**: HIGH
**Affects**: `hiveMind agent.bootstrap`

**Observed**: `hiveMind agent.bootstrap backup-expert` created pane `projectTeam:0.7` and registered it there, even though `backup-expert` was already registered at `backupTeam:0.0` in roles.env.

**Expected**: Bootstrap should check roles.env first and use the registered pane/session for the role. If a role is registered at `backupTeam:0.0`, the bootstrap should start claude there, not create a new pane in the active team.

**Impact**: Violated Tron's "do not touch projectTeam" directive. Required manual cleanup (kill process, remove roles.env entry, manual claude start).

**Workaround**: Manually start claude in the correct pane with `unset CLAUDECODE && claude`.

---

## BUG-2: Claude Code cannot start in tmux panes due to CLAUDECODE env var

**Severity**: MEDIUM
**Affects**: Any tmux-based agent bootstrapping

**Observed**: `claude` command in a tmux pane created by PO's Claude Code session inherits the `CLAUDECODE` environment variable. This triggers the nested session detection:
```
Error: Claude Code cannot be launched inside another Claude Code session.
```

**Expected**: tmux sessions should be independent environments. New panes in tmux should not inherit the parent Claude Code session's env vars.

**Workaround**: `unset CLAUDECODE && claude` before starting.

**Fix suggestion**: The `hiveMind agent.bootstrap` function should unset CLAUDECODE before launching claude, or use `env -u CLAUDECODE claude` in the send command.

---

## BUG-3: hiveMind send does not deliver to agents (intermittent)

**Severity**: MEDIUM
**Affects**: `hiveMind send`

**Observed**: `hiveMind send oosh-expert "Read session/tasks/..."` did not deliver the text to the prompt at projectTeam:0.2. The prompt remained empty. Direct `otmux send projectTeam:0.2 "..." Enter` worked.

**Possible cause**: hiveMind send may not append Enter (known INC-004, DRY fix planned for Phase B). But even the text didn't appear at the prompt — suggesting the pane address resolution or send mechanism has an issue.

**Note**: This may be related to the "accept edits" UI state in Claude Code.

---

## BUG-4: oosh-expert context exhaustion on first task

**Severity**: LOW (design issue)
**Affects**: Fresh Claude Code sessions with many skills loaded

**Observed**: Fresh oosh-expert session at projectTeam:0.2 had skill list consuming ~95% of context. Reading task file + plan + hiveMind sections exhausted remaining 5%. Agent never got to enter plan mode.

**Root cause**: Claude Code loads all configured skills into context at startup. With 200+ skills configured, this leaves very little room for actual work.

**Impact**: Agent was useless after a single file read. /compact failed ("Conversation too long").

**Workaround**: /clear and send a more focused task. Long-term: reduce skill count or use skill-on-demand loading.

---

## BUG-5: /compact fails at 0% context ("Conversation too long")

**Severity**: MEDIUM
**Affects**: Claude Code compaction

**Observed**: At 0% remaining context, `/compact` returned:
```
Error: Error during compaction: Error: Conversation too long.
Press esc twice to go up a few messages and try again.
```

**Expected**: /compact should work at any context level — it's the recovery mechanism for low context.

**Workaround**: /clear (but loses all context).

---

## BUG-6: Pre-compact hook misidentifies agent role

**Severity**: LOW (known, tracked as #48)
**Affects**: Pre-compact hook agent identity detection

**Observed**: After oosh-expert compacted (or tried to), the auto-resume hook sent `Read session/agents/oosh-tester/boot.md` (wrong role — should be oosh-expert).

**Tracked**: Task #48 (Fix pre-compact hook for cross-session agent identity)

---

## BUG-7: otmux and hiveMind missing FORCE_COLOR env var fix

**Severity**: MEDIUM
**Affects**: `otmux`, `hiveMind` — any agent bootstrapping via these scripts

**Observed**: Claude Code instances started manually via `claude` in tmux panes have broken/unreadable colors. The `claudeCode` OOSH script has the fix (`export FORCE_COLOR=2; unset COLORTERM`) but `otmux` and `hiveMind` do not apply these env vars when launching claude processes.

**Expected**: Any script that starts Claude Code (otmux, hiveMind agent.bootstrap, etc.) should set the same color env vars as `claudeCode`.

**Fix**: Add `export FORCE_COLOR=2; unset COLORTERM` to otmux send and hiveMind agent.bootstrap before launching claude.

---

## BUG-8: claudeCode without args starts claude instead of showing usage

**Severity**: LOW
**Affects**: `claudeCode` script

**Observed**: Running `claudeCode` with no arguments launches a claude instance instead of showing method list/usage. OOSH convention is that scripts without args show usage.

**Expected**: `claudeCode` (no args) should show `claudeCode.usage()` output. Starting claude should require an explicit method like `claudeCode new` or `claudeCode chat`.

---

## BUG-9: claudeCode session completion uses wrong/outdated UUIDs

**Severity**: MEDIUM
**Affects**: `claudeCode` tab completion for session IDs

**Observed**: Session IDs `d45f08a4-fdcf-42e9-afc5-e1f8ba874f4f` and `124ac722-ac97-40eb-b3d7-5642a17d4d5d` could not be completed correctly. Completion appears to use wrong, outdated, or hardcoded UUIDs instead of discovering live sessions.

**Expected**: Session completion should dynamically list current session UUIDs from `~/.claude/projects/` or the running claude processes.

---

## BUG-10: claudeCode session.id returns stale/wrong pane-to-session mapping

**Severity**: HIGH
**Affects**: `claudeCode session.id <pane>`

**Observed**: `claudeCode session.id projectTeam:0.5` returned `0f0755a8` (scrum-master session) when the pane label showed "agent-trainer". The tree.detailed view showed different session assignments than session.id returned. Led to resuming wrong sessions twice.

**Expected**: `claudeCode session.id` should match what `otmux tree.detailed` shows for the same pane.

---

## BUG-11: claudeCode join should handle cd to project directory

**Severity**: LOW
**Affects**: `claudeCode join`

**Observed**: `claudeCode join <uuid>` in a pane at `~` (home dir) returned "No conversation found" because the session belonged to a different project directory. Had to manually `cd /Users/Shared/Workspaces/AI/Claude` first.

**Expected**: `claudeCode join` should either auto-detect the project directory from the session metadata or accept a `--dir` flag.

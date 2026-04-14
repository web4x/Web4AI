# Task: Fix claudeCode list — unusable due to 13k+ garbage entries

**From**: OOSH PO (TRONinterface:0.0 on McDonges)
**To**: UpDown_ai_projectTeam PO → delegate to claudeCode expert+tester
**Priority**: HIGH

## What Tron wants

`claudeCode list` should show only actual agent sessions — the ones you see via `/status` in Claude Code. Currently it dumps ~13k+ useless UUID lines before any real output, making the command unusable.

## The Diagnosis

### What `claudeCode list` does now (broken)

The `claudeCode.list()` function at line 104 of the `claudeCode` script iterates ALL directories under `~/.claude/projects/`, globs ALL `*.jsonl` files in each, and prints every one as a "session". This includes the `-` directory (catch-all for path `/`) which contains **13,543 `.jsonl` files**.

### Two kinds of .jsonl files exist

**1. Agent session transcripts (SHOW THESE)**
- Location: `~/.claude/projects/-Users-Shared-Workspaces-AI-Claude/*.jsonl` (~34 files)
- First line: `{"type":"file-history-snapshot",...}`
- These are actual Claude Code agent sessions — the UUID matches what `/status` shows
- Many also have a companion UUID **directory** alongside (containing `tool-results/` and `subagents/`)

**2. Queue operation logs (SKIP THESE — this is the garbage)**
- Location: `~/.claude/projects/-/*.jsonl` (13,543 files!)
- First line: `{"type":"queue-operation","operation":"enqueue","sessionId":"...","content":"."}`
- Created every time a prompt is sent to an agent pane via `hiveMind send.enter`, `otmux send`, etc.
- NOT agent sessions. Just one-shot prompt delivery logs.
- The `-` directory is Claude Code's catch-all for the `/` path

### Why 13k+ files?
Every `hiveMind send.enter` and `otmux send` that delivers a prompt to an agent pane creates a throwaway `.jsonl` in `~/.claude/projects/-/`. With dozens of agents getting hundreds of messages each over weeks, this adds up to 13k+ files.

## The Fix

In `claudeCode.list()`, **filter out queue-operation files**. Simplest approach — add after line 122 (`[ -f "$f" ] || continue`):

```bash
# Skip queue-operation files — they're prompt delivery logs, not sessions
local firstLine
firstLine=$(head -1 "$f" 2>/dev/null)
[[ "$firstLine" == *'"type":"queue-operation"'* ]] && continue
```

Alternatively or additionally, skip the `-` project directory entirely:
```bash
# After line 104: [ ! -d "$projectDir" ] && continue
[ "$(basename "$projectDir")" = "-" ] && continue
```

## Verification

```bash
# Before fix: takes minutes, 13k+ lines of garbage
claudeCode list

# After fix: completes in <1 second, shows ~30 actual sessions
claudeCode list

# Verify no real sessions are missing — compare with:
ls ~/.claude/projects/-Users-Shared-Workspaces-AI-Claude/*.jsonl | wc -l
```

## Bonus: Cleanup command

Consider adding `claudeCode cleanup` that deletes queue-operation `.jsonl` files from `-/` older than N days. These files serve no purpose and waste disk.

## Deliver

1. Expert implements the fix in `claudeCode` script
2. Tester verifies `claudeCode list` output is clean and fast
3. Commit, push to test/macos.latest
4. Report back to OOSH PO (TRONinterface on McDonges) with commit hash

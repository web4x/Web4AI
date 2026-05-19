# BUG: team.pull uses raw scp without ossh ControlPath — asks password per file

**From**: product-owner@opus (TRONinterface:0.0)
**To**: hiveMind-expert, hiveMind-tester
**Priority**: HIGH — Tron reports this is annoying and unproductive
**Date**: 2026-03-25

## Problem

`hiveMind team.pull <host>` correctly opens a persistent SSH connection via `ossh connection.open` (line 1933). But then ALL the scp transfers (lines 1944-1946, 1952, 1975) use **raw `scp`** without passing the ControlPath. Each scp opens a fresh connection and asks for a password.

With a snapshot containing N agents, that's 3 config files + 1 snapshot + N JSONL files = password prompt for EVERY file.

## Root cause

```bash
# Line 1933 — CORRECT: uses ossh
"$OOSH_DIR/ossh" connection.open "$host"

# Lines 1944-1946 — WRONG: raw scp, no ControlPath
scp "$host:~/config/hivemind.roles.env" "$pullDir/..."
scp "$host:~/config/hivemind.sessions.env" "$pullDir/..."
scp "$host:~/config/hivemind.teams.env" "$pullDir/..."

# Line 1975 — WRONG: raw scp per JSONL
scp "$host:$remotePath" "$remotePath"
```

Meanwhile `ossh exec` (line 1446) correctly passes `-o ControlPath="$OSSH_CONTROL_PATH"`. The scp calls just forgot this.

## Fix options

### Option A (minimal): Add ControlPath to scp calls
Replace every `scp "$host:..."` with:
```bash
scp -o ControlPath="$OSSH_CONTROL_PATH" "$host:..." "$localPath"
```
This reuses the persistent connection opened by `ossh connection.open`.

### Option B (OOSH-proper): Create ossh.scp or ossh.file.copy method
Add a proper OOSH method to ossh:
```bash
ossh.scp() # <host> <remotePath> <localPath> # copy file from remote using persistent connection
{
  scp -o ControlPath="$OSSH_CONTROL_PATH" -o StrictHostKeyChecking=accept-new "$1:$2" "$3"
}
```
Then team.pull uses `"$OOSH_DIR/ossh" scp "$host" "$remotePath" "$localPath"` — consistent with the OOSH wrapper pattern.

### Option C (best): Batch transfer
Instead of N separate scp calls, use rsync or a single tar pipe:
```bash
ssh -o ControlPath="$OSSH_CONTROL_PATH" "$host" "tar cf - file1 file2 ..." | tar xf - -C "$localDir"
```
One connection, all files at once.

## Also review

1. Re-read the entire hiveMind script — you may have other places using raw scp/ssh without ControlPath
2. The `teams.migrate` method (around line 5277) — does it have the same bug?
3. Any other method that transfers files between machines

## OOSH rules reminder

- NEVER use raw system commands where an OOSH wrapper exists
- If no wrapper exists, CREATE one (ossh.scp) — don't scatter raw scp calls
- camelCase for variables, positional args only, no --flags

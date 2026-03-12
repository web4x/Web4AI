# Coordination: hiveMind-tester → otmux-tester

**From**: hiveMind-tester (hiveMindTeam02_03_26:0.1)
**To**: otmux-tester (otmuxTeam:0.1)
**Date**: 2026-03-11

## Context

PO found 5 bugs during otmuxTeam setup. I've written ground truth comparison tests in `test/test.hiveMind` (T-TRUTH-1..10, commit 082e73e). Issues 3 and 5 are in YOUR territory (otmux). Issues 1, 2, 4 are in mine (hiveMind/claudeCode).

## What I Need From You

### Issue 3: `otmux send` Drops First Character in Narrow Panes

My T-TRUTH-4 and T-TRUTH-5 test this with echo markers in fixture sessions (40-col and 200-col). But the real reproduction requires a Claude agent in a narrow pane. The PO observed:
- Sent `claudeCode fork a552f5ac-...` via `otmux send otmuxTeam:0.0`
- Pane received `laudeCode fork a552f5ac-...` — missing the `c`
- Error: `bash: laudeCode: command not found`

**Please write `test/test.otmux` tests that**:
1. Send a known string to panes of various widths (20, 40, 80, 200 cols)
2. Capture and verify the first character is intact
3. Test with short and long commands to find the threshold
4. Test the workaround: send empty line first, then the command

### Issue 5: `otmux split.h` Silently Fails

My T-TRUTH-7..9 test `otmux split -h` and `otmux split.h` with fixture sessions. The PO reported `otmux split.h otmuxTeam:0.0` did nothing — had to use raw `tmux split-window -h`.

**Please write `test/test.otmux` tests that**:
1. Compare `otmux split.h <target>` against raw `tmux split-window -h -t <target>`
2. Test on attached vs detached sessions
3. Verify pane count increases after split
4. Test `otmux split` (vertical) as control

### Shared Test Infrastructure

I use fixture sessions named `__test_*_$$` with teardown. You can use the same pattern. The ground truth helper I wrote:

```bash
# Get real --resume UUID from a Claude process by pane
truth.get.uuid() {
  local pane="$1"
  local shellPid=$(tmux display-message -t "$pane" -p '#{pane_pid}')
  local claudePid=$(pgrep -P "$shellPid" | while read cpid; do
    pgrep -P "$cpid"; done | while read g; do
    ps -p "$g" -o comm= | grep -q claude && echo "$g"; done | head -1)
  [ -z "$claudePid" ] && return 1
  ps -p "$claudePid" -o args= | grep -oE '[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}' | head -1
}
```

## What I'm Working On

- T-TRUTH-1..2: session.id and tree.detailed vs process ground truth (CONFIRMED STALE for forked sessions)
- T-TRUTH-3: claudeCode fork with invalid UUID (session picker detection)
- T-TRUTH-6: Pane count raw tmux vs otmux (phantom pane detection)
- T-TRUTH-10: Capture accuracy comparison

## Known Bug Already Found

**session.id returns --resume arg, not actual session ID after fork.** Both otmuxTeam and claudeCodeTeam show the same UUIDs (a552f5ac, a79b35f1) because `--fork-session` reuses the source UUID in the `--resume` arg. The real new UUID is only available via `/status`.

# Bug #4: hiveMind send.message leaks into panes when resolve fails

[task:uuid:bug4-2026-04-30]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] implementing — commit 19fa1b7
  - [x] testing (live verified)
- [x] QA Review
- [x] Done

## Root cause

Two layered defects:

1. **`hiveMind.send.message`** captured `hiveMind.resolve` output and only checked
   `[ -z "$target" ]`. Per learnings — `error.log` writes to **stdout**, not stderr.
   When resolve failed, the error message landed in `$target` (non-empty), so the
   guard passed and a malformed target was forwarded to `otmux send`.
2. **`otmux.send` (and friends)** never validated the target format. `tmux send-keys
   -t "<garbage>"` silently falls back to the focused pane on bad targets, sending
   whatever text was supplied to wherever Tron happened to be looking.

The "digit leak" observed by Tron was the trailing characters of `hiveMind.resolve`'s
error.log line being delivered to a real pane.

## Fix

### `hiveMind.send` and `hiveMind.send.message`
Capture rc separately from the assignment, and reject anything that isn't a
`session:win.pane` target:
```bash
local target resolveRc
target=$(hiveMind.resolve "$name" 2>/dev/null)
resolveRc=$?
if [ $resolveRc -ne 0 ] || [ -z "$target" ]; then
  error.log "...cannot resolve '$name' (rc=$resolveRc)"
  return 1
fi
if ! [[ "$target" =~ ^[A-Za-z_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+$ ]]; then
  error.log "...resolve returned malformed target for '$name': '$target'"
  return 1
fi
```

### `otmux.send*` family
New helper `private.otmux.target.isPane <target>` matches:
- `^%[0-9]+$` — tmux pane id
- `^[A-Za-z_][A-Za-z0-9_.-]*:[0-9]+\.[0-9]+$` — session:win.pane
- Rejects anything containing whitespace/newlines (typical of captured error.log)

Applied to: `otmux.send`, `otmux.send.raw`, `otmux.send.key`, `otmux.send.verified`,
`otmux.send.enter`, `otmux.send.tui` (private.otmux.sendEnter / sendKeys).

## Live verification

```
$ hiveMind send.message nonexistent-agent 'should not leak'
ERROR> hiveMind.send.message: cannot resolve 'nonexistent-agent' in any team (rc=1)
RC=1                                  # clean abort, no leak

$ otmux send 'ERROR> garbage' 'hello'
ERROR> otmux.send: invalid pane target 'ERROR> garbage' — refusing to send
RC=1                                  # validator caught the malformed target
```

## Test handoff (tester)

Suggested test cases:
- `T-BUG4-1`: `hiveMind send.message <unknown>` → rc=1, no leak into any pane
- `T-BUG4-2`: `otmux send '' text` → rc=1
- `T-BUG4-3`: `otmux send 'noColon' text` → rc=1
- `T-BUG4-4`: `otmux send 'sess:0' text` (no `.pane`) → rc=1
- `T-BUG4-5`: `otmux send 'with space' text` → rc=1
- `T-BUG4-6`: `otmux send 'ooshTeam:0.2' text` → rc=0 (valid format passes)
- `T-BUG4-7`: `otmux send '%42' text` → format passes (tmux may reject if pane id missing — that's fine)

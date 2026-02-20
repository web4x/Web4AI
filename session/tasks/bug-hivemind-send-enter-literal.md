# Bug: hiveMind send includes "Enter" as literal text instead of keypress

**Severity**: HIGH — every agent hits this, causes messages to sit unsubmitted in prompts
**Found by**: PO + Tron, Feb 20 2026

## The Bug

When agents call:
```bash
hiveMind send oosh-expert "Read the task file" Enter
```

The agent expects "Enter" to submit the message. Instead, the recipient sees:
```
❯ Read the task file Enter
```

The word "Enter" is LITERAL TEXT, not a keypress.

## Root Cause

`hiveMind.send()` at line 758 in `/Users/donges/oosh/hiveMind`:

```bash
otmux send "$target" -l "$*"
```

The `-l` flag tells tmux `send-keys` to send everything as LITERAL characters. So `$*` = `"Read the task file Enter"` is sent as text. The `-l` flag prevents tmux from interpreting `Enter` as a keypress.

## The Working Alternative (unused)

`hiveMind.send.enter()` at line 766 works correctly:

```bash
otmux send.enter "$target" "$message"
```

This calls `otmux send.enter` which separates text from the Enter keypress. But NO agent uses `send.enter` — everyone uses `send` because it's the obvious method name.

## Required Fix

Make `hiveMind.send()` detect a trailing `Enter` argument and handle it as a keypress:

```bash
hiveMind.send() {
  local name="$1"
  shift

  # Check if last argument is a key name (Enter, Escape, etc.)
  local args=("$@")
  local last_arg="${args[${#args[@]}-1]}"
  local send_enter=false

  if [ "$last_arg" = "Enter" ]; then
    send_enter=true
    unset 'args[${#args[@]}-1]'
  fi

  local message="${args[*]}"

  local target
  target=$(hiveMind.resolve "$name")
  if [ $? -ne 0 ]; then
    return 1
  fi

  if [ "$send_enter" = true ]; then
    otmux send.enter "$target" "$message"
  else
    otmux send "$target" -l "$message"
  fi

  info.log "Sent to $name ($target): $message (enter=$send_enter)"
  return 0
}
```

## Why Not Just Always Send Enter?

There are cases where you send partial input without submitting:
- Typing into a search/filter
- Building multi-line input
- Sending just a keypress (`hiveMind send expert Escape`)

So the fix should be: detect the trailing `Enter` and treat it as a keypress, keep `-l` for the message body.

## Acceptance Criteria

1. `hiveMind send expert "message" Enter` → recipient sees "message" at prompt, Enter submits it
2. `hiveMind send expert "message"` → recipient sees "message" at prompt, NOT submitted (backward compatible)
3. `hiveMind send expert "message with Enter in it"` → literal text including "Enter" (quoted = literal)
4. No other tmux key names are affected unless explicitly listed

## Files to Change

- `/Users/donges/oosh/hiveMind` — `hiveMind.send()` function, line ~745-761

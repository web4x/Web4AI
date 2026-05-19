# Task: Tron P0 — otmux.send empty/whitespace payload is silent no-op

**Sprint:** 1 — State Correctness Architecture
**Priority:** P0 (Tron-escalated)
**Origin:** PO directive 2026-05-12 LATE via ooshTeam:0.0
**Status:** Done

## Problem

`otmux.send <target> "$maybeEmpty"` with empty or whitespace-only text:

- Old guard: `[ -z "$target" ] || [ -z "$*" ]` — `[ -z "$*" ]` catches the truly
  empty case but treats it as a usage error (returns 1, error.log).
- Whitespace-only payloads (`"   "`, tabs, newlines) bypass `-z` entirely.
- For both classes, when `private.otmux.send.smart` runs the prefix step, the
  composed message becomes `[@<role> <pane>] ` (prefix only, no body).
- That bare bracket-prefix delivered to a Claude TUI reads as a **user prompt**.
  The receiving agent has no body to act on, so it hallucinates a task to
  satisfy the apparent ask (PO observed: agents committing unrequested work
  after empty sends from automation).

PO directive: make empty + whitespace-only text a **silent no-op** with
`return 0` before any prefix or send logic runs. Don't error — caller-side
empty strings are normal in variable substitution chains.

## Fix

Three-layer defense in `otmux`:

### 1. `otmux.send` (public entry, lines ~1787)

- Split the old combined `[ -z "$target" ] || [ -z "$*" ]` check.
- Target empty → still a usage error (return 1).
- Text empty or whitespace-only → silent return 0 with debug.log.
- Guard runs BEFORE prefix logic, BEFORE key detection, BEFORE any tmux call.

```bash
if [ -z "$target" ]; then
  error.log "usage: otmux send <target> <text...>"
  return 1
fi
if [[ "$*" =~ ^[[:space:]]*$ ]]; then
  debug.log "otmux.send: empty/whitespace-only payload — silent no-op (target=$target)"
  return 0
fi
```

### 2. `private.otmux.send.smart` (lines ~1859)

Defense-in-depth — can be entered directly from internal paths (e.g.
`otmux.send` Case 2 mixed text+key path passes text_args to smart). If text is
all-whitespace, abort before prefix prepend.

```bash
if [[ "$text" =~ ^[[:space:]]*$ ]]; then
  debug.log "send.smart: empty/whitespace-only text — silent no-op (target=$target)"
  return 0
fi
```

### 3. `otmux.send.verified` (lines ~1676)

Same guard. Replace `[ -z "$target" ] || [ -z "$text" ]` (errors on both) with
a target-only error + a whitespace-text no-op.

## Predicate

`[[ "$text" =~ ^[[:space:]]*$ ]]` — bash regex, matches:

- Empty string `""`
- Spaces `"   "`
- Tabs `"\t\t"`
- Newlines `"\n"`
- Mixed whitespace `" \t \n "`

Does NOT match:

- `"hello"`
- `"  hi  "` (leading/trailing ws but non-ws in middle — legitimate prose)

Tested predicate inline:

```
empty:    noop
spaces:   noop
tabs:     noop
newline:  noop
mixed-ws: noop
normal:   send
with-ws:  send
```

## Why no-op instead of error

Caller pattern:

```bash
local msg=$(somefunction)
otmux send "$target" "$msg"
```

If `somefunction` returned empty (no-data case, not error), the caller's
intent is "send nothing". Erroring would force every caller to wrap with
`[ -n "$msg" ] && otmux send ...`. Silent no-op is the contract that lets
callers stay simple.

## Verification

After commit:

```bash
otmux send ooshTeam:0.2 ""           # → returns 0, no pane change
otmux send ooshTeam:0.2 "   "         # → returns 0, no pane change
otmux send.verified ooshTeam:0.2 ""   # → returns 0, no pane change
otmux send ooshTeam:0.2 ""  Enter     # → returns 0, no pane change (key path is all-keys)
otmux send ooshTeam:0.2 "hello"       # → returns 0, prefixed text sent
```

Regression: existing test fixtures that send legitimate prose continue to
work — the `with-ws` predicate test confirms `"  hi  "` is treated as prose.

## Commit

`otmux send: silent no-op on empty/whitespace payload — guard before prefix in send/send.smart/send.verified (ref: task-tron-p0-send-empty-noop.md)`

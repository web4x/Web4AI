# Retest #3: hiveMind agent.context.status (commit ad9c8ef)

**From**: oosh-tester
**For**: oosh-expert
**Date**: 2026-02-22

## Verification Results

| Check | Result | Evidence |
|-------|--------|----------|
| 1. Pane 0.4 never touched | **PASS** | Shows `TRON-SKIP` |
| 2. /context executes | **PASS** | Double-Enter works, no autocomplete stuck |
| 3. Idle detection | **PASS** | No BUSY:unknown, all probed |
| 4. Context % parsed | **FAIL** | All parse-fail — capture too shallow |

## The remaining blocker: capture depth

Token line is at the TOP of /context output. There are ~400+ lines of agent definitions and skills BELOW it. After /context completes, the prompt is at the bottom.

**Measured on trainer pane (0.5):**
- Full scrollback: 1705 lines
- Token line `71k/200k tokens (36%)` at line 1256
- Bottom of pane: line 1705
- **Distance from bottom: 449 lines**
- Current capture: `-S -30` (sees 30 lines from bottom)

### Fix required

Change the `/context` capture from:
```bash
ctx_output=$(tmux capture-pane -t "$target" -p -S -30 2>/dev/null)
```
To:
```bash
ctx_output=$(tmux capture-pane -t "$target" -p -S -500 2>/dev/null)
```

Or better — capture full scrollback and grep for the token line:
```bash
ctx_output=$(tmux capture-pane -t "$target" -p -S - 2>/dev/null)
token_line=$(echo "$ctx_output" | grep -oE '[0-9]+k/[0-9]+k tokens \([0-9]+%\)' | tail -1)
```

Using `tail -1` gets the MOST RECENT /context result if multiple exist in scrollback.

## What's working

Everything except the capture depth. Three bugs found across 4 commits, two fixed:
- Idle detection (23c7053) — FIXED
- Autocomplete bypass (5a8bd1a → ad9c8ef double-Enter) — FIXED
- Tron skip (ad9c8ef) — FIXED
- Capture depth — STILL BROKEN, needs `-S -500` or `-S -`

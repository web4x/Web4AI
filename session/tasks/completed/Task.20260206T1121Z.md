# Task 49: claudeCode.model Methods for OOSH Wrapper

**From**: PO research via Orchestrator
**For**: Expert (implement)
**Priority**: High
**Status**: Planning

## Problem

The `claudeCode` wrapper has `claudeCode.model <model>` which starts a NEW session with `--model` flag, but lacks methods to:
1. Get the current model from a running Claude Code session
2. Switch models mid-session using the `/model` slash command
3. List available model aliases

This limits team flexibility — agents cannot dynamically switch between opus/sonnet/haiku based on task complexity.

## Current State

Existing in `claudeCode` (lines 199-229):
- `claudeCode.model <model> <?prompt>` — starts NEW session with `--model` flag
- `claudeCode.model.completion.model()` — returns `opus sonnet haiku`
- `claudeCode.opus`, `claudeCode.sonnet`, `claudeCode.haiku` — shorthand for new sessions

## Proposed Methods

| Method | Signature | Purpose |
|--------|-----------|---------|
| `claudeCode.model.get` | `<pane>` | Get current model from running session (parse TUI or send `/model`) |
| `claudeCode.model.set` | `<pane> <model>` | Send `/model <alias>` to switch model in running session |
| `claudeCode.model.list` | (none) | Echo available aliases: `opus sonnet haiku` |
| `claudeCode.agent.start` | `<?workdir:.> <?model:sonnet>` | Update to accept optional model parameter |

## Implementation Plan

### Step 1: `claudeCode.model.list`
```bash
claudeCode.model.list() # # list available model aliases
{
  echo "opus"
  echo "sonnet"
  echo "haiku"
}
```

### Step 2: `claudeCode.model.set`
```bash
claudeCode.model.set() # <pane> <model> # switch model in running session via /model
{
  local pane="$1"
  local model="$2"

  [ -z "$pane" ] || [ -z "$model" ] && { error.log "Usage: claudeCode model.set <pane> <model>"; return 1; }

  # Validate model alias
  case "$model" in
    opus|sonnet|haiku) ;;
    *) error.log "Invalid model: $model (use opus, sonnet, haiku)"; return 1 ;;
  esac

  # Send /model command to the pane
  "$OOSH_DIR/otmux" sendEnter "$pane" "/model $model"
  info.log "Sent /model $model to $pane"
}
claudeCode.model.set.completion.pane() {
  tmux list-panes -a -F "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null
}
claudeCode.model.set.completion.model() {
  claudeCode.model.list
}
```

### Step 3: `claudeCode.model.get`
```bash
claudeCode.model.get() # <pane> # get current model from running session
{
  local pane="$1"
  [ -z "$pane" ] && { error.log "Usage: claudeCode model.get <pane>"; return 1; }

  # Capture TUI status bar — Claude Code shows model in status line
  local content
  content=$("$OOSH_DIR/otmux" pane.capture "$pane" 10)

  # Parse model from status bar (format: "Model: opus" or similar)
  local model
  model=$(echo "$content" | grep -oiE '(opus|sonnet|haiku)' | head -1 | tr '[:upper:]' '[:lower:]')

  if [ -n "$model" ]; then
    RESULT="$model"
    echo "$model"
    return 0
  fi

  # Fallback: unknown (TUI may not show model)
  RESULT="unknown"
  echo "unknown"
  return 1
}
claudeCode.model.get.completion.pane() {
  tmux list-panes -a -F "#{session_name}:#{window_index}.#{pane_index}" 2>/dev/null
}
```

### Step 4: Update `claudeCode.agent.start`

Current (line 572-582):
```bash
claudeCode.agent.start() # <?workdir:.> # start Claude Code in current or specified pane
```

Proposed:
```bash
claudeCode.agent.start() # <?workdir:.> <?model:sonnet> # start Claude Code with optional model
{
  local workdir="${1:-.}"
  local model="$2"

  local cmd="$CLAUDE_CMD --dangerously-skip-permissions"
  [ -n "$model" ] && cmd="$cmd --model $model"

  if [ -n "$TMUX" ]; then
    "$OOSH_DIR/otmux" send "$(tmux display-message -p '#{pane_id}')" "cd '$workdir' && $cmd" Enter
    info.log "Started Claude Code in current pane${model:+ with model $model}"
  else
    cd "$workdir" && eval "$cmd"
  fi
}
```

### Step 5: hiveMind Integration (optional)

Update `hiveMind agent.bootstrap` to accept model as positional parameter:
```bash
./hiveMind agent.bootstrap oosh-expert opus
```

This passes through to `claudeCode.agent.start`.

## Acceptance Criteria

- [ ] `claudeCode model.list` outputs `opus sonnet haiku`
- [ ] `claudeCode model.set cursorOrchestrator:0.2 opus` switches model in pane
- [ ] `claudeCode model.get cursorOrchestrator:0.2` returns current model (or "unknown")
- [ ] `claudeCode agent.start /path opus` starts with opus model
- [ ] Tab completion works for pane and model parameters
- [ ] Existing `claudeCode model <model>` behavior unchanged (starts new session)

## Dependencies

- None (builds on existing claudeCode and otmux infrastructure)

## Notes

- Model detection (`model.get`) may be unreliable if TUI doesn't show model in status bar — fallback to "unknown" is acceptable
- `/model` slash command behavior should be verified manually before implementation
- Consider renaming existing `claudeCode.model` to `claudeCode.model.new` for clarity (breaking change, assess impact)

# Sender Prefix Pattern

**Created**: 2026-03-25
**Context**: Agents couldn't tell who sent them a message — needed identity on inter-agent communication

## Design

When an agent sends a message via `otmux send`, the text is prefixed with:
```
[@role pane] message text
```

Example: `[@oosh-expert projectTeam:0.1] please review the test results`

### Rules

| Condition | Prefix? |
|-----------|---------|
| Normal text to Claude Code pane | YES — `[@role pane] text` |
| `/commands` (`/compact`, `/rename`, etc.) | NO — TUI commands pass through raw |
| Target is bash/zsh (not Claude Code) | NO — would break shell commands |
| Sender has no HIVEMIND_ROLE and no registry entry | NO — absence = Tron sent it |

## Implementation (DRY — single point)

### `private.otmux.send.prefix()` in otmux
```bash
private.otmux.send.prefix() {
  local reg="${HIVEMIND_REGISTRY:-${CONFIG_PATH:-$HOME/config}/hivemind.roles.env}"
  local myPane=$(tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}")
  local myRole="${HIVEMIND_ROLE:-}"
  if [ -z "$myRole" ] && [ -f "$reg" ]; then
    myRole=$(grep "^${myPane}|" "$reg" | head -1 | cut -d'|' -f2)
  fi
  [ -n "$myRole" ] && echo "[@${myRole} ${myPane}] "
}
```

### Insertion in `otmux.send()`
```bash
# After accept-edits clear, before send.verified:
if private.otmux.pane.isClaudeCode "$target" && [[ "$text" != /* ]]; then
  local prefix=$(private.otmux.send.prefix)
  [ -n "$prefix" ] && text="${prefix}${text}"
fi
```

### What does NOT get prefix
- `otmux.send.raw` — raw key sequences, no prefix
- `private.otmux.sendEnter` — low-level transport, no prefix
- `otmux.send.verified` — called BY send after prefix already added
- `otmux.pane.send` — alias for sendEnter, no prefix

### DRY inheritance
`hiveMind.send.message` calls `otmux send` → gets prefix automatically. No changes needed in hiveMind. One implementation point serves all send paths.

## Commits
- `a0c22b1` — private.otmux.send.prefix + insertion in otmux.send
- `dffffed` — 9 T-PREFIX tests in test.otmux
- `e4a165c` — isClaudeCode guard (bash panes were getting prefixed)

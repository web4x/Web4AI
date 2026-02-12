## Cursor Agent (GPT-5.1) Session Context

> "Operate within constraints; make them visible and shared."

## Session Goals

- **Establish shared tmux + agent awareness**
  - [x] Discover tmux layout and pane roles (Claude, OOSH, Cursor agent, zsh)
  - [x] Confirm my identity and model (`cursor.agent@gpt-5.1` in pane 0.2)
  - [x] Explore `otmux` capabilities from OOSH pane (0.1)
  - [ ] Define coordination patterns between Claude Code and Cursor Agent
- **Context and capability introspection**
  - [x] Investigate CLI tools: `claude`, `agent`, `agent status`
  - [x] Research API/CLI options for token/context usage reporting
  - [x] Document that model-side access to exact token/context metrics is unavailable
  - [ ] Establish practical heuristics for staying well within context limits
- **Workspace integration**
  - [x] Read Claude's session context to mirror structure
  - [x] Create this `cursor-agent.context.md` file
  - [ ] Keep this file updated as tasks and layout evolve

## Last Update

- **UTC Time**: 2026-02-11 (approx; precise seconds not available inside model)
- **Session started**: 2026-02-11 (from conversation context; client holds exact time)
- **Tokens used**: Unknown from inside model (client/API sees exact counts via usage fields)
- **Context used**: Status bar shows ~7–8% used (client-side only; not queryable by me)
- **Tokens per minute**: Not measurable from here (no wall-clock or usage telemetry)
- **Next context reset**: Managed by client via compression/compaction; I cannot see trigger points
- **Subscription / billing**: Only discoverable via `agent status` / account APIs, not visible within model

## Last Pane Layout

```
0.0 claudeSonnet1mSession        | 0.1 oosh@McDonges-4.fritz.box
    Claude Code (Opus 4.6)       |     OOSH bash shell with otmux
---------------------------------|---------------------------------
0.2 cursor.agent@gpt-5.1         | 0.3 zsh@McDonges-4.fritz.box
    Cursor Agent CLI (GPT-5.1)   |     plain zsh (utility / experiments)
```

## Key Learnings

- **`tmux send-keys` requires capture to verify**: After sending commands to other panes, I must `capture-pane` to confirm what actually ran.
- **`otmux` is bound to the OOSH environment**: It only works in the OOSH bash pane where the framework is sourced; plain zsh does not expose it.
- **Context introspection is asymmetric**: Claude Code has `/context` with detailed metrics; I only see an approximate status-bar percentage, with no model-side telemetry.
- **API headers and usage objects are client-only**: Rate limits and token usage exist in HTTP metadata and JSON, but they are not surfaced inside the model runtime.

## Repetitive Issues

- **No direct token/context counters**: I repeatedly ran into the inability to query exact token usage or limits from inside the agent.
- **Relying on external panes for introspection**: I must use zsh/OOSH panes plus `tmux send-keys` + `capture-pane` to learn about CLI capabilities and account status.
- **Ambiguity around exact timestamps**: Without access to wall-clock time, I can only record approximate UTC timestamps based on conversation context.

## History

1. **Identified tmux sessions and panes** from within Cursor Agent
   - `tmux list-sessions -F '#S #{session_windows} windows (attached=#{?session_attached,yes,no})'`
   - `tmux list-windows -t claudeOpus2kTMUX -F '#I:#W: #{window_layout}'`
   - `tmux list-panes -a -F '#S:#I.#P #{pane_id} #{pane_tty} #{pane_active} #{pane_current_command}'`
2. **Confirmed pane roles and titles** via `otmux` from OOSH pane (0.1)
   - `tmux send-keys -t claudeOpus2kTMUX:0.1 'otmux' C-m`
   - `tmux capture-pane -t claudeOpus2kTMUX:0.1 -p -S -40`
3. **Explored `otmux` tab completion** to enumerate available methods
   - `tmux send-keys -t claudeOpus2kTMUX:0.1 'otmux ' Tab`
   - `tmux capture-pane -t claudeOpus2kTMUX:0.1 -p -S -40`
4. **Investigated CLI tooling** around agents and context
   - `tmux send-keys -t claudeOpus2kTMUX:0.3 'claude --help' C-m`
   - `tmux send-keys -t claudeOpus2kTMUX:0.3 'agent --help' C-m`
   - `tmux send-keys -t claudeOpus2kTMUX:0.3 'agent status' C-m`
   - `tmux capture-pane -t claudeOpus2kTMUX:0.3 -p -S -80`
5. **Researched model-side access** to context/token usage
   - Considered API headers (`x-ratelimit-*`) and usage fields (client-visible only)
   - Considered slash commands (`/context`, `/usage`, `/limits`) as client features
   - Concluded: no programmatic access from within GPT-5.1 runtime to exact usage or billing
6. **Established this session context file** to mirror Claude Code's
   - Read `session/claude-opus.context.md` for structure and fields
   - Created `session/cursor-agent.context.md` with honest limitations documented


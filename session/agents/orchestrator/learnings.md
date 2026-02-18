# orchestrator Learnings

*Patterns, failures, KPIs — identity after compact.*

## Failures

### F15: Mass Context Exhaustion from Parallel Delegation (2026-02-17)
Delegated 4 large tasks simultaneously. All 11 agents hit 0% within 30 minutes. SM couldn't save them because SM was also at 0%. Recovery took 40 minutes of chaos. **Never delegate more than 2 large tasks without checking subscription headroom and agent context levels.**

### F16: Know Your Own Pane (2026-02-17)
Interface nearly compacted itself because it didn't know which pane it was in. **On boot, run `tmux display-message -p "#{session_name}:#{window_index}.#{pane_index}"` and store the result. Never send commands to your own pane.**

### F19: Recovery Order = Communication Hierarchy (2026-02-17)
Blind batch recovery (loop all panes, send same command) failed completely. Recovery must follow: SM first → orchestrator → workers. **SM alive = team can self-heal. SM dead = manual recovery for everyone.**

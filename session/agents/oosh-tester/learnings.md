# oosh-tester Learnings

*Patterns, failures, KPIs — identity after compact.*

## Testing Patterns

### test.suite filter mode
- `test.suite run hiveMind 1 T-PULL-8` — runs single filtered test
- `test.suite list hiveMind` — lists all test labels with line numbers
- Args type-dispatched: any order works
- Filter still executes ALL setup code — slow for large files
- Use `test.def` for callable function tests (migration opt-in)

### BRE vs ERE (hard-won, repeated mistake)
- `grep -qE` uses ERE: `|` is alternation, `\|` is literal
- `grep -q` (no -E) uses BRE: `\|` is alternation
- ALWAYS check which grep flag before writing alternation patterns

### Self-contained tests
- Use `__test_` prefix + `$$` for isolation
- Create/destroy tmux sessions for live tests
- Gate live tests behind `LIVE_SESSION` or `otmux sessions` check
- Code-level grep tests always work — prefer these for speed

### Tab completion testing
- Send Tab via `otmux send.raw pane Tab`
- c2 first Tab shows usage, second shows completions
- Namespace collision: `ossh.get.config()` made c2 see `get` as sub-method

### Remote testing
- Use remote-tester-shell for SSH sessions
- `oo mode <branch>` switches oosh branch (instant symlink swap)
- NEVER manually rm/ln framework files — use oo mode
- `git pull` in tester shell before running tests

## Sprint 0 Learnings

### MVC boundaries
- claudeCode = Model (no otmux.send, no pane.capture)
- otmux = View (no claudeCode, no hiveMind except protected callbacks)
- hiveMind = Controller (delegates UUID to claudeCode, pane ops to otmux)

### UUID discovery chain
- JSONL filename IS the UUID — never parse line 1
- session.resolve.uuid → session.current → session.discover
- sessions.env updated by registry.refresh, not by Claude Code
- Three sources must agree: sessions.env, process args, JSONL file

### Pane operations (B5)
- split/swap/move renumber pane indices
- Registry must update: panes.shifted, panes.swapped, pane.moved
- registry.set now has 3-field format: pane|role|timestamp
- TTL priority: manual set survives 30s over live discovery

### Target validation (Bug #4)
- error.log writes to STDOUT not stderr
- hiveMind.resolve failure captured as non-empty $target (error message)
- otmux.send needs format validation: session:win.pane or %NN
- Never trust $() output without checking $? separately

## Role Boundaries
- DO NOT implement fixes — report findings, expert implements
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- NEVER manually modify framework files — use oo mode
- Use oosh-tester-shell (ooshTeam:0.4) for commands
- Finish current task before handling new prompts
- Test, report, stand by

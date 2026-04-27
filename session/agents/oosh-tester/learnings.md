# oosh-tester Learnings

*Patterns, failures, rules — identity after compact.*

## Testing Patterns

### test.suite filter mode
- `test.suite run hiveMind 1 T-PULL-8` — runs single filtered test
- `test.suite list hiveMind` — lists all test labels with line numbers
- Args type-dispatched (any order): `test.suite run T-PULL-8 1 hiveMind`
- Filter mode STILL runs all code between test.case calls — slow for 300+ test files
- Need test.def migration for isolation

### BRE vs ERE regex (burned 3+ times)
- `grep -qE` uses ERE: `|` is alternation, `\|` is literal backslash-pipe
- `grep -q` (no -E) uses BRE: `\|` is alternation
- ALWAYS double-check: `-qE` + `|` or `-q` + `\|`

### sed function extraction
- `sed -n '/^func()/,/^}/p'` stops at FIRST `^}` — inner braces truncate
- Functions with `if/fi`, `case/esac`, `while/done` may have early `}` on column 0
- Verify with `wc -l` that extraction is complete

### UUID discovery (hard-won)
- Process args UUID wrong for forked (`--fork-session`) and autocompacted sessions
- JSONL filename IS the UUID: `basename file .jsonl`
- `session.discover` uses: pane title → JSONL customTitle match → cwd disambiguator
- 5 states: live/stable/stale/broken/unknown
- `sessions.env` updated by `consistency.fix` and `registry.refresh`

### Remote testing
- Use remote-tester-shell pane for SSH sessions
- Remote oosh needs `oo mode test/macos.latest` for dev code (not git pull into prod)
- `oo mode` switches ~/oosh symlink — PATH follows automatically
- NEVER manually rm framework files — use oo mode

### Tab completion testing
- Send Tab via `otmux send.raw pane Tab`
- c2 first Tab shows usage help, second Tab shows completions
- c2 namespace collision: deprecated `ossh.get.config()` made c2 see sub-methods

## Key Rules (eternal)
- NEVER use raw tmux — always otmux wrappers
- NEVER filter output (no 2>/dev/null, | head, | tail, | grep)
- NEVER manually rm framework files — use oo mode
- Use oosh-tester-shell for running commands
- Finish current task before handling new prompts
- Every task = one commit: `<what changed> (ref: task-<id>.md)`
- Tests must be self-contained (work on clean machine)
- TDD when possible: write tests BEFORE expert implements

## Boot Reading List
- `session/agents/oosh-tester/context.md` — current state
- `.claude/agents/oosh-tester/SKILL.md` — role definition
- `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/` — current sprint tasks

# OOSH Expert Agent Context

**Session**: oosh-expert@sonnet
**Role**: oosh-expert
**Pane**: projectTeam:0.1
**Updated**: 2026-02-11
**State**: trained, ready for tasks

## CURRENT GOAL
Ready for implementation tasks. Waiting for assignment from Orchestrator.

## COMPLETED WORK
- Read SKILL.md
- Read full reading list (CLAUDE.md, agent-overview.md, 4 technical docs)
- Wrote this context file

## KEY KNOWLEDGE

### Architecture — Three-Layer Stack
- **Script layer**: Each script is a "class". Methods = `scriptname.method()`. Constructor = `scriptname.start()`. Private = `private.` prefix.
- **Kernel layer** (`this`): Bootstrap via `source this` + `this.start "$@"`. Dispatch chain: direct function → prefixed `caller.function` → dynamic `this.load`.
- **Config layer**: `~/config/user.env` → sources `log.env` + `oosh.env`. `config.save` persists env vars by prefix grep.

### Method Signature Convention
```
scriptname.method() # <required> <?optional:default> # description
```
Custom completion: `scriptname.method.completion.paramname()` returns options.

### Result System
- `create.result CODE "message"` → sets `RETURN_VALUE` + `RESULT`
- Caller reads `$RESULT` and `$RETURN_VALUE`

### Logging System (7 levels)
- Level 0=silent, 1=errors, 2=warnings, 3=console (default), 4=info, 5=debug, 6=trace, 7=step
- Gate pattern: `if [ "$LOG_LEVEL" -gt N ]`
- All log functions write to `$LOG_DEVICE` (default `/dev/tty`)
- Use `console.log` for user output, `echo` only for raw bypass

### Known Bugs
1. **Config persistence pollution**: `config.save log LOG` captures test-elevated `LOG_LEVEL` into `log.env`, polluting all subsequent scripts
2. **set +x bug in seq.puml.log**: `set +x` commented out in else branch — tracing persists indefinitely after level 6
3. **debug fallback**: `debug:31-32` silently sets `LOG_LEVEL=5` if empty

### Completion System (c2)
- Located in `ng/c2`. Scans scripts for function signatures and doc comments.
- Parameter parsing automatic from `# <param> <?param>` syntax.
- Interactive testing via tmux: send Tab keys, capture pane, grep output.

### Test Patterns
- Files: `test/test.<scriptname>`, source `test.suite $*`
- `test.case - "description" function args` → `expect CODE "msg" "desc"`
- Run: `./test.suite run <name> [level]` or `./test.suite all`

### Team Structure
- Orchestrator (agent-teacher) → delegates via ScrumMaster
- Task Agent → creates task files in session/tasks/
- ScrumMaster → monitors panes, approves permissions, enforces roles
- Expert (me) → implements features, architecture
- Tester → runs tests, writes test cases, validates usability
- PO → enforces first principles, blocks non-compliant changes

### Mandatory Rules
- No raw tmux — always `otmux`/`hiveMind` wrappers
- No `--dangerously-skip-permissions`
- File-based communication for tasks (no long messages via send)
- Always measure, never assume
- STOP→SAVE→/compact at 20% context
- Throttle at 80% quota, stand down at 90%

## RECOVERY STEPS
1. State: "I am the OOSH Expert agent."
2. Read `.claude/agents/oosh-expert/SKILL.md`
3. Read this context file
4. Check TaskList for assigned work
5. Check with Orchestrator for current priorities

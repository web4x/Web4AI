# OOSH Tester Agent — Session Context

**Updated**: 2026-02-11
**Role**: oosh-tester (testing & validation)
**Pane**: projectTeam:0.2

## Recovery Steps
1. Read this file
2. Read `.claude/agents/oosh-tester/SKILL.md`
3. Read `docs/test-suite.md` for testing patterns
4. Read `docs/log-levels-and-testing.md` for log diagnostics
5. Check TaskList for assigned work
6. Check with Orchestrator for current priorities

## Completed Work
### Training (DONE)
- Read SKILL.md (role definition, mandatory 3-check, boundaries)
- Read CLAUDE.md (workspace overview, OOSH essentials, agent team layout)
- Read agent-overview.md (all roles: Orchestrator, Task Agent, ScrumMaster, Expert, Tester, PO, Trainer, Developer, WODA duo)
- Read docs/test-suite.md (test.case, expect, expect.error, naming, running)
- Read docs/completion-system.md (c2 completion, tmux interactive testing, otmux wrappers)
- Read docs/log-levels-and-testing.md (levels 0-7, config pollution bug, set +x bug, proposed fixes)
- Read docs/log.md (log functions, LOG_DEVICE, LOG_LIVE, capture mode, troubleshooting)
- Read docs/context-schema.md (schema v1.0, lifecycle, validation)
- Wrote this context file

## Key Knowledge

### Mandatory 3-Check Test (every new/changed method)
1. Missing required params -> must show usage, non-zero return
2. Missing optional params -> must work silently with defaults
3. Tab completion stub must exist for all new methods

### Test Framework
- Test files: `test/test.<scriptname>`, source `test.suite $*`
- Pattern: `test.case $level "desc" function args` then `expect 0 "expected" "message"`
- Run single: `./test.suite run <script> <level>`, all: `./test.suite all`
- Level 1 for CI (errors+assertions only), level 3 for dev, level 5 for debug
- Results via `RETURN_VALUE` (exit code) and `RESULT` (string)
- Always end with `test.suite.save.results`

### Known Bugs to Watch For
- Config pollution: `config.save` during tests can persist elevated LOG_LEVEL to `~/config/log.env`
- `set +x` bug in `seq.puml.log`: tracing enabled at level 6 but never disabled (line 121 commented out)
- `debug` script silently sets LOG_LEVEL=5 if LOG_LEVEL is empty
- LOG_DEVICE can get redirected to temp file during tests, breaking all log output

### Troubleshooting Log Output
- Check `LOG_DEVICE` (should be `/dev/tty`)
- Check `LOG_LEVEL` (should be 3 default)
- Reset: `log device /dev/tty && log level 3`, then new shell

### Role Boundaries
- DO: write tests, run test.suite, code reviews, validate, report DRY violations
- DO NOT: implement features, modify production code, make architecture decisions
- Report DRY violations to Task Agent (not Expert, not Orchestrator)
- Signal completion: `TASK COMPLETE: <summary>`

### Communication Rules
- No raw tmux — always `otmux`/`hiveMind` wrappers
- No long messages via send — write to `session/tasks/`, send file reference
- Save context before `/compact` (STOP -> SAVE -> /compact)

## Pending
- Waiting for first testing assignment from Orchestrator

## Key Files
- `.claude/agents/oosh-tester/SKILL.md` — role definition
- `docs/test-suite.md` — testing patterns
- `docs/log-levels-and-testing.md` — log diagnostics reference
- `docs/completion-system.md` — c2 completion testing
- `docs/context-schema.md` — context file format

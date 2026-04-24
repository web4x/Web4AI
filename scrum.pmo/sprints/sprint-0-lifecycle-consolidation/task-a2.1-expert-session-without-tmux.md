[Back to Task A2](./task-a2-claudecode-session-portability.md)

# Task A2.1: Expert - Session Operations Without tmux
[task:uuid:fb7c0e1b-6e52-41af-9a86-03fe2527a605]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement (scope: session.current, context.read, PID lookup, JSONL access)
  - [x] creating test cases (6 test assertions handed to A2.3 in findings)
  - [x] implementing (2 fixes landed in same commit with findings)
  - [x] testing (portability audit complete — findings doc written)
- [x] QA Review
- [ ] Done (pending A2.3 tester)

## Deliverable

**Findings:** [task-a2-findings.md](./task-a2-findings.md) (covers A2.1 + A2.2)

**Tests run (with `env -u TMUX -u TMUX_PANE`):**
- 12 Model methods tested — 8 PASS, 3 PARTIAL, 1 FAIL
- 6 testable assertions defined for A2.3

**Fixes landed:**
1. `session.current <pane>` — returns `rc=1` on empty (was silent-fail rc=0)
2. `context.self` — errors cleanly when `TMUX` + `TMUX_PANE` both unset (was producing misleading JSONL fallback %)

**Still portable (no changes needed):** `context.all`, `context.jsonl`, `context.velocity.byJsonl`, `session.name`, `list`, `session.id`, `context.read` (via sessions.env cache), `join.byID`, `fork`, orphan UUID discovery via `ps`

## Traceability
- up
  - [Task A2: claudeCode Session Portability](./task-a2-claudecode-session-portability.md)

## Description
**Role: oosh-expert**

Verify and ensure that all claudeCode session operations work without tmux running:

1. **session.current** — must resolve UUID from filesystem (config files, JSONL), not pane titles
2. **context.read** — must read context % from JSONL log files, not from tmux pane capture
3. **PID lookup** — must find Claude process PIDs from PID files or process table, not tmux pane PIDs
4. **JSONL access** — must read/write JSONL session logs from standard file paths

For any operation that currently depends on tmux, refactor to use filesystem-only resolution with tmux as an optional enhancement (not a requirement).

Key file: `/Users/donges/oosh/claudeCode`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*

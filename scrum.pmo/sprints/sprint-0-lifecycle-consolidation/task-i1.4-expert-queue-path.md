[Back to Task I1](./task-i1-context-aware-send-design.md)

# Task I1.4: Expert - QUEUE path + drain hook
[task:uuid:i1a4-queue-2026-04-21]

## Status
- [x] Planned
- [x] In Progress
  - [x] implementing
  - [x] testing (I1.5 13/13 PASS — commit 449ee34)
- [x] QA Review
- [x] Done

## Traceability
- up
  - [Task I1: Context-Aware Send Design](./task-i1-context-aware-send-design.md)

## Description
**Role: oosh-expert**

Implement the QUEUE path — defer messages when agent is busy and replay them
when the agent transitions to idle.

### Persistence
```
${HIVEMIND_QUEUE_DIR:-~/config/hivemind.queue}/<sanitized-pane>.queue
```

Sanitization: replace `:` and `.` with `_`. Format (one line per pending msg):
```
<epoch>|<intent>|<keys-or-text>
```

`intent` ∈ `{inform, remote-control:<key>}`

### Public methods
- `hiveMind.agent.queue.list   <agent>` — show pending messages with age
- `hiveMind.agent.queue.drain  <agent>` — manual FIFO drain (idempotent —
  re-checks state per message)
- `hiveMind.agent.queue.clear  <agent>` — cancel all pending

### Drain hook (per PO decision 4)
- Hook at end of `hiveMind.agent.unblock` cycle
- When pane transitions to idle, call `hiveMind.agent.queue.drain` for that pane
- FIFO: read line 1, dispatch via `agent.send` (inform) or `agent.option` etc.,
  remove on success
- Re-check state per-message — agent might re-enter overlay/active mid-drain

### Bounds (env-overridable)
- `HIVEMIND_QUEUE_MAX_DEPTH=50` — drop oldest when exceeded (warn.log)
- `HIVEMIND_QUEUE_MAX_AGE_SEC=3600` — drop stale on drain

### Concurrency
- `>>` append is atomic for short writes (< PIPE_BUF). Each line < 512B.
- Drain reads, dispatches, then re-writes the file without the dispatched line
  (atomic via tmpfile + mv).

Key file: `/Users/donges/oosh/hiveMind`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic I: Context-Aware Send*

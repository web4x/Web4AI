[Back to Task A2](./task-a2-claudecode-session-portability.md)

# Task A2.2: Expert - UUID Resolution Without tmux
[task:uuid:f3c8cbde-8d85-4c1b-995d-0c0eaa1b7533]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (assertions in shared findings)
  - [x] implementing (no code changes needed — resolution chain already works)
  - [x] testing (verified: cache-hit, multi-team, orphan via ps)
- [x] QA Review
- [ ] Done (pending A2.3 tester)

## Deliverable

**Findings:** [task-a2-findings.md](./task-a2-findings.md) — "A2.2 UUID Resolution Chain" section

**Resolution chain (documented + verified portable):**
1. `sessions.env` cache (file, survives tmux death) — hit path returns UUID
2. `session.current` fallback via `private.session.discover`:
   - ps args → UUID for pane's tty (needs tmux SERVER, not `$TMUX` env)
   - JSONL customTitle correlation (pure filesystem)
3. Orphan discovery via `ps args` grep — works with ZERO tmux

**Multi-team confirmed:** `sessions.env` keys are fully-qualified `<session>:<window>.<pane>` — cross-team lookup works without tmux session context. Live file has 5+ teams' entries.

**Orphan rediscovery test:** 5 Claude UUIDs found from `ps` args alone, no tmux consulted.

## Traceability
- up
  - [Task A2: claudeCode Session Portability](./task-a2-claudecode-session-portability.md)

## Description
**Role: oosh-expert**

Ensure UUID resolution (mapping agent names to session UUIDs) works purely from persisted config files without tmux:

1. **sessions.env lookup** — resolve agent-name-to-UUID from hiveMind's sessions.env
2. **session.current fallback** — if no tmux pane context, fall back to config-file resolution
3. **Multi-team resolution** — cross-team UUID lookup (03149ef foundation) must work without tmux session context
4. **Orphan detection** — identify UUIDs for Claude processes still running after tmux death

Document the resolution chain: what sources are checked, in what order, and what happens when each is unavailable.

Key files: `/Users/donges/oosh/claudeCode`, hiveMind sessions.env

---

*Sprint 0 - Lifecycle Consolidation*
*Epic A: claudeCode Model Layer*

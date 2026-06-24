# Architect Task: design team.push choreography

**From**: oosh-po@WODA.prod
**Priority**: HIGH — BLOCKING expert implementation
**Sprint**: sprint-team-migration

## Your deliverable

Design the `hiveMind team.push <host>` controller choreography to this exact spine (from 2 live manual migrations, 13 lessons):

```
session.name = truth → dedup+canonical (recency/training) → place in target hash →
fork full-uuid (cd target) → per-pane verify → rename role@host (verified) →
/rc (verified) → reconcile non-interactively → consistency.audit == 0
```

## Design must specify

1. **Pre-flight**: what to check on target before starting (workspace dir, tmux session, ssh, oosh version)
2. **Identity resolution** (S-2b): how `resolveCanonical` works — session.name lookup, dedup by mtime+JSONL line-count, dead-agent handling
3. **Per-agent loop** (NOT batch): the exact sequence for each agent, with verify-or-fail gates between steps
4. **Resume menu handling**: detect menu vs auto-resume, select option 2 deterministically
5. **Flagless reconcile**: object.verb method name for non-interactive MVC fix (replaces `--apply` flag)
6. **Collision/idempotency**: what happens when target pane already has a running Claude (re-run safe)
7. **Workspace symlink replication** (S-2/L12): discover, clone, link
8. **Error handling**: what stops the push, what's recoverable, what needs human intervention

## Read first
- `scrum.pmo/sprints/sprint-team-migration/planning.md` — the full sprint with all stories
- `session/tasks/migration-learnings-for-teampush.md` — the 13 lessons (L1-L13)
- `session/tasks/hivemind-team-push-controller.md` — the 12 manual steps + gaps

## Report-back
Write your design into this file (below this line), commit, ping oosh-po.

---
## Design (architect — edit here)


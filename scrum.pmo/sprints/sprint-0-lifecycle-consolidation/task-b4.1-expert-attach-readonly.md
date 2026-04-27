[Back to Task B4](./task-b4-otmux-client-lifecycle.md)

# Task B4.1: Expert - otmux attach readonly
[task:uuid:ba3b2264-fa0e-4436-a7bb-972a89aa3f45]

## Status
- [x] Planned
- [x] In Progress
  - [x] refinement
  - [x] creating test cases (handed off to B4.3 tester)
  - [x] implementing — commit fa75c22 (on prod)
  - [x] testing (live: setup.default applied, options confirmed via tmux show-option)
- [x] QA Review
- [x] Done

## Deliverable

**Commit:** `fa75c22` (branch: prod, pushed)

**Approach chosen:** Hybrid — both param-on-attach AND convenience method.

| Surface | Use |
|---------|-----|
| `otmux attach <target> readonly` | Generic — readonly is any of `'readonly'|'ro'|'-r'` |
| `otmux attach.readonly <?target>` | Convenience for monitoring clients (preferred call site) |
| `otmux attach.readonly.completion.target` | Tab completes session names |
| `otmux attach.completion.readonly` | Completion suggests `'readonly'` token |

Implementation just adds `-r` to the underlying `tmux attach-session` call when
the readonly token is present.

## Traceability
- up
  - [Task B4: otmux client lifecycle](./task-b4-otmux-client-lifecycle.md)

## Description
**Role: oosh-expert**

`otmux.attach` must default to `-r` (read-only) when called from a monitoring context. Options:

1. **New method:** `otmux.attach.readonly <session>` -- always passes `-r` to `tmux attach-session`
2. **Parameter:** `otmux attach <session> <?readonly>` -- optional param triggers `-r`
3. **Context detection:** If caller is tronMonitor/scrumMaster, auto-apply `-r`

Choose the approach that best fits OOSH conventions. The monitoring use case (tronMonitor, scrumMaster) is the primary consumer. Agent panes (expert, tester) should still attach read-write when needed.

Key file: `/Users/donges/oosh/otmux`

---

*Sprint 0 - Lifecycle Consolidation*
*Epic B: otmux View Layer*

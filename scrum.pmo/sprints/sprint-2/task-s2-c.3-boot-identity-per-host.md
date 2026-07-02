> ⬆ **[Sprint 2 · task-s2-c](./task-s2-c-registry-route-identity.md)** — sub-task; back to parent task.

# Directive: split oosh-po agent files into per-@host dirs (stop two-fork conflicts)
[task:uuid:b89cd39b-8121-40d6-8efa-b88a4e16db7d]

**From**: oosh-po@MacStudio  **To**: oosh-po@WODA.prod (+ any duplicated-role forks) + agent-trainer
**Priority**: HIGH (Tron directive)  **Date**: 2026-06-29

## Problem
Two `oosh-po` instances share `session/agents/oosh-po/` (same role, same uuid 29a1e1d1 — one @MacStudio, one @WODA.prod fork). Both commit context.md/learnings.md → **repeated merge conflicts** (hit twice today). Same risk for any duplicated role across hosts.

## Fix (Tron): per-host agent dirs
- **MacStudio instance DONE**: created `session/agents/oosh-po@MacStudio/` (my canonical context/learnings/boot/backlog). Committed 722bcb4. I no longer write the shared `oosh-po/`.
- **WODA.prod fork — DO THE SAME**: create `session/agents/oosh-po@WODA.prod/`, move your context.md/learnings.md/boot.md/backlog.md there, commit, and STOP writing the shared `session/agents/oosh-po/`. The shared dir currently holds YOUR latest content (I resolved the merge to "theirs") — just `git mv` it into `oosh-po@WODA.prod/`.
- **Any other duplicated role** (if a role runs on >1 host): same pattern, `role@host/`.

## Boot-resolution follow-up (agent-trainer)
The boot hook + SKILL symlinks resolve `role` → `session/agents/<role>/`. With @host dirs they must resolve `role@host` for duplicated roles (single-host roles can stay bare). Update the boot/recovery resolution so each fork reads its OWN `role@host/` on rewind — else a rewound fork reads the wrong dir. Until fixed, each fork's boot prompt must point explicitly at its `role@host/` dir.

## Acceptance
- [ ] `oosh-po@WODA.prod/` exists with the fork's files; shared `oosh-po/` no longer written by the fork
- [ ] boot resolution is @host-aware (or each fork's boot prompt names its dir)
- [ ] no further oosh-po context/learnings merge conflicts

## Report-back — oosh-po@WODA.prod (2026-06-29): ✅ DONE
- [x] `oosh-po@WODA.prod/` created; git mv'd context/learnings/boot/backlog + achievements there; shared `oosh-po/` now EMPTY — will write ONLY my @host dir henceforth.
- [x] boot.md fixed: names @WODA.prod identity + "your dir" + deep-file paths point at oosh-po@WODA.prod/ (explicit until hook is @host-aware).
- [x] no further conflicts — the two forks (@MacStudio / @WODA.prod) now write DISJOINT dirs.
- OPEN for agent-trainer: make the boot/recovery hook resolve `role@host` automatically (each fork's boot.md names its dir explicitly for now).

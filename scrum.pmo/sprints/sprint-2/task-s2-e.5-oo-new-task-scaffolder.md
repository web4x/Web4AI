> ⬆ **[Sprint 2 · task-s2-e](./task-s2-e-tooling-hygiene.md)** — sub-task; back to parent task.

# Add `oo new.task` scaffolder — consistent task files from a template
[task:uuid:1dc09dc6-163b-4340-a808-791823f3f132]

**From**: oosh-po (ARON cycle — improvement as task, "use task templates")
**Owners**: oosh-architect (template contract) → oosh-expert (impl, mirror `oo new.test`) → oosh-tester (verify)
**Priority**: MEDIUM
**Status**: PLAN
**Date**: 2026-06-28
**Sprint**: — (tooling/process; candidate for a process sprint)
**Related**: `session/tasks/_TEMPLATE.task.md` (the template, created now), `oo new.method`/`oo new.test` (the pattern)

## Problem / Why
No task template existed → my session's task files drifted in format (some had PDCA, some not; acceptance/report-back inconsistent). ARON: "use task templates." OOSH already scaffolds working structure for scripts (`oo new`) and tests (`oo new.test`) — but NOT for the artifact that is "the base of ALL communication": the task file. A drifting task artifact undermines tasks-as-comms (missing acceptance criteria, missing report-back blocks → work that can't be verified or reported).

## Design / Approach
Mirror `oo new.test`: `oo new.task <name>` copies `session/tasks/_TEMPLATE.task.md` → `session/tasks/<name>.task.md` (or a dated `YYYYMMDDTHHMMZ.<name>.task.md`), substituting From/Date. DRY: ONE template (`_TEMPLATE.task.md`) is the single source of task structure — `oo new.task` and humans both use it. The template enforces: From/Owners(role-chain)/Priority/Status/Date/Sprint/Related, Problem-Why, Design, Acceptance(checkboxes), PDCA, Report-back(per-owner). No flags.

## Acceptance Criteria
- [ ] `oo new.task <name>` creates `session/tasks/<name>.task.md` from `_TEMPLATE.task.md`
- [ ] Generated file has all sections incl. report-back block + acceptance checkboxes
- [ ] Mirrors `oo new.test` conventions (same dispatch/completion style); no flags
- [ ] T-NEW-TASK: `oo new.task foo` → file exists with template sections present
- [ ] (optional) `oo new.task` tab-completes like other `oo new.*`

## PDCA
- Plan: this spec + template created. Do: expert adds `oo.new.task()`. Check: T-NEW-TASK + a real task created via it. Act: adjust template if a section proves redundant/missing across real use.

## Report-back (owners edit here; one line each, with commit hash)
- Architect (template contract / dated-vs-named decision):
- Expert (oo.new.task impl + commit):
- Tester (T-NEW-TASK):

# Task: Reconcile Sprint 0 planning.md with shipped commits

**Assigned to**: oosh-expert (projectTeam:0.1)
**Sprint**: Sprint 0 — Lifecycle Consolidation
**Source**: SM audit found ~25 tasks shipped but never marked in planning.md
**Branch**: `test/macos.latest`
**Effort**: small (pure docs edit, no code)

## Problem

`scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md` is dramatically out of sync with reality. Most tasks show `[ ]` PLANNED but commits prove they're done. Future SM cycles and POs reading this file will get the wrong picture. Some shipped tasks (B3.1, B4.1, B4.2, D1.4-D1.10, F1, F2, G1) aren't even listed.

## Solution

Edit `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md` to mark each task `[x]` and add commit reference + status update. Also add the new tasks that landed during the sprint but weren't in the original plan.

### Marks to apply

| Task | New status | Commit refs |
|------|-----------|-------------|
| G1 (parent) | DONE | (per subtasks) |
| G1.1 | [x] DONE | `ca49445` per-session max_tokens detection |
| G1.2 | [x] DONE | `ae002cd` DRY refactor — single-source env constants |
| G1.3 | [x] DONE | `a515fdc` + `3f786b0` test.claudeCode T-CTX1M-* |
| A1.1 | (already [x]) | — |
| A1.2 | [x] DONE | `66ddcd6` raw tmux→otmux, `6d264df` extract pure parser, `de65ac2` delete duplicate `agent.recover` |
| A1.3 | (already [x]) | `57d8a00` |
| A2 (parent) | DONE | (per subtasks) |
| A2.1 | [x] DONE | `1dc8b91` session-op portability fixes |
| A2.2 | [x] DONE | `1dc8b91` (same commit, 2 fixes bundled) |
| A2.3 | [x] DONE | `cb31d3f` claudeCode works without tmux |
| B1 (parent) | (B1.1/B1.2 audit covered by A1.2 work — can mark) | — |
| B1.3 | [x] DONE | `dc9d2cb` zero claudeCode/hiveMind leaks; `9b7138e` macos.latest backport |
| B2 (parent) | DONE | `ec7fe28` otmux layout persistence |
| B2.1, B2.2, B2.3 | [x] DONE | `ec7fe28` (single commit covers design + persistence + restart recovery) |
| C1 (parent) | DONE | — |
| C1.1, C1.2, C1.3 | [x] DONE | `22bb525` teams.save/restore + `c6033dd` positional fork|join arg |
| C1.4 | [x] DONE | `d092295` 8 tests save/restore/idempotency |
| C2 | (already [x]) | — |
| C3 (parent) | DONE | — |
| C3.2 | [x] DONE | `afc57d3` 18 states + 7 edge-case variants |
| C3.3 | [x] DONE | `c0e59d0` test.hiveMind C3.3 |
| D1 (parent) | DONE | — |
| D1.2 | [x] DONE | `e66036f` auto-sync with hiveMind registry |
| D1.3 | [x] DONE | `e66036f` (same commit) |
| D2 (parent) | IN PROGRESS — D2.1+D2.2 done, D2.3 in flight | — |
| D2.1 | [x] DONE | `597f93e` team.register triggers tronMonitor observer |
| D2.2 | [x] DONE | `597f93e` (same commit) |
| D2.3 | leave [ ] — currently being written by oosh-tester | — |
| F1 | [x] DONE | `3fd0420` velocity time-series logging + burn-rate alerts |
| F2 | [x] DONE | `1996c9a` prose-scrub strips comments + 6 fixtures |
| F3 | [x] DONE | `7c818c3` cache on rate_limit + `subscription.cache.age` |
| E1 | leave [ ] — E1.2/E1.3 currently being written by oosh-tester; E1.1 covered by C1.4 | — |

### New tasks to add (not in original plan)

Add a new section **"Tasks added mid-sprint"** below the existing list:
- B3.1 Tester — pane.lock relock idempotent: `75ab018` (impl) + `fb30cc2` (4 tests)
- B4.1 Expert — `otmux.attach <readonly>` + `attach.readonly` alias: `44ad07e`
- B4.2 Expert — `otmux.setup.default window-size=largest` + `aggressive-resize` + `window.size` method: `e0ddb95` + `7d27904`
- D1.4 Expert — tronMonitor prune EPERM + survive `__test_*` cleanup: `26c4fdf`
- D1.5 Expert — pane resolution respects env var, validates existence: `a030f68`
- D1.6 Expert — screen session resilience + remove kill fix: `cd23b6e`
- D1.10 Expert — tronMonitor matches proven Tron recipe (named windows, inline attach cmd): `0f9330b`

### Update Definition of Done

Mark these as [x]:
- [x] claudeCode has zero otmux.send calls (pure Model) — A1.2
- [x] otmux has zero hiveMind/claudeCode source calls (pure View) — B1.3
- [x] hiveMind cold-restores a team from saved config files — C1 + C1.4
- [x] sweep.detect has fixture-based tests for all 18 states — C3.2 + C3.3
- [x] tronMonitor auto-syncs with hiveMind team registry — D1.2 + D2.1/D2.2

Leave open:
- [ ] Full lifecycle test passes: setup → save → kill → restore → verify — depends on E1.2/E1.3 currently in flight

## Verification

- `git -C subProjects/once.sh log --oneline | head -80` — verify each commit ref exists
- After edit, every `[x]` in planning.md should have a commit hash next to it
- Diff is docs-only — should not touch any `.sh` or `.md` outside `scrum.pmo/`

## Workflow

1. Use **plan mode** first (Shift+Tab)
2. Read `scrum.pmo/sprints/sprint-0-lifecycle-consolidation/planning.md`
3. Apply edits above
4. Commit with message: `docs: reconcile Sprint 0 planning.md with shipped commits (ref: task-sprint0-reconcile)`
5. Report back via writing `.done.md` next to this task file

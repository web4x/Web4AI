# Task: Migrate test/macos.latest → dev branch (complete)

**Priority**: HIGH
**Date**: 2026-06-01

## Goal

All features, fixes, and tests on test/macos.latest that are NOT on dev must be ported. The dev branch is what runs on Termux, samsungTablet, and any non-MacStudio machine. Missing features there = broken tools.

## Phase 1: Architect — Gap Analysis

1. On MacStudio expert-shell (ooshTeam:0.4), run:
   ```bash
   git log dev..test/macos.latest --oneline
   ```
2. Count commits, categorize by script (otmux, hiveMind, claudeCode, ossh, oo, scrumMaster, etc.)
3. Identify merge conflicts risk — which files changed on BOTH branches?
   ```bash
   git log dev..test/macos.latest --name-only --pretty=format: | sort -u
   ```
4. Write findings to this file (append to Phase 1 Results section below)

## Phase 2: Expert — Execute Migration

**Strategy**: merge (NOT cherry-pick — too many commits). If merge conflicts, resolve per-file.

1. `git checkout dev`
2. `git merge test/macos.latest` — attempt clean merge
3. If conflicts: resolve each file, prefer test/macos.latest version (it's newer)
4. `bash -n` syntax check every modified script
5. `git push`
6. Report: merge clean or N conflicts resolved

## Phase 3: Tester — Verify on dev

1. Pull dev on MacStudio test shell (ooshTeam:0.5)
2. Run `test.suite run otmux 1` — verify send.raw, prefix, pane.lock all exist
3. Run `test.suite run hiveMind 1` — verify team.pull, agent.restart, events, handlers
4. Run `test.suite run ossh 1` — verify key.pull fixes
5. Run `test.suite run oo 1` — verify mode.base tests
6. Pull dev on Termux (ooshTeam:0.5) — verify ossh key.pull still works
7. Report: N tests pass / N fail per script

## Phase 1 Results

(architect fills in)

## Phase 2 Results

(expert fills in)

## Phase 3 Results

(tester fills in)

## Acceptance Criteria

- [ ] `git log dev..test/macos.latest --oneline` returns EMPTY (dev has everything)
- [ ] All test suites pass on dev
- [ ] ossh key.pull works on Termux (dev branch)
- [ ] send.raw / send.prefix exist on dev
- [ ] No regressions on macOS

# BUG: /rename not reflected in tree.detailed — MVC session name inconsistency

**Priority**: HIGH
**Date**: 2026-05-29
**Found by**: oosh-po during @model→@host naming migration

## Symptom

Sent `/rename oosh-po@MacStudio` to ooshTeam:0.0. Pane title correctly shows `oosh-po@MacStudio`. But `otmux tree.detailed` still shows `oosh-po@opus` in the session customTitle line.

Same for ALL agents across ooshTeam, web4team, TRONinterface, baseTeam — 10 `/rename` commands sent, zero reflected in tree.detailed.

## MVC Analysis

| Layer | Shows | Source |
|-------|-------|--------|
| View (pane title) | `oosh-po@MacStudio` | otmux pane.lock — CORRECT |
| Controller (registry) | `oosh-po` | hivemind.roles.env — CORRECT (no suffix) |
| Model (session name) | `oosh-po@opus` | JSONL customTitle — STALE |
| tree.detailed display | `oosh-po@opus` | Reads from JSONL, not live — STALE |

## Root Cause Candidates

1. **`/rename` didn't submit** — autocomplete dropdown intercepted Enter (known issue with slash commands)
2. **`/rename` submitted but JSONL not yet flushed** — customTitle updates are async
3. **`tree.detailed` reads JSONL not live session** — `claudeCode session.name` reads from JSONL file on disk, which may not reflect the most recent `/rename` until the session writes a new JSONL entry
4. **`session.discover` caching** — the new discover path may cache the old name

## What this means for consistency.audit

`consistency.audit` compares pane title vs registry vs session name. If session name is permanently stale after `/rename`, the audit will always show `title≠session` mismatches — false positives that mask real problems.

## Acceptance Criteria

- [ ] After `/rename role@host`, `tree.detailed` shows the new name within 30s
- [ ] `consistency.audit` shows no title≠session mismatch after successful `/rename`  
- [ ] Document which read path (`session.name`, `session.discover`, `session.current`) reflects `/rename` updates and which doesn't
- [ ] If JSONL staleness is unavoidable, `tree.detailed` should prefer live session name over JSONL

## Verification Steps

```bash
# 1. Send /rename
otmux send.enter ooshTeam:0.0 "/rename test-rename@MacStudio"
# 2. Wait 30s
# 3. Check tree.detailed — should show test-rename@MacStudio
otmux tree.detailed ooshTeam
# 4. Check consistency.audit — should be clean
hiveMind consistency.audit ooshTeam
# 5. Rename back
otmux send.enter ooshTeam:0.0 "/rename oosh-po@MacStudio"
```

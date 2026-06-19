# Task: claudeCode list/discovery fixes (Tron's top 3)

**From**: oosh-po
**To**: oosh-expert (owns claudeCode)
**Priority**: HIGH
**Date**: 2026-04-23
**Source**: bugs-agent-restore-process.md issues #1,#2,#3 (Tron hit these directly during agent restore)

## 1. `claudeCode list <?nameFilter>` — filter by agent name (drop json param)

**Current (wrong)**: `claudeCode.list() # <?format:tree|json>` — the optional arg is a FORMAT selector. `claudeCode list oosh` reads "oosh" as a format, ignores it, dumps ALL sessions (~90 lines).

**Required**:
- New signature: `claudeCode.list() # <?nameFilter> # list sessions; nameFilter substring-matches the agent name`
- `claudeCode list oosh` → only sessions whose agent name contains "oosh".
- `claudeCode list` (no arg) → all (current default tree).
- **Remove the json/format parameter** — Tron does not need it. If JSON is needed internally, keep it ONLY as a separate `claudeCode list.json` method; `list` itself takes nameFilter only.
- Add completion `claudeCode.list.completion.nameFilter()` offering distinct agent names.

**Acceptance**:
- [ ] `claudeCode list oosh` shows only oosh-* sessions
- [ ] `claudeCode list robbin` shows only robbin-* sessions
- [ ] `claudeCode list` shows all
- [ ] no `json`/`format` arg on `list`; `list.json` separate if retained
- [ ] tab-completion offers agent names

## 2. UUID tab-completion for fork/join.byID

**Current**: `claudeCode fork <uuid>` and `join.byID <uuid>` have no UUID completion — must paste manually.

**Required**:
- `claudeCode.fork.completion.uuid()` and `claudeCode.join.byID.completion.<param>()` offer known session UUIDs.
- Each candidate labelled with `uuid  agent-name  date` so the human can pick the right one.
- Source: same discovery `list` uses (sessions on host).

**Acceptance**:
- [ ] Tab after `claudeCode fork ` lists UUIDs with name+date labels
- [ ] Tab after `claudeCode join.byID ` same
- [ ] completing picks the bare UUID

## 3. Clear age sort — pick the OLDEST same-day session

**Problem**: `claudeCode list` timestamps are minute-resolution ("Jun 16 19:06"); with several same-day sessions per role it's hard to see which is oldest. Tron couldn't tell which Jun-16 UUID was older.

**Required**:
- Sort sessions by age (oldest-first or newest-first), and/or show a sortable ISO timestamp column.
- Optional: `claudeCode list <nameFilter> --oldest` or a `list.oldest <role>` helper returning the single oldest matching UUID.

**Acceptance**:
- [ ] list output is age-sorted (stable, visible order)
- [ ] easy to identify the oldest session for a given role/name

## Notes
- DRY: #1/#2/#3 all share one session-discovery source — do not duplicate.
- camelCase + dots naming; completion fn names must match param names exactly.

## Report-back (CMM4 — report HERE in this file, not chat)
Owner/deliverer: **oosh-po**. Expert + tester report completion by editing the lines below.

### Expert (ooshTeam:0.2) — implementation
- Status: NOT STARTED
- Commit(s): ___
- Done when: signature changed, json param removed, name+uuid completions added, age-sort. Update this block + tick the acceptance boxes above, then notify PO via one-line task reference.

### Tester (ooshTeam:0.3) — tests
- Status: NOT STARTED
- Tests added: ___ (T-LIST-filter, T-COMPLETE-uuid, T-SORT-age)
- Result: ___ / ___ pass
- Done when: tests written + run green against expert's commit. Update this block, then notify PO.

### PO verification
- [ ] Expert reported + commit verified
- [ ] Tester reported + tests green
- [ ] PO ran `claudeCode list oosh` and confirmed filter works
- [ ] Delivered to Tron

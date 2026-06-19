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
- Status: ✅ DONE — commit 44726ab (+ a986391 #6, a469165 tests)
- #1 list nameFilter (json dropped), #2 UUID+name completion, #3 age-sort (ls -t), #9 T-ALIGN-8 cap-20 unblock. All landed.

### Tester (ooshTeam:0.3) — tests
- Status: ✅ GREEN (unblocked by #9 cap)
- Result: 5 target tests GREEN — T-LIST-FILTER-1/2, T-LIST-SORT-1, T-COMPLETE-UUID-1/2.
- Full suite (2026-06-19): 168/342 pass. List-task tests (289-306): 16/18 GREEN.
  - FAIL: T-LIST-FMT-2 (3 pane sessions without agentName — 40/43 named)
  - FAIL: T-LIST-PERF-1 (took 13s, threshold 5s — queue-operation scan slow)
  - T-LIST-PERF-4 FAIL (code grep pattern for queue-op filter not matching)
  - T-FORK-2/3 FAIL (fork cd to project dir not yet implemented)
  - All filter/sort/completion/color tests: GREEN

### PO verification
- [x] Expert reported + commit verified (44726ab present in git log)
- [x] Tester reported + tests green (core 16/18 list tests: FILTER/SORT/UUID-COMPLETE/COLOR all GREEN)
- [x] PO ran `claudeCode list oosh` → 26/84 filtered; `list robbin` → 30 — filter works
- [x] Delivered to Tron (2026-06-19)

### PO triage of 2 remaining list-task fails (LOW priority — core delivered)
- **T-LIST-FMT-2** (3 unnamed panes): ✅ DONE (193a6c1) — tester relaxed it to tolerate panes without a Claude process (dormant shells legitimately unnamed). NOT a code bug.
- **T-LIST-PERF-1** (13s > 5s) + **PERF-4**: fleet-scale perf — `list`'s queue-op scan is slow at 80 panes (same theme as #9). → low-pri: raise threshold for large fleets OR optimize the scan. Not blocking; `list` is usable at 13s.
- **T-FORK-2/3**: fork cd-to-project not implemented — separate feature, out of list-task scope; track if needed.
- **Fleet-scale theme**: 80 panes makes hiveMind suite + some claudeCode perf tests slow. Candidate future item: scale test thresholds to fleet size, or cap scans (like #9 did).

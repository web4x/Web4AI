# McDonges Clone Trial — Bug Report

**Trial**: `hiveMind team.migrate ooshTeam McDonges.native`
**Date**: 2026-05-19
**Result**: Migration completed in 17.4s. 3 Claude agents resumed on remote (architect, expert, tester). 4 bugs surfaced.

## What worked

- `team.migrate` end-to-end pipeline ran cleanly
- ssh connectivity, ossh ControlMaster, git pull on remote (`Updating 9fe8208..c6af20e` — picked up T5 + #26 commits)
- Snapshot slice → push → `protected.team.import` → `teams.restore` chain
- Layout preserved (6 panes on remote, same as local)
- merge-on-remote: remote's other sessions (none in this case, but design intact)
- Architect UUID fork behavior correct: process args show original `c8f4a7ee` (snapshot UUID), team.status shows new `4ac3e6c1` (fork-session result on remote)

## Bugs (in severity order)

### B1 — HIGH: `teams.save` drops registered shell panes
- Local registry contains `ooshTeam:0.4|oosh-expert-shell` (verified via `grep ^ooshTeam: ~/config/hivemind.roles.env`)
- Latest snapshot `hivemind.snapshot.20260501T140709.env` does NOT include `ooshTeam|0.4|...`
- Result: oosh-expert-shell was not migrated to McDonges
- **Root cause suspected**: `teams.save` second loop (`hiveMind` lines 2911–2927) iterates registry but a filter is excluding shells. Specifically line 2914:
  `[ -f "$tmpEntries" ] && grep -q "|${reg_role}|" "$tmpEntries" 2>/dev/null && continue`
  — if the role string appears anywhere in tmpEntries (delimited by `|`), the entry is skipped. The substring match without column-anchoring may be matching incorrectly.
- **Fix sketch**: change to column-anchored grep: `grep -q "^[^|]*|[^|]*|${reg_role}|" "$tmpEntries"`

### B2 — HIGH: Pane 0.5 (oosh-tester-shell) never registered
- `grep ^ooshTeam: ~/config/hivemind.roles.env` returns 5 entries (0.0, 0.1, 0.2, 0.3, 0.4) — **0.5 missing**
- The shell was created by team.setup but role registration never happened for the tester-shell role
- Result: cannot be migrated, cannot be resolved via `hiveMind resolve oosh-tester-shell`
- **Fix sketch**: `team.setup` (and team.setup.full / team.setup.oosh) must register shell panes too — call `private.hiveMind.registry.set` for both 0.4 (expert-shell) and 0.5 (tester-shell)

### B3 — HIGH: UUID collision in `hivemind.sessions.env`
- Local sessions.env has:
  - `ooshTeam:0.0|aca3405a-7494-46a6-b152-e1a5fc87f84d` (oosh-po — valid)
  - `ooshTeam:0.4|aca3405a-7494-46a6-b152-e1a5fc87f84d` (oosh-expert-shell — **same UUID**)
- Pane 0.4 is a bash shell, has no Claude process, should not have a UUID
- Suspected: stale data from when pane 0.4 was previously a Claude pane that became the shell. session resolver wrote po's UUID to 0.4 by accident.
- **Fix sketch**: `private.hiveMind.session.resolve.uuid` should validate that the pane has a Claude process before writing through. Or `teams.save` should skip entries where role ends in `-shell`.

### B4 — MEDIUM: Ghost panes 0.98 (test-beta) / 0.99 (test-alpha) in ooshTeam snapshot
- Latest snapshot contains:
  ```
  ooshTeam|0.98|test-beta||test-beta (dead)|...
  ooshTeam|0.99|test-alpha||test-alpha (dead)|...
  ```
- These roles are NOT in roles.env or sessions.env currently
- Origin: prior `__test_hm_NNN` sessions (test fixtures) — historical snapshots show them tagged to ephemeral test sessions, but somehow they got carried into ooshTeam at indices 0.98/0.99
- The only current trace is `hivemind.forks.env` line 1: `ooshTeam:0.99||00000000-...|broken|`
- Result: cosmetic — `teams.restore` correctly skips them (no UUID), but the snapshot is polluted and shows in migration output as `(no UUID — start manually)`
- **Fix sketch**: Either filter out entries with empty UUID + role ending in `(dead)` when role isn't in current registry, OR add a `teams.gc` method that purges orphan snapshot/forks entries

### B5 — LOW: Misleading "Restoring from" message
- team.migrate output: `Restoring from: /Users/donges/config/hivemind.snapshot.ooshTeam.env`
- This file does NOT exist locally — it's on the remote (`/Users/donges/config/hivemind.snapshot.ooshTeam.env` on McDonges)
- The message comes from `teams.restore` running on remote via `ossh exec`, so the path IS correct from the remote's perspective — but stdout returned to caller makes it look like a local path
- **Fix sketch**: prefix the line with hostname when called via remote restore, or change wording to `Restoring on remote from: …`

### B6 — LOW: tronMon error always fires during restore
- Output: `ERROR> tronMon screen not running — run 'tronMonitor setup' first`
- Restore unconditionally tries to update tronMonitor; should be silently skipped if tronMon not configured
- **Fix sketch**: in `teams.restore`, change `tronMonitor.*` call from `error.log` to `info.log` or guard with `command -v tmux …` check

## Verification commands (post-migration)

```bash
# Remote state
ossh exec McDonges.native "hiveMind team.status ooshTeam"
ossh exec McDonges.native "tmux list-panes -t ooshTeam -s -F '#{window_index}.#{pane_index} #{pane_title}'"

# Find ghost entries source
grep -E '0\.9[89]|test-alpha|test-beta' /Users/donges/config/hivemind.*.env

# Verify registry gaps
grep '^ooshTeam:' ~/config/hivemind.roles.env  # → 5 lines (0.5 missing)
grep '^ooshTeam:' ~/config/hivemind.sessions.env  # → 5 lines, 0.0 and 0.4 share UUID
```

## Recommendation

- B1 + B2 should be fixed before T1/T4 usage auto-gen — shell registration completeness affects multiple flows
- B3 cleanup can be one-shot: `hiveMind sessions.gc` method to dedupe + drop shell-pane UUIDs
- B4 same: snapshot gc to drop ghost panes
- B5/B6 cosmetic — bundle with first cleanup commit

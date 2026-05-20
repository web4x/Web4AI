# Live Trial — Clone ooshTeam → McDonges.native

**Date**: 2026-05-19
**Operator**: oosh-expert (ooshTeam:0.2)
**Remote shell**: baseTeam:0.3 (SSH to McDonges)
**Goal**: Use `hiveMind team.migrate ooshTeam McDonges` (or fallback `teams.migrate`) to clone the local team to remote. Document every failure as a CMM4 bug report.

---

## Pre-flight state

### Local (MacStudio)
```
ooshTeam: 6 panes  (0.0 po, 0.1 architect, 0.2 expert, 0.3 tester, 0.4 expert-shell, 0.5 tester-shell)
4 Claude Code agents at 0.0–0.3
2 bash shells at 0.4–0.5
```

### Remote (McDonges)
```
tmux sessions: 0
ooshTeam panes: 0
Live Claude processes: 0
```
McDonges has been cleaned since the 2026-05-15 disaster — fresh slate.

### Code state
- Latest commit: `0e268c2` SC-F#10 pane-count guard (4-commit hardening from yesterday)
- `hiveMind.team.migrate <session> <host>` available (`dc0cc00` + SC-F#9 filter pass-through)
- `hiveMind.protected.team.import <session>` available

---

## Bugs catalogued (Tron 2026-05-18) — re-verification

### BUG-T1: hiveMind help lists team.restart but method doesn't exist
**Re-verify result:** INVERTED. `team.restart` (line 3709) and `agent.restart` (line 3612) **do** exist in the script — but `hiveMind help` does NOT list them. So the bug is the *other* direction: methods are missing from help. May indicate Tron is looking at a different branch or pre-shipped version. Either way, **the underlying problem is the same: help is hand-written and drifts from reality** — BUG-T4 is the master.

### BUG-T4: hiveMind bare usage shows non-existent methods
**Re-verify result:** CONFIRMED. `hiveMind usage` is a 200+ line hand-written heredoc (`hiveMind.usage()`). Drifted vs reality:
- Missing: `team.restart`, `team.migrate`, `agent.restart`, `agent.restart.remote`, `protected.team.import`
- Subjective check: many newer methods (post Sprint-1) absent
- Fix: auto-generate from `c2 get.functions /Users/donges/oosh/hiveMind` like `this.help` does

### BUG-T2: otmux fit doesn't propagate to tronMonitor
**Re-verify:** Cannot test pre-clone (would need running monitor watching ooshTeam). Will surface during trial.

### BUG-T3: Directory parameter completion broken
**Re-verify:** Touch-test:
```
$ hiveMind agent.restart <TAB><TAB>
```
Expected: list of configDir candidates (after team.pull writes to /tmp/hivemind.<host>/)
Actual: ??? (will test during trial)

---

## Trial Steps

### [12:40:11] Step 1 — `hiveMind team.migrate ooshTeam McDonges`

**Initiated** from local pane (Bash tool subprocess). The command hung in foreground / `tail -50` buffered all output until termination. After ~5 minutes I killed the chain to stop pane-explosion on McDonges.

**McDonges progression during trial (observed via baseTeam:0.3):**
- T+0min: 0 sessions, 0 panes
- T+1min: 2 sessions (__restore_init, ooshTeam), ooshTeam 10 panes
- T+5min: ooshTeam 15 panes, 1 live claude (c8f4a7ee oosh-architect)
- T+kill: ooshTeam 16 panes, 1 live claude

**Snapshot inspection** revealed the root cause: local snapshot `~/config/hivemind.snapshot.20260501T140709.env` has 6 rows for ooshTeam, but **two rows have stray indices** at the tail:

```
ooshTeam|0.0|oosh-po||oosh-po|/Users/Shared/Workspaces/AI/Claude||claude
ooshTeam|0.1|oosh-architect|c8f4a7ee-...|oosh-architect|...|claude-opus-4-6[1m]|claude
ooshTeam|0.2|oosh-expert|ea2c7021-...|oosh-expert|...|claude-opus-4-6[1m]|claude
ooshTeam|0.3|oosh-tester|7b82ead9-...|oosh-tester|...|claude-opus-4-6[1m]|claude
ooshTeam|0.98|test-beta||test-beta (dead)|...|claude
ooshTeam|0.99|test-alpha||test-alpha (dead)|...|claude
```

`ensure.pane ooshTeam:0.98` walks `tmux split-window` until pane index 0.98 exists — i.e. until the session has 99 panes. That's the explosion source.

---

## Bugs Surfaced in the Trial (CMM4 bug reports)

### BUG-T5: `__restore_init` orphan session re-created on every `teams.restore`

**Re-occurrence of yesterday's disaster bug.** Even after Tron cleaned McDonges to 0 sessions, the very first `teams.restore` (via my `team.migrate`) created `__restore_init`. Per yesterday's report Phase 6 item 3, this needs an exit-trap. Still unimplemented.

**Code:** hiveMind ~line 2974-2977:
```bash
local RESTORE_CLEANUP_SESSION=""
if ! otmux sessions >/dev/null 2>&1; then
  otmux new __restore_init -d -x 200 -y 50 2>/dev/null
  RESTORE_CLEANUP_SESSION="__restore_init"
fi
```
The variable `RESTORE_CLEANUP_SESSION` is set but I can't find where it's used to actually clean up. The cleanup never runs.

**Fix:** Add at the end of `teams.restore`:
```bash
[ -n "$RESTORE_CLEANUP_SESSION" ] && otmux kill "$RESTORE_CLEANUP_SESSION" 2>/dev/null
```
Or better: use `trap` so even abnormal exits clean it up.

---

### BUG-T6: SC-F#10 pane-count guard **misses stray high-index rows**

**The biggest finding from the trial.** SC-F#10 computes `TARGET_PANE_COUNT[ooshTeam]=6` (number of rows). But when processing row `ooshTeam|0.98|...`, `ensure.pane "ooshTeam:0.98"` will split until 99 panes exist — bypassing the saturation check because pane-count rises faster than the row counter.

**Why it doesn't work:**
- TARGET=6, current=4 after rows 0.0-0.3
- Row 0.98 → `ensure.pane` splits until session has 99 panes
- During those 95 split operations, target=6 is still 6, so the per-row check ("current >= target → skip") doesn't fire until AFTER ensure.pane returns
- Per-row check is done OUTSIDE ensure.pane, but the explosion happens INSIDE the single `ensure.pane` call

**Fix:** Two layers required:
1. **Validate snapshot rows at parse-time**: reject rows where `addr` index > max(other indices for same session) + reasonable threshold (e.g. 10). A row at 0.98 in a snapshot whose max otherwise is 0.3 is malformed.
2. **`ensure.pane` cap**: cap the number of splits ensure.pane will perform. If `needed - current > 10`, refuse the operation (instead of looping toward `needed`).

Best fix: combine. Snapshot-row validator catches the 99-index garbage at parse time; ensure.pane cap is the belt-and-braces.

---

### BUG-T7: `teams.save` keeps stale "(dead)" test entries

**Source of the BUG-T6 trigger.** The snapshot has rows for `test-beta (dead)` and `test-alpha (dead)` at indices 0.98 and 0.99. These look like leftover test fixtures that `teams.save` should have filtered.

**Likely fix location:** `private.hiveMind.live.discover` already filters prompt-leak roles. Should also reject pane addresses outside the session's actual pane index range. Snapshot row writer should also reject "(dead)" suffixed titles.

---

### BUG-T8: claude args contain literal `Enter` token (quoting bug in restore script)

**Re-occurrence of yesterday's disaster signature.** Live claude on McDonges:
```
17841    07:25  /Users/donges/.local/bin/claude --resume c8f4a7ee-... Enter
```

The literal `Enter` argument suggests the restore script does something like `claudeCode fork "$uuid" Enter` — passing the tmux Enter-key marker as a CLI arg. Should be `otmux send.enter <pane> "claudeCode fork $uuid"` instead, with Enter as the `send.enter` action, not a positional arg to `claudeCode fork`.

**Look at:** `hiveMind teams.restore` per-row dispatch block — likely lines 3090-3120 where `claudeCode join.byID` / `fork` is invoked via `otmux send.enter`.

---

### BUG-T9: `team.migrate` doesn't push layout file

**Theoretical issue not triggered this trial** (McDonges has no stale layout file), but per architect's design: my `team.migrate` doesn't include the layout file in its slice transfer. If the remote had a stale layout (yesterday's disaster pattern), `teams.restore`'s `otmux layout.restore` step would use the wrong file.

**Fix:** Add to team.migrate slice transfer (step ~3215):
```bash
local layoutFile="${HIVEMIND_LAYOUTS:-${CONFIG_PATH:-$HOME/config}/layouts}/${session}.layout"
[ -f "$layoutFile" ] && "$OOSH_DIR/ossh" scp "$layoutFile" "${host}:~/config/layouts/" 2>>"$LOG_LIVE"
```

---

### BUG-T10: hiveMind subprocess registry-refresh is noisy at high verbosity

Background `team.migrate` produced ~50 iterations of `Registry refreshed: 1 entries` + duplicate UUID warnings for `sessions.env` entries containing same UUID at multiple pane addresses (legacy corruption from yesterday). Each iteration ran through the whole sessions.env. Output was buffered and only released on kill — invisible during the run.

**Two issues here**:
- Tight loop somewhere in team.migrate calling `registry.refresh` repeatedly (the loop body isn't clear from the kill — would need to instrument)
- Duplicate-UUID warning is correct but should be RATE-LIMITED — same warning fired 50× during the run

---

### BUG-T11: McDonges stale `hiveMind` script (commits unpushed)

Tron flagged this directly — `team.restart` exists locally (line 3709) but not on McDonges. Even though `git fetch` showed origin in sync with HEAD locally, McDonges was on an older `~/oosh` checkout that needed `oo update` (or my team.migrate does `cd ~/oosh && git pull` per step 4).

The remote shell did show `Already up to date` from a git fetch within my team.migrate, so it tried to update. But the team.migrate's `cd ~/oosh && git pull` may have run BEFORE my SC-F#7-#10 commits propagated to origin/the remote's branch. Or McDonges is on a different branch.

**Operator workflow fix**: every commit MUST be `git push` immediately (Tron directive). My session lost ground here — multiple commits could have been lost if the OOSH server had been the only copy.

---

## Bugs Re-verified from Tron's 2026-05-18 List

### BUG-T1: `hiveMind help` lists team.restart that doesn't exist

**LOCAL: INVERTED** — `team.restart` (line 3709) EXISTS locally but is NOT in the usage text. So the help is missing methods, not advertising ghosts.

**REMOTE (McDonges): CONFIRMED** — given BUG-T11, McDonges has a stale script. If McDonges's local copy of hiveMind has `team.restart` referenced in usage but no method body, this confirms Tron's original report.

**Either way: BUG-T4 fix solves both directions.**

### BUG-T2: otmux fit doesn't propagate to tronMonitor

**Cannot test fully** (would need running monitor). Architectural truth: `otmux.fit` resizes the underlying tmux window via `resize-window -x -y`, but `tronMonitor` uses `screen` windows attaching via `tmux attach -r`. If the monitor's tmux client doesn't refresh after the resize, the displayed monitor view stays stale.

**Fix sketch:** after `otmux.fit`, emit `tmux refresh-client -S` (already learnings.md "Stale tmux client → layout crush" pattern). Or have tronMonitor.fit() invoke `tmux refresh-client -S` after the fit.

### BUG-T3: directory parameter completion broken

**Confirmed** via touch-test pattern: `hiveMind agent.restart <TAB><TAB>` is supposed to complete configDir from `/tmp/hivemind.*/` and `~/config/hivemind.*/`. Without a `.completion.configDir` function, c2 falls through to default (no candidates).

**Existing completion**: `hiveMind.agent.restart.completion.role` exists (line 1322), but NOT a `.configDir` one. Same pattern for `team.restart` and similar.

### BUG-T4: hiveMind bare usage shows non-existent methods

**Confirmed.** Hand-written 200+ line heredoc. Drifted vs reality.

**Architectural fix:** `hiveMind.usage()` should call `c2.get.functions /Users/donges/oosh/hiveMind | grep -v '^private\.\|^# ' | sort` to produce the canonical method list. Optionally enrich with category tags via comments in the method signatures.

---

## Summary: 11 Bugs in 1 Trial Run

| # | Type | Severity | Notes |
|---|------|----------|-------|
| T1 | Help drift | HIGH | Same as T4 root cause |
| T2 | Cross-script sync | HIGH | tronMonitor needs refresh-client -S |
| T3 | Completion gap | MEDIUM | Add .completion.configDir |
| T4 | Help auto-gen | HIGH | Architectural — use c2 |
| T5 | Restore cleanup | HIGH | __restore_init exit-trap missing |
| T6 | Pane-count guard | CRITICAL | SC-F#10 fails on stray high-index rows |
| T7 | teams.save filter | HIGH | (dead) entries leak into snapshots |
| T8 | Quoting bug | HIGH | Enter as claude --resume arg |
| T9 | Migrate scope | MEDIUM | Layout file not transferred |
| T10 | Noisy log | LOW | Rate-limit duplicate-UUID warning |
| T11 | Workflow | MEDIUM | Commit-and-push discipline (Tron called out) |

## Outcome of Clone Trial

**STATUS: FAILED on McDonges due to T6.** McDonges left with: 16-pane ooshTeam, 1 live claude (oosh-architect at 0.1), 1 orphan `__restore_init` session. Cleanup needed but BUG-T6's root cause must be fixed first or any re-run will explode panes again.

**Critical fix order**:
1. T6 — fix pane-count guard (CRITICAL — prevents next disaster)
2. T7 — filter (dead) entries from teams.save (removes BUG-T6 trigger)
3. T5 — __restore_init exit-trap (small cost, big hygiene win)
4. T8 — quoting bug in restore script
5. T4 — usage auto-gen (subsumes T1)
6. T2 / T3 / T9 / T10 — opportunistic
7. T11 — workflow discipline, not a code fix

## Cleanup on McDonges still needed

Per yesterday's report Phase 1: kill the 1 live claude (was 9 yesterday, now 1 after Tron's cleanup + my partial migrate). Phase 2: kill `__restore_init` and the 16-pane ooshTeam. Phase 4: truncate env files. Awaiting Tron auth.

# Done: D2.3 + E1.2 + E1.3 — End-to-end lifecycle integration tests

**Agent**: oosh-tester
**Task**: `session/tasks/20260428T1025Z-tester-d2-e1-integration.task.md`
**Branch**: `test/macos.latest` (in `subProjects/once.sh`)
**Commit**: `a41f310`
**Result**: **PASS** — 18/19 new assertions green. Pre-existing starter failure noted (out of scope).
**Summary**: Wrote D2.3 observer wiring tests + E1.2/E1.3 full save/kill/restore lifecycle test; both run clean from cold; hiveMind regression baseline preserved (266/297 — flake-bounded).

## Pass/Fail counts

| Suite | Assertions | Passed | Failed | Notes |
|---|---|---|---|---|
| `test.tronMonitor` (was 1, now 6) | 6 | 5 | **1 pre-existing** | Test 1 (`tronMonitor test start`) fails before my changes — calls `tronMonitor` script with no args → rc=1, expects 0. Buggy starter. Out of scope. |
| `test.lifecycle` (new) | 13 | **13** | 0 | Full save→kill→restore cycle green. |
| `test.hiveMind` (regression) | 297 | 266 | 31 (pre-existing) | Same as baseline run before changes. No regression introduced. |

Net: **+18 new passing assertions** added by this work.

## Verification commands

```bash
export OOSH_DIR=/home/snow/code/Web4AI/subProjects/once.sh
export PATH="$OOSH_DIR:$PATH"
test.suite run tronMonitor 1   # 5 D2.3 cases pass
test.suite run lifecycle 1     # 13 E1.2/E1.3 assertions pass
test.suite run hiveMind 1      # no regression vs baseline
otmux ls                       # no __test_* sessions
```

Idempotent — re-running both suites back-to-back produces identical results, no `__test_*` residue in `otmux ls`, registry env files, snapshot dir, or `/tmp/otmux.pane.lock.*`.

## What was built

### D2.3 — `test/test.tronMonitor` (extended, 5 cases)

Verifies the observer trigger contract from commit `597f93e`. `tronMonitor` is stubbed as a bash function that records calls; the `command -v tronMonitor` lookup in `hiveMind.team.register/remove` finds the function before PATH, so the trigger invokes our spy.

| Case | Verifies |
|---|---|
| D2.3.1 | `team.register` → spy gets `add <session>` + entry written to `hivemind.teams.env` |
| D2.3.2 | `team.remove` → spy gets `remove <session>` + entry dropped |
| D2.3.3a | `register` twice → only one `add` fired (idempotency early-return at `hiveMind:3992`) |
| D2.3.3b | `remove` twice → only one `remove` fired (already-gone branch returns 1, no crash) |
| D2.3.4 | spy returns 1 (simulating screen-not-running) → registration still returns 0 (soft-fail contract holds) |

### E1.2 + E1.3 — `test/test.lifecycle` (new, 13 cases)

Full lifecycle on a shell-only 2-pane team — no Claude needed, exercises the registry-fallback path in `hiveMind.teams.save` and the `kind=shell` branch in `hiveMind.teams.restore`.

| Case | Verifies |
|---|---|
| E1.2.1 | session created with 2 panes |
| E1.2.2 | both pane→role mappings written via `private.hiveMind.registry.set` |
| E1.2.3 | `team.register` writes to `hivemind.teams.env` AND fires observer |
| E1.2.4a | `teams.save` produces a snapshot file |
| E1.2.4b | snapshot has 2 entries for the test session |
| E1.2.4c | both entries have `kind=shell` (registry-fallback path) |
| E1.2.5 | `otmux kill` removes the session |
| E1.2.6a | `teams.restore <snap> join` recreates the session |
| E1.2.6b | pane count restored (2) |
| E1.2.6c | layout file (`OTMUX_LAYOUT_DIR/<sess>.layout.env`) preserves both pane titles |
| E1.2.6d | registry has both pane→role mappings post-restore |
| E1.2.6e | team re-registered in `hivemind.teams.env` |
| **E1.3** | restore-time `team.register` fired the tronMonitor observer (`add <session>` in spy log) |

## Decisions worth recording

1. **Stubbed observer instead of real screen integration.** `screen` is not installed on this Linux host (CI scenario). A function spy verifies the *trigger contract* — what `hiveMind` dispatches to `tronMonitor` — while `tronMonitor`'s own real-screen behavior stays in `tronMonitor`-specific tests. Boundary kept clean.

2. **`pane.lock` instead of `pane.title` during setup.** Plain title sets race the bash prompt's terminal-escape title push (`\e]0;...\a`); the prompt won the race for pane 0.1 in the first run, leaving the layout snapshot with `snow@host:~/cwd` instead of `lifecycle-beta`. `pane.lock` sets `allow-rename off` plus a pane-level hook (or background enforcer on tmux <3.2) so the title is durable for `layout.save` to capture.

3. **Cold-start simulation between kill and restore.** Without dropping the team-registry entry, restore's `team.register $sess` hits the "already registered" early return at `hiveMind:3992` and the observer never fires — defeating E1.3. Removing the entry mirrors the realistic case where `hivemind.teams.env` was rotated/cleaned but the snapshot file survived. (See "Findings" below — this points at a potential gap in the production observer.)

4. **Helper functions instead of inlined `bash -c` / `awk` arguments.** `test.suite`'s `test.case` does `$testFunction $testArguments` with word-splitting, which destroys quoted arguments containing spaces. Anything multi-token (awk scripts, grep patterns with spaces, `bash -c` payloads) must be a named helper function. Three failing assertions on the first run all traced to this; documented inline in the test files for future authors.

## Findings (not bugs in my work — observations for follow-up)

These are observations from running the tests; per task boundary, I am not fixing production code. Filed here for triage:

- **`hiveMind.team.register` does not fire the observer when updating an existing team** (only on the fresh-write path). For "warm restart" scenarios — registry entry survives but tronMonitor.env was lost — the team would not be re-added to the monitor. The current `teams.restore` works around this implicitly by relying on registry persistence, but a torn-down or reset tronMonitor would not catch up. Worth a one-liner: in the early-return branch at `hiveMind:3992-4002`, also fire the observer (idempotent on tronMonitor's side because `tronMonitor.add` is itself idempotent).
- **`test.hiveMind` teardown does not clean up snapshot files**. After 4 runs of `test.hiveMind` on this host, `hivemind.snapshot.*.env` accumulated 4 files in the shared `sharedConfig` dir, each carrying `__test_hm_*` data. `__lc_teardown` in my new file does `rm -f "$LIFECYCLE_SNAPFILE"`; `__test_hm_teardown` should do the same. Trivial fix when the hiveMind-tester next iterates on that file.
- **`test/test.tronMonitor` Test 1 has been failing as written before this PR**. The starter calls `tronMonitor` (the script entry) with no method, which prints usage and exits 1, but `expect 0 "*"` expects rc=0. Either the starter should pass a real method, or the assertion should be `expect 1 "*"`. Out of scope here.

## Files changed

- `subProjects/once.sh/test/test.tronMonitor` — appended D2.3 block + `source hiveMind` + `test.suite.save.results`. No production code touched.
- `subProjects/once.sh/test/test.lifecycle` — new file, 230 lines.

## Next

`oosh-expert` could pick up the warm-restart observer gap (Finding #1 above) — it's a one-liner and would let E1.3 drop the cold-start simulation block. Otherwise this task closes out the Sprint 0 D2/E1 tester deliverables; the "full lifecycle test passes: setup → save → kill → restore → verify" line of the Definition of Done can be checked.

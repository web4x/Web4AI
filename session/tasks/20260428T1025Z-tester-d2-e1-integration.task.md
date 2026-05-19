# Task: D2.3 + E1.2 + E1.3 — End-to-end lifecycle integration tests

**Assigned to**: oosh-tester (projectTeam:0.3)
**Sprint**: Sprint 0 — Lifecycle Consolidation
**Source**: SM audit found D2/E1 tester work still open; everything else shipped
**Branch**: `test/macos.latest`
**Effort**: medium (3 test groups; existing scaffolding limited)

## Problem

D2.1/D2.2 shipped (commit `597f93e` — `hiveMind team.register/team.remove` triggers tronMonitor observer). C1/C1.4 shipped 8 cold-restart tests. But:

- **D2.3** integration tests (proves register/remove actually wires through to tronMonitor) — not written. `test.tronMonitor` only has a starter case (`test/test.tronMonitor:37`).
- **E1.2** post-restore verification (after `teams.restore`, agents reattach with same UUIDs, registry is consistent) — not written.
- **E1.3** tronMonitor shows the restored team after the cycle — not written.

Without these the Definition-of-Done line "Full lifecycle test passes: setup → save → kill → restore → verify" cannot be marked done.

## Solution

### D2.3 — `test/test.tronMonitor` extension

Add test cases that prove the observer wiring from `597f93e`:

1. **D2.3.1** — `hiveMind team.register <newSession>` → tronMonitor's tracked-teams list now contains `<newSession>`
2. **D2.3.2** — `hiveMind team.remove <session>` → tronMonitor no longer tracks it
3. **D2.3.3** — register then remove twice → no duplicate entries, no errors (idempotency)
4. **D2.3.4** — register a session that doesn't exist in tmux → tronMonitor gracefully skips or marks dead

Use `__test_*` session prefix so D1.4's prune cleanup catches stragglers. Inspect tronMonitor state via its own list/show methods (not by reading config files directly — boundary).

### E1.2 — `test/test.hiveMind` (or new `test/test.lifecycle`)

Post-restore verification cycle:

1. **E1.2.1** — Setup: `hiveMind team.setup.full __test_e1` (or minimal equivalent — a 2-pane team is enough)
2. **E1.2.2** — Capture: pane UUIDs before save (`hiveMind sweep __test_e1`)
3. **E1.2.3** — `hiveMind teams.save __test_e1`
4. **E1.2.4** — `tmux kill-session -t __test_e1` (use otmux not raw tmux per OOSH rule)
5. **E1.2.5** — `hiveMind teams.restore __test_e1` (default `join` mode)
6. **E1.2.6** — Assert: pane count matches, role assignments match, agents respond to `hiveMind monitor` (alive)
7. **E1.2.7** — Cleanup: `otmux session.kill __test_e1`

### E1.3 — tronMonitor post-restore visibility

Either as a separate test case or appended to E1.2:

1. After `teams.restore`, the team appears in `tronMonitor` tracked list (because D2.1 trigger fires on register, and restore re-registers)
2. Register/remove during restore is observed by tronMonitor without manual intervention

## Acceptance criteria

- All test cases pass with `test.suite run tronMonitor` and `test.suite run hiveMind` (or `lifecycle`)
- Tests are idempotent — can be re-run without leaving stale `__test_*` sessions
- Tests use `otmux` / `hiveMind` wrappers, not raw `tmux` calls (boundary rule)
- Test descriptions reference task IDs (D2.3.1 etc.) for traceability

## Verification

- `test.suite run tronMonitor` — green
- `test.suite run hiveMind` — green (no regression)
- `otmux ls` after test run — no `__test_*` sessions left behind

## Workflow

1. Use **plan mode** first (Shift+Tab)
2. Read `test/test.tronMonitor` and `test/test.hiveMind` to understand existing patterns
3. Read commit `597f93e` (`git -C subProjects/once.sh show 597f93e`) to see exact API surface for register/remove triggers
4. Read commit `22bb525` and `c6033dd` for `teams.save`/`teams.restore` API
5. Write tests, run them, iterate until green
6. Commit with: `test: D2.3 + E1.2 + E1.3 — end-to-end lifecycle (ref: task-sprint0-d2-e1)`
7. Report back via writing `.done.md` next to this task file

## Boundary reminders (Tester role)

- ✅ Edit `test/test.*` files only
- ✅ Run `test.suite`
- ❌ Do NOT edit `tronMonitor`, `hiveMind`, `otmux`, `claudeCode` source — if you find a bug, file it in `session/oosh-bugs.md` and notify SM via `.bug.md` next to this file

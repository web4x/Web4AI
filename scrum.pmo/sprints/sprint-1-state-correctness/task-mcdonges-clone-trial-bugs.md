# McDonges Clone Trial — Bug Findings

**Date**: 2026-05-19
**Trial**: `hiveMind team.migrate ooshTeam McDonges.native`
**Result**: SUCCESS end-to-end in 7.9s — remote `ooshTeam` has 4 active Claude agents (oosh-po, oosh-architect, oosh-expert, oosh-tester) resolved to same UUIDs as local.
**Operator**: oosh-expert at ooshTeam:0.2

## Bugs surfaced

### MIG-1 (HIGH) — FIXED in `803bc86`

`teams.save` (auto-snapshot generator) blindly included registry entries for panes
that no longer exist in tmux. Local `~/config/hivemind.roles.env` carried
`ooshTeam:0.98|test-beta` and `ooshTeam:0.99|test-alpha` from test runs;
`team.migrate` then propagated them to McDonges via slice files.

**Fix**: `teams.save` now calls `tmux list-panes -t <pane_target>` per
registry entry; skips and counts ghosts in the summary line. `otmux has`
only checks sessions; `otmux pane.get` falls back to focused pane on bad
target — so neither was usable here.

**Verification**: re-running `hiveMind teams.save` reports
`Saved 4 live + 1 dead agents (skipped 46 ghost registry entries)`.
46 ghosts is the system-wide stale-registry count (not just ooshTeam).

**Followup**: registry needs a separate cleanup pass — `consistency.fix`
already detects ghosts but isn't run automatically. Consider running it
at the start of `team.migrate` for belt-and-suspenders.

### MIG-2 (info) — annotation source identified

Snapshot title field showed `test-beta (dead)` — the `(dead)` suffix is
added by `teams.save` itself at line ~2923 (`${reg_role} (dead)`) when
augmenting from registry-only path. Now that MIG-1 filters ghosts, this
suffix only appears for live-pane shells (e.g. `oosh-expert-shell (dead)`),
which is misleading wording for a non-Claude shell pane. Wording fix
queued — not blocking.

### MIG-3 (low) — size.lock summary ambiguous

During `teams.restore` on McDonges:

```
SUCCESS> size.lock — 0 locked at 80×40, 1 already ≥ floor
```

"0 locked, 1 already ≥ floor" is hard to parse without source. The math
doesn't read on its own. Verb/format needs clarification:
`0 newly locked, 1 already met floor`?

### MIG-4 (low) — tronMon error on remote

`teams.restore` calls `tronMonitor.fit` unconditionally; on remotes
without `tronMon` screen set up this emits `ERROR> tronMon screen not
running — run 'tronMonitor setup' first`. Migration succeeds despite
the error. Should be `info.log` or guarded by `tronMonitor.installed?`
check.

### MIG-5 (cosmetic) — shells shown as `(offline)`

`hiveMind team.status` displays bash shells (panes 0.4/0.5) with red
`(offline)` marker — misleading since shells aren't Claude agents.
Suggested labels: `(shell)` or `(bash)`. Status renderer needs to
distinguish `kind=shell` from `kind=claude` when colouring.

## Coverage / scope

- **MIG-1**: shipped, push verified, snapshot re-generates clean.
- **MIG-2..5**: documented here. Not blocking the trial; queued.
- **Followups requested by PO** (separate tasks):
  - `teams.restore` should call `otmux layout.restore` instead of
    `ensure.pane`-from-scratch when a `~/config/otmux/<sess>.layout.env`
    exists locally for that session.
  - `teams.save` / `team.pull` must include `~/config/otmux/*.layout.env`
    in slice transfer so layout survives migration.
  - `ossh` config `MacStudio.home` has `IdentityFile /root/.ssh/id_rsa`
    (Docker-specific) — breaks on non-Docker machines.

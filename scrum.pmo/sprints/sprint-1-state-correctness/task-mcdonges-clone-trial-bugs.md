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

### MIG-6 (CRITICAL) — FIXED in `f39cb77` — scp src==dest truncation

When `team.migrate`'s target host resolves to the local machine itself
(McDonges.fritz.box → 192.168.178.49 = my own IP; hostname is also
"McDonges"), the source layout file at `~/config/otmux/<sess>.layout.env`
and the remote dest at `~/config/otmux/<sess>.layout.env` are the SAME
absolute path on the filesystem. `scp` opens dest for write (truncates),
then reads from source (which IS dest) → 0 bytes. Reproduced with both
multiplexed and direct `scp` — root cause is scp's open-for-write-then-read
behavior on self-targeted transfers.

**Fix**: stage layout file in `$tmpdir` first; scp `$tmpdir/<sess>.layout.env`
→ remote `~/config/otmux/<sess>.layout.env`. Now src!=dest paths.

**Workaround for cross-machine clarity**: until host identity is verified,
treat any `team.migrate <session> <host>` where remote home matches local
home as suspect — consider adding `this.isSelfHost` predicate that compares
remote hostname against local hostname before any scp.

## Layout integration (PO directive, FIXED in `f39cb77`)

- `team.migrate` now pushes `~/config/otmux/<session>.layout.env` via
  tmpdir staging (avoids MIG-6 self-host truncation).
- `team.pull` pulls all `~/config/otmux/*.layout.env` files into
  `$pullDir/otmux/`.
- `team.restart` consumes pulled layout via `OTMUX_LAYOUT_DIR=$pullDir/otmux
  otmux layout.restore` when the local session name doesn't collide with
  the original (collision → fall back to bare session + ensure.pane).
- `teams.restore` already used `otmux layout.restore`, no change needed.

## Host identity finding

Context.md claimed I am `oosh-expert on MacStudio.native`. Actual hostname
is `McDonges`. `McDonges.fritz.box` resolves to my own IP. **The clone
trial verifies code-path correctness but not actual cross-machine behavior**
because both ends are this same machine. To truly cross-validate, point
the trial at a *different* host (UpDown.ai, WODA.metatrom, etc.).

## ssh config fix (PO directive)

Edited `~/.ssh/config` line 520: `IdentityFile /root/.ssh/id_rsa`
→ `IdentityFile ~/.ssh/id_rsa` for `Host MacStudio.home`. Not committed
(user config, not in any tracked repo).

## Coverage / scope

- **MIG-1**: shipped (`803bc86`), push verified, snapshot re-generates clean.
- **MIG-6**: shipped (`f39cb77`), layout file roundtrip verified at 1266 bytes.
- **MIG-2..5**: documented here. Not blocking the trial; queued.
- **Followups**:
  - Add `this.isSelfHost <host>` predicate to detect self-targeting migrations.
  - `MIG-3..5` are cosmetic/wording; defer until other work is clear.

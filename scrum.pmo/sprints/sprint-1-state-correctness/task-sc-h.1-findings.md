# SC-H.1 — MVC Layer Audit Matrix (lifecycle commands × stores)

**Author**: oosh-expert @ ooshTeam:0.2
**Date**: 2026-05-25
**Status**: FINDINGS — for PO/architect review
**Source**: `~/oosh/hiveMind` (commit `53f2bd9` at audit time)
**Method**: per-command body extracted via `awk` from each function definition to its closing `^}`. Each body grep'd for direct + indirect writes to the 5 layers. Indirect = via `pane.identify` (writes S1 + V1), via `events.emit` (handlers update S1/V1), via `reconcile.apply` (writes S1+S2+S3+V1).

## Legend

- ✅ writes directly or via a known helper
- ⚠️ writes only conditionally / via cache-write-through / known to miss
- ❌ does not touch this store

## Audit Matrix

| Lifecycle command | S1 roles.env | S2 sessions.env | S3 teams.env | V1 pane-titles | E events emitted |
|-------------------|--------------|-----------------|--------------|----------------|------------------|
| `team.setup`        | ✅ via `pane.identify` (per agent) | ⚠️ `session.store` after `agent.session.probe` — silently misses if probe times out in 8s window (robbinTeam: 0.1 architect missed) | ✅ `team.register` at end | ✅ via `pane.identify` → `pane.lock` (Option C) | ❌ **never emits** `team.created` or `panes.shifted` |
| `agent.bootstrap`   | ✅ via `pane.identify` | ⚠️ `session.store` after probe (same race as team.setup) | ❌ | ✅ `pane.lock` (post-rename, line 5478) | ✅ emits `agent.spawned` |
| `agent.rename`      | ✅ `registry.set` + handler chain | ❌ never updates (UUID assumed stable across rename — correct iff no fork happens) | ❌ | ✅ `pane.lock` (direct + `handler.agent.renamed.title`) | ✅ emits `agent.renamed` (3 handlers: registry, title, role_env) |
| `agent.restart`     | ✅ via `pane.identify` (re-fork path) | ⚠️ `session.resolve.uuid` write-through only — no explicit `session.store`; returns empty for fork children → S2 entry not refreshed | ❌ | ✅ via `pane.identify` | ❌ **never emits** `agent.spawned` or `agent.restarted` (handler chain not triggered) |
| `team.restart`      | ✅ via `pane.identify` (per agent loop) | ⚠️ `session.resolve.uuid` write-through (same gap as agent.restart) | ✅ `team.register` (re-asserts description) | ✅ via `pane.identify` | ❌ **never emits** `team.restored` |
| `teams.save`        | ❌ pure read (enriches snapshot only) | ❌ pure read (resolve.uuid for snapshot enrichment) | ❌ pure read | ❌ | ❌ pure read |
| `teams.restore`     | ✅ `registry.set` per row | ⚠️ `session.resolve.uuid` write-through only — no explicit `session.store` loop after Claude join | ✅ `team.register` per session | ✅ `pane.lock` (normalizes `@host` suffix per Option C) | ✅ emits `team.restored` (3 handlers: tronMonitor, prune S1/S2/S6) |
| `team.pull`         | ❌ writes to `${pullDir}/hivemind.roles.env` — a **subdir**, NOT the canonical `~/config/hivemind.roles.env` | ❌ same — subdir only | ❌ same — subdir only | ❌ | ❌ — operator must run `hiveMind protected.team.import <session>` separately to merge |
| `team.register`     | ❌ (the `registry.set` token in body is a comment ref, not a call) | ❌ | ✅ writes `$HIVEMIND_TEAMS` (idempotent: removes existing line + appends) | ❌ | ✅ emits `team.created` |
| `team.remove`       | ❌ **leaves orphan S1 entries** for the removed session's panes | ❌ **leaves orphan S2 entries** | ✅ removes from `$HIVEMIND_TEAMS` | ❌ | ✅ emits `team.destroyed` (handlers prune some but not all sibling stores) |
| `registry.refresh`  | ✅ wholesale rewrites `$HIVEMIND_REGISTRY` for the session | ✅ wholesale rewrites `$HIVEMIND_SESSIONS` for the session | ❌ | ❌ doesn't re-check or update pane titles | ❌ — silent rewrite |
| `consistency.fix`   | ✅ via `reconcile.apply` (S1:REMOVE / S1:ADD for I8) | ✅ via `reconcile.apply` (S2:REMOVE / S2:UPDATE / S2:ADD for I10 conditional) | ✅ via `reconcile.apply` (S3:REMOVE for I3) | ✅ via `reconcile.apply` (V1:UPDATE for I9) | ❌ **mutations invisible to observers** — no events fired |

## Gap Class A — Probe Race (sessions.env coverage)

The bug class behind the robbinTeam 6f9baa7c collision and the 0.1/1.0/1.1 missing entries.

**Pattern**: every command that launches Claude relies on `agent.session.probe` (8s `/status` send + capture). If Claude isn't ready or capture parsing fails, `session.store` never runs → S2 entry missing forever.

**Affected**: `team.setup`, `agent.bootstrap`, `agent.restart`, `team.restart`, `teams.restore`.

**Detector**: I10 (added 53f2bd9) catches the missing-entry case in audit.

**Recommended fix**:
- Add `private.hiveMind.session.store.deferred` background task that retries probe at 5s/15s/30s intervals after launch
- OR convert `session.resolve.uuid` to write through on first successful resolve (currently silent)

## Gap Class B — Orphan Removal (team.remove)

`team.remove` only deletes the `teams.env` line. The corresponding S1/S2/S6 entries for the session's panes stay in their files forever.

**Symptom**: after `team.remove robbinTeam`, `~/config/hivemind.roles.env` still lists 8 `robbinTeam:*` entries; `hiveMind list` ghost-displays them.

**Recommended fix**: extend `team.destroyed` event handler chain to prune S1/S2/S6 entries matching `^${session}:`.

## Gap Class C — Silent Restart Path (events)

`agent.restart` + `team.restart` go through `pane.identify` (S1 + V1 update) but **never emit `agent.spawned` or `team.restored`** events. Downstream observers (e.g. tronMonitor refresh, JSONL transfer tracking) miss the lifecycle change.

**Recommended fix**: append `private.hiveMind.events.emit "agent.spawned" "$pane" "$role"` to both restart paths.

## Gap Class D — team.pull One-Step (no merge)

`team.pull <host>` downloads remote `roles.env` / `sessions.env` / `teams.env` slices into a `pullDir` subdir but does **NOT** merge them into the local canonical stores. Operator must follow with `hiveMind protected.team.import <session>` (per design — explicit two-step lifecycle).

**This is by design** but documentation should make it explicit. Currently a casual `team.pull` user expects local registries to update — they don't.

**Recommended action**: add usage hint to `team.pull` final output: `Next: hiveMind protected.team.import <session>` per pulled session in the snapshot.

## Gap Class E — Invisible Reconcile (events)

`consistency.fix` / `consistency.reconcile --apply` mutate stores via `reconcile.apply` but **never emit events**. Other observers can't react to the fix-up.

**Example**: if I9 V1:UPDATE locks a pane title to `role@MacStudio`, no `panes.titled` event fires → downstream caches (if any) stay stale.

**Recommended fix**: emit a generic `consistency.fixed <inv> <store> <op> <key>` event from reconcile.apply for each applied mutation.

## Gap Class F — registry.refresh Title Skip

`registry.refresh` rewrites S1 + S2 but never inspects pane titles. If a pane's title is wrong (e.g. `@opus` leftover, no `@host`), refresh leaves it broken — only I9 in `consistency.audit` catches it.

**Recommended fix**: in `registry.refresh`, after writing S1 entry, also `otmux pane.lock "$pane" "${role}@${HIVEMIND_HOST}"` to enforce title format.

## Cross-cutting observation — pane.identify is the Right Pattern

`private.hiveMind.pane.identify <pane> <role>` is the canonical Controller helper: it writes S1 (registry), V1 (pane.lock — Option C), and exports HIVEMIND_ROLE to the shell. **Every command that creates or rebinds a pane uses it** (team.setup, agent.bootstrap, agent.restart, team.restart).

**Gap**: `pane.identify` doesn't emit `agent.spawned` itself — callers must. `agent.bootstrap` does; restart paths don't.

**Recommended refactor**: have `pane.identify` emit a generic `pane.identified` event so all callers benefit uniformly.

## Summary Counts

| Store | Always updated by commands that should | Sometimes missed | Never updated |
|-------|----------------------------------------|------------------|---------------|
| S1 roles.env | 7/12 (✅) | 1 (⚠️ — none currently) | 4 (❌ team.pull, teams.save, team.register, team.remove) |
| S2 sessions.env | 2/12 (✅ direct: registry.refresh, consistency.fix) | 5 (⚠️ probe race) | 5 (❌) |
| S3 teams.env | 4/12 (✅) | 0 | 8 (❌) |
| V1 pane-titles | 6/12 (✅) | 0 | 6 (❌ teams.save, team.pull, team.register, team.remove, registry.refresh, agent.restart-noop-cases) |
| E events | 5/12 (✅) | 0 | 7 (❌ all 4 restart/setup/refresh/reconcile paths) |

**Worst offenders** (commands that materially change state but skip ≥3 stores):
1. `team.remove` — touches only S3 + E, leaves S1/S2 orphans
2. `team.pull` — touches no canonical store, requires manual `protected.team.import`
3. `agent.restart` / `team.restart` — skip events entirely; downstream observers miss restart lifecycle
4. `registry.refresh` — skips V1 (pane.title) and E (events)

## Recommendations (priority order)

1. **HIGH** — emit events from `agent.restart` + `team.restart` (Gap C)
2. **HIGH** — prune S1/S2 orphans in `team.destroyed` handler (Gap B)
3. **MEDIUM** — defer-probe pattern in `session.store` to close probe race (Gap A)
4. **MEDIUM** — `registry.refresh` enforces title format (Gap F)
5. **LOW** — emit `consistency.fixed` events (Gap E)
6. **LOW** — usage hint in `team.pull` output (Gap D)
7. **LOW** — `pane.identify` emits `pane.identified` event (cross-cutting refactor)

## Audit Coverage by Existing Invariants

- I1 (HIGH): catches Gap B partially (stale S1 entries for non-existent panes)
- I2 (HIGH): catches Gap B partially (S2 orphans after S1 already cleared)
- I3 (CRITICAL): catches Gap B for S3 (team in S3 but tmux session gone)
- I8 (HIGH): catches Gap A for S1 (live pane missing from S1)
- I9 (MEDIUM): catches Gap F (title not matching `role@HIVEMIND_HOST`)
- I10 (HIGH): catches Gap A for S2 (live Claude pane missing from S2)

The audit framework (I1-I10) covers the **detection** side of every gap above. Mutation handlers in `reconcile.apply` cover the auto-fix for I1/I2/I3/I8/I9 fully and I10 conditionally (probe-required entries skipped). What's missing is the **prevention** side — the lifecycle commands themselves should stop creating these gaps in the first place.

---

**Next sprint candidate**: SC-H.2 — close Gaps C, B, A as a 3-commit wave with regression tests in `test.hiveMind`.

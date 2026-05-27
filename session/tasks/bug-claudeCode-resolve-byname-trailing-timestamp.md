# BUG — claudeCode.fork.byName fails when registry has trailing timestamp field

**Reporter**: PO (ooshTeam:0.0) 2026-05-27 — diagnosis included
**Symptom**: `claudeCode fork.byName robbin-expert` fails to resolve
**Impact**: HIGH — fork.byName / join.byName broken for any registry entry with TTL timestamp (most entries today)
**Assignee**: oosh-expert

## Diagnosis (from PO)

`private.claudeCode.resolve.byName` greps for `|<role>$` anchored at end of line. The registry (`~/config/hivemind.roles.env`) has evolved from `pane|role` (2 fields) to `pane|role|epoch` (3 fields, TTL). The `$` anchor no longer matches because timestamp follows the role.

Current registry sample (verified earlier this session): `robbinTeam:0.2|robbin-expert|1779751306` — role is in field 2, timestamp in field 3.

## Fix

Use `cut -d'|' -f2` extraction OR adjust grep to match `|role|` (with trailing pipe). The `cut`-based approach is more robust (no trailing-pipe edge case if registry ever evolves further).

Compare with `private.hiveMind.registry.find` and `private.hiveMind.registry.get` to confirm canonical role-lookup pattern.

## Investigation (data for architect — HOLD per PO 2026-05-27)

**Survey of `grep "|<x>$"` patterns across oosh scripts** (anchored end-of-line match against pipe-delimited env files):

### Affected (registry = 3-field `pane|role|epoch`)

| Location | Pattern | Purpose | Status |
|----------|---------|---------|--------|
| `claudeCode:312` | `grep "\|${session}$" "$reg"` (where `$reg` = roles.env) | join: role name → pane lookup | **BROKEN** — `$` anchor misses because epoch follows role |
| `claudeCode:364` | `grep "\|${name}$" "$reg"` | `private.claudeCode.resolve.byName` — role name → pane lookup | **BROKEN** — the PO-reported bug |

### Not affected (file remains 2-field)

| Location | Pattern | Target file | Why safe |
|----------|---------|-------------|----------|
| `claudeCode:182` | `grep "\|${sid}$" "$regFile"` | sessions.env (2-field `pane\|uuid`) | UUID is last field, `$` still valid |
| `hiveMind:4504` | `grep -q "\|${proposed}$" "$ses"` | sessions.env | same |
| `hiveMind:5125` | `grep "\|${liveUuid}$" "$sess_file"` | sessions.env | same |
| `hiveMind:4957` | `grep -v "\|${key}$" "$TRON_MONITOR_ENV"` | tronMonitor.env (2-field `screenWin\|session`) | session is last field, `$` valid |

### Scope summary

**Only 2 grep patterns affected** — both in `claudeCode`, both target `roles.env`, both look up `pane` by `role`. Other `|x$` patterns target 2-field files (sessions.env, tronMonitor.env) which haven't gained a third field.

### Canonical pattern reference

`private.hiveMind.registry.find` (hiveMind:466) and `private.hiveMind.registry.get` (hiveMind:452) are the canonical role-lookup helpers. They were updated to handle the 3-field format. The claudeCode resolvers were not updated when the registry gained TTL.

### Proposed fixes (for architect to choose)

| Option | Diff | Trade-off |
|--------|------|-----------|
| **A** Replace grep with cut | `cut -d'\|' -f2` extraction filtering by `==name` | Most robust, no anchor games, survives future field additions |
| **B** Adjust grep pattern | `grep -E "\|${name}(\|\|$)"` | Smaller diff, works today, but breaks if registry ever gains a 4th field |
| **C** Delegate to canonical | Replace claudeCode local lookup with call to `private.hiveMind.registry.find` | DRY — but cross-script dependency from claudeCode→hiveMind |

PO directive said `cut -d'|' -f2` (Option A) explicitly. Architect to confirm or pick alternative.

### Recommendation

Option **A** + add a forward-looking comment noting the registry format expectation. The 2 affected lines are isolated to claudeCode; replacing the grep with awk/cut filtering is ~3 lines per site. No cross-script coupling introduced.

## Status

**HELD** — awaiting architect findings on full scope before code change. Survey above suggests 2-line fix at claudeCode:312 + claudeCode:364. Will implement when architect signs off.

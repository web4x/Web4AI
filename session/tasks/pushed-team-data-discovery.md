# Task: make pushed/migrated team data discoverable by standard tools (claudeCode list et al.)

**From**: oosh-po (Tron directive 2026-06-24)
**Owners**: oosh-architect (design where-files-belong + discovery API) → oosh-expert (implement) → oosh-tester (verify)
**Priority**: HIGH
**Status**: OPEN
**Related**: `session/tasks/env-files-pure-state-architecture.md` (#4), hiveMind teams.save/pull/migrate(push)

## Problem (Tron: "how impractical it is — claudeCode list knows nothing about it")

When a team is pushed/migrated to another machine, the transferred session data does NOT land where the standard discovery tools look, so `claudeCode list` (and friends) can't see it. The operator has no simple way to find or use the pushed sessions.

## Findings (measured)

### Where hiveMind puts pushed team data
| Artifact | Location | Tool that should find it | Found? |
|----------|----------|--------------------------|--------|
| Snapshot | `~/config/hivemind.snapshot.<ts>.env` | (none — no `hiveMind snapshots` lister) | ✗ no lister; **42 accumulated on WODA.prod**, never pruned |
| Pull dir | `~/config/hivemind.pull.<host>/` (snapshot+roles+sessions) | (none) | ✗ no lister |
| Session JSONLs (push/migrate) | **literal SOURCE absolute path on the target** | `claudeCode list` (scans `$HOME/.claude/projects/*`) | ✗ lands outside target `$HOME` |

### Root cause — JSONL placement on push
`teams.migrate` (push) transfers JSONLs with the **source's absolute path** reused verbatim on the target:
```bash
local remotePath="${dir}${uuid}.jsonl"          # dir = SOURCE ~/.claude/projects/<sourceHash>/
ossh exec "$host" "mkdir -p '$(dirname "$remotePath")'"
scp "$remotePath" "${host}:${remotePath}"        # same absolute path on target
```
If the target's `$HOME` differs (e.g. `/root` vs `/Users/donges`), the file is created at the **source's** absolute path on the target — OUTSIDE the target's `$HOME/.claude/projects`. `claudeCode list` only scans `$HOME/.claude/projects/*`, so it never appears. Even under the right `$HOME`, the **project-hash dir is derived from the source path**, not the target's working dir, so it won't correlate with the target's CWD.

(Note: `team.pull` — the reverse — DOES normalize: it downloads into the first existing local `~/.claude/projects/<hash>/`. So push is the inconsistent side.)

## The Fix — pick per architect design (Tron: "either fix where files are put OR add methods to discover and relocate")

### Option A — fix WHERE files are put (preferred: standard tools just work)
- On push/migrate, place JSONLs into the **target's** `$HOME/.claude/projects/<targetHash>/<uuid>.jsonl`, where `<targetHash>` is computed from the **target's** project working dir (the dir the forked agent will run in). Then `claudeCode list` finds them with zero new tooling.
- Snapshots/pull-data: keep in `~/config/` but make them **listable** (below).

### Option B — add discover + relocate methods (if placement can't always be normalized)
- `claudeCode discover.pushed` — scan known push locations (config pull dirs, off-project JSONLs) and list pushed sessions with origin host + uuid + role.
- `claudeCode relocate <uuid|file>` — move a pushed JSONL into the correct target `~/.claude/projects/<targetHash>/` so `claudeCode list`/`join`/`fork` work normally.
- Make `claudeCode list` aware of pushed locations (or print a hint: "N pushed sessions not in a project — run `claudeCode relocate`").

### Either way — add the missing listers + hygiene
- `hiveMind snapshots [list|prune]` — list `~/config/hivemind.snapshot.*` and prune old ones (WODA.prod has 42). Stop unbounded accumulation.
- `hiveMind pulls [list]` — list `~/config/hivemind.pull.*` dirs.
- Document in `docs/hivemind.md`: exactly where each artifact lands + how to discover/relocate.

## Acceptance Criteria
- [ ] After `hiveMind team.push <host>`, on the target `claudeCode list` shows the pushed sessions (correct project, uuid, role) — no manual hunting.
- [ ] `claudeCode join <role>` / `fork <uuid>` work on the target for pushed sessions without manual file moves.
- [ ] A lister exists for snapshots + pull dirs; snapshot accumulation is bounded (prune); WODA.prod's 42 snapshots cleaned.
- [ ] `docs/hivemind.md` documents artifact locations + discovery/relocate.
- [ ] Tester: T-PUSH-DISCOVER — push to a target with a different `$HOME`, assert `claudeCode list` surfaces the sessions; assert snapshot prune works.

## Report-back (edit here; report to oosh-po)
- Architect (placement design A vs B + discovery API):
- Expert (impl + commit):
- Tester (T-PUSH-DISCOVER result):

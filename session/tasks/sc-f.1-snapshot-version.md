# SC-F.1 — snapshot format version field

**Sprint**: 1 (state correctness)
**Epic**: SC-F snapshot integrity
**Predecessors**: SC-E ingress predicates (landed: `this.isSessionName` / `this.isPipeSafe`)
**Unlocks**: SC-F.2 (teams.save per-line validate) + SC-F.3 (teams.restore per-line validate)

## Problem

Snapshot format is unversioned. Future format changes (v2 adds field, v2 removes field, v2 changes delimiter) would corrupt restore paths silently — restore would read v2 rows with v1 assumptions, producing bug-class drift (Bug #4 "Did/you/mean" garbage). McDonges 18-session bulk-clone was an adjacent class of the same root: snapshot used as authoritative without integrity gate.

## Fix

Add `# version: 1` header to snapshots (one line, top of file). All snapshot READERS validate the version with a shared helper:

```
private.hiveMind.snapshot.version.check <snapfile>
  return 0: supported (v1 explicit, OR no header → grandfather pre-SC-F.1 snapshots)
  return 1: unknown version → error.log + actionable message
```

**Writers**: `teams.save` emits `# version: 1` as first line.

**Readers wired** (all 3 snapshot-consuming methods):
- `hiveMind.teams.restore` — after snapfile resolution, before processing
- `hiveMind.agent.restart` — after pullDir validation
- `hiveMind.team.restart` — same

## Backward compat

Snapshots without `# version:` header are treated as v1 (grandfather) — existing snapshots in production keep working. After grace period, can flip to strict-reject in SC-F.2/3.

## Acceptance

- `bash -n hiveMind` clean
- `private.hiveMind.snapshot.version.check` defined; idempotent
- `teams.save` output starts with `# version: 1` then `# hiveMind snapshot ...`
- `teams.restore`/`agent.restart`/`team.restart` reject snapshots with unknown version with actionable error
- Existing snapshots (no header) restore without warning (grandfather grace)

## Commit

`hiveMind: SC-F.1 snapshot version field + reader validation (ref: sc-f.1-snapshot-version.md)`

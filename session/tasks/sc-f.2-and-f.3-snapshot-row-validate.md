# SC-F.2 + SC-F.3 — snapshot row validation (save + restore)

**Sprint**: 1 (state correctness) · **Epic**: SC-F snapshot integrity
**Predecessors**: SC-F.1 (snapshot version field, `2a61072`); SC-E.2 ingress predicates (`1b759c5`)
**Bundled**: F.2 (writer) + F.3 (reader) share the same `snapshot.row.valid` helper

## Problem

Snapshot rows can contain garbage from two adjacent classes:

**Writer side (F.2 target)** — `teams.save` reads registry/sessions/process state. If registry was polluted by a prompt-leak ("Did you mean: web4team"), the bad token gets written into a row's session field. Bug #4 was exactly this.

**Reader side (F.3 target)** — `teams.restore` unquoted `for sess in $var` produced word-split entries (each whitespace-separated token became its own session). Already mitigated for the session-name path (line 3138 array build), but per-row validation was still missing.

Pre-SC-F.1 snapshots in the wild also predate the format gate — they may have title with embedded pipes, role fields with prompt text, etc.

## Fix

**New shared helper** `private.hiveMind.snapshot.row.valid <row>`:
- Parses 8 fields: `sess|addr|role|uuid|title|cwd|model|kind`
- Validates field 1 (sess) via `this.isSessionName`
- Validates field 2 (addr) via `^[0-9]+\.[0-9]+$`
- Validates field 3 (role) via `this.isRoleName` when non-empty
- Validates field 4 (uuid) via `this.isUuid` when non-empty
- Validates fields 5–8 (title/cwd/model/kind) via `this.isPipeSafe` when non-empty
- Skip-and-log semantics — caller continues on invalid rows
- Comment lines (`# ...`) rejected (they aren't data rows)

**SC-F.2 — teams.save wired**:
- Live agent path: validate `_liveRow` before append to `$tmpEntries`
- Dead agent path: validate `_deadRow` before append (registry can hold garbage role names)

**SC-F.3 — teams.restore wired**:
- Main row loop at line ~3204: reconstruct row and validate after `[ -z "$sess" ]` check; skip + `skip_count++` on reject

## Backward compat

Pre-SC-F.1 snapshots without `# version:` header are grandfathered by `snapshot.version.check` (SC-F.1). Their rows go through the same validator — clean rows pass, garbage rows are skipped (instead of being processed). Net effect on legitimate old snapshots: zero.

## Acceptance

- `bash -n hiveMind` clean
- `private.hiveMind.snapshot.row.valid` defined
- teams.save calls validator at both live + dead paths
- teams.restore calls validator in main row loop
- Smoke: 6/6 cases (valid live, valid dead, word-split rejected, bad uuid rejected, extra pipe rejected, comment skipped) PASS

## Commit

`hiveMind: SC-F.2+F.3 snapshot row validation on save+restore (ref: sc-f.2-and-f.3-snapshot-row-validate.md)`

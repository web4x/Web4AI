# Report: hiveMind.send() Enter Key Fix (INC-001)

**From**: agent-trainer (quality gate)
**Date**: 2026-02-22
**Commit**: `15a8a90` by oosh-expert on dev.claude branch

## Bug Confirmed (Phase 1)
- `hiveMind send oosh-expert "echo test-bug" Enter` → "echo test-bug Enter" at prompt (Enter as literal text)
- `otmux send projectTeam:0.1 "echo test-working" Enter` → submitted correctly (Enter as keypress)
- Root cause: line 758 `otmux send "$target" -l "$*"` — `-l` flag + `$*` joining makes everything literal

## Fix Implemented (Phase 2 — by expert)
Expert added trailing key name detection with regex matching:
- Handles: Enter, Escape, Tab, Space, C-[a-z], M-[a-z], arrows, function keys
- Three branches: text+key (send text `-l`, key as press), key-only (keypress), text-only (`-l`)
- Preserves `-l` for text portion (spaces safe)
- No git rebase used — clean commit

## Verification Results (Phase 3 — all 6 passed)

| Test | Description | Result |
|------|-------------|--------|
| A | `hiveMind send ... "text" Enter` | PASS |
| B | Spaces preserved with Enter | PASS |
| C | Send without Enter (literal only) | PASS |
| D | `hiveMind send.enter` (unchanged) | PASS |
| E | `hiveMind send ... C-u` (single key) | PASS |
| F | Real-world: `Read <filepath>` + Enter | PASS |

## Safety
- No git rebase attempted — clean `git add + commit`
- Only 1 file changed (hiveMind), 20 insertions, 3 deletions
- All existing functionality preserved (send.enter, literal text)

## Status: INC-001 RESOLVED
Commit `15a8a90` fixes the #1 most frequent recurring incident.

# Team Failure: Rebase Destroyed Uncommitted Work

**Date**: 2026-02-12
**Severity**: HIGH — multiple features lost
**Discovered by**: Tron + PO forensic investigation
**Root cause**: `git pull --rebase` silently overwrote uncommitted changes

## Timeline

| Time | Event |
|------|-------|
| Feb 11 ~18:00 | claude-opus agent modifies otmux tree (adds three-level view with session IDs). Never committed. |
| Feb 12 15:33 | Commit `17340f6` "improved ssh directory choosing" — contains otmux tree fix + claudeCode improvements + ossh + user + scrumMaster + hiveMind changes (10 files, +1064 -339) |
| Feb 12 17:20 | hiveMind-expert runs `git pull --rebase`. Rebase checks out `350acbb` (origin), silently wiping all uncommitted changes. Only the sleep parameter commit (`6f0326a`) is replayed as `ddf61f5`. Commit `17340f6` is DROPPED. |

## Key Commits

| Hash | What |
|------|------|
| `17340f6` | **THE DROPPED COMMIT** — contains all lost work. Still in reflog. |
| `350acbb` | Origin target of the rebase — what git checked out, wiping local changes |
| `ddf61f5` | Result of rebase — only the sleep parameter survived |
| `6f0326a` | Pre-rebase local commit (sleep param) — rebased onto 350acbb |
| `b9c2989` | Original Task 28 (otmux.tree Steps 1-2) — two-level tree, never had session IDs |
| `fdfe480` | Jan 31 commit adding `private.hiveMind.pane.session.id()` — this code survived in hiveMind |

## How to Find It

```bash
# The dropped commit is in the reflog
git -C /Users/donges/oosh show 17340f6

# See what was lost (diff current vs dropped)
git -C /Users/donges/oosh diff HEAD 17340f6

# Per-file diffs
git -C /Users/donges/oosh diff HEAD 17340f6 -- otmux
git -C /Users/donges/oosh diff HEAD 17340f6 -- claudeCode
git -C /Users/donges/oosh diff HEAD 17340f6 -- ossh
git -C /Users/donges/oosh diff HEAD 17340f6 -- user

# Restored files are in
/Users/donges/oosh/restore/
```

## What Was Lost

| File | Lost Feature | Lines |
|------|-------------|-------|
| **otmux** | Tree three-level view: session → pane → session-id sub-line. Detects AI agents, shows `claudeCode session.id` and `session.name` as sub-line under each pane. | ~29 lines |
| **claudeCode** | `FORCE_COLOR=2` fix for Terminal.app (256-color fallback) | ~8 lines |
| **claudeCode** | `list` improved: shows `customTitle` instead of `firstPrompt`, reformatted columns | ~15 lines |
| **claudeCode** | `list.named()` new method: list only sessions with custom names | ~46 lines |
| **scrumMaster** | Registry path updated from `/tmp/` to `~/config/` (partially re-done in later commits) | ~6 lines |
| **ossh** | SSH directory choosing improvements | ~300 lines |
| **user** | Unknown improvements | ~90 lines |

## What Survived (was committed separately or re-done)

- `scrumMaster subscription` + `subscription.json` — expert re-implemented today
- `hiveMind team.status` with session IDs — committed in `fdfe480` (Jan 31)
- `hiveMind` registry migration — re-done in commit `d9368cf`
- `hiveMind` multi-team support — re-done in commit `e82fee1`
- `hiveMind` sweep interval parameter — the commit that was replayed (`ddf61f5`)

## How It Happened

1. hiveMind-expert agent ran `git pull --rebase` to push its work
2. `git rebase` checks out the target commit (`350acbb`) as first step
3. This **silently replaces working directory files** with the remote version
4. Uncommitted changes to otmux, claudeCode, ossh, user — all wiped
5. Commit `17340f6` was a local-only commit that the rebase should have replayed but DROPPED
6. No error, no warning — git doesn't protect unstaged modifications during rebase

## Why the Commit Was Dropped

The rebase replayed `6f0326a` (sleep parameter) but not its parent `17340f6` (the mega-commit). Likely because `17340f6` had merge conflicts with `350acbb` across 10 files, and the rebase silently skipped it or the agent resolved conflicts by taking the remote version.

## Prevention

1. **`pull.rebase=false`** set in repo config — `git pull` now merges, never rebases
2. **`rebase.autoStash=false`** set — no auto-stashing
3. **NEVER use `git rebase`** — added to all SKILL.md files, MEMORY.md, PO learnings
4. **Nothing is "done" until committed with a hash** — achievement logs require commit hash
5. **Agents must not run destructive git operations** without PO approval

## Recovery

Files extracted from `17340f6` into `/Users/donges/oosh/restore/`:
- `restore/otmux` — contains three-level tree
- `restore/claudeCode` — contains FORCE_COLOR, list.named, improved list
- `restore/scrumMaster` — contains ~/config/ registry paths
- `restore/hiveMind` — older version (current HEAD has more features)
- `restore/ossh` — contains ssh directory improvements
- `restore/user` — contains improvements

Tron is manually comparing via `tmux attach -t diffReview` (vimdiff session).

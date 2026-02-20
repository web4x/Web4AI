# Specification: `latest` symlink + `oo use` for branch-safe switching

**From**: PO (Tron directive)
**For**: oosh-expert (implement), oosh-tester (test)
**Priority**: HIGH

## Architecture

No external scripts. Everything stays inside oosh.

### 1. Create a `latest` symlink

In `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/`:

```
latest -> dev.claude
```

`latest` always points to the branch with the newest, tested code (currently dev.claude). This is the development edge.

The directory now looks like:
```
/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/
├── latest -> dev.claude     ← NEW: always points to dev edge
├── dev.claude/              ← development branch (has newest oo mode)
├── main/                    ← stable release (fallback)
├── dev/
├── hannes/
├── ...
```

### 2. Fix `oo mode` bootstrap paradox

`oo mode` must ALWAYS source the switching logic from `latest`, regardless of which branch `~/oosh` currently points to.

```bash
oo.mode() # <?branch> # switch oosh to a branch worktree, or show current mode
{
  local WORKTREE_BASE="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH"
  local LATEST="$WORKTREE_BASE/latest"

  # Bootstrap: if we're NOT on latest's code, delegate to latest's oo.mode
  local current_target
  current_target=$(readlink "$HOME/oosh" 2>/dev/null)
  local latest_target
  latest_target=$(readlink "$LATEST" 2>/dev/null)

  if [ "$current_target" != "$WORKTREE_BASE/$latest_target" ] && \
     [ "$current_target" != "$LATEST" ]; then
    # Source latest's oo and call its mode function
    source "$LATEST/this"
    source "$LATEST/oo"
    oo.mode "$@"
    return $?
  fi

  # ... rest of the existing oo.mode logic (show/switch) ...
}
```

This solves the bootstrap paradox: even from main or hannes, `oo mode dev.claude` works because it sources from `latest`.

### 3. New method: `oo use <branch> <command> [args]`

Run any oosh command from a specific branch WITHOUT switching the symlink. One-shot execution.

```bash
oo.use() # <branch> <command> [args...] # run a command from a specific branch
{
  local branch="$1"
  shift
  local command="$1"
  shift

  local WORKTREE_BASE="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH"
  local branch_dir="$WORKTREE_BASE/$branch"

  if [ ! -d "$branch_dir" ]; then
    error.log "Branch directory '$branch' not found in $WORKTREE_BASE"
    return 1
  fi

  if [ ! -f "$branch_dir/$command" ]; then
    error.log "Command '$command' not found in branch '$branch'"
    return 1
  fi

  # Execute the command from the target branch, passing remaining args
  # Temporarily override OOSH_DIR so the command uses the right branch context
  OOSH_DIR="$branch_dir" "$branch_dir/$command" "$@"
}
```

**Examples:**
```bash
# Run user list from main (stable fallback)
oo use main user list

# Run config get from dev branch
oo use dev config list

# Run test suite from latest
oo use latest test.suite run oo

# Compare outputs between branches
oo use main oo mode
oo use dev.claude oo mode
```

### 4. Tab completion

```bash
oo.use.completion.branch() {
  ls -d /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/*/ 2>/dev/null \
    | xargs -I{} basename {} \
    | grep -v '^\.'
}

oo.use.completion.command() {
  # After branch is selected, complete with script names from that branch
  local branch="$1"
  local branch_dir="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/$branch"
  if [ -d "$branch_dir" ]; then
    ls "$branch_dir" | grep -v '^\.' | grep -v '\.md$'
  fi
}

oo.mode.completion.branch() {
  ls -d /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/*/ 2>/dev/null \
    | xargs -I{} basename {} \
    | grep -v '^\.'
}
```

### 5. Safety: main as fallback

If something is broken in the current branch or in latest, you can ALWAYS fall back:
```bash
oo use main <command> [args]
```

Since `oo use` reads directly from the branch directory (not via ~/oosh), it works even if ~/oosh is broken or pointing to a corrupt branch.

## Implementation Steps

1. Create the `latest` symlink: `ln -s dev.claude /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/latest`
2. Add the bootstrap delegation to `oo.mode()` (source from latest)
3. Add `oo.use()` method with the OOSH_DIR override pattern
4. Add completion functions for both `oo mode` and `oo use`
5. Commit + push

## Test Cases (for tester)

1. `oo mode` — shows current mode (PASS before, should still PASS)
2. `oo mode main` — switches to main
3. From main: `oo mode dev.claude` — **switches BACK** (was FAIL, must now PASS via latest bootstrap)
4. From main: `oo use latest user list` — runs dev.claude's user command from main context
5. `oo use main oo mode` — shows main's branch status
6. `oo use nonexistent-branch config list` — error
7. `oo use main nonexistent-command` — error
8. Round-trip: `oo mode main && oo mode hannes && oo mode dev.claude && oo mode` — all work
9. Tab completion: `oo mode <TAB>` and `oo use <TAB>` list branches

## Files to Change

- `/Users/donges/oosh/oo` — modify `oo.mode()`, add `oo.use()`, add completions
- Create symlink: `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/latest -> dev.claude`

## Do NOT

- Do NOT create external scripts outside oosh
- Do NOT modify other branches' oo scripts
- Do NOT change the ~/oosh symlink during implementation (only oo mode does that)

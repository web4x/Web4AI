# Task: Enhance `oo mode` to use worktree directories + symlink switching

**From**: PO (Tron directive)
**For**: oosh-expert
**Priority**: HIGH — do this now

## Current State

- `~/oosh` is a symlink: `~/oosh -> /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/dev.claude/`
- `oo mode` (line 229) shows git status + OOSH_MODE
- `oo mode dev` (line 219) does `git checkout dev` in the same directory — OLD approach
- `oo mode fullDebug` (line 933) does `git checkout fullDebug` — same OLD approach
- No completion for `oo mode` — no `oo.mode.completion()` exists
- All branches now have worktree directories under `/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/`

## Worktree Directory (already exists)

```
/Users/Shared/Workspaces/AI/Claude.All/components/OOSH/
├── dev/               ← origin/dev
├── dev.claude/        ← origin/dev.claude (main worktree)
├── feature.fixLogging/
├── feature.loglive/
├── feature.neom.N1-185/
├── feature.neom.N1-37/
├── feature.neom.N1-418/
├── feature.path/
├── feature.pathConfig/
├── fullDebug/
├── hannes/
├── hannes-v2/
├── main/
├── mkt-N1-134/
├── once.sh/           ← not a worktree, separate clone
├── stable.bash4/
├── test.ish/
├── test.macos/
└── test.windows/
```

## Required Changes to `/Users/donges/oosh/oo`

### 1. `oo.mode()` — show current mode + list available branches

Replace the current `oo.mode()` (line 229) with:
- Show which branch the `~/oosh` symlink currently points to
- List all available worktree directories under the OOSH components directory
- Show which one is active

### 2. `oo.mode.completion()` — tab-complete branch directory names

```bash
oo.mode.completion() {
  # List directory names under the worktree base dir
  ls -d /Users/Shared/Workspaces/AI/Claude.All/components/OOSH/*/ 2>/dev/null \
    | xargs -I{} basename {} \
    | grep -v '^\.'
}
```

This lets `oo mode <TAB>` complete to available branch directories.

### 3. `oo.mode.<branch>` dynamic or single method with argument

**Option A** (cleaner): Make `oo mode <name>` a single method that takes the branch directory name as argument:

```bash
oo.mode() # <?branch> # switch oosh to a branch worktree, or show current mode
{
  local WORKTREE_BASE="/Users/Shared/Workspaces/AI/Claude.All/components/OOSH"
  local OOSH_LINK="$HOME/oosh"
  local branch="$1"

  if [ -z "$branch" ]; then
    # No argument: show current mode
    local current_target
    current_target=$(readlink "$OOSH_LINK")
    local current_name
    current_name=$(basename "$current_target")
    console.log "Current mode: $current_name"
    console.log "Symlink: $OOSH_LINK -> $current_target"
    console.log ""
    console.log "Available branches:"
    for dir in "$WORKTREE_BASE"/*/; do
      local name=$(basename "$dir")
      if [ "$name" = "$current_name" ]; then
        console.log "  * $name  (active)"
      else
        console.log "    $name"
      fi
    done
    return 0
  fi

  # Switch to named branch
  local target_dir="$WORKTREE_BASE/$branch"

  if [ ! -d "$target_dir" ]; then
    # Directory doesn't exist — try to create worktree from remote branch
    console.log "Directory '$branch' not found. Checking remote branches..."
    # Map directory name back to possible branch names
    # (dots -> slashes for nested branches)
    local remote_branch
    remote_branch=$(cd "$WORKTREE_BASE/dev.claude" && git branch -r | grep -i "${branch//\./.*}" | head -1 | tr -d ' ')
    if [ -n "$remote_branch" ]; then
      console.log "Creating worktree for $remote_branch..."
      cd "$WORKTREE_BASE/dev.claude"
      git worktree add "../$branch" "$remote_branch"
    else
      error.log "No remote branch matching '$branch' found"
      return 1
    fi
  fi

  # Switch symlink
  if [ -L "$OOSH_LINK" ]; then
    rm "$OOSH_LINK"
  fi
  ln -s "$target_dir" "$OOSH_LINK"

  console.log "Switched to: $branch"
  console.log "$OOSH_LINK -> $target_dir"
  export OOSH_MODE="$branch"
  export OOSH_DIR="$target_dir"
}
```

### 4. Remove hardcoded `oo.mode.dev()` and `oo.mode.fullDebug()`

These old methods (lines 219-227 and 933-940) do `git checkout` in the same directory. They should be removed — the new `oo mode dev` and `oo mode fullDebug` will use the worktree approach instead.

## What NOT to Change

- `oo.branches.check()` (line 252) — different purpose, keep it
- `oo.release()` (line 205) — keep as-is
- The worktree directories themselves — already created

## How to Verify

```bash
# Show current mode
oo mode
# Should show: Current mode: dev.claude, list all branches

# Tab complete
oo mode <TAB>
# Should list: dev, dev.claude, feature.fixLogging, ...

# Switch to main
oo mode main
# ~/oosh should now point to .../OOSH/main/
ls -la ~/oosh  # verify symlink changed

# Switch back
oo mode dev.claude
# ~/oosh should point to .../OOSH/dev.claude/ again

# Create new worktree on the fly (if a new remote branch appears)
oo mode some-new-branch
# Should detect it doesn't exist, find matching remote, create worktree
```

## Files to Change

- `/Users/donges/oosh/oo` — modify `oo.mode()`, add `oo.mode.completion()`, remove `oo.mode.dev()` and `oo.mode.fullDebug()`

## Important

The OOSH_DIR variable and PATH both use `~/oosh`. Switching the symlink means ALL oosh commands immediately use the new branch's code. This is the whole point — test a branch by switching to it.

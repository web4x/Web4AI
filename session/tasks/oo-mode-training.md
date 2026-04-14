# oo mode — OOSH Branch/Worktree Switching

**From**: oosh-expert
**To**: oosh-tester + all agents

## What oo mode does

`~/oosh` is a **symlink** pointing to a git worktree. `oo mode` switches which worktree it points to. This controls which version of oosh all commands use.

## Commands

| Command | What it does |
|---------|-------------|
| `oo mode` | Show current mode (which worktree `~/oosh` points to) |
| `oo mode.list` | List all available branches/worktrees |
| `oo mode <branch>` | Switch `~/oosh` symlink to `<branch>` worktree |
| `oo checkout <branch>` | Create new worktree from remote branch, then switch to it |

## How it works

```
~/oosh → /path/to/components/OOSH/prod         (default)
~/oosh → /path/to/components/OOSH/dev           (after: oo mode dev)
~/oosh → /path/to/components/OOSH/macos.latest  (after: oo mode macos.latest)
```

The symlink switch is instant. All oosh commands immediately use the new code.

## Why it matters

On the Ubuntu container (`testUbuntuRoot`), oosh runs from `prod` by default. Our fixes (debug guard, claudeCode install, etc.) are on `test/macos.latest`. To use our fixes:

```bash
oo mode test/macos.latest
```

If the worktree doesn't exist yet:
```bash
oo checkout test/macos.latest
```

## Key detail

`oo mode` changes `$OOSH_DIR` and the `~/oosh` symlink. After switching, start a new bash session (`bash`) to pick up the new PATH.

## Verify

```bash
oo mode                    # shows current
ls -la ~/oosh              # shows symlink target
echo $OOSH_DIR             # shows current dir
```

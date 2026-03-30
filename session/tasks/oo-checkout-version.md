# Task: Implement oo checkout <version>

**Assigned to**: oosh-expert (baseTeam:0.0) + oosh-tester (baseTeam:0.1)
**Priority**: HIGH — Tron directive

## What

New method `oo.checkout()` that clones/checks out a remote branch into the OOSH components base directory.

## Signature

```bash
oo.checkout() # <version> # clone and switch to a remote branch in the components base directory
```

- Parameter is called `version` (not `branch`) because in web4, branches ARE versions
- Tab completion: `oo.checkout.completion.version()` — lists remote branch names from the oosh git repo

## Behavior

1. **Error if no base set**: Call `oo.mode.base.get` — if empty or default path doesn't exist, error: "No OOSH components base set. Run: oo mode.base.set <path>"
2. **Get base directory**: `base=$(oo.mode.base.get)`
3. **Directory name = remote branch name**: e.g., branch `test/macos.latest` → directory name `macos.latest` (strip prefix? or use full name with dots replacing slashes? Check how existing dirs are named — `dev.claude`, `macos.latest`, `test.ish` etc.)
4. **If directory already exists**: Check if it's a git repo on the right branch. If yes, just `git pull`. If not a git repo, error.
5. **If directory doesn't exist**: `git clone <repo-url> -b <branch> <base>/<dirname>`
6. **Repo URL**: Get from the current oosh repo: `git remote get-url origin`
7. **After clone/pull**: Show success message with path

## Completion

```bash
oo.checkout.completion.version() {
  # List remote branches from the oosh git repo
  git ls-remote --heads origin 2>/dev/null | sed 's|.*refs/heads/||'
}
```

## Directory naming convention

Look at existing directories in components/OOSH/ for the pattern. On MacStudio:
```
dev, dev.claude, macos, macos.latest, prod, termux, ish, windows
```
These map to branches like `dev`, `dev.claude.1`, `test/macos.latest`, `main`, `test/ish`, etc.

The directory name should be derived from the branch name — strip common prefixes like `test/`, use dots instead of slashes if needed. Match existing conventions.

## Verification

```bash
oo checkout [Tab]          # shows remote branches
oo checkout dev            # clones dev branch if not exists, pulls if exists
oo checkout test/macos     # creates directory, clones
oo checkout                # no arg → error with usage
# Without base set:
config set OOSH_COMPONENTS_DIR ""
oo checkout dev            # error: no base set
```

Commit, push, notify tester. Tester: write tests for all cases (new clone, existing dir, missing base, bad branch).

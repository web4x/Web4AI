# Phase 2: backup config.create completion + config.repair method

## Task 1: Add folder completion to config.create

### Current signature (broken naming)
```bash
backup.config.create() # <?target_base:pi@pi400:/media/pi/myData/Devices/MacStudio.native> # creates config for current directory
```

### Required changes
1. **Rename parameter** `target_base` → `targetBase` (OOSH camelCase mandatory)
2. **Add completion function** `backup.config.create.completion.targetBase()` using `c2 folders.completion "$1"`
3. **Keep the pi400 default** — `<?targetBase:pi@pi400:/media/pi/myData/Devices/MacStudio.native>`

### Reference
- `backup.to.completion()` uses `private.complete.folders "$1"` (line 175)
- `backup.parameter.completion.dir()` uses `c2 folders.completion "$1"` (line 764)
- `backup.config.save.completion.scope()` shows how method-specific completion works (line 246)
- Either `compgen -o dirnames` or `c2 folders.completion` works for folder completion

## Task 2: Add `backup config.repair` method

### Purpose
Fix broken configs created before the config.create path fix (commit 743b6e5). Config #5 had `donges@MacStudio.native:/Users/Shared/Workspaces/Users/Shared/Workspaces` — the double-path bug.

### Proposed behavior
```bash
backup config.repair              # scan all registered configs, detect and fix double-paths
backup config.repair <configPath> # fix a specific config
```

### Detection logic
For remote targets (`user@host:path`): check if the path portion contains the BACKUP_SOURCE path duplicated.
For local targets: check if BACKUP_TARGET contains BACKUP_SOURCE as a suffix after the actual target base.

### What "fix" means
- Detect the double-path pattern
- Show the user what will change (before → after)
- Write the corrected BACKUP_TARGET to the .backup.env file
- Registry stays consistent because the symlink points to the same file

## Task 3: Tests (tester will write)
- T14: config.create parameter name is camelCase (targetBase)
- T15: config.repair detects and fixes double-path in remote target
- T16: config.repair leaves correct configs unchanged
- T17: config.repair fixes double-path in local target

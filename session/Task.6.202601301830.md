# Task 6 — Hierarchical Backup Config Discovery

**Created**: 2026-01-30T18:30Z
**Status**: DONE (implemented by Father agent)
**Requested by**: User (via Father agent)

## Original Prompt (verbatim)

> look at the backup oosh script. it configures a backup config and then easily uses resync internally with simpl external oosh methods to backup directories over ssh. i want th script to be modified in a way as task 6, that the script looks for a backup config not only for the one global one, but from the directroy where we are upwards to the next it finds. in best case it finds one in the current folder. so each folder can have its own backup location storeage, that applies for all folders until there is a folder with its own backup config. analye this and write the task 6.

## Current Behavior

The `backup` script currently:
1. Loads config from `$CONFIG_PATH/backup.env` in `backup.start()` (line 383)
2. Uses global variables: `BACKUP_SOURCE`, `BACKUP_TARGET`, `BACKUP_STRATEGY`, `BACKUP_CAPTURE_LOG_MODE`
3. Saves config via `config save backup BACKUP_` to the global config location
4. All directories share the same backup destination

## Desired Behavior

Implement **hierarchical config discovery** that walks from current directory upward:

```
/Users/donges/projects/myapp/.backup.env   ← found first? Use this
/Users/donges/projects/.backup.env         ← else check parent
/Users/donges/.backup.env                  ← else check parent
~/.config/backup.env                       ← else use global default
```

This enables:
- Per-project backup destinations (e.g., project → project-specific NAS path)
- Per-user backup destinations (e.g., home dir → personal backup server)
- Global fallback (e.g., system → main backup location)

## Implementation Plan

### 1. Add `backup.config.discover()` method

```bash
backup.config.discover() # # walks from pwd upward, returns path to first .backup.env found
{
  local dir="$(pwd)"
  while [ "$dir" != "/" ]; do
    if [ -f "$dir/.backup.env" ]; then
      RESULT="$dir/.backup.env"
      echo "$RESULT"
      return 0
    fi
    dir="$(dirname "$dir")"
  done
  # Fallback to global
  RESULT="$CONFIG_PATH/backup.env"
  echo "$RESULT"
  return 0
}
```

### 2. Modify `backup.start()` to use discovery

```bash
backup.start()
{
  source this
  
  # Hierarchical config discovery
  local config_file
  config_file=$(backup.config.discover)
  info.log "Using backup config: $config_file"
  
  if [ -f "$config_file" ]; then
    source "$config_file"
  else
    warn.log "No backup config found. Run: backup from <path> && backup to <path>"
  fi
  
  private.check.log.mode
  this.start "$@"
}
```

### 3. Modify `backup.config.save()` to save locally when appropriate

```bash
backup.config.save() # <?scope:local|global> # saves config to local .backup.env or global
{
  local scope="${1:-local}"
  
  if [ "$scope" = "global" ]; then
    config save backup BACKUP_
  else
    # Save to current directory's .backup.env
    local config_file=".backup.env"
    info.log "Saving backup config to: $(pwd)/$config_file"
    cat > "$config_file" << EOF
# Backup config for $(pwd)
# Created: $(date -u +%Y-%m-%dT%H:%M:%SZ)
export BACKUP_SOURCE="$BACKUP_SOURCE"
export BACKUP_TARGET="$BACKUP_TARGET"
export BACKUP_STRATEGY="$BACKUP_STRATEGY"
export BACKUP_CAPTURE_LOG_MODE="$BACKUP_CAPTURE_LOG_MODE"
EOF
  fi
}

backup.config.save.completion.scope() {
  echo -e "local\nglobal" | grep "^$1"
}
```

### 4. Add `backup.config.which()` method

```bash
backup.config.which() # # shows which config file is currently active
{
  local config_file
  config_file=$(backup.config.discover)
  console.log "Active config: ${CYAN}$config_file${NORMAL}"
  
  if [ -f "$config_file" ]; then
    console.log "\nContents:"
    cat "$config_file"
  fi
}
```

### 5. Update `backup.usage()` with new features

Add to usage text:
```
    config.discover   walks from current dir upward, shows first .backup.env found
    config.which      shows which config file is currently active
    config.save       <?scope:local|global> saves config (default: local .backup.env)
```

## Files to Modify

| File | Change |
|------|--------|
| `backup` | Add `backup.config.discover()`, `backup.config.which()`, modify `backup.start()`, modify `backup.config.save()` |

## Test Cases (for Tester)

1. **No local config**: Should fall back to `$CONFIG_PATH/backup.env`
2. **Local config exists**: Create `.backup.env` in test dir, verify it's used
3. **Parent config**: Create `.backup.env` in parent dir, verify child inherits
4. **Config override**: Local config should override parent config
5. **`backup config.which`**: Should show correct active config path
6. **`backup config.save`**: Should create local `.backup.env`
7. **`backup config.save global`**: Should save to global config

## Delegation

| Step | Agent | Task |
|------|-------|------|
| 1 | Expert (0.1) | Implement `backup.config.discover()` method |
| 2 | Expert (0.1) | Modify `backup.start()` to use discovery |
| 3 | Expert (0.1) | Implement `backup.config.which()` method |
| 4 | Expert (0.1) | Modify `backup.config.save()` with scope parameter |
| 5 | Expert (0.1) | Update `backup.usage()` |
| 6 | Tester (0.2) | Write test cases in `test/test.backup` |
| 7 | Tester (0.2) | Run tests, verify all pass |
| — | ScrumMaster | Monitor, approve, enforce roles |

## Acceptance Criteria

- [ ] `backup.config.discover()` walks directory tree upward correctly
- [ ] `backup.start()` uses discovered config
- [ ] `backup.config.save` creates local `.backup.env` by default
- [ ] `backup.config.save global` saves to global config
- [ ] `backup.config.which` shows active config
- [ ] `backup.usage()` documents new features
- [ ] All test cases pass
- [ ] Backward compatible with existing global config users

## OOSH Principles Checklist

- [ ] Self-explaining: `./backup usage` shows new methods
- [ ] Tab completion: All new methods have completions
- [ ] Logging: Uses `info.log`, `warn.log` appropriately
- [ ] DRY: Config discovery is a single reusable function

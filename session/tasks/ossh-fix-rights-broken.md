# Bug: ossh fix.rights broken — doesn't set correct SSH permissions

**Priority**: HIGH
**Date**: 2026-06-01

## Problem

`ossh fix.rights` should set all SSH access rights as SSH requires. Currently broken — doesn't cover all paths correctly.

## Required permissions

```
~/.ssh/                   700 (drwx------)
~/.ssh/config             600 (-rw-------)
~/.ssh/known_hosts        644 (-rw-r--r--)
~/.ssh/authorized_keys    600 (-rw-------)
~/.ssh/id_*               600 (-rw-------)  # all private keys
~/.ssh/*.pub              644 (-rw-r--r--)  # all public keys
~/.ssh/ids/               700 (drwx------)  # ids directory
~/.ssh/ids/*/             700 (drwx------)  # each key subdirectory
~/.ssh/ids/*/id_*         600 (-rw-------)  # private keys in subdirs
~/.ssh/ids/*/*.pub        644 (-rw-r--r--)  # public keys in subdirs
~/.ssh/ids/*/*.pem        600 (-rw-------)  # PEM keys in subdirs
```

## Must handle

- `~/.ssh/` base directory
- `~/.ssh/ids/` and ALL subdirectories recursively
- Private keys (no .pub extension) → 600
- Public keys (.pub) → 644
- Config files → 600
- Directories → 700
- Works on macOS, Linux, AND Termux

## Acceptance Criteria

- [ ] `ossh fix.rights` sets correct permissions on ALL SSH files
- [ ] Covers `~/.ssh/ids/` subdirectories recursively
- [ ] Private keys 600, public keys 644, directories 700
- [ ] Works on Termux (test via ooshTeam:0.5)
- [ ] Idempotent — running twice produces same result

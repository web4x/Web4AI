# Task: Fix oo mode — OOSH convention violations

**Assigned to**: oosh-expert (baseTeam:0.2)
**Priority**: CRITICAL — current commit 31aee95 has multiple convention violations

## What's wrong with current implementation

### 1. Underscore in method name — FORBIDDEN
```bash
# WRONG — underscores are NEVER used in OOSH method names
oo.mode._base()

# RIGHT — dots only, getter pattern
oo.mode.base.get()
```

### 2. Environment variable instead of config — bad UX
The current `oo.mode._base()` checks `$OOSH_COMPONENTS_DIR` env var. No user should ever have to type:
```bash
# WRONG — forcing user to set env var before every call
OOSH_COMPONENTS_DIR=/some/path oo mode
```

Instead, use the config system:
```bash
# RIGHT — config persists, user sets once
oo.mode.base.get() {
  local base
  base=$(config get OOSH_COMPONENTS_DIR 2>/dev/null)
  if [ -z "$base" ]; then
    base="/Users/Shared/Workspaces/AI/Claude/components/OOSH"
  fi
  echo "$base"
}
```

### 3. Bootstrap delegation sources OOSH scripts — FORBIDDEN
Lines 270-282 do `source "$LATEST/this"` and `source "$LATEST/oo"`. **NEVER source OOSH scripts.** They are executables. Sourcing pollutes the bash environment with thousands of functions.

The entire bootstrap delegation block (lines 270-282) must be REMOVED. It causes an infinite hang when a `latest/` directory exists with old code.

### 4. `oo.mode.base` should be `oo.mode.base.set` for the setter
```bash
oo.mode.base.get()    # returns the base directory path
oo.mode.base.set()    # <path> # sets and persists the base directory
```

## Before you fix

1. Re-read `docs/oosh-architecture.md` — understand the naming conventions
2. Re-read `config` script — understand `config get` and `config set` patterns
3. Look at how other scripts use config (e.g., `ossh`, `backup`)

## What to fix in `/Users/donges/oosh/oo`

1. **Rename** `oo.mode._base()` → `oo.mode.base.get()` — use `config get OOSH_COMPONENTS_DIR` with fallback
2. **Rename** `oo.mode.base()` → split into `oo.mode.base.get()` (show) and `oo.mode.base.set()` (persist)
3. **Remove** the bootstrap delegation block (lines 270-282) — no sourcing, no `OO_FROM_LATEST`
4. **Update** all references from `oo.mode._base` to `oo.mode.base.get`
5. **Update** completion functions if needed

## Verification

After fix:
```bash
oo mode                    # shows current mode (no hang!)
oo mode.base.get           # shows base directory from config
oo mode.base.set /some/path  # persists to config
oo mode.list               # lists branches
oo mode dev.claude         # switches symlink
```

Commit with message describing the convention fix.

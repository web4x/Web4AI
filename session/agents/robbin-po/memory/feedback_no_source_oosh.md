---
name: Never source OOSH scripts
description: Sourcing oosh scripts into shell is ALWAYS WRONG - only env files may be sourced. Use CLI invocation instead.
type: feedback
---

Sourcing oosh scripts into the shell is strictly forbidden in OOSH architecture. Only env files may be sourced.

**Wrong**: `source this; source oo; type -t oo.mode.base.get`
**Wrong**: `cd /Users/donges/oosh && ./oo mode.base.get` (unnecessary cd and ./ prefix)
**Right**: `oo mode.base.get` (direct CLI invocation — OOSH is on PATH)

Only use `./` prefix when testing a specific `components/OOSH/<branch>` version.
Don't add `2>&1` stderr redirections — OOSH has its own logging system.
To test if a function exists after loading, use the OOSH dispatcher — don't try to source scripts and inspect shell state directly.

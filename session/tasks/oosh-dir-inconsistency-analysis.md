# OOSH_DIR Inconsistency Analysis

Task: PO assignment — architecture analysis, no code changes.
Author: oosh-architect
Date: 2026-07-07

## Problem

`OOSH_DIR` should ALWAYS be `$HOME/oosh` (the stable symlink). On WODA.prod it is
`/home/shared/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/Once.sh/dev`
— the resolved physical worktree path. That is the inconsistency.

## The Invariant

**OOSH_DIR = `$HOME/oosh` (the symlink) — always, on every host, after every mode switch.**

The symlink IS the indirection layer. `oo mode` switches the symlink target; OOSH_DIR
must stay on the stable side of that indirection. Resolving through the symlink defeats
its purpose.

## Measured Inconsistency Points

### Point 1 — `oo.mode()` sets OOSH_DIR to the resolved worktree path

File: `oo`, lines 280 + 309.

```
local target_dir="$WORKTREE_BASE/$branch"       # line 280
...
export OOSH_DIR="$target_dir"                    # line 309
```

After switching the `~/oosh` symlink (line 304), `oo.mode()` exports OOSH_DIR as the
resolved worktree path (e.g. `/Users/Shared/.../components/OOSH/some-branch`), NOT
`$HOME/oosh`. From this moment, OOSH_DIR and `~/oosh` agree in content but diverge in
identity — and any subsequent `config save` cements the resolved path.

### Point 2 — EAMD install functions hardcode the resolved path

File: `oo`, lines 945 + 1001.

```
export OOSH_DIR="$dir/shared/EAMD.ucp/.../Once.sh/dev"   # line 945
...
config save                                                # line 950
```

`private.check.root.shared.dev.folder.created()` (line 945) and
`private.check.user.shared.dev.folder.linked()` (line 1001) set OOSH_DIR to the
absolute resolved path, then call `config save` which persists it. The `~/oosh` symlink
is created AFTER (line 960: `ln -s "$OOSH_DIR" oosh`) — so the correct symlink path
`$HOME/oosh` is never stored as OOSH_DIR.

**This is the root cause for WODA.prod.** The install functions seeded the resolved path
into the persisted config, and the boot chain has been reinforcing it ever since.

### Point 3 — `config.save` persists whatever OOSH_DIR currently is

File: `config`, line 311.

```
config.save oosh OOSH    # persists all env vars matching prefix "OOSH"
```

Every call to `config.save` (with or without args) calls `config.save oosh OOSH` which
writes all `OOSH*` vars — including OOSH_DIR — into `oosh.env`, which is then included
in `user.env`. Once a wrong value is in the env, any `config save` re-cements it.

### Point 4 — Self-reinforcing persistence cycle (the WODA.prod steady state)

Once the resolved path is persisted, the boot chain cannot escape it:

1. `.bashrc` line 153: `source "$CONFIG"` (user.env) sets OOSH_DIR to the resolved path
   AND sets OOSH_PROMPT to "oosh " (both persisted by `config.save oosh OOSH`).
2. `.bashrc` line 159: `source "$OOSH_DIR/log"` — sources log from the resolved path.
3. `log` line 84: `source $(dirname ${BASH_SOURCE[0]})/this` — sources `this` from the
   resolved path. BASH_SOURCE[0] is the resolved path because that is how log was sourced.
4. `this` line 28: OOSH_DIR is already set (from CONFIG) — fallback skipped.
5. `this.init()` line 228: sources CONFIG — re-sets OOSH_DIR to resolved path.
6. `this.init()` line 231: checks `OOSH_PROMPT` — already set from CONFIG.
   **Line 233 is SKIPPED.** The override `OOSH_DIR="$initStartPath"` never fires.
7. OOSH_DIR remains the resolved path. Permanently.

The cycle is self-reinforcing at two levels:
- OOSH_PROMPT in CONFIG causes line 233 to be skipped (no override opportunity).
- BASH_SOURCE[0] in `this` reflects the resolved path (because `log` sourced `this` via
  `$OOSH_DIR/this` where OOSH_DIR was already resolved), so even if line 233 DID fire,
  `initStartPath` would be the resolved path anyway.

### Point 5 — `oo.use()` can contaminate the config

File: `oo`, line 426.

```
OOSH_DIR="$branch_dir" "$branch_dir/$command" "$@"
```

This runs a command from another branch with OOSH_DIR overridden. If that command calls
`config save` (which many do on init), `$branch_dir` gets persisted as OOSH_DIR — a
cross-branch contamination vector.

### Point 6 — `init/oosh` gets it right (but only for direct installs)

File: `init/oosh`, lines 133-135.

```
cd ~
OOSH_DIR="$(pwd)/oosh"
```

After `cd ~`, `$(pwd)/oosh` = `$HOME/oosh` — the symlink path. This is correct.
But the EAMD install functions (Point 2) bypass `init/oosh` entirely, so this
correct logic never runs on WODA.prod.

## Why MacStudio Works

On MacStudio, the install went through `init/oosh` which set `OOSH_DIR=$HOME/oosh`.
This correct symlink path was persisted and has been self-reinforcing correctly since.

The `oo.mode()` bug (Point 1) exists on MacStudio but has not manifested because:
either no `config save` has been called after a mode switch, or the current mode
was set during a session where OOSH_DIR was still the symlink path.

**The bug is latent on MacStudio.** One `oo mode <branch>` followed by any
`config save` will permanently corrupt OOSH_DIR on MacStudio too.

## What Breaks With Each Value

### OOSH_DIR = `$HOME/oosh` (symlink — CORRECT)

Nothing breaks. All file operations work through symlinks transparently. After
`oo mode` switches the symlink target, every `$OOSH_DIR/...` path resolves to the
new worktree without any variable needing to change. Persisted configs stay valid
across mode switches. PATH entries using the symlink path remain stable.

### OOSH_DIR = resolved worktree path (WRONG)

1. After `oo mode` switch: OOSH_DIR still points to the OLD worktree; `~/oosh`
   points to the new one. Scripts using `$OOSH_DIR/...` operate on old files.
2. Persisted PATH entries reference the old worktree — stale across mode switches.
3. `config save` cements the stale value, contaminating future shell sessions.
4. On WODA.prod specifically: the path is 70+ characters of nested EAMD structure,
   making logs and diagnostics noisy and opaque.

## Recommendation

### The fix: OOSH_DIR = `$HOME/oosh`, enforced at every assignment site

**A. `oo.mode()` (line 309):** Replace `export OOSH_DIR="$target_dir"` with
`export OOSH_DIR="$OOSH_LINK"`. The symlink already points to the new target (line 304
switched it). OOSH_DIR stays stable; file resolution follows the symlink.

**B. EAMD install functions (lines 945, 1001):** After creating the `~/oosh` symlink,
set `export OOSH_DIR="$HOME/oosh"` instead of the resolved path. The symlink is
created at line 960 (`ln -s "$OOSH_DIR" oosh`) — reverse the order: create the symlink
first, then set OOSH_DIR to `$HOME/oosh`.

**C. `this.init()` self-heal guard (new):** Add a guard at line 233 that checks: if
`$HOME/oosh` exists as a symlink and OOSH_DIR is not `$HOME/oosh`, override OOSH_DIR to
`$HOME/oosh`. This breaks the self-reinforcing cycle (Point 4) for any machine that
already has the wrong value persisted. Aligns with the Self-Healing Objects principle
from first-principles.md.

**D. `oo.use()` (line 426):** Consider unsetting OOSH_CONFIG_NEEDS_SAVE in the child
env to prevent cross-branch `config save` from contaminating the host config.

### Invariant to maintain

After any of these changes, the invariant is:

> **If `$HOME/oosh` is a symlink, then OOSH_DIR = `$HOME/oosh`.**

This is testable, self-healing (via C), and mode-independent. `oo mode` only changes
the symlink target — OOSH_DIR never changes.

## Traceability

- Task source: PO assignment (oosh-po@MacStudio, ooshTeam:0.0)
- Tron directive: `oo mode` / OOSH_DIR inconsistency
- Scripts measured: `oo` (lines 257-312, 393-427, 930-1016), `this` (lines 28-37,
  185-238, 780-806), `config` (lines 254-321), `init/oosh` (lines 128-171),
  `log` (lines 83-85), `templates/user/bashrc_template` (lines 150-226)
- First-principles reference: Self-Healing Objects (CMM4) in docs/first-principles.md

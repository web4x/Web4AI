# Architecture: env files are PURE STATE — all code lives in scripts

**From**: oosh-po (Tron directive)
**Owners**: oosh-architect (analysis + design) → oosh-expert (implement) → oosh-tester (verify)
**Priority**: HIGH
**Date**: 2026-06-22
**Found on**: u20 / container 4faed70700c9 (dev), EAMD scenario where `~/config` is a symlink → sharedConfig

## The Violation (what triggered this)

`config list` was "broken" (empty) on u20. Root cause is NOT subprocess resolution — it's that **`user.env` contains executable LOGIC instead of pure state**. Actual `~/config/user.env` content found:

```bash
: ${CONFIG_PATH:="${BASH_SOURCE[0]%/*}"}                       # param-expansion logic
{ [ -z "$CONFIG_PATH" ] || [ ! -f "$CONFIG_PATH/user.env" ]; } && CONFIG_PATH="$HOME/config"   # CONDITIONAL
: ${OOSH_DIR:="$(cd "$HOME/oosh" 2>/dev/null && pwd -P || echo "$HOME/oosh")"}  # command substitution
export CONFIG_FILE="user.env"
export BASH_FILE="/usr/bin/bash"
source $CONFIG_PATH/oosh.env                                   # sourcing
source $CONFIG_PATH/log.env                                    # sourcing
```

Conditionals, `BASH_SOURCE` resolution, `$(cd ...)`, and `source` statements are **code**. Because the file re-resolves `CONFIG_PATH` from `BASH_SOURCE` on every source, under the `~/config → sharedConfig` symlink it computes a different path each context → systemic config breakage (`config list` cats logic; sourcing behaves differently login vs subprocess).

## The Architecture Principle (Tron, verbatim intent)

1. **ALL code must be in scripts.** No code in env files — ever.
2. **env files = PURE STATE** — only `export VAR=value` / `declare` lines. Inert. Safe to `source` precisely *because* they contain no logic. (This is why "only env files may be sourced" — that contract only holds if they're pure state.)
3. **`this` script bootstraps the environment.** ALL code that makes config DECISIONS lives in `this`: resolving `CONFIG_PATH`, `OOSH_DIR`, deciding what to source (oosh.env/log.env), any conditionals/fallbacks. The bootstrap computes; it does not store logic in the files.
4. **`config` script owns MAINTAINING + INITIALISING clean config files.** Responsibility for generating/writing/repairing the pure-state env files belongs to `config` (e.g. `config save`, `config init`, `config clean`) — and it must write ONLY pure exports, never logic.

What a clean `user.env` should look like (pure state):
```bash
export CONFIG_PATH="/root/config"
export OOSH_DIR="/root/oosh"
export CONFIG_FILE="user.env"
export BASH_FILE="/usr/bin/bash"
```
The dynamic resolution + the `source oosh.env/log.env` move into `this` (bootstrap).

## Architect tasks (oosh-architect — analysis + design)

1. **WHY/WHEN/HOW** was logic introduced into `user.env`? Trace it: which install/migration/commit wrote it? (the 97KB `install.log` sits in the u20 config dir — start there.) Was it a deliberate workaround for the symlinked-config scenario, or accidental generation? Document the origin so it can't recur.
2. **Audit scope:** is only `user.env` polluted, or also `oosh.env`, `log.env`, others? Across which branches (dev vs test/macos.latest) and which machines/scenarios?
3. **Design the clean separation:**
   - exactly what logic moves from env files → `this` bootstrap (CONFIG_PATH/OOSH_DIR resolution, source decisions, symlink-stable canonicalisation)
   - exactly what `config` must guarantee when it writes/initialises env files (pure exports only; a validator/guard so logic can never be written into an env file again)
   - the symlinked-`~/config` scenario must work via `this`'s resolution, not via in-file `BASH_SOURCE` tricks
4. Hand design to oosh-expert for implementation. Keep design in arch-land; expert implements.

## Expert tasks (after design approved)
- Move config-decision logic into `this`; make `config` init/save/clean emit ONLY pure-state env files; regenerate the polluted u20 `user.env` cleanly.

## Tester tasks
- T-ENV-PURE: every generated env file contains only `export`/`declare` (no conditionals, no `source`, no `$(...)`, no `[ ]`). `config list` works on symlinked-config setup. Sourcing is identical login vs subprocess.

## Architect Analysis (oosh-architect, 2026-06-22)

### 1. ORIGIN — why/when/how logic got into user.env

**Two distinct sources of pollution:**

**Source A: `config.add` (lines 326-327 of `config`)**
`config.init` calls `config.add oosh` and `config.add log`. `config.add()` (line 408) appends `echo source \$CONFIG_PATH/$file.env` into user.env. This is the mechanism that writes `source $CONFIG_PATH/oosh.env` and `source $CONFIG_PATH/log.env` into user.env. Present in ALL branches, ALL machines. This is **deliberate design** — config.add was always intended to chain env files via source statements.

**Source B: `config.save` self-anchor (commit `43796be`, 2026-05-12, author: Hannes/Claude)**
Commit "fix(config): OOSH_DIR self-anchor in user.env so fresh shells survive oo mode" introduced 3 lines of executable logic at the TOP of user.env during `config.save`:
```bash
: ${CONFIG_PATH:="${BASH_SOURCE[0]%/*}"}
{ [ -z "$CONFIG_PATH" ] || [ "$CONFIG_PATH" = "${BASH_SOURCE[0]}" ]; } && CONFIG_PATH="$HOME/config"
: ${OOSH_DIR:="$(cd "$HOME/oosh" 2>/dev/null && pwd -P || echo "$HOME/oosh")"}
```
This was a workaround for `oo mode <branch>` overwriting oosh.env and losing OOSH_DIR. The fix put CONFIG_PATH + OOSH_DIR resolution into user.env so it survives oosh.env overwrites. **Deliberate workaround, wrong layer** — the commit message itself says "fix at the strip layer" but then puts code in the data file.

**Root cause**: no architectural boundary between "what env files may contain" and "what scripts may write into them". `config` treats env files as script fragments, not pure state.

### 2. AUDIT — which env files are polluted, which branches

| File | Machine | Violations | Content |
|------|---------|-----------|---------|
| **user.env** | MacStudio | 2 | `source $CONFIG_PATH/log.env`, `source $CONFIG_PATH/oosh.env` |
| **user.env** | u20 (container) | 5 | CONFIG_PATH BASH_SOURCE resolution, OOSH_DIR command substitution, conditional, 2x source |
| **oosh.env** | MacStudio | 0 | Pure exports only |
| **oosh.env** | u20 | 0 | Pure exports only |
| **log.env** | MacStudio | 0 | Pure exports only |
| **log.env** | u20 | 0 | Pure exports only |

**Branches**: `config.add` is in ALL branches (dev, macos.latest, prod). The `43796be` self-anchor is in dev branch (post May 12 2026). u20 has the self-anchor (installed from dev). MacStudio does NOT have the self-anchor (older install, only the `source` lines).

### 3. DESIGN — clean separation

#### Principle
env files = `export VAR="value"` ONLY. All logic lives in scripts.

#### What moves WHERE

**FROM user.env → INTO `this` bootstrap (this.init or this.load):**
1. `CONFIG_PATH` resolution: `: ${CONFIG_PATH:="${BASH_SOURCE[0]%/*}"}` + conditional fallback → becomes `this` logic that resolves CONFIG_PATH from `$HOME/config` (canonical), with symlink-following via `cd -P && pwd` if needed
2. `OOSH_DIR` resolution: `: ${OOSH_DIR:="$(cd "$HOME/oosh" ...)"}` → `this` already does this at line 195: `: ${CONFIG_PATH:=$HOME/config}`. Extend to also resolve OOSH_DIR with symlink-following
3. `source $CONFIG_PATH/oosh.env` and `source $CONFIG_PATH/log.env` → `this` bootstrap sources these explicitly after sourcing user.env. The chain is: `.bashrc` → `source ~/config/user.env` (pure state) → `this` bootstrap sources oosh.env + log.env (code)

**`config` script changes:**
1. **`config.add`**: DELETE this method or change it to ONLY write an `export` line (e.g., `export CONFIG_CHAIN_OOSH=1`) — the actual sourcing moves into `this`
2. **`config.save` (line 578 area)**: Remove the self-anchor logic (the 3 lines from commit 43796be). user.env header is just pure exports
3. **`config.init`**: Lines 326-327 (`config.add oosh`/`config.add log`) removed — sourcing chain managed by `this`
4. **NEW: `config.validate`** (or guard in `config.save`): after writing any env file, scan it for violations: `source`, `$(`, `[`, `{`, `: ${`. If any found, error and refuse to write. This is the guard that prevents future pollution.

**`this` bootstrap changes:**
After `source $CONFIG` (user.env), explicitly source the chained env files:
```bash
# Bootstrap: source pure-state env files (user.env has no source statements)
source "$CONFIG_PATH/user.env"   # pure exports: CONFIG_PATH, OOSH_DIR, BASH_FILE, PATH
[ -f "$CONFIG_PATH/oosh.env" ] && source "$CONFIG_PATH/oosh.env"  # pure exports: OOSH_MODE, OOSH_PM, etc.
[ -f "$CONFIG_PATH/log.env" ] && source "$CONFIG_PATH/log.env"    # pure exports: LOG_LEVEL, LOG_DEVICE
```

**Symlink scenario**: `~/config → sharedConfig` works because `this` resolves `CONFIG_PATH=$HOME/config` (the symlink), then follows it. The key insight: the symlink resolution happens in `this` (code), not in user.env (data). `BASH_SOURCE` tricks in user.env are unnecessary when `this` handles the resolution.

#### Clean user.env (target state)
```bash
export CONFIG_PATH="/root/config"
export OOSH_DIR="/root/oosh"
export CONFIG_FILE="user.env"
export BASH_FILE="/usr/bin/bash"
export PATH="..."
export TRON_MONITOR_PANE="TRONinterface:0.3"
```
No `source`, no `$()`, no `[ ]`, no `: ${`. Pure state. `config list` shows only exports.

#### Migration
- `config init.env` regenerates user.env cleanly (no self-anchors, no source lines)
- `this` bootstrap handles the sourcing chain
- Existing installs heal on next `config init.env` or `oo update`

### 4. HANDOFF
Design ready for oosh-expert implementation. Expert should NOT start until oosh-po approves this design.

## Report-back (edit here; report to oosh-po)
- Architect (analysis + origin + design): DONE 2026-06-22. See above. Two pollution sources: config.add (deliberate, all branches) + 43796be self-anchor (dev only, workaround). Design: source chain moves to `this`, config.validate guards purity.
- Expert (impl + commit): DONE `d45031a` — (1) `this` bootstrap sources oosh.env+log.env explicitly after user.env (both init paths); (2) `config.add` writes `export CONFIG_CHAIN_<NAME>=1` instead of `source` line; (3) new `config.validate` guards purity (line-leading pattern match: rejects source/conditional/command-sub, accepts brackets in quoted values — PO note #1 addressed); (4) MacStudio user.env regenerated clean. config.add callers: only config.init + config.update — both still work, no external callers (PO note #2 addressed, kept method with reduced behavior). `config list` + `config validate` green on all 3 env files.
- Tester (T-ENV-PURE result):

## PO APPROVAL (oosh-po, 2026-06-22)
APPROVED — design matches the directive (logic→this, config owns clean init, validate guard). Hand to oosh-expert. Two implementation notes (must address):

1. **config.validate must match LINE-LEADING statements, not substrings.** Reject lines that START a statement: `^source `, `^: ${`, `^[[:space:]]*[` (test), `^[[:space:]]*{` (group), and any line containing `$(`/backticks OUTSIDE a quoted value. Do NOT reject a legit pure-state export whose VALUE contains those chars, e.g. `export X="a[b]"`, `export JSON='{...}'`, `export P="/a:/b"`. Tester T-ENV-PURE must cover BOTH: (a) reject logic lines, (b) ACCEPT exports with brackets/parens/braces inside quoted values.
2. **config.add — decide delete vs reduce by checking callers first.** `grep -rn "config.add" oosh` across the tree; if its only purpose was the source-chaining (now moved to `this`), delete it + update config.init. If other callers rely on it, reduce to export-only. Don't break a live caller.

Sequencing: expert implements `this` sourcing-chain + config changes + config.validate, regenerates the polluted u20 user.env cleanly, verifies `config list` works on the symlinked-config container. Then tester T-ENV-PURE.

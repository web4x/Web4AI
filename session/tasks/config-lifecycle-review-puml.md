# Task: Architect reviews complete config lifecycle + PlantUML documentation

**From**: oosh-po@WODA.prod (Tron directive 2026-06-27)
**Owner**: oosh-architect
**Priority**: HIGH — verify before merge-back
**Sprint**: constructor-contract (S-12)

## What to review

The config system had significant surgery this sprint (S-2 through S-5 + S-11). Verify the COMPLETE lifecycle is correct and consistent, then document it.

### Review checklist

1. **config.init**: calls config.save (no-args) + config.add oosh + config.add log. Does it produce a correct, complete user.env with fundamentals + source chain? Run it on a clean box (or simulate).

2. **config.save (no-args)**: the harvest-resolve-merge (S-5). Does it:
   - HARVEST valid exports from FILE + live env (no loss)?
   - RESOLVE fundamentals via BASH_SOURCE (S-2)?
   - MERGE fundamentals first, user vars preserved, source chain from harvest?
   - Validate at the end?

3. **config.save <name> <PREFIX>**: the per-module save (e.g. `config.save oosh OOSH`). Does it correctly dump only PREFIX-matching vars to `<name>.env`?

4. **config.add <name>**: writes `source $CONFIG_PATH/<name>.env` (S-11 restore). Is it idempotent (adding twice = one source line, not two)?

5. **config.repair**: is it truly just `config.save` (the alias)? No separate path?

6. **config.validate**: accepts export/declare/comment/blank + source *.env (Rule A). Rejects all logic. Does it cover ALL the constructs that were historically polluting?

7. **this.init → resolve.fundamentals**: BASH_SOURCE chain walker. Does it run on BOTH init paths? Does it handle: symlinked ~/config, EAMD layout, $HOME/oosh simple layout?

8. **this.selfheal**: detects pollution, auto-repairs. Called on both init paths. Never RC=1.

9. **The full lifecycle**: install (ossh.install → config.save chain) → boot (this.init → source user.env → source oosh.env/log.env) → run (config.set/get) → repair (config.save = reinit) → validate. Is there ANY gap where a broken state can persist silently?

### PlantUML deliverable

Create `docs/puml/config-lifecycle.puml` documenting:
- The config file hierarchy (user.env → oosh.env, log.env, custom.env)
- The init/save/add/repair lifecycle as a state diagram or activity diagram
- The harvest-resolve-merge flow
- The validate gate
- The constructor contract: init always yields valid object

### Report-back
Write findings + any issues into this file. Commit the PlantUML. Ping oosh-po.

## Report-back (edit here)
- Architect (review findings + puml commit): **DONE** 2026-06-27. Review + PUML below.

### Review findings (oosh-architect, 2026-06-27)

**1. config.init** (line 205): CORRECT. Calls resolve.fundamentals, sets CONFIG vars in memory, mkdir. Does NOT write user.env (that's config.save's job). Clean.

**2. config.save (no-args)** — harvest-resolve-merge (line 300-366): CORRECT.
- Phase 1 HARVEST: reads FILE first (valid exports + source lines), then adds from live env (vars not already harvested). Handles born-broken (file has logic → only valid exports survive) and primed env (live vars captured).
- Phase 2 RESOLVE: calls resolve.fundamentals. Canonical.
- Phase 3 MERGE: fundamentals first (override stale), user vars from harvest (skip fundamentals), source chain from harvest. Writes to $CONFIG. Validates.
- **No loss**: user vars survive reinit. TRON_MONITOR_PANE, OOSH_SSH_CONFIG_HOST — all preserved via file harvest.

**3. config.save <name> <PREFIX>** (line 288-299): CORRECT. Dumps declare -px filtered by prefix. Only from live env (correct — sub-env files are written from primed state after init).

**4. config.add** (line 453-476): PARTIALLY CORRECT.
- Appends `source $CONFIG_PATH/<name>.env` to user.env. Rule A compliant.
- **GAP-1: NOT idempotent.** Calling `config.add oosh` twice appends two `source $CONFIG_PATH/oosh.env` lines. `config.clean` (sort -u) deduplicates, BUT sort reorders all lines — fundamentals may move after source lines, breaking source order. Expert should guard: `grep -q "^source.*$file.env" "$CONFIG" && return 0` before appending.

**5. config.repair** (line 448-451): CORRECT. `config.repair() { config.save; }` — one-liner alias. No separate path.

**6. config.validate** (line 422-446): CORRECT.
- Accepts: export/declare, bare VAR=, comment (#), blank, `source *.env`, `. *.env`. Rule A.
- Rejects: everything else.
- Covers all historical pollutants: `: ${` (BASH_SOURCE trick), `$(...)` (command sub), `[ ]` / `{ }` (conditionals).
- Note: bare `VAR=` (no export) is accepted — intentional? It's uncommon in env files. Not a bug but worth documenting.

**7. resolve.fundamentals** (this:99-147): CORRECT.
- BASH_SOURCE chain walker: iterates from deepest frame, finds dir with `this` + `config` files. Symlink-safe via `cd -P`. Last resort: `which this`.
- CONFIG_PATH: follows `~/config` symlink via `cd -P`. Falls back to `$HOME/config`.
- OOSH_MODE: from git branch in OOSH_DIR.
- Runs on BOTH this.init paths (line 258 + 269/293). Handles EAMD layout, simple layout, symlinked config.

**8. this.selfheal** (this:149-166): CORRECT.
- Scans user.env for non-pure-state lines using same regex as config.validate.
- If pollution found → calls `config.save` (harvest-resolve-merge).
- **Always RC=0.** Constructor never fails.
- Called on both this.init paths (line 270 + 295).

**9. Full lifecycle gaps**:
- **GAP-1 (config.add idempotency)**: described above. Minor — config.clean's sort-u masks it, but sort reordering is a latent bug.
- **GAP-2 (BASH_FILE conditional emit)**: config.save line 336: `[ -n "$BASH_FILE" ] && echo "export BASH_FILE=..."`. If BASH_FILE is empty (unlikely but possible on minimal installs), it's silently skipped. Should resolve via `which bash` fallback. Trivial.
- **GAP-3 (config.save calls config.save oosh/log after merge)**: Lines 362-363 call `config.save oosh OOSH` and `config.save log LOG`, which overwrite oosh.env and log.env from live env. If called during a born-broken boot where OOSH_* vars aren't fully primed yet, oosh.env may get a partial dump. In practice, resolve.fundamentals has primed OOSH_DIR/OOSH_MODE by this point, so it works — but the ordering dependency is implicit, not guarded.
- **No silent-broken gaps found.** Every path through this.init ends with resolve.fundamentals + selfheal. A polluted env is detected and repaired before the constructor returns.

### PlantUML
Created: `docs/puml/config-lifecycle.puml` — activity diagram with 3 swimlanes (this kernel, config persistence, env files). Covers: file hierarchy, this.init constructor, config.save harvest-resolve-merge, config.validate, boot sequence, constructor contract legend.

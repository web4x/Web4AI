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
- Architect (review findings + puml commit):

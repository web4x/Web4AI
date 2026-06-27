# BUG: config.add writes export marker instead of source line — breaks config composition

**From**: oosh-po@WODA.prod (Tron directive 2026-06-27)
**Owner**: oosh-expert
**Priority**: HIGH
**Sprint**: constructor-contract (S-11)

## Problem

`config.add oosh` should write `source $CONFIG_PATH/oosh.env` into user.env — this is the config COMPOSITION mechanism. user.env sources oosh.env, log.env, etc. to build the full env.

The expert changed config.add to write `export CONFIG_CHAIN_${name}=1` (a dead marker) instead of the source line. This kills dynamic composition — you can't add new config modules via `config.add`.

Meanwhile `config.save` (no-args) HARDCODES `source $CONFIG_PATH/oosh.env` + `source $CONFIG_PATH/log.env` at lines 352-353 — so the existing two work, but the composition is no longer dynamic.

## The architecture (Tron's design — restore it)

Config files are COMPOSED via source entries:
```
user.env:
  export CONFIG_PATH="..."
  export OOSH_DIR="..."
  ...user vars...
  source $CONFIG_PATH/oosh.env    ← config.add oosh writes this
  source $CONFIG_PATH/log.env     ← config.add log writes this
```

Each sub-env file (oosh.env, log.env) holds its own domain vars. `config.save oosh OOSH` dumps OOSH_* vars to oosh.env. `config.save log LOG` dumps LOG_* vars to log.env. The source lines in user.env chain them together.

`config.add <name>` = "add a new config module to the composition" = write `source $CONFIG_PATH/<name>.env` into user.env.

This is Rule A: env files contain state + `source *.env` as the sole permitted construct. config.validate (S-4, b50355e) already accepts source *.env lines. The pieces are aligned — config.add just needs to write the source line again.

## Fix

1. **config.add**: restore the source-line write: `echo "source \$CONFIG_PATH/$file.env"` (was this before the expert changed it). Remove the `export CONFIG_CHAIN_${name}=1` marker.

2. **config.save no-args**: remove the hardcoded source lines at 352-353. Instead, HARVEST existing source lines from the file (Phase 1 already does this — the harvest reads `source *.env` lines). This makes the composition dynamic again — whatever `config.add` wrote is preserved through save cycles.

3. **config.init**: the calls `config.add oosh` + `config.add log` at lines 360-361 will now correctly write source lines again.

## Acceptance criteria
- [ ] `config.add mymodule` writes `source $CONFIG_PATH/mymodule.env` into user.env
- [ ] `config.save` (no-args) preserves ALL source lines from the file (not just hardcoded oosh/log)
- [ ] `config.save oosh OOSH` still dumps OOSH_* vars to oosh.env (unchanged)
- [ ] `config.validate` passes (source *.env is accepted per S-4)
- [ ] Round-trip: config.add custom → config.save → custom source line survives

## Report-back
- Expert (fix + commit):

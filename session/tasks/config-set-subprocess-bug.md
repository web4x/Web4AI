# Task: Fix config for OOSH_COMPONENTS_DIR — understand config architecture first

**Assigned to**: oosh-expert (baseTeam:0.2)
**Priority**: HIGH — blocks oo mode.base.set and oo mode.list

## STOP — Relearn config first

Before touching ANY code:

1. **Reread `docs/oosh-architecture.md`** — the config section
2. **Reread the `config` script** — understand how it works end to end
3. **Read `~/config/oosh.env`** — this is where ALL `OOSH_` prefixed variables live
4. **Read `~/config/user.env`** — understand what sources what

## Architecture (Tron directive)

- `oosh.env` holds ALL OOSH-specific environment variables, ALL prefixed with `OOSH_`
- `oosh.env` is sourced from the main config (`user.env`)
- `OOSH_COMPONENTS_DIR` belongs in `oosh.env`, NOT `user.env`
- The pattern: save to `oosh.env`, source from `user.env`

## What to do

1. Reread docs (mandatory — don't skip)
2. Understand how `config set` currently works and why it fails as subprocess
3. Extend config to support our use case: `OOSH_COMPONENTS_DIR` saved to `oosh.env`
4. Make `oo mode.base.set` use the correct config pattern
5. Verify `oo mode.base.get` reads from config/env correctly

## Verification

```bash
oo mode.base.set /some/valid/path
# Should persist OOSH_COMPONENTS_DIR to oosh.env

config get OOSH_COMPONENTS_DIR
# Should return the path

oo mode.list
# Should list branches from that path

# After new shell:
bash
oo mode.base.get
# Should still return the persisted path
```

Commit, push, notify tester.

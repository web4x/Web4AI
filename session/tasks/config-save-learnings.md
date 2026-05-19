# Learnings: config save prefix matching — for tester

**From**: oosh-expert (baseTeam:0.2)
**Commit**: e159f09

## What was fixed

`config.save` line 313 grep matched vars CONTAINING the prefix anywhere in the name, not just vars STARTING with it.

Example: `config.save` (no args, name=CONFIG) matched `OOSH_SSH_CONFIG_HOST` because it contains `CONFIG` as substring.

## Root cause

Old grep: `\([^ ]*$name\)` — `[^ ]*` allowed any prefix before `$name`.
New grep: `grep " ${name}"` — matches after the space in `declare -x VARNAME=`, so only vars starting with the prefix match.

## Test cases for test.config

1. `config save` (no args) — `user.env` must NOT contain any `OOSH_*` or `LOG_*` vars
2. `config save oosh OOSH` — `oosh.env` must contain ALL `OOSH_*` vars and ONLY `OOSH_*` vars
3. `config save log LOG` — `log.env` must contain ALL `LOG_*` vars and ONLY `LOG_*` vars
4. Set a var like `export OOSH_SSH_CONFIG_HOST=test` then `config save` — verify it appears in `oosh.env` only, NOT in `user.env`
5. Set `export CONFIG_PATH=/tmp` then `config save` — verify it appears in `user.env` (starts with CONFIG)
6. `config set TESTVAR hello` then `config get TESTVAR` — verify persistence (temp file fix from 6beb2d8)
7. `config ssh.set.config.host TestHost` — verify `OOSH_SSH_CONFIG_HOST` ends up in `oosh.env` not `user.env`

## Architecture reminder

```
~/config/user.env    → CONFIG_* vars, PATH, BASH_FILE, sources oosh.env + log.env
~/config/oosh.env    → OOSH_* vars only
~/config/log.env     → LOG_* vars only
```

# Sprint: init/oosh self-healing constructor — LIVE on WODA.test su donges

**Driver**: oosh-po@MacStudio · **Owners**: oosh-expert (implement, dev), oosh-tester (verify, live WODA.test su donges)
**Relates**: #27 (constructor contract), #26, #12. **Tron-directed 2026-07-01.**

## GOAL / ACCEPTANCE (commit gate)
On WODA.test, a **fresh `su donges` login yields a functional `[oosh]` shell**, OOSH operational in `/home/donges/oosh`. Running `./init/oosh` as the user (no sudo) on a blank/ polluted env → self-derives, provisions keys, completes, and re-login = `[oosh]`. **Commit ONLY when this is green.**

## GIT TOPOLOGY (critical — I got this wrong once)
- **Develop + commit + PUSH on MacStudio** (`/Users/donges/oosh`, ssh remote, has the key). Use a `git worktree` on `dev` so the live team's `test/macos.latest` checkout isn't disturbed.
- **WODA.test `su donges` can PULL** (not push). Loop: expert pushes dev → donges `git pull` on WODA.test → tester runs init + verifies. Iterate.
- Do NOT hand-configure git/keys on WODA.test — provisioning is init's job (that's the point).

## PROVEN + LIVE on WODA.test (incorporate into the dev commit)
Current working `init/oosh` (dev 26KB + these two edits) is on MacStudio at `/tmp/init-oosh-dev.sh`:
1. **Clean-env guard** — after the auto-run guard (line ~41), `unset OOSH_DIR CONFIG CONFIG_PATH CONFIG_FILE OOSH_MODE OOSH_OS OOSH_PM OOSH_PM_UPDATED OOSH_PROMPT OOSH_SHLVL OOSH_SSH_CONFIG_HOST OOSH_STATUS BASH_FILE LOG_DEVICE LOG_LEVEL LOG_LEVEL_RESET`. VERIFIED: ignores su-leaked /root/oosh + /root/config, builds clean user env, `/config` cascade gone.
2. **Run-as-user** — gate the sudo re-exec: `if [ "$(id -u)" -ne 0 ] && [ -n "$MODE" ]; then` (only ossh-driven MODE=root re-execs; direct user runs as themselves). VERIFIED: no sudo prompt, ran as donges, provisioned ~/.ssh keys.

## REMAINING FIXES (apply the ERROR/WARNING PRINCIPLE)
**Tron's principle**: ERRORS prevent the function (loud, fatal). WARNINGS self-heal + mitigate (quiet, continue). Classify every message; convert the below to self-healing warnings.
1. **LOG_DEVICE /dev/stdout** (`log:74` + all raw `>>$LOG_DEVICE` writes: 63,74,108,120,191,203): init exports `LOG_DEVICE=/dev/stdout`; a non-root user can't write root's fd1 → `Permission denied`. log already coerces `/dev/stdout`→`/dev/stderr` in places (22,160,222) but raw writes bypass it. FIX: coerce once, globally, so LOG_DEVICE is always writable for the invoking user (warning-self-heal, never a raw error line).
2. **`user:311` `rm $sshDir/authorized_keys`** → `rm -f` (fresh install = nothing to remove = warning, self-heal; function continues to recreate at 312).
3. **`mv '/home/donges/*.public_key'`** (locate — not in `user`; check init flow / ossh): glob matched nothing → guard: only `mv` if the file exists. Warning, self-heal.
4. **.bashrc login bootstrap**: init must persist the OOSH login hook into donges' `~/.bashrc` (currently stock Ubuntu default → `su donges` = plain bash). After init, a fresh interactive shell must source OOSH → `[oosh]` prompt. This is the ACCEPTANCE-critical piece.
5. **apt privilege-defer**: as user, `apt-get` hits `Could not open lock file … Permission denied`. Per "oo state machine checks privilege later", this must be a WARNING (self-heal: skip/defer the system-pkg step, or escalate only for that one step when actually needed) — NOT a noisy error, and must NOT interrupt the tail (the .bashrc apply / `exit 117`).

## TEST (oosh-tester, live on WODA.test)
`ossh WODA.test` → as root → `su donges`. T-INIT-CLEAN:
- run `OOSH_DIR=/root/oosh CONFIG_PATH=/root/config SH_OPT='+x' ./init/oosh` (polluted env, trace off) → assert: no sudo prompt, no `/config`, no raw Permission-denied errors (warnings ok), keys provisioned, **completes**.
- **exit + fresh `su donges` → `[oosh]` prompt, OOSH functional** (run an oosh cmd, e.g. `oo` / `config list`).
- second run idempotent. Report pass/fail per item in this file's report-back.

## REPORT-BACK
- oosh-expert:
- oosh-tester:

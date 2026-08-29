> # ⛔ DEPRECATED 2026-07-03 — STALE MacStudio SHADOW, DO NOT READ AS CURRENT STATE ⛔
> **STOP — verify, don't trust.** This is the ~2mo-stale MacStudio shadow (last update 2026-07-03). MacStudio confirmed
> inactive (no live session/bridge/registry entry, 30+ days git-silent, WODA.prod-measured 2026-08-29).
> **LIVE ANCHOR → `session/agents/oosh-expert/context.md`** (oosh-po's live WODA.prod worker). If you booted into THIS
> file, you mis-resolved: stop, re-measure your host/identity, open the live anchor + git log. Deprecated by oosh-PO
> authorization (cross-team boot-currency sweep); kept for historical trace only. ⚠ If a MacStudio oosh-expert IS live,
> this banner is wrong — flag oosh-PO to coordinate with the MacStudio PO.

# oosh-expert@MacStudio — Context [DEPRECATED — see banner]

**Instance**: oosh-expert @ MacStudio, pane ooshTeam:0.2 (Opus 4.8 1M)
**Role**: OOSH Implementation Authority — owns ALL oosh scripts (this, oo, config, hiveMind, otmux, claudeCode, ossh, odocker, state helpers…)
**Workflow**: develop on `dev` in a **git worktree** (`/tmp/oosh-dev-s2s3`) so the live team's `test/macos.latest` checkout is undisturbed; push to origin/dev; **tester + PO drive verification on WODA.test**; report-back = git mailbox (SPRINT-COMMS).
**PO**: oosh-po @ ooshTeam:0.0 (also oosh-po@MacStudio) · **Tester**: oosh-tester@MacStudio (WODA.test) · **SM**: TRONinterface:0.1
**Peer instance**: oosh-expert@WODA.prod (separate — its state lives in `session/agents/oosh-expert/context.md`; don't clobber).
**Updated**: 2026-07-02.

## Branch model (Tron): `dev` = OS-INDEPENDENT master. `macos.latest` = platform-specific dev. Flow: feature→macos.latest→generalized→dev. Do cross-platform work on dev.

## This session's shipped work (all on dev unless noted)
- **init/oosh self-heal constructor** — GATE GREEN (tester RUN6 `c0e6036`). 12 edits incl. the fd2-dup log-emit fix.
- **SETUP_SERVER sprint**: S2 `566fed9`, S3 `650e743`, S7 `19a2a45`, F2 `8be593d`, S8 `09d33c9`+`691a269`. (S8 rebuild-persistence still needs tester T-RECONCILE on an ISOLATED box.)
- **Death-to-Flags**: #5 `90f6768`, #33 `553b19a` — SIGNED OFF, true zero flags / 9 scripts, fence at budget 0.
- **#13 claudeCode/dash** — CLOSED as already-solved. See learnings (measure-the-entry lesson).
- **#34 init/oosh non-destructive relocation** — `a3b1eff` (S34.1) SIGNED OFF; tester S34.2 `b550156`. TARGET-side closed (existing $HOME/oosh backed up, never wiped).
- **#35 init/oosh SOURCE-guard** — `34c44cb` + refine `10ccc7e` SIGNED OFF; tester T-SOURCE-GUARD 3/3 GREEN `1e4d735`. The real #13 wipe was the SOURCE side (`mv "$OOSH_DIR"` relocating a live checkout used as OOSH_DIR when run as root). Fix: throwaway (same-process fresh-clone flag OR temp-root path — the signal that survives the re-exec) → mv; live persistent checkout → `cp -Rp` (source preserved). Measure caught TMPDIR-trailing-slash + /var/folders bugs. **#34 class CLOSED both sides.** See learnings.
- **Earlier on macos.latest**: env-files-pure-state `d45031a`, hiveMind MVC parity merge `f74c20a`, otmux send-Enter-over-SSH `04b54a5`, tronMonitor team.sweep auto-switch `3249104`.

## NOW
Idle — sprint-1 tail (E1.2/D1.3) Tron-blocked on the naked container. #13/#34/#35 closed (#34 class fully closed both sides). Worktree `/tmp/oosh-dev-s2s3` clean + retained on dev. Awaiting PO assignment or block-clear. (~86% context used → SM driving a zero-loss rewind after this save.)

## Operating rules (SM/PO, never violate)
- One-liner commits, details in task file. Never git rebase; pull with merge.
- `bash -n` (and `sh -n` for POSIX scripts like init/oosh) before every report.
- MEASURE live on WODA.test; never assume. Report-back = commit + push to the task file.
- Constructor-safety: a constructor must NEVER destroy an existing install — backup, never blind-wipe (#34/#27). A `mv` has TWO destructive sides: guard the TARGET (clobber → backup) AND the SOURCE (relocating a live tree → cp-not-mv) (#35).
- NEVER run a destructive installer against a live oosh dir — structural/isolated tests only.
- Safety-class fixes: PO co-confirm sign-off is on the TESTER's OWN independent test commit, not the implementer self-test. Hand the tester a precise case-matrix oracle.
- A shell var/flag CANNOT survive `exec` — for post-re-exec provenance, use a durable signal (the path, an env var, or an arg).

# Sprint: SETUP_SERVER install state machine 32→62 — fresh-install completion (dev reliability gap)

**From**: oosh-po (PO decision on u24 gate, Tron framing "macos.latest boots more reliably → path macos.latest→dev")
**Owners**: oosh-architect (compare macos.latest vs dev FIRST — port vs fix) → oosh-expert (targeted fixes) → oosh-tester (verify)
**Priority**: HIGH — blocks u24 gate Step 4/5 (clean boot + team push)
**Status**: OPEN

## Context
u24 fresh-install gate: CORE #6 GREEN (pure-state config 20 exports/0 source on pristine ubuntu:24.04; 5 install bugs fixed: rsync→scp fallback 4397ac2/8a3c02d, mode ssh→root contract, ssh-keygen -N'' hang 99fb694, seccomp=unconfined). BUT `SETUP_SERVER` state machine STALLS at state 32 (`root.dev.keys.installed`), cannot reach 62 (completion). Root `.bashrc` never wired → clean boot blocked → team push blocked. This is exactly the "dev boots less reliably than macos.latest" gap.

## Known bugs in the 32→62 tail (expert surfaced)
- `ERROR Unknown method: config ci`
- `state: line 361: state.declaration: command not found`
- `this.load failed to load ossh from "prereqs.install"`
- `config 2cuGitHub/2cuBitbucket not found`
- ANSI-color leak into a brace pattern: `.ssh/\033[1;31mERROR>.pub` — an `error.log` string captured into `$RESULT` then used as a filename (a result-vs-error contamination bug)

## Strategy — macos.latest → dev (Tron directive)
**Do NOT blind-grind dev bug-by-bug.** macos.latest is the more-reliable reference.

### S-A — oosh-architect (FIRST): compare SETUP_SERVER macos.latest vs dev
- Does macos.latest's SETUP_SERVER define + complete states 32-62? Diff the state declarations + the per-state methods (config ci, state.declaration, prereqs.install) macos.latest vs dev.
- Decide per bug: PORT macos.latest's working version into dev, or FIX dev's (if the bug exists on both / is dev-specific).
- Output an ordered fix list (port-these / fix-these) into report-back. Architect says WHAT; expert implements.

### S-B — oosh-expert (after S-A): apply the ordered fixes
- Port/fix per architect's list. Re-install on u24 after each (~5min/cycle), advance the state machine toward 62.
- The result-vs-error contamination (ANSI leak into filename) is a real `create.result`/`error.log` bug — fix at the source (errors must never land in `$RESULT`).
- Commit each.

### S-C — oosh-tester: verify
- Fresh dev install on u24 reaches state 62, root `.bashrc` wired, clean boot (Step 4 checks) all green.

## Acceptance
- [ ] Architect macos.latest-vs-dev comparison + ordered port/fix list
- [ ] SETUP_SERVER reaches state 62 on fresh u24 install
- [ ] root `.bashrc` wired → clean boot green on u24
- [ ] (then u24 gate Step 5 team.push can proceed)

## Report-back (edit here)
- Architect (compare + port/fix list):
- Expert (fixes + commits + state reached):
- Tester (state 62 + clean boot on u24):

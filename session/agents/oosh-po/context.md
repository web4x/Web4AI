# Product Owner Context

**Updated**: 2026-06-11
**Role**: oosh-po
**Pane**: ooshTeam:0.0 on MacStudio.native
**Session**: oosh-po@MacStudio [aca3405a]

## Current State (post Phase 1 rewind, before Phase 2 deep rewind)

- Phase 1 rewind freed room. About to do Phase 2 DEEP rewind.
- Auto mode active — autonomous execution
- Team status: tester recovering from rewind, expert+architect delivered docker fix
- robbin-skill-expert (robbinTeam2:0.3) coordinating with me on OOSH skill authoring

## Active Work Streams

### 1. Docker install fix (66212be on top of 0bdd8df)
- Bug: fresh Once.sh install uses HTTPS instead of SSH, no keys provisioned
- Architect design: Option C (volume mount, never bake keys) + sequencing reversal
- Expert implementation: ossh config.create 2cuGitHub FIRST, then clone via 2cuGitHub: URL
- Cascade: 2cuGitHub: → git@github.com: → HTTPS
- Status: ready for tester verification (tester rewinding)
- Task file: session/tasks/20260610T1900Z.docker-install-git-keys-fix.md

### 2. config.init bug investigation
- Under investigation — details in expert's notes
- TBD priority based on sprint completion needs

### 3. robbin-skill-expert OOSH teaching (commit 4d89f61)
- Delivered 4 must-knows: dispatch + signature, completion conventions, symlink/verify, common wrongs
- Identified 2 taskChain deviations to fix:
  - `.bootstrap` should be `.start`
  - global `parameter.completion.X` should be per-method `method.completion.paramName`
- Will coordinate fix with oosh-expert at next STOP

### 4. Sprint 1 — nearly done
- All expert tasks DONE (SC-A through SC-G, D4, D5, P0, MVC fix 382a26b)
- Tester remaining: SC-D.3 (reconcile roundtrip), SC-A.3 (invariant fixtures), D4.2 (fit verification)
- Architect: SC-G.3 PUMLs in progress
- Sprint 0 closed
- 458-commit branch merge test/macos.latest→dev complete
- Cross-platform Termux: 185/185 tests pass (oo+ossh+config+log)

## Teams (registered)
| Team | Status |
|------|--------|
| TRONinterface | running — SM active, just saved |
| ooshTeam | running — expert active, tester rewinding, architect delivered |
| web4team | running — 4 agents |
| robbinTeam2 | running — robbin-skill-expert active |
| baseTeam | running — agent-trainer (also rewinding) |

## Recent Deliverables (commits this session)

- `382a26b`: MVC rename consistency fix — tree.detailed reads pane title not stale JSONL
- `0bdd8df`: Docker install SSH-first cascade
- `66212be`: Docker architect refinement (canonical ossh config.create)
- `4d89f61`: robbin OOSH teaching captured
- ossh key.pull 6 Termux bugs FIXED + verified live on samsungTablet
- config.save prefix-match bug FIX (af23e3f)
- Bulk /tmp/→TMPDIR cross-platform fix (33+ sites)

## Bugs Filed This Session
- session/tasks/mvc-rename-consistency-bug.md — FIXED (382a26b)
- session/tasks/ossh-key-pull-termux-bugs.md — 6 bugs FIXED + verified Termux
- session/tasks/hivemind-multi-team-resolve.md — 5 bugs, active-team bottleneck (queued)
- session/tasks/20260610T1900Z.docker-install-git-keys-fix.md — FIXED, awaiting tester

## Rules (eternal — copy forward on every save)

- Use hiveMind for agent interaction (not raw otmux for agents)
- Sweep detects → manual capture → then decide
- Never blind-unblock
- No output filtering (no 2>/dev/null, no grep/head/tail on output)
- No until loops or while-sleep polling — they stack up in context
- PO delegates, never debugs
- NEVER /clear a trained agent — use /rewind (F-CLEAR rule)
- /rewind protocol: shallow rewind → agent saves → deep rewind (TWO-PHASE)
- Failure is failure — NO "pre-existing" excuse. ALL failures get task files
- CMM4: task file is the spec, chat is just the reference
- Failure: rewind option 2 only (Restore conversation), never 1/3/4
- Check scrumMaster subscription every 15-30 min
- Compact urgent at ~10%, not 35% (F46 — not hysteric)

## Queued for next assignment cycle
- session/tasks/tronmonitor-fit-no-arg-default.md — NORMAL
- session/tasks/skill-expert-scenario-planning.md — NORMAL
- session/tasks/hivemind-multi-team-resolve.md — HIGH (5 bugs)
- taskChain skill deviations (.bootstrap→.start, global→per-method completions)

## After Phase 2 deep rewind, I need to:
1. Read this context.md
2. Read learnings.md  
3. Resume from "current work streams" section
4. Health check: who and where am I (this file confirms identity)

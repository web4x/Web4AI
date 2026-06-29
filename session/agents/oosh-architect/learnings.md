# oosh-architect Learnings

## MVC Architecture (the foundation)
- claudeCode = Model: session UUID, context %, PID, JSONL. ONE facade to Controller (fork.to). Portable without tmux.
- otmux = View: pane management, capture, send, layout. ZERO references to claudeCode/hiveMind. Prefix uses registry FILE only.
- hiveMind = Controller: orchestrates Models in View panes. Owns ALL state stores (roles/sessions/teams/forks/queue/tronMonitor/active.team).
- tronMonitor = Monitor: Tron's visual interface. Auto-syncs with Controller.
- MVC boundary: claudeCode NEVER calls hiveMind functions — reads registry FILES only.
- View (pane title) can diverge from Model (JSONL customTitle) after /rename — tree.detailed should prefer pane title (live truth) over JSONL (eventual truth).

## Performance Patterns
- Batch caching (intra-call only) beats per-pane subprocess calls: otmux tree 46s→1.5s via 4 fixes:
  A: Batch TTY map (tmux list-panes -aF → associative array, eliminates N × otmux pane.get)
  B: Batch PS map (ps -eo pid,tty,args → tty→pid map, eliminates N × ps scan)
  C: Version cache (claude --version once, reuse for all panes)
  D: Discover cache (hiveMind agents.discover ONCE for whole server, not per session)
- All caches declared at top of function, destroyed on return. No cross-call state.

## State Consistency
- 7 invariants (I1-I7) drive all observable state corruption
- Event dispatch (Option C) + reconcile safety net (Option B) is the right consistency model
- ONE insertion point for cross-cutting concerns (send prefix at send.smart line 1896)
- Cross-host migration is a failure class NOT covered by local event+reconcile (McDonges disaster)
- teams.restore needs: mandatory --all, sessionFilter param, pane-count guard, no silent fallback

## Naming Convention
- Option C (TRON directive): role@hostname EVERYWHERE (pane title + /rename). Option A rejected.
- Registry stays BARE role. role.fromTitle strips @*. 9 write paths, zero read changes.
- HIVEMIND_HOST = hostname -s (cached, 3ms)

## Cross-Platform
- 16 hardcoded paths: /tmp/ (11), /opt/homebrew (3), /Users/Shared/ (2), ~/.ssh/id_rsa (1)
- Fix: ${TMPDIR:-/tmp}/, command -v discovery, detect key type

## Web4 Component Architecture
- npm exports field (ADR-001) eliminates ~50 re-export files
- X.Y.Z.W → X.Y.Z-W version mapping (ADR-002)
- Unit.prod 0.3.0.5 has GitTextIOR, discover/find, sync — missing from 0.3.23.x
- Merge Forward: keep 0.3.23.x UcpComponent, port prod capabilities in

## Units and Traceability (from robbinTeam)
- Scenario = {ior, owner, model}. Everything is a scenario (P1).
- Unit = scenario for file/code. Fields: origin, typeM3, references[].
- 6-step chain LOCKED: Requirement → UseCase → Class → Method → Implementation → Test
- Task = NAVIGATION not chain. ONE UC per Task, ONE Method per UC.
- Champagne = structural + intentional (Test.verifies[]). BOTH required.
- Forward-only. MDAv4: M3/CLASS/, M3/RELATIONSHIP/, M3/FOLDER/.

## PlantUML
- @startuml = path-safe slug. Separate title for display. SVG >10KB = real.
- Layer colors: L3=#F5F5F5, L2=#E8F5E9, L4=#FFF3E0, L5=#FCE4EC
- Commit .puml + .svg together.

## Coordination Rules
- Architect designs, expert implements, tester validates — never reverse
- TRON overrides architect. PO assigns. SM monitors.
- Wait for PO assignment. Never self-assign.
- Expert answers to design Qs are binding for implementation.

## Kernel Contracts
- problem.log NEVER sets STEP_DEBUG=ON. Logger ≠ debugger. All 4 sites in log (117, 206, 230, 253) must be stripped.
- this.load: optional methods (status, usage, help, completion) → return 0 silently. Required methods → error.log + return 1. Never problem.log for missing methods.
- Docker install: SSH key = volume mount (-v ~/.ssh:/root/.ssh:ro), never bake in image. Real bug = sequencing (clone HTTPS first, SSH setup after — reverse it).

## Failures
- Option A was wrong — TRON wanted simpler single convention
- Naming design missed 4 write sites — always grep ALL occurrences
- Don't cd ~/oosh from Bash — use expert-shell via otmux send
- claudeCode fork auto-compacts — wait for ❯ prompt before sending
- OOSH bash blocks pipes (|grep, |head) with EPERM — redirect to file
- Expert may diverge from design — audit shipped code post-impl
- Post-rewind: trust file context.md, not conversation summary
- Bug #2 false positive: role@MacStudio vs registry role is CORRECT (Option C convention). role.fromTitle() strips @* by design. Audit SHOULD pass on normalized match.

## Constructor Contract (from sprint-constructor-contract)
- init() IS the constructor. After it runs, the object IS valid. No "loaded-but-broken" state.
- Repair is NOT a separate command — it is simply init invoked again. No second path.
- Fundamentals (OOSH_DIR, CONFIG_PATH, OOSH_MODE) derive from BASH_SOURCE (the running script's own location) — never guessed ($HOME/oosh), never from a possibly-broken value.
- No state loss on reinit: harvest existing valid exports from FILE (not live env), merge with canonically-resolved fundamentals, rewrite pure-state.
- config.save (no-args) = the persistent constructor. config.repair = alias for config.save.
- Constructors NEVER fail — they always self-heal to valid. BASH_SOURCE is always present, so fundamentals can always be resolved.
- projectHash: Claude Code replaces `/`, `.`, AND `_` with `-`. Expert's initial sed only replaced `/` — always verify against real ~/.claude/projects/ dirs.

## env files = pure state (Rule A)
- env files: export/declare, comments, blanks, source *.env ONLY. No logic.
- Pollution sources: config.add (source lines), config.save self-anchor (BASH_SOURCE logic from 43796be). Both in config script.
- Source chain (source $CONFIG_PATH/oosh.env) is valid in env files (Rule A). #4 wanted to strip them — Rule A overrides.
- config.validate must accept source *.env lines, reject all other logic.

## Testing (tester hat learnings)
- TDD baseline: write tests that define the contract BEFORE expert implements. Most fail initially — that's correct. Expert makes them green.
- Test fixture isolation: old tests that call setup_test_config/cleanup_test_config can leak CONFIG state into later tests. Each destructive test must save/restore independently.
- config.save (no-args) in a test context uses the LIVE env's declare -px — if CONFIG is redirected to a temp dir, config.save writes there but harvests from the real env. This means fixture corruption is subtle.
- When expert renames functions (teams.migrate → team.push, sub-functions like push.agent), grep-based tests must search the whole file, not just one function body.
- OOSH bash blocks pipes (|grep, |head) with EPERM — redirect to file or use inline patterns.
- T-ENV-LOGIN-2 originally rejected source *.env — must use config.validate (Rule A) not manual grep.
- c2 completion crash: ''' written into current.method.env makes it un-sourceable. Fix: bash -n syntax check before source. Test: inject broken quotes, verify no crash + file valid after.

## Config Lifecycle (from S-12 review)
- config.init = in-memory constructor (resolve + set vars). config.save (no-args) = persistent constructor (harvest-resolve-merge + write). Two constructors, same contract.
- Harvest reads from FILE first (survives born-broken), then live env (captures new vars). File wins for user state preservation.
- config.add NOT idempotent: appending then sort -u can reorder lines. Guard with grep before append.
- config.save oosh/log after merge depends on resolve.fundamentals having primed OOSH_* — ordering implicit, works but fragile.
- PlantUML activity diagrams with swimlanes work well for multi-script lifecycle flows.
- Integration tests (T-ENV-INSTALL) must cover the full lifecycle: fresh emit, corrupt→heal, never-prompt, never-fail (RC=0 on all broken inputs), subshell roundtrip. These are the acceptance criteria from the spec, not just unit checks.
- When testing config.save on corrupted input, config.save uses LIVE env vars (still set in shell) to resolve fundamentals — so it can heal even when the FILE is garbage. This is by design (harvest-resolve-merge).

## OOSH death-to-flags (design discipline — caught by Tron 2026-06-29)
- ANY oosh method signature is ALL-POSITIONAL. No `--flags`, no `--` separator. I drafted `odocker.run.ephemeral <image> [--opt] -- <args>` — wrong. Correct: `odocker.run.ephemeral <image> <workdir> <args…>`; runtime opts (--rm, --security-opt, -v, -w) live INSIDE the method.
- Distinction: passthrough args to a FOREIGN containerized CLI (e.g. `-tsvg` to the plantuml binary) are NOT oosh-method flags — they're opaque payload forwarded to another program. Those are fine. The rule binds the OOSH interface, not what you forward.
- Apply at DESIGN time, not review time — flags creep into "convenience" signatures.

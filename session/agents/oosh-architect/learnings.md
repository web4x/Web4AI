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

## object.verb IS the no-flag principle (Tron, 2026-06-29 — the deeper teaching)
- **OOSH expresses options as object.verb method dispatch, NOT flags.** The verb namespace IS the option space. A variant = a more specific method, never a `--flag`.
- Example: `odocker.run` / `odocker.run.sshd` / `odocker.run.ephemeral` — `sshd`/`ephemeral` are VERBS encoding what `--sshd`/`--rm` would. The method name carries the meaning that a flag would carry.
- So when tempted to add an option, the OOSH question is NOT "flag or positional?" — it's **"what is the object.verb for this?"** Push the variation into the method name.
- Method signatures are then thin + positional for genuine PARAMETERS (the nouns the verb acts on): `odocker.run.ephemeral <image> <workdir> <args…>`. Runtime concerns (--rm, seccomp, -v/-w) live INSIDE the verb's implementation.
- Distinction preserved: passthrough payload to a FOREIGN containerized CLI (`-tsvg` to the plantuml binary) is NOT an oosh flag — it's opaque args forwarded to another program. The rule binds the OOSH interface, not what you forward.
- I drafted `odocker.run.ephemeral <image> [--opt] -- <args>` first — wrong (flags). The verb `ephemeral` already encodes the option; no flag needed.
- Apply at DESIGN time: name the verbs, don't reach for flags.

## Session 2026-07-02 (ooshTeam@MacStudio) — SETUP_SERVER sprint + #13 dash-safe

### State-machine design (the `state` engine + `oo` SETUP_SERVER)
- **The engine's ONLY branch primitive** = numeric-RESULT redirect: a `private.check.<state>` that returns **0 (success) with `RESULT`=a numeric index ≠ current** makes `state.check` do `stateFound=$RESULT` → jump (state:293-301). Return **non-zero = HOLD** (no state.set). XOR/branch is built ENTIRELY on this — zero engine edits. Proven pattern: `priviledges.checked` redirects to marker 20 (user) / 30 (root).
- **XOR-with-two-sequential-states** dead-ends because each arm's check `return 1` on the non-matching mode → HOLD. Fix: each arm ALWAYS returns 0 and **redirects-forward on the non-matching mode** (release→dev, dev→done) so `state next` converges for BOTH values. Resolve target indices with `state.find <name> id` — NEVER hardcode indices (reorder-proof, DRY).
- **`state.add` indexing:** a numeric state name is a **cursor-jump marker** (`state.add 20` moves fill-cursor to 20); named states fill sequentially after it. Markers 20/30/40/50/60 = privilege/phase bands.
- **Reconcile existing installs = BY NAME, never index.** Names are stable across reorder; indices shift. Capture current state NAME → delete → rebuild (shared declare helper, ONE source of truth for order) → `state.set <savedName>` → marker-fallback if name gone. Keep reconcile DRIVE-FREE (no `state next`) so it can't trip privilege/sudo probes (F2). Detect staleness two-tier: cheap schema stamp (OOSH_ export, engine-agnostic) + order-invariant probe (ground-truth oracle).

### #13 dash-safe — measurement reframed it (twice)
- **ALWAYS measure the actual payload, not the described one.** README serves `…/**main**/init/oosh` via `sh -c "$(curl…)"`. Measured on WODA.test real dash: `dash -n` main init/oosh → **rc=0, 0 dotted fns**. The assumed "bootstrap dies at `Bad function name`" was **NOT reproduced** — init/oosh uses **underscore fns** and only runs the dotted framework via `"$BASH_FILE" …`. The dotted-fn parse death is real for `this`/`oo`/`claudeCode` (115 dotted) but the bootstrap ENTRY avoids it by construction.
- **`dash -n` (parse) is INSUFFICIENT** for bashism detection: `[[`, `read -p` parse OK under dash, fail at RUNTIME. Dash-safety needs a live run + a bashism fence, not just parse.
- **Check whether the thing is already built before designing.** My D13.A design (POSIX prelude → dual-form re-exec → bash self-install) turned out to already exist in init/oosh (init-constructor sprint, lines 287/294). PO kept the doc as "documented rationale" but did NOT implement — don't manufacture work. Lesson: measure current implementation state early; a design can still have value as rationale for already-shipped code.
- **`sh -c "$(curl…)"` vs `sh file`:** file form → `exec bash "$0"`. The `-c`/stdin form has `$0`=sh, NO file → must re-materialize (embedded URL re-fetch, or clone-then-reexec-clone) before `exec bash`. Keep README `sh -c` (bash may be ABSENT on naked hosts — the reason sh was chosen; self-heal by installing bash, don't move the burden to the doc).

### Meta (CMM4)
- Measure-before-fix applies to **PO steers too** — two tasks here (my D13.A, expert's D13.1) were reframed by measurement; the honest move is to surface the non-reproduction in the design (§6) rather than build to the assumption.
- SPRINT-COMMS worked cleanly: edit story report-back → commit → push → one-line nudge. Record the commit hash in the report-back AFTER committing (two-commit pattern: content, then hash).

## Team-Loop MVC + G1 identity linchpin (2026-07-17)
- Team loop = MVC: Controller=PO, View=SM (sweep/report), Model=registry. Tools do CMM3 mechanics; PO/SM add CMM4 judgment.
- **G1 (linchpin): `otmux current`/`pane.get.target` resolve self from stale `$TMUX_PANE`** (otmux:2683 on mcdonges.latest) → LIES after fork/move/rewind (hit live: returned baseTeam:0.1 falsely). The corrected `/proc` PID→ppid→tmux-pane walk (`pane.self`) exists only on `dev` = a LOST DUPLICATE. DRY fix = ONE corrected `otmux current` (never the env var); route ALL self-ID through it; kill the old "MUST use $TMUX_PANE" comment (otmux:1806).
- Registry Model is ~6 stores (roles/sessions/teams/snapshot/state/queue) — file-split is fine; the DRY violation is *identity truth duplicated + disagreeing* across stores + tmux customTitle + process `--resume` args. Ground truth = process --resume uuid + corrected otmux current pane; stores = projections. Verify identity via pane footer/process args, NEVER JSONL customTitle or session.id (they lag/mis-resolve).
- After ANY move/rewind: confirm pane via registry/pane-title, never trust `otmux current` until G1 lands. I mis-identified myself twice this era by trusting the resolver — measure against registry.

# robbin-skill-expert Learnings

## Skill Manifest Design
- ior:class:Skill scenario units with typed parameters[], returns, impl IOR, requirement trace, roles, examples
- SkillLoader follows same pattern as TaskLoader/RequirementLoader (loader() factory in classes.ts)
- Adding a loader changes ClassRegistry count — update test assertions (toBe(N))

## UC Source Fill
- PUML-declared UCs: match by uc:uuid in PUML block or by name (case-insensitive)
- Bridge/generated UCs without PUML: source = scenario unit file path itself
- git log --format=%h -1 -- <file> for commit SHA anchoring
- line number from regex match position in PUML text

## Team Protocol Rules as Skills
- 11 precedence rules from refinement-precedence-analysis.md (Rules 1-11)
- Ship rules: #66 version bump, #67 STATIC_SHELL
- Verify rules: #27 7-hop gate, SW-active live repro
- Each rule = ior:class:Skill with impl pointing to the standard/script file

## Process
- Chat = one-line pointer; substance goes in task file (SM directive)
- Check for UUID collisions when creating units — uuid4() can land on existing file paths
- scrum.pmo/skills/index.md groups by object category

## Chain Correction (2026-06-08)
- Chain changed from 7-step to 6-step: Task removed from chain (Task = navigation layer)
- Chain: Requirement → UseCase(s) → Class → Method → Implementation → Test(s)
- Navigation: Sprint → Task → coveredRequirements → [chain starts]
- forward-only.ts FORWARD_KEYS updated accordingly
- traceability-standard.md rewritten to reflect 6-step

## CMM4 Skill-Tooling (2026-06-11)

### Validate-before-trust (8 tool bugs caught — DISCIPLINE)
Every measurement tool: 3 IDENTICAL runs + match ground truth BEFORE calling it authoritative.
Bugs caught this session (all in po-chain-follow-up/team-velocity):
1. Denominator drift (208/482/610) → canonical: one row per Req, deterministic
2. orphanByDesign bool stored, code did String(true).includes('orphanByDesign')=false → check ===true
3. cwd-fragile git (path.join not resolve + pipe|grep exit-1) → path.resolve + in-process regex
4. UC→Method walker used Class.methods[0] not UC.method → use UC.method pointer
5. marker scan globbed *.ts only, missed sw.js → scan .js/.mjs too
6. Impl check passed on marker alone → require idx.has(uuid) AND marker
7. velocity numerator recomputed (45) vs canonical (10) → execSync po-chain-follow-up, parse Summary
8. default window today-midnight (false 0 early-day) → default last-24h + print window label

### Canonical measure rule (CMM4 prevention)
- ONE canonical completion measure: Chain.followUp() via po-chain-follow-up.ts.
- NO parallel counts. Non-canonical scripts (trace-audit) HARD-REFUSE on --completion (exit 1) + redirect.
- Prevention over detection — agents physically cannot produce a competing number.

### Chain-walk gotchas
- UC.method field = the SPECIFIC method (use it, NOT Class.methods[0] — wrong when Class has many methods).
- Impl/Test 'check' requires BOTH source [impl:uuid:]/[test:uuid:] marker AND scenario unit on disk.
- Method→Test direct (Method.tests[] populated, implementations[]=empty) = INCOMPLETE. Impl node MANDATORY.
- 117/189 Method.implementations[] refs have markers but NO .scenario.json unit — data gap (expert fix).

## Object.verb Pattern (Tron FOUNDATIONAL directive)
- skill-classes.ts: Chain + Velocity classes. Logic in typed methods (followUp, wireImplNode,
  generateMatrix, updateMatrixRow, compute). Constructor DI (ScenarioIndex, paths).
- Scripts = thin dispatch. Composable (Velocity sources Chain.followUp).
- OOSH external script: scrum.pmo/skills/taskChain. Pattern = aiderOOSH (source this + this.start
  dispatcher + parameter.completion.* helpers + Object.method() functions).
- ooshTeam (ooshTeam:0.2 oosh-expert) links scripts to ~/oosh/external/ + verifies dispatch/completion.
- how-to-write-skills.md = the team guide. ASK oosh-expert for OOSH patterns — don't guess.

## Matrix
- scrum.pmo/traceability-matrix.md is STALE (planner T86, 2026-05-26, old req/uc/puml/method/uuid 5-col).
- Chain.generateMatrix(path, sprint?) regenerates from canonical followUp data.
- Chain.updateMatrixRow(reqUuid, path) updates ONE row.
- CLI: taskChain generateMatrix [sprint] / taskChain updateMatrixRow <reqUuid>.

## OOSH Principles (from ~/oosh/docs — read before writing OOSH scripts)

### Philosophy
- OOSH = Object-Oriented Shell. Brings OOP (modularity, reusability) to bash.
- Portability across Mac/Ubuntu/Termux/iSH/Pi. Transparency (logging/debug/state). DRY.
- Class = a script file. Method = `scriptname.methodname()` function. Constructor = `scriptname.start()`.
- Invocation: `./scriptname method arg1 arg2` → resolves to `scriptname.method(arg1, arg2)`.

### DRY is the core principle
- Command/parameter/default info defined ONCE — in the code. Completion engine reads it directly.
- NO duplication between docs, code, completion logic. The method signature comment IS the doc.

### The `this` bootloader
- `source this` (or `$OOSH_DIR/this`) initializes env, logging, config, PATH.
- `this.start "$@"` is the central dispatch — resolves method name → calls scriptname.method().
- Provides function-existence checks, dynamic loading, cross-script method calls.

### Method signature format (drives completion + docs — DRY)
```bash
scriptname.methodName() # <arg1> <arg2> # description of what it does
```
- The `# <args> # description` comment is parsed by c2 completion AND serves as usage doc.
- Parameter completion: `scriptname.parameter.completion.<paramName>()` returns candidate values (one per line).

### c2 dynamic completion
- `ng/c2` scans script function signatures + parses params/defaults automatically.
- New scripts/methods auto-included — no manual completion registration.
- Test completion interactively via otmux (real bash Tab in a tmux pane), not unit tests.

### Command creation (canonical way)
- `oo.new <name>` generates a script from `templates/code/` (sets up completion + usage).
- `oo.new.method <script.method>` adds a method with consistent structure.
- External/experimental scripts live in `~/oosh/external/` (e.g. aiderOOSH) — symlinked there.

### External script pattern (aiderOOSH reference)
```bash
#!/usr/bin/env bash
: ${VAR:=default}                                    # config defaults
scriptname.parameter.completion.X() { ... }          # completion helpers
scriptname.methodName() # <args> # desc              # methods (Object.verb)
{ npx tsx "$REPO/scripts/foo.ts" "$@"; }             # thin dispatch to Class.method
scriptname.start_dispatcher() {                      # dispatcher
  source this 2>/dev/null || source "${OOSH_DIR:-$HOME/oosh}/this"
  log.init.colors 2>/dev/null
  [ -z "$1" ] && { scriptname.help; return 0; }
  this.start "$@"
}
scriptname.start_dispatcher "$@"
```

### My taskChain applies this
- scrum.pmo/skills/taskChain = OOSH external script. Methods dispatch to Chain/Velocity TS classes via npx tsx.
- ooshTeam links it to ~/oosh/external/ + runs c2/otmux completion verification.
- KEY LESSON: ASK oosh-expert / read ~/oosh/docs before writing OOSH — don't guess the pattern.
  Docs: first-principles.md, command-creation.md, completion-system.md, advanced-usage.md.

### OOSH ↔ scenario-chain isomorphism (why Object.verb fits)
- OOSH method = `Object.verb` = same model as our UseCase naming (noun.verb) + the scenario chain
  (Class → Method). Skills written as Class.method become traceable units themselves.
- Logic in typed TS Class method; OOSH script + CLI = thin dispatch (route to instance + method anchor).

## OOSH External-Script Must-Knows (taught by oosh-po, ooshTeam:0.0, 2026-06-11)

### (1) Dispatch — canonical pattern
- Bottom line MUST be `scriptname.start "$@"` (function named `scriptname.start()`, NOT `.bootstrap`).
- `scriptname.start()` = `source this` → `log.init.colors` → empty-arg help guard → `this.start "$@"`.
- Method names use DOTS for hierarchy: `taskChain.task.add()` not `taskChain_task_add()`.
- Doc format (TWO hashes): `script.method() # <required> <?optional> <?optDef:default> # description`.
  1st `#` marks params, 2nd `#` marks description. c2 parses BOTH for help AND completion.
  Missing 2nd `#` = c2 silently broken.

### (2) Completion — per-method, param-name-matched
- Helper = `script.method.completion.paramName()` — name must EXACTLY match the param in the signature.
- Canonical (otmux): `otmux.attach.completion.session()` for `otmux.attach() # <session>`.
- Emit ONE candidate per line to stdout. Param-less: `script.method.completion() { :; }`.
- No completion fn = no Tab help even if the method exists.
- NOTE: `parameter.completion.X` (aiderOOSH global style) is the OLD pattern — canonical is per-method.

### (3) Symlink + verify flow
- External scripts symlink into `~/oosh/external/`; .bashrc adds those to PATH.
- Verify: `which scriptname` → symlink path; `scriptname<TAB>` → shows methods.
- TAB shows nothing = c2 didn't index it. Check: shebang `#!/usr/bin/env bash`, executable bit, dispatch line.

### (4) Anti-patterns (skill-authors get these wrong)
- flags (-h/-v) FORBIDDEN — use methods. Dashes in names = bash syntax error. Underscores = style violation (camelCase + dots).
- raw `echo` for return values → use `create.result 0 "msg"; return $(result)`.
- business logic in `.start()` — ONLY dispatch lives there.
- hardcoded `/tmp/` → `${TMPDIR:-/tmp}`.
- `while read` loops with ssh/scp inside → stdin consumed; use `done 3< file` + `read <&3`.
- `sed -i` without portability — macOS BSD ≠ GNU (BSD needs `sed -i ''`).
- missing `private.` prefix for helpers — pollutes namespace + completion.
- Ground-truth canonical files: ~/oosh/{this,oo,otmux,hiveMind}. otmux = clean completion style; hiveMind = command.subcommand hierarchy.

## taskChain AUDIT vs canonical (findings, fix during ooshTeam verify)
- DEVIATION 1: bottom uses `taskChain.bootstrap()` + `taskChain.bootstrap "$@"`. Canonical = `taskChain.start()` + `taskChain.start "$@"`. Rename.
- DEVIATION 2: completion uses global `taskChain.parameter.completion.reqUuid()`. Canonical = per-method `taskChain.<method>.completion.<paramName>()`. Re-bind to each method's actual param name.
- OK: method doc format (two `#`), dots-for-hierarchy, thin dispatch to TS classes, RAWBIN_HOME default.
- Coordinate fix with oosh-expert (ooshTeam:0.2) during ~/oosh/external link+verify.

## Reboot Notes
- Skill TOOLING active (NOT complete). taskChain awaiting ooshTeam link+verify (sent to ooshTeam:0.2) — apply the 2 deviation fixes above first.
- 19 Skill units + skill .md files in scrum.pmo/skills/. 3 metric skills + Object.verb classes + taskChain.
- Follow-on: oosh-expert verifies taskChain in ~/oosh/external; wire generateMatrix to overwrite matrix.

## Object.verb Migration Learnings (2026-06-11)
- Lazy-JSDoc regex `/\*\*([\s\S]*?)\*\//` SPANS across private methods to a later */ —
  line-based scanners beat multiline regex for signature introspection (c2-class bug).
- Ground-truth gate for canonical-tool rewrites: capture old output, rewrite, diff SAME-INSTANT
  (live agents mutate data between runs — a stale baseline shows false drift: 9 vs 25 was real progress).
- Determinism proof needs a FROZEN index snapshot (cp -R to /tmp) — shared-repo runs flap.
- Generated wrappers make style deviations structurally impossible (emitOosh fixed .bootstrap +
  global-completion deviations BY construction, not by review).
- Dispatcher main() must be entry-guarded (process.argv[1] endsWith) so vitest can import its exports.
- Answer "add a --list-complete flag" asks with a VERB (Chain.listComplete) — fix-the-tool means
  promote flag to verb, not add flag debt.

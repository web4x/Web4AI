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

## Reboot Notes
- Skill TOOLING active (NOT complete). taskChain awaiting ooshTeam link+verify (sent to ooshTeam:0.2).
- 19 Skill units + skill .md files in scrum.pmo/skills/. 3 metric skills + Object.verb classes + taskChain.
- Follow-on: oosh-expert verifies taskChain in ~/oosh/external; wire generateMatrix to overwrite matrix.

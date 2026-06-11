# robbin-skill-expert Context — Save Point 2026-06-11 (Object.verb migration DONE)

**Role**: Skill authoring specialist (forked from robbin-expert)
**Status**: Object.verb migration SHIPPED (0b24dcdb). taskChain now GENERATED (emitOosh). Awaiting oosh-expert re-link+verify.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.3
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin
**Tests**: 920/920 pass.

## ROSTER (robbinTeam2 — NEW session, NOT robbinTeam)
0.0=robbin-po | 0.1=robbin-planner | 0.2=robbin-expert | 0.3=ME(skill-expert) | 0.4=robbin-architect | 0.5=robbin-req | 0.6=robbin-tester
Route ALL pointers/IORs to robbinTeam2:0.X.

## Latest commits this session (skill tooling)
- 9b651b63 taskChain OOSH script + Chain.generateMatrix/updateMatrixRow
- 32e9abe1 po.chainFollowUp: use UC.method for UC→Method hop (not Class.methods[0])
- 34233db2 scan .js/.mjs for impl/test markers (not just .ts)
- 56660964 require Impl/Test UNIT on disk (defensive guard)
- c9696009 fix orphanByDesign exclusion (bool not string)
- 2c3ac41d canonical denominator — one row per Req, deterministic
- be1efa2d prefix-match UUIDs + sprint filter + Method→Test-direct
- fe85ea16 + 9caefcda CMM4 prevention: ONE canonical measure, trace-audit hard-refuses
- e5b8cd16 team.velocity skill (sources po-chain-follow-up canonical)
- 345748bf + 27719e4d velocity cwd-independent git + default last-24h
- b6f2ca49 Object.verb pattern: Chain+Velocity classes + how-to guide
- af53a19d chain.wireImplNode skill
- 54d56427 + cc306c2c po.chainFollowUp skill + Impl-node MANDATORY rule

## DELIVERED SKILLS (3 + Object.verb pattern + OOSH script)
1. **po.chainFollowUp** (scripts/po-chain-follow-up.ts + scrum.pmo/skills/po-chain-follow-up.md)
   - CANONICAL completion measure. Walk Req→UC→Class→Method→Impl→Test.
   - check/open per node, dispatch list with owner. Denominator: one row per Req, orphanByDesign excluded.
   - Current: ~11/137 COMPLETE.
2. **chain.wireImplNode** (scripts/chain-wire-impl-node.ts)
   - Create Impl unit + wire Method.implementations[] + move Method.tests[]→Impl.tests[]. Idempotent.
3. **team.velocity** (scripts/team-velocity.ts)
   - Sources po-chain-follow-up for numerator. git throughput. Default last-24h window.
4. **Object.verb pattern** (src/ts/scenario/skill-classes.ts: Chain + Velocity classes)
   - how-to-write-skills.md guide. Logic in typed Class methods, scripts = thin dispatch.
5. **taskChain OOSH script** (scrum.pmo/skills/taskChain) — Object.verb dispatch via OOSH.


## OBJECT.VERB MIGRATION (0b24dcdb, 2026-06-11, Tron-directed)
- scripts/objectVerb.ts = generic dispatcher (c2 for TS): introspects skill-classes.ts
  signatures+JSDoc -> CLI/help/completion/emitOosh/emitDocs. NO per-skill flags, NO prose md.
- Chain consolidates ALL canonical logic. NEW: listComplete (diffable COMPLETE set),
  wireAllMissing, scoreboard. Velocity in-process (execSync removed).
- 3 legacy scripts = thin shims, byte-identical output (diff exit=0 vs same-instant baseline).
- taskChain GENERATED canonical (.start, per-method completion.paramName) — re-emit after
  class edits: npx tsx scripts/objectVerb.ts emitOosh && emitDocs. Both audit deviations dead.
- Matrix regenerated from canonical (25/154). Snapshot anchor:
  scrum.pmo/chain-snapshots/2026-06-11-listComplete.tsv (planner diff baseline).
- 937/937 pass (17 new in test/vitest/object-verb.test.ts). rule-pair PASS, no bump.
- PRE-EXISTING (not mine): trace-audit 678 structural issues; rb-trace-tree jsdom
  scrollIntoView unhandled noise; 76 Methods without Impl (wireAllMissing dry-run).

## IN FLIGHT — coordinate after rewind
- **taskChain linking**: sent to ooshTeam:0.2 (oosh-expert) to symlink ~/oosh/external/taskChain + verify dispatch/completion. AWAITING response.
- **Matrix integration**: DONE (0b24dcdb) — matrix regenerated from canonical.

## KEY DIAGNOSIS (for expert/tester)
- 117/189 Method.implementations[] refs point to Impl UUIDs with NO .scenario.json unit on disk.
  Source markers exist (190/190) but Implementation SCENARIO UNITS missing. DATA GAP not tool bug.
  Fix: expert runs chain-wire-impl-node --all-missing to CREATE the 117 units.

## VALIDATE-BEFORE-TRUST (8 tool bugs caught this session)
Every metric: 3 identical runs + match ground truth BEFORE authoritative.
Bugs caught: denominator drift, orphanByDesign bool-vs-string, cwd-fragile git,
UC.method-vs-Class.methods[0], .js-not-scanned, unit-existence guard, numerator-inflation, today-vs-24h.

## OOSH PATTERN (Tron directive — FOUNDATIONAL)
- Skills = Object.verb. Logic in typed Class method (Chain.followUp, Velocity.compute, Chain.generateMatrix).
- CLI/script = thin DISPATCH: scriptname method args → Class.method(args).
- OOSH external script pattern: source this + this.start dispatcher + parameter.completion.* helpers.
- Reference: ~/oosh/external/aiderOOSH. ooshTeam links + verifies skill tools in ~/oosh/external.
- ONE canonical measure per metric — no parallel counts. Non-canonical scripts hard-refuse (exit 1).

## Standing rules
- Report → robbinTeam2:0.0 (pointer only, detail in task file)
- Chain is 6-step: Requirement → UseCase(s) → Class → Method → Implementation → Test(s). Task = navigation.
- Validate-before-trust: 3 identical runs + ground-truth match before authoritative.
- Native Write/Edit/Bash works (classifier operational). No pane-bash workarounds.

## Build/test
npm run build · npm test · npx tsx scripts/po-chain-follow-up.ts --all · taskChain followUp --all

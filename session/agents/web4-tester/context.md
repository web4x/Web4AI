# web4-tester Context — 2026-04-24

## Identity
I am the **web4-tester** — testing authority for Web4AI. 42 pair with web4-expert. I test, verify, find bugs, report. I do NOT implement features or modify production code.

## Current Team Layout (web4team)
- 0.0 = web4-po (my boss)
- 0.1 = web4-architect (NEW — owns PUML/MDAv4/Units)
- 0.2 = web4-expert (my 42 pair)
- 0.3 = ME (web4-tester)
- 0.4 = expert-shell (test execution)
- 0.5 = spare

## Base Path
Mac Studio: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`

## Completed Tasks

### Phase 6 — De-monolithization Testing (T1-T8): ALL PASS
- T1: Cold start cascade (W4TSC → UCP → Unit → Persistence) — PASS
- T2: UCP standalone build (zero deps) — PASS
- T3: W4TSC imports UcpStorage from @web4x/persistence — PASS
- T4: W4TSC imports DefaultUnit from @web4x/unit — PASS
- T5: Filesystem uses PlatformDetection, not Once.isNode — PASS
- T6: HTTP standalone build — PASS
- T7: TLS standalone build — PASS
- T8: ONCE full build (244 files) — PASS

### Tootsie Tests Created & Passed
- Persistence/0.3.23.0/test/tootsie/Test01_PersistenceExports.ts — 9 criteria PASS
- Web4TSComponent/0.3.23.0/test/tootsie/Test01_ImportPathVerification.ts — 9 criteria PASS

### Sprint 1 Task 7.2-7.6 Verification (0.3.23.1)
- V1: TypeM3 FOLDER enum in UCP — PASS
- V2: tsUnitCreate in UnitDiscoveryService — PASS (exists as method signature)
- V3: PumlUnitConverter.ts exists — PASS
- V4: Both UCP and Unit compile zero errors — PASS

### Task 6.7: PUML SVG Rendering (13 files)
- 12/13 PASS
- 1 FAIL: UnitModel-Enhanced.puml line 129 — `file` keyword conflict in PlantUML. Bug for architect.

### Task 7.7: tsUnitCreate on UCP
- BLOCKED: `tsUnitCreate()` method only exists in PUML spec, not implemented in TypeScript. UnitDiscoveryService has `unitCreate()` but not the TypeScript-specific variant.

## Pending Tasks
- Task 1.6, 2.3, 3.3 — not yet assigned/started
- Cascading build test for 0.3.23.1 versions (not yet run)
- 42 pair context monitoring for expert

## Known Bugs (from expert training session)
BUG-W1 through BUG-W19 documented in:
`Web4TSComponent/0.3.20.6/session/web4-1m-agent-learnings.md`

Key bugs still open:
- BUG-W7: links fix auto-promotes prod (FIXED in 0.3.20.6 dist)
- BUG-W14: PDCA latest lost getDualLink methods
- BUG-W17: source.env doesn't register staging completions (FIXED)

## Key Learnings
- P25: Tootsie tests only — no vitest describe/it patterns
- DefaultWeb4Requirement must use `await req.init({model: {...}})` not direct model assignment
- Test imports need correct relative path depth (4 levels from test/tootsie/ to components/)
- NEVER filter output (P15) — no | head, | tail, | grep
- PDCA 0.3.5.2 is prod reference — use `pdca-v0.3.5.2` for dual link tools

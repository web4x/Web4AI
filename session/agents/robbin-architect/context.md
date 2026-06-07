# robbin-architect — Context (Save 2026-06-07)

## ACTIVE: Sprint 17 + Sprint 18

### Session 4 Work (2026-06-05 to 2026-06-07)

| Task | Commit | Status |
|------|--------|--------|
| T195 Phase A: 24 feature UCs | 434e57fe | ✅ shipped — 24 Object.verb UCs for feature tasks |
| T195 Phase A: 11 artifact reqs deleted | 434e57fe | ✅ shipped — parse-bug table headers removed |
| T195 Phase A: UC.class+method 8 UCs | f83238b1 | ✅ shipped — verb-matching on existing classes |
| T195 Phase A: 36 orphan-by-design marked | b0c8d8a5 | ✅ shipped — honest denominator 71→35 feature |
| T195: 3 struct-mismatch Impl.tests[] | 0da2ce0c | ✅ shipped — R10.2/R10.3/R15.5 champagne lift |
| T195: 4 verifies[] additions | d8e9a69a | ✅ shipped — R17.31/R17.32/R15.3/R15.6 |
| T195: 6 chain breaks un-orphaned+UCs | 60607ffd | ✅ shipped — R18.1/R-ED1/R17.14/R17.18/R17.20/R17.26 |
| T197: strip 132 wrong-type Task UUIDs | 8680cea3 | ✅ shipped — Method.implementation cleaned |
| T198: Sprint dedup 9 + rename 10 | 32e29be9 | ✅ shipped — zero orphaned refs |
| T198: 8 Sprint units S2-S9 | a56fc4e5 | ✅ shipped — nav containers |
| T191: intention-verification-model | 30fa40e7 | ✅ shipped — champagne = structural + intentional |
| T191: Test.verifies[] pipeline | 5a20299c | ✅ shipped — 16 tests populated |
| T195: contacts UC fix | 3840049c | ✅ shipped — .render fallback → .onClickDelegate |
| T181 forward-only display | 883ce4aa | 📝 designed (S17) |
| T184 forward-only API emit | e05ddd6f | 📝 designed (LOW) |
| T178 tree lazy-load | c0ddf1af | 📝 designed — 3 bugs in buildSeedNode |
| T187 chain narrowing | 9dca5116 | 📝 designed — recursive narrowing every hop |
| T187 root-structure R18.8 | 562f6452 | 📝 designed — Sprint→Task→coveredReqs→chain |
| R18.8 contradiction review | d7d6404a | ✅ shipped — 7 found, 5 reworked |
| R18.8 reworks applied | 4763a458 | ✅ shipped — 'tree ROOT'→'CHAIN ROOT' |
| S18 chain-narrowing analysis | a275c0fa | ✅ shipped |
| S18 R18.9-12 detail enhancements | 9d7cf42d | 📝 designed |
| S18 narrowing bugs + R18.13-15 | 4be5dcdd | 📝 designed |
| T189 SKILL.md | 6462ec1 | ✅ shipped — durable role skill |
| T187 singular links (all UCs) | 6c7ff26e+35f111a6 | ✅ shipped — 0 UCs without method |
| T186 refinement-precedence-analysis | a2d661dc+4fad5fed+830ab7ff | ✅ shipped — JOINT 3-author |
| T185 8 Method units + UC→Class | 71a600be+cc1851f9 | ✅ shipped |
| T180 cert decision | (otmux) | ⏳ Tron-blocked — DNS-01 certbot |

### Session 3 (2026-06-04 to 2026-06-05) — carried forward
- T178 UC→Class fill (7b7859ac), s17-architecture.puml (c11f723a)
- T192 infinite cycle diagnosed + fixed (Req→tasks cycle)
- T194 type-check invariant (expert shipped)

## Identity
- **Role:** robbin-architect (forked from web4-architect)
- **Pane:** robbinTeam:0.1
- **Team:** robbinTeam
- **Project:** RawBin (Web4RawBin)
- **Working dirs:**
  - Planning: `/Users/Shared/Workspaces/AI/Claude/workspaces/Web4RawBin/`
  - Implementation: `/Users/Shared/Workspaces/2cuGitHub/Web4RawBin/`
- **Expert:** robbinTeam:0.2
- **Tester:** robbinTeam:0.3
- **Planner:** robbinTeam:1.0
- **Req-eng:** robbinTeam:1.1

## CHAMPAGNE STATUS
- **Current: 16/35 (45%)**
- Structural-only: 19 (tester annotating verifies[])
- No-coverage: 0 (floor COMPLETE)
- Honest denominator: 35 feature reqs (was 82 → minus 36 orphan)
- Path to 35/35: tester annotates 19 structural-only → 35/35

## Narrowing Bugs (S18, Tron-visible)
1. Detail "Chain" shows ALL methods (forwardOnly uses plural, no UC context) → fix: ?mode=trace
2. Tree picks wrong method (Class.method is GLOBAL, not per-UC) → fix: chainMethod hint from UC
3. Tree stops at Method (empty implementation after T197 cleanup) → T195 Phase C

## Key Designs Pending Expert Impl
- T181: FORWARD_KEYS filter in 6 DetailViews + tree (883ce4aa)
- T178 tree lazy-load: fetchAndRenderChildren ancestor-path fix (c0ddf1af)
- T187 narrowing: TRACE_FWD with chainMethod hint (4be5dcdd)
- R18.9-12: detail-view full object + parent link + source link + line (9d7cf42d)
- R18.13-15: source on all types + /md/?highlight + line preservation (4be5dcdd)

## Build State
- Champagne: 16/35 feature reqs (45%)
- Units: 50 Classes, 73 UCs, 92 Methods, 120 Impls, 44 Tests, 110 Tasks, 71 Reqs, 10 Sprints
- 0 UCs without class/method
- 0 wrong-type refs in Method.implementation

## CMM4 Standing Rules
- #18: planner → task file → architect refines → expert impl → tester verify
- #46: Web4Articles template
- #17: real v4 UUIDs only
- #15+#16: rule-pair (a)+(b) + (c) STATIC_SHELL
- Champagne = structural + intentional (BOTH required)
- Chain root = Requirement; Browser tree root = Sprint (R18.8)
- Three concerns: Chain (WHY), Dependency (WHAT FIRST), Navigation (HOW TO BROWSE)

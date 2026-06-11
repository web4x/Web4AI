# robbin-expert Context — Save Point 2026-06-11 (overnight close)

**Role**: Web4RawBin Implementation Authority
**Status**: Overnight traceability drive complete. Honest baseline: 49 real Impls. Standing by for new Tron directive.
**Machine**: Mac Studio · **Pane**: robbinTeam2:0.2 · **Shell**: robbinTeam2:0.4 (mine)
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.156. 876/876 tests pass (32/32 files).

## Latest commits this session
- d600c51f HONEST: delete 322 fake Impls, keep 49 real (marker-verified)
- 07c189e0 146 Implementation units (later triaged to 49 real)
- 181a08da v0.5.156 Room.members[] IOR refs + startup restore
- f6eef828 Final 6 real-code Impl units (S19 methods)
- c65b1ae4 Triage: delete 130 stub Impls
- be83eec0 v0.5.155 BUG2: singular champagne chain in detail views
- 567190ba v0.5.154 BUG1: sticky close (drawer header+body split)
- 538ca195 28 Test scenario units
- f906f245 Overnight Wave 1: 14 Impl units + impl:uuid markers
- 5fe83417 v0.5.153 R19.24 complete: spectator test cleanup
- 28354412 v0.5.152 R19.24 dead spectator refs
- d5c0cf6f v0.5.151 T-remove-spectator + sw.js share-link fix
- 21ea8da5 v0.5.150 T-remove-room-sizes
- 852bc994 v0.5.148 TRACE_FWD bug + OO prefetch refactor
- d8472e82 v0.5.146 /trace badges real child count
- 311d2993 v0.5.145 40x40 square collapse
- a6503fc4 v0.5.144 red badge + icon-only drag + square collapse
- ed1064fe v0.5.141 dark bg for in-room tree
- 00656eee v0.5.142 folder items + /trace-identical DOM
- 361e5a62 v0.5.140 member+file Lucide icons
- ff82b0ad v0.5.139 T-room-ui-shared REDO: rb-object-item in room tree
- 0d3895d6 v0.5.138 T-persistent-dedup
- 1a58f782 v0.5.137 R19.8.A member disconnected field
- 54e25790 v0.5.136 T-persistent-retention
- e1796bea v0.5.134 T-room-symlink
- 5825579c v0.5.133 T-apply-flow
- c4ff02a5 v0.5.132 T-room-ui-shared

## Key learnings this session
- NEVER bulk-generate scenario units without real source backing — false coverage
- Every Impl must have a matching [impl:uuid:] marker AT the actual function in source
- Triage honestly: if no real code exists, DELETE the unit, don't stub
- 1:N pollution (multiple Impls per Method) = violation of singular chain
- Room.persist() now writes members[] IOR array; startup restores as offline
- Drawer split: .drawer-header (sticky) + .drawer-body (scrollable)
- singularChain() walks champagne path Req→UC→Class→Method→Impl→Test

## Standing rules
- Version bump #66; STATIC_SHELL #67 on bundle hash change
- implementing [x] before commit
- Report each commit to robbinTeam2:0.0
- Forward-only chain (T159) — no back-refs
- 6-step chain LOCKED: Req → UC → Class → Method → Impl → Test
- Scenario-link communication: otmux = one-line pointers only
- REAL UNITS ONLY — no stubs, no file-pointers without markers

## Deploy ritual
1. otmux send iphone:0.1 C-c (twice)
2. otmux send iphone:0.1 'cd /Users/Shared/Workspaces/2cuGitHub/Web4RawBin && git pull && npm run build && npm run dev' Enter
3. curl -sk https://home.donges.it:4444/api/health to verify version

## Build/test
npm run build · npm test · 32/32 files · 876/876 tests

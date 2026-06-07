# robbin-expert Context — Save Point 2026-06-07 (session 2)

**Role**: Web4RawBin Implementation Authority
**Status**: v0.5.105 deployed. R18.13-15 shipped + source data fill complete. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444
**Current version**: v0.5.105. 876/876 tests pass.

## Latest commits this session
- b6e3d16b R18.13: fix 19 Class units with explicit .ts file mapping
- 724880b5 R18.13 data fill: source.file+line on ALL types — 353 units filled
- d7ac7afa v0.5.105 R18.13-15: source on all types + highlight + line→edit#L
- 95ddb066 T188: ViewGenerator dogfood — generate-sprint-md.ts + S18 planning from units
- Earlier: T195 contacts UC fix, v0.5.104 B1+B2 narrowing

## What shipped this session
- **T188**: generate-sprint-md.ts — reads Sprint+Task scenario units → generates planning.md + per-task .md INTO scrum.pmo/sprints/. GENERATED header. S18 dogfooded.
- **R18.13**: Source links on ALL 7 typed detail views via fetchDetailData→renderSourceLink. Source data filled: Sprint 18/18, Task 114/114, Req 111/111, Method 99/99, Impl 149/149, Test 44/44, Class 56/56, UC 79/85 (skill-expert owns 6 UC gap).
- **R18.14**: /md/ directory handler supports ?highlight=filename — orange highlight on matching file.
- **R18.15**: editIcon() generates /edit/file#Lnnn when highlight+line present — Monaco opens at exact line.
- **Class source fill**: 19 Class units fixed with explicit CLASS_FILES map; 24 conceptual classes (no .ts decl) honestly point to scenario.json.

## Key architecture
- LOCKED 7-step chain: Req → Task → UC → Class → Method → Impl → Test
- Two tree modes: ?mode=trace (narrowed) vs ?mode=scenario (fan-out)
- chainMethod hint: server returns UC.method alongside Class child in trace mode
- Sprint→Task nav roots via /api/trace/sprints
- Cycle guard: per-branch ancestors Set; one-layer lazy-load
- Forward-only at server (/api/trace) + client (forwardOnly())
- STATIC_SHELL auto-injected by build.mjs
- Let's Encrypt auto-detect with self-signed fallback
- /md/?highlight=file&line=N → file highlighted, ✏️ → /edit/file#LN

## Standing rules
- Version bump #66; STATIC_SHELL #67 (auto); implementing [x]; report to 0.0
- No clients.claim in SW; parser: one + line = one method
- No silent idle — report completion + flag blocks immediately

## Source fill scripts
- scripts/fill-source-locations.ts — fills sourceFile+sourceLine on ALL gap types
- scripts/generate-sprint-md.ts — generates planning.md + task .md from scenario units
- scripts/populate-forward-refs.ts — fills forward arrays (Task→UC, Method→Impl, Impl→Test)
- scripts/regenerate-views.ts — generates scenario/sprints.md/ views

## Pending / blocked
- T178 Task→UC fill: 8/191 tasks have useCases (S16 only). Blocked on architect S17 UC→Task mapping.
- T183 7-hop gate: 1/44 tests reachable. Will auto-flip to 44/44 after T178 fill.
- UC source: 79/85 — skill-expert owns remaining 6 UC→.puml fill.
- Tester running R18.13-15 TS1-TS17 verification.

## Deploy ritual
Stop (C-c twice), then: git pull && npm run build && npm run dev on iphone:0.1

## Build/test
npm run build · npm test · npm run ci:gates · npm run trace:audit

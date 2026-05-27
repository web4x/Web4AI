# robbin-expert Context — Save Point 2026-05-27

**Role**: Web4RawBin Implementation Authority
**Status**: S15 traceability browser shipped + relocated; S14 migration+T99 closed. Standing by.
**Machine**: Mac Studio · **Pane**: robbinTeam:0.2
**Repo**: /Users/Shared/Workspaces/2cuGitHub/Web4RawBin · **Live**: https://home.donges.it:4444 on iphone:0.1 (tmux)
**Current version**: v0.5.22 (deployed). PKG_VERSION read per-request (T94) so /api/health + /api/config track disk.

## Team (robbinTeam)
0.0 robbin-po · 0.1 robbin-architect · 0.2 ME · 0.3 robbin-tester · 1.0 planner · 1.1 req

## Deploy ritual (every version)
Stop server (otmux send iphone:0.1 C-c — often needs TWICE; verify curl /api/health empty=down),
then: `otmux send iphone:0.1 "cd <repo> && git pull && npm run build && npm run dev" Enter`,
wait ~14s, verify /api/health version. NEVER add `git stash` to the restart (it swept my uncommitted
changes once — recovered via stash pop/checkout). Build = node build.mjs (esbuild client bundles +
sw.js CACHE_NAME stamp). Server runs via tsx (no tsconfig — single-file `tsc` shows bogus node-type
errors; the real gates are esbuild build + tsx run + vitest).

## What shipped this session (commits)
- **S13 stability** (earlier): T80/T78/T81/T84/T82/T83/T91/T92/T93/T94/T95/T100. Avatar fix 2 halves:
  rekeyUser re-encrypts files on keypair rotation (v0.5.9) + ensureAvatar preserve-on-decrypt-fail (v0.5.10).
  vCard photo-from-token + UUID note (v0.5.14). DATA_DIR + port env isolation (T100).
- **S14 migration** (sprint-14-legacy-migration/): T96/T97 Migration.ts (copy-only, idempotent),
  T98 tester PASS, **T99 DONE** — removed loadFromDisk + dual-WRITE; per-user/UUID is SOLE source;
  deleted data/rooms + 141 token-* originals. v0.5.20. Backup web4rawbin-pre-T99-backup-20260526T175321Z.tar.gz.
- **S15 traceability** (sprint-15-traceability-browser/) COMPLETE R1-R7:
  - T101 src/ts/shared/TraceModel.ts (7 UUID classes + TraceGraph, flat-JSON, DOM-free SHARED).
  - T102 src/ts/server/TraceConsistency.ts + trace-cli.ts (npm trace:check/trace:fix; marker-region fix).
  - T103-T108 client layer src/public/ts/trace/: TraceRouter, VerbRegistry, ViewBus (MVC observer),
    rb-trace-view, rb-object-item (draggable), rb-list-overview (SearchProvider), rb-detail-view,
    rb-overview (computed-from-graph), rb-trace-tree (capstone). viewRegistry()=production wiring;
    defaultRegistry=T103 proof. GET /api/trace (server) = scanRepo→graph.toJSON()+validate.
  - **RELOCATED** (v0.5.22): Traceability is a DOCS TOP-NAV choice — GET /trace page (trace-page.ts
    bundle) + pageNav 'Traceability'→/trace link; removed /edit sidebar mount. NOT the /edit sidebar.

## Current data state (prod)
3 real rooms only: Marcel Donges's Room (99e6a422, owner 3dca7f5e), Marcel Donges Surface Mini's Room
(fe4d5664, owner f4798dae), Admins's Room (c5899b10, owner 3dca7f5e). 0 token-* dirs, no data/rooms.
141 token dirs migrated to UUID. data/ is gitignored.

## Tester verification status (787/787 batch + more)
PASS: T80 21/21, T91, T92 6/6, T93 4/4, T78, T98, T102 10/10, T103 11/11, T105 5/5, T106 7/7, vCard 6/6.
Queued: T107 (rb-detail-overview), T108 (rb-trace-tree + e2e now targeting /trace), T99 UI-create re-confirm.

## Build/test commands
npm run build · npm run dev (tsx watch) · npm test (vitest) · npm run test:e2e (playwright, now
default-isolated: E2E_LIVE=1 opts OUT) · npm run trace:check/trace:fix · npm run migrate.

## Key file locations
- shared model: src/ts/shared/TraceModel.ts (DOM-free, server+client)
- trace client layer: src/public/ts/trace/ (browser-only — extends HTMLElement)
- server: src/ts/server/server.ts (routes incl /trace, /api/trace, /api/avatar), Room.ts, UserKeys.ts,
  UserCrypto.ts (rekeyUser), RoomKeys.ts (scanAllRooms/scanUserRooms), Migration.ts, TraceConsistency.ts
- pages: src/public/ts/{app,edit,trace-page}.ts → build.mjs entryPoints + build-manifest.json

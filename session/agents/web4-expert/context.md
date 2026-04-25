# web4-expert Context — Save Point 2026-04-25

**Role**: Web4AI Implementation Authority
**Pane**: web4team:0.2
**Machine**: Mac Studio

## Team Layout
- web4team:0.0 — web4-po (quality owner, CMM4 goal)
- web4team:0.1 — web4-architect (PUML/MDAv4/Units)
- web4team:0.2 — ME (web4-expert)
- web4team:0.3 — web4-tester
- web4team:0.4 — expert-shell (Web4 initialized: bash --init-file source.env from UpDown root)
- web4team:0.5 — spare

## Base Path
`/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`

## De-monolithization — Phases 0-6 DONE
13 components at 0.3.23.0, all compile clean, tester verified 8/8 PASS.

## Sprint 1 — Current Work (0.3.23.1)

### COMPLETED Tasks
- 7.2 VERIFIED: UnitModel has origin, typeM3, references
- 7.3 DONE: FOLDER added to TypeM3 enum (UCP/0.3.23.1)
- 7.5 DONE: tsUnitCreate() on UnitDiscoveryService (Unit/0.3.23.1)
- 7.6 DONE: PumlUnitConverter (Unit/0.3.23.1/src/ts/layer2/)
- 8.2-8.4 DONE: MDAv4 structure — 58 CLASS, 3 RELATIONSHIP, 13 FOLDER, 5 °folder.unit, 20 .ts.unit files. Generator: scripts/generate-mdav4-units.mjs
- 4.2 DONE: Protected projectRoot + componentsDirectory helpers on UcpComponent (UCP/0.3.23.1)

### IN PROGRESS — Task 1: Boundary File Extraction
Created 0.3.23.1 for HTTP, TLS, Filesystem (copied from 0.3.23.0, version bumped, deps pointed to UCP/0.3.23.1).

- 1.1 DONE: HTTPSServer → HTTP/0.3.23.1 (TLSCertificateLoader import rewired to @web4x/tls, HTTPSServerModel+TLSOptions layer3 added, declare model fix)
- 1.2 PARTIALLY DONE: StaticFileRoute → HTTP/0.3.23.1 (file copied, sha256Provider+IOR rewired to @web4x/ucp). Missing layer3: MIMETypes copied, but ArtefactModel/FileModel re-exports point to @web4x/ucp which doesn't have them. Need local copies from ONCE instead. Also missing SyncStatus re-export.
- 1.3 DONE: ACMEChallengeRoute → TLS/0.3.23.1 (Route+HttpMethod rewired to @web4x/http, @web4x/http dep added)
- 1.4 DONE: FileOrchestrator → Filesystem/0.3.23.1/layer4/ (UcpComponent rewired to @web4x/ucp)
- 1.5 PARTIALLY DONE: ProxyRoute+ReverseProxyRoute+HeaderRewriter+HrefRewriter → HTTP/0.3.23.1 (files copied, ProxyRouteModel+RewriteRule layer3 copied, ProxyRoute declare model fix). Not yet built.

### BUILD STATUS
- UCP/0.3.23.1: COMPILES CLEAN
- Unit/0.3.23.1: COMPILES CLEAN
- TLS/0.3.23.1: COMPILES CLEAN (with ACMERoute)
- HTTP/0.3.23.1: 3 ERRORS — needs SyncStatus re-export, ArtefactModel/FileModel as local copies (not UCP re-exports)
- Filesystem/0.3.23.1: NOT YET BUILT

### REMAINING TO FIX (HTTP build)
1. Create HTTP/0.3.23.1/src/ts/layer3/SyncStatus.enum.ts (re-export from @web4x/ucp)
2. Replace ArtefactModel.interface.ts and FileModel.interface.ts with local copies from ONCE (not UCP re-exports — those files don't exist in UCP)
3. Rebuild HTTP
4. Build Filesystem

## Key Files Modified This Sprint
- UCP/0.3.23.1/src/ts/layer3/TypeM3.enum.ts — added FOLDER
- UCP/0.3.23.1/src/ts/layer2/UcpComponent.ts — added protected projectRoot + componentsDirectory (import * as path, P21 compliant)
- Unit/0.3.23.1/src/ts/layer2/UnitDiscoveryService.ts — added tsUnitCreate() + SyncStatus/UnitReference/UnitModel imports
- Unit/0.3.23.1/src/ts/layer2/PumlUnitConverter.ts — NEW
- HTTP/0.3.23.1/src/ts/layer2/HTTPSServer.ts — rewired TLSCertificateLoader to @web4x/tls
- HTTP/0.3.23.1/src/ts/layer2/StaticFileRoute.ts — rewired sha256Provider+IOR to @web4x/ucp
- HTTP/0.3.23.1/src/ts/layer4/ProxyRoute.ts — declare model fix
- HTTP/0.3.23.1/src/ts/layer2/HeaderRewriter.ts, HrefRewriter.ts — copied from ONCE
- HTTP/0.3.23.1/src/ts/layer4/ReverseProxyRoute.ts — copied from ONCE
- TLS/0.3.23.1/src/ts/layer2/ACMEChallengeRoute.ts — rewired Route+HttpMethod to @web4x/http
- Filesystem/0.3.23.1/src/ts/layer4/FileOrchestrator.ts — rewired UcpComponent to @web4x/ucp
- MDAv4/M3/ — 79 unit files generated

## Semantic Links
- W4TSC: prod→0.3.19.1, test→0.3.19.3, dev→0.3.20.6, latest→0.3.23.1
- ONCE: prod→0.3.22.1, test→0.3.21.6, dev→0.3.21.6, latest→0.3.22.1

## CMM Understanding
- Web4 = CMM4 (self-optimizing)
- Composed maturity = weakest link
- Assuming = L2, measuring = L3, PDCA loop = L4

## Key Learnings
- Web4 shells: bash --init-file source.env from UpDown root
- otmux pane.lock for persistent pane titles
- CLI scripts must self-register version symlinks
- PROJECT_ROOT from component path (3 levels up), never $PWD
- P21: import * as path from 'path' (no destructuring)
- P20: No require() — ESM only
- Ask oosh-expert for otmux methods — don't guess
- Expert does not test — tester owns test execution
- ArtefactModel and FileModel are NOT in UCP — they're ONCE-specific, copy locally

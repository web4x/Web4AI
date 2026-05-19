# Phase 6 Test Plan — Web4 De-monolithization Verification

## Context
We de-monolithized ONCE 0.3.22.2 (244-file monolith) into 13 standalone @web4x/* components at 0.3.23.0. All compile clean on Mac Studio.
Base path: `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`

## The 13 Components

### Layer 0 — Foundation
1. **@web4x/ucp** (`UCP/0.3.23.0`) — Universal Component Pattern. UcpComponent base class, UcpModel with ISR, IOR with pluggable loader registry, JsInterface, TypeRegistry. ZERO deps.

### Layer 1 — Core Services (depend on ucp)
2. **@web4x/unit** (`Unit/0.3.23.0`) — Atomic file tracking. DefaultUnit, UnitDiscoveryService, ScenarioService. Deps: ucp
3. **@web4x/persistence** (`Persistence/0.3.23.0`) — Scenario storage. UcpStorage (filesystem UUID index), BrowserScenarioStorage (IndexedDB). Deps: ucp
4. **@web4x/user** (`User/0.3.23.0`) — Identity. DefaultUser, NodeOSInfrastructure, environment model. Deps: ucp, unit

### Layer 2 — Infrastructure
5. **@web4x/filesystem** (`Filesystem/0.3.23.0`) — OOP files. DefaultFile/Folder/FileSystem/Image, MimetypeHandlerRegistry. Deps: ucp, unit
6. **@web4x/http** (`HTTP/0.3.23.0`) — HTTP server stack. HTTPServer, HTTPRouter, Route + 7 route subclasses, IORMethodRouter. Deps: ucp
7. **@web4x/tls** (`TLS/0.3.23.0`) — Certificate management. TLSCertificateLoader, DomainCertificateStore, LetsEncrypt, SNI, CertOrchestrator. Deps: ucp
8. **@web4x/web4tscomponent** (`Web4TSComponent/0.3.23.0`) — Component lifecycle CLI. Build, test, create, upgrade, links. Deps: ucp, unit, persistence

### Layer 3 — Platform
9. **@web4x/once** (`ONCE/0.3.23.0`) — Full ONCE kernel. 244 files with file: deps declared. Deps: ALL above + ws

### Layer 4 — Application
10. **@web4x/web4test** (`Web4Test/0.3.23.0`) — Test framework base
11. **@web4x/tootsie** (`Tootsie/0.3.23.0`) — OOP test runner with QualityOracle
12. **@web4x/pdca** (`PDCA/0.3.23.0`) — PDCA training cycle
13. **@web4x/idealminimalcomponent** (`IdealMinimalComponent/0.3.23.0`) — Reference hello-world

## Tootsie Testing Approach
For Phase 6 we validate via:
1. TypeScript compilation (`npx tsc` — zero errors)
2. Build cascade (delete dist/, run build.sh — deps auto-build)
3. Import path verification (extracted components import from @web4x/* not local)

## Test Cases

### T1: COLD START CASCADE
Delete ALL dist/ dirs for W4TSC dependency chain, then build W4TSComponent. Verify it auto-builds UCP, Unit, Persistence first.
```bash
cd /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Web4TSComponent/0.3.23.0
rm -rf dist/ ../../UCP/0.3.23.0/dist ../../Unit/0.3.23.0/dist ../../Persistence/0.3.23.0/dist
./src/sh/build.sh verbose
# PASS: All 4 build, dist/ exists for each
```

### T2: UCP STANDALONE
Verify UCP builds alone with zero deps.
```bash
cd /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/UCP/0.3.23.0
rm -rf dist && npm install && npx tsc
# PASS: zero errors, dist/ts/layer2/UcpComponent.js exists
```

### T3: PERSISTENCE IMPORTS
Verify W4TSC imports UcpStorage from @web4x/persistence, not local.
```bash
grep 'UcpStorage' /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Web4TSComponent/0.3.23.0/src/ts/layer2/DefaultWeb4TSComponent.ts
# PASS: shows @web4x/persistence path, NOT ./UcpStorage
```

### T4: UNIT IMPORTS
Verify W4TSC imports DefaultUnit, ScenarioService from @web4x/unit.
```bash
grep 'web4x/unit' /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Web4TSComponent/0.3.23.0/src/ts/layer2/DefaultWeb4TSComponent.ts
# PASS: shows @web4x/unit imports
```

### T5: FILESYSTEM PLATFORM DETECTION
Verify filesystem uses PlatformDetection, not Once.isNode.
```bash
grep -r 'Once.isNode' /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Filesystem/0.3.23.0/src/
# PASS: NO matches (Once.isNode fully replaced)
grep 'isNode' /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Filesystem/0.3.23.0/src/ts/layer1/PlatformDetection.ts
# PASS: isNode export exists
```

### T6: HTTP STANDALONE BUILD
```bash
cd /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/HTTP/0.3.23.0
rm -rf dist && npx tsc
# PASS: zero errors
```

### T7: TLS STANDALONE BUILD
```bash
cd /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/TLS/0.3.23.0
rm -rf dist && npx tsc
# PASS: zero errors
```

### T8: ONCE FULL BUILD
```bash
cd /Users/Shared/Workspaces/AI/Claude.All/UpDown/components/ONCE/0.3.23.0
rm -rf dist && npx tsc
# PASS: zero errors, 244 files compiled
```

## Reporting
For each test: `T#: PASS` or `T#: FAIL — <reason>`

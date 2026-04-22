# web4-expert Context — Save Point 2026-03-26 (Session 3)

**Role**: Web4AI Implementation Authority
**Status**: Phase 3 DONE, Phase 4 next
**Updated**: 2026-03-26
**Machine**: Mac Studio (moved from Ubuntu)

## Team
- upDown-po: UpDown_ai_upDownTeam:0.0
- web4-tester: UpDown_ai_upDownTeam:0.3
- test shell: UpDown_ai_upDownTeam:0.2
- I am: UpDown_ai_upDownTeam:0.1

## Base Path (Mac Studio)
`/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/`

## Phase Status

| Phase | Status | Details |
|-------|--------|---------|
| **Phase 0** @web4x/ucp | **DONE** | Foundation, 63 files, zero deps |
| **Phase 1** @web4x/web4tscomponent | **DONE** | CLI, wired to UCP+Unit+Persistence |
| **Phase 1.25** BUG-W02 fix | **DONE** | import.meta.url self-discovery |
| **Phase 1.5** Cascading auto-build | **DONE** | build.sh parses file: deps |
| **Phase 2** @web4x/unit | **DONE** | DefaultUnit, UnitDiscoveryService, ScenarioService |
| **Phase 3a** @web4x/persistence | **DONE** | UcpStorage, BrowserScenarioStorage |
| **Phase 3b** @web4x/user | **DONE** | DefaultUser, NodeOSInfrastructure, DefaultEnvironmentModel |
| **Phase 3c** @web4x/filesystem | **DONE** | DefaultFile/Folder/FileSystem/Image/MimetypeHandlerRegistry |
| **Phase 3d** @web4x/http | **DONE** | HTTPServer, HTTPRouter, PortManager, 7 Route subclasses, IORMethodRouter |
| **Phase 3e** @web4x/tls | **DONE** | TLSCertificateLoader, DomainCertStore, LetsEncrypt, CertRenewal, SNI, CertOrchestrator, HTTPSLoader |
| **Phase 4** @web4x/once | NOT STARTED | Remaining ONCE-specific files |
| **Phase 5** web4test/tootsie/pdca/idealminimal | NOT STARTED | |
| **Phase 6** Testing + promotion | NOT STARTED | |

## Dependency Graph (8 components, all compiling)
```
@web4x/ucp (foundation, zero deps)
  ├── @web4x/unit (DefaultUnit, UnitDiscoveryService, ScenarioService)
  ├── @web4x/persistence (UcpStorage, BrowserScenarioStorage)
  ├── @web4x/user (DefaultUser + env detection) [deps: ucp, unit]
  ├── @web4x/filesystem (File/Folder/FileSystem/Image) [deps: ucp, unit]
  ├── @web4x/http (Server/Router/Routes) [deps: ucp]
  ├── @web4x/tls (Certificates/SNI/LetsEncrypt) [deps: ucp]
  └── @web4x/web4tscomponent (CLI) [deps: ucp, unit, persistence]
```

## Key Technical Decisions
1. **Re-export pattern** for shared types (DRY, no massive import rewrites)
2. **PlatformDetection utility** replaces Once.isNode in filesystem
3. **Conditional scenarioCreate** in DefaultImage (method is in ONCE's UcpComponent, not extracted UCP)
4. **ServerHierarchyManager stays in ONCE** — too many ONCE-specific deps (ONCEPeerModel, WebSocket, LoggingUtils)
5. **ACME Route stays in ONCE/HTTP** — depends on Route from @web4x/http (would create circular with TLS)
6. **ProxyRoute/ReverseProxyRoute stay in ONCE** — need HeaderRewriter/HrefRewriter
7. **HTTPSServer stays in ONCE** — bridges HTTP and TLS

## Files NOT Yet Extracted (remain in ONCE for Phase 4)
- ServerHierarchyManager, HTTPSServer
- ProxyRoute, ReverseProxyRoute, HeaderRewriter, HrefRewriter
- DefaultONCE, BrowserOnce, DefaultEnvironmentInfo
- ScenarioManager, ScenarioLoader (ONCE-specific scenario ops)
- LoggingUtils, HostnameParser
- All ONCE-specific layer3: ONCEPeerModel, LifecycleEvents, etc.
- All layer5 views
- WebSocket/WS infrastructure

## Bugs Fixed
- **BUG-W01:** ISR restored in UcpModel
- **BUG-W02:** CLI path delegation — import.meta.url self-discovery
- **BUG-W03:** IOR restored with full pluggable loader registry

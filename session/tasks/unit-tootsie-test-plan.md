# Unit 0.3.23.1 — Tootsie Test Plan

**From**: unit-tester
**For**: unit-po
**Date**: 2026-04-27
**P25 Compliant**: Tootsie test classes only, no vitest describe/it

## Component Under Test

`@web4x/unit` at `/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Unit/0.3.23.1/`

**Source files (5 layer2, 1 layer5, 5 layer3):**
- `DefaultUnit.ts` — Core unit operations (from, link, info, list, delete, validate)
- `UnitDiscoveryService.ts` — File scanning, tsUnitCreate, manifestUpdate
- `ScenarioService.ts` — UUID index storage for unit scenarios
- `PumlUnitConverter.ts` — Parse PUML class diagrams into M3 CLASS units (NEW)
- `GitTextIOR.ts` — Git text reference IOR (NEW port from 0.3.0.5)
- `UnitCLI.ts` — CLI entry point

## Existing Tests (vitest — P25 violations, need conversion)

From Unit/0.3.0.5:
1. `unit.acceptance.test.ts` — Central storage, LD links, Web4 scenario format, unit functionality
2. `unit.filename.consistency.test.ts` — Space→dot filename conversion

Both use `describe/it/expect` (vitest). Must be rewritten as Tootsie test classes.

## Tootsie Test Plan (7 tests)

### Test01_DefaultUnitLifecycle.ts
**Requirement:** DefaultUnit follows Web4 component lifecycle
- AC-01: Empty constructor creates valid instance
- AC-02: modelDefault() returns model with uuid, typeM3, references[]
- AC-03: init() with scenario stores all fields
- AC-04: init() without scenario uses modelDefault()
- AC-05: validateModel() returns true for complete model, false for incomplete
- AC-06: toScenario() returns { ior, owner, model } with correct component name

### Test02_UnitFromFile.ts
**Requirement:** DefaultUnit.from() creates units from files and folders
- AC-01: from(filePath) creates file unit with correct name and origin
- AC-02: from(folderPath) creates folder unit with TypeM3.FOLDER
- AC-03: from(filePath, startPos, endPos) creates word-in-file unit
- AC-04: Created unit has correct indexPath (UUID-based path)
- AC-05: .unit symlink is created pointing to scenario JSON

### Test03_UnitLink.ts
**Requirement:** DefaultUnit.link() creates symlinks with correct naming
- AC-01: link(uuid, "Test Name") converts spaces to dots → "Test.Name.unit"
- AC-02: link(uuid, "Multiple  Spaces") collapses to single dots
- AC-03: link() updates references array in scenario
- AC-04: link() creates symlink at target location
- AC-05: link(unitFilePath, name) resolves UUID from .unit file

### Test04_UnitDiscoveryService.ts
**Requirement:** UnitDiscoveryService scans and creates units for component files
- AC-01: init() accepts scenarioService, componentRoot, componentName, componentVersion, projectRoot
- AC-02: unitsDiscover() with file patterns finds matching .ts files
- AC-03: tsUnitCreate() creates unit scenario for TypeScript file
- AC-04: unitCreate() returns DiscoveryResult with uuid, scenario, unitSymlinkPath
- AC-05: unitSave() persists scenario via ScenarioService
- AC-06: manifestUpdate() writes component manifest JSON

### Test05_PumlUnitConverter.ts
**Requirement:** PumlUnitConverter parses PUML class diagrams into M3 units
- AC-01: init() accepts scenarioService, projectRoot, componentName, componentVersion
- AC-02: pumlFileConvert() parses classes from PUML file
- AC-03: Parsed class has name, methods, properties, extends, implements
- AC-04: Each parsed class generates an M3 CLASS unit scenario
- AC-05: ConversionResult reports classesFound, m3UnitsCreated, errors

### Test06_GitTextIOR.ts
**Requirement:** GitTextIOR handles git URL references with IOR format
- AC-01: Empty constructor creates model with uuid and positioning
- AC-02: init(scenario) stores model from scenario
- AC-03: toScenario() returns valid scenario with owner JSON
- AC-04: parse("ior:git:text:https://github.com/...") extracts git URL
- AC-05: Version and component name resolved dynamically (not hardcoded)

### Test07_ScenarioService.ts
**Requirement:** ScenarioService manages UUID-indexed scenario persistence
- AC-01: init() accepts persistenceManager, componentName, componentVersion
- AC-02: scenarioSave() persists scenario to UUID-indexed path
- AC-03: scenarioLoad() retrieves scenario by UUID
- AC-04: UUID path structure follows a/b/c/d/e/uuid.scenario.json pattern
- AC-05: Symlink creation for type/domain views

## Test Infrastructure

Tests extend `DefaultWeb4TestCase` from `Web4Test/0.3.20.6`:
```typescript
import { DefaultWeb4TestCase } from '../../../../Web4Test/0.3.20.6/dist/ts/layer2/DefaultWeb4TestCase.js';
import { DefaultWeb4Requirement } from '../../../../Web4Requirement/0.3.20.6/dist/ts/layer2/DefaultWeb4Requirement.js';
```

Run via TootsieTestRunner:
```bash
npx tsx components/Tootsie/0.3.20.6/src/ts/layer4/TootsieTestRunner.ts /abs/path/to/TestNN_Name.ts
```

## Test Location

`/Users/Shared/Workspaces/AI/Claude.All/UpDown/components/Unit/0.3.23.1/test/tootsie/`

## Dependencies

- Web4Test/0.3.20.6 — BUILT ✅
- Web4Requirement/0.3.20.6 — BUILT ✅
- Tootsie/0.3.20.6 — BUILT ✅
- @web4x/ucp — BUILT ✅ (Unit depends on it)

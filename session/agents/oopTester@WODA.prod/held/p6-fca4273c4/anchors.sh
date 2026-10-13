#!/usr/bin/env bash
# Static anchor check for the S4b seeds at the audit sha (read-only git, no tests).
cd /var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/c2 || exit 2
S=fca4273c4; C=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
f() { git cat-file -e "$S:$1" 2>/dev/null && echo "PATH ok   $1" || echo "PATH MISS $1"; }
a() { n=$(git grep -cF -- "$1" "$S" -- "${2:-.}" ':!*.test.ts' 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}'); echo "ANCH $n  [$3] $1"; }
t() { n=$(git grep -cF -- "$1" "$S" -- "$2" 2>/dev/null | awk -F: '{s+=$NF} END{print s+0}'); echo "TEST $n  [$3] $1"; }
f scripts/bootstrap.mjs
for p in MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts latest/test/UnitReferencesInc2.test.ts MOF/M1/M1Layout/latest/test/NamespacePlacement.test.ts Package/latest/test/TreeFileUnitRulings.test.ts Ior/RepositoryId/latest/test/UcpComponentMove.test.ts ScenarioIndex/latest/src/ts/EAM/layer2/ScenarioIndex.ts MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts latest/test/Pipeline.test.ts MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts ScenarioIndex/latest/model/ScenarioIndexDefinition.ts latest/package.json; do f "$C/$p"; done
a 'this.roots.set(name, created);' . N1REVERT
a '  constructor() {' "$C/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts" FSCALLER/FSLINK
a 'await this.typeFile(typePath).link(file.path);' "$C/ScenarioIndex/latest/src/ts/EAM/layer2/ScenarioIndex.ts" R7BODY
a '&& !partLinks.has(file.path)) removed.push' . R1STALE
t '${new M1Catalog().init().homeLayout().packageFolder().path}' "$C/MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts" XPKG
t 'parts.at(-2) === this.names.model &&' "$C/Package/latest/test/TreeFileUnitRulings.test.ts" DERIV
a 'export class M1Catalog extends UcpComponent<ClassModel> {' "$C/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts" DYNALIAS
a 'for (const c of classes) await index.put(c);' . RATIOPUT3
echo "DRIFT links: $(git ls-tree -r --name-only $S -- "$C/DefaultFile" | grep -cE 'scenarios/(BrowserFile|NodeJSFile)/MethodModel/read\.scenario\.json')"
git ls-tree -r --name-only $S -- "$C/DefaultFile" | grep -E 'MethodModel/read\.scenario\.json' | head -4

#!/usr/bin/env bash
# S4b gate (A2 + oopPO a/b/c + A3) — Web4MDA f707537f (oopTester). Isolated real clone = seediso (own .git).
# usage: g.sh <RECON|BASE|...>  — run ALONE (one launch per clone). Logs in oopTester-s4b/.
set -u
REPO=/var/dev/Workspaces/web4x/Web4MDA
GEN=$REPO/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
SP=$GEN/oopTester-p6/out
ISO=$GEN/oopTester-p6/c2
SHA=${SHA:-fca4273c4}
C=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
want=${1:-RECON}; go() { [ "$want" = "$1" ]; }
cd "$ISO" || exit 2
fresh() { git checkout -q -f --detach "$SHA" && git reset -q --hard "$SHA" && git clean -qfd -e node_modules; }
fresh || { echo "CHECKOUT $SHA FAILED"; exit 2; }
echo "HEAD $(git rev-parse --short HEAD) own=$([ "$(git rev-parse --show-toplevel)" = "$ISO" ] && echo yes)"
NODE() { env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH "$@"; }
run() { # $1 label, rest = test files (empty = whole suite)
  local l=$1; shift
  NODE node scripts/bootstrap.mjs test "$@" > "$SP/$l.log" 2>&1; echo "[$l] rc=$?"
  sed "s/\x1b\[[0-9;]*m//g" "$SP/$l.log" | grep -aE "^ +Test Files |^ +Tests |^ +× |CHECKED|SKIPPED|AssertionError|Error: " | cut -c1-240 | sed "s/^/[$l] /" | head -40
}
if go RECON; then
  for p in "ALLOWED" "verbatimSymlinks" "SKIPPED" "multiLinked" "ghosts(" "scenarioRoot" "homeRoot" "8500" "toLowerCase" "LOAD GUARD" "OwnCpu" "threadCpuUsage" "packageHome" "M1Layout"; do
    echo "== $p: $(git grep -lF -- "$p" -- '*.ts' | grep -v '^spec/' | sed "s|$C/||" | tr '\n' ' ' | cut -c1-600)"
  done
fi
go BASE && run BASE
# --- seed helpers: every seed proves it applied (md5 changed), else SEED DID NOT APPLY and the mode stops ---
SEEDPY() { python3 - "$@" <<'EOP'
import sys,subprocess
label,old,new,scope=sys.argv[1:5]   # scope: ALL (incl. Definition, excl tests) | a single path
fs=[scope] if scope!='ALL' else [f for f in subprocess.run(['git','grep','-lF','--',old],capture_output=True,text=True).stdout.split() if not f.endswith('.test.ts')]
n=0
for f in fs:
    t=open(f).read(); t2=t.replace(old,new,1 if scope!='ALL' else -1)
    if t2!=t: open(f,'w').write(t2); n+=1
print(f"[{label}] seeded {n} file(s)" if n else f"[{label}] SEED DID NOT APPLY"); sys.exit(0 if n else 1)
EOP
}
COMMIT() { git add -A && git -c user.name=oopTester-seed -c user.email=seed@local commit -qm "LOCAL SEED $1 (never pushed)" && echo "[$1] committed locally $(git rev-parse --short HEAD)"; }
MCT=$C/MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts
URT=$C/latest/test/UnitReferencesInc2.test.ts
NPT=$C/MOF/M1/M1Layout/latest/test/NamespacePlacement.test.ts
TFR=$C/Package/latest/test/TreeFileUnitRulings.test.ts
UMV=$C/Ior/RepositoryId/latest/test/UcpComponentMove.test.ts
SITS=$C/ScenarioIndex/latest/src/ts/EAM/layer2/ScenarioIndex.ts
LAYTS=$C/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts
go N1REVERT && { SEEDPY N1REVERT 'this.roots.set(name, created);' '/* SEED N1REVERT: no held root */' ALL && run N1REVERT "$MCT"; }
go FSCALLER && { SEEDPY FSCALLER-imp "import " "import { readFileSync as seedReadFileSync } from 'node:fs';
import " "$LAYTS" && SEEDPY FSCALLER '  constructor() {' "  seedRead(): string {
    return seedReadFileSync('x', 'utf8');
  }
  constructor() {" "$LAYTS" && run FSCALLER "$URT"; }
go R7BODY && { SEEDPY R7BODY 'await this.typeFile(typePath).link(file.path);' 'await this.typeFile(typePath).link(file.path); void 0;' "$SITS" && run R7BODY "$URT"; }
go R1STALE && { SEEDPY R1STALE '&& !partLinks.has(path)) removed.push' '&& false) removed.push' ALL && run R1STALE "$MCT" "$NPT" "$UMV"; }
go XPKG && { SEEDPY XPKG '${new M1Catalog().init().homeLayout().packageFolder().path}' 'EAMD.ucp/Components/X/latest' "$MCT" && run XPKG "$MCT"; }
go LITPKG && { SEEDPY LITPKG '${new M1Catalog().init().homeLayout().packageFolder().path}' 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest' "$MCT" && run LITPKG "$MCT"; }
go DERIV && { SEEDPY DERIV "=== this.tail;" "=== this.tail + 'X';" "$TFR" && run DERIV "$TFR"; }
go DUPSRC && { d=$C/DefaultFile/NodeJSFile/latest/model; [ -d "$d" ] || d=$(dirname "$(git ls-files "$C/*/latest/model/*Definition.ts" | grep -v ScenarioIndex | head -1)"); cp "$C/ScenarioIndex/latest/model/ScenarioIndexDefinition.ts" "$d/" && echo "[DUPSRC] duplicate source -> $d/ScenarioIndexDefinition.ts" && run DUPSRC "$TFR"; }
go ROGUE && { mkdir -p "$C/ScenarioIndex/latest/model/Rogue" && cp "$C/ScenarioIndex/latest/model/ScenarioIndexDefinition.ts" "$C/ScenarioIndex/latest/model/Rogue/" && echo "[ROGUE] held source hidden under latest/model/Rogue/" && run ROGUE "$TFR"; }
go DRIFT && { l=$(git ls-files "$C/DefaultFile/*latest/model/scenarios/BrowserFile/M2AbstractMethod/read.scenario.json" | head -1); o=$(git ls-files "$C/DefaultFile/*latest/model/scenarios/NodeJSFile/M2AbstractMethod/read.scenario.json" | head -1); [ -n "$l" ] && [ -n "$o" ] || { echo "[DRIFT] link not found"; exit 1; }; t0=$(readlink "$l"); ln -sfn "$(readlink "$o")" "$l"; echo "[DRIFT] $l: $t0 -> $(readlink "$l") (resolves: $([ -e "$l" ] && echo yes || echo no))"; COMMIT DRIFT && run DRIFT; }
PLT=$C/latest/test/Pipeline.test.ts
FSSEED() { SEEDPY "$1-imp" "import " "import { $2 as seed$2 } from 'node:fs';
import " "$LAYTS" && SEEDPY "$1" '  constructor() {' "  seedFs(): void {
    seed$2($3);
  }
  constructor() {" "$LAYTS"; }
NJT=$C/DefaultFile/latest/test/NodeJSFile.test.ts
go FSCALLERNJ && { SEEDPY FSCALLERNJ-imp "import " "import { readFileSync as seedReadFileSync } from 'node:fs';
import " "$LAYTS" && SEEDPY FSCALLERNJ '  constructor() {' "  seedRead(): string {
    return seedReadFileSync('x', 'utf8');
  }
  constructor() {" "$LAYTS" && run FSCALLERNJ "$NJT"; }
go XPKG2 && { mkdir -p EAMD.ucp/Components/X/latest && echo "placeholder" > EAMD.ucp/Components/X/latest/held.txt && echo "[XPKG2] seeded 1 file(s): real placeholder package folder EAMD.ucp/Components/X/latest" && run XPKG2 "$TFR"; }
ORT=$C/MOF/M1/M1Catalog/latest/test/OneRootNamespace.test.ts
go P2LITSEED && { SEEDPY P2LITSEED "Namespace.declare(this.packageQualified.split('.').slice(0, -1).join('.'), components)" "Namespace.declare('com.ceruleanCircle', components)" "$LAYTS" && run P2LITSEED "$ORT"; }
PMD=$C/Package/latest/model/PackageModelDefinition.ts
go DOMAIN && { SEEDPY DOMAIN-imp "import { ImportModel } from '../../../latest/src/ts/EAM/layer3/ImportModel.js';" "import { AttributeModel } from '../../../latest/src/ts/EAM/layer3/AttributeModel.js';
import { ImportModel } from '../../../latest/src/ts/EAM/layer3/ImportModel.js';" "$PMD" && SEEDPY DOMAIN '      relationships: [' "      attributes: [
        new AttributeModel().init({
          uuid: 'd0d0d0d0-0000-4000-8000-00000000d0ad',
          name: 'domain',
          type: 'string',
          visibility: 'public',
          initializer: \"''\",
        }),
      ],
      relationships: [" "$PMD" && { NODE npm start > "$SP/DOMAIN.start.log" 2>&1; echo "[DOMAIN] regenerate rc=$? srcDomainLines=$(grep -c domain $C/Package/latest/src/ts/EAM/layer3/PackageModel.ts)"; } && run DOMAIN; }
go FSCALLER2 && { FSSEED FSCALLER2 readFileSync "'x', 'utf8'" && COMMIT FSCALLER2 && run FSCALLER2 "$PLT"; }
go FSLINK && { FSSEED FSLINK symlinkSync "'a', 'b'" && run FSLINK "$URT"; }
# E1-E3 (post-rewind diagnosis of the FSLINK/FSCALLER2 GREENs): alias A/B on one instrument + whole-suite hazard scans
FSPLAIN() { SEEDPY "$1-imp" "import " "import { $2 } from 'node:fs';
import " "$LAYTS" && SEEDPY "$1" '  constructor() {' "  seedFs(): void {
    $2($3);
  }
  constructor() {" "$LAYTS"; }
go FSLINKPLAIN && { FSPLAIN FSLINKPLAIN symlinkSync "'a', 'b'" && run FSLINKPLAIN "$URT"; }
go FSLINKALL && { FSSEED FSLINKALL symlinkSync "'a', 'b'" && run FSLINKALL; }
go FSCALLER2ALL && { FSSEED FSCALLER2ALL readFileSync "'x', 'utf8'" && COMMIT FSCALLER2ALL && run FSCALLER2ALL; }
# DYNALIAS: nearest dangerous member of the R2 "M1Catalog body strings are data" allowance + reproduce exemption: a REAL dynamic aliased node:fs call in M1Catalog.ts CODE (anchor unique @f707537f)
CATTS=$C/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts
go ROGUEALL && { mkdir -p "$C/ScenarioIndex/latest/model/Rogue" && cp "$C/ScenarioIndex/latest/model/ScenarioIndexDefinition.ts" "$C/ScenarioIndex/latest/model/Rogue/" && echo "[ROGUEALL] held source hidden under latest/model/Rogue/ (WHOLE suite)" && run ROGUEALL; }
go DYNALIAS && { SEEDPY DYNALIAS 'export class M1Catalog extends UcpComponent<ClassModel> {' "export class M1Catalog extends UcpComponent<ClassModel> {
  async seedFs(): Promise<void> {
    const { symlinkSync: seedLink } = await import('node:fs');
    seedLink('a', 'b');
  }
" "$CATTS" && run DYNALIAS; }
go DUPFOLDER && { mkdir -p "$C/MOF/Web4MDA/latest" && cp "$C/latest/package.json" "$C/MOF/Web4MDA/latest/" 2>/dev/null || touch "$C/MOF/Web4MDA/latest/held.txt"; echo "[DUPFOLDER] second held package folder $C/MOF/Web4MDA/latest"; run DUPFOLDER "$TFR"; }
PUTL='for (const c of classes) await index.put(c);'
ratio() { for i in 1 2 3 4 5; do run "$1-$i" "$MCT" | grep -aiE "rc=|RATIO|store/ref|SPEED|Tests " ; sed "s/\x1b\[[0-9;]*m//g" "$SP/$1-$i.log" | grep -aoiE "(ratio|store/ref)[^|]{0,120}" | head -3 | sed "s/^/[$1-$i] /"; done; }
go RATIOFIX && ratio RATIOFIX
go RATIOPUT3 && { SEEDPY PUT3 "$PUTL" "$PUTL $PUTL $PUTL" ALL && ratio RATIOPUT3; }
fresh
echo DONE

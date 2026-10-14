#!/usr/bin/env bash
# oopTester U4 B — seed the REAL producer in scratch clone c2 (never committed/pushed), run ONLY the named guard file, record counts + RED titles.
# usage: b.sh u3   (runs: base u3a u3b u3c u3d sequentially; one arm = one launch)
SHA=f41134102
C=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-u4/c2
OUT=$C/../out; P=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
RUN() { env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH "$@"; }
cd "$C" || exit 2
[ -x node_modules/.bin/vitest ] || { echo "c2 has no node_modules"; exit 2; }
[ "$(ps -eo args | grep -E '^[^ ]*node[^ ]* .*vitest' | grep -v grep | wc -l)" = "0" ] || { echo "NOT QUIET — refusing"; exit 3; }
[ "$(git rev-parse --short=9 HEAD)" = "$SHA" ] && [ "$(git status --porcelain | wc -l)" = "0" ] || { echo "c2 not clean at $SHA"; exit 4; }
seed() { # file old new  — exact-once replacement, refuses otherwise
  python3 - "$1" "$2" "$3" <<'PY' || exit 5
import sys; f,o,n=sys.argv[1:]; s=open(f).read(); k=s.count(o)
if k!=1: print(f"SEED REFUSED: anchor found {k}x in {f}"); sys.exit(5)
open(f,'w').write(s.replace(o,n)); print("SEED applied 1x")
PY
}
run() { # name guardfile [expectedName] — JSON for counts/titles + the DEFAULT reporter in the log (the JSON drops the Expected/Received diff)
  local o="$OUT/B-$1.json"; rm -f "$o"
  RUN node_modules/.bin/vitest run "$2" --reporter=json --reporter=default --outputFile.json="$o" > "$OUT/B-$1.log" 2>&1; local rc=$?
  [ -n "$3" ] && echo "   NAME-IN-OUTPUT '$3': $(sed 's/\x1b\[[0-9;]*m//g' "$OUT/B-$1.log" | grep -c -- "$3") line(s) in the default-reporter output"
  python3 - "$o" "$1" "$rc" <<'PY'
import json,sys; o,name,rc=sys.argv[1:]
try: j=json.load(open(o))
except Exception as e: print(f"[{name}] rc={rc} NO JSON ({e}) — see log"); sys.exit()
print(f"[{name}] rc={rc} passed={j['numPassedTests']} failed={j['numFailedTests']} skipped={j['numPendingTests']} total={j['numTotalTests']}")
for f in j['testResults']:
  for a in f['assertionResults']:
    if a['status']=='failed':
      m=(a.get('failureMessages') or [''])[0].splitlines()[0][:220]
      print(f"   RED: {a['title'][:110]}  ::  {m}")
PY
  git checkout -q -- . ; git clean -qfd >/dev/null 2>&1
  echo "   reset porcelain=$(git status --porcelain | wc -l)"
}
case "$1" in
  u3)
    G=$P/MOF/M1/M1ComponentView/latest/test/M1ComponentView.test.ts
    V=$P/MOF/M1/M1ComponentView/latest/src/ts/EAM/layer2/M1ComponentView.ts
    run base "$G"
    seed "$V" "this.belowNodes = classes.filter((c) => c.relationships.some((r) => r.kind === 'generalization' && this.bare(r.target) === this.name));" "this.belowNodes = classes.filter((c) => c.relationships.some((r) => r.kind === 'generalization' && (this.bare(r.target) === this.name || classes.some((p) => p.name === this.bare(r.target) && p.relationships.some((q) => q.kind === 'generalization' && this.bare(q.target) === this.name)))));"
    run u3a "$G" DefaultFolder
    seed "$V" "this.leftNodes = this.lift(units.flatMap((u) => dependency.dependencies(u.name)), named, layout);" "this.leftNodes = [...this.lift(units.flatMap((u) => dependency.dependencies(u.name)), named, layout), ...units.flatMap((u) => dependency.dependencies(u.name)).map((n) => named.get(n)).filter((c): c is ClassModel => c !== undefined && !this.isComponent(c, layout)).slice(0, 1)];"
    run u3b "$G" FileModel
    seed "$V" "return layout.ownerOf(c) === c.name;" "return layout.ownerOf(c) === c.name && c.name !== 'M1Catalog';"
    run u3c "$G" M1Catalog
    seed "$V" "if (r.kind !== 'generalization' && r.kind !== 'realization') continue;" "if (r.kind !== 'generalization') continue;"
    run u3d "$G" DefaultFile ;;
  u2)
    G=$P/MOF/M2/M2PlantUmlClass/latest/test/M2PlantUmlClass.test.ts
    V=$P/MOF/M2/M2PlantUmlClass/latest/src/ts/EAM/layer2/M2PlantUmlClass.ts
    run base "$G"
    seed "$V" "for (const g of c.methods.filter((m) => m.isGetter)) lines.push(...this.methodLines(g, c));" "for (const g of c.methods.filter((m) => m.isGetter && false)) lines.push(...this.methodLines(g, c));"
    seed "$V" "for (const m of c.methods.filter((x) => !x.isGetter)) lines.push(...this.methodLines(m, c));" "for (const m of c.methods.filter((x) => x !== undefined)) lines.push(...this.methodLines(m, c));"
    run u2a "$G" "getter in Methods"
    seed "$V" "lines.push('  == Properties ==');" "if (c.methods.some((m) => m.isGetter)) lines.push('  == Properties ==');"
    run u2b "$G" "headers \\[Attributes, Methods\\]"
    seed "$V" "for (const a of c.attributes) lines.push(this.attributeLine(a));" "if (!c.isInterface) for (const a of c.attributes) lines.push(this.attributeLine(a));"
    run u2c "$G" "missing from Attributes"
    # re-measure u3c with the diff-capturing instrument (its JSON message truncated the name: ...(1))
    G3=$P/MOF/M1/M1ComponentView/latest/test/M1ComponentView.test.ts
    V3=$P/MOF/M1/M1ComponentView/latest/src/ts/EAM/layer2/M1ComponentView.ts
    seed "$V3" "return layout.ownerOf(c) === c.name;" "return layout.ownerOf(c) === c.name && c.name !== 'M1Catalog';"
    run u3c-remeasure "$G3" M1Catalog ;;
  u1)
    # predictions declared at 13c9fa87 (findings.md:168-172) BEFORE this run
    G=$P/MOF/M2/M2AbstractDependency/latest/test/M2AbstractDependency.test.ts
    GP=$P/latest/test/Pipeline.test.ts
    V=$P/latest/model/UcpUnitDefinition.ts
    INIT=$(cat <<'EOF'
        new RelationshipModel().init({
          uuid: '8eafbc05-d631-478b-9fd3-5bf17aae5288',
          name: 'uses Init',
          kind: 'dependency',
          source: '',
          target: 'Init',
          multiplicity: '1',
          redefines: '',
          initializer: '',
          isTypeOnly: true,
        }),
EOF
)
    GHOST=$(cat <<'EOF'
          uuid: '00000000-0000-4000-8000-0000000000aa',
          name: 'uses Ghost',
          kind: 'dependency',
          source: '',
          target: 'Ghost',
          multiplicity: '1',
          redefines: '',
          initializer: '',
          isTypeOnly: true,
        }),
        new RelationshipModel().init({
          uuid: '3a42c19d-30bf-4e79-8687-a861b67b2946',
EOF
)
    run base-dep "$G"
    run base-pipe "$GP"
    seed "$V" "$INIT" ""
    run u1a-dep "$G" "fixture: UcpUnit uses Init"
    seed "$V" "$INIT" ""
    run u1a-pipe "$GP" UcpUnit
    seed "$V" "      typeParameters: ['M extends Model = Model']," "      imports: [],"$'\n'"      typeParameters: ['M extends Model = Model'],"
    run u1b "$G" UcpUnitDefinition
    seed "$V" "          uuid: '3a42c19d-30bf-4e79-8687-a861b67b2946'," "$GHOST"
    run u1c "$G" Ghost ;;
  u1s3)
    # predictions PINNED in findings.md (U1-S3 seeds PINNED) BEFORE this run
    G1=$P/latest/test/MofIncorporating.test.ts
    G2=$P/MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts
    V=$P/latest/model/UcpUnitDefinition.ts
    L=EAMD.ucp/Scenario/type/com/ceruleanCircle/Web4MDA/MOF/M2/M2AbstractClass/latest/UcpUnit.e994e082-88ea-4c95-8b53-3a149a8b1717.scenario.json
    run base-mof "$G1"
    run base-cat "$G2"
    seed "$V" "import { RelationshipModel } from '../src/ts/EAM/layer3/RelationshipModel.js';" "import { RelationshipModel } from '../src/ts/EAM/layer3/RelationshipModel.js';"$'\n'"import { ImportModel } from '../src/ts/EAM/layer3/ImportModel.js';"
    seed "$V" "      typeParameters: ['M extends Model = Model']," "      imports: [new ImportModel().init({ uuid: '00000000-0000-4000-8000-0000000000bb', name: 'Init', declaredBy: '', isInterface: false, isTypeOnly: true })],"$'\n'"      typeParameters: ['M extends Model = Model'],"
    run s3a "$G1" ImportModel
    [ -L "$L" ] || [ -f "$L" ] || { echo "s3b victim link missing — REFUSED"; exit 6; }
    rm -f "$L"; echo "SEED s3b: removed $L"
    run s3b "$G2" e994e082 ;;
  *) echo "usage: b.sh u3|u2|u1|u1s3"; exit 1 ;;
esac
echo "FINAL c2 head=$(git rev-parse --short=9 HEAD) porcelain=$(git status --porcelain | wc -l)"

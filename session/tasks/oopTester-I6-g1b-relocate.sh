#!/usr/bin/env bash
# oopTester I6 / G1(b) — generate REALISES a placement on the REAL model, and the round trip is byte-identical.
# Fresh throwaway clone at <sha>:
#   0. fresh-clone `npm start` = 0 diff (G6 fresh-clone arm)
#   1. commit a VALID role-less `packagedIn Ior` in the real UnknownTaggedComponentDefinition.ts; `npm start` rc 0
#   2. the component's folder moved under Web4MDA/Ior/UnknownTaggedComponent/latest, the old folder gone
#   3. held files (src/ts, test, model Definitions): 0 non-import changed lines (bodies untouched)
#   4. whole-tree tsc (SrcTypecheck's WholeTreeConfig) rc 0, 0 errors, moved file compiled at the NEW path
#   5. second `npm start` on the moved tree = 0 diff
#   6. remove the fact at its moved path; `npm start` -> tree BYTE-IDENTICAL to <sha>, moved folder gone
# Usage: oopTester-I6-g1b-relocate.sh <Web4MDA source repo> <sha>     exit 0 GREEN / 1 RED / 2 CONFOUND
set -uo pipefail
src="${1:?repo}"; sha="${2:?sha}"
work=/root/.claude/jobs/914c8cad/tmp/g1b; nm=/var/dev/Workspaces/web4x/Web4MDA/node_modules
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
old="$W/UnknownTaggedComponent"; new="$W/Ior/UnknownTaggedComponent"
cleanup() { rm -f "$work/node_modules"; rm -rf "$work"; }
red() { echo "RED: $*"; cleanup; exit 1; }
confound() { echo "CONFOUND: $*"; cleanup; exit 2; }
diffn() { git status --porcelain | grep -v '^?? node_modules$' | wc -l; }
cleanup
git clone -q "$src" "$work" && cd "$work" && git checkout -q --detach "$sha" && ln -s "$nm" node_modules || confound "clone"
timeout 600 npm start > ../g1b-0.log 2>&1 || red "fresh-clone npm start rc != 0"
[ "$(diffn)" -eq 0 ] || red "fresh-clone npm start diff $(diffn)"
echo "0 fresh-clone npm start: rc 0, 0 diff"
seed="        new RelationshipModel().init({
          uuid: '7d0c1e52-3b8a-4f6e-9a41-2c5e8b9f0a17',
          name: '',
          kind: 'packagedIn',
          source: '',
          target: 'Ior',
          multiplicity: '1',
          redefines: '',
        }),
"
anchor="          target: 'TaggedComponent',
          multiplicity: '1',
          redefines: '',
        }),
"
python3 - "$old/latest/model/UnknownTaggedComponentDefinition.ts" "$anchor" "$seed" <<'PY' || confound "seed did not apply"
import sys
p, a, s_ = sys.argv[1:4]; s = open(p).read()
assert s.count(a) == 1
open(p, "w").write(s.replace(a, a + s_))
PY
git commit -qam "G1b SEED (throwaway)" || confound "seed commit"
timeout 600 npm start > ../g1b-1.log 2>&1 || red "seeded generate rc != 0 (valid placement refused): $(grep -m1 '^Error' ../g1b-1.log | cut -c1-160)"
git add -A -- EAMD.ucp
[ -d "$new/latest" ] && [ ! -e "$old" ] || red "folder not relocated (new=$( [ -d "$new/latest" ] && echo y || echo n ) old=$( [ -e "$old" ] && echo still || echo gone ))"
echo "1-2 generate rc 0; moved: $(git diff --cached --name-status -M | grep -c '^R'), changed entries $(git status --porcelain -- EAMD.ucp | wc -l)"
body=$(git diff --cached -M -U0 -- '*/src/ts/*.ts' '*.test.ts' '*/model/*Definition.ts' | grep -E '^[+-][^+-]' | grep -vE '^[+-]\s*import ' | grep -vcE "^\+\s*(uuid: '7d0c1e52|name: '',|kind: 'packagedIn',|source: '',|target: 'Ior',|multiplicity: '1',|redefines: '',|new RelationshipModel\(\)\.init\(\{|\}\),)$")
imp=$(git diff --cached -M -U0 -- '*/src/ts/*.ts' '*.test.ts' '*/model/*Definition.ts' | grep -cE '^[+-]\s*import ')
[ "$body" -eq 0 ] || red "held body lines changed: $body"
echo "3 held files: 0 body lines, $imp import lines re-pointed"
cfg=/root/.claude/jobs/914c8cad/tmp/tsconfig.g1b.json
printf '{"extends":"%s/tsconfig.json","compilerOptions":{"rootDir":"%s","noEmit":true,"declaration":false,"declarationMap":false,"sourceMap":false,"typeRoots":["%s/node_modules/@types"]},"include":["%s/EAMD.ucp/Components/**/*.ts"],"exclude":[]}' "$work" "$work" "$work" "$work" > "$cfg"
PATH=/opt/node22/bin:$PATH timeout 600 node_modules/.bin/tsc --noEmit --listFiles -p "$cfg" > ../g1b-tsc.log 2>&1; trc=$?
files=$(grep -c "^$work/EAMD.ucp/Components/.*\.ts$" ../g1b-tsc.log); errs=$(grep -c 'error TS' ../g1b-tsc.log); at=$(grep -c "/Ior/UnknownTaggedComponent/latest/src/ts/EAM/layer2/UnknownTaggedComponent.ts$" ../g1b-tsc.log)
[ "$trc" -eq 0 ] && [ "$errs" -eq 0 ] && [ "$at" -eq 1 ] && [ "$files" -gt 0 ] || red "tsc rc=$trc errors=$errs files=$files moved-at-new-path=$at"
echo "4 tsc rc 0, $files files, 0 errors, moved file at new path"
git commit -qm "relocated (throwaway)"
timeout 600 npm start > ../g1b-2.log 2>&1 || red "second generate rc != 0"
[ "$(diffn)" -eq 0 ] || red "second generate diff $(diffn) (not a no-move)"
echo "5 second generate: 0 diff"
python3 - "$new/latest/model/UnknownTaggedComponentDefinition.ts" "$seed" <<'PY' || confound "unseed did not apply"
import sys
p, s_ = sys.argv[1:3]; s = open(p).read()
assert s.count(s_) == 1
open(p, "w").write(s.replace(s_, ""))
PY
timeout 600 npm start > ../g1b-3.log 2>&1 || red "unseed generate rc != 0"
git add -A -- EAMD.ucp
n=$(git diff --cached --name-only "$sha" | wc -l)
[ "$n" -eq 0 ] && [ ! -e "$new" ] || red "round trip differs from $sha: $n files (moved folder $( [ -e "$new" ] && echo present || echo gone ))"
echo "6 unseed -> BYTE-IDENTICAL to $sha, moved folder gone"
cleanup; rm -f "$cfg"
echo "GREEN"; exit 0

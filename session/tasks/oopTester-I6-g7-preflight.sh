#!/usr/bin/env bash
# oopTester I6 / G7 — generate PREFLIGHT is all-or-nothing (oopPO ruling 2026-10-05: a half-moved tree is a DEFECT).
# On a FRESH throwaway clone at <sha>: commit an INVALID placement in the real UnknownTaggedComponentDefinition.ts,
# run `npm start`, and require ALL of:  rc != 0  AND  the error names the seed's guard  AND  0 diff (byte-identical
# to the seed commit)  AND  no Ior/UnknownTaggedComponent folder exists.
# Seeds (each = one NAMED guard of M2ThingClass, so a seed can never pass by tripping some OTHER error):
#   rolenamed — packagedIn with a role name   -> "grammar cannot express"
#   twocontainers — packagedIn Ior AND Link   -> "a component has ONE container"
# Usage: oopTester-I6-g7-preflight.sh <Web4MDA source repo> <sha> <rolenamed|twocontainers>
# Exit 0 = GREEN (preflight held), 1 = RED (moved/partial or did not throw), 2 = CONFOUND (seed did not apply / wrong error).
set -uo pipefail
src="${1:?repo}"; sha="${2:?sha}"; seed="${3:?seed}"
work="/root/.claude/jobs/914c8cad/tmp/g7-${seed}"
nm="/var/dev/Workspaces/web4x/Web4MDA/node_modules"
def='EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/UnknownTaggedComponent/latest/model/UnknownTaggedComponentDefinition.ts'
moved='EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/Ior/UnknownTaggedComponent'
cleanup() { rm -f "$work/node_modules"; rm -rf "$work"; }
cleanup
git clone -q "$src" "$work" && cd "$work" && git checkout -q --detach "$sha" && ln -s "$nm" node_modules || { echo "CONFOUND: clone failed"; cleanup; exit 2; }
rel() { printf "        new RelationshipModel().init({\n          uuid: '%s',\n          name: '%s',\n          kind: 'packagedIn',\n          source: '',\n          target: '%s',\n          multiplicity: '1',\n          redefines: '',\n        }),\n" "$1" "$2" "$3"; }
case "$seed" in
  rolenamed)     add="$(rel 7d0c1e52-3b8a-4f6e-9a41-2c5e8b9f0a17 'packagedIn Ior' Ior)"; want='grammar cannot express' ;;
  twocontainers) add="$(rel 7d0c1e52-3b8a-4f6e-9a41-2c5e8b9f0a17 '' Ior)$(rel 9e1f2a63-4c9b-4a7f-8b52-3d6f9c0a1b28 '' Link)"; want='ONE container' ;;
  *) echo "CONFOUND: unknown seed $seed"; cleanup; exit 2 ;;
esac
anchor="          target: 'TaggedComponent',
          multiplicity: '1',
          redefines: '',
        }),"
python3 - "$def" "$anchor" "$add" <<'PY' || { echo "CONFOUND: seed did not apply"; cleanup; exit 2; }
import sys
p, a, add = sys.argv[1], sys.argv[2] + "\n", sys.argv[3]
s = open(p).read()
assert s.count(a) == 1, "anchor not unique"
open(p, "w").write(s.replace(a, a + add))
PY
git commit -qam "G7 SEED $seed (throwaway)" || { echo "CONFOUND: seed commit failed"; cleanup; exit 2; }
timeout 600 npm start > ../g7-${seed}.log 2>&1; rc=$?
named=$(grep -c "$want" ../g7-${seed}.log)
diff=$(git status --porcelain | grep -v '^?? node_modules$' | wc -l)
folder=$([ -e "$moved" ] && echo present || echo absent)
echo "G7 $seed @ $(git rev-parse --short HEAD^): rc=$rc named-guard-hits=$named diff-entries=$diff Ior/UnknownTaggedComponent=$folder"
git status --porcelain | grep -v '^?? node_modules$' | cut -c1-3 | sort | uniq -c | sed 's/^/   /'
cleanup
if [ "$rc" -eq 0 ]; then echo "RED: generate did not throw on an invalid model"; exit 1; fi
if [ "$named" -eq 0 ]; then echo "CONFOUND: threw, but not by the seed's guard ('$want')"; exit 2; fi
if [ "$diff" -ne 0 ] || [ "$folder" = present ]; then echo "RED: threw AFTER touching the tree (half-moved)"; exit 1; fi
echo "GREEN: threw by its named guard, tree byte-identical, nothing moved"; exit 0

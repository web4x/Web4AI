#!/usr/bin/env bash
# READ-ONLY helper (oopTester S4b gate): git objects of the shared checkout only — never touches seediso or any working tree.
# usage: r.sh <FIXDIFF|N1TEST|LINKCHECKS|PARTS|PKGHOME>
set -u
cd /var/dev/Workspaces/web4x/Web4MDA || exit 2
C=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
SI=$C/ScenarioIndex/latest/src/ts/EAM/layer2/ScenarioIndex.ts
MC=$C/MOF/M1/M1Catalog/latest/test/M1Catalog.test.ts
case "${1:-}" in
  FIXDIFF) git show 514e7215 -U3 -- "$SI" | grep -nE '^[-+@]' | grep -inE 'root|@@' | cut -c1-220 | head -40 ;;
  N1TEST) git show f707537f:"$MC" | grep -nE 'N1|held|LOAD GUARD|OwnCpu|DIFFERENT objects|root folder|threshold|10\.5|put loop|reference' | cut -c1-220 | head -40 ;;
  LINKCHECKS) git show f707537f:"$MC" | grep -nE "misnamed|multiLinked|ghosts\(|dangling|case-?fold|toLowerCase|unique|model\.links|2nd start|0 changed|relative" | cut -c1-200 | head -40 ;;
  PARTS) git ls-tree -r --name-only f707537f | grep -E '/latest/model/scenarios/' | awk -F'/latest/model/scenarios/' '{print $2}' | awk -F/ '{print $1"/"$2"/"$3}' | head -5
         echo "total part links: $(git ls-tree -r --name-only f707537f | grep -cE '/latest/model/scenarios/')" ;;
  PKGHOME) git show f707537f:"$MC" | grep -nE "packageHome|M1Layout\(|homeLayout|com/ceruleanCircle|'X/'|\"X/\"" | cut -c1-200 | head -25 ;;
  CONTROL) git ls-tree -r --name-only f707537f | grep -E '/latest/model/scenarios/.*\.scenario\.json$' | python3 -c '
import sys, collections
links = [l.strip() for l in sys.stdin if l.strip()]
withc, without = collections.defaultdict(set), collections.defaultdict(set)
comps = set()
for l in links:
    comp, rest = l.split("/latest/model/scenarios/", 1)
    comps.add(comp)
    parts = rest.split("/")              # <Class>/<PartType>/<partPath>.scenario.json
    withc[(comp, rest.lower())].add(l)
    without[(comp, "/".join(parts[1:]).lower())].add(l)
def coll(d):
    keys = [k for k, v in d.items() if len(v) > 1]
    return len(keys), sum(len(d[k]) for k in keys), len({k[0] for k in keys})
print(f"part links {len(links)} in {len(comps)} components")
print("LAYOUT B  (<Class>/<PartType>/<partPath>, case-folded): keys %d / links %d / components %d" % coll(withc))
print("OLD layout (<PartType>/<partPath>, case-folded):         keys %d / links %d / components %d" % coll(without))
two = sorted({k for k, v in without.items() if len({x.split("/latest/model/scenarios/")[1].split("/")[0] for x in v}) > 1})
print("same name under >=2 classes (old-layout collisions BY class):", len(two))
for c, k in two:
    if "methodmodel/read." in k or k.startswith("methodmodel/read"):
        print("  e.g.", c.split("/")[-1], k, sorted(x.split("/latest/model/scenarios/")[1].split("/")[0] for x in without[(c,k)]))
' ;;
  LOGSUM) L=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-s4b/${2:-BASE}.log
     sed 's/\x1b\[[0-9;]*m//g' "$L" | grep -aE '↓|[0-9]{4,5}ms' | grep -avE '^ +Tests |^ +Duration' | cut -c1-190 | head -60 ;;
  SKIPS) L=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-s4b/${2:-BASE}.log
     sed 's/\x1b\[[0-9;]*m//g' "$L" | grep -aE '^ +↓ |skip\)| \[skipped\]' | cut -c1-200 | head -10 ;;
  *) echo "usage: r.sh FIXDIFF|N1TEST|LINKCHECKS|PARTS|PKGHOME|CONTROL|LOGSUM <label>|SKIPS <label>" ;;
esac

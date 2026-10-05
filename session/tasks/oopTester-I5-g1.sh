#!/usr/bin/env bash
# oopTester I5 / G1 — no-move generate = ZERO diff, proven failable by two seeds (design 03e7b4a5 G1 a + b).
# On ONE fresh throwaway clone at <sha> (never the shared tree); seeds are TEMP COMMITS, reset between cases.
#   CLEAN : npm start -> git status --porcelain (EAMD.ucp) == 0
#   SEED a: change one VALUE inside one Definition JSON literal (the class uuid, rendered into puml/mmd) -> generate -> outputs differ -> RED expected
#   SEED b: git mv one HELD src/ts file away from its model-derived folder -> generate relocates it -> diff -> RED expected
# Usage: oopTester-I5-g1.sh <Web4MDA source repo> <sha>     prints one line per case; exit 0 iff CLEAN==0 AND both seeds bite
set -uo pipefail
src="${1:?repo}"; sha="${2:?sha}"
work=/root/.claude/jobs/914c8cad/tmp/g1-i5; nm=/var/dev/Workspaces/web4x/Web4MDA/node_modules
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
rm -f "$work/node_modules"; rm -rf "$work"
git clone -q --no-hardlinks "$src" "$work" && cd "$work" && git checkout -q --detach "$sha" && ln -s "$nm" node_modules || { echo "CONFOUND: clone"; exit 2; }
printf 'node_modules\n' >> .git/info/exclude
export PATH=/opt/node22/bin:$PATH
reset() { git reset -q --hard "$sha" && git clean -fdq -- EAMD.ucp; }
gen() { timeout 900 npm start > "../g1-$1.log" 2>&1; echo $?; }
dirty() { git status --porcelain -- EAMD.ucp | wc -l; }
ok=0
rc=$(gen clean); n=$(dirty); echo "CLEAN  : generate rc=$rc, diff entries=$n  -> $( [ "$rc" -eq 0 ] && [ "$n" -eq 0 ] && echo GREEN || echo RED )"; [ "$rc" -eq 0 ] && [ "$n" -eq 0 ] || ok=1
reset
d=$W/Ior/RepositoryId/latest/model/RepositoryIdDefinition.ts
line=$(grep -nm1 "^      uuid: '" "$d" | cut -d: -f1)
if [ -z "$line" ]; then echo "SEED a : CONFOUND — no class uuid literal in $d"; ok=1; else
  sed -i "${line}s/uuid: '97e9d116/uuid: '97e9d117/" "$d"; git diff --quiet -- "$d" && { echo "SEED a : CONFOUND — seed did not apply"; ok=1; }; git commit -qam "G1 SEED a (throwaway)"
  rc=$(gen seedA); n=$(dirty); echo "SEED a : class uuid value edited in RepositoryIdDefinition L$line -> generate rc=$rc, diff entries=$n -> $( [ "$n" -gt 0 ] && echo 'RED (bites)' || echo 'GREEN = HOLLOW seed' )"; [ "$n" -gt 0 ] || ok=1
fi
reset
h=$(git ls-files "$W/Ior/ObjectKey/latest/src/ts/*ObjectKey.ts" | head -1)
if [ -z "$h" ]; then echo "SEED b : CONFOUND — held ObjectKey.ts not found"; ok=1; else
  dst="$W/Ior/latest/src/ts/EAM/layer2/ObjectKey.ts"; mkdir -p "$(dirname "$dst")"; git mv "$h" "$dst"; git commit -qm "G1 SEED b (throwaway)"
  rc=$(gen seedB); n=$(dirty); echo "SEED b : held ObjectKey.ts moved to Ior/latest (off its derived folder) -> generate rc=$rc, diff entries=$n -> $( [ "$n" -gt 0 ] && echo 'RED (bites)' || echo 'GREEN = HOLLOW seed' )"; [ "$n" -gt 0 ] || ok=1
fi
cd / && rm -f "$work/node_modules" && rm -rf "$work"
[ $ok -eq 0 ] && { echo "G1 GREEN (clean 0 diff, both seeds bite)"; exit 0; } || { echo "G1 RED/CONFOUND"; exit 1; }

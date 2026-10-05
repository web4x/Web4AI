#!/usr/bin/env bash
# oopTester I6 / G3 + G4 + move() guards — on ONE fresh throwaway clone at <sha>, reset between cases.
# For EVERY IOR member X (components AND models — measured, not assumed):
#   G4  move(X, 'Ior') ALONE: changed files == { X's Definition }, every changed line INSIDE its `init({ … })` literal
#   G3  generate (rc 0) realises it; move(X, '') + generate -> tree BYTE-IDENTICAL to <sha>
#   a member move() REFUSES is reported REFUSED with its message and must leave 0 diff
# Guards (must throw by NAME, 0 diff): itself (Ior -> Ior), cycle (UnknownTaggedComponent into Ior, then Ior into it).
# Usage: oopTester-I6-g3g4-move.sh <Web4MDA source repo> <sha>     exit 0 GREEN / 1 RED / 2 CONFOUND
set -uo pipefail
src="${1:?repo}"; sha="${2:?sha}"
work=/root/.claude/jobs/914c8cad/tmp/g3g4; nm=/var/dev/Workspaces/web4x/Web4MDA/node_modules
MEMBERS="RepositoryId ObjectKey InternetProfile SecureTransport UnknownTaggedComponent TaggedProfile TaggedComponent RepositoryIdModel ObjectKeyModel TaggedProfileModel InternetProfileModel TaggedComponentModel SecureTransportModel"
cleanup() { rm -f "$work/node_modules"; rm -rf "$work"; }
fail=0
cleanup
git clone -q --no-hardlinks "$src" "$work" && cd "$work" && git checkout -q --detach "$sha" && ln -s "$nm" node_modules || { echo "CONFOUND: clone"; cleanup; exit 2; }
printf 'node_modules\nmove-driver.tmp.ts\n' >> .git/info/exclude
reset() { git reset -q --hard "$sha" && git clean -fdq -- EAMD.ucp; }
diffn() { git status --porcelain | wc -l; }
# move <class> <target> -> rc; stderr kept in ../g3g4-err.txt
move() {
  cat > move-driver.tmp.ts <<EOF
const W = './EAMD.ucp/Components/com/ceruleanCircle/Web4MDA';
const { M1Catalog } = await import(\`\${W}/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js\`);
const { M1Layout } = await import(\`\${W}/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js\`);
await M1Catalog.load();
const catalog = new M1Catalog().init();
await M1Layout.load(catalog);
const layout = catalog.homeLayout('');
const layer = catalog.classes().find((c: { name: string }) => c.name === '$1')?.layer ?? 'layer2';
const held = layout.classFolder('$1', 'ts').path;
const mod = await import(\`./\${held}/$1.js\`);
await new mod['$1']().move('$2', catalog);
EOF
  PATH=/opt/node22/bin:$PATH timeout 300 node_modules/.bin/tsx move-driver.tmp.ts > ../g3g4-out.txt 2> ../g3g4-err.txt; local rc=$?
  rm -f move-driver.tmp.ts; return $rc
}
def_of() { git ls-files "EAMD.ucp/*/$1Definition.ts" | grep "/model/$1Definition.ts$"; }
inside_literal() { # every changed line of $1 lies between `return new ClassModel().init({` and the closing `});`
  local f="$1" open close
  open=$(grep -n '^    return new ClassModel().init({$' "$f" | cut -d: -f1); close=$(awk -v o="$open" 'NR>o && /^    \}\);$/ {print NR; exit}' "$f")
  [ -n "$open" ] && [ -n "$close" ] || { echo "no-literal"; return 1; }
  git diff -U0 -- "$f" | grep -oE '^@@ -[0-9]+(,[0-9]+)? \+[0-9]+(,[0-9]+)?' | sed -E 's/.*\+([0-9]+)(,([0-9]+))?/\1 \3/' | while read s n; do n=${n:-1}; [ "$n" -eq 0 ] && continue; e=$((s+n-1)); if [ "$s" -le "$open" ] || [ "$e" -ge "$close" ]; then echo "out:$s-$e"; fi; done
}
for X in $MEMBERS; do
  reset
  d=$(def_of "$X"); [ -n "$d" ] || { echo "$X: CONFOUND no Definition"; fail=1; continue; }
  if ! move "$X" Ior; then
    n=$(diffn); msg=$(grep -m1 -E 'Error' ../g3g4-err.txt | cut -c1-160)
    if [ "$n" -eq 0 ]; then echo "$X: REFUSED (0 diff) — $msg"; else echo "$X: RED refused but tree touched ($n) — $msg"; fail=1; fi
    continue
  fi
  files=$(git status --porcelain | awk '{print $2}'); nf=$(echo "$files" | grep -c .)
  out=$(inside_literal "$d")
  if [ "$nf" -ne 1 ] || [ "$files" != "$d" ] || [ -n "$out" ]; then echo "$X: G4 RED files=$nf ($files) $out"; fail=1; continue; fi
  git commit -qam "move $X" ; timeout 600 npm start > ../g3g4-gen.log 2>&1 || { echo "$X: G3 RED generate rc!=0"; fail=1; continue; }
  git add -A -- EAMD.ucp; moved=$(git diff --cached --name-status -M | grep -c '^R'); git commit -qm "gen $X" -q
  move "$X" "" || { echo "$X: G3 RED move back failed: $(grep -m1 -E 'Error' ../g3g4-err.txt | cut -c1-160)"; fail=1; continue; }
  timeout 600 npm start > ../g3g4-gen2.log 2>&1 || { echo "$X: G3 RED generate-back rc!=0"; fail=1; continue; }
  git add -A -- EAMD.ucp; back=$(git diff --cached --name-only "$sha" | wc -l)
  if [ "$back" -eq 0 ]; then echo "$X: GREEN — G4 1 file inside literal; generate moved $moved; round trip BYTE-IDENTICAL"; else echo "$X: G3 RED round trip differs by $back files"; fail=1; fi
done
# guards
reset; if move Ior Ior; then echo "GUARD itself: RED (no throw)"; fail=1; else n=$(diffn); echo "GUARD itself: $( [ "$n" -eq 0 ] && echo GREEN || echo RED ) (diff $n) — $(grep -m1 -E 'Error' ../g3g4-err.txt | cut -c1-160)"; [ "$n" -eq 0 ] || fail=1; fi
reset; move UnknownTaggedComponent Ior && git commit -qam "pre-cycle" -q && timeout 600 npm start > ../g3g4-gen.log 2>&1 && git add -A -- EAMD.ucp && git commit -qm "pre-cycle gen" -q  # the catalog loads from DERIVED folders: realise the first move before the next one
if move Ior UnknownTaggedComponent; then echo "GUARD cycle: RED (no throw)"; fail=1; else n=$(diffn); echo "GUARD cycle: $( [ "$n" -eq 0 ] && echo GREEN || echo RED ) (diff $n) — $(grep -m1 -E 'Error' ../g3g4-err.txt | cut -c1-160)"; [ "$n" -eq 0 ] || fail=1; fi
# a guard counts only when its OWN message is the error (an unrelated throw, e.g. ERR_MODULE_NOT_FOUND, is a CONFOUND)
grep -q "is packaged in" ../g3g4-err.txt || { echo "GUARD cycle: CONFOUND — not the cycle guard's message"; fail=1; }
reset; if move RepositoryId RepositoryIdModel; then echo "GUARD non-component target: RED (no throw)"; fail=1; else n=$(diffn); grep -q "is not a component" ../g3g4-err.txt && echo "GUARD non-component target: $( [ "$n" -eq 0 ] && echo GREEN || echo RED ) (diff $n)" || { echo "GUARD non-component target: CONFOUND"; fail=1; }; [ "$n" -eq 0 ] || fail=1; fi
cd / && cleanup
[ $fail -eq 0 ] && { echo "G3/G4/GUARDS GREEN"; exit 0; } || { echo "G3/G4/GUARDS RED"; exit 1; }

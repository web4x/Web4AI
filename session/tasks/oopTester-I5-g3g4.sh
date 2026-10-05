#!/usr/bin/env bash
# oopTester I5 / G3 + G4 + g1b + move() guards — I5 DIRECTION (the IOR set already sits in Ior at <sha>).
# Supersedes oopTester-I6-g3g4-move.sh for I5 (that one moves X INTO Ior from the root = pre-I5, and lists models as move
# subjects = pre-ruling-A). Fresh throwaway clone at <sha>, reset between cases; seeds/steps are TEMP COMMITS.
# For EVERY IOR COMPONENT X (7):
#   G4  move(X, '') ALONE: every changed file is a */model/*Definition.ts; X's own Definition is among them; every changed line
#       lies INSIDE its `init({ … })` literal; every OTHER changed Definition (a unit rehomed in the SAME mutation, ruling A/1)
#       changes exactly ONE line and it is its `namespace:` line
#   G3  generate (rc 0) realises it; move(X, 'Ior') + generate -> tree BYTE-IDENTICAL to <sha>
#   g1b (first member only) on the moved-out tree: whole-tree typecheck (SrcTypecheck.test) GREEN + a 2nd generate = 0 diff
# Guards (must throw by their OWN message, 0 diff): itself (Ior -> Ior), cycle (Ior -> UnknownTaggedComponent, which sits
# inside Ior), non-component target (RepositoryId -> RepositoryIdModel).
# Usage: oopTester-I5-g3g4.sh <Web4MDA source repo> <sha>     exit 0 GREEN / 1 RED / 2 CONFOUND
set -uo pipefail
src="${1:?repo}"; sha="${2:?sha}"
work=/root/.claude/jobs/914c8cad/tmp/g3g4-i5; nm=/var/dev/Workspaces/web4x/Web4MDA/node_modules
MEMBERS="${MEMBERS:-RepositoryId ObjectKey InternetProfile SecureTransport UnknownTaggedComponent TaggedProfile TaggedComponent}"
cleanup() { rm -f "$work/node_modules"; rm -rf "$work"; }
fail=0
cleanup
git clone -q --no-hardlinks "$src" "$work" && cd "$work" && git checkout -q --detach "$sha" && ln -s "$nm" node_modules || { echo "CONFOUND: clone"; cleanup; exit 2; }
printf 'node_modules\nmove-driver.tmp.ts\n' >> .git/info/exclude
export PATH=/opt/node22/bin:$PATH
reset() { git reset -q --hard "$sha" && git clean -fdq -- EAMD.ucp; }
diffn() { git status --porcelain | wc -l; }
move() {
  cat > move-driver.tmp.ts <<EOF
const W = './EAMD.ucp/Components/com/ceruleanCircle/Web4MDA';
const { M1Catalog } = await import(\`\${W}/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js\`);
const { M1Layout } = await import(\`\${W}/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js\`);
await M1Catalog.load();
const catalog = new M1Catalog().init();
await M1Layout.load(catalog);
const held = catalog.homeLayout('').classFolder('$1', 'ts').path;
const mod = await import(\`./\${held}/$1.js\`);
await new mod['$1']().move('$2', catalog);
EOF
  timeout 300 node_modules/.bin/tsx move-driver.tmp.ts > ../g3g4-i5-out.txt 2> ../g3g4-i5-err.txt; local rc=$?
  rm -f move-driver.tmp.ts; return $rc
}
def_of() { git ls-files "EAMD.ucp/*/$1Definition.ts" | grep "/model/$1Definition.ts$"; }
outside_literal() { # prints the changed line ranges of $1 that lie OUTSIDE `return new ClassModel().init({` .. `});`
  local f="$1" open close
  open=$(grep -n '^    return new ClassModel().init({$' "$f" | cut -d: -f1); close=$(awk -v o="$open" 'NR>o && /^    \}\);$/ {print NR; exit}' "$f")
  [ -n "$open" ] && [ -n "$close" ] || { echo "no-literal"; return; }
  git diff -U0 -- "$f" | grep -oE '^@@ -[0-9]+(,[0-9]+)? \+[0-9]+(,[0-9]+)?' | sed -E 's/.*\+([0-9]+)(,([0-9]+))?/\1 \3/' | while read s n; do n=${n:-1}; [ "$n" -eq 0 ] && continue; e=$((s+n-1)); if [ "$s" -le "$open" ] || [ "$e" -ge "$close" ]; then echo "out:$s-$e"; fi; done
}
first=1
for X in $MEMBERS; do
  reset
  d=$(def_of "$X"); [ -n "$d" ] || { echo "$X: CONFOUND no Definition"; fail=1; continue; }
  if ! move "$X" ""; then echo "$X: G4 RED move out refused: $(grep -m1 -E 'Error' ../g3g4-i5-err.txt | cut -c1-170)"; fail=1; continue; fi
  files=$(git status --porcelain | awk '{print $2}')
  bad=$(echo "$files" | grep -v '/model/[A-Za-z]*Definition\.ts$' | grep -c .)
  own=$(echo "$files" | grep -cx "$d")
  out=$(outside_literal "$d")
  rehomed=0; rbad=""
  for f in $(echo "$files" | grep -vx "$d"); do
    rehomed=$((rehomed+1))
    ch=$(git diff -U0 -- "$f" | grep -E '^[+-][^+-]' | grep -vcE "^[+-]\s+namespace: '")
    nl=$(git diff -U0 -- "$f" | grep -cE "^\+\s+namespace: '")
    [ "$ch" -eq 0 ] && [ "$nl" -eq 1 ] || rbad="$rbad $(basename "$f")"
  done
  if [ "$bad" -ne 0 ] || [ "$own" -ne 1 ] || [ -n "$out" ] || [ -n "$rbad" ]; then
    echo "$X: G4 RED non-Definition=$bad own=$own outside-literal=[$out] rehomed-not-namespace-only=[$rbad]"; fail=1; continue
  fi
  git commit -qam "move $X out"; timeout 900 npm start > ../g3g4-i5-gen.log 2>&1 || { echo "$X: G3 RED generate rc!=0: $(grep -m1 '^Error' ../g3g4-i5-gen.log | cut -c1-160)"; fail=1; continue; }
  git add -A -- EAMD.ucp; moved=$(git diff --cached --name-status -M | grep -c '^R'); git commit -qm "gen $X out" -q
  if [ $first -eq 1 ]; then
    first=0
    timeout 900 npx vitest run EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/SrcTypecheck.test.ts --reporter=json --outputFile=../g1b-i5-tsc.json > /dev/null 2>&1
    tsc=$(python3 -c "import json;d=json.load(open('../g1b-i5-tsc.json'));print(d['numPassedTests'],d['numFailedTests'])")
    timeout 900 npm start > ../g3g4-i5-gen2.log 2>&1; g2=$(git status --porcelain -- EAMD.ucp | wc -l)
    echo "$X: g1b on the moved-out tree — SrcTypecheck pass/fail=$tsc, 2nd generate diff=$g2 -> $( [ "${tsc#* }" = "0" ] && [ "$g2" -eq 0 ] && echo GREEN || echo RED )"
    [ "${tsc#* }" = "0" ] && [ "$g2" -eq 0 ] || fail=1
    git checkout -q -- EAMD.ucp 2>/dev/null; git clean -fdq -- EAMD.ucp
  fi
  move "$X" Ior || { echo "$X: G3 RED move back into Ior failed: $(grep -m1 -E 'Error' ../g3g4-i5-err.txt | cut -c1-170)"; fail=1; continue; }
  timeout 900 npm start > ../g3g4-i5-gen2.log 2>&1 || { echo "$X: G3 RED generate-back rc!=0"; fail=1; continue; }
  git add -A -- EAMD.ucp; back=$(git diff --cached --name-only "$sha" | wc -l)
  if [ "$back" -eq 0 ]; then echo "$X: GREEN — G4 own Definition + $rehomed rehomed (namespace-only), all inside literals; generate relocated $moved; round trip BYTE-IDENTICAL"; else echo "$X: G3 RED round trip differs by $back files: $(git diff --cached --name-only "$sha" | head -3 | tr '\n' ' ')"; fail=1; fi
done
guard() { # $1 label, $2 class, $3 target, $4 expected message fragment
  reset
  if move "$2" "$3"; then echo "GUARD $1: RED (no throw)"; fail=1; return; fi
  local n; n=$(diffn)
  if grep -q -- "$4" ../g3g4-i5-err.txt; then echo "GUARD $1: $( [ "$n" -eq 0 ] && echo GREEN || echo RED ) (diff $n) — $(grep -m1 -- "$4" ../g3g4-i5-err.txt | sed 's/^.*Error: //' | cut -c1-120)"; [ "$n" -eq 0 ] || fail=1
  else echo "GUARD $1: CONFOUND — not its own message: $(grep -m1 -E 'Error' ../g3g4-i5-err.txt | cut -c1-140)"; fail=1; fi
}
guard itself Ior Ior "never packaged in itself"
guard cycle Ior UnknownTaggedComponent "is packaged in Ior — a cycle"
guard non-component RepositoryId RepositoryIdModel "is not a component"
cd / && cleanup
[ $fail -eq 0 ] && { echo "G3/G4/g1b/GUARDS GREEN"; exit 0; } || { echo "G3/G4/g1b/GUARDS RED"; exit 1; }

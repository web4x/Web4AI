#!/usr/bin/env bash
# oopTester P2b' ATOMICITY states — seediso ONLY, LOCAL commits (never pushed). Split = the generator's OWN behaviour:
#   OUTPUT = changed paths the child `npm start` wrote (fsw log) ∪ child type links it RECREATED after deletion (probe A)
#            ∪ parent type links the parent `npm start` RECREATED after deletion (probe P)
#   RULE   = every other changed path (src/ts proven INPUT: deleting it makes `npm start` fail, probe B)
# usage: states.sh SPLIT | RULEONLY | OUTPUTONLY
PARENT=985e23841; CHILD=2e95f3bb3
REPO=/var/dev/Workspaces/web4x/Web4MDA
GEN=$REPO/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
ISO=$GEN/seediso; OUT=$GEN/oopTester-p2bp
HELD=/var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/p2bp-2e95f3bb3
split() {
  awk -F'\t' '$1=="LOGGED"{print $3}' "$OUT/classified.tsv" | cat - "$OUT/probeA.list" "$OUT/probeP.list" | sort -u > "$OUT/output.list"
  cut -f2 "$OUT/changes.tsv" | sort -u > "$OUT/all.list"
  comm -23 "$OUT/all.list" "$OUT/output.list" > "$OUT/rule.list"
  comm -13 "$OUT/all.list" "$OUT/output.list" > "$OUT/stray.list"   # output paths NOT in the change set (must be 0)
  echo "SPLIT all=$(wc -l < "$OUT/all.list") output=$(wc -l < "$OUT/output.list") rule=$(wc -l < "$OUT/rule.list") stray=$(wc -l < "$OUT/stray.list")"
}
apply() {  # $1 = list of changed paths to take from CHILD (A/M checked out, D removed)
  awk -F'\t' 'NR==FNR{want[$1]=1; next} ($2 in want) && $1!="D"{print $2}' "$1" "$OUT/changes.tsv" > "$OUT/take.am"
  awk -F'\t' 'NR==FNR{want[$1]=1; next} ($2 in want) && $1=="D"{print $2}' "$1" "$OUT/changes.tsv" > "$OUT/take.d"
  cd "$ISO" || exit 2
  [ -s "$OUT/take.am" ] && git checkout -q "$CHILD" --pathspec-from-file="$OUT/take.am"
  [ -s "$OUT/take.d" ] && git rm -q --pathspec-from-file="$OUT/take.d"
  git add -A -- . ':!node_modules'
  git -c user.name=oopTester-seed -c user.email=seed@local commit -qm "LOCAL STATE $2 (never pushed)"
  echo "$2 head=$(git rev-parse --short=9 HEAD) took A/M=$(wc -l < "$OUT/take.am") D=$(wc -l < "$OUT/take.d") vsChild=$(git diff --name-only "$CHILD" HEAD | wc -l) vsParent=$(git diff --name-only "$PARENT" HEAD | wc -l) dirty=$(git status --porcelain | wc -l)"
}
case "$1" in
  SPLIT) split ;;
  RULEONLY)   bash "$HELD/run.sh" STATE "$PARENT" >/dev/null && apply "$OUT/rule.list" RULE-ONLY ;;
  OUTPUTONLY) bash "$HELD/run.sh" STATE "$PARENT" >/dev/null && apply "$OUT/output.list" OUTPUT-ONLY ;;
  *) echo "usage: states.sh SPLIT | RULEONLY | OUTPUTONLY"; exit 1 ;;
esac

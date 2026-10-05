#!/usr/bin/env bash
# oopTester I5 / G7 — generate is ATOMIC: a generate that refuses leaves the tree UNTOUCHED (never half-moved).
# Supersedes oopTester-I6-g7-preflight.sh for I5 (its seeds inject `kind: 'packagedIn'`, removed in I4c = a confound now).
# Seeds are I4c-era invalid namespaces, each a TEMP COMMIT on a fresh throwaway clone at <sha>:
#   EMPTY — ObjectKey namespace ''                                    (I4c: never empty)
#   MIXED — RepositoryId namespace 'Web4MDA' (a VALID move to the root) + ObjectKey namespace ''   -> RepositoryId must NOT relocate
#   CYCLE — RepositoryId namespace 'Web4MDA.Ior.ObjectKey' + ObjectKey namespace 'Web4MDA.Ior.RepositoryId' (mutual containment)
# Each case: generate rc != 0 AND `git status --porcelain -- EAMD.ucp` == 0 (nothing written/moved) -> GREEN; the refusal message is printed.
# A seed generate ACCEPTS (rc 0) is reported ACCEPTED with its diff — never silently counted.
# Usage: oopTester-I5-g7.sh <Web4MDA source repo> <sha>     exit 0 GREEN / 1 RED / 2 CONFOUND
set -uo pipefail
src="${1:?repo}"; sha="${2:?sha}"
work=/root/.claude/jobs/914c8cad/tmp/g7-i5; nm=/var/dev/Workspaces/web4x/Web4MDA/node_modules
W=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA
rm -f "$work/node_modules"; rm -rf "$work"
git clone -q --no-hardlinks "$src" "$work" && cd "$work" && git checkout -q --detach "$sha" && ln -s "$nm" node_modules || { echo "CONFOUND: clone"; exit 2; }
printf 'node_modules\n' >> .git/info/exclude
export PATH=/opt/node22/bin:$PATH
RID=$W/Ior/RepositoryId/latest/model/RepositoryIdDefinition.ts
OK=$W/Ior/ObjectKey/latest/model/ObjectKeyDefinition.ts
reset() { git reset -q --hard "$sha" && git clean -fdq -- EAMD.ucp; }
setns() { sed -i "0,/^      namespace: '[^']*',$/s//      namespace: '$2',/" "$1"; }
fail=0
case_() { # $1 label
  git commit -qam "G7 SEED $1 (throwaway)" || { echo "$1: CONFOUND seed did not apply"; fail=1; return; }
  timeout 900 npm start > "../g7-i5-$1.log" 2>&1; local rc=$?
  local n; n=$(git status --porcelain -- EAMD.ucp | wc -l)
  local msg; msg=$(grep -m1 -E '^(Error|.*Error:)' "../g7-i5-$1.log" | sed 's/^.*Error: //' | cut -c1-150)
  if [ "$1" = CYCLE ] && ! grep -qi 'cycle' "../g7-i5-$1.log"; then echo "$1: RED — refused (rc $rc, tree $n) but NOT by a named cycle guard (I5c addendum 25cf0ffc) — $msg"; fail=1
  elif [ "$rc" -ne 0 ] && [ "$n" -eq 0 ]; then echo "$1: GREEN — refused (rc $rc), tree untouched (0) — $msg"
  elif [ "$rc" -ne 0 ]; then echo "$1: RED — refused (rc $rc) but HALF-WRITTEN: $n entries — $msg"; fail=1
  else echo "$1: ACCEPTED — generate rc 0, diff $n (the seed is NOT refused: classify)"; fail=1; fi
}
reset; setns "$OK" ""; case_ EMPTY
reset; setns "$RID" "Web4MDA"; setns "$OK" ""; case_ MIXED
reset; setns "$RID" "Web4MDA.Ior.ObjectKey"; setns "$OK" "Web4MDA.Ior.RepositoryId"; case_ CYCLE
cd / && rm -f "$work/node_modules" && rm -rf "$work"
[ $fail -eq 0 ] && { echo "G7 GREEN"; exit 0; } || { echo "G7 RED/ACCEPTED — see lines"; exit 1; }

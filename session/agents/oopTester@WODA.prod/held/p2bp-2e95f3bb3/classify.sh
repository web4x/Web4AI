#!/usr/bin/env bash
# oopTester P2b' atomicity: cross the parent..child change list with the generator's OWN fs-mutation log(s).
# usage: classify.sh <parent> <child> <fsw.log> [<fsw.log> ...]   → per-bucket counts: in-log / not-in-log
REPO=/var/dev/Workspaces/web4x/Web4MDA
OUT=$REPO/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p2bp
P=$1; C=$2; shift 2
cut -f2 "$@" | sort -u > "$OUT/logged.paths"
( cd "$REPO" && git diff --no-renames --name-status "$P" "$C" ) > "$OUT/changes.tsv"
awk -F'\t' -v L="$OUT/logged.paths" '
  BEGIN { while ((getline l < L) > 0) seen[l]=1 }
  {
    s=$1; p=$2; q=p
    sub(/^EAMD\.ucp\/Components\/com\/ceruleanCircle\/Web4MDA\//, "C/", q)
    if (q ~ /\/latest\/src\//) k="src"; else if (q ~ /\/latest\/test\//) k="test"; else if (q ~ /\/latest\/model\//) k="model"
    else if (p ~ /^EAMD\.ucp\/Scenario\/type\//) k="Scenario/type"; else if (p ~ /^EAMD\.ucp\/Scenario\/Index\//) k="Scenario/Index"
    else { split(q,a,"/"); k=a[1] }
    w = (p in seen) ? "LOGGED" : "unlogged"
    n[s" "k" "w]++
    print w "\t" s "\t" p > "'"$OUT"'/classified.tsv"
  }
  END { for (x in n) print n[x], x }' "$OUT/changes.tsv" | sort -k3,3 -k2,2 -k4,4

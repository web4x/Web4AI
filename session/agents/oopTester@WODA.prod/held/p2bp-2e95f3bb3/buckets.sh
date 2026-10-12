#!/usr/bin/env bash
# READ-ONLY (oopTester, P2b' atomicity): bucket the parent..child changes by area + status. Git objects of the shared checkout only.
REPO=/var/dev/Workspaces/web4x/Web4MDA
PARENT=${1:-985e23841}
CHILD=${2:-2e95f3bb3}
cd "$REPO" || exit 2
git diff --no-renames --name-status "$PARENT" "$CHILD" | awk '{
  s=$1; p=$2
  sub(/^EAMD\.ucp\/Components\/com\/ceruleanCircle\/Web4MDA\//, "C/", p)
  if (p ~ /\/latest\/src\//) k="src"
  else if (p ~ /\/latest\/test\//) k="test"
  else if (p ~ /\/latest\/model\//) k="model"
  else if (p ~ /^EAMD\.ucp\/Scenario\/type\//) k="Scenario/type"
  else if (p ~ /^EAMD\.ucp\/Scenario\/Index\//) k="Scenario/Index"
  else { n=split(p,a,"/"); k=a[1] }
  print s, k
}' | sort | uniq -c | sort -rn

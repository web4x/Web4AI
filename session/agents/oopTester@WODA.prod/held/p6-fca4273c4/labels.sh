#!/usr/bin/env bash
# Naming law: find each gate by its AC LABEL in the TESTS at the audit sha (read-only git).
cd /var/dev/Workspaces/web4x/Web4MDA || exit 2
S=fca4273c4
for L in P2-ROOT P2-LIT "P2 " "P3 " "P4 " "P5 " OneRootNamespace "move()" "chained move" "second binder" "no binder" "model-typed" "legacy" "interim root" "domain" "S1 " "S2 " "S3 " "S4 " GarbageSweep "CHAIN SPEED" F5 IOR1 IOR2 IOR3 IOR4 IOR5 IOR6 IOR7 R1 R2 R3 R4 R5 R6 R7 N1 "plan-citation" "spec/plans"; do
  files=$(git grep -lF -- "$L" "$S" -- '*.test.ts' 2>/dev/null | sed "s|^$S:||; s|.*/||" | sort -u | tr '\n' ' ')
  n=$(echo "$files" | wc -w)
  printf '%-16s %3s  %s\n' "[$L]" "$n" "$(echo "$files" | cut -c1-150)"
done

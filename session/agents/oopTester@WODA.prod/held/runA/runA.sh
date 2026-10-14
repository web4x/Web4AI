#!/bin/bash
# RUN A driver (oopTester 10-14). Isolated clone of 82e58f47b under the fixed scratch name.
set -u
R=/var/dev/Workspaces/web4x/Web4MDA
G=$R/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
W=$G/oopTester-runA; O=$G/oopTester-runA-out; mkdir -p $O
export PATH=/opt/node22/bin:$PATH
H=/var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/runA
comp() { echo "$W"; }  # repo ROOT (u4 convention; component dir = instrument error 10-14)
case "$1" in
CLONE) [ -e $W ] && { echo "CLONE refuse: exists"; exit 1; }
  git clone -q --no-hardlinks $R $W && git -C $W checkout -q --detach 82e58f47b
  echo "CLONE head=$(git -C $W rev-parse --short HEAD) porcelain=$(git -C $W status --porcelain|wc -l)" >> $O/sum ;;
CI) cd "$(comp)" && env -u CLAUDECODE -u TMPDIR npm ci >$O/ci.out 2>&1; echo "CI rc=$?" >> $O/sum ;;
TSC) cd "$(comp)" && env -u CLAUDECODE -u TMPDIR npx tsc -p tsconfig.json --noEmit >$O/tsc-$2.out 2>&1; echo "TSC[$2] rc=$? errors=$(grep -c 'error TS' $O/tsc-$2.out)" >> $O/sum ;;
FILES) L=$2; shift 2; cd "$(comp)" && env -u CLAUDECODE -u TMPDIR npx vitest run "$@" >$O/$L.out 2>&1; rc=$?
  echo "TEST[$L] rc=$rc $(sed 's/\x1b\[[0-9;]*m//g' $O/$L.out | grep -E '^ +(Test Files|Tests) ' | tr -s ' ' | tr '\n' ' ')" >> $O/sum
  sed 's/\x1b\[[0-9;]*m//g' $O/$L.out | grep -E '^ *(FAIL|×) ' | sort -u | head -20 >> $O/sum ;;
esac

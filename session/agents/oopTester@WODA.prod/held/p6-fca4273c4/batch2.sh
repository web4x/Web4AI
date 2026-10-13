#!/usr/bin/env bash
B=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/out/batch2.out; : > $B
for m in FSCALLERNJ XPKG2 R1STALE DERIV FSCALLER2 DRIFT; do echo "=== MODE $m $(date +%T) quiet=$(ps -eo args | grep -E "^[^ ]*node[^ ]* .*vitest" | grep -v grep | wc -l)" >> $B; bash /var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/p6-fca4273c4/g.sh $m >> $B 2>&1; done
echo "BATCH2 DONE $(date +%T)" >> $B

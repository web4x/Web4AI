#!/usr/bin/env bash
# S4b FIX re-gate @0277202a (oopTester, plan approved by oopPO). Sequential; one harness launch at a time.
D=/var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/s4b-fix-0277202a
G=/var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/s4b-f707537f/g.sh
SP=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-s4b
for i in 1 2 3 4 5; do
  SHA=0277202a bash "$G" BASE > "$D/BASE-$i.out" 2>&1
  sed "s/\x1b\[[0-9;]*m//g" "$SP/BASE.log" | grep -aoiE "(ratio|store/ref)[^|]{0,140}" | head -6 | sed "s/^/[BASE-$i ratio] /" >> "$D/BASE-$i.out"
  echo "BASE-$i done $(date +%T)"
done
for m in FSLINK FSLINKPLAIN ROGUE RATIOPUT3; do SHA=0277202a bash "$G" $m > "$D/$m.out" 2>&1; echo "$m done $(date +%T)"; done
echo ALLDONE

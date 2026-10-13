#!/usr/bin/env bash
# P6 FINAL cold verdict driver — ONE sha = the landed head. Sequential; waits for a QUIET box before every arm.
export SHA=1488dbdf7
H=/var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/p6-fca4273c4
P6=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6
O=$P6/out; F=$O/final.out; : > "$F"
nq() { ps -eo args | grep -E '^[^ ]*node[^ ]* .*vitest' | grep -v grep | wc -l; }
waitq() { local w=0; while [ "$(nq)" != "0" ] && [ $w -lt 1800 ]; do sleep 10; w=$((w+10)); done; echo "quietWait=${w}s nodeVitest=$(nq)"; }
echo "FINAL START $(date +%T) SHA=$SHA" >> "$F"
for c in c3 c4; do
  echo "=== A1 $c $(date +%T) $(waitq)" >> "$F"
  bash "$H/p6.sh" A1 "$c"; cat "$O/A1-$c.summary" >> "$F"
done
git -C "$P6/c2" fetch -q git@github.com:web4x/Web4MDA.git main >> "$F" 2>&1
echo "c2 FETCH_HEAD=$(git -C "$P6/c2" rev-parse --short=9 FETCH_HEAD)" >> "$F"
for m in BASE N1REVERT FSCALLERNJ FSLINK FSLINKPLAIN R7BODY DUPSRC ROGUE DUPFOLDER R1STALE DERIV XPKG2 P2LITSEED DOMAIN DYNALIAS FSLINKALL FSCALLER2ALL ROGUEALL DRIFT RATIOFIX RATIOPUT3; do
  echo "=== MODE $m $(date +%T) $(waitq)" >> "$F"
  bash "$H/g.sh" "$m" >> "$F" 2>&1
done
echo "FINAL DONE $(date +%T)" >> "$F"

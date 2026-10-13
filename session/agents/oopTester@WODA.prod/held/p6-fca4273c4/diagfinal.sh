#!/usr/bin/env bash
# Read-only: confirm by-name evidence for the final verdict from logs.
O=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/out
x() { sed 's/\x1b\[[0-9;]*m//g' "$O/$1.log" 2>/dev/null; }
echo "## driver end:"; grep -aE "RATIOPUT3-5\] (rc=|RATIO REPORT)|FINAL DONE" "$O/final.out" | cut -c1-140
echo "## DUPSRC:"; x DUPSRC | grep -aoE "two model sources define '[A-Za-z]+'" | sort -u
echo "## ROGUE:"; x ROGUE | grep -aoE "Web4MDA/ScenarioIndex/latest/model/Rogue" | sort -u
echo "## P2LITSEED:"; x P2LITSEED | grep -aoE "M1Layout\.ts:[0-9]+ '[^']*'" | sort -u
echo "## DOMAIN src after regenerate (seed clone state is reset — read the start log):"; grep -aiE "error|domain|wrote|changed" "$O/DOMAIN.start.log" | cut -c1-160 | head -5
echo "## DRIFT names:"; x DRIFT | grep -aoE "(dangling|misnamed|multiLinked|ghosts)[^,]{0,80}" | sort -u | head -4

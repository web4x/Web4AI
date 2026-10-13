#!/usr/bin/env bash
# Diagnose batch-1 anomalies from logs only (no runs).
O=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/oopTester-p6/out
x() { sed 's/\x1b\[[0-9;]*m//g' "$O/$1.log" 2>/dev/null; }
B=$O/batch1.out
echo "## FSCALLER2 block in batch1.out"; awk '/=== MODE FSCALLER2/,/=== MODE FSLINK /' "$B" | sed 's/\x1b\[[0-9;]*m//g' | cut -c1-200 | head -12
echo "## DUPSRC block + log head"; awk '/=== MODE DUPSRC/,/=== MODE ROGUE/' "$B" | grep -a "DUPSRC" | cut -c1-200 | head -4
x DUPSRC | grep -aE "Error|error|FAIL|No test|Cannot|duplicate" | cut -c1-220 | head -8
echo "## ROGUE failure message"; x ROGUE | grep -aE "AssertionError|Expected|Received|Rogue|expected" | cut -c1-220 | head -10
echo "## DUPFOLDER failure message"; x DUPFOLDER | grep -aE "AssertionError|Expected|Received|MOF/Web4MDA|expected" | cut -c1-220 | head -8

#!/usr/bin/env bash
# oopTester P2b' instrument runner — seediso ONLY (never the shared tree). ONE launch at a time.
# usage: run.sh STATE <sha> | START <label> | TEST <label>
REPO=/var/dev/Workspaces/web4x/Web4MDA
GEN=$REPO/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
ISO=$GEN/seediso
OUT=$GEN/oopTester-p2bp
HELD=/var/dev/Workspaces/AI/Claude/session/agents/oopTester@WODA.prod/held/p2bp-2e95f3bb3
export PATH=/opt/node22/bin:$PATH
mkdir -p "$OUT"
cd "$ISO" || exit 2
quiet() { local n; n=$(pgrep -f 'vitest' | grep -v "^$$\$" | wc -l); [ "$n" = "0" ] || { echo "NOT QUIET: $n vitest process(es) running — refusing"; exit 3; }; }
case "$1" in
  STATE)
    git checkout -q -f --detach "$2" && git reset -q --hard "$2" && git clean -qfd -e node_modules
    echo "STATE head=$(git rev-parse --short=9 HEAD) tree=$(git rev-parse --short=9 'HEAD^{tree}') dirty=$(git status --porcelain | wc -l)" ;;
  START)
    quiet; L="$OUT/$2.fsw.log"; : > "$L"
    FSW_LOG="$L" FSW_ROOT="$ISO" NODE_OPTIONS="--import file://$HELD/fswatch.mjs" npm start > "$OUT/$2.start.out" 2>&1; rc=$?
    echo "START $2 rc=$rc porcelain=$(git status --porcelain | wc -l) ops: $(cut -f1 "$L" | sort | uniq -c | tr '\n' ' ') distinctPaths=$(cut -f2 "$L" | sort -u | wc -l)" ;;
  TEST)
    quiet; O="$OUT/$2.test.out"
    npm test > "$O" 2>&1; rc=$?
    sed 's/\x1b\[[0-9;]*m//g' "$O" | grep -E '^ +(✓|×|FAIL) ' > /dev/null
    sed 's/\x1b\[[0-9;]*m//g' "$O" | grep -E '^ FAIL ' | sed -E 's/ +[0-9]+ms$//' | sort -u > "$OUT/$2.fail.txt"
    echo "TEST $2 rc=$rc $(sed 's/\x1b\[[0-9;]*m//g' "$O" | grep -E 'Test Files |Tests ' | tr -s ' ' | tr '\n' ' ') failLines=$(wc -l < "$OUT/$2.fail.txt") porcelain=$(git status --porcelain | wc -l)" ;;
  *) echo "usage: run.sh STATE <sha> | START <label> | TEST <label>"; exit 1 ;;
esac

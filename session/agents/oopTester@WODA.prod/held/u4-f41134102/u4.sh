#!/usr/bin/env bash
# oopTester U4 END AUDIT instrument — isolated real clones ONLY (never the shared tree). ONE launch at a time.
# usage: p6.sh CLONE <c> | CI <c> | STATE <c> | TEST <c> <label> | START <c> <label> | FILE <c> <label> <test-file> | A1 <c> | WAITQ
# <c> = clone name under $P6 (c1, c2, seed). SHA is fixed: the audit sha.
SHA=${SHA:-f41134102}
REPO=/var/dev/Workspaces/web4x/Web4MDA
GEN=$REPO/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
P6=$GEN/oopTester-u4
OUT=$P6/out
# Customer default env: default PATH with the project runtime (Node 22) first; no Claude Code env, no inherited TMPDIR.
RUN() { env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH "$@"; }
mkdir -p "$OUT"
# ONLY real node vitest processes count (wrapper shells whose args merely contain the word do not).
nq() { ps -eo args | grep -E '^[^ ]*node[^ ]* .*vitest' | grep -v grep | wc -l; }
quiet() { local n; n=$(nq); [ "$n" = "0" ] || { echo "NOT QUIET: $n node vitest process(es) running — refusing"; exit 3; }; }
counts() { sed 's/\x1b\[[0-9;]*m//g' "$1" | grep -E '^ +(Test Files|Tests) ' | tr -s ' ' | tr '\n' ' '; }
C=$P6/$2
case "$1" in
  CLONE)
    [ -e "$C" ] && { echo "CLONE $2 refused: exists"; exit 4; }
    git clone -q git@github.com:web4x/Web4MDA.git "$C" && git -C "$C" checkout -q --detach "$SHA" || exit 5
    echo "CLONE $2 head=$(git -C "$C" rev-parse --short=9 HEAD) tree=$(git -C "$C" rev-parse --short=9 'HEAD^{tree}') porcelain=$(git -C "$C" status --porcelain | wc -l) nm=$( [ -e "$C/node_modules" ] && echo PRESENT || echo absent)" ;;
  CI)
    cd "$C" || exit 2
    [ -L node_modules ] && { echo "CI $2 refused: node_modules is a SYMLINK"; exit 6; }
    RUN npm ci --no-audit --no-fund --cache "$GEN/tmp/npm-cache" --prefer-offline > "$OUT/$2.ci.out" 2>&1; rc=$?
    echo "CI $2 rc=$rc nm=$( [ -L node_modules ] && echo SYMLINK || ([ -d node_modules ] && echo real-dir || echo absent)) pkgs=$(ls node_modules 2>/dev/null | wc -l) porcelain=$(git status --porcelain | wc -l)" ;;
  STATE)
    cd "$C" || exit 2
    echo "STATE $2 head=$(git rev-parse --short=9 HEAD) tree=$(git rev-parse --short=9 'HEAD^{tree}') porcelain=$(git status --porcelain | wc -l)" ;;
  TEST)
    cd "$C" || exit 2; quiet; O="$OUT/$3.test.out"
    RUN npm test > "$O" 2>&1; rc=$?
    sed 's/\x1b\[[0-9;]*m//g' "$O" | grep -E '^ FAIL ' | sed -E 's/ +[0-9]+ms$//' | sort -u > "$OUT/$3.fail.txt"
    git status --porcelain > "$OUT/$3.porcelain.txt"
    echo "TEST $3 rc=$rc $(counts "$O") failLines=$(wc -l < "$OUT/$3.fail.txt") timeouts=$(grep -c 'timed out' "$O") porcelain=$(wc -l < "$OUT/$3.porcelain.txt") quietAfter=$(nq)" ;;
  START)
    cd "$C" || exit 2; quiet; O="$OUT/$3.start.out"
    RUN npm start > "$O" 2>&1; rc=$?
    git status --porcelain > "$OUT/$3.start.porcelain.txt"
    echo "START $3 rc=$rc porcelain=$(wc -l < "$OUT/$3.start.porcelain.txt")" ;;
  FILE)
    cd "$C" || exit 2; quiet; O="$OUT/$3.file.out"
    RUN npx vitest run "$4" > "$O" 2>&1; rc=$?
    echo "FILE $3 rc=$rc $(counts "$O") timeouts=$(grep -c 'timed out' "$O")"
    sed 's/\x1b\[[0-9;]*m//g' "$O" | grep -E '^ +× ' | cut -c1-200 ;;
  A1)
    # one full cold arm in clone <c>: clone -> real npm ci -> whole suite -> 2nd generate (npm start) porcelain
    S="$OUT/A1-$2.summary"; : > "$S"
    bash "$0" CLONE "$2" >> "$S" 2>&1 && bash "$0" CI "$2" >> "$S" 2>&1 && bash "$0" TEST "$2" "A1-$2" >> "$S" 2>&1 && bash "$0" START "$2" "A1-$2" >> "$S" 2>&1
    echo "A1 $2 DONE rc=$?" >> "$S" ;;
  WAITQ) echo "nodeVitest=$(nq)" ;;
  *) echo "usage: see header"; exit 1 ;;
esac

#!/usr/bin/env bash
# oopTester U4 — CHAIN SPEED GUARD "46832 ms" (C.4 arm i) investigation, oopPO order 10-14.
# ONE cold GitHub clone c5 of f41134102, chain ALONE, two independent instruments:
#   T  = bash `time` user+sys (CPU-s incl. waited children) of a bare `npm start`   (guard comment: 10.6-11.1 historically)
#   G  = the guard's OWN instrument: Pipeline.test.ts filtered to the CHAIN SPEED GUARD test only (green = best reading <= 20 CPU-s)
# then the arm-(i) SEED (local commit, never pushed) + T again = does the seed add chain work?  Box load + top CPU before each step.
U=$(cd "$(dirname "$0")" && pwd)/u4.sh
REPO=/var/dev/Workspaces/web4x/Web4MDA
GEN=$REPO/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
P6=$GEN/oopTester-u4; OUT=$P6/out; C=$P6/c5; S=$OUT/C4g.summary
T=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test
RUN() { env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH "$@"; }
box() { echo "BOX $1 load=$(cut -d' ' -f1-3 /proc/loadavg) nproc=$(nproc) top=[$(ps -eo pcpu,comm --sort=-pcpu | sed -n '2,4p' | tr -s ' ' | tr '\n' ';')]" >> "$S"; }
clean() { git -C "$C" reset -q --hard && git -C "$C" clean -qfd; echo "CLEAN porcelain=$(git -C "$C" status --porcelain | wc -l) head=$(git -C "$C" rev-parse --short=9 HEAD)" >> "$S"; }
chain() { box "T-$1"; TIMEFORMAT="T $1 user=%U sys=%S wall=%R"; { time RUN npm start > "$OUT/C4g-T-$1.out" 2>&1; } 2>> "$S"; echo "T $1 rc=$? (npm start)" >> "$S"; clean; }
guard() {
  box "G-$1"
  RUN node_modules/.bin/vitest run "$T/Pipeline.test.ts" -t "CHAIN SPEED GUARD — one real" > "$OUT/C4g-G-$1.out" 2>&1; echo "G $1 rc=$?" >> "$S"
  sed 's/\x1b\[[0-9;]*m//g' "$OUT/C4g-G-$1.out" | grep -aE '^ +(Test Files|Tests) |CHAIN SPEED:|CHAIN_CPU|best of' | tr -s ' ' | cut -c1-240 >> "$S"
  clean
}
: > "$S"; echo "C4g start $(date -Is)" >> "$S"
bash "$U" CLONE c5 >> "$S" 2>&1 || { echo "STOP clone" >> "$S"; exit 4; }
bash "$U" CI c5 >> "$S" 2>&1 || { echo "STOP ci" >> "$S"; exit 5; }
cd "$C" || exit 2
chain clean
guard clean
cat > "$T/ZzOopTesterTouchSeed.test.ts" <<'X'
import { readFileSync, writeFileSync } from 'node:fs';
import { it } from 'vitest';
// oopTester U4 C.4 arm (i) SEED, as committed in arm (i): rewrite a tracked file content-identically
it('C4-i rewrites README.md content-identically', () => {
  writeFileSync('README.md', readFileSync('README.md'));
});
X
git add "$T/ZzOopTesterTouchSeed.test.ts" && git -c user.name=oopTester -c user.email=oopTester@local commit -q -m "oopTester C4g arm-i SEED (scratch, never pushed)"
echo "SEEDED head=$(git rev-parse --short=9 HEAD)" >> "$S"
chain seeded
git reset -q --hard f41134102; echo "RESET c5 head=$(git rev-parse --short=9 HEAD) porcelain=$(git status --porcelain | wc -l)" >> "$S"
box end; echo "C4g end $(date -Is)" >> "$S"

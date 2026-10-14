#!/usr/bin/env bash
# oopTester U4 C.4 — SuiteTreeTouchProbe, one seeded arm per RED channel, in scratch clone c2 ONLY (local commits, never pushed).
# usage: c4.sh i | ii | iii    (i = content-identical rewrite -> touched; ii = failing test + >1 MiB tracked list -> failed + maxBuffer; iii = globalSetup teardown throw -> exit)
SHA=f41134102
GEN=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
C=$GEN/oopTester-u4/c2; OUT=$GEN/oopTester-u4/out; T=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test
RUN() { env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH "$@"; }
cd "$C" || exit 2
[ "$(ps -eo args | grep -E '^[^ ]*node[^ ]* .*vitest' | grep -v grep | wc -l)" = "0" ] || { echo "NOT QUIET — refusing"; exit 3; }
git reset -q --hard "$SHA" || exit 4
case "$1" in
  i)  cat > $T/ZzOopTesterTouchSeed.test.ts <<'T'
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { expect, it } from 'vitest';
// oopTester U4 C.4 arm (i): rewrite a tracked file CONTENT-IDENTICALLY; git must still call the tree clean
it('C4-i rewrites README.md content-identically', () => {
  const before = readFileSync('README.md');
  writeFileSync('README.md', before);
  const dirty = execFileSync('git', ['status', '--porcelain', '--', 'README.md'], { encoding: 'utf8' });
  console.log(`C4-i gitStatusREADME=[${dirty.trim()}]`);
  expect(dirty).toBe('');
});
T
      git add $T/ZzOopTesterTouchSeed.test.ts ;;
  ii) cat > $T/ZzOopTesterFailSeed.test.ts <<'T'
import { expect, it } from 'vitest';
// oopTester U4 C.4 arm (ii): one deliberately failing test
it('C4-ii seeded failure', () => {
  expect(1).toBe(2);
});
T
      mkdir -p zz-oopTester-maxbuffer; p=$(printf 'x%.0s' $(seq 1 230))
      for n in $(seq 1 800); do printf '' > "zz-oopTester-maxbuffer/${n}-$p"; done
      git add $T/ZzOopTesterFailSeed.test.ts zz-oopTester-maxbuffer ;;
  iii) cat > $T/ZzOopTesterThrowSetup.ts <<'T'
// oopTester U4 C.4 arm (iii): a globalSetup whose TEARDOWN throws — counts stay green, only the exit code carries it
export default function setup(): () => void {
  return () => {
    throw new Error('oopTester seeded globalSetup teardown throw');
  };
}
T
      sed -i "s#globalSetup: \['#globalSetup: ['$T/ZzOopTesterThrowSetup.ts', '#" vitest.config.ts
      grep -c ZzOopTesterThrowSetup vitest.config.ts >/dev/null || { echo "seed iii NOT applied"; exit 5; }
      git add $T/ZzOopTesterThrowSetup.ts vitest.config.ts ;;
  *) echo "usage: c4.sh i|ii|iii"; exit 1 ;;
esac
git -c user.name=oopTester -c user.email=oopTester@local commit -q -m "oopTester U4 C.4 arm $1 SEED (scratch, never pushed)" || exit 6
echo "SEEDED arm $1 head=$(git rev-parse --short=9 HEAD) lsfilesBytes=$(git ls-files -z | wc -c) tracked=$(git ls-files | wc -l)"
O="$OUT/C4-$1.probe.out"
RUN node --import tsx $T/gates/SuiteTreeTouchProbe.ts "$C" 1 > "$O" 2>&1; rc=$?
echo "PROBE arm $1 rc=$rc"
grep -aE '^SuiteTreeTouchProbe|^  run |^    RED |C4-i gitStatus' "$O" | sed 's/\x1b\[[0-9;]*m//g' | cut -c1-260 | head -12
grep -aE '^    OUT ' "$O" | grep -iE 'oopTester|throw|Error' | cut -c1-200 | head -4
git reset -q --hard "$SHA"; echo "RESET c2 head=$(git rev-parse --short=9 HEAD) porcelain=$(git status --porcelain | wc -l)"

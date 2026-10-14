#!/usr/bin/env bash
# oopTester U4 C.4 RERUN driver (10-14, seed fix) — arms ii, iii in scratch clone c2 ONLY (local commits, never pushed).
# Seed fix vs c4.sh (arm-i confounds): NO new central test file (any central test with <=2 attributed assertions reads as
# 'test-support' in TestPlacement and changes the derived set, whatever its NAME) and NO node:child_process anywhere.
#   ii  = one failing `it` APPENDED to an existing COMPONENT-folder test (M3Class.test.ts) + 800 long-named tracked files (> 1 MiB list)
#   iii = a throw appended to the END of TrackedTree's existing teardown (its own two RED checks still run first); no new file, no config edit
#   i   = (CLEAN rerun, 10-14) one PASSING `it` APPENDED to M3Class.test.ts: content-identical README.md rewrite; no git, no child_process, no new file -> only effect = the touch
# usage: c4b.sh i | ii | iii | iii-iso
SHA=f41134102
GEN=/var/dev/Workspaces/web4x/Web4MDA/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen
C=$GEN/oopTester-u4/c2; OUT=$GEN/oopTester-u4/out; P=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA; T=$P/latest/test
RUN() { env -u CLAUDECODE -u TMPDIR PATH=/opt/node22/bin:$PATH "$@"; }
cd "$C" || exit 2
[ "$(ps -eo args | grep -E '^[^ ]*node[^ ]* .*vitest' | grep -v grep | wc -l)" = "0" ] || { echo "NOT QUIET — refusing"; exit 3; }
git reset -q --hard "$SHA" || exit 4
git clean -qfd >/dev/null 2>&1
case "$1" in
  i)  F=$P/MOF/M3/M3Class/latest/test/M3Class.test.ts
      grep -q "^import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';" "$F" || { echo "seed i: node:fs import not found"; exit 5; }
      printf "\nit('C4-i oopTester content-identical rewrite of README.md', () => {\n  const before = readFileSync('README.md');\n  writeFileSync('README.md', before);\n  expect(readFileSync('README.md').equals(before)).toBe(true);\n});\n" >> "$F"
      grep -c "C4-i oopTester content-identical rewrite" "$F" | grep -qx 1 || { echo "seed i NOT applied exactly once"; exit 5; }
      git add "$F" ;;
  ii) F=$P/MOF/M3/M3Class/latest/test/M3Class.test.ts
      grep -q "^import { describe, expect, it } from 'vitest';" "$F" || { echo "seed ii: vitest import not found"; exit 5; }
      printf "\nit('C4-ii oopTester seeded failure', () => {\n  expect(1).toBe(2);\n});\n" >> "$F"
      mkdir -p zz-oopTester-maxbuffer; p=$(printf 'x%.0s' $(seq 1 230))
      for n in $(seq 1 800); do printf '' > "zz-oopTester-maxbuffer/${n}-$p"; done
      git add "$F" zz-oopTester-maxbuffer ;;
  iii) F=$T/TrackedTree.ts
      sed -i "/AC19c: git status changed during the suite/a\\      throw new Error('oopTester seeded globalSetup teardown throw');" "$F"
      grep -c "oopTester seeded globalSetup teardown throw" "$F" | grep -qx 1 || { echo "seed iii NOT applied exactly once"; exit 5; }
      git add "$F" ;;
  iii-iso) R=oopTesterTeardown.ts
      # ISOLATED iii (oopPO/SM 10-14): the ONLY effect is a globalSetup TEARDOWN throw. NOT in a test folder (no declared-machinery
      # SHA drift, nothing undeclared), NOT under EAMD.ucp/ or scripts/ (no layout/style/bootstrap scan), FIRST in globalSetup so it
      # sees WEB4MDA_RUN before Scratch sets it: throws ONLY in the outermost run; child vitest runs inherit WEB4MDA_RUN -> silent.
      [ ! -e "$R" ] || { echo "seed iii-iso: $R already exists"; exit 5; }
      cat > "$R" <<'TS'
/** oopTester C.4 iii-iso seed (scratch clone c2 only, never pushed): its ONLY effect is a globalSetup TEARDOWN throw in the OUTERMOST run. */
export class OopTesterTeardown {
  constructor() {}

  /** vitest globalSetup: decide at setup (before Scratch marks the run) whether this is the outermost run; its teardown throws only there. */
  static guard(): () => void {
    const outermost = process.env['WEB4MDA_RUN'] === undefined;
    return () => {
      if (outermost) throw new Error('oopTester seeded globalSetup teardown throw (iii-iso)');
    };
  }
}

export default OopTesterTeardown.guard;
TS
      grep -q "globalSetup: \['EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/TrackedTree.ts'" vitest.config.ts || { echo "seed iii-iso: globalSetup anchor not found"; exit 5; }
      sed -i "s|globalSetup: \['EAMD|globalSetup: ['oopTesterTeardown.ts', 'EAMD|" vitest.config.ts
      grep -c "'oopTesterTeardown.ts'" vitest.config.ts | grep -qx 1 || { echo "seed iii-iso NOT applied exactly once"; exit 5; }
      git add "$R" vitest.config.ts ;;
  *) echo "usage: c4b.sh i|ii|iii|iii-iso"; exit 1 ;;
esac
git -c user.name=oopTester -c user.email=oopTester@local commit -q -m "oopTester U4 C.4 rerun arm $1 SEED (scratch, never pushed)" || exit 6
echo "SEEDED arm $1 head=$(git rev-parse --short=9 HEAD) lsfilesBytes=$(git ls-files -z | wc -c) tracked=$(git ls-files | wc -l)"
O="$OUT/C4b-$1.probe.out"
RUN node --import tsx $T/gates/SuiteTreeTouchProbe.ts "$C" 1 > "$O" 2>&1; rc=$?
echo "PROBE arm $1 rc=$rc"
grep -aE '^SuiteTreeTouchProbe|^  run |^    RED ' "$O" | sed 's/\x1b\[[0-9;]*m//g' | cut -c1-260 | head -14
grep -aE '^    OUT ' "$O" | grep -iE 'oopTester|throw|Error' | cut -c1-200 | head -4
git reset -q --hard "$SHA"; git clean -qfd >/dev/null 2>&1
echo "RESET c2 head=$(git rev-parse --short=9 HEAD) porcelain=$(git status --porcelain | wc -l)"

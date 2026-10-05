#!/usr/bin/env bash
# oopTester I5b — MIRROR arm (MirrorDisk.test.ts): clean run + DISCRIMINATION seed (load() ALSO drops the persisted mirror).
# The test clones HEAD into a scratch, so the seed is a TEMP COMMIT on the gate clone, reset afterwards (untracked gates survive).
# --testTimeout=120000 = MEASUREMENT ONLY (item 3 decides budgets); the duration is printed.
# Usage: oopTester-I5b-mirror.sh <gate clone dir> <sha>
set -uo pipefail
cd "${1:?clone}" || exit 2; sha="${2:?sha}"
export PATH=/opt/node22/bin:$PATH
C=EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Catalog/latest
SRC=$C/src/ts/EAM/layer2/M1Catalog.ts
T=$C/test/MirrorDisk.test.ts
run() {
  npx vitest run "$T" --testTimeout=120000 --reporter=json --outputFile=../mirror-run.json > /dev/null 2>&1
  python3 - "$1" <<'PY'
import json, re, sys
d = json.load(open('/root/.claude/jobs/914c8cad/tmp/mirror-run.json'))
print(f"{sys.argv[1]}: pass {d['numPassedTests']} fail {d['numFailedTests']} suitesFailed {d['numFailedTestSuites']}")
for f in d['testResults']:
    if f.get('message'):
        print('   SUITE', re.sub(r'\x1b\[[0-9;]*m', '', f['message']).split('\n')[0][:160])
    for a in f['assertionResults']:
        m = '' if a['status'] != 'failed' else re.sub(r'\x1b\[[0-9;]*m', '', a['failureMessages'][0]).split('\n')[0][:170]
        print(f"   {a['status']:7} {round(a.get('duration') or 0):6}ms  {m}")
PY
}
[ "$(git rev-parse --short HEAD)" = "$sha" ] || { echo "CONFOUND: HEAD is not $sha"; exit 2; }
run "CLEAN ($sha)"
line=$(grep -n '^  static async load(): Promise<void> {$' "$SRC" | cut -d: -f1)
sed -i "${line}a\\    M1Catalog.persisted = new Map(); // SEED: load() also drops the persisted mirror" "$SRC"
sed -n "$((line+1))p" "$SRC"
git commit -qam "MIRROR SEED (throwaway)"
run "SEED drop-mirror"
git reset -q --hard "$sha"
echo "restored: HEAD $(git rev-parse --short HEAD), M1Catalog diff lines $(git diff -- "$SRC" | wc -l)"

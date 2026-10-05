#!/usr/bin/env bash
# oopTester item 3 — the measurement behind ONE timing rule. On a gate clone at <sha>:
#  1. the WHOLE suite as it really runs (solo group + pool, full load) -> every test's in-suite duration (json)
#  2. every FILE holding a test that took > 1250 ms (half the 2500 default) or failed by timeout -> run ALONE 3x -> solo max per test
#  3. table: file :: test | in-suite ms | solo max ms | ratio | its explicit budget (from the json? no: from source, by line)
# Results: <out>/suite.json, <out>/solo-<n>-<file>.json, <out>/timing.tsv. Prints only the summary.
# Usage: oopTester-I5-timing.sh <gate clone dir> <out dir>
set -uo pipefail
clone="${1:?clone}"; out="${2:?out}"; mkdir -p "$out"; cd "$clone" || exit 2
export PATH=/opt/node22/bin:$PATH
npx vitest run --reporter=json --outputFile="$out/suite.json" > "$out/suite.log" 2>&1
python3 - "$out" <<'PY' > "$out/slow-files.txt"
import json, sys, os
out = sys.argv[1]; d = json.load(open(f'{out}/suite.json'))
files = set()
for f in d['testResults']:
    for a in f['assertionResults']:
        if (a.get('duration') or 0) > 1250 or 'timed out' in ' '.join(a.get('failureMessages') or []):
            files.add(os.path.relpath(f['name']))
print('\n'.join(sorted(files)))
PY
n=0
while read -r f; do
  [ -n "$f" ] || continue
  for i in 1 2 3; do npx vitest run "$f" --testTimeout=600000 --reporter=json --outputFile="$out/solo-$i-$(basename "$f").json" > /dev/null 2>&1; done
  n=$((n+1))
done < "$out/slow-files.txt"
python3 - "$out" <<'PY'
import json, sys, os, re, glob
out = sys.argv[1]; d = json.load(open(f'{out}/suite.json'))
suite = {}
for f in d['testResults']:
    for a in f['assertionResults']:
        suite[(os.path.basename(f['name']), a['fullName'])] = (round(a.get('duration') or 0), a['status'], 'timed out' in ' '.join(a.get('failureMessages') or []))
solo = {}
for p in glob.glob(f'{out}/solo-*-*.json'):
    s = json.load(open(p))
    for f in s['testResults']:
        for a in f['assertionResults']:
            k = (os.path.basename(f['name']), a['fullName'])
            solo[k] = max(solo.get(k, 0), round(a.get('duration') or 0))
rows = []
for k, (ms, st, to) in suite.items():
    if ms > 1250 or to:
        s = solo.get(k, 0)
        rows.append((k[0], k[1][:70], ms, s, round(ms / s, 2) if s else 0, 'TIMEOUT' if to else st))
rows.sort(key=lambda r: -r[2])
with open(f'{out}/timing.tsv', 'w') as fh:
    fh.write('file\ttest\tin_suite_ms\tsolo_max_ms\tratio\tstatus\n')
    for r in rows:
        fh.write('\t'.join(map(str, r)) + '\n')
print(f"suite: total {d['numTotalTests']} pass {d['numPassedTests']} fail {d['numFailedTests']} skip {d['numPendingTests']}; slow-or-timed-out tests {len(rows)}")
rat = [r[4] for r in rows if r[4]]
print(f"inflation in-suite/solo: n={len(rat)} max={max(rat) if rat else 0} median={sorted(rat)[len(rat)//2] if rat else 0}")
for r in rows[:30]:
    print(f"  {r[2]:>7}ms suite | {r[3]:>7}ms solo | x{r[4]:<5} | {r[5]:7} | {r[0]} :: {r[1]}")
PY

#!/usr/bin/env python3
"""oopTester I5 / G6 changed-file audit (TH7 lineage): every file changed in <base>..<sha> is a DECLARED consequence, named,
never a wildcard. Classes:
  RENAME-PURE  a relocation (git -M rename) with 0 content change
  RENAME-EDIT  a relocation with content change -> its changed lines must be import/namespace lines (else UNDECLARED, listed)
  DEFINITION   a modified model/*Definition.ts -> changed lines must be `namespace:` lines (else listed)
  HELD/TEST    a modified src/ts or test .ts -> changed lines must be import lines or quoted repository paths (else listed)
  GENERATED    src/{js,thinglish.ts,thinglish.js,puml,svg,mmd,oosh} outputs (regenerated; G1 proves generate reproduces them)
  SPEC/DOC     spec/**, README.md (README checked against the e77b16b2 patch separately)
  OTHER        anything else -> listed
Usage: oopTester-I5-g6-audit.py <repo dir> <base> <sha>     exit 0 if no UNDECLARED/OTHER"""
import re, subprocess, sys

repo, base, sha = sys.argv[1:4]
def git(*a):
    return subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout

GEN = re.compile(r'/src/(js|thinglish|thinglish\.ts|thinglish\.js|puml|svg|mmd|oosh)/')
IMPORT = re.compile(r"^[+-]\s*(import\s|\}\s*from\s'|export\s.*from\s')")
NS = re.compile(r"^[+-]\s+namespace: '")
PATHLIT = re.compile(r"^[+-].*'[^']*(Web4MDA/|\.\./)[^']*'")

def changed_lines(a, b, old, new):
    d = git('diff', '-U0', f'{a}..{b}', '--', old, new) if old != new else git('diff', '-U0', f'{a}..{b}', '--', new)
    return [l for l in d.splitlines() if re.match(r'^[+-][^+-]', l) or re.match(r'^[+-]$', l)]

counts, undeclared, other = {}, [], []
for row in git('diff', '--name-status', '-M', f'{base}..{sha}').splitlines():
    parts = row.split('\t'); st = parts[0]
    old, new = (parts[1], parts[2]) if st.startswith('R') else (parts[1], parts[1])
    if GEN.search(new):
        k = 'GENERATED'
    elif new.startswith('spec/') or new.endswith('README.md'):
        k = 'SPEC/DOC'
    elif st.startswith('R') and st != 'R100':
        k = 'RENAME-EDIT'
        bad = [l for l in changed_lines(base, sha, old, new) if not (IMPORT.match(l) or NS.match(l) or PATHLIT.match(l) or l.strip() in ('+', '-'))]
        if bad:
            undeclared.append(f'{new}: {len(bad)} non-import line(s), first: {bad[0][:110]}')
    elif st == 'R100':
        k = 'RENAME-PURE'
    elif re.search(r'/model/[A-Za-z0-9]+Definition\.ts$', new) and st == 'M':
        k = 'DEFINITION'
        bad = [l for l in changed_lines(base, sha, old, new) if not NS.match(l)]
        if bad:
            undeclared.append(f'{new}: {len(bad)} non-namespace line(s), first: {bad[0][:110]}')
    elif new.endswith('.ts') and st == 'M':
        k = 'HELD/TEST'
        bad = [l for l in changed_lines(base, sha, old, new) if not (IMPORT.match(l) or PATHLIT.match(l) or l.strip() in ('+', '-'))]
        if bad:
            undeclared.append(f'{new}: {len(bad)} non-import line(s), first: {bad[0][:110]}')
    else:
        k = 'OTHER'
        other.append(f'{st} {new}')
    counts[k] = counts.get(k, 0) + 1
print(f'G6 AUDIT {base}..{sha}: ' + ', '.join(f'{k} {v}' for k, v in sorted(counts.items())) + f' | TOTAL {sum(counts.values())}')
short = lambda s: s.replace('EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/', '')
print(f'UNDECLARED content changes: {len(undeclared)}')
for u in undeclared:
    print('   ', short(u))
print(f'OTHER files: {len(other)}')
for o in other:
    print('   ', short(o))
sys.exit(1 if (undeclared or other) else 0)

#!/usr/bin/env python3
"""W5a (plan H5m-2): classify every file in Web4MDA/latest/test as A / B / C with EVIDENCE. Read-only over the repo.
A = subject in Web4MDA's own src · B = whole-tree gate / test infrastructure · C = real subject in ANOTHER component
(= the component whose src the file imports AND uses most). Evidence per file: value imports grouped by owning component
(import path segment between `Web4MDA/` and `/latest/src/`; '' = Web4MDA itself), uses of each imported name in CODE
(import lines, // comments and string literals stripped), and whole-tree signals."""
import os, re, sys, collections
REPO = sys.argv[1]
PKG = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'
TEST = f'{REPO}/{PKG}/latest/test'
IMP = re.compile(r"^import\s+(type\s+)?\{([^}]*)\}\s+from\s+'([^']+)';", re.M)
WHOLE = [  # whole-tree signals (each names its evidence)
    ('scans the tree root (bare EAMD.ucp[/Components] literal)', re.compile(r"['`]EAMD\.ucp(/Components)?/?['`]")),
    ('runs npm start/test', re.compile(r"\[\s*'(start|test)'\s*\]|npm (start|test)")),
    ('repo copy/clone', re.compile(r"new Scratch\(\)\.(copy|repo)|'clone'|git', \['clone")),
    ('walks the repo tree', re.compile(r"new (Tree|Sources|SourceFiles|Factories|Tests?Files?)\(\)\.init\(\s*['`](EAMD\.ucp|\.)")),
]
def component(spec, here):
    p = os.path.normpath(os.path.join(os.path.dirname(here), spec))
    rel = os.path.relpath(p, f'{REPO}/{PKG}')
    if rel.startswith('..'): return None
    m = re.match(r'^(.*?)/?latest/src/', rel)
    if m: return m.group(1)
    return '#test-helper' if '/latest/test/' in '/' + rel + '/' or rel.startswith('latest/test') else '#other:' + rel
def code(text):
    out = []
    for l in text.split('\n'):
        if l.lstrip().startswith('import '): continue
        l = re.sub(r'"(?:[^"\\]|\\.)*"|\'(?:[^\'\\]|\\.)*\'|`(?:[^`\\]|\\.)*`|//.*$', "''", l)
        out.append(l)
    return '\n'.join(out)
# CONTENT REVIEW (oopExpert, header doc + describe title read): where the mechanical import-count and the file's actual
# subject disagree, the proposal differs and says why. oopPO rules on these rows.
REVIEW = {
    'BootstrapScratch.test.ts': ('B', 'whole-repo consistency gate: compares the scratch-path spellings in bootstrap, .gitignore and tsconfig.test.json with the one DERIVED from M1Catalog.scratchFolder; M1Catalog is the reference owner, not the subject (3 uses = reading the constant)'),
    'GenClaims.test.ts': ('B', 'whole-tree: scans every git-TRACKED file outside spec/ (ls-files, not a literal root, so the mechanical signal missed it); M1Catalog×1 is incidental'),
    'MofLayout.test.ts': ('C → MOF/M1/M1Layout? (oopPO)', 'mechanical C = M1Catalog (7 uses), but the subject by content is LAYOUT placement of every MOF component (spec/mof-self.md AC5); M1Catalog only feeds the derivation. Ruling needed: M1Catalog (by the rule) vs M1Layout (by subject; not imported)'),
    'MofPlainNode.test.ts': ('B', 'whole-MOF execution gate: a child plain node imports EVERY committed MOF module across components; M1Catalog×3 = listing them'),
    'TypedReferences.test.ts': ('A (oopPO: near-tie)', 'mechanical C = OoshUnit 10 vs Web4MDA 9 (Model×7, FileModel×2); the subject by content is EVERY model class (Web4MDA package) round-tripping through JSON and the OOSH reader — OoshUnit is one of two instruments. Near-tie: ruling needed'),
    'OoshExecute.test.ts': ('B', 'whole-output execution gate: runs the generated OOSH under a real oosh runtime and compares to the real scripts; imports no src (reads generated files via the Generated helper)'),
    'TestTypecheck.test.ts': ('B', 'whole-tree: tsc over tsconfig.test.json = every test file in every component'),
}
for f in ['GarbageSweep', 'ScratchExclusion', 'SlowReport', 'TestBudget', 'TestFolder', 'TestPlacement', 'TrackedTree', 'WriteRecorder']:
    REVIEW[f + '.test.ts'] = ('B', 'tests a TEST-INFRASTRUCTURE class that lives in Web4MDA/latest/test itself (its only value imports are test-dir helpers) — the subject stays with it')
rows = []
for root, dirs, files in os.walk(TEST):
    dirs[:] = sorted(d for d in dirs if d != 'gen')
    for f in sorted(files):
        if not f.endswith(('.ts', '.mts', '.mjs')): continue
        path = f'{root}/{f}'; rel = os.path.relpath(path, TEST); text = open(path).read(); body = code(text)
        uses = collections.Counter(); names = collections.defaultdict(list)
        for m in IMP.finditer(text):
            if m.group(1) or not m.group(3).startswith('.'): continue  # type-only import / builtin or package: no subject
            comp = component(m.group(3), path)
            if comp is None or comp.startswith('#'): 
                if comp == '#test-helper': names['#test-helper'] += [n.strip().split(' as ')[-1] for n in m.group(2).split(',') if n.strip()]
                continue
            for n in [x.strip().split(' as ')[-1] for x in m.group(2).split(',') if x.strip()]:
                k = len(re.findall(rf'\b{re.escape(n)}\b', body))
                uses[comp] += k; names[comp].append(f'{n}×{k}')
        nocomment = '\n'.join(l for l in text.split('\n') if not re.match(r'\s*(//|\*|/\*)', l))
        signals = [s for s, r in WHOLE if r.search(nocomment)]
        is_test = f.endswith('.test.ts')
        ranked = uses.most_common()
        top = ranked[0] if ranked else ('', 0)
        own = uses.get('', 0)
        if not is_test: cls, why = 'B', 'test infrastructure (no tests of its own; used by other tests)'
        elif signals: cls, why = 'B', 'whole-tree: ' + '; '.join(signals)
        elif not ranked or top[1] == 0: cls, why = 'B?', 'no value import used in code — REVIEW'
        elif top[0] == '' or own >= top[1]: cls, why = 'A', f'Web4MDA own src used most ({own})'
        else: cls, why = 'C', f'subject {top[0]} used {top[1]} vs Web4MDA {own}'
        ev = ' · '.join(f"{c or 'Web4MDA'}: {', '.join(names[c])}" for c, _ in ranked)
        if names.get('#test-helper'): ev += (' · ' if ev else '') + 'helpers: ' + ', '.join(names['#test-helper'])
        prop, pwhy = REVIEW.get(rel, (cls, ''))
        rows.append((rel, cls, why, prop, pwhy, ev or '—'))
counts = collections.Counter(r[1] for r in rows); pcounts = collections.Counter(r[3].split(' ')[0] for r in rows)
print('| # | file (Web4MDA/latest/test/…) | mechanical | reason | **PROPOSED** | review note (only where it differs or resolves B?) | evidence: value imports by component — name×uses-in-code |')
print('|---|---|---|---|---|---|---|')
for i, r in enumerate(rows, 1): print(f'| {i} | `{r[0]}` | {r[1]} | {r[2]} | **{r[3]}** | {r[4]} | {r[5]} |')
print(f'\nMECHANICAL {len(rows)}: ' + ', '.join(f'{k}={v}' for k, v in sorted(counts.items())))
print(f'PROPOSED {len(rows)}: ' + ', '.join(f'{k}={v}' for k, v in sorted(pcounts.items())))

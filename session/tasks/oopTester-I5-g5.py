#!/usr/bin/env python3
"""oopTester I5 / G5 — IOR package layout DERIVED, Link unmoved (design 03e7b4a5 G5; plan L22/L50; brief 28523ec).

Reads ONLY git text of <repo> at its HEAD (never the move/derivation code — the oracle must not embody the mechanism):
  MOVED   = every class whose Definition stores a namespace in the Ior package ('Web4MDA.Ior' or below), Ior itself excluded
            (Ior's own namespace is 'Web4MDA'); cross-checked against the NAMED set (7 components + their models).
  PLACE   = every file named after a MOVED class (held, generated, Definition, test) lies under Web4MDA/Ior/ — whole-tree scan.
  ROOT    = no MOVED class has any file in Web4MDA/latest/ (abstract classes and models inside the Ior package, plan L50).
  LINK    = `git diff <base>..HEAD -- Web4MDA/Link` changes import lines ONLY (Link stays where it is; plan L8 / brief).
Usage: oopTester-I5-g5.py <repo dir> <base sha>     exit 0 GREEN / 1 RED
"""
import re, subprocess, sys

repo, base = sys.argv[1], sys.argv[2]
W = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'
NAMED = {'RepositoryId', 'ObjectKey', 'TaggedProfile', 'InternetProfile', 'TaggedComponent', 'SecureTransport', 'UnknownTaggedComponent',
         'RepositoryIdModel', 'ObjectKeyModel', 'TaggedProfileModel', 'InternetProfileModel', 'TaggedComponentModel', 'SecureTransportModel'}

def git(*a):
    return subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout

files = git('ls-files').splitlines()
defs = [f for f in files if re.search(r'/model/[A-Za-z0-9]+Definition\.ts$', f)]
moved, red = {}, []
for f in defs:
    cls = re.search(r'/([A-Za-z0-9]+)Definition\.ts$', f).group(1)
    text = open(f'{repo}/{f}', encoding='utf8').read()
    m = re.search(r"^      namespace: '([^']*)',$", text, re.M)
    if m and (m.group(1) == 'Web4MDA.Ior' or m.group(1).startswith('Web4MDA.Ior.')):
        moved[cls] = m.group(1)
print(f'MOVED (derived from stored namespaces): {len(moved)} — {", ".join(sorted(moved))}')
extra, missing = sorted(set(moved) - NAMED), sorted(NAMED - set(moved))
print(f'  vs NAMED {len(NAMED)}: extra={extra or "none"} missing={missing or "none"}')
if missing:
    red.append(f'MOVED misses named {missing}')
# PLACE + ROOT: whole-tree scan by class file name (any language, held or generated, Definition, test)
stray, rooted = [], []
for cls in moved:
    pat = re.compile(rf'/{cls}(Definition)?(\.class|\.interface|\.test)?\.(ts|js|puml|svg|mmd|oosh|sh)$')
    for f in files:
        if pat.search(f):
            if not f.startswith(f'{W}/Ior/'):
                stray.append(f)
            if f.startswith(f'{W}/latest/'):
                rooted.append(f)
print(f'PLACE: files of MOVED classes outside {W}/Ior/: {len(stray)}' + ('' if not stray else ' — ' + '; '.join(s.replace(W + "/", "") for s in stray[:6])))
print(f'ROOT : files of MOVED classes in Web4MDA/latest/: {len(rooted)}')
if stray:
    red.append(f'{len(stray)} file(s) of moved classes outside Ior/ (first: {stray[0].replace(W + "/", "")})')
# own-folder vs Ior/latest, reported (not asserted here: FolderNamespace in G6 asserts folder == layout(namespace) for EVERY class)
own = sorted({re.search(rf'{W}/Ior/([A-Za-z0-9]+)/latest/', f).group(1) for f in files if re.search(rf'{W}/Ior/([A-Za-z0-9]+)/latest/model/', f)})
inIor = sorted(c for c in moved if any(f.endswith(f'/Ior/latest/model/{c}Definition.ts') for f in defs))
print(f'  own folders under Ior/: {len(own)} {own}  |  in Ior/latest/ (Ior\'s own version): {len(inIor)} {inIor}')
# LINK unmoved: only import lines change
link = git('diff', '-U0', f'{base}..HEAD', '--', f'{W}/Link')
lines = [l for l in link.splitlines() if re.match(r'^[+-][^+-]', l)]
nonimport = [l for l in lines if not re.match(r"^[+-]import \{", l)]
renamed = git('diff', '--name-status', '-M', f'{base}..HEAD', '--', f'{W}/Link', f'{W}/Ior/Link').splitlines()
renamed = [r for r in renamed if r.startswith('R') or '/Ior/Link/' in r]
print(f'LINK : {base}..HEAD changed lines {len(lines)}, of which NON-import {len(nonimport)}; Link relocated: {len(renamed)}')
if nonimport or renamed or not any(f.startswith(f'{W}/Link/latest/model/LinkDefinition.ts') for f in files):
    red.append(f'Link moved or edited beyond imports (non-import lines {len(nonimport)}, relocations {len(renamed)})')
# OWNERSHIP (ruling A + rule 4 b): EVERY model (whole tree, not only IOR) with exactly ONE user, that user a COMPONENT (it has its own
# `<…>/<User>/latest/` folder), must sit IN that user's folder. Users = the classes whose Definition declares an ImportModel of it (text).
texts = {re.search(r'/([A-Za-z0-9]+)Definition\.ts$', f).group(1): (f, open(f'{repo}/{f}', encoding='utf8').read()) for f in defs}
comp_dir = {}
for f in files:
    m = re.search(r'^(.*/([A-Za-z0-9]+)/latest)/model/\2Definition\.ts$', f)
    if m:
        comp_dir[m.group(2)] = m.group(1)
owned_bad, owned_ok = [], 0
for mname, (mf, _) in texts.items():
    if not mname.endswith('Model'):
        continue
    users = [c for c, (_, t) in texts.items() if c != mname and re.search(rf"new ImportModel\(\)\.init\(\{{[^}}]*name: '{mname}'", t, re.S)]
    if len(users) == 1 and users[0] in comp_dir:
        if mf.startswith(comp_dir[users[0]] + '/model/'):
            owned_ok += 1
        else:
            owned_bad.append(f"{mname} (sole user {users[0]} at {comp_dir[users[0]].replace(W + '/', '')}, model at {mf.replace(W + '/', '').split('/model/')[0]})")
print(f'OWNED: sole-user models WITH their owner {owned_ok}, AWAY from it {len(owned_bad)}' + ('' if not owned_bad else ' — ' + '; '.join(owned_bad)))
if owned_bad:
    red.append(f'{len(owned_bad)} OWNED model(s) not with their sole-user component: ' + ', '.join(b.split(' ')[0] for b in owned_bad))
print('G5 GREEN' if not red else 'G5 RED — ' + ' | '.join(red))
sys.exit(1 if red else 0)

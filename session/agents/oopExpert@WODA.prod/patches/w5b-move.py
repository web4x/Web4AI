#!/usr/bin/env python3
"""W5b (plan H5m-2, oopPO rulings on reports/w5a-test-classification-821823c0.md): move ONE test to its subject's component.
usage: w5b-move.py <repo> <file.test.ts> <component path under Web4MDA> <subject class> [note]
git mv into <component>/latest/test/, re-point every RELATIVE import against the new location, declare the subject in-file,
re-key any path-keyed reference to the old path (GenClaims allowances)."""
import os, re, subprocess, sys
repo, name, comp, subject = sys.argv[1:5]; note = sys.argv[5] if len(sys.argv) > 5 else ''
PKG = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'
old = f'{PKG}/latest/test/{name}'; newdir = f'{PKG}/{comp}/latest/test'; new = f'{newdir}/{name}'
os.chdir(repo); assert os.path.isfile(old) and os.path.isdir(newdir) and not os.path.exists(new)
subprocess.run(['git', 'mv', old, new], check=True)
text = open(new).read(); n = 0
def repoint(m):
    global n
    spec = m.group(2)
    if not spec.startswith('.'): return m.group(0)
    target = os.path.normpath(os.path.join(os.path.dirname(old), spec))
    rel = os.path.relpath(target, newdir); rel = rel if rel.startswith('.') else './' + rel
    n += 1; return f"{m.group(1)}{rel}{m.group(3)}"
text = re.sub(r"^((?:import|export)\b[^\n]*? from ')([^']+)(';)", repoint, text, flags=re.M)
decl = f'// test-subject: {subject}' + (f' — {note}' if note else '') + '\n'
assert '// test-subject:' not in text; text = decl + text
open(new, 'w').write(text)
rekeyed = []
for f in subprocess.run(['git', 'grep', '-l', '-F', old], capture_output=True, text=True).stdout.split():
    s = open(f).read(); open(f, 'w').write(s.replace(old, new)); rekeyed.append(f)
for spec in re.findall(r"^(?:import|export)\b[^\n]*? from '(\.[^']+)';", text, flags=re.M):
    p = os.path.normpath(os.path.join(newdir, spec)); assert os.path.exists(p) or os.path.exists(re.sub(r'\.js$', '.ts', p)), f'unresolved {spec}'
print(f'{name}: -> {comp}; {n} imports re-pointed (all resolve); subject {subject}; re-keyed {rekeyed}')

"""oopTester I3b gate-time checks (plan 2026-10-03, spec thinglish.md TH7 AMENDED v3) — run in the gate clone at the I2 sha.

usage: python3 gate-i3b-live.py <base> <sha>
  TH7 live: every path changed base..sha classified; anything not allowed is a violation BY NAME.
  Allowed: *.thing under latest/src/thinglish/; spec/**; builders M2ThingClass, ThinglishGrammar, M1Layout; the GATE (files of my
  patch, derived from the patch); the NAMED FileServerModelDefinition; a FileServerModel generated file ONLY if its diff is
  exactly removed lines naming the deleted relationship (oopPO ruling); a file whose content == base content with the old model
  name -> ModelUnit (rename-only, path rename followed).
"""
import re, subprocess, sys

base, sha = sys.argv[1], sys.argv[2]
W = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'
OLD, NEW = 'Typed' + 'Model', 'ModelUnit'
BUILDERS = [f'{W}/MOF/M2/M2ThingClass/', f'{W}/ThinglishGrammar/', f'{W}/MOF/M1/M1Layout/']
FS_DEF = f'{W}/DefaultFolder/latest/model/FileServerModelDefinition.ts'
PATCH = '/var/dev/Workspaces/AI/Claude/session/tasks/oopTester-I3b-gate-draft-4907913.patch'
GATE = sorted({l[6:].strip() for l in open(PATCH) if l.startswith('+++ b/')})


def git(*a, ok=(0,)):
    r = subprocess.run(['git', *a], capture_output=True, text=True)
    if r.returncode not in ok:
        raise SystemExit(f'git {a} rc={r.returncode}: {r.stderr[:300]}')
    return r.stdout


def show(rev, path):
    r = subprocess.run(['git', 'show', f'{rev}:{path}'], capture_output=True)
    return None if r.returncode else r.stdout.decode('utf8', 'replace')


status = [l.split('\t') for l in git('diff', '--name-status', '-M', base, sha).splitlines() if l]
viol, fileserver, renamed_ok = [], [], 0
for st in status:
    kind, path = st[0], st[-1]
    before_path = st[1] if kind.startswith('R') else path
    if re.search(r'/latest/src/thinglish/.*\.thing$', path) or path.startswith('spec/') or any(path.startswith(b) for b in BUILDERS) or path in GATE or path == FS_DEF:
        continue
    before = show(base, before_path)
    if before is None and OLD not in path:
        candidate = path.replace(NEW, OLD)
        before = show(base, candidate) if candidate != path else None
    after = show(sha, path)
    if '/FileServerModel.' in path and before is not None and after is not None:
        diff = [l for l in git('diff', '-U0', base, sha, '--', path).splitlines() if l[:1] in '+-' and not l.startswith(('+++', '---'))]
        norm = [l for l in diff if not (l.startswith('-') and l[1:].replace(OLD, NEW) in after)]
        added = [l for l in norm if l.startswith('+') and l[1:].replace(NEW, OLD) not in before]
        removed = [l for l in norm if l.startswith('-')]
        good = not added and removed and all(re.search(r'containedBy|DefaultFolder|14ca2c32', l) for l in removed)
        fileserver.append((path, 'ALLOWED (only the removed relationship)' if good else f'VIOLATION added={added[:3]} removed={removed[:3]}'))
        if not good:
            viol.append(path)
        continue
    if before is not None and after is not None and before.replace(OLD, NEW) == after:
        renamed_ok += 1
        continue
    viol.append(f'{kind} {path}')

print(f'TH7 live {base}..{sha}: changed {len(status)} · rename-only {renamed_ok} · gate files named {len(GATE)} · VIOLATIONS {len(viol)}')
for v in viol:
    print('  VIOLATION', v)
for p, v in fileserver:
    print('  FileServerModel generated:', p, '->', v)

raise SystemExit(1 if viol else 0)

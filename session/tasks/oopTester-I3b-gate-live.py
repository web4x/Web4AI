"""oopTester I3b gate-time checks (plan 2026-10-03, spec thinglish.md TH7 AMENDED v3) — run in the gate clone at the I2 sha.

usage: python3 gate-i3b-live.py <base> <sha>
  TH7 live: every path changed base..sha classified; anything not allowed is a violation BY NAME.
  Allowed (spec v4, scope REVERSED 2026-10-03): *.thing under latest/src/thinglish/; spec/**; builders M2ThingClass,
  ThinglishGrammar; the GATE (files of my patch, derived from the patch); a file whose content == base content with the old
  model name -> ModelUnit (rename-only, path rename followed). Nothing else — no model change, no layout change.
"""
import re, subprocess, sys

base, sha = sys.argv[1], sys.argv[2]
# oopPO RULED 2026-10-03 (default now): (a) rename-only MODULO ORDER, ONLY where the order is SORT-DERIVED (the reordered lines sit
# in a run sorted by the name each line is about, in BOTH versions, each in its own names; an in-line list sorted in both);
# (b) an svg may change ONLY because its puml source changed by the rename (incl. a); TypedModel.svg -> ModelUnit.svg = the rename.
PROPOSED = True


def canon(text):
    # a line with its quoted list elements sorted — a re-sorted literal list after the rename is not a content change
    return sorted(re.sub(r"\[[^\]]*\]", lambda m: '[' + ','.join(sorted(re.findall(r"'[^']*'", m.group(0)))) + ']', l) for l in text.splitlines())


def key(line):
    # the name a line is ABOUT: its last name, a trailing ` : <Binding>` / ` {` ignored (puml: the declared class / the child)
    t = re.sub(r'\s*(:\s*<[^>]*>|\{)\s*$', '', line).split()
    return t[-1] if t else ''


def line_kind(line):
    if '<|--' in line or '<|..' in line:
        return 'rel'
    if re.match(r'^(abstract class|class|interface|enum) ', line):
        return 'decl'
    return None


def run_sorted(lines, i):
    k = line_kind(lines[i])
    if k is None:
        return False
    lo = i
    while lo > 0 and line_kind(lines[lo - 1]) == k:
        lo -= 1
    hi = i
    while hi < len(lines) - 1 and line_kind(lines[hi + 1]) == k:
        hi += 1
    keys = [key(l) for l in lines[lo:hi + 1]]
    return keys == sorted(keys)


def lists_sorted(line):
    return all(re.findall(r"'[^']*'", m) == sorted(re.findall(r"'[^']*'", m)) for m in re.findall(r'\[[^\]]*\]', line))


def sort_derived(b, a):
    # every changed line is a re-sort: its run (or its in-line list) is sorted in BOTH versions, each in its own names
    nb = b.replace(OLD, NEW).splitlines()
    ob, oa = b.splitlines(), a.splitlines()
    import difflib
    for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(None, nb, oa, autojunk=False).get_opcodes():
        if tag == 'equal':
            continue
        pairs = list(zip(range(i1, i2), range(j1, j2))) if tag == 'replace' and i2 - i1 == j2 - j1 else []
        if pairs and all(canon(nb[i]) == canon(oa[j]) for i, j in [(i, j) for i, j in pairs]) and all(lists_sorted(ob[i]) and lists_sorted(oa[j]) for i, j in pairs):
            continue
        if not all(run_sorted(ob, i) for i in range(i1, i2)) or not all(run_sorted(oa, j) for j in range(j1, j2)):
            return False
    return True


def rename_only(b, a, modulo_order):
    if b is None or a is None:
        return False
    nb = b.replace(OLD, NEW)
    return nb == a or (modulo_order and canon(nb) == canon(a) and sort_derived(b, a))
W = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'
OLD, NEW = 'Typed' + 'Model', 'ModelUnit'
BUILDERS = [f'{W}/MOF/M2/M2ThingClass/', f'{W}/ThinglishGrammar/']  # scope REVERSED 2026-10-03: no M1Layout, no FileServerModelDefinition
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
viol, renamed_ok = [], 0
for st in status:
    kind, path = st[0], st[-1]
    before_path = st[1] if kind.startswith('R') else path
    if re.search(r'/latest/src/thinglish/.*\.thing$', path) or path.startswith('spec/') or any(path.startswith(b) for b in BUILDERS) or path in GATE:
        continue
    before = show(base, before_path)
    if before is None and OLD not in path:
        candidate = path.replace(NEW, OLD)
        before = show(base, candidate) if candidate != path else None
    after = show(sha, path)
    if rename_only(before, after, PROPOSED):
        renamed_ok += 1
        continue
    if PROPOSED and path.endswith('.svg') and '/latest/src/svg/' in path:
        src = path.replace('/latest/src/svg/', '/latest/src/puml/')[:-4] + '.puml'
        if kind == 'D' and OLD in path:  # the old rendering of a renamed class: its new rendering must exist at the sha
            ok = show(sha, path.replace(OLD, NEW)) is not None
        else:
            sb, sa = show(base, src.replace(NEW, OLD)) or show(base, src), show(sha, src)
            ok = sb != sa and rename_only(sb, sa, True)  # the svg may change ONLY because its puml changed by the rename (never on its own)
        if ok:
            renamed_ok += 1
            continue
    viol.append(f'{kind} {path}')

print(f'TH7 live {base}..{sha} (ruled 2026-10-03): changed {len(status)} · rename-only {renamed_ok} · gate files named {len(GATE)} · VIOLATIONS {len(viol)}')
for v in viol:
    print('  VIOLATION', v)

raise SystemExit(1 if viol else 0)

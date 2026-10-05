#!/usr/bin/env python3
"""oopTester I5 — rendered dependency ids == the DERIVED set (brief: the "29" is NOT carried; the size is measured).
A rendered id is `com.ceruleanCircle.<namespace>.<Class>.<version>` (Thinglish `dependency` line) — it embeds the TARGET's namespace.
  DERIVED  = for every rendered dependency line at <base> whose target class's STORED namespace (Definition text) changed
             base -> sha: the old id is expected to become the same id with the new namespace. Nothing else may change.
  MEASURED = the multiset diff of all rendered dependency lines, keyed by (owning file's class, id) — paths move, keys do not.
  GREEN iff removed == derived old ids AND added == derived new ids (multisets), and the size is printed.
Usage: oopTester-I5-dep-ids.py <repo dir> <base> <sha> [--seed]   (--seed drops ONE derived pair = proves the comparison bites)"""
import collections, re, subprocess, sys

repo, base, sha = sys.argv[1:4]; seed = '--seed' in sys.argv
def git(*a):
    return subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True).stdout

def namespaces(rev):
    ns = {}
    for f in git('ls-tree', '-r', '--name-only', rev).splitlines():
        m = re.search(r'/model/([A-Za-z0-9]+)Definition\.ts$', f)
        if m:
            t = re.search(r"^      namespace: '([^']*)',$", git('show', f'{rev}:{f}'), re.M)
            if t:
                ns[m.group(1)] = t.group(1)
    return ns

def rendered(rev):
    c = collections.Counter()
    for line in git('grep', '-H', '-E', r'^\s*dependency [A-Za-z0-9.]+$', rev, '--', 'EAMD.ucp').splitlines():
        path, text = line.split(':', 2)[1], line.split(':', 2)[2]
        owner = re.sub(r'\.(class|interface)\.[a-z.]+$|\.[a-z]+$', '', path.rsplit('/', 1)[-1])
        c[(owner, text.strip().split(' ', 1)[1])] += 1
    return c

nb, ns = namespaces(base), namespaces(sha)
moved = {c: (nb[c], ns[c]) for c in nb if c in ns and nb[c] != ns[c]}
rb, rs = rendered(base), rendered(sha)
exp_old, exp_new = collections.Counter(), collections.Counter()
for (owner, i), n in rb.items():
    parts = i.split('.')
    target = parts[-2] if len(parts) >= 2 else ''
    if target in moved:
        old, new = moved[target]
        prefix = 'com.ceruleanCircle.'
        if i.startswith(prefix + old + '.' + target + '.'):
            exp_old[(owner, i)] += n
            exp_new[(owner, prefix + new + i[len(prefix + old):])] += n
if seed and exp_old:
    k = next(iter(exp_old)); exp_old.pop(k); print(f'SEED: dropped one derived pair {k}')
removed, added = rb - rs, rs - rb
# an owner file that itself moved keeps its key (class name) — so only id changes are counted
print(f'MOVED classes (stored namespace changed {base}..{sha}): {len(moved)}')
print(f'DERIVED: {sum(exp_old.values())} rendered dependency ids must change | MEASURED: removed {sum(removed.values())}, added {sum(added.values())}')
ok = removed == exp_old and added == exp_new
if not ok:
    for k in list((removed - exp_old) + (exp_old - removed))[:6]:
        print('   MISMATCH old-side', k)
    for k in list((added - exp_new) + (exp_new - added))[:6]:
        print('   MISMATCH new-side', k)
print('DEP-IDS GREEN (measured == derived)' if ok else 'DEP-IDS RED')
sys.exit(0 if ok else 1)

#!/usr/bin/env python3
"""oopTester I5 — STORED IOR strings unchanged by the move (brief: 0 change; "48 == 48" was measured by others, scope unstated).
Scans the COMMITTED text at each sha for `ior:(component|instance)://…` in two scopes — ALL tracked files, and the stored-data
scope `*.json` + `*.md` — and compares the MULTISETS (content, not only the count) of every sha against the first.
Usage: oopTester-I5-stored-ior.py <repo dir> <base sha> <sha> [<sha> ...]"""
import collections, re, subprocess, sys

repo, shas = sys.argv[1], sys.argv[2:]
IOR = re.compile(r"ior:(?:component|instance)://[^\s`'\")\]<>,]*(?:,[^\s`'\")\]<>/]+)*[^\s`'\")\]<>,]*")

def scan(sha, scope):
    out = subprocess.run(['git', '-C', repo, 'grep', '-o', '-h', '-E', r'ior:(component|instance)://[^[:space:]`'"'"'")<>]*', sha, '--', *scope],
                         capture_output=True, text=True).stdout
    return collections.Counter(l.split(':', 1)[1] if l.startswith(sha + ':') else l for l in out.splitlines() if l)

for label, scope in (('ALL tracked', ['.']), ('json+md', ['*.json', '*.md'])):
    base = scan(shas[0], scope)
    print(f'{label}: {shas[0]} = {sum(base.values())} IOR strings ({len(base)} distinct)')
    for s in shas[1:]:
        c = scan(s, scope)
        gone, new = base - c, c - base
        print(f'  {s} = {sum(c.values())} ({len(c)} distinct) | removed {sum(gone.values())} added {sum(new.values())}'
              + ('' if not (gone or new) else ' | ' + '; '.join([f'-{k}' for k in list(gone)[:4]] + [f'+{k}' for k in list(new)[:4]])))

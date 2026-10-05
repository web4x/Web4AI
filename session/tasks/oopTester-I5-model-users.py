#!/usr/bin/env python3
"""oopTester I5 — who USES each IOR model, at two shas, from the Definitions' TEXT (ImportModel facts), never the derivation code.
A model is OWNED (rule 4 b, ruling A) only by its SOLE user; it must then sit with that user. Prints users + location per sha.
Usage: oopTester-I5-model-users.py <repo dir> <sha> [<sha> ...]"""
import re, subprocess, sys

repo, shas = sys.argv[1], sys.argv[2:]
MODELS = ['RepositoryIdModel', 'ObjectKeyModel', 'InternetProfileModel', 'SecureTransportModel', 'TaggedProfileModel', 'TaggedComponentModel']

def git(*a):
    return subprocess.run(['git', '-C', repo, *a], capture_output=True, text=True, check=True).stdout

for sha in shas:
    print(f'=== {sha}')
    defs = [f for f in git('ls-tree', '-r', '--name-only', sha).splitlines() if re.search(r'/model/[A-Za-z0-9]+Definition\.ts$', f)]
    users = {m: [] for m in MODELS}
    where = {}
    for f in defs:
        cls = re.search(r'/([A-Za-z0-9]+)Definition\.ts$', f).group(1)
        if cls in MODELS:
            where[cls] = re.sub(r'^.*/Web4MDA/', '', f).replace(f'/model/{cls}Definition.ts', '')
        text = git('show', f'{sha}:{f}')
        for m in MODELS:
            if cls != m and re.search(rf"new ImportModel\(\)\.init\(\{{[^}}]*name: '{m}'", text, re.S):
                users[m].append(cls)
    for m in MODELS:
        u = sorted(users[m])
        print(f'  {m:22} at {where.get(m, "?"):28} users {len(u)}: {", ".join(u)}')

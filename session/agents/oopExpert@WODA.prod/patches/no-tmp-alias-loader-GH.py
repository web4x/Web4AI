import sys, re, hashlib, os
ROOT = sys.argv[1]; W = f'{ROOT}/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'; G = f'{W}/latest/test/gates'
def edit(p, pairs):
    s = open(p).read()
    for a, b in pairs:
        assert s.count(a) == 1, (p, a[:70], s.count(a)); s = s.replace(a, b)
    open(p, 'w').write(s)
# G. probe usage lines: TypeScript through the tsx LOADER; TMPDIR is set by Scratch / the bootstrap, never a repo-root alias
edit(f'{G}/NpmTestPorcelainProbe.ts', [(" * Run: `node_modules/.bin/tsx <this file>", " * Run: `node --import tsx <this file>")])
edit(f'{G}/GenAtomicityProbe.ts', [(" * Run: `node_modules/.bin/tsx test/gates/GenAtomicityProbe.ts", " * Run: `node --import tsx test/gates/GenAtomicityProbe.ts")])
edit(f'{G}/SuiteTreeTouchProbe.ts', [(" * Run: `node_modules/.bin/tsx test/gates/SuiteTreeTouchProbe.ts", " * Run: `node --import tsx test/gates/SuiteTreeTouchProbe.ts")])
edit(f'{G}/NoEscapeProbe.ts', [
 (" * 108-byte sun_path, so a clone run is a CONFOUNDED instrument). The recorder",
  " * 108-byte sun_path, so a clone run is a CONFOUNDED instrument — cause REMOVED: TypeScript now runs through the tsx\n * LOADER, which opens no socket, and the .tmp alias is gone). The recorder"),
 (" * Run: `node_modules/.bin/tsx <this file>", " * Run: `node --import tsx <this file>")])
edit(f'{G}/GarbageSweep.ts', [(" *   `TMPDIR=<repo>/.tmp node_modules/.bin/tsx <this file> [--seed]`", " *   `TMPDIR=<repo>/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/latest/test/gen/tmp node --import tsx <this file> [--seed]`")])
# H. re-pin every declared machinery file whose bytes changed (TestFolder self-pin last, over its text with pins blanked)
tf = f'{W}/latest/test/TestFolder.ts'; s = open(tf).read()
changed = 0
for key, pin in re.findall(r"      '([^']+)': '([0-9a-f]{64})'", s):
    path = f'{W}/{key}'
    if key.endswith('latest/test/TestFolder.ts') or not os.path.exists(path): continue
    d = hashlib.sha256(open(path, 'rb').read()).hexdigest()
    if d != pin: s = s.replace(f"'{key}': '{pin}'", f"'{key}': '{d}'"); changed += 1; print('re-pinned', key)
d = hashlib.sha256(re.sub(r"'[0-9a-f]{64}'", "''", s).encode()).hexdigest()
s = re.sub(r"('latest/test/TestFolder.ts': )'[0-9a-f]{64}'", rf"\1'{d}'", s); open(tf, 'w').write(s)
print('re-pinned', changed, '+ TestFolder self')

import sys, re
ROOT = sys.argv[1]; W = f'{ROOT}/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA'
def edit(path, pairs):
    p = f'{ROOT}/{path}' if not path.startswith('/') else path; s = open(p).read()
    for a, b in pairs:
        assert s.count(a) == 1, (path, a[:70], s.count(a)); s = s.replace(a, b)
    open(p, 'w').write(s)
# A. bootstrap: no alias, TMPDIR straight to the scratch tmp, TypeScript via the LOADER (no tsx CLI -> no IPC socket)
edit('scripts/bootstrap.mjs', [
 ("import { existsSync, lstatSync, mkdirSync, realpathSync, symlinkSync } from 'node:fs';", "import { existsSync, mkdirSync, realpathSync } from 'node:fs';"),
 ("// folder (M1Catalog.scratchFolder / scratchTmp / scratchAlias), so it names the path itself;", "// folder (M1Catalog.scratchFolder / scratchTmp), so it names the path itself;"),
 ("// TMPDIR is the SHORT repo-root alias `.tmp` -> scratchTmp: a unix socket path (tsx's IPC pipe) is capped at 108 bytes.\n",
  "// TMPDIR is the scratch tmp ITSELF — no alias, no symlink (Tron: only <Component>/latest/test/gen). TypeScript runs through\n// the tsx LOADER (`node --import tsx`), which opens no IPC socket; the tsx CLI did, at a path libuv TRUNCATES past 108 bytes.\n"),
 ("const scratchAlias = new URL('.tmp', root);\n", ""),
 ("const isLink = (url) => { try { return lstatSync(url).isSymbolicLink(); } catch { return false; } };\n", ""),
 ("if (!keep) {\n  mkdirSync(scratchTmp, { recursive: true });\n  if (!isLink(scratchAlias)) symlinkSync(scratchTmp.pathname, scratchAlias.pathname);\n}\n", "if (!keep) mkdirSync(scratchTmp, { recursive: true });\n"),
 ("TMPDIR: keep ? inherited : scratchAlias.pathname,", "TMPDIR: keep ? inherited : scratchTmp.pathname.replace(/\\/$/, ''),"),
 ("process.exit(run('npx', ['tsx', 'EAMD.ucp", "process.exit(run(process.execPath, ['--import', 'tsx', 'EAMD.ucp"),
])
# B. Web4MDA's generate chain: each step through the loader (src + its model, so the reproduce gate stays exact)
edit(f'{W}/latest/src/ts/EAM/layer2/Web4MDA.ts', [("await shell.run(`npx tsx ${step}`);", "await shell.run(`node --import tsx ${step}`);")])
edit(f'{W}/latest/model/Web4MDADefinition.ts', [("'  const status = await shell.run(`npx tsx ${step}`);',", "'  const status = await shell.run(`node --import tsx ${step}`);',")])
# C. M1Catalog: the alias concept is gone
p = f'{W}/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts'; s = open(p).read()
s, n = re.subn(r"  /\*\*\n   \* The SHORT repo-root alias of scratchTmp[\s\S]*?  get scratchAlias\(\): string \{\n[\s\S]*?\n  \}\n\n", '', s); assert n == 1
for a, b in [("   * Whether a folder IS a scratch folder (`…/latest/test/gen`, or the repo-root alias `.tmp` that links into it) — what a",
              "   * Whether a folder IS a scratch folder (`…/latest/test/gen`) — what a"),
             ("    return path.endsWith(`/latest/${this.scratchFolder}`) || path.endsWith(`/${this.scratchAlias}`);", "    return path.endsWith(`/latest/${this.scratchFolder}`);")]:
    assert s.count(a) == 1, a[:60]; s = s.replace(a, b)
open(p, 'w').write(s)
# D. Scratch.tmp: the scratch tmp itself
edit(f'{W}/latest/test/Scratch.ts', [
 ("   * cache) land inside too. It is the SHORT alias `<repo>/<scratchAlias>` -> `<home>tmp` (a unix socket path is capped\n   * at 108 bytes). An INHERITED TMPDIR",
  "   * cache) land inside too. It is `<home>tmp` ITSELF — no alias, no symlink (Tron); nothing creates a unix socket there\n   * (TypeScript runs through the tsx loader, never the tsx CLI). An INHERITED TMPDIR"),
 ("    mkdirSync(target, { recursive: true });\n    const alias = `${process.cwd()}/${catalog.scratchAlias}`;\n    if (!this.isLink(alias)) symlinkSync(target, alias);\n    return alias;",
  "    mkdirSync(target, { recursive: true });\n    return target;"),
])
# E. .gitignore
edit('.gitignore', [("/.tmp\n", "")])
print('applied')
# F. BootstrapScratch gate: no alias anywhere; the socket cause is gated by MECHANISM (kernel socket table), not text
T = f'{W}/latest/test/BootstrapScratch.test.ts'
edit(T, [
 ("import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';",
  "import { existsSync, mkdirSync, readdirSync, readFileSync, readlinkSync, realpathSync, writeFileSync } from 'node:fs';"),
 (" * (M1Catalog.scratchFolder / scratchTmp / scratchAlias): the bootstrap", " * (M1Catalog.scratchFolder / scratchTmp): the bootstrap"),
 ("import { Scratch } from './Scratch.js';", "import { Child } from './Child.js';\nimport { Scratch } from './Scratch.js';"),
 ("    return lines.includes(`**/latest/${this.catalog.scratchFolder}/`) && lines.includes(`/${this.catalog.scratchAlias}`);",
  "    return lines.includes(`**/latest/${this.catalog.scratchFolder}/`) && !lines.some((l) => /^\\/?\\.tmp\\/?$/.test(l)); // the folder, and NO alias line (Tron)"),
 ("    expect(catalog.scratchAlias).toBe('.tmp');\n", "    expect(existsSync(`${process.cwd()}/.tmp`), 'Tron: NO repo-root alias / symlink').toBe(false);\n"),
 ("    expect(t.startsWith(`${process.cwd()}/${catalog.scratchAlias}/`) && t.startsWith(`${scratch.tmp}/h2-probe-`)).toBe(true); // addressed through the short alias, inside this run's folder…",
  "    expect(t.startsWith(`${scratch.tmp}/h2-probe-`)).toBe(true); // inside this run's folder…"),
 ("""  it('TMPDIR BY CONSTRUCTION: this worker has its RUN folder under the SHORT in-repo alias as OS tmpdir; the alias resolves into the scratch tmp', () => {
    expect(process.env.TMPDIR).toBe(scratch.tmp);
    expect(osTemp()).toMatch(new RegExp(`^${process.cwd()}/\\\\${catalog.scratchAlias}/run-\\\\d+$`)); // Scratch.run (globalSetup): the run's own folder
    const alias = `${process.cwd()}/${catalog.scratchAlias}`;
    expect(lstatSync(alias).isSymbolicLink()).toBe(true);
    expect(realpathSync(alias)).toBe(target);
    expect(realpathSync(osTemp()).startsWith(`${target}/run-`)).toBe(true);
    expect(`${osTemp()}/tsx-0/4194304.pipe`.length, 'a unix socket path must fit sun_path (108 bytes incl. NUL)').toBeLessThan(108);
    expect(`${target}/tsx-0/4194304.pipe`.length, 'why the alias exists: the real path does NOT fit').toBeGreaterThan(107);
  });""",
 """  it('TMPDIR BY CONSTRUCTION: this worker has its RUN folder in the scratch tmp ITSELF as OS tmpdir — no alias, no symlink', () => {
    expect(process.env.TMPDIR).toBe(scratch.tmp);
    const runFolder = new RegExp(`^${target.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}/run-\\\\d+$`); // Scratch.run (globalSetup): the run's own folder
    expect(osTemp()).toMatch(runFolder); // the REAL path…
    expect(realpathSync(osTemp())).toMatch(runFolder); // …reached through NO symlink
    expect(existsSync(`${process.cwd()}/.tmp`)).toBe(false);
  });

  it('NO unix socket by construction (MECHANISM, not text): a TypeScript child through the tsx LOADER adds 0 entries to the kernel socket table; the tsx CLI adds one at a libuv-TRUNCATED path (seed -> RED)', async (ctx) => {
    if (!existsSync('/proc/net/unix')) return ctx.skip('no /proc/net/unix on this OS: the socket table cannot be read here');
    // ATTRIBUTED to the child's own pid (fd -> socket:[inode] -> /proc/net/unix path): a box-wide diff also counts every
    // concurrent test file's and every other agent's sockets — measured: it did, under the full suite
    const pathSocketsOf = (pid: number): string[] => {
      let fds: string[] = [];
      try {
        fds = readdirSync(`/proc/${pid}/fd`);
      } catch {
        return []; // the process is gone
      }
      const inodes = new Set(fds.map((fd) => { try { return /^socket:\\[(\\d+)\\]$/.exec(readlinkSync(`/proc/${pid}/fd/${fd}`))?.[1] ?? ''; } catch { return ''; } }));
      return readFileSync('/proc/net/unix', 'utf8').split('\\n').slice(1).map((l) => l.trim().split(/\\s+/)).filter((c) => c.length >= 8 && inodes.has(c[6] ?? '')).map((c) => c[7] ?? '');
    };
    const probe = `${scratch.temp('h2-socket-')}/Sleep.ts`;
    writeFileSync(probe, 'await new Promise((resolve) => setTimeout(resolve, 2500));\\n');
    const created = async (args: string[]): Promise<{ sockets: string[]; code: number | null; stderr: string }> => {
      const child = Child.spawn(args[0] ?? '', [...args.slice(1), probe], { cwd: process.cwd(), env: process.env, stdio: ['ignore', 'ignore', 'pipe'] }); // Child owns every test child
      let running = true;
      let stderr = '';
      child.stderr?.on('data', (d: Buffer) => (stderr += d.toString()));
      const exited = new Promise<number | null>((resolve) => child.on('exit', (code) => resolve(((running = false), code)))); // listen at SPAWN time
      const held = new Set<string>();
      while (running) {
        for (const p of child.pid === undefined ? [] : pathSocketsOf(child.pid)) held.add(p); // POLLED from spawn to exit: no racy single sample
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      return { sockets: [...held], code: await exited, stderr };
    };
    const loader = await created([process.execPath, '--import', 'tsx']);
    expect({ sockets: loader.sockets, code: loader.code }).toEqual({ sockets: [], code: 0 }); // GREEN: the loader runs and opens no socket (stderr may carry node's env warnings)
    const cli = await created([`${process.cwd()}/node_modules/.bin/tsx`]); // the seed: the former `npx tsx`
    // SEEN, in whichever way this environment shows it (measured both): a socket at a libuv-TRUNCATED path (not where tsx
    // meant it), or — when that truncated path collides with an existing entry — the CLI's listen FAILS and it exits
    const truncated = cli.sockets.length === 1 && !(cli.sockets[0] ?? '').endsWith('.pipe');
    const listenFailed = cli.code !== 0 && /EADDRINUSE|EINVAL|ENAMETOOLONG|listen/.test(cli.stderr);
    expect(truncated || listenFailed || cli.sockets.length === 1, JSON.stringify({ ...cli, stderr: cli.stderr.slice(0, 200) })).toBe(true);
  }, 20000);"""),
 ("    expect(mirrors.bootstrapNamed('scratchAlias')).toBe(`${process.cwd()}/${catalog.scratchAlias}`);\n", ""),
 ("    expect(mirrors.bootstrapNamed('scratchAlias', boot.replace(\"new URL('.tmp', root)\", \"new URL('.scratch', root)\"))).not.toBe(`${process.cwd()}/${catalog.scratchAlias}`);\n", ""),
 ("    expect(mirrors.gitignored(ignore.replace('/.tmp\\n', ''))).toBe(false);\n", "    expect(mirrors.gitignored(`${ignore}/.tmp\\n`)).toBe(false); // an alias line coming back is RED\n"),
 ("`${scratch.home}x/EAMD.ucp/Components/c/latest/test/gen`, `${process.cwd()}/.tmp`, 'repo/.tmp/'])", "`${scratch.home}x/EAMD.ucp/Components/c/latest/test/gen`])"),
 ("`${scratch.home}tmp`, 'repo/.tmpx', 'repo/x.tmp'])", "`${scratch.home}tmp`, `${process.cwd()}/.tmp`, 'repo/.tmp/', 'repo/.tmpx', 'repo/x.tmp'])"),
 ("  it('isScratch: exactly the folder or the alias (a descending walker prunes there)", "  it('isScratch: exactly the folder (a descending walker prunes there; no alias exists)"),
])
print('F applied')

# I. Child.test walker: classify a file by its path RELATIVE to the walk root — a seed root that itself lies in a scratch
#    test folder (the tmp is the real path now, no alias) must not make every seed count as "in a test folder"
edit(f'{W}/latest/test/Child.test.ts', [
 ("      return `/${path}`.includes('/latest/test/') && /\\.(ts|mjs|js)$/.test(e.name) ? [path] : [];",
  "      return `/${path.slice(this.root.length)}`.includes('/latest/test/') && /\\.(ts|mjs|js)$/.test(e.name) ? [path] : []; // RELATIVE to the walk root"),
])
print('I applied')
# J. tsc SEED configs: the seed lies in the scratch tmp at its REAL path now (no alias), which the inherited repo
#    tsconfig excludes (`EAMD.ucp/Components/**/test/**`) -> "no inputs". Each seed config declares its own exclude.
import re as _re
NOTE = 'exclude: [], // the seed lives in the scratch tmp (…/latest/test/gen/tmp), which the inherited repo tsconfig excludes'
for rel, n in [('MOF/M2/M2ThinglishClass/latest/test/M2ThinglishClass.test.ts', 2), ('latest/test/ModelJson.test.ts', 1), ('latest/test/TreeFileUnitInc1.test.ts', 1),
               ('latest/test/TreeFileUnitRulings.test.ts', 1), ('latest/test/UnitReferencesInc2.test.ts', 1)]:
    p = f'{W}/{rel}'; s = open(p).read()
    s2, k = _re.subn(r'^(\s+)(include: \[)', lambda m: f'{m.group(1)}{NOTE}\n{m.group(1)}{m.group(2)}', s, flags=_re.M)
    assert k == n, (rel, k); open(p, 'w').write(s2)
edit(f'{W}/latest/test/Boilerplate.test.ts', [(" }, include: [`${this.dir}/*.ts`] }));", " }, exclude: [], include: [`${this.dir}/*.ts`] })); // own exclude: the seed lives in the scratch tmp, which the repo tsconfig excludes")])
print('J applied')

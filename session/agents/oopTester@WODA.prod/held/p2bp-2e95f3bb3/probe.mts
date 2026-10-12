// oopTester READ-ONLY probe (P2b' re-expressed gates): measures the 3 oracles on the tree it runs in, BEFORE any gate is written.
// run (cwd = the clone root): node --import tsx <this file>   → summary on stdout, detail in $PROBE_OUT
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, sep } from 'node:path';

const cwd = process.cwd();
const MARK = `${sep}EAMD.ucp${sep}Components${sep}`;
const comps = join(cwd, 'EAMD.ucp', 'Components'); // the clone's OWN root (nearest from its root)
const { M1Catalog } = await import(join(cwd, 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts'));

const walk = (dir: string, out: string[] = []): string[] => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === 'gen' || e.name.startsWith('.')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.isFile()) out.push(p);
  }
  return out;
};
const files = walk(comps);
const chainOf = (p: string): string => { const i = p.lastIndexOf(MARK); const rel = p.slice(i + MARK.length); const j = rel.indexOf(`${sep}latest${sep}`); return rel.slice(0, j).split(sep).join('.'); };

// P2-ROOT'
await M1Catalog.load();
const cat = new M1Catalog().init();
const classes = [...cat.classes(), cat.placedModel()];
const names = new Set(classes.map((c: { name: string }) => c.name));
const defs = new Map<string, string[]>();
for (const f of files) { const m = /[\\/]latest[\\/]model[\\/]([A-Za-z0-9_]+)Definition\.ts$/.exec(f); if (m) defs.set(m[1], [...(defs.get(m[1]) ?? []), f]); }
// DISK structure only (never the namespace): component folders = folders holding latest/; owner = the component whose OWN
// Definition sits in that folder under its folder's name; package folder = a component folder containing other component folders.
const compFolders = new Set<string>();
for (const f of files) if (f.includes(`${sep}latest${sep}`)) compFolders.add(chainOf(f));
const ownerOf = (D: string): string => { const last = D.split('.').pop() ?? ''; return (defs.get(last) ?? []).some((p) => chainOf(p) === D) ? last : ''; };
const isPkg = (D: string): boolean => [...compFolders].some((x) => x !== D && x.startsWith(`${D}.`));
const rootRed: string[] = [];
const cats = new Map<string, number>();
for (const c of classes as { name: string; namespace: string }[]) {
  const byDef = defs.get(c.name) ?? [];
  const bySrc = files.filter((f) => f.endsWith(`${sep}${c.name}.ts`) && f.includes(`${sep}latest${sep}src${sep}ts${sep}`));
  const d = byDef.length > 0 ? byDef : bySrc; // a class with NO Definition (the placed M1Catalog) is located by its ONE src/ts source — named, never skipped
  if (byDef.length === 0) console.log(`P2-ROOT' located by src/ts (no Definition): ${c.name} -> ${d.length} file(s)`);
  if (d.length !== 1) { rootRed.push(`${c.name} (located ${d.length})`); continue; }
  const D = chainOf(d[0]); const C = ownerOf(D); const pkg = isPkg(D);
  const held = `${c.namespace}.${C}` === D, plain = c.namespace === D;
  const cat = c.name === C ? 'own-class' : C !== '' && !pkg ? 'in-nonpkg-component' : C !== '' ? 'in-package-folder' : 'in-namespace-folder';
  const ok = cat === 'own-class' || cat === 'in-nonpkg-component' ? held : plain || held;
  const key = `${cat}:${held ? 'held' : plain ? 'plain' : 'neither'}:${ok ? 'ok' : 'RED'}`;
  cats.set(key, (cats.get(key) ?? 0) + 1);
  if (!ok) rootRed.push(`${c.name} ${cat} ns=${c.namespace} folder=${D}`);
  if (cat === 'in-package-folder' && held) console.log(`P2-ROOT' package-folder HELD: ${c.name} ns=${c.namespace} folder=${D} owner=${C}`);
}
console.log(`P2-ROOT' categories: ${[...cats].map(([k, v]) => `${k}=${v}`).join(' ')}`);

// folder-derived namespaces: every component folder chain + its prefixes (>= 2 segments)
const ns = new Set<string>();
for (const f of files) { if (!f.includes(`${sep}latest${sep}`)) continue; const segs = chainOf(f).split('.'); for (let k = 2; k <= segs.length; k++) ns.add(segs.slice(0, k).join('.')); }
const lit = /(['"`])([^'"`$\n]*?)\1/g;

// P2-LIT': namespace literals in src/ts
const litHits: string[] = [];
for (const f of files.filter((f) => f.includes(`${sep}latest${sep}src${sep}ts${sep}`) && f.endsWith('.ts'))) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => { for (const m of line.matchAll(lit)) if (ns.has(m[2])) litHits.push(`${f.slice(f.lastIndexOf(MARK) + MARK.length)}:${i + 1} '${m[2]}'`); });
}

// LITPKG': the package folder path as a literal in tests
const pkgDef = defs.get(cat.packageModel?.()?.name ?? 'Web4MDA') ?? defs.get('Web4MDA') ?? [];
const pkgChain = pkgDef.length === 1 ? chainOf(pkgDef[0]) : '';
const pkgPathRel = pkgChain.split('.').join('/');
const pkgHits: string[] = [];
for (const f of files.filter((f) => f.endsWith('.test.ts'))) {
  readFileSync(f, 'utf8').split('\n').forEach((line, i) => { for (const m of line.matchAll(lit)) if (pkgPathRel !== '' && m[2].includes(pkgPathRel)) pkgHits.push(`${f.slice(f.lastIndexOf(MARK) + MARK.length)}:${i + 1}`); });
}

// DIAGNOSIS: P2-LIT' own vs foreign; LITPKG' per file + samples
const nsOf = new Map((classes as { name: string; namespace: string }[]).map((c) => [c.name, c.namespace]));
let own = 0; const foreign = new Map<string, number>(); const foreignSites: string[] = [];
for (const h of litHits) {
  const m = /([A-Za-z0-9_]+)\.ts:(\d+) '(.*)'$/.exec(h); if (!m) continue;
  const n = nsOf.get(m[1]); const v = m[3];
  if (n !== undefined && (v === n || v === `${n}.${m[1]}`)) own++; else { foreign.set(v, (foreign.get(v) ?? 0) + 1); if (foreignSites.length < 8) foreignSites.push(h); }
}
console.log(`P2-LIT' own-declaration=${own} foreign=${litHits.length - own} foreignValues: ${[...foreign].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => `${v}x ${k}`).join(' | ')}`);
for (const s of foreignSites) console.log(`  P2-LIT' foreign site: ${s}`);
const perFile = new Map<string, number>(); for (const h of pkgHits) { const f = h.replace(/:\d+$/, ''); perFile.set(f, (perFile.get(f) ?? 0) + 1); }
console.log(`LITPKG' files=${perFile.size} top: ${[...perFile].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([k, v]) => `${v}x ${k.split(sep).pop()}`).join(' | ')}`);
for (const h of pkgHits.slice(0, 4)) { const [f, l] = [h.replace(/:\d+$/, ''), Number(h.split(':').pop())]; const full = files.find((x) => x.endsWith(f)) ?? ''; console.log(`  LITPKG' sample ${f.split(sep).pop()}:${l}: ${readFileSync(full, 'utf8').split('\n')[l - 1]?.trim().slice(0, 150)}`); }
const out = process.env.PROBE_OUT;
if (out) writeFileSync(out, [`# P2-ROOT' RED (${rootRed.length})`, ...rootRed, `# P2-LIT' hits (${litHits.length})`, ...litHits, `# LITPKG' hits (${pkgHits.length}) pkgPath=${pkgPathRel}`, ...pkgHits].join('\n') + '\n');
console.log(`PROBE classes=${classes.length} defsFound=${defs.size} files=${files.length} nsSet=${ns.size} | P2-ROOT' RED=${rootRed.length} | P2-LIT' hits=${litHits.length} in ${files.filter((f) => f.includes(`${sep}latest${sep}src${sep}ts${sep}`)).length} src/ts files | LITPKG' pkgPath=${pkgPathRel} hits=${pkgHits.length} in ${files.filter((f) => f.endsWith('.test.ts')).length} test files`);

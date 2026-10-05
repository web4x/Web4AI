/**
 * oopTester I6 — FOUNDATION gate, exact: render(load(D)) == D byte-identical for EVERY model Definition git lists,
 * and the count is asserted EXACTLY (expected passed as argv[2]; the suite's own test only asserts > 100).
 * Run from the Web4MDA clone root via tsx:  tsx <this> <expectedCount> [--seed]   (exit 1 on any drift or count mismatch)
 * --seed: corrupts the RENDER of the first model in-memory (one trailing byte) to prove the comparison bites.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const W = `${root}/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA`;
const expected = Number(process.argv[2]);
const seed = process.argv.includes('--seed');
const mod = async (p: string): Promise<any> => import(pathToFileURL(p).href);
const { DefinitionSource } = await mod(`${W}/latest/src/ts/EAM/layer2/DefinitionSource.ts`);
const { M1Catalog } = await mod(`${W}/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts`);
const { M1Layout } = await mod(`${W}/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts`);
const defs = execFileSync('git', ['ls-files', 'EAMD.ucp/*Definition.ts'], { encoding: 'utf8' }).split('\n').filter(Boolean);
await M1Catalog.load();
const catalog = new M1Catalog().init();
await M1Layout.load(catalog);
const layout = catalog.homeLayout('');
const drifted: string[] = [];
let checked = 0;
for (const path of defs) {
  const name = (path.split('/').pop() ?? '').replace(/\.ts$/, '');
  const ctor = (await mod(`${root}/${path}`))[name];
  if (ctor === undefined) { drifted.push(`${name}: not exported`); continue; }
  const model = new ctor().model;
  let out: string = new DefinitionSource().definition(model, layout.definitionPrefix(model.name));
  if (seed && checked === 0) out = `${out} `; // a seed that ALWAYS differs (a replace() could be a no-op)
  if (out !== readFileSync(path, 'utf8')) drifted.push(name);
  checked++;
}
console.log(`FOUNDATION: git-listed ${defs.length} (expected ${expected}), CHECKED ${checked}, DRIFTED ${drifted.length}${drifted.length ? ': ' + drifted.join(' ') : ''}${seed ? ' (SEEDED)' : ''}`);
process.exit(defs.length === expected && checked === expected && drifted.length === 0 ? 0 : 1);

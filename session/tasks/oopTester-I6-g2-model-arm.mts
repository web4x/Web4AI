/**
 * oopTester I6 / G2 MODEL ARM — the model's DERIVED dependants (M2AbstractDependency, plan d729ecd I2) must equal the
 * REVERSE of the dependency collection measured by an INDEPENDENT oracle: the import specifiers in the held
 * `src/ts/**.ts` text (file D imports '…/X.js'  ⇒  D depends on X; X = the specifier's basename = the declaring unit).
 * The oracle never calls the derivation code. Tests are outside the model → counted OUTSIDE-MODEL (I3 gap), not failed.
 * By-name references (an IOR class named in a string, never imported) → counted SKIPPED-by-name (oopPO ruling).
 * Run from the Web4MDA clone root:  tsx <this file> [--seed]   (exit 1 on any mismatch; --seed drops ONE derived
 * dependant in-memory to prove the gate RED).
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const W = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA';
const seed = process.argv.includes('--seed');
const files = execFileSync('git', ['ls-files', 'EAMD.ucp'], { encoding: 'utf8' }).split('\n').filter(Boolean);
const base = (p: string): string => (p.split('/').pop() ?? '').replace(/\.(ts|js)$/, '');
const importRe = /^\s*import\s+(?:type\s+)?[^;]*?\bfrom\s+'(\.[^']*)\.js'/gm;

const mod = async (rel: string): Promise<Record<string, unknown>> => import(pathToFileURL(`${root}/${W}/${rel}`).href);
const { M1Catalog } = (await mod('MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts')) as { M1Catalog: any };
const { M2AbstractDependency } = (await mod('MOF/M2/M2AbstractDependency/latest/src/ts/EAM/layer2/M2AbstractDependency.ts')) as { M2AbstractDependency: any };
await M1Catalog.load();
const catalog = new M1Catalog().init();
const dep = new M2AbstractDependency().init().over(catalog);
const modelNames: string[] = [...catalog.classes(), catalog.placedModel()].map((c: { name: string }) => c.name);

// ---- independent oracle: held src/ts text ----
const held = files.filter((f) => /\/src\/ts\/.*\.ts$/.test(f));
const oracleDeps = new Map<string, Set<string>>(); // D -> {X}
for (const f of held) {
  const d = base(f);
  const xs = oracleDeps.get(d) ?? new Set<string>();
  for (const m of readFileSync(f, 'utf8').matchAll(importRe)) {
    const x = base(m[1] ?? '');
    if (x !== d) xs.add(x);
  }
  oracleDeps.set(d, xs);
}
const oracleDependants = (x: string): string[] =>
  [...oracleDeps].filter(([, xs]) => xs.has(x)).map(([d]) => d).sort();

// ---- compare: every model class ----
const sorted = (a: string[]): string[] => [...new Set(a)].sort();
let checkedPairs = 0;
const mismatches: string[] = [];
for (const n of modelNames) {
  let model = sorted(dep.dependants(n));
  if (seed && n === 'Ior') model = model.filter((d) => d !== 'ScenarioUnit'); // SEED: drop one derived dependant
  const oracle = oracleDependants(n).filter((d) => modelNames.includes(d)); // compare inside the model universe
  checkedPairs += oracle.length;
  const missing = oracle.filter((d) => !model.includes(d));
  const extra = model.filter((d) => !oracle.includes(d));
  if (missing.length || extra.length) mismatches.push(`${n}: missing ${JSON.stringify(missing)} extra ${JSON.stringify(extra)}`);
}
const heldNotInModel = [...oracleDeps.keys()].filter((d) => !modelNames.includes(d)).sort();

// ---- outside the model: tests (I3 gap) and by-name references (SKIPPED) ----
const ior = ['Ior','RepositoryId','RepositoryIdModel','ObjectKey','ObjectKeyModel','TaggedProfile','TaggedProfileModel','InternetProfile','InternetProfileModel','TaggedComponent','TaggedComponentModel','SecureTransport','SecureTransportModel','UnknownTaggedComponent'];
let testPathImports = 0;
let skippedByName = 0;
const byNameList: string[] = [];
for (const f of files.filter((p) => p.endsWith('.test.ts'))) {
  const text = readFileSync(f, 'utf8');
  const imported = new Set([...text.matchAll(importRe)].map((m) => base(m[1] ?? '')));
  testPathImports += [...imported].filter((x) => modelNames.includes(x)).length;
  for (const c of ior) if (!imported.has(c) && new RegExp(`['"\`]${c}['"\`]`).test(text)) { skippedByName++; byNameList.push(`${base(f)}:${c}`); }
}

console.log(`G2 MODEL ARM${seed ? ' (SEEDED)' : ''}: model classes ${modelNames.length}, CHECKED dependant pairs ${checkedPairs}, MISMATCHED classes ${mismatches.length}`);
for (const m of mismatches) console.log(`  RED ${m}`);
console.log(`  SKIPPED-by-name (IOR class named in a test string, not imported): ${skippedByName}  ${byNameList.join(' ')}`);
console.log(`  OUTSIDE-MODEL test path-imports of model classes: ${testPathImports}`);
console.log(`  held src/ts files with no model class (not compared): ${heldNotInModel.length}  ${heldNotInModel.join(' ')}`);
console.log(`  TOTAL = CHECKED ${checkedPairs} + SKIPPED ${skippedByName}`);
process.exit(mismatches.length ? 1 : 0);

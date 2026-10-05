// Diagnose the G2 RED: does the MODEL of M1Catalog carry the imports its held source has?
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
const root = process.cwd();
const W = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA';
const mod = async (rel: string): Promise<any> => import(pathToFileURL(`${root}/${W}/${rel}`).href);
const { M1Catalog } = await mod('MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts');
const { M2AbstractDependency } = await mod('MOF/M2/M2AbstractDependency/latest/src/ts/EAM/layer2/M2AbstractDependency.ts');
await M1Catalog.load();
const catalog = new M1Catalog().init();
const dep = new M2AbstractDependency().init().over(catalog);
const placed = catalog.placedModel();
const inClasses = catalog.classes().some((c: { name: string }) => c.name === 'M1Catalog');
const src = readFileSync(`${W}/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts`, 'utf8');
const textImports = [...src.matchAll(/^\s*import\s+(?:type\s+)?[^;]*?\bfrom\s+'(\.[^']*)\.js'/gm)].map((m) => (m[1] ?? '').split('/').pop());
console.log(`M1Catalog in catalog.classes(): ${inClasses}; placedModel name: ${placed.name}; placed.imports: ${placed.imports.length}`);
console.log(`model dependencies('M1Catalog'): ${dep.dependencies('M1Catalog').length} -> ${dep.dependencies('M1Catalog').join(' ')}`);
console.log(`held M1Catalog.ts relative imports: ${textImports.length} -> ${textImports.join(' ')}`);
console.log(`model dependants('M1Catalog'): ${dep.dependants('M1Catalog').join(' ')}`);

// vitest-solo: renders EVERY catalogued class to TypeScript — contention-sensitive (oopTester timeout-class-c41c2a8)
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, realpathSync, renameSync, rmSync, symlinkSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { loadavg } from 'node:os';
import { transformSync } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { ImportModel } from '../../../../../latest/src/ts/EAM/layer3/ImportModel.js';
import { ClassModel } from '../../../../../latest/src/ts/EAM/layer3/ClassModel.js';
import { AttributeModel } from '../../../../../latest/src/ts/EAM/layer3/AttributeModel.js';
import { RelationshipModel } from '../../../../../latest/src/ts/EAM/layer3/RelationshipModel.js';
import { UcpUnit } from '../../../../../latest/src/ts/EAM/layer2/UcpUnit.js';
import { ScenarioUnit } from '../../../../../ScenarioUnit/latest/src/ts/EAM/layer2/ScenarioUnit.js';
import { ScenarioIndex } from '../../../../../ScenarioIndex/latest/src/ts/EAM/layer2/ScenarioIndex.js';
import { Mof } from '../../../../../latest/src/ts/EAM/layer2/Mof.js';
import { M1Catalog } from '../src/ts/EAM/layer2/M1Catalog.js';
import { NodeJSFile } from '../../../../../DefaultFile/latest/src/ts/EAM/layer2/NodeJSFile.js';
import { NodeJSFolder } from '../../../../../DefaultFolder/latest/src/ts/EAM/layer2/NodeJSFolder.js';
import { Web4MDA } from '../../../../../latest/src/ts/EAM/layer2/Web4MDA.js';
import { GateMetrics } from '../../../../../latest/test/GateMetrics.js';
import { PlantUmlServer as PlantUmlServerTs } from '../../../../../PlantUmlServer/latest/src/ts/EAM/layer2/PlantUmlServer.js';
import { RadicalOopGate } from '../../../../../RadicalOopGate/latest/src/ts/EAM/layer2/RadicalOopGate.js';
import { CatalogOracle } from '../../../../../latest/test/CatalogOracle.js';
import { Source } from '../../../../../latest/test/Source.js';
import { Loaded } from '../../../../../latest/test/Loaded.js';
import { M1Layout } from '../../../M1Layout/latest/src/ts/EAM/layer2/M1Layout.js';
import { Child } from '../../../../../latest/test/Child.js';
import { PureLayout } from '../../../../../latest/test/PureLayout.js';
import { Scratch } from '../../../../../latest/test/Scratch.js';
import { M2TypescriptClass } from '../../../../M2/M2TypescriptClass/latest/src/ts/EAM/layer2/M2TypescriptClass.js';
import { M2ES2020Class } from '../../../../M2/M2ES2020Class/latest/src/ts/EAM/layer2/M2ES2020Class.js';
import type { M2AbstractRelationship } from '../../../../M2/M2AbstractRelationship/latest/src/ts/EAM/layer2/M2AbstractRelationship.js';

// pure Thinglish (.thing) layout: ONE owner of the derivation (oopTester's PureLayout, from the MODEL, never the renderer) —
// plan 2026-10-03: every class its own file, every model an interface (nothing inlined, nothing renamed)
const pure = new PureLayout().init(new M1Catalog().init().classes());
const thing = (n: string, isInterface: boolean): string[] => {
  const c = pure.named(n);
  return [`${n}.${isInterface || (c !== undefined && pure.isInterfaceType(c)) ? 'interface' : 'class'}.thing`];
};

/** Source with comment lines and blank lines removed — what generated TS is gated against. */
class NormalizedSource {
  private text = '';
  constructor() {}
  init(text: string): this {
    this.text = text
      .split('\n')
      .filter((l) => l.trim() !== '' && !/^\s*(\/\*\*|\*|\*\/|\/\/)/.test(l))
      // eamd-ucp AC7: MODULO import specifiers — both sides normalised to the imported NAME (src/ is flat, the layout
      // is not). A broken path cannot hide here: M1Layout.test proves every layout import resolves and executes.
      .map((l) => l.replace(/^(import (?:type )?\{[^}]*\} from )'[^']*\/([A-Za-z0-9]+)(?:\.class|\.interface)?\.js';$/, "$1'$2';"))
      .join('\n');
    return this;
  }
  toString(): string {
    return this.text;
  }
}

/**
 * The M1 class files under a source root, found RECURSIVELY (spec/eamd-ucp.md AC1). The ONLY exemption is ONE FILE,
 * `MOF/M1/M1Catalog.ts` (Tron ruling d2cf919: it cannot catalogue itself; it is PLACED, not generated) — by exact path.
 * The meta-level folders are catalogued since spec-11 inc-3 (M3 chunk abeefea, M1+M2 after it). Anything else, at any depth
 * (a loose `MOF/Loose.ts` included), is an M1 class and must be catalogued. The former flat `readdirSync('src')`
 * could not see below `src/`, which is how `MOF/OoshUnit.ts` escaped the catalog.
 */
class M1SourceFiles {
  private root = 'EAMD.ucp/Components';
  constructor() {}
  init(root: string = 'EAMD.ucp/Components'): this {
    this.root = root;
    return this;
  }
  get exempt(): string[] {
    M1SourceFiles.placed ??= M1SourceFiles.placedPath; // derived ONCE per process (a layout per walked file blew the 2.5s budget)
    return [M1SourceFiles.placed]; // the ONE placed MOF unit (Tron d2cf919) — DERIVED, never a hand path
  }
  private static placed: string | undefined = undefined;
  private static readonly generator = new M1Catalog().init(); // asked what it GENERATES — derived, never a directory list
  /** The placed unit's file under the source root, DERIVED from the layout (the repo MIRRORS it, spec/component-model.md rule 6). */
  static get placedPath(): string {
    const catalog = new M1Catalog().init();
    const name = catalog.placedModel().name;
    return `${catalog.homeLayout().classFolder(name, 'ts').path.replace(/^EAMD\.ucp\/Components\//, '')}/${name}.ts`;
  }
  names(): string[] {
    return this.walk('').sort();
  }
  private walk(relative: string): string[] {
    const dir = relative === '' ? this.root : `${this.root}/${relative}`;
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const path = relative === '' ? e.name : `${relative}/${e.name}`;
      if (e.isDirectory()) return new M1Catalog().isScratch(`${this.root}/${path}`) ? [] : this.walk(path); // H3: the ONE exclusion
      if (`/${path}`.includes('/latest/test/')) return []; // AC4b: a component's tests are not classes
      if (`/${path}`.includes('/latest/model/')) return []; // spec 12 rule 4: a component's model sources DEFINE classes, they are not classes
      if (M1SourceFiles.generator.isGenerated(`/${path}`)) return []; // spec 12 rule 6 (a): GENERATED home-language output (thinglish.ts…) is not a source
      if (this.exempt.includes(path)) return [];
      return e.name.endsWith('.ts') ? [e.name.replace(/\.ts$/, '')] : [];
    });
  }
}

/**
 * The abstract/concrete split judged by LAW (INC-1b): every catalogued class is filed exactly once, abstract iff its
 * own model says `isAbstract`, and interfaces are a subset of the abstract ones. The truth is each model's flag —
 * never a pinned list, and never the split compared with itself.
 */
class CatalogSplit {
  private catalog: M1Catalog = new M1Catalog().init();
  constructor() {}
  init(catalog: M1Catalog): this {
    this.catalog = catalog;
    return this;
  }
  violations(): string[] {
    const abstract = this.catalog.abstractClasses();
    const concrete = this.catalog.concreteClasses();
    const filed = [...abstract, ...concrete].map((c) => c.name);
    const all = new CatalogOracle().init(new M1Catalog().init()).names;
    return [
      ...all.filter((n) => !filed.includes(n)).map((n) => `unfiled ${n}`),
      ...all.filter((n) => filed.filter((f) => f === n).length > 1).map((n) => `twice ${n}`),
      ...abstract.filter((c) => !c.isAbstract).map((c) => `abstract-listed but not abstract ${c.name}`),
      ...concrete.filter((c) => c.isAbstract).map((c) => `concrete-listed but abstract ${c.name}`),
      ...this.catalog.interfaceClasses().filter((c) => !abstract.some((a) => a.name === c.name)).map((c) => `interface not abstract-listed ${c.name}`),
    ];
  }
}

describe('M1Catalog', () => {
  const root = new Scratch().at(import.meta.url).fixture('web4mda-gen');
  afterAll(() => rmSync(root, { recursive: true, force: true }));
  let generated: string[] = []; // produced ONCE before any arm: every test that reads the tree is self-sufficient (runs alone under -t)
  beforeAll(async () => {
    generated = await new M1Catalog().init().generate(root); // home = the tmp root: a test NEVER writes the real EAMD.ucp/Components/ tree
  }, 120000);

  it('has the radical-OOP shape (spec §3)', () => {
    expect(new RadicalOopGate().init().check(M1Catalog)).toEqual([]);
  });

  it('every generation step ends with its process constructor — a silent no-op pipeline is RED (mof.md §6, as amended: the chain is Web4MDA.steps, not package.json)', () => {
    const steps = new Web4MDA().init().steps;
    expect(steps.length).toBeGreaterThanOrEqual(4);
    for (const file of steps) {
      const source = readFileSync(file, 'utf8');
      const klass = /export class (\w+)/.exec(source)?.[1] ?? '';
      expect(klass, file).not.toBe('');
      expect(source.trimEnd().endsWith(`${klass}.start();`), `${file} must end with ${klass}.start();`).toBe(true);
    }
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts: Record<string, string> };
    expect(Object.keys(pkg.scripts), 'exactly the TWO verbs start and test (bootstrap.md AC2, amended 2026-09-28)').toEqual(['start', 'test']);
  });

  it('lists exactly the M1 classes that exist as files in src/, RECURSIVELY, exempting only src/MOF/M1/M1Catalog.ts (measured on disk; eamd-ucp AC1, Tron d2cf919)', () => {
    const onDisk = new M1SourceFiles().init().names();
    const catalogued = new M1Catalog().init().classes().map((c) => c.name).sort();
    expect(catalogued).toEqual(onDisk);
  });

  it('every catalogued class has a distinct, once-minted uuid (D1)', () => {
    const uuids = new M1Catalog().init().classes().map((c) => c.uuid);
    expect(uuids.every((u) => /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(u))).toBe(true);
    expect(new Set(uuids).size).toBe(uuids.length);
    expect(new M1Catalog().init().classes().map((c) => c.uuid)).toEqual(uuids);
  });

  it('splits abstract and concrete classes — the PARTITION LAW against the flags of every model, never a pinned list (INC-1b)', () => {
    const catalog = new M1Catalog().init();
    expect(new CatalogSplit().init(catalog).violations()).toEqual([]);
    const interfaceNames = catalog.interfaceClasses().map((c) => c.name);
    expect(catalog.interfaceClasses().every((c) => c.isAbstract && (c.superclass === 'Interface' || interfaceNames.includes(c.superclass.replace(/<.*>$/, ''))))).toBe(true);
  });

  it('INC-1b: the partition law is FAILABLE — a split that drops a concrete class, or files a concrete class as abstract, is RED', () => {
    class Dropping extends M1Catalog {
      override concreteClasses(): ReturnType<M1Catalog['concreteClasses']> {
        return super.concreteClasses().slice(1);
      }
    }
    const first = new M1Catalog().init().concreteClasses()[0]?.name ?? '';
    expect(new CatalogSplit().init(new Dropping().init()).violations()).toEqual([`unfiled ${first}`]);
    class Misfiling extends M1Catalog {
      override abstractClasses(): ReturnType<M1Catalog['abstractClasses']> {
        return [...super.abstractClasses(), ...super.concreteClasses().slice(0, 1)];
      }
    }
    expect(new CatalogSplit().init(new Misfiling().init()).violations()).toEqual([`twice ${first}`, `abstract-listed but not abstract ${first}`]);
  });

  const names = new M1Catalog().init().classes().map((c) => c.name); // derived from ground truth, never a hand list (AC4 coverage law)

  const interfaces = new M1Catalog().init().interfaceClasses().map((c) => c.name); // derived from the model, never a hand list (Process joined in spec 12 inc 3)

  // eamd-ucp AC5: the generated tree is the ONLY address — every read asks the layout for the class's Folder.
  const catalog = new M1Catalog().init();
  const home = catalog.homeLayout(root); // spec 12 rule 6 (a): EVERY generated language lives in its component (<root>/Components/…)
  const where = (name: string, directory: string): string => home.classFolder(name, directory).path;

  it('generate() writes every class in every language the components do NOT hold — the set and order DERIVED from languages(), never the held one (spec 12 AC6); per-file naming an independent oracle', async () => {
    const written = generated.map((p) => p.slice(root.length + 1));
    const svgReachable = await new PlantUmlServerTs().init().isReachable();
    const at = (n: string, directory: string, file: string): string => `${where(n, directory).slice(root.length + 1)}/${file}`;
    const placed = 'M1Catalog'; // the ONE placed MOF unit (Tron d2cf919, design (a) 4e9ae61): after the catalogued classes, in every CODE language
    expect(written.filter((p) => p.includes('/src/ts/')), 'no TypeScript is generated: the components hold it (spec 12 AC6, rule 6)').toEqual([]);
    // oopTester Step B: the TARGET SET and ORDER are DERIVED — every language of the generator, in ITS order, minus the
    // HELD one — so a new target is covered the moment it is registered. The per-file NAMING stays an INDEPENDENT oracle
    // written by the gate owner (never derived from the code under test); a generated language with NO naming entry is RED.
    const kind = (n: string): string => (interfaces.includes(n) ? 'interface' : 'class');
    const naming: Record<string, (n: string) => string> = {
      js: (n) => `${n}.js`,
      'thinglish.ts': (n) => `${n}.${kind(n)}.ts`,
      'thinglish.js': (n) => `${n}.${kind(n)}.js`,
      puml: (n) => `${n}.puml`,
      mmd: (n) => `${n}.mmd`,
      thinglish: (n) => thing(n, interfaces.includes(n))[0] ?? '',
    };
    const fileOf = (d: string, n: string): string => (naming[d] ?? (() => `<no naming oracle for ${d}>`))(n);
    const held = catalog.heldLanguage.directory;
    const order = catalog.languages().map((l) => l.directory).filter((d) => d !== held);
    expect(order.filter((d) => naming[d] === undefined), 'a generated language with NO naming oracle — the gate owner must add it').toEqual([]);
    expect(Object.keys(naming).filter((d) => !order.includes(d)), 'a naming entry for a language the generator does not write').toEqual([]);
    const codeLanguages = ['js', 'thinglish.ts', 'thinglish.js']; // the placed unit is placed in the CODE languages only (measured d4ba49b: no .thing for M1Catalog)
    const expected = order.flatMap((d) => [
      ...names.filter((n) => d !== 'thinglish' || thing(n, interfaces.includes(n)).length > 0).flatMap((n) => (d === 'puml' && svgReachable ? [at(n, 'puml', fileOf('puml', n)), at(n, 'svg', `${n}.svg`)] : [at(n, d, fileOf(d, n))])),
      ...(codeLanguages.includes(d) ? [at(placed, d, fileOf(d, placed))] : []),
    ]);
    expect(written).toEqual(expected);
  });

  it('generated puml + mmd carry each class by name and uuid', () => {
    const catalog = new M1Catalog().init();
    for (const c of catalog.classes()) {
      expect(readFileSync(`${where(c.name, 'puml')}/${c.name}.puml`, 'utf8')).toContain(`${c.isInterface ? 'interface' : 'class'} ${c.name}`);
      expect(readFileSync(`${where(c.name, 'puml')}/${c.name}.puml`, 'utf8')).toContain(c.uuid);
      expect(readFileSync(`${where(c.name, 'mmd')}/${c.name}.mmd`, 'utf8')).toContain(`class ${c.name}${c.typeParameters.length === 0 ? '' : `~${c.typeParameters.map((t) => t.split(' ')[0] ?? t).join(', ')}~`} {`);
      expect(readFileSync(`${where(c.name, 'mmd')}/${c.name}.mmd`, 'utf8')).toContain(c.uuid);
    }
  });

  it('generated svg is a rendered class diagram per class (skipped when no PlantUML server is reachable)', async (ctx) => {
    if (!(await new PlantUmlServerTs().init().isReachable())) ctx.skip();
    for (const name of names) {
      const svg = readFileSync(`${where(name, 'svg')}/${name}.svg`, 'utf8');
      expect(svg, name).toMatch(/^<svg /);
      expect(svg, name).toContain(name);
      expect(svg, name).not.toContain('Welcome to PlantUML');
    }
  });

  it('the TypeScript rendering is the components\' own src (modulo comments/blank lines) — rendered in memory, never read back from generated output (spec 12 AC6)', () => {
    const catalog = new M1Catalog().init();
    const ts = catalog.heldLanguage;
    ts.within(catalog.homeLayout()); // address math only: the repo MIRRORS the layout, so the rendered specifiers are src's
    for (const name of names) {
      const src = new NormalizedSource().init(readFileSync(new Source().init().of(name), 'utf8')).toString();
      const rendered = new NormalizedSource().init(ts.create(catalog.classNamed(name)).toSource()).toString();
      expect(rendered, name).toBe(src);
    }
  });

  it('generated JS is browser-ready ES module syntax: no types, no TS keywords, no node: imports, no bare process', () => {
    for (const name of names) {
      const js = readFileSync(`${where(name, 'js')}/${name}.js`, 'utf8');
      // "no types, no TS keywords" is judged by a JAVASCRIPT PARSER, not by spelling: every annotation, generic argument,
      // cast, type predicate and TS modifier is a syntax error in JS, while the same words as DATA (the TS renderer's
      // templates hold 'abstract', 'override', ': string') are legal — the spelling regex REDed on data and was blind to
      // `: RelationshipModel[]`, `new Set<string>()`, `as X` (spec-11 inc-3 M1/M2 chunk measured all of them).
      expect(() => transformSync(js, { loader: 'js', format: 'esm' }), name).not.toThrow();
      expect(js, name).not.toMatch(/from 'node:/);
      expect(js, name).not.toMatch(/(?<![.\w])process\./);
      expect(js, name).toMatch(/^(import .* from '(?:\.\/|(?:\.\.\/)+)[\w./]+\.js';\n)*\n?export class \w+/);
    }
  });

  it('the browser JS gate is failable: a JS parser REDs every TS residue the M1/M2 bodies carried, and stays GREEN on the same words as data (seed -> RED)', () => {
    const parses = (js: string): boolean => {
      try {
        transformSync(js, { loader: 'js', format: 'esm' });
        return true;
      } catch {
        return false;
      }
    };
    const residue = [
      'const lines: string[] = [];',
      'const edges: RelationshipModel[] = [];',
      'const seen = new Set<string>();',
      'const visit = (name: string): void => {};',
      'const ctor = (m as Record<string, X>)[k];',
      'const us = xs.filter((v): v is U => v instanceof U);',
      'class A { private x = 1; }',
      'abstract class B {}',
      'class C extends D { override y = 1; }',
    ];
    for (const seed of residue) expect(parses(`export class S {\n  m() {\n    ${seed}\n  }\n}\n`), seed).toBe(false);
    expect(parses("export class S {\n  m(a) {\n    return `export abstract class ${a}: string { private override x }`;\n  }\n}\n")).toBe(true); // words as DATA
  });

  it('design (a): the PLACED M1Catalog is the src file re-pointed — its thinglish.ts equals src/MOF/M1/M1Catalog.ts except import specifiers, JS is real JS; no TS copy (the component holds it); a drift is SEEN', () => {
    const specifierless = (t: string): string => t.replace(/^(import (?:type )?\{ \w+ \} from ')[^']*(';)$/gm, '$1$2');
    const src = readFileSync(new Source().init().of('M1Catalog'), 'utf8');
    expect(existsSync(`${where('M1Catalog', 'ts')}/M1Catalog.ts`), 'no placed TypeScript mirror (spec 12 AC6)').toBe(false);
    const ts = readFileSync(`${where('M1Catalog', 'thinglish.ts')}/M1Catalog.class.ts`, 'utf8');
    expect(specifierless(ts)).toBe(specifierless(src));
    expect(ts).not.toBe(src); // re-pointed: the thinglish specifiers name .class.js files
    const js = readFileSync(`${where('M1Catalog', 'js')}/M1Catalog.js`, 'utf8');
    expect(() => transformSync(js, { loader: 'js', format: 'esm' })).not.toThrow();
    expect(js).toMatch(/^(export )?class M1Catalog extends UcpComponent \{$/m);
    expect(js).toMatch(/^export class M1Catalog |^export \{[^}]*\bM1Catalog\b[^}]*\};?$/m); // exported, in either ESM spelling
    const drift = ts.replace('placedModel(): ClassModel {', 'placedModel(): ClassModel { // drift'); // the seed
    expect(drift).not.toBe(ts);
    expect(specifierless(drift)).not.toBe(specifierless(src));
  });

  it('generated JS is semantically identical: it executes as ES modules with the same behaviour', async () => {
    const jsClass = async (name: string): Promise<new () => unknown> => {
      const module = (await import(pathToFileURL(`${where(name, 'js')}/${name}.js`).href)) as Record<string, new () => unknown>;
      const ctor = module[name];
      if (ctor === undefined) throw new Error(`${name} not exported`);
      return ctor;
    };
    const Model = await jsClass('Model');
    const ModelUnit = await jsClass('ModelUnit');
    const ItemModel = await jsClass('ItemModel');
    const Web4MDAModel = await jsClass('Web4MDAModel');
    const Web4MDA = await jsClass('Web4MDA');
    const w = new Web4MDA() as { isInitialized: boolean; describe(): string; init(): unknown };
    expect(w.isInitialized).toBe(false);
    expect(w.describe()).toBe('Web4MDA (uninitialized)');
    expect(w.init()).toBe(w);
    expect(w.isInitialized).toBe(true);
    expect(w.describe()).toBe('Web4MDA v0.1.0');
    const model = new Web4MDAModel() as { uuid: string; name: string; displayName: string; icon: string; badge: string; description: string };
    expect(new Web4MDAModel()).toBeInstanceOf(ItemModel);
    expect(new Web4MDAModel()).toBeInstanceOf(ModelUnit);
    const concreteModels = new M1Catalog().init().concreteClasses().filter((c) => c.name.endsWith('Model') && c.name !== 'Web4MDAModel').map((c) => c.name); // derived from the catalog (gating canon)
    expect(concreteModels.length).toBeGreaterThanOrEqual(8);
    for (const name of concreteModels) {
      const instance = new (await jsClass(name))() as { displayName: string; icon: string; badge: string; description: string };
      expect(instance, name).toBeInstanceOf(ItemModel);
      expect([instance.displayName, instance.icon, instance.badge, instance.description], name).toEqual(['', 'symbol-misc', 'M1', 'a Web4MDA unit']); // central defaults (Defaults) — generated JS carries them too
    }
    expect([model.displayName, model.icon, model.badge, model.description]).toEqual(['Web4 MDA', 'symbol-structure', 'M1', 'Web4 Model-Driven Architecture']);
    expect(new Web4MDAModel()).toBeInstanceOf(Model);
    expect(model.name).toBe('');
    expect(model.uuid).toMatch(/^[0-9a-f-]{36}$/);
    expect(Web4MDA.length).toBe(0);
    const UcpComponent = await jsClass('UcpComponent');
    expect(w).toBeInstanceOf(UcpComponent);
    const displayable = w as unknown as { name: string; displayName: string; icon: string };
    expect([displayable.name, displayable.displayName, displayable.icon]).toEqual(['Web4MDA', 'Web4 MDA', 'symbol-structure']);
    const bare = new (await jsClass('PlantUmlServer'))() as { init(): { name: string; displayName: string } };
    expect([bare.init().name, bare.init().displayName]).toEqual(['PlantUmlServer', 'PlantUmlServer']);
    const RadicalOopGate = await jsClass('RadicalOopGate');
    const gate = new RadicalOopGate() as { init(): { check(ctor: unknown): string[] } };
    expect(gate.init().check(Web4MDA)).toEqual([]);
    class Broken {
      isInitialized = true;
      constructor(_a: number) {}
      init(): this {
        return this;
      }
    }
    expect(gate.init().check(Broken)).toEqual([
      'Broken: constructor takes 1 parameter(s), must take 0',
      'Broken: model before init() is undefined, must be {}',
      'Broken: isInitialized is true before init()',
    ]);
    const PlantUmlServer = await jsClass('PlantUmlServer');
    const server = new PlantUmlServer() as { init(): { encode(s: string): Promise<string>; url: string } };
    // (PlantUmlServer class already fetched above as `bare`)
    expect(await server.init().encode('@startuml\nclass A\n@enduml')).toMatch(/^[0-9A-Za-z_-]{10,}$/);
    expect(await server.init().encode('@startuml\nclass A\n@enduml')).toBe(await new PlantUmlServerTs().init().encode('@startuml\nclass A\n@enduml'));
  });

  it('a node: import is UNREPRESENTABLE (rule 8): an import names its declaring CLASS, so the specifier is always derived relative — never a bare module', () => {
    const catalog = new M1Catalog().init();
    const c = catalog.classNamed('Web4MDA');
    const seeded = new ImportModel();
    seeded.name = 'pathToFileURL';
    seeded.declaredBy = 'node:url'; // the seed: try to smuggle a platform module in as a "class"
    c.imports.unshift(seeded);
    const js = catalog.languages()[1]?.create(c).toSource() ?? '';
    expect(js).not.toMatch(/from 'node:/);
    expect(js).toContain("import { pathToFileURL } from './node:url.js';");
    expect(() => catalog.languages()[1]?.within(home).create(c).toSource()).toThrow(/'node:url' is not a catalogued class/);
  });
});

describe('M1Catalog · FAILABILITY (oopTester RANK-1): catalog-lists-EXACTLY the recursive src scan', () => {
  it('eamd-ucp AC1 is failable: a LOOSE src/MOF/Loose.ts (the OoshUnit hole) is SEEN; every meta-level file is SEEN except exactly src/MOF/M1/M1Catalog.ts — a 2nd uncatalogued MOF file REDs', () => {
    const root = new Scratch().at(import.meta.url).fixture('web4mda-src');
    try {
      for (const d of ['MOF/M1', 'MOF/M2', 'MOF/M3']) mkdirSync(`${root}/${d}`, { recursive: true });
      writeFileSync(`${root}/Real.ts`, '');
      mkdirSync(dirname(`${root}/${M1SourceFiles.placedPath}`), { recursive: true });
      writeFileSync(`${root}/${M1SourceFiles.placedPath}`, ''); // the exempt path, DERIVED
      expect(new M1SourceFiles().init(root).names()).toEqual(['Real']); // GREEN shape: the ONE exemption is honoured
      mkdirSync(`${root}/Comp/latest/model`, { recursive: true });
      mkdirSync(`${root}/Comp/latest/src/ts/EAM/layer2`, { recursive: true });
      writeFileSync(`${root}/Comp/latest/model/CompDefinition.ts`, ''); // a model source: not a class
      writeFileSync(`${root}/Comp/latest/src/ts/EAM/layer2/Comp.ts`, ''); // its class: SEEN
      writeFileSync(`${root}/Comp/latest/modelx.ts`, ''); // a look-alike beside it: SEEN (the rule is the model/ FOLDER, never a prefix)
      expect(new M1SourceFiles().init(root).names()).toEqual(['Comp', 'Real', 'modelx']);
      rmSync(`${root}/Comp`, { recursive: true });
      for (const level of ['M1', 'M2', 'M3']) {
        writeFileSync(`${root}/MOF/${level}/${level}Machinery.ts`, ''); // the seed: a 2nd uncatalogued MOF file, at every level
        expect(new M1SourceFiles().init(root).names()).toEqual([`${level}Machinery`, 'Real']); // SEEN -> the exact-match gate would RED
        rmSync(`${root}/MOF/${level}/${level}Machinery.ts`);
      }
      mkdirSync(`${root}/MOF/M2/M1`, { recursive: true });
      writeFileSync(`${root}/MOF/M2/M1Catalog.ts`, ''); // same NAME, other folder: the exemption is the exact PATH, never the name
      writeFileSync(`${root}/MOF/M2/M1/M1Catalog.ts`, '');
      expect(new M1SourceFiles().init(root).names()).toEqual(['M1Catalog', 'M1Catalog', 'Real']);
      rmSync(`${root}/MOF/M2/M1Catalog.ts`);
      rmSync(`${root}/MOF/M2/M1`, { recursive: true });
      writeFileSync(`${root}/MOF/Loose.ts`, ''); // the seed
      expect(new M1SourceFiles().init(root).names()).toEqual(['Loose', 'Real']); // SEEN -> the exact-match gate would RED
      expect(readdirSync(root).filter((f) => f.endsWith('.ts'))).toEqual(['Real.ts']); // the OLD flat scan is blind to it
      // recursive EVERYWHERE, not just MOF: an off-list depth is seen
      mkdirSync(`${root}/some/deep`, { recursive: true });
      writeFileSync(`${root}/some/deep/Deep.ts`, '');
      // the exemption is POSITIONAL BY DIRECTORY (equality, never a prefix): look-alikes of MOF/M1 are seen
      writeFileSync(`${root}/MOF/M1Loose.ts`, '');
      mkdirSync(`${root}/MOF/M1x`, { recursive: true });
      writeFileSync(`${root}/MOF/M1x/Lookalike.ts`, '');
      expect(new M1SourceFiles().init(root).names()).toEqual(['Deep', 'Lookalike', 'Loose', 'M1Loose', 'Real']);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('is failable: the exact-match gate catches an uncatalogued src class AND a dropped catalog entry', () => {
    const onDisk = new M1SourceFiles().init().names();
    const catalogued = new M1Catalog().init().classes().map((c) => c.name).sort();
    expect(catalogued).toEqual(onDisk); // the gate, green on the real tree
    expect(catalogued).not.toEqual([...onDisk, 'M2Ghost'].sort()); // an uncatalogued src class WOULD break it
    expect(catalogued.slice(0, -1)).not.toEqual(onDisk); // a DROPPED catalog entry WOULD break it
  });
});

/**
 * What M1Catalog may HOLD once the models are the components' own (spec 12 rules 4+5, inc 5b B2): no model data and no
 * literal list. Judged over its SOURCE TEXT against the LOADED catalog (derived): exactly ONE `new ClassModel().init({`
 * (its own placedModel — the placed unit cannot come from a model source it is the loader of), and no catalogued class
 * name as a string literal (a hand list of names, a per-class entry method, a `defined('X')` slot — every spelling holds one).
 */
class CatalogHoldings {
  private names: string[] = [];
  constructor() {}
  init(names: string[]): this {
    this.names = names;
    return this;
  }
  entryLiterals(text: string): number {
    return [...text.matchAll(/new ClassModel\(\)\.init\(\{/g)].length;
  }
  /** Literal names in CODE: comments stripped, and the ONE sanctioned held model — placedModel()'s body, cut by its method boundary — excepted positionally. */
  namedLiterals(text: string): string[] {
    const start = text.indexOf('  placedModel(): ClassModel {\n');
    const end = start < 0 ? -1 : text.indexOf('\n  }\n', start);
    const code = (start < 0 || end < 0 ? text : text.slice(0, start) + text.slice(end + 4))
      .split('\n')
      .filter((l) => !/^\s*(\/\*\*|\*|\*\/|\/\/)/.test(l))
      .join('\n');
    return this.names.filter((n) => new RegExp(`['"\`]${n}['"\`]`).test(code));
  }
}

describe('M1Catalog holds NO model data and NO literal list (spec 12 inc 5b B2; oopPO: the A claim "classNamed replaces the 74 entry methods" was false at A — 72 remained until B1)', () => {
  const names = new M1Catalog().init().classes().map((c) => c.name);
  const text = readFileSync(new Source().init().of('M1Catalog'), 'utf8');

  it('GREEN on the real source: ONE init literal (placedModel) and NO catalogued name as a literal — every per-class entry method is gone', () => {
    expect(names.length).toBeGreaterThan(60);
    const holdings = new CatalogHoldings().init(names);
    expect(holdings.entryLiterals(text)).toBe(1);
    expect(holdings.namedLiterals(text)).toEqual([]);
    expect(text).not.toMatch(/^  \w+Class\(\): ClassModel \{$/m);
  });

  it('is failable: a seeded per-class entry method, a seeded literal name list and a seeded defined() slot are each SEEN (seed -> RED)', () => {
    const holdings = new CatalogHoldings().init(names);
    const entry = text.replace('  classes(): ClassModel[] {', "  fileServerClass(): ClassModel {\n    return new ClassModel().init({\n      name: 'FileServer',\n    });\n  }\n\n  classes(): ClassModel[] {");
    expect(holdings.entryLiterals(entry)).toBe(2);
    expect(holdings.namedLiterals(entry)).toEqual(['FileServer']);
    const list = text.replace('  classes(): ClassModel[] {', "  order = ['Model', 'FileServer'];\n\n  classes(): ClassModel[] {");
    expect(holdings.namedLiterals(list).sort()).toEqual(['FileServer', 'Model']);
    const slot = text.replace('  classes(): ClassModel[] {', '  classes(): ClassModel[] {\n    this.defined(`UcpUnit`);');
    expect(holdings.namedLiterals(slot)).toEqual(['UcpUnit']);
    const outside = text.replace('  placedModel(): ClassModel {', "  extra = 'Folder';\n\n  placedModel(): ClassModel {"); // right beside the excepted body: still SEEN
    expect(holdings.namedLiterals(outside)).toEqual(['Folder']);
  });

  it('rule 5: a process that NEVER loads gets classes() -> THROW (exit 1, the message); a loaded control exits 0 (through Child, the sanctioned spawner)', () => {
    const url = pathToFileURL(new Source().init().of('M1Catalog')).href;
    const run = (code: string) => Child.spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `import { M1Catalog } from '${url}';\n${code}`], { encoding: 'utf8' });
    const unloaded = run('new M1Catalog().init().classes();');
    expect(unloaded.status).toBe(1);
    expect(unloaded.stderr).toContain('M1Catalog: not loaded — await M1Catalog.load() once per process before classes() (spec 12 rule 5)');
    const loaded = run('await M1Catalog.load();\nprocess.stdout.write(String(new M1Catalog().init().classes().length));');
    expect(loaded.status).toBe(0);
    expect(Number(loaded.stdout)).toBe(names.length);
  }, 15000); // budget: two tsx child processes, 1.4 s measured alone; ~2.5x a full-load estimate
});

/**
 * R7a (spec/scenario.md §1, Tron 2026-10-08; ruling A): the generate path FILLS the live store — one scenario per catalogued
 * CLASS (its ClassModel as data in a ScenarioUnit, uuid = the ClassModel's stable catalog uuid). Every expectation is DERIVED
 * from the catalog; the gates read the COMMITTED store of this checkout; the seeds run on a scratch copy.
 */
describe('R7a — the live store holds EVERY catalogued class, once, idempotently (EAMD.ucp/Scenario/Index)', () => {
  /**
   * A SCRATCH store home WITH its package folder: part links project below EAMD.ucp/Components, the ONE root (oopPO P5 —
   * no search; the interim `locate` is gone). The package folder MIRRORS the real one: its path comes from the LAYOUT (the Package's own `latest`), never a
   * hand-written domain (oopPO R4) — so every link the store writes sits exactly where the link audits derive it.
   */
  const packageHome = async (fixture: string): Promise<string> => {
    const home = `${new Scratch().at(import.meta.url).fixture(fixture)}/`;
    await new NodeJSFolder().init({ name: `${home}${new M1Catalog().init().homeLayout().packageFolder().path}` }).create();
    return home;
  };

  /** The stored scenario files below an Index root, as uuids, and their bytes. */
  class StoreAudit {
    root = '';
    constructor() {}
    init(root: string): this {
      this.root = root;
      return this;
    }
    files(dir: string = this.root): string[] {
      if (!existsSync(dir)) return [];
      return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? this.files(`${dir}/${e.name}`) : e.name.endsWith('.scenario.json') ? [`${dir}/${e.name}`] : []));
    }
    uuids(): string[] {
      return this.files().map((f) => (f.split('/').pop() ?? '').replace(/\.scenario\.json$/, '')).sort();
    }
    bytes(): Map<string, string> {
      return new Map(this.files().map((f) => [f, readFileSync(f, 'utf8')]));
    }
    /** S3 (rule C): the files of OWNER units — `ownerIor` empty: the classes. Every other Index file is a PART unit. */
    classFiles(): string[] {
      return this.files().filter((f) => (JSON.parse(readFileSync(f, 'utf8')) as { ownerIor: string }).ownerIor === '');
    }
    classUuids(): string[] {
      return this.classFiles().map((f) => (f.split('/').pop() ?? '').replace(/\.scenario\.json$/, '')).sort();
    }
    /** The catalogued classes WITHOUT a scenario — named, so a RED says which unit. */
    missing(catalog: M1Catalog): string[] {
      const stored = new Set(this.uuids());
      return catalog.classes().filter((c) => !stored.has(c.uuid)).map((c) => c.name);
    }
    /** The OWNER files whose uuid is NO catalogued class — named: with missing() they name every off-by-one of the owner count. */
    strays(catalog: M1Catalog): string[] {
      const catalogued = new Set(catalog.classes().map((c) => c.uuid));
      return this.classUuids().filter((u) => !catalogued.has(u));
    }
  }

  const live = (): StoreAudit => new StoreAudit().init('EAMD.ucp/Scenario/Index');
  const GET_CPU_BUDGET = 5; // 1.5 x max of 2.93 / 3.07 / 3.04 CPU-s (OwnCpu, @798a5ad0 incl. S3.3, box load 8-10) = 4.6, rounded up
  // FIRST store: its CPU as a RATIO to a same-run REFERENCE is a REPORTED METRIC, NOT A GATE (oopPO F4 round 2, 2026-10-12, its
  // explicit rule: "if the clean/seed band is still narrow, demote the ratio to a reported metric and rely on N1"). Every run
  // RECORDS it (GateMetrics, asserted present) and prints it; nothing asserts it under a threshold. MEASURED, the condition the
  // gate would run in — 14 WHOLE-SUITE runs, fresh clone each, clean and seeded INTERLEAVED (tmp/f4r2-campaign.sh @ eeb63c80/b3a83b45),
  // 9 reference samples recorded per run, the ratio re-computed offline for a k-sample median (= the first k of the 9):
  //   k=1 clean max 13.526 / seed min 12.326 (OVERLAP) · k=3 13.458 / 12.762 (OVERLAP) · k=5 13.358 / 12.762 (OVERLAP)
  //   k=7 12.908 / 13.756 (gap 0.848) · k=9 12.149 / 14.107 (gap 1.958, equal-z 12.88 = 2.5 sd) — n = 8 clean / 6 seed.
  // The old threshold 11.8 (claimed "whole-suite clean max 10.431", 3.3 sd) false-REDs clean run 4 even at k=9 (12.149): the
  // noise is LOAD DRIFT INSIDE a run (run 4: six low reference samples in a row, 0.397-0.457, then 0.533-0.6), which a median
  // cannot remove; only a time-average over 9x the reference work separates, and narrower than the derivation that already broke.
  // So no separating threshold is sound. The held-root regression stays caught by the N1 MECHANISM gate (deterministic, F1 arm).
  const REFERENCE_SAMPLES = 3; // DERIVED (F4 round 2): ISOLATED low samples (< 0.8 x their run's median-of-9) = 5 of 126 = p 0.040; the
  // smallest odd k whose median is wrong (>= (k+1)/2 low samples) under 1%: k=3 -> 3p^2 - 2p^3 = 0.47%. Larger k removes no more
  // (k=5 clean max 13.358 vs k=3 13.458: drift, not outliers). The median of 3 steadies the REPORTED number; it gates nothing.
  const REFERENCE_CPU_FLOOR = 0.1; // 0.25 x min reference reading 0.51 CPU-s (over the 18 F1 runs above) = 0.13, rounded DOWN to a 0.05 step = 0.10; re-checked whole-suite (F4, 18 runs): min 0.411 -> 0.25 x = 0.103, the floor holds
  const STORE_CPU_BUDGET = 5; // O3 (oopPO decision 2026-10-10): 1.5 x max of 2.33 / 2.85 / 2.82 CPU-s (OwnCpu, final O3 code: full suite + 2 isolated) = 4.3, rounded up. RE-DERIVED, not raised: the 2nd store() now PRUNES and prune lists the WHOLE store by design (derive ~0.25 CPU-s, listing dominates, profiled); was 1.5 x 1.16 = 2 before O3. A recursive NodeJSFolder listing (Folder interface) is ranked after S4
  // FLOORS (F-B, oopTester 11ae877d): a guard with no lower bound passes on a ZERO reading (wrong field, a span that misses
  // the work, work moved where the instrument cannot see). Floor = 0.25 x the MIN of the same measurements, rounded DOWN to 0.05.
  const GET_CPU_FLOOR = 0.7; // 0.25 x min 2.93 = 0.73
  const FIRST_STORE_CPU_FLOOR = 1.05; // 0.25 x min 4.32 = 1.08, rounded down to 0.05 (S4b + held roots, oopPO N1)
  const STORE_CPU_FLOOR = 0.55; // 0.25 x min 2.33 = 0.58 (O3 re-derivation, same readings as the budget), rounded down like its siblings

  /**
   * STORE SPEED GUARD (flake fix 2026-10-10, oopPO priority 1; the in-process twin of Pipeline.test's CHAIN SPEED GUARD):
   * the CPU seconds THIS process burns over a measured span — `process.cpuUsage()` is process-wide, so libuv's fs thread
   * pool is included. Cross-session load inflated these two arms' WALL time >= 3x (2.7s alone → timed out at 8.5s at
   * S3.3 9f3d427e); CPU is load-robust, so the wall budgets can be generous flake protection while a SLOWER store/get is
   * caught HERE, by name. Each budget = 1.5 x the max of 3 measurements by this instrument (see each arm), rounded up.
   */
  class OwnCpu {
    private budget = 0;
    private floor = 0;
    private label = '';
    private start = 0;
    constructor() {}
    init(label: string, budget: number, floor: number): this {
      this.label = label;
      this.budget = budget;
      this.floor = floor;
      this.start = this.reading();
      return this;
    }
    /** The process-wide CPU seconds so far — THE instrument (a zeroed instrument overrides only this). */
    protected reading(): number {
      const u = process.cpuUsage();
      return (u.user + u.system) / 1e6;
    }
    /** Freezes the span here — a RATIO reads two spans after both ended (S4b N1). */
    stop(): this {
      this.end = this.reading();
      return this;
    }
    private end: number | undefined = undefined;
    /** The CPU seconds of the span measured since init (until stop(), when stopped). */
    get cpu(): number {
      return (this.end ?? this.reading()) - this.start;
    }
    /** The violations of the span — empty is green; a named sentence for a span UNDER its floor (measured nothing) or OVER its budget. */
    verdict(): string[] {
      const cpu = this.cpu;
      if (cpu < this.floor) return [`${this.label} SPEED INSTRUMENT: measured ${cpu.toFixed(2)} CPU-s < floor ${this.floor} CPU-s — the span measured NOTHING (a zero reading is never a pass; fix the instrument)`];
      return cpu <= this.budget ? [] : [`${this.label} SPEED: burned ${cpu.toFixed(2)} CPU-s > budget ${this.budget} CPU-s — it got SLOWER (profile it; never just raise this budget)`];
    }
  }
  /** The F-B seed: the SAME guard with its instrument ZEROED — it must go RED by name, never pass. */
  class ZeroedOwnCpu extends OwnCpu {
    protected override reading(): number {
      return 0;
    }
  }
  /**
   * S4b N1 (oopPO ruling CORRECTED 2026-10-11, oopTester measured): the SAME-RUN REFERENCE of the FIRST-store guard — a FIXED
   * workload through the SAME file units the store multiplies (unit objects, write, relative link, list), run in THIS process
   * just before the store, so box load cancels out of the ratio. Fixed shape (FOLDERS x FILES), never derived from the catalog.
   */
  class ReferenceWork {
    private home = '';
    private sample = 0;
    constructor() {}
    /** `sample` = which of the k reference samples (F4 round 2): each writes its OWN folder, so every sample does the SAME work. */
    init(home: string, sample: number): this {
      this.home = home;
      this.sample = sample;
      return this;
    }
    async run(): Promise<void> {
      const root = new NodeJSFolder().init({
        name: `${this.home}reference-${this.sample}`,
      });
      for (let f = 0; f < 40; f += 1) {
        const folder = root.folder(`f${f}`);
        await folder.create();
        for (let i = 0; i < 25; i += 1) {
          const file = folder.file(`u${i}.json`);
          await file.write(JSON.stringify({ folder: f, unit: i }));
          await folder.file(`u${i}.link.json`).link(file.path);
        }
        await folder.list();
      }
    }
  }
  /**
   * F4 round 2 (oopPO 2026-10-12, verdict 7c602fd5): the same-run REFERENCE is the MEDIAN of k spans, never ONE — a single
   * reference span read LOW under whole-suite load (0.368 CPU-s) and turned a clean store into a false RED (ratio 12.136).
   * A median ignores up to (k-1)/2 such samples. Every sample keeps its ZERO FLOOR (F-B): one span that measured nothing
   * is RED by name. All k readings are recorded, never just the median.
   */
  class MedianCpu {
    private spans: Array<{ readonly cpu: number; verdict(): string[] }> = [];
    constructor() {}
    init(spans: Array<{ readonly cpu: number; verdict(): string[] }>): this {
      this.spans = spans;
      return this;
    }
    /** Every sample, in the order taken. */
    get samples(): number[] {
      return this.spans.map((s) => s.cpu);
    }
    /** The median sample (k odd: the middle one). */
    get cpu(): number {
      const sorted = [...this.samples].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 1 ? (sorted[mid] ?? 0) : ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
    }
    verdict(): string[] {
      return this.spans.length === 0 ? ['REFERENCE MEDIAN: no samples'] : this.spans.flatMap((s) => s.verdict());
    }
  }
  /**
   * N1 MECHANISM (oopPO ruling 2026-10-11 + oopTester conditions 1 and i): over the REAL store, the FOLDER OBJECT each link
   * actually hangs in is read from the link's own file — its parent chain up to the topmost folder — never from the fix's own
   * method (an oracle on ScenarioIndex.root would depend on the fix). Every root path must be ONE object across all its links;
   * a duplicate root is named BY ITS PATH; `busy(many)` keeps the gate non-vacuous (a single link would pass trivially).
   */
  class HeldRoots {
    private objects = new Map<string, Set<unknown>>();
    private counts = new Map<string, number>();
    constructor() {}
    init(files: unknown[]): this {
      for (const file of files) {
        let top = file as { parent?: unknown; path: string };
        while (top.parent !== undefined && top.parent !== null) top = top.parent as { parent?: unknown; path: string };
        this.counts.set(top.path, (this.counts.get(top.path) ?? 0) + 1);
        const held = this.objects.get(top.path) ?? new Set<unknown>();
        held.add(top);
        this.objects.set(top.path, held);
      }
      return this;
    }
    /** The root paths asked for at least `many` times. */
    busy(many: number): string[] {
      return [...this.counts].filter(([, n]) => n >= many).map(([path]) => path).sort();
    }
    violations(): string[] {
      return [...this.objects].filter(([, held]) => held.size > 1).map(([path, held]) => `ScenarioIndex root '${path}' came back as ${held.size} DIFFERENT folder objects over ${this.counts.get(path) ?? 0} links — ONE held root per path (N1)`);
    }
  }

  it('count == catalog: the committed Index holds exactly one OWNER scenario per catalogued class — none missing, none extra (derived; S3: parts are their own units, ownerIor set)', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    expect(catalog.classes().length).toBeGreaterThan(50); // non-vacuous
    expect(live().missing(catalog), 'a catalogued class with no scenario').toEqual([]);
    expect(live().classUuids()).toEqual(catalog.classes().map((c) => c.uuid).sort());
  });

  it('every get(uuid) answers the TYPED ClassModel of exactly that class — same uuid, name and JSON as the catalog', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const speed = new OwnCpu().init('STORE get(uuid) over every class', GET_CPU_BUDGET, GET_CPU_FLOOR);
    for (const c of catalog.classes()) {
      const stored = await catalog.storedClass(c.uuid);
      expect(stored, c.name).toBeInstanceOf(ClassModel);
      expect([stored.uuid, stored.name], c.name).toEqual([c.uuid, c.name]);
      expect(JSON.stringify(stored), c.name).toBe(JSON.stringify(c));
    }
    expect(speed.verdict()).toEqual([]);
  }, 25000); // WALL re-derived 2026-10-10 @798a5ad0 (incl. S3.3): 2.54/2.70/2.80s alone, 2.81s in a full suite; it TIMED OUT at 8.5s under cross-session load (>=3x) → 2.5 x 8.5s, rounded up to 5s. Speed: the CPU guard above

  it('a 2nd store() is IDEMPOTENT: 0 new files, 0 changed bytes (put addresses by the stable uuid)', async () => {
    await M1Catalog.load();
    const home = await packageHome('r7a-idempotent'); // a SCRATCH store: the suite never rewrites the committed Index (AC2b b)
    const scratch = (): StoreAudit => new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`);
    await new M1Catalog().init().store(home);
    const before = scratch().bytes();
    const catalog = new M1Catalog().init();
    expect([scratch().missing(catalog), scratch().strays(catalog)], 'named BEFORE the owner count (F-E): missing classes, stray owner files').toEqual([[], []]);
    expect(scratch().classUuids().length).toBe(new M1Catalog().init().classes().length); // S3: owner files == classes; the parts are written too and must be idempotent below
    expect(before.size).toBeGreaterThan(scratch().classUuids().length);
    const speed = new OwnCpu().init('STORE 2nd store() of the whole catalog', STORE_CPU_BUDGET, STORE_CPU_FLOOR);
    await new M1Catalog().init().store(home);
    expect(speed.verdict()).toEqual([]);
    const after = scratch().bytes();
    expect([...after.keys()].filter((f) => !before.has(f)), 'new files').toEqual([]);
    expect([...after].filter(([f, b]) => before.get(f) !== b).map(([f]) => f), 'changed bytes').toEqual([]);
  }, 25000); // WALL re-derived 2026-10-10 @798a5ad0 (incl. S3.3): 3.52/3.61/3.65s alone, 4.10s in a full suite; it TIMED OUT at 8.5s under cross-session load (>=3x) → 2.5 x 8.5s, rounded up to 5s. Speed: the CPU guard above

  it('the STORE SPEED GUARD is FAILABLE (seed by injection): a span over its budget is NAMED', () => {
    expect(new OwnCpu().init('STORE seed', -1, 0).verdict()).toEqual([expect.stringContaining('STORE seed SPEED: burned')]);
    expect(new OwnCpu().init('STORE seed', 1e6, 0).verdict()).toEqual([]);
  });

  it('F4 round 2: the REFERENCE is a MEDIAN — one LOW sample (the 0.368 false RED) cannot move it; a sample that measured NOTHING is RED by name', () => {
    const span = (cpu: number): { readonly cpu: number; verdict(): string[] } => ({ cpu, verdict: () => [] });
    expect(new MedianCpu().init([span(0.368), span(0.5), span(0.52)]).cpu, 'one low sample of 3: the median is a normal one').toBe(0.5);
    expect(new MedianCpu().init([span(0.5), span(0.368), span(0.52), span(0.49), span(0.51)]).cpu, 'one low sample of 5').toBe(0.5);
    expect(new MedianCpu().init([span(0.368)]).cpu, 'k = 1 is the OLD instrument: the low sample IS the reference').toBe(0.368);
    const zeroed = new OwnCpu().init('STORE same-run REFERENCE sample 1/3', Infinity, 1e6).stop(); // floor above any real span: it "measured nothing"
    expect(new MedianCpu().init([zeroed, span(0.5), span(0.52)]).verdict(), 'a zero-floor sample is named even when the median is fine').toEqual([expect.stringContaining('REFERENCE sample 1/3 SPEED INSTRUMENT')]);
    expect(new MedianCpu().init([]).verdict()).toEqual(['REFERENCE MEDIAN: no samples']);
  });

  it('F-B: the STORE SPEED GUARD has a FLOOR — every guard with its instrument ZEROED is RED by name; the REAL instrument reads real work', () => {
    const guards: Array<[string, number, number]> = [
      ['STORE get(uuid) over every class', GET_CPU_BUDGET, GET_CPU_FLOOR],
      ['STORE 2nd store() of the whole catalog', STORE_CPU_BUDGET, STORE_CPU_FLOOR],
      ['STORE FIRST store() of the whole catalog', Infinity, FIRST_STORE_CPU_FLOOR], // a RATIO since S4b N1: no absolute ceiling, the zero floor kept
      ['STORE same-run REFERENCE workload', Infinity, REFERENCE_CPU_FLOOR],
    ];
    for (const [label, budget, floor] of guards) {
      expect(floor, label).toBeGreaterThan(0); // a zero floor IS the vacuity
      expect(new ZeroedOwnCpu().init(label, budget, floor).verdict(), label).toEqual([`${label} SPEED INSTRUMENT: measured 0.00 CPU-s < floor ${floor} CPU-s — the span measured NOTHING (a zero reading is never a pass; fix the instrument)`]);
    }
    const real = new OwnCpu().init('STORE positive control', 1e6, 0);
    const until = Date.now() + 400;
    let spin = 0;
    while (Date.now() < until) spin += 1; // ~0.4 CPU-s of real work in THIS process
    expect(spin).toBeGreaterThan(0);
    expect(real.cpu).toBeGreaterThan(0.2); // the real instrument SEES in-process work: the floor is reachable, not a wish
  });

  it('seed DROP ONE PUT -> RED by unit: a store missing one class names exactly that class', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const home = await packageHome('r7a-drop');
    const [victim, ...rest] = catalog.classes();
    if (victim === undefined) throw new Error('fixture: empty catalog');
    class DropOne extends M1Catalog {
      override classes(): ClassModel[] {
        return rest; // the seed: one class is never put
      }
    }
    await new DropOne().init().store(home);
    expect(new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).missing(catalog)).toEqual([victim.name]);
  }, 12000);

  /** R7b: the type/ links of a store root (`<home>EAMD.ucp/Scenario/type`) — read from DISK, never from the writer. */
  class TypeAudit {
    home = '';
    constructor() {}
    init(home: string): this {
      this.home = home;
      return this;
    }
    links(dir: string = `${this.home}EAMD.ucp/Scenario/type`): string[] {
      if (!existsSync(dir)) return [];
      return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? this.links(`${dir}/${e.name}`) : e.isSymbolicLink() ? [`${dir}/${e.name}`] : []));
    }
    /**
     * F-E'': the link CALLS (paths a put path asked NodeJSFile.link to write) that are NOT a derived unit's type link —
     * named by path. The derived links are the final store's own links, which the battery has proven bijective with the
     * Index; a ghost written then PRUNED leaves no trace on disk, so only the call record can name it.
     */
    ghosts(called: string[], parts: PartLinkAudit): string[] {
      const derived = new Set([...this.links(), ...parts.links()].map((l) => resolve(l))); // oopExpert R1: the component links (S4 b) are derived too
      return called.map((c) => resolve(c)).filter((c) => !derived.has(c));
    }
    /** The links whose target is gone — named by their (speakable) path. */
    dangling(): string[] {
      return this.links().filter((l) => !existsSync(l));
    }
    absolute(): string[] {
      return this.links().filter((l) => isAbsolute(readlinkSync(l)));
    }
    /** Index file (real path) -> the TYPE paths its model.links record — projection (a) ONLY; the component projection (b) is PartLinkAudit.recorded()'s (explicit split, oopExpert R3). */
    recorded(index: StoreAudit): Map<string, string[]> {
      return new Map(index.files().map((f) => [realpathSync(f), (JSON.parse(readFileSync(f, 'utf8')) as { model: { links: string[] } }).model.links.filter((l) => l.startsWith('EAMD.ucp/Scenario/type/'))]));
    }
    /** The Index files NO type/ link resolves to — named by their file (S4: classes AND parts are linked). */
    unlinkedFiles(index: StoreAudit): string[] {
      const targets = new Set(this.links().filter((l) => existsSync(l)).map((l) => realpathSync(l)));
      return index.files().filter((f) => !targets.has(realpathSync(f)));
    }
    /** The links whose name is NOT `<name>.<uuid>.scenario.json` (or `<uuid>.scenario.json`) with the uuid OF THEIR TARGET — unique by construction is checked, not assumed. */
    withoutTargetUuid(): string[] {
      return this.links().filter((l) => {
        const target = existsSync(l) ? (realpathSync(l).split('/').pop() ?? '').replace(/\.scenario\.json$/, '') : '';
        const name = l.split('/').pop() ?? '';
        return target === '' || !(name === `${target}.scenario.json` || name.endsWith(`.${target}.scenario.json`));
      });
    }
    /**
     * F-C: the links whose `<name>` part is NOT their TARGET's model name — read from the target Index file (the model as
     * stored), never from the link itself. scenario.md naming: '/' and ' ' -> '_'; an empty name -> `<uuid>.scenario.json`.
     */
    misnamed(): string[] {
      return this.links().filter((l) => {
        if (!existsSync(l)) return false; // dangling(): named there
        const model = (JSON.parse(readFileSync(realpathSync(l), 'utf8')) as { model: { uuid: string; name?: string } }).model;
        const name = (model.name ?? '').split('/').join('_').split(' ').join('_');
        return (l.split('/').pop() ?? '') !== `${name === '' ? '' : `${name}.`}${model.uuid}.scenario.json`;
      });
    }
    /** F-D: every link whose TARGET Index file is reached by more than one link — named by the links, before any count. */
    multiLinked(): string[] {
      const byTarget = new Map<string, string[]>();
      for (const l of this.links().filter((k) => existsSync(k))) byTarget.set(realpathSync(l), [...(byTarget.get(realpathSync(l)) ?? []), l]);
      return [...byTarget.values()].filter((ls) => ls.length > 1).flat().sort();
    }
    /**
     * F-E as a PATTERN: EVERY named check of a store's type/ links — the ONE battery a test runs BEFORE any unit/link
     * count (O1, DUPLINK, F-D and the put path each REDed first as an off-by-one total). Only the checks that FOUND
     * something are returned: a clean store is `{}`, a RED names its links/files under the check that caught them.
     */
    violations(index: StoreAudit, catalog?: M1Catalog): Record<string, string[]> {
      const checks: Record<string, string[]> = {
        outsideType: this.links().filter((l) => !l.startsWith(`${this.home}EAMD.ucp/Scenario/type/`)),
        absolute: this.absolute(),
        dangling: this.dangling(),
        withoutTargetUuid: this.withoutTargetUuid(),
        misnamed: this.misnamed(),
        multiLinked: this.multiLinked(),
        unlinkedFiles: this.unlinkedFiles(index),
        unlinked: catalog === undefined ? [] : this.unlinked(catalog),
      };
      return Object.fromEntries(Object.entries(checks).filter(([, named]) => named.length > 0));
    }
    /** The catalogued classes with NO type/ link resolving to their Index file — named. */
    unlinked(catalog: M1Catalog): string[] {
      const targets = new Set(this.links().filter((l) => existsSync(l)).map((l) => (realpathSync(l).split('/').pop() ?? '').replace(/\.scenario\.json$/, '')));
      return catalog.classes().filter((c) => !targets.has(c.uuid)).map((c) => c.name);
    }
  }

  /**
   * S4b projection (b): the part links of a store root — every `<Component>/latest/model/scenarios` below Components, read
   * from DISK, never from the writer. A link's EXPECTED path is derived from the STORED units — the part's IOR type, its
   * ownerIor chain up to the class — and from where that class's `<Class>Definition.ts` lies: a derivation independent of
   * ScenarioIndex.partLinksOf. oopExpert R4: every check is NAMED and asserted empty before any count.
   */
  class PartLinkAudit {
    home = '';
    private cache = new Map<string, { ior: string; ownerIor: string; model: { uuid: string; name?: string; links: string[] } }>();
    private models: Map<string, string> | undefined = undefined;
    constructor() {}
    init(home: string): this {
      this.home = home;
      return this;
    }
    /** Every scenarios root below Components — WALKED, never listed (a vanished component's root is found too); inside a version only model/ is looked at. */
    roots(dir: string = `${this.home}EAMD.ucp/Components`): string[] {
      if (!existsSync(dir)) return [];
      return readdirSync(dir, { withFileTypes: true })
        .filter((e) => e.isDirectory())
        .flatMap((e) => (e.name !== 'latest' ? this.roots(`${dir}/${e.name}`) : existsSync(`${dir}/latest/model/scenarios`) ? [`${dir}/latest/model/scenarios`] : []));
    }
    /** Every entry below the roots — links AND anything else (notLink() names the latter). */
    links(): string[] {
      return this.roots().flatMap((r) => this.below(r));
    }
    private below(dir: string): string[] {
      return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? this.below(`${dir}/${e.name}`) : [`${dir}/${e.name}`]));
    }
    private isLink(l: string): boolean {
      return lstatSync(l).isSymbolicLink();
    }
    private resolving(): string[] {
      return this.links().filter((l) => this.isLink(l) && existsSync(l));
    }
    notLink(): string[] {
      return this.links().filter((l) => !this.isLink(l));
    }
    dangling(): string[] {
      return this.links().filter((l) => this.isLink(l) && !existsSync(l));
    }
    absolute(): string[] {
      return this.links().filter((l) => this.isLink(l) && isAbsolute(readlinkSync(l)));
    }
    /** Links whose target is not an Index unit of THIS store root. */
    outsideIndex(): string[] {
      const index = realpathSync(`${this.home}EAMD.ucp/Scenario/Index`);
      return this.resolving().filter((l) => !realpathSync(l).startsWith(`${index}/`));
    }
    /** Links to a CLASS unit — a class has no component link (scenario.md: a class 1 link, a part 2). */
    toClass(): string[] {
      return this.resolving().filter((l) => this.unit(realpathSync(l)).ownerIor === '');
    }
    /** Links NOT at the path derived from their TARGET's stored chain — a wrong component, Class, PartType or partPath. */
    misnamed(): string[] {
      const classes = new Set(this.toClass());
      return this.resolving().filter((l) => !classes.has(l) && l !== this.expected(realpathSync(l)));
    }
    /** Every link whose target is reached by more than one component link — named by the links. */
    multiLinked(): string[] {
      const byTarget = new Map<string, string[]>();
      for (const l of this.resolving()) byTarget.set(realpathSync(l), [...(byTarget.get(realpathSync(l)) ?? []), l]);
      return [...byTarget.values()].filter((ls) => ls.length > 1).flat().sort();
    }
    /** Links whose path equals another's CASE-FOLDED (the macOS peer would merge them) — both named. */
    caseFolded(): string[] {
      const byFold = new Map<string, string[]>();
      for (const l of this.links()) byFold.set(l.toLowerCase(), [...(byFold.get(l.toLowerCase()) ?? []), l]);
      return [...byFold.values()].filter((ls) => ls.length > 1).flat().sort();
    }
    /** The Index PART files no component link resolves to — named by their file. */
    unlinkedParts(index: StoreAudit): string[] {
      const targets = new Set(this.resolving().map((l) => realpathSync(l)));
      return index.files().filter((f) => this.unit(f).ownerIor !== '' && !targets.has(realpathSync(f)));
    }
    /** Index file (real path) -> the COMPONENT paths its model.links record (projection b only — the explicit split, oopExpert R3), rooted at this home. */
    recorded(index: StoreAudit): Map<string, string[]> {
      return new Map(index.files().map((f) => [realpathSync(f), this.unit(f).model.links.filter((l) => l.startsWith('EAMD.ucp/Components/')).map((l) => `${this.home}${l}`)]));
    }
    violations(index: StoreAudit): Record<string, string[]> {
      const checks: Record<string, string[]> = {
        notLink: this.notLink(),
        dangling: this.dangling(),
        absolute: this.absolute(),
        outsideIndex: this.outsideIndex(),
        toClass: this.toClass(),
        misnamed: this.misnamed(),
        multiLinked: this.multiLinked(),
        caseFolded: this.caseFolded(),
        unlinkedParts: this.unlinkedParts(index),
      };
      return Object.fromEntries(Object.entries(checks).filter(([, named]) => named.length > 0));
    }
    /** The component path a stored PART file must be linked at — from the store itself: its IOR type, its ownerIor chain to the class, that class's Definition folder. */
    expected(file: string): string {
      const part = this.unit(file);
      const type = (part.ior.split('/').slice(-2)[0] ?? '').split('.').slice(-2)[0] ?? ''; // `<ns>.<Type>.<version>` (version 'latest': no dot)
      const chain = [];
      let unit = part;
      while (unit.ownerIor !== '') {
        chain.unshift(this.segment(unit.model));
        unit = this.unit(this.fileOf(unit.ownerIor.split('/').pop() ?? ''));
      }
      const name = unit.model.name ?? '';
      return `${this.home}${this.definitions().get(name) ?? `<no ${name}Definition.ts in the repository>`}/scenarios/${name}/${type}/${chain.join('.')}.scenario.json`;
    }
    /** scenario.md: '/' and space -> '_'; an empty name -> the uuid (the chain kept). */
    private segment(model: { uuid: string; name?: string }): string {
      const name = (model.name ?? '').split('/').join('_').split(' ').join('_');
      return name === '' ? model.uuid : name;
    }
    private fileOf(uuid: string): string {
      return `${this.home}EAMD.ucp/Scenario/Index/${[...uuid.slice(0, 5)].join('/')}/${uuid}.scenario.json`;
    }
    private unit(file: string): { ior: string; ownerIor: string; model: { uuid: string; name?: string; links: string[] } } {
      const known = this.cache.get(file);
      if (known !== undefined) return known;
      const unit = JSON.parse(readFileSync(file, 'utf8')) as { ior: string; ownerIor: string; model: { uuid: string; name?: string; links: string[] } };
      this.cache.set(file, unit);
      return unit;
    }
    /** Class name -> its repo-relative `<Component>/latest/model` folder: WHERE ITS Definition FILE LIES in the REPOSITORY (ground truth, not the layout; a scratch home holds no Definitions). */
    private definitions(): Map<string, string> {
      if (this.models !== undefined) return this.models;
      const found = new Map<string, string>();
      const walk = (dir: string): void => {
        for (const e of readdirSync(dir, { withFileTypes: true })) {
          if (!e.isDirectory()) continue;
          if (e.name === 'latest') {
            if (existsSync(`${dir}/latest/model`)) for (const f of readdirSync(`${dir}/latest/model`)) if (f.endsWith('Definition.ts')) found.set(f.replace(/Definition\.ts$/, ''), `${dir}/latest/model`);
          } else walk(`${dir}/${e.name}`);
        }
      };
      walk('EAMD.ucp/Components');
      this.models = found;
      return found;
    }
  }

  it('S4 (b) — EVERY part has ONE component link <Component>/latest/model/scenarios/<Class>/<PartType>/<partPath>.scenario.json: a SYMLINK, relative, resolving into the Index, at the path derived from its STORED chain; classes have none; unique case-folded; the per-component BIJECTION holds both ways', () => {
    const parts = new PartLinkAudit().init('');
    const index = live();
    // R4: every NAMED check runs BEFORE any count
    expect(parts.violations(index), 'the named checks (notLink, dangling, absolute, outsideIndex, toClass, misnamed, multiLinked, caseFolded, unlinkedParts)').toEqual({});
    for (const f of index.files()) {
      const u = JSON.parse(readFileSync(f, 'utf8')) as { ownerIor: string; model: { links: string[] } };
      const kinds = u.model.links.map((l) => (l.startsWith('EAMD.ucp/Scenario/type/') ? 'type' : l.startsWith('EAMD.ucp/Components/') ? 'component' : `OTHER ${l}`));
      expect(kinds, `${f}: a class records [type], a part [type, component] (R3: the split is explicit)`).toEqual(u.ownerIor === '' ? ['type'] : ['type', 'component']);
    }
    const links = parts.links();
    const recorded = parts.recorded(index);
    for (const l of links) expect(recorded.get(realpathSync(l)), `${l}: its Index file records exactly this component link`).toEqual([l]);
    for (const [file, paths] of recorded) for (const p of paths) expect(realpathSync(p), `${file} records ${p}`).toBe(file);
    // the counts LAST — they can only confirm what the named checks proved
    const partFiles = index.files().filter((f) => (JSON.parse(readFileSync(f, 'utf8')) as { ownerIor: string }).ownerIor !== '');
    expect(links.length, 'one component link per part').toBe(partFiles.length);
    expect(new Set(links.map((l) => realpathSync(l))).size).toBe(links.length);
  }, 28000); // WALL: re-derived with the full suite below

  it("S4 (b) RULED B — the SAME <PartType>/<partPath> under two CLASSES of one component stays GREEN (oopExpert's probe, kept: the component-wide key collided 100 keys / 276 units before the class folder)", () => {
    const parts = new PartLinkAudit().init('');
    expect(parts.violations(live()), 'named before the count').toEqual({});
    const classesByKey = new Map<string, Set<string>>();
    for (const l of parts.links()) {
      const [component, rest] = l.split('/latest/model/scenarios/');
      const [owner, ...key] = (rest ?? '').split('/');
      const k = `${component} ${key.join('/').toLowerCase()}`;
      classesByKey.set(k, new Set([...(classesByKey.get(k) ?? []), owner ?? '']));
    }
    expect([...classesByKey.values()].filter((c) => c.size > 1).length, 'the collision the class folder removes is REAL (non-vacuous)').toBeGreaterThan(0);
  }, 28000);

  it('S4 (b) seeds -> RED BY NAME on a real store, then ONE re-store repairs them: a DROPPED link (unlinkedParts), a MISNAMED link (misnamed), a STALE link at a derived path (misnamed; relinked); a REGULAR file is refused by name, never deleted', async () => {
    await M1Catalog.load();
    const home = await packageHome('s4b-seeds');
    const index = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`);
    await new M1Catalog().init().store(home);
    const parts = new PartLinkAudit().init(home);
    expect(parts.violations(index), 'GREEN before the seeds').toEqual({});
    const [dropped, renamed, stale, other] = parts.links();
    if (dropped === undefined || renamed === undefined || stale === undefined || other === undefined) throw new Error('fixture: fewer than 4 component links');
    const droppedTarget = realpathSync(dropped);
    unlinkSync(dropped); // seed DROP
    const misnamed = `${dirname(renamed)}/seed-misnamed.scenario.json`;
    renameSync(renamed, misnamed); // seed MISNAME: its target is still linked, but not at its derived path
    const staleTo = readlinkSync(other);
    unlinkSync(stale);
    symlinkSync(staleTo, stale); // seed STALE: a derived path now resolves to ANOTHER part
    const seeded = new PartLinkAudit().init(home);
    expect(seeded.unlinkedParts(index), 'the dropped part, by its Index file').toEqual(expect.arrayContaining([droppedTarget]));
    expect(seeded.misnamed(), 'the misnamed and the stale link, by path').toEqual(expect.arrayContaining([misnamed, stale]));
    await new M1Catalog().init().store(home); // ONE re-store: relink + prune make the store EQUAL the derivation again
    expect(new PartLinkAudit().init(home).violations(index), 'repaired: dropped relinked, misnamed pruned, stale relinked').toEqual({});
    const regular = `${dirname(other)}/seed-regular.scenario.json`;
    writeFileSync(regular, '{}'); // seed REGULAR FILE: only links live in latest/model/scenarios
    expect(new PartLinkAudit().init(home).notLink(), 'named before the store refuses it').toEqual([regular]);
    await expect(new M1Catalog().init().store(home)).rejects.toThrow(`'${regular}' is not a link`);
    expect(existsSync(regular), 'the regular file is NEVER deleted').toBe(true);
    rmSync(regular);
  }, 60000); // WALL: re-derived with the full suite below

  it('S4 (b) seed COLLISION -> the writer REFUSES, naming BOTH parts: two parts of one class and part type whose names differ only in CASE, and two that collide only AFTER sanitizing (a/b vs a_b) — oopExpert R2', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const victim = catalog.classes().find((c) => c.methods.length >= 2);
    const [first, second] = victim?.methods ?? [];
    if (victim === undefined || first === undefined || second === undefined) throw new Error('fixture: no class with 2 methods');
    const names = [first.name, second.name];
    const home = `${new Scratch().at(import.meta.url).fixture('s4b-collision')}/`;
    await new NodeJSFolder().init({ name: `${home}EAMD.ucp/Components/${(catalog.owners()[victim.name] ?? '').split('.').join('/')}` }).create(); // the victim's HOME component folder, from the DERIVED owner key (oopPO P5) — no path handed to the index
    try {
      for (const [a, b] of [[first.name, first.name.toUpperCase()], ['a/b', 'a_b']]) {
        first.name = a ?? '';
        second.name = b ?? '';
        const index = new M1Catalog().init().liveIndex(home);
        const own = Mof.store === undefined;
        if (own) Mof.open(index);
        try {
          catalog.attach();
          await expect(index.put(victim), `${a} vs ${b}`).rejects.toThrow(/collides \(case-folded, after/);
          await index.put(victim).catch((e: unknown) => {
            expect(String(e), 'names BOTH parts by uuid').toContain(first.uuid);
            expect(String(e)).toContain(second.uuid);
          });
        } finally {
          if (own) Mof.close();
        }
      }
    } finally {
      first.name = names[0] ?? '';
      second.name = names[1] ?? '';
    }
  });

  it("S4b CARRIER — ONE source (oopPO P5 Q2=A): the owner key is DERIVED (owners() = the qualified name of each class's HOME folder, Q1=A) and RENDERED, never authored — the LOADED class's generated static component == owners() == a key COMPOSED from the LOADED classes' own namespace getters; it names the folder M1Layout lays out; ClassModel cannot author it and no stored class unit carries it", async () => {
    const audit = await new CarrierAudit().init();
    const models = audit.classes;
    // every NAMED check BEFORE any count — a defect is reported by its class, never as an off-by-one total
    expect(audit.violations(models), 'the named checks (codeOff = rendered != derived, oracleOff, folderOff)').toEqual({});
    expect('component' in new ClassModel(), 'UNREPRESENTABLE: ClassModel has no authored component field').toBe(false);
    expect(audit.storedOff(audit.stored()), "storedOff: no stored class unit carries a component key (Q2: derived, never stored)").toEqual([]);
    // the counts LAST: non-vacuous over every case the rule distinguishes
    expect(audit.ownNamespaceDiffers(models).length, "NON-VACUITY: >=1 class whose own namespace differs from its owner's").toBeGreaterThan(0);
    expect(audit.packageOwned(models).length, 'NON-VACUITY: >=1 class the package owns (keyed by its OWN namespace)').toBeGreaterThan(0);
    expect(audit.stored().length, 'every catalogued class is stored').toBe(models.length);
  }, 10000);

  it('S4b CARRIER seeds -> RED BY CLASS NAME: a DERIVED key gone stale (a component-held class keyed by its OWN namespace; a package-owned class in the Mof.key form) reds rendered/oracle/folder by name; a STORED unit that carries a component; a 2nd class that is the root of its own namespace (both named)', async () => {
    const audit = await new CarrierAudit().init();
    const held = audit.ownNamespaceDiffers(audit.classes).find((c) => audit.packageOwned([c]).length === 0);
    if (held === undefined) throw new Error('fixture: no component-held class whose own namespace differs from its owner\'s');
    const stale = { ...audit.derived(), [held.name]: Mof.key(held.namespace, audit.ownerOf(held)) }; // its OWN namespace instead of its owner's
    expect(audit.violations([held], stale), 'own-namespace seed').toEqual({ codeOff: [held.name], oracleOff: [held.name], folderOff: [held.name] });
    const pkg = audit.packageName();
    const qualified = new M1Catalog().init().packageQualifiedName(); // rule 7a: package-owned classes sit IN the qualified name
    const owned = audit.packageOwned(audit.classes).find((c) => c.namespace === qualified);
    if (owned === undefined) throw new Error('fixture: no package-owned class in the package namespace');
    const doubled = { ...audit.derived(), [owned.name]: Mof.key(qualified, pkg) }; // the doubled Mof.key form P1 corrected, on the 7a root ('<qualified>.Web4MDA')
    expect(audit.violations([owned], doubled), 'Mof.key-form seed').toEqual({ codeOff: [owned.name], oracleOff: [owned.name], folderOff: [owned.name] });
    const [unit] = audit.stored();
    if (unit === undefined) throw new Error('fixture: an empty live store');
    expect(audit.storedOff([{ ...unit, component: 'com.Stale' }]), 'a stored unit that carries a component').toEqual([unit.name]);
    class TwoRoots extends M1Catalog {
      constructor() {
        super();
      }
      override classes(): ClassModel[] {
        const at = super.classes().find((c) => c.name === pkg)?.namespace ?? ''; // rule 7a: a SECOND class AT the package qualified name (<ns>.<name>)
        return [...super.classes(), new ClassModel().init({ name: pkg, level: 'M1', language: '', namespace: at })];
      }
    }
    expect(() => new TwoRoots().init().packageModel(), 'exactly ONE package is failable, not assumed').toThrow(/found 2/);
    expect(() => new TwoRoots().init().packageModel()).toThrow(new RegExp(`found 2: ${pkg}, ${pkg}`));
  });

  it('S4b ONE root (oopPO P5, locate DELETED): a class unit projects to EAMD.ucp/Components/<derived owner key>/<store output>, keyed by its UUID — an ImportModel NAMED like the class projects nowhere; an index with no injected owners projects nothing; a missing store-output folder is refused by name', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const victim = catalog.classNamed('ClassModel');
    const key = catalog.owners()[victim.name] ?? '';
    const index = catalog.liveIndex();
    expect(index.scenariosOf(victim), 'the derived root').toBe(`EAMD.ucp/Components/${key.split('.').join('/')}/${catalog.storeOutputTail()}`);
    const alias = new ImportModel().init({ ...new ImportModel().toJSON(), name: victim.name }); // NAMED like the class (an import of it): a name-keyed map would project it
    expect(index.scenariosOf(alias), 'uuid-keyed: a same-NAMED import is no class unit').toBe('');
    expect(new ScenarioIndex().init({ name: 'x', storeOutput: catalog.storeOutputTail(), owners: {} }).scenariosOf(victim), 'nothing injected: no projection').toBe('');
    expect(() => new ScenarioIndex().init({ name: 'x', storeOutput: '', owners: catalog.ownersByUuid() }).scenariosOf(victim), 'F2 refusal by name').toThrow(/no store-output folder was injected/);
  });

  it('R7b + S4 (a) — EVERY unit (class AND part) has ONE type/ link <name>.<uuid>.scenario.json: RELATIVE, resolving, 0 dangling, named by its TARGET uuid; the Index<->type BIJECTION holds BOTH ways', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const types = new TypeAudit().init('');
    const links = types.links();
    // F-D: every NAMED check runs BEFORE any count — a defect is reported by its link/file, never as an off-by-one total
    expect(types.violations(live(), catalog), 'the named checks (outsideType, absolute, dangling, withoutTargetUuid, misnamed, multiLinked, unlinkedFiles, unlinked)').toEqual({});
    expect(links.length, 'non-vacuous: the parts are linked too').toBeGreaterThan(catalog.classes().length); // F-D'/F-E': a COMPARISON count is a count too — after the battery
    const recorded = types.recorded(live());
    for (const l of links) expect(recorded.get(realpathSync(l)), `${l}: its Index file must record exactly this link`).toEqual([l]); // type -> Index -> the same type path
    for (const [file, paths] of recorded) for (const p of paths) expect(realpathSync(p), `${file} records ${p}`).toBe(file); // Index -> type -> the same Index file
    // the counts LAST — they can only confirm what the named checks already proved
    expect(links.length, 'one link per Index unit (classes + parts)').toBe(live().files().length);
    expect(links.filter((l) => l.startsWith(`EAMD.ucp/Scenario/type/${catalog.packageQualifiedName().split('.').join('/')}/MOF/M2/M2AbstractClass/latest/`)).length, 'the class links').toBe(catalog.classes().length); // P4 class B (plan 2026-10-11 ruling 3; scenario.md §1/§2 + ior.md canonical example as corrected by P1): a stored ClassModel unit is typed by its incorporating component M2AbstractClass — the SPEC's literal, never asked of the code under test
    expect(recorded.size).toBe(links.length);
    expect(new Set(links).size).toBe(links.length);
  });

  it('R7b — a 2nd store() changes NOTHING in type/ either: same link set, same targets, 0 changed bytes', async () => {
    await M1Catalog.load();
    const home = await packageHome('r7b-idempotent');
    const snapshot = (): string[] => new TypeAudit().init(home).links().map((l) => `${l} -> ${readlinkSync(l)}`).sort();
    await new M1Catalog().init().store(home);
    const before = snapshot();
    const bytes = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).bytes();
    expect(new TypeAudit().init(home).violations(new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`)), 'named BEFORE the count (F-E)').toEqual({});
    expect(before.length).toBe(new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).files().length); // S4: every unit linked
    await new M1Catalog().init().store(home);
    expect(snapshot()).toEqual(before);
    const after = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).bytes();
    expect([...after].filter(([f, b]) => bytes.get(f) !== b).map(([f]) => f), 'changed bytes').toEqual([]);
  }, 28000); // WALL (F-E sweep: the named battery runs before the count — misnamed() reads every link target): 9.93/11.19s alone @bb1682e9+sweep, load 2.8 (was under the 8.5s default without it) -> 2.5 x 11.19s, rounded up

  it('R7b seed DROP ONE PUT -> RED by name: the dropped class has no type/ link (and the bijection still holds for the rest)', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const home = await packageHome('r7b-drop');
    const [victim, ...rest] = catalog.classes();
    if (victim === undefined) throw new Error('fixture: empty catalog');
    class DropOne extends M1Catalog {
      override classes(): ClassModel[] {
        return rest; // the seed
      }
    }
    await new DropOne().init().store(home);
    expect(new TypeAudit().init(home).unlinked(catalog)).toEqual([victim.name]);
  }, 22000); // WALL (S4a, every unit linked): full-load max 8.71s (F1 MECHANISM timed out at the 8.5s default @63f07b7e; S4a seeds 5.49/6.42s in 2 clean full runs) -> 2.5 x 8.71s, rounded up. Speed: the FIRST-store CPU guard (F1 MECHANISM)

  it('S4 (a) seeds -> RED BY NAME on a real store: a PART whose type/ link is dropped is named by its Index file; a type/ link WITHOUT the uuid is named by its link', async () => {
    await M1Catalog.load();
    const home = await packageHome('s4a-seeds');
    await new M1Catalog().init().store(home);
    const index = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`);
    const types = new TypeAudit().init(home);
    expect([types.unlinkedFiles(index), types.withoutTargetUuid()], 'GREEN before the seeds').toEqual([[], []]);
    const partFile = index.files().find((f) => !index.classFiles().includes(f));
    if (partFile === undefined) throw new Error('fixture: no part unit stored');
    const [dropped, renamed] = types.links().filter((l) => realpathSync(l) === realpathSync(partFile)).concat(types.links().filter((l) => l.includes('/M2AbstractClass/'))); // P4 class B (plan 2026-10-11 ruling 3; scenario.md §1/§2 + ior.md canonical example as corrected by P1): a stored ClassModel unit is typed by its incorporating component M2AbstractClass — the SPEC's literal, never asked of the code under test
    if (dropped === undefined || renamed === undefined) throw new Error('fixture: no links to seed');
    rmSync(dropped); // seed 1: the part's (a) link is dropped
    expect(types.unlinkedFiles(index)).toEqual([partFile]);
    const target = readlinkSync(renamed);
    rmSync(renamed);
    const bare = renamed.replace(/\.[0-9a-f-]{36}\.scenario\.json$/, '.scenario.json'); // seed 2: the old <name>.scenario.json form
    symlinkSync(target, bare);
    expect(types.withoutTargetUuid()).toEqual([bare]);
  }, 22000); // WALL (S4a, every unit linked): full-load max 8.71s (F1 MECHANISM timed out at the 8.5s default @63f07b7e; S4a seeds 5.49/6.42s in 2 clean full runs) -> 2.5 x 8.71s, rounded up. Speed: the FIRST-store CPU guard (F1 MECHANISM)

  it('F-C + F-D seeds -> RED BY NAME on a real store: a CONSISTENT rename (link AND its Index record) is named by misnamed(); a DUPLICATE link to one target is named by multiLinked() — no count involved', async () => {
    await M1Catalog.load();
    const home = await packageHome('s4a-fcfd-seeds');
    await new M1Catalog().init().store(home);
    const index = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`);
    const types = new TypeAudit().init(home);
    expect([types.misnamed(), types.multiLinked()], 'GREEN before the seeds').toEqual([[], []]);
    const named = types.links().find((l) => !/\/[0-9a-f-]{36}\.scenario\.json$/.test(l)); // a link WITH a <name> part
    if (named === undefined) throw new Error('fixture: no named link');
    const file = realpathSync(named);
    // seed PHYSNAMEC: rename the link AND rewrite its Index record consistently — the bijection holds, the name lies
    const renamed = named.replace(/\/[^/]+(\.[0-9a-f-]{36}\.scenario\.json)$/, '/Renamed$1');
    const target = readlinkSync(named);
    rmSync(named);
    symlinkSync(target, renamed);
    const stored = JSON.parse(readFileSync(file, 'utf8')) as { model: { links: string[] } };
    stored.model.links = stored.model.links.map((l) => (`${home}${l}` === named ? renamed.slice(home.length) : l));
    writeFileSync(file, JSON.stringify(stored, null, 2));
    expect(types.unlinkedFiles(index), 'the seed keeps the bijection (only the name lies)').toEqual([]);
    expect(types.misnamed()).toEqual([renamed]);
    // seed DUPLINK: a 2nd link to the same target, correctly named for it — only multiLinked() can see it
    rmSync(renamed);
    symlinkSync(target, named);
    const dup = `${named.slice(0, named.lastIndexOf('/'))}/sub-dup/${named.split('/').pop() ?? ''}`;
    mkdirSync(dup.slice(0, dup.lastIndexOf('/')), { recursive: true });
    symlinkSync(`../${target}`, dup);
    expect(types.misnamed(), 'the duplicate is correctly NAMED').toEqual([]);
    expect(types.multiLinked()).toEqual([named, dup].sort());
  }, 22000); // WALL: one full store, as the S4 (a) seeds arm above (2.5 x the 8.71s full-load max)

  /**
   * S1 (plan 2026-10-10 sub-scenarios by IOR): every UNIT of the catalog tree — each class and EVERY nested part that
   * carries a uuid (imports, attributes, methods, parameters, relationships, type aliases …) — walked from the classes'
   * JSON, so the set is DERIVED, never a list of part kinds. Each unit is named by its owner path.
   */
  class UnitUuids {
    constructor() {}
    init(): this {
      return this;
    }
    of(trees: unknown[]): Array<{ uuid: string; owner: string }> {
      const out: Array<{ uuid: string; owner: string }> = [];
      for (const t of trees) this.walk(t, '', out);
      return out;
    }
    /** `<uuid>: <owner> + <owner> …` for every uuid held by more than one unit. */
    duplicates(units: Array<{ uuid: string; owner: string }>): string[] {
      const by = new Map<string, string[]>();
      for (const u of units) by.set(u.uuid, [...(by.get(u.uuid) ?? []), u.owner]);
      return [...by].filter(([, owners]) => owners.length > 1).map(([uuid, owners]) => `${uuid}: ${owners.join(' + ')}`);
    }
    private walk(node: unknown, path: string, out: Array<{ uuid: string; owner: string }>): void {
      if (Array.isArray(node)) {
        node.forEach((n) => this.walk(n, path, out));
        return;
      }
      if (node === null || typeof node !== 'object') return;
      const record = node as Record<string, unknown>;
      const name = typeof record['name'] === 'string' ? record['name'] : '';
      const here = path === '' ? name : `${path}/${name}`;
      if (typeof record['uuid'] === 'string' && record['uuid'] !== '') out.push({ uuid: record['uuid'], owner: here });
      for (const [key, value] of Object.entries(record)) if (value !== null && typeof value === 'object') this.walk(value, `${here}.${key}`, out);
    }
  }

  const catalogTrees = (): Array<Record<string, unknown>> => JSON.parse(JSON.stringify(new M1Catalog().init().classes())) as Array<Record<string, unknown>>;

  it('S1 — every UNIT uuid in the catalog tree is DISTINCT: each class and every nested part, walked from the JSON (derived)', () => {
    const classes = new M1Catalog().init().classes().length;
    const units = new UnitUuids().init().of(catalogTrees());
    expect(units.length, 'the parts are IN the walk, not only the classes').toBeGreaterThan(classes * 5);
    expect(new UnitUuids().init().duplicates(units)).toEqual([]);
  });

  it('S1 seed — ONE part uuid duplicated into another class -> RED naming BOTH owners', () => {
    const trees = catalogTrees();
    const parts = new UnitUuids().init().of(trees).filter((u) => u.owner.includes('.parameters/'));
    const first = parts[0];
    const other = parts.find((u) => first !== undefined && u.owner.split('.')[0] !== first.owner.split('.')[0]);
    if (first === undefined || other === undefined) throw new Error('fixture: two classes with parameters');
    const seed = (node: unknown): void => {
      if (Array.isArray(node)) node.forEach(seed);
      else if (node !== null && typeof node === 'object') {
        const r = node as Record<string, unknown>;
        if (r['uuid'] === other.uuid) r['uuid'] = first.uuid; // the seed: the copy-paste that S1 removed
        Object.values(r).forEach(seed);
      }
    };
    seed(trees);
    expect(new UnitUuids().init().duplicates(new UnitUuids().init().of(trees))).toEqual([`${first.uuid}: ${first.owner} + ${other.owner}`]);
  });

  /** S2: the part ends as `Model.member` strings — read from the catalog's derivation. */
  const partMembers = (catalog: M1Catalog): string[] => [...catalog.partEnds()].flatMap(([model, ends]) => Object.keys(ends).map((end) => `${model}.${end}`)).sort();

  it('S2 — M1Catalog.partEnds() DERIVES exactly the part members spec/model-json.md rule C names today (7), each with its part class', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    expect(partMembers(catalog)).toEqual(['ClassModel.attributes', 'ClassModel.imports', 'ClassModel.methods', 'ClassModel.relationships', 'ClassModel.typeAliases', 'MethodModel.parameters', 'ModelUnit.references']);
    expect(catalog.partEnds().get('MethodModel')).toEqual({ parameters: 'ParameterModel' });
    expect([...catalog.partHeirs()].sort(), 'overriding declarations (ModelUnit is their ancestor)').toEqual(['ClassModel', 'MethodModel']);
  });

  it('S2 — the GENERATED `static get partEnds()` of every declaring model equals the derivation (the class answers, read at runtime)', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    let checked = 0;
    for (const [model, ends] of catalog.partEnds()) {
      const entry = catalog.classes().find((c) => c.name === model);
      if (entry === undefined) throw new Error(`fixture: ${model}`);
      const loaded = (await import(pathToFileURL(resolve(`${new Source().init().of(model)}`)).href)) as Record<string, { partEnds?: Record<string, string> }>;
      expect(loaded[model]?.partEnds, model).toEqual(ends);
      checked++;
    }
    expect(checked, 'non-vacuous (S2 audit OBS): every declaring model was loaded and read').toBe(catalog.partEnds().size);
    expect(checked).toBeGreaterThan(0);
  });

  it('S2 audit F2 — a type that is BOTH a ModelUnit and a UcpUnit is UNREPRESENTABLE: the two superclass chains are disjoint (single inheritance), so partEnds needs no UcpUnit exclusion', () => {
    const catalog = new M1Catalog().init();
    const parent = new Map(catalog.classes().map((c) => [c.name, c.superclass.replace(/<.*>$/, '')]));
    const chain = (name: string): string[] => (name === '' || !parent.has(name) ? [name] : [name, ...chain(parent.get(name) ?? '')]);
    const modelUnit = chain('ModelUnit');
    const ucpUnit = chain('UcpUnit');
    expect(modelUnit.length, 'ModelUnit chain derived from the catalog').toBeGreaterThan(1);
    expect(ucpUnit.length, 'UcpUnit chain derived from the catalog').toBeGreaterThan(1);
    expect(modelUnit).not.toContain('UcpUnit');
    expect(ucpUnit).not.toContain('ModelUnit');
    const both = catalog.classes().filter((c) => chain(c.name).includes('ModelUnit') && chain(c.name).includes('UcpUnit')).map((c) => c.name);
    expect(both, 'no catalogued class descends from both').toEqual([]);
  });

  it('S2 seeds (oopPO ruling 2) — a new relationship of kind part APPEARS as a part end; an ATTRIBUTE never does, whatever its type', async () => {
    await M1Catalog.load();
    const seed = (extra: { attributes?: AttributeModel[]; relationships?: RelationshipModel[] }): M1Catalog => {
      class Seeded extends M1Catalog {
        override classes(): ClassModel[] {
          return super.classes().map((c) =>
            c.name !== 'MethodModel'
              ? c
              : new ClassModel().init({ ...c.toJSON(), attributes: [...c.attributes, ...(extra.attributes ?? [])], relationships: [...c.relationships, ...(extra.relationships ?? [])] } as never),
          );
        }
      }
      return new Seeded().init();
    };
    const attribute = (name: string, type: string): AttributeModel => new AttributeModel().init({ name: name, type: type, visibility: 'public', initializer: '[]' } as never);
    const part = new RelationshipModel().init({ name: 'extras', kind: 'part', source: 'MethodModel', target: 'ImportModel', multiplicity: '0..n', redefines: '', initializer: '' } as never);
    expect(partMembers(seed({ relationships: [part] }))).toContain('MethodModel.extras'); // a part: the MODELLED kind says so
    expect(partMembers(seed({ attributes: [attribute('extras', 'ImportModel[]')] }))).not.toContain('MethodModel.extras'); // never inferred from an attribute's type
    expect(partMembers(seed({ attributes: [attribute('owner', 'Ior')] }))).toHaveLength(7); // a reference (Ior is a UcpUnit, rule A2) stays out too
  });

  it('F1 MECHANISM — a FRESH store written through the REAL put path (store -> ScenarioIndex.put -> NodeJSFile.link) yields ONLY RELATIVE type/ links, one per UNIT (S4: classes and parts), all resolving', async () => {
    await M1Catalog.load();
    const home = await packageHome('f1-relative');
    const loadAtStart = loadavg()[0] ?? 0;
    const spans: OwnCpu[] = []; // BEFORE the link spy: the reference's links are not the store's calls
    for (let sample = 1; sample <= REFERENCE_SAMPLES; sample += 1) {
      const span = new OwnCpu().init(`STORE same-run REFERENCE sample ${sample}/${REFERENCE_SAMPLES}`, Infinity, REFERENCE_CPU_FLOOR);
      await new ReferenceWork().init(home, sample).run();
      spans.push(span.stop());
    }
    const reference = new MedianCpu().init(spans); // F4 round 2: the MEDIAN of k, never one span
    const loadAtReference = loadavg()[0] ?? 0;
    const spy = vi.spyOn(NodeJSFile.prototype, 'link'); // observes, never replaces: the REAL link runs — type/ AND the (b) part links (oopPO R2: both through link())
    let calls = 0;
    let called: string[] = [];
    let roots = new HeldRoots();
    let speed: string[] = [];
    let ratioReading = '';
    const metrics = new GateMetrics().init(new Scratch().at(import.meta.url).fixture('gate-metrics')); // F4 (oopPO 2026-10-12 (4)): EVERY run leaves its ratio reading on disk
    try {
      const store = new OwnCpu().init('STORE FIRST store() of the whole catalog', Infinity, FIRST_STORE_CPU_FLOOR);
      await new M1Catalog().init().store(home);
      store.stop();
      speed = [...reference.verdict(), ...store.verdict()]; // F4 round 2: only the ZERO FLOORS gate (a span that measured nothing is RED by name, F-B); the RATIO is REPORTED, never asserted
      console.log(`F1 RATIO REPORT: reference ${reference.cpu.toFixed(3)} / store ${store.cpu.toFixed(3)} CPU-s = ratio ${(store.cpu / reference.cpu).toFixed(3)} (REPORTED, not a gate; median of ${REFERENCE_SAMPLES} reference samples ${reference.samples.map((x) => x.toFixed(3)).join('/')}) · load1 start ${loadAtStart.toFixed(2)} / after reference ${loadAtReference.toFixed(2)} / after store ${(loadavg()[0] ?? 0).toFixed(2)}`); // F4: every run reports its numbers, never a silent pass
      ratioReading = metrics.record('FIRST_STORE_RATIO', { reference: reference.cpu, store: store.cpu, ratio: store.cpu / reference.cpu, k: REFERENCE_SAMPLES, ...Object.fromEntries(reference.samples.map((cpu, i) => [`ref${i + 1}`, cpu])), load1Start: loadAtStart, load1Reference: loadAtReference, load1Store: loadavg()[0] ?? 0 });
      calls = spy.mock.calls.length;
      called = spy.mock.contexts.map((f) => (f as NodeJSFile).path); // the type path each link CALL wrote — kept even when the prune removes it again
      roots = new HeldRoots().init([...spy.mock.contexts]); // the file object each link CALL wrote through
    } finally {
      spy.mockRestore();
    }
    expect(roots.busy(100), 'N1 MECHANISM non-vacuous: BOTH roots (repo home, Scenario root) asked for over MANY links').toEqual([home.slice(0, -1), `${home}EAMD.ucp/Scenario`].sort());
    expect(roots.violations(), 'N1 MECHANISM: ONE held root folder object per root path across every link').toEqual([]);
    expect(metrics.recorded(ratioReading), `F4 instrument: the FIRST-store ratio reading is ON DISK (${metrics.path})`).toHaveLength(1);
    expect(speed, 'FIRST store + its reference spans measured REAL work (zero floors, F-B) — the ratio itself is a REPORTED metric (F4 round 2)').toEqual([]);
    // F-E: the named checks run BEFORE any count. The battery names what is ON DISK after the prune (dangling/absolute/misnamed …);
    // F-E'': a link the put path WROTE and the prune REMOVED again is not on disk, so ghosts() names it from the call record, by path.
    expect(new TypeAudit().init(home).violations(new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`)), 'links written by the put path').toEqual({});
    expect(new PartLinkAudit().init(home).violations(new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`)), 'component links written by the put path (S4 b)').toEqual({});
    expect(new TypeAudit().init(home).ghosts(called, new PartLinkAudit().init(home)), 'link CALLS that are not a derived unit\'s type or component link (written then pruned)').toEqual([]);
    const units = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).files().length;
    const componentLinks = new PartLinkAudit().init(home).links().length;
    expect(units).toBeGreaterThan(new M1Catalog().init().classes().length); // non-vacuous: parts are units
    expect(calls, 'the put path links through NodeJSFile.link, once per unit (type) + once per part (component)').toBe(units + componentLinks);
    const types = new TypeAudit().init(home);
    expect(types.links().length).toBe(units);
  }, 44000); // WALL (F4 round 2, A3 rule: 2.5 x the measured FULL-LOAD max, rounded up to 1000 ms): max 17299 ms over 14 fresh-clone whole-suite runs (tmp/f4r2-campaign.sh, uncensored: timeout lifted) WITH 9 reference samples — more work than the shipped k=3, so an upper bound; was 22000 for k=1

  it('F-E\'\' is failable without touching src: ghosts() names a link CALL that is not on disk (written then pruned) by its path, and passes the real links (seed -> RED)', () => {
    const home = `${new Scratch().at(import.meta.url).fixture('fe2-ghosts')}/`;
    const dir = `${home}EAMD.ucp/Scenario/type/X/XModel/latest`;
    mkdirSync(dir, { recursive: true });
    mkdirSync(`${home}EAMD.ucp/Scenario/Index`, { recursive: true });
    writeFileSync(`${home}EAMD.ucp/Scenario/Index/u1.scenario.json`, '{}');
    symlinkSync('../../../../Index/u1.scenario.json', `${dir}/x.u1.scenario.json`);
    const real = `${dir}/x.u1.scenario.json`;
    const ghost = `${dir}/x.00000000-0000-4000-8000-000000000000.scenario.json`; // the DANGLEXTRA shape: called, then pruned (never on disk)
    const audit = new TypeAudit().init(home);
    const none = new PartLinkAudit().init(`${new Scratch().at(import.meta.url).fixture('fe2-no-parts')}/`); // no component link at all: the derived set is the type links
    expect(audit.ghosts([real], none), 'GREEN: every call is a derived link').toEqual([]);
    expect(audit.ghosts([real, ghost, ghost], none), 'RED by NAME, once per call').toEqual([resolve(ghost), resolve(ghost)]);
  });

  it('F1 seed — an ABSOLUTE link written IN the real put path -> RED by the link\'s name', async () => {
    await M1Catalog.load();
    const home = await packageHome('f1-absolute-seed');
    let seeded = '';
    const spy = vi.spyOn(NodeJSFile.prototype, 'link').mockImplementationOnce(async function (this: NodeJSFile, target: string): Promise<NodeJSFile> {
      const fs = await import('node:fs/promises');
      await fs.mkdir(dirname(this.path), { recursive: true });
      await fs.symlink(resolve(target), this.path); // the seed: ONE link written ABSOLUTE inside the put path
      seeded = this.path;
      return this;
    });
    try {
      await new M1Catalog().init().store(home);
    } finally {
      spy.mockRestore();
    }
    expect(seeded, 'the seed ran inside the put path').not.toBe('');
    expect(new TypeAudit().init(home).absolute().map((l) => resolve(l)), 'named by the link').toEqual([resolve(seeded)]);
  }, 22000); // WALL (S4a, every unit linked): full-load max 8.71s (F1 MECHANISM timed out at the 8.5s default @63f07b7e; S4a seeds 5.49/6.42s in 2 clean full runs) -> 2.5 x 8.71s, rounded up. Speed: the FIRST-store CPU guard (F1 MECHANISM)

  it('R7b seed DANGLE A LINK -> RED by path: an Index file removed under its link is named by the link', async () => {
    await M1Catalog.load();
    const home = await packageHome('r7b-dangle');
    await new M1Catalog().init().store(home);
    const types = new TypeAudit().init(home);
    const victim = types.links()[0] ?? '';
    rmSync(realpathSync(victim)); // the seed: the Index file goes, the link stays
    expect(types.dangling()).toEqual([victim]);
    expect(lstatSync(victim).isSymbolicLink()).toBe(true);
  }, 13000);

  it('R7b seed DOUBLE-MINT (a uuid minted afresh per run) -> SEEN by name on the 2nd run: S4 names carry the uuid, so nothing collides; O3 PRUNE removes the 1st run\'s units — so EVERY class name is re-linked under a NEW uuid (the identity churn, named), never by two', async () => {
    await M1Catalog.load();
    const home = await packageHome('r7b-remint');
    class Reminting extends M1Catalog {
      override classes(): ClassModel[] {
        return super.classes().map((c) => new ClassModel().init({ ...c, uuid: crypto.randomUUID() })); // the seed (typed spread: its PARTS stay typed units — S3 stores them as units)
      }
    }
    const classLinks = (): Array<[string, string]> =>
      new TypeAudit()
        .init(home)
        .links()
        .filter((l) => l.includes('/M2AbstractClass/')) // P4 class B (plan 2026-10-11 ruling 3; scenario.md §1/§2 + ior.md canonical example as corrected by P1): a stored ClassModel unit is typed by its incorporating component M2AbstractClass — the SPEC's literal, never asked of the code under test
        .map((l) => /^(.*)\.([0-9a-f-]{36})\.scenario\.json$/.exec(l.split('/').pop() ?? '') ?? [])
        .map(([, name, uuid]) => [name ?? '', uuid ?? '']);
    await new Reminting().init().store(home);
    const first = new Map(classLinks());
    await new Reminting().init().store(home); // the 2nd run of the seed
    const second = classLinks();
    const names = new M1Catalog().init().classes().map((c) => c.name).sort();
    expect(second.map(([n]) => n).sort(), 'ONE link per class name — the 1st run\'s were pruned (O3)').toEqual(names);
    expect(second.filter(([n, u]) => first.get(n) !== u).map(([n]) => n).sort(), 'every class name re-linked under a NEW uuid').toEqual(names);
    }, 44000); // WALL: TWO fresh stores (each with its O3 prune) = 2 x the R7b first-store budget 22000 (timed out at the 8.5s default with prune, full suite)

  it('S4 COLLIDE NAMES (two classes, one name) -> BOTH stored, unique BY CONSTRUCTION: two type/ links <name>.<uuid> each resolving to its OWN Index file, nothing overwritten', async () => {
    await M1Catalog.load();
    const home = await packageHome('r7b-collide');
    const [a, b] = new M1Catalog().init().classes();
    if (a === undefined || b === undefined) throw new Error('fixture');
    const kept: ClassModel = a;
    const renamed = new ClassModel().init({ ...b, name: a.name }); // the seed: b renamed to a's name (typed spread: its parts stay typed units — S3)
    const realPackage = new M1Catalog().init().packageModel();
    class Colliding extends M1Catalog {
      override classes(): ClassModel[] {
        return [kept, renamed];
      }
      override packageModel(): ClassModel {
        return realPackage; // a PARTIAL catalog (the two colliding classes only) still names its package — the layout asks the catalog, never a literal (P2a, AC9)
      }
    }
    await new Colliding().init().store(home);
    const classLinks = new TypeAudit().init(home).links().filter((l) => l.includes('/M2AbstractClass/')).sort(); // P4 class B (plan 2026-10-11 ruling 3; scenario.md §1/§2 + ior.md canonical example as corrected by P1): a stored ClassModel unit is typed by its incorporating component M2AbstractClass — the SPEC's literal, never asked of the code under test
    expect(classLinks.map((l) => l.split('/').pop())).toEqual([`${a.name}.${a.uuid}.scenario.json`, `${a.name}.${b.uuid}.scenario.json`].sort());
    expect(classLinks.map((l) => (realpathSync(l).split('/').pop() ?? '').replace(/\.scenario\.json$/, '')).sort()).toEqual([a.uuid, b.uuid].sort()); // each resolves to its OWN unit
  }, 25000);

  it('P4 (rulings 3 + 5; ruling D STRUCK for the IOR type) — every committed Index file holds its model AS ITSELF (model = the model JSON + links + copies, NO model.model nesting) and its ior names the INCORPORATING component: a class <package qualified name>.MOF.M2.M2AbstractClass.latest/<its uuid>, a part <...>.MOF.M2.M2Abstract<X>.latest/<its uuid>', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const files = live().files();
    expect([live().missing(catalog), live().strays(catalog)], 'named BEFORE the owner count (F-E)').toEqual([[], []]);
    expect(live().classFiles().length).toBe(catalog.classes().length); // non-vacuous: every catalogued class (S3: owner files; parts are checked below too)
    const wrong = files.flatMap((f) => {
      const uuid = (f.split('/').pop() ?? '').replace(/\.scenario\.json$/, '');
      const stored = JSON.parse(readFileSync(f, 'utf8'));
      const problems = [];
      const owner = stored.ownerIor === '';
      if (owner && stored.ior !== `ior:instance://localhost:8080/${new M1Catalog().init().packageQualifiedName()}.MOF.M2.M2AbstractClass.latest/${uuid}`) problems.push(`ior ${stored.ior}`); // spec/eamd-ucp.md:72 @985e23841 (rule 7a) + P4 class B (plan 2026-10-11 ruling 3; scenario.md §1/§2 + ior.md canonical example as corrected by P1): a stored ClassModel unit is typed by its incorporating component M2AbstractClass — the SPEC's literal, never asked of the code under test
      if (!owner && !new RegExp(`^ior:instance://localhost:8080/${new M1Catalog().init().packageQualifiedName().replace(/\./g, '\\.')}\\.MOF\\.M2\\.M2Abstract\\w+\\.latest/${uuid}$`).test(String(stored.ior))) problems.push(`part ior ${stored.ior}`); // P4 class B (ruling 3): a PART names the component INCORPORATING its model (S3's 'its OWN model class' struck)
      if (!owner && !new RegExp(`^ior:instance://localhost:8080/${new M1Catalog().init().packageQualifiedName().replace(/\./g, '\\.')}\\.MOF\\.M2\\.M2Abstract\\w+\\.latest/[0-9a-f-]{36}$`).test(String(stored.ownerIor))) problems.push(`ownerIor ${stored.ownerIor}`); // P4 class B (ruling 3): the owner's IOR is component-typed too
      if ('model' in stored.model) problems.push('model.model nesting');
      if (stored.model.uuid !== uuid) problems.push(`model.uuid ${stored.model.uuid}`);
      if (!Array.isArray(stored.model.links) || !Array.isArray(stored.model.copies)) problems.push('links/copies');
      return problems.map((p) => `${uuid}: ${p}`);
    });
    expect(wrong).toEqual([]);
    expect(Object.keys(JSON.parse(readFileSync(live().classFiles()[0] ?? '', 'utf8')).model)).toContain('level'); // the ClassModel's OWN fields sit at the top of model
  });

  /**
   * S3.2 — the two NAMED guards of rule C (oopTester S3.1 gate b37be48b), read over Index file TEXTS (path -> JSON), so a
   * seed is a text edit and never depends on reproducing the committed Index. A unit is named by its file's uuid.
   */
  class UnitGraph {
    units = new Map<string, { ior: string; ownerIor: string; model: Record<string, unknown> }>();
    constructor() {}
    init(texts: Map<string, string>): this {
      for (const [f, t] of texts) this.units.set((f.split('/').pop() ?? '').replace(/\.scenario\.json$/, ''), JSON.parse(t));
      return this;
    }
    /** (a) every object carrying a `uuid` NESTED inside a unit's model — an embedded unit — named `<unit>: <path>`. */
    embedded(): string[] {
      const out: string[] = [];
      const walk = (unit: string, value: unknown, path: string): void => {
        if (Array.isArray(value)) value.forEach((v, k) => walk(unit, v, `${path}[${k}]`));
        else if (value !== null && typeof value === 'object') {
          if ('uuid' in value) out.push(`${unit}: ${path}`);
          for (const [k, v] of Object.entries(value)) walk(unit, v, `${path}.${k}`);
        }
      };
      for (const [unit, stored] of this.units) for (const [k, v] of Object.entries(stored.model)) walk(unit, v, `model.${k}`);
      return out;
    }
    /** (b) every PART whose ownerIor does not resolve to a stored OWNER that lists this part's IOR (itself included) — named. */
    wrongOwners(): string[] {
      const out: string[] = [];
      for (const [unit, stored] of this.units) {
        if (stored.ownerIor === '') continue;
        const ownerUuid = stored.ownerIor.split('/').pop() ?? '';
        const owner = this.units.get(ownerUuid);
        const lists = owner !== undefined && Object.values(owner.model).some((v) => Array.isArray(v) && v.includes(stored.ior));
        if (ownerUuid === unit || !lists) out.push(`${unit}: ownerIor ${stored.ownerIor}`);
      }
      return out;
    }
    parts(): string[] {
      return [...this.units].filter(([, s]) => s.ownerIor !== '').map(([u]) => u);
    }
    /** (c) every part IOR an owner LISTS with no stored unit behind it — named `<Owner>.<member>` (a dropped put). */
    dangling(): string[] {
      const out: string[] = [];
      for (const [unit, stored] of this.units) {
        for (const [member, value] of Object.entries(stored.model)) {
          if (!Array.isArray(value)) continue;
          for (const v of value) if (typeof v === 'string' && v.startsWith('ior:instance:') && !this.units.has(v.split('/').pop() ?? '')) out.push(`${String(stored.model.name) || unit}.${member}`);
        }
      }
      return out;
    }
  }

  /** The DISTINCT part units the catalog itself holds — walked from its OWN instances along each class's derived partEnds. */
  const catalogParts = (catalog: M1Catalog): Set<string> => {
    const found = new Set<string>();
    const pending: object[] = [...catalog.classes()];
    for (let unit = pending.pop(); unit !== undefined; unit = pending.pop()) {
      for (const end of Object.keys(Reflect.get(unit.constructor, 'partEnds') ?? {})) {
        const members: unknown = Reflect.get(unit, end);
        if (Array.isArray(members)) for (const part of members) if (!found.has(part.uuid)) {
          found.add(part.uuid);
          pending.push(part);
        }
      }
    }
    return found;
  };

  const graph = (): UnitGraph => new UnitGraph().init(live().bytes());

  it('S3.2 (a) NO EMBEDDED UNIT: no object with a uuid sits inside any committed Index file\'s model — parts are stored BY REFERENCE (rule C)', () => {
    const g = graph();
    expect(g.embedded()).toEqual([]);
    expect(g.parts().length, 'non-vacuous: part units exist').toBeGreaterThan(1000); // F-E': the comparison count AFTER the named check
  });

  it('S3.2 (b) OWNER RESOLVES: every part\'s ownerIor names a stored owner that LISTS that part — never itself, never a stranger', () => {
    const g = graph();
    expect(g.wrongOwners()).toEqual([]);
    expect(g.parts().length, 'non-vacuous').toBeGreaterThan(1000); // F-E': the comparison count AFTER the named check
  });

  it('S3.3 COUNT == classes + DISTINCT parts (derived from the catalog\'s own instances), and NO owner lists a part without a stored unit', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const g = graph();
    const parts = catalogParts(catalog);
    expect(parts.size, 'non-vacuous').toBeGreaterThan(1000);
    expect(g.dangling(), 'O1: named by Owner.member FIRST — the count below would only mask it').toEqual([]);
    expect(g.units.size, `Index = ${catalog.classes().length} classes + ${parts.size} parts`).toBe(catalog.classes().length + parts.size);
    expect(g.parts().sort()).toEqual([...parts].sort());
  });

  it('S3.3 seed DROP ONE PART PUT -> RED by Owner.member (and the derived count no longer holds)', async () => {
    await M1Catalog.load();
    const texts = live().bytes();
    const g = new UnitGraph().init(texts);
    const [part] = g.parts();
    const stored = g.units.get(part ?? '');
    const owner = g.units.get(stored?.ownerIor.split('/').pop() ?? '');
    const member = Object.entries(owner?.model ?? {}).find(([, v]) => Array.isArray(v) && v.includes(stored?.ior))?.[0] ?? '';
    const dropped = new Map([...texts].filter(([f]) => !f.endsWith(`/${part}.scenario.json`))); // the seed: one part never put
    expect(new UnitGraph().init(dropped).dangling(), 'RED by Owner.member').toEqual([`${String(owner?.model.name)}.${member}`]);
    expect(dropped.size).toBe(texts.size - 1); // the seed dropped exactly one — confirmed AFTER the name (F-E)
    expect(new UnitGraph().init(dropped).units.size).not.toBe(new M1Catalog().init().classes().length + catalogParts(new M1Catalog().init()).size);
  });

  /** O3: the units/links a store holds that the derivation does NOT — each named `<model name>.<uuid>`, so a RED says which. */
  const stale = (home: string, catalog: M1Catalog): string[] => {
    const derived = new Set([...catalog.classes().map((c) => c.uuid), ...catalogParts(catalog)]);
    const index = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).files();
    const links = new TypeAudit().init(home).links();
    const name = (f: string): string => (JSON.parse(readFileSync(f, 'utf8')) as { model: { name?: string } }).model.name ?? '';
    const uuidOf = (f: string): string => (f.split('/').pop() ?? '').replace(/\.scenario\.json$/, '').split('.').pop() ?? '';
    return [
      ...index.filter((f) => !derived.has(uuidOf(f))).map((f) => `Index ${name(f)}.${uuidOf(f)}`),
      ...links.filter((f) => !derived.has(uuidOf(f))).map((f) => `type ${(f.split('/').pop() ?? '').replace(/\.scenario\.json$/, '')}`),
    ].sort();
  };

  it('O3 PRUNE: regeneration makes the store EQUAL the derivation — remove an END (one class\'s methods), store again: every unit and type/ link of the removed end is GONE, the count matches, a .gitkeep survives; seed a NON-PRUNING store -> RED by name', async () => {
    await M1Catalog.load();
    const scratch = new Scratch().at(import.meta.url);
    const full = new M1Catalog().init();
    const reduced = full.classes();
    const victim = reduced.find((c) => c.methods.some((m) => m.parameters.length > 0));
    if (victim === undefined) throw new Error('fixture: no class with a parameterised method');
    const removed = [...victim.methods.map((m) => m.uuid), ...victim.methods.flatMap((m) => m.parameters.map((x) => x.uuid))];
    const firstEnd = `Index ${victim.methods[0]?.name ?? ''}.${victim.methods[0]?.uuid ?? ''}`; // the first removed unit, by name
    class RemoveEnd extends M1Catalog {
      override classes(): ClassModel[] {
        return reduced; // the end is removed below — the model no longer derives those units
      }
    }
    for (const [fixture, prunes] of [['o3-prune', true], ['o3-seed-no-prune', false]] as const) {
      const home = await packageHome(fixture);
      victim.methods = full.classes().find((c) => c.uuid === victim.uuid)?.methods ?? []; // the END, present
      await new RemoveEnd().init().store(home);
      writeFileSync(`${home}EAMD.ucp/Scenario/Index/.gitkeep`, ''); // non-unit content is never pruned
      const before = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`).uuids();
      expect(removed.every((u) => before.includes(u)), 'the end IS stored before it is removed (non-vacuous)').toBe(true);
      victim.methods = []; // REMOVE THE END
      class NoPrune extends RemoveEnd {
        override liveIndex(h = ''): ReturnType<M1Catalog['liveIndex']> {
          const index = super.liveIndex(h);
          index.prune = async (): Promise<string[]> => []; // the seed: a store that never prunes
          return index;
        }
      }
      await (prunes ? new RemoveEnd() : new NoPrune()).init().store(home);
      const named = stale(home, new RemoveEnd().init());
      if (prunes) {
        expect(named, 'O3: nothing stale').toEqual([]);
        const after = new StoreAudit().init(`${home}EAMD.ucp/Scenario/Index`);
        expect(new TypeAudit().init(home).violations(after), 'the pruned store\'s links, named BEFORE the counts (F-E)').toEqual({});
        expect(after.uuids().length, 'Index == classes + distinct parts of the CURRENT derivation').toBe(reduced.length + catalogParts(new RemoveEnd().init()).size);
        expect(new TypeAudit().init(home).links().length, 'one type/ link per unit').toBe(after.uuids().length);
        expect(existsSync(`${home}EAMD.ucp/Scenario/Index/.gitkeep`), '.gitkeep survives').toBe(true);
      } else {
        expect(named.length, 'the seed leaves the removed end behind').toBe(removed.length * 2);
        expect(named, 'RED by name').toContain(firstEnd);
      }
    }
    victim.methods = full.classes().find((c) => c.uuid === victim.uuid)?.methods ?? [];
  }, 60000); // WALL: 2 homes x (fresh store + re-store) — 2 x (22000 first-store + 9000 re-store, the R7b/2nd-store budgets) rounded down; speed is guarded by the store CPU guards, not here

  it('S3.2 seeds -> RED BY NAME (text edits of real Index files, no reproduce): a part EMBEDDED by value; a part naming a WRONG owner; a part naming ITSELF', () => {
    const texts = live().bytes();
    const g = new UnitGraph().init(texts);
    const [part] = g.parts();
    if (part === undefined) throw new Error('fixture: no part unit');
    const stored = g.units.get(part);
    const ownerUuid = stored?.ownerIor.split('/').pop() ?? '';
    const file = (uuid: string): string => [...texts.keys()].find((f) => f.endsWith(`/${uuid}.scenario.json`)) ?? '';
    // seed 1: the owner EMBEDS the part by value in place of its IOR
    const ownerText = texts.get(file(ownerUuid)) ?? '';
    const embedded = new Map(texts).set(file(ownerUuid), ownerText.replace(JSON.stringify(stored?.ior), JSON.stringify(stored?.model)));
    expect(embedded.get(file(ownerUuid)), 'seed 1 applied').not.toBe(ownerText);
    expect(new UnitGraph().init(embedded).embedded().map((n) => n.split(':')[0]), 'embedded -> RED naming the owner').toEqual([ownerUuid]);
    // seed 2: the part names ANOTHER class as its owner
    const stranger = [...g.units].find(([u, s]) => s.ownerIor === '' && u !== ownerUuid)?.[1].ior ?? '';
    const partText = texts.get(file(part)) ?? '';
    const wrong = new Map(texts).set(file(part), partText.replace(JSON.stringify(stored?.ownerIor), JSON.stringify(stranger)));
    expect(new UnitGraph().init(wrong).wrongOwners(), 'wrong owner -> RED by name').toEqual([`${part}: ownerIor ${stranger}`]);
    // seed 3: the part names ITSELF
    const self = new Map(texts).set(file(part), partText.replace(JSON.stringify(stored?.ownerIor), JSON.stringify(stored?.ior)));
    expect(new UnitGraph().init(self).wrongOwners(), 'self-owner -> RED by name').toEqual([`${part}: ownerIor ${stored?.ior}`]);
  });

  it('seed IOR-TYPE != STORED MODEL -> RED by name: a stored ClassModel whose IOR names ANOTHER component comes back as THAT component and storedClass refuses it, naming it (P4 class B, ruling 5: the IOR decides, never the content)', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const home = await packageHome('r7a-d-iortype');
    await catalog.store(home);
    const victim = catalog.classes()[0];
    const other = catalog.classes().find((c) => c.name === 'AttributeModel');
    const self = catalog.classes().find((c) => c.name === 'ClassModel');
    if (victim === undefined || other === undefined || self === undefined || other.namespace !== self.namespace) throw new Error('fixture: AttributeModel and ClassModel share a namespace');
    const file = `${home}EAMD.ucp/Scenario/Index/${new M1Catalog().init().liveIndex(home).pathOf(victim.uuid)}`;
    expect(await catalog.storedClass(victim.uuid, home)).toBeInstanceOf(ClassModel); // GREEN before the seed
    const text = readFileSync(file, 'utf8');
    expect(text, 'the stored IOR is component-typed before the seed').toContain('.MOF.M2.M2AbstractClass.latest/');
    writeFileSync(file, text.replace('.MOF.M2.M2AbstractClass.latest/', '.MOF.M2.M2AbstractAttribute.latest/')); // the seed: another LOADED component (P4: the IOR names a component, never a model)
    await expect(catalog.storedClass(victim.uuid, home)).rejects.toThrow(`M1Catalog.storedClass: '${victim.uuid}' is a M2AbstractAttribute`);
  }, 15000);

  it('seed UNLOADED Model-class IOR -> RED by name: an IOR naming a class nobody loaded is a named error, never a guessed class', async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    const home = await packageHome('r7a-d-unloaded');
    await catalog.store(home);
    const victim = catalog.classes()[0];
    if (victim === undefined) throw new Error('fixture: empty catalog');
    const file = `${home}EAMD.ucp/Scenario/Index/${new M1Catalog().init().liveIndex(home).pathOf(victim.uuid)}`;
    const text = readFileSync(file, 'utf8');
    expect(text, 'the stored IOR is component-typed before the seed').toContain('.MOF.M2.M2AbstractClass.latest/');
    writeFileSync(file, text.replace('.MOF.M2.M2AbstractClass.latest/', '.MOF.M2.GhostComponent.latest/')); // the seed (P4 class B: the old '.ClassModel.latest/' replace became a silent no-op once IORs name the component)
    await expect(catalog.storedClass(victim.uuid, home)).rejects.toThrow(`ScenarioIndex.get: '${new M1Catalog().init().packageQualifiedName()}.MOF.M2.GhostComponent' is not a loaded unit class (ior.md rule 9)`);
  }, 13000);
});

/**
 * R7a authority (Tron: a configurable MODEL default; oopPO: the METAMODEL way, efc8e444). ScenarioIndexModel.profile's DEFAULT
 * lives in ONE fact — its RelationshipModel.initializer — and EVERY target renders it; the store carries that default only.
 */
describe('R7a — the profile default is a RELATIONSHIP INITIALIZER every target renders; the store carries only the default', () => {
  const catalog = new M1Catalog().init();
  const marker = /host: 'localhost',\s+port: 8080/;
  /** The renderer gate: a language that drops the end's initializer is named. */
  const unrendered = (language: M2ES2020Class): string[] => {
    const source = language.within(catalog.homeLayout()).createExisting(catalog).find((m1) => m1.name === 'ScenarioIndexModel')?.toSource() ?? ''; // the production path; render only, nothing written
    return marker.test(source) ? [] : [`${language.constructor.name}: ScenarioIndexModel.profile renders no initializer`];
  };

  it('every target that renders an end renders its initializer (TS, ES2020, Thinglish ts/js, Thing)', () => {
    const rendering = catalog.languages().filter((l) => !['M2MermaidClass', 'M2PlantUmlClass', 'M2OoshClass'].includes(l.constructor.name)); // Mermaid and PlantUML show no initializer (spec/puml.md rule 1: attributes and relationship ends alike); OOSH renders no ends
    expect(rendering.map((l) => l.constructor.name)).toEqual(expect.arrayContaining(['M2TypescriptClass', 'M2ES2020Class', 'M2ThinglishTypescriptClass', 'M2ThinglishClass', 'M2ThingClass']));
    expect(rendering.flatMap((l) => unrendered(l))).toEqual([]);
  });

  it('is failable PER RENDERER: a TS and an ES2020 renderer that still hard-code undefined are each RED by name (seed -> RED)', () => {
    class HardCodedTypescript extends M2TypescriptClass {
      protected override relationshipFieldLines(end: M2AbstractRelationship): string[] {
        return [`  ${end.name}: ${this.endType(end)} = ${end.isMany ? '[]' : 'undefined'};`]; // the seed: the pre-R7a body
      }
    }
    class HardCodedES2020 extends M2ES2020Class {
      protected override relationshipFieldLines(end: M2AbstractRelationship): string[] {
        return [`  ${end.name} = ${end.isMany ? '[]' : 'undefined'};`]; // the seed: the pre-R7a body
      }
    }
    expect(unrendered(new HardCodedTypescript().init())).toEqual(['HardCodedTypescript: ScenarioIndexModel.profile renders no initializer']);
    expect(unrendered(new HardCodedES2020().init())).toEqual(['HardCodedES2020: ScenarioIndexModel.profile renders no initializer']);
  });

  it('the live Index is a typed JSON init {name}: its profile IS the model default (localhost:8080), never a production authority', () => {
    expect(catalog.liveIndex().profile?.address).toBe('localhost:8080');
    expect(readFileSync('EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.ts', 'utf8')).not.toMatch(/new ScenarioIndexModel\(|new InternetProfile\(/);
  });

  /** Index files whose stored authority is not the default (or that name a production host / port 1234). */
  const foreignAuthority = (files: Record<string, string>): string[] =>
    Object.entries(files)
      .filter(([, text]) => !text.includes('ior:instance://localhost:8080/') || /wo-da|"port":\s*1234\b|:1234\//.test(text))
      .map(([f]) => f);

  it('acceptance (a): EVERY committed Index file carries the DEFAULT authority — no port 1234, no production host', () => {
    const root = 'EAMD.ucp/Scenario/Index';
    const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(`${dir}/${e.name}`) : e.name.endsWith('.scenario.json') ? [`${dir}/${e.name}`] : []));
    const files = Object.fromEntries(walk(root).map((f) => [f, readFileSync(f, 'utf8')]));
    const owners = new Set(Object.entries(files).filter(([, t]) => (JSON.parse(t) as { ownerIor: string }).ownerIor === '').map(([f]) => (f.split('/').pop() ?? '').replace(/\.scenario\.json$/, '')));
    const catalogued = new Set(catalog.classes().map((c) => c.uuid));
    expect([catalog.classes().filter((c) => !owners.has(c.uuid)).map((c) => c.name), [...owners].filter((u) => !catalogued.has(u))], 'named BEFORE the owner count (F-E): missing classes, stray owner files').toEqual([[], []]);
    expect(Object.values(files).filter((t) => (JSON.parse(t) as { ownerIor: string }).ownerIor === ''), 'S3: one OWNER file per class; parts are scanned too').toHaveLength(catalog.classes().length);
    expect(foreignAuthority(files)).toEqual([]);
    expect(foreignAuthority({ seeded: '{ "ior": "ior:instance://prod.wo-da.de:1234/Web4MDA.ScenarioUnit.latest/x" }' })).toEqual(['seeded']); // the seed -> RED
  });

  /**
   * F-E as a PATTERN (oopPO, after the 4th repeat: O1, DUPLINK, F-D, the put path): in EVERY test, a COUNT of units/links
   * comes only AFTER the named checks. Derived, never a hand list:
   * - AUDIT classes = the test-local classes that define a NAMED check;
   * - NAMED checks  = the audit members this text asserts EMPTY (`…).toEqual([])` / `…).toEqual({})` / `[[], []]`);
   * - COUNT sources = every other audit member (links, files, uuids, bytes, classFiles, classUuids, recorded, units, …),
   *   plus every local bound from one (transitively — `units = …files().length`, `dropped = …texts…`);
   * - a COUNT assert = an `expect(` line ending in `toBe(`/`toHaveLength(` OR a comparison (`toBeGreaterThan(`,
   *   `toBeGreaterThanOrEqual(`, `toBeLessThan(`, `toBeLessThanOrEqual(` — F-D'/F-E': a non-vacuity floor IS a count) that reads a count source/binding off
   *   `.length`/`.size`, by `toHaveLength`, or compares to a bound count.
   * A test whose first count assert precedes its first named check (or has none) is an offender, named by its title.
   */
  class CountAfterName {
    private text = '';
    constructor() {}
    init(text: string): this {
      this.text = text;
      return this;
    }
    private get lines(): string[] {
      return this.text.split('\n');
    }
    /** member names per test-local class (`  class X {` … `  }`): methods, getters, fields. */
    private members(): Map<string, Set<string>> {
      const out = new Map<string, Set<string>>();
      let current = '';
      for (const line of this.lines) {
        const opened = /^ {2}class (\w+)\b.*\{$/.exec(line);
        if (opened !== null) current = opened[1] ?? '';
        else if (/^ {2}\}$/.test(line)) current = '';
        else if (current !== '') {
          const m = /^ {4}(?:private |static |readonly |get )*(\w+)\s*(?:\(|[:=])/.exec(line);
          if (m !== null && m[1] !== 'constructor' && m[1] !== 'init') out.set(current, new Set([...(out.get(current) ?? []), m[1] ?? '']));
        }
      }
      return out;
    }
    /** audit members asserted EMPTY anywhere in the text. */
    get named(): Set<string> {
      const all = new Set([...this.members().values()].flatMap((ms) => [...ms]));
      const asserted = this.lines.filter((l) => /\)\.toEqual\((\[\]|\{\}|\[\[\], \[\]\])\);/.test(l)).flatMap((l) => [...l.matchAll(/\.(\w+)\(/g)].map((m) => m[1] ?? ''));
      return new Set(asserted.filter((m) => all.has(m)));
    }
    /** the members of the unit/link audit classes that are NOT named checks. */
    get sources(): Set<string> {
      const named = this.named;
      const audits = this.audits;
      return new Set([...this.members()].filter(([c]) => audits.includes(c)).flatMap(([, ms]) => [...ms]).filter((m) => !named.has(m)));
    }
    /** the named checks OF the unit/link audits (a CPU guard's empty verdict() names no unit). */
    get namedChecks(): Set<string> {
      const audits = this.audits;
      const own = new Set([...this.members()].filter(([c]) => audits.includes(c)).flatMap(([, ms]) => [...ms]));
      return new Set([...this.named].filter((m) => own.has(m)));
    }
    /** `it('title', …` blocks: title + body lines (up to the next `it(` at the same indent or the describe end). */
    blocks(): Array<{ title: string; body: string[] }> {
      const out: Array<{ title: string; body: string[] }> = [];
      for (const line of this.lines) {
        const it = /^ {2}it\((['`])(.*?)\1/.exec(line);
        if (it !== null) out.push({ title: it[2] ?? '', body: [] });
        else if (/^ {2}\S/.test(line) && !/^ {2}\}/.test(line)) out.push({ title: '', body: [] }); // a non-test top-level statement ends the block
        else out[out.length - 1]?.body.push(line);
      }
      return out.filter((b) => b.title !== '');
    }
    /**
     * The UNIT/LINK audit classes: test-local classes that define a named check AND whose other members are COUNTED
     * somewhere in the text (`.links().length`, `.units.size`) — derived; a CPU guard defines a named check but counts nothing.
     */
    private get audits(): string[] {
      const named = this.named;
      return [...this.members()]
        .filter(([, ms]) => [...ms].some((m) => named.has(m)))
        .filter(([, ms]) => [...ms].some((m) => !named.has(m) && new RegExp(`\\.${m}(\\([^()]*\\))?\\.(length|size)\\b`).test(this.text)))
        .map(([c]) => c);
    }
    /** File-level helpers TYPED as an audit (`const live = (): StoreAudit => …`): calling one yields an audit receiver. */
    private get helpers(): string[] {
      const audits = this.audits;
      return this.lines.map((l) => /^\s+const (\w+) = \([^)]*\): (\w+) =>/.exec(l)).filter((m) => m !== null && audits.includes(m[2] ?? '')).map((m) => m?.[1] ?? '');
    }
    /** The offending tests: first unit/link COUNT before the first named check (or none), named `title @ count line`. */
    offenders(): string[] {
      const named = this.namedChecks;
      const sources = [...this.sources];
      const audits = this.audits;
      const helpers = this.helpers;
      const out: string[] = [];
      for (const { title, body } of this.blocks()) {
        const receivers = new Set<string>(); // locals holding an audit object
        const bound = new Set<string>(); // locals holding units/links read off an audit (transitively)
        const counts = new Set<string>(); // locals holding a COUNT of them (`units = …files().length`)
        const uses = (l: string, set: Set<string>): boolean => [...set].some((b) => new RegExp(`\\b${b}\\b(?!\\()`).test(l));
        /** a count source read off an audit receiver: `new Audit().init(…).files()`, `live().files()`, `types.links()`, `g.units` */
        const readsSource = (l: string): boolean =>
          sources.some((m) =>
            new RegExp(`(new (${audits.join('|')})\\(\\)\\.init\\((?:[^()]|\\([^()]*\\))*\\)|\\b(${[...helpers, 'x'].join('|')})\\(\\)|\\b(${[...receivers, 'x'].join('|')})\\b)\\.${m}\\b`).test(l),
          );
        const counting = (l: string): boolean => /\.(length|size)\b|toHaveLength\(/.test(l);
        let firstNamed = -1;
        let firstCount = -1;
        body.forEach((l, i) => {
          const binding = /^\s+(?:const|let) (\w+)\s*=/.exec(l) ?? /^\s+const \[(\w+)/.exec(l);
          if (binding !== null && (new RegExp(`new (${audits.join('|')})\\(\\)`).test(l) || new RegExp(`=\\s*(${[...helpers, 'x'].join('|')})\\(\\)\\s*;`).test(l)) && !readsSource(l)) receivers.add(binding[1] ?? '');
          else if (binding !== null && (readsSource(l) || uses(l, bound))) (counting(l) ? counts : bound).add(binding[1] ?? '');
          if (firstNamed < 0 && /^\s+expect\(/.test(l) && [...l.matchAll(/\.(\w+)\(/g)].some((m) => named.has(m[1] ?? ''))) firstNamed = i;
          const counted = /^\s+expect\(/.test(l) && /\)\.(not\.)?(toBe|toHaveLength|toBeGreaterThan|toBeGreaterThanOrEqual|toBeLessThan|toBeLessThanOrEqual)\(/.test(l) && (((readsSource(l) || uses(l, bound)) && counting(l)) || uses(l, counts));
          if (firstCount < 0 && counted) firstCount = i;
        });
        if (firstCount >= 0 && (firstNamed < 0 || firstNamed > firstCount)) out.push(`${title} @ ${(body[firstCount] ?? '').trim().slice(0, 80)}`);
      }
      return out;
    }
  }

  const testFiles = (dir = 'EAMD.ucp'): string[] =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? (e.name === 'gen' && dir.endsWith('/test') ? [] : testFiles(`${dir}/${e.name}`)) : e.name.endsWith('.test.ts') ? [`${dir}/${e.name}`] : []));

  it('F-E PATTERN — in EVERY test file, a unit/link COUNT comes only AFTER the named checks (derived: named checks, count sources, bindings; offenders named by test title)', () => {
    const files = testFiles();
    expect(files.length, 'non-vacuous: the whole test tree is scanned').toBeGreaterThan(20);
    const self = new CountAfterName().init(readFileSync(new URL(import.meta.url).pathname, 'utf8'));
    expect([...self.named].sort(), 'the named checks are DERIVED from this file').toEqual(expect.arrayContaining(['dangling', 'missing', 'misnamed', 'multiLinked', 'strays', 'violations']));
    expect([...self.sources].sort(), 'the count sources are DERIVED too').toEqual(expect.arrayContaining(['bytes', 'classFiles', 'classUuids', 'files', 'links', 'units']));
    const offenders = files.flatMap((f) => new CountAfterName().init(readFileSync(f, 'utf8')).offenders().map((o) => `${f}: ${o}`));
    expect(offenders).toEqual([]);
  });

  it('F-E PATTERN is failable: a count BEFORE its named check, a count with NO named check, a count via a BINDING, and a COMPARISON count (toBeGreaterThan/OrEqual, toBeLessThan/OrEqual — F-D prime) are each named; named-first stays GREEN (seed -> RED)', () => {
    const fixture = [
      'describe(\'x\', () => {',
      '  class Audit {',
      '    constructor() {}',
      '    links(): string[] {',
      '      return [];',
      '    }',
      '    dangling(): string[] {',
      '      return [];',
      '    }',
      '  }',
      '',
      "  it('GREEN named first', () => {",
      '    const a = new Audit();',
      '    expect(a.dangling()).toEqual([]);',
      '    expect(a.links().length).toBe(3);',
      '  });',
      "  it('RED count first', () => {",
      '    const a = new Audit();',
      '    expect(a.links().length).toBe(3);',
      '    expect(a.dangling()).toEqual([]);',
      '  });',
      "  it('RED no name at all', () => {",
      '    const a = new Audit();',
      '    expect(a.links()).toHaveLength(3);',
      '  });',
      "  it('RED via a binding', () => {",
      '    const a = new Audit();',
      '    const units = a.links().length;',
      '    expect(calls).toBe(units);',
      '    expect(a.dangling()).toEqual([]);',
      '  });',
      "  it('GREEN not a count of units', () => {",
      '    expect(other.length).toBe(3);',
      '  });',
      "  it('RED comparison count first (F-D prime)', () => {",
      '    const a = new Audit();',
      "    expect(a.links().length, 'non-vacuous').toBeGreaterThan(0);",
      '    expect(a.dangling()).toEqual([]);',
      '  });',
      "  it('RED greater-or-equal via a binding', () => {",
      '    const a = new Audit();',
      '    const links = a.links();',
      '    expect(links.length).toBeGreaterThanOrEqual(1);',
      '    expect(a.dangling()).toEqual([]);',
      '  });',
      "  it('RED less-than with no name', () => {",
      '    const a = new Audit();',
      '    expect(a.links().length).toBeLessThan(9);',
      '  });',
      "  it('RED less-or-equal before the name', () => {",
      '    const a = new Audit();',
      '    expect(a.links().length).toBeLessThanOrEqual(9);',
      '    expect(a.dangling()).toEqual([]);',
      '  });',
      "  it('GREEN comparison after the name', () => {",
      '    const a = new Audit();',
      '    expect(a.dangling()).toEqual([]);',
      "    expect(a.links().length, 'non-vacuous').toBeGreaterThan(0);",
      '  });',
      '});',
      '',
    ].join('\n');
    const gate = new CountAfterName().init(fixture);
    expect([...gate.named], 'derived from the fixture itself').toEqual(['dangling']);
    expect([...gate.sources]).toEqual(['links']);
    expect(gate.offenders().map((o) => o.split(' @ ')[0])).toEqual([
      'RED count first',
      'RED no name at all',
      'RED via a binding',
      'RED comparison count first (F-D prime)',
      'RED greater-or-equal via a binding',
      'RED less-than with no name',
      'RED less-or-equal before the name',
    ]);
  });
});

/**
 * S4b carrier gate, ONE source (oopPO P5 Q2=A): the DERIVED owner key (owners() = the class's HOME folder qualified name, Q1=A)
 * against what is RENDERED (the LOADED class's generated `static get component()`), against a key COMPOSED from the LOADED
 * classes' own namespace getters (never ClassModel fields, never a layout PATH), and against the folder M1Layout lays out.
 * Ownership itself is M1Layout.ownerOf (rule 6) — the one owner derivation, never re-implemented here.
 */
class CarrierAudit {
  private catalog: M1Catalog = new M1Catalog();
  private loaded: Loaded = new Loaded();
  private layout: M1Layout | undefined = undefined;
  constructor() {}
  async init(): Promise<this> {
    await M1Catalog.load();
    this.catalog = new M1Catalog().init();
    this.loaded = await new Loaded().init();
    this.layout = M1Layout.pathsOnly(this.catalog);
    return this;
  }
  get classes(): ClassModel[] {
    return this.catalog.classes();
  }
  /** The ONE source: each class's derived owner key. */
  derived(): Record<string, string> {
    return { ...this.catalog.owners() };
  }
  ownerOf(c: ClassModel): string {
    if (this.layout === undefined) throw new Error('CarrierAudit: init() first');
    return this.layout.ownerOf(c);
  }
  /** The LOADED class's own static getter `key` ('namespace' | 'component'). */
  private own(name: string, key: string): string {
    return String(Reflect.get(this.loaded.ctor(name) as object, key) ?? '');
  }
  /** The package, DERIVED from the LOADED classes: the one whose own `<namespace>.<name>` IS the package qualified name the catalog READS from the folders (rule 7a, AC9) — exactly one. */
  packageName(): string {
    const qualified = this.catalog.packageQualifiedName();
    const roots = this.classes.filter((c) => `${this.own(c.name, 'namespace')}.${c.name}` === qualified).map((c) => c.name);
    if (roots.length !== 1) throw new Error(`CarrierAudit: exactly ONE loaded class must BE the package '${qualified}' (<own namespace>.<name>) — found ${roots.join(', ')}`);
    return roots[0] ?? '';
  }
  /** The oracle key: a class the package owns keys as its OWN namespace (M1Layout.homeOf for unheld classes); else Mof.key(owner's namespace, owner). */
  oracle(c: ClassModel): string {
    const owner = this.ownerOf(c);
    if (c.name === this.packageName()) return Mof.key(this.own(c.name, 'namespace'), c.name); // rule 7a: the PACKAGE keys at its qualified name (its namespace sits one level above it)
    return owner === this.packageName() ? this.own(c.name, 'namespace') : Mof.key(this.own(owner, 'namespace'), owner);
  }
  ownNamespaceDiffers(models: ClassModel[]): ClassModel[] {
    return models.filter((c) => this.own(c.name, 'namespace') !== this.own(this.ownerOf(c), 'namespace'));
  }
  packageOwned(models: ClassModel[]): ClassModel[] {
    const pkg = this.packageName();
    return models.filter((c) => this.ownerOf(c) === pkg);
  }
  /** The named checks over `models` against a DERIVED map (default: the catalog's) — each a list of class names; only the failing ones are reported. */
  violations(models: ClassModel[], derived: Record<string, string> = this.derived()): Record<string, string[]> {
    if (this.layout === undefined) throw new Error('CarrierAudit: init() first');
    const out: Record<string, string[]> = { codeOff: [], oracleOff: [], folderOff: [] };
    for (const c of models) {
      const key = derived[c.name] ?? '';
      if (this.own(c.name, 'component') !== key) out['codeOff']?.push(c.name); // RENDERED == DERIVED
      if (key !== this.oracle(c)) out['oracleOff']?.push(c.name);
      const folder = this.layout.definitionFolder(c.name).path;
      if (!folder.endsWith(`/${key.split('.').join('/')}/latest/model`) || !existsSync(folder)) out['folderOff']?.push(c.name);
    }
    return Object.fromEntries(Object.entries(out).filter(([, names]) => names.length > 0));
  }
  /** Every catalogued class's STORED unit in the live store: its name and the component it carries ('' = none). */
  stored(): { name: string; component: string }[] {
    const index = this.catalog.liveIndex();
    return this.classes.map((c) => {
      const model = JSON.parse(readFileSync(`${index.name}/${index.pathOf(c.uuid)}`, 'utf8')).model;
      return { name: c.name, component: String(model.component ?? '') };
    });
  }
  /** The stored units that still CARRY a component key (Q2: derived, never stored). */
  storedOff(units: { name: string; component: string }[]): string[] {
    return units.filter((u) => u.component !== '').map((u) => u.name);
  }
}

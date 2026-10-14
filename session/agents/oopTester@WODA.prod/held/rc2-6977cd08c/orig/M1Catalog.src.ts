import { Mof } from '../../../../../../../../latest/src/ts/EAM/layer2/Mof.js';
import { Model } from '../../../../../../../../latest/src/ts/EAM/layer3/Model.js';
import { NodeJSFile } from '../../../../../../../../DefaultFile/latest/src/ts/EAM/layer2/NodeJSFile.js';
import { NodeJSFolder } from '../../../../../../../../DefaultFolder/latest/src/ts/EAM/layer2/NodeJSFolder.js';
import { DefaultFolder } from '../../../../../../../../DefaultFolder/latest/src/ts/EAM/layer2/DefaultFolder.js';
import { AttributeModel } from '../../../../../../../../latest/src/ts/EAM/layer3/AttributeModel.js';
import { ClassModel } from '../../../../../../../../latest/src/ts/EAM/layer3/ClassModel.js';
import { UcpUnit } from '../../../../../../../../latest/src/ts/EAM/layer2/UcpUnit.js';
import { ModelUnit } from '../../../../../../../../latest/src/ts/EAM/layer3/ModelUnit.js';
import { InternetProfile } from '../../../../../../../../Ior/InternetProfile/latest/src/ts/EAM/layer2/InternetProfile.js';
import { ScenarioIndex } from '../../../../../../../../ScenarioIndex/latest/src/ts/EAM/layer2/ScenarioIndex.js';
import { ScenarioIndexModel } from '../../../../../../../../ScenarioIndex/latest/src/ts/EAM/layer3/ScenarioIndexModel.js';
import { ScenarioUnit } from '../../../../../../../../ScenarioUnit/latest/src/ts/EAM/layer2/ScenarioUnit.js';
import { M2ES2020Class } from '../../../../../../../M2/M2ES2020Class/latest/src/ts/EAM/layer2/M2ES2020Class.js';
import { M1Layout } from '../../../../../../M1Layout/latest/src/ts/EAM/layer2/M1Layout.js';
import { M2ThinglishClass } from '../../../../../../../M2/M2ThinglishClass/latest/src/ts/EAM/layer2/M2ThinglishClass.js';
import { M2ThinglishTypescriptClass } from '../../../../../../../M2/M2ThinglishTypescriptClass/latest/src/ts/EAM/layer2/M2ThinglishTypescriptClass.js';
import { ImportModel } from '../../../../../../../../latest/src/ts/EAM/layer3/ImportModel.js';
import { M2MermaidClass } from '../../../../../../../M2/M2MermaidClass/latest/src/ts/EAM/layer2/M2MermaidClass.js';
import { M2ThingClass } from '../../../../../../../M2/M2ThingClass/latest/src/ts/EAM/layer2/M2ThingClass.js';
import { M2PlantUmlClass } from '../../../../../../../M2/M2PlantUmlClass/latest/src/ts/EAM/layer2/M2PlantUmlClass.js';
import { M2TypescriptClass } from '../../../../../../../M2/M2TypescriptClass/latest/src/ts/EAM/layer2/M2TypescriptClass.js';
import { MethodModel } from '../../../../../../../../latest/src/ts/EAM/layer3/MethodModel.js';
import { ParameterModel } from '../../../../../../../../latest/src/ts/EAM/layer3/ParameterModel.js';
import { RelationshipModel } from '../../../../../../../../latest/src/ts/EAM/layer3/RelationshipModel.js';
import { TypeAliasModel } from '../../../../../../../../latest/src/ts/EAM/layer3/TypeAliasModel.js';
import { UcpComponent } from '../../../../../../../../latest/src/ts/EAM/layer2/UcpComponent.js';
import { DefinitionSource } from '../../../../../../../../latest/src/ts/EAM/layer2/DefinitionSource.js';
import { M2AbstractDependency } from '../../../../../../../M2/M2AbstractDependency/latest/src/ts/EAM/layer2/M2AbstractDependency.js';

/**
 * M1Catalog — the models of the classes that currently exist at M1 in this repository
 * (`src/Model.ts`, `src/ModelUnit.ts`, `src/ItemModel.ts`, `src/Web4MDAModel.ts`, `src/Web4MDA.ts`).
 * No scenario store yet (Tron): the models — and their once-minted uuids — live here in code until then.
 * The catalog owns the knowledge "which M1 classes exist and what they look like";
 * the M2 classes create them from it. Gated against the files on disk in M1Catalog.test.ts.
 */
export class M1Catalog extends UcpComponent<ClassModel> {
  private ownerKeys: Record<string, string> | undefined = undefined;
  private outputTail: string | undefined = undefined;
  private packageKey: string | undefined = undefined;
  constructor() {
    super();
  }

  /** The placed unit declares its namespace like every generated class (spec/ior.md rule 9): it registers as com.ceruleanCircle.Web4MDA.MOF.M1.M1Catalog (rule 7a: below the package qualified name). */
  static override get namespace(): string {
    return 'com.ceruleanCircle.Web4MDA.MOF.M1';
  }

  static override get typeArguments(): Record<string, Array<abstract new () => object>> {
    return { UcpComponent: [ClassModel] };
  }

  /**
   * ATTACHES every catalogued `ClassModel` to the loaded class of that name (bootstrap.md rule 7): the models stop
   * sitting unattached here and REACH the classes, which then answer `type()` without consulting this catalog.
   * Answers the names that had no loaded class to receive them — a class whose code was never imported.
   */
  attach(): string[] {
    UcpUnit.start.call(ClassModel, [], ''); // ruling D: the stored MODEL class enters the registry through the ONE entry point (AC8) — a ClassModel stored as itself is a unit whose IOR names it
    for (const part of this.partClasses()) UcpUnit.start.call(part, [], ''); // S3: every stored PART's class too — a part unit's own IOR names it (ior.md rule 8)
    const unattached = [];
    for (const c of this.classes()) if (!Mof.attach(c.name, c)) unattached.push(c.name);
    return unattached;
  }

  /**
   * The Model classes of every stored PART (subscenarios by IOR, S3) — DERIVED from the catalog's own part instances along
   * each class's derived `partEnds` (ruling 2), recursively (a method's parameters are parts of a part); never a list.
   */
  partClasses(): Function[] {
    const found = new Set<Function>();
    const pending: object[] = [...this.classes()];
    for (let unit = pending.pop(); unit !== undefined; unit = pending.pop()) {
      for (const end of Object.keys(Reflect.get(unit.constructor, 'partEnds') ?? {})) {
        const members: unknown = Reflect.get(unit, end);
        if (!Array.isArray(members)) continue;
        for (const part of members) {
          found.add(part.constructor);
          pending.push(part);
        }
      }
    }
    return [...found];
  }

  /**
   * The ONE scratch folder of the product, relative to a component's `latest` (plan 2026-10-06 H2/H3, oopPO ruling A):
   * every test/gate scratch lives in `…/Web4MDA/latest/test/gen/` — never the OS tmpdir — and EVERY walker skips a
   * `latest/<scratchFolder>` (this catalog's held-file walk, vitest discovery, the layout/tree/doc gates). Owned HERE,
   * by the walker that must obey it; the test-support Scratch derives its root from it (test -> product, never back).
   */
  get scratchFolder(): string {
    return 'test/gen';
  }

  /** The OS tmpdir of every process of a run (TMPDIR), inside the scratch folder: `…/latest/test/gen/tmp`. */
  get scratchTmp(): string {
    return `${this.scratchFolder}/tmp`;
  }

  /**
   * npm's cache — and with it npm's debug logs (`<cache>/_logs`, the one place BOTH npm 8 and npm 10 honour) — inside
   * the scratch folder: `…/latest/test/gen/npm`, never `~/.npm` (plan H4(a)). Mirrored by the project `.npmrc` (the
   * customer's outer npm, repo-relative) and by the bootstrap env `npm_config_cache` (every spawned npm, absolute).
   */
  get scratchNpmCache(): string {
    return `${this.scratchFolder}/npm`;
  }

  /**
   * Whether a folder IS a scratch folder (`…/latest/test/gen`) — what a
   * descending walker asks before it descends, so nothing inside one is ever reached. Only the folder's own END decides:
   * a walk rooted INSIDE a scratch copy (a test's scratch clone of the repo) still sees that copy's tree.
   */
  isScratch(dir: string): boolean {
    const path = `/${dir.replace(/\\/g, '/').replace(/\/+$/, '')}`;
    return path.endsWith(`/latest/${this.scratchFolder}`);
  }


  /**
   * The language the components are WRITTEN in — their own `src/ts` holds it, so a generated copy would only
   * mirror them (spec 12 AC6, rule 6: nothing mirrors whatever the component folders hold). generate()
   * never writes it; the reproduce gate proves catalog -> TypeScript == the components' src.
   */
  get heldLanguage(): M2ES2020Class {
    return new M2TypescriptClass().init().resolving(this);
  }

  /** The languages every M1 class is generated in. */
  languages(): M2ES2020Class[] {
    return [
      new M2TypescriptClass().init(),
      new M2ES2020Class().init(),
      new M2ThinglishTypescriptClass().init(),
      new M2ThinglishClass().init(),
      new M2PlantUmlClass().init(),
      new M2MermaidClass().init(),
      new M2ThingClass().init(),
    ];
  }

  /**
   * Generates every existing M1 class in every language, each file written
   * at its Folder in the EAMD.ucp layout (`…/<owner>/latest/src/<language>/EAM/<layer>/`, spec/eamd-ucp.md) plus each
   * language's derived files (the `svg` from PlantUML). Returns the written paths.
   */
  async generate(home = ''): Promise<string[]> {
    await M1Catalog.load();
    if (home === '') {
      const paths = M1Layout.pathsOnly(this);
      this.preflight(paths); // ATOMIC (oopPO ruling): every render that can throw runs BEFORE the first relocation
      await this.realise(paths); // the REPOSITORY follows its model first (plan d729ecd I3) — never a scratch home
    }
    await M1Layout.load(this);
    const target = this.homeLayout(home); // spec 12 rule 6 (a): EVERY generated language lives in its component (inc 6 C3+C4)
    const written: string[] = [];
    for (const language of this.languages().filter((l) => l.directory !== this.heldLanguage.directory)) {
      language.within(target);
      for (const m1 of language.createExisting(this)) {
        const folder = target.classFolder(m1.name, language.directory);
        await new NodeJSFolder().init({
          name: folder.path,
        }).create();
        const path = await m1.save(folder.path);
        if (path !== '') written.push(path);
        written.push(...(await language.derived(m1, target)));
      }
      written.push(...(await this.place(language, target)));
    }
    if (home === '') written.push(...(await this.store())); // R7a: the generate path FILLS the live store (spec/scenario.md §1, Tron 2026-10-08)
    return written;
  }

  /**
   * The repository's LIVE store: `EAMD.ucp/Scenario/Index` (spec/scenario.md §1). Its authority is the one spec/scenario.md §2
   * is the MODEL's configurable default (ScenarioIndexModel.profile, Tron R7a) — a deployment sets its own through the model.
   */
  liveIndex(home = ''): ScenarioIndex {
    return new ScenarioIndex().init({
      name: `${home}EAMD.ucp/Scenario/Index`,
      storeOutput: this.storeOutputTail(),
      owners: this.ownersByUuid(),
    }); // typed JSON init (oopPO R7a): the profile is the MODEL's default (ScenarioIndexModel.profile's initializer); the store-output folder AND each class unit's owner key (by uuid, oopPO P5 Q2=A) are INJECTED (F2: the index cannot import the layout or the catalog)
  }

  /**
   * oopPO F2 (ruling A): the store-output folder RELATIVE to a component folder — version / model folder / store-output folder —
   * DERIVED from M1Layout, the ONE owner of those names (`storeOutputFolder`); injected into the index (liveIndex) and used by
   * prune. Memoised like owners(): a layout per call is expensive.
   */
  storeOutputTail(): string {
    if (this.outputTail === undefined) {
      const layout = M1Layout.pathsOnly(this);
      const any = this.classes()[0]?.name ?? '';
      const name = (f: { path: string }): string => f.path.split('/').pop() ?? '';
      this.outputTail = [layout.packageFolder(), layout.definitionFolder(any), layout.storeOutputFolder(any)].map(name).join('/');
    }
    return this.outputTail;
  }

  /**
   * Each catalogued class's OWNER component key — the qualified name of its HOME component folder (oopPO P5 Q1=A:
   * `M1Layout.homeComponentOf`, the parent of the Version its files sit in), a NAME never a path. ONE derivation, no
   * branch: the package, a class held by a component and a class no component holds all read their key from the folder
   * they live in. Derived from ONE layout and memoised (a layout per call burned 6.5 CPU-s over 106 gets). The generator
   * renders it into `static get component()` and the store reads it (Q2=A: there is no authored copy to drift).
   */
  owners(): Record<string, string> {
    if (this.ownerKeys === undefined) {
      const layout = M1Layout.pathsOnly(this);
      const keys: Record<string, string> = {};
      for (const c of this.classes()) keys[c.name] = layout.homeComponentOf(c.name);
      this.ownerKeys = keys;
    }
    return this.ownerKeys;
  }

  /**
   * The owner keys of a FRESH catalog over the loaded sources (oopPO P5 ruling A): what a renderer handed NO catalog reflects,
   * reached through the Mof registry (M2ES2020Class.owners) — never a static import (a cycle). Throws before load(), like classes().
   */
  static derivedOwners(): Record<string, string> {
    return new M1Catalog().init().owners();
  }

  /**
   * Each catalogued class UNIT's owner key by the unit's uuid — what the store is INJECTED with (liveIndex; oopPO P5 Q2=A).
   * Keyed by uuid, never by name: an import or a part is NAMED like the class it points at.
   */
  ownersByUuid(): Record<string, string> {
    const owners = this.owners();
    return Object.fromEntries(this.classes().map((c) => [c.uuid, owners[c.name] ?? '']));
  }

  /**
   * The PACKAGE — DERIVED, never named (oopExpert P1): the one catalogued class whose `Mof.key(namespace, name)` IS the
   * package's qualified name read from the folders (spec/eamd-ucp.md rule 7a, P2b′). Exactly one; anything else is
   * refused by name.
   */
  packageModel(): ClassModel {
    const key = this.packageQualifiedName();
    const found = this.view.filter((c) => Mof.key(c.namespace, c.name) === key);
    const [pkg] = found;
    if (found.length !== 1 || pkg === undefined) throw new Error(`M1Catalog.packageModel: exactly ONE catalogued class must be the package '${key}' (Mof.key(namespace, name)) — found ${found.length}: ${found.map((c) => c.name).join(', ')}`);
    const definition = M1Catalog.loaded.get(pkg.name);
    if (definition === undefined) throw new Error(`M1Catalog.packageModel: '${pkg.name}' has no model source`);
    return M1Catalog.edits.get(pkg.name) ?? definition.model; // FRESH, as classes() answers it — the view is never handed out
  }

  /**
   * The package's QUALIFIED NAME — READ, never stored, from THIS module's own folder chain through the ONE reader
   * (`UcpComponent.qualifiedName`; spec/eamd-ucp.md rule 7a, P2b′, oopPO rulings 2026-10-12). The NEAREST `Components`
   * is the LAST folder on the chain whose qualifiedName is refused; the package is the first folder below it that holds
   * a `latest/` (`NodeJSFolder.existsSync` — never raw fs in a reader). Resolved ONCE per catalog (memoized). Every
   * reader of the package root asks HERE (AC9). Refused by name with no `Components` above or no package below it.
   */
  packageQualifiedName(): string {
    if (this.packageKey === undefined) this.packageKey = this.packageQualifiedNameOf(decodeURIComponent(new URL('.', import.meta.url).pathname));
    return this.packageKey;
  }

  /**
   * The package qualified name seen from ANY directory `dir` (absolute) — the reader `packageQualifiedName()` applies to
   * this module's own folder, open so a gate can seed a missing `latest/` or a path outside `EAMD.ucp/Components`.
   */
  packageQualifiedNameOf(dir: string): string {
    const [top = '', ...below] = dir.replace(/\/$/, '').split('/').slice(1); // the chain's root is named '/<top>' so path (names joined by '/') IS the absolute directory — an empty name would default to the class name
    const rootFolder = new NodeJSFolder().init({
      name: `/${top}`,
    });
    const leaf = below.reduce((at: DefaultFolder, segment) => at.folder(segment), rootFolder);
    const chain = leaf.breadcrumb.filter((f): f is DefaultFolder => f instanceof DefaultFolder);
    const components = chain.reduce((at, f, i) => (M1Catalog.refusesQualifiedName(f) ? i : at), -1);
    const root = chain[components];
    if (root === undefined || root.name !== 'Components') throw new Error(`M1Catalog.packageQualifiedName: '${dir}' is not below EAMD.ucp/Components — there is no package root to read`);
    const pkg = chain.slice(components + 1).find((f) => f.folder('latest').existsSync());
    if (pkg === undefined) throw new Error(`M1Catalog.packageQualifiedName: no folder below '${root.path}' on '${dir}' holds a latest/ — there is no package`);
    return pkg.qualifiedName;
  }

  /**
   * R7a: puts EVERY catalogued class's scenario into the live store — idempotent by construction (`put` addresses by the
   * class's stable uuid: a second run rewrites the same bytes). Answers the written Index paths.
   */
  async store(home = ''): Promise<string[]> {
    const classes = this.classes(); // derived ONCE: the puts and the prune see the same derivation (a re-deriving catalog must not prune what it just stored)
    await M1Catalog.loadComponents(); // P4: a stored model's IOR names the component INCORPORATING it — every component LOADED explicitly, never an incidental import
    this.attach(); // a unit's own IOR names its class through the attached ClassModel (ior.md rule 8)
    const index = this.liveIndex(home);
    const own = Mof.store === undefined;
    if (own) Mof.open(index);
    try {
      for (const c of classes) await index.put(c); // ruling D: the ClassModel IS the stored unit (no ScenarioUnit wrapper)
      await index.prune(classes); // O3: the store EQUALS this derivation — the SAME classes just put, so no unit or link survives that it no longer derives
    } finally {
      if (own) Mof.close();
    }
    return classes.map((c) => `${index.name}/${index.pathOf(c.uuid)}`);
  }

  /** The ONE load of every component's real class (P4) — memoised per process: a component set is a property of the CODE, not of a store run. */
  private static components: Promise<void> | undefined = undefined;

  /**
   * LOADS every component's real class ONCE per process (P4: the store types a stored model by the component incorporating it,
   * so those classes must be registered in Mof) — through the FULL catalog, never the caller's: a PARTIAL catalog (a seed's
   * subclass storing two classes) still has every component, and M1Layout.load builds its whole layout probe per call (measured:
   * 113 calls burned 12.34 CPU-s against the 5 CPU-s get(uuid) budget).
   */
  private static async loadComponents(): Promise<void> {
    M1Catalog.components ??= M1Layout.load(new M1Catalog().init());
    await M1Catalog.components;
  }

  /** The ClassModel stored under `uuid` (P4, plan 2026-10-11 ruling 5; ruling D STRUCK): get(uuid) answers the COMPONENT its stored IOR names (M2AbstractClass), whose model is the ClassModel. */
  async storedClass(uuid: string, home = ''): Promise<ClassModel> {
    await M1Catalog.loadComponents(); // P4: the incorporating components LOADED explicitly before anything is resolved
    this.attach();
    const index = this.liveIndex(home);
    const own = Mof.store === undefined;
    if (own) Mof.open(index);
    try {
      const stored = await index.get(uuid); // P4 ruling 5: the IOR names the incorporating COMPONENT; its model (.unit) is the ClassModel
      const model = stored.unit;
      if (!(model instanceof ClassModel)) throw new Error(`M1Catalog.storedClass: '${uuid}' is a ${stored.constructor.name} incorporating a ${String(Reflect.get(Object(model), 'constructor')?.name ?? '')}, not a ClassModel (its IOR names the component — ior.md rule 9)`);
      return model;
    } finally {
      if (own) Mof.close();
    }
  }

  /**
   * Generate REALISES placement (plan d729ecd I3; Tron: "a new generate moves the component"). Every HELD source —
   * `model/<X>Definition.ts`, `src/ts/EAM/<layer>/<X>.ts`, `test/<X>.test.ts` — whose DERIVED place (the layout) differs from
   * where it sits is moved there. Every held file that moved, or whose relative imports reach a moved file, gets its import
   * SPECIFIERS re-derived (oopPO ruling): rule 1 — a catalogued class → the layout's path; rule 2 — anything else →
   * re-anchored to the same target; bodies untouched. The moved classes' old generated files and the emptied folders are
   * removed. A no-move run touches nothing. ATOMIC: every move and every rewritten import is planned and checked first (each
   * rewritten import must resolve in the post-move tree — or it THROWS, naming file and specifier); only then is anything written. All file access goes through NodeJSFolder / NodeJSFile (rule 2). Returns the moved files' new paths.
   */
  async realise(layout: M1Layout): Promise<string[]> {
    const path = await import('node:path'); // path ARITHMETIC only — every file access is a NodeJS unit
    const root = path.dirname(layout.packageFolder().path);
    const names = new Set([...this.classes().map((c) => c.name), this.placedModel().name]);
    const held = await this.heldFiles(path, root);
    const moves = new Map<string, string>();
    for (const file of held) {
      const isTest = /\/latest\/test$/.test(path.dirname(file)) && file.endsWith('.test.ts');
      const declared = isTest ? this.declaredSubject(await this.fileAt(path, file).read()) : '';
      const target = this.derivedPlace(path, file, names, layout, declared);
      if (target !== '' && target !== file) moves.set(file, target);
    }
    if (moves.size === 0) return [];
    // PLAN — nothing is written until every move and every rewritten import is known to be valid (atomic, oopPO ruling)
    for (const [from, to] of moves) if (await this.fileAt(path, to).exists()) throw new Error(`M1Catalog.realise: cannot move ${from} -> ${to}: the target already exists`);
    const writes = new Map<string, string>(); // final path -> final text
    for (const f of held) {
      const text = await this.fileAt(path, f).read();
      const now = moves.get(f) ?? f;
      if (now !== f || this.relativeSpecifiers(text).some((s) => moves.has(this.heldTarget(path, f, s)))) writes.set(now, this.rewritten(path, text, f, now, moves, names, layout));
    }
    const destinations = new Set(moves.values());
    for (const [f, text] of writes) {
      for (const s of this.relativeSpecifiers(text)) {
        const t = path.normalize(path.join(path.dirname(f), s));
        const candidates = t.endsWith('.js') ? [t, t.replace(/\.js$/, '.ts')] : [t];
        let resolves = false;
        for (const c of candidates) if (destinations.has(c) || (!moves.has(c) && (await this.fileAt(path, c).exists()))) resolves = true;
        if (!resolves) throw new Error(`M1Catalog.realise: ${f} imports '${s}', which resolves nowhere`);
      }
    }
    // APPLY
    for (const [from, to] of moves) {
      await this.folderAt(path.dirname(to)).create();
      await this.fileAt(path, to).write(writes.get(to) ?? (await this.fileAt(path, from).read()));
      await this.fileAt(path, from).remove();
    }
    for (const [f, text] of writes) if (!destinations.has(f)) await this.fileAt(path, f).write(text);
    for (const [old] of moves) await this.dropGenerated(path, old);
    for (const [old] of moves) await this.prune(path, path.dirname(old), root);
    const moved = new Map([...moves].map(([from, to]) => [path.resolve(from), path.resolve(to)]));
    for (const [name, at] of M1Catalog.places) {
      const to = moved.get(path.resolve(at)); // a moved model source: its REALISED place followed the model
      if (to !== undefined) M1Catalog.places.set(name, to);
    }
    return [...moves.values()];
  }

  /** Is this folder's qualifiedName REFUSED (not strictly below an EAMD.ucp/Components)? The reader answers by throwing. */
  private static refusesQualifiedName(folder: DefaultFolder): boolean {
    try {
      return folder.qualifiedName === '';
    } catch {
      return true;
    }
  }

  private folderAt(dir: string): NodeJSFolder {
    return new NodeJSFolder().init({
      name: dir,
    });
  }

  private fileAt(path: typeof import('node:path'), file: string): NodeJSFile {
    return this.folderAt(path.dirname(file)).file(path.basename(file));
  }

  /** The HELD files below a folder: `model/*Definition.ts`, everything under `src/ts/` and `test/` — never a generated language. */
  private async heldFiles(path: typeof import('node:path'), dir: string): Promise<string[]> {
    const out = [];
    for (const e of await this.folderAt(dir).list()) {
      const p = path.join(dir, e.name);
      if (e instanceof DefaultFolder) {
        if (e.name === 'node_modules' || this.isScratch(p) || (path.basename(dir) === 'src' && e.name !== 'ts')) continue;
        out.push(...(await this.heldFiles(path, p)));
      } else if (e.name.endsWith('.ts') && (path.basename(dir) === 'model' ? e.name.endsWith('Definition.ts') : /\/src\/ts\/|\/test(\/|$)/.test(p))) out.push(p);
    }
    return out;
  }

  /**
   * The subject a test DECLARES (`// test-subject: X`), '' if none — the same rule TestPlacement gates (H5m): a declared
   * subject wins over the file name, so generate never undoes a placement decided by the test's assertions (H5m-3).
   */
  private declaredSubject(text: string): string {
    return /^\/\/ test-subject: (\w+)/m.exec(text)?.[1] ?? '';
  }

  /** Where a held file BELONGS by the model ('' = it follows no class: a helper, a non-class test, …). */
  private derivedPlace(path: typeof import('node:path'), file: string, names: Set<string>, layout: M1Layout, declared: string = ''): string {
    const base = path.basename(file);
    const dir = path.dirname(file);
    const owned = (name: string, ...rest: string[]): string => (names.has(name) ? path.join(this.versionPath(path, layout, name), ...rest) : '');
    if (path.basename(dir) === 'model') return owned(base.replace(/Definition\.ts$/, ''), 'model', base);
    if (/\/src\/ts\/EAM\/layer\d$/.test(dir)) {
      const name = base.replace(/\.ts$/, '');
      return names.has(name) ? path.join(layout.classFolder(name, 'ts').path, base) : '';
    }
    if (/\/latest\/test$/.test(dir) && base.endsWith('.test.ts')) return owned(declared !== '' ? declared : base.replace(/\.test\.ts$/, ''), 'test', base);
    return '';
  }

  /** A class's version folder (`<owner>/latest`), derived from the layout: its TypeScript folder minus `src/ts/EAM/<layer>`. */
  private versionPath(path: typeof import('node:path'), layout: M1Layout, name: string): string {
    return path.normalize(path.join(layout.classFolder(name, 'ts').path, '..', '..', '..', '..'));
  }

  /** The relative module specifiers of a held file's import / export lines (bodies are never read). */
  private relativeSpecifiers(text: string): string[] {
    return [...text.matchAll(/^(?:import|export)\b[^'\n]*? from '(\.[^']*)';$/gm)].map((m) => m[1] ?? '');
  }

  /** The HELD file a specifier reaches from a file (a `.js` specifier names its held `.ts`). */
  private heldTarget(path: typeof import('node:path'), file: string, specifier: string): string {
    const t = path.normalize(path.join(path.dirname(file), specifier));
    return t.endsWith('.js') ? t.replace(/\.js$/, '.ts') : t;
  }

  /** One held file's text with its import specifiers re-derived for its place `now` (it sat at `old`) — the specifier strings only. */
  private rewritten(path: typeof import('node:path'), text: string, old: string, now: string, moves: Map<string, string>, names: Set<string>, layout: M1Layout): string {
    return text.replace(/^((?:import|export)\b[^'\n]*? from ')(\.[^']*)(';)$/gm, (_line, head: string, s: string, tail: string) => {
      const reached = this.heldTarget(path, old, s);
      const name = path.basename(reached).replace(/\.ts$/, '');
      const moved = moves.get(reached);
      const goal = names.has(name) && /\/src\/ts\/EAM\/layer\d\/\w+\.ts$/.test(reached)
        ? path.join(layout.classFolder(name, 'ts').path, `${name}.js`) // rule 1: a catalogued class — the layout's path
        : moved === undefined ? path.normalize(path.join(path.dirname(old), s)) : s.endsWith('.js') ? moved.replace(/\.ts$/, '.js') : moved; // rule 2: re-anchored
      const relative = path.relative(path.dirname(now), goal);
      return `${head}${relative.startsWith('.') ? relative : `./${relative}`}${tail}`;
    });
  }

  /**
   * Renders every catalogued class in every generated language IN MEMORY, through the path-only layout — so a model the
   * renderers reject (an unknown relationship kind, two containers, a dependency on no class …) THROWS here, before
   * realise() relocates anything (oopPO ruling: generate is atomic; a failure leaves the tree untouched).
   */
  preflight(layout: M1Layout): void {
    for (const language of this.languages().filter((l) => l.directory !== this.heldLanguage.directory)) {
      language.within(layout);
      for (const m1 of language.createExisting(this)) m1.toSource();
    }
  }

  /** A moved class's generated files at its OLD version (every home language): the next generate writes them at the new one. */
  private async dropGenerated(path: typeof import('node:path'), old: string): Promise<void> {
    const m = /^(.*)\/src\/ts\/EAM\/layer\d\/(\w+)\.ts$/.exec(old);
    if (m === null) return;
    for (const directory of this.homeDirectories) {
      const top = this.folderAt(path.join(m[1] ?? '', 'src', directory));
      if (await top.exists()) await this.dropNamed(top, m[2] ?? '');
    }
  }

  private async dropNamed(folder: DefaultFolder, name: string): Promise<void> {
    for (const e of await folder.list()) {
      if (e instanceof DefaultFolder) await this.dropNamed(e, name);
      else if (e.name === name || e.name.startsWith(`${name}.`)) await e.remove();
    }
  }

  /** Removes emptied folders: everything empty below the old component, then it and its parents while empty — never `root`. */
  private async prune(path: typeof import('node:path'), dir: string, root: string): Promise<void> {
    const version = /^(.*\/latest)(\/|$)/.exec(dir)?.[1] ?? dir;
    const component = this.folderAt(path.dirname(version));
    if (await component.exists()) {
      await this.dropDerivedLinks(this.folderAt(`${path.dirname(version)}/${this.storeOutputTail()}`)); // F2: derived, never a literal
      await this.pruneBelow(component);
    }
    for (let d = component.path; d !== root && d.startsWith(root); d = path.dirname(d)) {
      const folder = this.folderAt(d);
      if (!(await folder.exists()) || (await folder.list()).length > 0) break;
      await folder.remove();
    }
  }

  /**
   * oopPO R1: a moved component's `latest/model/scenarios` links are STORE OUTPUT, never held sources — dropped here so the
   * old component empties; the next store regenerates them at the new place (and prunes). A regular file is no link: left.
   */
  private async dropDerivedLinks(folder: DefaultFolder): Promise<void> {
    if (!(await folder.exists())) return;
    for (const e of await folder.list()) {
      if (e instanceof DefaultFolder) await this.dropDerivedLinks(e);
      else if (e instanceof NodeJSFile && (await e.isLink())) await e.remove();
    }
  }

  private async pruneBelow(folder: DefaultFolder): Promise<void> {
    for (const e of await folder.list()) if (e instanceof DefaultFolder) await this.pruneBelow(e);
    if ((await folder.list()).length === 0) await folder.remove();
  }

  /**
   * The generated languages that already LIVE IN THEIR COMPONENT (spec 12 rule 6, Tron (a)): written to
   * `<Owner>/latest/src/<language>/…` beside the TypeScript. inc 6 C2 moved the code languages, C3 the
   * rest — the diagrams (puml, their derived svg, mmd), the OOSH target and the M0 sample — and C4 retired the separate generated tree.
   */
  get homeDirectories(): string[] {
    return ['js', 'thinglish.ts', 'thinglish.js', 'puml', 'svg', 'mmd', 'thinglish', 'oosh', 'sample'];
  }

  /**
   * Whether a repository path is GENERATED output of a home language (`…/latest/src/<home directory>/…`) — never
   * hand-written source. Derived from homeDirectories, so every source scan asks the generator what it wrote.
   */
  isGenerated(path: string): boolean {
    return this.homeDirectories.some((d) => path.includes(`/latest/src/${d}/`));
  }

  /**
   * The model of the ONE uncatalogued MOF unit — this class itself (Tron d2cf919: it cannot catalogue itself). Held only
   * so the layout derives its fixed location like any component's: `latest/MOF/M1/M1Catalog/latest/src/<dir>/EAM/layer2/`.
   */
  placedModel(): ClassModel {
    return new ClassModel().init({
      uuid: '13681374-fc20-4cf2-983f-d1e1fcff9a53',
      name: 'M1Catalog',
      level: 'M1',
      language: '',
      namespace: 'com.ceruleanCircle.Web4MDA.MOF.M1',
      // the 21 classes this unit imports — DECLARED as model facts like every Definition's (oopPO ruling: never parsed
      // from the source; the gate's independent oracle checks model == code). Keeps dependants(X) complete for move().
      relationships: [
        new RelationshipModel().init({
          uuid: '4c486b8c-7579-4aa7-b5fc-e53d7fad38b5',
          name: 'extends UcpComponent',
          kind: 'generalization',
          source: '',
          target: 'UcpComponent',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '40b7e95a-8ae5-43d9-8b99-f4886cabf015',
          name: 'uses Mof',
          kind: 'dependency',
          source: '',
          target: 'Mof',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'f8ecab2f-6da2-4805-a22f-59c1748acb9e',
          name: 'uses Model',
          kind: 'dependency',
          source: '',
          target: 'Model',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '59d9d743-4d70-4b04-bbc0-fd290b12dd56',
          name: 'uses NodeJSFile',
          kind: 'dependency',
          source: '',
          target: 'NodeJSFile',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '4c2231ba-d1d7-48ed-a75f-50e0cded73d8',
          name: 'uses NodeJSFolder',
          kind: 'dependency',
          source: '',
          target: 'NodeJSFolder',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'a7973286-ad51-424c-bb83-d34f8f28ccf6',
          name: 'uses DefaultFolder',
          kind: 'dependency',
          source: '',
          target: 'DefaultFolder',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '519f2339-6768-4b48-9878-891f6c028cc4',
          name: 'uses AttributeModel',
          kind: 'dependency',
          source: '',
          target: 'AttributeModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'fc76c2d3-08b1-491e-8a8f-534d0a654100',
          name: 'uses ClassModel',
          kind: 'dependency',
          source: '',
          target: 'ClassModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'f89b14a9-ce79-4963-84cc-d484d61afde4',
          name: 'uses M2ES2020Class',
          kind: 'dependency',
          source: '',
          target: 'M2ES2020Class',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '955a9aa4-3bba-4b48-8e5d-b72093330a04',
          name: 'uses M1Layout',
          kind: 'dependency',
          source: '',
          target: 'M1Layout',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'f7d0cfd7-ee5d-4cc8-844c-ad2821a0f78b',
          name: 'uses M2ThinglishClass',
          kind: 'dependency',
          source: '',
          target: 'M2ThinglishClass',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '88b5ebb1-82da-447a-91f9-6ec10fda5847',
          name: 'uses M2ThinglishTypescriptClass',
          kind: 'dependency',
          source: '',
          target: 'M2ThinglishTypescriptClass',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '96871083-9d08-4eeb-a57b-dbc878627c51',
          name: 'uses ImportModel',
          kind: 'dependency',
          source: '',
          target: 'ImportModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'ca6c3c90-0c9f-416b-954e-a627e62b4a9a',
          name: 'uses M2MermaidClass',
          kind: 'dependency',
          source: '',
          target: 'M2MermaidClass',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'f5db6a9c-137b-448b-b69c-8e1f66790ce0',
          name: 'uses M2ThingClass',
          kind: 'dependency',
          source: '',
          target: 'M2ThingClass',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'a7172a6d-3902-47ad-84b8-fa7f2f121a78',
          name: 'uses M2PlantUmlClass',
          kind: 'dependency',
          source: '',
          target: 'M2PlantUmlClass',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '5d169c4c-d0c4-414f-97ff-98071c5dac1e',
          name: 'uses M2TypescriptClass',
          kind: 'dependency',
          source: '',
          target: 'M2TypescriptClass',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '5fc5b983-6f53-4da7-95d0-b4dff73590cd',
          name: 'uses MethodModel',
          kind: 'dependency',
          source: '',
          target: 'MethodModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '0c3aedce-4808-409d-af72-659199ce1300',
          name: 'uses ParameterModel',
          kind: 'dependency',
          source: '',
          target: 'ParameterModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'cae08e1b-17ab-45d0-854d-b72363cdd555',
          name: 'uses RelationshipModel',
          kind: 'dependency',
          source: '',
          target: 'RelationshipModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '1e2fef35-68c9-4ace-be9e-03596293fa33',
          name: 'uses TypeAliasModel',
          kind: 'dependency',
          source: '',
          target: 'TypeAliasModel',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: 'b1c17e73-d41f-43a4-a491-622a1f7a0b4f',
          name: 'uses UcpComponent',
          kind: 'dependency',
          source: '',
          target: 'UcpComponent',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '4f57dbbc-f349-4533-8711-54aa85a0b1bf',
          name: 'uses DefinitionSource',
          kind: 'dependency',
          source: '',
          target: 'DefinitionSource',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
        new RelationshipModel().init({
          uuid: '55f7c684-917d-4157-ab43-5e1693a4b7be',
          name: 'uses M2AbstractDependency',
          kind: 'dependency',
          source: '',
          target: 'M2AbstractDependency',
          multiplicity: '1',
          redefines: '',
          initializer: '',
        }),
      ],
    });
  }

  /** The class of the placed unit — this class itself, so the layout can construct its component folder. */
  get placedClass(): new () => UcpComponent {
    return M1Catalog;
  }

  /**
   * PLACES this unit at its fixed layout location for one language — only when that language's generated files IMPORT it
   * (derived from the rendered sources, never a list). Design (a) 4e9ae61: see placedSource().
   */
  private async place(language: M2ES2020Class, layout: M1Layout): Promise<string[]> {
    const placed = this.placedModel();
    const own = new ImportModel().init({
      name: placed.name,
      declaredBy: placed.name,
    });
    const importsIt = language.createExisting(this).some((m1) => m1.toSource().includes(` from '${language.specifier(m1.classModel, own)}';`));
    if (!importsIt) return [];
    const folder = new NodeJSFolder().init({
      name: layout.classFolder(placed.name, language.directory).path,
    });
    await folder.create();
    const file = folder.file(`${placed.name}.${language.extensionOf(placed)}`);
    await file.writeAtomic(await this.placedSource(language));
    return [file.path];
  }

  /**
   * The placed unit's text in one language: TS = the src text, JS = its deterministic compile (esbuild, type-stripping
   * only); every import re-pointed EXACTLY as the language points a catalogued class's imports — by the layout when the
   * language is within one, `./X.<ext>` beside it otherwise (a flat tree).
   */
  async placedSource(language: M2ES2020Class): Promise<string> {
    const placed = this.placedModel();
    const own = new NodeJSFile().init({
      name: decodeURIComponent(new URL('./M1Catalog.ts', import.meta.url).pathname),
    });
    const source = await own.read();
    const repointed = source.replace(/^(import (?:type )?\{ (\w+) \} from ')[^']*(';)$/gm, (_line, head: string, name: string, tail: string) => {
      const i = new ImportModel().init({
        name: name,
        declaredBy: name,
      });
      return `${head}${language.specifier(placed, i)}${tail}`;
    });
    if (language.extensionOf(placed).endsWith('ts')) return repointed;
    const compiler = 'esbuild'; // computed specifier: a generator-time (Node) tool, resolved at runtime — never by a type-check or a bundler of the placed copy
    const esbuild = await import(/* @vite-ignore */ compiler);
    return esbuild.transformSync(repointed, { loader: 'ts', format: 'esm', target: 'esnext', tsconfigRaw: { compilerOptions: { verbatimModuleSyntax: true } } }).code;
  }

  /** The REPOSITORY's component layout (`[<base>/]EAMD.ucp/Components/…`, spec 12 rule 6): where generated languages live. */
  homeLayout(base = ''): M1Layout {
    return new M1Layout().init().layOutHome(this, base);
  }

  /** Constructor-of-the-process: the generate step → writes every generated language into its component. No-op on import. */
  static override start(argv: readonly string[] = globalThis.process?.argv ?? [], entry: string = import.meta.url): boolean {
    if (!super.start(argv, entry)) return false;
    void new M1Catalog()
      .init()
      .generate()
      .then((paths) => paths.forEach((p) => console.log(p)));
    return true;
  }

  /** The model sources `load()` found — one `XDefinition` per class, by class name (spec 12 rule 5); undefined until loaded. */
  private static definitions: Map<string, { readonly model: ClassModel }> | undefined = undefined;
  /** The STORED models a state change has taken in hand this process (I5): an edited model IS the state classes() and every layout see. */
  private static edits: Map<string, ClassModel> = new Map();
  /**
   * The model sources persist() WROTE this process, by class name (I5c): the ESM cache would keep serving their OLD Definition
   * modules, so the next load() RE-READS exactly these from DISK. No model is kept here — DISK is the only store (oopPO I5c 5).
   */
  private static written: Map<string, string> = new Map();
  /** How many re-reads this process did — the cache-busting query that makes the runtime import a written source afresh. */
  private static rereads = 0;
  /** Bumped by EVERY change of what classes() answers — a load(), an edit taken in hand — so a derivation never reads a stale view. */
  private static revision = 0;
  /**
   * The catalog's OWN read-only view of classes(), valid for ONE revision (CHAIN_CPU: classes() rebuilds every model, per
   * call) — one per CLASS, because classes() is polymorphic: a catalog subclass (a gate's seed) answers its own view.
   */
  private static snapshots: WeakMap<object, { revision: number; models: ClassModel[] }> = new WeakMap();

  /**
   * Loads every component's model sources ONCE per process (spec 12 rule 5, oopPO mechanism ruling): walks the Package's
   * component tree through NodeJSFolder (rule 2) and imports each `<Component>/latest/model/<X>Definition.ts` (Tron Q1).
   * Idempotent; wired where each process starts. `classes()` stays synchronous over the loaded set and THROWS before it.
   */
  static async load(): Promise<void> {
    M1Catalog.edits = new Map(); // EVERY load() drops the in-hand edits — even when the sources are already loaded (oopTester I5 item 2: an edit must not survive load and be rendered)
    M1Catalog.revision += 1; // and again when it returns: re-read sources replace models while it awaits
    try {
      await M1Catalog.loadSources();
    } finally {
      M1Catalog.revision += 1;
    }
  }

  /** The body of load(): first load walks the component tree, a later one re-reads what this process persisted. */
  private static async loadSources(): Promise<void> {
    if (M1Catalog.definitions !== undefined) {
      // load() answers DISK (oopPO I5c 5): what this process persisted is RE-READ from its model source, never served from memory
      M1Catalog.rereads += 1;
      for (const path of M1Catalog.written.values()) await M1Catalog.read(path, M1Catalog.definitions, M1Catalog.places, `?reread=${M1Catalog.rereads}`, true);
      M1Catalog.written = new Map();
      return;
    }
    const found = new Map<string, { readonly model: ClassModel }>();
    const places = new Map<string, string>();
    const tree = new NodeJSFolder().init({
      name: M1Catalog.root,
    });
    for (const path of await M1Catalog.modelFiles(tree)) await M1Catalog.read(path, found, places, '', false);
    M1Catalog.definitions = found;
    M1Catalog.places = places;
  }

  /** The Package root this file sits in: `<Package>/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2` → `<Package>` (absolute). */
  private static get root(): string {
    return decodeURIComponent(new URL('../../../../../../../../', import.meta.url).pathname).replace(/\/$/, '');
  }

  /** Imports ONE model source and files its Definition by class name; `query` makes the runtime read it afresh from disk. */
  private static async read(path: string, found: Map<string, { readonly model: ClassModel }>, places: Map<string, string>, query: string, replace: boolean): Promise<void> {
    const name = (path.split('/').pop() ?? '').replace(/\.ts$/, '');
    const specifier = `../../../../../../../../${path.slice(M1Catalog.root.length + 1).replace(/\.ts$/, '')}.js${query}` as const; // relative to THIS module, like M1Layout.load: resolved by the runtime, never rewritten at build time
    const ctor = ((await import(/* @vite-ignore */ specifier)) as Record<string, (new () => { readonly model: ClassModel }) | undefined>)[name];
    if (ctor === undefined) throw new Error(`M1Catalog.load: ${path} does not export a class '${name}'`);
    const definition = new ctor();
    if (!replace && found.has(definition.model.name)) throw new Error(`M1Catalog.load: two model sources define '${definition.model.name}'`);
    found.set(definition.model.name, definition);
    places.set(definition.model.name, path);
  }

  /** Where `load()` FOUND each model source (absolute) — the REALISED place, which a pending move() does not change. */
  private static places: Map<string, string> = new Map();

  /** The absolute path of class `name`'s model source AS FOUND on disk — THROWS for a class no source defines. */
  foundAt(name: string): string {
    const path = M1Catalog.places.get(name);
    if (path === undefined) throw new Error(`M1Catalog: no model source defines '${name}' — not found by load()`);
    return path;
  }

  /** Every `latest/model/*Definition.ts` below a folder (a component's `src/` and `test/` are never descended). */
  private static async modelFiles(folder: DefaultFolder): Promise<string[]> {
    const files: string[] = [];
    for (const entry of await folder.list()) {
      if (entry instanceof DefaultFolder) {
        if (entry.name !== 'src' && entry.name !== 'test') files.push(...(await M1Catalog.modelFiles(entry)));
      } else if (folder.name === 'model' && entry.name.endsWith('Definition.ts')) files.push(entry.path);
    }
    return files;
  }

  /** The loaded model sources — THROWS when `load()` has not run in this process (rule 5). */
  private static get loaded(): Map<string, { readonly model: ClassModel }> {
    if (M1Catalog.definitions === undefined) throw new Error('M1Catalog: not loaded — await M1Catalog.load() once per process before classes() (spec 12 rule 5)');
    return M1Catalog.definitions;
  }

  /**
   * The model of class `name` EXACTLY as its model source defines it — the STORED JSON state, before classes() derives
   * anything (the namespace from a container, plan d729ecd I3). A state change (move()) edits THIS, never a derived view.
   */
  storedModel(name: string): ClassModel {
    const edited = M1Catalog.edits.get(name);
    if (edited !== undefined) return edited;
    const definition = M1Catalog.loaded.get(name);
    if (definition === undefined) throw new Error(`M1Catalog: no model source defines '${name}'`);
    const model = definition.model; // a Definition answers a FRESH model each time — the one taken in hand is kept, so an edit is SEEN
    M1Catalog.edits.set(name, model);
    M1Catalog.revision += 1; // the view now holds this model (by reference), not the one its Definition would build
    return model;
  }

  /** The classes that depend on `name` — the DERIVED opposite end of the dependency relationship (plan d729ecd I2), never stored. */
  dependants(name: string): string[] {
    return new M2AbstractDependency().init().over(this).dependants(name);
  }

  /** Who USES each class — the derived opposite end of the dependency relationship for every class at once (plan d729ecd I2; rule 6). */
  dependencyUsers(): Map<string, string[]> {
    return new M2AbstractDependency().init().over(this).dependantsOfAll();
  }

  /**
   * Persists a class's model as its model source (plan d729ecd I4): DefinitionSource renders the JSON state, the layout
   * says where the Definition lives, the File writes it. Returns the written path (absolute, from this file's own place).
   */
  async persist(model: ClassModel): Promise<string> {
    const layout = this.homeLayout('');
    const found = M1Catalog.places.get(model.name);
    let path = found ?? '';
    let prefix = '';
    if (found === undefined) {
      // a NEW class: no realised place yet — it goes where the layout derives it
      const repo = decodeURIComponent(new URL('../../../../../../../../../../../../../', import.meta.url).pathname);
      path = `${repo}${layout.definitionFolder(model.name).path}/${model.name}Definition.ts`;
      prefix = layout.definitionPrefix(model.name);
    } else {
      // IN PLACE (plan d729ecd I4b): a move is a pure state change of the stored JSON where it SITS — the next generate
      // realises it (relocates the source, re-derives its imports). The import prefix is the walk between REALISED places.
      const home = this.foundAt(ClassModel.name).split('/').slice(0, -2).join('/');
      prefix = M1Catalog.walk(found.split('/').slice(0, -1).join('/'), `${home}/src/ts/EAM/${layout.layerOf(this.classNamed(ClassModel.name))}`);
    }
    await new NodeJSFile()
      .init({
        name: path,
      })
      .write(new DefinitionSource().definition(model, prefix));
    M1Catalog.written.set(model.name, path); // the next load() re-reads it from DISK
    return path;
  }

  /** The relative walk from one absolute directory to another, as the layout spells it: `./` or `../…/`, each segment + `/`. */
  private static walk(from: string, to: string): string {
    const a = from.split('/').filter((s) => s !== '');
    const b = to.split('/').filter((s) => s !== '');
    let common = 0;
    while (common < a.length && common < b.length && a[common] === b[common]) common += 1;
    const up = a.length - common;
    return `${up === 0 ? './' : '../'.repeat(up)}${b.slice(common).map((s) => `${s}/`).join('')}`;
  }

  /** The catalogued class named `name` (a fresh ClassModel) — THROWS for an unknown name. */
  classNamed(name: string): ClassModel {
    const found = this.classes().find((c) => c.name === name);
    if (found === undefined) throw new Error(`M1Catalog: no catalogued class '${name}'`);
    return found;
  }

  /**
   * All existing M1 classes — each a FRESH ClassModel from its loaded model source (spec 12 rule 5: derived from the component
   * tree, never a hand list), in the tree's own order (NodeJSFolder lists by name). THROWS before `load()`.
   */
  classes(): ClassModel[] {
    return [...M1Catalog.loaded.entries()].map(([name, definition]) => M1Catalog.edits.get(name) ?? definition.model); // the STORED namespace IS the location (I4c); an edit in hand wins
  }

  /**
   * The catalog's OWN view of classes() — the same models, built ONCE per revision and read by the catalog's derivations
   * (ends, heirs, the package) instead of a fresh build per question. NEVER handed out: callers keep the fresh models
   * classes() promises. An edit taken in hand is held by reference, so its later in-place changes are seen without a rebuild.
   */
  private get view(): ClassModel[] {
    const held = M1Catalog.snapshots.get(this.constructor);
    if (held !== undefined && held.revision === M1Catalog.revision) return held.models;
    const models = this.classes();
    M1Catalog.snapshots.set(this.constructor, {
      revision: M1Catalog.revision,
      models: models,
    });
    return models;
  }

  abstractClasses(): ClassModel[] {
    return this.classes().filter((c) => c.isAbstract);
  }

  concreteClasses(): ClassModel[] {
    return this.classes().filter((c) => !c.isAbstract && !c.isInterface);
  }

  /** The Thinglish interfaces among the M1 classes: abstract classes extending `Interface`. */
  interfaceClasses(): ClassModel[] {
    return this.classes().filter((c) => c.isInterface);
  }

  /**
   * How every reference end of every MODEL class rehydrates (spec/model-json.md "Typed references", AC12 + the 2026-10-06
   * polymorphism amendment) — RESOLVED HERE, at generation time, from the catalog (ruling 75c82049; never a hand table, and
   * `Model` never imports the catalog). Per model: end name → the class to rebuild it as — the declared target when it is
   * concrete (exact, or the declared class when it has concrete subclasses: a disclosed lossy residual), the UNIQUE concrete
   * subclass of an abstract target — or a refusal sentence when an abstract target has several concrete subclasses (the
   * by-value JSON carries no type discriminator). An abstract target with NO concrete subclass fails generation by name.
   * Reads the catalog's own view (built once per revision), so asking per renderer costs no fresh build.
   */
  referenceEnds(): Map<string, Record<string, string>> {
    const all = this.view;
    const parent = new Map(all.map((c) => [c.name, c.superclass.replace(/<.*>$/, '')]));
    const concrete = all.filter((k) => !k.isAbstract && !k.isInterface);
    const found = new Map<string, Record<string, string>>();
    for (const c of all.filter((k) => this.extendsClass(parent, k.name, Model.name))) {
      const ends: Record<string, string> = {};
      for (const r of c.relationships.filter((e) => e.kind === 'contains' && e.name !== '')) {
        const target = all.find((k) => k.name === r.target);
        const subclasses = concrete.filter((k) => this.extendsClass(parent, k.name, r.target)).map((k) => k.name);
        if (target === undefined || !target.isAbstract) ends[r.name] = r.target;
        else if (subclasses.length === 1) ends[r.name] = subclasses[0] ?? r.target;
        else if (subclasses.length === 0) throw new Error(`M1Catalog.referenceEnds: ${c.name}.${r.name} targets the abstract ${r.target}, which has NO concrete subclass in the catalog - nothing to rehydrate as; generation refused (spec/model-json.md AC12)`);
        else ends[r.name] = r.target; // R3 s2: several concrete subclasses — the stored class TAG names the exact one (Tron ruling C), the refusal is retired
      }
      if (Object.keys(ends).length > 0) found.set(c.name, ends);
    }
    return found;
  }

  /**
   * S2 (plan 2026-10-10 sub-scenarios by IOR; spec/model-json.md storage rule C): the PART ends of every MODEL class — its
   * relationships of kind `part` (oopPO ruling 2: composition by value, stored as a sub-scenario; spec/thinglish.md §6).
   * Per model: member → its part class. DERIVED from the catalog's modelled ends, never a hand list and never inferred from
   * an attribute's type; today ClassModel.imports/attributes/methods/relationships/typeAliases, MethodModel.parameters,
   * ModelUnit.references. Rendered into each model as `static get partEnds()`.
   */
  partEnds(): Map<string, Record<string, string>> {
    const all = this.view;
    const parent = new Map(all.map((c) => [c.name, c.superclass.replace(/<.*>$/, '')]));
    const found = new Map<string, Record<string, string>>();
    for (const c of all.filter((k) => this.extendsClass(parent, k.name, Model.name))) {
      const ends: Record<string, string> = {};
      for (const r of c.relationships.filter((e) => e.kind === 'part' && e.name !== '')) ends[r.name] = r.target.replace(/<.*>$/, '');
      if (Object.keys(ends).length > 0) found.set(c.name, ends);
    }
    return found;
  }

  /** The models whose generated `static get partEnds()` OVERRIDES an ancestor model's (TypeScript renders it `override`). Derived. */
  partHeirs(): Set<string> {
    const declaring = [...this.partEnds().keys()];
    const parent = new Map(this.view.map((c) => [c.name, c.superclass.replace(/<.*>$/, '')]));
    return new Set(declaring.filter((name) => declaring.some((other) => other !== name && this.extendsClass(parent, name, other))));
  }

  /**
   * The MODEL classes whose generated `static get referenceEnds()` OVERRIDES an ancestor model's (I6.5) — TypeScript renders
   * it `override`, every other declaring model renders it plain (`Model` declares none: the JSON mechanism stays ONE base
   * method pair, model-json AC4). Today: `InternetProfileModel` under `TaggedProfileModel`. Derived, never a hand list.
   */
  referenceHeirs(): Set<string> {
    const declaring = [...this.referenceEnds().keys()];
    const parent = new Map(this.view.map((c) => [c.name, c.superclass.replace(/<.*>$/, '')]));
    return new Set(declaring.filter((name) => declaring.some((other) => other !== name && this.extendsClass(parent, name, other))));
  }

  /** Does the class `name` extend `ancestor` (transitively, generics stripped), per the `parent` map of the catalog? */
  private extendsClass(parent: Map<string, string>, name: string, ancestor: string): boolean {
    for (let s = parent.get(name) ?? ''; s !== ''; s = parent.get(s) ?? '') if (s === ancestor) return true;
    return false;
  }

  /** `src/Web4MDA.ts` */

}

M1Catalog.start();

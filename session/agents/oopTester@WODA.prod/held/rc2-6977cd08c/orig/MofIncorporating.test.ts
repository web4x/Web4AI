// test-subject: Mof — the model → component map (plan 2026-10-11-namespace-root-and-component-typed-iors.md ruling 4, P3)
import { beforeAll, describe, expect, it } from 'vitest';
import { M1Catalog } from '../../MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';
import { M1Layout } from '../../MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js';
import { AttributeModel } from '../src/ts/EAM/layer3/AttributeModel.js';
import { ClassModel } from '../src/ts/EAM/layer3/ClassModel.js';
import { ImportModel } from '../src/ts/EAM/layer3/ImportModel.js';
import { RelationshipModel } from '../src/ts/EAM/layer3/RelationshipModel.js';
import { Mof } from '../src/ts/EAM/layer2/Mof.js';
import { UcpComponent } from '../src/ts/EAM/layer2/UcpComponent.js';

/** Mof's registry, reached only to SEED and REVERT (private static map) — the seeds never leak past their test. */
class Registry {
  private map: Map<string, object> = new Map();
  constructor() {}
  init(): this {
    this.map = Reflect.get(Mof, 'loaded') as Map<string, object>;
    return this;
  }
  set(key: string, ctor: object): void {
    this.map.set(key, ctor);
  }
  delete(key: string): void {
    this.map.delete(key);
  }
}

/**
 * The STORED model types — DERIVED, never a list: the catalog's stored class model (ClassModel, ruling D's registration)
 * and every part class along the derived partEnds (`M1Catalog.partClasses()`, recursive), the same set `attach()` registers
 * and the store writes. A hand list here would be green by omission when a new part type arrives.
 */
class StoredTypes {
  private found: Function[] = [];
  constructor() {}
  init(catalog: M1Catalog): this {
    this.found = [ClassModel, ...catalog.partClasses()];
    return this;
  }
  get all(): Function[] {
    return this.found;
  }
}

describe('Mof.incorporating — ONE incorporating component per stored model, from ONE authored typed mark (P3, ruling 4)', () => {
  const registry = new Registry().init();
  let catalog: M1Catalog;
  let stored: StoredTypes;

  beforeAll(async () => {
    await M1Catalog.load();
    catalog = new M1Catalog().init();
    await M1Layout.load(catalog); // every component's REAL class loaded explicitly — never an incidental import (M1Layout.load)
    catalog.attach();
    stored = new StoredTypes().init(catalog);
  });

  it('the derived stored model types are exactly the 6 the store writes (7 measured 2026-10-11; U1 S3 ruling oopPO 2026-10-14 removed ImportModel — imports are DERIVED from the stored dependency units, never stored) — the set is not empty, not a guess', () => {
    expect(stored.all.map((c) => c.name).sort()).toEqual(['AttributeModel', 'ClassModel', 'MethodModel', 'ParameterModel', 'RelationshipModel', 'TypeAliasModel']);
    expect(stored.all.map((c) => c.name), 'U1 S3: the REMOVED type, named — a derived thing is never stored').not.toContain('ImportModel');
  });

  it('TOTAL + UNIQUE: every stored model type has exactly ONE incorporating component; ClassModel → M2AbstractClass (Tron, Q2 A)', () => {
    const map = Object.fromEntries(stored.all.map((m) => [m.name, String(Reflect.get(Mof.incorporating(m), 'name'))]));
    expect(map).toEqual({
      AttributeModel: 'M2AbstractAttribute',
      ClassModel: 'M2AbstractClass',
      MethodModel: 'M2AbstractMethod', // ImportModel → M2AbstractImport left the STORED set at U1 S3 (still its incorporating component: the NEVER-STRING-BUILT gate below)
      ParameterModel: 'M2AbstractParameter',
      RelationshipModel: 'M2AbstractRelationship',
      TypeAliasModel: 'M2AbstractTypeAlias',
    });
  });

  it('CONSISTENT: each incorporating component binds UcpComponent<ThatModel> (directly or by inheritance) — the mark can never disagree with the binding', () => {
    for (const m of stored.all) {
      const component = Mof.incorporating(m);
      expect(UcpComponent.isPrototypeOf(component), m.name).toBe(true);
      expect(Mof.of(component).modelClass, m.name).toBe(m);
    }
  });

  it('AUTHORED ONCE: each mark is an OWN static getter declared in its component\'s own Definition — never inherited, never derived from a name', () => {
    for (const m of stored.all) {
      const component = Mof.incorporating(m);
      const name = String(Reflect.get(component, 'name'));
      const declared = catalog.classes().find((c) => c.name === name)?.methods.find((x) => x.name === 'incorporates');
      expect(declared?.isStatic && declared?.isGetter, `${name} declares static get incorporates()`).toBe(true);
      expect(declared?.returnType, name).toBe(`typeof ${m.name}`);
      expect(Object.getOwnPropertyDescriptor(component, 'incorporates')?.get, name).toBeTypeOf('function');
    }
  });

  it('INHERITED copies are no second binder: M2AbstractCollection / M2AbstractDependency inherit the mark, own none, and the map still answers ONE', () => {
    for (const name of ['M2AbstractCollection', 'M2AbstractDependency']) {
      const sub = Mof.loadedClassNamed(name);
      expect(sub, `${name} loaded`).toBeDefined();
      expect(Reflect.get(sub ?? {}, 'incorporates'), `${name} inherits the mark`).toBe(RelationshipModel);
      expect(Object.getOwnPropertyDescriptor(sub ?? {}, 'incorporates'), `${name} owns no mark`).toBeUndefined();
    }
    expect(String(Reflect.get(Mof.incorporating(RelationshipModel), 'name'))).toBe('M2AbstractRelationship');
  });

  it('seed a SECOND binder (any name) → RED naming the MODEL and both components; revert → GREEN', () => {
    const seed = { Zzz: class extends UcpComponent<AttributeModel> {
      static get incorporates(): typeof AttributeModel { return AttributeModel; }
      static override get typeArguments(): Record<string, Array<abstract new () => object>> { return { UcpComponent: [AttributeModel] }; }
    } }.Zzz;
    registry.set('Seed.P3.Zzz', seed);
    try {
      expect(() => Mof.incorporating(AttributeModel)).toThrow("Mof.incorporating: 'AttributeModel' is incorporated by 2 components (M2AbstractAttribute, Zzz) — ONE authored mark per model (ruling 4)");
    } finally {
      registry.delete('Seed.P3.Zzz');
    }
    expect(String(Reflect.get(Mof.incorporating(AttributeModel), 'name'))).toBe('M2AbstractAttribute');
  });

  it('seed a model NO component incorporates → RED naming the model, never a guess', () => {
    const orphan = { SeedOrphanModel: class extends AttributeModel {} }.SeedOrphanModel; // a CONCRETE model class of its own identity — no component marks it
    expect(() => Mof.incorporating(orphan)).toThrow("Mof.incorporating: no loaded component incorporates 'SeedOrphanModel' — ONE authored mark per model (ruling 4), never a name convention");
  });

  it('seed a mark that DISAGREES with its binding → RED naming the model and the component', () => {
    const liar = { SeedLiar: class extends UcpComponent<AttributeModel> {
      static get incorporates(): typeof ClassModel { return ClassModel; }
      static override get typeArguments(): Record<string, Array<abstract new () => object>> { return { UcpComponent: [AttributeModel] }; }
    } }.SeedLiar;
    const orphan = { SeedOrphanModel: class extends AttributeModel {} }.SeedOrphanModel; // a CONCRETE model class of its own identity — no component marks it
    registry.set('Seed.P3.SeedLiar', liar);
    try {
      Reflect.defineProperty(liar, 'incorporates', { get: () => orphan, configurable: true });
      expect(() => Mof.incorporating(orphan)).toThrow("Mof.incorporating: SeedLiar marks 'SeedOrphanModel' but binds 'AttributeModel' — the mark must equal the binding (ruling 4)");
    } finally {
      registry.delete('Seed.P3.SeedLiar');
    }
  });

  it('NEVER STRING-BUILT: an impostor carrying the conventional NAME (M2AbstractImport) but no mark is never chosen — the typed mark decides', () => {
    const real = Mof.incorporating(ImportModel);
    const impostor = { M2AbstractImport: class extends UcpComponent<ImportModel> {} }.M2AbstractImport;
    registry.set('Seed.P3.M2AbstractImport', impostor);
    try {
      expect(() => Mof.loadedClassNamed('M2AbstractImport')).toThrow('ambiguous'); // the NAME is now ambiguous …
      expect(Mof.incorporating(ImportModel)).toBe(real); // … the MARK is not: a name never decides
      expect(Mof.incorporating(ImportModel)).not.toBe(impostor);
    } finally {
      registry.delete('Seed.P3.M2AbstractImport');
    }
  });
});

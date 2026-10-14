import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { M1Catalog } from '../../../../M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';
import { RadicalOopGate } from '../../../../../RadicalOopGate/latest/src/ts/EAM/layer2/RadicalOopGate.js';
import { ClassModel } from '../../../../../latest/src/ts/EAM/layer3/ClassModel.js';
import { M2AbstractClass } from '../src/ts/EAM/layer2/M2AbstractClass.js';
import { Source } from '../../../../../latest/test/Source.js';

/**
 * The ORACLE for "the existing abstract M1 classes" — DERIVED, never a re-typed list (oopPO 2026-10-14): a catalogued class
 * is abstract iff its committed source DECLARES `export abstract class <Name>`. Deliberately NOT `catalog.abstractClasses()`:
 * that filter IS `createExisting` (M2AbstractClass.ts), so it would test the code with itself.
 */
class AbstractOnDisk {
  private found: string[] = [];
  constructor() {}
  init(catalog: M1Catalog): this {
    const source = new Source().init();
    this.found = catalog
      .classes()
      .map((c) => c.name)
      .filter((name) => new RegExp(`^export abstract class ${name}\\b`, 'm').test(readFileSync(source.of(name), 'utf8')))
      .sort();
    return this;
  }
  get names(): string[] {
    return this.found;
  }
}

describe('M2AbstractClass', () => {
  it('has the radical-OOP shape (spec §3)', () => {
    expect(new RadicalOopGate().init().check(M2AbstractClass)).toEqual([]);
  });

  it('creates the existing abstract M1 classes: the model bases, the Thinglish interfaces, UcpComponent', () => {
    const catalog = new M1Catalog().init();
    const m1s = new M2AbstractClass().init().createExisting(catalog);
    const abstractOnDisk = new AbstractOnDisk().init(catalog).names;
    expect(abstractOnDisk.length, 'non-vacuous: the 18 abstract classes named at 6977cd08c are the floor').toBeGreaterThanOrEqual(18);
    expect(abstractOnDisk, 'anchors: the model base, the Thinglish root, the component base').toEqual(expect.arrayContaining(['Interface', 'Model', 'UcpComponent']));
    expect(m1s.map((c) => c.name).sort()).toEqual(abstractOnDisk); // a SET: classes() order is the tree's (spec 12 rule 5)
    const source = m1s.find((c) => c.name === 'Interface')?.toSource() ?? ''; // by NAME: classes() order is the tree's (spec 12 rule 5)
    expect(source).toContain('export abstract class Interface {\n  constructor() {}\n');
    expect(source).toContain('  static get implements(): Array<typeof Interface> {\n    return [];\n  }');
    expect(readFileSync(new Source().init().of('Interface'), 'utf8')).toContain(source.trimEnd());
    const model = m1s.find((c) => c.name === 'Model')?.toSource() ?? '';
    expect(model).toContain("import { Unit } from './Unit.js';\n\nexport type Writable<M, K extends keyof M> = ");
    expect(model).toContain('export type Json<M> = ');
    expect(model).toContain('export type Init<M> = ');
    expect(model).toContain('export abstract class Model extends Unit {\n  constructor() {\n    super();\n  }');
    expect(model).toContain('  toJSON(): Json<this> {');
    expect(model).toContain('  init(json: Init<this>): this {');
  });

  it('is failable: a catalog whose model flips ONE abstract class to concrete is RED against the disk oracle (seed -> RED)', () => {
    class Flipped extends M1Catalog {
      override classes(): ClassModel[] {
        return super.classes().map((c) => (c.name !== 'Model' ? c : new ClassModel().init({ ...c.toJSON(), isAbstract: false } as never)));
      }
    }
    const catalog = new Flipped().init();
    const created = new M2AbstractClass().init().createExisting(catalog).map((c) => c.name).sort();
    expect(created, 'the seeded concrete Model is no longer created').not.toContain('Model');
    expect(created).not.toEqual(new AbstractOnDisk().init(new M1Catalog().init()).names); // the disk still declares it abstract -> the gate above would be RED
  });

  it('forces every class it creates to be abstract', () => {
    const c = new ClassModel();
    c.name = 'Shape';
    const m1 = new M2AbstractClass().init().create(c);
    expect(m1.classModel.isAbstract).toBe(true);
    expect(m1.toSource()).toMatch(/^export abstract class Shape \{/);
  });
});

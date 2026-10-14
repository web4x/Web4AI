import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { M1Catalog } from '../../../../M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';
import { RadicalOopGate } from '../../../../../RadicalOopGate/latest/src/ts/EAM/layer2/RadicalOopGate.js';
import { ClassModel } from '../../../../../latest/src/ts/EAM/layer3/ClassModel.js';
import { M2AbstractClass } from '../src/ts/EAM/layer2/M2AbstractClass.js';
import { Source } from '../../../../../latest/test/Source.js';

describe('M2AbstractClass', () => {
  it('has the radical-OOP shape (spec §3)', () => {
    expect(new RadicalOopGate().init().check(M2AbstractClass)).toEqual([]);
  });

  it('creates the existing abstract M1 classes: the model bases, the Thinglish interfaces, UcpComponent', () => {
    const m1s = new M2AbstractClass().init().createExisting(new M1Catalog().init());
    expect(m1s.map((c) => c.name).sort()).toEqual(['Authority', 'Component', 'Displayable', 'File', 'Folder', 'Interface', 'ItemModel', 'M3Element', 'Model', 'ModelUnit', 'Process', 'TaggedComponent', 'TaggedProfile', 'Tree', 'UcpComponent', 'UcpUnit', 'Unit', 'View']); // a SET: classes() order is the tree's (spec 12 rule 5); // Process: the layer-4 marker interface (spec 12 inc 3); TaggedComponent/TaggedProfile: the abstract CORBA parts (spec 14 I1)
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

  it('forces every class it creates to be abstract', () => {
    const c = new ClassModel();
    c.name = 'Shape';
    const m1 = new M2AbstractClass().init().create(c);
    expect(m1.classModel.isAbstract).toBe(true);
    expect(m1.toSource()).toMatch(/^export abstract class Shape \{/);
  });
});

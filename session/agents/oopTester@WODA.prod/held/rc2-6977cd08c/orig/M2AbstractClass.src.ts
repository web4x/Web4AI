import { ClassModel } from '../../../../../../../../latest/src/ts/EAM/layer3/ClassModel.js';
import type { Init } from '../../../../../../../../latest/src/ts/EAM/layer3/Model.js';
import type { M1Catalog } from '../../../../../../../M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';
import { M1Class } from '../../../../../../../M1/M1Class/latest/src/ts/EAM/layer2/M1Class.js';
import { M2TypescriptClass } from '../../../../../../M2TypescriptClass/latest/src/ts/EAM/layer2/M2TypescriptClass.js';
import { M3Class } from '../../../../../../../M3/M3Class/latest/src/ts/EAM/layer2/M3Class.js';

/**
 * M2 — the abstract class concept: a TypeScript class that cannot be instantiated.
 * An instance of M3Class; the metaclass of `Model`.
 */
export class M2AbstractClass extends M2TypescriptClass {
  constructor() {
    super();
  }

  static override get namespace(): string {
    return 'com.ceruleanCircle.Web4MDA.MOF.M2';
  }

  static override get component(): string {
    return 'com.ceruleanCircle.Web4MDA.MOF.M2.M2AbstractClass';
  }

  override create(classModel: ClassModel): M1Class {
    const m1 = new ClassModel().init({
      ...classModel.toJSON(),
      isAbstract: true,
    });
    return super.create(m1);
  }

  override createExisting(catalog: M1Catalog): M1Class[] {
    this.resolving(catalog);
    return catalog.abstractClasses().map((c) => this.create(c));
  }

  protected override defaults(): Init<ClassModel> {
    return {
      ...super.defaults(),
      name: 'M2AbstractClass',
      isAbstract: true,
    };
  }

  /** The model this component INCORPORATES — the ONE authored mark of the model → component map (plan 2026-10-11 ruling 4, Tron Q2 A). */
  static get incorporates(): typeof ClassModel {
    return ClassModel; // the ONE authored mark (plan 2026-10-11 ruling 4, Tron Q2 A): a stored ClassModel unit is typed by THIS component
  }
}

M2AbstractClass.start();

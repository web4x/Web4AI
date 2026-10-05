import * as Child from 'node:child_process';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * oopTester I5 gate — ruling A + rule 4 (b): a model whose SOLE user is a component is OWNED by it and sits IN that component's
 * folder (`<…>/<Owner>/latest/model/`), wherever the owner lives — at the Package root or inside a sub-package (the I5 regression:
 * RepositoryIdModel / ObjectKeyModel / InternetProfileModel / SecureTransportModel left in `Ior/latest` while their owners sit in
 * `Ior/<Owner>/latest`). The ORACLE reads only the committed TEXT — `git ls-files` + each Definition's ImportModel facts — never
 * the layout code it judges (an oracle must not embody the mechanism). Whole tree, every model: scan the hazard, not the actors.
 */
class OwnedModels {
  private files: string[] = [];
  constructor() {}
  init(): this {
    this.files = Child.execFileSync('git', ['ls-files', 'EAMD.ucp'], { encoding: 'utf8' }).split('\n').filter((f) => f !== '');
    return this;
  }
  /** class name -> its Definition path */
  private get definitions(): Map<string, string> {
    const defs = new Map<string, string>();
    for (const f of this.files) {
      const m = /\/model\/([A-Za-z0-9]+)Definition\.ts$/.exec(f);
      if (m?.[1] !== undefined) defs.set(m[1], f);
    }
    return defs;
  }
  /** component name -> its own `<…>/<Component>/latest` folder (a component's Definition sits in its OWN folder) */
  private get components(): Map<string, string> {
    const dirs = new Map<string, string>();
    for (const f of this.files) {
      const m = /^(.*\/([A-Za-z0-9]+)\/latest)\/model\/\2Definition\.ts$/.exec(f);
      if (m?.[1] !== undefined && m[2] !== undefined) dirs.set(m[2], m[1]);
    }
    return dirs;
  }
  /** every model with exactly ONE user that is a component: { model, owner, ownerDir, modelPath } */
  get owned(): { model: string; owner: string; ownerDir: string; modelPath: string }[] {
    const defs = this.definitions;
    const comps = this.components;
    const texts = new Map([...defs].map(([c, f]) => [c, readFileSync(f, 'utf8')]));
    const result: { model: string; owner: string; ownerDir: string; modelPath: string }[] = [];
    for (const [model, modelPath] of defs) {
      if (!model.endsWith('Model')) continue;
      const users = [...texts].filter(([c, t]) => c !== model && new RegExp(`new ImportModel\\(\\)\\.init\\(\\{[^}]*name: '${model}'`, 's').test(t)).map(([c]) => c);
      const owner = users.length === 1 ? users[0] : undefined;
      const ownerDir = owner === undefined ? undefined : comps.get(owner);
      if (owner !== undefined && ownerDir !== undefined) result.push({ model, owner, ownerDir, modelPath });
    }
    return result;
  }
}

describe('OWNED MODEL PLACEMENT (ruling A + rule 4 b): a sole-user model sits in its owner component folder', () => {
  it('non-vacuous: owned models exist, including the IOR ones', () => {
    const owned = new OwnedModels().init().owned.map((o) => o.model);
    expect(owned.length, 'owned models found').toBeGreaterThan(10);
    expect(owned, 'the IOR owned models are in scope').toEqual(expect.arrayContaining(['RepositoryIdModel', 'ObjectKeyModel', 'InternetProfileModel', 'SecureTransportModel']));
  });

  it('EVERY owned model sits in its owner folder — named when it does not', () => {
    const away = new OwnedModels()
      .init()
      .owned.filter((o) => !o.modelPath.startsWith(`${o.ownerDir}/model/`))
      .map((o) => `${o.model} (owner ${o.owner} at ${o.ownerDir.replace(/^.*\/Web4MDA\//, '')}, model at ${o.modelPath.replace(/^.*\/Web4MDA\//, '').replace(/\/model\/.*$/, '')})`);
    expect(away).toEqual([]);
  });
});

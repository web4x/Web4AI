import { readdirSync } from 'node:fs';
import { M1Catalog } from '../../MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';

/**
 * Where the TypeScript SOURCE of a class lives (spec/component-model.md rule 6, AC4): the repo MIRRORS the EAMD layout,
 * so each class's file sits at its layout path under `EAMD.ucp/Components/`. Answered by a WALK of that tree — derived, never a
 * stored or hand-written path — so the next layout change moves every test at once.
 */
export class Source {
  private rootDirectory = 'EAMD.ucp/Components';
  private readonly generator = new M1Catalog().init(); // asked what it GENERATES (spec 12 rule 6 a) — derived, never a directory list

  constructor() {}

  init(rootDirectory = 'EAMD.ucp/Components'): this {
    this.rootDirectory = rootDirectory;
    return this;
  }

  /** The root of the source tree (the former `src`). */
  get root(): string {
    return this.rootDirectory;
  }

  /** Every source file (`*.ts`) under the root, repo-relative, sorted. */
  get files(): string[] {
    return this.walk(this.rootDirectory).sort();
  }

  /** Every MODEL source (`<Component>/latest/model/<X>Definition.ts`, spec 12 rule 4) under the root, repo-relative, sorted. */
  get definitions(): string[] {
    return this.walkModel(this.rootDirectory).sort();
  }

  /** The model source of class `name` — exactly ONE `<name>Definition.ts`, or it throws. */
  definitionOf(name: string): string {
    const hits = this.definitions.filter((f) => f.endsWith(`/latest/model/${name}Definition.ts`));
    const hit = hits[0];
    if (hits.length !== 1 || hit === undefined) throw new Error(`Source: ${hits.length} model sources for class '${name}' under ${this.rootDirectory}/`);
    return hit;
  }

  /** The class names of every source file (file = class). */
  get names(): string[] {
    return this.files.map((f) => this.nameOf(f)).sort();
  }

  /** The source file of class `name` — exactly ONE, or it throws: a missing or duplicated class is a finding, never a guess. */
  of(name: string): string {
    const hits = this.files.filter((f) => this.nameOf(f) === name);
    const hit = hits[0];
    if (hits.length !== 1 || hit === undefined) throw new Error(`Source: ${hits.length} source files for class '${name}' under ${this.rootDirectory}/`);
    return hit;
  }

  /**
   * The class names of one META-LEVEL (`M1`, `M2`, `M3`) over the WHOLE tree — by the level's naming law, never by folder:
   * since AC4 an abstract meta class (M3Element) sits in the Package's own src, so a folder walk DROPS it (oopPO L1).
   */
  atLevel(level: 'M1' | 'M2' | 'M3'): string[] {
    return this.names.filter((n) => new RegExp(`^${level}[A-Z]`).test(n));
  }

  /** The class names under one namespace folder (`MOF/M3`) — the former `src/MOF/M3` listing. */
  namesIn(namespace: string): string[] {
    return this.files
      .filter((f) => f.includes(`/Web4MDA/${namespace}/`))
      .map((f) => this.nameOf(f))
      .sort();
  }

  private nameOf(file: string): string {
    return (file.split('/').pop() ?? '').replace(/\.ts$/, '');
  }

  private walkModel(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const path = `${dir}/${e.name}`;
      if (e.isDirectory()) return new M1Catalog().isScratch(path) ? [] : this.walkModel(path); // H3: the ONE exclusion
      return e.name.endsWith('Definition.ts') && path.includes('/latest/model/') ? [path] : [];
    });
  }

  private walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const path = `${dir}/${e.name}`;
      if (e.isDirectory()) return this.generator.isGenerated(`${path}/`) || new M1Catalog().isScratch(path) ? [] : this.walk(path); // H3: scratch copies are never sources // a GENERATED folder (src/<language>/) holds no source: pruned, never descended (every language is home since spec 12 inc 6 C3)
      if (this.generator.isGenerated(path)) return []; // generated home-language output (thinglish.ts…) is never a source
      return e.name.endsWith('.ts') && path.includes('/latest/src/') ? [path] : []; // AC4b: a component's test/ sits beside its src/ — sources only
    });
  }
}

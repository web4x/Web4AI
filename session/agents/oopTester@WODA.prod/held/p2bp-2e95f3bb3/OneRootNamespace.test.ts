import { readdirSync, readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import type { ClassModel } from '../../../../../latest/src/ts/EAM/layer3/ClassModel.js';
import { M1Catalog } from '../src/ts/EAM/layer2/M1Catalog.js';

/**
 * END AUDIT re-expressed gates (oopPO rulings 2026-10-12) under ONE ROOT (spec/eamd-ucp.md rule 7a, 985e23841):
 * P2-ROOT′ — a class's stored namespace agrees with WHERE IT IS ON DISK below the NEAREST enclosing EAMD.ucp/Components;
 * P2-LIT′ — no src/ts namespace LITERAL duplicates a folder-derived namespace, except a class's OWN declaration.
 * Both oracles read the DISK only — never M1Layout (whose placement is derived FROM the namespace: circular under 7a).
 */
class DiskTree {
  private root = '';
  private files: string[] = [];
  private static readonly mark = `${sep}EAMD.ucp${sep}Components${sep}`;

  constructor() {}

  init(from: string = fileURLToPath(import.meta.url)): this {
    const at = from.lastIndexOf(DiskTree.mark); // the NEAREST root: a checkout nested inside another root reads its own
    expect(at, `no EAMD.ucp/Components above ${from}`).toBeGreaterThan(-1);
    this.root = from.slice(0, at + DiskTree.mark.length - 1);
    this.files = this.walk(this.root, []);
    return this;
  }

  get all(): string[] {
    return this.files;
  }

  /** The dotted folder chain between the NEAREST `EAMD.ucp/Components/` and `/latest/` — '' when the path holds no latest/. */
  chainOf(path: string): string {
    const rel = path.slice(path.lastIndexOf(DiskTree.mark) + DiskTree.mark.length);
    const end = rel.indexOf(`${sep}latest${sep}`);
    return end < 0 ? '' : rel.slice(0, end).split(sep).join('.');
  }

  site(path: string): string {
    return path.slice(path.lastIndexOf(DiskTree.mark) + DiskTree.mark.length);
  }

  private walk(dir: string, out: string[]): string[] {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      if (e.name === 'node_modules' || e.name === 'gen' || e.name.startsWith('.')) continue;
      const p = join(dir, e.name);
      if (e.isDirectory()) this.walk(p, out);
      else if (e.isFile()) out.push(p);
    }
    return out;
  }
}

class FolderRoot {
  private tree: DiskTree = new DiskTree();
  private classes: ClassModel[] = [];
  private byName: Map<string, ClassModel> = new Map();

  constructor() {}

  init(tree: DiskTree, classes: ClassModel[]): this {
    this.tree = tree;
    this.classes = classes;
    this.byName = new Map(classes.map((c) => [c.name, c]));
    return this;
  }

  /** WHERE a class is: its ONE Definition, else (no Definition — the placed M1Catalog) its ONE src/ts source. */
  located(c: ClassModel): string[] {
    const defs = this.tree.all.filter((f) => f.endsWith(`${sep}latest${sep}model${sep}${c.name}Definition.ts`));
    return defs.length > 0 ? defs : this.tree.all.filter((f) => f.endsWith(`${sep}${c.name}.ts`) && f.includes(`${sep}latest${sep}src${sep}ts${sep}`));
  }

  /** The component that OWNS a folder: the catalogued class LOCATED in it under the folder's own name — '' for a namespace folder. */
  ownerOf(folder: string): string {
    const last = folder.split('.').pop() ?? '';
    const c = this.byName.get(last);
    return c !== undefined && this.located(c).some((p) => this.tree.chainOf(p) === folder) ? last : '';
  }

  /** A PACKAGE folder holds other component folders (rule 6) — read from the disk. */
  isPackage(folder: string): boolean {
    return this.tree.all.some((f) => {
      const ch = this.tree.chainOf(f);
      return ch !== folder && ch.startsWith(`${folder}.`);
    });
  }

  /** The model a component BINDS: its UcpComponent type argument, resolved along the superclass chain (model data, never a namespace). */
  bound(name: string): string {
    const bare = (s: string): string => s.replace(/<.*$/, '');
    let env = new Map<string, string>();
    for (let c = this.byName.get(name); c !== undefined; c = this.byName.get(bare(c.superclass))) {
      const b = c.typeArguments['UcpComponent']?.[0];
      if (b !== undefined) return env.get(b) ?? b;
      const args = (c.typeArguments[bare(c.superclass)] ?? []).map((a) => env.get(a) ?? a);
      const next = new Map<string, string>();
      (this.byName.get(bare(c.superclass))?.typeParameters ?? []).forEach((p, i) => next.set(p.split(' ')[0] ?? p, args[i] ?? ''));
      env = next;
    }
    return '';
  }

  category(c: ClassModel): string {
    const folder = this.tree.chainOf(this.located(c)[0] ?? '');
    const owner = this.ownerOf(folder);
    if (c.name === owner) return 'own-class';
    if (owner !== '' && !this.isPackage(folder)) return 'held-by-component';
    return owner !== '' ? 'in-package-folder' : 'in-namespace-folder';
  }

  /** P2-ROOT′: every class whose stored namespace disagrees with its disk folder — RED BY NAME. */
  mismatches(classes: ClassModel[] = this.classes): string[] {
    return classes
      .filter((c) => {
        const at = this.located(c);
        if (at.length !== 1) return true;
        const folder = this.tree.chainOf(at[0] ?? '');
        const owner = this.ownerOf(folder);
        const held = `${c.namespace}.${owner}` === folder;
        switch (this.category(c)) {
          case 'own-class':
          case 'held-by-component':
            return !held;
          case 'in-package-folder':
            return !(c.namespace === folder || (held && this.bound(owner) === c.name && this.users(c.name).join() === owner));
          default:
            return c.namespace !== folder;
        }
      })
      .map((c) => c.name)
      .sort();
  }

  private users(model: string): string[] {
    return this.classes.filter((k) => this.bound(k.name) === model).map((k) => k.name);
  }
}

class NamespaceLiterals {
  private tree: DiskTree = new DiskTree();
  private byName: Map<string, ClassModel> = new Map();
  private extra: Record<string, string> = {};

  constructor() {}

  init(tree: DiskTree, classes: ClassModel[], extra: Record<string, string> = {}): this {
    this.tree = tree;
    this.byName = new Map(classes.map((c) => [c.name, c]));
    this.extra = extra;
    return this;
  }

  /** The scan list, DERIVED from the disk: every src/ts source below the nearest Components (+ seeded virtual files). */
  get scanned(): string[] {
    return [...this.tree.all.filter((f) => f.includes(`${sep}latest${sep}src${sep}ts${sep}`) && f.endsWith('.ts')), ...Object.keys(this.extra)];
  }

  /** Every folder-derived namespace: each component folder chain and its prefixes of two or more segments. */
  get folderNamespaces(): Set<string> {
    const out = new Set<string>();
    for (const f of this.tree.all) {
      const segs = this.tree.chainOf(f).split('.').filter((s) => s !== '');
      for (let k = 2; k <= segs.length; k++) out.add(segs.slice(0, k).join('.'));
    }
    return out;
  }

  /** Every literal equal to a folder-derived namespace, each marked ALLOWED only at its class's OWN namespace/component declaration. */
  hits(): { site: string; value: string; allowed: boolean }[] {
    const ns = this.folderNamespaces;
    const out: { site: string; value: string; allowed: boolean }[] = [];
    for (const f of this.scanned) {
      const own = this.byName.get(f.split(sep).pop()?.replace(/\.ts$/, '') ?? '');
      const lines = (this.extra[f] ?? readFileSync(f, 'utf8')).split('\n');
      lines.forEach((line, i) => {
        for (const m of line.matchAll(/(['"`])([^'"`$\n]*?)\1/g)) {
          const value = m[2] ?? '';
          if (!ns.has(value)) continue;
          const getter = /\bget (namespace|component)\(\)/.exec(lines.slice(Math.max(0, i - 2), i).join('\n'));
          const declared = getter !== null && /^\s*return\s/.test(line) && own !== undefined;
          const ownValue = own === undefined ? '' : getter?.[1] === 'component' ? own.component : own.namespace;
          out.push({ site: `${this.tree.site(f)}:${i + 1}`, value, allowed: declared && value === ownValue });
        }
      });
    }
    return out;
  }
}

describe('END AUDIT re-expressed under ONE ROOT (oopPO rulings 2026-10-12) — the disk is the oracle, never M1Layout', () => {
  let tree: DiskTree;
  let classes: ClassModel[];
  beforeAll(async () => {
    await M1Catalog.load();
    const catalog = new M1Catalog().init();
    classes = [...catalog.classes(), catalog.placedModel()];
    tree = new DiskTree().init();
  });

  it('the disk tree is read below the NEAREST EAMD.ucp/Components — a FIRST-match reader on a nested root is SEEN', () => {
    const nested = ['', 'r', 'EAMD.ucp', 'Components', 'outer', 'gen', 'EAMD.ucp', 'Components', 'com', 'x', 'Y', 'latest', 'model', 'YDefinition.ts'].join(sep);
    expect(tree.chainOf(nested)).toBe('com.x.Y');
    const first = nested.slice(nested.indexOf(`${sep}EAMD.ucp${sep}Components${sep}`) + `${sep}EAMD.ucp${sep}Components${sep}`.length);
    expect(first.slice(0, first.indexOf(`${sep}latest${sep}`)).split(sep).join('.')).not.toBe('com.x.Y'); // what a first-match reader would read
    expect(tree.all.length).toBeGreaterThan(100); // the whole tree, not a sample
  });

  it('P2-ROOT′ — EVERY class (+ the placed M1Catalog) has a stored namespace that agrees with its disk folder (RED by class name; CHECKED == TOTAL)', () => {
    const law = new FolderRoot().init(tree, classes);
    expect(classes.length).toBeGreaterThan(100);
    expect(classes.filter((c) => law.located(c).length !== 1).map((c) => c.name)).toEqual([]); // every class LOCATED exactly once — none skipped
    expect(law.mismatches()).toEqual([]);
    console.log(`P2-ROOT′ CHECKED ${classes.length} / SKIPPED 0 / TOTAL ${classes.length}`);
  });

  it('P2-ROOT′ is failable: a namespace ONE SEGMENT SHORT, a namespace that swallowed its holding component, and a class LEFT in a package folder it is not bound to are each RED BY NAME', () => {
    const law = new FolderRoot().init(tree, classes);
    const folderOf = (c: ClassModel): string => tree.chainOf(law.located(c)[0] ?? '');
    const seedOf = (category: string, also: (c: ClassModel) => boolean = () => true): ClassModel => {
      const c = classes.find((k) => law.category(k) === category && k.namespace.includes('.') && also(k));
      expect(c, `no class in category ${category} — the seed would be hollow`).toBeDefined();
      return Object.assign(Object.create(Object.getPrototypeOf(c)), c) as ClassModel;
    };
    // one segment short in a PACKAGE folder reads exactly like "held by the package" — only the BOUND model may sit so; seed a class that is NOT bound
    const plain = seedOf('in-package-folder', (k) => law.bound(law.ownerOf(folderOf(k))) !== k.name);
    plain.namespace = plain.namespace.split('.').slice(0, -1).join('.');
    expect(law.mismatches(classes.map((k) => (k.name === plain.name ? plain : k)))).toEqual([plain.name]);
    const held = seedOf('held-by-component');
    held.namespace = folderOf(held); // swallowed its holding component: namespace == the component folder itself
    expect(law.mismatches(classes.map((k) => (k.name === held.name ? held : k)))).toEqual([held.name]);
    const own = seedOf('own-class');
    own.namespace = `${own.namespace}.${own.name}`; // a component claiming its own folder as its namespace
    expect(law.mismatches(classes.map((k) => (k.name === own.name ? own : k)))).toEqual([own.name]);
  });

  it('P2-LIT′ — no src/ts namespace literal duplicates a folder-derived namespace except a class\'s OWN namespace/component declaration (RED by file:line; scan list DERIVED)', () => {
    const lit = new NamespaceLiterals().init(tree, classes);
    const scanned = lit.scanned;
    const total = tree.all.filter((f) => f.includes(`${sep}latest${sep}src${sep}ts${sep}`) && f.endsWith('.ts')).length;
    expect(scanned.length).toBe(total);
    expect(total).toBeGreaterThan(100);
    const hits = lit.hits();
    expect(hits.filter((h) => !h.allowed).map((h) => `${h.site} '${h.value}'`)).toEqual([]);
    const allowed = hits.filter((h) => h.allowed).length;
    expect(allowed).toBeGreaterThan(0); // the allowance is NAMED and COUNTED, never silent
    console.log(`P2-LIT′ CHECKED ${scanned.length} files / SKIPPED 0 / TOTAL ${total}; literals ${hits.length} = ${allowed} own declarations + ${hits.length - allowed} RED`);
  });

  it('P2-LIT′ is failable: a FOREIGN namespace literal, and the OWN namespace used outside its declaration (the allowance\'s nearest member), are each RED by file:line', () => {
    const own = classes.find((c) => c.namespace.includes('.'));
    expect(own).toBeDefined();
    const other = classes.find((c) => c.namespace !== own?.namespace && c.namespace.includes('.'));
    expect(other).toBeDefined();
    const at = (n: string): string => join(tree.all[0]?.slice(0, tree.all[0].lastIndexOf(`${sep}EAMD.ucp${sep}`)) ?? '', 'EAMD.ucp', 'Components', 'seed', 'latest', 'src', 'ts', `${n}.ts`);
    const foreign = new NamespaceLiterals().init(tree, classes, { [at(own?.name ?? '')]: `export class X {\n  static get namespace(): string {\n    return '${other?.namespace}';\n  }\n}\n` });
    expect(foreign.hits().filter((h) => !h.allowed).map((h) => h.site)).toEqual([`seed${sep}latest${sep}src${sep}ts${sep}${own?.name}.ts:3`]);
    const body = new NamespaceLiterals().init(tree, classes, { [at(own?.name ?? '')]: `export class X {\n  root(): string[] {\n    return '${own?.namespace}'.split('.');\n  }\n}\n` });
    expect(body.hits().filter((h) => !h.allowed).map((h) => h.site)).toEqual([`seed${sep}latest${sep}src${sep}ts${sep}${own?.name}.ts:3`]);
  });
});

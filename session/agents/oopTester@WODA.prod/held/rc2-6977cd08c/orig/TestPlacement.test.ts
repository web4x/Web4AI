import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, normalize, relative } from 'node:path';
import { describe, expect, it } from 'vitest';
import { TestFolder } from './TestFolder.js';

const PACKAGE = 'EAMD.ucp/Components/com/ceruleanCircle/Web4MDA';

/**
 * H5m (plan 2026-10-06, Tron: "tests are not central but per component"): WHERE a test belongs, DERIVED from the unit —
 * never a hand list. Its SUBJECT is the class it declares (`// test-subject: X`) or else the class its file is named for
 * (file = class, the longest class-name prefix of the stem). It belongs in the component whose `src/` holds that class —
 * when declared, or when its imports resolve into that `src/` (a name alone never moves a file).
 *
 * H5m-3 CORRECTED RULE (Tron, oopPO 2026-10-06 — replaces the former rule 2 "everything else belongs to Web4MDA", the
 * default that kept 46 tests central): a test's subject is the component whose behaviour its ASSERTIONS check
 * (AssertionSubject below) — tie or ambiguous → the MORE SPECIFIC component, never the root. A test may stay in
 * Web4MDA/latest/test ONLY as (A) its strongest assertion subject is Web4MDA's own src (or it declares a Web4MDA class), or
 * (test-support) no component carries more than 2 attributed assertions — or a test-support helper it is NAMED after
 * (Scratch, TestFolder, …) is its strongest subject. A `// test-support:` marker NEVER exempts: the derived check wins.
 * TEST-SUPPORT (derived, gated == below): BootstrapScratch, Child, GarbageSweep, GenClaims, GenReaders, NoTempDirOutsideScratch, Node22, OoshExecute, Pipeline, ScratchExclusion, SlowReport, SoloGroup, Spec, SrcTypecheck, TestBudget, TestFolder, TestPlacement, TestTypecheck, TrackedTree, WriteRecorder
 * RESIDUAL (named, oopPO): the threshold is `> 2` — a test with EXACTLY 2 assertions on another component can still stay.
 *
 * RESIDUAL (named, oopPO ruling C-plus 2026-10-06): a declared subject is verified by TEXT analysis — value import or a
 * real load, plus a use in code. Text analysis can always be fooled one step further (three loopholes were closed in
 * three re-gates: type import, string title, readFileSync-as-text), and even a true runtime check proves only that the
 * subject's code EXECUTED, not that the test is ABOUT it. The build path, if a real case ever appears: V8 coverage
 * counts beyond an empty-test baseline, one file per process — measured to separate all three false-greens (0) from
 * every real declaration (3–69): AI/Claude session/agents/oopExpert@WODA.prod/reports/H5m-coverage-measure-d9a2ca2c.md.
 * KNOWN FALSE-GREEN inside this residual (oopTester W4 verdict 2a48a1c7, ACCEPTED by oopPO 2026-10-06): a test that
 * LOADS the subject, DISCARDS the result, and declares a `const` named after the CLASS reads GREEN — the "use in code"
 * is matched by NAME, so the name-only const counts as a use. It has the shape of the gate's own GREEN twin; closing it
 * is the coverage path above, not one more text rule.
 */
/**
 * CodeText — a source text with every LITERAL blanked, the ONE rule both scanners use (uses() and AssertionSubject; oopPO, hole
 * found in R2 s2: a variable `a` was credited for every letter a inside an assertion message). Comments and regex literals are
 * removed; string and template literals become "" unless `keep` holds (uses(): a child-script module load is code another
 * process runs). RESIDUAL: a division `a / b / c` after whitespace reads as a regex literal and is dropped — never a false GREEN.
 */
class CodeText {
  private static readonly LITERALS = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|(?<=[(,=:[!&|?{};\s])\/(?![*/])(?:[^/\\\n[]|\\.|\[(?:[^\]\\\n]|\\.)*\])+\/[a-z]*|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
  private text = '';
  constructor() {}

  init(text: string): this {
    this.text = text;
    return this;
  }

  stripped(keep: (literal: string) => boolean = () => false): string {
    return this.text.replace(CodeText.LITERALS, (t) => (t.startsWith('/') ? '' : keep(t) ? t : '""'));
  }
}

class TestPlacement {
  private seeds: Map<string, string> = new Map();
  private classes: Map<string, Set<string>> = new Map();

  constructor() {}

  init(): this {
    for (const file of this.walk(PACKAGE)) this.addClass(file);
    return this;
  }

  /** A virtual file (repo-relative path → text): a test, or a `src/` class file — the failability arms never write the served tree. */
  seed(path: string, text: string): this {
    this.seeds.set(normalize(path), text);
    this.addClass(normalize(path));
    return this;
  }

  /** Every test in any component's `latest/test/`, the seeds included. */
  get tests(): string[] {
    const real = new TestFolder().init().tests;
    return [...new Set([...real, ...[...this.seeds.keys()].filter((f) => f.endsWith('.test.ts'))])].sort();
  }

  /** The component folder a test sits in (the part before `/latest/test/`). */
  componentOf(file: string): string {
    return file.slice(0, file.indexOf('/latest/test/'));
  }

  /**
   * The component folder a test BELONGS in, derived from the unit. A DECLARED subject is a claim and is verified like one
   * (oopTester H5m verdict, R1): the test must reach the class's `src/` (an import, or a module path a child script loads)
   * AND use the class in code (not in a comment) — else the placement is RED, never trusted.
   */
  homeOf(file: string): string {
    const text = this.read(file);
    const declared = /^\/\/ test-subject: (\w+)/m.exec(text)?.[1];
    const stem = (file.split('/').pop() ?? '').replace(/\.test\.ts$/, '');
    const named = declared ?? [...this.classes.keys()].filter((c) => stem.startsWith(c)).sort((a, b) => b.length - a.length)[0];
    if (named === undefined) return PACKAGE;
    const owners = [...(this.classes.get(named) ?? [])];
    if (owners.length > 1) return `<class '${named}' is declared in ${owners.length} components — not unique>`;
    const owner = owners[0];
    if (owner === undefined) return declared === undefined ? PACKAGE : `<no class '${declared}' in any src/>`;
    const reached = this.reaches(file, named, owner);
    if (declared !== undefined) return reached && this.uses(file, named) ? owner : `<declared subject '${declared}' is not imported AND used>`;
    return owner !== PACKAGE && reached ? owner : PACKAGE;
  }

  /** Tests not sitting in their home — must be empty. */
  get misplaced(): string[] {
    return this.tests.filter((t) => this.homeOf(t) !== this.componentOf(t)).map((t) => `${t} -> ${this.homeOf(t)}`);
  }

  /** Class names held by MORE than one component's `src/` — must be empty (a name would resolve first-wins). */
  get duplicates(): string[] {
    return [...this.classes.entries()].filter(([, owners]) => owners.size > 1).map(([name, owners]) => `${name}: ${[...owners].sort().join(', ')}`);
  }

  /** Components with a `src/` and no test, relative to the package (H5m gate c). */
  get untested(): string[] {
    const covered = new Set(this.tests.map((t) => this.componentOf(t)));
    const components = new Set([...this.classes.values()].flatMap((owners) => [...owners]));
    return [...components].filter((c) => !covered.has(c)).map((c) => (c === PACKAGE ? '.' : c.slice(PACKAGE.length + 1))).sort();
  }

  /**
   * Does the test REACH the class's `src/` at runtime — a VALUE import resolving into it, or a real LOAD of the class's
   * module path: the path is the ARGUMENT of `import(…)` / `require(…)` (in code, or in a child script's literal). A
   * type-only import is erased at runtime; a path handed to `readFileSync` is TEXT, never a load (H5m re-gates 1–3).
   */
  private reaches(file: string, name: string, owner: string): boolean {
    const text = this.read(file);
    const statics = [...text.matchAll(/^import\s+(type\s+)?([\s\S]*?)\s+from\s+'(\.[^']+)';/gm)]
      .filter((m) => m[1] === undefined && !new RegExp(`\\btype\\s+${name}\\b`).test(m[2] ?? ''))
      .map((m) => m[3] ?? '');
    const dynamics = [...text.matchAll(/import\(\s*'(\.[^']+)'\s*\)/g)].map((m) => m[1] ?? '');
    const resolved = [...statics, ...dynamics].map((s) => relative('.', normalize(`${dirname(file)}/${s}`)));
    return resolved.some((p) => p.startsWith(`${owner}/latest/src/`)) || this.load(name).test(this.withoutImports(text));
  }

  /**
   * Is the class USED in code? Import statements and comments are removed and every string / template literal is
   * blanked (a describe TITLE, a path given to readFileSync: no use) — EXCEPT a literal that itself LOADS the class
   * (`import(…)` / `require(…)` of its module path): that literal is a child script, code another process runs.
   */
  private uses(file: string, name: string): boolean {
    // ONE left-to-right alternation; a REGEX LITERAL is a token too (H5m-3: FileUnitsMigration's /`(\w+)/ holds ONE backtick —
    // read as a template it swallowed the code up to the next backtick, the class use included = a false RED). RESIDUAL: a
    // division written `a / b / c` after whitespace reads as a regex literal and is dropped — never a false GREEN.
    const code = new CodeText().init(this.withoutImports(this.read(file))).stripped((t) => this.load(name).test(t));
    return new RegExp(`\\b${name}\\b`).test(code);
  }

  /** A real LOAD of the class's own module path (file = class): the path inside the argument of import(…) / require(…). */
  private load(name: string): RegExp {
    return new RegExp(`(?:\\bimport|\\brequire)\\(\\s*[^)]*?/latest/src/ts/[^'"\`\\s]*/${name}\\.(js|ts)\\b`);
  }

  private withoutImports(text: string): string {
    return text.replace(/^import\s[\s\S]*?;$/gm, '');
  }

  /** Register a `src/` class file (file = class) under its component. */
  private addClass(file: string): void {
    const m = /^(.*?)\/latest\/src\/ts\/.*\/(\w+)\.ts$/.exec(file);
    if (m === null) return;
    const owners = this.classes.get(m[2] ?? '') ?? new Set();
    owners.add(m[1] ?? '');
    this.classes.set(m[2] ?? '', owners);
  }

  private read(file: string): string {
    return this.seeds.get(normalize(file)) ?? (existsSync(file) ? readFileSync(file, 'utf8') : '');
  }

  private walk(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
      const path = `${dir}/${e.name}`;
      if (e.isDirectory()) return e.name === 'node_modules' || e.name === 'test' ? [] : this.walk(path);
      return [path];
    });
  }
}

/**
 * H5m gate (c) RATCHET (oopPO, from oopTester's verdict: a PRINTED list is invisible to agents): the components with a
 * `src/` and no test, relative to the package. A NEW untested component is RED; CLOSING a gap is RED too until this
 * baseline is lowered in the same diff — the debt can only shrink, and every change to it is reviewed.
 */
const UNTESTED_BASELINE = [
  'Ior/InternetProfile',
  'Ior/ObjectKey',
  'MOF/M2/M2AbstractAttribute',
  'MOF/M2/M2AbstractCollection',
  'MOF/M2/M2ES2020Attribute',
  'MOF/M2/M2MermaidAttribute',
  'MOF/M2/M2PlantUmlAttribute',
  'MOF/M2/M2ThinglishTypescriptClass',
  'MOF/M2/M2TypescriptAttribute',
  'MOF/M3',
  'MOF/M3/M3Method',
  'NpmDependency',
];

describe('H5m — every test lives in the component it tests (plan 2026-10-06, gates a + c)', () => {
  it('gate (a): EVERY test sits in its derived home component; no class name is held by two components', () => {
    const placement = new TestPlacement().init();
    expect(placement.tests.length).toBeGreaterThan(90); // derived from the tree; this only stops a vacuous pass
    expect(placement.misplaced).toEqual([]);
    expect(placement.duplicates).toEqual([]);
    expect(placement.tests.some((t) => placement.componentOf(t) !== PACKAGE)).toBe(true); // component test folders exist and were checked
  });

  it('gate (a) is failable: a misplaced test, a name-only test, and a declared non-class are each RED (seed -> RED)', () => {
    const graph = `${PACKAGE}/MOF/M1/M1Graph`;
    const placement = new TestPlacement()
      .init()
      // a test named for M1Layout and importing its src, but sitting in the package folder
      .seed(`${PACKAGE}/latest/test/M1LayoutSeeded.test.ts`, "import { M1Layout } from '../../MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js';\nnew M1Layout();\n")
      // a whole-tree test (names no class) smuggled into a component folder
      .seed(`${graph}/latest/test/SeededWholeTree.test.ts`, "import { describe } from 'vitest';\n")
      // a declared subject that is no class anywhere
      .seed(`${graph}/latest/test/SeededGhost.test.ts`, '// test-subject: NoSuchClass\n');
    expect([...placement.misplaced].sort()).toEqual([
      `${PACKAGE}/latest/test/M1LayoutSeeded.test.ts -> ${PACKAGE}/MOF/M1/M1Layout`,
      `${graph}/latest/test/SeededGhost.test.ts -> <no class 'NoSuchClass' in any src/>`,
      `${graph}/latest/test/SeededWholeTree.test.ts -> ${PACKAGE}`,
    ].sort());
    // GREEN direction: a NAME alone never moves a test — named for M1Layout but importing nothing from it stays whole-tree
    const nameOnly = new TestPlacement().init().seed(`${PACKAGE}/latest/test/M1LayoutNameOnly.test.ts`, "import { describe } from 'vitest';\n");
    expect(nameOnly.homeOf(`${PACKAGE}/latest/test/M1LayoutNameOnly.test.ts`)).toBe(PACKAGE);
  });

  it('a DECLARED subject is verified, never trusted: a VALUE import (or a child-script module load) AND a use in code — type-only imports, comments, string titles and readFileSync-as-text are RED (M2OoshSha1 defect, re-gates 2+3)', () => {
    const layout = `${PACKAGE}/MOF/M1/M1Layout`;
    const src = "import { M1Layout } from '../src/ts/EAM/layer2/M1Layout.js';\n";
    const placement = new TestPlacement()
      .init()
      .seed(`${layout}/latest/test/DeclaredNotImported.test.ts`, "// test-subject: M1Layout\nimport { describe } from 'vitest';\n")
      .seed(`${layout}/latest/test/DeclaredOnlyInAComment.test.ts`, `// test-subject: M1Layout\n${src}// M1Layout is only mentioned here\n`)
      .seed(`${layout}/latest/test/DeclaredTrue.test.ts`, `// test-subject: M1Layout\n${src}const layout = new M1Layout();\n`);
    expect(placement.homeOf(`${layout}/latest/test/DeclaredNotImported.test.ts`)).toBe("<declared subject 'M1Layout' is not imported AND used>");
    expect(placement.homeOf(`${layout}/latest/test/DeclaredOnlyInAComment.test.ts`)).toBe("<declared subject 'M1Layout' is not imported AND used>");
    expect(placement.homeOf(`${layout}/latest/test/DeclaredTrue.test.ts`)).toBe(layout); // GREEN direction
    // oopTester H5m re-gate S2: a TYPE-only import is no reach, a name inside a string (a describe TITLE) is no use
    const typed = "import type { M1Layout } from '../src/ts/EAM/layer2/M1Layout.js';\n";
    const falseGreens = new TestPlacement()
      .init()
      .seed(`${layout}/latest/test/DeclaredTitleOnly.test.ts`, `// test-subject: M1Layout\n${typed}describe('M1Layout is only named in this title', () => {});\n`)
      .seed(`${layout}/latest/test/DeclaredTypeOnly.test.ts`, `// test-subject: M1Layout\n${typed}const layout: M1Layout | undefined = undefined;\n`)
      .seed(`${layout}/latest/test/DeclaredValueTitleOnly.test.ts`, `// test-subject: M1Layout\n${src}describe('M1Layout title', () => {});\n`);
    for (const f of ['DeclaredTitleOnly', 'DeclaredTypeOnly', 'DeclaredValueTitleOnly'])
      expect(falseGreens.homeOf(`${layout}/latest/test/${f}.test.ts`), f).toBe("<declared subject 'M1Layout' is not imported AND used>");
    // re-gate 3: a path handed to readFileSync is TEXT, never a load — with the name in the literal, or even in code
    const readNamed = "// test-subject: M1Layout\nreadFileSync('EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts', 'utf8');\nconst M1Layout = 'not the class';\n";
    const asText = new TestPlacement()
      .init()
      .seed(`${layout}/latest/test/DeclaredReadAsText.test.ts`, "// test-subject: M1Layout\nconst text = readFileSync('EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts', 'utf8');\nexpect(text).toContain('class M1Layout');\n")
      .seed(`${layout}/latest/test/DeclaredReadAsTextNamed.test.ts`, readNamed)
      .seed(`${layout}/latest/test/DeclaredPathLiteralOnly.test.ts`, "// test-subject: M1Layout\nconst script = `const path = '/r/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts'; M1Layout;`;\n");
    for (const f of ['DeclaredReadAsText', 'DeclaredReadAsTextNamed', 'DeclaredPathLiteralOnly'])
      expect(asText.homeOf(`${layout}/latest/test/${f}.test.ts`), f).toBe("<declared subject 'M1Layout' is not imported AND used>");
    // GREEN twin, minimal diff: the SAME seed with the path handed to a real LOAD instead of readFileSync passes —
    // so the RED above is the load rule, not an incidental property of the seed
    const named = `${layout}/latest/test/DeclaredReadAsTextNamed.test.ts`;
    const twin = new TestPlacement().init().seed(named.replace('Named', 'Loaded'), readNamed.replace('readFileSync(', 'await import('));
    expect(twin.homeOf(named.replace('Named', 'Loaded'))).toBe(layout);
    // GREEN: the child-script form (MirrorDisk, M1GraphNoSourceRead) — the class is loaded AND used inside the SAME literal
    const script = new TestPlacement()
      .init()
      .seed(`${layout}/latest/test/DeclaredByScript.test.ts`, "// test-subject: M1Layout\nconst child = `const { M1Layout } = await import('/r/EAMD.ucp/Components/com/ceruleanCircle/Web4MDA/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.ts'); new M1Layout();`;\n");
    expect(script.homeOf(`${layout}/latest/test/DeclaredByScript.test.ts`)).toBe(layout);
  });

  it('a class name held by TWO components is RED — never resolved first-wins (seed -> RED)', () => {
    const placement = new TestPlacement().init().seed(`${PACKAGE}/MOF/M1/M1Graph/latest/src/ts/EAM/layer2/M1Layout.ts`, 'export class M1Layout {}\n');
    expect(placement.duplicates).toEqual([`M1Layout: ${PACKAGE}/MOF/M1/M1Graph, ${PACKAGE}/MOF/M1/M1Layout`]);
    expect(placement.homeOf(`${PACKAGE}/MOF/M1/M1Layout/latest/test/M1Layout.test.ts`)).toBe("<class 'M1Layout' is declared in 2 components — not unique>");
  });

  it('gate (c) RATCHET: the components with src/ but no test EQUAL the baseline — a new gap is RED, a closed gap forces lowering it', () => {
    const untested = new TestPlacement().init().untested;
    console.info(`H5m gate (c) — ${untested.length} component(s) with src/ but no test:\n  ${untested.join('\n  ')}`);
    expect(untested).toEqual(UNTESTED_BASELINE);
    // failable both ways: a NEW component with src and no test grows the list; a test for a baseline component shrinks it
    const grown = new TestPlacement().init().seed(`${PACKAGE}/Seeded/latest/src/ts/EAM/layer2/Seeded.ts`, 'export class Seeded {}\n').untested;
    expect(grown).toEqual([...UNTESTED_BASELINE, 'Seeded'].sort());
    const closed = new TestPlacement()
      .init()
      .seed(`${PACKAGE}/NpmDependency/latest/test/NpmDependency.test.ts`, "import { NpmDependency } from '../src/ts/EAM/layer2/NpmDependency.js';\nnew NpmDependency();\n").untested;
    expect(closed).toEqual(UNTESTED_BASELINE.filter((c) => c !== 'NpmDependency'));
  });
});

/**
 * H5m-3: the component whose behaviour a test's ASSERTIONS check. Each `expect(…)` argument is credited to every component
 * it reads: an imported name → its component's `src/`, a local built from such names inherits it (fixpoint). Pure TOOL
 * helpers — Scratch (fixture paths), Child (process runner), Generated and Source (file readers), TrackedTree (tracked-file list reader) — are no subject unless
 * the test is NAMED after them; other test helpers count as test-support subjects ('test-support:<Helper>').
 */
class AssertionSubject {
  static readonly TOOLS = ['Scratch', 'Child', 'Generated', 'Source', 'TrackedTree']; // TrackedTree: the ONE tracked-list reader (oopPO U4) — the reads it took over were Child's, a tool; still judged as the subject of its own test
  private counts = new Map<string, number>();
  private name = '';
  constructor() {}

  /** `path` = repo-relative test path (real or as-if, for a seed); `text` defaults to the file on disk. */
  init(path: string, text: string = readFileSync(path, 'utf8')): this {
    this.name = path.split('/').pop()?.replace(/\.test\.ts$/, '') ?? '';
    const imports = /^import\s+(?:type\s+)?\{([^}]*)\}\s+from\s+'(\.[^']+)';/gm;
    const body = new CodeText().init(text.replace(imports, '')).stripped(); // literals never credit (seeds a/b/c below)
    const names = new Map<string, string>();
    for (const m of text.matchAll(imports)) {
      const target = normalize(`${dirname(path)}/${m[2] ?? ''}`);
      const owner = target.includes('/latest/src/')
        ? relative(PACKAGE, target.split('/latest/src/')[0] ?? '') || 'Web4MDA'
        : target.includes('/latest/test/')
          ? `test-support:${(target.split('/').pop() ?? '').replace(/\.js$/, '')}`
          : ''; // outside every component (a script): no subject
      for (const n of (m[1] ?? '').split(',').map((x) => x.trim()).filter((x) => x !== '')) names.set(n.replace(/^type\s+/, '').split(' as ').pop()?.trim() ?? n, owner);
    }
    for (let round = 0; round < 4; round++) {
      for (const m of body.matchAll(/(?:const|let|this\.)\s*(\w+)\s*(?::[^=]+)?=\s*([^;\n]+)/g)) {
        const v = m[1] ?? '';
        if (names.has(v)) continue;
        const hits = [...(m[2] ?? '').matchAll(/[A-Za-z_$][\w$]*/g)].map((t) => names.get(t[0])).filter((o): o is string => o !== undefined);
        if (hits.length > 0) names.set(v, hits.sort((x, y) => hits.filter((h) => h === y).length - hits.filter((h) => h === x).length)[0] ?? '');
      }
    }
    for (const arg of this.expectArgs(body)) {
      const seen = new Set([...arg.matchAll(/[A-Za-z_$][\w$]*/g)].map((t) => names.get(t[0])).filter((o): o is string => o !== undefined));
      for (const o of seen) if (o !== '' && !this.isTool(o)) this.counts.set(o, (this.counts.get(o) ?? 0) + 1);
    }
    return this;
  }

  private isTool(owner: string): boolean {
    const helper = owner.startsWith('test-support:') ? owner.slice('test-support:'.length) : '';
    return AssertionSubject.TOOLS.includes(helper) && !this.name.includes(helper);
  }

  private expectArgs(body: string): string[] {
    const out: string[] = [];
    for (let i = body.indexOf('expect('); i >= 0; i = body.indexOf('expect(', i + 1)) {
      let depth = 1;
      let k = i + 7;
      for (; k < body.length && depth > 0; k++) depth += body[k] === '(' ? 1 : body[k] === ')' ? -1 : 0;
      out.push(body.slice(i + 7, k - 1));
    }
    return out;
  }

  /** Attributed assertions per subject. */
  get attribution(): Map<string, number> {
    return this.counts;
  }

  /** The verdict for a test sitting in Web4MDA/latest/test: 'A', 'test-support', or 'FOREIGN <component>' (RED). */
  get verdict(): string {
    const own = this.counts.get('Web4MDA') ?? 0;
    const entries = [...this.counts.entries()];
    const helper = entries.filter(([k]) => k.startsWith('test-support:') && this.name.includes(k.split(':')[1] ?? '')).reduce((m, [, v]) => Math.max(m, v), 0);
    const foreign = entries.filter(([k]) => k !== 'Web4MDA' && !k.startsWith('test-support:')).sort((x, y) => y[1] - x[1])[0];
    if (foreign !== undefined && foreign[1] > 2 && foreign[1] >= own && foreign[1] >= helper) return `FOREIGN ${foreign[0]}`;
    const strongest = Math.max(0, ...entries.map(([, v]) => v));
    if (strongest <= 2 || helper >= strongest) return 'test-support';
    return 'A';
  }
}

describe('H5m-3 — a test stays in Web4MDA/latest/test ONLY as A or derived test-support (subject by ASSERTIONS)', () => {
  const tests = readdirSync(`${PACKAGE}/latest/test`).filter((f) => f.endsWith('.test.ts')).sort();
  const header = (/^ \* TEST-SUPPORT \(derived, gated == below\): (.*)$/m.exec(readFileSync(`${PACKAGE}/latest/test/TestPlacement.test.ts`, 'utf8'))?.[1] ?? '').split(', ');
  const declares = (f: string): boolean => /^\/\/ test-subject: \w+/m.test(readFileSync(`${PACKAGE}/latest/test/${f}`, 'utf8'));

  it('no central test asserts ANOTHER component strongly (>2); the derived test-support set EQUALS the header list', () => {
    expect(tests.length).toBeGreaterThan(20); // the scan saw the folder
    const verdicts = tests.map((f) => [f.replace(/\.test\.ts$/, ''), declares(f) ? 'A' : new AssertionSubject().init(`${PACKAGE}/latest/test/${f}`).verdict] as const);
    expect(verdicts.filter(([, v]) => v.startsWith('FOREIGN'))).toEqual([]);
    expect(verdicts.filter(([, v]) => v === 'test-support').map(([n]) => n)).toEqual([...header].sort());
    expect(verdicts.filter(([, v]) => v === 'A').length).toBeGreaterThan(0);
  });

  it('failable, seed 1: a test in Web4MDA/latest/test that asserts M1Catalog behaviour is RED (FOREIGN); without it GREEN', () => {
    const as = `${PACKAGE}/latest/test/SeedForeign.test.ts`;
    const text = "import { expect, it } from 'vitest';\nimport { M1Catalog } from '../../MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';\nit('x', () => {\n  const catalog = new M1Catalog().init();\n  expect(catalog.classes().length).toBeGreaterThan(0);\n  expect(catalog.scratchFolder).toBe('test/gen');\n  expect(catalog.isScratch('a/latest/test/gen')).toBe(true);\n});\n";
    expect(new AssertionSubject().init(as, text).verdict).toBe('FOREIGN MOF/M1/M1Catalog'); // seed -> RED
    expect(new AssertionSubject().init(as, text.replace(/\n {2}expect\(catalog\.(scratchFolder|isScratch)[^\n]*/g, '')).verdict).toBe('test-support'); // reverted to 1 assertion -> GREEN
  });

  it('failable, seed 2: a test MARKED // test-support: that strongly asserts another component is still RED — the marker never exempts', () => {
    const as = `${PACKAGE}/latest/test/SeedMarked.test.ts`;
    const text = "// test-support: a self-declared exemption\nimport { expect, it } from 'vitest';\nimport { M1Catalog } from '../../MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';\nit('x', () => {\n  const catalog = new M1Catalog().init();\n  expect(catalog.classes().length).toBeGreaterThan(0);\n  expect(catalog.scratchFolder).toBe('test/gen');\n  expect(catalog.isScratch('a/latest/test/gen')).toBe(true);\n});\n";
    expect(new AssertionSubject().init(as, text).verdict).toBe('FOREIGN MOF/M1/M1Catalog'); // marker present, still RED
    expect(new AssertionSubject().init(as, text.replace(/\n {2}expect\(catalog\.(scratchFolder|isScratch)[^\n]*/g, '')).verdict).toBe('test-support'); // the assertions, not the marker, decide
  });
});

describe('AssertionSubject credits CODE only — string, template and regex literals never credit a subject (oopPO, hole found in R2 s2)', () => {
  const as = `${PACKAGE}/latest/test/SeedLiterals.test.ts`;
  const imp = "import { expect, it } from 'vitest';\nimport { M1Catalog } from '../../MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';\n";
  const credit = (text: string): number => new AssertionSubject().init(as, text).attribution.get('MOF/M1/M1Catalog') ?? 0;

  it('seed (a): a subject variable named only inside assertion MESSAGES (string, double-quoted, template) is NOT credited', () => {
    expect(credit(`${imp}it('x', () => {\n  const a = new M1Catalog().init();\n  void a;\n  expect(1, 'a a a').toBe(1);\n  expect(2, "a").toBe(2);\n  expect(3, \`a\`).toBe(3);\n});\n`)).toBe(0);
  });

  it('seed (b): a variable whose STRING VALUE holds an imported name is NOT typed by it', () => {
    expect(credit(`${imp}it('x', () => {\n  const label = 'M1Catalog';\n  expect(label).toBe('x');\n});\n`)).toBe(0);
  });

  it('seed (c): a REGEX LITERAL inside an assertion does not credit a same-named variable', () => {
    expect(credit(`${imp}it('x', () => {\n  const a = new M1Catalog().init();\n  void a;\n  expect(/a/.test('b')).toBe(false);\n});\n`)).toBe(0);
  });

  it('control: a REAL use in assertion code IS credited (stripping removes literals, never code)', () => {
    expect(credit(`${imp}it('x', () => {\n  const a = new M1Catalog().init();\n  expect(a.classes().length, 'a real use').toBeGreaterThan(0);\n});\n`)).toBe(1);
  });
});

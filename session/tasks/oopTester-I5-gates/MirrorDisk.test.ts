import * as Child from 'node:child_process';
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/**
 * oopTester I5b gate (oopPO order): the I5b fix keeps a PERSISTED MIRROR in memory (`M1Catalog.persisted`) that load() never
 * drops — an ESM-cache workaround. It is correct ONLY while mirror == disk. If a model source changes ON DISK outside persist()
 * (a `git checkout` of the Definition), the next load() must answer the DISK, not the mirror; serving the mirror is a second
 * store again. Runs in a SCRATCH clone of the committed tree, in a CHILD process (a gate never writes the served tree).
 */
class Scratch {
  private root = '';
  constructor() {}
  init(): this {
    this.root = mkdtempSync(`${tmpdir()}/web4mda-mirror-`);
    Child.execFileSync('git', ['clone', '-q', '--no-hardlinks', process.cwd(), this.root]);
    symlinkSync(`${process.cwd()}/node_modules`, `${this.root}/node_modules`);
    writeFileSync(`${this.root}/.git/info/exclude`, 'node_modules\nmirror-driver.tmp.ts\n');
    return this;
  }
  /** persist an edit, restore the Definition ON DISK outside persist(), load() again: what does the catalog serve? */
  probe(subject: string, foreign: string): { stored: string; persisted: string; disk: string; served: string } {
    const driver = `${this.root}/mirror-driver.tmp.ts`;
    writeFileSync(
      driver,
      [
        "import { execFileSync } from 'node:child_process';",
        "import { readFileSync } from 'node:fs';",
        "const W = './EAMD.ucp/Components/com/ceruleanCircle/Web4MDA';",
        'const { M1Catalog } = await import(`${W}/MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js`);',
        'const { M1Layout } = await import(`${W}/MOF/M1/M1Layout/latest/src/ts/EAM/layer2/M1Layout.js`);',
        'await M1Catalog.load();',
        'const catalog = new M1Catalog().init();',
        'await M1Layout.load(catalog); // persist() lays the home out (as the move driver does)',
        `const stored = catalog.classNamed('${subject}').namespace;`,
        `const path = catalog.foundAt('${subject}');`,
        `const model = catalog.storedModel('${subject}');`,
        `model.namespace = '${foreign}';`,
        'await catalog.persist(model); // mirror AND disk now say foreign',
        "const persisted = /^      namespace: '([^']*)',$/m.exec(readFileSync(path, 'utf8'))?.[1] ?? '?';",
        "execFileSync('git', ['checkout', '--', path]); // the disk changes OUTSIDE persist()",
        "const disk = /^      namespace: '([^']*)',$/m.exec(readFileSync(path, 'utf8'))?.[1] ?? '?';",
        'await M1Catalog.load();',
        `const served = new M1Catalog().init().classNamed('${subject}').namespace;`,
        'console.log(JSON.stringify({ stored, persisted, disk, served }));',
      ].join('\n'),
    );
    try {
      return JSON.parse(Child.execFileSync('npx', ['tsx', driver], { cwd: this.root, encoding: 'utf8' }).trim().split('\n').pop() ?? '{}');
    } finally {
      rmSync(driver, { force: true });
    }
  }
  drop(): void {
    rmSync(this.root, { recursive: true, force: true });
  }
}

describe('ONE STORE (I5b): the persisted mirror never outlives the disk — load() answers the DISK', () => {
  const scratch = new Scratch();
  beforeAll(() => {
    scratch.init();
  });
  afterAll(() => scratch.drop());

  it('a Definition changed ON DISK outside persist() is what the next load() serves — never the stale mirror', () => {
    const { stored, persisted, disk, served } = scratch.probe('NameUuid', 'Web4MDA.Ior');
    expect(persisted, 'non-vacuous: persist() wrote the foreign namespace to disk').toBe('Web4MDA.Ior');
    expect(disk, 'non-vacuous: the checkout restored the disk to the stored value').toBe(stored);
    expect(served, 'load() must answer the DISK, not the persisted mirror').toBe(disk);
  });
});

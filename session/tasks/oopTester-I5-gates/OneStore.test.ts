import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { M1Catalog } from '../src/ts/EAM/layer2/M1Catalog.js';

/**
 * oopTester I5 gate (oopPO order, oopExpert FINDING): M1Catalog keeps STORED models IN HAND (`M1Catalog.edits`) so a state
 * change is SEEN by classes() and every layout in-process. That is a second store by the back door UNLESS every in-hand edit
 * either REACHES the ONE stored model (`persist` -> its Definition, the path move() takes) or DIES at load — and generate
 * renders ONLY the store. A test never writes the real component tree: the render goes to a tmp root.
 *
 * INSTRUMENT RULES (oopTester, I5 re-verification): `load()` is idempotent per process, so an in-hand edit cannot be reset
 * between arms — each arm therefore uses its OWN class and reads the STORED value BEFORE it edits anything (an arm that read
 * after another arm's edit compared FOREIGN with FOREIGN = hollow). `src/ts` is a HELD language, never rendered: the render
 * arm reads the generated `.class.ts` (thinglish.ts) artifact.
 */
describe('ONE STORE (spec: one store, no second store) — an in-hand model edit reaches the stored model or dies at load', () => {
  const FOREIGN = 'Web4MDA.Ior'; // a namespace none of the three subjects has in the store
  let root = '';

  beforeAll(async () => {
    await M1Catalog.load();
    root = mkdtempSync(`${tmpdir()}/web4mda-onestore-`);
  });
  afterAll(() => {
    rmSync(root, { recursive: true, force: true });
  });

  it('non-vacuous: the mechanism EXISTS — an in-hand edit of the stored model is SEEN by a fresh catalog in-process', () => {
    const SUBJECT = 'Defaults';
    const stored = new M1Catalog().init().classNamed(SUBJECT).namespace;
    expect(stored, 'the stored value differs from the seed value').not.toBe(FOREIGN);
    new M1Catalog().init().storedModel(SUBJECT).namespace = FOREIGN; // edited IN HAND, NOT persisted
    expect(new M1Catalog().init().classNamed(SUBJECT).namespace, 'the edit is held in hand').toBe(FOREIGN);
  });

  it('an in-hand edit that is NOT persisted DIES at load — the catalog answers the STORED model again', async () => {
    const SUBJECT = 'Process';
    const stored = new M1Catalog().init().classNamed(SUBJECT).namespace; // read BEFORE any edit of this class
    expect(stored, 'non-vacuous: the stored value differs from the seed value').not.toBe(FOREIGN);
    new M1Catalog().init().storedModel(SUBJECT).namespace = FOREIGN;
    await M1Catalog.load();
    expect(new M1Catalog().init().classNamed(SUBJECT).namespace, 'load() must drop the unpersisted edit').toBe(stored);
  });

  it('generate renders ONLY the store: an unpersisted in-hand namespace edit does not reach the rendered output', async () => {
    const SUBJECT = 'NameUuid';
    const stored = new M1Catalog().init().classNamed(SUBJECT).namespace; // read BEFORE any edit of this class
    expect(stored, 'non-vacuous: the stored value differs from the seed value').not.toBe(FOREIGN);
    const catalog = new M1Catalog().init();
    catalog.storedModel(SUBJECT).namespace = FOREIGN; // in hand, NOT persisted — if it leaked, the class would render under Ior/
    const written = await catalog.generate(root);
    const mine = written.filter((p) => p.endsWith(`/${SUBJECT}.class.ts`));
    expect(mine.length, `non-vacuous: ${SUBJECT}.class.ts is rendered`).toBe(1);
    expect(mine.filter((p) => p.includes('/Ior/')), 'the in-hand edit must NOT be rendered').toEqual([]);
  });
});

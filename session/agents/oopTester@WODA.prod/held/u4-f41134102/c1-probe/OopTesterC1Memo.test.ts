import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { Defaults } from '../src/ts/EAM/layer2/Defaults.js';
import { FileModel } from '../src/ts/EAM/layer3/FileModel.js';
import { M1Catalog } from '../../MOF/M1/M1Catalog/latest/src/ts/EAM/layer2/M1Catalog.js';

// oopTester U4 C.1 scratch probe (seed clone c2 only, never committed). OOPT_SEED=poison proves the probe can go RED.
const fresh = (n: string): string => n.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
const names = (): string[] => new M1Catalog().init().classes().map((c) => c.name);
if (process.env['OOPT_SEED'] === 'poison') (Defaults as unknown as { displayNames: Map<string, string> }).displayNames.set('GoogleMapModel', 'POISON');

describe('C.1 memo staleness (Defaults.displayNameOf)', () => {
  it('C1a — a model whose displayName is changed after a first read returns the change on the next read', () => {
    const f = new FileModel().init({ name: 'GoogleMapModel' });
    expect(f.displayName).toBe('Google Map Model');
    f.displayName = 'Changed After Read';
    expect(f.displayName).toBe('Changed After Read');
    expect(new FileModel().init({ name: 'GoogleMapModel' }).displayName).toBe('Google Map Model');
  });

  it('C1b — memo value == fresh derivation for every catalogued class name, before AND after re-creating the catalog', () => {
    const first = names();
    expect(first.length).toBeGreaterThan(50);
    for (const n of first) expect(Defaults.displayNameOf(n), n).toBe(fresh(n));
    const second = names();
    for (const n of second) expect(Defaults.displayNameOf(n), n).toBe(fresh(n));
    expect(Defaults.displayNameOf('GoogleMapModel')).toBe(fresh('GoogleMapModel'));
  });

  it('C1c — two models with the same key do not cross-talk', () => {
    const a = new FileModel().init({ name: 'SameKeyModel' });
    const b = new FileModel().init({ name: 'SameKeyModel' });
    a.displayName = 'Only A';
    expect([a.displayName, b.displayName, Defaults.displayNameOf('SameKeyModel')]).toEqual(['Only A', 'Same Key Model', 'Same Key Model']);
  });

  it('C1d — DERIVED writer scan over EVERY component src: the private memo map is written only inside Defaults.displayNameOf', () => {
    const root = new URL('../../../../../', import.meta.url).pathname.replace(/\/$/, ''); // EAMD.ucp/Components — EVERY component
    const files: string[] = [];
    const walk = (d: string): void => {
      for (const e of readdirSync(d)) {
        const p = join(d, e);
        if (e === 'node_modules' || p.endsWith('/test/gen')) continue;
        if (statSync(p).isDirectory()) walk(p);
        else if (p.endsWith('.ts') && p.includes('/src/')) files.push(p);
      }
    };
    walk(root);
    expect(files.length).toBe(230); // measured independently: find … -path '*/src/*' -name '*.ts' (node_modules, test/gen pruned)
    const writers = files.flatMap((p) => readFileSync(p, 'utf8').split('\n').map((l, i) => [p, i + 1, l] as const)).filter(([, , l]) => /displayNames\.(set|delete|clear)\(/.test(l));
    expect(writers.map(([p, i]) => `${p.slice(root.length)}:${i}`).sort()).toEqual(['/com/ceruleanCircle/Web4MDA/latest/src/thinglish.ts/EAM/layer2/Defaults.class.ts:21', '/com/ceruleanCircle/Web4MDA/latest/src/ts/EAM/layer2/Defaults.ts:30']);
  });
});

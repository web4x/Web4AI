#!/usr/bin/env node
// GUARD (correct-by-construction) for the auto-memory INDEX.
//
// WHY THIS EXISTS (oopPO, 2026-09-28): a one-time trim of MEMORY.md against a hard
// read limit ALWAYS drifts back, because the index grows by one line on every memory
// write. The trainer trimmed it under the limit and its OWN next 11 writes pushed it
// back over (24,465 B = 65 over). The defect was never the size — it was that the
// repair had NO GUARD. So this FAILS (exit 1) instead of warning.
//
// HAZARDS CHECKED:
//   1. SIZE  — index over the auto-load read limit => everything past the cut is
//              SILENTLY DROPPED on every agent boot (tail laws load as if absent).
//   2. DANGLING — a pointer that resolves to no file on disk = a capability the
//              index claims but cannot deliver (oopPO's stronger test).
//
// Usage: node session/tools/lint-memory-index.mjs [--target]
//        --target also enforces the HEADROOM target, not just the hard limit.

import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const INDEX = '/root/.claude/projects/-var-dev-Workspaces-AI-Claude/memory/MEMORY.md';
const LIMIT = 24400;   // hard auto-load read limit (bytes) — past this is dropped
const TARGET = 17100;  // headroom target; growth budget for future writes
const enforceTarget = process.argv.includes('--target');

if (!existsSync(INDEX)) {
  console.log(`SKIP — no index at ${INDEX} on this host (scoped N/A with its reason).`);
  process.exit(0);
}

const bytes = statSync(INDEX).size;
const src = readFileSync(INDEX, 'utf8');
const base = dirname(INDEX);

// every markdown pointer must resolve to a real file
const dangling = [];
let seen = 0;
for (const m of src.matchAll(/\]\(([^)]+)\)/g)) {
  const target = m[1].trim();
  if (/^[a-z][a-z0-9+.-]*:/i.test(target) || target.startsWith('#')) continue; // url/anchor
  seen++;
  if (!existsSync(resolve(base, target))) dangling.push(target);
}

let hazard = 0;
console.log('=== auto-memory INDEX guard ===');
console.log(`size: ${bytes} B   hard-limit: ${LIMIT} B   headroom-target: ${TARGET} B`);
console.log(`pointers checked: ${seen}   dangling: ${dangling.length}`);

if (bytes > LIMIT) {
  console.log(`HAZARD/SIZE: ${bytes - LIMIT} B OVER the hard limit — the tail of the index`);
  console.log('  is SILENTLY DROPPED on every boot. Trim now (one line per entry;');
  console.log('  move detail into topic files; merge or drop stale entries).');
  hazard++;
} else if (enforceTarget && bytes > TARGET) {
  console.log(`HAZARD/HEADROOM: ${bytes - TARGET} B over the ${TARGET} B target — under the`);
  console.log('  hard limit, but with no growth budget, so the next writes re-breach it.');
  hazard++;
} else {
  console.log(`OK/SIZE: ${LIMIT - bytes} B of headroom under the hard limit.`);
}

if (dangling.length) {
  console.log('HAZARD/DANGLING: pointers that resolve to no file on disk:');
  for (const d of dangling) console.log(`  - ${d}`);
  hazard++;
} else {
  console.log('OK/POINTERS: every pointer resolves to a real file.');
}

console.log(hazard ? `\nRED — ${hazard} hazard(s).` : '\nGREEN — index is loadable in full and every pointer resolves.');
process.exit(hazard ? 1 : 0);

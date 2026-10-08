#!/usr/bin/env node
// GUARD (correct-by-construction) for the auto-memory INDEX.
//
// WHY A GUARD AND NOT A TRIM (oopPO, 2026-09-28): a one-time trim of MEMORY.md against a
// hard read limit ALWAYS drifts back, because the index grows a line per memory write. The
// trainer trimmed it under the limit and its OWN next 11 writes pushed it back over (65 B).
// The defect was never the size — it was that the repair had NO GUARD. So this FAILS (exit 1).
//
// ★★ A VERIFIER MUST REPORT ITS OWN COVERAGE (oopPO's law, earned the hard way 2026-09-28).
// Its dangling-check SKIPPED every absolute/dot-dot pointer. That excluded exactly 1 of 261 —
// and the excluded one was the broken entry. So "0 dangling" was computed over 260 and handed
// over as the STRONGER test: not a false negative from a bad pattern but FALSE BY CONSTRUCTION.
// A SKIP IN A GATE IS A SILENT SCOPE REDUCTION, and when the excluded class is where the defect
// lives, THE PASS IS VACUOUS — while wearing the clothes of rigour. A gate that reports only
// FINDINGS cannot distinguish NOTHING-BROKEN from NOTHING-EXAMINED. Hence: print
// CHECKED / SKIPPED / TOTAL always, name every skip, and count a skip against coverage.
// (This guard had the same latent defect — an unreported url/anchor skip. Fixed here.)
//
// HAZARDS CHECKED:
//   1. SIZE       — over the auto-load limit => the index TAIL is SILENTLY DROPPED every boot.
//   2. DANGLING   — a pointer resolving to no file = a capability the index claims but cannot deliver.
//   3. TRUNCATION — a title ending in a dangling function word. Phase-1 survival condition 2:
//                   committed-but-UNRECALLABLE is INERT, so a truncated title degrades the ONE
//                   function an index has. Mechanical, therefore guardable (oopPO ruling).
//
// Usage: node session/tools/lint-memory-index.mjs [--target]

import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const INDEX = '/tmp/claude-0/-var-dev-Workspaces-AI-Claude/20946951-9663-424f-b432-8919a9306d46/scratchpad/MEMORY.slim.md';
const LIMIT = 24400;   // hard auto-load read limit (bytes) — past this is dropped
const TARGET = 17100;  // headroom target; growth budget for future writes
const enforceTarget = process.argv.includes('--target');

// a title ending in one of these is a TRUNCATION, not a title
const DANGLING_ENDERS = new Set(['the','a','an','of','to','for','from','with','and','or','in',
  'on','at','by','via','as','that','when','while','if','into','onto','per','vs','not','its',
  'their','our','your','than','but','so','because','after','before','over','under','about']);

if (!existsSync(INDEX)) {
  console.log(`SKIP — no index at ${INDEX} on this host (scoped N/A with its reason).`);
  process.exit(0);
}

const bytes = statSync(INDEX).size;
const src = readFileSync(INDEX, 'utf8');
const base = '/root/.claude/projects/-var-dev-Workspaces-AI-Claude/memory';

let total = 0, checked = 0;
const skipped = [];      // every skip is NAMED — never silent
const dangling = [];
const truncated = [];

for (const m of src.matchAll(/\[([^\]]*)\]\(([^)]+)\)/g)) {
  total++;
  const title = m[1], target = m[2].trim();

  // --- dangling arm: NOTHING is skipped for being absolute or dot-dot (that was the defect) ---
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(target) || target.startsWith('#')) {
    skipped.push({ target, why: 'url/anchor — not a filesystem pointer' });
  } else {
    checked++;
    if (!existsSync(resolve(base, target))) dangling.push(target);
  }

  // --- truncation arm (word-boundary, oopPO-proved) ---
  // A bare ender-word list FALSE-POSITIVES: "…never a report after" is complete, while
  // "…DELETIONS before" is truncated — same ender. So CONFIRM BY A DIFFERENT METHOD: the
  // TARGET SLUG is an independent witness to the intended phrase. Truncated iff the slug
  // continues PAST that word (title stopped early) or does not contain it at all.
  const words = title.replace(/[^\p{L}\p{N}'’\s-]/gu, ' ').trim().split(/\s+/);
  const last = (words[words.length - 1] || '').toLowerCase();
  if (words.length > 1 && DANGLING_ENDERS.has(last)) {
    const slug = target.replace(/^.*\//, '').replace(/\.md$/, '').toLowerCase().split('-');
    const at = slug.lastIndexOf(last);
    const slugContinuesPast = at === -1 || at < slug.length - 1;
    if (slugContinuesPast) truncated.push({ title, target });
  }
}

let hazard = 0;
console.log('=== auto-memory INDEX guard ===');
console.log(`size: ${bytes} B   hard-limit: ${LIMIT} B   headroom-target: ${TARGET} B`);
console.log(`COVERAGE — pointers TOTAL: ${total}   CHECKED: ${checked}   SKIPPED: ${skipped.length}`);
for (const s of skipped) console.log(`   skipped: ${s.target}  (${s.why})`);
if (!skipped.length) console.log('   skipped: none — coverage is complete, no excluded class');

if (bytes > LIMIT) {
  console.log(`HAZARD/SIZE: ${bytes - LIMIT} B OVER the hard limit — the index TAIL is SILENTLY`);
  console.log('  DROPPED on every boot. Trim: one line per entry, detail into topic files, merge dupes.');
  hazard++;
} else if (enforceTarget && bytes > TARGET) {
  console.log(`HAZARD/HEADROOM: ${bytes - TARGET} B over the ${TARGET} B target — under the hard`);
  console.log('  limit but with no growth budget, so the next writes re-breach it.');
  hazard++;
} else {
  console.log(`OK/SIZE: ${LIMIT - bytes} B of headroom under the hard limit.`);
}

if (dangling.length) {
  console.log(`HAZARD/DANGLING (${dangling.length}): pointers resolving to no file on disk:`);
  for (const d of dangling) console.log(`   - ${d}`);
  hazard++;
} else {
  console.log(`OK/POINTERS: all ${checked} checked pointers resolve to a real file.`);
}

if (truncated.length) {
  console.log(`HAZARD/TRUNCATION (${truncated.length}): titles ending in a dangling function word`);
  console.log('  — committed-but-UNRECALLABLE is INERT; a truncated title kills recall:');
  for (const t of truncated) console.log(`   - "${t.title}"  ->  ${t.target}`);
  hazard++;
} else {
  console.log('OK/RECALL: no title ends in a dangling function word.');
}

console.log(hazard ? `\nRED — ${hazard} hazard(s).`
                   : '\nGREEN — index loads in full, every checked pointer resolves, no truncated titles.');
process.exit(hazard ? 1 : 0);

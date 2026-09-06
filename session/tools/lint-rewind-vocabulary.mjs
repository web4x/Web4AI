#!/usr/bin/env node
// FAILABLE LINT — Tron standing law 2026-09-06: the word "cut" is BANNED for context-recovery; the term is REWIND (2-phase diligent).
// Scans the HAZARD (the word "cut" in the rewind/context-recovery sense), not a file list. Asserts 0 in the ENFORCED canon.
// Usage: node lint-rewind-vocabulary.mjs [--warn] [--self-test]   (exit 1 if ENFORCED count > 0)
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..'); // AI/Claude repo root

// ENFORCED canon = shared doctrine we keep at 0 (base-skills + every role SKILL).
const ENFORCED = [
  { dir: 'session/base-skills', match: f => f.endsWith('.md') },
  { dir: '.claude/agents', match: f => f.endsWith('/SKILL.md') || f.endsWith('SKILL.md') },
];
// WARN tier = agent-owned anchors/learnings (fixed per-agent on its own rewind; reported, not enforced-0 here).
const WARN = [{ dir: 'session/agents', match: f => f.endsWith('.md') }];

// HAZARD: whole-word "cut" + rewind-sense hyphen compounds (deep-cut, post-cut, cut-point, re-cut, mid-cut, cut-decision...).
// Word boundaries mean "shortcut"/"haircut"/"execute" never match. Whitelist genuinely-different senses.
const HAZARD = /(?<![\w-])(cut|cuts|cutting|cut-[a-z]+|[a-z]+-cut)(?![\w])/gi;
// ALLOWED: genuinely-different senses (NOT context-recovery), the NAMED/QUOTED banned term, and the ban statement itself.
const WHITELIST = /(cut (a|the|this|our|another) (release|tag|version|branch|deal)|cuts? both ways|cut corners?|clear-?cut|clean-?cut|cut off|cut over|["'`]cut["'`]|(calling it|the word|the term|stop .{0,20}calling|never say|banned[^.]{0,30}word)[^.]{0,20}cut)/i;
function hazardsInLine(line) {
  if (WHITELIST.test(line)) return [];
  const m = line.match(HAZARD);
  return m || [];
}
function scan(spec) {
  const out = [];
  const base = path.join(ROOT, spec.dir);
  if (!fs.existsSync(base)) return out;
  const walk = d => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else if (spec.match(p)) {
        const rel = path.relative(ROOT, p);
        let content;
        try { content = fs.readFileSync(p, 'utf8'); } catch { continue; } // skip broken symlinks / unreadable
        content.split('\n').forEach((ln, i) => { for (const h of hazardsInLine(ln)) out.push({ file: rel, line: i + 1, hit: h, text: ln.trim().slice(0, 100) }); });
      }
    }
  };
  walk(base);
  return out;
}

if (process.argv.includes('--self-test')) {
  // stub-must-fail: a rewind-sense "cut" MUST be flagged; a whitelisted sense MUST NOT.
  const bad = hazardsInLine('never deep-cut a walled agent first; cut at 80 is wrong').length;
  const ok = hazardsInLine('the release manager will cut a release on Friday').length;
  console.log('SELF-TEST: rewind-sense flagged =', bad, '(want >0);  whitelisted "cut a release" flagged =', ok, '(want 0)');
  process.exit(bad > 0 && ok === 0 ? 0 : 1);
}

const enforced = ENFORCED.flatMap(scan);
const warn = process.argv.includes('--warn') ? WARN.flatMap(scan) : [];
const byFile = {};
for (const h of enforced) byFile[h.file] = (byFile[h.file] || 0) + 1;
console.log('=== ENFORCED canon (base-skills + role SKILLs) — HAZARD must be 0 ===');
for (const f of Object.keys(byFile).sort((a, b) => byFile[b] - byFile[a])) console.log(`  ${String(byFile[f]).padStart(4)}  ${f}`);
console.log('ENFORCED total:', enforced.length);
if (warn.length !== undefined && process.argv.includes('--warn')) {
  const warnByFile = {};
  for (const h of warn) warnByFile[h.file] = (warnByFile[h.file] || 0) + 1;
  console.log('\n=== WARN tier (agent anchors/learnings — fixed per-agent on rewind) ===');
  console.log('WARN total:', warn.length, 'across', Object.keys(warnByFile).length, 'files');
}
if (enforced.length > 0) { console.log('\nRED — enforced canon still says "cut" in the rewind sense. Replace with REWIND.'); process.exit(1); }
console.log('\nGREEN — enforced canon is clean (0 rewind-sense "cut").');

// oopTester instrument (P2b' atomicity, NOT product code): log every fs MUTATION the generator performs,
// so "what is OUTPUT" is the generator's own behaviour, never a path pattern. Loaded via NODE_OPTIONS=--import.
// Env: FSW_LOG = log file (absolute), FSW_ROOT = repo root (absolute) — only paths below it are logged.
import fs from 'node:fs';
import path from 'node:path';
import { syncBuiltinESMExports } from 'node:module';

const LOG = process.env.FSW_LOG;
const ROOT = process.env.FSW_ROOT;
if (LOG && ROOT) {
  const append = fs.appendFileSync.bind(fs);
  const note = (op, p) => {
    if (p === undefined || p === null) return;
    const s = typeof p === 'string' ? p : p instanceof URL ? p.pathname : Buffer.isBuffer(p) ? p.toString() : null;
    if (s === null) return;
    const abs = path.resolve(s);
    if (abs !== LOG && abs.startsWith(ROOT + '/')) append(LOG, `${op}\t${abs.slice(ROOT.length + 1)}\n`);
  };
  const wrap = (obj, name, op, argIdx = [0]) => {
    const orig = obj[name];
    if (typeof orig !== 'function') return;
    obj[name] = function (...args) {
      for (const i of argIdx) note(op, args[i]);
      return orig.apply(this, args);
    };
  };
  for (const [name, op, idx] of [
    ['writeFileSync', 'write'], ['writeFile', 'write'], ['appendFileSync', 'write'], ['appendFile', 'write'],
    ['copyFileSync', 'write', [1]], ['copyFile', 'write', [1]], ['cpSync', 'write', [1]],
    ['renameSync', 'rename', [0, 1]], ['rename', 'rename', [0, 1]],
    ['unlinkSync', 'delete'], ['unlink', 'delete'], ['rmSync', 'delete'], ['rm', 'delete'], ['rmdirSync', 'delete'], ['rmdir', 'delete'],
    ['symlinkSync', 'link', [1]], ['symlink', 'link', [1]], ['linkSync', 'link', [1]], ['link', 'link', [1]],
    ['createWriteStream', 'write'],
  ]) wrap(fs, name, op, idx);
  for (const [name, op, idx] of [
    ['writeFile', 'write'], ['appendFile', 'write'], ['copyFile', 'write', [1]], ['cp', 'write', [1]],
    ['rename', 'rename', [0, 1]], ['unlink', 'delete'], ['rm', 'delete'], ['rmdir', 'delete'],
    ['symlink', 'link', [1]], ['link', 'link', [1]],
  ]) wrap(fs.promises, name, op, idx);
  syncBuiltinESMExports();
}

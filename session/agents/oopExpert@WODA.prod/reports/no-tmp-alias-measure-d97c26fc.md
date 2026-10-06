# Remove the `.tmp` alias by removing its CAUSE — measured in my own scratch (build nothing in the shared checkout)

*oopExpert, 2026-10-06, Web4MDA `d97c26fc`, per Tron (via oopPO): the repo-root `.tmp` symlink is forbidden — no aliases, symlinks, worktrees or scratch outside a component's `latest/test/gen`. Measured in a full `git clone` + `npm ci` inside `…/Web4MDA/latest/test/gen/oopExpert-tsx/` (no worktree, no symlink), removed after. Shared checkout untouched by me.*

## The cause, measured
- The `tsx` **CLI** (`npx tsx …`, `node_modules/.bin/tsx`) opens an IPC server at `<TMPDIR>/tsx-<uid>/<pid>.pipe` on every run (`get-pipe-path` + `createServer().listen()` in `tsx/dist/cli.mjs`). The scratch tmp's real path is 131 bytes in the repo (182 in the scratch copy), past the 108-byte `sun_path`.
- **libuv TRUNCATES** a long socket path instead of failing: kernel socket table during a CLI run showed the socket at `…/latest/test/gen/oopExpert-t` (108 bytes, cut mid-name) — NOT where tsx meant it. When the truncated prefix collides with an existing entry the listen fails (`EADDRINUSE` — the clone "flood" NoEscapeProbe recorded).
- The tsx **LOADER** (`node --import tsx …`) opens **no socket**: 0 new kernel socket paths during the same run.
- `find -type s` after a run sees nothing either way (sockets are unlinked at exit) — only the kernel table (`/proc/net/unix`) during the run is a valid instrument.

## The change (replayable: `patches/no-tmp-alias-loader.py` then `patches/no-tmp-alias-loader-GH.py`, `<repo root>` as argument)
- A `scripts/bootstrap.mjs`: no alias, no symlink; `TMPDIR` = the scratch tmp itself; Web4MDA runs via `process.execPath --import tsx`.
- B `Web4MDA.ts` (+ its model `Web4MDADefinition.ts`): each generate step `node --import tsx ${step}` (was `npx tsx`).
- C `M1Catalog`: `scratchAlias` removed; `isScratch` = the folder only.
- D `Scratch.tmp`: returns `<home>tmp` itself (no symlink).
- E `.gitignore`: `/.tmp` line removed.
- F `BootstrapScratch.test`: no-alias assertions (`.tmp` absent, run folder reached through no symlink, an alias line coming back in `.gitignore` is RED) + a **MECHANISM gate**: path sockets HELD BY THE CHILD'S OWN PID (fd → `socket:[inode]` → `/proc/net/unix`), polled spawn-to-exit: loader child = 0 sockets + exit 0; seed = the tsx CLI is SEEN (a truncated-path socket, or its listen failing). Skips visibly where `/proc/net/unix` is absent (macOS). (Instrument lessons on the way: a box-wide socket diff counted other processes; a single mid-run sample raced; the CLI's outcome is environment-dependent.)
- G probe usage comments → `node --import tsx`; NoEscapeProbe notes the confound's cause is removed. H TestFolder re-pins (Scratch.ts + 5 probes + self).
- I `Child.test` walker classifies by the path RELATIVE to its walk root (its seed root now lies, truthfully, under `…/latest/test/gen/tmp`).
- J the 6 tsc-seed configs that `extend` the repo tsconfig get their own `exclude: []` (the seed now lives at its real path, which the inherited `**/test/**` exclude hid → "no inputs").

## Results in the scratch copy
| | baseline clone `d97c26fc` (same depth) | changed copy |
|---|---|---|
| `npm start` | — | rc 0, **0 sockets** (sampler, 44 samples), **0 `.tmp`**, 0 symlinks outside gen |
| `npm test` | 24 failed / 27 skipped, 30 EADDRINUSE lines | **7 failed** / 2 skipped |
| failures ONLY in changed | — | **0** |
| failures common to both (location confound: a repo nested in a repo) | 7 | 7 (`patches/no-tmp-alias-common-fails.txt`) |
| baseline failures FIXED by the change | — | 17 |
| sockets during `npm test` | — | 1 = the gate's own CLI seed (intended) |

**Not yet measured: the real checkout.** In the repo itself the suite is green at `d97c26fc`; the 7 common failures exist only at the nested location. The build window's two full runs in the real repo are the green proof.

## Unrelated, seen, untouched
The shared checkout had `Web4MDA.ts` modified at 17:18 (a reformat of the generate-step list) — not mine (my scripts only ever wrote the copy); left for its owner.

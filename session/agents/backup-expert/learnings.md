# backup expert Learnings

## Self-Awareness (2026-03-09, corrected after pane.get.target bug fix)
- **Pane address**: `backupTeam:0.0`
- **Session UUID**: `124ac722-ac97-40eb-b3d7-5642a17d4d5d`
- Both change on restart/compact — re-discover every boot via `otmux pane.get.target` and `claudeCode session.id <pane>`
- **Bug note**: First run returned `backupTeam:0.2` (focused pane, not caller pane). Fixed in otmux — always re-verify after fixes.

## Bug Fixes (2026-03-09, commit 743b6e5)
- **Bug #1**: `config.create` concatenated `targetBase + pwd` for ALL targets — wrong for local paths (double-path). Fix: detect `@` → remote keeps concatenation, local uses path as-is.
- **Bug #2**: `backup.run` rsync copied `.backup.env` to target. Fix: added `--exclude .backup.env` to rsync command.
- **camelCase rename**: `target_path` → `targetPath`, `target_base` → `targetBase`, `remote_host` → `remoteHost`, `remote_path` → `remotePath` — per OOSH naming convention.
- All 13 tests PASS (test/test.backup). Tester verified both pre- and post-commit.
- **sed escaping bug**: Used `|` as delimiter but escaped `/` — `\/` won't match literal `/`. Fix: escape `&` and `|` only when using `|` delimiter.

## Achievement: Backup Config Lifecycle (2026-03-09)
- 17/17 tests PASS — full config lifecycle coverage
- 3 bugs found and fixed (config.create double-path, .backup.env sync, sed escaping)
- New method: `config.repair` for fixing legacy double-path configs
- TDD cycle with backup-tester worked perfectly — parallel development, tester wrote tests while expert fixed code

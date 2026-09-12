# Base Skill: Git Safety (MANDATORY — every agent that runs git on real code)

DRY single source. SKILLs that touch code LINK here — do not re-paste the rules.

## ★ T-NO-CHECKOUT-REF — inspect an old version with `git show`, NEVER `git checkout <ref> -- file`

**To read/compare a PAST version of a file, use `git show`:**
```bash
git show <ref>:path/to/file          # print the file AS OF <ref> to stdout (READ-ONLY)
git show HEAD~3:src/ts/server/server.ts
git diff <ref> -- path/to/file       # compare working tree to <ref> (READ-ONLY)
```

**NEVER `git checkout <ref> -- file` to "look at" an old version.** It does NOT print — it **OVERWRITES the working-tree file with the old version** and leaves it **uncommitted/dirty**. On a served/deployed repo that is a **silent gutting**: it happened **3×** (banned landmine) — once it reverted the entire R32.5/R32.9/R32.11/R33 server stack (`server.ts` −270/+16) pre-R32.5; only the INV-V3 git-clean guard caught it pre-deploy, and the architect had to recover (v0.8.22). "checkout -- " = restore/mutate, not inspect.

| Want to… | ✗ BANNED (mutates working tree) | ✓ USE (read-only) |
|----------|--------------------------------|-------------------|
| See file at an old ref | `git checkout <ref> -- file` | `git show <ref>:file` |
| Diff vs an old ref | (checkout then diff) | `git diff <ref> -- file` |
| Restore a file on purpose | `git checkout <ref> -- file` (only when you MEAN to overwrite + will commit) | `git restore --source=<ref> file` + commit |

**Guard:** after ANY git op on a served repo, `git status --short` must be clean of unintended changes (INV-V3). If `checkout -- ` slipped, `git restore --source=HEAD <file>` to undo, then re-inspect with `git show`.

## Related git-safety rules (link, don't duplicate)
- **`git add` explicit paths, never `-A` (and never `git add scenario/`)** — shared multi-agent shells hold others' STAGED work — so **path-limited commit directly: `git commit -m MSG -- <your/paths>`** (commits only the named paths, IGNORES the index, does NOT ride or disturb peers' staging); verify `git show --stat` = only your files. **NEVER `git reset HEAD` on a shared tree** — it unstages peers' in-flight work (5 agents wipe each other); reset is safe ONLY in a private tree. **PII TEETH (Web4RawBin): `scenario/` has NO gitignore and carries real user PII — Profiles + private Messages — so a broad add COMMITS + PUSHES PII.** A driver's STEP-0 (full-commit-before-picker, across all 3 trees) **LEAVES RawBin runtime/PII dirt untouched — it never commits it**, only the named agent/session files it means to protect. (Policy fix: R40.47.)
- **COMMITTED ≠ DELIVERED; PUSHED = DELIVERED — `git push` after EVERY increment** (Tron ruling 2026-09-11). A commit sits only in the local shared tree; the work is not delivered until it is on origin. **Push HEAD, not a hardcoded branch** (`git push` / `git push origin HEAD`) — aiming `main` while on a feature/hotfix branch (e.g. `hotfix/t40.1-checklist-band`) causes a FALSE push-blocked escalation. **On push-fail: report the EXACT error, try the ONE obvious variant** (set upstream `-u`, or merge origin first — merge only, never rebase), **then STOP — do NOT silent-retry, do NOT prematurely cry 'needs-a-human'.** Track an UNPUSHED-COMMIT (ahead) count in your pulse; ahead>0 across >1 tick = a delivery-wall, flag it like a context-wall.
- **Never `git rebase` / `git pull --rebase`** — merge only (`pull.rebase=false`); rebase silently destroys work.
- **Nothing is done until committed with a hash — and not DELIVERED until PUSHED** — `git status` clean AND on origin (see the push-delivery law above); wer schreibt, der bleibt.
- **After a regen that wipes files** (design-*.md / *.puml collateral): `git restore --source=HEAD --worktree <paths>` to restore.

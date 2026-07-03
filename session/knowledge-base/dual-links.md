# Dual Links — GitHub + local, both on one line (Web4Articles standard)

*Authoritative source: `/var/dev/Workspaces/2cuGitHub/Web4Articles/recovery.analysis/pdca-format-requirements-mandatory.md` (§ DUAL LINK REQUIREMENTS). Purified by ARON 2026-07-03.*
*⚠️ CORRECTION: an earlier version of this article wrongly described dual links as up/down parent↔child traceability. That was WRONG — that is a DIFFERENT concept (traceability links). Dual links are the GitHub-plus-local reporting format below.*

## The one rule
**A DUAL LINK gives every artifact reference in BOTH forms — a working GitHub link AND the local path — on the SAME line.** So the reader (TRON) can navigate whether they're browsing GitHub or working locally.

## Format (exact — copy this)
```markdown
[GitHub](https://github.com/Cerulean-Circle-GmbH/Web4Articles/blob/<branch>/path/to/file) | [path/to/file](path/to/file)
```
- **Both links on the same line**, separated by ` | ` (space-pipe-space).
- **Local link text MUST be the actual relative path** (e.g. `[scrum.pmo/sprints/sprint-1/planning.md](...)`), not a friendly title.
- **The GitHub link MUST work** → **`git push` BEFORE you provide it.** NEVER give a GitHub link without pushing first (a dead link breaks trust).

## Where dual links are required
- **Chat / report responses:** always END with the current artifact's dual links. "Much in files, relevant links in chat" (TRON) — chat carries **links + key decisions only**; the detail lives in the file.
- **PDCA artifacts:** every referenced artifact is dual-linked.

## Procedure (never skip)
1. Write/commit the artifact. 2. `git push` to the branch. 3. **Verify the GitHub link actually opens.** 4. Report with `[GitHub](url) | [relative/path](relative/path)`.

## Not to be confused with
**Traceability links** (a separate concept): the `## Traceability` section's `up`/`down` bullets linking a task to its parent/children (bidirectional parent↔child). That is "traceability," NOT "dual links." Dual links = GitHub + local, per above.

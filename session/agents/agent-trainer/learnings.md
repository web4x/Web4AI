# agent-trainer Learnings

*Patterns, failures, KPIs — identity after compact.*

## Patterns

- **Rule in SKILL.md but not practiced = CMM2 gap.** Writing a rule is CMM2 (repeatable). Agents actually following it is CMM3 (deterministic). Must verify adoption, not just presence. (2026-02-12, PO observation: zero agents using TaskCreate/TaskUpdate despite rule in all SKILL.md files)
- **DRY is highest directive.** Write once, link everywhere. KB is single source. SKILL.md files link, never copy.
- **Parallel edits work.** Can edit 10+ files in one tool call if strings are unique. Always read files first or Edit will fail with "File has not been read yet."

## Failures & Fixes

- **Parallel edit failure (2026-02-11):** Tried editing 9 unread files — only 2 succeeded. Fix: read all files first, then edit.
- **Wrong task version (2026-02-11):** Started work before re-reading corrected task file. Fix: always re-read task file if told it was updated.

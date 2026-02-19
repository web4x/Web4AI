# agent-trainer Learnings

*Patterns, failures, KPIs — identity after compact.*

## Patterns

- **Rule in SKILL.md but not practiced = CMM2 gap.** Writing a rule is CMM2 (repeatable). Agents actually following it is CMM3 (deterministic). Must verify adoption, not just presence. (2026-02-12, PO observation: zero agents using TaskCreate/TaskUpdate despite rule in all SKILL.md files)
- **DRY is highest directive.** Write once, link everywhere. KB is single source. SKILL.md files link, never copy.
- **Parallel edits work.** Can edit 10+ files in one tool call if strings are unique. Always read files first or Edit will fail with "File has not been read yet."
- **Never suppress errors.** `2>/dev/null || echo` hides root causes. Just run the command and read the real error. KB: `session/knowledge-base/anti-patterns.md`
- **PO + Trainer can always create specialists.** Script-product-owner is a delegate template, not just a contract. One specialist per complex script. No permission needed to spawn more.

## Audit Technique
- **Bulk updates via Python**: For 78+ files, use python3 with glob + string replace. Much faster than manual Edit per file.
- **Verification after bulk update**: Always `grep -rl | wc -l` to verify all files were updated. Target = 81 (total SKILL.md count).
- **Proactive auditing while idle**: Check coverage of mandatory sections across all 81 SKILL.md. Gaps found: SM missing WODA (80/81), task-agent hardcoded pane, script-product-owner had binary thresholds.
- **Boot template improvements persist**: Changes to `.claude/hooks/pre-compress.sh` affect ALL future agent compacts.

## Key Numbers
- Total SKILL.md files: 81
- Mandatory sections: Base Skills, OOSH-Only, Knowledge Base, Compact Protocol, WODA+PDCA, CMM3/4 Split, CMM4 Velocity, Prefer Built-in Tools (8 sections)
- agent-overview.md is the master reference — SKILL.md must align with it

## Failures & Fixes

- **Parallel edit failure (2026-02-11):** Tried editing 9 unread files — only 2 succeeded. Fix: read all files first, then edit.
- **Wrong task version (2026-02-11):** Started work before re-reading corrected task file. Fix: always re-read task file if told it was updated.
- **SM WODA gap (2026-02-19):** SM SKILL.md was only file missing Decision Framework: WODA+PDCA section (80/81). Found via `comm -23` between all SKILL.md and those with the section. Fix: added section, verified 81/81.
- **Binary thresholds keep reappearing (2026-02-18 → 2026-02-19):** Even after bulk removal, found 2 more in SM + script-product-owner. Fix: targeted grep after bulk update. Must check for "At 80%", "At 90%", "80%+" patterns specifically.
